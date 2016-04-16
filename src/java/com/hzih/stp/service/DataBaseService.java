package com.hzih.stp.service;

import com.inetec.common.exception.Ex;

public interface DataBaseService {
	
	public String readInternalDB(Integer start, Integer limit, String dbName) throws Ex;

	public String readExternalDB(Integer start, Integer limit, String dbName, String appName) throws Ex;

	public String readTableField(Integer start, Integer limit, String typeXml, String tableName, String dbName) throws Ex;

	public String readTableFieldExist(Integer start, Integer limit, String typeXml, String appName, String tableName, String dbName) throws Ex;
	
	public String readInternalTargetDB(Integer start, Integer limit, String appName) throws Ex;

	public String readExternalTargetDB(Integer start, Integer limit, String appName) throws Ex;

	public String readTargetTableField(String typeXml, String tableName, String dbName, String[] dests) throws Ex;

	public String readInternalDBKeyValue(String dbName) throws Ex;
	
	public String readExternalDBKeyValue(String dbName) throws Ex;

	public String readDBFieldKeyValue(String typeXml, String tableName, String dbName) throws Ex;

	public String readDBSurceFieldKeyValue(String typeXml, String tableName, String dbName) throws Ex;

	public String checkTempTable(String typeXml, String tempTable, String dbName) throws Ex;

    /**
     * 操作应用对应的数据库--修改
     * @param typeXml    区别内外网
     * @param appName    应用编号
     * @return
     * @throws Ex
     */
    public String operateDBUpdateApp(String typeXml, String appName) throws Ex;

    /**
     * 操作应用对应的数据库--删除
     * @param typeXml
     * @param appName
     * @throws Ex
     */
    public void operateDBRemoveApp(String typeXml, String appName) throws Ex;

    /**
     * 操作应用对应的数据库--增加
     * @param typeXml
     * @param appName
     * @throws Ex
     */
    public void operateDBInsertApp(String typeXml,String appName) throws Ex;

    /**
     * 操作应用对应的数据库--修改 所有应用
     * @param typeXml
     * @throws Ex
     */
    public void operateDBUpdateApp(String typeXml) throws Ex;

    public void operateDBRemoveApp(String typeXml) throws Ex;

    public void operateDBInsertApp(String typeXml) throws Ex;
}
