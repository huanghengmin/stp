package com.hzih.stp.service;

import com.hzih.stp.domain.Equipment;

/**
 * Created with IntelliJ IDEA.
 * User: 钱晓盼
 * Date: 12-7-5
 * Time: 下午1:34
 * To change this template use File | Settings | File Templates.
 */
public interface EquipmentService {
    public String selectEquipmentNameKeyValue() throws Exception;

    public String select(int start, int limit) throws Exception;

    public void insert(Equipment equipment) throws Exception;

    public String checkEquipmentName(String equipmentName) throws Exception;

    public String checkEquipmentDesc(String equipmentDesc) throws Exception;

    public String selectDepartmentNameKeyValue() throws Exception;

    public void update(Equipment equipment) throws Exception;

    public void delete(Long id) throws Exception;
}
