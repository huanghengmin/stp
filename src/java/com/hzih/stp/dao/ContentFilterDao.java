package com.hzih.stp.dao;

import cn.collin.commons.dao.BaseDao;
import cn.collin.commons.domain.PageResult;

/**
 * Created with IntelliJ IDEA.
 * User: 钱晓盼
 * Date: 12-7-12
 * Time: 下午3:23
 * To change this template use File | Settings | File Templates.
 */
public interface ContentFilterDao extends BaseDao {

    PageResult listByPage(int pageIndex, int limit) throws Exception;
}
