package com.hzih.stp.service.impl;

import cn.collin.commons.domain.PageResult;
import com.hzih.stp.dao.*;
import com.hzih.stp.domain.*;
import com.hzih.stp.service.SecurityService;
import com.hzih.stp.utils.DateUtils;


import java.util.Date;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: 钱晓盼
 * Date: 12-8-13
 * Time: 下午2:47
 * To change this template use File | Settings | File Templates.
 */
public class SecurityServiceImpl implements SecurityService {
    private BusinessSecurityAlertDao businessSecurityAlertDao;
    private BusinessSecurityAlertTypeDao businessSecurityAlertTypeDao;
    private EquipmentDao equipmentDao;
    private EquipmentSecurityAlertDao equipmentSecurityAlertDao;
    private SafeEventSecurityAlertDao safeEventSecurityAlertDao;
    private SafeEventSecurityAlertTypeDao safeEventSecurityAlertTypeDao;

    @Override
    public String selectBiz(int start, int limit, String startDate,
                            String endDate, String businessName, String alertCode, String read) throws Exception {
        PageResult ps = businessSecurityAlertDao.listByPage(start/limit+1,limit,
                startDate,endDate,businessName,alertCode,read);
        int total = ps.getAllResultsAmount();
        List<BusinessSecurityAlert> list = ps.getResults();
        String json = "{success:true,total:"+total+",rows:[";
        for (BusinessSecurityAlert alert : list) {
            json += "{id:"+alert.getId()+",alertTime:'"+ DateUtils.formatDate(alert.getAlertTime(),"yyyy-MM-dd HH:mm:ss")+
                    "',businessName:'"+alert.getBusinessName()+"',alertType:'"+getAlertType(alert.getAlertTypeCode())+
                    "',alertInfo:'"+alert.getAlertInfo()+"',ip:'"+alert.getIp()+
                    "',isRead:'"+alert.getRead()+"',userName:'"+alert.getUserName()+"'},";
        }
        json += "]}";
        return json;
    }

    @Override
    public String selectAlertTypeBiz() throws Exception {
        List<BusinessSecurityAlertType> list = businessSecurityAlertTypeDao.findAll();
        int total = list.size();
        String json = "{success:true,total:"+total+",rows:[";
        for (BusinessSecurityAlertType alert : list) {
            json += "{key:'"+alert.getName()+"',value:'"+alert.getCode()+ "'},";
        }
        json += "]}";
        return json;
    }

    @Override
    public void setBizRead(String[] ids) throws Exception {
        for(int i=0;i<ids.length;i++){
            BusinessSecurityAlert old = (BusinessSecurityAlert) businessSecurityAlertDao.getById(Long.valueOf(ids[i]));
            old.setRead("Y");
            businessSecurityAlertDao.update(old);
        }
    }

    @Override
    public String selectEqu(int start, int limit, String startDate, String endDate, String equipmentName, String read) throws Exception {
        PageResult ps = equipmentSecurityAlertDao.listByPage(start/limit+1,limit,
                startDate,endDate,equipmentName,read);
        int total = ps.getAllResultsAmount();
        List<EquipmentSecurityAlert> list = ps.getResults();
        String json = "{success:true,total:"+total+",rows:[";
        for (EquipmentSecurityAlert alert : list) {
            Equipment equ = equipmentDao.findByName(alert.getEquipmentName());
            String equipmentDesc = equ==null?alert.getEquipmentName():equ.getEquipmentDesc();
            json += "{id:"+alert.getId()+",alertTime:'"+DateUtils.formatDate(alert.getAlertTime(),"yyyy-MM-dd HH:mm:ss")+
                    "',equName:'"+(equ==null?alert.getEquipmentName():equipmentDesc)+"',alertInfo:'"+alert.getAlertInfo()+
                    "',ip:'"+alert.getIp()+"',isRead:'"+alert.getRead()+"'},";
        }
        json += "]}";
        return json;
    }

    @Override
    public String selectEquKeyValue() throws Exception {
        List<Equipment> list = equipmentDao.findAll();
        int total = list.size();
        String json = "{success:true,total:"+total+",rows:[";
        for (Equipment equ : list) {
            json += "{value:'"+equ.getEquipmentName()+"',key:'"+equ.getEquipmentDesc()+"'},";
        }
        json += "]}";
        return json;
    }

    @Override
    public void setEquRead(String[] ids) throws Exception {
        for(int i=0;i<ids.length;i++){
            EquipmentSecurityAlert old = (EquipmentSecurityAlert) equipmentSecurityAlertDao.getById(Long.valueOf(ids[i]));
            old.setRead("Y");
            equipmentSecurityAlertDao.update(old);
        }
    }

