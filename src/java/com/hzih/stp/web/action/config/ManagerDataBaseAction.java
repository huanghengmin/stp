package com.hzih.stp.web.action.config;

import com.hzih.stp.constant.AppConstant;
import com.hzih.stp.service.LogService;
import com.hzih.stp.utils.FileUtil;
import com.hzih.stp.utils.StringContext;
import com.hzih.stp.utils.StringUtils;
import com.hzih.stp.web.SessionUtils;
import com.hzih.stp.web.SiteContext;
import com.hzih.stp.web.action.ActionBase;
import com.inetec.common.util.OSInfo;
import com.inetec.common.util.Proc;
import com.opensymphony.xwork2.ActionSupport;
import org.apache.log4j.Logger;
import org.apache.struts2.ServletActionContext;
import org.apache.tools.ant.Project;
import org.apache.tools.ant.taskdefs.SQLExec;
import org.apache.tools.ant.types.EnumeratedAttribute;
import org.dom4j.Document;
import org.dom4j.Node;
import org.dom4j.io.SAXReader;
import org.dom4j.io.XMLWriter;
import org.springframework.web.bind.ServletRequestUtils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.sql.*;

/**
 * 审计库管理、审计备份策略
 */
public class ManagerDataBaseAction extends ActionSupport {

	private static final Logger logger = Logger.getLogger(ManagerDataBaseAction.class);
	private LogService logService;

    /**
     * 读取/pages/data/db-config.xml
     * @return
     * @throws Exception
     */
	public String select() throws Exception {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result =	actionBase.actionBegin(request);
        String json = null;
        try{
            SAXReader reader = new SAXReader();
            String fileName = SiteContext.getInstance().contextRealPath
                    + AppConstant.XML_DB_CONFIG_PATH;
            Document doc = reader.read(new File(fileName));
            String dbIp = doc.selectSingleNode("//config/maindb/dbip").getText();
            String dbPort = doc.selectSingleNode("//config/maindb/dbport").getText();
            String dbName = doc.selectSingleNode("//config/maindb/dbname").getText();
            String userName = doc.selectSingleNode("//config/maindb/username").getText();
            String password = doc.selectSingleNode("//config/maindb/password").getText();
            int dbUsed = Integer.parseInt(doc.selectSingleNode("//config/maindb/dbused").getText());
            String backupDbIp = doc.selectSingleNode("//config/backupdb/dbip").getText();
            String backupDbPort = doc.selectSingleNode("//config/backupdb/dbport").getText();
            String backupDbName = doc.selectSingleNode("//config/backupdb/dbname").getText();
            String backupUserName = doc.selectSingleNode("//config/backupdb/username").getText();
            String backupPassword = doc.selectSingleNode("//config/backupdb/password").getText();

            String sysDBName = "information_schema";
            int disk = 10000;

            Proc proc;
            OSInfo osinfo = OSInfo.getOSInfo();
            if (osinfo.isWin()) {
            }
            if (osinfo.isLinux()) {
                String dataDir = null;
                Connection conn = null;
                Statement stat = null;
                ResultSet rs = null;
                try {
                    Class.forName("com.mysql.jdbc.Driver");
                    String url = "jdbc:mysql://" + dbIp
                            + ":" + dbPort + "/" + sysDBName
                            + "?useUnicode=true&characterEncoding=utf-8";
                    conn = DriverManager.getConnection(url, userName, password);
                    stat = conn.createStatement();
                    rs = stat.executeQuery("select VARIABLE_VALUE from `GLOBAL_VARIABLES` where VARIABLE_NAME = 'datadir';");
                    if (rs != null && rs.next()) {
                        dataDir = rs.getString(1);
                    }
                } catch (Exception e) {
                    logger.error("", e);
                } finally {
                    try {
                        if (null != rs) {
                            rs.close();
                            rs = null;
                        }
                        if (null != stat) {
                            stat.close();
                            stat = null;
                        }
                        if (null != conn) {
                            conn.close();
                            conn = null;
                        }
                    } catch (SQLException e) {

                    }
                }
                proc = new Proc();
                proc.exec("df "+dataDir);
                String _result = proc.getOutput();
                String[] lines = _result.split("\n");
                String[] str = lines[1].split("\\s+");
                disk = Integer.parseInt(str[1]) / StringContext.MB;
            }

            json = "[{dbip:'"+dbIp+"',dbport:'"+dbPort+"',dbname:'"+dbName+
                    "',username:'"+userName+"',dbUsed:"+dbUsed+",_disk:"+disk+ ",disk:'"+disk+
                    " GB',backup_dbip:'"+backupDbIp+"',backup_dbport:'"+backupDbPort+
                    "',backup_dbname:'"+backupDbName+"',backup_username:'"+backupUserName+"'}]";
            logService.newLog("INFO",SessionUtils.getAccount(request).getUserName(),"审计库管理","用户查找审计库信息成功");
        } catch (Exception e){
            logger.error("审计库管理",e);
            logService.newLog("ERROR",SessionUtils.getAccount(request).getUserName(),"审计库管理","用户查找审计库信息失败");
        }
        actionBase.actionEnd(response,json,result);
		return null;
	}

