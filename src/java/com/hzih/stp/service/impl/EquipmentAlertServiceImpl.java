package com.hzih.stp.service.impl;

import com.hzih.stp.dao.EquipmentAlertDao;
import com.hzih.stp.domain.EquipmentAlert;
import com.hzih.stp.service.EquipmentAlertService;
import com.hzih.stp.utils.ServiceResponse;
import com.hzih.stp.utils.ServiceUtil;
import org.apache.commons.net.util.Base64;
import org.apache.log4j.Logger;

/**
 * Created with IntelliJ IDEA.
 * User: 钱晓盼
 * Date: 12-8-3
 * Time: 下午2:38
 * To change this template use File | Settings | File Templates.
 */
public class EquipmentAlertServiceImpl implements EquipmentAlertService {
    private static Logger logger = Logger.getLogger(EquipmentAlertServiceImpl.class);
    private EquipmentAlertDao equipmentAlertDao;

    public void setEquipmentAlertDao(EquipmentAlertDao equipmentAlertDao) {
        this.equipmentAlertDao = equipmentAlertDao;
    }


    @Override
    public String select(Long id, String equipmentName) throws Exception {
        EquipmentAlert e = null;
        String json = null;
        try{
            e = (EquipmentAlert) equipmentAlertDao.getById(id);
            if(!e.getEquipmentName().equals(equipmentName)){
                e.setEquipmentName(equipmentName);
                equipmentAlertDao.update(e);
            }
            json = "{success:true,total:1,rows:[{cpu:'"+e.getCpu()+"',memory:'"+e.getMemory()+"',disk:'"+e.getDisk()+"'}]}";
        } catch (Exception ex){
            json = "{success:true,total:1,rows:[{cpu:'',memory:'',disk:''}]}";
        }
        return json;
    }

    @Override
    public String insertOrUpdate(EquipmentAlert equipmentAlert) throws Exception {
        EquipmentAlert e = null;
        try{
            e = (EquipmentAlert) equipmentAlertDao.getById(equipmentAlert.getId());
        } catch (Exception ex){
        }
        String msg = null;
        if(e!=null){
            e.setCpu(equipmentAlert.getCpu());
            e.setDisk(equipmentAlert.getDisk());
            e.setEquipmentName(equipmentAlert.getEquipmentName());
            e.setMemory(equipmentAlert.getMemory());
            equipmentAlertDao.update(e);
            msg = "修改成功";
        } else {
            equipmentAlertDao.create(equipmentAlert);
            msg = "新增成功";
        }
        return msg;
    }

    @Override
    public String selectDisplay(String id, String equipmentName) throws Exception {
        String json = null;
        try {
            String[][] params = new String[][] {
                    { "SERVICEREQUESTTYPE", "SERVICECONTROLPOST" },
                    { "Command", "devicemonitorextalert" },
                    { "linktype", "ext" },
                    { "deviceid", id }
            };
            ServiceResponse response = ServiceUtil.callService(params);
            if (response != null && response.getData() != null) {
                byte[] buf = new Base64().decode(response.getData());
                json = "{success:true,total:1,rows:["+new String(buf)+"]}";
            }
        } catch (Exception ex) {
            logger.error("从接口获取设备告警阀值出错", ex);
            json = "{success:true,total:1,rows:[{cpu:'',memory:'',disk:''}]}";
        }
        return json;
    }
}
