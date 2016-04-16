package com.inetec.ichange.console.client.util;

import com.inetec.common.i18n.Key;

public class Status {


    public static final int I_Success_SendData = 1000;


    public static final Key K_Success_SendData = new Key("data send succeed. ");


    public static final Status S_Success_SendData = new Status(I_Success_SendData, K_Success_SendData);


    public static final int I_Success_DataReceiver = 1100;


    public static final Key K_Success_DataReceiver = new Key("data receiver  succeed.");


    public static final Status S_Success_Data_Recevier = new Status(I_Success_DataReceiver, K_Success_DataReceiver);


    public static final int I_Success_StartInputAdapter = 1200;


    public static final Key K_Success_StartInputAdapter = new Key("start input adapter succeed. ");


    public static final Status S_Success_StartInputAdapter = new Status(I_Success_StartInputAdapter, K_Success_StartInputAdapter);


    public static final int I_Success_SendControlCommand = 1300;

    public static final Key K_Success_SendControlCommand = new Key("send control command succeed.");


    public static final Status S_Success_SendControlCommand = new Status(I_Success_SendControlCommand, K_Success_SendControlCommand);


    public static final int I_Success_OutputProcess = 1400;


    public static final Key K_Success_OutputProcess = new Key("output process succeed.");


    public static final Status S_Success_OutputProcess = new Status(I_Success_OutputProcess, K_Success_OutputProcess);


    public static final int I_Faild_SendData = -1000;


    public static final Key K_Faild_SendData = new Key("send data faild.");


    public static final Status S_Faild_SendData = new Status(I_Faild_SendData, K_Faild_SendData);

    public static final int I_Faild_SendData_NetWork_Error = -1001;

    public static final Key K_Faild_SendData_NetWork_Error = new Key("send data faild  of network error.");

    public static final Status S_Faild_SendData_NetWort_Error = new Status(I_Faild_SendData_NetWork_Error, K_Faild_SendData_NetWork_Error);

    public static final int I_Faild_SendData_IO_Error = -1002;

    public static final Key K_Faild_SendData_IO_Error = new Key("send data faild of io error.");

    public static final Status S_Faild_SendData_IO_Error = new Status(I_Faild_SendData_IO_Error, K_Faild_SendData_IO_Error);

    public static final int I_Faild_SendData_NotConnection = -1003;

    public static final Key K_Faild_SendData_NotConnection = new Key("send data  not Connection faild .");

    public static final Status S_Faild_SendData_NotConnection = new Status(I_Faild_SendData_NotConnection, K_Faild_SendData_NotConnection);

    public static final int I_Faild_SendData_ConnectionIsNull = -1004;

    public static final Key K_Faild_SendData_ConnectionIsNull = new Key("send data  Connection is null faild .");

    public static final Status S_Faild_SendData_ConnectionIsNull = new Status(I_Faild_SendData_ConnectionIsNull, K_Faild_SendData_ConnectionIsNull);

    public static final int I_Faild_SendData_ConnectionIsBusy = -1005;

    public static final Key K_Faild_SendData_ConnectionIsBusy = new Key("send data connection is busy faild .");

    public static final Status S_Faild_SendData_ConnectionIsBusy = new Status(I_Faild_SendData_ConnectionIsBusy, K_Faild_SendData_ConnectionIsBusy);

    public static final int I_Faild_DataReceiver = -1100;

    public static final Key K_Faild_DataReceiver = new Key(" data  receiver faild .");

    public static final Status S_Faild_DataReceiver = new Status(I_Faild_DataReceiver, K_Faild_DataReceiver);

    public static final int I_Faild_WriteFile = -1101;

    public static final Key K_Faild_WriteFile = new Key("write file faild .");

    public static final Status S_Faild_WriteFile = new Status(I_Faild_WriteFile, K_Faild_WriteFile);


    public static final int I_Faild_DataIsNull = -1102;

