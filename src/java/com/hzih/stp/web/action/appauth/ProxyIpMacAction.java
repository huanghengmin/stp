package com.hzih.stp.web.action.appauth;

import com.hzih.stp.service.LogService;
import com.hzih.stp.service.XmlOperatorService;
import com.hzih.stp.utils.StringContext;
import com.hzih.stp.utils.StringUtils;
import com.hzih.stp.web.SessionUtils;
import com.hzih.stp.web.action.ActionBase;
import com.inetec.common.config.stp.nodes.IpMac;
import com.opensymphony.xwork2.ActionSupport;
import org.apache.log4j.Logger;
import org.apache.struts2.ServletActionContext;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 代理应用的IP/MAC黑白名单
 * @author 钱晓盼
 *
 */
public class ProxyIpMacAction extends ActionSupport{

	private static final long serialVersionUID = -1267078981037327633L;
	private static final Logger logger = Logger.getLogger(ProxyIpMacAction.class);
	private XmlOperatorService xmlOperatorService;
    private LogService logService;
	private Integer start;
	private Integer limit;
	private String typeXml;
	private String proxyType;
	private String appName;
    private String ip;
    private IpMac ipMac;
    private String ipMacType;
    private String[] arrayIp;
    private String[] arrayMac;
    private String oldUpdateIp;

