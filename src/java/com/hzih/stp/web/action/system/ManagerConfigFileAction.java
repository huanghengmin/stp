package com.hzih.stp.web.action.system;

import com.hzih.stp.service.LogService;
import com.hzih.stp.utils.FileUtil;
import com.hzih.stp.utils.StringContext;
import com.hzih.stp.web.SessionUtils;
import com.hzih.stp.web.action.ActionBase;
import com.inetec.common.config.stp.ConfigParser;
import com.inetec.common.config.stp.nodes.Channel;
import com.inetec.common.exception.Ex;
import com.opensymphony.xwork2.ActionSupport;
import org.apache.log4j.Logger;
import org.apache.struts2.ServletActionContext;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.util.StringTokenizer;

/**
 * Created with IntelliJ IDEA.
 * User: 钱晓盼
 * Date: 12-7-27
 * Time: 下午3:24
 * To change this template use File | Settings | File Templates.
 */
public class ManagerConfigFileAction extends ActionSupport {
    private static final Logger logger = Logger.getLogger(ManagerConfigFileAction.class);
    private LogService logService;
    private String type;
    private File uploadFile;
    private String uploadFileFileName;
    private String uploadFileContentType;
    public String download() throws IOException {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result =	actionBase.actionBegin(request);
        String Agent = request.getHeader("User-Agent");
		StringTokenizer st = new StringTokenizer(Agent,";");
//		st.nextToken();
		//得到用户的浏览器名  MSIE  Firefox
		String userBrowser = st.nextToken();
		String path = null;
		try{
            if (type.equals("inner")) {
                logger.info("下载:可信config.xml开始");
                path = StringContext.INTERNALXML;
                File source = new File(path);
                String name = source.getName();
                FileUtil.downType(response,name,userBrowser);
                response = FileUtil.copy(source, response);
                logger.info("下载:可信config.xml成功");
            } else if (type.equals("out")) {
                logger.info("下载:非可信config.xml开始");
                path = StringContext.EXTERNALXML;
                File source = new File(path);
                String name = source.getName();
                FileUtil.downType(response,name,userBrowser);
                response = FileUtil.copy(source, response);
                logger.info("下载:非可信config.xml成功");
            }
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"配置文件管理","下载文件成功!");
        } catch (Exception e){
            logger.error("配置文件管理-下载文件",e);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(),"配置文件管理","下载文件失败!");
        }
        String json = "{success:true}";
        actionBase.actionEnd(response,json,result);
        return null;
    }

    public String upload() throws IOException {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result =	actionBase.actionBegin(request);
        String msg = null;
        try{
            if(uploadFileFileName.equals("config.xml")){
                boolean isFile = checkFile();
                if(isFile) {
                    msg = uploadXml(request);
                }  else {
                    msg = "上传的config.xml文件结构不对";
                    logService.newLog("WARN", SessionUtils.getAccount(request).getUserName(),"配置文件管理",msg);
                }
            } else {
                msg = "文件名必须是config.xml!";
                logService.newLog("WARN", SessionUtils.getAccount(request).getUserName(),"配置文件管理",msg);
            }
        }catch (Exception e){
            logger.error("配置文件管理-上传文件",e);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(),"配置文件管理","上传文件失败!");
            msg = "上传失败!";
        }
        String json = "{success:true,msg:'"+msg+"'}";
        actionBase.actionEnd(response,json,result);
        return null;
    }

    private boolean checkFile() {
        try {
            ConfigParser config = new ConfigParser(new FileInputStream(uploadFile)) ;
            Channel channel = config.getRoot().getChannel("1");
            return true;
        } catch (Ex ex) {
            logger.error("上传的config.xml文件结构不对"+ex.getMessage());
        } catch (FileNotFoundException e) {
            logger.error("找不到上传的config.xml临时文件"+e.getMessage());
        } catch (Exception e) {
            logger.error("上传的config.xml文件结构不对"+e.getMessage());
        }
        return false;
    }

    private String uploadXml(HttpServletRequest request) throws IOException {
    	String msg = null;
    	if(type.equals("inner")){
            File file = new File(StringContext.INTERNALXMLPATH);
            upload(file,StringContext.INTERNALXMLPATH);
            File[] files = file.listFiles(new FilenameFilter() {
                public boolean accept(File file, String s) {
                    if(s.equals("config.xml")){
                        return true;
                    }
                    return false;
                }
            });
            if(files.length>0){
                msg = "上传成功,点击[确定]返回页面!";
                logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"配置文件管理","上传成功");
            }else{
              	msg = "可信端配置文件上传失败!";
                logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(),"配置文件管理","上传失败");
            }
        }else if(type.equals("out")){
            File file = new File(StringContext.EXTERNALXMLPATH);
            upload(file,StringContext.EXTERNALXMLPATH);
            File[] files = file.listFiles(new FilenameFilter() {
                public boolean accept(File file, String s) {
                    if (s.equals("config.xml")) {
                        return true;
                    }
                    return false;
                }
            });
            if(files.length>0){
                msg = "非可信端配置文件上传成功!";
                logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"配置文件管理","上传成功");
            }else{
              	msg = "非可信端配置文件上传失败!";
                logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(),"配置文件管理","上传失败");
            }
        }
		return msg;
	}

	private void upload(File file,String savePath) throws IOException {
        if(!file.exists()){
            file.mkdir();
        }else{
            File[] files = file.listFiles();
            for(File f : files){
                f.delete();
            }
        }
        String newFile = savePath + "/" + uploadFileFileName;
        FileUtil.copy(uploadFile, newFile);
    }

    public void setLogService(LogService logService) {
        this.logService = logService;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public File getUploadFile() {
        return uploadFile;
    }

    public void setUploadFile(File uploadFile) {
        this.uploadFile = uploadFile;
    }

    public String getUploadFileFileName() {
        return uploadFileFileName;
    }

    public void setUploadFileFileName(String uploadFileFileName) {
        this.uploadFileFileName = uploadFileFileName;
    }

    public String getUploadFileContentType() {
        return uploadFileContentType;
    }

    public void setUploadFileContentType(String uploadFileContentType) {
        this.uploadFileContentType = uploadFileContentType;
    }
}
