package com.hzih.stp.dao;

import cn.collin.commons.dao.BaseDao;
import com.hzih.stp.domain.Role;

public interface RoleDao extends BaseDao {

    public Role findByName(String name) throws Exception;
}
