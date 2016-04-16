package com.hzih.stp.service;

import com.hzih.stp.entity.*;

import com.inetec.common.config.stp.nodes.Field;
import com.inetec.common.config.stp.nodes.IpMac;
import com.inetec.common.config.stp.nodes.Jdbc;
import com.inetec.common.config.stp.nodes.Channel;
import com.inetec.common.exception.Ex;

import java.io.IOException;
import java.util.List;
import java.util.Map;

public interface XmlOperatorService {

    public String readRootDesc(String type,String fileName) throws Ex;

    /**
     * 更新根节点属性desc
     *
     *
     * @param pathFile
     * @param text
     * @throws Ex
     */
    public void updateDescription(String pathFile, String text) throws Ex;

    /**  JDBC 数据源 **/
    public String readExternalJdbc(Integer start, Integer limit) throws Ex;

    public String readInternalJdbc(Integer start, Integer limit) throws Ex;

    public String readJdbcName(String typeXml) throws Ex;

    public String deleteJdbcByName(String[] jdbcNameArray, String typeXml) throws Ex;

    public void saveJdbc(Jdbc jdbc, Boolean privated) throws Ex;

    public void updateJdbc(Jdbc jdbc, Boolean privated) throws Ex;

    public Jdbc getJdbc(TypeBase typeBase, String dbName) throws Ex;

    public boolean isExistJdbc(TypeBase typeBase, String dbName) throws Ex;

    public String checkJdbcName(String jdbcName, String typeXml) throws Ex;

    /**  应用查找  **/
    public String readExternalType(Integer start, Integer limit, String appType) throws Ex;

    public String readExternalType(Integer start, Integer limit, String appType,boolean isAllow) throws Ex;

    public String readInternalType(Integer start, Integer limit, String appType) throws Ex;

    public String readInternalType(Integer start, Integer limit, String appType,boolean isAllow) throws Ex;

    /**  根据应用编号appName检查应用是否已经存在  **/
    public String checkAppName(String typeXml, String appName) throws Ex;

    /**  根据应用名appDesc检查应用是否已经存在  **/
    public String checkAppDesc(String typeXml, String appDesc) throws Ex;


    /**
     * 配置管理员新增应用
     * @param typeBase
     * @param typeSafe
     * @param typeData
     * @throws Ex
     */
    public void saveProxyType(TypeBase typeBase, TypeSafe typeSafe, TypeData typeData) throws Ex;

    /**
     * 新增非可信源应用--校验应用名是否存在
     * @param appName
     * @return
     * @throws Ex
     */
    public String checkAppName(String appName) throws Ex;

    /**
     * 授权管理员新增代理应用的安全属性
     * @param typeBase
     * @param typeSafe
     */
    public void saveProxyTypeSafe(TypeBase typeBase, TypeSafe typeSafe) throws Ex;

    /**
     * 配置管理员修改代理应用的应用属性和数据属性
     * @param typeBase
     * @param typeData
     * @throws Ex
     */
    public void updateProxyType(TypeBase typeBase, TypeData typeData) throws Ex;

    /**
     * 授权管理员修改代理应用的安全属性
     * @param typeBase
     * @param typeSafe
     * @throws Ex
     */
    public void updateProxyTypeSafe(TypeBase typeBase, TypeSafe typeSafe) throws Ex;

    public String deleteInternalTypeByName(String appName, int i) throws Ex;

    public String deleteExternalTypeByName(String appName, int i) throws Ex;

    /***  proxy代理内的允许访问Ip  **/
    public String readExternalProxyIp(Integer start, Integer limit, String appName) throws Ex;

    public String readInternalProxyIp(Integer start, Integer limit, String appName) throws Ex;

    public String checkInternalProxyIp(String appName, String ip) throws Ex;

    public String checkExternalProxyIp(String appName, String ip) throws Ex;

    public void updateInternalProxyIp(String appName, String ip, String oldIp) throws Ex;

    public void updateExternalProxyIp(String appName, String ip, String oldIp) throws Ex;

    public String saveExternalProxyIp(String appName, String ip) throws Ex;

    public void deleteInternalProxyIp(String appName, String[] array) throws Ex;

    public void deleteExternalProxyIp(String appName, String[] array) throws Ex;

    public String saveInternalProxyIp(String appName, String ip) throws Ex;

    /**  代理应用的黑白名单   **/
    public String readInternalProxyBlackIpMac(Integer start, Integer limit, String appName, String proxyType) throws Ex;

    public String readExternalProxyBlackIpMac(Integer start, Integer limit, String appName, String proxyType) throws Ex;

    public String readInternalProxyWhiteIpMac(Integer start, Integer limit, String appName, String proxyType) throws Ex;

    public String readExternalProxyWhiteIpMac(Integer start, Integer limit, String appName, String proxyType) throws Ex;

    public String checkInternalProxyBlackIp(String appName, String ip) throws Ex;

    public String checkExternalProxyBlackIp(String appName, String ip) throws Ex;

