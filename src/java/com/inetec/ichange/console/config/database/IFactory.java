/*=============================================================
 * �ļ����: IFactory
 * ��    ��: 1.0
 * ��    ��: ������
 * ����ʱ��: 2009-8-8
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
package com.inetec.ichange.console.config.database;

import com.inetec.common.config.stp.nodes.Jdbc;
import com.inetec.common.exception.Ex;

/**
 * ���󹤳�,��ͬ��ݿ����ͬ����ݿ����ӳغ���ݿ��������
 * User: ������
 * Date: 2009-8-8
 * Time: 23:22:15
 */
public abstract class IFactory {

    protected Jdbc jdbc;
    protected String dbLocal;
    
    public IFactory() {
	}
    public IFactory(Jdbc jdbc, String dbLocal) {
        this.jdbc = jdbc;
        this.dbLocal = dbLocal;
    }

    public Jdbc getJdbc() {
        return jdbc;
    }

    public void setJdbc(Jdbc jdbc) {
        this.jdbc = jdbc;
    }

    public String getDbLocal() {
        return dbLocal;
    }

    public void setDbLocal(String dbLocal) {
        this.dbLocal = dbLocal;
    }

    /**
     * ��ݿ����ӳع�����
     *
     * @return
     * @throws com.inetec.common.exception.Ex
     */
//    abstract public IUtils getDBUtils() throws Ex;

    /**
     * ��ݿ������
     *
     * @return
     * @throws com.inetec.common.exception.Ex
     */
    abstract public IDataBase getDataBase() throws Ex;
}
