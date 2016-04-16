/*=============================================================
 * �ļ����: TriggerBean
 * ��    ��: 1.0
 * ��    ��: ������
 * ����ʱ��: 2009-9-15
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

import java.io.Serializable;

/**
 * User: ������
 * Date: 2009-9-15
 * TIME: 22:37:45
 */
public class TriggerBean implements Serializable {
    public String tableName;
    public String[] pkFields;
    public boolean monitorInsert;
    public boolean monitorUpdate;
    public boolean monitorDelete;

    public String getTableName() {
        return tableName;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
    }

    public boolean isMonitorInsert() {
        return monitorInsert;
    }

    public void setMonitorInsert(boolean monitorInsert) {
        this.monitorInsert = monitorInsert;
    }

    public boolean isMonitorUpdate() {
        return monitorUpdate;
    }

    public void setMonitorUpdate(boolean monitorUpdate) {
        this.monitorUpdate = monitorUpdate;
    }

    public boolean isMonitorDelete() {
        return monitorDelete;
    }

    public void setMonitorDelete(boolean monitorDelete) {
        this.monitorDelete = monitorDelete;
    }

    public String[] getPkFields() {
        return pkFields;
    }

    public void setPkFields(String[] pkFields) {
        this.pkFields = pkFields;
    }
}
