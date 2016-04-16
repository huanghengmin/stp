package com.hzih.stp.web.action.app;

import com.hzih.stp.domain.DeleteStatus;
import com.hzih.stp.entity.TypeBase;
import com.hzih.stp.entity.TypeData;
import com.hzih.stp.entity.TypeSafe;
import com.hzih.stp.service.DeleteStatusService;
import com.hzih.stp.service.LogService;
import com.hzih.stp.service.XmlOperatorService;
import com.hzih.stp.utils.FileUtil;
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
import java.io.File;
import java.io.IOException;

/**
 * Created with IntelliJ IDEA.
 * User: 钱晓盼
 * Date: 12-7-13
 * Time: 下午3:04
 * To change this template use File | Settings | File Templates.
 */
public class ProxyAction extends ActionSupport {
    private static final Logger logger = Logger.getLogger(ProxyAction.class);
    private DeleteStatusService deleteStatusService;
    private XmlOperatorService xmlOperatorService;
    private LogService logService;
	private TypeBase typeBase;
    private TypeSafe typeSafe;
    private TypeData typeData;
	private String appName;
    private String appDesc;
    private String appType;
    private String plugin;
    private String channel;
    private String channelport;
    private boolean privated;

    private File uploadAuthCA;
    private String uploadAuthCAFileName;
    private String uploadAuthCAContentType;

