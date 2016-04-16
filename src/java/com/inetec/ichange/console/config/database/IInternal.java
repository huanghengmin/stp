package com.inetec.ichange.console.config.database;

import com.inetec.common.config.stp.EConfig;
import com.inetec.common.config.stp.nodes.Field;
import com.inetec.common.config.stp.nodes.Jdbc;
import com.inetec.common.dbms.DbmsFactory;
import com.inetec.common.dbms.DbmsUtil;
import com.inetec.common.exception.Ex;
import com.inetec.common.i18n.Message;
import com.inetec.ichange.console.config.utils.CacheManagerUtil;
import net.sf.ehcache.Cache;
import org.apache.log4j.Logger;

import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;

public abstract class IInternal implements IDataBase {
    protected Logger logger = Logger.getLogger(IInternal.class);
    protected Jdbc jdbc;
    protected Connection conn;
    protected DatabaseMetaData meta;
    protected DBUtil dbutil;
    //ĳЩ��ݿ���Ҫcatalog
    protected String m_catalog = null;
    //ĳЩ��ݿ��Сд����
    protected String m_schema = null;
    protected Properties script = new Properties();

    public IInternal() {
	}

    public IInternal(Jdbc jdbc) {
        this.jdbc = jdbc;
        m_schema = jdbc.getDbOwner();
    }

    public String[] getTableNames() throws Ex {
        ResultSet rs = null;
        List tableList = new ArrayList();
        try {
            rs = getMetaData().getTables(m_catalog, m_schema, null, new String[]{"TABLE"});

            while (rs.next()) {
                String tableName = rs.getString("TABLE_NAME");
                tableName.trim();
                if(tableName.indexOf("$")<0){
                	tableList.add(tableName);
                }

            }
        } catch (SQLException e) {
            throw new Ex().set(EConfig.E_SQLException, e, new Message("��ȡ��ݿ� {0} �еı���ʱ�����쳣", jdbc.getDbUrl().lastIndexOf(":")));
        } finally {
            if (rs != null) {
                try {
                    rs.close();
                } catch (SQLException e) {
                    throw new Ex().set(EConfig.E_SQLException, e, new Message("�ڷ��� getTableNames() ���رս��ʱ�����쳣"));
                }
            }
        }
        String[] results = (String[]) tableList.toArray(new String[tableList.size()]);
        Arrays.sort(results);
        return results;
    }

    public String[] getFieldNames(String tableName) throws Ex {
        ResultSet rs = null;
        List fieldList = new ArrayList();
        try {
            rs = getMetaData().getColumns(m_catalog, m_schema, tableName, null);

            while (rs.next()) {
                fieldList.add(rs.getString(4));
            }
        } catch (SQLException e) {
            throw new Ex().set(EConfig.E_SQLException, e, new Message("��ȡ�� {0} ���ֶ�ʱ�����쳣", tableName));
        } finally {
            if (rs != null)
                try {
                    rs.close();
                } catch (SQLException e) {
                    throw new Ex().set(EConfig.E_SQLException, e, new Message("�ڷ��� getFieldNames() ���رս��ʱ�����쳣"));
                }
        }
        return (String[]) fieldList.toArray(new String[fieldList.size()]);
    }

    public List getFields(String tableName) throws Ex {
        ResultSet rs = null;
        List fieldList = new ArrayList();
        try {
            rs = getMetaData().getColumns(m_catalog, m_schema, tableName, null);

            while (rs.next()) {
                Field field = new Field();
                field.setFieldName(rs.getString("COLUMN_NAME"));
                field.setColumnSize(rs.getString("COLUMN_SIZE"));
                field.setNull(rs.getString("IS_NULLABLE").equals("YES") ? "true" : "false");
                field.setPk(isPkColumn(tableName, rs.getString("COLUMN_NAME")) ? "true" : "false");
                field.setDbType(rs.getString("TYPE_NAME"));
                field.setJdbcType(DbmsUtil.getJdbcTypeString(DbmsFactory.getDbms(conn, jdbc.getDriverClass()).getJdbcTypeFromVenderDb(rs.getString("TYPE_NAME"))));
                fieldList.add(field);
            }
        } catch (SQLException e) {
            throw new Ex().set(EConfig.E_SQLException, e, new Message("��ȡ�� {0} ���ֶ�ʱ�����쳣", tableName));
        } finally {
            if (rs != null)
                try {
                    rs.close();
                } catch (SQLException e) {
                    throw new Ex().set(EConfig.E_SQLException, e, new Message("�ڷ��� getFields() ���رս��ʱ�����쳣"));
                }
        }
        return fieldList;
    }

