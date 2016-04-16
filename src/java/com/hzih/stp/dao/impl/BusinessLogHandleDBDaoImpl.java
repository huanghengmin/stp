package com.hzih.stp.dao.impl;

import cn.collin.commons.dao.MyDaoSupport;
import cn.collin.commons.domain.PageResult;
import com.hzih.stp.dao.BusinessLogHandleDBDao;
import com.hzih.stp.domain.AuditReset;
import com.hzih.stp.domain.BusinessLogHandleDB;
import com.hzih.stp.utils.StringUtils;
import org.apache.tools.ant.util.DateUtils;
import org.hibernate.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: 钱晓盼
 * Date: 13-4-10
 * Time: 下午6:57
 * To change this template use File | Settings | File Templates.
 */
public class BusinessLogHandleDBDaoImpl extends MyDaoSupport implements BusinessLogHandleDBDao {
    @Override
    public void setEntityClass() {
        this.entityClass = BusinessLogHandleDB.class;
    }

    public PageResult listLogsByParams(int pageIndex, int pageLength,
			Date startDate, Date endDate,String businessName) {
		StringBuffer sb = new StringBuffer(" from BusinessLogHandleDB s where " +
                "1=1 and flag = 0 and operate ='external'");
		List params = new ArrayList(3);// 手动指定容量，避免多次扩容
		if(startDate!=null){
			sb.append(" and logTime >= ?");
			params.add(startDate.getTime());
		}
		if(endDate!=null){
			sb.append(" and logTime <= ?");
			params.add(endDate.getTime());
		}
		if (StringUtils.isNotBlank(businessName)) {
			sb.append(" and appName like ?");
			params.add("%"+businessName+"%");
		}
		String countString = "select count(*) " + sb.toString();
//		String countString = "select count(*)  from business_log_handle_db s where 1=1 and operate ='external'";
        sb.append(" order by logTime asc");
        String queryString = sb.toString();

		PageResult ps = this.findByPage(queryString, countString, params.toArray(),
                pageIndex, pageLength);
		logger.debug(ps == null ? "ps=null" : "ps.results.size:"
				+ ps.getResults().size());
		return ps;
	}

    @Override
    public List<BusinessLogHandleDB> findByAppName(String appName) throws Exception {
        String hql = new String("from BusinessLogHandleDB where appName=?");
		List<BusinessLogHandleDB> list = getHibernateTemplate().find(hql,new String[] { appName });
    	return list;
    }

    @Override
    public void updateFlag(String appName, String fileName) throws Exception {
        StringBuffer sql = new StringBuffer("update business_log_handle_db set flag = 1 where appName = '"+appName+"' and fileName = '"+fileName+"' and operate = 'external';");
        Session session = getSession();
        SQLQuery sqlQuery = session.createSQLQuery(sql.toString());
        sqlQuery.executeUpdate();

    }

}
