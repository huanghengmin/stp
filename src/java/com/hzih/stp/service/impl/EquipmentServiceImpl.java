package com.hzih.stp.service.impl;

import cn.collin.commons.domain.PageResult;
import com.hzih.stp.dao.DepartmentDao;
import com.hzih.stp.dao.EquipmentAlertDao;
import com.hzih.stp.dao.EquipmentDao;
import com.hzih.stp.dao.EquipmentTypeDao;
import com.hzih.stp.domain.Department;
import com.hzih.stp.domain.Equipment;
import com.hzih.stp.domain.EquipmentAlert;
import com.hzih.stp.domain.EquipmentType;
import com.hzih.stp.service.EquipmentService;

import java.io.File;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: 钱晓盼
 * Date: 12-7-5
 * Time: 下午1:35
 * To change this template use File | Settings | File Templates.
 */
public class EquipmentServiceImpl implements EquipmentService{
    private EquipmentDao equipmentDao;
    private EquipmentTypeDao equipmentTypeDao;
    private DepartmentDao departmentDao;
    private EquipmentAlertDao equipmentAlertDao;

    /**
     * 组织设备名成为一组 {key:'',value:''}  列表
     * @return
     * @throws Exception
     */
    public String selectEquipmentNameKeyValue() throws Exception {
        List<Equipment> equipments = equipmentDao.findAll();
        int total = equipments.size();
        String json = "{success:true,total:"+total + ",rows:[";
        for (Equipment a : equipments) {
            json += "{key:'"+a.getEquipmentDesc()+"',value:'"+a.getEquipmentName()+"'},";
        }
        json += "]}";
        return json;
    }

    /**
     * 分页查找设备信息--并以json形式返回
     * @param start
     * @param limit
     * @return
     * @throws Exception
     */
    public String select(int start, int limit) throws Exception {
        PageResult ps = equipmentDao.listPageResult(start / limit + 1, limit, "");
        List<Equipment> equipments = ps.getResults();
        int total = ps.getAllResultsAmount();
        String json = "{success:true,total:"+total + ",rows:[";
        for (Equipment e : equipments) {
            json += "{id:"+e.getId()+",equipmentName:'"+e.getEquipmentName()+"',equipmentDesc:'"+e.getEquipmentDesc()+
                    "',linkType:'"+e.getLinkType()+"',linkName:'"+e.getLinkName()+
                    "',monitorUsed:'"+e.getMonitorUsed()+"',equipmentTypeName:'"+getEquipmentTypeName(e.getEquTypeCode())+
                    "',ip:'"+e.getIp()+"',otherIp:'"+e.getOtherIp()+ "',port:'"+e.getPort()+
                    "',isKeyDevice:'"+e.getKeyDevice()+"',mac:'"+e.getMac()+
                    "',subNetMask:'"+e.getSubNetMask()+"',equipmentTypeCode:'"+e.getEquTypeCode()+
                    "',equipmentSysConfig:'"+e.getEquSysConfig()+"',equipmentManagerDepartCode:'"+e.getEquManagerDepart()+
                    "',equipmentManagerDepartName:'"+getDepartmentName(e.getEquManagerDepart())+
                    "',oidName:'"+e.getOidName()+"',snmpVer:'"+e.getSnmpVer()+
                    "',auth:'"+e.getAuth()+"',common:'"+e.getCommon()+
                    "'},";
        }
        json += "]}";
        return json;
    }

    private String getDepartmentName(String equManagerDepartCode) {
        Department department = (Department) departmentDao.getById(equManagerDepartCode);
        return department.getName();
    }

    private String getEquipmentTypeName(String equTypeCode) {
        EquipmentType equipmentType = (EquipmentType) equipmentTypeDao.getById(equTypeCode);
        return equipmentType.getName();
    }
    /**
     * 新增设备信息
     * @param equipment
     * @throws Exception
     */
    public void insert(Equipment equipment) throws Exception {
        equipmentDao.create(equipment);
        EquipmentAlert equipmentAlert = new EquipmentAlert();
        equipmentAlert.setId(equipment.getId());
        equipmentAlert.setEquipmentName(equipment.getEquipmentName());
        equipmentAlert.setDisk(90);
        equipmentAlert.setMemory(80);
        equipmentAlert.setCpu(80);
        equipmentAlertDao.create(equipmentAlert);

    }

    @Override
    public String checkEquipmentName(String equipmentName) throws Exception {
        String msg = null;
        Equipment equipment = equipmentDao.findByName(equipmentName);
        if(equipment!=null){
            msg = "设备编号已经存在";
        } else {
            msg = "true";
        }
        return msg;
    }

    @Override
    public String checkEquipmentDesc(String equipmentDesc) throws Exception {
        String msg = null;
        Equipment equipment = equipmentDao.findByDesc(equipmentDesc);
        if(equipment!=null){
            msg = "设备名已经存在";
        } else {
            msg = "true";
        }
        return msg;
    }

    @Override
    public String selectDepartmentNameKeyValue() throws Exception {
        List<Department> list = departmentDao.findAll();
        int total = list.size();
        String json = "{success:true,total:"+total + ",rows:[";
        for (Department d : list) {
            json += "{key:'"+d.getName()+"',value:'"+d.getCode()+"'},";
        }
        json += "]}";
        return json;
    }

    @Override
    public void update(Equipment equipment) throws Exception {
        Equipment older = (Equipment) equipmentDao.getById(equipment.getId());
        older.setEquipmentName(equipment.getEquipmentName());
        older.setEquipmentDesc(equipment.getEquipmentDesc());
        older.setEquTypeCode(equipment.getEquTypeCode());
        older.setLinkType(equipment.getLinkType());
        older.setLinkName(equipment.getLinkName());
        older.setKeyDevice(equipment.getKeyDevice());
        older.setMonitorUsed(equipment.getMonitorUsed());
        older.setEquManagerDepart(equipment.getEquManagerDepart());
        older.setIp(equipment.getIp());
        older.setOtherIp(equipment.getOtherIp());
        older.setMac(equipment.getMac());
        older.setPort(equipment.getPort());
        older.setPassword(equipment.getPassword());
        older.setSubNetMask(equipment.getSubNetMask());
        older.setEquSysConfig(equipment.getEquSysConfig());
        older.setOidName(equipment.getOidName());
        older.setSnmpVer(equipment.getSnmpVer());
        older.setAuth(equipment.getAuth());
        older.setAuthPassword(equipment.getAuthPassword());
        older.setCommon(equipment.getCommon());
        older.setCommonPassword(equipment.getCommonPassword());
        equipmentDao.update(older);
    }

    @Override
    public void delete(Long id) throws Exception {
        Equipment older = (Equipment) equipmentDao.getById(id);
        if(older.getEquSysConfig()!=null){
            File file = new File(older.getEquSysConfig());
            file.delete();
        }
        equipmentDao.delete(id);
        equipmentAlertDao.delete(id);
    }

    public void setEquipmentDao(EquipmentDao equipmentDao) {
        this.equipmentDao = equipmentDao;
    }

    public void setEquipmentTypeDao(EquipmentTypeDao equipmentTypeDao) {
        this.equipmentTypeDao = equipmentTypeDao;
    }

    public void setDepartmentDao(DepartmentDao departmentDao) {
        this.departmentDao = departmentDao;
    }

    public void setEquipmentAlertDao(EquipmentAlertDao equipmentAlertDao) {
        this.equipmentAlertDao = equipmentAlertDao;
    }
}
