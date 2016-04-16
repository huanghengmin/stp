package com.hzih.stp.dao;

import com.hzih.stp.entity.*;
import com.inetec.common.config.stp.nodes.*;
import com.inetec.common.config.stp.nodes.Channel;
import com.inetec.common.exception.Ex;

import java.util.List;
import java.util.Map;

public interface XmlOperatorDAO {

	public String[] readJdbcName(String typeXml) throws Ex;

	public List<Jdbc> getInternalJdbc() throws Ex;
	
	public List<Jdbc> getExternalJdbc() throws Ex;

	public List<Table> getInternalTypeTable(String appName, String type) throws Ex;
	
	public List<Table> getExternalTypeTable(String appName, String type) throws Ex;

	public void saveProxyType(TypeBase typeBase, TypeSafe typeSafe, TypeData typeData) throws Ex;

	public boolean deleteInternalTypeByName(String appName) throws Ex;

	public boolean deleteExternalTypeByName(String appName) throws Ex;

	public boolean isExistExternalType(String appName) throws Ex;

	public boolean isExistInternalType(String appName) throws Ex;

	public String[] getExternalProxyIp(String appName) throws Ex;

	public String[] getInternalProxyIp(String appName) throws Ex;

	public void saveExternalProxyIp(String appName, String ip) throws Ex;

	public void saveInternalProxyIp(String appName, String ip) throws Ex;

	public Jdbc getJdbcByName(String typeXml,String dbName) throws Ex;

	public Jdbc getExternalJdbcByName(String dbName) throws Ex;

	public Jdbc getInternalJdbcByName(String dbName) throws Ex;

	public void saveDBType(TypeBase typeBase, TypeDB typeDB) throws Ex;

	public void saveDBTypeTable(String type, TypeBase typeBase, TypeDB typeDB, TypeTable typeTable, Field[] tableFields) throws Ex;

	public void updateDBTypeTable(String type, TypeBase typeBase, TypeDB typeDB, TypeTable typeTable, Field[] tableFields) throws Ex;

	public List<String> deleteJdbcByName(String[] jdbcNameArray, String typeXml) throws Ex;

	public void saveJdbc(Jdbc jdbc, Boolean privated) throws Ex;

	public void updateJdbc(Jdbc jdbc, Boolean privated) throws Ex;

	public String[] getExternalSourceTableName(String appName) throws Ex;
	
	public String[] getInternalSourceTableName(String appName) throws Ex;

	public String[] getJdbcName(String typeXml, String appName) throws Ex;

	public void saveDBTargetName(String typeXml, String appName, String[] targetdbNames) throws Ex;

	public List<Field> getExternalTypeFields(String appName, String dbName, String tableName) throws Ex;
	
	public List<Field> getInternalTypeFields(String appName, String tableName) throws Ex;

	public void saveDBTypeMergeTable(TypeBase typeBase, TypeDB typeDB, TypeTable typeTable, String[] merge_table_names, Map<String, MergeField[]> mergeTable) throws Ex;

	public void updateDBTypeTargetApp(TypeBase typeBase) throws Ex;

	public void updateDBTypeSourceApp(TypeBase typeBase) throws Ex;

	public void updateDBTypeSourceData(TypeBase typeBase, TypeDB typeDB) throws Ex;

	public String[] readSourceTableNames(String typeXml, String appName) throws Ex;

	public String[] readTargetTableNames(String typeXml, String appName) throws Ex;

	public void updateDBTypeFields(TypeBase typeBase, String dbName, TypeTable typeTable, String[] fields, String[] is_pks) throws Ex;

	public String[] readThisTargetDBNames(String typeXml, String srcTableName, String appName)throws Ex;

	public String[] readThisTargetTableNames(String typeXml, String srcTableName, String targetDB, String appName) throws Ex;

	public List<Field> getThisTargetTableField(String typeXml, String appName, String sourceDBName, String sourceTableName, String targetDBName, String targetTableName) throws Ex;

	public void updateDBTypeTargetFields(TypeBase typeBase, TypeTable typeTable, String[] fields, String[] is_pks) throws Ex;

	public Map<String, List<MergeField>> getThisMergeTableField(String typeXml, String appName, String tableName) throws Ex;

	public boolean deleteTypeMergeTable(String typeXml, String appName, String[] tableNames) throws Ex;

	public boolean deleteTypeSourceTable(String typeXml, String appName, String dbName, String[] tableNames) throws Ex;

