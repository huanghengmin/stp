package com.hzih.stp.service.impl;

import cn.collin.commons.domain.PageResult;
import com.hzih.stp.dao.*;
import com.hzih.stp.dao.impl.XmlOperatorDAOImpl;
import com.hzih.stp.domain.*;
import com.hzih.stp.service.AuditService;
import com.hzih.stp.utils.DateUtils;
import com.hzih.stp.utils.FileUtil;
import com.hzih.stp.utils.StringContext;
import com.hzih.stp.utils.StringUtils;
import com.inetec.common.config.stp.nodes.Type;


import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Created by IntelliJ IDEA.
 * User: 钱晓盼
 * Date: 12-6-19
 * Time: 上午10:04
 * To change this template use File | Settings | File Templates.
 */
public class AuditServiceImpl implements AuditService{
    private BusinessLogDao businessLogDao;
    private SysLogDao sysLogDao;
    private UserOperLogDao userOperLogDao;
    private EquipmentLogDao equipmentLogDao;
    private EquipmentDao equipmentDao;
    private BusinessLogHandleDBDao businessLogHandleDBDao;
    private XmlOperatorDAO xmlOperatorDAO = new XmlOperatorDAOImpl();

    /**
     * 分页读取用户日志--并以json形式返回
     */
    public String selectUserAudit(int pageIndex, int limit, Date startDate, Date endDate,
                                  String logLevel, String userName) throws Exception {
        PageResult pageResult = userOperLogDao.listLogsByParams(pageIndex,limit,startDate, endDate, logLevel, userName);
        List<UserOperLog> userOperLogs = pageResult.getResults();
        int total = pageResult.getAllResultsAmount();
        String json = "{success:true,total:"+ total + ",rows:[";
        for (UserOperLog u : userOperLogs) {
            json +="{id:'"+u.getId()+"',userName:'"+u.getUserName()+"',level:'"+u.getLevel()+
                    "',auditModule:'"+u.getAuditModule()+"',auditInfo:'"+u.getAuditInfo()+
                    "',logTime:'"+ DateUtils.formatDate(u.getLogTime(), "yy-MM-dd HH:mm:ss")+"'},";
        }
        json += "]}";
        return json;
    }

    /**
     * 删除符合条件的数据,如果没有条件则清空设备日志表的日志
     * @param startDate
     * @param endDate
     * @param logLevel
     * @param equipmentName
     * @throws Exception
     */
    public void deleteEquipment(String startDate, String endDate, String logLevel, String equipmentName) throws Exception {
        if(StringUtils.isBlank(startDate) && StringUtils.isBlank(endDate) &&
                StringUtils.isBlank(logLevel) && StringUtils.isBlank(equipmentName)) {
            equipmentLogDao.truncate();
        } else {
            equipmentLogDao.delete(startDate,endDate,logLevel,equipmentName);
        }
    }

    /**
     * 删除符合条件的数据,如果没有条件则清空业务日志表的日志
     */
    public void deleteBusiness(String startDate, String endDate, String businessType, String businessName) throws Exception {
        if(StringUtils.isBlank(startDate) && StringUtils.isBlank(endDate) &&
                StringUtils.isBlank(businessType) && StringUtils.isBlank(businessName)) {
            businessLogDao.truncate();
        } else {
            businessLogDao.delete(startDate,endDate,businessType,businessName);
        }
    }

