package com.hzih.stp.dao;

import cn.collin.commons.dao.BaseDao;
import com.hzih.stp.domain.BusinessLogTime;

/**
 * Created with IntelliJ IDEA.
 * User: 钱晓盼
 * Date: 12-8-7
 * Time: 上午11:00
 * To change this template use File | Settings | File Templates.
 */
public interface BusinessLogTimeDao extends BaseDao{

    public BusinessLogTime findByAppName(String appName) throws Exception;

}
