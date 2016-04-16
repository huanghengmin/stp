package com.inetec.ichange.console.client.util;

import com.inetec.common.exception.E;
import com.inetec.common.exception.Ex;
import com.inetec.common.http.pooling.HttpClientImp;
import com.inetec.common.http.pooling.HttpFactory;
import com.inetec.common.http.pooling.HttpPool;
import com.inetec.common.http.pooling.HttpcConfig;
import com.inetec.common.i18n.Message;
import org.apache.log4j.Category;

import java.io.*;
import java.util.zip.GZIPOutputStream;


public class CommandDisposer {

    public static final int N_RETRIES = 1;
    private ChannelInfo m_channelInfo = null;
    private boolean m_isPlatform = false;

    /**
     * ************************************************************************************
     * CommandDisposer
     * args:  none
     * <p/>
     * returns:  nothing
     * <p/>
     * This function constructs a new FileDisposer.
     * *************************************************************************************
     */
    public CommandDisposer(ChannelInfo channleInfo) {
        m_cat = Category.getInstance(CommandDisposer.class);
        m_channelInfo = channleInfo;
        m_isPlatform = false;
        initHttpPool();
    }

    /**
     * ************************************************************************************
     * disposeFile
     * args:  istr - the input stream of the file to dispose
     * props - the properties of the file - nodepath, etc.
     * url - the destination url of the data
     * <p/>
     * returns:  nothing
     * <p/>
     * This function first determines if this machine is the final destination and
     * then writes the file if it is, or sends it if it isn't.
     * *************************************************************************************
     */
    public DataAttributes disposeDataPost(String filename, DataAttributes props) throws Ex {
        DataAttributes result = new DataAttributes();
        try {
            File file = new File(filename);
            FileInputStream is = new FileInputStream(filename);

            long filesize = file.length();
            props.putValue(DataAttributes.Str_FileSize, "" + filesize);

            result = disposeDataPost(is, props);
        } catch (IOException Ex) {
            m_cat.error("An IOException was caught while opening the file '" + filename + "'.", Ex);
            throw new XChange().set(EChange.E_CF_Faild, new Message("An IOException is caught while opening the file {0}.", filename));
        }
        return result;
    }

    public DataAttributes disposeDataPost(InputStream is, DataAttributes props) throws IOException, Ex {


        props = sendData(is, props);
        return props;
    }

    /**
     * ************************************************************************************
     * sendData
     * args:  istr - the input stream of the file to dispose
     * props - the properties of the file - nodepath, etc.
     * url - the destination url of the data
     * isReturn -the boolean of return value
     * <p/>
     * returns:  nothing
     * <p/>
     * This function sends the data in istr and props to the destination url.
     * If USE_SSL was true, the connection is made securely.
     * *************************************************************************************
     */
    private DataAttributes sendData(InputStream is, DataAttributes props) throws Ex {
        File fileCompressed = null;
        DataAttributes stream = null;
        String dataSize = null;
        HttpClientImp http = null;
        try {
            http = getConnection();
        } catch (Ex ex) {
            throw new XChange().set(E.E_Unknown, ex, new Message("Create connection error!"));
        }
        try {
            http.addRequestHeader("Content-Type", "application/Ex-www-form-urlencoded");
            http.addRequestHeader("Connection", "Keep-Alive");
            if (m_isPlatform) {
                http.addRequestHeader(ServiceUtil.HDR_ChangeRequestType, ServiceUtil.STR_REQTP_ChangeControlPost);
                String command = props.getValue(ServiceUtil.HDR_ServiceCommand);
                if (command == null || command == "") {
                    throw new Ex().set(E.E_Unknown, new Message("Command is null."));
                }
                http.addRequestHeader(ServiceUtil.HDR_ChangeControlType, command);
            } else {
                http.addRequestHeader(ServiceUtil.HDR_ServiceRequestType, ServiceUtil.STR_REQTP_ServiceDataPost);
                String command = props.getValue(ServiceUtil.HDR_ServiceCommand);
                if (command == null || command == "") {
                    throw new Ex().set(E.E_Unknown, new Message("Command is null."));
                }
                http.addRequestHeader(ServiceUtil.HDR_ServiceDataType, command);
                String commandBody = props.getValue(ServiceUtil.STR_CommandBody);
                if (commandBody == null || commandBody == "") {
                    throw new Ex().set(E.E_InvalidArgument, new Message("Command Body is null."));
                }
                http.addRequestHeader(ServiceUtil.STR_CommandBody, commandBody);

            }
            stream = createStream(is);

            if (stream != null) {
                try {
                    is = stream.getResultData();
                } catch (com.inetec.common.exception.Ex Ex) {
                    m_cat.error(Ex);
                    throw new XChange().set(E.E_OperationFailed, new Message("Failed to read Data Stream:{0} ", Ex.getMessage()));
                }
                dataSize = stream.getValue(DataAttributes.Str_FileSize);
            }

            if (dataSize == null) {
                dataSize = Long.toString(fileCompressed.length());
                http.addRequestHeader("Content-Length", dataSize);
            } else {
                http.addRequestHeader("Content-Length", dataSize);
            }

            m_cat.debug("HTTP connection have got!");
            if (fileCompressed != null) {
                try {
                    is = new FileInputStream(fileCompressed);
                } catch (FileNotFoundException e) {
                    m_cat.error("Data File read faild for file :" + fileCompressed.getAbsolutePath());
                    throw new XChange().set(E.E_FileNotFound, new Message("Data File read faild for file:{0}", fileCompressed.getAbsolutePath()));
                }
            }

            // First, the data input stream
            BufferedInputStream in = new BufferedInputStream(is);
            // Then, the data output stream
            //OutputStream out= new BufferedOutputStream(httpOutput);

            m_cat.debug("Begin to Sending file data.");

            // Connection should happen implicitly, but we'll double check...

            // Determine the number of bytes available for read, without blocking.  In any event, don't
            // read more than than 10MB, because we don't want to waste memory.
            // If available is 0, set to 1 and make sure we're at the end of the stream.

            try {
                http.requestBody(in);
                http.sendRequst();
                in.close();
                m_cat.debug("All values have sent!");
            } catch (IOException Ex) {
                m_cat.error("Socket IOException :" + Ex.getMessage());
            } finally {
                if (fileCompressed != null)
                    fileCompressed.delete();
            }
            int result = http.responseCode();

            m_cat.debug("http.getResponseCode():  " + result);
            // Check that the responseCode is ok, then add to the successful file list.
            if (result == 200) {
                try {
                    props.clear();
                    props.load(http.responseBodyAsStream());
                } catch (IOException Ex) {
                    //http.Disconnect();
                    http.close();
                    m_cat.error("http.recv() error:  " + Ex);
                    throw new com.inetec.common.exception.Ex().set(EChange.E_UNKNOWN, new Message("Failed to send file:{0} ", Ex.getMessage()));
                }
                m_cat.debug("Command sent successfully.");
            } else {
                m_cat.debug("Response code from HTTP Connection indicates an error.");
                throw new XChange().set(EChange.E_UNKNOWN, new Message("HTTP Response Code indicates error: ", result));
            }
        } finally {
            returnConnection(http);
        }

        return props;
    }