    public Field getField(String tableName, String fieldName) throws Ex {
        ResultSet rs = null;
        Field field = new Field();
        try {
            rs = getMetaData().getColumns(m_catalog, m_schema, tableName, null);
            while (rs.next()) {
                if (!rs.getString("COLUMN_NAME").equalsIgnoreCase(fieldName))
                    continue;
                field.setFieldName(rs.getString("COLUMN_NAME"));
                field.setColumnSize(rs.getString("COLUMN_SIZE"));
                field.setNull(rs.getString("IS_NULLABLE").equals("YES") ? "true" : "false");
                field.setPk(isPkColumn(tableName, fieldName) ? "true" : "false");
                field.setDbType(rs.getString("TYPE_NAME"));
                field.setJdbcType(DbmsUtil.getJdbcTypeString(DbmsFactory.getDbms(conn, jdbc.getDriverClass()).getJdbcTypeFromVenderDb(rs.getString("TYPE_NAME"))));
            }
        } catch (SQLException e) {
            throw new Ex().set(EConfig.E_SQLException, e, new Message("��ȡ�� {0} ���ֶ� {1} ����ϸ��Ϣʱ�����쳣", tableName, fieldName));
        } finally {
            if (rs != null)
                try {
                    rs.close();
                } catch (SQLException e) {
                    throw new Ex().set(EConfig.E_SQLException, e, new Message("getField()"));
                }
        }
        return field;
    }

    public void openConnection() throws Ex {
        conn = dbutil.openConnection();
    }

    public void closeConnection() throws Ex {
        try {
            if (!conn.isClosed())
                conn.close();
//            System.out.println("����: "+conn+" close status is "+conn.isClosed());
        } catch (SQLException e) {
            throw new Ex().set(EConfig.E_SQLException, e, new Message("数据库连接关闭错误"));
        }
    }

    public boolean isConnectable() throws Ex {
        return conn != null;
    }

    public Jdbc getJdbc() {
        return jdbc;
    }

    public void setJdbc(Jdbc jdbc) {
        this.jdbc = jdbc;
    }

    /**
     * ȡ�û���
     *
     * @return
     * @throws com.inetec.common.exception.Ex
     */
    protected Cache getCache() throws Ex {
        return CacheManagerUtil.getInstance().getCache();
    }

    public class FieldComparator implements Comparator {
        public int compare(Object object, Object object1) {
            Field f1 = (Field) object;
            Field f2 = (Field) object1;
            return f1.getFieldName().compareTo(f2.getFieldName());
        }
    }

    private boolean isPkColumn(String tableName, String column) throws Ex {
        List pk_columns = new ArrayList();
        ResultSet pk = null;
        try {
            pk = getMetaData().getPrimaryKeys(m_catalog, m_schema, tableName);
            while (pk.next()) {
                pk_columns.add(pk.getString("COLUMN_NAME"));
            }
        } catch (SQLException e) {
            throw new Ex().set(EConfig.E_SQLException, e, new Message("��ȡ�� {0} ���ֶ� {1} �Ƿ�Ϊ����ʱ�����쳣", tableName, column));
        } finally {
            if (pk != null) {
                try {
                    pk.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }

        return pk_columns.contains(column);
    }

    private DatabaseMetaData getMetaData() throws Ex {
        try {
            if (meta == null)
                meta = conn.getMetaData();
            return meta;
        } catch (SQLException e) {
            throw new Ex().set(EConfig.E_SQLException, e, new Message("��ȡ���� {0} ��metadataʱ�����쳣!", conn.toString()));
        }
    }

    /**
     * ��������
     *
     * @throws com.inetec.common.exception.Ex
     */
    public void createSequence() throws Ex {

    }

    /**
     * ɾ������
     *
     * @throws com.inetec.common.exception.Ex
     */
    public void removeSequence() throws Ex {

    }

}
