package com.hzih.stp.web.action.jdbc;

import com.hzih.stp.constant.AppConstant;
import com.hzih.stp.entity.TypeBase;
import com.hzih.stp.service.LogService;
import com.hzih.stp.service.XmlOperatorService;
import com.hzih.stp.utils.StringContext;
import com.hzih.stp.web.SessionUtils;
import com.hzih.stp.web.SiteContext;
import com.hzih.stp.web.action.ActionBase;
import com.inetec.common.config.stp.nodes.Jdbc;
import com.inetec.common.exception.Ex;
import com.inetec.common.security.DesEncrypterAsPassword;
import com.inetec.ichange.console.config.Constant;
import com.inetec.ichange.console.config.database.DBFactory;
import com.inetec.ichange.console.config.database.IDataBase;
import com.opensymphony.xwork2.ActionSupport;
import org.apache.log4j.Logger;
import org.apache.struts2.ServletActionContext;
import org.dom4j.Document;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.util.List;

/**
 * User: 钱晓盼
 * Date: 12-7-23
 * Time: 下午3:31
 * 数据源管理
 */
public class JdbcAction extends ActionSupport {
    private final static Logger logger = Logger.getLogger(JdbcAction.class);
    private LogService logService;
    private XmlOperatorService xmlOperatorService;
    private TypeBase typeBase;
    private Jdbc jdbc;
    private String typeXml;
    private String[] jdbcNameArray;
    private String jdbcName;
    private String dbType;
    private String version;
    private String driver;

