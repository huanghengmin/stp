package com.inetec.ichange.console.client;

import com.inetec.common.exception.E;
import com.inetec.common.exception.Ex;
import com.inetec.common.i18n.Message;
import com.inetec.ichange.console.client.util.*;

import java.io.IOException;
import java.io.InputStream;
import java.io.ObjectInputStream;

/**
 * Created by IntelliJ IDEA.
 * User: wxh
 * Date: 2009-8-30
 * Time: 23:29:01
 * To change this template use File | Settings | File Templates.
 */
public class IServiceCommandImpl implements IServiceCommand {
    public void config(ChannelInfo channelInfo) {
        m_command = new CommandDisposer(channelInfo);
        m_config = true;
    }

    public boolean configured() {
        return m_config;  //To change body of implemented methods use File | Settings | File Templates.
    }

    public DataAttributes execCommand(Command command, DataAttributes attributes) throws Ex {
        if (command.isDbCommand(command)) {
            JdbcUtil jdbc = (JdbcUtil) attributes.getObject();

            try {
                attributes.setResultData(jdbc.toStream());
            } catch (Ex e) {
                throw new Ex().set(E.E_IOException, e, new Message("JDBC 取值错误!"));
            }

        }
        InputStream stream = attributes.getResultData();
        DataAttributes data = attributes;
        data.putValue(ServiceUtil.HDR_ServiceCommand, command.toStringCommand());
        data.putValue(ServiceUtil.STR_CommandBody, ServiceUtil.STR_CommandBoday_Private);
        if (stream != null) {
            try {
                data = m_command.disposeDataPost(stream, data);
            } catch (IOException e) {
                throw new Ex().set(E.E_IOException, new Message("流解析错误!"));
            }
        } else {
            data = m_command.disposeControl(command.toStringCommand(), data);

        }
        if (Command.C_DBMetaData.equals(command)) {
            if (data.getStatus().isSuccess()) {
                try {
                    ObjectInputStream object = new ObjectInputStream(data.getResultData());
                    data.setObject(object.readObject());
                } catch (IOException e) {

                } catch (ClassNotFoundException e) {
                    throw new Ex().set(E.E_InvalidObject, new Message("没有传回正确的对象"));
                }
            }
        }
        return data;
    }

    private CommandDisposer m_command = null;
    private boolean m_config = false;
}
