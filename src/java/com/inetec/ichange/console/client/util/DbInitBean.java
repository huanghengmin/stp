package com.inetec.ichange.console.client.util;


import com.inetec.ichange.console.config.utils.TriggerBean;

import java.io.Serializable;

/**
 * Created by IntelliJ IDEA.
 * User: wxh
 * Date: 2009-9-30
 * Time: 21:21:42
 * To change this template use File | Settings | File Templates.
 */
public class DbInitBean implements Serializable {
    private TriggerBean[] m_triggerBeans = null;
    private String m_temptable = "";
    private String[] m_tableNames = null;

    public DbInitBean() {

    }

    public TriggerBean[] getTriggerBeans() {
        return m_triggerBeans;
    }

    public void setTriggerBeans(TriggerBean[] beans) {
        m_triggerBeans = beans;
    }

    public void setTempTable(String tmptable) {
        m_temptable = tmptable;
    }

    public String getTempTable() {
        return m_temptable;
    }

    public void setTableNames(String[] tableNames) {
        m_tableNames = tableNames;
    }

    public String[] getTableNames() {
        return m_tableNames;
    }

    public String getTableNamesToString() {
        if (m_tableNames == null) {
            return "";
        }
        StringBuffer buff = new StringBuffer();
        for (int i = 0; i < m_tableNames.length; i++) {
            buff.append(m_tableNames[i]);
            if (i < m_tableNames.length - 1) {
                buff.append(";");
            }
        }
        return buff.toString();
    }

    public void setTableNamesForString(String value) {
        if (value == "") {
            return;
        }
        m_tableNames = parseTableNamesOfSplit(value, ";");
    }

    public void setTriggerBeansForString(String value) {
        if (value == "") {
            return;
        }
        String[] temps = value.split(";");
        m_triggerBeans = new TriggerBean[temps.length];
        for (int i = 0; i < temps.length; i++) {
            m_triggerBeans[i] = parseTriggerBeanOfSplit(temps[i], ",");
        }
    }

    public String getTriggerBeanToString() {
        if (m_triggerBeans == null) {
            return "";
        }
        StringBuffer buff = new StringBuffer();
        for (int i = 0; i < m_triggerBeans.length; i++) {
            buff.append(triggerBeanToString(m_triggerBeans[i]));
            if (i < m_triggerBeans.length - 1) {
                buff.append(";");
            }
        }
        return buff.toString();
    }

    private String[] parseTableNamesOfSplit(String tableNames, String f) {
        return tableNames.split(f);
    }

    private TriggerBean parseTriggerBeanOfSplit(String value, String f) {
        TriggerBean bean = new TriggerBean();
        String[] temp = value.split(f);
        if (temp.length >= 1)
            bean.setTableName(temp[0]);
        if (temp.length >= 2) {
            temp[1] = temp[1].toUpperCase();
            if (temp[1].indexOf("U") >= 0) {
                bean.setMonitorUpdate(true);
            }
            if (temp[1].indexOf("I") >= 0) {
                bean.setMonitorInsert(true);
            }
            if (temp[1].indexOf("D") >= 0) {
                bean.setMonitorDelete(true);
            }

        }
        if (temp.length == 3) {
            if (temp[2] != null) {
                bean.setPkFields(temp[2].split(":"));
            }
        }
        return bean;

    }

    private String triggerBeanToString(TriggerBean bean) {
        StringBuffer buff = new StringBuffer();
        buff.append(bean.getTableName());
        if (bean.isMonitorDelete() || bean.isMonitorInsert() || bean.isMonitorUpdate())
            buff.append(",");
        if (bean.isMonitorDelete()) {
            buff.append("D");
        }
        if (bean.isMonitorUpdate()) {

            buff.append("U");
        }
        if (bean.isMonitorInsert()) {
            buff.append("I");
        }
        if (bean.getPkFields() != null) {
            if (bean.getPkFields().length > 0) {
                buff.append(",");
                for (int i = 0; i < bean.getPkFields().length; i++) {
                    buff.append(bean.getPkFields()[i]);
                    if (i < bean.getPkFields().length - 1) {
                        buff.append(":");
                    }
                }
            }
        }
        return buff.toString();
    }

}
