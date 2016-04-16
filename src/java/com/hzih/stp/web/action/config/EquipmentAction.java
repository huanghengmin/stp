package com.hzih.stp.web.action.config;

import com.hzih.stp.domain.Equipment;
import com.hzih.stp.domain.EquipmentLog;
import com.hzih.stp.service.EquipmentService;
import com.hzih.stp.service.LogService;
import com.hzih.stp.utils.FileUtil;
import com.hzih.stp.utils.ServiceResponse;
import com.hzih.stp.utils.ServiceUtil;
import com.hzih.stp.utils.StringContext;
import com.hzih.stp.web.SessionUtils;
import com.hzih.stp.web.action.ActionBase;
import com.opensymphony.xwork2.ActionSupport;
import org.apache.commons.io.FileUtils;
import org.apache.commons.net.util.Base64;
import org.apache.log4j.Logger;
import org.apache.struts2.ServletActionContext;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.util.*;

/**
 * 设备管理
 */
public class EquipmentAction extends ActionSupport {

	private static final Logger logger = Logger.getLogger(EquipmentAction.class);
	private LogService logService;
    private EquipmentService equipmentService;
    private int start;
    private int limit;
    private Equipment equipment;
    private File uploadFile;
    private String uploadFileFileName;
    private String uploadFileContentType;
    private Long id;
    private String linkName;
    private String equipmentName;
    private String fileName;

	public String select() throws Exception {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result =	actionBase.actionBegin(request);
        String json = null;
        try{
            json = equipmentService.select(start,limit);
            logService.newLog("INFO",SessionUtils.getAccount(request).getUserName(),"设备管理","用户查找设备信息成功");

        } catch (Exception e){
            logger.error("设备管理",e);
            logService.newLog("ERROR",SessionUtils.getAccount(request).getUserName(),"设备管理","用户查找设备信息失败");
        }
        actionBase.actionEnd(response,json,result);
		return null;
	}

    public String insert() throws Exception {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result =	actionBase.actionBegin(request);
        String msg = null;
        try{
            equipment.setId(null);
            equipment.setEquTypeCode(equipment.getEquTypeCode().substring(0,equipment.getEquTypeCode().length()-1));
            if(equipment.getKeyDevice()==null){
                equipment.setKeyDevice("0");
            } else {
                if(equipment.getKeyDevice().equals("on")){
                    equipment.setKeyDevice("1");
                }
            }
            if(equipment.getMonitorUsed()==null){
                equipment.setMonitorUsed("0");
            } else {
                if(equipment.getMonitorUsed().equals("on")){
                    equipment.setMonitorUsed("1");
                }
            }
            if(uploadFile!=null){
                File file = new File(StringContext.EQUIPMENTSYSCONFIGPATH);
                if(!file.isDirectory()){
                    file.mkdirs();
                }
                try{
                    FileUtils.copyFile(uploadFile, new File(StringContext.EQUIPMENTSYSCONFIGPATH+"/"+uploadFileFileName));
                    equipment.setEquSysConfig(StringContext.EQUIPMENTSYSCONFIGPATH + "/" + uploadFileFileName);
                } catch (IOException e){
                    logger.error("设备管理--新增--上传文件",e);
                }
            }
            equipmentService.insert(equipment);
            msg = "新增成功,点击[确定]返回列表!";
            try {
                String[][] params = new String[][] {
                        { "SERVICEREQUESTTYPE", "SERVICECONTROLPOST" },
                        { "Command", "restartservice" },
                        { "restarttype", "snmpmonitorservice" }
                };
                ServiceResponse serviceResponse = ServiceUtil.callService(params);
                if(serviceResponse.getCode()==200) {
                    msg = "新增成功,重启设备监控服务成功,</br>点击[确定]返回列表!";
                } else {
                    msg = "新增成功,重启设备监控服务失败,</br>点击[确定]返回列表!";
                }
            } catch (Exception ex) {
                msg = "新增成功,重启设备监控服务失败,</br>点击[确定]返回列表!";
                logger.error("重启设备监控服务失败", ex);
            }
            logService.newLog("INFO",SessionUtils.getAccount(request).getUserName(),"设备管理","用户新增设备信息成功");
            EquipmentLog equipmentLog = new EquipmentLog();
            equipmentLog.setEquipmentName(equipment.getEquipmentName());
            equipmentLog.setLevel("INFO");
            equipmentLog.setLinkName(equipment.getLinkName());
            equipmentLog.setLogInfo("用户"+SessionUtils.getAccount(request).getUserName()+"新增一台设备"+equipment.getEquipmentDesc()+"成功");
            equipmentLog.setLogTime(new Date());
            logService.newEquipmentLog(equipmentLog);
        } catch (Exception e){
            logger.error("设备管理",e);
            logService.newLog("ERROR",SessionUtils.getAccount(request).getUserName(),"设备管理","用户新增设备信息失败");
            EquipmentLog equipmentLog = new EquipmentLog();
            equipmentLog.setEquipmentName(equipment.getEquipmentName());
            equipmentLog.setLevel("ERROR");
            equipmentLog.setLinkName(equipment.getLinkName());
            equipmentLog.setLogInfo("用户"+SessionUtils.getAccount(request).getUserName()+"新增一台设备"+equipment.getEquipmentDesc()+"失败");
            equipmentLog.setLogTime(new Date());
            logService.newEquipmentLog(equipmentLog);
            msg = "新增设备失败";
        }
        String json = "{success:true,msg:'"+msg+"'}";
        equipment = null;
        uploadFile = null;
        actionBase.actionEnd(response,json,result);
		return null;
	}

