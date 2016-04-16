package com.hzih.stp.service;

import com.hzih.stp.domain.DeleteStatus;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: 钱晓盼
 * Date: 12-7-18
 * Time: 下午3:26
 * To change this template use File | Settings | File Templates.
 */
public interface DeleteStatusService {
    public void insert(DeleteStatus deleteStatus) throws Exception;

    public void delete(String[] ids) throws Exception;

    public String pageList(int start,int limit) throws Exception;

    public List<DeleteStatus> select() throws Exception;

    public void deleteByAppName(String appName) throws Exception;
}
