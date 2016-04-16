package com.hzih.stp.web.action.system;

import com.hzih.stp.service.LogService;
import com.hzih.stp.service.XmlOperatorService;
import com.hzih.stp.utils.*;
import com.hzih.stp.web.SessionUtils;
import com.hzih.stp.web.action.ActionBase;
import com.inetec.common.config.stp.nodes.Channel;
import com.inetec.common.exception.Ex;
import com.inetec.common.util.OSInfo;
import com.inetec.common.util.Proc;
import com.opensymphony.xwork2.ActionSupport;
import org.apache.log4j.Logger;
import org.apache.struts2.ServletActionContext;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: 钱晓盼
 * Date: 12-8-9
 * Time: 下午12:08
 * To change this template use File | Settings | File Templates.
 */
public class InitAction extends ActionSupport {
    private static final Logger logger = Logger.getLogger(InitAction.class);
    private XmlOperatorService xmlOperatorService;
    private LogService logService;
//    private Channel channel;
//    private String privated;

    public String select() throws IOException{
        HttpServletRequest request = ServletActionContext.getRequest();
		HttpServletResponse response = ServletActionContext.getResponse();
		ActionBase base = new ActionBase();
		String result =	base.actionBegin(request);
		String json = null;
        try {
            json = xmlOperatorService.readChannel();
            logService.newLog("INFO",  SessionUtils.getAccount(request).getUserName(), "平台初始化","用户获取平台通道信息成功");
        } catch (Exception e) {
            logger.error("平台初始化", e);
            logService.newLog("ERROE", SessionUtils.getAccount(request).getUserName(), "平台初始化","用户获取平台通道信息失败");
            json = "{success:true,total:0,rows:[]}";
        }
		base.actionEnd(response, json ,result);
        return null;
    }

