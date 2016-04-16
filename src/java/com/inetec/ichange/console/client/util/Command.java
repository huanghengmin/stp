package com.inetec.ichange.console.client.util;

/**
 * Created by IntelliJ IDEA.
 * User: wxh
 * Date: 2009-8-30
 * Time: 23:50:38
 * To change this template use File | Settings | File Templates.
 */
public class Command {
    public static final Command C_DBMetaData = new Command(ServiceUtil.STR_ServiceData_DbInfo);
    public static final Command C_PlatFormReStart = new Command(ServiceUtil.STR_ServiceData_ReStart);
    public static final Command C_PlatFormaStart = new Command(ServiceUtil.STR_ServiceData_Start);
    public static final Command C_PlatFormaAudit = new Command(ServiceUtil.STR_ServiceData_Audit);
    public static final Command C_PlatFormStop = new Command(ServiceUtil.STR_ServiceData_Stop);
    public static final Command C_DBCreateFlag = new Command(ServiceUtil.STR_ServiceData_DbCreateFlag);
    public static final Command C_DBDeleteFlag = new Command(ServiceUtil.STR_ServiceData_DbDeleteFlag);
    public static final Command C_DBCreateTrigger = new Command(ServiceUtil.STR_ServiceData_DbCreateTrigger);
    public static final Command C_DBDeleteTrigger = new Command(ServiceUtil.STR_ServiceData_DbDeleteTrigger);
    public static final Command C_DbCreateSequence = new Command(ServiceUtil.STR_ServiceData_DbCreateSequence);
    public static final Command C_DbDeleteSequence = new Command(ServiceUtil.STR_ServiceData_DbDeleteSequence);
    public static final Command C_DbCreateTempTable = new Command(ServiceUtil.STR_ServiceData_DbCreaterTempTable);
    public static final Command C_DbDeleteTempTable = new Command(ServiceUtil.STR_ServiceData_DbDeleteTempTable);
    public static final Command C_DBTestConnect = new Command(ServiceUtil.STR_ServiceData_DbTestConnect);

    private String m_command = null;

    private Command(String command) {
        m_command = command;
    }

    public String toStringCommand() {
        return m_command;
    }

    public boolean isDbCommand(Command cmd) {
        boolean result = false;
        if (cmd.equals(C_DBMetaData)) {
            result = true;
        }
        if (cmd.equals(C_DBCreateFlag)) {
            result = true;
        }
        if (cmd.equals(C_DBDeleteFlag)) {
            result = true;
        }
        if (cmd.equals(C_DBCreateTrigger)) {
            result = true;
        }
        if (cmd.equals(C_DBDeleteTrigger)) {
            result = true;
        }
        if (cmd.equals(C_DbCreateSequence)) {
            result = true;
        }
        if (cmd.equals(C_DbDeleteSequence)) {
            result = true;
        }
        if (cmd.equals(C_DbDeleteTempTable)) {
            result = true;
        }
        if (cmd.equals(C_DbCreateTempTable)) {
            result = true;
        }
        if (cmd.equals(C_DBTestConnect)) {
            result = true;
        }
        return result;
    }
}
