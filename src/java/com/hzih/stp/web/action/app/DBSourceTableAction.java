package com.hzih.stp.web.action.app;

import com.hzih.stp.entity.TypeBase;
import com.hzih.stp.entity.TypeDB;
import com.hzih.stp.entity.TypeTable;
import com.hzih.stp.service.DataBaseService;
import com.hzih.stp.service.LogService;
import com.hzih.stp.service.XmlOperatorService;
import com.hzih.stp.utils.StringContext;
import com.hzih.stp.web.SessionUtils;
import com.hzih.stp.web.action.ActionBase;
import com.inetec.common.config.stp.nodes.Field;
import com.opensymphony.xwork2.ActionSupport;
import org.apache.log4j.Logger;
import org.apache.struts2.ServletActionContext;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * User: 钱晓盼
 * Date: 12-7-24
 * Time: 下午1:23
 * 数据库同步源端数据表集合操作
 */
public class DBSourceTableAction extends ActionSupport {

    private final static Logger logger = Logger.getLogger(DBTypeAction.class);
    private XmlOperatorService xmlOperatorService;
    private DataBaseService dataBaseService;
    private LogService logService;
    private TypeBase typeBase;
    private TypeDB typeDB;
    private String appName;
    private String dbName;
    private String tables;
	private Integer start;
	private Integer limit;
    private String typeXml;
    private String tableName;
    private String type;
    private TypeTable typeTable;
    private String[] fields;
    private String[] is_pks;
    private String[] is_nulls;
    private String[] column_sizes;
    private String[] jdbc_types;
    private String[] db_types;
	private boolean monitorinsert;
	private boolean monitorupdate;
	private boolean monitordelete;
    private String operate;
    private String[] tableNames;


