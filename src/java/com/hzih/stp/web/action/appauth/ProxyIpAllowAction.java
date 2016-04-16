package com.hzih.stp.web.action.appauth;

import com.hzih.stp.service.LogService;
import com.hzih.stp.service.XmlOperatorService;
import com.hzih.stp.utils.StringContext;
import com.hzih.stp.utils.StringUtils;
import com.hzih.stp.web.SessionUtils;
import com.hzih.stp.web.action.ActionBase;
import com.inetec.common.exception.Ex;
import com.opensymphony.xwork2.ActionSupport;
import org.apache.log4j.Logger;
import org.apache.struts2.ServletActionContext;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 读取代理应用的可访问IP
 * @author 钱晓盼
 *
 */
public class ProxyIpAllowAction extends ActionSupport{

	private static final long serialVersionUID = -1267078981037327633L;
	private static final Logger logger = Logger.getLogger(ProxyIpAllowAction.class);
	private XmlOperatorService xmlOperatorService;
    private LogService logService;
	private Integer start;
	private Integer limit;
	private String typeXml;
	private String type;
	private String appName;
	private String[] arrayIp;

	public String select() throws Exception {
		HttpServletRequest request = ServletActionContext.getRequest();
		HttpServletResponse response = ServletActionContext.getResponse();
		ActionBase base = new ActionBase();
		String result =	base.actionBegin(request);
        String json = null;
        try{
            if("internal".equals(typeXml)){
                json = xmlOperatorService.readInternalProxyIp(start,limit,appName);
            }else if("external".equals(typeXml)){
                json = xmlOperatorService.readExternalProxyIp(start,limit,appName);
            }
            logger.info("读取 "+typeXml+" 配置文件的代理应用"+appName+"的可访问IP成功!");
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(), "通用代理","用户查找通用代理安全属性信息可访问IP名单信息成功 ");
        } catch (Ex ex) {
            logger.error("通用代理",ex);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(), "通用代理","用户查找通用代理安全属性信息可访问IP名单信息失败 ");
        }
		base.actionEnd(response, json,result);
		return null;
	}

    public String insert() throws Exception {
		HttpServletRequest request = ServletActionContext.getRequest();
		HttpServletResponse response = ServletActionContext.getResponse();
		ActionBase base = new ActionBase();
		String result =	base.actionBegin(request);
        String msg = null;
        if(StringUtils.isAuthUser(SessionUtils.getAccount(request))){
            try{
                String ip = new StringUtils().appendString(arrayIp,"");
                xmlOperatorService.updateTypeAllow(typeXml,appName,false);
                if("internal".equals(typeXml)){
                    msg = xmlOperatorService.saveInternalProxyIp(appName,ip);
                }else if("external".equals(typeXml)){
                    msg = xmlOperatorService.saveExternalProxyIp(appName,ip);
                }
                xmlOperatorService.updateTypeAppSend(appName, StringContext.INSERT_APP);
                logger.info("新增"+("internal".equals(typeXml)?"可信":"非可信")+"[代理同步]的可访问IP["+msg+"]!");
                logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(), "通用代理","用户新增通用代理安全属性信息可访问IP名单信息成功 ");
            } catch (Ex ex) {
                logger.error("通用代理",ex);
                logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(), "通用代理","用户新增通用代理安全属性信息可访问IP名单信息失败 ");
                msg = "新增失败";
            }
        } else {
            logService.newLog("WARN", SessionUtils.getAccount(request).getUserName(), "通用代理", "用户新增通用代理安全属性信息可访问IP名单权限不够");
            logger.warn("您不是授权用户,无法新增安全属性可访问IP名单");
            msg = "您不是授权用户,无法新增可访问IP名单";
        }
        String json = "{success:true,msg:'"+msg+"'}";

		base.actionEnd(response, json ,result);
		return null;
	}

    public String update() throws Exception {
		HttpServletRequest request = ServletActionContext.getRequest();
		HttpServletResponse response = ServletActionContext.getResponse();
		ActionBase base = new ActionBase();
		String result =	base.actionBegin(request);
        String ip = request.getParameter("ip");
	    String oldIp = request.getParameter("oldIp");
	    String ipEnd = request.getParameter("ipEnd");
        String oldIpEnd = request.getParameter("oldIpEnd");
        String msg = null;
        if(StringUtils.isAuthUser(SessionUtils.getAccount(request))){
            try{
                xmlOperatorService.updateTypeAllow(typeXml,appName,false);
                if("internal".equals(typeXml)){
                    if(!"请输入Ip:Port".equals(ipEnd)){
                        ip = ip +"-"+ipEnd;
                        if(!"".equals(oldIpEnd)){
                            oldIp = oldIp +"-" +oldIpEnd;
                        }
                    }else{
                        if(!"".equals(oldIpEnd)){
                            oldIp = oldIp +"-" +oldIpEnd;
                        }
                    }
                    xmlOperatorService.updateInternalProxyIp(appName,ip,oldIp);
                }else if("external".equals(typeXml)){
                    if(!"请输入Ip:Port".equals(ipEnd)){
                        ip = ip +"-"+ipEnd;
                        if(!"".equals(oldIpEnd)){
                            oldIp = oldIp +"-" +oldIpEnd;
                        }
                    }else{
                        if(!"".equals(oldIpEnd)){
                            oldIp = oldIp +"-" +oldIpEnd;
                        }
                    }
                    xmlOperatorService.updateExternalProxyIp(appName,ip,oldIp);
                }
                xmlOperatorService.updateTypeAppSend(appName,StringContext.UPDATE_APP);
                logger.info("更新代理应用"+appName+"的可访问IP成功!");
                logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(), "通用代理","用户更新通用代理安全属性信息可访问IP名单信息成功 ");
                msg = "修改成功,点击[确定]返回列表!";
            } catch (Ex ex){
                logger.error("可访问IP", ex);
                logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(), "通用代理","用户更新通用代理安全属性信息可访问IP名单信息失败 ");
                msg = "修改失败";
            }
        } else {
            logService.newLog("WARN", SessionUtils.getAccount(request).getUserName(), "通用代理", "用户更新通用代理安全属性信息可访问IP名单权限不够");
            logger.warn("您不是授权用户,无法更新安全属性可访问IP名单");
            msg = "您不是授权用户,无法更新可访问IP名单";
        }
		String json = "{success:true,msg:'"+msg+"'}";
		base.actionEnd(response, json ,result);
		return null;
	}

    public String delete() throws Exception {
		HttpServletRequest request = ServletActionContext.getRequest();
		HttpServletResponse response = ServletActionContext.getResponse();
		ActionBase base = new ActionBase();
		String result =	base.actionBegin(request);
        String msg = null;
        if(StringUtils.isAuthUser(SessionUtils.getAccount(request))){
            try{
                xmlOperatorService.updateTypeAllow(typeXml,appName,false);
                if("internal".equals(typeXml)){
                    xmlOperatorService.deleteInternalProxyIp(appName,arrayIp);
                    msg = "删除成功,点击[确定]返回列表!";
                }else if("external".equals(typeXml)){
                    xmlOperatorService.deleteExternalProxyIp(appName,arrayIp);
                    msg = "删除成功,点击[确定]返回列表!";
                }
                xmlOperatorService.updateTypeAppSend(appName,StringContext.UPDATE_APP);
                logger.info("删除应用"+appName+"的可访问IP<ipaddress>成功!");
                logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(), "通用代理","用户删除通用代理安全属性信息可访问IP名单信息成功 ");
            } catch (Ex e){
                logger.error("可访问IP",e);
                logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(), "通用代理","用户删除通用代理安全属性信息可访问IP名单信息失败 ");
                msg = "删除失败!";
            }
        } else {
            logService.newLog("WARN", SessionUtils.getAccount(request).getUserName(), "通用代理", "用户删除通用代理安全属性信息可访问IP名单权限不够");
            logger.warn("您不是授权用户,无法更新安全属性可访问IP名单");
            msg = "您不是授权用户,无法删除可访问IP名单";
        }
        String json = "{success:true,msg:'"+msg+"'}";
		base.actionEnd(response, json,result);
		return null;
	}

    public String check() throws Exception {
		HttpServletRequest request = ServletActionContext.getRequest();
		HttpServletResponse response = ServletActionContext.getResponse();
		ActionBase base = new ActionBase();
		String result =	base.actionBegin(request);
		String msg = null;
        if(StringUtils.isAuthUser(SessionUtils.getAccount(request))){
            try{
                String ip = request.getParameter("ip");
                if("internal".equals(typeXml)){
                    msg = xmlOperatorService.checkInternalProxyIp(appName,ip);
                }else if("external".equals(typeXml)){
                    msg = xmlOperatorService.checkExternalProxyIp(appName,ip);
                }
                logger.info(msg);
                logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(), "通用代理", "用户校验可访问IP成功 ");
            } catch (Ex e){
                logger.error("可访问IP",e);
                logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(), "通用代理","用户校验可访问IP失败 ");
                msg = "校验失败!";
            }
        } else {
            logService.newLog("WARN", SessionUtils.getAccount(request).getUserName(), "通用代理", "用户户校验可访问IP限不够");
            logger.warn("您不是授权用户,无法户校验可访问IP");
            msg = "您不是授权用户,户校验可访问IP";
        }
        String json = "{success:true,msg:'"+msg+"'}";
        base.actionEnd(response, json ,result);
        return null;
	}

    public LogService getLogService() {
        return logService;
    }

    public void setLogService(LogService logService) {
        this.logService = logService;
    }

    public Integer getStart() {
		return start;
	}

	public void setStart(Integer start) {
		this.start = start;
	}

	public Integer getLimit() {
		return limit;
	}

	public void setLimit(Integer limit) {
		this.limit = limit;
	}

	public String getTypeXml() {
		return typeXml;
	}

	public void setTypeXml(String typeXml) {
		this.typeXml = typeXml;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getAppName() {
		return appName;
	}

	public void setAppName(String appName) {
		this.appName = appName;
	}

    public XmlOperatorService getXmlOperatorService() {
        return xmlOperatorService;
    }

    public void setXmlOperatorService(XmlOperatorService xmlOperatorService) {
        this.xmlOperatorService = xmlOperatorService;
    }

    public String[] getArrayIp() {
        return arrayIp;
    }

    public void setArrayIp(String[] arrayIp) {
        this.arrayIp = arrayIp;
    }
}
