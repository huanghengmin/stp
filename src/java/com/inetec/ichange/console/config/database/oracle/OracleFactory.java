/*=============================================================
 * �ļ����: OracleFactory
 * ��    ��: 1.0
 * ��    ��: ������
 * ����ʱ��: 2009-8-21
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
package com.inetec.ichange.console.config.database.oracle;

import com.inetec.common.config.stp.nodes.Jdbc;
import com.inetec.common.exception.E;
import com.inetec.common.exception.Ex;
import com.inetec.ichange.console.config.Constant;
import com.inetec.ichange.console.config.database.IDataBase;
import com.inetec.ichange.console.config.database.IFactory;

/**
 * User: ������
 * Date: 2009-8-21
 * Time: 23:14:48
 */
public class OracleFactory extends IFactory {

    public OracleFactory(Jdbc jdbc, String dbLocal) {
        super(jdbc, dbLocal);
    }

    public IDataBase getDataBase() throws Ex {
        if (dbLocal.equals(Constant.DB_INTERNAL))
            return new OracleInternal(this.jdbc);

        throw new Ex().set(E.E_Unknown, E.KEY_UNKNOWN, "��ݿ�λ��");
    }
}
