package com.inetec.ichange.console.client.util;

import com.inetec.common.exception.ErrorCode;
import com.inetec.common.i18n.Key;


public class EChange extends ErrorCode {

    public static final int I_NOERROR = 0;
    public static final Key K_NOERROR = new Key("NO ERROR.");
    public static final EChange E_NOERROR = new EChange(I_NOERROR);

    /**
     * ��֪���Ĵ������
     */
    public static final int I_UNKNOWN = -1;
    public static final Key K_UNKNOWN = new Key("UNKNOWN");
    public static final EChange E_UNKNOWN = new EChange(I_UNKNOWN);
    /**
     * û��ʵ�ֵĴ������
     */
    public static final int I_NOTIMPLEMENTED = -2;
    public static final Key K_NOTIMPLEMENTED = new Key("NOT IMPLEMENTED");
    public static final EChange E_NOTIMPLEMENTED = new EChange(I_NOTIMPLEMENTED);

    // General errors: 10010
    /**
     * �ַ�Ϊ�յĴ�����롣
     */
    public static final int I_GE_NullString = 10011;
    public static final Key K_Ge_NullString = new Key("Get String is Null");
    public static final EChange E_Ge_NullString = new EChange(I_GE_NullString);
    /**
     * �����Ĵ�����롣
     */
    public static final int I_GE_IndexOutOfRange = 10012;
    public static final Key K_GE_IndexOutOfRange = new Key("Get String Inddex Out of Range.");
    public static final EChange E_Ge_IndexOutOfRange = new EChange(I_GE_IndexOutOfRange);

    // NodeInfo: 10020

    /**
     * �Ѿ����ù�Ĵ�����롣
     */
    public static final int I_CF_AlreadyConfigured = 10035;
    public static final Key K_CF_AlreadyConfigured = new Key("Already Configured.");
    public static final EChange E_CF_AlreadyConfigured = new EChange(I_CF_AlreadyConfigured);
    /**
     * ���ò��ɹ��Ĵ�����롣
     */
    public static final int I_CF_Failed = 10036;
    public static final Key K_CF_Failed = new Key("Config faild.");
    public static final EChange E_CF_Faild = new EChange(I_CF_Failed);

    /**
     * ���ñ�����Ч�Ĵ�����롣
     */
    public static final int I_CF_VariableNotFound = 10037;
    public static final Key K_CF_VariableNotFound = new Key("Config Variable Not Found");
    public static final EChange E_CF_VariableNotFound = new EChange(I_CF_VariableNotFound);
    /**
     * �������Ϊ�յĴ�����롣
     */
    public static final int I_CF_NullConfigData = 10038;
    public static final Key K_CF_NullConfigData = new Key("Config data is null.");
    public static final EChange E_CF_NullConfigData = new EChange(I_CF_NullConfigData);
    /**
     * û��ʵ�����ýӿڵĴ������
     */
    public static final int I_CF_InterfaceNotImplemented = 10039;
    public static final Key K_CF_InterfaceNotImplemented = new Key("Interfac not implemented.");
    public static final EChange E_CF_InterfaceNotImplemented = new EChange(I_CF_InterfaceNotImplemented);
    /*
    * û�����ù�Ĵ������
    */
    public static final int I_CF_NotConfigured = 10040;
    public static final Key K_CF_NotConfigured = new Key("Not Configured.");
    public static final EChange E_CF_NotConfigured = new EChange(I_CF_NotConfigured);


    private EChange(int i) {
        super(i);
    }

}
