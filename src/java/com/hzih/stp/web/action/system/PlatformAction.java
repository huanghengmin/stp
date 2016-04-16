package com.hzih.stp.web.action.system;


import com.hzih.stp.service.DataBaseService;
import com.hzih.stp.service.LogService;
import com.hzih.stp.service.XmlOperatorService;
import com.hzih.stp.utils.StringContext;
import com.hzih.stp.utils.StringUtils;
import com.hzih.stp.web.SessionUtils;
import com.hzih.stp.web.action.ActionBase;
import com.inetec.common.util.OSInfo;
import com.inetec.common.util.OSReBoot;
import com.inetec.common.util.OSShutDown;
import com.inetec.common.util.Proc;
import com.opensymphony.xwork2.ActionSupport;
import org.apache.log4j.Logger;
import org.apache.struts2.ServletActionContext;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Created by IntelliJ IDEA.
 * User: 钱晓盼
 * Date: 12-6-11
 * Time: 上午11:10
 * To change this template use File | Settings | File Templates.
 */
public class PlatformAction extends ActionSupport {

    private static final Logger logger = Logger.getLogger(PlatformAction.class);
    private DataBaseService dataBaseService;
    private LogService logService;

    /**
     * 系统重启
     * @return
     * @throws Exception
     */
    public String sysRestart() throws Exception {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result =	actionBase.actionBegin(request);
		String msg = null;
        try {
            if(StringUtils.getPrivated()){
                dataBaseService.operateDBUpdateApp(StringContext.EXTERNAL);
            }
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(), "平台管理","用户重启系统成功 ");
            Proc proc;
            OSInfo osinfo = OSInfo.getOSInfo();
            if (osinfo.isWin()) {
                proc = new Proc();
                proc.exec("nircmd service restart stp");
            }
            if (osinfo.isLinux()) {
                proc = new Proc();
                proc.exec("service stp restart");
            }
            Thread.sleep(1000*6);
            msg = "重启系统成功";
        } catch (Exception e) {
            logger.error("平台管理", e);
            logService.newLog("ERROE", SessionUtils.getAccount(request).getUserName(), "平台管理","用户重启系统失败 ");
            msg = "重启系统失败";
        }
        String json = "{success:true,msg:'"+msg+"'}";
        actionBase.actionEnd(response,json,result);
        return null;
	}

    /**
     * 设备重启
     * @return
     * @throws Exception
     */
    public String equipRestart() throws Exception {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result =	actionBase.actionBegin(request);
		String msg = null;
        try {
            if(StringUtils.getPrivated()){
                dataBaseService.operateDBUpdateApp(StringContext.EXTERNAL);
            }
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(), "平台管理","用户重启设备成功 ");
            OSReBoot.exec();
            Thread.sleep(1000*6);
            msg = "重启设备成功";
        } catch (Exception e) {
            logger.error("平台管理", e);
            logService.newLog("ERROE", SessionUtils.getAccount(request).getUserName(), "平台管理","用户重启设备失败 ");
            msg = "重启设备失败";
        }
        String json = "{success:true,msg:'"+msg+"'}";
        actionBase.actionEnd(response,json,result);
        return null;
	}

    /**
     * 设备关闭
     * @return
     * @throws Exception
     */
    public String equipShutdown() throws Exception {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result =	actionBase.actionBegin(request);
		String msg = null;
        try {
            if(StringUtils.getPrivated()){
                dataBaseService.operateDBUpdateApp(StringContext.EXTERNAL);
            }
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(), "平台管理","用户关闭设备成功 ");
            OSShutDown.exec();
            Thread.sleep(1000*6);
            msg = "关闭设备成功";
        } catch (Exception e) {
            logger.error("平台管理", e);
            logService.newLog("ERROE", SessionUtils.getAccount(request).getUserName(), "平台管理","用户关闭设备失败 ");
            msg = "关闭设备失败";
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

    public DataBaseService getDataBaseService() {
        return dataBaseService;
    }

    public void setDataBaseService(DataBaseService dataBaseService) {
        this.dataBaseService = dataBaseService;
    }
}
