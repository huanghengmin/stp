package com.hzih.stp.domain;

import java.util.Date;

/**
 * Created with IntelliJ IDEA.
 * User: 钱晓盼
 * Date: 12-8-22
 * Time: 下午12:11
 * To change this template use File | Settings | File Templates.
 */
public class EquipmentSecurityAlert {
    private long id;
    private Date alertTime;
    private String equipmentName;
    private String ip;
    private String isRead;
    private String alertInfo;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public Date getAlertTime() {
        return alertTime;
    }

    public void setAlertTime(Date alertTime) {
        this.alertTime = alertTime;
    }

    public String getEquipmentName() {
        return equipmentName;
    }

    public void setEquipmentName(String equipmentName) {
        this.equipmentName = equipmentName;
    }

    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }

    public String getRead() {
        return isRead;
    }

    public void setRead(String isRead) {
        this.isRead = isRead;
    }

    public String getAlertInfo() {
        return alertInfo;
    }

    public void setAlertInfo(String alertInfo) {
        this.alertInfo = alertInfo;
    }
}