    public static final Key K_Faild_DataIsNull = new Key(" data is null faild .");

    public static final Status S_Faild_DataIsNull = new Status(I_Faild_DataIsNull, K_Faild_DataIsNull);

    public static final int I_Faild_StartInputAdapter = -1200;

    public static final Key K_Faild_StartInputAdapter = new Key("start input adapter faild .");

    public static final Status S_Faild_StartInputAdapter = new Status(I_Faild_StartInputAdapter, K_Faild_StartInputAdapter);

    public static final int I_InputAadapterActiveIsFalse = -1201;

    public static final Key K_InputAadapterActiveIsFalse = new Key("input adapter active is false faild .");

    public static final Status S_InputAadapterActiveIsFalse = new Status(I_InputAadapterActiveIsFalse, K_InputAadapterActiveIsFalse);

    public static final int I_InputAdapterIsNotConfig = -1202;

    public static final Key K_InputAdapterIsNotConfig = new Key(" input adapteris not config faild .");

    public static final Status S_Faild_InputAdapterIsNotConfig = new Status(I_InputAdapterIsNotConfig, K_InputAdapterIsNotConfig);

    public static final int I_Faild_SendControlCommand = -1300;

    public static final Key K_Faild_SendControlCommand = new Key("send control command faild .");

    public static final Status S_Faild_SendControlCommand = new Status(I_Faild_SendControlCommand, K_Faild_SendControlCommand);

    public static final int I_Faild_SendControlCommand_NetWork_ERROR = -1301;

    public static final Key K_Faild_SendControlCommand_NetWork_ERROR = new Key("Send control command faild of  network error.");

    public static final Status S_Faild_SendControlCommand_NetWork_ERROR = new Status(I_Faild_SendControlCommand_NetWork_ERROR, K_Faild_SendControlCommand_NetWork_ERROR);

    public static final int I_Faild_SendControlCommand_IO_ERROR = -1302;

    public static final Key K_Faild_SendControlCommand_IO_ERROR = new Key("send control command faild of io error.");

    public static final Status S_Faild_SendControlCommand_IO_ERROR = new Status(I_Faild_SendControlCommand_IO_ERROR, K_Faild_SendControlCommand_IO_ERROR);

    public static final int I_Faild_SendControlCommand_NotConnection = -1303;

    public static final Key K_Faild_SendControlCommand_NotConnection = new Key("send  control command  not connection faild .");

    public static final Status S_Faild_SendControlCommand_NotConnection = new Status(I_Faild_SendControlCommand_NotConnection, K_Faild_SendControlCommand_NotConnection);

    public static final int I_Faild_SendControlCommand_ConnectionIsNull = -1304;

    public static final Key K_Faild_SendControlCommand_ConnectionIsNull = new Key("send  control command  connection is null faild.");

    public static final Status S_Faild_SendControlCommand_ConnectionIsNull = new Status(I_Faild_SendControlCommand_ConnectionIsNull, K_Faild_SendControlCommand_ConnectionIsNull);

    public static final int I_Faild_SendControlCommand_ConnectionIsBusy = -1305;

    public static final Key K_Faild_SendControlCommand_ConnectionIsBusy = new Key("send control command connection is busy faild .");

    public static final Status S_Faild_SendControlCommand_ConnectionIsBusy = new Status(I_Faild_SendControlCommand_ConnectionIsBusy, K_Faild_SendControlCommand_ConnectionIsBusy);

    public static final int I_Faild_OutputProcess = -1400;

    public static final Key K_Faild_OutputProcess = new Key(" output process faild .");

    public static final Status S_Faild_OutputProcess = new Status(I_Faild_OutputProcess, K_Faild_OutputProcess);

    public static final int I_Faild_DatabaseInsert = -1401;

    public static final Key K_Faild_DatabaseInsert = new Key(" database insert faild .");

    public static final Status S_Faild_DatabaseInsert = new Status(I_Faild_DatabaseInsert, K_Faild_DatabaseInsert);

