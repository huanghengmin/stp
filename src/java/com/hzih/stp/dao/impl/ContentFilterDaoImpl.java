package com.hzih.stp.dao.impl;

import cn.collin.commons.dao.MyDaoSupport;
import cn.collin.commons.domain.PageResult;
import com.hzih.stp.dao.ContentFilterDao;
import com.hzih.stp.domain.ContentFilter;

/**
 * Created with IntelliJ IDEA.
 * User: 钱晓盼
 * Date: 12-7-12
 * Time: 下午3:28
 * To change this template use File | Settings | File Templates.
 */
public class ContentFilterDaoImpl extends MyDaoSupport implements ContentFilterDao {
    @Override
    public PageResult listByPage(int pageIndex, int limit) throws Exception {
        String hql = "from ContentFilter";
		String countHql = "select count(*) " + hql;
		PageResult ps = this.findByPage(hql, countHql, pageIndex, limit);
		return ps;
    }

    @Override
    public void setEntityClass() {
        this.entityClass = ContentFilter.class;
    }
}
