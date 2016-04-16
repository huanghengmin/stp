package com.hzih.stp.service.impl;

import cn.collin.commons.domain.PageResult;
import com.hzih.stp.dao.TypeCheckDao;
import com.hzih.stp.domain.TypeCheck;
import com.hzih.stp.service.TypeCheckService;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: 钱晓盼
 * Date: 12-7-26
 * Time: 下午6:20
 * To change this template use File | Settings | File Templates.
 */
public class TypeCheckServiceImpl implements TypeCheckService {
    private TypeCheckDao typeCheckDao;

    public void setTypeCheckDao(TypeCheckDao typeCheckDao) {
        this.typeCheckDao = typeCheckDao;
    }

    @Override
    public String select(String appName, String appType, String up, int start, int limit) throws Exception {
        int pageIndex = start / limit + 1;
        PageResult pageResult = typeCheckDao.listByPage(appName,appType,up,pageIndex,limit);
        int total = pageResult.getAllResultsAmount();
        String json = "{success:true,total:"+total+",rows:[";
        List<TypeCheck> list = pageResult.getResults();
        for( TypeCheck t : list){
            json += "{id:'"+t.getId()+"',appName:'"+t.getAppName()+"',appType:'"+t.getAppType()+
                    "',desc:'"+t.getDesc()+"',reDesc:'"+t.getReDesc()+"',up:"+t.getUp()+"},";
        }
        json += "]}";
        return json;
    }

    @Override
    public void insert(TypeCheck typeCheck) throws Exception {
        typeCheckDao.create(typeCheck);
    }

    @Override
    public void delete(String[] ids) throws Exception {
        typeCheckDao.deleteWithIndependent(ids);
    }

    @Override
    public void update(TypeCheck typeCheck) throws Exception {
        TypeCheck old = (TypeCheck) typeCheckDao.getById(typeCheck.getId());
        old.setAppName(typeCheck.getAppName());
        old.setAppType(typeCheck.getAppType());
        old.setDesc(typeCheck.getDesc());
        old.setReDesc(typeCheck.getReDesc());
        old.setUp(typeCheck.getUp());
        typeCheckDao.update(old);
    }

    @Override
    public void update(String[] ids) throws Exception {
        typeCheckDao.updateUp(ids);
    }
}
