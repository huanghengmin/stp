package com.inetec.ichange.console.config.database.db2;

import com.hzih.stp.utils.StringUtils;
import com.inetec.common.config.stp.EConfig;
import com.inetec.common.config.stp.nodes.Field;
import com.inetec.common.config.stp.nodes.Jdbc;
import com.inetec.common.config.stp.nodes.Table;
import com.inetec.common.exception.E;
import com.inetec.common.exception.Ex;
import com.inetec.common.i18n.Message;
import com.inetec.ichange.console.config.Constant;
import com.inetec.ichange.console.config.database.DBUtil;
import com.inetec.ichange.console.config.database.IInternal;
import com.inetec.ichange.console.config.utils.TriggerBean;

import java.io.IOException;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.HashMap;
import java.util.Map;

public class DB2Internal extends IInternal {

    public DB2Internal(Jdbc jdbc) throws Ex {
        super(jdbc);
        if (jdbc.getDbCatalog() != null && !jdbc.getDbCatalog().equals(""))
            m_catalog = jdbc.getDbCatalog().toUpperCase();
        this.m_schema = jdbc.getDbOwner().toUpperCase();
        try {
            this.dbutil = new DBUtil(jdbc);
            script.load(this.getClass().getResourceAsStream("/dbscripts/db2/init-db2.properties"));
        } catch (IOException e) {
            throw new Ex().set(E.E_IOException, e, new Message("读取数据库配置脚本的时候出现问题"));
        }
    }

