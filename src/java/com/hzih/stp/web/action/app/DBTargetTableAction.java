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
 * 数据库同步目标端数据表集合操作
 */
public class DBTargetTableAction extends ActionSupport {

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
    private String sourceDBName;
    private String sourceTableName;
    private String targetTableName;
    private String targetDBName;
    private String type;
    private TypeTable typeTable;
    private String[] fields;
    private String[] is_pks;
    private String[] is_nulls;
    private String[] column_sizes;
    private String[] jdbc_types;
    private String[] db_types;
    private String[] tableNames;
    private String[] dests;
    private String[] target_is_pks;
    private String[] targetDBs;
    private String operate;
    private boolean deleteEnable;
	private boolean onlyInsert;
    private String srcTableName;
    private String targetDB;
    private String targetTable;

    public String readTargetTableNames() throws IOException {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result = actionBase.actionBegin(request);
        String json = null;
        try{
            json = xmlOperatorService.readTableNames(start, limit, typeXml, tables, appName, dbName);
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"数据库同步","数据库同步应用"+appName+"目标端读取表集合列表成功");
        } catch (Exception e){
            logger.error("数据库同步", e);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(),"数据库同步","数据库同步应用"+appName+"目标端读取表集合列表失败");
        }
        actionBase.actionEnd(response,json,result);
        return null;
    }

    /**
     * 从源端读取
     * @return
     * @throws IOException
     */
    public String readTargetDBName() throws IOException {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result = actionBase.actionBegin(request);
        String json = null;
        try{
            json = dataBaseService.readInternalTargetDB(start, limit, appName);
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"数据库同步","数据库同步应用"+appName+"目标端读取数据源下的所有对应源端的数据表名列表成功");
        } catch (Exception e){
            logger.error("数据库同步", e);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(),"数据库同步","数据库同步应用"+appName+"目标端读取数据源下的所有对应源端的数据表名列表失败");
        }
        actionBase.actionEnd(response,json,result);
        return null;
    }

    public String readTargetDBNameKeyValue() throws IOException {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result = actionBase.actionBegin(request);
        String json = null;
        try{
            json = dataBaseService.readInternalDBKeyValue(dbName);
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"数据库同步","数据库同步应用"+appName+"目标端读取数据源"+dbName+"下的所有数据表名列表成功");
        } catch (Exception e){
            logger.error("数据库同步", e);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(),"数据库同步","数据库同步应用"+appName+"目标端读取数据源"+dbName+"下的所有数据表名列表失败");
        }
        actionBase.actionEnd(response,json,result);
        return null;
    }

    public String readTargetTableField() throws IOException {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result = actionBase.actionBegin(request);
        String json = null;
        try{
            json = dataBaseService.readTargetTableField(typeXml, tableName, dbName,dests);
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"数据库同步","数据库同步应用"+appName+"目标端读取数据源"+dbName+"下的数据表"+tableName+"的列表成功");
        } catch (Exception e){
            logger.error("数据库同步", e);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(),"数据库同步","数据库同步应用"+appName+"目标端读取数据源"+dbName+"下的数据表"+tableName+"的列表失败");
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
                json = xmlOperatorService.readExternalFields(start,limit,appName,sourceDBName,sourceTableName,targetDBName,targetTableName);
            }else if(type.equals("update")){
//                String targetTable = request.getParameter("targetTable");
//                String targetDB = request.getParameter("targetDB");
                json = xmlOperatorService.readInternalFieldsExist(start,limit,appName,sourceDBName,sourceTableName,targetDBName,targetTableName);
			}
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"数据库同步","数据库同步应用"+appName+"目标端"+_type+"时读取数据源的表的属性列表成功");
        } catch (Exception e){
            logger.error("数据库同步", e);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(),"数据库同步","数据库同步应用"+appName+"目标端"+_type+"时读取数据源的表的属性列表失败");
        }
        actionBase.actionEnd(response,json,result);
        return null;
    }

    public String updateSourceDBName() throws IOException {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result = actionBase.actionBegin(request);
        String msg = null;
        try{
            String sourceDBNameOld = request.getParameter("sourceDBNameOld");
            String sourceDBName = request.getParameter("sourceDBName");
            msg = xmlOperatorService.updateTargetSourceDBName(StringContext.INTERNAL,appName,sourceDBNameOld,sourceDBName);
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"数据库同步","数据库同步应用"+appName+"目标端更新源端数据库和删除表集合成功");
        } catch (Exception e){
            logger.error("数据库同步", e);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(),"数据库同步","数据库同步应用"+appName+"目标端更新源端数据库和删除表集合失败");
            msg = "更改失败,请重试或联系管理员";
        }
        String json = "{success:true,msg:'"+msg+"'}";
        actionBase.actionEnd(response,json,result);
        return null;
    }

    public String saveTargetTable() throws IOException {
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
            String[] fieldStrings = null;
		    Field[] tableFields = new Field[dests.length];
            for (int i = 0; i < dests.length; i++) {
                Field f = new Field();
                f.setFieldName(fields[i]);
                f.setDestField(dests[i]);
                f.setPk(is_pks[i]);
                f.setJdbcType(jdbc_types[i]);
                f.setColumnSize(column_sizes[i]);
                f.setNull(is_nulls[i]);
                f.setDbType(db_types[i]);
                tableFields[i] = f;
            }
            typeTable.setDeleteEnable(deleteEnable);
            typeTable.setOnlyInsert(onlyInsert);
            xmlOperatorService.updateTypeAllow(StringContext.INTERNAL, appName, false);
            xmlOperatorService.saveDBTypeTable(type,typeBase,typeDB,typeTable,tableFields);
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"数据库同步","数据库同步目标端表集合"+_operate+"表属性成功");
            msg = _operate+"成功,点击[确定]返回列表";
        } catch (Exception e){
            logger.error("数据库同步",e);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(), "数据库同步", "数据库同步目标端表集合" + _operate + "表属性失败");
            msg = _operate+"失败";
        }
        String json = "{success:true,msg:'"+msg+"'}";
        actionBase.actionEnd(response,json,result);
        return null;
    }

    public String deleteTargetTable() throws IOException {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result = actionBase.actionBegin(request);
        String msg = null;
        try{
            xmlOperatorService.updateTypeAllow(StringContext.INTERNAL, appName, false);
            msg = xmlOperatorService.deleteTypeSrcTable(typeXml, appName, tableNames);
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"数据库同步","数据库同步目标端表集合删除操作成功");
        } catch (Exception e){
            logger.error("数据库同步",e);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(), "数据库同步", "数据库同步目标端端表集合删除表失败");
            msg = "删除失败";
        }
        String json = "{success:true,msg:'"+msg+"'}";
        actionBase.actionEnd(response,json,result);
        return null;
    }

    public String readTargetDBNamesInXml() throws IOException {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result = actionBase.actionBegin(request);
        String json = null;
        try{
            json = xmlOperatorService.readThisTargetDBNames(start, limit, typeXml, srcTableName, appName);
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"数据库同步","数据库同步应用"+appName+"目标端读取修改时"+srcTableName+"表下属性列表成功");
        } catch (Exception e){
            logger.error("数据库同步", e);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(),"数据库同步","数据库同步应用"+appName+"目标端读取修改时"+srcTableName+"表下属性列表失败");
        }
        actionBase.actionEnd(response,json,result);
        return null;
    }

    public String deleteTargetDB() throws IOException {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result = actionBase.actionBegin(request);
        String msg = null;
        try{
            xmlOperatorService.deleteTypeTargetDB(typeXml,appName,srcTableName,targetDBs);
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"数据库同步","数据库同步目标端表集合表"+srcTableName+"下的表删除操作成功");
            msg = "删除成功,点击[确定]返回列表";
        } catch (Exception e){
            logger.error("数据库同步",e);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(), "数据库同步", "数据库同步目标端端表集合表" + srcTableName + "下的表删除表失败");
            msg = "删除失败";
        }
        String json = "{success:true,msg:'"+msg+"'}";
        actionBase.actionEnd(response,json,result);
        return null;
    }

    public String saveTargetDB() throws IOException {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result = actionBase.actionBegin(request);
        String msg = null;
        try{
            xmlOperatorService.saveTypeTargetDB(typeXml, appName, srcTableName, targetDBs);
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"数据库同步","数据库同步目标端表集合表"+srcTableName+"下的表新增操作成功");
            msg = "保存成功,点击[确定]返回列表";
        } catch (Exception e){
            logger.error("数据库同步",e);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(), "数据库同步", "数据库同步目标端端表集合表" + srcTableName + "下的表新增表失败");
            msg = "保存失败";
        }
        String json = "{success:true,msg:'"+msg+"'}";
        actionBase.actionEnd(response,json,result);
        return null;
    }

    public String readTargetDBKeyValue() throws IOException {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result = actionBase.actionBegin(request);
        String json = null;
        try{
            json = dataBaseService.readInternalDBKeyValue(dbName);
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"数据库同步","数据库同步应用"+appName+"目标端读取修改时"+dbName+"数据源下表名列表成功");
        } catch (Exception e){
            logger.error("数据库同步", e);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(),"数据库同步","数据库同步应用"+appName+"目标端读取修改时"+dbName+"数据源下表名列表失败");
        }
        actionBase.actionEnd(response,json,result);
        return null;
    }

    public String readTargetTableNamesInXml() throws IOException {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result = actionBase.actionBegin(request);
        String json = null;
        try{
            json = xmlOperatorService.readThisTargetTableNames(start, limit, typeXml, srcTableName, targetDB, appName);
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"数据库同步","数据库同步应用"+appName+"目标端读取修改时"+srcTableName+"源表对应的目标数据库"+targetDB+"下的表名列表成功");
        } catch (Exception e){
            logger.error("数据库同步", e);
            logService.newLog("ERROR",SessionUtils.getAccount(request).getUserName(),"数据库同步","数据库同步应用"+appName+"目标端读取修改时"+srcTableName+"源表对应的目标数据库"+targetDB+"下的表名列表失败");
        }
        actionBase.actionEnd(response,json,result);
        return null;
    }

    public String deleteTargetTableName() throws IOException {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result = actionBase.actionBegin(request);
        String msg = null;
        try{
            msg = xmlOperatorService.deleteTypeTargetTable(typeXml,appName,srcTableName,targetDB,tableNames);
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"数据库同步","数据库同步应用"+appName+"目标端删除"+srcTableName+"源表对应的目标数据库"+targetDB+"下的表成功");
            msg = "删除成功,点击[确定]返回列表";
        } catch (Exception e){
            logger.error("数据库同步",e);
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(), "数据库同步", "数据库同步应用" + appName + "目标端删除" + srcTableName + "源表对应的目标数据库" + targetDB + "下的表失败");
            msg = "删除失败";
        }
        String json = "{success:true,msg:'"+msg+"'}";
        actionBase.actionEnd(response,json,result);

        return null;
    }

    public String saveTargetTableName() throws IOException {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result = actionBase.actionBegin(request);
        String msg = null;
        try{
            xmlOperatorService.saveTypeTargetTableName(typeXml,appName,srcTableName,targetDB,tableNames);
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"数据库同步","数据库同步应用"+appName+"目标端新增"+srcTableName+"源表对应的目标数据库"+targetDB+"下的表成功");
            msg = "新增成功,点击[确定]返回列表";
        } catch (Exception e){
            logger.error("数据库同步",e);
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(), "数据库同步", "数据库同步应用" + appName + "目标端新增" + srcTableName + "源表对应的目标数据库" + targetDB + "下的表失败");
            msg = "新增失败";
        }
        String json = "{success:true,msg:'"+msg+"'}";
        actionBase.actionEnd(response,json,result);
        return null;
    }

    public String readTargetTableAttribute() throws IOException {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result = actionBase.actionBegin(request);
        String json = null;
        try{
            json = xmlOperatorService.readThisTargetTableAttribute(typeXml, srcTableName, targetDB, targetTable, appName);
            logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"数据库同步","数据库同步应用"+appName+"目标端读取修改时"+srcTableName+"源表对应的目标数据库"+targetDB+"下的表名为"+targetTable+"的属性成功");
        } catch (Exception e){
            logger.error("数据库同步", e);
            logService.newLog("ERROR",SessionUtils.getAccount(request).getUserName(),"数据库同步","数据库同步应用"+appName+"目标端读取修改时"+srcTableName+"源表对应的目标数据库"+targetDB+"下的表名为"+targetTable+"的属性失败");
        }
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

    public String[] getDests() {
        return dests;
    }

    public void setDests(String[] dests) {
        this.dests = dests;
    }

    public String[] getTarget_is_pks() {
        return target_is_pks;
    }

    public void setTarget_is_pks(String[] target_is_pks) {
        this.target_is_pks = target_is_pks;
    }

    public boolean isDeleteEnable() {
        return deleteEnable;
    }

    public void setDeleteEnable(boolean deleteEnable) {
        this.deleteEnable = deleteEnable;
    }

    public boolean isOnlyInsert() {
        return onlyInsert;
    }

    public void setOnlyInsert(boolean onlyInsert) {
        this.onlyInsert = onlyInsert;
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

    public String getSrcTableName() {
        return srcTableName;
    }

    public void setSrcTableName(String srcTableName) {
        this.srcTableName = srcTableName;
    }

    public String[] getTargetDBs() {
        return targetDBs;
    }

    public void setTargetDBs(String[] targetDBs) {
        this.targetDBs = targetDBs;
    }

    public String getTargetDB() {
        return targetDB;
    }

    public void setTargetDB(String targetDB) {
        this.targetDB = targetDB;
    }

    public String getTargetTable() {
        return targetTable;
    }

    public void setTargetTable(String targetTable) {
        this.targetTable = targetTable;
    }

    public String getSourceTableName() {
        return sourceTableName;
    }

    public void setSourceTableName(String sourceTableName) {
        this.sourceTableName = sourceTableName;
    }

    public String getSourceDBName() {
        return sourceDBName;
    }

    public void setSourceDBName(String sourceDBName) {
        this.sourceDBName = sourceDBName;
    }

    public String getTargetTableName() {
        return targetTableName;
    }

    public void setTargetTableName(String targetTableName) {
        this.targetTableName = targetTableName;
    }

    public String getTargetDBName() {
        return targetDBName;
    }

    public void setTargetDBName(String targetDBName) {
        this.targetDBName = targetDBName;
    }
}
