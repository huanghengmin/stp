package com.hzih.stp.dao.impl;

import cn.collin.commons.dao.MyDaoSupport;
import com.hzih.stp.dao.EquipmentTypeDao;
import com.hzih.stp.domain.EquipmentType;

/**
 * Created with IntelliJ IDEA.
 * User: 钱晓盼
 * Date: 12-8-7
 * Time: 上午11:01
 * To change this template use File | Settings | File Templates.
 */
public class EquipmentTypeDaoImpl  extends MyDaoSupport implements EquipmentTypeDao {
    @Override
    public void setEntityClass() {
        this.entityClass = EquipmentType.class;
    }
}
