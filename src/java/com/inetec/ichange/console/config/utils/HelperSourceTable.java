/*=============================================================
 * �ļ����: HelperSourceTable
 * ��    ��: 1.0
 * ��    ��: ������
 * ����ʱ��: 2009-8-13
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
package com.inetec.ichange.console.config.utils;

import java.util.ArrayList;
import java.util.List;

/**
 * User: ������
 * Date: 2009-8-13
 * Time: 19:50:56
 */
public class HelperSourceTable {
    private String tableName;
    private List fields = new ArrayList();

    public String getTableName() {
        return tableName;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
    }

    public List getFields() {
        return fields;
    }

    public void setField(String fieldName) {
        this.fields.add(fieldName);
    }
}