	public String readIpMac() throws Exception {
		HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase base = new ActionBase();
        String result =	base.actionBegin(request);
        String json = null;
        try{
            if("internal".equals(typeXml)){
                if(ipMacType.equals("black")){
                    json = xmlOperatorService.readInternalProxyBlackIpMac(start,limit,appName,proxyType);
                } else if(ipMacType.equals("white")){
                    json = xmlOperatorService.readInternalProxyWhiteIpMac(start,limit,appName,proxyType);
                }
            }else if("external".equals(typeXml)){
                if(ipMacType.equals("black")){
                    json = xmlOperatorService.readExternalProxyBlackIpMac(start,limit,appName,proxyType);
                }else if(ipMacType.equals("white")){
                    json = xmlOperatorService.readExternalProxyWhiteIpMac(start,limit,appName,proxyType);
                }
            }
            logger.info("读取"+(typeXml.equals("internal")?"可信":"非可信")+"配置文件的"+proxyType+"代理应用"+appName+"的IP/MAC"+(ipMacType.equals("black")?"黑":"白")+"名单成功!");
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(), "通用代理","读取"+(typeXml.equals("internal")?"可信":"非可信")+"配置文件的"+proxyType+"代理应用"+appName+"的IP/MAC"+(ipMacType.equals("black")?"黑":"白")+"名单成功!");
        } catch (Exception e){
            logger.error("通用代理",e);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(), "通用代理","读取"+(typeXml.equals("internal")?"可信":"非可信")+"配置文件的"+proxyType+"代理应用"+appName+"的IP/MAC"+(ipMacType.equals("black")?"黑":"白")+"名单失败!");
        }
		base.actionEnd(response, json,result);
		return null;
	}

	public String saveIpMac() throws Exception {
		HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase base = new ActionBase();
        String result =	base.actionBegin(request);
        String msg = null;
        if(StringUtils.isAuthUser(SessionUtils.getAccount(request))){
            try{
                IpMac[] ipMacs = new IpMac[arrayIp.length];
                for (int i=0;i<arrayIp.length;i++){
                    ipMacs[i] = new IpMac();
                    ipMacs[i].setIp(arrayIp[i]);
                    ipMacs[i].setMac(arrayMac[i]);
                }
                xmlOperatorService.updateTypeAllow(typeXml,appName,false);
                if("internal".equals(typeXml)){
                    if(ipMacType.equals("black")){
                        xmlOperatorService.saveInternalProxyBlackIpMac(appName,ipMacs);
                    } else if(ipMacType.equals("white")){
                        xmlOperatorService.saveInternalProxyWhiteIpMac(appName,ipMacs);
                    }
                }else if("external".equals(typeXml)){
                    if(ipMacType.equals("black")){
                        xmlOperatorService.saveExternalProxyBlackIpMac(appName,ipMacs);
                    }else if(ipMacType.equals("white")){
                        xmlOperatorService.saveExternalProxyWhiteIpMac(appName,ipMacs);
                    }
                }
                xmlOperatorService.updateTypeAppSend(appName, StringContext.UPDATE_APP);
                logger.info("保存"+(typeXml.equals("internal")?"可信":"非可信")+"配置文件的"+proxyType+"代理应用"+appName+"的IP/MAC"+(ipMacType.equals("black")?"黑":"白")+"名单成功!");
                logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(), "通用代理","保存"+(typeXml.equals("internal")?"可信":"非可信")+"配置文件的"+proxyType+"代理应用"+appName+"的IP/MAC"+(ipMacType.equals("black")?"黑":"白")+"名单成功!");
                msg = "保存成功,点击[确定]返回列表!";
            } catch (Exception e){
                logger.error("通用代理", e);
                logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(), "通用代理","保存"+(typeXml.equals("internal")?"可信":"非可信")+"配置文件的"+proxyType+"代理应用"+appName+"的IP/MAC"+(ipMacType.equals("black")?"黑":"白")+"名单失败!");
                msg = "保存失败";
            }
        }  else {
            logService.newLog("WARN", SessionUtils.getAccount(request).getUserName(), "通用代理", "用户新增通用代理安全属性信息IP/MAC黑白名单权限不够");
            logger.warn("您不是授权用户,无法新增安全属性IP/MAC黑白名单");
            msg = "您不是授权用户,无法新增安全属性IP/MAC黑白名单";
        }
        String json = "{success:true,msg:'"+msg+"'}";
		base.actionEnd(response, json,result);
		return null;
	}

	public String deleteIpMac() throws Exception {
		HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase base = new ActionBase();
        String result =	base.actionBegin(request);
        String msg = null;
        if(StringUtils.isAuthUser(SessionUtils.getAccount(request))){
            try{
                IpMac[] ipMacs = new IpMac[arrayIp.length];
                for (int i=0;i<arrayIp.length;i++){
                    ipMacs[i] = new IpMac();
                    ipMacs[i].setIp(arrayIp[i]);
                    ipMacs[i].setMac(arrayMac[i]);
                }
                xmlOperatorService.updateTypeAllow(typeXml,appName,false);
                if("internal".equals(typeXml)){
                    if(ipMacType.equals("black")){
                        xmlOperatorService.deleteInternalProxyBlackIpMac(appName, ipMacs);
                    } else if(ipMacType.equals("white")){
                        xmlOperatorService.deleteInternalProxyWhiteIpMac(appName, ipMacs);
                    }
                }else if("external".equals(typeXml)){
                    if(ipMacType.equals("black")){
                        xmlOperatorService.deleteExternalProxyBlackIpMac(appName, ipMacs);
                    }else if(ipMacType.equals("white")){
                        xmlOperatorService.deleteExternalProxyWhiteIpMac(appName, ipMacs);
                    }
                }
                xmlOperatorService.updateTypeAppSend(appName,StringContext.UPDATE_APP);
                logger.info("删除"+(typeXml.equals("internal")?"可信":"非可信")+"配置文件的"+proxyType+"代理应用"+appName+"的IP/MAC"+(ipMacType.equals("black")?"黑":"白")+"名单成功!");
                logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(), "通用代理","删除"+(typeXml.equals("internal")?"可信":"非可信")+"配置文件的"+proxyType+"代理应用"+appName+"的IP/MAC"+(ipMacType.equals("black")?"黑":"白")+"名单成功!");
                msg = "删除成功,点击[确定]返回列表!";
            } catch (Exception e){
                logger.error("通用代理",e);
                logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(), "通用代理","删除"+(typeXml.equals("internal")?"可信":"非可信")+"配置文件的"+proxyType+"代理应用"+appName+"的IP/MAC"+(ipMacType.equals("black")?"黑":"白")+"名单失败!");
                msg = "删除失败";
            }
        }  else {
            logService.newLog("WARN", SessionUtils.getAccount(request).getUserName(), "通用代理", "用户删除通用代理安全属性信息IP/MAC黑白名单权限不够");
            logger.warn("您不是授权用户,无法删除安全属性IP/MAC黑白名单");
        }
        String json = "{success:true,msg:'"+msg+"'}";
		base.actionEnd(response, json,result);
		return null;
	}

	public String updateIpMac() throws Exception {
		HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase base = new ActionBase();
        String result =	base.actionBegin(request);
        String msg = null;
        if(StringUtils.isAuthUser(SessionUtils.getAccount(request))){
            try{
                xmlOperatorService.updateTypeAllow(typeXml,appName,false);
                if("internal".equals(typeXml)){
                    if(ipMacType.equals("black")){
                        xmlOperatorService.updateInternalProxyBlackIpMac(appName, ipMac,oldUpdateIp);
                    } else if(ipMacType.equals("white")){
                        xmlOperatorService.updateInternalProxyWhiteIpMac(appName, ipMac,oldUpdateIp);
                    }
                }else if("external".equals(typeXml)){
                    if(ipMacType.equals("black")){
                        xmlOperatorService.updateExternalProxyBlackIpMac(appName, ipMac,oldUpdateIp);
                    }else if(ipMacType.equals("white")){
                        xmlOperatorService.updateExternalProxyWhiteIpMac(appName, ipMac,oldUpdateIp);
                    }
                }
                xmlOperatorService.updateTypeAppSend(appName,StringContext.UPDATE_APP);
                logger.info("修改"+(typeXml.equals("internal")?"可信":"非可信")+"配置文件的"+proxyType+"代理应用"+appName+"的IP/MAC"+(ipMacType.equals("black")?"黑":"白")+"名单成功!");
                logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(), "通用代理","修改"+(typeXml.equals("internal")?"可信":"非可信")+"配置文件的"+proxyType+"代理应用"+appName+"的IP/MAC"+(ipMacType.equals("black")?"黑":"白")+"名单成功!");
                msg = "修改成功,点击[确定]返回列表!";
            } catch (Exception e){
                logger.error("通用代理",e);
                logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(), "通用代理","修改"+(typeXml.equals("internal")?"可信":"非可信")+"配置文件的"+proxyType+"代理应用"+appName+"的IP/MAC"+(ipMacType.equals("black")?"黑":"白")+"名单失败!");
                msg = "修改失败";
            }
        }  else {
            logService.newLog("WARN", SessionUtils.getAccount(request).getUserName(), "通用代理", "用户修改通用代理安全属性信息IP/MAC黑白名单权限不够");
            logger.warn("您不是授权用户,无法修改安全属性IP/MAC黑白名单");
        }
        String json = "{success:true,msg:'"+msg+"'}";
		base.actionEnd(response, json,result);
		return null;
	}

    public String checkIp() throws Exception {
		HttpServletRequest request = ServletActionContext.getRequest();
		HttpServletResponse response = ServletActionContext.getResponse();
		ActionBase base = new ActionBase();
		String result =	base.actionBegin(request);
        String msg = null;
        if(StringUtils.isAuthUser(SessionUtils.getAccount(request))){
            try{
                if("internal".equals(typeXml)){
                    if(ipMacType.equals("black")){
                        msg = xmlOperatorService.checkInternalProxyBlackIp(appName,ip);
                    } else if(ipMacType.equals("white")){
                        msg = xmlOperatorService.checkInternalProxyWhiteIp(appName, ip);
                    }
                }else if("external".equals(typeXml)){
                    if(ipMacType.equals("black")){
                        msg = xmlOperatorService.checkExternalProxyBlackIp(appName, ip);
                    }else if(ipMacType.equals("white")){
                        msg = xmlOperatorService.checkExternalProxyWhiteIp(appName, ip);
                    }
                }
                logger.info("校验"+(typeXml.equals("internal")?"可信":"非可信")+"配置文件的"+proxyType+"代理应用"+appName+"的IP/MAC"+(ipMacType.equals("black")?"黑":"白")+"名单"+ip+"是否存在成功!");
                logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(), "通用代理","校验"+(typeXml.equals("internal")?"可信":"非可信")+"配置文件的"+proxyType+"代理应用"+appName+"的IP/MAC"+(ipMacType.equals("black")?"黑":"白")+"名单"+ip+"是否存在成功!");
            } catch (Exception e){
                logger.error("通用代理", e);
                logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(), "通用代理","校验"+(typeXml.equals("internal")?"可信":"非可信")+"配置文件的"+proxyType+"代理应用"+appName+"的IP/MAC"+(ipMacType.equals("black")?"黑":"白")+"名单"+ip+"是否存在失败!");
                msg = "校验失败,可能无法继续操作";
            }
        }  else {
            logService.newLog("WARN", SessionUtils.getAccount(request).getUserName(), "通用代理", "用户校验通用代理安全属性信息IP/MAC黑白名单权限不够");
            logger.warn("您不是授权用户,无法校验安全属性IP/MAC黑白名单");
        }
        String json = "{success:true,msg:'"+msg+"'}";
		base.actionEnd(response, json,result);
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

    public String getAppName() {
        return appName;
    }

    public void setAppName(String appName) {
        this.appName = appName;
    }

    public String getProxyType() {
        return proxyType;
    }

    public void setProxyType(String proxyType) {
        this.proxyType = proxyType;
    }

    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }

    public IpMac getIpMac() {
        return ipMac;
    }

    public void setIpMac(IpMac ipMac) {
        this.ipMac = ipMac;
    }

    public String getIpMacType() {
        return ipMacType;
    }

    public void setIpMacType(String ipMacType) {
        this.ipMacType = ipMacType;
    }

    public String[] getArrayIp() {
        return arrayIp;
    }

    public void setArrayIp(String[] arrayIp) {
        this.arrayIp = arrayIp;
    }

    public String[] getArrayMac() {
        return arrayMac;
    }

    public void setArrayMac(String[] arrayMac) {
        this.arrayMac = arrayMac;
    }

    public String getOldUpdateIp() {
        return oldUpdateIp;
    }

    public void setOldUpdateIp(String oldUpdateIp) {
        this.oldUpdateIp = oldUpdateIp;
    }
}
