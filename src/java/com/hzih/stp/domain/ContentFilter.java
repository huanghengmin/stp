package com.hzih.stp.domain;

/**
 * Created with IntelliJ IDEA.
 * User: 钱晓盼
 * Date: 12-7-12
 * Time: 下午3:10
 * To change this template use File | Settings | File Templates.
 */
public class ContentFilter {
    Long id;
    String filter;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFilter() {
        return filter;
    }

    public void setFilter(String filter) {
        this.filter = filter;
    }
}