    /**
     * 创建触发器
     *
     * @param triggers
     * @param tempTable
     * @throws com.inetec.common.exception.Ex
     */
    public void createTrigger(TriggerBean[] triggers, String tempTable) throws Ex {
//        logger.info("createTrigger()");
        Statement stmt = null;
//        String dbowner = jdbc.getDbOwner();
        try {
            stmt = conn.createStatement();
            for (int i = 0; i < triggers.length; i++) {
                TriggerBean trigger = triggers[i];
                //ȡ�øı������������
//                List columns = getFields(trigger.getTableName());
                String newpatterns = "";
                String oldpatterns = "";
                String pknames = "";
                String pktypes = "";
                String newValues = "";
                String oldValues = "";
                String pk_values = "";
                String[] pks = trigger.getPkFields();
                for (int k = 0; k < pks.length; k++) {
                    Field field = getField(trigger.getTableName(), pks[k]);
                    if (k > 0) {
                        if (field.getJdbcType().equalsIgnoreCase("date") || field.getJdbcType().equalsIgnoreCase("timestamp") || field.getDbType().equalsIgnoreCase("date")) {
                            newpatterns = newpatterns + " ||','||TO_CHAR(:new." + field.getFieldName() + ",'YYYY-MM-DD HH:MM:SS')";
                            oldpatterns = oldpatterns + " ||','||TO_CHAR(:old." + field.getFieldName() + ",'YYYY-MM-DD HH:MM:SS')";
                        } else {

                            newpatterns = newpatterns + "||','||TO_CHAR(:new." + field.getFieldName() + ")";
                            oldpatterns = oldpatterns + "||','||TO_CHAR(:old." + field.getFieldName() + ")";
                        }
                    } else {
                        if (pks.length > 1) {
                            if (field.getJdbcType().equalsIgnoreCase("date") || field.getJdbcType().equalsIgnoreCase("timestamp") || field.getDbType().equalsIgnoreCase("date")) {
                                newpatterns = newpatterns + " ||','||TO_CHAR(:new." + field.getFieldName() + ",'YYYY-MM-DD HH:MM:SS')";
                                oldpatterns = oldpatterns + " ||','||TO_CHAR(:old." + field.getFieldName() + ",'YYYY-MM-DD HH:MM:SS')";
                            } else {
                                newpatterns = newpatterns + ",TO_CHAR(:new." + field.getFieldName() + ")";
                                oldpatterns = oldpatterns + ",TO_CHAR(:old." + field.getFieldName() + ")";
                            }
                        } else {
                            newpatterns = newpatterns + ",TO_CHAR(:new." + field.getFieldName() + ")";
                            oldpatterns = oldpatterns + ",TO_CHAR(:old." + field.getFieldName() + ")";
                        }

                    }
                    pknames = pknames + "," + field.getFieldName();
                    pktypes = pktypes + "," + field.getDbType();

                    pk_values = pk_values + "','||pk_val_" + k + "||";
                }

                pk_values = pk_values.substring(3);

                //���ñ�û��PK
                if (!pknames.equals("")) {
                    //ȥ�������ǰ׺��־
                    oldpatterns = oldpatterns + oldValues;
                    newpatterns = newpatterns + newValues;
                    pknames = pknames.substring(1);
                    pktypes = pktypes.substring(1);

                    //����sequence
                    int hashcode = Math.abs((trigger.getTableName() + tempTable).hashCode());
                    if (trigger.isMonitorDelete()) {
                        //�����������,ȡ���hashCode��Ϊ���
                        String triggerName = "ICG_" + hashcode + "_D";
                        Statement trigstmt = null;
                        ResultSet trig = null;
                        try {
                            trigstmt = conn.createStatement();
                            trig = trigstmt.executeQuery(script
                                    .getProperty(Constant.S_PROP_QUERY_TRIGGER)
                                    .replaceAll("tab_schema", jdbc.getDbOwner())
                                    .replaceAll("tab_triggername", triggerName));

                            if (!trig.next()) {
                                //�滻��sql�еĲ���
                                String delete = script.getProperty(Constant.S_PROP_DELETE_TRIGGER)
                                        .replaceAll("schema", jdbc.getDbOwner()) //�滻shema�����
                                        .replaceAll("triggername", triggerName)  //�滻trigger�����
                                        .replaceAll("table_name", trigger.getTableName()) //�滻������
                                        .replaceAll("temptable", tempTable)
                                        .replaceAll("pkpatterns", oldpatterns)
                                        .replaceAll("pkvalues", pk_values)
                                        .replaceAll("pknames", pknames)        //�滻PK�����
                                        .replaceAll("pktypes", pktypes);//�滻Pk������
                                //��������
                                stmt.execute(delete);
                            }
                        } catch (SQLException e) {
                            throw new Ex().set(EConfig.E_SQLException, e, new Message("数据异常"));
                        } finally {
                            trig.close();
                            trigstmt.close();
                        }
                    } else {
                        //ɾ����
                        //�����������,ȡ���hashCode��Ϊ���
                        String triggerName = "ICG_" + hashcode + "_D";
                        Statement trigstmt = null;
                        ResultSet trig = null;
                        try {
                            trigstmt = conn.createStatement();
                            trig = trigstmt.executeQuery(script
                                    .getProperty(Constant.S_PROP_QUERY_TRIGGER)
                                    .replaceAll("tab_schema", jdbc.getDbOwner())
                                    .replaceAll("tab_triggername", triggerName));
                            if (trig.next()) {
                                //�滻��sql�еĲ���
                                String delete = script.getProperty(Constant.S_PROP_DROP_TRIGGER)
                                        .replaceAll("schema", jdbc.getDbOwner())
                                        .replaceAll("triggername", triggerName);
                                //��������
                                stmt.execute(delete);
                            }
                        } catch (SQLException e) {
                            throw new Ex().set(EConfig.E_SQLException, e, new Message("数据异常"));
                        } finally {
                            trig.close();
                            trigstmt.close();
                        }
                    }
                    if (trigger.isMonitorInsert()) {
                        String triggerName = "ICG_" + hashcode + "_I";
                        Statement trigstmt = null;
                        ResultSet trig = null;
                        try {
                            trigstmt = conn.createStatement();
                            trig = trigstmt.executeQuery(script
                                    .getProperty(Constant.S_PROP_QUERY_TRIGGER)
                                    .replaceAll("tab_schema", jdbc.getDbOwner())
                                    .replaceAll("tab_triggername", triggerName));
                            if (!trig.next()) {
                                //�滻��sql�еĲ���
                                String insert = script.getProperty(Constant.S_PROP_INSERT_TRIGGER)
                                        .replaceAll("schema", jdbc.getDbOwner()) //�滻shema�����
                                        .replaceAll("triggername", triggerName)  //�滻trigger�����
                                        .replaceAll("table_name", trigger.getTableName()) //�滻������
                                        .replaceAll("temptable", tempTable)
                                        .replaceAll("pkpatterns", newpatterns)
                                        .replaceAll("pkvalues", pk_values)
                                        .replaceAll("pknames", pknames)        //�滻PK�����
                                        .replaceAll("pktypes", pktypes);//�滻Pk������
                                //��������
                                stmt.execute(insert);
                            }
                        } catch (SQLException e) {
                            throw new Ex().set(EConfig.E_SQLException, e, new Message("数据异常"));
                        } finally {
                            trig.close();
                            trigstmt.close();
                        }
                    } else {
                        //ɾ����
                        //�����������,ȡ���hashCode��Ϊ���
                        String triggerName = "ICG_" + hashcode + "_I";
                        Statement trigstmt = null;
                        ResultSet trig = null;
                        try {
                            trigstmt = conn.createStatement();
                            trig = trigstmt.executeQuery(script
                                    .getProperty(Constant.S_PROP_QUERY_TRIGGER)
                                    .replaceAll("tab_schema", jdbc.getDbOwner())
                                    .replaceAll("tab_triggername", triggerName));
                            if (trig.next()) {
                                //�滻��sql�еĲ���
                                String delete = script.getProperty(Constant.S_PROP_DROP_TRIGGER)
                                        .replaceAll("schema", jdbc.getDbOwner())
                                        .replaceAll("triggername", triggerName);
                                //��������
                                stmt.execute(delete);
                            }
                        } catch (SQLException e) {
                            throw new Ex().set(EConfig.E_SQLException, e, new Message("数据异常"));
                        } finally {
                            trig.close();
                            trigstmt.close();
                        }
                    }
                    if (trigger.isMonitorUpdate()) {
                        String triggerName = "ICG_" + hashcode + "_U";
                        Statement trigstmt = null;
                        ResultSet trig = null;
                        try {
                            trigstmt = conn.createStatement();
                            trig = trigstmt.executeQuery(script
                                    .getProperty(Constant.S_PROP_QUERY_TRIGGER)
                                    .replaceAll("tab_schema", jdbc.getDbOwner())
                                    .replaceAll("tab_triggername", triggerName));
                            if (!trig.next()) {
                                //�滻��sql�еĲ���
                                String update = script.getProperty(Constant.S_PROP_UPDATE_TRIGGER)
                                        .replaceAll("schema", jdbc.getDbOwner()) //�滻shema�����
                                        .replaceAll("triggername", triggerName)  //�滻trigger�����
                                        .replaceAll("table_name", trigger.getTableName()) //�滻������
                                        .replaceAll("temptable", tempTable)
                                        .replaceAll("pkpatterns", newpatterns)
                                        .replaceAll("pkvalues", pk_values)
                                        .replaceAll("pknames", pknames)        //�滻PK�����
                                        .replaceAll("pktypes", pktypes);//�滻Pk������
                                //��������
                                stmt.execute(update);
                            }
                        } catch (SQLException e) {
                            throw new Ex().set(EConfig.E_SQLException, e, new Message("数据异常"));
                        } finally {
                            trig.close();
                            trigstmt.close();
                        }
                    } else {
                        //ɾ����
                        //�����������,ȡ���hashCode��Ϊ���
                        String triggerName = "ICG_" + hashcode + "_U";
                        Statement trigstmt = null;
                        ResultSet trig = null;
                        try {
                            trigstmt = conn.createStatement();
                            trig = trigstmt.executeQuery(script
                                    .getProperty(Constant.S_PROP_QUERY_TRIGGER)
                                    .replaceAll("tab_schema", jdbc.getDbOwner())
                                    .replaceAll("tab_triggername", triggerName));
                            if (trig.next()) {
                                //�滻��sql�еĲ���
                                String delete = script.getProperty(Constant.S_PROP_DROP_TRIGGER)
                                        .replaceAll("schema", jdbc.getDbOwner())
                                        .replaceAll("triggername", triggerName);
                                //��������
                                stmt.execute(delete);
                            }
                        } catch (SQLException e) {
                            throw new Ex().set(EConfig.E_SQLException, e, new Message("数据异常"));
                        } finally {
                            trig.close();
                            trigstmt.close();
                        }
                    }
                } else {
                    logger.warn("数据表 " + trigger.getTableName() + " 中没有主键,不能创建触发器!");
                }
            }

            //��������
//            stmt.executeBatch();
        } catch (SQLException e) {
            throw new Ex().set(EConfig.E_SQLException, e, new Message("数据异常"));
        } finally {
            if (stmt != null) {
                try {
                    stmt.close();
                } catch (SQLException e) {
                    throw new Ex().set(EConfig.E_SQLException, e, new Message("关闭statement时出现异常"));
                }
            }
        }
    }