    public boolean deleteTypeSourceTableBackUp(String typeXml, String appName, String dbName, String tableName) throws Ex;

	public boolean deleteTypeSrcTable(String typeXml, String appName, String[] tableNames) throws Ex;

	public boolean deleteDBTypeFields(String typeXml, String appName,String dbName, String tableName, String[] fields) throws Ex;

	public Table readSourceTable(String typeXml, String appName,String dbName, String tableName) throws Ex;
	
	public Field readSourceField(String typeXml, String appName, String dbName,String tableName, String fieldName) throws Ex;

	public void saveTypeTargetDB(String typeXml, String appName, String srcTableName, String[] targetDBs) throws Ex;

	public void deleteTypeTargetDB(String typeXml, String appName, String srcTableName, String[] targetDBs) throws Ex;

	public boolean deleteTypeTargetTable(String typeXml, String appName, String srcTableName, String targetDB, String[] targetTableNames) throws Ex;

	public void saveTypeTargetTableName(String typeXml, String appName, String srcTableName, String targetDB, String[] targetTableNames) throws Ex;

	public Table getThisTargetTable(String typeXml, String appName, String srcTableName, String targetDB, String targetTable) throws Ex;

	public String[] readTypeName(String typeXml, String appType) throws Ex;

	public boolean isInternalTwowayApp(String appName) throws Ex;

	public boolean isExternalTwowayApp(String appName) throws Ex;

	public boolean isExistInternalTypeS(String appName) throws Ex;
	
	public boolean isExistExternalTypeS(String appName) throws Ex;

    public boolean isExistInternalTypeDescT(String appDesc) throws Ex;

	public boolean isExistExternalTypeDescS(String appDesc) throws Ex;

	public DataBase getDataBase(String typeXml, String appName) throws Ex;

    public Map<Integer, Map<Integer, Map<String,Object>>> readProxyType(String appType) throws Ex;

	public void saveFileType(TypeBase typeBase, TypeFile typeFile) throws Ex;

	public void updateFileType(TypeBase typeBase, TypeFile typeFile) throws Ex;

	public List<Type> getTypes(String xmlType, String appType) throws Ex;

	public List<Type> getTypes(String xmlType, String appType,boolean isAllow) throws Ex;

	public SourceFile getSourceFiles(String xmlType, String appName)throws Ex;

	public TargetFile getTargetFiles(String xmlType, String appName)throws Ex;

	public SocketChange getSocketChange(String xmlType, String pluginType, String appName)throws Ex;

	public String getSrcdbName(String xmlType, String appName) throws Ex;

    public Type readInternalProxyType(String appName, String proxyType) throws Ex;

    public Type readExternalProxyType(String appName, String proxyType) throws Ex;

    public Type getInternalTypeByName(String appName) throws Ex;

    public Type getExternalTypeByName(String appName) throws Ex;

    public void saveInternalProxyBlackIpMac(String appName, IpMac[] ipMacs) throws Ex;

    public void saveExternalProxyBlackIpMac(String appName, IpMac[] ipMacs) throws Ex;

    public void saveInternalProxyWhiteIpMac(String appName, IpMac[] ipMacs) throws Ex;

    public void saveExternalProxyWhiteIpMac(String appName, IpMac[] ipMacs) throws Ex;

    public void deleteInternalProxyBlackIpMac(String appName, IpMac[] ipMacs) throws Ex;

    public void deleteExternalProxyBlackIpMac(String appName, IpMac[] ipMacs) throws Ex;

    public void deleteInternalProxyWhiteIpMac(String appName, IpMac[] ipMacs) throws Ex;

    public void deleteExternalProxyWhiteIpMac(String appName, IpMac[] ipMacs) throws Ex;

    public void updateInternalProxyBlackIpMac(String appName, IpMac ipMac, String oldUpdateIp) throws Ex;

    public void updateExternalProxyBlackIpMac(String appName, IpMac ipMac, String oldUpdateIp) throws Ex;

    public void updateInternalProxyWhiteIpMac(String appName, IpMac ipMac, String oldUpdateIp) throws Ex;

    public void updateExternalProxyWhiteIpMac(String appName, IpMac ipMac, String oldUpdateIp) throws Ex;

    /**
     * 更新根节点属性desc
     * @param pathFile
     * @param text
     * @throws Ex
     */
    public void updateDescription(String pathFile, String text) throws Ex;