    public String readSourceTableNames() throws IOException {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result = actionBase.actionBegin(request);
        String json = null;
        try{
            json = xmlOperatorService.readTableNames(start, limit, typeXml, tables, appName,dbName);
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"数据库同步","数据库同步应用"+appName+"源端读取数据源"+dbName+"下表集合列表成功");
        } catch (Exception e){
            logger.error("数据库同步", e);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(),"数据库同步","数据库同步应用"+appName+"源端读取数据源"+dbName+"下表集合列表失败");
        }
        actionBase.actionEnd(response,json,result);
        return null;
    }

    public String readSourcedDBName() throws IOException {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result = actionBase.actionBegin(request);
        String json = null;
        try{
            json = dataBaseService.readExternalDB(start,limit,dbName,appName);
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"数据库同步","数据库同步应用"+appName+"源端读取数据源"+dbName+"下的所有表名列表成功");
        } catch (Exception e){
            logger.error("数据库同步", e);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(),"数据库同步","数据库同步应用"+appName+"源端读取数据源"+dbName+"下的所有表名列表失败");
        }
        actionBase.actionEnd(response,json,result);
        return null;
    }

    public String readSourceTableField() throws IOException {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result = actionBase.actionBegin(request);
        String json = null;
        String _type = null;
        if(type.equals("insert")){
            _type = "新增";
        } else if(type.equals("update")){
            _type = "修改";
        }
        try{
            if(type.equals("insert")){
                json = dataBaseService.readTableField(start,limit,typeXml,tableName,dbName);
            }else if(type.equals("update")){
                json = dataBaseService.readTableFieldExist(start,limit,typeXml,appName,tableName,dbName);
            }
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"数据库同步","数据库同步应用"+appName+"源端"+_type+"时读取数据源"+dbName+"下的表"+tableName+"的属性列表成功");
        } catch (Exception e){
            logger.error("数据库同步", e);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(),"数据库同步","数据库同步应用"+appName+"源端"+_type+"时读取数据源"+dbName+"下的表"+tableName+"的属性列表失败");
        }
        actionBase.actionEnd(response,json,result);
        return null;
    }

    public String saveSourceTable() throws IOException {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result = actionBase.actionBegin(request);
        String msg = null;
        String _operate = null;
        if(operate.equals("insert")){
            _operate = "新增";
        } else if(operate.equals("update")){
            _operate = "修改";
        }
        try{
            Field[] tableFields = new Field[fields.length];
            for (int i = 0; i < tableFields.length; i++) {
                Field f = new Field();
                f.setFieldName(fields[i]);
                f.setPk(is_pks[i]);
                f.setNull(is_nulls[i]);
                f.setColumnSize(column_sizes[i]);
                f.setJdbcType(jdbc_types[i]);
                f.setDbType(db_types[i]);
                tableFields[i] = f;
            }
            typeTable.setDelete(monitordelete);
            typeTable.setUpdate(monitorupdate);
            typeTable.setInsert(monitorinsert);
            xmlOperatorService.updateTypeAllow(StringContext.EXTERNAL, appName, false);
            if(operate.equals("insert")){
                xmlOperatorService.saveDBTypeTable(type,typeBase,typeDB,typeTable,tableFields);
            } else if(operate.equals("update")){
                xmlOperatorService.updateDBTypeTable(type,typeBase,typeDB,typeTable,tableFields);
            }
            xmlOperatorService.updateTypeAppSend(typeBase.getAppName(), StringContext.UPDATE_APP);
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"数据库同步","数据库同步源端表集合"+_operate+"表属性成功");
            msg = _operate+"成功,点击[确定]返回列表";
        } catch (Exception e){
            logger.error("数据库同步",e);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(),"数据库同步","数据库同步源端表集合"+_operate+"表属性失败");
            msg = _operate+"失败";
        }
        String json = "{success:true,msg:'"+msg+"'}";
        actionBase.actionEnd(response,json,result);
        return null;
    }

    public String deleteSourceTable() throws IOException {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result = actionBase.actionBegin(request);
        String msg = null;
        try{
            xmlOperatorService.updateTypeAllow(StringContext.EXTERNAL, appName, false);
            msg = xmlOperatorService.deleteTypeSourceTable(typeXml,appName,dbName,tableNames);
            xmlOperatorService.updateTypeAppSend(appName,StringContext.UPDATE_APP);
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"数据库同步","数据库同步源端表集合删除操作成功");
        } catch (Exception e){
            logger.error("数据库同步",e);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(), "数据库同步", "数据库同步源端表集合删除表失败");
            msg = "删除失败";
        }
        String json = "{success:true,msg:'"+msg+"'}";
        actionBase.actionEnd(response,json,result);
        return null;
    }

    public String deleteBackUpSourceTable() throws IOException {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result = actionBase.actionBegin(request);
        String msg = null;
        try{
            xmlOperatorService.updateTypeAllow(StringContext.EXTERNAL, appName, false);
            msg = xmlOperatorService.deleteTypeSourceTableBackUp(typeXml,appName,dbName,tableName);
            xmlOperatorService.updateTypeAppSend(appName,StringContext.UPDATE_APP);
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"数据库同步","数据库同步源端表集合删除操作恢复成功");
        } catch (Exception e){
            logger.error("数据库同步",e);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(), "数据库同步", "数据库同步源端表集合删除表恢复失败");
            msg = "删除恢复失败";
        }
        String json = "{success:true,msg:'"+msg+"'}";
        actionBase.actionEnd(response,json,result);
        return null;
    }

    public XmlOperatorService getXmlOperatorService() {
        return xmlOperatorService;
    }

    public void setXmlOperatorService(XmlOperatorService xmlOperatorService) {
        this.xmlOperatorService = xmlOperatorService;
    }

    public DataBaseService getDataBaseService() {
        return dataBaseService;
    }

    public void setDataBaseService(DataBaseService dataBaseService) {
        this.dataBaseService = dataBaseService;
    }

    public LogService getLogService() {
        return logService;
    }

    public void setLogService(LogService logService) {
        this.logService = logService;
    }

    public TypeBase getTypeBase() {
        return typeBase;
    }

    public void setTypeBase(TypeBase typeBase) {
        this.typeBase = typeBase;
    }

    public TypeDB getTypeDB() {
        return typeDB;
    }

    public void setTypeDB(TypeDB typeDB) {
        this.typeDB = typeDB;
    }

    public String getAppName() {
        return appName;
    }

    public void setAppName(String appName) {
        this.appName = appName;
    }

    public String getDbName() {
        return dbName;
    }

    public void setDbName(String dbName) {
        this.dbName = dbName;
    }

    public String getTables() {
        return tables;
    }

    public void setTables(String tables) {
        this.tables = tables;
    }

    public Integer getStart() {
        return start;
    }

    public void setStart(Integer start) {
        this.start = start;
    }

    public Integer getLimit() {
        return limit;
    }

    public void setLimit(Integer limit) {
        this.limit = limit;
    }

    public String getTypeXml() {
        return typeXml;
    }

    public void setTypeXml(String typeXml) {
        this.typeXml = typeXml;
    }

    public String getTableName() {
        return tableName;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public TypeTable getTypeTable() {
        return typeTable;
    }

    public void setTypeTable(TypeTable typeTable) {
        this.typeTable = typeTable;
    }

    public String[] getFields() {
        return fields;
    }

    public void setFields(String[] fields) {
        this.fields = fields;
    }

    public String[] getIs_pks() {
        return is_pks;
    }

    public void setIs_pks(String[] is_pks) {
        this.is_pks = is_pks;
    }

    public String[] getIs_nulls() {
        return is_nulls;
    }

    public void setIs_nulls(String[] is_nulls) {
        this.is_nulls = is_nulls;
    }

    public String[] getColumn_sizes() {
        return column_sizes;
    }

    public void setColumn_sizes(String[] column_sizes) {
        this.column_sizes = column_sizes;
    }

    public String[] getJdbc_types() {
        return jdbc_types;
    }

    public void setJdbc_types(String[] jdbc_types) {
        this.jdbc_types = jdbc_types;
    }

    public String[] getDb_types() {
        return db_types;
    }

    public void setDb_types(String[] db_types) {
        this.db_types = db_types;
    }

    public boolean isMonitorinsert() {
        return monitorinsert;
    }

    public void setMonitorinsert(boolean monitorinsert) {
        this.monitorinsert = monitorinsert;
    }

    public boolean isMonitorupdate() {
        return monitorupdate;
    }

    public void setMonitorupdate(boolean monitorupdate) {
        this.monitorupdate = monitorupdate;
    }

    public boolean isMonitordelete() {
        return monitordelete;
    }

    public void setMonitordelete(boolean monitordelete) {
        this.monitordelete = monitordelete;
    }

    public String getOperate() {
        return operate;
    }

    public void setOperate(String operate) {
        this.operate = operate;
    }

    public String[] getTableNames() {
        return tableNames;
    }

    public void setTableNames(String[] tableNames) {
        this.tableNames = tableNames;
    }

}
