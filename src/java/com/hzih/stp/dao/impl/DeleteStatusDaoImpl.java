package com.hzih.stp.dao.impl;

import cn.collin.commons.dao.MyDaoSupport;
import cn.collin.commons.domain.PageResult;
import com.hzih.stp.dao.DeleteStatusDao;
import com.hzih.stp.domain.DeleteStatus;
import com.hzih.stp.utils.StringUtils;
import org.hibernate.SQLQuery;
import org.hibernate.Session;

import java.util.ArrayList;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: 钱晓盼
 * Date: 12-7-18
 * Time: 下午3:24
 * To change this template use File | Settings | File Templates.
 */
public class DeleteStatusDaoImpl extends MyDaoSupport implements DeleteStatusDao{
    @Override
    public void setEntityClass() {
        this.entityClass = DeleteStatus.class;
    }

    public PageResult listByPage(int pageIndex ,int limit) {
		String hql = "from DeleteStatus";
		List paramsList = new ArrayList();
		String countHql = "select count(*) " + hql;

		PageResult ps = this.findByPage(hql, countHql,pageIndex, limit);
		return ps;
	}

    @Override
    public DeleteStatus findByAppName(String appName) throws Exception {
        String hql = new String("from DeleteStatus where appName = ?");
        List list = getHibernateTemplate().find(hql,new String[] { appName });
		if (list != null && list.size() > 0) {
			return (DeleteStatus) list.get(0);
		} else {
			return null;
		}

    }

    @Override
    public void deleteByAppName(String appName) throws Exception {
        String sql = "delete from delete_status where 1=1" ;

        if (StringUtils.isNotBlank(appName)) {
            sql += " and appName = '"+appName+"'";
        }

        Session session = getSession();
        SQLQuery sqlQuery = session.createSQLQuery(sql);
        sqlQuery.executeUpdate();
    }

}