    /**
     * 更新/pages/data/db-config.xml
     * @return
     * @throws Exception
     */
    public String update() throws Exception {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result =	actionBase.actionBegin(request);
        SAXReader reader = new SAXReader();
        String fileName = SiteContext.getInstance().contextRealPath
                + AppConstant.XML_DB_CONFIG_PATH;
        Document doc = reader.read(new File(fileName));
        String msg = null;
        XMLWriter writer = null;
        try {
//            Node tempNode = doc.selectSingleNode("//config/maindb/dbip");
//            tempNode.setText(request.getParameter("dbip"));
//            tempNode = doc.selectSingleNode("//config/maindb/dbport");
//            tempNode.setText(request.getParameter("dbport"));
//            tempNode = doc.selectSingleNode("//config/maindb/dbname");
//            tempNode.setText(request.getParameter("dbname"));
//            tempNode = doc.selectSingleNode("//config/maindb/username");
//            tempNode.setText(request.getParameter("username"));
//            tempNode = doc.selectSingleNode("//config/maindb/password");
//            tempNode.setText(request.getParameter("password"));
            Node tempNode = doc.selectSingleNode("//config/maindb/dbused");
            tempNode.setText(request.getParameter("dbUsed"));

//            tempNode = doc.selectSingleNode("//config/backupdb/dbip");
//            tempNode.setText(request.getParameter("backup_dbip"));
//            tempNode = doc.selectSingleNode("//config/backupdb/dbport");
//            tempNode.setText(request.getParameter("backup_dbport"));
//            tempNode = doc.selectSingleNode("//config/backupdb/dbname");
//            tempNode.setText(request.getParameter("backup_dbname"));
//            tempNode = doc.selectSingleNode("//config/backupdb/username");
//            tempNode.setText(request.getParameter("backup_username"));
//            tempNode = doc.selectSingleNode("//config/backupdb/password");
//            tempNode.setText(request.getParameter("backup_password"));

            writer = new XMLWriter(new FileWriter(fileName));// 构建输出流
            writer.write(doc);// 输出XML
            msg = "保存成功";
            logService.newLog("INFO", SessionUtils.getAccount(request)
                    .getUserName(), "审计库管理", "用户更新审计库信息成功");
        } catch (Exception e) {
            logger.error("审计库管理",e);
            logService.newLog("ERROR", SessionUtils.getAccount(request)
                    .getUserName(), "审计库管理", "用户更新审计库信息失败");
            msg = "保存失败";
        } finally {
            writer.close();
        }

        String json = "{success:true,msg:'"+msg+"'}";
        actionBase.actionEnd(response,json,result);
        return null;
    }

