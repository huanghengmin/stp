package com.hzih.stp.dao.impl;

import cn.collin.commons.dao.MyDaoSupport;
import cn.collin.commons.domain.PageResult;
import com.hzih.stp.dao.TypeCheckDao;
import com.hzih.stp.domain.TypeCheck;
import org.hibernate.SQLQuery;
import org.hibernate.Session;

import java.util.ArrayList;
import java.util.List;

public class TypeCheckDaoImpl extends MyDaoSupport implements TypeCheckDao {

	@Override
	public void setEntityClass() {
		this.entityClass = TypeCheck.class;
	}

    /**
     * 分页查询
     *
     * @param appName
     * @param appType
     * @param up
     * @param pageIndex
     * @param limit   @return
     * */
	public PageResult listByPage(String appName, String appType, String up, int pageIndex, int limit) {
		String hql = "from TypeCheck where 1=1 ";
		List paramsList = new ArrayList();
		if (appName != null && appName.length() > 0) {
			hql += " and appName like ?";
			paramsList.add("%"+appName+"%");
		}
		if (appType != null && appType.length() > 0) {
			hql += " and appType=?";
			paramsList.add(appType);
		}
        if( up != null && up.length() > 0){
            hql += " and up = ?";
            paramsList.add(Integer.parseInt(up));
        }

		String countHql = "select count(*) " + hql;

		PageResult ps = this.findByPage(hql, countHql, paramsList.toArray(),pageIndex, limit);
		return ps;
	}

    @Override
    public void updateUp(String[] ids) throws Exception {
        String sql = "update type_check set up=1 where 1=1 ";
        if(ids.length>0){
            if(ids.length==1){
                sql += "and id="+Integer.parseInt(ids[0]);
            }else if(ids.length>1){
                sql += "and id in (";
                for (int i=0;i<ids.length-1;i++){
                    sql += Integer.parseInt(ids[i])+",";
                }
                sql += Integer.parseInt(ids[ids.length-1])+");";
            }
        }
        Session session = getSession();
        SQLQuery sqlQuery = session.createSQLQuery(sql);
        sqlQuery.executeUpdate();
    }
}
