package com.hzih.stp.dao;

import cn.collin.commons.dao.BaseDao;
import cn.collin.commons.domain.PageResult;
import com.hzih.stp.domain.BusinessSecurityAlertType;

public interface BusinessSecurityAlertDao extends BaseDao {

	public PageResult listByPage(int pageIndex, int limit, String startDate,
                                 String endDate, String businessName, String alertCode, String read) throws Exception;

}
