package com.hzih.stp.domain;

/**
 * Created with IntelliJ IDEA.
 * User: 钱晓盼
 * Date: 12-7-18
 * Time: 下午3:18
 * To change this template use File | Settings | File Templates.
 * 应用删除状态表
 */
public class DeleteStatus {
    private Long id;
    //应用名
    private String appName;
    //数据源类型,external表示源端,internal表示目标端
    private String plugin;

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

    public String getPlugin() {
        return plugin;
    }

    public void setPlugin(String plugin) {
        this.plugin = plugin;
    }

}
