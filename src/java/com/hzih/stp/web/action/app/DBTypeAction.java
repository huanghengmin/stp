package com.hzih.stp.web.action.app;

import com.hzih.stp.domain.DeleteStatus;
import com.hzih.stp.entity.TypeBase;
import com.hzih.stp.entity.TypeDB;
import com.hzih.stp.service.DataBaseService;
import com.hzih.stp.service.DeleteStatusService;
import com.hzih.stp.service.LogService;
import com.hzih.stp.service.XmlOperatorService;
import com.hzih.stp.utils.StringContext;
import com.hzih.stp.web.SessionUtils;
import com.hzih.stp.web.action.ActionBase;
import com.inetec.common.exception.Ex;
import com.opensymphony.xwork2.ActionSupport;
import org.apache.log4j.Logger;
import org.apache.struts2.ServletActionContext;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * User: 钱晓盼
 * Date: 12-7-23
 * Time: 下午3:31
 * 数据库同步管理
 */
public class DBTypeAction extends ActionSupport {
    private final static Logger logger = Logger.getLogger(DBTypeAction.class);
    private XmlOperatorService xmlOperatorService;
    private DataBaseService dataBaseService;
    private DeleteStatusService deleteStatusService;
    private LogService logService;
    private TypeBase typeBase;
    private TypeDB typeDB;
    private String appName;
    private String appType;
    private String appDesc;
    private String dbName;
    private String dbNameOld;
    private boolean recover;
    private boolean deleteFile;
    private String dataPath;
    private boolean privated;
    private String plugin;
    private String tempTable;
    private String channel;
    private String channelport;
    private String beforeUpdate;
    private int speed;

