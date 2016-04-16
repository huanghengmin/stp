package com.hzih.stp.service.impl;

import cn.collin.commons.domain.PageResult;
import com.hzih.stp.dao.AuditResetDao;
import com.hzih.stp.dao.XmlOperatorDAO;
import com.hzih.stp.dao.impl.XmlOperatorDAOImpl;
import com.hzih.stp.domain.AuditReset;
import com.hzih.stp.service.AuditResetService;
import com.hzih.stp.utils.FileUtil;
import com.hzih.stp.utils.ServiceResponse;
import com.hzih.stp.utils.ServiceUtil;
import com.hzih.stp.utils.StringUtils;
import com.inetec.common.config.stp.nodes.Type;
import org.apache.commons.httpclient.util.DateUtil;
import org.apache.log4j.Logger;

import java.io.File;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: 钱晓盼
 * Date: 12-7-31
 * Time: 下午2:45
 * To change this template use File | Settings | File Templates.
 */
public class AuditResetServiceImpl implements AuditResetService {
    private static final Logger logger = Logger.getLogger(AuditResetServiceImpl.class);
    private XmlOperatorDAO xmlOperatorDAO = new XmlOperatorDAOImpl();
    private AuditResetDao auditResetDao;

    public void setAuditResetDao(AuditResetDao auditResetDao) {
        this.auditResetDao = auditResetDao;
    }

    /**
     * 按条件分页查询,并返回json数据
     * @param start
     * @param limit
     * @param startDate
     * @param endDate
     * @param businessName
     * @param businessType
     * @param resetStatus
     * @return
     * @throws Exception
     */
    public String select(int start, int limit, Date startDate, Date endDate,
                         String businessName, String businessType, String resetStatus) throws Exception {
        PageResult pageResult = auditResetDao.pageList(start/limit+1,limit,startDate,endDate,
                businessName,businessType,resetStatus);
        int total = pageResult.getAllResultsAmount();
        List<AuditReset> list = pageResult.getResults();
        String json = "{success:true,total:"+total+",rows:[";
        for(AuditReset a : list){
            json += "{id:'"+a.getId()+"',businessName:'"+a.getBusinessName()+
                    "',fileName:'"+a.getFileName()+"',businessType:'"+a.getBusinessType()+
                    "',resetCount:"+a.getResetCount()+",resetStatus:"+a.getResetStatus()+
                    ",importTime:'"+ DateUtil.formatDate(a.getImportTime(),"yyyy-MM-dd HH:mm:ss")+"',date:'"+a.getDate()+"'},";
        }
        json += "]}";
        return json;
    }

    /**
     * 批量插入
     * @param auditResets
     * @throws Exception
     */
    public void insert(List<AuditReset> auditResets) throws Exception {
         auditResetDao.insert(auditResets);
    }

    @Override
    public String updateResetStatusByBizName(String appName, String startDate, String endDate) throws Exception {
        String msg = null;
        if(StringUtils.isNotBlank(startDate)&&StringUtils.isNotBlank(endDate)) {
            String appType = xmlOperatorDAO.getExternalTypeByName(appName).getAppType();
            String[][] params = new String[][] {
                    { "STP_RESET", "STP_RESET" },
                    { "STP_RESET_COMMAND", appType },
                    { "STP_RESET_APPNAME", appName },
                    { "STP_RESET_STARTDATE", startDate },
                    { "STP_RESET_ENDDATE", endDate }
            };
            ServiceResponse serviceResponse = ServiceUtil.callPlatform(params);
            if(serviceResponse.getCode()==200) {
//                auditResetDao.updateResetStatusByBizNameAndTime(appName,startDate,endDate);
                msg = "重传命令成功,点击[确定]返回列表!";
            } else {
                msg = "重传失败,"+serviceResponse.getData();
            }
        } else {
            String dir = System.getProperty("ichange.home") + "/audit";
            String fileName = System.currentTimeMillis()+".log";
            List<String> list = new ArrayList<String>();
            List<AuditReset> auditResets = auditResetDao.findByBusinessName(appName);
            for (AuditReset auditReset : auditResets) {
                list = getBatFileFullName(auditReset);
            }
            if(list.size()>0){
                FileUtil.writeOnline(dir+"/"+fileName,list);
                String appType = xmlOperatorDAO.getExternalTypeByName(appName).getAppType();
                String[][] params = new String[][] {
                        { "STP_RESET", "STP_RESET" },
                        { "STP_RESET_COMMAND", appType },
                        { "STP_RESET_APPNAME", appName },
                        { "STP_RESET_FILENAME", fileName }
                };
                ServiceResponse serviceResponse = ServiceUtil.callPlatform(params);
                if(serviceResponse.getCode()==200) {
                    auditResetDao.updateResetStatusByBizName(appName);
                    msg = "重传成功,点击[确定]返回列表!";
                } else {
                    msg = "重传失败,"+serviceResponse.getData();
                }
            } else {
                msg = "重传的文件对应的备份文件全部不存在,删除记录!";
            }
        }
        return msg;
    }

