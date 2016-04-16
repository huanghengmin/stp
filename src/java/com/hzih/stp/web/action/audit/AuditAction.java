package com.hzih.stp.web.action.audit;


import com.hzih.stp.domain.Account;
import com.hzih.stp.service.LoginService;
import com.hzih.stp.service.AuditService;
import com.hzih.stp.service.LogService;
import com.hzih.stp.utils.DateUtils;
import com.hzih.stp.utils.StringUtils;
import com.hzih.stp.web.SessionUtils;
import com.hzih.stp.web.action.ActionBase;
import com.inetec.common.security.DesEncrypterAsPassword;
import com.inetec.ichange.console.config.Constant;
import com.opensymphony.xwork2.ActionSupport;
import org.apache.log4j.Logger;
import org.apache.struts2.ServletActionContext;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Date;

/**
 * Created by IntelliJ IDEA.
 * User: 钱晓盼
 * Date: 12-6-19
 * Time: 上午9:55
 * To change this template use File | Settings | File Templates.
 * 日志审计
 */
public class AuditAction extends ActionSupport{
    private static final Logger logger = Logger.getLogger(AuditAction.class);
    private LogService logService;
    private AuditService auditService;
    private LoginService loginService;
    private int start;
    private int limit;

    public String selectUserAudit() throws Exception {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result =	actionBase.actionBegin(request);
        String json =  "{'success':true,'total':0,'rows':[]}";
        try {
            String startDateStr = request.getParameter("startDate");
            String endDateStr = request.getParameter("endDate");
            String logLevel = request.getParameter("logLevel");
            String userName = request.getParameter("userName");
            Date startDate = StringUtils.isBlank(startDateStr) ? null : DateUtils
            				.parse(startDateStr, "yyyy-MM-dd");
            Date endDate = StringUtils.isBlank(endDateStr) ? null : DateUtils
            				.parse(endDateStr, "yyyy-MM-dd");

            json = auditService.selectUserAudit(start/limit+1, limit,startDate,endDate,logLevel,userName );
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(), "管理员日志审计","用户读取管理员日志审计信息成功 ");
        } catch (Exception e) {
            logger.error("管理员日志审计", e);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(), "管理员日志审计","用户读取管理员日志审计信息失败 ");
        }
        actionBase.actionEnd(response, json, result);
        return null;
    }

    /**
     * 读取系统审计日志
     * @return
     * @throws Exception
     */
    public String selectOSAudit() throws Exception {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result =	actionBase.actionBegin(request);
        String json =  "{success:true,total:0,rows:[]}";
        try {
            String startDateStr = request.getParameter("startDate");
            String endDateStr = request.getParameter("endDate");
            String logLevel = request.getParameter("logLevel");
            Date startDate = StringUtils.isBlank(startDateStr) ? null : DateUtils
            				.parse(startDateStr, "yyyy-MM-dd");
            Date endDate = StringUtils.isBlank(endDateStr) ? null : DateUtils
            				.parse(endDateStr, "yyyy-MM-dd");

            json = auditService.selectOSAudit(start/limit+1, limit,startDate,endDate,logLevel );
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(), "系统日志审计","用户读取系统日志审计信息成功 ");
        } catch (Exception e) {
            logger.error("系统日志审计", e);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(), "系统日志审计","用户读取系统日志审计信息失败 ");
        }
        actionBase.actionEnd(response, json, result);
        return null;
    }


    /**
     * 读取设备日志审计
     * @return
     * @throws Exception
     */
    public String selectEquipmentAudit() throws Exception {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result =	actionBase.actionBegin(request);
        String json =  "{success:true,total:0,rows:[]}";
        try {
            String startDateStr = request.getParameter("startDate");
            String endDateStr = request.getParameter("endDate");
            String logLevel = request.getParameter("logLevel");
            String equipmentName = request.getParameter("equipmentName");
            Date startDate = StringUtils.isBlank(startDateStr) ? null : DateUtils
             				.parse(startDateStr, "yyyy-MM-dd");
            Date endDate = StringUtils.isBlank(endDateStr) ? null : DateUtils
              				.parse(endDateStr, "yyyy-MM-dd");
            json = auditService.selectEquipmentAudit(start/limit+1, limit,startDate,endDate,logLevel,equipmentName);
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(), "设备日志审计","用户读取设备日志审计信息成功 ");
        } catch (Exception e) {
            logger.error("设备日志审计", e);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(), "设备日志审计","用户读取设备日志审计信息失败 ");
        }
        actionBase.actionEnd(response, json, result);
        return null;
    }

    /**
     * 读取业务日志审计
     * @return
     * @throws Exception
     */
    public String selectBusinessAudit() throws Exception {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result =	actionBase.actionBegin(request);
        String json =  null;
        try {
            String startDateStr = request.getParameter("startDate");
            String endDateStr = request.getParameter("endDate");
            String businessType = request.getParameter("businessType");
            String businessName = request.getParameter("businessName");
            Date startDate = StringUtils.isBlank(startDateStr) ? null : DateUtils.parse(startDateStr, "yyyy-MM-dd");
            Date endDate = StringUtils.isBlank(endDateStr) ? null : DateUtils.parse(endDateStr, "yyyy-MM-dd");
            json = auditService.selectBusinessAudit(start/limit+1, limit,startDate,endDate,businessType,businessName);
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(), "业务日志审计","用户读取业务日志审计信息成功 ");
        } catch (Exception e) {
            logger.error("业务日志审计", e);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(), "业务日志审计","用户读取业务日志审计信息失败 ");
        }
        actionBase.actionEnd(response, json, result);
        return null;
    }


    public String truncateEquipment() throws Exception {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result =	actionBase.actionBegin(request);
        String msg = null;
        try {
            String startDate = request.getParameter("startDate");
            String endDate = request.getParameter("endDate");
            String logLevel = request.getParameter("logLevel");
            String equipmentName = request.getParameter("equipmentName");
            String password = request.getParameter("password");
            DesEncrypterAsPassword deap = new DesEncrypterAsPassword(Constant.S_PWD_ENCRYPT_CODE);
            String _password = new String(deap.encrypt(password.getBytes()));
            Account auditAccount = loginService.getAccountByNameAndPwd("auditadmin", _password);
            if(auditAccount!=null) {
                auditService.deleteEquipment(startDate,endDate,logLevel,equipmentName);
                msg = "清空成功,点击[确定]返回列表!";
                logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(), "设备日志审计","用户清空设备日志审计信息成功 ");
            } else {
                msg = "密码错误!";
                logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(), "设备日志审计","用户清空设备日志审计信息失败,密码错误 ");
            }
        } catch (Exception e) {
            logger.error("设备日志审计", e);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(), "设备日志审计","用户清空设备日志审计信息失败 ");
            msg = "清空失败"+e.getMessage();
        }
        String json =  "{success:true,msg:'"+msg+"'}";
        actionBase.actionEnd(response, json, result);
        return null;
    }


    public String truncateBusiness() throws Exception {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result =	actionBase.actionBegin(request);
        String msg = null;
        try {
            String startDate = request.getParameter("startDate");
            String endDate = request.getParameter("endDate");
            String businessType = request.getParameter("businessType");
            String businessName = request.getParameter("businessName");
            String password = request.getParameter("password");
            DesEncrypterAsPassword deap = new DesEncrypterAsPassword(Constant.S_PWD_ENCRYPT_CODE);
            String _password = new String(deap.encrypt(password.getBytes()));
            Account auditAccount = loginService.getAccountByNameAndPwd("auditadmin", _password);
            if(auditAccount!=null) {
                auditService.deleteBusiness(startDate,endDate,businessType,businessName);
                msg = "清空成功,点击[确定]返回列表!";
                logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(), "业务日志审计","用户清空设业务志审计信息成功 ");
            } else {
                msg = "密码错误!";
                logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(), "业务日志审计","用户清空设业务志审计信息失败,密码错误 ");
            }
        } catch (Exception e) {
            logger.error("业务日志审计", e);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(), "业务日志审计","用户清空业务日志审计信息失败 ");
            msg = "清空失败"+e.getMessage();
        }
        String json =  "{success:true,msg:'"+msg+"'}";
        actionBase.actionEnd(response, json, result);
        return null;
    }

    /**
     * 检查startDate和endDate,endDate必须大于startDate
     * @return
     * @throws Exception
     */
    public String checkDate() throws Exception {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result =	actionBase.actionBegin(request);
        String msg = null;
        boolean isClear = false;
        try {
            String startDate = request.getParameter("startDate");
            String endDate = request.getParameter("endDate");
            isClear = DateUtils.checkDate(startDate, endDate, "yyyy-MM-dd");
            msg = "校验成功";
        } catch (Exception e) {
            logger.error("校验时间大小", e);
            msg = "校验失败"+e.getMessage();
        }
        String json =  "{success:true,msg:'"+msg+"',clear:"+isClear+"}";
        actionBase.actionEnd(response, json, result);
        return null;
    }



    public LogService getLogService() {
        return logService;
    }

    public void setLogService(LogService logService) {
        this.logService = logService;
    }

    public AuditService getAuditService() {
        return auditService;
    }

    public void setAuditService(AuditService auditService) {
        this.auditService = auditService;
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

    public void setLoginService(LoginService loginService) {
        this.loginService = loginService;
    }
}
