package com.inetec.ichange.console.client.util;

import com.inetec.common.config.nodes.Channel;


/**
 * Created by IntelliJ IDEA.
 * User: wxh
 * Date: 2009-6-18
 * Time: 16:18:56
 * To change this template use File | Settings | File Templates.
 */
public class ChannelInfo {
    private String m_url = null;
    private String m_sourcePath = null;
    private String m_targetPath = null;
    private boolean m_bPrivate = false;
    private String m_type = null;
    private static String Str_ChannelType_Http = "http";
    private static String Str_ChannelType_Https = "https";
    private static String Str_ChannelType_File = "file";
    private int m_port = 9260;
    private int m_inteval;
    private String m_ip = null;
    private String m_password = null;
    private String m_privateKeyPath = null;
    private static String Str_Localhost = "127.0.0.1";


    public String getPassword() {
        return m_password;
    }

    public void setPassword(String m_password) {
        this.m_password = m_password;
    }

    public String getPrivateKeyPath() {
        return m_privateKeyPath;
    }

    public void setPrivateKeyPath(String m_privateKeyPath) {
        this.m_privateKeyPath = m_privateKeyPath;
    }

    public void set(Channel channel, String privateKeypath, String password) {
        m_sourcePath = channel.getSourcePath();
        m_targetPath = channel.getTargetPath();
        m_type = channel.getType();
        m_bPrivate = channel.isPrivated();
        if (channel.getPort() == null || channel.getPort() == "") {
            m_url = initUrl(Str_Localhost, m_port + "");
        } else {
            m_url = initUrl(Str_Localhost, channel.getPort());
            m_port = new Integer(channel.getPort()).intValue();
        }

        m_ip = channel.getIpAddress();
        m_inteval = channel.getIntelval() * 1000;
        m_password = password;
        m_privateKeyPath = privateKeypath;
    }

    private String initUrl(String ip, String port) {
        String resultUrl = "https://" + ip + ":" + port + "/service/ServiceServer";
        if (isHttp()) {
            resultUrl = "http://" + ip + ":" + port + "/service/ServiceServer";
        }
        return resultUrl;
    }

    public String getUrl() {
        return m_url;
    }

    public String getSourcePath() {
        return m_sourcePath;
    }

    public String getTargetPath() {
        return m_targetPath;
    }

    public boolean isPrivate() {
        return m_bPrivate;
    }

    public boolean isHttp() {
        m_type = m_type.toLowerCase();
        return m_type.equalsIgnoreCase(Str_ChannelType_Http);
    }

    public boolean isHttps() {
        m_type = m_type.toLowerCase();
        return m_type.equalsIgnoreCase(Str_ChannelType_Https);
    }

    public boolean isFile() {
        m_type = m_type.toLowerCase();
        return m_type.equalsIgnoreCase(Str_ChannelType_File);
    }

    public int getPort() {
        return m_port;
    }

    public String getIp() {
        return m_ip;
    }

    public int getInterval() {
        return m_inteval;
    }

    public void setPlatFormUrl() {
        m_url = "https://127.0.0.1:" + m_port + "/platform/ChangeServer";
        if (isHttp()) {
            m_url = "http://127.0.0.1:" + m_port + "/platform/ChangeServer";
        }
        m_ip = "127.0.0.1";

    }

}