    /**
     * 读取审计信息比对
     * @param pageIndex
     * @param limit
     * @param startDate
     * @param endDate
     * @param businessType
     * @param businessName
     * @return
     * @throws Exception
     */
    public String selectBusinessCompareAudit(int pageIndex, int limit, Date startDate, Date endDate,
                                             String businessType, String businessName) throws Exception {
        String json = null;
        if(Type.s_app_db.equals( businessType)){
            PageResult pageResult = businessLogHandleDBDao.listLogsByParams(pageIndex, limit, startDate, endDate, businessName);
            if(pageResult!=null){
                int total = pageResult.getAllResultsAmount();
                List<BusinessLogHandleDB> list = pageResult.getResults();
                String rows = "rows:[";
                for (BusinessLogHandleDB log : list) {
                    Date date = new Date();
                    date.setTime(log.getLogTime());
                    rows += "{businessName:'"+log.getAppName()+"',businessType:'db',"+
                            "fileName:'"+log.getFileName()+"',date:'"+DateUtils.formatDate(date,"yyyy-MM-dd HH:mm:ss")+"'},";
                }
                rows += "]";
                json = "{success:true,total:"+total+","+rows+"}";
            }
//            json = "{success:true,total:1,rows:[{businessName:'db_001',fileName:'10000.tmp',businessType:'db',date:'2013-03-28 12:22:35'}]}";
        } else if (Type.s_app_file.equals(businessType)) {
            PageResult pageResult = businessLogDao.listCompareLogsByParams(pageIndex, limit, startDate, endDate, businessType, businessName);
            if(pageResult!=null){
                int total = pageResult.getAllResultsAmount();
                List<BusinessLog> list = pageResult.getResults();
                String rows = "rows:[";
                for (BusinessLog log : list) {
//                    int internalCount = businessLogDao.getCount(log.getBusinessName(), log.getBusinessType(), log.getFileName(), StringContext.INTERNAL);
//                    int externalCount = businessLogDao.getCount(log.getBusinessName(), log.getBusinessType(), log.getFileName(), StringContext.EXTERNAL);
//                    if(internalCount!=externalCount){
//                        total ++;
//                        String row = null;
//                        if(Type.s_app_db.equals(log.getBusinessType())){
//                            row = "',tableName:'"+log.getFileName()+
//                                    "',internalRecord:'"+internalCount+
//                                    "',externalRecord:'"+externalCount;
//                        } else if(Type.s_app_file.equals(log.getBusinessType())){
//                            row = "',fileName:'"+log.getFileName()+
//                                    "',internalCount:'"+FileUtil.setLength(internalCount) +
//                                    "',externalCount:'"+FileUtil.setLength(externalCount);
//
//                        }
//                        rows +="{businessName:'"+log.getBusinessName()+
//                                "',businessType:'"+log.getBusinessType()+
//                                row +
//                                "'},";
//                    }
                     rows += "{businessName:'"+log.getBusinessName()+"',businessType:'file',"+
                            "fileName:'"+log.getFileName()+"',date:'"+DateUtils.formatDate(log.getLogTime(),"yyyy-MM-dd HH:mm:ss")+"'},";
                }
                json = "{success:true,total:" + total +","+ rows + "]}";
            }
//            json = "{success:true,total:1,rows:[{businessName:'file_001',fileName:'10000.tmp',businessType:'file',date:'2013-03-28 12:22:35'}]}";
        }
        return json;
    }

    /**
     * 业务需要重传的文件导出后,改变业务日志比对标记flag
     * @param list
     * @throws Exception
     */
    public void updateBusinessLogFlag(List<AuditReset> list) throws Exception {
        for (AuditReset a : list){
            List<BusinessLog> olds = businessLogDao.findByNameTypeFileName(a.getBusinessName(),a.getBusinessType(),a.getFileName());
            for (BusinessLog log : olds){
                log.setFlag(1);
                businessLogDao.update(log);
            }
        }
    }

    @Override
    public void updateBusinessLogDBFlag(List<AuditReset> list) throws Exception {
        for(AuditReset a : list) {
            String appName = a.getBusinessName();
            String fileName = a.getFileName();
            businessLogHandleDBDao.updateFlag(appName,fileName);
        }

    }

    @Override
    public List<AuditReset> selectBusinessCompareAudit(String businessName) throws Exception {
        List<AuditReset> auditResets = new ArrayList<AuditReset>();
        Type type = xmlOperatorDAO.getExternalTypeByName(businessName);
        String businessType = type.getAppType();
        if(Type.s_app_db.equals( businessType)){
            List<BusinessLogHandleDB> list = businessLogHandleDBDao.findByAppName(businessName);
            for (BusinessLogHandleDB log : list) {
                Date date = new Date();
                date.setTime(log.getLogTime());
                String d = DateUtils.formatDate(date,"yyyy-MM-dd HH:mm:ss");
                AuditReset a = new AuditReset();
                a.setBusinessName(log.getAppName());
                a.setBusinessType("db");
                a.setFileName(log.getFileName());
                a.setDate(d);
                auditResets.add(a);
            }
        } else if (Type.s_app_file.equals(businessType)) {
            List<BusinessLog> list = businessLogDao.listCompareLogsByNameAndType(businessName,businessType);
            for (BusinessLog log : list) {
                AuditReset a = new AuditReset();
                a.setBusinessName(log.getBusinessName());
                a.setBusinessType("file");
                a.setFileName(log.getFileName());
                a.setDate(DateUtils.formatDate(log.getLogTime(),"yyyy-MM-dd HH:mm:ss"));
                auditResets.add(a);
            }
        }
        return auditResets;
    }

