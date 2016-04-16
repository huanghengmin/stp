package com.hzih.stp.dao.impl;

import cn.collin.commons.dao.MyDaoSupport;
import com.hzih.stp.dao.BusinessLogTimeDao;
import com.hzih.stp.domain.BusinessLogTime;
import com.hzih.stp.utils.StringUtils;
import org.hibernate.Query;
import org.hibernate.Session;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: 钱晓盼
 * Date: 13-4-13
 * Time: 下午6:48
 * To change this template use File | Settings | File Templates.
 */
public class BusinessLogTimeDaoImpl extends MyDaoSupport implements BusinessLogTimeDao {
    @Override
    public BusinessLogTime findByAppName(String appName) throws Exception {
        String hql = new String("from BusinessLogTime where appName=?");
		List<BusinessLogTime> list = getHibernateTemplate().find(hql,new String[] { appName });
		if (list != null && list.size() > 0) {
			return list.get(0);
		} else {
			return null;
		}

        /*StringBuffer sb = new StringBuffer("select * from business_log_time where 1=1 ") ;
        if(StringUtils.isNotBlank(appName)){
            sb.append(" and appName = '"+appName+"'");
        }
        Session session = getSession();
        Query query = session.createSQLQuery(sb.toString()+";").addEntity(BusinessLogTime.class);
        List<BusinessLogTime> list = query.list();
        if(list.size()>0){
            return list.get(0);
        } else {
            return null;
        }*/
    }

    @Override
    public void setEntityClass() {
        this.entityClass = BusinessLogTime.class;
    }
}