	/**
	 * 测试备份数据库
	 *
	 */
	public String testBackupDB() throws Exception {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result =	actionBase.actionBegin(request);
        String canConnect = "true";
		Connection conn = null;
		Statement stat = null;
		ResultSet rs = null;
		try {
			Class.forName("com.mysql.jdbc.Driver");
			String url = "jdbc:mysql://" + request.getParameter("backup_dbip")
					+ ":" + request.getParameter("backup_dbport") + "/"
					+ request.getParameter("backup_dbname")
					+ "?useUnicode=true&characterEncoding=utf-8";
			String user = request.getParameter("backup_username");
			String password = request.getParameter("backup_password");

			conn = DriverManager.getConnection(url, user, password);
			stat = conn.createStatement();
			rs = stat.executeQuery("select * from business_log limit 1");
			if (rs != null && rs.next()) {

			}
            logService.newLog("INFO", SessionUtils.getAccount(request)
                               .getUserName(), "审计库管理", "用户测试备份审计库信息成功");
		} catch (Exception e) {
			canConnect = "false";
			logger.error("", e);
            logService.newLog("ERROR", SessionUtils.getAccount(request)
                                .getUserName(), "审计库管理", "用户测试备份审计库信息失败");
		} finally {
			try {
				if (null != rs) {
					rs.close();
					rs = null;
				}
				if (null != stat) {
					stat.close();
					stat = null;
				}
				if (null != conn) {
					conn.close();
					conn = null;
				}
			} catch (SQLException e) {

			}
		}
		String json = "{success:" + canConnect + "}";
        actionBase.actionEnd(response,json,result);
		return null;
	}

	/**
	 * 初始化数据库
	 *
	 */
	public String initDB() throws Exception {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result =	actionBase.actionBegin(request);
        boolean isResult = true;

        try{
            if(StringUtils.isAuthUser(SessionUtils.getAccount(request))){
                SAXReader reader = new SAXReader();
    //            String fileName = SiteContext.getInstance().contextRealPath
    //                    + AppConstant.XML_DB_CONFIG_PATH;
                String fileName = request.getSession().getServletContext().getRealPath("pages/data") + "/db-config.xml";
                Document doc = reader.read(new File(fileName));
                String password = doc.selectSingleNode("//config/maindb/password").getText();
                String dbip = doc.selectSingleNode("//config/maindb/dbip").getText();
                String dbport = doc.selectSingleNode("//config/maindb/dbport").getText();
                String dbname = doc.selectSingleNode("//config/maindb/dbname").getText();
                String username = doc.selectSingleNode("//config/maindb/username").getText();

                SQLExec sqlExec = new SQLExec();
                sqlExec.setEncoding("UTF-8");
                //设置数据库参数
                sqlExec.setDriver("com.mysql.jdbc.Driver");
                sqlExec.setUrl("jdbc:mysql://" + dbip + ":"
                        + dbport + "/"
                        + dbname + "?useUnicode=true&characterEncoding=utf-8");
                sqlExec.setUserid(username);

                sqlExec.setPassword(password);
    //            String sqlPath = request.getRealPath("WEB-INF")+ "/init.sql";
                String sqlPath = null;
                if(StringUtils.getPrivated()){//nei wang
                    sqlPath = request.getSession().getServletContext().getRealPath("WEB-INF") + "/stp-nei.sql";
                } else {
                    sqlPath = request.getSession().getServletContext().getRealPath("WEB-INF") + "/stp-wai.sql";
                }
                //要执行的脚本
                sqlExec.setSrc(new File(sqlPath));
                //有出错的语句该如何处理
                sqlExec.setOnerror((SQLExec.OnError)(EnumeratedAttribute.getInstance(
                        SQLExec.OnError.class, "abort")));

                sqlExec.setPrint(true); //设置是否输出

                //输出到文件 sql.out 中；不设置该属性，默认输出到控制台
                sqlExec.setOutput(new File(System.getProperty("ichange.home")+"/logs/sql_out.log"));
                sqlExec.setProject(new Project()); // 要指定这个属性，不然会出错
                sqlExec.execute();
                logService.newLog("INFO", SessionUtils.getAccount(request)
                         .getUserName(), "恢复出厂设置", "用户初始化审计库信息成功");
            } else {

            }
        } catch (Exception e) {
            isResult = false;
            logger.error("恢复出厂设置--初始化数据库,", e);
            logService.newLog("ERROR", SessionUtils.getAccount(request)
                      .getUserName(), "恢复出厂设置", "用户初始化审计库信息失败");
        }

        String json = "{success:" + isResult + "}";
        actionBase.actionEnd(response,json,result);
//        Proc proc;
//        OSInfo osinfo = OSInfo.getOSInfo();
//        if (osinfo.isWin()) {
//            proc = new Proc();
//            proc.exec("nircmd service restart stp");
//        }
//        if (osinfo.isLinux()) {
//            proc = new Proc();
//            proc.exec("service stp restart");
//        }
        return null;
	}

