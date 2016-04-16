package com.inetec.ichange.console.client.util;


import com.inetec.common.exception.Ex;
import com.inetec.common.i18n.Key;
import com.inetec.common.io.MergeInputStream;

import java.io.*;
import java.util.Iterator;
import java.util.Properties;
import java.util.Set;

public class DataAttributes extends Properties {

    public static final String Str_ChangeType = "CHANGETYPE";

    public static final String Str_SessionId = "SESSIONID";


    public static final String Str_FileName = "FILENAME";

    public static final String Str_FileSize = "FILESIZE";

    public static final String Str_FileType = "FILETYPE";

    public static final String Str_ControlType = "CONTROLTYPE";

    public static final String Str_Compression = "COMPRESSION";

    public static final String Str_Status = "status";

    public static final String Str_StatusMsg = "statusmsg";

    public static final String Str_AppName = "appName";

    public static final String Str_Error_Message = "ErrorMessage";

    public static final String Str_Error_Code = "ErrorCode";

    private InputStream m_inputStream = null;
    private Object m_ob = null;


    public DataAttributes() {
    }


    public DataAttributes(Properties tfp) {
        super(tfp);
    }


    public String getValue(String key) {
        return super.getProperty(key);
    }


    public void putValue(String key, String value) {
        if (value == null) {
            remove(key);
        } else {
            super.put(key, value);
        }
    }


    public Status getStatus() {
        int stat = Integer.parseInt((String) get(Str_Status));
        String msg = (String) get(Str_StatusMsg);
        return Status.query(stat, new Key(msg));
    }


    public String getErrorMessage() {
        return getValue(Str_Error_Message);
    }


    public void setErrorMessage(String msg) {
        putValue(Str_Error_Message, msg);
    }


    public void setStatus(Status status) {
        put(Str_Status, status.getStatusCode() + "");
        put(Str_StatusMsg, status.getMessage());
    }


    public void setObject(Object obj) {
        m_ob = obj;
    }


    public Object getObject() {
        return m_ob;
    }


    public void setResultData(InputStream is) {
        if (is != null)
            m_inputStream = is;
    }


    public void setResultData(byte[] data) {
        if (data != null)
            m_inputStream = new ByteArrayInputStream(data);
    }


    public InputStream getResultData() throws Ex {
        return m_inputStream;
    }

    public synchronized void load(InputStream in) throws IOException {
        if (in == null)
            return;
        HeaderProcess headProcess = new HeaderProcess();
        clear();
        try {
            Properties temp = headProcess.parseHeader(in);
            Set keySet = temp.keySet();
            Iterator it = keySet.iterator();
            while (it.hasNext()) {
                String name = (String) it.next();
                String value = (String) temp.get(name);
                putValue(name, value);
            }
        } catch (Ex ex) {
            throw new IOException(ex.getMessage());
        }
        m_inputStream = new ByteArrayInputStream(readInputStream(in));
    }

    public synchronized void store(OutputStream os, String s) throws IOException {
        if (os == null)
            return;
        DataAttributes fp2 = new DataAttributes();
        Set keySet = keySet();
        Iterator it = keySet.iterator();
        while (it.hasNext()) {
            String name = (String) it.next();
            String value = (String) get(name);
            fp2.setProperty(name, value);
        }
        HeaderProcess headProcess = new HeaderProcess(fp2);
        MergeInputStream in = new MergeInputStream();
        in.addInputStream(headProcess.getInputStream());
        if (s != null)
            os.write(s.getBytes());
        if (m_inputStream != null) {
            in.addInputStream(m_inputStream);
        }
        os.write(readInputStream(in));
        in.close();
        os.close();
    }

    public byte[] getContent() throws IOException {
        DataAttributes fp2 = new DataAttributes();
        Set keySet = keySet();
        Iterator it = keySet.iterator();
        while (it.hasNext()) {
            String name = (String) it.next();
            String value = (String) get(name);
            fp2.setProperty(name, value);
        }
        HeaderProcess headProcess = new HeaderProcess(fp2);
        MergeInputStream in = new MergeInputStream();
        in.addInputStream(headProcess.getInputStream());
        if (m_inputStream != null) {
            in.addInputStream(m_inputStream);
        }
        return readInputStream(in);
    }


    public static byte[] readInputStream(InputStream isReceive) throws IOException {
        ByteArrayOutputStream swapStream = new ByteArrayOutputStream();
        byte[] buff = new byte[500];   //buff????????????????????
        int rc = 0;
        while ((rc = isReceive.read(buff)) > 0) {
            swapStream.write(buff, 0, rc);
        }
        byte[] in_b = swapStream.toByteArray(); //in_b??????????
        return in_b;
    }
}