    /**
     * 删除触发器
     *
     * @param triggers
     * @param tempTable
     * @throws com.inetec.common.exception.Ex
     */
    public void removeTrigger(TriggerBean[] triggers, String tempTable) throws Ex {
//        logger.info("removeTrigger()");
        Statement stmt = null;
//        String dbowner = jdbc.getDbOwner();
        try {
            stmt = conn.createStatement();
            for (int i = 0; i < triggers.length; i++) {
                TriggerBean trigger = triggers[i];
                //����sequence
                int hashcode = Math.abs((trigger.getTableName() + tempTable).hashCode());
                if (trigger.isMonitorDelete()) {
                    //�����������,ȡ���hashCode��Ϊ���
                    String triggerName = "ICG_" + hashcode + "_D";
//                    System.out.println(triggerName);
                    Statement trigstmt = null;
                    ResultSet trig = null;
                    try {
                        trigstmt = conn.createStatement();
                        trig = trigstmt.executeQuery(script
                                .getProperty(Constant.S_PROP_QUERY_TRIGGER)
                                .replaceAll("tab_schema", jdbc.getDbOwner())
                                .replaceAll("tab_triggername", triggerName));
                        if (trig.next()) {
                            //�滻��sql�еĲ���
                            String delete = script.getProperty(Constant.S_PROP_DROP_TRIGGER)
                                    .replaceAll("schema", jdbc.getDbOwner())
                                    .replaceAll("triggername", triggerName);

                            //��������
                            stmt.execute(delete);
                        }
                    } catch (SQLException e) {
                        throw new Ex().set(EConfig.E_SQLException, e, new Message("数据异常"));
                    } finally {
                        trig.close();
                        trigstmt.close();
                    }
                }
                if (trigger.isMonitorInsert()) {
                    String triggerName = "ICG_" + hashcode + "_I";
                    Statement trigstmt = null;
                    ResultSet trig = null;
                    try {
                        trigstmt = conn.createStatement();
                        trig = trigstmt.executeQuery(script
                                .getProperty(Constant.S_PROP_QUERY_TRIGGER)
                                .replaceAll("tab_schema", jdbc.getDbOwner())
                                .replaceAll("tab_triggername", triggerName));
                        if (trig.next()) {
                            //�滻��sql�еĲ���
                            String insert = script.getProperty(Constant.S_PROP_DROP_TRIGGER)
                                    .replaceAll("schema", jdbc.getDbOwner())
                                    .replaceAll("triggername", triggerName);
                            //��������
                            stmt.execute(insert);
                        }
                    } catch (SQLException e) {
                        throw new Ex().set(EConfig.E_SQLException, e, new Message("数据异常"));
                    } finally {
                        trig.close();
                        trigstmt.close();
                    }
                }
                if (trigger.isMonitorUpdate()) {
                    String triggerName = "ICG_" + hashcode + "_U";
                    Statement trigstmt = null;
                    ResultSet trig = null;
                    try {
                        trigstmt = conn.createStatement();
                        trig = trigstmt.executeQuery(script
                                .getProperty(Constant.S_PROP_QUERY_TRIGGER)
                                .replaceAll("tab_schema", jdbc.getDbOwner())
                                .replaceAll("tab_triggername", triggerName));
                        if (trig.next()) {
                            //�滻��sql�еĲ���
                            String update = script.getProperty(Constant.S_PROP_DROP_TRIGGER)
                                    .replaceAll("schema", jdbc.getDbOwner())
                                    .replaceAll("triggername", triggerName);
                            //��������
                            stmt.execute(update);
                        }
                    } catch (SQLException e) {
                        throw new Ex().set(EConfig.E_SQLException, e, new Message("数据异常"));
                    } finally {
                        trig.close();
                        trigstmt.close();
                    }
                }
            }
            //��������
//            stmt.executeBatch();
        } catch (SQLException e) {
            throw new Ex().set(EConfig.E_SQLException, e, new Message("数据异常"));
        } finally {
            if (stmt != null) {
                try {
                    stmt.close();
                } catch (SQLException e) {
                    throw new Ex().set(EConfig.E_SQLException, e, new Message("关闭statement时出现异常"));
                }
            }
        }
    }