    /**
	 * 初始化配置文件
	 *
	 */
	public String initConfig() throws Exception {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result =	actionBase.actionBegin(request);
        boolean isResult = true;

        try{
            if(StringUtils.isAuthUser(SessionUtils.getAccount(request))){
                boolean privated = StringUtils.getPrivated();
                String targetDir = StringContext.systemPath+"/repository";
                File destDir = new File(targetDir);
                if(privated) {//内网
                    String dir = request.getSession().getServletContext().getRealPath("/data/neiwang/repository");
                    File src = new File(dir+"/external/config.xml");
                    FileUtil.copy(src,StringContext.EXTERNALXML);
                    src = new File(dir+"/config.xml");
                    FileUtil.copy(src, StringContext.INTERNALXML);
                } else {
//                String dir = StringContext.systemPath + "/tomcat/webapps" + request.getContextPath() + "/data/waiwang/repository";
                    String dir = request.getSession().getServletContext().getRealPath("/data/waiwang/repository");
                    File src = new File(dir+"/external/config.xml");
                    FileUtil.copy(src, StringContext.EXTERNALXML);
                }
                Proc proc  = new Proc();
                proc.exec("rm -r -f "+StringContext.INTERNALVERSIONPATH);
                proc.exec("rm -r -f "+StringContext.EXTERNALVERSIONPATH);
                proc.exec("rm -r -f "+StringContext.INTERNALHISTORYPATH);
                proc.exec("rm -r -f "+StringContext.EXTERNALHISTORYPATH);
                FileUtil.createDir(StringContext.INTERNALVERSIONPATH);
                FileUtil.createDir(StringContext.EXTERNALVERSIONPATH);
                FileUtil.createDir(StringContext.INTERNALHISTORYPATH);
                FileUtil.createDir(StringContext.EXTERNALHISTORYPATH);

                logService.newLog("INFO", SessionUtils.getAccount(request)
                        .getUserName(), "恢复出厂设置", "用户初始化配置文件成功");
            } else {

            }
        } catch (Exception e) {
            isResult = false;
            logger.error("恢复出厂设置--初始化配置文件错误,", e);
            logService.newLog("ERROR", SessionUtils.getAccount(request)
                      .getUserName(), "恢复出厂设置", "用户初始化配置文件失败");
        }

        String json = "{success:" + isResult + "}";
        actionBase.actionEnd(response,json,result);
        return null;
	}

	/**
	 * 备份数据信息表导入
	 *
	 */
	public String importConfigTables() throws Exception {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result =	actionBase.actionBegin(request);
        String file = ServletRequestUtils.getStringParameter(request,"file");

		SAXReader reader = new SAXReader();
		String fileName = SiteContext.getInstance().contextRealPath
				+ AppConstant.BACKUP_CONFIG_PATH;
		String dbFile = SiteContext.getInstance().contextRealPath
				+ AppConstant.XML_DB_CONFIG_PATH;
		Document doc = reader.read(new File(fileName));
		Document dbDoc = reader.read(new File(dbFile));

		String filePath = doc.selectSingleNode("//backup/conf_file_path").getText();
		filePath += System.getProperty("file.separator") + file;
		logger.debug("backup file path:" + filePath);
		String os = System.getProperty("os.name").toUpperCase();
		logger.debug(os);
		String user = dbDoc.selectSingleNode("//config/maindb/username").getText();
		String pass = dbDoc.selectSingleNode("//config/maindb/password").getText();
		String dbname = dbDoc.selectSingleNode("//config/maindb/dbname").getText();
		String host = dbDoc.selectSingleNode("//config/maindb/dbip").getText();

		String param = "mysql -h" + host + " --default-character-set=utf8 -u"
				+ user + " -p" + pass + " " + dbname + " < " + filePath;
		String cmd[] = null;
		if (os.indexOf("WINDOWS") > -1) {
			cmd = new String[] { "cmd", "/c", param };
		} else {
			cmd = new String[] { "sh", "-c", param };
		}
		logger.debug("开始导入");
		// logger.debug(cmd);
        String msg = null;
		try {
            Process child = Runtime.getRuntime().exec(cmd);
            child.waitFor();
            msg = "导入成功";
            logService.newLog("INFO", SessionUtils.getAccount(request)
                  .getUserName(), "审计库管理", "用户导入备份数据信息成功");
		} catch (InterruptedException e) {
			logger.error("导入失败", e);
            msg = "导入失败";
            logService.newLog("ERROR", SessionUtils.getAccount(request)
                  .getUserName(), "审计库管理", "用户导入备份数据信息失败");
		}
		logger.debug("导入结束");

		String json = "{success:true,msg:'"+msg+"'}";

        actionBase.actionEnd(response,json,result);
        return null;
	}