    public static final int I_Faild_DatabaseUpdate = -1402;

    public static final Key K_Faild_DatabaseUpdate = new Key(" database update faild .");

    public static final Status S_Faild_DatabaseUpdate = new Status(I_Faild_DatabaseUpdate, K_Faild_DatabaseUpdate);

    public static final int I_Faild_DatabaseDelete = -1403;

    public static final Key K_Faild_DatabaseDelete = new Key(" database delete faild .");

    public static final Status S_Faild_DatabaseDelete = new Status(I_Faild_DatabaseDelete, K_Faild_DatabaseDelete);

    public static final int I_Faild_DatabaseSelect = -1405;

    public static final Key K_Faild_DatabaseSelect = new Key(" database select faild .");

    public static final Status S_Faild_DatabaseSelect = new Status(I_Faild_DatabaseSelect, K_Faild_DatabaseSelect);

    public static final int I_Faild_DatabaseConnection = -1406;

    public static final Key K_Faild_DatabaseConnection = new Key(" database connection faild .");

    public static final Status S_Faild_DatabaseConnection = new Status(I_Faild_DatabaseConnection, K_Faild_DatabaseConnection);

    public static final int I_Success = 10000;

    public static final Key K_Success = new Key("successed.");

    public static final Status S_Success = new Status(I_Success, K_Success);

    public static final int I_Success_DataPost = 11000;

    public static final Key K_Success_DataPost = new Key("data post successed.");

    public static final Status S_Success_DataPost = new Status(I_Success_DataPost, K_Success_DataPost);


    public static final int I_Success_Register = 12000;

    public static final Key K_Success_Register = new Key("send data faild of io error.");

    public static final Status S_Success_Register = new Status(I_Success_Register, K_Success_Register);

    public static final int I_Success_Login = 13000;

    public static final Key K_Success_Login = new Key("login successed .");

    public static final Status S_Success_Login = new Status(I_Success_Login, K_Success_Login);

    public static final int I_Success_Query = 14000;

    public static final Key K_Success_Query = new Key("query successed.");

    public static final Status S_Success_Query = new Status(I_Success_Query, K_Success_Query);


    public static final int I_Success_Validation = 16000;

    public static final Key K_Success_Validation = new Key("validation successed  .");

    public static final Status S_Success_Validation = new Status(I_Success_Validation, K_Success_Validation);


    public static final int I_Faild = -10000;

    public static final Key K_Faild = new Key("faild .");


    public static final Status S_Faild = new Status(I_Faild, K_Faild);


    public static final int I_Faild_DataPost = -11000;


    public static final Key K_Faild_DataPost = new Key(" data  post faild .");


    public static final Status S_Faild_DataPost = new Status(I_Faild_DataPost, K_Faild_DataPost);


    public static final int I_Faild_DataPost_DatabaseInsert = -11001;


    public static final Key K_Faild_DataPost_DatabaseInsert = new Key("data post database insert faild .");


    public static final Status S_Faild_DataPost_DatabaseInsert = new Status(I_Faild_DataPost_DatabaseInsert, K_Faild_DataPost_DatabaseInsert);


    public static final int I_Faild_DataPost_DatabaseConnection = -11002;

    public static final Key K_Faild_DataPost_DatabaseConnection = new Key("data post database connection faild .");


    public static final Status S_Faild_DataPost_DatabaseConnection = new Status(I_Faild_DataPost_DatabaseConnection, K_Faild_DataPost_DatabaseConnection);


    public static final int I_Faild_DataPost_DatabaseUpdate = -11003;


    public static final Key K_Faild_DataPost_DatabaseUpdate = new Key("data post database update faild.");


    public static final Status S_Faild_DataPost_DatabaseUpdate = new Status(I_Faild_DataPost_DatabaseUpdate, K_Faild_DataPost_DatabaseUpdate);