    public String delete() throws Exception {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result =	actionBase.actionBegin(request);
        String msg = null;
        String equipmentDesc = request.getParameter("equipmentDesc");
        try{
            equipmentService.delete(id);
            msg = "删除成功,点击[确定]返回列表!";
            try {
                String[][] params = new String[][] {
                        { "SERVICEREQUESTTYPE", "SERVICECONTROLPOST" },
                        { "Command", "restartservice" },
                        { "restarttype", "snmpmonitorservice" }
                };
                ServiceResponse serviceResponse = ServiceUtil.callService(params);
                if(serviceResponse.getCode()==200) {
                    msg = "删除成功,重启设备监控服务成功,</br>点击[确定]返回列表!";
                } else {
                    msg = "删除成功,重启设备监控服务失败,</br>点击[确定]返回列表!";
                }
            } catch (Exception ex) {
                msg = "删除成功,重启设备监控服务失败,</br>点击[确定]返回列表!";
                logger.error("重启设备监控服务失败", ex);
            }
            logService.newLog("INFO",SessionUtils.getAccount(request).getUserName(),"设备管理","用户删除设备信息成功");
            EquipmentLog equipmentLog = new EquipmentLog();
            equipmentLog.setEquipmentName(equipmentName);
            equipmentLog.setLevel("INFO");
            equipmentLog.setLinkName(linkName);
            equipmentLog.setLogInfo("用户"+SessionUtils.getAccount(request).getUserName()+"删除一台设备"+equipmentDesc+"成功");
            equipmentLog.setLogTime(new Date());
            logService.newEquipmentLog(equipmentLog);
        } catch (Exception e){
            logger.error("设备管理",e);
            logService.newLog("ERROR",SessionUtils.getAccount(request).getUserName(),"设备管理","用户删除设备信息失败");
            EquipmentLog equipmentLog = new EquipmentLog();
            equipmentLog.setEquipmentName(equipmentName);
            equipmentLog.setLevel("ERROR");
            equipmentLog.setLinkName(linkName);
            equipmentLog.setLogInfo("用户"+SessionUtils.getAccount(request).getUserName()+"删除一台设备"+equipmentDesc+"失败");
            equipmentLog.setLogTime(new Date());
            logService.newEquipmentLog(equipmentLog);
            msg = "删除设备失败";
        }
        String json = "{success:true,msg:'"+msg+"'}";
        equipment = null;
        actionBase.actionEnd(response,json,result);
		return null;
	}

