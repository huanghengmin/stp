package com.hzih.stp.dao;

import cn.collin.commons.dao.BaseDao;
import cn.collin.commons.domain.PageResult;

public interface PermissionDao extends BaseDao {

    public PageResult listByPage(int start, int limit);
}