    /**
     *创建标记
     *
     * @param tableNames
     * @throws com.inetec.common.exception.Ex
     */
    public void createFlag(String[] tableNames) throws Ex {
//        logger.info("createFlag()");
        Statement stmt = null;
        try {
//            conn.setAutoCommit(false);
            stmt = conn.createStatement();
            for (int i = 0; i < tableNames.length; i++) {
                boolean isColumnExist = false;
                String[] fields = this.getFieldNames(tableNames[i]);
                for (int k = 0; k < fields.length; k++) {
                    //����ֶβ�����,�����
                    if (fields[k].equals(Constant.S_FLAG_COLUMN)) {
                        isColumnExist = true;
                    }
                }
                if (!isColumnExist) {
                    //����Trigger��ͬʱ��ʽ����Լ��,��ʽΪ������+Flag��hashcode
                    stmt.execute("ALTER TABLE " + m_schema + "." + tableNames[i] + " ADD " + Constant.S_FLAG_COLUMN + " char(1)  DEFAULT '0' NOT NULL");
                }
            }
//            stmt.executeBatch();
//            try {
//                conn.commit();
//            } catch (SQLException e) {
//                conn.rollback();
//                throw new Ex().set(EConfig.E_SQLException, e, new Message("设置数据库事务提交失败,发生回滚"));
//            }
        } catch (SQLException e) {
            throw new Ex().set(EConfig.E_SQLException, e, new Message("数据库操作出现异常"));
        } finally {
            try {
                conn.setAutoCommit(true);
            } catch (SQLException e) {
                throw new Ex().set(EConfig.E_SQLException, e, new Message("设置数据库可以自动提交时出现异常"));
            }

            if (stmt != null) {
                try {
                    stmt.close();
                } catch (SQLException e) {
                    throw new Ex().set(EConfig.E_SQLException, e, new Message("关闭statement时出现异常"));
                }
            }
        }
    }

