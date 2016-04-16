package com.hzih.stp.domain;

/**
 * Created with IntelliJ IDEA.
 * User: 钱晓盼
 * Date: 12-9-13
 * Time: 下午4:01
 * To change this template use File | Settings | File Templates.
 * 加密等级表
 */
public class SecurityLevel {
    Long id;
    /**
     * 等级 level_info
     */
    String levelInfo;
    /**
     * 加密标记 security_flag
     */
    String securityFlag;
    /**
     * 加密强度 security_level
     */
    int securityLevel;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLevelInfo() {
        return levelInfo;
    }

    public void setLevelInfo(String levelInfo) {
        this.levelInfo = levelInfo;
    }

    public String getSecurityFlag() {
        return securityFlag;
    }

    public void setSecurityFlag(String securityFlag) {
        this.securityFlag = securityFlag;
    }

    public int getSecurityLevel() {
        return securityLevel;
    }

    public void setSecurityLevel(int securityLevel) {
        this.securityLevel = securityLevel;
    }
}
