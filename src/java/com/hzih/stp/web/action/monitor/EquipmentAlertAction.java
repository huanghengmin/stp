package com.hzih.stp.web.action.monitor;

import com.hzih.stp.domain.EquipmentAlert;
import com.hzih.stp.service.EquipmentAlertService;
import com.hzih.stp.service.LogService;
import com.hzih.stp.utils.ServiceResponse;
import com.hzih.stp.utils.ServiceUtil;
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
 * Date: 12-8-3
 * Time: 下午2:18
 *设备告警信息
 */
public class EquipmentAlertAction extends ActionSupport {
    private static final Logger logger = Logger.getLogger(EquipmentAlertAction.class);
    private LogService logService;
    private EquipmentAlertService equipmentAlertService;
    private EquipmentAlert equipmentAlert;
    private String id;
    private String equipmentName;

    public String select() throws IOException{
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result = actionBase.actionBegin(request);
        String json = null;
        try{
            json = equipmentAlertService.select(Long.valueOf(id),equipmentName);
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"设备运行监控","读取设备CPU,内存和硬盘的告警阀值成功!");
        } catch (Exception e){
            logger.error("设备运行监控",e);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(),"设备运行监控","读取设备CPU,内存和硬盘的告警阀值失败!");
            json = "{success:true,total:1,rows:[cpu:'',memory:'',disk:'']}";
        }
        actionBase.actionEnd(response,json);
        return null;
    }

    public String selectDisplay() throws IOException{
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result = actionBase.actionBegin(request);
        String json = null;
        try{
            json = equipmentAlertService.selectDisplay(id,equipmentName);
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"设备运行监控","读取设备CPU,内存和硬盘的告警阀值成功!");
        } catch (Exception e){
            logger.error("设备运行监控",e);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(),"设备运行监控","读取设备CPU,内存和硬盘的告警阀值失败!");
            json = "{success:true,total:1,rows:[cpu:'',memory:'',disk:'']}";
        }
        actionBase.actionEnd(response,json);
        return null;
    }

    public String insertOrUpdate() throws IOException{
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result = actionBase.actionBegin(request);
        String msg = null;
        try{
            msg = equipmentAlertService.insertOrUpdate(equipmentAlert);
            try {
                String[][] params = new String[][] {
                        { "SERVICEREQUESTTYPE", "SERVICECONTROLPOST" },
                        { "Command", "restartservice" },
                        { "restarttype", "snmpmonitorservice" }
                };
                ServiceResponse serviceResponse = ServiceUtil.callService(params);
                if(serviceResponse.getCode()==200) {
                    msg += ",重启设备监控服务成功,</br>点击[确定]返回列表!";
                } else {
                    msg += ",重启设备监控服务失败,</br>点击[确定]返回列表!";
                }
            } catch (Exception ex) {
                msg = "修改成功,重启设备监控服务失败,</br>点击[确定]返回列表!";
                logger.error("重启设备监控服务失败", ex);
            }
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"设备运行监控","设置设备CPU,内存和硬盘的告警阀值成功!");

        } catch (Exception e){
            logger.error("设备运行监控",e);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(),"设备运行监控","设置设备CPU,内存和硬盘的告警阀值失败!");
            msg = "设置失败";
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

    public EquipmentAlertService getEquipmentAlertService() {
        return equipmentAlertService;
    }

    public void setEquipmentAlertService(EquipmentAlertService equipmentAlertService) {
        this.equipmentAlertService = equipmentAlertService;
    }

    public EquipmentAlert getEquipmentAlert() {
        return equipmentAlert;
    }

    public void setEquipmentAlert(EquipmentAlert equipmentAlert) {
        this.equipmentAlert = equipmentAlert;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getEquipmentName() {
        return equipmentName;
    }

    public void setEquipmentName(String equipmentName) {
        this.equipmentName = equipmentName;
    }
}
