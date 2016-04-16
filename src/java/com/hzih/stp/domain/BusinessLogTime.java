package com.hzih.stp.domain;

/**
 * Created with IntelliJ IDEA.
 * User: 钱晓盼
 * Date: 13-4-10
 * Time: 下午6:53
 * To change this template use File | Settings | File Templates.
 */
public class BusinessLogTime {
    private String appName;
    private double average;
    private int count;

    public String getAppName() {
        return appName;
    }

    public void setAppName(String appName) {
        this.appName = appName;
    }

    public double getAverage() {
        return average;
    }

    public void setAverage(double average) {
        this.average = average;
    }

    public int getCount() {
        return count;
    }

    public void setCount(int count) {
        this.count = count;
    }
}