    /**
     * 修改状态为需重传,实际值0
     * @throws Exception
     */
    public String updateResetStatus(String[] ids, String appName) throws Exception {

        String msg = null;
        String dir = System.getProperty("ichange.home") + "/audit";
        String fileName = System.currentTimeMillis()+".log";
        List<String> list = new ArrayList<String>();
        for (int i=0;i<ids.length;i++) {
            AuditReset old = (AuditReset) auditResetDao.getById(Long.valueOf(ids[i]));
            list = getBatFileFullName(old);
        }
        if(list.size()>0){
            FileUtil.writeOnline(dir+"/"+fileName,list);
            String appType = xmlOperatorDAO.getExternalTypeByName(appName).getAppType();
            String[][] params = new String[][] {
                    { "STP_RESET", "STP_RESET" },
                    { "STP_RESET_COMMAND", appType },
                    { "STP_RESET_APPNAME", appName },
                    { "STP_RESET_FILENAME", fileName }
            };
            ServiceResponse serviceResponse = ServiceUtil.callPlatform(params);
            if(serviceResponse.getCode()==200) {
                for (int i=0;i<ids.length;i++) {
                    AuditReset old = (AuditReset) auditResetDao.getById(Long.valueOf(ids[i]));
                    if(old!=null){
                        old.setResetStatus(1);
                        auditResetDao.update(old);
                    }
                }
                msg = "重传成功,点击[确定]返回列表!";
            } else {
                msg = "重传失败,"+serviceResponse.getData();
            }
        } else {
            msg = "重传的文件对应的备份文件全部不存在,删除记录!";
        }
        return msg;
    }

    private List<String> getBatFileFullName(AuditReset auditReset) throws Exception {
        List<String> list = new ArrayList<String>();
        if(Type.s_app_db.equals(auditReset.getBusinessType())) {
            String day = auditReset.getDate().substring(0,10);
            int hour = Integer.parseInt(auditReset.getDate().substring(11,13));
            String sendFileName = "/data/"+auditReset.getBusinessName()+"/"+ day + "/" + hour + "/" + auditReset.getFileName();
            File file = new File(sendFileName);
            if(file.exists()) {
                list.add(sendFileName);
            } else {
                auditResetDao.delete(auditReset.getBusinessName(), auditReset.getFileName());
                logger.info("因为重传的文件对应的备份文件不存在,删除记录[应用:"+auditReset.getBusinessName()+";文件名:"+auditReset.getFileName()+"]");
            }
        } else if(Type.s_app_file.equals(auditReset.getBusinessType())) {
            String sendFileName = auditReset.getFileName();
            File file = new File(sendFileName);
            if(file.exists()) {
                list.add(sendFileName);
            } else {
                auditResetDao.delete(auditReset.getBusinessName(), auditReset.getFileName());
                logger.info("因为重传的文件对应的备份文件不存在,删除记录[应用:"+auditReset.getBusinessName()+";文件名:"+auditReset.getFileName()+"]");
            }
        }
        return list;
    }

    /**
     * 修改参数所对应的记录
     * @param auditResets
     * @return
     * @throws Exception
     */
    public List<AuditReset> update(List<AuditReset> auditResets) throws Exception {
        List<AuditReset> list = new ArrayList<AuditReset>();
        for(AuditReset a:auditResets){
            AuditReset old = auditResetDao.findByNameTypeFileName(a.getBusinessName(), a.getFileName(), a.getBusinessType());
            if(old!=null){
                boolean isNeedUpdated = old.getResetStatus()==1;
                if(isNeedUpdated){
                    old.setResetStatus(0);
                    old.setImportTime(new Date());
                    old.setResetCount(old.getResetCount() + 1);
//                    old.setFileSize(a.getFileSize());
                    old.setDate(a.getDate());
                    auditResetDao.update(old);
                }
                list.add(a);
            }
        }
        auditResets.removeAll(list);
        return auditResets;
    }

    /**
     * 根据条件删除,没有条件时清空表数据
     * @param startDate      开始时间
     * @param endDate         结束时间
     * @param businessName   业务名
     * @param businessType   业务类型
     * @param resetStatus    状态
     * @throws Exception
     */
    public void truncate(String startDate, String endDate,
                         String businessName, String businessType, String resetStatus) throws Exception {
        if(StringUtils.isBlank(startDate) && StringUtils.isBlank(endDate) &&
                StringUtils.isBlank(businessType) && StringUtils.isBlank(businessName) &&
                    StringUtils.isBlank(resetStatus)) {
            auditResetDao.truncate();
        } else {
            auditResetDao.delete(startDate,endDate,businessName,businessType,resetStatus);
        }

    }
}
