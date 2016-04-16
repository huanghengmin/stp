package com.inetec.ichange.console.client.util;

import com.inetec.common.config.stp.nodes.Jdbc;
import com.inetec.common.exception.E;
import com.inetec.common.exception.Ex;
import com.inetec.common.i18n.Message;

import java.io.*;
import java.util.Properties;

/**
 * Created by IntelliJ IDEA.
 * User: wxh
 * Date: 2009-8-30
 * Time: 22:08:05
 * To change this template use File | Settings | File Templates.
 */
public class JdbcUtil extends Properties {

    private Jdbc m_jdbc = null;

    public DbInitBean getDbInit() {
        return m_dbInit;
    }

    public void setDbInit(DbInitBean dbInit) {
        m_dbInit = dbInit;
    }

    private DbInitBean m_dbInit = null;
    private static final String Str_DbOwner = "Dbowner";
    private static final String Str_DbHost = "DbHost";
    private static final String Str_DbUrl = "DbUrl";
    private static final String Str_DbUser = "DbUser";
    private static final String Str_Dbpassword = "DbPassword";
    private static final String Str_Description = "Description";
    private static final String Str_DriverClass = "DriverClass";
    private static final String Str_JdbcName = "JdbcName";
    private static final String Str_DbVender = "DbVender";
    private static final String Str_DbType = "DbType";
    private static final String Str_DbCatalog = "DbCataLog";
    private static final String Str_DBEencoding = "Encoding";
    private static final String Str_DbInitBean_TemptableName = "DbInitBean_TemptableName";
    private static final String Str_DbInitBean_TriggerBean = "DbInitBean_TriggerBean";
    private static final String Str_DbInitBean_TableNames = "DbInitBean_TableNames";

    public JdbcUtil() {
        m_jdbc = null;
        m_dbInit = null;
    }

    public Jdbc getJdbc() {
        return m_jdbc;
    }

    public void setJdbc(Jdbc jdbc) {
        m_jdbc = jdbc;
    }

    public JdbcUtil(Jdbc jdbc) {
        m_jdbc = null;
        m_dbInit = null;
        m_jdbc = jdbc;
    }

    public JdbcUtil(Jdbc jdbc, DbInitBean dbInit) {
        m_jdbc = null;
        m_dbInit = null;
        m_jdbc = jdbc;
        m_dbInit = dbInit;
    }


    public void load(InputStream input) throws IOException {
        Properties props = new Properties();
        props.load(input);
        m_jdbc = new Jdbc();
        m_jdbc.setDbHost(props.getProperty(Str_DbHost, "").trim());
        m_jdbc.setDbOwner(props.getProperty(Str_DbOwner, "").trim());
        m_jdbc.setDbType(props.getProperty(Str_DbType, "").trim());
        m_jdbc.setDbUrl(props.getProperty(Str_DbUrl, "").trim());
        m_jdbc.setDbUser(props.getProperty(Str_DbUser, "").trim());
        m_jdbc.setDbVender(props.getProperty(Str_DbVender, "").trim());
        m_jdbc.setDescription(props.getProperty(Str_Description, "").trim());
        m_jdbc.setDriverClass(props.getProperty(Str_DriverClass, "").trim());
        m_jdbc.setEncoding(props.getProperty(Str_DBEencoding, "").trim());
        m_jdbc.setJdbcName(props.getProperty(Str_JdbcName, "").trim());
        m_jdbc.setPassword(props.getProperty(Str_Dbpassword, "").trim());
        m_jdbc.setDbCatalog(props.getProperty(Str_DbCatalog, "").trim());
        if (m_jdbc.getDbCatalog().equals("")) {
            m_jdbc.setDbCatalog(null);
        }
        m_dbInit = new DbInitBean();
        m_dbInit.setTableNamesForString(props.getProperty(Str_DbInitBean_TableNames, "").trim());
        m_dbInit.setTempTable(props.getProperty(Str_DbInitBean_TemptableName, "").trim());
        m_dbInit.setTriggerBeansForString(props.getProperty(Str_DbInitBean_TriggerBean, "").trim());

    }

    public void store(OutputStream out) throws IOException {
        Properties props = new Properties();
        props.setProperty(Str_DbHost, m_jdbc.getDbHost());
        props.setProperty(Str_DbOwner, m_jdbc.getDbOwner());
        props.setProperty(Str_DbType, m_jdbc.getDbType());
        props.setProperty(Str_DbUrl, m_jdbc.getDbUrl());
        props.setProperty(Str_DbUser, m_jdbc.getDbUser());
        props.setProperty(Str_DbVender, m_jdbc.getDbVender());
        props.setProperty(Str_Description, m_jdbc.getDescription());
        props.setProperty(Str_DriverClass, m_jdbc.getDriverClass());
        props.setProperty(Str_DBEencoding, m_jdbc.getEncoding());
        props.setProperty(Str_JdbcName, m_jdbc.getJdbcName());
        props.setProperty(Str_Dbpassword, m_jdbc.getPassword());
        if (m_jdbc.getDbCatalog() != null)
            props.setProperty(Str_DbCatalog, m_jdbc.getDbCatalog());
        if (m_dbInit != null) {
            if (m_dbInit.getTableNames() != null)
                props.setProperty(Str_DbInitBean_TableNames, m_dbInit.getTableNamesToString());
            if (m_dbInit.getTempTable() != null)
                props.setProperty(Str_DbInitBean_TemptableName, m_dbInit.getTempTable());
            if (m_dbInit.getTriggerBeans() != null)
                props.setProperty(Str_DbInitBean_TriggerBean, m_dbInit.getTriggerBeanToString());
        }
        props.store(out, "");
    }

    public ByteArrayInputStream toStream()
            throws Ex {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try {
            store(out);
        } catch (IOException e) {
            throw new Ex().set(E.E_IOException, e);
        }
        return new ByteArrayInputStream(out.toByteArray());
    }

    public void validation()
            throws Ex {
        if (m_jdbc != null)
            try {
                m_jdbc.getDriverClass();
                m_jdbc.getPassword();
                m_jdbc.getDbUrl();
                m_jdbc.getDbUser();
                m_jdbc.getDbOwner();
                m_jdbc.getEncoding();
            } catch (NullPointerException e) {
                throw (new Ex()).set(E.E_InvalidArgument, new Message("JDBC 参数为空!"));
            }
    }
}