	public String insert() throws Exception {
		HttpServletRequest request = ServletActionContext.getRequest();
		HttpServletResponse response = ServletActionContext.getResponse();
		ActionBase base = new ActionBase();
		String result =	base.actionBegin(request);
		typeBase = setTypeBase();
        String msg = null;
		try{
            xmlOperatorService.saveProxyType(typeBase,typeSafe,typeData);
            xmlOperatorService.updateTypeAppSend(typeBase.getAppName(),StringContext.INSERT_APP);
            logger.info("保存"+(privated?"可信":"非可信")+"["+appType+"代理]应用成功!");
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(), "通用代理", "用户新增通用代理信息成功");
            msg = "新增成功,点击[确定]返回列表";
        } catch (Ex ex){
            logger.error("通用代理",ex);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(), "通用代理", "用户新增通用代理信息失败");
            msg = "新增失败";
        }
        typeBase = null;
        typeData = null;
        typeSafe = null;
        String json = "{success:true,msg:'"+msg+"'}";
		base.actionEnd(response, json ,result);
		return null;
	}

	public String insertAuth() throws Exception {
		HttpServletRequest request = ServletActionContext.getRequest();
		HttpServletResponse response = ServletActionContext.getResponse();

		ActionBase base = new ActionBase();
		String result =	base.actionBegin(request);
        String msg = null;
        if(StringUtils.isAuthUser(SessionUtils.getAccount(request))){
            try{
                if(uploadAuthCA!=null){
                    FileUtil fileUtil = new FileUtil();
                    String newFile = fileUtil.upload(uploadAuthCAFileName, StringContext.SAVEFILEPATH,uploadAuthCA);  //获取文件上传后的保存地址
                    fileUtil.copy(uploadAuthCA, newFile);                                                    //上传
                    typeSafe.setAuthca(newFile);                                                                 //改变authca值
                    uploadAuthCA.delete();uploadAuthCA = null;
                    logger.info("新增"+typeBase.getAppType()+"应用"+typeBase.getAppName()+"的服务器证书上传成功!");
                }
                xmlOperatorService.saveProxyTypeSafe(typeBase, typeSafe);
                xmlOperatorService.updateTypeAppSend(typeBase.getAppName(),StringContext.INSERT_APP);
                logger.info("保存"+(typeBase.getPrivated()?"可信":"非可信")+"["+typeBase.getAppType()+"代理]应用成功!");
                logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(), "通用代理", "用户新增通用代理安全属性信息成功");
                msg = "新增应用安全属性成功";
            } catch (Ex ex){
                logger.error("通用代理",ex);
                logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(), "通用代理", "用户新增通用代理安全属性信息失败");
                msg = "新增应用安全属性失败";
            }
        }else {
            logService.newLog("WARN", SessionUtils.getAccount(request).getUserName(), "通用代理", "用户新增通用代理安全属性信息权限不够");
            msg = "您不是授权用户,无法新增安全属性";
        }

        typeBase = null;
        typeData = null;
        typeSafe = null;
        String json = "{success:true,msg:'"+msg+"'}";
		base.actionEnd(response, json ,result);
		return null;
	}

    public String update() throws Exception {
		HttpServletRequest request = ServletActionContext.getRequest();
		HttpServletResponse response = ServletActionContext.getResponse();
		ActionBase base = new ActionBase();
		String result =	base.actionBegin(request);
        String msg = null;
		try{
            xmlOperatorService.updateProxyType(typeBase, typeData);
            xmlOperatorService.updateTypeAppSend(typeBase.getAppName(),StringContext.UPDATE_APP);
            logger.info("更新代理" + typeBase.getAppName() + "应用成功!");
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(), "通用代理", "用户更新通用代理信息成功");
            msg = "更新成功,点击[确定]返回列表 ";
        } catch (Ex ex){
            logger.error("通用代理",ex);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(), "通用代理", "用户更新通用代理信息失败");
            msg = "更新失败";
        }
        String json = "{success:true,msg:'"+msg+"'}";
        typeSafe = null;
        typeBase = null;
        typeData = null;
        base.actionEnd(response, json ,result);
		return null;
	}

    public String loadChannelPort() throws Exception {
		HttpServletRequest request = ServletActionContext.getRequest();
		HttpServletResponse response = ServletActionContext.getResponse();
		ActionBase base = new ActionBase();
		String result =	base.actionBegin(request);
        String msg = null;
		try{
            msg = xmlOperatorService.readExternalTypeChannelPort(appName);
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(), "通用代理", "用户获取目标端通道端口信息成功");
        } catch (Ex ex){
            logger.error("通用代理",ex);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(), "通用代理", "用户取目标端通道端口信息失败");
        }
        String json = "{success:true,msg:'"+msg+"'}";
        base.actionEnd(response, json ,result);
		return null;
	}

    public String updateAuth() throws Exception {
		HttpServletRequest request = ServletActionContext.getRequest();
		HttpServletResponse response = ServletActionContext.getResponse();
		ActionBase base = new ActionBase();
		String result =	base.actionBegin(request);
        String msg = null;
        if(StringUtils.isAuthUser(SessionUtils.getAccount(request))){
            try{
                if(typeSafe!=null){
                    if(uploadAuthCA!=null){
                        if(!typeSafe.getAuthca().equals("")){
                            File oldFile = new File(typeSafe.getAuthca());
                            if(oldFile.exists()){
                                oldFile.delete();
                            }
                        }
                        FileUtil fileUtil = new FileUtil();
                        String newFile = fileUtil.upload(uploadAuthCAFileName,StringContext.SAVEFILEPATH,uploadAuthCA);  //获取文件上传后的保存地址
                        fileUtil.copy(uploadAuthCA, newFile);                                                    //上传
                        uploadAuthCA.delete();
                        uploadAuthCA = null;
                        typeSafe.setAuthca(newFile);                                                                 //改变authca值
                        logger.info("修改"+typeBase.getAppType()+"应用"+typeBase.getAppName()+"的服务器证书上传成功!");
                    }else{
                        if(!typeSafe.getClientauthenable()&&typeSafe.getAuthca()!=null){
                            File oldFile = new File(typeSafe.getAuthca());
                            if(oldFile.exists()){
                                oldFile.delete();
                            }
                            typeSafe.setAuthca(null);
                        }
                    }
                }
                xmlOperatorService.updateProxyTypeSafe(typeBase,typeSafe);
                xmlOperatorService.updateTypeAppSend(typeBase.getAppName(),StringContext.UPDATE_APP);
                logger.info("更新代理"+typeBase.getAppName()+"应用安全属性成功!");
                logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(), "通用代理", "用户修改通用代理安全属性信息成功");
                msg = "修改安全属性成功";
            } catch (Ex ex){
                logger.error("通用代理",ex);
                logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(), "通用代理", "用户修改通用代理安全属性信息失败");
                msg = "修改安全属性失败";
            }
        } else {
            logService.newLog("WARN", SessionUtils.getAccount(request).getUserName(), "通用代理", "用户修改通用代理安全属性信息权限不够");
            msg = "您不是授权用户,无法修改安全属性";
        }
        String json = "{success:true,msg:'"+msg+"'}";
        typeSafe = null;
        typeBase = null;
        typeData = null;
        base.actionEnd(response, json ,result);
		return null;
	}

    public String delete() throws IOException,Ex {
    	HttpServletRequest request = ServletActionContext.getRequest();
		HttpServletResponse response = ServletActionContext.getResponse();
        int deleteType = Integer.parseInt(request.getParameter("deleteType"));
		ActionBase base = new ActionBase();
		String result =	base.actionBegin(request);
        String msg = null;
        try{
            DeleteStatus deleteStatus = new DeleteStatus();
            deleteStatus.setAppName(appName);
            deleteStatus.setPlugin(plugin);
            deleteStatusService.insert(deleteStatus);
            logger.info("删除应用成功!");
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(), "通用代理", "用户删除通用代理信息提交成功");
            msg = "等待授权用户授权";
        } catch (Exception e){
            logger.error("通用代理",e);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(), "通用代理", "用户删除通用代理信息提交失败");
            msg = "删除提交失败";
        }
        String json = "{success:true,msg:'"+msg+"'}";
		base.actionEnd(response, json ,result);
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

    /**
     * 端口映射
     */
    public String readProxyQuery() throws IOException {
        HttpServletRequest request = ServletActionContext.getRequest();
		HttpServletResponse response = ServletActionContext.getResponse();
		ActionBase base = new ActionBase();
		String result =	base.actionBegin(request);
        String json = null;
        try{
            int start = Integer.parseInt(request.getParameter("start"));
            int limit = Integer.parseInt(request.getParameter("limit"));
            String type = request.getParameter("type");
            json = xmlOperatorService.readProxyType(start,limit,type);
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(), "端口映射", "用户查找可信和非可信通用代理信息成功");
        } catch (Ex ex) {
            logger.error("端口映射",ex);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(), "端口映射", "用户查找可信和非可信通用代理信息失败");
        }
        base.actionEnd(response, json ,result);
        return null;
    }

    private TypeBase setTypeBase() {
		TypeBase typeBase = new TypeBase();
		typeBase.setAppDesc(appDesc);
		typeBase.setAppName(appName);
		typeBase.setAppType(appType);
		typeBase.setActive(false);
        typeBase.setAllow(false);
		typeBase.setPlugin(plugin);
		typeBase.setPrivated(privated);
        typeBase.setChannel(channel);
        typeBase.setChannelport(channelport);
		return typeBase;
	}

    public DeleteStatusService getDeleteStatusService() {
        return deleteStatusService;
    }

    public void setDeleteStatusService(DeleteStatusService deleteStatusService) {
        this.deleteStatusService = deleteStatusService;
    }

    public XmlOperatorService getXmlOperatorService() {
        return xmlOperatorService;
    }

    public void setXmlOperatorService(XmlOperatorService xmlOperatorService) {
        this.xmlOperatorService = xmlOperatorService;
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

    public TypeSafe getTypeSafe() {
        return typeSafe;
    }

    public void setTypeSafe(TypeSafe typeSafe) {
        this.typeSafe = typeSafe;
    }

    public TypeData getTypeData() {
        return typeData;
    }

    public void setTypeData(TypeData typeData) {
        this.typeData = typeData;
    }

    public String getAppName() {
        return appName;
    }

    public void setAppName(String appName) {
        this.appName = appName;
    }

    public String getAppDesc() {
        return appDesc;
    }

    public void setAppDesc(String appDesc) {
        this.appDesc = appDesc;
    }

    public String getAppType() {
        return appType;
    }

    public void setAppType(String appType) {
        this.appType = appType;
    }

    public String getPlugin() {
        return plugin;
    }

    public void setPlugin(String plugin) {
        this.plugin = plugin;
    }

    public boolean isPrivated() {
        return privated;
    }

    public void setPrivated(boolean privated) {
        this.privated = privated;
    }

    public File getUploadAuthCA() {
        return uploadAuthCA;
    }

    public void setUploadAuthCA(File uploadAuthCA) {
        this.uploadAuthCA = uploadAuthCA;
    }

    public String getUploadAuthCAFileName() {
        return uploadAuthCAFileName;
    }

    public void setUploadAuthCAFileName(String uploadAuthCAFileName) {
        this.uploadAuthCAFileName = uploadAuthCAFileName;
    }

    public String getUploadAuthCAContentType() {
        return uploadAuthCAContentType;
    }

    public void setUploadAuthCAContentType(String uploadAuthCAContentType) {
        this.uploadAuthCAContentType = uploadAuthCAContentType;
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
}