    public String update() throws Exception {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result =	actionBase.actionBegin(request);
        String msg = null;
        try{
            equipment.setEquTypeCode(equipment.getEquTypeCode().substring(0,equipment.getEquTypeCode().length()-1));
            if(equipment.getKeyDevice()==null){
                equipment.setKeyDevice("0");
            } else {
                if(equipment.getKeyDevice().equals("on")){
                    equipment.setKeyDevice("1");
                }
            }
            if(equipment.getMonitorUsed()==null){
                equipment.setMonitorUsed("0");
            } else {
                if(equipment.getMonitorUsed().equals("on")){
                    equipment.setMonitorUsed("1");
                }
            }
            String oldEquipmentSysConfig = request.getParameter("oldEquipmentSysConfig");
            if(uploadFile!=null){
                File path = new File(StringContext.EQUIPMENTSYSCONFIGPATH);
                if(!path.isDirectory()){
                    path.mkdirs();
                }
                if(oldEquipmentSysConfig!=null || oldEquipmentSysConfig.length()!=0){
                    File file = new File(oldEquipmentSysConfig);
                    file.delete();
                }
                try{
                    FileUtils.copyFile(uploadFile, new File(StringContext.EQUIPMENTSYSCONFIGPATH+"/"+uploadFileFileName));
                    equipment.setEquSysConfig(StringContext.EQUIPMENTSYSCONFIGPATH + "/" + uploadFileFileName);
                } catch (IOException e){
                    logger.error("设备管理--修改--上传文件",e);
                }
            }else{
                equipment.setEquSysConfig(oldEquipmentSysConfig);
            }

            equipmentService.update(equipment);
            msg = "修改成功,点击[确定]返回列表!";
            try {
                String[][] params = new String[][] {
                        { "SERVICEREQUESTTYPE", "SERVICECONTROLPOST" },
                        { "Command", "restartservice" },
                        { "restarttype", "snmpmonitorservice" }
                };
                ServiceResponse serviceResponse = ServiceUtil.callService(params);
                if(serviceResponse.getCode()==200) {
                    msg = "修改成功,重启设备监控服务成功,</br>点击[确定]返回列表!";
                } else {
                    msg = "修改成功,重启设备监控服务失败,</br>点击[确定]返回列表!";
                }
            } catch (Exception ex) {
                msg = "修改成功,重启设备监控服务失败,</br>点击[确定]返回列表!";
                logger.error("重启设备监控服务失败", ex);
            }
            logService.newLog("INFO",SessionUtils.getAccount(request).getUserName(),"设备管理","用户修改设备信息成功");
            EquipmentLog equipmentLog = new EquipmentLog();
            equipmentLog.setEquipmentName(equipment.getEquipmentName());
            equipmentLog.setLevel("INFO");
            equipmentLog.setLinkName(equipment.getLinkName());
            equipmentLog.setLogInfo("用户"+SessionUtils.getAccount(request).getUserName()+"修改设备"+equipment.getEquipmentDesc()+"成功");
            equipmentLog.setLogTime(new Date());
            logService.newEquipmentLog(equipmentLog);
        } catch (Exception e){
            logger.error("设备管理",e);
            logService.newLog("ERROR",SessionUtils.getAccount(request).getUserName(),"设备管理","用户修改设备信息失败");
            EquipmentLog equipmentLog = new EquipmentLog();
            equipmentLog.setEquipmentName(equipment.getEquipmentName());
            equipmentLog.setLevel("ERROR");
            equipmentLog.setLinkName(equipment.getLinkName());
            equipmentLog.setLogInfo("用户"+SessionUtils.getAccount(request).getUserName()+"修改设备"+equipment.getEquipmentDesc()+"失败");
            equipmentLog.setLogTime(new Date());
            logService.newEquipmentLog(equipmentLog);
            msg = "修改设备失败";
        }
        String json = "{success:true,msg:'"+msg+"'}";
        equipment = null;
        uploadFile = null;
        actionBase.actionEnd(response,json,result);
		return null;
	}


