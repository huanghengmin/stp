package com.hzih.stp.service.impl;

import cn.collin.commons.domain.PageResult;
import com.hzih.stp.dao.SecurityLevelDao;
import com.hzih.stp.domain.SecurityLevel;
import com.hzih.stp.service.SecurityLevelService;
import org.apache.log4j.Logger;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: 钱晓盼
 * Date: 12-7-12
 * Time: 下午3:19
 * To change this template use File | Settings | File Templates.
 */
public class SecurityLevelServiceImpl implements SecurityLevelService {
    private static final Logger logger = Logger.getLogger(SecurityLevelServiceImpl.class);
    private SecurityLevelDao securityLevelDao;

    public void setSecurityLevelDao(SecurityLevelDao securityLevelDao) {
        this.securityLevelDao = securityLevelDao;
    }

    @Override
    public String getPages(int pageIndex, int limit) throws Exception {
        PageResult pageResult = securityLevelDao.listByPage(pageIndex,limit);
        String json = "{success:true,total:"+pageResult.getAllResultsAmount()+",rows:[";
        List<SecurityLevel> list = pageResult.getResults();
        for(SecurityLevel s : list){
            json += "{id:'"+s.getId()+"',levelInfo:"+s.getLevelInfo()+
                    ",securityFlag:'"+s.getSecurityFlag()+"',securityLevel:"+s.getSecurityLevel()+"},";
        }
        json  += "]}";
        return json;
    }

    @Override
    public String insert(SecurityLevel securityLevel) throws Exception {
        securityLevelDao.create(securityLevel);
        return "{success:true,msg:'新增成功,点击[确定]返回列表!'}";
    }

    @Override
    public String delete(String[] ids) throws Exception {
        for(int i = ids.length-1;i>=0;i--) {
//            securityLevelDao.deleteWithDependent(ids);
            securityLevelDao.delete(Long.valueOf(ids[i]));
        }
        return "{success:true,msg:'删除成功,点击[确定]返回列表!'}";
    }

    @Override
    public String update(SecurityLevel securityLevel) throws Exception {
        SecurityLevel old = (SecurityLevel) securityLevelDao.getById(securityLevel.getId());
        old.setLevelInfo(securityLevel.getLevelInfo());
        old.setSecurityFlag(securityLevel.getSecurityFlag());
        old.setSecurityLevel(securityLevel.getSecurityLevel());
        securityLevelDao.update(old);
        return "{success:true,msg:'修改成功,点击[确定]返回列表!'}";
    }

    @Override
    public String getLevelKeyValue() throws Exception {
        List<SecurityLevel> list = securityLevelDao.findAll();
        String json = "{success:true,total:"+list.size()+",rows:[" ;
        for (SecurityLevel s : list){
            String key = setKey(Integer.parseInt(s.getLevelInfo()));
            if(key!=null){
                json += "{key:'"+key+"',value:'"+s.getLevelInfo()+"'},";
            } else {
                logger.error("信息等级不对,只能是0-5");
            }
        }
        json += "]}";
        return json;
    }

    private String setKey(int value) {
        if(value==0){
            return "公开信息";
        } else if (value==1){
            return "第一级";
        } else if (value==2){
            return "第二级";
        } else if (value==3){
            return "第三级";
        } else if (value==4){
            return "第四级";
        } else if (value==5){
            return "第五级";
        }
        return null;
    }
}
