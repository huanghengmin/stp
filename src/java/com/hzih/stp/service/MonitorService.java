package com.hzih.stp.service;

/**
 * Created with IntelliJ IDEA.
 * User: 钱晓盼
 * Date: 12-8-7
 * Time: 上午9:50
 * To change this template use File | Settings | File Templates.
 */
public interface MonitorService {
    public String selectEquipment() throws Exception;

    public String getRunEquipmentInfo(String id) throws Exception;

    public String selectBusiness(int start, int limit) throws Exception;

    public String selectEquipment2() throws Exception;
}
