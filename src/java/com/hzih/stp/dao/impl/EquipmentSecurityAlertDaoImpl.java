package com.hzih.stp.dao.impl;

import cn.collin.commons.dao.MyDaoSupport;
import cn.collin.commons.domain.PageResult;
import cn.collin.commons.utils.DateUtils;
import com.hzih.stp.dao.EquipmentSecurityAlertDao;
import com.hzih.stp.domain.EquipmentSecurityAlert;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: 钱晓盼
 * Date: 12-8-7
 * Time: 上午11:01
 * To change this template use File | Settings | File Templates.
 */
public class EquipmentSecurityAlertDaoImpl extends MyDaoSupport implements EquipmentSecurityAlertDao {
    @Override
    public void setEntityClass() {
        this.entityClass = EquipmentSecurityAlert.class;
    }

    @Override
    public PageResult listByPage(int pageIndex, int limit, String startDate,
                                 String endDate, String equipmentName, String read) throws Exception {
        String hql = "from EquipmentSecurityAlert where 1=1 ";
		List paramsList = new ArrayList();
        if(startDate!=null && startDate.length()>0){
            Date s = DateUtils.parse(startDate,"yyyy-MM-dd");
			hql +=" and date_format(alertTime,'%Y-%m-%d')>= date_format(?,'%Y-%m-%d')";
			paramsList.add(s);
		}
		if(endDate!=null && endDate.length()>0){
            Date e = DateUtils.parse(endDate,"yyyy-MM-dd");
			hql += " and date_format(alertTime,'%Y-%m-%d')<= date_format(?,'%Y-%m-%d')";
			paramsList.add(e);
		}
		if (equipmentName != null && equipmentName.length() > 0) {
			hql += " and equipmentName = ?";
			paramsList.add(equipmentName);
		}
        if(read!=null && read.length()>0){
            if (read.equalsIgnoreCase("Y") || read.equalsIgnoreCase("N")) {
                hql += " and isRead = ?";
                paramsList.add(read);
            }
        } else {
            hql += " and isRead = 'N'";
        }
		String countHql = "select count(*) " + hql;

		PageResult ps = this.findByPage(hql, countHql, paramsList.toArray(),
				pageIndex, limit);
		return ps;
    }

}
