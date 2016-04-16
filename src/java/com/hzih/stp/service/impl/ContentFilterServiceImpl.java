package com.hzih.stp.service.impl;

import cn.collin.commons.domain.PageResult;
import com.hzih.stp.dao.ContentFilterDao;
import com.hzih.stp.domain.ContentFilter;
import com.hzih.stp.service.ContentFilterService;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: 钱晓盼
 * Date: 12-7-12
 * Time: 下午3:19
 * To change this template use File | Settings | File Templates.
 */
public class ContentFilterServiceImpl implements ContentFilterService {
    private ContentFilterDao contentFilterDao;

    public void setContentFilterDao(ContentFilterDao contentFilterDao) {
        this.contentFilterDao = contentFilterDao;
    }

    @Override
    public String getPages(int pageIndex, int limit) throws Exception {
        PageResult pageResult = contentFilterDao.listByPage(pageIndex,limit);
        String json = "{success:true,total:"+pageResult.getAllResultsAmount()+",rows:[";
        List<ContentFilter> list = pageResult.getResults();
        for(ContentFilter c : list){
            json += "{id:'"+c.getId()+"',filter:'"+c.getFilter()+"'},";
        }
        json  += "]}";
        return json;
    }

    @Override
    public String insert(ContentFilter contentFilter) throws Exception {
        contentFilterDao.create(contentFilter);
        return "{success:true,msg:'新增成功,点击[确定]返回列表!'}";
    }

    @Override
    public String delete(String[] ids) throws Exception {
        contentFilterDao.deleteWithDependent(ids);
        return "{success:true,msg:'删除成功,点击[确定]返回列表!'}";
    }

    @Override
    public String update(ContentFilter contentFilter) throws Exception {
        ContentFilter old = (ContentFilter) contentFilterDao.retrieveById(ContentFilter.class,contentFilter.getId());
        old.setFilter(contentFilter.getFilter());
        contentFilterDao.update(old);
        return "{success:true,msg:'修改成功,点击[确定]返回列表!'}";
    }
}
