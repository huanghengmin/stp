package com.hzih.stp.domain;

/**
 * Created with IntelliJ IDEA.
 * User: 钱晓盼
 * Date: 12-7-26
 * Time: 下午6:04
 * 应用批注
 */
public class TypeCheck {
    Long id;
    String appName;
    String appType;
    int up;
    String desc;
    String reDesc;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAppName() {
        return appName;
    }

    public void setAppName(String appName) {
        this.appName = appName;
    }

    public String getAppType() {
        return appType;
    }

    public void setAppType(String appType) {
        this.appType = appType;
    }

    public int getUp() {
        return up;
    }

    public void setUp(int up) {
        this.up = up;
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    public String getReDesc() {
        return reDesc;
    }

    public void setReDesc(String reDesc) {
        this.reDesc = reDesc;
    }
}