    /**
     * 移除标记位
     *
     * @param tableNames
     * @throws com.inetec.common.exception.Ex
     */
    public void removeFlag(String[] tableNames) throws Ex {
        logger.info("removeFlag()");
        Statement stmt = null;
        try {
            conn.setAutoCommit(false);
            stmt = conn.createStatement();
            for (int i = 0; i < tableNames.length; i++) {
                String[] fields = this.getFieldNames(tableNames[i]);
                for (int k = 0; k < fields.length; k++) {
                    //如果字段已经存在,则删除
                    if (fields[k].equals(Constant.S_FLAG_COLUMN)) {
                        //首先删除约束
//                        stmt.addBatch("ALTER TABLE " + jdbc.getDbOwner() + "." + tableNames[i] + " DROP CONSTRAINT " + tableNames[i] + "_" + Constant.S_FLAG_COLUMN.hashCode());
                        //再删除Flag
                        stmt.addBatch("ALTER TABLE " + m_schema + "." + tableNames[i] + " DROP " + Constant.S_FLAG_COLUMN);
                        break;
                    }
                }
            }
            stmt.executeBatch();
            try {
                conn.commit();
            } catch (SQLException e) {
                conn.rollback();
                throw new Ex().set(EConfig.E_SQLException, e, new Message("设置数据库事务提交失败,发生回滚"));
            }
        } catch (SQLException e) {
            throw new Ex().set(EConfig.E_SQLException, e, new Message("数据库操作出现异常"));
        } finally {
            try {
                conn.setAutoCommit(true);
            } catch (SQLException e) {
                throw new Ex().set(EConfig.E_SQLException, e, new Message("设置数据库可以自动提交时出现异常"));
            }

            if (stmt != null) {
                try {
                    stmt.close();
                } catch (SQLException e) {
                    throw new Ex().set(EConfig.E_SQLException, e, new Message("关闭statement时出现异常"));
                }
            }
        }
    }