    public String insert() throws IOException {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result = actionBase.actionBegin(request);
        String msg = null;
        try{
            DesEncrypterAsPassword deap = new DesEncrypterAsPassword(Constant.S_PWD_ENCRYPT_CODE);
            String password = new String(deap.encrypt(jdbc.getPassword().getBytes()));
            jdbc.setPassword(password);
            xmlOperatorService.saveJdbc(jdbc,typeBase.getPrivated());
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"数据源管理","新增JDBC成功");
            msg = "新增成功,点击[确定]返回列表";
        } catch (Exception e){
            logger.error("数据源管理",e);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(),"数据源管理","新增JDBC失败");
            msg = "新增失败";
        }
        String json = "{success:true,msg:'"+msg+"'}";
        actionBase.actionEnd(response,json,result);
        return null;
    }

    public String delete() throws IOException {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result = actionBase.actionBegin(request);
        String msg = null;
        try{
            msg = xmlOperatorService.deleteJdbcByName(jdbcNameArray,typeXml);
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"数据源管理",msg);
        } catch (Exception e){
            logger.error("数据源管理",e);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(),"数据源管理","数据库同步新增失败");
            msg = "删除失败";
        }
        String json = "{success:true,msg:'"+msg+"'}";
        actionBase.actionEnd(response,json,result);
        return null;
    }

    public String update() throws IOException {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result = actionBase.actionBegin(request);
        String msg = null;
        try{
            boolean isUsed = xmlOperatorService.checkJdbcNameIsUsed(typeBase.getPrivated(),jdbc.getJdbcName());
            if(isUsed){
                Jdbc j = xmlOperatorService.getJdbc(typeBase, jdbc.getJdbcName());
                j.setDescription(jdbc.getDescription());
                xmlOperatorService.updateJdbc(j,typeBase.getPrivated());
            } else {
                Jdbc j = xmlOperatorService.getJdbc(typeBase, jdbc.getJdbcName());
                DesEncrypterAsPassword deap = new DesEncrypterAsPassword(Constant.S_PWD_ENCRYPT_CODE);
                String password = null;
                if(jdbc.getPassword().equals(j.getPassword())){
                    password = new String(deap.decrypt(jdbc.getPassword().getBytes()));
                    password = new String(deap.encrypt(password.getBytes()));
                }else{
                    password = new String(deap.encrypt(jdbc.getPassword().getBytes()));
                }

                jdbc.setPassword(password);
                xmlOperatorService.updateJdbc(jdbc,typeBase.getPrivated());
            }
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"数据源管理","修改JDBC成功");
            msg = "修改成功,点击[确定]返回列表";
        } catch (Exception e){
            logger.error("数据源管理",e);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(),"数据源管理","修改JDBC失败");
            msg = "修改失败";
        }
        String json = "{success:true,msg:'"+msg+"'}";
        actionBase.actionEnd(response,json,result);
        return null;
    }

    public String select() throws IOException {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result = actionBase.actionBegin(request);
        String json = null;
        try{
            Integer start = Integer.valueOf(request.getParameter("start"));
            Integer limit = Integer.valueOf(request.getParameter("limit"));
            if(typeXml.equals(StringContext.EXTERNAL)){        //源端数据源
                json = xmlOperatorService.readExternalJdbc(start,limit);
            } else if(typeXml.equals(StringContext.INTERNAL)){  //目标数据源
                json = xmlOperatorService.readInternalJdbc(start, limit);
            }
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"数据源管理","数据库同步新增成功");
        } catch (Exception e){
            logger.error("数据源管理", e);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(),"数据源管理","数据库同步新增失败");
        }
        actionBase.actionEnd(response,json,result);
        return null;
    }

    public String testConnect() throws IOException {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result = actionBase.actionBegin(request);
        String msg = null;
        try{
            String operatorType = request.getParameter("operatorType");
            String dbName = request.getParameter("dbName");
            DesEncrypterAsPassword deap = new DesEncrypterAsPassword(Constant.S_PWD_ENCRYPT_CODE);

            String password = null;
            boolean isConnectable = false;
            if("test_internal".equals(operatorType)){
                TypeBase tb = new TypeBase();
                tb.setPrivated(true);
                Jdbc j = xmlOperatorService.getJdbc(tb, dbName);
                IDataBase db = DBFactory.getDataBase(j, Constant.DB_INTERNAL);
                db.openConnection();
                isConnectable = db.isConnectable();
                db.closeConnection();
            }else if("test_external".equals(operatorType)){
                TypeBase tb = new TypeBase();
                tb.setPrivated(false);
                Jdbc j = xmlOperatorService.getJdbc(tb, dbName);
                IDataBase db = DBFactory.getDataBase(j, Constant.DB_INTERNAL);
                db.openConnection();
                isConnectable = db.isConnectable();
                db.closeConnection();
            }else{
                if("insert".equals(operatorType)){
                    password = new String(deap.encrypt(jdbc.getPassword().getBytes()));
                }else if("update".equals(operatorType)){
                    Jdbc j = xmlOperatorService.getJdbc(typeBase, jdbc.getJdbcName());
                    if(jdbc.getPassword().equals(j.getPassword())){
                        password = new String(deap.decrypt(jdbc.getPassword().getBytes()));
                        password = new String(deap.encrypt(password.getBytes()));
                    }else{
                        password = new String(deap.encrypt(jdbc.getPassword().getBytes()));
                    }
                }
                jdbc.setPassword(password);

                IDataBase db = DBFactory.getDataBase(jdbc, Constant.DB_INTERNAL);

                db.openConnection();
                isConnectable = db.isConnectable();
                db.closeConnection();
            }
            if(isConnectable){
                msg = "测试成功";
            }else {
                msg = "测试失败,不能连通";
            }
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"数据源管理","JDBC测试成功");
        } catch (Exception e){
            logger.error("数据源管理",e);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(),"数据源管理","JDBC测试失败");
            msg = "测试失败";
        }
        String json = "{success:true,msg:'"+msg+"'}";
        actionBase.actionEnd(response,json,result);
        return null;
    }

    public String readJdbcName() throws IOException {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result = actionBase.actionBegin(request);
        String json = null;
        try{
            json = xmlOperatorService.readJdbcName(typeXml);
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"数据库同步","数据库同步新增或修改时获取数据源名列表成功");
        } catch (Exception e){
            logger.error("数据库同步",e);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(),"数据库同步","数据库同步新增或修改时获取数据源名列表失败");
        }
        actionBase.actionEnd(response,json,result);
        return null;
    }

    public String check() throws Exception {
		HttpServletRequest request = ServletActionContext.getRequest();
		HttpServletResponse response = ServletActionContext.getResponse();
		ActionBase base = new ActionBase();
		String result =	base.actionBegin(request);
		String msg = null;
        try{
            msg = xmlOperatorService.checkJdbcName(jdbcName, typeXml);
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"新增数据源","新增数据源"+jdbcName+"验证成功!");
            logger.info("新增数据源验证成功!");
        } catch (Ex e){
            logger.error("新增数据源验证",e);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(),"新增数据源","新增数据源"+jdbcName+"验证失败!");
            msg = "验证失败,请联系管理员!";
        }
        String json = "{success:true,msg:'"+msg+"'}";
		base.actionEnd(response, json, result);
		return null;
	}

    public String readDataBaseNamesKeyValue() throws Exception {
        HttpServletRequest request = ServletActionContext.getRequest();
		HttpServletResponse response = ServletActionContext.getResponse();
		ActionBase base = new ActionBase();
		String result =	base.actionBegin(request);
        String json = null;
        try{
            SAXReader reader = new SAXReader();
            String fileName = SiteContext.getInstance().contextRealPath
                            + AppConstant.DATABASE_VERSION_CONFIG_PATH;
            Document doc = reader.read(new File(fileName));
            List<Element> list = doc.selectNodes("//config/database/name");
            int total = list.size();
            json = "{success:true,total:"+total+",rows:[";
            for(Element e : list){
                String value = e.attribute("value").getText();
                String key = e.attribute("key").getText();
                json += "{key:'"+key+"',value:'"+value+"'},";
            }
            json += "]}";
            logService.newLog("INFO",SessionUtils.getAccount(request).getUserName(),"数据源","读取数据库类型成功");
        } catch (Exception e) {
            logger.error("读取数据库类型错误",e);
            logService.newLog("ERROR",SessionUtils.getAccount(request).getUserName(),"数据源","读取数据库类型失败");
            json = "{success:true,total:0,rows:[]}";
        }
        base.actionEnd(response, json, result);
		return null;
    }

    public String readDataBaseVersionsKeyValue() throws Exception {
        HttpServletRequest request = ServletActionContext.getRequest();
		HttpServletResponse response = ServletActionContext.getResponse();
		ActionBase base = new ActionBase();
		String result =	base.actionBegin(request);
        String json = null;
        try{
            SAXReader reader = new SAXReader();
            String fileName = SiteContext.getInstance().contextRealPath
                            + AppConstant.DATABASE_VERSION_CONFIG_PATH;
            Document doc = reader.read(new File(fileName));
            List<Element> list = doc.selectNodes("//config/database/name[@value='"+dbType+"']/versions/version");
            int total = list.size();
            json = "{success:true,total:"+total+",rows:[";
            for(Element e : list){
                String version = e.attribute("name").getText();
                json += "{key:'"+version+"',value:'"+version+"'},";
            }
            json += "]}";
            logService.newLog("ERROR",SessionUtils.getAccount(request).getUserName(),"数据源","读取数据库类型"+dbType+"对应的版本成功");
        } catch (Exception e) {
            logger.error("读取数据库类型"+dbType+"对应的版本错误",e);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(), "数据源", "读取数据库类型" + dbType + "对应的版本失败");
            json = "{success:true,total:0,rows:[]}";
        }
        base.actionEnd(response, json, result);
		return null;
    }

    public String readDataBaseDriversKeyValue() throws Exception {
        HttpServletRequest request = ServletActionContext.getRequest();
		HttpServletResponse response = ServletActionContext.getResponse();
		ActionBase base = new ActionBase();
		String result =	base.actionBegin(request);
        String json = null;
        try{
            SAXReader reader = new SAXReader();
            String fileName = SiteContext.getInstance().contextRealPath
                            + AppConstant.DATABASE_VERSION_CONFIG_PATH;
            Document doc = reader.read(new File(fileName));
            List<Element> list = doc.selectNodes("//config/database/name[@value='"+dbType+"']/versions/version[@name='"+version+"']/drivers/driver");
            int total = list.size();
            json = "{success:true,total:"+total+",rows:[";
            for(Element e : list){
                String driver = e.attribute("name").getText();
                json += "{key:'"+driver+"',value:'"+driver+"'},";
            }
            json += "]}";
            logService.newLog("ERROR",SessionUtils.getAccount(request).getUserName(),"数据源","读取数据库类型"+dbType+"对应版本"+version+"的驱动成功");
        } catch (Exception e) {
            logger.error("读取数据库类型"+dbType+"对应版本"+version+"的驱动错误",e);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(), "数据源", "读取数据库类型" + dbType + "对应版本" + version + "的驱动失败");
            json = "{success:true,total:0,rows:[]}";
        }
        base.actionEnd(response, json, result);
		return null;
    }

    public String readDriverInfo() throws Exception {
        HttpServletRequest request = ServletActionContext.getRequest();
		HttpServletResponse response = ServletActionContext.getResponse();
		ActionBase base = new ActionBase();
		String result =	base.actionBegin(request);
        String json = null;
        try{
            SAXReader reader = new SAXReader();
            String fileName = SiteContext.getInstance().contextRealPath
                            + AppConstant.DATABASE_VERSION_CONFIG_PATH;
            Document doc = reader.read(new File(fileName));
            String vender = doc.selectSingleNode("//config/database/name[@value='"+dbType+"']/versions" +
                    "/version[@name='"+version+"']/drivers/driver[@name='"+driver+"']/vender").getText();
            String port = doc.selectSingleNode("//config/database/name[@value='"+dbType+"']/versions" +
                    "/version[@name='"+version+"']/drivers/driver[@name='"+driver+"']/defaultport").getText();
            String url = doc.selectSingleNode("//config/database/name[@value='"+dbType+"']/versions" +
                    "/version[@name='"+version+"']/drivers/driver[@name='"+driver+"']/url").getText();
            String catalog = doc.selectSingleNode("//config/database/name[@value='"+dbType+"']/versions" +
                    "/version[@name='"+version+"']/drivers/driver[@name='"+driver+"']/catalog").getText();
            json = "{success:true,vender:'"+vender+"',port:'"+port+"',url:'"+url+"',catalog:'"+catalog+"'}";
            logService.newLog("INFO",SessionUtils.getAccount(request).getUserName(),"数据源","读取数据库类型"+dbType+"对应版本"+version+"的驱动"+driver+"的对应信息成功");
        } catch (Exception e) {
            logger.error("读取数据库类型错误",e);
            logService.newLog("ERROR",SessionUtils.getAccount(request).getUserName(),"数据源","读取数据库类型"+dbType+"对应版本"+version+"的驱动"+driver+"的对应信息失败");
            json = "{success:true,vender:'',port:'',url:'',catalog:''}";
        }
        base.actionEnd(response, json, result);
		return null;
    }


    public LogService getLogService() {
        return logService;
    }

    public void setLogService(LogService logService) {
        this.logService = logService;
    }

    public XmlOperatorService getXmlOperatorService() {
        return xmlOperatorService;
    }

    public void setXmlOperatorService(XmlOperatorService xmlOperatorService) {
        this.xmlOperatorService = xmlOperatorService;
    }

    public Jdbc getJdbc() {
        return jdbc;
    }

    public void setJdbc(Jdbc jdbc) {
        this.jdbc = jdbc;
    }

    public String getTypeXml() {
        return typeXml;
    }

    public void setTypeXml(String typeXml) {
        this.typeXml = typeXml;
    }

    public TypeBase getTypeBase() {
        return typeBase;
    }

    public void setTypeBase(TypeBase typeBase) {
        this.typeBase = typeBase;
    }

    public String[] getJdbcNameArray() {
        return jdbcNameArray;
    }

    public void setJdbcNameArray(String[] jdbcNameArray) {
        this.jdbcNameArray = jdbcNameArray;
    }

    public String getJdbcName() {
        return jdbcName;
    }

    public void setJdbcName(String jdbcName) {
        this.jdbcName = jdbcName;
    }

    public String getDbType() {
        return dbType;
    }

    public void setDbType(String dbType) {
        this.dbType = dbType;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getDriver() {
        return driver;
    }

    public void setDriver(String driver) {
        this.driver = driver;
    }
}