    public static final int I_Faild_DataPost_DatabaseSelect = -11004;


    public static final Key K_Faild_DataPost_DatabaseSelect = new Key("data post database select  faild .");


    public static final Status S_Faild_DataPost_DatabaseSelect = new Status(I_Faild_DataPost_DatabaseSelect, K_Faild_DataPost_DatabaseSelect);


    public static final int I_Faild_Register = -12000;


    public static final Key K_Faild_Register = new Key("registerfaild .");


    public static final Status S_Faild_Register = new Status(I_Faild_Register, K_Faild_Register);


    public static final int I_Faild_Register_UserIsExist = -12001;


    public static final Key K_Faild_Register_UserIsExist = new Key("register user is extends faild .");


    public static final Status S_Faild_Register_UserIsExtends = new Status(I_Faild_Register_UserIsExist, K_Faild_Register_UserIsExist);


    public static final int I_Faild_Register_UserInfoIsNull = -12002;


    public static final Key K_Faild_Register_UserInfoIsNull = new Key("register user info is null  faild .");


    public static final Status S_Faild_Register_UserInfoIsNull = new Status(I_Faild_Register_UserInfoIsNull, K_Faild_Register_UserInfoIsNull);


    public static final int I_Faild_Register_DatabaseInsert = -12003;


    public static final Key K_Faild_Register_DatabaseInsert = new Key("register database insert faild .");

    public static final Status S_Faild_Register_DatabaseInsert = new Status(I_Faild_Register_DatabaseInsert, K_Faild_Register_DatabaseInsert);

    public static final int I_Faild_Register_DatabaseSelect = -12004;

    public static final Key K_Faild_Register_DatabaseSelect = new Key(" register database select faild .");

    public static final Status S_Faild_Register_DatabaseSelect = new Status(I_Faild_Register_DatabaseSelect, K_Faild_Register_DatabaseSelect);

    public static final int I_Faild_Register_DatabaseConnection = -12009;

    public static final Key K_Faild_Register_DatabaseConnection = new Key("register database connection faild.");

    public static final Status S_Faild_Register_DatabaseConnection = new Status(I_Faild_Register_DatabaseConnection, K_Faild_Register_DatabaseConnection);

    public static final int I_Faild_Login = -13000;

    public static final Key K_Faild_Login = new Key("login faild.");

    public static final Status S_Faild_Login = new Status(I_Faild_Login, K_Faild_Login);

    public static final int I_Faild_Login_UserIsLogin = -13001;

    public static final Key K_Faild_Login_UserIsLogin = new Key("login user is login  faild .");

    public static final Status S_Faild_Login_UserIsLogin = new Status(I_Faild_Login_UserIsLogin, K_Faild_Login_UserIsLogin);

    public static final int I_Faild_Login_UserUnRegister = -13002;

    public static final Key K_Faild_Login_UserUnRegister = new Key("login faild user unregister .");

    public static final Status S_Faild_Login_UserUnRegister = new Status(I_Faild_Login_UserUnRegister, K_Faild_Login_UserUnRegister);

    public static final int I_Faild_Login_UserOrPasswordIsError = -13003;

    public static final Key K_Faild_Login_UserOrPasswordIsError = new Key("login faild of user or password is error.");

    public static final Status S_Faild_Login_UserOrPasswordIsError = new Status(I_Faild_Login_UserOrPasswordIsError, K_Faild_Login_UserOrPasswordIsError);

    public static final int I_Faild_UserLoginTimeOut = -13004;

    public static final Key K_Faild_UserLoginTimeOut = new Key("login faild of user login out.");

    public static final Status S_Faild_Login_UserLoginTimeOut = new Status(I_Faild_UserLoginTimeOut, K_Faild_UserLoginTimeOut);


    public static final int I_Faild_Query = -14000;


    public static final Key K_Faild_Query = new Key("query faild .");


    public static final Status S_Faild_Query = new Status(I_Faild_Query, K_Faild_Query);


