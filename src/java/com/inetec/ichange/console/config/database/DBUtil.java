package com.inetec.ichange.console.config.database;

import com.inetec.common.config.stp.EConfig;
import com.inetec.common.config.stp.nodes.Jdbc;
import com.inetec.common.exception.Ex;
import com.inetec.common.i18n.Message;
import com.inetec.common.security.DesEncrypterAsPassword;
import com.inetec.ichange.console.config.Constant;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.text.SimpleDateFormat;

public class DBUtil {
    Jdbc jdbc;

    public DBUtil(Jdbc jdbc) {
        this.jdbc = jdbc;
    }

    public Connection openConnection() throws Ex {
        try {
            Class.forName(jdbc.getDriverClass());
            return DriverManager.getConnection(jdbc.getDbUrl(), jdbc.getDbUser(), new String(new DesEncrypterAsPassword(Constant.S_PWD_ENCRYPT_CODE).decrypt(jdbc.getPassword().getBytes())));
        } catch (SQLException e) {
            throw new Ex().set(EConfig.E_SQLException, e, new Message("JDBC:{0}连接存在问题", jdbc.getDbUrl()));
        } catch (ClassNotFoundException e) {
            throw new Ex().set(EConfig.E_ClassNotFoundException, e, new Message("JDBC驱动{0}找不到", jdbc.getDriverClass()));
        }
    }

    public static SimpleDateFormat getDateFormat() {
        return new SimpleDateFormat("yyyy-MM-dd hh:MM:ss");
    }


}
