package com.inetec.ichange.console.client.util;

import com.inetec.common.exception.E;
import com.inetec.common.exception.Ex;
import com.inetec.common.i18n.Message;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Iterator;
import java.util.Properties;
import java.util.Set;


public class HeaderProcess {

    Properties properties;

    public HeaderProcess() {
        properties = new Properties();
    }


    public HeaderProcess(Properties fp) {
        properties = fp;
    }


    public InputStream getInputStream() {
        StringBuffer result = new StringBuffer();
        Set keySet = properties.keySet();
        Iterator it = keySet.iterator();
        while (it.hasNext()) {
            String name = (String) it.next();
            String value = (String) properties.get(name);
            result.append(name);
            result.append('=');
            result.append(value);
            result.append('\n');
        }
        result.append('\n');
        byte[] bs = result.toString().getBytes();
        return new ByteArrayInputStream(bs);
    }


    public Properties parseHeader(InputStream is) throws Ex {
        byte[] bs = new byte[8092];
        int index = 0;
        String name = "";
        String value = "";
        try {
            byte b = (byte) is.read();
            byte last = 0;
            while (b != -1) {
                if (b == '=') {
                    name = new String(bs, 0, index);
                    bs = new byte[8092];
                    index = 0;
                } else if (b == '\n') {
                    if (last == '\n') {
                        break;
                    }
                    value = new String(bs, 0, index);
                    properties.setProperty(name, value);
                    bs = new byte[8092];
                    index = 0;
                } else {
                    bs[index++] = b;
                }
                last = b;
                b = (byte) is.read();
            }
        } catch (IOException io) {
            throw new Ex().set(E.E_IOException, io);
        }
        return properties;
    }

    public int getLength(String header) throws Ex {
        int result = 0;
        try {
            ByteArrayOutputStream os = new ByteArrayOutputStream();
            properties.store(os, header);
            result = os.size();
        } catch (IOException e) {
            throw new Ex().set(E.E_IOException, e, new Message("Get Length error."));
        }
        return result;
    }

}