    @Override
    public String selectOSAudit(int pageIndex, int limit, Date startDate, Date endDate, String logLevel) throws Exception{
        PageResult pageResult = sysLogDao.listLogsByParams(pageIndex,limit,startDate, endDate, logLevel);
        List<SysLog> list = pageResult.getResults();
        int total = pageResult.getAllResultsAmount();
        String json = "{success:true,total:"+ total + ",rows:[";
        for (SysLog o : list) {
            json +="{id:'"+o.getId()+"',auditAction:'"+o.getAuditAction()+"',level:'"+o.getLevel()+
                    "',auditModule:'"+o.getAuditModule()+"',auditInfo:'"+o.getAuditInfo()+
                    "',logTime:'"+DateUtils.formatDate(o.getLogTime(),"yy-MM-dd HH:mm:ss")+"'},";
        }
        json += "]}";
        return json;
    }

    /**
     *  分页读取业务日志--并以json形式返回
     */
    public String selectBusinessAudit(int pageIndex, int limit, Date startDate,
                                      Date endDate, String businessType, String businessName) throws Exception {
        PageResult pageResult = businessLogDao.listLogsByParams(pageIndex,limit,startDate,endDate,businessType,businessName);
        int total = pageResult.getAllResultsAmount();
        List<BusinessLog> list = pageResult.getResults();
        String json = "{success:true,total:" + total + ",rows:[";
        for (BusinessLog log : list) {
            Type type = null;
            String businessDesc = "配置中应用不存在";
            if(log.getPlugin().equals(StringContext.EXTERNAL)){
                type = xmlOperatorDAO.getExternalTypeByName(log.getBusinessName());
            }else if(log.getPlugin().equals(StringContext.INTERNAL)){
                type = xmlOperatorDAO.getInternalTypeByName(log.getBusinessName());
            }
            if(type!=null){
                businessDesc = type.getDescription();
            }
            int count = 0;
            String jdbc = "";
            if(StringContext.INTERNAL.equals(log.getPlugin())){
                count = log.getAuditCount();
                jdbc = log.getDestJdbc();
            } else {
                count = log.getAuditCountEx();
                jdbc = log.getSourceJdbc();
            }
            json +="{id:"+log.getId()+",businessName:'"+log.getBusinessName()+"',level:'"+log.getLevel()+
                    "',businessType:'"+log.getBusinessType()+"',businessDesc:'"+businessDesc+
                    "',auditCount:"+count+",logTime:'"+DateUtils.formatDate(log.getLogTime(),"yy-MM-dd HH:mm:ss")+
                    "',jdbc:'"+jdbc+
                    "',sourceIp:'"+log.getSourceIp()+"',sourcePort:'"+log.getSourcePort()+
                    "',destIp:'"+log.getDestIp()+"',destPort:'"+log.getDestPort()+
                    "',fileName:'"+log.getFileName()+"',plugin:'"+log.getPlugin()+"'},";
        }
        json += "]}";
        return json;
    }

    /**
     *    分页读取设备日志--并以json形式返回
     */
    public String selectEquipmentAudit(int pageIndex, int limit, Date startDate, Date endDate,
                                       String logLevel, String equipmentName) throws Exception {
        PageResult pageResult = equipmentLogDao.listLogsByParams(pageIndex,limit,startDate,endDate,logLevel,equipmentName);
        int total = pageResult.getAllResultsAmount();
        List<EquipmentLog> list = pageResult.getResults();
        String json = "{success:true,total:" + total + ",rows:[";
        for (EquipmentLog log : list) {
            Equipment e = equipmentDao.findByName(log.getEquipmentName());
            json +="{id:'"+log.getId()+"',equipmentName:'"+log.getEquipmentName()+"',equipmentDesc:'"+(e==null?"":e.getEquipmentDesc())+"',level:'"+log.getLevel()+
                        "',linkName:'"+log.getLinkName()+"',auditInfo:'"+log.getLogInfo()+
                        "',logTime:'"+DateUtils.formatDate(log.getLogTime(),"yy-MM-dd HH:mm:ss")+"'},";
        }
        json += "]}";
        return json;
    }

    public void setBusinessLogDao(BusinessLogDao businessLogDao) {
        this.businessLogDao = businessLogDao;
    }

    public void setSysLogDao(SysLogDao sysLogDao) {
        this.sysLogDao = sysLogDao;
    }

    public void setUserOperLogDao(UserOperLogDao userOperLogDao) {
        this.userOperLogDao = userOperLogDao;
    }

    public void setEquipmentLogDao(EquipmentLogDao equipmentLogDao) {
        this.equipmentLogDao = equipmentLogDao;
    }

    public void setEquipmentDao(EquipmentDao equipmentDao) {
        this.equipmentDao = equipmentDao;
    }

    public void setBusinessLogHandleDBDao(BusinessLogHandleDBDao businessLogHandleDBDao) {
        this.businessLogHandleDBDao = businessLogHandleDBDao;
    }
}