    public void createTempTable(String temptable) throws Ex {
//        logger.info("createTempTable()");
        Statement tempstmt = null;
        ResultSet temp = null;
//        String dbowner = jdbc.getDbOwner().toUpperCase();
        temptable = temptable.toUpperCase();
        try {
            //创建TODO表,如果不存在就创建
            tempstmt = conn.createStatement();
            temp = tempstmt.executeQuery(script
                    .getProperty(Constant.S_PROP_QUERY_TEMPTABLE)
                    .replaceAll("schema", m_schema)
                    .replaceAll("tablename", temptable));
            if (!temp.next()) {
                tempstmt.execute(script.getProperty(Constant.S_PROP_CREATE_TEMPTABLE).replaceAll("temptable", temptable).replaceAll("schema", m_schema));
            }
        } catch (SQLException e) {
            throw new Ex().set(EConfig.E_SQLException, e, new Message("数据异常"));
        } finally {
            try {
                if (temp != null)
                    temp.close();
                if (tempstmt != null)
                    tempstmt.close();
            } catch (SQLException e) {
                throw new Ex().set(EConfig.E_SQLException, e, new Message("数据异常"));
            }
        }
    }

    public void removeTempTable(String temptable) throws Ex {
//        logger.info("removeTempTable()");
        Statement tempstmt = null;
        ResultSet temp = null;
//        String dbowner = jdbc.getDbOwner().toUpperCase();
        temptable = temptable.toUpperCase();
        try {
            //删除TODO表,如果存在就删除
            tempstmt = conn.createStatement();
            temp = tempstmt.executeQuery(script
                    .getProperty(Constant.S_PROP_QUERY_TEMPTABLE)
                    .replaceAll("schema", m_schema)
                    .replaceAll("tablename", temptable));
            if (temp.next()) {
                tempstmt.execute(script.getProperty(Constant.S_PROP_DROP_TEMPTABLE).replaceAll("schema", m_schema).replaceAll("temptable", temptable));
            }
        } catch (SQLException e) {
            throw new Ex().set(EConfig.E_SQLException, e, new Message("数据异常"));
        } finally {
            try {
                if (temp != null)
                    temp.close();
                if (tempstmt != null)
                    tempstmt.close();
            } catch (SQLException e) {
                throw new Ex().set(EConfig.E_SQLException, e, new Message("数据异常"));
            }
        }
    }

