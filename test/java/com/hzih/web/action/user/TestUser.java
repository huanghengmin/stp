package com.hzih.web.action.user;

import com.inetec.common.exception.Ex;
import com.inetec.common.security.DesEncrypterAsPassword;
import com.inetec.ichange.console.config.Constant;

/**
 * Created with IntelliJ IDEA.
 * User: 钱晓盼
 * Date: 12-9-19
 * Time: 下午5:33
 * To change this template use File | Settings | File Templates.
 */
public class TestUser {
    public static void main(String[] args) throws Ex {
        DesEncrypterAsPassword deap = new DesEncrypterAsPassword(Constant.S_PWD_ENCRYPT_CODE);
        String password = new String(deap.encrypt("123qwe!@#".getBytes()));
        System.out.println(password);
    }
}