    public String send() throws IOException {
        HttpServletRequest request = ServletActionContext.getRequest();
		HttpServletResponse response = ServletActionContext.getResponse();
		ActionBase base = new ActionBase();
		String result =	base.actionBegin(request);
        String msg = null;
        try{
            String channel = request.getParameter("channel");
            String[][] params = new String[][] {
                    { "SERVICEREQUESTTYPE", "SERVICECONTROLPOST" },
                    { "Command", "initsend" },
                    { "channel", channel }
            };
            ServiceResponse serviceResponse = ServiceUtil.callService(params);
            if (serviceResponse.getCode()==200) {
                logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"平台初始化","发送测试消息成功!");
                msg = "<font color=\"green\">测试发送成功,到内网平台<br>初始化中查看测试结果</font>";
            } else {
                logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(),"平台初始化","发送测试消息失败!");
                msg = "<font color=\"red\">测试失败:"+serviceResponse.getCode()+"</font>";
            }
        } catch (Exception e){
            logger.error("发送测试消息错误",e);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(),"平台初始化","发送测试消息失败!");
            msg = "<font color=\"red\">测试失败!</font>";
        }
        String json = "{success:true,msg:'"+msg+"'}";
        base.actionEnd(response, json ,result);
        return null;
    }

    public String sendMonitor() throws IOException {
        HttpServletRequest request = ServletActionContext.getRequest();
		HttpServletResponse response = ServletActionContext.getResponse();
		ActionBase base = new ActionBase();
		String result =	base.actionBegin(request);
        String msg = null;
        try{
            String channel = request.getParameter("channel");
            String[][] params = new String[][] {
                    { "SERVICEREQUESTTYPE", "SERVICECONTROLPOST" },
                    { "Command", "initsend" },
                    { "channel", channel }
            };
            ServiceResponse serviceResponse = ServiceUtil.callService(params);
            Thread.sleep(1000*3);
            serviceResponse = ServiceUtil.callService(params);
            if (serviceResponse.getCode()==200) {
                logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"设备运行监控","发送测试消息成功!");
                msg = "<font color=\"green\">测试发送成功,到内网平台<br>设备运行监控中查看测试结果</font>";
            } else {
                logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(),"设备运行监控","发送测试消息失败!");
                msg = "<font color=\"red\">测试失败:"+serviceResponse.getCode()+"</font>";
            }
        } catch (Exception e){
            logger.error("设备运行监控,发送测试消息错误",e);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(),"设备运行监控","发送测试消息失败!");
            msg = "<font color=\"red\">测试失败!</font>";
        }
        String json = "{success:true,msg:'"+msg+"'}";
        base.actionEnd(response, json ,result);
        return null;
    }

    public String update() throws IOException{
        HttpServletRequest request = ServletActionContext.getRequest();
		HttpServletResponse response = ServletActionContext.getResponse();
		ActionBase base = new ActionBase();
		String result =	base.actionBegin(request);
		String msg = null;
        try {
            String privated = request.getParameter("privated");
            String mac1 = request.getParameter("mac1");
            String mac2 = request.getParameter("mac2");
            String count = request.getParameter("count");


            msg = xmlOperatorService.updateChannelCount(Boolean.valueOf(privated),count);

//            msg = xmlOperatorService.updateChannel(Boolean.valueOf(privated),channels);
//            try {
//                String[][] params = new String[][] {
//                        { "SERVICEREQUESTTYPE", "SERVICECONTROLPOST" },
//                        { "Command", "restartservice" },
//                        { "restarttype", "initservice" }
//                };
//                ServiceResponse serviceResponse = ServiceUtil.callService(params);
//                if(serviceResponse.getCode()==200) {
//                    msg += ",重启服务成功,</br>点击[确定]返回列表!";
//                } else {
//                    msg += ",重启服务失败,</br>点击[确定]返回列表!";
//                }
//            } catch (Exception ex) {
//                msg = "新增成功,重启设备监控服务失败,</br>点击[确定]返回列表!";
//                logger.error("重启设备监控服务失败", ex);
//            }
            List<Channel> channels = xmlOperatorService.readChannels();
            boolean isOk = updateArp(channels,mac1,mac2);
            if(isOk){
                msg += "MAC地址绑定成功";
            } else {
                msg += "MAC地址绑定失败";
            }
            isOk = saveSecurityConfig(channels);
            if(isOk){
                msg += ",安全配置设置成功!";
            } else {
                msg += ",安全配置设置失败!";
            }
            logService.newLog("INFO",  SessionUtils.getAccount(request).getUserName(), "平台初始化","用户修改平台通道信息成功");
        } catch (Exception e) {
            logger.error("平台初始化", e);
            logService.newLog("ERROE", SessionUtils.getAccount(request).getUserName(), "平台初始化","用户修改平台通道信息失败");
            msg = "保存失败";
        }
        String json = "{success:true,msg:'"+msg+"'}";
		base.actionEnd(response, json ,result);
        return null;
    }

    private boolean updateArp(List<Channel> channels, String mac1, String mac2) throws Exception {
        OSInfo osInfo = OSInfo.getOSInfo();
        String fileFullName = "/etc/ethers";
        if(osInfo.isLinux()){
            FileUtil.createFile(fileFullName);
            Proc proc = new Proc();
            List<String> arps = new ArrayList<>();
            for (Channel channel : channels){
                String tIp = channel.gettIp();
                if("1".equals(channel.getChannelValue())&&StringUtils.isNotBlank(mac1)){
                    String arp = tIp + " " + mac1;
//                    String command = "echo '"+arp+"'> /etc/ethers";
//                    proc.exec(command);
//                    arps.add(arp);
                    FileUtil.write(fileFullName, arp);
                }
                if("2".equals(channel.getChannelValue())&&StringUtils.isNotBlank(mac2)){
                    String arp = tIp + " " + mac1;
//                    String command = "echo '"+arp+"'>> /etc/ethers";
//                    proc.exec(command);
                    arps.add(arp);
                }
            }

            FileUtil.writeOnline(fileFullName,arps);
            String command = "arp -f";
            proc.exec(command);
        }
        return true;
    }

    private boolean saveSecurityConfig(List<Channel> channels) {
        try {
            Configuration config = new Configuration(StringContext.SECURITY_CONFIG);
            List<String> list = config.getAllowIPs();
            String ip = "";
            for (Channel channel : channels){
                String tIp = channel.gettIp();
                boolean isExist = check(tIp,list);
                if(!isExist){
                    ip += "|"+tIp;
                }
            }
            config.editAllowIp( ip);
            return true;
        } catch (Ex ex) {
            logger.error("保存源端和目标端通道IP到安全配置失败",ex);
        }
        return false;
    }

    private boolean check(String ip, List<String> list) {
        for (String str : list){
            if(str.equals(ip)){
                return true;
            }
        }
        return false;
    }

    public void setXmlOperatorService(XmlOperatorService xmlOperatorService) {
        this.xmlOperatorService = xmlOperatorService;
    }

    public void setLogService(LogService logService) {
        this.logService = logService;
    }

}
