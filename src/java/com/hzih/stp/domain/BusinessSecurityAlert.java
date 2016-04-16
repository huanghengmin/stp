package com.hzih.stp.domain;

import java.util.Date;

/**
 * Created with IntelliJ IDEA.
 * User: 钱晓盼
 * Date: 12-8-22
 * Time: 下午12:11
 * To change this template use File | Settings | File Templates.
 */
public class BusinessSecurityAlert {
    private long id;
    private Date alertTime;
    private String businessName;
    private String ip;
    private String isRead;
    private String alertInfo;
    private String alertTypeCode;
    private String userName;

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

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

    public String getBusinessName() {
        return businessName;
    }

    public void setBusinessName(String businessName) {
        this.businessName = businessName;
    }

    public String getAlertTypeCode() {
        return alertTypeCode;
    }

    public void setAlertTypeCode(String alertTypeCode) {
        this.alertTypeCode = alertTypeCode;
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
