package com.inetec.ichange.console.client;

import com.inetec.ichange.console.client.util.ChannelInfo;

/**
 * Created by IntelliJ IDEA.
 * User: wxh
 * Date: 2009-8-31
 * Time: 22:23:19
 * To change this template use File | Settings | File Templates.
 */
public class ServiceCommandFactory {

    public static IServiceCommand createServiceCommand(ChannelInfo channelInfo) {
        IServiceCommand result = new IServiceCommandImpl();
        result.config(channelInfo);
        return result;
    }
}
