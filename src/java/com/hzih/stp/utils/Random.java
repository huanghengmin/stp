package com.hzih.stp.utils;

/**
 * Created by IntelliJ IDEA.
 * User: 钱晓盼
 * Date: 11-10-21
 * Time: 上午11:35
 * To change this template use File | Settings | File Templates.
 */
public class Random {
    public static int getRandom(){
        int i;
        do {
            i = (int)(Math.random()*10000);
        }while(i>=10000&&i<100000);
        return i;
    }
}
