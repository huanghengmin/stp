package com.hzih.stp.dao.impl;

import cn.collin.commons.dao.MyDaoSupport;
import cn.collin.commons.domain.PageResult;
import com.hzih.stp.dao.EquipmentDao;
import com.hzih.stp.domain.Equipment;

import java.util.ArrayList;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: 钱晓盼
 * Date: 12-7-5
 * Time: 下午1:26
 * To change this template use File | Settings | File Templates.
 */
public class EquipmentDaoImpl extends MyDaoSupport implements EquipmentDao {
    @Override
    public void setEntityClass() {
        this.entityClass = Equipment.class;
    }

    @Override
    public Equipment findByName(String equipmentName) throws Exception {
        String hql = new String("from Equipment where equipmentName=?");
        List list = getHibernateTemplate().find(hql,new String[] { equipmentName });
        if (list != null && list.size() > 0) {
            return (Equipment) list.get(0);
        } else {
            return null;
        }
    }

    public Equipment findByDesc(String equipmentDesc) throws Exception {
        String hql = new String("from Equipment where equipmentDesc=?");
        List list = getHibernateTemplate().find(hql,new String[] { equipmentDesc });
        if (list != null && list.size() > 0) {
            return (Equipment) list.get(0);
        } else {
            return null;
        }
    }

    @Override
    public List<Equipment> findNotByName(String equipmentName) throws Exception {
        String hql = new String("from Equipment where equipmentName!=?");
        List list = getHibernateTemplate().find(hql,new String[] { equipmentName });
        if (list != null && list.size() > 0) {
            return  list;
        } else {
            return null;
        }
    }

    @Override
    public PageResult listPageResult(int pageIndex, int limit, String equipmentName) throws Exception {
        String hql = "from Equipment where 1=1 ";
		List paramsList = new ArrayList();
		if (equipmentName != null && equipmentName.length() > 0) {
			hql += " and equipmentName like ?";
			paramsList.add("%" + equipmentName + "%");
		}
		String countHql = "select count(*) " + hql;

		PageResult ps = this.findByPage(hql, countHql, paramsList.toArray(),
				pageIndex, limit);
		return ps;
    }

    @Override
    public PageResult listPageResult(int pageIndex, int limit, String equipmentName, String monitorUsed) throws Exception {
        String hql = "from Equipment where 1=1 ";
		List paramsList = new ArrayList();
		if (equipmentName != null && equipmentName.length() > 0) {
			hql += " and equipmentName like ?";
			paramsList.add("%" + equipmentName + "%");
		}

        if (monitorUsed != null && monitorUsed.length() > 0) {
			hql += " and monitorUsed = ?";
			paramsList.add(monitorUsed);
		}
		String countHql = "select count(*) " + hql;

		PageResult ps = this.findByPage(hql, countHql, paramsList.toArray(),
				pageIndex, limit);
		return ps;
    }
}
