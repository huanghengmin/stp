package com.hzih.stp.web.action.app;

import com.googlecode.sardine.DavResource;
import com.googlecode.sardine.Sardine;
import com.googlecode.sardine.SardineFactory;
import com.hzih.stp.domain.DeleteStatus;
import com.hzih.stp.entity.TypeBase;
import com.hzih.stp.entity.TypeFile;
import com.hzih.stp.entity.TypeSafe;
import com.hzih.stp.service.DeleteStatusService;
import com.hzih.stp.service.LogService;
import com.hzih.stp.service.XmlOperatorService;
import com.hzih.stp.utils.StringContext;
import com.hzih.stp.web.SessionUtils;
import com.hzih.stp.web.action.ActionBase;
import com.inetec.common.exception.Ex;
import com.opensymphony.xwork2.ActionSupport;
import jcifs.smb.SmbFile;
import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPReply;
import org.apache.log4j.Logger;
import org.apache.struts2.ServletActionContext;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.MalformedURLException;
import java.util.List;

/**
 * 文件同步
 */
public class FileTypeAction extends ActionSupport {

    private final static Logger logger = Logger.getLogger(FileTypeAction.class);
    private LogService logService;
    private DeleteStatusService deleteStatusService;
    private XmlOperatorService xmlOperatorService;
    private TypeBase typeBase;
    private TypeSafe typeSafe;
    private TypeFile typeFile;
    private String appName;
    private String plugin;
    private boolean privated;
    private String appDesc;
    private String appType;
    private String channel;
    private String channelport;
    private int speed;

