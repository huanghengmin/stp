package com.hzih.stp.domain;

import java.util.Date;

/**
 * Created with IntelliJ IDEA.
 * User: 钱晓盼
 * Date: 12-8-22
 * Time: 下午12:11
 * To change this template use File | Settings | File Templates.
 */
public class SafeEventSecurityAlert {
    private long id;
    private Date alertTime;
    private String name;
    private String objType;
    private String ip;
    private String isRead;
    private String alertInfo;
    private String alertTypeCode;

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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getObjType() {
        return objType;
    }

    public void setObjType(String objType) {
        this.objType = objType;
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

    public void setRead(String read) {
        this.isRead = read;
    }

    public String getAlertInfo() {
        return alertInfo;
    }

    public void setAlertInfo(String alertInfo) {
        this.alertInfo = alertInfo;
    }

    public String getAlertTypeCode() {
        return alertTypeCode;
    }

    public void setAlertTypeCode(String alertTypeCode) {
        this.alertTypeCode = alertTypeCode;
    }
}
