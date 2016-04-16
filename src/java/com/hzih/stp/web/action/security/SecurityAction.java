package com.hzih.stp.web.action.security;

import com.hzih.stp.service.LogService;
import com.hzih.stp.service.SecurityService;
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
 * Created with IntelliJ IDEA.
 * User: 钱晓盼
 * Date: 12-8-13
 * Time: 下午2:42
 *报警信息处理
 */
public class SecurityAction extends ActionSupport {
    private static final Logger logger = Logger.getLogger(SecurityAction.class);
    private LogService logService;
    private SecurityService securityService;
    private XmlOperatorService xmlOperatorService;
    private String startDate;
    private String endDate;
    private String businessName;
    private String equipmentName;
    private String name;
    private String alertCode;
    private String read;
    private int start;
    private int limit;
    private String[] ids;
    private String eventType;

    public String selectBiz()throws IOException {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase base = new ActionBase();
        String result =	base.actionBegin(request);
        String json = null;
        try{
            json = securityService.selectBiz(start,limit,startDate,endDate,businessName,alertCode,read);
            logger.info("读取业务异常报警列表成功!");
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"业务异常报警","读取业务异常报警列表成功");
        }catch (Exception ex){
            logger.error("业务异常报警",ex);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(),"业务异常报警","读取业务异常报警列表失败");
            json = "{success:true,total:0,rows:[]}";
        }
        base.actionEnd(response, json ,result);
        return null;
    }

    public String biz()throws IOException {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase base = new ActionBase();
        String result =	base.actionBegin(request);
        String json = null;
        try{
            json = xmlOperatorService.readTypeNameForBusiness(StringContext.EXTERNALXML);
            logger.info("组建业务列表成功!");
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"组建业务列表","组建业务列表成功");
        }catch (Ex ex){
            logger.error("组建业务列表",ex);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(),"组建业务列表","组建业务列表失败");
        }
        base.actionEnd(response, json ,result);
        return null;
    }

    public String alertTypeBiz() throws IOException{
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase base = new ActionBase();
        String result =	base.actionBegin(request);
        String json = null;
        try{
            json = securityService.selectAlertTypeBiz();
            logger.info("组建业务异常列表成功!");
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"业务异常报警","组建业务异常列表成功");
        }catch (Exception ex){
            logger.error("业务异常报警",ex);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(),"业务异常报警","组建业务异常列表失败");
        }
        base.actionEnd(response, json ,result);
        return null;
    }

    public String setBizRead() throws IOException{
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase base = new ActionBase();
        String result =	base.actionBegin(request);
        String msg = null;
        try{
            securityService.setBizRead(ids);
            logger.info("标记业务异常记录为已读成功!");
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"业务异常报警","标记业务异常记录为已读成功");
            msg = "标记成功";
        }catch (Exception ex){
            logger.error("业务异常报警",ex);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(),"业务异常报警","标记业务异常记录为已读失败");
            msg = "标记失败";
        }
        String json = "{success:true,msg:'"+msg+"'}";
        base.actionEnd(response, json ,result);
        return null;
    }

    public String selectEqu()throws IOException {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase base = new ActionBase();
        String result =	base.actionBegin(request);
        String json = null;
        try{
            json = securityService.selectEqu(start,limit,startDate,endDate,equipmentName,read);
            logger.info("组建设备故障报警列表成功!");
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"设备故障报警","组建设备故障报警列表成功");
        }catch (Exception ex){
            logger.error("设备故障报警",ex);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(),"设备故障报警","组建设备故障报警列表失败");
            json = "{success:true,total:0,rows:[]}";
        }
        base.actionEnd(response, json ,result);
        return null;
    }

    public String setEquRead()throws IOException {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase base = new ActionBase();
        String result =	base.actionBegin(request);
        String msg = null;
        try{
            securityService.setEquRead(ids);
            logger.info("标记设备故障记录为已读成功!");
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"设备故障报警","标记设备故障记录为已读成功");
            msg = "标记成功";
        }catch (Exception ex){
            logger.error("设备故障报警",ex);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(),"设备故障报警","标记设备故障记录为已读失败");
            msg = "标记失败";
        }
        String json = "{success:true,msg:'"+msg+"'}";
        base.actionEnd(response, json ,result);
        return null;
    }

    public String equ()throws IOException {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase base = new ActionBase();
        String result =	base.actionBegin(request);
        String json = null;
        try{
            json = securityService.selectEquKeyValue();
            logger.info("组建设备名列表成功!");
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"组建设备名列表","组建设备名列表成功");
        }catch (Exception ex){
            logger.error("组建设备名列表",ex);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(),"组建设备名列表","组建设备名列表失败");
        }
        base.actionEnd(response, json ,result);
        return null;
    }

    public String selectEvent()throws IOException {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase base = new ActionBase();
        String result =	base.actionBegin(request);
        String json = null;
        try{
            json = securityService.selectEvent(start,limit,startDate,endDate,name,alertCode,read,eventType);
            logger.info("组建安全事件报警列表成功!");
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"安全事件报警","组建安全事件报警列表成功");
            name = null;
        }catch (Exception ex){
            logger.error("安全事件报警",ex);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(),"安全事件报警","组建安全事件报警列表失败");
            json = "{success:true,total:0,rows:[]}";
        }
        base.actionEnd(response, json ,result);
        return null;
    }

    public String alertTypeEvent()throws IOException {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase base = new ActionBase();
        String result =	base.actionBegin(request);
        String json = null;
        try{
            json = securityService.selectEventAlertTypeKeyValue();
            logger.info("组建安全事件报警类型列表成功!");
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"安全事件报警","组建安全事件报警类型列表成功");
        }catch (Exception ex){
            logger.error("安全事件报警",ex);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(),"安全事件报警","组建安全事件报警类型列表失败");
        }
        base.actionEnd(response, json ,result);
        return null;
    }

    public String setEventRead()throws IOException {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase base = new ActionBase();
        String result =	base.actionBegin(request);
        String msg = null;
        try{
            securityService.setEventRead(ids);
            logger.info("标记安全事件记录为已读成功!");
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"安全事件报警","标记安全事件记录为已读成功");
            msg = "标记成功";
        }catch (Exception ex){
            logger.error("安全事件报警",ex);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(),"安全事件报警","标记安全事件记录为已读失败");
            msg = "标记失败";
        }
        String json = "{success:true,msg:'"+msg+"'}";
        base.actionEnd(response, json ,result);
        return null;
    }

    public String system()throws IOException {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase base = new ActionBase();
        String result =	base.actionBegin(request);
        String json = null;
        try{
            json ="{success:true,total:0,rows:[]}";
            logger.info("组建系统事件列表成功!");
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"组建系统事件列表","组建系统事件列表成功");
        }catch (Exception ex){
            logger.error("组建系统事件列表",ex);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(),"组建系统事件列表","组建系统事件列表失败");
            json ="{success:true,total:0,rows:[]}";
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

    public SecurityService getSecurityService() {
        return securityService;
    }

    public void setSecurityService(SecurityService securityService) {
        this.securityService = securityService;
    }

    public XmlOperatorService getXmlOperatorService() {
        return xmlOperatorService;
    }

    public void setXmlOperatorService(XmlOperatorService xmlOperatorService) {
        this.xmlOperatorService = xmlOperatorService;
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }

    public String getBusinessName() {
        return businessName;
    }

    public void setBusinessName(String businessName) {
        this.businessName = businessName;
    }

    public String getAlertCode() {
        return alertCode;
    }

    public void setAlertCode(String alertCode) {
        this.alertCode = alertCode;
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

    public String[] getIds() {
        return ids;
    }

    public void setIds(String[] ids) {
        this.ids = ids;
    }

    public String getEquipmentName() {
        return equipmentName;
    }

    public void setEquipmentName(String equipmentName) {
        this.equipmentName = equipmentName;
    }

    public String getRead() {
        return read;
    }

    public void setRead(String read) {
        this.read = read;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEventType() {
        return eventType;
    }

    public void setEventType(String eventType) {
        this.eventType = eventType;
    }
}