	/**
	 * 显示备份的sql文件
	 */
	public String showSqlFiles() throws Exception {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result =	actionBase.actionBegin(request);
        String json = "{success:true,total:0,rows:[]}";
        try{
            SAXReader reader = new SAXReader();
            String fileName = SiteContext.getInstance().contextRealPath
                    + AppConstant.BACKUP_CONFIG_PATH;
            Document doc = reader.read(new File(fileName));
            File dir = new File(doc.selectSingleNode("//backup/conf_file_path")	.getText());
            logger.debug(dir);
            File[] files = dir.listFiles(new FilenameFilter() {
                public boolean accept(File dir, String name) {
                    logger.debug(name);
                    if (name.indexOf(".sql") > -1) {
                        return true;
                    } else {
                        return false;
                    }
                }
            });
            if(files!=null&&files.length>0){
                json = StringUtils.fileArrayToJson(files);
                logService.newLog("INFO", SessionUtils.getAccount(request)
                        .getUserName(), "审计库管理", "用户显示备份sql文件成功");
            } else {
                logger.warn("数据库管理,备份数据库导入中,没有备份的sql文件");
            }
        } catch (Exception e){
            logger.error("审计库管理",e);
            logService.newLog("ERROR", SessionUtils.getAccount(request)
                  .getUserName(), "审计库管理", "用户显示备份sql文件失败");
        }
        actionBase.actionEnd(response,json,result);
        return null;
	}

    /**
     * 备份策略
     * @return
     * @throws Exception
     */
    public String selectBackup() throws Exception {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result =	actionBase.actionBegin(request);
        String json = null;
        try{
            SAXReader reader = new SAXReader();
            String fileName = SiteContext.getInstance().contextRealPath
                    + AppConstant.BACKUP_CONFIG_PATH;
            Document doc = reader.read(new File(fileName));
            String conf_type = doc.selectSingleNode("//backup/conf_type").getText();
            String conf_time = doc.selectSingleNode("//backup/conf_time").getText();
            String conf_day = doc.selectSingleNode("//backup/conf_day").getText();
            String conf_time2 = doc.selectSingleNode("//backup/conf_time2").getText();
            String conf_month_day = doc.selectSingleNode("//backup/conf_month_day").getText();
            String conf_time3 = doc.selectSingleNode("//backup/conf_time3").getText();
            String conf_file_path = doc.selectSingleNode("//backup/conf_file_path").getText();
            String conf_enabled = doc.selectSingleNode("//backup/conf_enabled").getText();
            String conf_maxfiles = doc.selectSingleNode("//backup/conf_maxfiles").getText();
            String log_type = doc.selectSingleNode("//backup/log_type").getText();
            String log_time = doc.selectSingleNode("//backup/log_time").getText();
            String log_day = doc.selectSingleNode("//backup/log_day").getText();
            String log_time2 = doc.selectSingleNode("//backup/log_time2").getText();
            String log_month_day = doc.selectSingleNode("//backup/log_month_day").getText();
            String log_time3 = doc.selectSingleNode("//backup/log_time3").getText();

            json = "[{conf_type:'"+conf_type+"',conf_time:'"+conf_time+"',conf_day:'"+conf_day+
                    "',conf_time2:'"+conf_time2+"',conf_month_day:'"+conf_month_day+
                    "',conf_time3:'"+conf_time3+"',conf_file_path:'"+conf_file_path+
                    "',conf_enabled:'"+conf_enabled+"',conf_maxfiles:'"+conf_maxfiles+
                    "',log_type:'"+log_type+"',log_time:'"+log_time+"',log_day:'"+log_day+
                    "',log_time2:'"+log_time2+"',log_month_day:'"+log_month_day+
                    "',log_time3:'"+log_time3+"'}]";
            logService.newLog("INFO", SessionUtils.getAccount(request)
                    .getUserName(), "审计备份策略", "用户显示审计备份策略成功");
        } catch (Exception e){
            logger.error("审计备份策略",e);
            logService.newLog("ERROR", SessionUtils.getAccount(request)
                    .getUserName(), "审计备份策略", "用户显示审计备份策略失败");
        }
        actionBase.actionEnd(response,json,result);
        return null;
    }