    public String insert() throws IOException {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result = actionBase.actionBegin(request);
        String msg = null;
        try{
            if(typeBase==null){
                typeBase = setTypeBase();
            }
            /*if(dbName!=null){
                typeDB.setDbName(dbName);
            }*/
            xmlOperatorService.saveDBType(typeBase,typeDB);
            if(!typeBase.getPrivated()){
                xmlOperatorService.updateTypeAppSend(typeBase.getAppName(), StringContext.INSERT_APP);
            }
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"数据库同步","数据库同步新增成功");
            msg = "新增成功,点击[确定]返回列表";
        } catch (Exception e){
            logger.error("数据库同步",e);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(),"数据库同步","数据库同步新增失败");
            msg = "新增失败";
        }
        String json = "{success:true,msg:'"+msg+"'}";
        typeBase = null;
        typeDB = null;
        actionBase.actionEnd(response,json,result);
        return null;
    }

    private TypeBase setTypeBase() {
        TypeBase t = new TypeBase();
        t.setAppName(appName);
        t.setAppDesc(appDesc);
        t.setDataPath(dataPath);
        t.setActive(false);
        t.setAllow(false);
        t.setDeleteFile(deleteFile);
        t.setRecover(recover);
        t.setPlugin(plugin);
        t.setPrivated(privated);
        t.setAppType(appType);
        t.setChannel(channel);
        t.setChannelport(channelport);
        t.setSpeed(speed);
        return t;
    }

    public String delete() throws IOException,Ex {
    	HttpServletRequest request = ServletActionContext.getRequest();
		HttpServletResponse response = ServletActionContext.getResponse();
        int deleteType = Integer.parseInt(request.getParameter("deleteType"));
		ActionBase base = new ActionBase();
		String result =	base.actionBegin(request);
        String msg = null;
        try{
            String appName = request.getParameter("appName");
            String plugin = request.getParameter("plugin");
            DeleteStatus deleteStatus = new DeleteStatus();
            deleteStatus.setAppName(appName);
            deleteStatus.setPlugin(plugin);
            xmlOperatorService.setDataBaseDelete(appName,plugin);
            deleteStatusService.insert(deleteStatus);
            logger.info("删除应用成功,等待授权用户授权删除!");
            msg = "等待授权用户授权";
        } catch (Exception e){
            msg = "删除提交失败";
        }
        String json = "{success:true,msg:'"+msg+"'}";
		base.actionEnd(response, json ,result);
        return null;
    }

    public String updateSourceApp() throws IOException {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result = actionBase.actionBegin(request);
        String msg = null;
        try{
            xmlOperatorService.updateDBTypeSourceApp(typeBase);
            /*if(!dbNameOld.equals(typeDB.getDbName())){
                xmlOperatorService.updateDBName(typeBase,typeDB.getDbName(),dbNameOld);
            }*/
            xmlOperatorService.updateTypeAppSend(typeBase.getAppName(),StringContext.UPDATE_APP);
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"数据库同步","数据库同步修改源端应用属性成功");
            msg = "修改成功,点击[确定]返回列表";
        } catch (Exception e){
            logger.error("数据库同步",e);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(),"数据库同步","数据库同步修改源端应用属性失败");
            msg = "修改失败";
        }
        String json = "{success:true,msg:'"+msg+"'}";
        actionBase.actionEnd(response,json,result);
        return null;
    }

    public String updateSourceData() throws IOException {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result = actionBase.actionBegin(request);
        String msg = null;
        try{

            String afterUpdate = typeDB.getOperation();
            boolean isOperateDB = beforeUpdate.equals(afterUpdate);  //true表示不用操作数据库
            if(!dbNameOld.equals(typeDB.getDbName())){
                xmlOperatorService.updateDBName(typeBase,typeDB.getDbName(),dbNameOld);
                isOperateDB = false;
            }
            xmlOperatorService.updateDBSourceDataType(beforeUpdate,afterUpdate,typeBase,typeDB,isOperateDB);
            xmlOperatorService.updateTypeAppSend(typeBase.getAppName(),StringContext.UPDATE_APP);
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"数据库同步","数据库同步修改源端数据属性成功");
            msg = "修改成功,点击[确定]返回列表";
        } catch (Exception e){
            logger.error("数据库同步",e);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(),"数据库同步","数据库同步修改源端数据属性失败");
            msg = "修改失败";
        }
        String json = "{success:true,msg:'"+msg+"'}";
        actionBase.actionEnd(response,json,result);
        return null;
    }

    public String updateTargetApp() throws IOException {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result = actionBase.actionBegin(request);
        String msg = null;
        try{
            xmlOperatorService.updateDBTypeTargetApp(typeBase);
            xmlOperatorService.updateTypeAppSend(typeBase.getAppName(),StringContext.UPDATE_APP);
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"数据库同步","数据库同步修改目标端应用属性成功");
            msg = "修改成功,点击[确定]返回列表";
        } catch (Exception e){
            logger.error("数据库同步",e);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(),"数据库同步","数据库同步修改目标端应用属性失败");
            msg = "修改失败";
        }
        String json = "{success:true,msg:'"+msg+"'}";
        actionBase.actionEnd(response,json,result);
        return null;
    }
    public String checkTempTable() throws IOException {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result = actionBase.actionBegin(request);
        String msg = null;
        try{
            String typeXml = request.getParameter("typeXml");
            msg = dataBaseService.checkTempTable(typeXml,tempTable,dbName);
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"数据库同步","数据库同步源端校验临时表"+tempTable+"是否存在成功");
        } catch (Exception e){
            logger.error("数据库同步",e);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(), "数据库同步", "数据库同步源端校验临时表" + tempTable + "是否存在失败");
            msg = "校验失败";
        }
        String json = "{success:true,msg:'"+msg+"'}";
        actionBase.actionEnd(response,json,result);
        return null;
    }

    public String operateDB() throws IOException {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result = actionBase.actionBegin(request);
        String msg = null;
        try{
            String typeXml = request.getParameter("typeXml");
            msg = dataBaseService.operateDBUpdateApp(typeXml,appName);
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"数据库同步","操作应用"+appName+"对应的数据库成功");
        } catch (Exception e){
            logger.error("数据库同步",e);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(), "数据库同步", "操作应用"+appName+"对应的数据库失败");
            msg = "操作失败";
        }
        String json = "{success:true,msg:'"+msg+"'}";
        actionBase.actionEnd(response,json,result);
        return null;
    }
    public String queryByNameType() throws Exception {
		HttpServletRequest request = ServletActionContext.getRequest();
		HttpServletResponse response = ServletActionContext.getResponse();
		ActionBase base = new ActionBase();
		String result =	base.actionBegin(request);
		String json = null;
        try{
            json = xmlOperatorService.queryByNameType(appName, appType);
            logger.info("读取配置文件的应用"+appName+"信息成功!");
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(), "业务运行监控", "读取配置文件的应用"+appName+"信息成功!");
        }catch (Ex ex){
            logger.error("业务运行监控",ex);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(),"业务运行监控", "读取配置文件的应用"+appName+"信息失败!");
        }
		base.actionEnd(response, json ,result);
		return null;
	}
    public XmlOperatorService getXmlOperatorService() {
        return xmlOperatorService;
    }

    public void setXmlOperatorService(XmlOperatorService xmlOperatorService) {
        this.xmlOperatorService = xmlOperatorService;
    }

    public DeleteStatusService getDeleteStatusService() {
        return deleteStatusService;
    }

    public void setDeleteStatusService(DeleteStatusService deleteStatusService) {
        this.deleteStatusService = deleteStatusService;
    }

    public LogService getLogService() {
        return logService;
    }

    public void setLogService(LogService logService) {
        this.logService = logService;
    }

    public TypeBase getTypeBase() {
        return typeBase;
    }

    public void setTypeBase(TypeBase typeBase) {
        this.typeBase = typeBase;
    }

    public TypeDB getTypeDB() {
        return typeDB;
    }

    public void setTypeDB(TypeDB typeDB) {
        this.typeDB = typeDB;
    }

    public String getAppName() {
        return appName;
    }

    public void setAppName(String appName) {
        this.appName = appName;
    }

    public String getAppType() {
        return appType;
    }

    public void setAppType(String appType) {
        this.appType = appType;
    }

    public String getAppDesc() {
        return appDesc;
    }

    public void setAppDesc(String appDesc) {
        this.appDesc = appDesc;
    }

    public String getDbName() {
        return dbName;
    }

    public void setDbName(String dbName) {
        this.dbName = dbName;
    }

    public boolean isRecover() {
        return recover;
    }

    public void setRecover(boolean recover) {
        this.recover = recover;
    }

    public boolean isDeleteFile() {
        return deleteFile;
    }

    public void setDeleteFile(boolean deleteFile) {
        this.deleteFile = deleteFile;
    }

    public String getDataPath() {
        return dataPath;
    }

    public void setDataPath(String dataPath) {
        this.dataPath = dataPath;
    }

    public boolean isPrivated() {
        return privated;
    }

    public void setPrivated(boolean privated) {
        this.privated = privated;
    }

    public String getPlugin() {
        return plugin;
    }

    public void setPlugin(String plugin) {
        this.plugin = plugin;
    }

    public String getTempTable() {
        return tempTable;
    }

    public void setTempTable(String tempTable) {
        this.tempTable = tempTable;
    }

    public DataBaseService getDataBaseService() {
        return dataBaseService;
    }

    public void setDataBaseService(DataBaseService dataBaseService) {
        this.dataBaseService = dataBaseService;
    }

    public String getChannel() {
        return channel;
    }

    public void setChannel(String channel) {
        this.channel = channel;
    }

    public String getChannelport() {
        return channelport;
    }

    public void setChannelport(String channelport) {
        this.channelport = channelport;
    }

    public String getBeforeUpdate() {
        return beforeUpdate;
    }

    public void setBeforeUpdate(String beforeUpdate) {
        this.beforeUpdate = beforeUpdate;
    }

    public String getDbNameOld() {
        return dbNameOld;
    }

    public void setDbNameOld(String dbNameOld) {
        this.dbNameOld = dbNameOld;
    }

    public int getSpeed() {
        return speed;
    }

    public void setSpeed(int speed) {
        this.speed = speed;
    }
}
