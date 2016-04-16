package com.hzih.stp.web.action.config;

import com.hzih.stp.domain.Account;
import com.hzih.stp.domain.ContentFilter;
import com.hzih.stp.service.ContentFilterService;
import com.hzih.stp.service.LogService;
import com.hzih.stp.web.SessionUtils;
import com.hzih.stp.web.action.ActionBase;
import com.opensymphony.xwork2.ActionSupport;
import org.apache.log4j.Logger;
import org.apache.struts.action.ActionForward;
import org.apache.struts2.ServletActionContext;
import org.springframework.web.bind.ServletRequestUtils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 过滤管理
 */
public class ManagerContentFilterAction extends ActionSupport {

	private static Logger logger = Logger.getLogger(ManagerContentFilterAction.class);
	private ContentFilterService contentFilterService;
	private LogService logService;
    private ContentFilter contentFilter;
    private String[] ids;
	
    public ActionForward select() throws Exception {
        ActionBase base = new ActionBase();
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        String result =	base.actionBegin(request);
        String json =null;
        try{
            int start = ServletRequestUtils.getIntParameter(request, "start");
            int limit = ServletRequestUtils.getIntParameter(request, "limit");
            int pageIndex = start / limit + 1;
            json = contentFilterService.getPages(pageIndex,limit);
            logger.info("过滤管理查看、查询功能");
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(), "过滤管理", "用户查找过滤信息成功");
        } catch (Exception e){
            logger.error("过滤管理",e);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(), "过滤管理", "用户查找过滤信息失败");
        }
        base.actionEnd(response, json ,result);
		return null;
	}

	public ActionForward insert() throws Exception {
        ActionBase base = new ActionBase();
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        String result =	base.actionBegin(request);
		String json = null;
        try {
            json = contentFilterService.insert(contentFilter);
            logger.info("过滤管理新增功能完成");
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(), "过滤管理", "用户新增过滤信息成功");
        }catch (Exception e) {
            logger.error("过滤管理", e);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(), "过滤管理", "用户新增过滤信息失败");
            json = "{success:true,msg:'新增失败'}";
        }
        base.actionEnd(response,json,result);
		return null;
	}

	public ActionForward delete() throws Exception {
        ActionBase base = new ActionBase();
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        String result =	base.actionBegin(request);
		String json = null;
        try{
            json = contentFilterService.delete(ids);
            logger.info("过滤管理删除功能完成");
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(), "过滤管理", "用户删除过滤信息成功");
        }catch (Exception e) {
            logger.info("过滤管理",e);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(), "过滤管理", "用户删除过滤信息失败");
            json = "{success:true,msg:'删除失败'}";
        }
        base.actionEnd(response,json,result);
		return null;
	}

	public ActionForward update() throws Exception {
        ActionBase base = new ActionBase();
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        String result =	base.actionBegin(request);
        String json = null;
        try{
            Account account = SessionUtils.getAccount(request);
            json = contentFilterService.update(contentFilter);
            logger.info("过滤管理修改功能完成");
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(), "过滤管理", "用户修改过滤信息成功");
        }catch (Exception e) {
            logger.info("过滤管理",e);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(), "过滤管理", "用户修改过滤信息失败");
            json = "{success:true,msg:'修改失败'}";
        }
        base.actionEnd(response,json,result);
		return null;
	}

    public LogService getLogService() {
        return logService;
    }

    public void setLogService(LogService logService) {
        this.logService = logService;
    }

    public void setContentFilterService(ContentFilterService contentFilterService) {
        this.contentFilterService = contentFilterService;
    }

    public ContentFilter getContentFilter() {
        return contentFilter;
    }

    public void setContentFilter(ContentFilter contentFilter) {
        this.contentFilter = contentFilter;
    }

    public String[] getIds() {
        return ids;
    }

    public void setIds(String[] ids) {
        this.ids = ids;
    }
}
