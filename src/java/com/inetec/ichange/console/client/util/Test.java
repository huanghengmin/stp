package com.inetec.ichange.console.client.util;

import com.inetec.ichange.console.config.utils.TriggerBean;

/**
 * Created by IntelliJ IDEA.
 * User: bluesky
 * Date: 2008-10-28
 * Time: 15:33:26
 * To change this template use File | Settings | File Templates.
 */
public class Test {
    public void testss() {
        DbInitBean dbInitBean = new DbInitBean();
        TriggerBean triggers[] = new TriggerBean[0];
        triggers[0] = new TriggerBean();
        triggers[0].setTableName("23sf");
        triggers[0].setMonitorDelete(true);
        triggers[0].setPkFields(new String[]{"2342ss", "4ssfd"});
        dbInitBean.setTriggerBeans(triggers);
        dbInitBean.setTempTable("s23423");
        dbInitBean.setTableNames(new String[]{"23sf"});
        System.out.println(dbInitBean.toString());
    }

    public static void main(String[] args) throws Exception {
        Test tst = new Test();
        tst.testss();
    }
}
