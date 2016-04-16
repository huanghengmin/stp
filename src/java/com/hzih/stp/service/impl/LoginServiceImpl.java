package com.hzih.stp.service.impl;

import com.hzih.stp.dao.AccountDao;
import com.hzih.stp.domain.Account;
import com.hzih.stp.domain.Role;
import com.hzih.stp.service.LoginService;

import java.util.HashSet;
import java.util.Iterator;
import java.util.Set;

/**
 *   登陆逻辑业务处理
 */
public class LoginServiceImpl implements LoginService {

    private AccountDao accountDao;

	public void setAccountDao(AccountDao accountDao) {
		this.accountDao = accountDao;
	}

    /**
     * 通过用户名、密码查找用户对象
     * @param name
     * @param pwd
     * @return
     */
	public Account getAccountByNameAndPwd(String name, String pwd) {
		Account account = accountDao.findByNameAndPwd(name, pwd);
		Set permissions = new HashSet();
		if (account != null) {
			Set roles = account.getRoles();
			for (Iterator iter = roles.iterator(); iter.hasNext();) {
				Role role = (Role) iter.next();
				permissions.addAll(role.getPermissions());
			}
			account.setPermissions(permissions);
		}

		return account;
	}

    /**
     * 通过用户名查找用户对象
     * @param name
     * @return
     */
    public Account getAccountByName(String name) {
        Account account = accountDao.findByName(name);
        return account;
    }

}