    @Override
    public Map<String, String> createTriggers(TriggerBean[] triggers, String tempTable) throws Ex {
        Statement stmt = null;
//        String dbowner = jdbc.getDbOwner();
        Map<String, String> map = new HashMap<String, String>();
        try {
            stmt = conn.createStatement();
            for (int i = 0; i < triggers.length; i++) {
                TriggerBean trigger = triggers[i];
                //ȡ�øı������������
//                List columns = getFields(trigger.getTableName());
                String newpatterns = "";
                String oldpatterns = "";
                String pknames = "";
                String pktypes = "";
                String newValues = "";
                String oldValues = "";
                String pk_values = "";
                String[] pks = trigger.getPkFields();
                for (int k = 0; k < pks.length; k++) {
                    Field field = getField(trigger.getTableName(), pks[k]);
                    newpatterns = newpatterns + "DECLARE pk_val_" + k + " varchar(1000);";
                    newValues = newValues + "SET pk_val_" + k + " = CHAR(new_row." + field.getFieldName() + ");";
                    oldpatterns = oldpatterns + "DECLARE pk_val_" + k + " varchar(1000);";
                    oldValues = oldValues + "SET pk_val_" + k + " = CHAR(old_row." + field.getFieldName() + ");";
                    pknames = pknames + "," + field.getFieldName();
                    pktypes = pktypes + "," + field.getDbType();

                    pk_values = pk_values + "','||pk_val_" + k + "||";
                }

                pk_values = pk_values.substring(3);

                //���ñ�û��PK
                if (!pknames.equals("")) {
                    //ȥ�������ǰ׺��־
                    oldpatterns = oldpatterns + oldValues;
                    newpatterns = newpatterns + newValues;
                    pknames = pknames.substring(1);
                    pktypes = pktypes.substring(1);

                    //����sequence
                    int hashcode = Math.abs((trigger.getTableName() + tempTable).hashCode());
                    if (trigger.isMonitorDelete()) {
                        //�����������,ȡ���hashCode��Ϊ���
                        String triggerName = "ICG_" + hashcode + "_D";
                        Statement trigstmt = null;
                        ResultSet trig = null;
                        try {
                            trigstmt = conn.createStatement();
                            trig = trigstmt.executeQuery(script
                                    .getProperty(Constant.S_PROP_QUERY_TRIGGER)
                                    .replaceAll("tab_schema", jdbc.getDbOwner())
                                    .replaceAll("tab_triggername", triggerName));

                            if (!trig.next()) {
                                //�滻��sql�еĲ���
                                String delete = script.getProperty(Constant.S_PROP_DELETE_TRIGGER)
                                        .replaceAll("schema", jdbc.getDbOwner()) //�滻shema�����
                                        .replaceAll("triggername", triggerName)  //�滻trigger�����
                                        .replaceAll("table_name", trigger.getTableName()) //�滻������
                                        .replaceAll("temptable", tempTable)
                                        .replaceAll("pkpatterns", oldpatterns)
                                        .replaceAll("pkvalues", pk_values)
                                        .replaceAll("pknames", pknames)        //�滻PK�����
                                        .replaceAll("pktypes", pktypes);//�滻Pk������
                                //��������
                                stmt.execute(delete);
                            }
                        } catch (SQLException e) {
                            throw new Ex().set(EConfig.E_SQLException, e, new Message("数据异常"));
                        } finally {
                            trig.close();
                            trigstmt.close();
                        }
                        map.put("delete",triggerName);
                    }
                    if (trigger.isMonitorInsert()) {
                        String triggerName = "ICG_" + hashcode + "_I";
                        Statement trigstmt = null;
                        ResultSet trig = null;
                        try {
                            trigstmt = conn.createStatement();
                            trig = trigstmt.executeQuery(script
                                    .getProperty(Constant.S_PROP_QUERY_TRIGGER)
                                    .replaceAll("tab_schema", jdbc.getDbOwner())
                                    .replaceAll("tab_triggername", triggerName));
                            if (!trig.next()) {
                                //�滻��sql�еĲ���
                                String insert = script.getProperty(Constant.S_PROP_INSERT_TRIGGER)
                                        .replaceAll("schema", jdbc.getDbOwner()) //�滻shema�����
                                        .replaceAll("triggername", triggerName)  //�滻trigger�����
                                        .replaceAll("table_name", trigger.getTableName()) //�滻������
                                        .replaceAll("temptable", tempTable)
                                        .replaceAll("pkpatterns", newpatterns)
                                        .replaceAll("pkvalues", pk_values)
                                        .replaceAll("pknames", pknames)        //�滻PK�����
                                        .replaceAll("pktypes", pktypes);//�滻Pk������
                                //��������
                                stmt.execute(insert);
                            }
                        } catch (SQLException e) {
                            throw new Ex().set(EConfig.E_SQLException, e, new Message("数据异常"));
                        } finally {
                            trig.close();
                            trigstmt.close();
                        }
                        map.put("insert",triggerName);
                    }
                    if (trigger.isMonitorUpdate()) {
                        String triggerName = "ICG_" + hashcode + "_U";
                        Statement trigstmt = null;
                        ResultSet trig = null;
                        try {
                            trigstmt = conn.createStatement();
                            trig = trigstmt.executeQuery(script
                                    .getProperty(Constant.S_PROP_QUERY_TRIGGER)
                                    .replaceAll("tab_schema", jdbc.getDbOwner())
                                    .replaceAll("tab_triggername", triggerName));
                            if (!trig.next()) {
                                //�滻��sql�еĲ���
                                String update = script.getProperty(Constant.S_PROP_UPDATE_TRIGGER)
                                        .replaceAll("schema", jdbc.getDbOwner()) //�滻shema�����
                                        .replaceAll("triggername", triggerName)  //�滻trigger�����
                                        .replaceAll("table_name", trigger.getTableName()) //�滻������
                                        .replaceAll("temptable", tempTable)
                                        .replaceAll("pkpatterns", newpatterns)
                                        .replaceAll("pkvalues", pk_values)
                                        .replaceAll("pknames", pknames)        //�滻PK�����
                                        .replaceAll("pktypes", pktypes);//�滻Pk������
                                //��������
                                stmt.execute(update);
                            }
                        } catch (SQLException e) {
                            throw new Ex().set(EConfig.E_SQLException, e, new Message("数据异常"));
                        } finally {
                            trig.close();
                            trigstmt.close();
                        }
                        map.put("update",triggerName);
                    }
                } else {
                    logger.warn("数据表 " + trigger.getTableName() + " 中没有主键,不能创建触发器!");
                }
            }
        } catch (SQLException e) {
            throw new Ex().set(EConfig.E_SQLException, e, new Message("数据异常"));
        } finally {
            if (stmt != null) {
                try {
                    stmt.close();
                } catch (SQLException e) {
                    throw new Ex().set(EConfig.E_SQLException, e, new Message("关闭statement时出现异常"));
                }
            }
        }
        return map;
    }

