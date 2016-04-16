package com.inetec.ichange.console.config.database;

import com.inetec.common.config.stp.nodes.Jdbc;
import com.inetec.common.exception.Ex;
import com.inetec.common.i18n.Message;
import com.inetec.ichange.console.config.Constant;
import com.inetec.ichange.console.config.database.db2.DB2Factory;
import com.inetec.ichange.console.config.database.mssql.MsSqlFactory;
import com.inetec.ichange.console.config.database.oracle.OracleFactory;
import com.inetec.ichange.console.config.database.sybase.SybaseFactory;


public class DBFactory {

    public static IDataBase getDataBase(Jdbc jdbc, String dblocal) throws Ex {
        if (jdbc.getDbType().equals(Constant.S_DB_ORACLE)) {
            return new OracleFactory(jdbc, dblocal).getDataBase();
        } else if (jdbc.getDbType().equals(Constant.S_DB_MSSQL)) {
            return new MsSqlFactory(jdbc, dblocal).getDataBase();
        } else if (jdbc.getDbType().equals(Constant.S_DB_SYBASE)) {
            return new SybaseFactory(jdbc, dblocal).getDataBase();
        } else if (jdbc.getDbType().startsWith(Constant.S_DB_DB2)) {
            return new DB2Factory(jdbc, dblocal).getDataBase();
        }
        throw new Ex().set(new Message("jdbc error!"));
    }
}
