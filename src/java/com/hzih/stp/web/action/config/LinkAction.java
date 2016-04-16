package com.hzih.stp.web.action.config;

import com.hzih.stp.service.LogService;
import com.hzih.stp.web.SessionUtils;
import com.hzih.stp.web.action.ActionBase;
import com.opensymphony.xwork2.ActionSupport;
import org.apache.log4j.Logger;
import org.apache.struts2.ServletActionContext;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 链路管理
 */
public class LinkAction extends ActionSupport {

	private static final Logger logger = Logger.getLogger(LinkAction.class);
	private LogService logService;
    private int start;
    private int limit;

	public String select() throws Exception {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result =	actionBase.actionBegin(request);
        String json = null;
        try{
            json = "{success:true,total:0,rows:[]}";
            logService.newLog("INFO",SessionUtils.getAccount(request).getUserName(),"链路管理","用户查找链路信息成功");

        } catch (Exception e){
            logger.error("链路管理",e);
            logService.newLog("ERROR",SessionUtils.getAccount(request).getUserName(),"链路管理","用户查找链路信息失败");
        }
        actionBase.actionEnd(response,json,result);
		return null;
	}

    public String insert() throws Exception {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result =	actionBase.actionBegin(request);
        String msg = null;
        try{

            msg = "新增链路成功";
            logService.newLog("INFO",SessionUtils.getAccount(request).getUserName(),"链路管理","用户新增链路信息成功");
        } catch (Exception e){
            logger.error("链路管理",e);
            logService.newLog("ERROR",SessionUtils.getAccount(request).getUserName(),"链路管理","用户新增链路信息失败");
            msg = "新增链路失败";
        }
        String json = "{success:true,msg:'"+msg+"'}";
        actionBase.actionEnd(response,json,result);
		return null;
	}


    public String selectLinkNameKeyValue() throws Exception {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result =	actionBase.actionBegin(request);
        String json = null;
        try{
            String linkType = request.getParameter("linkType");
            if(linkType!=null){
                if(linkType.equals("int")){
                    json = "{success:true,total:1,rows:[{key:'intLinkName',value:'intLinkName'}]}";
                    logService.newLog("INFO",SessionUtils.getAccount(request).getUserName(),"设备管理","用户获取所有内部链路名列表成功");
                }else if(linkType.equals("ext")){
                    json = "{success:true,total:1,rows:[{key:'extLinkName',value:'extLinkName'}]}";
                    logService.newLog("INFO",SessionUtils.getAccount(request).getUserName(),"设备管理","用户获取所有外部链路名列表成功");
                }
            } else {
                json = "{success:true,total:0,rows:[]}";
            }
        } catch (Exception e){
            logger.error("设备管理",e);
            logService.newLog("ERROR",SessionUtils.getAccount(request).getUserName(),"设备管理","用户获取所有链路名列表失败");
        }
        actionBase.actionEnd(response,json,result);
		return null;
	}


    public void setLogService(LogService logService) {
        this.logService = logService;
    }

    public int getStart() {
        return start;
    }

    public void setStart(int start) {
        this.start = start;
    }

    public int getLimit() {
        return limit;
    }

    public void setLimit(int limit) {
        this.limit = limit;
    }

}
