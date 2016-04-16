package com.hzih.stp.utils;

import cn.collin.commons.utils.DateUtils;
import com.hzih.stp.web.SessionUtils;
import com.hzih.stp.web.SiteContext;

import javax.servlet.http.HttpServletRequest;

public class CheckTimeResult {
	public String getResult(HttpServletRequest request){
        String result = "";
        long loginTime = SessionUtils.getLoginTime(request);
//        System.out.println("  now time is "+DateUtils.getNow().getTime());
//        System.out.println("login time is "+loginTime);
//        System.out.println("now -login is "+(DateUtils.getNow().getTime() - loginTime));
//        System.out.println(DateUtils.getNow().getTime() - loginTime > SiteContext.getInstance().safePolicy.getTimeout() * 1000);
        if (DateUtils.getNow().getTime() - loginTime > SiteContext
                .getInstance().safePolicy.getTimeout() * 1000) {
            result = "true";
        }
//        SessionUtils.setLoginTime(request, DateUtils.getNow().getTime());
	     return result;
	}
}
