package com.hzih.stp.service;

import com.hzih.stp.domain.TypeCheck;

/**
 * Created with IntelliJ IDEA.
 * User: 钱晓盼
 * Date: 12-7-26
 * Time: 下午6:17
 * To change this template use File | Settings | File Templates.
 */
public interface TypeCheckService {

    public String select(String appName, String appType, String up, int start, int limit) throws Exception;

    public void insert(TypeCheck typeCheck) throws Exception;

    public void delete(String[] ids) throws Exception;

    public void update(TypeCheck typeCheck) throws Exception;

    public void update(String[] ids) throws Exception;
}
