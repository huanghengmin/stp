package com.hzih.stp.dao;

import cn.collin.commons.dao.BaseDao;
import cn.collin.commons.domain.PageResult;
import com.hzih.stp.domain.AuditReset;
import com.hzih.stp.domain.BusinessLogHandleDB;

import java.util.Date;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: 钱晓盼
 * Date: 12-8-7
 * Time: 上午11:00
 * To change this template use File | Settings | File Templates.
 */
public interface BusinessLogHandleDBDao extends BaseDao{

    public PageResult listLogsByParams(int pageIndex, int pageLength,
			Date startDate, Date endDate, String businessName);

    public List<BusinessLogHandleDB> findByAppName(String businessName) throws Exception;

    public void updateFlag(String appName, String fileName) throws Exception;

}
