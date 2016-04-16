package com.hzih.stp.domain;

/**
 * Created with IntelliJ IDEA.
 * User: 钱晓盼
 * Date: 12-8-3
 * Time: 下午2:19
 * 设备告警信息表
 */
public class EquipmentAlert {
    private Long id;
    private int disk;
    private int memory;
    private int cpu;
    private String equipmentName;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getDisk() {
        return disk;
    }

    public void setDisk(int disk) {
        this.disk = disk;
    }

    public int getMemory() {
        return memory;
    }

    public void setMemory(int memory) {
        this.memory = memory;
    }

    public int getCpu() {
        return cpu;
    }

    public void setCpu(int cpu) {
        this.cpu = cpu;
    }

    public String getEquipmentName() {
        return equipmentName;
    }

    public void setEquipmentName(String equipmentName) {
        this.equipmentName = equipmentName;
    }
}
