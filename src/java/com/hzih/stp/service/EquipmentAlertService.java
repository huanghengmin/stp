package com.hzih.stp.service;

import com.hzih.stp.domain.EquipmentAlert;

/**
 * Created with IntelliJ IDEA.
 * User: 钱晓盼
 * Date: 12-8-3
 * Time: 下午2:38
 * To change this template use File | Settings | File Templates.
 */
public interface EquipmentAlertService {

    public String select(Long id, String equipmentName) throws Exception;

    public String insertOrUpdate(EquipmentAlert equipmentAlert) throws Exception;

    public String selectDisplay(String id, String equipmentName) throws Exception;

}
