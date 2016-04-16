package com.hzih.stp.service;

import com.hzih.stp.domain.ContentFilter;

/**
 * Created with IntelliJ IDEA.
 * User: 钱晓盼
 * Date: 12-7-12
 * Time: 下午3:13
 * To change this template use File | Settings | File Templates.
 */
public interface ContentFilterService {

    String getPages(int pageIndex, int limit) throws Exception;


    String insert(ContentFilter contentFilter) throws Exception;

    String delete(String[] ids) throws Exception;

    String update(ContentFilter contentFilter) throws Exception;
}
