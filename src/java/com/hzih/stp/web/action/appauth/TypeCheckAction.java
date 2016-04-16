package com.hzih.stp.web.action.appauth;

import com.hzih.stp.domain.TypeCheck;
import com.hzih.stp.service.LogService;
import com.hzih.stp.service.TypeCheckService;
import com.hzih.stp.web.SessionUtils;
import com.hzih.stp.web.action.ActionBase;
import com.opensymphony.xwork2.ActionSupport;
import org.apache.log4j.Logger;
import org.apache.struts2.ServletActionContext;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Created with IntelliJ IDEA.
 * User: 钱晓盼
 * Date: 12-7-26
 * Time: 下午6:31
 * 应用批注
 */
public class TypeCheckAction extends ActionSupport {
    private static final Logger logger = Logger.getLogger(TypeCheckAction.class);
    private TypeCheckService typeCheckService;
    private LogService logService;
    private TypeCheck typeCheck;
    private String[] ids;
    private String appName;
    private String appType;
    private String up;
    private int start;
    private int limit;
    public String insert() throws IOException {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase base = new ActionBase();
        String result =	base.actionBegin(request);
        String msg = null;
        try{
            typeCheck.setId(null);
            typeCheckService.insert(typeCheck);
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"审核批注","审核批注应用"+typeCheck.getAppName()+"新增成功!");
            msg = "新增成功,点击[确定]返回列表!";
        } catch (Exception e){
            logger.error("审核批注",e);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(),"审核批注","审核批注应用"+typeCheck.getAppName()+"新增失败!");
            msg = "新增失败";
        }
        String json = "{success:true,msg:'"+msg+"'}";
        base.actionEnd(response, json ,result);
        return null;
    }

    public String delete() throws IOException {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase base = new ActionBase();
        String result =	base.actionBegin(request);
        String msg = null;
        try{
            typeCheckService.delete(ids);
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"审核批注","审核批注应用删除成功!");
            msg = "删除成功,点击[确定]返回列表!";
        } catch (Exception e){
            logger.error("审核批注",e);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(),"审核批注","审核批注应用删除失败!");
            msg = "删除失败";
        }
        String json = "{success:true,msg:'"+msg+"'}";
        base.actionEnd(response, json ,result);
        return null;
    }

    public String update() throws IOException {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase base = new ActionBase();
        String result =	base.actionBegin(request);
        String msg = null;
        try{
            typeCheckService.update(typeCheck);
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"审核批注","审核批注应用"+typeCheck.getAppName()+"修改成功!");
            msg = "修改成功,点击[确定]返回列表!";
        } catch (Exception e){
            logger.error("审核批注",e);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(),"审核批注","审核批注应用"+typeCheck.getAppName()+"修改失败!");
            msg = "修改失败";
        }
        String json = "{success:true,msg:'"+msg+"'}";
        base.actionEnd(response, json ,result);
        return null;
    }

    public String select() throws IOException {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase base = new ActionBase();
        String result =	base.actionBegin(request);
        String json = null;
        try{
            json = typeCheckService.select(appName,appType,up,start,limit);
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"审核批注","审核批注应用"+appName+"读取成功!");
        } catch (Exception e){
            logger.error("审核批注",e);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(),"审核批注","审核批注应用"+appName+"读取失败!");
        }
        appName = null;
        appType = null;
        up = null;
        base.actionEnd(response, json ,result);
        return null;
    }

    public String change() throws IOException {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase base = new ActionBase();
        String result =	base.actionBegin(request);
        String msg = null;
        try{
            typeCheckService.update(ids);
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"审核批注","审核批注应用标记成已修改成功!");
            msg = "标记成功,点击[确定]返回列表!";
        } catch (Exception e){
            logger.error("审核批注",e);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(),"审核批注","审核批注应用标记成已修改失败!");
            msg = "标记失败";
        }
        String json = "{success:true,msg:'"+msg+"'}";
        base.actionEnd(response, json ,result);
        return null;
    }

    public TypeCheckService getTypeCheckService() {
        return typeCheckService;
    }

    public void setTypeCheckService(TypeCheckService typeCheckService) {
        this.typeCheckService = typeCheckService;
    }

    public LogService getLogService() {
        return logService;
    }

    public void setLogService(LogService logService) {
        this.logService = logService;
    }

    public TypeCheck getTypeCheck() {
        return typeCheck;
    }

    public void setTypeCheck(TypeCheck typeCheck) {
        this.typeCheck = typeCheck;
    }

    public String[] getIds() {
        return ids;
    }

    public void setIds(String[] ids) {
        this.ids = ids;
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

    public String getUp() {
        return up;
    }

    public void setUp(String up) {
        this.up = up;
    }
}
