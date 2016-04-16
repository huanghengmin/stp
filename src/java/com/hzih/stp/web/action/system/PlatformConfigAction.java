package com.hzih.stp.web.action.system;

import com.hzih.stp.entity.ChannelIChangeUtils;
import com.hzih.stp.service.LogService;
import com.hzih.stp.service.XmlOperatorService;
import com.hzih.stp.utils.StringUtils;
import com.hzih.stp.web.SessionUtils;
import com.hzih.stp.web.action.ActionBase;
import com.opensymphony.xwork2.ActionSupport;
import org.apache.log4j.Logger;
import org.apache.struts2.ServletActionContext;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.regex.Pattern;

/**
 * Created with IntelliJ IDEA.
 * User: 钱晓盼
 * Date: 12-8-25
 * Time: 下午4:36
 * To change this template use File | Settings | File Templates.
 * 平台配置管理
 */
public class PlatformConfigAction extends ActionSupport {
    private static final Logger logger = Logger.getLogger(PlatformConfigAction.class);
    private LogService logService;
    private XmlOperatorService xmlOperatorService;
    private ChannelIChangeUtils channelIChangeUtils;
    private int start;
    private int limit;
    private String[] snmpArray;
    private String[] sysArray;

    public String selectChangeUtils () throws IOException {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result =	actionBase.actionBegin(request);
		String json = null;
        try {
            json = xmlOperatorService.selectChangeUtils();
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(), "平台配置","用户读取平台信息成功 ");
        } catch (Exception e) {
            logger.error("平台配置", e);
            logService.newLog("ERROE", SessionUtils.getAccount(request).getUserName(), "平台配置","用户读取平台信息失败 ");
            json = "{success:true,total:0,rows[]}";
        }
        actionBase.actionEnd(response,json,result);
        return null;
    }

    public String updateChangeUtils () throws IOException {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result =	actionBase.actionBegin(request);
		String msg = null;
        try {
            xmlOperatorService.updateChangeUtils(channelIChangeUtils);
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(), "平台配置","用户保存平台信息成功 ");
            msg = "保存成功,点击[确定]返回页面!";
        } catch (Exception e) {
            logger.error("平台配置", e);
            logService.newLog("ERROE", SessionUtils.getAccount(request).getUserName(), "平台配置","用户保存平台信息失败 ");
            msg = "保存失败";
        }
        String json = "{success:true,msg:'"+msg+"'}";
        actionBase.actionEnd(response,json,result);
        return null;
    }

    public String saveRestartTime () throws IOException {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result =	actionBase.actionBegin(request);
		String msg = null;
        try {
            String restart = request.getParameter("restart");
            String monthTime = request.getParameter("mTime");
            String weekTime = request.getParameter("wTime");
            String dayTime = request.getParameter("dTime");
            String hourTime = request.getParameter("hTime");
            String time = null;
            if(restart.equalsIgnoreCase("m")){
                time = restart+":"+monthTime+":"+dayTime;
            } else if(restart.equalsIgnoreCase("w")){
                time = restart+":"+weekTime+":"+dayTime;
            } else if(restart.equalsIgnoreCase("d")){
                time = restart+":"+dayTime;
            } else if(restart.equalsIgnoreCase("h")){
                time = restart+":"+hourTime;
            } else {
                time = "";
            }
            xmlOperatorService.saveRestartTime(time);
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(), "平台配置","用户设置重启策略成功 ");
            msg = "保存成功,点击[确定]返回页面!";
        } catch (Exception e) {
            logger.error("平台配置", e);
            logService.newLog("ERROE", SessionUtils.getAccount(request).getUserName(), "平台配置","用户设置重启策略失败 ");
            msg = "保存失败";
        }
        String json = "{success:true,msg:'"+msg+"'}";
        actionBase.actionEnd(response,json,result);
        return null;
    }

    public String readSNMPIp () throws IOException {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result =	actionBase.actionBegin(request);
		String json = null;
        try {
            json = xmlOperatorService.readSNMP(start, limit);
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(), "平台配置","用户读取SNMP信息成功 ");
        } catch (Exception e) {
            logger.error("平台配置", e);
            logService.newLog("ERROE", SessionUtils.getAccount(request).getUserName(), "平台配置","用户读取SNMP失败 ");
            json = "{success:true,total:0,rows[]}";
        }
        actionBase.actionEnd(response,json,result);
        return null;
    }

    public String readSysLogIp () throws IOException {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result =	actionBase.actionBegin(request);
		String json = null;
        try {
            json = xmlOperatorService.readSysLog(start, limit);
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(), "平台配置","用户读取SysLog信息成功 ");
        } catch (Exception e) {
            logger.error("平台配置", e);
            logService.newLog("ERROE", SessionUtils.getAccount(request).getUserName(), "平台配置","用户读取SysLog失败 ");
            json = "{success:true,total:0,rows[]}";
        }
        actionBase.actionEnd(response,json,result);
        return null;
    }

    public String checkSNMPClient () throws IOException {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result =	actionBase.actionBegin(request);
        String msg = null;
        try {
            String snmpclient = request.getParameter("snmpclient");
            Pattern pattern = Pattern.compile("((((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\\:)(6553[0-6]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{3}|[1-9][0-9]{2}|[1-9][0-9]{1}|[1-9]))");
            if(pattern.matcher(snmpclient).matches()){
                msg = xmlOperatorService.checkSNMPClient(snmpclient);
                logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(), "平台配置","用户校验SNMP的IP是否已经存在成功 ");
            }else{
                msg = "输入格式不对,请重新输入!";
                logService.newLog("WARN", SessionUtils.getAccount(request).getUserName(), "平台配置","用户校验SNMP的IP,输入格式不对 ");
            }
        } catch (Exception e) {
            logger.error("平台配置", e);
            logService.newLog("ERROE", SessionUtils.getAccount(request).getUserName(), "平台配置","用户校验SNMP的IP是否已经存在失败 ");
            msg = "校验失败";
        }
        String json = "{success:true,msg:'"+msg+"'}";
        actionBase.actionEnd(response,json,result);
        return null;
    }

    public String checkSysLogClient () throws IOException {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result =	actionBase.actionBegin(request);
        String msg = null;
        try {
            String syslogclient = request.getParameter("syslogclient");
            Pattern pattern = Pattern.compile("((((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\\:)(6553[0-6]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{3}|[1-9][0-9]{2}|[1-9][0-9]{1}|[1-9]))");
            if(pattern.matcher(syslogclient).matches()){
                msg = xmlOperatorService.checkSysLogClient(syslogclient);
                logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(), "平台配置","用户校验SysLog的IP是否已经存在成功 ");
            }else{
                msg = "输入格式不对,请重新输入!";
                logService.newLog("WARN", SessionUtils.getAccount(request).getUserName(), "平台配置","用户校验SysLog的IP,输入格式不对 ");
            }
        } catch (Exception e) {
            logger.error("平台配置", e);
            logService.newLog("ERROE", SessionUtils.getAccount(request).getUserName(), "平台配置","用户校验SysLog的IP是否已经存在失败 ");
            msg = "校验失败";
        }
        String json = "{success:true,msg:'"+msg+"'}";
        actionBase.actionEnd(response,json,result);
        return null;
    }


    public String saveSNMP () throws IOException {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result =	actionBase.actionBegin(request);
        String msg = null;
        try {
            String[] snmps = xmlOperatorService.getSnmpArray(snmpArray);
            for(int i = 0; i<snmps.length;i++){
                xmlOperatorService.saveSNMPClient(snmps[i]);
            }
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(), "平台配置","用户保存SNMP信息成功 ");
            msg="保存成功,点击[确定]返回表格!";
        } catch (Exception e) {
            logger.error("平台配置", e);
            logService.newLog("ERROE", SessionUtils.getAccount(request).getUserName(), "平台配置","用户保存SNMP信息失败 ");
            msg = "保存失败";
        }
        String json = "{success:true,msg:'"+msg+"'}";
        actionBase.actionEnd(response,json,result);
        return null;
    }

    public String saveSysLog () throws IOException {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result =	actionBase.actionBegin(request);
        String msg = null;
        try {
            String[] sys = xmlOperatorService.getSysArray(sysArray);
            for(int i = 0;i < sys.length;i++){
                xmlOperatorService.saveSysLogClient(sys[i]);
            }
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(), "平台配置","用户保存SysLog信息成功 ");
            msg="保存成功,点击[确定]返回表格!";
        } catch (Exception e) {
            logger.error("平台配置", e);
            logService.newLog("ERROE", SessionUtils.getAccount(request).getUserName(), "平台配置","用户保存SysLog信息失败 ");
            msg = "保存失败";
        }
        String json = "{success:true,msg:'"+msg+"'}";
        actionBase.actionEnd(response,json,result);
        return null;
    }

    public String deleteSNMP () throws IOException {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result =	actionBase.actionBegin(request);
        String msg = null;
        try {
            for(int i = 0; i<snmpArray.length;i++){
                xmlOperatorService.deleteSNMPClient(snmpArray[i]);
            }
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(), "平台配置","用户删除SNMP信息成功 ");
            msg="删除成功,点击[确定]返回表格!";
        } catch (Exception e) {
            logger.error("平台配置", e);
            logService.newLog("ERROE", SessionUtils.getAccount(request).getUserName(), "平台配置","用户删除SNMP信息失败 ");
            msg = "删除失败";
        }
        String json = "{success:true,msg:'"+msg+"'}";
        actionBase.actionEnd(response,json,result);
        return null;
    }

    public String deleteSysLog () throws IOException {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result =	actionBase.actionBegin(request);
        String msg = null;
        try {
            for(int i = 0;i < sysArray.length;i++){
                xmlOperatorService.deleteSysLogClient(sysArray[i]);
            }
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(), "平台配置","用户删除SysLog信息成功 ");
            msg="删除成功,点击[确定]返回表格!";
        } catch (Exception e) {
            logger.error("平台配置", e);
            logService.newLog("ERROE", SessionUtils.getAccount(request).getUserName(), "平台配置","用户删除SysLog信息失败 ");
            msg = "删除失败";
        }
        String json = "{success:true,msg:'"+msg+"'}";
        actionBase.actionEnd(response,json,result);
        return null;
    }

    public String updateSNMP () throws IOException {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result =	actionBase.actionBegin(request);
        String msg = null;
        try {
            String snmpclient = request.getParameter("snmpclient");
            String oldSNMPClient = request.getParameter("oldSNMPClient");
            if(!snmpclient.equals(oldSNMPClient)){
                xmlOperatorService.updateSNMPClient(snmpclient,oldSNMPClient);
            }
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(), "平台配置","用户修改SNMP信息成功 ");
            msg="修改成功,点击[确定]返回表格!";
        } catch (Exception e) {
            logger.error("平台配置", e);
            logService.newLog("ERROE", SessionUtils.getAccount(request).getUserName(), "平台配置","用户修改SNMP信息失败 ");
            msg = "修改失败";
        }
        String json = "{success:true,msg:'"+msg+"'}";
        actionBase.actionEnd(response,json,result);
        return null;
    }

    public String updateSysLog () throws IOException {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result =	actionBase.actionBegin(request);
        String msg = null;
        try {
            String syslogclient = request.getParameter("syslogclient");
            String oldSysLogClient = request.getParameter("oldSysLogClient");
            if(!syslogclient.equals(oldSysLogClient)){
                xmlOperatorService.updateSysLogClient(syslogclient,oldSysLogClient);
            }
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(), "平台配置","用户修改SysLog信息成功 ");
            msg="修改成功,点击[确定]返回表格!";
        } catch (Exception e) {
            logger.error("平台配置", e);
            logService.newLog("ERROE", SessionUtils.getAccount(request).getUserName(), "平台配置","用户修改SysLog信息失败 ");
            msg = "修改失败";
        }
        String json = "{success:true,msg:'"+msg+"'}";
        actionBase.actionEnd(response,json,result);
        return null;
    }


    public LogService getLogService() {
        return logService;
    }

    public void setLogService(LogService logService) {
        this.logService = logService;
    }

    public XmlOperatorService getXmlOperatorService() {
        return xmlOperatorService;
    }

    public void setXmlOperatorService(XmlOperatorService xmlOperatorService) {
        this.xmlOperatorService = xmlOperatorService;
    }

    public ChannelIChangeUtils getChannelIChangeUtils() {
        return channelIChangeUtils;
    }

    public void setChannelIChangeUtils(ChannelIChangeUtils channelIChangeUtils) {
        this.channelIChangeUtils = channelIChangeUtils;
    }

    public int getStart() {
        return start;
    }

    public void setStart(int start) {
        this.start = start;
    }

    public int getLimit() {
        return limit;
    }

    public void setLimit(int limit) {
        this.limit = limit;
    }

    public String[] getSnmpArray() {
        return snmpArray;
    }

    public void setSnmpArray(String[] snmpArray) {
        this.snmpArray = snmpArray;
    }

    public String[] getSysArray() {
        return sysArray;
    }

    public void setSysArray(String[] sysArray) {
        this.sysArray = sysArray;
    }
}
