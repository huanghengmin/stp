package com.hzih.stp.web.action;

import cn.collin.commons.utils.DateUtils;
import com.hzih.stp.utils.CheckTimeResult;
import com.hzih.stp.utils.StringUtils;
import com.hzih.stp.web.SessionUtils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class ActionBase {

	private static final long serialVersionUID = -3517772370262338399L;

	public String actionBegin(HttpServletRequest request){
		request.getCharacterEncoding();
		String result = new CheckTimeResult().getResult(request);
        SessionUtils.setLoginTime(request, DateUtils.getNow().getTime());
		return result;
	}
	
	public void actionEnd(HttpServletResponse response,String json,String result) throws IOException {
		response.setCharacterEncoding("utf-8");
		StringUtils st = new StringUtils();

		response.setContentType("text/html");//上传文件回调函数处理时需要
		response.getWriter().print(result);
		
		response.getWriter().write(st.trim(json));
		response.getWriter().close();
	}

    /**
     * 不需要改变登录时间
     * @param response
     * @param json
     * @throws IOException
     */
    public void actionEnd(HttpServletResponse response, String json) throws IOException{
        response.setCharacterEncoding("utf-8");
        StringUtils st = new StringUtils();
        response.getWriter().write(st.trim(json));
        response.getWriter().close();
    }
}
