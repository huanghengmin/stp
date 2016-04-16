package com.hzih.stp.web.action.appauth;

import com.hzih.stp.service.DataBaseService;
import com.hzih.stp.service.LogService;
import com.hzih.stp.service.XmlOperatorService;
import com.hzih.stp.utils.ServiceResponse;
import com.hzih.stp.utils.ServiceUtil;
import com.hzih.stp.utils.StringContext;
import com.hzih.stp.utils.StringUtils;
import com.hzih.stp.web.SessionUtils;
import com.hzih.stp.web.action.ActionBase;
import com.hzih.stp.web.action.app.AppTypeAction;
import com.opensymphony.xwork2.ActionSupport;
import org.apache.log4j.Logger;
import org.apache.struts2.ServletActionContext;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Created with IntelliJ IDEA.
 * User: 钱晓盼
 * Date: 12-8-20
 * Time: 下午2:50
 * To change this template use File | Settings | File Templates.
 */
public class ConfigSendAction extends ActionSupport {
    private static final Logger logger = Logger.getLogger(AppTypeAction.class);
    private LogService logService;
	private XmlOperatorService xmlOperatorService;
    private DataBaseService dataBaseService;

    public String send() throws IOException {
        HttpServletRequest request = ServletActionContext.getRequest();
		HttpServletResponse response = ServletActionContext.getResponse();
		ActionBase base = new ActionBase();
		String result =	base.actionBegin(request);
        String msg = null;
        try{
            String[][] params = new String[][] {
                    { "SERVICEREQUESTTYPE", "SERVICECONTROLPOST" },
                    { "Command", "configsend" }
            };
            ServiceResponse serviceResponse = ServiceUtil.callService(params);
            if (serviceResponse.getCode()==200) {
                logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"发送配置","发送配置文件成功!");
//                msg = "<font color=\"green\">发送成功</font>";
                if(!StringUtils.getPrivated()){
                    logger.info("进入数据库处理...");
                    dataBaseService.operateDBUpdateApp(StringContext.EXTERNAL);
                }
                xmlOperatorService.updateTypeAppSend(null,StringContext.INIT_APP);
                logService.newSysLog("INFO","审核管理","修改应用状态","发送配置文件成功后,设置应用的状态为0");
                msg = "<font color=\"green\">发送成功,设置状态成功</font>";
            } else {
                msg = "<font color=\"red\">发送失败:"+serviceResponse.getCode()+"</font>";
            }
        } catch (Exception e){
            logger.error("发送配置",e);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(),"发送配置","发送配置文件失败!");
            msg = "<font color=\"red\">发送失败!</font>";
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

    public XmlOperatorService getXmlOperatorService() {
        return xmlOperatorService;
    }

    public void setXmlOperatorService(XmlOperatorService xmlOperatorService) {
        this.xmlOperatorService = xmlOperatorService;
    }

    public DataBaseService getDataBaseService() {
        return dataBaseService;
    }

    public void setDataBaseService(DataBaseService dataBaseService) {
        this.dataBaseService = dataBaseService;
    }
}
