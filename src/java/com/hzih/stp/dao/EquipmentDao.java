package com.hzih.stp.dao;

import cn.collin.commons.dao.BaseDao;
import cn.collin.commons.domain.PageResult;
import com.hzih.stp.domain.Equipment;

import java.util.List;

public interface EquipmentDao extends BaseDao {

    public Equipment findByName(String equipmentName) throws Exception;

    public PageResult listPageResult(int pageIndex, int limit, String equipmentName) throws Exception;

    public PageResult listPageResult(int pageIndex, int limit, String equipmentName, String monitorUsed) throws Exception;

    public Equipment findByDesc(String equipmentDesc) throws Exception;

    List<Equipment> findNotByName(String stp) throws Exception;
}