    public String insert() throws Exception {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase base = new ActionBase();
        String result = base.actionBegin(request);
        String msg = null;
        try{
            typeBase = setTypeBase();
            xmlOperatorService.saveFileType(typeBase,typeFile);
            if(!typeBase.getPrivated()){
                xmlOperatorService.updateTypeAppSend(typeBase.getAppName(), StringContext.INSERT_APP);
            }
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"文件同步","文件同步新增应用成功");
            msg = "保存成功,点击[确定]返回列表";
        } catch (Exception e){
            logger.error("文件同步",e);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(),"文件同步","文件同步新增应用失败");
            msg = "保存失败";
        }
        String json = "{success:true,msg:'"+msg+"'}";
        typeBase = null;
        typeFile = null;
        base.actionEnd(response,json,result);
        return null;
    }

    private TypeBase setTypeBase() {
        TypeBase  typeBase =  new TypeBase();
        typeBase.setAppDesc(appDesc);
        typeBase.setAppName(appName);
        typeBase.setAppType(appType);
        typeBase.setActive(false);
        typeBase.setAllow(false);
        typeBase.setFilter(false);
        typeBase.setVirusScan(false);
        typeBase.setPlugin(plugin);
        typeBase.setPrivated(privated);
        typeBase.setChannel(channel);
        typeBase.setChannelport(channelport);
        typeBase.setSpeed(speed);
        return typeBase;
    }

    public String update() throws Exception {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase base = new ActionBase();
        String result = base.actionBegin(request);
        String msg = null;
        try{
            xmlOperatorService.updateFileType(typeBase, typeFile);
            if(!typeBase.getPrivated()){
                xmlOperatorService.updateTypeAppSend(typeBase.getAppName(),StringContext.UPDATE_APP);
            }
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"文件同步","文件同步修改应用成功");
            msg = "修改成功,点击[确定]返回列表";
        } catch (Exception e){
            logger.error("文件同步",e);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(),"文件同步","文件同步修改应用失败");
            msg = "修改失败";
        }
        String json = "{success:true,msg:'"+msg+"'}";
        typeBase = null;
        typeFile = null;
        base.actionEnd(response,json,result);
        return null;
    }

    public String delete() throws Exception {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase base = new ActionBase();
        String result = base.actionBegin(request);
        String msg = null;
        try{
            int deleteType = Integer.parseInt(request.getParameter("deleteType"));
            DeleteStatus deleteStatus = new DeleteStatus();
            deleteStatus.setAppName(appName);
            deleteStatus.setPlugin(plugin);
            deleteStatusService.insert(deleteStatus);
            logger.info("删除应用成功!");
            msg = "等待授权用户授权";
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"文件同步","配置用户删除文件同步应用"+appName+"成功,等待授权用户审批是否能删除!");
        } catch (Exception e){
            logger.error("文件同步",e);
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"文件同步","配置用户删除文件同步应用"+appName+"失败,下次继续删除!");
            msg = "删除提交失败";
        }
        String json = "{success:true,msg:'"+msg+"'}";
        base.actionEnd(response,json,result);
        return null;
    }

    public String testConnect() throws Exception {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase base = new ActionBase();
        String result = base.actionBegin(request);
        String msg = null;
        boolean isOk = false;
        try{
            if("ftp".equals(typeFile.getProtocol())||"ftpdown".equals(typeFile.getProtocol())){
                FTPClient client = null;
                try{
                    client = getFTPClient(typeFile.getServerAddress(), Integer.valueOf(typeFile.getPort()), typeFile.getUserName(), typeFile.getPassword(),typeFile.getCharset());
                    if(client!=null){
                        disconnect(client);
                        isOk = true;
                        logger.info("测试成功!");
                        msg = "测试成功,点击[确定]返回";
                        logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"文件同步","测试所选"+typeFile.getProtocol()+"文件服务是否可以连通成功!");
                    } else {
                        logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(), "文件同步", "测试所选" + typeFile.getProtocol() + "文件服务是否可以连通失败!");
                        msg = "测试失败";
                    }
                } catch (Exception e) {
                    logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(), "文件同步", "测试所选" + typeFile.getProtocol() + "文件服务是否可以连通失败!");
                    msg = "测试失败,"+e.getMessage();
                }
            }else if("smb".equals(typeFile.getProtocol())){
                SmbFile smbFile = getSmbFile(typeFile.getServerAddress(),Integer.valueOf(typeFile.getPort()),typeFile.getUserName(),typeFile.getPassword(),typeFile.getDir());
                if(smbFile!=null){
                    isOk = true;
                    logger.info("测试成功!");
                    msg = "测试成功,点击[确定]返回";
                    logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"文件同步","测试所选"+typeFile.getProtocol()+"文件服务是否可以连通成功!");
                } else {
                    logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"文件同步","测试所选"+typeFile.getProtocol()+"文件服务是否可以连通失败!");
                    msg = "测试失败";
                }
            }else if("ftps".equals(typeFile.getProtocol())){
                logger.info("ftps未开通");
                msg = "测试失败,ftps服务未开通!";
                logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"文件同步","测试所选"+typeFile.getProtocol()+"文件服务是否可以连通失败!");
            }else if("WebDAV".equals(typeFile.getProtocol())){
                String url = "http://"+typeFile.getServerAddress() + ":" + typeFile.getPort() + "/" +typeFile.getDir();
                List<DavResource> sourceDavResource = null;
                try {
                    Sardine sardine = SardineFactory.begin(typeFile.getUserName(),typeFile.getPassword());
                    if(sardine.exists(url)){
                        sourceDavResource = sardine.list(url);
                    }
                }catch (IOException e){
                    logger.error("***遍历服务器目录出错，连接失败或服务器目录设置出错!!!***",e);
                    msg = e.getMessage();
                }
                if(sourceDavResource!=null) {
                    isOk = true;
                    logger.info("测试成功!");
                    msg = "测试成功,点击[确定]返回";
                    logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"文件同步","测试所选"+typeFile.getProtocol()+"文件服务是否可以连通成功!");
                } else {
                    logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"文件同步","测试所选"+typeFile.getProtocol()+"文件服务是否可以连通失败!");
                }
            }
        } catch (Exception e){
            logger.error("文件同步",e);
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"文件同步","测试所选"+typeFile.getProtocol()+"文件服务是否可以连通失败!");
            msg = "测试失败"+e.getMessage();
        }
        String json = "{success:true,msg:'"+msg+"',flag:"+isOk+"}";
        base.actionEnd(response,json,result);
        return null;
    }

    private FTPClient getFTPClient(String hostname, int port, String username, String password,String charset) throws IOException {
        FTPClient client = new FTPClient();
        client.connect(hostname, port);
        client.setControlEncoding(charset);
        if(FTPReply.isPositiveCompletion(client.getReplyCode())){
            if(client.login(username, password)){
                client.enterLocalPassiveMode();
                client.setFileType(FTPClient.BINARY_FILE_TYPE);
                return client;
            }
        }
        return null;
    }

    private void disconnect(FTPClient client) throws IOException{
        if(client.isConnected()){
            client.disconnect();
        }
    }

    private SmbFile getSmbFile(String hostname, int port, String username, String password,String dir){
        String url = "smb://" + username + ":" + password + "@" + hostname + ":" + port + dir;
        SmbFile smbFile = null;
        try {
            smbFile = new SmbFile(url);
            smbFile.connect();
            return smbFile;
        } catch (MalformedURLException e) {
        } catch (IOException e) {
            logger.error("[SMB同步]"+e.getMessage());
        }
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

    public TypeFile getTypeFile() {
        return typeFile;
    }

    public void setTypeFile(TypeFile typeFile) {
        this.typeFile = typeFile;
    }

    public DeleteStatusService getDeleteStatusService() {
        return deleteStatusService;
    }

    public void setDeleteStatusService(DeleteStatusService deleteStatusService) {
        this.deleteStatusService = deleteStatusService;
    }

    public String getAppName() {
        return appName;
    }

    public void setAppName(String appName) {
        this.appName = appName;
    }

    public String getPlugin() {
        return plugin;
    }

    public void setPlugin(String plugin) {
        this.plugin = plugin;
    }

    public XmlOperatorService getXmlOperatorService() {
        return xmlOperatorService;
    }

    public void setXmlOperatorService(XmlOperatorService xmlOperatorService) {
        this.xmlOperatorService = xmlOperatorService;
    }

    public boolean isPrivated() {
        return privated;
    }

    public void setPrivated(boolean privated) {
        this.privated = privated;
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

    public int getSpeed() {
        return speed;
    }

    public void setSpeed(int speed) {
        this.speed = speed;
    }
}
