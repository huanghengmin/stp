package com.inetec.ichange.console.client.util;


/**
 * Created by IntelliJ IDEA.
 * User: wxh
 * Date: 2009-8-15
 * Time: 20:54:33
 * To change this template use File | Settings | File Templates.
 */
public class ServiceUtil {
    /**
     * Change request type: ChangeData (null), ChangeControl
     */
    public static final String HDR_ServiceRequestType = "SERVICEREQUESTTYPE";
    public static final String HDR_ServiceDataType = "SERVICEDATATYPE";

    public static final String HDR_ChangeRequestType = "CHANGEREQUESTTYPE";
    public static final String STR_REQTP_ChangeControlPost = "CHANGECONTROLPOST";

    /**
     * data attribute
     */
    public static final String HDR_DataLength = "DataLength";
    public static final String HDR_Compression = "COMPRESSION";
    public static final String STR_REQTP_Compressed = "Compressed";
    public static final String STR_REQTP_toCompress = "toCompress";

    public static final String STR_REQTP_ServiceDataPost = "SERVICEDATAPOST";
    public static final String STR_REQTP_ServiceControlPost = "SERVICECONTROLPOST";

    // service types
    public static final String HDR_ServiceCommand = "SERVICECOMMAND";

    public static final String STR_ServiceData_Config = "ServiceConfig";
    public static final String STR_ServiceData_Start = "ServiceStart";
    public static final String STR_ServiceData_Stop = "ServiceStop";
    public static final String STR_ServiceData_ReStart = "ServiceReStart";
    public static final String STR_ServiceData_Audit = "ServiceAudit";
    public static final String STR_ServiceData_Init = "ServiceInit";
    public static final String STR_ServiceData_DbInfo = "ServiceDbInfo";
    public static final String STR_ServiceData_DbCreateFlag = "ServiceDataDbCreateFlag";
    public static final String STR_ServiceData_DbCreateTrigger = "ServiceDataDbCreateTrigger";
    public static final String STR_ServiceData_DbDeleteFlag = "ServiceDataDbDeleteFlag";
    public static final String STR_ServiceData_DbDeleteTrigger = "ServiceDataDbDeleteTrigger";
    public static final String STR_ServiceData_DbCreateSequence = "ServiceData_DbCreateSequence";
    public static final String STR_ServiceData_DbDeleteSequence = "ServiceData_DbDeleteSequence";
    public static final String STR_ServiceData_DbDeleteTempTable = "ServiceData_DbDeleteTempTable";
    public static final String STR_ServiceData_DbCreaterTempTable = "ServiceData_DbCreaterTempTable";
    public static final String STR_ServiceData_DbTestConnect = "ServiceData_DbTestConnect";

    public static final String STR_CommandBody = "CommandBody";
    public static final String STR_CommandBoday_Private = "private";
    public static final String STR_CommandBody_Public = "public";

    public static final String STR_ChannelPrivate = "ChannelPrivate";

    public static final String HDR_ChangeControlType = "CHANGECONTROLTYPE";


}
