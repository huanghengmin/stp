package com.inetec.ichange.console.config.database.mssql;

import com.inetec.common.config.stp.nodes.Jdbc;
import com.inetec.common.exception.E;
import com.inetec.common.exception.Ex;
import com.inetec.ichange.console.config.Constant;
import com.inetec.ichange.console.config.database.IDataBase;
import com.inetec.ichange.console.config.database.IFactory;

public class MsSqlFactory extends IFactory {

    public MsSqlFactory(Jdbc jdbc, String dbLocal) {
        super(jdbc, dbLocal);
    }

    public IDataBase getDataBase() throws Ex {
        if (dbLocal.equals(Constant.DB_INTERNAL))
            return new MsSqlInternal(jdbc);
        throw new Ex().set(E.E_Unknown, E.KEY_UNKNOWN, "��ݿ�λ��");
    }
}
