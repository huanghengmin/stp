package com.hzih.stp.dao.impl;

import cn.collin.commons.dao.MyDaoSupport;
import com.hzih.stp.dao.RoleTypeDao;
import com.hzih.stp.domain.RoleType;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: 钱晓盼
 * Date: 12-8-7
 * Time: 上午11:01
 * To change this template use File | Settings | File Templates.
 */
public class RoleTypeDaoImpl extends MyDaoSupport implements RoleTypeDao {
    @Override
    public void setEntityClass() {
        this.entityClass = RoleType.class;
    }

    @Override
    public RoleType findByCode(String roleType) throws Exception {
        String hql = new String("from RoleType where code=?");
		List<RoleType> list = getHibernateTemplate().find(hql,new String[] { roleType });
		if (list != null && list.size() > 0) {
			return list.get(0);
		} else {
			return null;
		}
    }
}
