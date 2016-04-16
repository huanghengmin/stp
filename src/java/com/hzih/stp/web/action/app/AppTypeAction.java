package com.hzih.stp.web.action.app;

import com.hzih.stp.service.DataBaseService;
import com.hzih.stp.service.LogService;
import com.hzih.stp.service.XmlOperatorService;
import com.hzih.stp.utils.FileUtil;
import com.hzih.stp.utils.Random;
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
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * 配置文件的应用<type>公共处理
 * @author 钱晓盼
 *
 */
public class AppTypeAction extends ActionSupport{

	private static final long serialVersionUID = -1267078981037327633L;
	private static final Logger logger = Logger.getLogger(AppTypeAction.class);
    private LogService logService;
	private XmlOperatorService xmlOperatorService;
    private DataBaseService dataBaseService;
	private Integer start;
	private Integer limit;
	private String typeXml;
	private String appType;
	private String type;
    private String appName;
    private String[] appNameArray;
    private String text;
    private String channelPort;

    public String readExternalType() throws Exception {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase base = new ActionBase();
        String result =	base.actionBegin(request);
        String json = null;
        try{
            json = xmlOperatorService.readExternalType(start, limit, appType);
            logger.info("读取非可信配置文件的信息成为列表成功!");
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"查找"+appType+"应用","读取非可信配置文件的信息成为列表成功!");
        }catch (Ex ex){
            logger.error("查找"+appType+"应用",ex);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(),"查找"+appType+"应用","读取非可信配置文件的信息成为列表失败!");
        }
        base.actionEnd(response, json ,result);
        return null;
    }

    public String readExternalNotAllowType() throws Exception {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase base = new ActionBase();
        String result =	base.actionBegin(request);
        String json = null;
        try{
            json = xmlOperatorService.readExternalType(start, limit, appType,false);
            logger.info("读取非可信配置文件的未通过审批信息成为列表成功!");
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"查找"+appType+"应用","读取非可信配置文件的未通过审批信息成为列表成功!");
        }catch (Ex ex){
            logger.error("查找"+appType+"应用",ex);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(),"查找"+appType+"应用","读取非可信配置文件的未通过审批信息成为列表失败!");
        }
        base.actionEnd(response, json ,result);
        return null;
    }

    public String readExternalAllowType() throws Exception {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase base = new ActionBase();
        String result =	base.actionBegin(request);
        String json = null;
        try{
            json = xmlOperatorService.readExternalType(start, limit, appType,true);
            logger.info("读取非可信配置文件的通过审批信息成为列表成功!");
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"查找"+appType+"应用","读取非可信配置文件的通过审批信息成为列表成功!");
        }catch (Ex ex){
            logger.error("查找"+appType+"应用",ex);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(),"查找"+appType+"应用","读取非可信配置文件的通过审批信息成为列表失败!");
        }
        base.actionEnd(response, json ,result);
        return null;
    }


	public String readInternalType() throws Exception {
		HttpServletRequest request = ServletActionContext.getRequest();
		HttpServletResponse response = ServletActionContext.getResponse();
		ActionBase base = new ActionBase();
		String result =	base.actionBegin(request);
		String json = null;
        try{
            json = xmlOperatorService.readInternalType(start, limit, appType);
            logger.info("读取可信配置文件的信息成为列表成功!");
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(), "查找" + appType + "应用", "读取可信配置文件的信息成为列表成功!");
        }catch (Ex ex){
            logger.error("查找"+appType+"应用",ex);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(),"查找" + appType + "应用", "读取可信配置文件的信息成为列表失败!");
        }
		base.actionEnd(response, json ,result);
		return null;
	}

    public String readInternalNotAllowType() throws Exception {
		HttpServletRequest request = ServletActionContext.getRequest();
		HttpServletResponse response = ServletActionContext.getResponse();
		ActionBase base = new ActionBase();
		String result =	base.actionBegin(request);
		String json = null;
        try{
            json = xmlOperatorService.readInternalType(start, limit, appType,false);
            logger.info("读取可信配置文件的未通过审批信息成为列表成功!");
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(), "查找" + appType + "应用", "读取可信配置文件的未通过审批信息成为列表成功!");
        }catch (Ex ex){
            logger.error("查找"+appType+"应用",ex);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(),"查找" + appType + "应用", "读取可信配置文件的未通过审批信息成为列表失败!");
        }
		base.actionEnd(response, json ,result);
		return null;
	}

    public String readInternalAllowType() throws Exception {
		HttpServletRequest request = ServletActionContext.getRequest();
		HttpServletResponse response = ServletActionContext.getResponse();
		ActionBase base = new ActionBase();
		String result =	base.actionBegin(request);
		String json = null;
        try{
            json = xmlOperatorService.readInternalType(start, limit, appType,true);
            logger.info("读取可信配置文件的通过审批信息成为列表成功!");
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(), "查找" + appType + "应用", "读取可信配置文件的通过审批信息成为列表成功!");
        }catch (Ex ex){
            logger.error("查找"+appType+"应用",ex);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(),"查找" + appType + "应用", "读取可信配置文件的通过审批信息成为列表失败!");
        }
		base.actionEnd(response, json ,result);
		return null;
	}

    /**
     * 读取配置文件根节点描述信息
     * @return
     * @throws IOException
     */
    public String readXmlRootDesc() throws IOException {
        HttpServletRequest request = ServletActionContext.getRequest();
		HttpServletResponse response = ServletActionContext.getResponse();
		ActionBase base = new ActionBase();
		String result =	base.actionBegin(request);
        String msg = null;
        String desc = null;
        try{
            desc = xmlOperatorService.readRootDesc(type,null);
            logger.info("读取配置文件根节点描述信息成功");
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"存档/恢复配置","读取配置文件根节点描述信息成功!");
            msg = "true";
        } catch (Exception e){
            logger.error("存档/恢复配置",e);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(),"存档/恢复配置","读取配置文件根节点描述信息失败!");
            msg = "读取配置文件描述信息失败!";
        }
        String json = "{success:true,msg:'"+msg+"',desc:'"+desc+"'}";
        base.actionEnd(response, json ,result);
        return null;
    }


    /*
     * 存档
     */
    public String toFile() throws IOException {
        HttpServletRequest request = ServletActionContext.getRequest();
		HttpServletResponse response = ServletActionContext.getResponse();
		ActionBase base = new ActionBase();
		String result =	base.actionBegin(request);
        String msg = null;
        try{
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd_HH-mm-ss");
            String addName = "_"+sdf.format(new Date())+"_"+Random.getRandom();
            String innerCopyDirect = FileUtil.copyInternalXmlToVersion(addName);
            if(!StringUtils.getPrivated()){
                dataBaseService.operateDBUpdateApp(StringContext.EXTERNAL);
            }
            String outCopyDirect = FileUtil.copyExternalXmlToVersion(addName);
            if(text!=null){
                xmlOperatorService.updateDescription(innerCopyDirect, text);
                xmlOperatorService.updateDescription(outCopyDirect, text);
            }
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"存档","存档配置成功!");
            msg = "存档成功,点击[确定]返回列表!";
        } catch (Ex ex) {
            logger.error("存档",ex);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(),"存档","存档配置失败!");
            msg = "存档配置失败!";
        }
        String json = "{success:true,msg:'"+msg+"'}";
        base.actionEnd(response, json ,result);
        return null;
    }

    public String initStatus() throws IOException {
        HttpServletRequest request = ServletActionContext.getRequest();
		HttpServletResponse response = ServletActionContext.getResponse();
		ActionBase base = new ActionBase();
		String result =	base.actionBegin(request);
        String msg = null;
        try{
            xmlOperatorService.updateTypeAppSend(appName ,StringContext.INIT_APP);
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),appName+"应用","重置"+appName+"应用的状态成功!");
            msg = "重置状态成功,点击[确定]返回列表!";
        } catch (Ex ex) {
            logger.error(appName+"应用",ex);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(), appName +"应用","重置"+appName+"应用的状态失败!");
            msg = "重置状态失败!";
        }
        String json = "{success:true,msg:'"+msg+"'}";
        base.actionEnd(response, json ,result);
        return null;
    }

    /**
     * 新增应用验证应用编号
     * @return
     * @throws Exception
     */
    public String check() throws Exception {
		HttpServletRequest request = ServletActionContext.getRequest();
		HttpServletResponse response = ServletActionContext.getResponse();
		ActionBase base = new ActionBase();
		String result =	base.actionBegin(request);
		String msg = null;
        try{
            msg = xmlOperatorService.checkAppName(appName);
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"新增应用验证应用编号","新增应用验证应用编号成功!");
            logger.info("新增应用验证应用编号成功!");
        } catch (Ex e){
            logger.error("新增应用验证应用编号",e);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(),"新增应用验证应用编号","新增应用验证应用编号失败!");
            msg = "验证失败,请联系管理员!";
        }
        String json = "{success:true,msg:'"+msg+"'}";
		base.actionEnd(response, json, result);
		return null;
	}

    /**
     * 修改应用验证应用名
     * @return
     * @throws Exception
     */
    public String checkUpdateDesc() throws Exception {
		HttpServletRequest request = ServletActionContext.getRequest();
		HttpServletResponse response = ServletActionContext.getResponse();
		ActionBase base = new ActionBase();
		String result =	base.actionBegin(request);
		String msg = null;
        try{
            String appDesc = request.getParameter("appDesc");
            String typeXml = request.getParameter("typeXml");
            msg = xmlOperatorService.checkAppDesc(typeXml,appDesc);
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"修改应用验证应用名","修改应用验证应用名成功!");
            logger.info("修改应用验证应用名成功!");
        } catch (Ex e){
            logger.error("修改应用验证应用名",e);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(),"修改应用验证应用名","修改应用验证应用名失败!");
            msg = "验证失败,请联系管理员!";
        }
        String json = "{success:true,msg:'"+msg+"'}";
		base.actionEnd(response, json, result);
		return null;
	}

    /**
     * 应用验证应用名唯一
     * @return
     * @throws Exception
     */
    public String checkAddDesc() throws Exception {
		HttpServletRequest request = ServletActionContext.getRequest();
		HttpServletResponse response = ServletActionContext.getResponse();
		ActionBase base = new ActionBase();
		String result =	base.actionBegin(request);
		String msg = null;
        try{
            String appDesc = request.getParameter("appDesc");
            String typeXml = request.getParameter("typeXml");
            msg = xmlOperatorService.checkAppDesc(typeXml,appDesc);
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"新增应用验证应用名","验证应用名唯一成功!");
            logger.info("新增应用验证应用名唯一成功!");
        } catch (Ex e){
            logger.error("新增应用验证应用名唯一",e);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(),"新增应用验证应用名","验证应用名唯一失败!");
            msg = "验证失败,请联系管理员!";
        }
        String json = "{success:true,msg:'"+msg+"'}";
		base.actionEnd(response, json, result);
		return null;
	}

    /**
     * 获取可信端未建应用的应用名列表
     * @return
     * @throws Exception
     */
    public String readTargetAppNameKeyValue() throws Exception{
        HttpServletRequest request = ServletActionContext.getRequest();
		HttpServletResponse response = ServletActionContext.getResponse();
		ActionBase base = new ActionBase();
		String result =	base.actionBegin(request);
		String json = null;
        try{
            json = xmlOperatorService.readTargetTypeNameKeyValue(StringContext.INTERNAL,appType);
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"新增应用验证","组建目标应用名列表成功!");
            logger.info("组建目标应用名列表成功!");
        } catch (Ex e){
            logger.error("新增应用验证",e);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(),"新增应用验证","组建目标应用名列表失败!");
        }
		base.actionEnd(response, json, result);
        return null;
    }

    public String readAppNameKeyValue() throws Exception{
        HttpServletRequest request = ServletActionContext.getRequest();
		HttpServletResponse response = ServletActionContext.getResponse();
		ActionBase base = new ActionBase();
		String result =	base.actionBegin(request);
		String json = null;
//        json = "{success:true,total:1,rows:[{key:'sql_7000',value:'sql_7000'}]}";
        try{
            json = xmlOperatorService.readTypeNameKeyValue(StringContext.INTERNAL,appType);
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"业务审计比对","组建应用名列表成功!");
            logger.info("组建应用名列表成功!");
        } catch (Ex e){
            logger.error("业务审计比对",e);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(),"业务审计比对","组建应用名列表失败!");
        }
		base.actionEnd(response, json, result);
        return null;
    }

    public String readChannelKeyValue() throws Exception{
        HttpServletRequest request = ServletActionContext.getRequest();
		HttpServletResponse response = ServletActionContext.getResponse();
		ActionBase base = new ActionBase();
		String result =	base.actionBegin(request);
		String json = null;
        try{
            json = xmlOperatorService.readChannelKeyValue();
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"应用新增、修改","组建通道类型列表成功!");
            logger.info("组建通道类型列表成功!");
        } catch (Ex e){
            logger.error("应用新增、修改",e);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(),"应用新增、修改","组建通道类型列表失败!");
        }
		base.actionEnd(response, json, result);
        return null;
    }

    public String checkPort() throws Exception {
		HttpServletRequest request = ServletActionContext.getRequest();
		HttpServletResponse response = ServletActionContext.getResponse();
		ActionBase base = new ActionBase();
		String result =	base.actionBegin(request);
		String msg = null;
        try{
            msg = xmlOperatorService.checkAppPort(Integer.parseInt(channelPort));
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"应用新增、修改","新增、修改应用验证通道端口"+channelPort+"成功!");
            logger.info("验证通道端口成功!");
        } catch (Ex e){
            logger.error("应用新增、修改",e);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(),"应用新增、修改","新增、修改应用验证通道端口"+channelPort+"失败!");
            msg = "验证失败,请联系管理员!";
        }
        String json = "{success:true,msg:'"+msg+"'}";
		base.actionEnd(response, json, result);
		return null;
	}

    public LogService getLogService() {
        return logService;
    }

    public void setLogService(LogService logService) {
        this.logService = logService;
    }

    public void setXmlOperatorService(XmlOperatorService xmlOperatorService) {
        this.xmlOperatorService = xmlOperatorService;
    }

    public XmlOperatorService getXmlOperatorService() {
        return xmlOperatorService;
    }

    public DataBaseService getDataBaseService() {
        return dataBaseService;
    }

    public void setDataBaseService(DataBaseService dataBaseService) {
        this.dataBaseService = dataBaseService;
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

    public String getAppType() {
        return appType;
    }

    public void setAppType(String appType) {
        this.appType = appType;
    }

    public String getAppName() {
        return appName;
    }

    public void setAppName(String appName) {
        this.appName = appName;
    }

    public String[] getAppNameArray() {
        return appNameArray;
    }

    public void setAppNameArray(String[] appNameArray) {
        this.appNameArray = appNameArray;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getChannelPort() {
        return channelPort;
    }

    public void setChannelPort(String channelPort) {
        this.channelPort = channelPort;
    }
}