    public String checkInternalProxyWhiteIp(String appName, String ip) throws Ex;

    public String checkExternalProxyWhiteIp(String appName, String ip) throws Ex;

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

    /**  代理应用端口映射   **/
    public String readProxyType(Integer start, Integer limit, String type) throws Ex;

    /**  文件同步  ***/
    public void saveFileType(TypeBase typeBase, TypeFile typeFile) throws Ex;

    public void updateFileType(TypeBase typeBase, TypeFile typeFile) throws Ex;

    /**   **/
    public String readExternalTypeTable(Integer start, Integer limit, String appName, String type) throws Ex;

    public String readInternalTypeTable(Integer start, Integer limit, String appName, String type) throws Ex;

    public void saveDBType(TypeBase typeBase, TypeDB typeDB) throws Ex;

    public void saveDBTypeTable(String type, TypeBase typeBase, TypeDB typeDB, TypeTable typeTable, Field[] tableFields) throws Ex;

    public void updateDBTypeTable(String type, TypeBase typeBase, TypeDB typeDB, TypeTable typeTable, Field[] tableFields) throws Ex;

    public void saveDBTargetName(String typeXml, String appName, String[] targetdbNames) throws Ex;

    public String readExternalFields(Integer start, Integer limit, String appName, String sourceDBName,
                                     String sourceTableName, String targetDBName, String targetTableName) throws Ex;

    public String readInternalFields(String appName, String tableName) throws Ex;

    public String readExternalFieldsExist(String appName, String tableName, String targetTable, String targetDB) throws Ex;

    public String readInternalFieldsExist(Integer start, Integer limit, String appName, String sourceDBName, String sourceTableName, String targetDBName, String targetTableName) throws Ex;

    public String readThisTableField(String typeXml, String tableName, String dbName) throws Ex;

    public void updateDBTypeSourceApp(TypeBase typeBase) throws Ex;

    public void updateDBTypeTargetApp(TypeBase typeBase) throws Ex;

    public void updateDBTypeSourceData(TypeBase typeBase, TypeDB typeDB) throws Ex;

    public String readTableNames(Integer start, Integer limit, String typeXml, String tables, String appName, String dbName) throws Ex;

    public void updateDBTypeFields(TypeBase typeBase, String dbName, TypeTable typeTable, String[] fields, String[] is_pks) throws Ex;

    public String readThisTargetDBNames(Integer start, Integer limit, String typeXml, String srcTableName, String appName) throws Ex;

    public String readThisTargetTableNames(Integer start, Integer limit, String typeXml, String srcTableName, String targetDB, String appName) throws Ex;

    public String readThisTargetTableField(String typeXml, String srcTableName, String targetDB, String targetTable, String appName) throws Ex;

    public String readThisTargetTableAttribute(String typeXml, String srcTableName, String targetDB, String targetTable, String appName) throws Ex;

    public void updateDBTypeTargetFields(TypeBase typeBase, TypeTable typeTable, String[] fields, String[] is_pks) throws Ex;

    public String deleteTypeSourceTable(String typeXml, String appName, String dbName, String[] tableNames) throws Ex;

    public String deleteTypeSourceTableBackUp(String typeXml, String appName, String dbName, String tableName) throws Ex;

    public String deleteTypeSrcTable(String typeXml, String appName, String[] tableNames) throws Ex;

    public String deleteDBTypeFields(String typeXml, String appName,String dbName, String tableName, String[] fields) throws Ex;

    public String readSourceTableAttribute(String typeXml, String appName, String dbName,String tableName) throws Ex;

    public void saveTypeTargetDB(String typeXml, String appName, String srcTableName, String[] targetDBs) throws Ex;

    public void deleteTypeTargetDB(String typeXml, String appName, String srcTableName, String[] targetDBs) throws Ex;

    public String deleteTypeTargetTable(String typeXml, String appName, String srcTableName, String targetDB, String[] targetTableNames) throws Ex;

    public void saveTypeTargetTableName(String typeXml, String appName, String srcTableName, String targetDB, String[] targetTableNames) throws Ex;

    public String readTargetTypeNameKeyValue(String typeXml, String appType) throws Ex;

    public void updateTypeActive(String typeXml, String appName, boolean isActive) throws Ex;

    /**
     * 设置文件同步应用的安全属性
     * @param typeBase
     * @throws Ex
     */
    public void updateSecurityFile(TypeBase typeBase) throws Ex;

    /**
     * 设置数据库同步应用的安全属性
     * @param typeBase
     * @throws Ex
     */
    public void updateSecurityDB(TypeBase typeBase) throws Ex;

    /**
     * 设置通用代理应用的安全属性
     * @param typeBase
     * @param typeSafe
     * @throws Ex
     */
    public void updateSecurityProxy(TypeBase typeBase, TypeSafe typeSafe) throws Ex;

    public String readTypeNameKeyValue(String plugin, String appType) throws Ex;

    /**
     * 获取通道信息
     * @return
     * @throws Ex
     */
    public String readChannel() throws Ex, IOException;