    /**
     * 修改通用代理应用的安全属性
     * @param typeBase
     * @param typeSafe
     * @throws Ex
     */
    public void updateProxyTypeSafe(TypeBase typeBase, TypeSafe typeSafe) throws Ex;

    /**
     * 修改通用代理应用的应用属性和数据属性
     * @throws Ex
     * @param typeBase
     * @param typeData
     */
    public void updateProxyType(TypeBase typeBase, TypeData typeData) throws Ex;

    /**
     * 读取根节点的描述信息
     * @param type
     * @return
     * @throws Ex
     */
    public String readRootDesc(String type,String fileName) throws Ex;

    /**
     * 修改应用的isactive节点
     *
     * @param typeXml
     * @param appName
     *@param isActive  @throws Ex
     */
    public void updateTypeActive(String typeXml, String appName, boolean isActive) throws Ex;

    /**
     * 修改应用的infolevel、isfilter、isvirusscan节点
     * @param typeBase
     * @throws Ex
     */
    public void updateSecurityFile(TypeBase typeBase) throws Ex;

    /**
     * 修改应用的 infolevel、isfilter、isvirusscan节点
     * @param typeBase
     * @throws Ex
     */
    public void updateSecurityDB(TypeBase typeBase) throws Ex;

    /**
     * 修改应用的 infolevel、isfilter、isvirusscan、clientauthenable、authca、authaddress、authpass、authport、ipfilter 、ipblacklist、ipwhitelist和ipaddress节点
     * @param typeBase
     * @param typeSafe
     * @throws Ex
     */
    public void updateSecurityProxy(TypeBase typeBase, TypeSafe typeSafe) throws Ex;

    /**
     * 按类型查找所有应用名
     * @param plugin
     * @param appType
     * @return
     * @throws Ex
     */
    public String[] readTypeNameSingle(String plugin, String appType) throws Ex;

    /**
     * 查找所有应用
     * @param plugin
     * @return
     * @throws Ex
     */
    public List<Type> readTypes(String plugin) throws Ex;

    public List<Channel> readChannel() throws Ex;

    public void updateChannel(Boolean privated, List<Channel> channels) throws Ex;

    public void updateChannelCount(Boolean privated, String count) throws Ex;

    /**
     * ExternalXml 中的应用中channelport 是否已经使用
     * @param channelPort
     * @return
     */
    boolean isExistExternalChannelPort(int channelPort) throws Ex;

    public void updateTypeAppSend(String appName, int status) throws Ex;

    public List<Type> readTypeNameForBusiness(String xmlType) throws Ex;

    public IChangeUtils getIChangeUtils() throws Ex;

    public void updateChangeUtils(ChannelIChangeUtils channelIChangeUtils) throws Ex;

    public void saveRestartTime(String time) throws Ex;

    public String[] getSNMPClient() throws Ex;

    public String[] getSysLogClient() throws Ex;

    public void saveSNMPClient(String ip) throws Ex;

    public void saveSysLogClient(String ip) throws Ex;

    public void deleteSNMPClient(String ip) throws Ex;

    public void deleteSysLogClient(String ip) throws Ex;

    public void updateSNMPClient(String snmpclient, String oldSNMPClient) throws Ex;

    public void updateSysLogClient(String syslogclient, String oldSysLogClient) throws Ex;

    public void updateTypeAllow(String plugin, String appName, boolean allow) throws Ex;

    /**
     * 全表同步、删除同步或时间标记同步 修改成为 触发同步
     * @throws Ex
     */
    public void updateEntirelyDeleteTimeSyncToTrigger(TypeBase typeBase,TypeDB typeDB) throws Ex;

    /**
     * 触发同步 修改成为 全表同步、删除同步或时间标记同步
     * @throws Ex
     */
    public void updateTriggerToEntirelyDeleteTimeSync(TypeBase typeBase,TypeDB typeDB) throws Ex;

    /**
     * 全表同步、删除同步或时间标记同步 修改成为 标记同步
     * @throws Ex
     */
    public void updateEntirelyDeleteTimeSyncToFlag(TypeBase typeBase,TypeDB typeDB) throws Ex;

    /**
     * 标记同步 修改成为 全表同步、删除同步或时间标记同步
     * @throws Ex
     */
    public void updateFlagToEntirelyDeleteTimeSync(TypeBase typeBase,TypeDB typeDB) throws Ex;

    /**
     * 标记同步 修改成为 触发同步
     * @throws Ex
     */
    public void updateFlagToTrigger(TypeBase typeBase,TypeDB typeDB) throws Ex;

