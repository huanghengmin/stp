package com.hzih.stp.dao.impl;

import cn.collin.commons.dao.MyDaoSupport;
import cn.collin.commons.domain.PageResult;
import com.hzih.stp.dao.SecurityLevelDao;
import com.hzih.stp.domain.SecurityLevel;

/**
 * Created with IntelliJ IDEA.
 * User: 钱晓盼
 * Date: 12-7-12
 * Time: 下午3:28
 * To change this template use File | Settings | File Templates.
 */
public class SecurityLevelDaoImpl extends MyDaoSupport implements SecurityLevelDao {
    @Override
    public PageResult listByPage(int pageIndex, int limit) throws Exception {
        String hql = "from SecurityLevel";
		String countHql = "select count(*) " + hql;
		PageResult ps = this.findByPage(hql, countHql, pageIndex, limit);
		return ps;
    }

    @Override
    public void setEntityClass() {
        this.entityClass = SecurityLevel.class;
    }
}
