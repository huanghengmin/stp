package com.hzih.stp.web.action.system;

import com.hzih.stp.domain.Account;
import com.hzih.stp.service.LogService;
import com.hzih.stp.service.LoginService;
import com.hzih.stp.utils.FileUtil;
import com.hzih.stp.utils.StringContext;
import com.hzih.stp.web.SessionUtils;
import com.hzih.stp.web.action.ActionBase;
import com.inetec.common.client.ECommonUtilFactory;
import com.inetec.common.client.IECommonUtil;
import com.inetec.common.client.util.LogBean;
import com.inetec.common.client.util.XChange;
import com.inetec.common.security.DesEncrypterAsPassword;
import com.inetec.ichange.console.config.Constant;
import com.opensymphony.xwork2.ActionSupport;
import org.apache.log4j.Logger;
import org.apache.struts2.ServletActionContext;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.util.StringTokenizer;

/**
 * Created by IntelliJ IDEA.
 * User: 钱晓盼
 * Date: 12-6-11
 * Time: 下午1:04
 * To change this template use File | Settings | File Templates.
 */
public class ManagerLogAction extends ActionSupport{
    private static final Logger logger = Logger.getLogger(ManagerLogAction.class);
    private LogService logService;
    private LoginService loginService;
    private int start;
    private int limit;
    private String type;
	private String logName;

    public String readLocalLogName() throws Exception{
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result =	actionBase.actionBegin(request);
		String json = null;
        try {
            json = FileUtil.readFileNames(StringContext.localLogPath,start,limit);
            logService.newLog("INFO",  SessionUtils.getAccount(request).getUserName(), "日志下载","用户获取所有本地日志名称、大小信息成功");
        } catch (Exception e) {
            logger.error("日志下载", e);
            logService.newLog("ERROE", SessionUtils.getAccount(request).getUserName(), "日志下载","用户获取所有本地日志名称、大小信息失败");
        }
        actionBase.actionEnd(response,json,result);
        return null;
    }

    public String readRemoteLogName() throws Exception{
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result =	actionBase.actionBegin(request);
        String json = null;
        try {
            json = FileUtil.readRemoteFileNames();
            logService.newLog("INFO",  SessionUtils.getAccount(request).getUserName(), "日志下载","用户获取所有远程日志名称、大小信息成功");
        } catch (Exception e) {
            logger.error("日志下载", e);
            logService.newLog("ERROE", SessionUtils.getAccount(request).getUserName(), "日志下载","用户获取所有远程日志名称、大小信息失败");
        }
        actionBase.actionEnd(response,json,result);
        return null;
    }

    public String download() throws Exception {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result =	actionBase.actionBegin(request);
        String json = "{success:false}";
        try {
            if(logName!=null){
			    logger.info("下载:" + logName+"开始");
            }
            String Agent = request.getHeader("User-Agent");
            StringTokenizer st = new StringTokenizer(Agent,";");
//            st.nextToken();
            //得到用户的浏览器名  MSIE  Firefox
            String userBrowser = st.nextToken();
            String path = null;
            if ("internal_log".equals(type)) {
                path = StringContext.localLogPath +"/" + logName.split("\\(")[0];
                File source = new File(path);
                String name = source.getName();
                FileUtil.downType(response,name,userBrowser);
                response = FileUtil.copy(source, response);
                logger.info("下载" + logName.split("\\(")[0] + "成功!");
            }
            logService.newLog("INFO",  SessionUtils.getAccount(request).getUserName(), "日志下载","用户下载日志成功");
            json = "{success:true}";
        } catch (Exception e) {
            logger.error("日志下载", e);
            logService.newLog("ERROE", SessionUtils.getAccount(request).getUserName(), "日志下载","用户下载日志失败");
        }
        actionBase.actionEnd(response,json,result);
        return null;
    }

    public String clear() throws Exception {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result =	actionBase.actionBegin(request);
        String msg = null;
        try {
            String password = request.getParameter("password");
            DesEncrypterAsPassword deap = new DesEncrypterAsPassword(Constant.S_PWD_ENCRYPT_CODE);
            String _password = new String(deap.encrypt(password.getBytes()));
            Account auditAccount = loginService.getAccountByNameAndPwd("auditadmin", _password);
            if(auditAccount!=null) {
                String file = StringContext.localLogPath +"/" + logName.split("\\(")[0];
                File source = new File(file);
                FileOutputStream out = new FileOutputStream(source);
                out.write(0);
                out.flush();
                out.close();
                logger.info("用户"+SessionUtils.getAccount(request).getUserName()+"清空了日志");
                logService.newLog("INFO",  SessionUtils.getAccount(request).getUserName(), "日志下载","用户清空"+logName+"日志成功");
                msg = "清空成功,点击[确定]返回列表!";
            } else {
                msg = "密码错误!";
                logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(), "日志下载","用户清空"+logName+"日志失败,密码错误 ");
            }
        } catch (Exception e) {
            logger.error("日志下载", e);
            logService.newLog("ERROE", SessionUtils.getAccount(request).getUserName(), "日志下载","用户清空"+logName+"日志失败");
            msg = "清空失败!";
        }
        String json = "{success:true,msg:'"+msg+"'}";
        actionBase.actionEnd(response,json,result);
        return null;
    }

    public void setLogService(LogService logService) {
        this.logService = logService;
    }

    public void setLoginService(LoginService loginService) {
        this.loginService = loginService;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getLogName() {
        return logName;
    }

    public void setLogName(String logName) {
        this.logName = logName;
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
}