    /**
     * 触发同步 修改成为 标记同步
     * @throws Ex
     */
    public void updateTriggerToFlag(TypeBase typeBase,TypeDB typeDB) throws Ex;

    /**
     * 其他修改成为触发同步
     *
     * @param typeBase
     * @param typeDB
     * @param operateDB
     * @throws Ex
     */
    public void updateToTrigger(TypeBase typeBase, TypeDB typeDB, boolean operateDB) throws Ex;

    /**
     * 触发同步修改成为其他
     *
     * @param typeBase
     * @param typeDB
     * @param operateDB
     * @throws Ex
     */
    public void updateTriggerTo(TypeBase typeBase, TypeDB typeDB, boolean operateDB) throws Ex;

    /**
     * 读取显示用的所有源表集合
     *
     * @param typeXml
     * @param appName
     * @param dbName
     * @return
     */
    public List readSourceTables(String typeXml, String appName, String dbName) throws Ex;

    /**
     * 源端应用修改数据源
     * 1.新增 dbName 数据源,database标签内容不变,tables标签内的都删除
     * 2.改变 dbNameOld 数据源的状态为删除,
     * @param typeBase     应用信息
     * @param dbName       修改后数据源
     * @param dbNameOld    修改前数据源
     * @throws Ex
     */
    public void updateDBName(TypeBase typeBase, String dbName, String dbNameOld) throws Ex;

    /**
     * 获取所有database
     * @param typeXml
     * @param appName
     * @return
     * @throws Ex
     */
    public List<DataBase> getDataBases(String typeXml, String appName)throws Ex;

    /**
     * 删除database
     * @param typeXml  内外网
     * @param appName  应用名
     * @param dbName database 的 name
     * @throws Ex
     */
    public void deleteDataBase(String typeXml, String appName, String dbName) throws Ex;

    /**
     * 获取应用appName下dbName中的所有表格信息
     * @param typeXml
     * @param appName  应用编号
     * @param dbName   database名
     * @return
     * @throws Ex
     */
    public List<Table> getTypeTables(String typeXml, String appName, String dbName) throws Ex;

    /**
     * 修改表
     * @param typeXml
     * @param appName
     * @param dbName
     * @param table
     * @throws Ex
     */
    public void updateSourceTable(String typeXml, String appName, String dbName, Table table) throws Ex;

    /**
     * 获取源端 表的字段
     * @param typeXml
     * @param appName
     * @param dbName
     * @param tableTame
     * @return
     * @throws Ex
     */
    public List<Field> getSourceFields(String typeXml, String appName, String dbName, String tableTame) throws Ex;

    /**
     * 修改源端数据库
     *
     * @param typeXml
     * @param appName
     * @param dataBase
     * @throws Ex
     */
    public void updateDataBase(String typeXml, String appName, DataBase dataBase) throws Ex;

    /**
     * 取得 xmlPath配置文件中的 临时表列表,按数据源保存
     * @param xmlPath  文件名
     * @param appType 应用类型-数据库同步
     * @return
     * @throws Ex
     */
    public Map<String,List<String>> getTempTables(String xmlPath, String appType) throws Ex;

    /**
     * 删除源表
     * @param typeXml
     * @param appName
     * @param dbName
     * @param table
     * @throws Ex
     */
    public void deleteSourceTable(String typeXml, String appName, String dbName, Table table) throws Ex;

    /**
     * 修改目标端应用的源端数据源名,并且删除原先的表结构
     *
     * @param typeXml            内外网区分
     * @param appName            应用名
     * @param sourceDBNameOld   修改前数据源名称
     * @param sourceDBName      修改后数据源名称
     * @return
     */
    public void updateTargetSourceDBName(String typeXml, String appName, String sourceDBNameOld, String sourceDBName) throws Ex;

    /**
     *
     * @param privated
     * @param jdbcName
     * @return
     * @throws Ex
     */
    public boolean getJdbcsByName(boolean privated, String jdbcName) throws Ex;

    public void setDataBaseDelete(String appName, String plugin) throws Ex;

    public Field getSourceFile(String typeXml, String appName, String dbName, String tableName, String fieldName) throws Ex;

    /**
     * 查找所有启动的外网应用
     * @param typeXml
     * @param b
     * @return
     * @throws Ex
     */
    public String[] getTypesByActive(String typeXml, boolean b) throws Ex;
}
