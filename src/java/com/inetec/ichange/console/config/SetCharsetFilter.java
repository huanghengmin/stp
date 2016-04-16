/*=============================================================
 * �ļ����: SetCharsetFilter
 * ��    ��: 1.0
 * ��    ��: ������
 * ����ʱ��: 2009-9-7
 * ============================================================
 * <p>��Ȩ����  (c) 2009 ���������Ϣ�������޹�˾</p>
 * <p>
 * ��Դ���ļ���Ϊ���������Ϣ�������޹�˾�����һ���֣����
 * �˱���˾�Ļ��ܺ�����Ȩ��Ϣ����ֻ�ṩ��˾���������û�ʹ�á�
 * </p>
 * <p>
 * ���ڱ����ʹ�ã��������ر�������˵��������������涨�����޺�
 * ������
 * </p>
 * <p>
 * �ر���Ҫָ�����ǣ�����Դӱ���˾��������߸�����Ĳ��������ߺ�
 * ����ȡ�ò���Ȩʹ�ñ����򡣵��ǲ��ý��и��ƻ���ɢ�����ļ���Ҳ��
 * ��δ������˾����޸�ʹ�ñ��ļ������߽��л��ڱ�����Ŀ���������
 * ���ǽ������ķ����޶��ڶ����ַ�����˾��Ȩ����Ϊ�������ߡ�
 * </p>
 * ==========================================================*/
package com.inetec.ichange.console.config;

import javax.servlet.*;
import java.io.IOException;

/**
 * User: ������
 * Date: 2009-9-7
 * Time: 23:39:14
 */
public class SetCharsetFilter implements Filter {
    //Ҫ�ƶ��ı��룬��web.xml������
    protected String encoding = null;

    protected FilterConfig filterConfig = null;

    public void destroy() {
        this.encoding = null;
        this.filterConfig = null;
    }

    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        if (request.getCharacterEncoding() == null) {
            //�õ�ָ���ı�������
            String encoding = getEncoding();
            //����request�ı���
            request.setCharacterEncoding(encoding);
        }
        //�л��ִ����һ��filter
        chain.doFilter(request, response);
    }

    public void init(FilterConfig filterConfig) throws ServletException {
        this.filterConfig = filterConfig;
        //�õ���web.xml�����õı���
        this.encoding = filterConfig.getInitParameter("encoding");
        //���û��������ʹ��Ĭ��ֵ
        if (this.encoding == null)
            encoding = Constant.DEFAULT_ENCODING;
    }


    protected String getEncoding() {
        //�õ�ָ���ı���
        return (this.encoding);
    }


}
