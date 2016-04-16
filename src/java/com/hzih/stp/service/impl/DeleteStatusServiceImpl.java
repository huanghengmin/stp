package com.hzih.stp.service.impl;

import cn.collin.commons.domain.PageResult;
import com.hzih.stp.dao.DeleteStatusDao;
import com.hzih.stp.domain.DeleteStatus;
import com.hzih.stp.service.DeleteStatusService;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: 钱晓盼
 * Date: 12-7-18
 * Time: 下午3:31
 * To change this template use File | Settings | File Templates.
 */
public class DeleteStatusServiceImpl implements DeleteStatusService{
    private DeleteStatusDao deleteStatusDao;

    public void setDeleteStatusDao(DeleteStatusDao deleteStatusDao) {
        this.deleteStatusDao = deleteStatusDao;
    }

    @Override
    public void insert(DeleteStatus deleteStatus) throws Exception {
         deleteStatusDao.create(deleteStatus);
    }

    @Override
    public void delete(String[] ids) throws Exception {
        deleteStatusDao.deleteWithDependent(ids);
    }

    @Override
    public String  pageList(int start, int limit) throws Exception {
        int pageIndex = start / limit + 1;
        PageResult pageResult = deleteStatusDao.listByPage(pageIndex, limit);
         String json = "{success:true,total:"+pageResult.getAllResultsAmount()+",rows:[";
        List<DeleteStatus> list = pageResult.getResults();
        for(DeleteStatus d : list){
            json += "{id:'"+d.getId()+"',appName:'"+d.getAppName()+"',plugin:'"+d.getPlugin()+"'},";
        }
        json  += "]}";
        return json;
    }

    @Override
    public List<DeleteStatus> select() throws Exception {
        return deleteStatusDao.findAll();
    }

    @Override
    public void deleteByAppName(String appName) throws Exception {
        deleteStatusDao.deleteByAppName(appName);
    }
}
