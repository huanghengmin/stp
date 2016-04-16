package com.hzih.stp.utils;

import com.hzih.stp.domain.Account;
import com.hzih.stp.domain.Role;
import com.inetec.common.exception.Ex;

import java.io.File;
import java.util.*;

/**
 * Created by IntelliJ IDEA.
 * User: 钱晓盼
 * Date: 11-10-11
 * Time: 下午5:09
 * To change this template use File | Settings | File Templates.
 */
public class StringUtils {

    public static boolean isAuthUser(Account account){
        Set<Role> roles =  account.getRoles();
        Iterator<Role> iterator = roles.iterator();
        Role role = null;
        while (iterator.hasNext()){
            role = iterator.next();
            break;
        }
        if("002".equals(role.getRoleType())){
            return true;
        }
        return false;
    }

    public String trim(String str){
        if(str.indexOf(",]")> -1){
            String[] ary = str.split(",]");
            str = ary[0]+"]"+ary[1];
        }
        return str;
    }

    public static boolean getPrivated() {
        Configuration config = null;
        try {
            config = new Configuration(StringContext.EXTERNALXML);
        } catch (Ex ex) {

        }
        return config.getPrivated();
    }

    public String trimLast(String str) { //"E:/../xx/x.xx"
        int index = str.lastIndexOf('/');
        str = str.substring(0,index);
        return str;                      //"E:/../xx"
    }
    //jdbc:jtds:sqlserver://192.168.1.113:1433/test;tds=8.0;lastupdatecount=true	sqlserver
	//jdbc:oracle:thin:@192.168.1.104:1521:testnei		oracle
    //jdbc:oracle:thin:@{0}:{1}:{2}
    //jdbc:oracle:thin:@{0}:{1}/{2}
	//jdbc:jtds:sybase://192.168.1.104:5003/test		sybase
	//jdbc:db2://192.168.1.14:5000/sample				db2
	//jdbc:jtds:sqlserver://192.168.11.25:1433:test   	mssql
    //jdbc:sqlserver://192.168.1.102:1433;DatabaseName=signet
    //jdbc:microsoft:sqlserver://{0}:{1};DatabaseName={2}  sql server 2000
	public String trimUrl(String dbUrl) {	
		String dbName = null;
		String db = dbUrl.split(":")[1];
		String[] dbs = dbUrl.split(";");
		if(dbs.length>2){
			if("jtds".equals(db)){
				dbName = dbUrl.substring(dbUrl.lastIndexOf('/')+1,dbUrl.indexOf(';'));
			}else if("oracle".equals(db)){
				dbName = dbUrl.substring(dbUrl.lastIndexOf(':')+1,dbUrl.indexOf(';'));
			}else if("sybase".equals(db)){
				dbName = dbUrl.substring(dbUrl.lastIndexOf('/')+1,dbUrl.indexOf(';'));
			}else if("db2".equals(db)){
				dbName = dbUrl.substring(dbUrl.lastIndexOf('/')+1,dbUrl.indexOf(';'));
			}else if("microsoft".equals(db)){
				dbName = dbUrl.substring(dbUrl.lastIndexOf('/')+1,dbUrl.indexOf(';'));
			}
		}else{
			if("jtds".equals(db)){
				dbName = dbUrl.substring(dbUrl.lastIndexOf('/')+1);
			}else if("oracle".equals(db)){
				dbName = dbUrl.substring(dbUrl.lastIndexOf(':')+1);
                if(dbName==null){
                   dbName = dbUrl.substring(dbUrl.lastIndexOf('/')+1);
                }
			}else if("sybase".equals(db)){
				dbName = dbUrl.substring(dbUrl.lastIndexOf('/')+1);
			}else if("db2".equals(db)){
				dbName = dbUrl.substring(dbUrl.lastIndexOf('/')+1);
			}else if("microsoft".equals(db)){
				dbName = dbUrl.substring(dbUrl.lastIndexOf('=')+1);
                if(dbName==null){
                   dbName = dbUrl.substring(dbUrl.lastIndexOf('/')+1);
                }
			}else if("sqlserver".equals(db)) {
                dbName = dbUrl.substring(dbUrl.lastIndexOf('=')+1);
            }
		}
		return dbName;						//test2 or testnei
	}

