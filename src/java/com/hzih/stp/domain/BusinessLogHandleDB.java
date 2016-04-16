package com.hzih.stp.domain;

/**
 * Created with IntelliJ IDEA.
 * User: 钱晓盼
 * Date: 13-4-10
 * Time: 下午6:53
 * To change this template use File | Settings | File Templates.
 */
public class BusinessLogHandleDB {
    private long id;
    private String appName;
    private String fileName;
    private String operate;
    private long logTime;
    private int flag;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getAppName() {
        return appName;
    }

    public void setAppName(String appName) {
        this.appName = appName;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getOperate() {
        return operate;
    }

    public void setOperate(String operate) {
        this.operate = operate;
    }

    public long getLogTime() {
        return logTime;
    }

    public void setLogTime(long logTime) {
        this.logTime = logTime;
    }

    public int getFlag() {
        return flag;
    }

    public void setFlag(int flag) {
        this.flag = flag;
    }
}