    @Override
    public void removeTriggerByName(Table table) throws Ex {
        Statement stmt = null;
//        String dbowner = jdbc.getDbOwner();
        try {
            stmt = conn.createStatement();
            if (StringUtils.isNotBlank(table.getDeleteTrigger())) {
                //�����������,ȡ���hashCode��Ϊ���
                String triggerName = table.getDeleteTrigger();
//                    System.out.println(triggerName);
                Statement trigstmt = null;
                ResultSet trig = null;
                try {
                    trigstmt = conn.createStatement();
                    trig = trigstmt.executeQuery(script
                            .getProperty(Constant.S_PROP_QUERY_TRIGGER)
                            .replaceAll("tab_schema", jdbc.getDbOwner())
                            .replaceAll("tab_triggername", triggerName));
                    if (trig.next()) {
                        //�滻��sql�еĲ���
                        String delete = script.getProperty(Constant.S_PROP_DROP_TRIGGER)
                                .replaceAll("schema", jdbc.getDbOwner())
                                .replaceAll("triggername", triggerName);

                        //��������
                        stmt.execute(delete);
                    }
                } catch (SQLException e) {
                    throw new Ex().set(EConfig.E_SQLException, e, new Message("数据异常"));
                } finally {
                    trig.close();
                    trigstmt.close();
                }
            }
            if (StringUtils.isNotBlank(table.getInsertTrigger())) {
                String triggerName = table.getInsertTrigger();
                Statement trigstmt = null;
                ResultSet trig = null;
                try {
                    trigstmt = conn.createStatement();
                    trig = trigstmt.executeQuery(script
                            .getProperty(Constant.S_PROP_QUERY_TRIGGER)
                            .replaceAll("tab_schema", jdbc.getDbOwner())
                            .replaceAll("tab_triggername", triggerName));
                    if (trig.next()) {
                        //�滻��sql�еĲ���
                        String insert = script.getProperty(Constant.S_PROP_DROP_TRIGGER)
                                .replaceAll("schema", jdbc.getDbOwner())
                                .replaceAll("triggername", triggerName);
                        //��������
                        stmt.execute(insert);
                    }
                } catch (SQLException e) {
                    throw new Ex().set(EConfig.E_SQLException, e, new Message("数据异常"));
                } finally {
                    trig.close();
                    trigstmt.close();
                }
            }
            if (StringUtils.isNotBlank(table.getUpdateTrigger())) {
                String triggerName = table.getUpdateTrigger();
                Statement trigstmt = null;
                ResultSet trig = null;
                try {
                    trigstmt = conn.createStatement();
                    trig = trigstmt.executeQuery(script
                            .getProperty(Constant.S_PROP_QUERY_TRIGGER)
                            .replaceAll("tab_schema", jdbc.getDbOwner())
                            .replaceAll("tab_triggername", triggerName));
                    if (trig.next()) {
                        //�滻��sql�еĲ���
                        String update = script.getProperty(Constant.S_PROP_DROP_TRIGGER)
                                .replaceAll("schema", jdbc.getDbOwner())
                                .replaceAll("triggername", triggerName);
                        //��������
                        stmt.execute(update);
                    }
                } catch (SQLException e) {
                    throw new Ex().set(EConfig.E_SQLException, e, new Message("数据异常"));
                } finally {
                    trig.close();
                    trigstmt.close();
                }
            }
            //��������
//            stmt.executeBatch();
        } catch (SQLException e) {
            throw new Ex().set(EConfig.E_SQLException, e, new Message("数据异常"));
        } finally {
            if (stmt != null) {
                try {
                    stmt.close();
                } catch (SQLException e) {
                    throw new Ex().set(EConfig.E_SQLException, e, new Message("关闭statement时出现异常"));
                }
            }
        }
    }
}
