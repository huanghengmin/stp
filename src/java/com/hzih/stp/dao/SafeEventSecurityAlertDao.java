package com.hzih.stp.dao;

import cn.collin.commons.dao.BaseDao;
import cn.collin.commons.domain.PageResult;

public interface SafeEventSecurityAlertDao extends BaseDao {

	public PageResult listByPage(int pageIndex, int limit, String startDate,
                                 String endDate, String name, String alertCode, String read, String eventType) throws Exception;

}
