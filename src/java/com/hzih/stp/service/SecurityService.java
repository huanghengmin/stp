package com.hzih.stp.service;

import java.util.Date;

/**
 * Created with IntelliJ IDEA.
 * User: 钱晓盼
 * Date: 12-8-13
 * Time: 下午2:46
 * To change this template use File | Settings | File Templates.
 */
public interface SecurityService {

    public String selectBiz(int start, int limit,
                            String startDate, String endDate, String businessName, String alertCode, String read) throws Exception;

    public String selectAlertTypeBiz() throws Exception;

    public void setBizRead(String[] ids) throws Exception;

    public String selectEqu(int start, int limit,
                            String startDate, String endDate, String equipmentName, String read) throws Exception;

    public String selectEquKeyValue() throws Exception;

    public void setEquRead(String[] ids) throws Exception;

    public String selectEvent(int start, int limit,
                              String startDate, String endDate, String name, String alertCode, String read, String eventType) throws Exception;

    public String selectEventAlertTypeKeyValue() throws Exception;

    public void setEventRead(String[] ids) throws Exception;

    public void addSecurityAlert(String serviceName, Date date, String alertType,
                                 String info, String read, String ipAddr) throws Exception;
}