    protected DataAttributes createCompressedStream(InputStream is) throws Ex {
        try {
            //File fileTemp= File.createTempFile("VtDC", ".gz");
            ByteArrayOutputStream os = new ByteArrayOutputStream();
            //FileOutputStream gzip= new FileOutputStream(fileTemp);
            GZIPOutputStream gzip = new GZIPOutputStream(os);

            final int TenMB = 10485760;
            int bytesAvailable = is.available();
            if (bytesAvailable > TenMB) {
                bytesAvailable = TenMB;
            }
            if (bytesAvailable == 0) {
                bytesAvailable = 1;
            }
            byte[] tempBuf = new byte[TenMB];
            int bytesRead = -1;

            // Now, just read a chunk at a time and send over the wire.
            bytesRead = is.read(tempBuf);
            while (bytesRead != -1) {           // not end of file
                gzip.write(tempBuf, 0, bytesRead);
                bytesAvailable = is.available();
                if (bytesAvailable > TenMB) {
                    bytesAvailable = TenMB;
                }
                if (bytesAvailable == 0) {
                    bytesAvailable = 1;
                }
                bytesRead = is.read(tempBuf);
            }

            gzip.finish();
            tempBuf = null;
            DataAttributes result = new DataAttributes();
            result.setResultData(os.toByteArray());
            result.putValue(DataAttributes.Str_FileSize, String.valueOf(os.toByteArray().length));
            gzip.close();
            os.close();
            return result;
        } catch (IOException ex) {
            m_cat.error("IOException caught while creating compressed stream.", ex);
            throw new XChange().set(E.E_OperationFailed, ex, new Message("IOException caught while creating compressed stream."));
        }
    }

    protected DataAttributes createStream(InputStream is) throws Ex {
        try {
            ByteArrayOutputStream gzip = new ByteArrayOutputStream();
            final int TenMB = 10485760;
            int bytesAvailable = is.available();
            if (bytesAvailable > TenMB) {
                bytesAvailable = TenMB;
            }
            if (bytesAvailable == 0) {
                bytesAvailable = 1;
            }
            byte[] tempBuf = new byte[TenMB];
            int bytesRead = -1;

            // Now, just read a chunk at a time and send over the wire.
            bytesRead = is.read(tempBuf);
            while (bytesRead != -1) {           // not end of file
                gzip.write(tempBuf, 0, bytesRead);
                bytesAvailable = is.available();
                if (bytesAvailable > TenMB) {
                    bytesAvailable = TenMB;
                }
                if (bytesAvailable == 0) {
                    bytesAvailable = 1;
                }
                bytesRead = is.read(tempBuf);
            }
            gzip.flush();
            DataAttributes result = new DataAttributes();
            result.setResultData(gzip.toByteArray());
            result.putValue(DataAttributes.Str_FileSize, String.valueOf(gzip.toByteArray().length));
            gzip.close();
            return result;
        } catch (IOException Ex) {
            m_cat.error("IOException caught while creating  stream.", Ex);
            throw new XChange().set(E.E_OperationFailed, Ex, new Message("IOException caught while creating  stream."));
        }
    }

