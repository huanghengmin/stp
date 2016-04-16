package com.hzih.stp.dao;

import cn.collin.commons.dao.BaseDao;
import com.hzih.stp.domain.RoleType;

/**
 * Created with IntelliJ IDEA.
 * User: 钱晓盼
 * Date: 12-8-7
 * Time: 上午11:00
 * To change this template use File | Settings | File Templates.
 */
public interface RoleTypeDao extends BaseDao{
    public RoleType findByCode(String roleType) throws Exception;
}