    /**
     * 更新/pages/data/backup-config.xml
     * @return
     * @throws Exception
     */
    public String updateBackup() throws Exception {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result =	actionBase.actionBegin(request);
        SAXReader reader = new SAXReader();
        String fileName = SiteContext.getInstance().contextRealPath
                + AppConstant.BACKUP_CONFIG_PATH;
        Document doc = reader.read(new File(fileName));
        String msg = null;
        XMLWriter writer = null;
        try {
            Node tempNode = doc.selectSingleNode("//backup/conf_type");
            tempNode.setText(request.getParameter("conf_type"));
            tempNode = doc.selectSingleNode("//backup/conf_time");
            tempNode.setText(request.getParameter("conf_time"));
            tempNode = doc.selectSingleNode("//backup/conf_day");
            tempNode.setText(request.getParameter("conf_day"));
            tempNode = doc.selectSingleNode("//backup/conf_time2");
            tempNode.setText(request.getParameter("conf_time2"));
            tempNode = doc.selectSingleNode("//backup/conf_month_day");
            tempNode.setText(request.getParameter("conf_month_day"));
            tempNode = doc.selectSingleNode("//backup/conf_time3");
            tempNode.setText(request.getParameter("conf_time3"));
            tempNode = doc.selectSingleNode("//backup/conf_file_path");
            tempNode.setText(request.getParameter("conf_file_path"));
            tempNode = doc.selectSingleNode("//backup/conf_enabled");
            tempNode.setText(ServletRequestUtils.getStringParameter(request,"conf_enabled", "0"));

            tempNode = doc.selectSingleNode("//backup/log_type");
            tempNode.setText(request.getParameter("log_type"));
            tempNode = doc.selectSingleNode("//backup/log_time");
            tempNode.setText(request.getParameter("log_time"));
            tempNode = doc.selectSingleNode("//backup/log_day");
            tempNode.setText(request.getParameter("log_day"));
            tempNode = doc.selectSingleNode("//backup/log_time2");
            tempNode.setText(request.getParameter("log_time2"));
            tempNode = doc.selectSingleNode("//backup/log_month_day");
            tempNode.setText(request.getParameter("log_month_day"));
            tempNode = doc.selectSingleNode("//backup/log_time3");
            tempNode.setText(request.getParameter("log_time3"));

            writer = new XMLWriter(new FileWriter(fileName));// 构建输出流
            writer.write(doc);// 输出XML
            msg = "保存成功";
            logService.newLog("INFO", SessionUtils.getAccount(request)
                    .getUserName(), "审计备份策略", "用户更新审计备份策略信息成功");
        } catch (Exception e) {
            logger.error("审计备份策略",e);
            logService.newLog("ERROR", SessionUtils.getAccount(request)
                    .getUserName(), "审计备份策略", "用户更新审计备份策略信息失败");
            msg = "保存失败";
        } finally {
            writer.close();
        }

        String json = "{success:true,msg:'"+msg+"'}";
        actionBase.actionEnd(response,json,result);
        return null;
    }

    public void setLogService(LogService logService) {
        this.logService = logService;
    }
}