    public String checkEquipmentName() throws Exception {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result =	actionBase.actionBegin(request);
        String msg = null;
        try{
            String equipmentName = request.getParameter("equipmentName");
            msg = equipmentService.checkEquipmentName(equipmentName);
            logService.newLog("INFO",SessionUtils.getAccount(request).getUserName(),"设备管理","用户检查新增设备编号是否已经存在成功");
        } catch (Exception e){
            logger.error("设备管理",e);
            logService.newLog("ERROR",SessionUtils.getAccount(request).getUserName(),"设备管理","用户检查新增设备编号是否已经存在失败");
            msg = "检查设备编号失败";
        }
        String json = "{success:true,msg:'"+msg+"'}";
        actionBase.actionEnd(response,json,result);
		return null;
	}

    public String checkEquipmentDesc() throws Exception {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result =	actionBase.actionBegin(request);
        String msg = null;
        try{
            String equipmentDesc = request.getParameter("equipmentDesc");
            msg = equipmentService.checkEquipmentDesc(equipmentDesc);
            logService.newLog("INFO",SessionUtils.getAccount(request).getUserName(),"设备管理","用户检查新增设备名["+equipmentDesc+"]是否已经存在成功");
        } catch (Exception e){
            logger.error("设备管理",e);
            logService.newLog("ERROR",SessionUtils.getAccount(request).getUserName(),"设备管理","用户检查新增设备名是否已经存在失败");
            msg = "检查设备名失败";
        }
        String json = "{success:true,msg:'"+msg+"'}";
        actionBase.actionEnd(response,json,result);
		return null;
	}


    public String selectDepartmentNameKeyValue() throws Exception {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result =	actionBase.actionBegin(request);
        String json = null;
        try{
            json = equipmentService.selectDepartmentNameKeyValue();
            logService.newLog("INFO",SessionUtils.getAccount(request).getUserName(),"设备管理","用户获取所有部门名列表成功");
        } catch (Exception e){
            logger.error("设备管理",e);
            logService.newLog("ERROR",SessionUtils.getAccount(request).getUserName(),"设备管理","用户获取所有部门名列表失败");
        }
        actionBase.actionEnd(response,json,result);
		return null;
	}

    public String selectEquipmentNameKeyValue() throws Exception {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result =	actionBase.actionBegin(request);
        String json = null;
        try{
            json = equipmentService.selectEquipmentNameKeyValue();
            logService.newLog("INFO",SessionUtils.getAccount(request).getUserName(),"设备日志审计","用户获取所有设备名列表成功");
        } catch (Exception e){
            logger.error("设备日志审计",e);
            logService.newLog("ERROR",SessionUtils.getAccount(request).getUserName(),"设备日志审计","用户获取所有设备名列表失败");
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
            st.nextToken();
            //得到用户的浏览器名  MSIE  Firefox
            String userBrowser = st.nextToken();
            File source = new File(fileName);
            String name = source.getName();
            FileUtil.downType(response,name,userBrowser);
            response = FileUtil.copy(source, response);
            logger.info("下载" + fileName + "成功!");
            logService.newLog("INFO",  SessionUtils.getAccount(request).getUserName(), "下载设备系统配置","用户下载设备系统配置成功");
            json = "{success:true}";
        } catch (Exception e) {
            logger.error("下载设备系统配置", e);
            logService.newLog("ERROE", SessionUtils.getAccount(request).getUserName(), "下载设备系统配置","用户下载设备系统配置失败");
        }
        actionBase.actionEnd(response,json,result);
        return null;
    }


    public void setLogService(LogService logService) {
        this.logService = logService;
    }

    public void setEquipmentService(EquipmentService equipmentService) {
        this.equipmentService = equipmentService;
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

    public Equipment getEquipment() {
        return equipment;
    }

    public void setEquipment(Equipment equipment) {
        this.equipment = equipment;
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

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLinkName() {
        return linkName;
    }

    public void setLinkName(String linkName) {
        this.linkName = linkName;
    }

    public String getEquipmentName() {
        return equipmentName;
    }

    public void setEquipmentName(String equipmentName) {
        this.equipmentName = equipmentName;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }
}
