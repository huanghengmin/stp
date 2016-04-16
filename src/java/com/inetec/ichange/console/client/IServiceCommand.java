package com.inetec.ichange.console.client;

import com.inetec.common.exception.Ex;
import com.inetec.ichange.console.client.util.ChannelInfo;
import com.inetec.ichange.console.client.util.Command;
import com.inetec.ichange.console.client.util.DataAttributes;

/**
 * Created by IntelliJ IDEA.
 * User: wxh
 * Date: 2009-8-30
 * Time: 23:28:40
 * To change this template use File | Settings | File Templates.
 */
public interface IServiceCommand {
    public void config(ChannelInfo channelInfo);

    public boolean configured();

    public DataAttributes execCommand(Command command, DataAttributes attributes) throws Ex;

}