    /**
     * send control command.
     *
     * @param command
     * @param fp
     * @return
     * @throws XChange
     */

    public DataAttributes disposeControl(String command, DataAttributes fp) throws Ex {
        boolean done = false;
        for (int i = 0; i < N_RETRIES && !done; i++) {
            // Form the connection
            HttpClientImp http = null;
            try {
                try {
                    http = getConnection();
                } catch (com.inetec.common.exception.Ex Ex) {
                    throw new XChange().set(E.E_OperationFailed, Ex, new Message("Create connection error!!"));
                }

                // Set it's properties
                if (command == null || command == "") {
                    throw new Ex().set(E.E_Unknown, new Message("Command is null."));
                }
                http.addRequestHeader("Content-Type", "application/Ex-www-form-urlencoded");
                http.addRequestHeader("Connection", "Keep-Alive");
                if (m_isPlatform) {
                    http.addRequestHeader(ServiceUtil.HDR_ChangeRequestType, ServiceUtil.STR_REQTP_ChangeControlPost);
                    http.addRequestHeader(ServiceUtil.HDR_ChangeControlType, command);
                } else {
                    http.addRequestHeader(ServiceUtil.HDR_ServiceRequestType, ServiceUtil.STR_REQTP_ServiceControlPost);
                    http.addRequestHeader(ServiceUtil.HDR_ServiceDataType, command);
                    String commandBody = fp.getValue(ServiceUtil.STR_CommandBody);
                    if (commandBody == null || commandBody == "") {
                        throw new Ex().set(E.E_InvalidArgument, new Message("Command Body is null."));
                    }
                    http.addRequestHeader(ServiceUtil.STR_CommandBody, commandBody);
                }
                ByteArrayOutputStream os = new ByteArrayOutputStream();
                try {
                    fp.store(os, "");
                } catch (IOException e) {
                    //http.Disconnect();
                    throw (XChange) new XChange().set(E.E_IOException, null,
                            new Message("Failed to serialize properties."));
                }
                byte[] buffer = os.toByteArray();
                http.addRequestHeader("Content-Length", "" + buffer.length);
                try {

                    http.requestBody(buffer);
                    http.sendRequst();
                } catch (IOException e) {
                    //http.Disconnect();
                    // Log the error in sending the file.
                    Category cat = Category.getInstance("IChangeMain.network");
                    cat.error("Failed to send control command '" + command + "' with error: " + e.getMessage());
                    throw (XChange) new XChange().set(E.E_OperationFailed, e, new Message("Failed to send control request."));
                }


                int result = http.responseCode();
                if (result == 200) {
                    try {

                        fp.load(http.responseBodyAsStream());
                    } catch (IOException Ex) {
                        //http.Disconnect();
                        throw new XChange().set(E.E_OperationFailed, Ex, new Message("Failed to send file:{0} ", Ex.getMessage()));
                    }
                    done = true;
                    // We've sent all the data, so close the connection.
                } else {

                    m_cat.debug("Response code from HTTP Connection indicates an error.");
                    throw new XChange().set(E.E_OperationFailed, new Message("HTTP Response Code indicates error:{0} ", http.responseCode()));
                }

            } catch (Exception e) {
                done = false;
                fp.setStatus(Status.S_Faild);
                m_cat.error("Dispose Control is error:" + e);
            } finally {
                returnConnection(http);
            }
        }
        return fp;
    }

    private HttpClientImp getConnection() throws Ex {
        try {
            // return m_controlConnectionPool.getConnection();
            return (HttpClientImp) m_httpPool.borrowObject();
        } catch (Exception e) {
            throw new Ex().set(E.E_IOException, e);
        }

    }


    private void initHttpPool() {
        HttpcConfig m_httpConfig = new HttpcConfig();
        m_httpConfig.setPort(m_channelInfo.getPort());
        m_httpConfig.setUrl(m_channelInfo.getUrl());
        m_httpConfig.setPrivateKeyPassword(m_channelInfo.getPassword());
        m_httpConfig.setPrivateKey(m_channelInfo.getPrivateKeyPath());
        m_httpConfig.setEnableSSl(m_channelInfo.isHttps());
        HttpFactory factroy = new HttpFactory();
        factroy.setHttpConfig(m_httpConfig);
        m_httpPool = new HttpPool(factroy);
        //m_httpPool.setFactory(factroy);
    }


    public void returnConnection(HttpClientImp conn) throws Ex {
        try {
            m_httpPool.returnObject(conn);
        } catch (Exception e) {
            throw new Ex().set(E.E_IOException, e);
        }
    }

    /**
     * ************************************************************************************
     * Member variables.
     * *************************************************************************************
     */
    private HttpPool m_httpPool = null;
    protected boolean m_bConfigured = false;
    private Category m_cat = null;  // for logging
}