    @Override
    public String selectEvent(int start, int limit, String startDate, String endDate,
                              String name, String alertCode, String read, String eventType) throws Exception {
        PageResult ps = safeEventSecurityAlertDao.listByPage(start/limit+1,limit,
                startDate,endDate,name,alertCode,read,eventType );
        int total = ps.getAllResultsAmount();
        List<SafeEventSecurityAlert> list = ps.getResults();
        String json = "{success:true,total:"+total+",rows:[";
        for (SafeEventSecurityAlert alert : list) {
            String equipmentDesc = null;
            if("equipment".equals(eventType)) {
                Equipment equ = equipmentDao.findByName(alert.getName());
                equipmentDesc = equ==null?alert.getName():equ.getEquipmentDesc();
            }
            json += "{id:"+alert.getId()+",alertTime:'"+DateUtils.formatDate(alert.getAlertTime(),"yyyy-MM-dd HH:mm:ss")+
                    "',name:'"+(equipmentDesc==null?alert.getName():equipmentDesc)+"',objType:'"+alert.getObjType()+
                    "',alertInfo:'"+alert.getAlertInfo()+
                    "',ip:'"+alert.getIp()+"',isRead:'"+alert.getRead()+
                    "',alertType:'"+getEventAlertType(alert.getAlertTypeCode())+"'},";
        }
        json += "]}";
        return json;
    }

    @Override
    public String selectEventAlertTypeKeyValue() throws Exception {
         List<SafeEventSecurityAlertType> list = safeEventSecurityAlertTypeDao.findAll();
        int total = list.size();
        String json = "{success:true,total:"+total+",rows:[";
        for (SafeEventSecurityAlertType type : list) {
            json += "{key:'"+type.getName()+"',value:'"+type.getCode()+"'},";
        }
        json += "]}";
        return json;
    }

    @Override
    public void setEventRead(String[] ids) throws Exception {
        for(int i=0;i<ids.length;i++){
            SafeEventSecurityAlert old = (SafeEventSecurityAlert) safeEventSecurityAlertDao.getById(Long.valueOf(ids[i]));
            old.setRead("Y");
            safeEventSecurityAlertDao.update(old);
        }
    }

    @Override
    public void addSecurityAlert(String serviceName, Date date, String alertType, String info, String read, String ipAddr) throws Exception {
        SafeEventSecurityAlert safeEventSecurityAlert = new SafeEventSecurityAlert();
        safeEventSecurityAlert.setAlertInfo(info);
        safeEventSecurityAlert.setAlertTime(date);
        safeEventSecurityAlert.setAlertTypeCode(alertType);
        safeEventSecurityAlert.setIp(ipAddr);
        safeEventSecurityAlert.setRead(read);
        safeEventSecurityAlert.setName(serviceName);
        safeEventSecurityAlert.setObjType("system");
        safeEventSecurityAlertDao.create(safeEventSecurityAlert);
    }

    private String getAlertType(String alertTypeCode) throws Exception{
        BusinessSecurityAlertType type = (BusinessSecurityAlertType) businessSecurityAlertTypeDao.getById(alertTypeCode);
        return type.getName();
    }

    private String getEventAlertType(String alertTypeCode) throws Exception {
        SafeEventSecurityAlertType type = (SafeEventSecurityAlertType) safeEventSecurityAlertTypeDao.getById(alertTypeCode);
        return type.getName();
    }



    public void setBusinessSecurityAlertDao(BusinessSecurityAlertDao businessSecurityAlertDao) {
        this.businessSecurityAlertDao = businessSecurityAlertDao;
    }

    public void setBusinessSecurityAlertTypeDao(BusinessSecurityAlertTypeDao businessSecurityAlertTypeDao) {
        this.businessSecurityAlertTypeDao = businessSecurityAlertTypeDao;
    }

    public void setEquipmentDao(EquipmentDao equipmentDao) {
        this.equipmentDao = equipmentDao;
    }

    public void setEquipmentSecurityAlertDao(EquipmentSecurityAlertDao equipmentSecurityAlertDao) {
        this.equipmentSecurityAlertDao = equipmentSecurityAlertDao;
    }

    public void setSafeEventSecurityAlertDao(SafeEventSecurityAlertDao safeEventSecurityAlertDao) {
        this.safeEventSecurityAlertDao = safeEventSecurityAlertDao;
    }

    public void setSafeEventSecurityAlertTypeDao(SafeEventSecurityAlertTypeDao safeEventSecurityAlertTypeDao) {
        this.safeEventSecurityAlertTypeDao = safeEventSecurityAlertTypeDao;
    }
}
