package com.hzih.stp.service;

import com.hzih.stp.domain.AuditReset;

import java.util.Date;
import java.util.List;

/**
 * Created by IntelliJ IDEA.
 * User: 钱晓盼
 * Date: 12-6-19
 * Time: 上午10:02
 * To change this template use File | Settings | File Templates.
 */
public interface AuditService {

    public String selectBusinessAudit(int pageIndex, int limit, Date startDate, Date endDate,
                                      String logLevel, String businessName) throws Exception;

    public String selectEquipmentAudit(int pageIndex, int limit, Date startDate, Date endDate,
                                       String logLevel, String equipmentName) throws Exception;

    public String selectUserAudit(int pageIndex, int limit, Date startDate, Date endDate,
                                  String logLevel, String userName) throws Exception;

    public void deleteEquipment(String startDate, String endDate,
                                String businessType, String equipmentName) throws Exception;

    public void deleteBusiness(String startDate, String endDate,
                               String logLevel, String businessName) throws Exception;

    public String selectBusinessCompareAudit(int pageIndex, int limit, Date startDate, Date endDate,
                                             String businessType, String businessName) throws Exception;

    public void updateBusinessLogFlag(List<AuditReset> list) throws Exception;

    public List<AuditReset> selectBusinessCompareAudit(String businessName) throws Exception;

    public String selectOSAudit(int pageIndex, int limit, Date startDate, Date endDate, String logLevel) throws Exception;

    public void updateBusinessLogDBFlag(List<AuditReset> list) throws Exception;
}
