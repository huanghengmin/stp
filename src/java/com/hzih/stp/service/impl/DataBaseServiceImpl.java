package com.hzih.stp.service.impl;

import com.hzih.stp.dao.XmlOperatorDAO;
import com.hzih.stp.dao.impl.XmlOperatorDAOImpl;
import com.hzih.stp.service.DataBaseService;
import com.hzih.stp.utils.StringContext;
import com.hzih.stp.utils.StringUtils;
import com.inetec.common.config.stp.nodes.*;
import com.inetec.common.exception.Ex;
import com.inetec.ichange.console.config.Constant;
import com.inetec.ichange.console.config.database.DBFactory;
import com.inetec.ichange.console.config.database.IDataBase;
import com.inetec.ichange.console.config.utils.TriggerBean;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class DataBaseServiceImpl implements DataBaseService {
	private XmlOperatorDAO xmlOperatorDAO = new XmlOperatorDAOImpl();
	
	/**
	 *  读取external config.xml中jdbc对应的数据库表名
	 */
	public String readExternalDB(Integer start, Integer limit, String dbName, String appName) throws Ex {
		Jdbc jdbc = xmlOperatorDAO.getExternalJdbcByName(dbName);
        String[] sourceTableNames = xmlOperatorDAO.getExternalSourceTableName(appName);
		IDataBase db = DBFactory.getDataBase(jdbc, Constant.DB_INTERNAL);
		db.openConnection();
		String[] tableNames = db.getTableNames();
		db.closeConnection();
        tableNames = StringUtils.getArray(tableNames,sourceTableNames);
		int total = tableNames.length;
		String json = "{'success':true,'total':"+total+",'rows':[";
		if(total == 0){
			json +=",]}";
		}else {
			int index = 0;
			for (int i = 0; i < total; i++) {
				if(i==start&&index<limit){
					start ++;
					index ++;
					json +="{'tableName':'"+tableNames[i]+"','index':'1'},";
				}
			}
			json +="]}";
		}
		return json;
	}

	/**
	 *  读取internal config.xml中jdbc对应的数据库表名
	 */
	public String readInternalDB(Integer start, Integer limit, String dbName) throws Ex {
		Jdbc jdbc = xmlOperatorDAO.getInternalJdbcByName(dbName);
		IDataBase db = DBFactory.getDataBase(jdbc, Constant.DB_INTERNAL);
		db.openConnection();
		String[] tableNames = db.getTableNames();
		db.closeConnection();
		int total = tableNames.length;
		String json = "{'success':true,'total':"+total+",'rows':[";
		if(total == 0){
			json +=",]}";
		}else {
			int index = 0;
			for (int i = 0; i < total; i++) {
				if(i==start&&index<limit){
					start ++;
					index ++;
					json +="{'tableName':'"+tableNames[i]+"','index':'1'},";
				}
			}
			json +="]}";
		}
		return json;
	}

	public String readTableField(Integer start, Integer limit, String typeXml, String tableName, String dbName) throws Ex {
		Jdbc jdbc = null;
		IDataBase db = null;
		if("external".equals(typeXml)){
			jdbc = xmlOperatorDAO.getExternalJdbcByName(dbName);
			db = DBFactory.getDataBase(jdbc, Constant.DB_INTERNAL);
		}else if("internal".equals(typeXml)){
			jdbc = xmlOperatorDAO.getInternalJdbcByName(dbName);
			db = DBFactory.getDataBase(jdbc, Constant.DB_INTERNAL);
		}
		db.openConnection();
		String[] fieldNames = db.getFieldNames(tableName);
		Map<String, Field> fields = new HashMap<String, Field>();
		for (int i = 0; i < fieldNames.length; i++) {
			Field field = new Field();
			field = db.getField(tableName, fieldNames[i]);
			fields.put(fieldNames[i], field);
		}
		db.closeConnection();
		int total = fieldNames.length;

		String json = "{'success':true,'total':"+total+",'rows':[";
		if(total==0){
			json += ",]}";
		}else{
//            int count = 0;
			for (int i = 0; i < fieldNames.length; i++) {
//                if(i == start && count < limit){
                    Field field = fields.get(fieldNames[i]);
                    json += "{'field':'"+fieldNames[i]+"','is_pk':'"+field.isPk()+"','is_null':'"+field.isNull()
                            +"','jdbc_type':'"+field.getJdbcType()+"','column_size':'"+field.getColumnSize()+
                            "','db_type':'"+field.getDbType()+"'},";
//                    count ++;
//                    start ++;
//                }
			}
			json +="]}";
		}
		return json;
	}
	
	@SuppressWarnings("unchecked")
	public String readTableFieldExist(Integer start, Integer limit, String typeXml, String appName, String tableName, String dbName) throws Ex {
		Jdbc jdbc = null;
		IDataBase db = null;
		if("external".equals(typeXml)){
			jdbc = xmlOperatorDAO.getExternalJdbcByName(dbName);
			db = DBFactory.getDataBase(jdbc, Constant.DB_INTERNAL);
		}else if("internal".equals(typeXml)){
			jdbc = xmlOperatorDAO.getInternalJdbcByName(dbName);
			db = DBFactory.getDataBase(jdbc, Constant.DB_INTERNAL);
			
		}
		db.openConnection();
		List<Field> fieldsInDB = db.getFields(tableName);
		db.closeConnection();
		int total = fieldsInDB.size();
		String json = "{'success':true,'total':"+total+",'rows':[";
		if(total==0){
			json += ",]}";
		}else{
//			int index = 0;
//            int count = 0;
            for(Field field : fieldsInDB){
//                if(index == start && count < limit){
                    Field f = xmlOperatorDAO.getSourceFile(typeXml,appName,dbName,tableName,field.getFieldName());
                    if(f!=null){
                        json += "{'field':'"+f.getFieldName()+"','is_pk':'"+f.isPk()+"','is_null':'"+f.isNull()+"','jdbc_type':'"+f.getJdbcType()+
                                  "','column_size':'"+f.getColumnSize()+"','db_type':'"+f.getDbType()+"',checked:true},";
                    } else {
                        json += "{'field':'"+field.getFieldName()+"','is_pk':'"+field.isPk()+"','is_null':'"+field.isNull()+"','jdbc_type':'"+field.getJdbcType()+
                                    "','column_size':'"+field.getColumnSize()+"','db_type':'"+field.getDbType()+"',checked:false},";
                    }
//                    count ++;
//                    start ++;
//                }
//                index ++;
            }
			json +="]}";
		}
		return json;
	}
	
	/**
	 * 读取可信应用的表名
	 */
	public String readExternalTargetDB(Integer start, Integer limit,String appName) throws Ex {
		String[] tableNames = xmlOperatorDAO.getInternalSourceTableName(appName);//读取对应的内网表名
		int total = tableNames.length;
		String json = "{'success':true,'total':"+total+",'rows':[";
		if(total == 0){
			json +=",]}";
		}else {
			int index = 0;
			for (int i = 0; i < total; i++) {
				if(i==start&&index<limit){
					start ++;
					index ++;
//					for (int j = 0; j < tableNames.length; j++) {
					json +="{'sourceTableName':'"+tableNames[i]+"','targetTableName':'','flag':''},";
//					}	
				}
			}
			json +="]}";
		}
		return json;
	}
	
	/**
	 * 读取非可信应用的表名
	 */
	public String readInternalTargetDB(Integer start, Integer limit,String appName) throws Ex {
//		String[] allSourceTableNames = xmlOperatorDAO.getExternalSourceTableName(appName);                         //所有源端表名
//        String[] srcTableNames = xmlOperatorDAO.readTargetTableNames(StringContext.INTERNAL,appName);    //已经保存的表
//        String[] tableNames = StringUtils.getArray(allSourceTableNames,srcTableNames);
        String[] tableNames = xmlOperatorDAO.getExternalSourceTableName(appName);                         //所有源端表名
        int total = tableNames.length;
		String json = "{'success':true,'total':"+total+",'rows':[";
		if(total == 0){
			json +=",]}";
		}else {
			int index = 0;
			for (int i = 0; i < total; i++) {
				if(i==start&&index<limit){
					start ++;
					index ++;
//					for (int j = 0; j < tableNames.length; j++) {
                    //TODO
						json +="{'sourceTableName':'"+tableNames[i]+"','targetTableName':'','flag':''},";
//					}	
				}
			}
			json +="]}";
		}
		return json;
	}
	
	public String readTargetTableField(String typeXml, String tableName, String dbName, String[] dests) throws Ex {
		Jdbc jdbc = null;
		IDataBase db = null;
		if("external".equals(typeXml)){
			jdbc = xmlOperatorDAO.getExternalJdbcByName(dbName);
			db = DBFactory.getDataBase(jdbc, Constant.DB_INTERNAL);
		}else if("internal".equals(typeXml)){
			jdbc = xmlOperatorDAO.getInternalJdbcByName(dbName);
			db = DBFactory.getDataBase(jdbc, Constant.DB_INTERNAL);
		}
		db.openConnection();
		String[] fieldNames = db.getFieldNames(tableName);
        fieldNames = StringUtils.getArray(fieldNames, dests);
		Map<String, Field> fields = new HashMap<String, Field>();
		for (int i = 0; i < fieldNames.length; i++) {
			Field field = db.getField(tableName, fieldNames[i]);
			fields.put(fieldNames[i], field);
		}
		db.closeConnection();
		int total = fieldNames.length;
		String json = "";
		if(total==0){
			json = "{'success':true,'total':0,'rows':[,]}";
		}else{
			for (int i = 0; i < fieldNames.length; i++) {
				Field field = fields.get(fieldNames[i]);
				/*if((setSplit(field.getJdbcType()).equals("date")&&setSplit(field.getDbType()).equals("date"))||(setSplit(field.getJdbcType()).equals("DATE")&&setSplit(field.getDbType()).equals("DATE"))){
					json += setJson(field);
					total += 3;
				}else if((setSplit(field.getJdbcType()).equals("TIMESTAMP")&&setSplit(field.getDbType()).equals("TIMESTAMP"))||(setSplit(field.getJdbcType()).equals("timestamp")&&setSplit(field.getDbType()).equals("timestamp"))){
					json += setJson(field);
					total += 3;
				}else if((setSplit(field.getJdbcType()).equals("TIMESTAMP")&&setSplit(field.getDbType()).equals("DATE"))||(setSplit(field.getJdbcType()).equals("timestamp")&&setSplit(field.getDbType()).equals("date"))){
					json += setJson(field);
					total += 3;
				}else if((setSplit(field.getJdbcType()).equals("DATE")&&setSplit(field.getDbType()).equals("TIMESTAMP"))||(setSplit(field.getJdbcType()).equals("date")&&setSplit(field.getDbType()).equals("timestamp"))){
					json += setJson(field);
					total += 3;
				}else{
					json += "{'key':'"+field.getFieldName()+"','value':'"+fieldValue(field)+"'},";
				}*/
                json += "{'key':'"+field.getFieldName()+"','value':'"+field.getFieldName()+"'},";
            }
//            json += "{key:'临时',value:''},";
			json = "{'success':true,'total':"+(total+1)+",'rows':["+json+"]}";
		}
		return json;
	}
	
	private String setJson(Field field){
		field.setJdbcType("date");
		field.setDbType("date");
		String json = "{'key':'"+field.getFieldName()+"(JDBC[date]DB[date])','value':'"+fieldValue(field)+"'},";
		field.setJdbcType("date");
		field.setDbType("timestamp");
		json += "{'key':'"+field.getFieldName()+"(JDBC[date]DB[timestamp])','value':'"+fieldValue(field)+"'},";
		field.setJdbcType("timestamp");
		field.setDbType("date");
		json += "{'key':'"+field.getFieldName()+"(JDBC[timestamp]DB[date])','value':'"+fieldValue(field)+"'},";
		field.setJdbcType("timestamp");
		field.setDbType("timestamp");
		json += "{'key':'"+field.getFieldName()+"(JDBC[timestamp]DB[timestamp])','value':'"+fieldValue(field)+"'},";
		return json;
	}
	private String setSplit(String str) {
		String[] array = str.split("\\(");
		if(array.length>1){
			return array[0];
		}
		return str;
	}

	private String fieldValue(Field field) {
		String jdbcType = field.getJdbcType();
//		String fieldValue = ""+field.getFieldName()+";"+jdbcType+";"+field.getColumnSize()+";"+field.isNull()+";"+field.getDbType();
		String fieldValue = field.getFieldName();
		return fieldValue;
	}
	/**
	 * 读取数据库dbName中的表名组成一组keyValue
	 */
	public String readExternalDBKeyValue(String dbName) throws Ex {
		Jdbc jdbc = xmlOperatorDAO.getExternalJdbcByName(dbName);
		IDataBase db = DBFactory.getDataBase(jdbc, Constant.DB_INTERNAL);
		db.openConnection();
		String[] tableNames = db.getTableNames();
		db.closeConnection();
		int total = tableNames.length;
		String json = "{'success':true,'total':"+total+",'rows':[";
		if(total == 0){
			json +=",]}";
		}else {
			for (int i = 0; i < total; i++) {
				json += "{'key':'"+tableNames[i]+"','value':'"+tableNames[i]+"'},";
			}
			json +="]}";
		}
		return json;
	}
	
	/**
	 * 读取数据库dbName中的表名组成一组keyValue
	 */
	public String readInternalDBKeyValue(String dbName) throws Ex {
		Jdbc jdbc = xmlOperatorDAO.getInternalJdbcByName(dbName);
		IDataBase db = DBFactory.getDataBase(jdbc, Constant.DB_INTERNAL);
		db.openConnection();
		String[] tableNames = db.getTableNames();
		db.closeConnection();
		int total = tableNames.length;
		String json = "{'success':true,'total':"+total+",'rows':[";
		if(total == 0){
			json +=",]}";
		}else {
			for (int i = 0; i < total; i++) {
				json += "{'key':'"+tableNames[i]+"','value':'"+tableNames[i]+"'},";
			}
			json +="]}";
		}
		return json;
	}
	/**
	 * 读取字段名组成一组keyValue
	 */
	public String readDBFieldKeyValue(String typeXml, String tableName, String dbName) throws Ex {
		Jdbc jdbc = null;
		IDataBase db = null;
		if("external".equals(typeXml)){
			jdbc = xmlOperatorDAO.getExternalJdbcByName(dbName);
			db = DBFactory.getDataBase(jdbc, Constant.DB_INTERNAL);
		}else if("internal".equals(typeXml)){
			jdbc = xmlOperatorDAO.getInternalJdbcByName(dbName);
			db = DBFactory.getDataBase(jdbc, Constant.DB_INTERNAL);
		}
		
		db.openConnection();
		String[] fieldNames = db.getFieldNames(tableName);
		Map<String, Field> fields = new HashMap<String, Field>();
		for (int i = 0; i < fieldNames.length; i++) {
			Field field = new Field();
			field = db.getField(tableName, fieldNames[i]);
			fields.put(fieldNames[i], field);
		}
		db.closeConnection();
		int total = fieldNames.length;
		String json = "{'success':true,'total':"+total+",'rows':[";
		if(total==0){
			json += ",]}";
		}else{
			for (int i = 0; i < fieldNames.length; i++) {
				Field field = fields.get(fieldNames[i]);
				json += "{'key':'"+field.getFieldName()+"','value':'"+field.getFieldName()+"'},";
			}
			json +="]}";
		}
		return json;
	}
	/**
	 * 读取字段名组成一组keyValue
	 */
	public String readDBSurceFieldKeyValue(String typeXml, String tableName, String dbName) throws Ex {
		Jdbc jdbc = null;
		IDataBase db = null;
		if("external".equals(typeXml)){
			jdbc = xmlOperatorDAO.getExternalJdbcByName(dbName);
			db = DBFactory.getDataBase(jdbc, Constant.DB_INTERNAL);
		}else if("internal".equals(typeXml)){
			jdbc = xmlOperatorDAO.getInternalJdbcByName(dbName);
			db = DBFactory.getDataBase(jdbc, Constant.DB_INTERNAL);
		}
		db.openConnection();
		String[] fieldNames = db.getFieldNames(tableName);
		Map<String, Field> fields = new HashMap<String, Field>();
		for (int i = 0; i < fieldNames.length; i++) {
			Field field = new Field();
			field = db.getField(tableName, fieldNames[i]);
			fields.put(fieldNames[i], field);
		}
		db.closeConnection();
		int total = fieldNames.length;
		String json = "{'success':true,'total':"+total+",'rows':[";
		if(total==0){
			json += ",]}";
		}else{
			for (int i = 0; i < fieldNames.length; i++) {
				Field field = fields.get(fieldNames[i]);
				json += "{'key':'"+field.getFieldName()+"','value':'"+fieldValue(field)+"'},";
			}
			json +="]}";
		}
		return json;
	}
	
	/**
	 * 验证是否存在临时表
	 */
	public String checkTempTable(String typeXml, String tempTable, String dbName) throws Ex {
		Jdbc jdbc = null;
		String dblocal = null;
		if("external".equals(typeXml)){
			jdbc = xmlOperatorDAO.getExternalJdbcByName(dbName);
			dblocal = Constant.DB_INTERNAL;
		}else if("internal".equals(typeXml)){
			jdbc = xmlOperatorDAO.getInternalJdbcByName(dbName);
			dblocal = Constant.DB_INTERNAL;
		}
		IDataBase db = DBFactory.getDataBase(jdbc, dblocal);
		db.openConnection();
		String[] tableNames = db.getTableNames();
		db.closeConnection();
		int total = tableNames.length;
		String msg = null;
		for (int i = 0; i < total; i++) {
			if(tempTable.equals(tableNames[i])){
				msg = "该表名已经存在!";
				return msg;
			}
		}
		msg = "0000";
		return msg;
	}

    /**
     * 操作数据库  -- 修改
     * @param typeXml    区别内外网
     * @param appName    应用编号
     * @return
     * @throws Ex
     */
    public String operateDBUpdateApp(String typeXml, String appName) throws Ex {
        List<DataBase> list = xmlOperatorDAO.getDataBases(typeXml, appName);
        for (DataBase dataBase : list) {
            if(StringUtils.isNotBlank(dataBase.getStatus())){   //存在数据源状态 ,需要操作数据库
                if(dataBase.getStatus().equals(StringContext.DB_DELETE)){  //状态为删除
                    removeDataBase(typeXml, appName, dataBase);   //删除表结构
                    xmlOperatorDAO.deleteDataBase(typeXml, appName, dataBase.getDbName());//删除表记录
                } else {                                   //状态为修改或新增
                    editTables(typeXml,appName,dataBase);   //修改表记录
                }
            }
        }
        return "操作成功,点击[确定]返回列表!";
    }

    /**
     * 操作数据库  --  删除
     * @param typeXml
     * @param appName
     * @throws Ex
     */
    public void operateDBRemoveApp(String typeXml, String appName) throws Ex {
        List<DataBase> list = xmlOperatorDAO.getDataBases(typeXml, appName);
        for (DataBase dataBase : list) {
            removeDataBase(typeXml,appName,dataBase);
            if(StringUtils.isNotBlank(dataBase.getTempTableOld())){
                removeTempTableOld(typeXml,dataBase); //直接连接数据库,删除修改前的临时表,并且在配置文件中改变标签
            }
            if(StringUtils.isNotBlank(dataBase.getTempTable())){
                removeTempTable(typeXml, dataBase);
            }
        }
    }

    /**
     * 操作数据库  --  新增
     * @param typeXml
     * @param appName
     * @throws Ex
     */
    public void operateDBInsertApp(String typeXml, String appName) throws Ex {
        List<DataBase> list = xmlOperatorDAO.getDataBases(typeXml, appName);
        for (DataBase dataBase : list) {
            if(StringUtils.isNotBlank(dataBase.getTempTable())){
                createTempTable(typeXml, dataBase);
            }
            List<Table> tables = xmlOperatorDAO.getTypeTables(typeXml, appName, dataBase.getDbName());
            for (Table table : tables) {
                if(dataBase.getOperation().equals("trigger")){
                    addTrigger(typeXml, appName, dataBase, table);//添加触发器,并且在配置文件中添加上触发器名
                } else if(dataBase.getOperation().equals("flag")){
                    addFlag(typeXml,appName,dataBase.getDbName(),table);//在数据库中添加标记
                }
            }
        }
    }

    @Override
    public void operateDBUpdateApp(String typeXml) throws Ex {
        List<Type> list = xmlOperatorDAO.getTypes(typeXml, Type.s_app_db);
        for (Type type : list){
            operateDBUpdateApp(typeXml, type.getTypeName());
        }
    }

    @Override
    public void operateDBRemoveApp(String typeXml) throws Ex {
        List<Type> list = xmlOperatorDAO.getTypes(typeXml, Type.s_app_db);
        for (Type type : list){
            operateDBRemoveApp(typeXml, type.getTypeName());
        }
    }

    @Override
    public void operateDBInsertApp(String typeXml) throws Ex {
        List<Type> list = xmlOperatorDAO.getTypes(typeXml, Type.s_app_db);
        for (Type type : list){
            operateDBInsertApp(typeXml, type.getTypeName());
        }
    }

    /**
     * 删除 表结构触发器或者标记
     * @param typeXml
     * @param appName
     * @param dataBase
     */
    private void removeDataBase(String typeXml, String appName, DataBase dataBase) throws Ex {
        List<Table> list = xmlOperatorDAO.getTypeTables(typeXml, appName, dataBase.getDbName());
        for(Table table : list){
            if(StringUtils.isNotBlank(table.getDeleteTrigger())
                    ||StringUtils.isNotBlank(table.getUpdateTrigger())
                            ||StringUtils.isNotBlank(table.getInsertTrigger())){
                removeTriggerByNameInDB(typeXml,appName,dataBase,table);//直接连接数据库删除
            }
            if(StringUtils.isNotBlank(table.getFlag())){
                removeFlag(typeXml,appName,dataBase.getDbName(),table);
            }
        }
    }

    /**
     * 修改 表结构触发器或者标记
     * @param typeXml
     * @param appName
     * @param dataBase
     * @throws Ex
     */
    private void editTables(String typeXml, String appName, DataBase dataBase) throws Ex {
        String dbName = dataBase.getDbName();
        List<Table> list = xmlOperatorDAO.getTypeTables(typeXml, appName, dbName);
        if(StringUtils.isNotBlank(dataBase.getTempTableOld())){
            removeTempTableOld(typeXml,dataBase); //直接连接数据库,删除修改前的临时表,并且在配置文件中改变标签
            dataBase.setTempTableOld("");
        }
        if(StringUtils.isNotBlank(dataBase.getTempTable())){
            createTempTable(typeXml,dataBase);
        }
        for(Table table : list){
            if(table.getStatus().equals(StringContext.DB_DELETE)){
                if(StringUtils.isNotBlank(table.getFlag())){
                    removeFlag(typeXml,appName,dataBase.getDbName(),table);//删除数据库中的标记
                }
                if(StringUtils.isNotBlank(table.getDeleteTrigger())
                        ||StringUtils.isNotBlank(table.getUpdateTrigger())
                        ||StringUtils.isNotBlank(table.getInsertTrigger())){
                    removeTrigger(typeXml,appName,dataBase,table);//根据配置文件中的触发器名删除数据库中的触发器,并且去掉配置文件中的触发器名
                }
                xmlOperatorDAO.deleteSourceTable(typeXml,appName,dbName,table);
            }else{
                if(StringUtils.isNotBlank(table.getDeleteTrigger())
                        ||StringUtils.isNotBlank(table.getUpdateTrigger())
                        ||StringUtils.isNotBlank(table.getInsertTrigger())){
                    removeTrigger(typeXml,appName,dataBase,table);//根据配置文件中的触发器名删除数据库中的触发器,并且去掉配置文件中的触发器名
                }
                if(dataBase.getOperation().equals("trigger")){
                    addTrigger(typeXml, appName, dataBase, table);//添加触发器,并且在配置文件中添加上触发器名
                    if(StringUtils.isNotBlank(table.getFlag())){
                        removeFlag(typeXml,appName,dataBase.getDbName(),table);//删除数据库中的标记
                        table.setFlag("");
                    }
                } else if(dataBase.getOperation().equals("flag")){
                    addFlag(typeXml,appName,dataBase.getDbName(),table);//在数据库中添加标记
                } else {
                    if(StringUtils.isNotBlank(table.getFlag())){
                        removeFlag(typeXml,appName,dataBase.getDbName(),table);//删除数据库中的标记
                        table.setFlag("");
                    }
                }
                table.setStatus("");
                xmlOperatorDAO.updateSourceTable(typeXml,appName,dbName,table);
            }
        }
        dataBase.setStatus("");//去掉数据源的状态
        xmlOperatorDAO.updateDataBase(typeXml,appName,dataBase);//修改数据源并保存
    }

    /**
     * 删除标记同步生成的标记,并删除表中的标记记录<flag>flag</flag>
     * @param typeXml
     * @param appName
     * @param dbName
     * @param table
     * @throws Ex
     */
    private void removeFlag(String typeXml, String appName, String dbName, Table table) throws Ex {
        Jdbc jdbc = xmlOperatorDAO.getJdbcByName(typeXml, dbName);
        String[] tableNames = new String[1];
        tableNames[0] = table.getTableName();
        IDataBase iDataBase = DBFactory.getDataBase(jdbc, Constant.DB_INTERNAL);
        iDataBase.openConnection();
        iDataBase.removeFlag(tableNames);			//delete flag
        iDataBase.closeConnection();
    }

    /**
     * 新增标记 并记录标记名到标签<flag></flag>
     * @param typeXml
     * @param appName
     * @param dbName
     * @param table
     * @throws Ex
     */
    private void addFlag(String typeXml, String appName, String dbName, Table table) throws Ex {
        Jdbc jdbc = xmlOperatorDAO.getJdbcByName(typeXml, dbName);
        String[] tableNames = new String[1];
        tableNames[0] = table.getTableName();
        IDataBase iDataBase = DBFactory.getDataBase(jdbc, Constant.DB_INTERNAL);
        iDataBase.openConnection();
        iDataBase.createFlag(tableNames);
        iDataBase.closeConnection();
        table.setFlag(tableNames[0]);
        xmlOperatorDAO.updateSourceTable(typeXml,appName,dbName,table);
    }

    /**
     * 删除修改前的临时表
     * @param typeXml
     * @param dataBase
     */
    private void removeTempTableOld(String typeXml, DataBase dataBase) throws Ex {
        Jdbc jdbc = xmlOperatorDAO.getJdbcByName(typeXml, dataBase.getDbName());
        IDataBase iDataBase = DBFactory.getDataBase(jdbc, Constant.DB_INTERNAL);
        iDataBase.openConnection();
        iDataBase.removeTempTable(dataBase.getTempTableOld());
        if("ORACLE".equals(jdbc.getDbVender())){		//oracle sequence
        	iDataBase.removeSequence();
        }
        iDataBase.closeConnection();
    }

    /**
     * 新建临时表
     * 如果新临时表不存在,新建临时表
     * @param typeXml
     * @param dataBase
     */
    private void createTempTable(String typeXml, DataBase dataBase) throws Ex {
        Jdbc jdbc = xmlOperatorDAO.getJdbcByName(typeXml, dataBase.getDbName());
        IDataBase iDataBase = DBFactory.getDataBase(jdbc, Constant.DB_INTERNAL);
        iDataBase.openConnection();

        String[] tableNames = iDataBase.getTableNames();
        String tempTable = dataBase.getTempTable();
        boolean isExistTempTable = isExistTempTable(tempTable, tableNames);
        if(!isExistTempTable){
            iDataBase.createTempTable(tempTable);
            if("ORACLE".equals(jdbc.getDbVender())){		//oracle sequence
        		iDataBase.createSequence();
        	}
        }
        iDataBase.closeConnection();
    }
    /**
     * 删除临时表
     * 如果新临时表存在,删除临时表
     * @param typeXml
     * @param dataBase
     */
    private void removeTempTable(String typeXml, DataBase dataBase) throws Ex {
        Jdbc jdbc = xmlOperatorDAO.getJdbcByName(typeXml, dataBase.getDbName());
        IDataBase iDataBase = DBFactory.getDataBase(jdbc, Constant.DB_INTERNAL);
        iDataBase.openConnection();

        String[] tableNames = iDataBase.getTableNames();
        String tempTable = dataBase.getTempTable();
        boolean isExistTempTable = isExistTempTable(tempTable, tableNames);
        if(!isExistTempTable){
            iDataBase.removeTempTable(tempTable);
            if("ORACLE".equals(jdbc.getDbVender())){		//oracle sequence
        		iDataBase.removeSequence();
        	}
        }
        iDataBase.closeConnection();
    }

    /**
     * 查找 临时表是否存在于数据库
     * @param tempTable       临时表
     * @param tableNames      所有表
     * @return                  true:存在,false:不存在
     */
    private boolean isExistTempTable(String tempTable, String[] tableNames) {
        for (int i = 0; i < tableNames.length; i++) {
			if(tempTable.equals(tableNames[i])){
                return true;
			}
		}
        return false;
    }

    /**
     * 1.加触发器 返回触发器集合
     * 2.修改表中触发器名称
     * @param typeXml
     * @param appName
     * @param dataBase
     * @param table
     * @throws Ex
     */
    private void addTrigger(String typeXml, String appName, DataBase dataBase, Table table) throws Ex {
        Map<String,String> triggers = addTriggerInDB(typeXml,appName,dataBase,table);    //直接连接数据库添加触发器
        table.setStatus("");      //去掉状态
        String deleteTrigger = triggers.get("delete");
        String insertTrigger = triggers.get("insert");
        String updateTrigger = triggers.get("update");
        table.setDeleteTrigger(deleteTrigger==null?"":deleteTrigger);
        table.setInsertTrigger(insertTrigger==null?"":insertTrigger);
        table.setUpdateTrigger(updateTrigger==null?"":updateTrigger);
        xmlOperatorDAO.updateSourceTable(typeXml, appName, dataBase.getDbName(), table);
    }

    /**
     *  加触发器 返回触发器集合
     *
     * @param typeXml
     * @param appName
     *@param dataBase
     * @param table   @return
     * @throws Ex
     */
    private Map<String, String> addTriggerInDB(String typeXml, String appName, DataBase dataBase, Table table) throws Ex {
        Jdbc jdbc = xmlOperatorDAO.getJdbcByName(typeXml, dataBase.getDbName());
        String tempTable = dataBase.getTempTable();
        TriggerBean[] triggers = getTriggerBeans(typeXml,appName,dataBase,table);
        IDataBase iDataBase = DBFactory.getDataBase(jdbc, Constant.DB_INTERNAL);
        iDataBase.openConnection();
        Map<String, String> map = iDataBase.createTriggers(triggers, tempTable);  //创建触发器,并返回触发器的名称集合
        iDataBase.closeConnection();
        return map;
    }

    /**
     * 根据配置文件中的触发器名删除数据库中的触发器,并且去掉配置文件中的触发器名
     * @param typeXml
     * @param appName
     * @param dataBase
     * @param table
     */
    private void removeTrigger(String typeXml, String appName, DataBase dataBase, Table table) throws Ex {
        removeTriggerByNameInDB(typeXml,appName,dataBase,table);//直接连接数据库删除
        table.setDeleteTrigger("");
        table.setInsertTrigger("");
        table.setUpdateTrigger("");
        xmlOperatorDAO.updateSourceTable(typeXml, appName, dataBase.getDbName(), table);

    }


    /**
     * 删除触发器
     * @param typeXml
     * @param appName
     * @param dataBase
     * @param table
     */
    private void removeTriggerByNameInDB(String typeXml, String appName, DataBase dataBase, Table table) throws Ex {
        Jdbc jdbc = xmlOperatorDAO.getJdbcByName(typeXml, dataBase.getDbName());
        IDataBase iDataBase = DBFactory.getDataBase(jdbc, Constant.DB_INTERNAL);
        iDataBase.openConnection();
        iDataBase.removeTriggerByName(table);//根据名字删除
        iDataBase.closeConnection();
    }

    /**
     * 获取建立 触发器 的信息
     * @param typeXml
     * @param appName
     * @param dataBase
     * @param table
     * @return
     * @throws Ex
     */
    public TriggerBean[] getTriggerBeans(String typeXml, String appName,DataBase dataBase,Table table) throws Ex {
		TriggerBean[] triggers = null;
		List<TriggerBean> triggersList = new ArrayList<TriggerBean>();
        String tableTame = table.getTableName();
        TriggerBean trigger = new TriggerBean();
        boolean monitorDelete = table.isMonitorDelete();
        boolean monitorUpdate = table.isMonitorUpdate();
        boolean monitorInsert = table.isMonitorInsert();
        List<String> pkFieldsList = new ArrayList<String>();
        List<Field> fields = xmlOperatorDAO.getSourceFields(typeXml, appName, dataBase.getDbName(), tableTame);
        for (Field field : fields) {
            if(field.isPk()){
                pkFieldsList.add(field.getFieldName());
            }
        }
        String[] pkFields = pkFieldsList.toArray(new String[pkFieldsList.size()]);
        if(monitorDelete){
            trigger.setMonitorDelete(monitorDelete);
        }
        if(monitorUpdate){
            trigger.setMonitorUpdate(monitorUpdate);
        }
        if(monitorInsert){
            trigger.setMonitorInsert(monitorInsert);
        }
        trigger.setPkFields(pkFields);
        trigger.setTableName(tableTame);
        triggersList.add(trigger);
        triggers = triggersList.toArray(new TriggerBean[triggersList.size()]);
        return triggers;
	}

    /*public TriggerBean[] getTriggerBeans(String dblocal, String appName,String operation) throws Ex {
		TriggerBean[] triggers = null;
		List<TriggerBean> triggersList = new ArrayList<TriggerBean>();
    	if("trigger".equals(operation)){
    		List<Table> tables = null;
    		if("internal".equals(dblocal)){
    			tables = getInternalTypeTable(appName, "source");
    		}else if("external".equals(dblocal)){
    			tables = getExternalTypeTable(appName, "source");
    		}
    		for (Table table : tables) {
    			String tableName = table.getTableName();
    			TriggerBean trigger = new TriggerBean();
    			boolean monitorDelete = table.isMonitorDelete();
    			boolean monitorUpdate = table.isMonitorUpdate();
    			boolean monitorInsert = table.isMonitorInsert();
    			List<String> pkFieldsList = new ArrayList<String>();
    			List<Field> fields = new ArrayList<Field>();
    			if("internal".equals(dblocal)){
        			fields = getInternalTypeFields(appName, tableName);
        		}else if("external".equals(dblocal)){
        			fields = getExternalTypeFields(appName, tableName);
        		}

    			for (Field field : fields) {
					if(field.isPk()){
						pkFieldsList.add(field.getFieldName());
					}
				}
    			String[] pkFields = pkFieldsList.toArray(new String[pkFieldsList.size()]);
    			if(monitorDelete){
    				trigger.setMonitorDelete(monitorDelete);
    			}
    			if(monitorUpdate){
    				trigger.setMonitorUpdate(monitorUpdate);
    			}
    			if(monitorInsert){
    				trigger.setMonitorInsert(monitorInsert);
    			}
    			trigger.setPkFields(pkFields);
    			trigger.setTableName(tableName);
    			triggersList.add(trigger);
			}
    		triggers = triggersList.toArray(new TriggerBean[triggersList.size()]);
    	}
		return triggers;
	}

	public void deleteTableTriggerOrFlag(String operation,Jdbc jdbc,String dblocal,TriggerBean[] triggers,String tempTable,String[] tableNames) throws Ex {
		if("trigger".equals(operation)){
        	IDataBase iDataBase = DBFactory.getDataBase(jdbc, dblocal);
        	iDataBase.openConnection();
//        	if("ORACLE".equals(jdbc.getDbVender())){		//oracle sequence
//        		iDataBase.removeSequence();
//        	}
        	iDataBase.removeTrigger(triggers, tempTable);
//        	iDataBase.removeTempTable(tempTable);			//delete tempTable
        	iDataBase.closeConnection();
        }else if("flag".equals(operation)){
        	IDataBase iDataBase = DBFactory.getDataBase(jdbc, dblocal);
        	iDataBase.openConnection();
        	iDataBase.removeFlag(tableNames);			//delete flag
        	iDataBase.closeConnection();
        }
	}

	public void deleteTypeTableTriggerOrFlag(String operation,Jdbc jdbc,String dblocal,TriggerBean[] triggers,String tempTable,String[] tableNames) throws Ex {
		if("trigger".equals(operation)){
        	IDataBase iDataBase = DBFactory.getDataBase(jdbc, dblocal);
        	iDataBase.openConnection();
        	iDataBase.removeTrigger(triggers, tempTable);
        	iDataBase.removeTempTable(tempTable);			//delete tempTable
        	if("ORACLE".equals(jdbc.getDbVender())){		//oracle sequence
        		iDataBase.removeSequence();
        	}
        	iDataBase.closeConnection();
        }else if("flag".equals(operation)){
        	IDataBase iDataBase = DBFactory.getDataBase(jdbc, dblocal);
        	iDataBase.openConnection();
        	iDataBase.removeFlag(tableNames);			//delete flag
        	iDataBase.closeConnection();
        }
	}

        *//**
	 * 添加触发器或者标记
	 * @param typeBase
	 * @param typeDB
	 * @param tableFields
	 * @throws com.inetec.common.exception.Ex
	 *//*
	private void addTriggerOrFlag(TypeBase typeBase, TypeDB typeDB, Table table, Field[] tableFields) throws Ex {
		Jdbc jdbc = null;

		if(typeBase.getPrivated()){
			jdbc = getInternalJdbcByName(typeDB.getDbName());
		}else {
			jdbc = getExternalJdbcByName(typeDB.getDbName());
		}
		if("trigger".equals(typeDB.getOperation())){
			String dblocal = typeBase.getPrivated()?Constant.DB_INTERNAL:Constant.DB_INTERNAL;
			IDataBase iDataBase = DBFactory.getDataBase(jdbc, dblocal);
			String tableName = table.getTableName();
			String tempTable = typeDB.getTempTable();

			TriggerBean[] triggers = new TriggerBean[1];
			TriggerBean trigger = new TriggerBean();
			boolean monitorDelete = table.isMonitorDelete();
			boolean monitorUpdate = table.isMonitorUpdate();
			boolean monitorInsert = table.isMonitorInsert();
			List<String> pkFieldsList = new ArrayList<String>();
			for (int i = 0; i < tableFields.length; i++) {
				if(tableFields[i].isPk()){
					pkFieldsList.add(tableFields[i].getFieldName());
				}
			}
			String[] pkFields = pkFieldsList.toArray(new String[pkFieldsList.size()]);
			if(monitorDelete){
				trigger.setMonitorDelete(monitorDelete);
			}
			if(monitorUpdate){
				trigger.setMonitorUpdate(monitorUpdate);
			}
			if(monitorInsert){
				trigger.setMonitorInsert(monitorInsert);
			}
			trigger.setPkFields(pkFields);
			trigger.setTableName(tableName);
			triggers[0] = trigger;
			iDataBase.openConnection();
			iDataBase.createTrigger( triggers, tempTable);
			iDataBase.closeConnection();

		}else if("flag".equals(typeDB.getOperation())){
			//createFlag
			String dblocal = typeBase.getPrivated()?Constant.DB_INTERNAL:Constant.DB_INTERNAL;
			IDataBase iDataBase = DBFactory.getDataBase(jdbc, dblocal);
			String[] tableNames = new String[1];
			tableNames[0] = table.getTableName();
			iDataBase.openConnection();
			iDataBase.createFlag(tableNames);
			iDataBase.closeConnection();
		}

	}*/

}
