package com.hzih.stp.domain;

/**
 * Created with IntelliJ IDEA.
 * User: 钱晓盼
 * Date: 12-7-5
 * Time: 下午1:29
 * To change this template use File | Settings | File Templates.
 * 设备信息
 */
public class Equipment {
    Long id;
    String equipmentName;
    String equipmentDesc;

    String linkName;
    String linkType;
    /**
	 * 设备类型    设备图标
	 *
	 * @hibernate.property column="equ_type" type="java.lang.String"
	 */
    String equTypeCode;
    /**
	 * 是否开启监控 说明：N未开启，Y开启
	 *
	 * @hibernate.property column="monitor_used" type="java.lang.String"
	 */
	String monitorUsed;
	/**
	 * 是否核心设备 说明：1是，0否
	 *
	 * @hibernate.property column="is_key_device" type="java.lang.String"
	 */
	String keyDevice;
    /**
	 * IP地址
	 *
	 * @hibernate.property column="ip" type="java.lang.String"
	 */
	String ip;

	/**
	 * 次选IP
	 *
	 * @hibernate.property column="other_ip" type="java.lang.String"
	 */
	String otherIp;

	/**
	 * MAC地址
	 *
	 * @hibernate.property column="MAC" type="java.lang.String"
	 */
	String mac;

	/**
	 * 子网掩码
	 *
	 * @hibernate.property column="subnet_mask" type="java.lang.String"
	 */
	String subNetMask;

    /**
	 * 设备系统配置文件
	 *
	 * @hibernate.property column="equSysConfig" type="java.lang.String"
	 */
	String equSysConfig;

	/**
	 * 设备管理单位
	 *
	 * @hibernate.property column="equManagerDepart" type="java.lang.String"
	 */
	String equManagerDepart;

    String snmpVer;

    String oidName;

    String port;

    String password;


    String auth;

    String authPassword;

    String common;

    String commonPassword;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEquipmentName() {
        return equipmentName;
    }

    public void setEquipmentName(String equipmentName) {
        this.equipmentName = equipmentName;
    }

    public String getEquipmentDesc() {
        return equipmentDesc;
    }

    public void setEquipmentDesc(String equipmentDesc) {
        this.equipmentDesc = equipmentDesc;
    }

    public String getLinkName() {
        return linkName;
    }

    public void setLinkName(String linkName) {
        this.linkName = linkName;
    }

    public String getLinkType() {
        return linkType;
    }

    public void setLinkType(String linkType) {
        this.linkType = linkType;
    }

    public String getEquTypeCode() {
        return equTypeCode;
    }

    public void setEquTypeCode(String equTypeCode) {
        this.equTypeCode = equTypeCode;
    }

    public String getMonitorUsed() {
        return monitorUsed;
    }

    public void setMonitorUsed(String monitorUsed) {
        this.monitorUsed = monitorUsed;
    }

    public String getKeyDevice() {
        return keyDevice;
    }

    public void setKeyDevice(String keyDevice) {
        this.keyDevice = keyDevice;
    }

    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }

    public String getOtherIp() {
        return otherIp;
    }

    public void setOtherIp(String otherIp) {
        this.otherIp = otherIp;
    }

    public String getMac() {
        return mac;
    }

    public void setMac(String mac) {
        this.mac = mac;
    }

    public String getSubNetMask() {
        return subNetMask;
    }

    public void setSubNetMask(String subNetMask) {
        this.subNetMask = subNetMask;
    }

    public String getEquSysConfig() {
        return equSysConfig;
    }

    public void setEquSysConfig(String equSysConfig) {
        this.equSysConfig = equSysConfig;
    }

    public String getEquManagerDepart() {
        return equManagerDepart;
    }

    public void setEquManagerDepart(String equManagerDepart) {
        this.equManagerDepart = equManagerDepart;
    }

    public String getPort() {
        return port;
    }

    public void setPort(String port) {
        this.port = port;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getSnmpVer() {
        return snmpVer;
    }

    public void setSnmpVer(String snmpVer) {
        this.snmpVer = snmpVer;
    }

    public String getOidName() {
        return oidName;
    }

    public void setOidName(String oidName) {
        this.oidName = oidName;
    }

    public String getAuth() {
        return auth;
    }

    public void setAuth(String auth) {
        this.auth = auth;
    }

    public String getAuthPassword() {
        return authPassword;
    }

    public void setAuthPassword(String authPassword) {
        this.authPassword = authPassword;
    }

    public String getCommon() {
        return common;
    }

    public void setCommon(String common) {
        this.common = common;
    }

    public String getCommonPassword() {
        return commonPassword;
    }

    public void setCommonPassword(String commonPassword) {
        this.commonPassword = commonPassword;
    }
}
