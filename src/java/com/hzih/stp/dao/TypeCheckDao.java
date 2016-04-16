package com.hzih.stp.dao;

import cn.collin.commons.dao.BaseDao;
import cn.collin.commons.domain.PageResult;

public interface TypeCheckDao extends BaseDao {

	PageResult listByPage(String appName, String appType, String up, int pageIndex, int limit);

    void updateUp(String[] ids) throws Exception;
}
