package com.hzih.stp.web.filter;

import cn.collin.commons.utils.DateUtils;
import com.hzih.stp.web.SessionUtils;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * 检测用户是否已经登录
 * 
 * @author collin.code@gmail.com
 * 
 */
public class CheckLoginFilter implements Filter {

	public void destroy() {
	}

	public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {

		HttpServletRequest request = (HttpServletRequest) req;

		HttpServletResponse response = (HttpServletResponse) res;

		String requestURL = request.getRequestURL().toString();

//		if ((SessionUtils.getAccountConsole((HttpServletRequest) request) == null) && (requestURL.indexOf("loginConsole") < 0)) {
//			response.sendRedirect(request.getContextPath() + "/loginConsole.jsp");
//
//		} else 
			
		if(SessionUtils.getAccount((HttpServletRequest) request) == null && requestURL.indexOf("login") < 0 ){
			response.sendRedirect(request.getContextPath() + "/login.jsp");
		}else {
			// 如果不是前台自动发起的请求，则重新设置logintime
			if (requestURL.indexOf("checkTimeout.action") < 0 && requestURL.indexOf("alertRule.action") < 0 && requestURL.indexOf("alert.action") < 0) {
//				System.out.println("============"+requestURL);
//				System.out.println("============setLoginTime");
				
				SessionUtils.setLoginTime(request, DateUtils.getNow().getTime());
			}

			chain.doFilter(request, response);
		}
	}

	public void init(FilterConfig arg0) throws ServletException {
	}

}