    public List<Channel> readChannels() throws Ex;

    /**
     * 修改通道信息
     *
     * @param privated
     * @param channels
     * @return
     * @throws Ex
     */
    public String updateChannel(Boolean privated, List<Channel> channels) throws Ex;

    /**
     * 修改通道信息的审计条数
     * @param privated true:内网;false:外网
     * @param count
     * @return
     * @throws Ex
     */
    public String updateChannelCount(Boolean privated, String count) throws Ex;

    /**
     * 组建通道类型列表
     * @return
     * @throws Ex
     */
    public String readChannelKeyValue() throws Ex;

    /**
     * 验证通道端口
     * @param channelPort
     * @return
     * @throws Ex
     */
    public String checkAppPort(int channelPort) throws Ex;

    /**
     * 改变应用状态
     * @param appName
     * @param status
     */
    public void updateTypeAppSend(String appName, int status) throws Ex;

    /**
     * 组建应用名成业务列表
     * @param internal
     * @return
     * @throws Ex
     */
    public String readTypeNameForBusiness(String internal) throws Ex;

    /**
     * 更新平台信息
     * @param channelIChangeUtils
     */
    public void updateChangeUtils(ChannelIChangeUtils channelIChangeUtils) throws Ex;

    /**
     * 读取平台信息
     * @return
     */
    public String selectChangeUtils() throws Ex;

    /**
     * 设置重启策略
     * @param time
     * @throws Ex
     */
    public void saveRestartTime(String time) throws Ex;

    public String readSNMP(int start, int limit) throws Ex;

    public String readSysLog(int start, int limit) throws Ex;

    public String checkSNMPClient(String snmpclient) throws Ex;

    public String checkSysLogClient(String syslogclient) throws Ex;

    public void saveSNMPClient(String ip) throws Ex;

    public void saveSysLogClient(String ip) throws Ex;

    public void deleteSNMPClient(String ip) throws Ex;

    public void deleteSysLogClient(String ip) throws Ex;

    public void updateSNMPClient(String snmpclient, String oldSNMPClient) throws Ex;

    public void updateSysLogClient(String syslogclient, String oldSysLogClient) throws Ex;

    /**
     * 审核通过
     * @param plugin
     * @param appName
     * @param isAllow
     * @throws Ex
     */
    public void updateTypeAllow(String plugin, String appName, boolean isAllow) throws Ex;

    /**
     * 组织appName和appType的一条json记录
     *
     *
     * @param appName
     * @param appType
     * @return
     * @throws Ex
     */
    public String queryByNameType(String appName, String appType) throws Ex;

    /**
     * 修改源端应用的数据库同步方式
     *
     * @param beforeUpdate   修改前同步方式
     * @param afterUpdate    修改后同步方式
     * @param typeBase
     * @param typeDB
     * @param operateDB      true表示不用操作数据库
     * @throws Ex
     */
    public String updateDBSourceDataType(String beforeUpdate, String afterUpdate, TypeBase typeBase, TypeDB typeDB, boolean operateDB) throws Ex;

    /**
     * 修改应用的源端数据源
     *
     * @param typeBase
     * @param dbName
     *@param dbNameOld  @throws Ex
     */
    public void updateDBName(TypeBase typeBase, String dbName, String dbNameOld) throws Ex;

    /**
     * 获取存档文件和当前文件比较后已经存在的临时表
     * @return
     * @throws Ex
     * @param s
     */
    public Map<String,List<String>> readAllTempTable(String s) throws Ex;

    /**
     * 修改目标端应用的源端数据源名,并且删除原先的表结构
     *
     * @param typeXml            内外网区分
     * @param appName            应用名
     * @param sourceDBNameOld   修改前数据源名称
     * @param sourceDBName      修改后数据源名称
     * @return
     */
    public String updateTargetSourceDBName(String typeXml, String appName, String sourceDBNameOld, String sourceDBName) throws Ex;

    /**
     * 检查jdbcName是否正在被使用
     * @param privated
     * @param jdbcName
     * @return
     * @throws Ex
     */
    public boolean checkJdbcNameIsUsed(boolean privated, String jdbcName) throws Ex;

    /**
     * 删除应用时,
     * 状态不是insert时,设置database 的状态为 delete;
     * @param appName
     * @param plugin
     * @throws Ex
     */
    public void setDataBaseDelete(String appName, String plugin) throws Ex;

    /**
     * 读取源端应用中的通道端口
     * @param appName
     * @return
     * @throws Ex
     */
    public String readExternalTypeChannelPort(String appName) throws Ex;

    /**
     * 去掉已经存在的数据
     * @param sysArray
     * @return
     * @throws Ex
     */
    public String[] getSysArray(String[] sysArray) throws Ex;

    /**
     * 去掉已经存在的数据
     * @param snmpArray
     * @return
     * @throws Ex
     */
    public String[] getSnmpArray(String[] snmpArray) throws Ex;
}
