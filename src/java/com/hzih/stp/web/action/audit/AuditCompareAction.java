package com.hzih.stp.web.action.audit;

import cn.collin.commons.utils.DateUtils;
import com.hzih.stp.domain.AuditReset;
import com.hzih.stp.service.AuditService;
import com.hzih.stp.service.LogService;
import com.hzih.stp.utils.FileUtil;
import com.hzih.stp.utils.StringContext;
import com.hzih.stp.utils.StringUtils;
import com.hzih.stp.web.SessionUtils;
import com.hzih.stp.web.action.ActionBase;
import com.opensymphony.xwork2.ActionSupport;
import org.apache.log4j.Logger;
import org.apache.struts2.ServletActionContext;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.StringTokenizer;

/**
 * Created with IntelliJ IDEA.
 * User: 钱晓盼
 * Date: 12-8-1
 * Time: 上午11:12
 * To change this template use File | Settings | File Templates.
 */
public class AuditCompareAction extends ActionSupport {
    private static final Logger logger = Logger.getLogger(AuditCompareAction.class);
    private LogService logService;
    private AuditService auditService;
    private int start;
    private int limit;
    private String[] fileNames;
    private String[] businessNames;
    private String[] businessTypes;
    private String[] date;
    private String fileName;
    private String businessName;

    public String select() throws IOException{
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result =	actionBase.actionBegin(request);
        String json =  null;
        try {
            String startDateStr = request.getParameter("startDate");
            String endDateStr = request.getParameter("endDate");
            String businessName = request.getParameter("businessName");
            String businessType = request.getParameter("businessType");
            Date startDate = StringUtils.isBlank(startDateStr) ? null : DateUtils.parse(startDateStr, "yyyy-MM-dd");
            Date endDate = StringUtils.isBlank(endDateStr) ? null : DateUtils.parse(endDateStr, "yyyy-MM-dd");
            json = auditService.selectBusinessCompareAudit(start / limit + 1, limit, startDate, endDate, businessType, businessName);
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(), "业务审计比对","用户读取业务审计比对信息成功 ");
        } catch (Exception e) {
            logger.error("业务审计比对", e);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(), "业务审计比对","用户读取业务审计比对信息失败 ");
            json = "{success:true,total:0,rows:[]}";
        }
        actionBase.actionEnd(response, json, result);
        return null;
    }

    public String export() throws IOException{
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result =	actionBase.actionBegin(request);
        String msg =  null;
        String fileName =  null;
        try {
            List<AuditReset> list =  setAuditReset(businessTypes, businessNames, fileNames,date);
            fileName = FileUtil.export(list);
            auditService.updateBusinessLogDBFlag(list);
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(), "业务审计比对","用户导出业务审计比对信息结果为业务手动重传文件成功 ");
            msg = "导出成功,点击[确定]返回页面列表";
        } catch (Exception e) {
            logger.error("业务审计比对", e);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(), "业务审计比对","用户导出业务审计比对信息结果为业务手动重传文件失败 ");
            msg = "导出失败";
        }
        String json = "{success:true,msg:'"+msg+"',fileName:'"+fileName+"'}";
        actionBase.actionEnd(response, json, result);
        return null;
    }

    private List<AuditReset> setAuditReset(String[] businessTypes, String[] businessNames, String[] fileNames,String[] date) {
        List<AuditReset> list = new ArrayList<>();
        for (int i=0;i<fileNames.length;i++){
            AuditReset a = new AuditReset();
            a.setFileName(fileNames[i]);
            a.setBusinessName(businessNames[i]);
            a.setBusinessType(businessTypes[i]);
            a.setDate(date[i]);
            list.add(a);
        }
        return list;
    }

    public String exportByBusinessName() throws IOException{
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result =	actionBase.actionBegin(request);
        String msg =  null;
        String fileName = null;
        try {
            List<AuditReset> list = auditService.selectBusinessCompareAudit(businessName);
            fileName = FileUtil.export(list);
//            auditService.updateBusinessLogFlag(list);
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(), "业务审计比对", "用户导出业务" + businessName + "的审计比对信息结果为业务手动重传文件成功 ");
            msg = "导出成功,点击[确定]返回页面列表";
        } catch (Exception e) {
            logger.error("业务审计比对", e);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(), "业务审计比对", "用户导出业务" + businessName + "的审计比对信息结果为业务手动重传文件失败 ");
            msg = "导出失败";
        }
        String json = "{success:true,msg:'"+msg+"',fileName:'"+fileName+"'}";
        actionBase.actionEnd(response, json, result);
        return null;
    }

    public String deleteFile() throws IOException {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result =	actionBase.actionBegin(request);
        String msg =  null;
        try {
            for (int i=0;i<fileNames.length;i++) {
                File file = new File(StringContext.RESETFILEPATH+"/"+fileNames[i]);
                file.delete();
            }
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(), "业务审计比对","用户删除导出的业务手动重传文件成功 ");
            msg = "删除成功,点击[确定]返回页面列表";
        } catch (Exception e) {
            logger.error("业务审计比对", e);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(), "业务审计比对","用户删除导出的业务手动重传文件失败 ");
            msg = "删除失败";
        }
        String json = "{success:true,msg:'"+msg+"'}";
        actionBase.actionEnd(response, json, result);
        return null;
    }

    public String selectFile() throws Exception{
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result =	actionBase.actionBegin(request);
		String json = null;
        try {
            json = FileUtil.readFileNames(StringContext.RESETFILEPATH,start,limit);
            logService.newLog("INFO",  SessionUtils.getAccount(request).getUserName(), "业务审计比对","用户获取业务审计比对导出文件名称、大小信息成功");
        } catch (Exception e) {
            logger.error("业务审计比对", e);
            logService.newLog("ERROE", SessionUtils.getAccount(request).getUserName(), "业务审计比对","用户获取业务审计比对导出文件名称、大小信息失败");
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
            String Agent = request.getHeader("User-Agent");
            StringTokenizer st = new StringTokenizer(Agent,";");
//            st.nextToken();
            //得到用户的浏览器名  MSIE  Firefox
            String userBrowser = st.nextToken();
            String path = StringContext.RESETFILEPATH +"/" + fileName;
            File source = new File(path);
            String name = source.getName();
            FileUtil.downType(response,name,userBrowser);
            response = FileUtil.copy(source, response);
            logger.info("下载" + fileName + "成功!");
            logService.newLog("INFO",  SessionUtils.getAccount(request).getUserName(), "业务审计比对","用户业务审计比对下载导出文件成功");
            json = "{success:true}";
        } catch (Exception e) {
            logger.error("业务审计比对", e);
            logService.newLog("ERROE", SessionUtils.getAccount(request).getUserName(), "业务审计比对","用户业务审计比对下载导出文件失败");
        }
        actionBase.actionEnd(response,json,result);
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

    public String[] getFileNames() {
        return fileNames;
    }

    public void setFileNames(String[] fileNames) {
        this.fileNames = fileNames;
    }

    public String[] getBusinessNames() {
        return businessNames;
    }

    public void setBusinessNames(String[] businessNames) {
        this.businessNames = businessNames;
    }

    public String[] getBusinessTypes() {
        return businessTypes;
    }

    public void setBusinessTypes(String[] businessTypes) {
        this.businessTypes = businessTypes;
    }

    public String[] getDate() {
        return date;
    }

    public void setDate(String[] date) {
        this.date = date;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getBusinessName() {
        return businessName;
    }

    public void setBusinessName(String businessName) {
        this.businessName = businessName;
    }
}