    public static final int I_Faild_QueryServices = -14001;


    public static final Key K_Faild_QueryServices = new Key("query faild of servicesfaild.");

    public static final Status S_Faild_QueryServices = new Status(I_Faild_QueryServices, K_Faild_QueryServices);

    public static final int I_Faild_QueryIdError = -14002;


    public static final Key K_Faild_QueryIdError = new Key("query faild of query id error.");


    public static final Status S_Faild_QueryIdError = new Status(I_Faild_QueryIdError, K_Faild_QueryIdError);

    public static final int I_Faild_QueryDataUnavailability = -14003;


    public static final Key K_Faild_QueryDataUnavailability = new Key("query  faild query data unavailability.");


    public static final Status S_Faild_QueryDataUnavailability = new Status(I_Faild_QueryDataUnavailability, K_Faild_QueryDataUnavailability);


    public static final int I_Faild_Query_SevicesIsNull = -14004;


    public static final Key K_Faild_Query_SevicesIsNull = new Key("query  faild sevices is null.");

    public static final Status S_Faild_Query_SevicesIsNull = new Status(I_Faild_Query_SevicesIsNull, K_Faild_Query_SevicesIsNull);


    public static final int I_Faild_Validation = -16000;


    public static final Key K_Faild_Validation = new Key("validation faild .");


    public static final Status S_Faild_Validation = new Status(I_Faild_Validation, K_Faild_Validation);


    public static final int I_Faild_Validation_DataUnavailability = -16001;


    public static final Key K_Faild_Validation_DataUnavailability = new Key("validation  faild data unavailability.");


    public static final Status S_Faild_Validation_DataUnavailability = new Status(I_Faild_Validation_DataUnavailability, K_Faild_Validation_DataUnavailability);


    public static final int I_Faild_Validation_SessionIdIsNull = -16002;


    public static final Key K_Faild_Validation_SessionIdIsNull = new Key("vaildation faild session id is null.");

    public static final Status S_Faild_Validation_SessionIdIsNull = new Status(I_Faild_Validation_SessionIdIsNull, K_Faild_Validation_SessionIdIsNull);


    public static final int I_Faild_Validation_SessionUnavailability = -16003;


    public static final Key K_Faild_Validation_SessionUnavailability = new Key("validation  faild session unavailability.");


    public static final Status S_Faild_Validation_SessionUnavailability = new Status(I_Faild_Validation_SessionUnavailability, K_Faild_Validation_SessionUnavailability);


    public static final int I_Faild_Validation_UserOperationQuick = -16004;


    public static final Key K_Faild_Validation_UserOperationQuick = new Key("validation faild user operation quick.");


    public static final Status S_Faild_Validation_UserOperationQuick = new Status(I_Faild_Validation_UserOperationQuick, K_Faild_Validation_UserOperationQuick);

    public static final int I_Faild_Validation_OperationTimeOut = -16005;


    public static final Key K_Faild_Validation_OperationTimeOut = new Key("validation faild operation timeout.");


    public static final Status S_Faild_Validation_OperationTimeOut = new Status(I_Faild_Validation_OperationTimeOut, K_Faild_Validation_OperationTimeOut);


    public final static int I_Unknown = -1;


    public static final Key K_Unknown = new Key("unknown.");


    public static final Status S_Unknown = new Status(I_Unknown, K_Unknown);
    private Key m_key = new Key("Unknown ");
    private int m_statusCode = I_Unknown;

    public int getStatusCode() {
        return m_statusCode;
    }


    public String getMessage() {
        return m_key.toString();
    }


    public boolean isSuccess() {
        if (m_statusCode > 0)
            return true;
        else
            return false;
    }

    private Status(int statusCode, Key key) {
        m_key = key;
        m_statusCode = statusCode;
    }

    public static Status query(int id, Key Key) {
        return new Status(id, Key);
    }

}
