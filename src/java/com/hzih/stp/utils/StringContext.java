package com.hzih.stp.utils;

/**
 * Created by IntelliJ IDEA.
 * User: 钱晓盼
 * Date: 12-6-7
 * Time: 上午10:56
 * To change this template use File | Settings | File Templates.
 */
public class StringContext {
    public final static String systemPath = System.getProperty("ichange.home");
    public final static String INTERFACE = "/etc/network/interfaces";//linux下IP信息存储文件
	public final static String IFSTATE = "/etc/network/run/ifstate"; //linux下DNS信息
	public final static String localLogPath = systemPath + "/logs";   //日志文件目录
    public final static String webPath = systemPath+"/tomcat/webapps"; //war服务文件存储目录

    public static final String SAVEFILEPATH = systemPath+"/upload";    //上传路径
    public final static String INTERNALXML = systemPath+"/repository/config.xml";//可信端配置文件
    public final static String EXTERNALXML = systemPath+"/repository/external/config.xml"; //非可信配置文件
    //存档文件夹
    public final static String INTERNALVERSIONPATH = systemPath+"/repository/internal/version"; //可信存档文件目录
    public final static String EXTERNALVERSIONPATH = systemPath+"/repository/external/version"; //非可信存档文件目录
    //历史文件夹
    public final static String INTERNALHISTORYPATH = systemPath+"/repository/internal/history"; //可信存档文件目录
    public final static String EXTERNALHISTORYPATH = systemPath+"/repository/external/history"; //非可信存档文件目录

    public final static String INTERNAL = "internal";  //可信
    public final static String EXTERNAL = "external";  //非可信

    public static final String INTERNALXMLPATH = systemPath + "/repository";         //可信端配置文件目录
    public static final String EXTERNALXMLPATH = systemPath + "/repository/external";//非可信端配置文件目录

    public static final String RESETFILE = systemPath + "/data/reset/resetaudit.xml";//业务手动重传信息保存文件
    public static final String RESETFILEPATH = systemPath + "/data/reset";//业务手动重传信息保存文件路径

    public static final String EQUIPMENTSYSCONFIGPATH = systemPath + "/upload/equipment";//设备系统配置文件

    public static final String SECURITY_CONFIG = StringContext.systemPath +"/tomcat/conf/server.xml";

    public static final int UPDATE_APP = -1;//更新应用
    public static final int INSERT_APP = 1;//新增应用
    public static final int INIT_APP = 0;//目标端更新后修改源应用的status  或者发送后源端应用状态
    public static final String DB_INSERT = "insert";//表示数据库需要操作--新增
    public static final String DB_DELETE = "delete";//表示数据库需要操作--删除
    public static final String DB_UPDATE = "update";//表示数据库需要操作--修改

    public static final int GB = 1024*1024*1024;
    public static final int MB = 1024*1024;
}