	public String appendString(String[] arrayIp, String ip) {
		String ips = arrayIp[0];
		if(arrayIp.length>1){
			for (int i = 1; i < arrayIp.length; i++) {
				ips += ","+arrayIp[i];
			}			
		}
		ips += ip==null?"":","+ip; 
		String[] str = ips.split(",");
		String[] str1 = array_unique(str);
		String ip_str = str1[0];
		for (int i = 1; i < str1.length; i++) {
			ip_str += ","+str1[i];
		}	
		return ip_str;
	}
	
    //去除数组中重复的记录  
    public String[] array_unique(String[] a) {  
        // array_unique  
        List<String> list = new LinkedList<String>();  
        for(int i = 0; i < a.length; i++) {  
            if(!list.contains(a[i])) {  
                list.add(a[i]);  
            }  
        }  
        return (String[])list.toArray(new String[list.size()]);  
    }

	public String updateString(String[] ips, String ip, String oldIp) {//用ip替换ips中的oldIp
		for (int i = 0; i < ips.length; i++) {
			if(oldIp.equals(ips[i])){
				ips[i] = ip;
			}
		}
		String ip_str = ips[0];
		for (int i = 1; i < ips.length; i++) {
			ip_str += ","+ips[i];
		}	
		return ip_str;
	}

	public String deleteString(String[] ips, String ip) { //去掉ips中等于ip的数据
		String ip_str = "";
		for (int i = 0; i < ips.length; i++) {
			if(!ip.equals(ips[i])){
				ip_str += ","+ips[i];
			}
		}
		return ip_str.substring(1);
	}

    /**
     *
     * @param from   {'4','5','8','9'}
     * @param sun    {'4','7'}
     * @return        {'7'}
     */
    public static String[] arrayTrim(String[] from, String[] sun) {
        List<String> list = new ArrayList<String>();
        for(int i=0;i<sun.length;i++) {
            for (int j=0;j<from.length;j++) {
                if(sun[i].equals(from[j])) {
                    list.add(sun[i]);
                    break;
                }
            }
        }
        return getArray(sun,list.toArray(new String[list.size()]));
    }

	/**
	 * 去掉ips中等于或者存在ip的ip或者ip段
	 * @param ips 192.168.1.15-192.168.1.30,192.168.1.50,192.168.1.60-192.168.1.100
	 * @param ip 192.168.1.15-192.168.1.30,192.168.1.50
	 * @return 192.168.1.60-192.168.1.100
	 */
	public String deleteArray(String[] ips, String[] ip) {
		String[] ipArray = getArray(ips,ip);
		String str = "";
		if(ipArray.length>1){
			str = appendString(ipArray, "");
		}
		return str;
	}
	
	/**
	 * 
	 * @param bigArray 	["a","b","c","d","e"]
	 * @param smallArray		["a","b"]
	 * @return appNamesT		["c","d","e"]
	 */
	public static String[] getArray(String[] bigArray, String[] smallArray) {
		List<String> bigList = new ArrayList<String>();
		List<String> smallList = new ArrayList<String>();
		for (int i = 0; i < bigArray.length; i++) {
			bigList.add(bigArray[i]);
		}
		for (int i = 0; i < smallArray.length; i++) {
			smallList.add(smallArray[i]);
		}
		bigList.removeAll(smallList);
		String[] appNamesTs = (String[])bigList.toArray(new String[bigList.size()]);
		return appNamesTs;
	}

    /**
	 * when str is null or "" return true
	 *
	 * @param str
	 * @return
	 */
	public static Boolean isBlank(String str) {
		if (str == null || str.equals("") || str.length() == 0)
			return true;
		else
			return false;
	}

	/**
	 * when str is null or "" return false
	 *
	 * @param str
	 * @return
	 */
	public static Boolean isNotBlank(String str) {
		if (str == null || str.equals("") || str.length() == 0)
			return false;
		else
			return true;
	}

    public static String fileArrayToJson(File[] files) {
        String json = "{success:true,total:"+files.length+",rows:[";
        for(int i=0;i < files.length;i++){
            File file = files[i];
            String fileName = file.getName()+"("+FileUtil.setLength(file.length())+")";
            json += "{name:'"+fileName+"'},";
        }
        json += "]}";
        return json;
    }
}
