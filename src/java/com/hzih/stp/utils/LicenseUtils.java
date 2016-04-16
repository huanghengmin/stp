package com.hzih.stp.utils;

import com.inetec.common.security.License;
import org.apache.log4j.Logger;

import java.util.ArrayList;
import java.util.List;

public class LicenseUtils {
    private static final Logger logger = Logger.getLogger(LicenseUtils.class);
    /**
     *  权限控制
     * @param isExistLicense    是否存在 usb-key
     * @return
     */
	public List<String> getNeedsLicenses(boolean isExistLicense) {
        boolean privated = StringUtils.getPrivated();


        String qxManager = "TOP_QXGL:SECOND_YHGL:SECOND_JSGL:SECOND_AQCL:";                   //权限管理
        String wlManager = "TOP_WLGL:SECOND_JKGL:SECOND_WLCS:SECOND_LYGL:SECOND_AQPZ:";     //网络管理
        String bjManager = "TOP_BJGL:SECOND_YWYCBJ:SECOND_AQSJBJ:SECOND_SBGZBJ:";      //报警管理
        String sjManager = "TOP_SJGL:SECOND_YHRZ:SECOND_SBRZ:SECOND_YWRZ:SECOND_XTRZ:";//审计管理
        String pzManager = "TOP_PZGL:SECOND_SJKPZ:SECOND_BJPZ:SECOND_SBPZ:SECOND_SJRB:SECOND_XXAQCL:SECOND_GLPZ:";//配置管理

        String nwjkManager = "TOP_YXJK:SECOND_YWYXJK:SECOND_SBYXJK:";             //内网运行监控
        String wwjkManager = "TOP_YXJK:SECOND_SBYXJK:";                             //外网运行监控
        String nwxtManager = "TOP_XTGL:SECOND_INIT_T:SECOND_PTPZ:SECOND_PTSM:SECOND_PTGL:SECOND_ZSGL:SECOND_RZXZ:SECOND_BBSJ:SECOND_MB_PZHF:SECOND_MB_PZWJGL:SECOND_HFCCSZ:";//内网系统管理
        String wwxtManager = "TOP_XTGL:SECOND_INIT_S:SECOND_PTPZ:SECOND_PTSM:SECOND_PTGL:SECOND_ZSGL:SECOND_RZXZ:SECOND_BBSJ:SECOND_YD_PZHF:SECOND_YD_PZWJGL:SECOND_HFCCSZ:";//外网系统管理
        String nwsjyManager ="TOP_SJYGL:SECOND_MBSJY:";                                   //内网数据源管理
        String wwsjyManager ="TOP_SJYGL:SECOND_YDSJY:";                                   //外网数据源管理
        String nwyyManager = "TOP_YYGL:SECOND_MB_WJTB:SECOND_MB_DBTB:SECOND_MB_TYDL:SECOND_DKYS:SECOND_PZGL:SECOND_YWSJBD:";                         //内网应用管理
        String wwyyManager = "TOP_YYGL:SECOND_YD_WJTB:SECOND_YD_DBTB:SECOND_YD_TYDL:SECOND_DKYS:SECOND_PZGL:SECOND_YWSDCC:";                         //外网应用管理
        String nwshManager = "TOP_SHGL:SECOND_MB_WJTBSH:SECOND_MB_DBTBSH:SECOND_MB_TYDLSH:";//内网审核管理
        String wwshManager = "TOP_SHGL:SECOND_YD_WJTBSH:SECOND_YD_DBTBSH:SECOND_YD_TYDLSH:";//外网审核管理
        String permission = "";
        if(privated){     //内网
            permission = qxManager + bjManager + sjManager + wlManager + pzManager +
                         nwxtManager + nwsjyManager + nwyyManager + nwshManager + nwjkManager;
//                         License.getModules();
        } else {      //外网
            permission = qxManager + bjManager + sjManager + wlManager + pzManager +
                         wwxtManager + wwsjyManager + wwyyManager + wwshManager + wwjkManager;
//                         License.getModules();
        }
		String[] permissions = permission.split(":");
		List<String> lps = new ArrayList<String>();
		for (int i = 0; i < permissions.length; i++) {
			lps.add(permissions[i]);
		}
		return lps;
	}

    public static int getChannelCount() {

        return 1;
    }
}
