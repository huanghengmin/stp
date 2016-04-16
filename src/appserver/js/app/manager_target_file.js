Ext.onReady(function(){
    Ext.BLANK_IMAGE_URL = '../../js/ext/resources/images/default/s.gif';
    Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget = 'side';
    var start = 0;			//分页--开始数
    var pageSize = 5;		//分页--每页数
    var internal_record = new Ext.data.Record.create([
	    {name:'appName',			mapping:'appName'},
	    {name:'appDesc',			mapping:'appDesc'},
	    {name:'appType',			mapping:'appType'},
        {name:'isActive',			mapping:'isActive'},
	    {name:'t_deleteFile',		mapping:'t_deleteFile'},
	    {name:'t_serverAddress',    	mapping:'t_serverAddress'},
	    {name:'t_port',				mapping:'t_port'},
	    {name:'t_userName',			mapping:'t_userName'},
	    {name:'t_charset',			mapping:'t_charset'},
	    {name:'t_dir',		            mapping:'t_dir'},
	    {name:'t_onlyAdd',			mapping:'t_onlyAdd'},
	    {name:'t_isTwoWay',			mapping:'t_isTwoWay'},
	    {name:'t_protocol',			mapping:'t_protocol'},
	    {name:'t_fileListSize',		mapping:'t_fileListSize'},
	    {name:'t_threads',			mapping:'t_threads'},
	    {name:'t_packetSize',		mapping:'t_packetSize'},
	    {name:'plugin',				mapping:'plugin'},
        {name:'deleteFlag',		    mapping:'deleteFlag'},
	    {name:'flag',				    mapping:'flag'}
    ]);
    var external_record = new Ext.data.Record.create([
	    {name:'appName',			mapping:'appName'},
	    {name:'appDesc',			mapping:'appDesc'},
	    {name:'appType',			mapping:'appType'},
        {name:'channel',			mapping:'channel'},
        {name:'channelport',	    mapping:'channelport'},
        {name:'isActive',			mapping:'isActive'},
	    {name:'deleteFile',			mapping:'deleteFile'},
	    {name:'serverAddress',		mapping:'serverAddress'},
	    {name:'port',				mapping:'port'},
	    {name:'userName',			mapping:'userName'},
	    {name:'charset',			mapping:'charset'},
	    {name:'dir',			    mapping:'dir'},
	    {name:'protocol',			mapping:'protocol'},
	    {name:'filterTypes',	    mapping:'filterTypes'},
	    {name:'notFilterTypes',		mapping:'notFilterTypes'},
	    {name:'interval',			mapping:'interval'},
	    {name:'isTwoWay',			mapping:'isTwoWay'},
	    {name:'isIncludeSubDir',	mapping:'isIncludeSubDir'},
	    {name:'fileListSize',		mapping:'fileListSize'},
	    {name:'threads',			mapping:'threads'},
	    {name:'packetSize',			mapping:'packetSize'},
	    {name:'plugin',				mapping:'plugin'},
        {name:'deleteFlag',		mapping:'deleteFlag'},
        {name:'status',			mapping:'status'},
        {name:'speed',			mapping:'speed'},
	    {name:'flag',				mapping:'flag'}
    ]);
    var internal_store = new Ext.data.GroupingStore({
        proxy : new Ext.data.HttpProxy({ url:'../../AppTypeAction_readInternalType.action?typeXml=internal' }),
        reader : new Ext.data.JsonReader({ totalProperty:'total', root:'rows' },internal_record)
    });

    var external_store = new Ext.data.GroupingStore({
        proxy : new Ext.data.HttpProxy({ url:'../../AppTypeAction_readExternalType.action?typeXml=external' }),
        reader : new Ext.data.JsonReader({ totalProperty:'total', root:'rows' },external_record)
    });

    var internal_boxM = new Ext.grid.CheckboxSelectionModel();   //复选框
    var internal_rowNumber = new Ext.grid.RowNumberer();         //自动 编号
    var internal_colM = new Ext.grid.ColumnModel([
//        internal_boxM,
        internal_rowNumber,
        {header:"应用编号",			dataIndex:"appName",			align:'center'},
        {header:"应用名",			    dataIndex:"appDesc",			align:'center'},
        {header:'启用状态',	        dataIndex:'isActive',		align:'center',renderer:show_isActive,width:50},
        {header:'通信协议',		dataIndex:'t_protocol',         align:'center',renderer:show_protocol,width:80},
        {header:'应用类型',		dataIndex:'appType',			    align:'center',width:50},
        {header:'文件服务器地址',		dataIndex:'t_serverAddress',	align:'center'},
        {header:'文件服务器端口',		dataIndex:'t_port',				align:'center'},
        {header:'登录名',		dataIndex:'t_userName',			align:'center'},
        {header:'编码',		dataIndex:'t_charset',			align:'center'},
        {header:'根目录',		dataIndex:'t_dir',				align:'center'},
        {header:'只能增加',	dataIndex:'t_onlyAdd',			align:'center'},
        {header:'删除文件',	dataIndex:'t_deleteFile',		align:'center',renderer:show_is},
        {header:'源、目标',			dataIndex:'plugin',				align:'center',		renderer:showURL_plugin},
        {header:'操作标记',			dataIndex:'flag',				align:'center',		renderer:internal_showURL_flag,        width:200}
    ]);
    var external_boxM = new Ext.grid.CheckboxSelectionModel();   //复选框
    var external_rowNumber = new Ext.grid.RowNumberer();         //自动 编号
    var external_colM = new Ext.grid.ColumnModel([
//        external_boxM,
        external_rowNumber,
        {header:"应用编号",		dataIndex:"appName",			align:'center'},
        {header:"应用名",			dataIndex:"appDesc",			align:'center'},
        {header:"传输速度",			    dataIndex:"speed",     align:'center',sortable:true,renderer:showURL_speed},
        {header:'通道',			dataIndex:'channel',	    align:'center',sortable:true,menuDisabled:true,       renderer:showURL_channel},
        {header:'通道端口',			dataIndex:'channelport',		align:'center',          width:50},
        {header:'启用状态',	    dataIndex:'isActive',		align:'center',renderer:show_isActive,width:50},
        {header:'通信协议',		dataIndex:'protocol',        align:'center',renderer:show_protocol,width:80},
        {header:'应用类型',		dataIndex:'appType',			align:'center',width:50},
        {header:'文件服务器地址',		dataIndex:'serverAddress',	align:'center'},
        {header:'文件服务器端口',		dataIndex:'port',				align:'center'},
        {header:'登录名',		dataIndex:'userName',		align:'center'},
        {header:'编码',		dataIndex:'charset',			align:'center'},
        {header:'根目录',		dataIndex:'dir',             	align:'center'},
        {header:'频率',			dataIndex:'interval',		align:'center'},
        {header:'包含子目录',	dataIndex:'isIncludeSubDir',align:'center',renderer:show_is},
        {header:'删除文件',	dataIndex:'deleteFile',		align:'center',renderer:show_is},
        {header:'过滤类型',	dataIndex:'filterTypes',     align:'center'},
        {header:'非过滤类型',	dataIndex:'notFilterTypes', align:'center'},

        {header:'源、目标',			dataIndex:'plugin',		align:'center',renderer:showURL_plugin},
        {header:'操作标记',			dataIndex:'flag',			align:'center',renderer:external_showURL_flag}
    ]);

    for(var i=5;i<13;i++){
        internal_colM.setHidden(i,!internal_colM.isHidden(i));
    }

    for(var i=7;i<18;i++){
        external_colM.setHidden(i,!external_colM.isHidden(i));
    }

    internal_colM.defaultSortable = true;
    external_colM.defaultSortable = true;
    var internal_grid_panel = new Ext.grid.GridPanel({
        id:'grid.file.internal.info',
        title:'<center><font size="4">可信端</font></center>',
        animCollapse:true,
        height:setHeight(),
        width:setWidth(),
        loadMask:{msg:'正在加载数据，请稍后...'},
        border:false,
        collapsible:false,
        cm:internal_colM,
//        sm:internal_boxM,
        store:internal_store,
        stripeRows:true,
        autoExpandColumn:2,
        disableSelection:true,
        bodyStyle:'width:100%',
        selModel:new Ext.grid.RowSelectionModel({singleSelect:true}),
        viewConfig:{
            forceFit:true,
            enableRowBody:true,
            getRowClass:function(record,rowIndex,p,store){
                return 'x-grid3-row-collapsed';
            }
        },
        tbar:[
            new Ext.Button({
                id:'btnAdd.file.internal.info',
                text:'新增',
                iconCls:'add',
                handler:function(){
                    internal_insert_file_win(internal_grid_panel,internal_store);
                }
            }),
            {xtype:"tbseparator"},
            new Ext.Button({
                id : 'btnCopy.inner',
                text:'存档',
                iconCls:'copy',
                handler:function(){
                    var myMask = new Ext.LoadMask(Ext.getBody(),{
                        msg : '正在处理,请稍后...',
                        removeMask : true
                    });
                    myMask.show();
                    Ext.Ajax.request({
                        url:'../../AppTypeAction_readXmlRootDesc.action',
                        params:{type:'internal'},
                        success:function(response,option){
                            var respText = Ext.util.JSON.decode(response.responseText);
                            var description = respText.desc;
                            var msg = respText.msg;
                            myMask.hide();
                            if(msg=='true'){
                                var message;
                                if(description==null||description==''||description=='null'){
                                    message = "存档当前配置文件(可信/非可信)？<br><font color='#808080'>可以输入描述信息用于说明存档后的配置(可选)!</font>";
                                } else {
                                    message = "存档当前配置文件描述信息:<font color='green'>"+description+"</font><br>存档当前配置文件(可信/非可信)？<br><font color='#808080'>可以输入描述信息用于说明存档后的配置(可选)!</font>";
                                }
                                Ext.MessageBox.show({
                                    title:'信息',
                                    msg:message,
                                    prompt:true,
                                    animEl:'btnCopy.inner',
                                    width:350,
                                    buttons:{'ok':'确定','no':'取消'},
                                    icon:Ext.MessageBox.WARNING,
                                    closable:false,
                                    fn:function(e,text){
                                        if(e=='ok'){
                                            var myMask = new Ext.LoadMask(Ext.getBody(),{
                                                msg:'正在存档,请稍后...',
                                                removeMask:true
                                            });
                                            myMask.show();
                                            Ext.Ajax.request({
                                                url:'../../AppTypeAction_toFile.action',
                                                params:{text:text,type:'internal'},
                                                success:function(r,o){
                                                    var respText = Ext.util.JSON.decode(r.responseText);
                                                    var msg = respText.msg;
                                                    myMask.hide();
                                                    Ext.MessageBox.show({
                                                        title:'信息',
                                                        msg:msg,
                                                        animEl:'btnCopy.inner',
                                                        buttons:{'ok':'确定'},
                                                        icon:Ext.MessageBox.INFO,
                                                        closable:false
                                                     });
                                                }
                                            });
                                        }
                                    }
                                });
                            }else {
                                Ext.MessageBox.show({
                                    title:'信息',
                                    msg:msg,
                                    animEl:'btnCopy.inner',
                                    width:300,
                                    buttons:{'ok':'确定'},
                                    icon:Ext.MessageBox.WARNING,
                                    closable:false
                                });
                            }
                        }
                    });
                }
            })
        ],
        view:new Ext.grid.GroupingView({
            forceFit:true,
            groupingTextTpl:'{text}({[values.rs.length]}条记录)'
        }),
        bbar:new Ext.PagingToolbar({
            pageSize : pageSize,
            store:internal_store,
            displayInfo:true,
            displayMsg:"显示第{0}条记录到第{1}条记录，一共{2}条",
            emptyMsg:"没有记录",
            beforePageText:"当前页",
            afterPageText:"共{0}页"
        })
    }); 
    
    var external_grid_panel= new Ext.grid.GridPanel({
        id:'grid.file.external.info',
        title:'<center><font size="4">非可信端</font></center>',
        animCollapse:true,
        height:setHeight(),
        width:setWidth(),
        loadMask:{msg:'正在加载数据，请稍后...'},
        border:false,
        collapsible:false,
        cm:external_colM,
//        sm:external_boxM,
        store:external_store,
        stripeRows:true,
        autoExpandColumn:2,
        disableSelection:true,
        bodyStyle:'width:100%',
        enableDragDrop: true,
        selModel:new Ext.grid.RowSelectionModel({singleSelect:true}),
        viewConfig:{
            forceFit:true,
            enableRowBody:true,
            getRowClass:function(record,rowIndex,p,store){
                return 'x-grid3-row-collapsed';
            }
        },
        view:new Ext.grid.GroupingView({
            forceFit:true,
            groupingTextTpl:'{text}({[values.rs.length]}条记录)'
        }),
        bbar:new Ext.PagingToolbar({
            pageSize : pageSize,
            store:external_store,
            displayInfo:true,
            displayMsg:"显示第{0}条记录到第{1}条记录，一共{2}条",
            emptyMsg:"没有记录",
            beforePageText:"当前页",
            afterPageText:"共{0}页"
        })
    }); 
    var port = new Ext.Viewport({
        layout:'fit',
        renderTo:Ext.getBody(),
        items:[{
            autoScroll:true,
            items:[internal_grid_panel,external_grid_panel]
        }]
    });
    internal_store.load({params:{ start:start,limit:pageSize,appType:'file' } });
    external_store.load({params:{ start:start,limit:pageSize,appType:'file' } });
    external_store.on('load',function(){
        for(var i = 0; i < external_store.getCount(); i ++){
            var record = external_store.getAt(i);
            if(record.data.status!=0||record.data.status!='0'){
                Ext.MessageBox.show({
                    title:'信息',
                    width:350,
                    msg:'<font color="green">非可信端存在新增或已更新的应用</br>注意处理[存在更新]所对应的可信应用</font>',
                    buttons:{'ok':'确定'},
                    icon:Ext.MessageBox.WARNING,
                    closable:false
                });
                break;
            }
        }
    });
});
//============================================ -- javascript function -- =============================================================================
function setHeight(){
	var h = document.body.clientHeight-8;
	return h/2;
}

function setWidth(){
    return document.body.clientWidth-8;
}

function setGroupRadio(id,field,i){
	var a = Ext.getCmp(id);
	return a.find(field)[i].getValue();
}

function showURL_speed(value){
    return value + ' 毫秒'
}

function showURL_channel(value){
    if(value==1||value=='1'){
        return "通道一";
    } else if(value==2||value=='2'){
        return "通道二";
    }
}

function show_isActive(value){
    if(value == 'true' || value==true){
    	return '<img src="../../img/icon/ok.png" alt="启动" title="运行中" />';
    }else if(value == 'false' || value == false){
    	return '<img src="../../img/icon/off.gif" alt="停止" title="未运行"/>';
    }
}

function show_is(value){
    if(value=='true'||value == true){
        return '是';
    }else if(value == 'false' || value == false){
        return '否';
    }else if(value == '' || value == null){
    	return '否';
    }
}
function show_protocol(value){
	if(value == 'ftp'){
		return 'FTP文件传输协议';
	}else if(value == 'ftpdown'){
		return 'FTPS文件传输协议(备份)';
	}else if(value == 'ftps'){
		return 'FTPS文件传输协议';
	}else if(value=='smb'){
		return '共享文件传输协议(SMB)';
	}else if(value=='WebDAV'){
		return 'WebDAV文件传输协议';
	}
}
function showURL_plugin(value){
    if(value == 0){
		return "数据源/目标";
	}else if(value == 1){
		return "数据源";
	}else if(value == 2){
		return "数据目标";
	}else if(value == 3){
		return "错误";
	}
}

function internal_showURL_flag(value,p,r){
    var deleteType;
    if(r.get('deleteFlag')) {
        deleteType = "<a href='javascript:;' style='color: green;' onclick='internal_delete_file_row();'>删除应用</a>";
    } else {
        deleteType = "<font color='gray'>等待删除</font>";
    }
    if(value=='flag_0'){
        return "<a href='javascript:;' style='color: green;' onclick='internal_detail_file_win();'>详细</a>&nbsp;&nbsp;&nbsp;&nbsp;"+deleteType+"&nbsp;&nbsp;&nbsp;&nbsp;<a href='javascript:;' style='color: green;' onclick='internal_update_file_app_win();'>修改应用</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href='javascript:;' style='color: green;' onclick='internal_update_file_target_win();'>修改目标数据</a>";
    }else if(value=='flag_1'){
        return "<a href='javascript:;' style='color: green;' onclick='internal_detail_file_win();'>详细</a>&nbsp;&nbsp;&nbsp;&nbsp;"+deleteType+"&nbsp;&nbsp;&nbsp;&nbsp;<a href='javascript:;' style='color: green;' onclick='internal_update_file_app_win();'>修改应用</a>&nbsp;&nbsp;&nbsp;&nbsp;<font color='gray'>修改目标数据</font>";
    }else if(value=='flag_2'){
        return "<a href='javascript:;' style='color: green;' onclick='internal_detail_file_win();'>详细</a>&nbsp;&nbsp;&nbsp;&nbsp;"+deleteType+"&nbsp;&nbsp;&nbsp;&nbsp;<a href='javascript:;' style='color: green;' onclick='internal_update_file_app_win();'>修改应用</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href='javascript:;' style='color: green;' onclick='internal_update_file_target_win();'>修改目标数据</a>";
    }else if(value=='flag_3'){
        return "<a href='javascript:;' style='color: green;' onclick='internal_detail_file_win();'>详细</a>&nbsp;&nbsp;&nbsp;&nbsp;"+deleteType+"&nbsp;&nbsp;&nbsp;&nbsp;<a href='javascript:;' style='color: green;' onclick='internal_update_file_app_win();'>修改应用</a>&nbsp;&nbsp;&nbsp;&nbsp;<font color='gray'>修改目标数据</font>";
    }
}

/********************************************* -- external function -- ******************************************************************************/

function external_showURL_flag(value,p,r){
    var status = r.get('status');
    var initStatus;
    if(status!=0||status!='0'){
        initStatus = "<a href='javascript:;' style='color: green;' onclick='external_update_status();'>存在更新</a>";
    } else {
        initStatus = "<font color='gray'>暂无更新</font>";
    }
    return "<a href='javascript:;' style='color: green;' onclick='external_detail_file_win();'>详细</a>" +
        "&nbsp;&nbsp;&nbsp;&nbsp;" + initStatus ;
}

var dataProtocol = [['ftp','FTP文件传输协议'],['ftpdown','FTP文件传输协议(备份)'],['smb','共享文件传输协议(SMB)'],['ftps','FTPS文件传输协议'],['WebDAV','WebDAV文件传输协议']];

var dataCharset = [['GBK','GBK'],['GB2312','GB2312'],['GB18030','GB18030'],['UTF-8','UTF-8'],['UTF-16','UTF-16']];
var dataFilterTypes = [['*.dat','*.dat'],['*.doc','*.doc'],['*.exe','*.exe'],['*.pdf','*.pdf'],['*.ppt','*.ppt'],['*.rar','*.rar'],['*.txt','*.txt'],['*.xml','*.xml'],['*.xls','*.xls'],['*.*','*.*']];
var targetAppName_record = new Ext.data.Record.create([{name:'value',mapping:'value'},{name:'key',mapping:'key'}]);
var targetAppName_reader = new Ext.data.JsonReader({ totalProperty:'total',root:"rows"},targetAppName_record);
var storeCharset = new Ext.data.SimpleStore({fields:['value','key'],data:dataCharset});
var storeProtocol = new Ext.data.SimpleStore({fields:['value','key'],data:dataProtocol});
var storeFilterTypes = new Ext.data.SimpleStore({fields:['value','key'],data:dataFilterTypes});
var storeNotFilterTypes = new Ext.data.SimpleStore({fields:['value','key'],data:dataFilterTypes});

/**
   新增文件同步应用
 */
function internal_insert_file_win(grid,store){
    var targetAppName_store = new Ext.data.Store({
        url:"../../AppTypeAction_readTargetAppNameKeyValue.action",
        reader:targetAppName_reader
    });
    targetAppName_store.load({ params:{appType:'file'} });
    //应用属性配置
     var form1 = new Ext.form.FormPanel({
         id:'card-0',
         frame:true,
         labelAlign:'right',
         autoScroll:true,
         labelWidth:130,
         defaults:{
             width:200,
             allowBlank:false,
             blankText:'该项不能为空！'
         },
         items:[{
          	 width:350,
             title:'应用属性配置  -- 使用说明',
             xtype:'fieldset',
             html:"<font color='green'>1.所有项为必填项;</font>"
         },{
             fieldLabel:"应用源类型",
             xtype:'displayfield',
             value:'数据目标'
         },{
             id:"internal.plugin.info",
             name:'typeBase.plugin',
             xtype:'hidden',
             value:'2'
         },{
             fieldLabel:"配置类型",
             xtype:'displayfield',
             value:'可信'
         },{
             xtype:'hidden',
             name:'typeBase.privated',
             value:true
         },{
             fieldLabel:"应用类型",
             xtype:'displayfield',
             value:'文件同步'
         },{
             xtype:'hidden',
             name:'typeBase.appType',
             value:'file'
         },{
             id:'appName.internal.info',
             fieldLabel:"应用编号",
             xtype:'combo',
             hiddenName:'typeBase.appName',
             mode:'local',
             emptyText :'--请选择--',
             editable : false,
             typeAhead:true,
             forceSelection: true,
             triggerAction:'all',
             displayField:"key",valueField:"value",
             store:targetAppName_store
         },{
        	 id:'internal.appDesc.info',
             fieldLabel:"应用名",
             xtype:'textfield',
             name:'typeBase.appDesc',
             regex:/^.{2,30}$/,
             regexText:'请输入任意2--30个字符',
             emptyText:'请输入任意2--30个字符'
         }]
    });
    //目标端属性配置
    var form2 = new Ext.form.FormPanel({
    	id:'card-1',
        frame:true,
        labelAlign:'right',
        autoScroll:true,
        labelWidth:150,
        defaults:{
            width:200,
            allowBlank:false,
            blankText:'该项不能为空！'
        },
        items:[{
            id:'protocol.info',
        	fieldLabel:"通信协议", hiddenName:'typeFile.protocol',
        	xtype:'combo',
        	mode:'local',
        	emptyText :'--请选择--',
        	editable : false,
        	typeAhead:true,
        	forceSelection: true,
        	triggerAction:'all',
        	displayField:"key",valueField:"value",
        	store: storeProtocol,
            listeners:{
                focus:function(){
                    Ext.getCmp('card-finish').hide();
                    Ext.getCmp('card-test').show();
                },
                select : function() {
                    var protocol = this.getValue();
                    var port = '';
                    if(protocol == 'ftp'){
                        port = 21;
                    } else if(protocol == 'ftps'){

                    } else if(protocol == 'smb'){
                        port = 445;
                    } else if(protocol == 'WebDAV'){
                        port = 8888;
                    } else if( protocol == 'ftpdown'){
                        port = 21;
                        Ext.getCmp('threads.info').setValue(5);
                    }
                    Ext.getCmp('port.info').setValue(port);
                }
            }
        },{
        	fieldLabel:'文件服务器地址',
        	xtype:'textfield',
        	name:'typeFile.serverAddress',
            regex:/^(((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9]))$/,
            regexText:'这个不是Ip(例:1.1.1.1)',
            emptyText:'请输入Ip(例:1.1.1.1)',
            listeners:{
                focus:function(){
                    Ext.getCmp('card-finish').hide();
                    Ext.getCmp('card-test').show();
                }
            }
        },{
            id:'port.info',
        	fieldLabel:'文件服务器端口',
        	xtype:'textfield',
        	name:'typeFile.port',
            regex:/^(6553[0-6]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{3}|[1-9][0-9]{2}|[1-9][0-9]|[1-9])$/,
            regexText:'这个不是端口类型1~65536',
            emptyText:'请输入端口1~65536',
            listeners:{
                focus:function(){
                    Ext.getCmp('card-finish').hide();
                    Ext.getCmp('card-test').show();
                }
            }
        },{
            fieldLabel:'登录名',
            xtype:'textfield',
            name:'typeFile.userName',
            allowBlank:true,
            regex:/^[A-Za-z0-9!#$%^&*~]{0,16}$/,
            regexText:'请输入0--30个字符(可以包含A-Za-z0-9!#$%^&*~),或者为空',
            listeners:{
                focus:function(){
                    Ext.getCmp('card-finish').hide();
                    Ext.getCmp('card-test').show();
                }
            }
        },{
            fieldLabel:'密码',
            xtype:'textfield',
            inputType:'password',
            name:'typeFile.password',
            allowBlank:true,
            regex:/^[A-Za-z0-9!#$%^&*.~]{0,16}$/,
            regexText:'密码是1-16位(可以包含A-Za-z0-9!#$%^&*.~),或者为空',
            listeners:{
                focus:function(){
                    Ext.getCmp('card-finish').hide();
                    Ext.getCmp('card-test').show();
                }
            }
        },{
        	fieldLabel:"根目录",
            xtype:'textfield',
        	name:'typeFile.dir',
            value:'/',
        	regex:/^([\/].*)*$/,
        	regexText:'这个不是目录',
        	emptyText:'请输入目录',
            listeners:{
                focus:function(){
                    Ext.getCmp('card-finish').hide();
                    Ext.getCmp('card-test').show();
                }
            }
        },{
        	fieldLabel:"编码", hiddenName:'typeFile.charset',
        	xtype:'combo',
        	mode:'local',
        	emptyText :'--请选择--',
        	editable : false,
        	typeAhead:true,
        	forceSelection: true,
        	triggerAction:'all',
        	displayField:"key",valueField:"value",
        	store: storeCharset,
            listeners:{
                focus:function(){
                    Ext.getCmp('card-finish').hide();
                    Ext.getCmp('card-test').show();
                }
            }
        },{
            fieldLabel:"删除文件",
            layout:'column',
            defaultType: 'radio',
            items: [
                { width:50, boxLabel: '是', name: 'typeFile.deleteFile', inputValue: true},
                { width:50, boxLabel: '否', name: 'typeFile.deleteFile', inputValue: false,  checked: true  }
            ]
        },{
            fieldLabel:"只能增加",
            layout:'column',
            defaultType: 'radio',
            items: [
                { width:50, boxLabel: '是', name: 'typeFile.isOnlyAdd', inputValue: true },
                { width:50, boxLabel: '否', name: 'typeFile.isOnlyAdd', inputValue: false,  checked: true  }
            ]
        },{
            hidden:true,
            layout:'column',
            defaultType: 'radio',
            items: [
                { width:50, boxLabel: '是', name: 'typeFile.isTwoWay', inputValue: true},
                { width:50, boxLabel: '否', name: 'typeFile.isTwoWay', inputValue: false,  checked: true  }
            ]
        /*},{
        	fieldLabel:'处理线程数',
            xtype:'displayfield',
        	name:'typeFile.threads',
        	value: 1
        },{
        	fieldLabel:'分批数',
            xtype:'displayfield',
        	name:'typeFile.fileListSize',
        	value: 200
        },{
        	fieldLabel:'单次发送数据包大小',
            xtype:'displayfield',
        	name:'typeFile.packetSize',
        	value: '2MB'*/
        },{
            id:'threads.info',
            xtype:'hidden',
        	name:'typeFile.threads',
        	value : 1
        },{
            xtype:'hidden',
        	name:'typeFile.fileListSize',
        	value : 200
        },{
            xtype:'hidden',
        	name:'typeFile.packetSize',
        	value : 2    
        }]
    });
    var card = new Ext.Panel({
        id:'card-wizard-panel',
        layout:'card',
        activeItem:0,
        layoutConfig:{
            animate:true
        },
        bbar:['->',{
            id:'card-prev',
            text:'上一页',
            handler:internal_CardNav.createDelegate(this,[-1]),
            disabled:true
        },{
            id:'card-next',
            text:'下一页',
            handler:internal_CardNav.createDelegate(this,[+1])
        },{
            id:'card-test',
            text:'测试',
            handler:function(){
                if (form1.form.isValid()&&form2.form.isValid()) {
                    var appName = Ext.getCmp('appName.internal.info').getValue();
                    var appDesc = Ext.getCmp('internal.appDesc.info').getValue();
                    form2.getForm().submit({
                        url :'../../FileTypeAction_testConnect.action',
                        params:{
                            appName:appName,appDesc:appDesc,privated:true,plugin:'2',appType:'file',isActive:false
                        },
                        method :'POST',
                        waitTitle :'系统提示',
                        waitMsg :'正在测试,请稍后...',
                        success : function(form,action) {
                            var msg = action.result.msg;
                            var flag = action.result.flag;
                            Ext.MessageBox.show({
                                title:'信息',
                                width:260,
                                msg:msg,
                                animEl:'card-test',
                                buttons:{'ok':'确定'},
                                icon:Ext.MessageBox.INFO,
                                closable:false,
                                fn:function(e){
                                    if(e=='ok'){
                                        if(flag) {
                                            Ext.getCmp('card-test').hide();
                                            Ext.getCmp('card-finish').show();
                                        }
                                    }
                                }
                            });
                        }
                    });
                } else {
                    Ext.MessageBox.show({
                        title:'信息',
                        width:200,
                        msg:'请填写完成再提交!',
                        animEl:'card-test',
                        buttons:{'ok':'确定'},
                        icon:Ext.MessageBox.ERROR,
                        closable:false
                    });
                }
            }
        },{
            id: "card-finish",
            text: "保存",
            hidden:true,
            handler: function() {
                if (form1.form.isValid()&&form2.form.isValid()) {
                    var appName = Ext.getCmp('appName.internal.info').getValue();
                    var appDesc = Ext.getCmp('internal.appDesc.info').getValue();
                    form2.getForm().submit({
                        url:'../../FileTypeAction_insert.action',
                        params:{
                            appName:appName,appDesc:appDesc,privated:true,plugin:'2',appType:'file',isActive:false
                        },
                        method :'POST',
                        waitTitle :'系统提示',
                        waitMsg :'正在保存,请稍后...',
                        success : function(form,action) {
                            var msg = action.result.msg;
                            Ext.MessageBox.show({
                                title:'信息',
                                width:260,
                                msg:msg,
                                animEl:'card-finish',
			                    buttons:{'ok':'确定','no':'取消'},
                                icon:Ext.MessageBox.INFO,
                                closable:false,
                                fn:function(e){
                                    if(e=='ok'){
                                        grid.render();
                                        store.reload();
                                        win.close();
                                    }
                                }
                            });
                        }
                    });
                }else{
                    Ext.MessageBox.show({
                        title:'信息',
                        width:200,
                        msg:'请填写完成再提交!',
                        animEl:'card-finish',
                        buttons:{'ok':'确定'},
                        icon:Ext.MessageBox.ERROR,
                        closable:false
                    });
                }
            }
        }],
        items:[form1,form2]
    });
    var win = new Ext.Window({
        title:"新增信息-可信文件同步应用",
        width:430,
        height:350,
        layout:'fit',
        modal:true,
        items:card,
        listeners :{
        	show:function(){
                Ext.getCmp('card-finish').hide();
                Ext.getCmp('card-test').show();
            }
        }
    }).show();
}
function internal_CardNav(incr){
    var cardPanel = Ext.getCmp('card-wizard-panel').getLayout();
    var i = cardPanel.activeItem.id.split('card-')[1];
    var next = parseInt(i)+incr;
    cardPanel.setActiveItem(next);
    Ext.getCmp('card-prev').setDisabled(next==0);
    Ext.getCmp('card-next').setDisabled(next==1);
}
/**
 * 删除文件同步应用
 */
function internal_delete_file_row(){
    var grid = Ext.getCmp('grid.file.internal.info');
    var store = grid.getStore();
    var selModel = grid.getSelectionModel();
    var count = selModel.getCount();
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
            var appName = item.data.appName;
            Ext.MessageBox.show({
                title:'信息',
                msg:'<font color="green">确定要删除所选记录？</font>',
                width:300,
                buttons:{'ok':'确定','no':'取消'},
                icon:Ext.MessageBox.INFO,
                closable:false,
                fn:function(e){
                    if(e == 'ok'){
                        var myMask = new Ext.LoadMask(Ext.getBody(),{
                            msg:'正在删除,请稍后...',
                            removeMask:true
                        });
                        myMask.show();
                        Ext.Ajax.request({
                            url : '../../FileTypeAction_delete.action',             // 删除 连接 到后台
                            params :{appName : appName,plugin : 'internal',deleteType:1},
                            success : function(r,o){
                                myMask.hide();
                                var respText = Ext.util.JSON.decode(r.responseText);
                                var msg = respText.msg;
                                Ext.MessageBox.show({
                                    title:'信息',
                                    msg:msg,
                                    animEl:'btnRemove.proxy.internal.info',
                                    buttons:{'ok':'确定'},
                                    icon:Ext.MessageBox.INFO,
                                    closable:false,
                                    fn:function(e){
                                        if(e=='ok'){
                                            grid.render();
                                            store.reload();
                                        }
                                    }
                                });
                            }
                        });
                    }
                }
            });
        });
    }
}

/**
 * 修改 应用
 */
function internal_update_file_app_win(){
    var grid = Ext.getCmp('grid.file.internal.info');
    var store = Ext.getCmp('grid.file.internal.info').getStore();
    var selModel = grid.getSelectionModel();
    var formPanel;
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
            formPanel  = new Ext.form.FormPanel({
                id:'internal.card-0.update',
                frame:true,
                labelAlign:'right',
                autoScroll:true,
                labelWidth:130,
                defaults:{
                    width:200,
                    allowBlank:false,
                    blankText:'该项不能为空！'
                },
                items:[{
                	fieldLabel:"应用源类型",
                	xtype:'displayfield',
                	value:'数据源'
                },{
                    fieldLabel:"配置类型",
                    xtype:'displayfield',
                    value:'可信'
                },{
                    xtype:'hidden',
                    name:'typeBase.plugin',
                    value:'2'
                },{
                    xtype:'hidden',
                    name:'typeBase.privated',
                    value:true
                },{
                    fieldLabel:"应用类型",
                    xtype:'displayfield',
                    value:'文件同步'
                },{
                    xtype:'hidden',
                    name:'typeBase.appType',
                    value:'file'
                },{
                    fieldLabel:"应用编号",
                    xtype:'displayfield',
                    value:item.data.appName
                },{
                    xtype:'hidden',
                    name:'typeBase.appName',
                    value:item.data.appName
                },{
                    fieldLabel:"应用名",
                    xtype:'textfield',
                    name:'typeBase.appDesc',
                    value:item.data.appDesc,
                    regex:/^.{2,30}$/,
                    regexText:'请输入任意2--30个字符',
                    emptyText:'请输入任意2--30个字符'
                }]
            });
        });
    }
    var win = new Ext.Window({
        title:"修改信息-可信文件同步应用",
        width:430,
        height:300,
        layout:'fit',
        modal:true,
        items: [formPanel],
        bbar:[
            new Ext.Toolbar.Fill(),
            new Ext.Button ({
                id:'internal.update.app.win.info',
                text : '修改',
                formBind:true,
                allowDepress : false,
                handler : function() {
                    if (formPanel.form.isValid()) {
                        Ext.MessageBox.show({
                    		title:'信息',
                            width:200,
                            msg:'确定要修改?',
                            animEl:'internal.update.app.win.info',
                            buttons:{'ok':'确定','no':'取消'},
                            icon:Ext.MessageBox.WARNING,
                            closable:false,
                            fn:function(e){
                            	if(e=='ok'){
                            		formPanel.getForm().submit({
			                            url :'../../FileTypeAction_update.action',
			                            method :'POST',
			                            waitTitle :'系统提示',
			                            waitMsg :'正在修改,请稍后...',
			                            success : function(form,action) {
                                            var msg = action.result.msg;
			                                Ext.MessageBox.show({
			                                    title:'信息',
			                                    width:260,
			                                    msg:msg,
			                                    animEl:'internal.update.app.win.info',
			                                    buttons:{'ok':'确定','no':'取消'},
			                                    icon:Ext.MessageBox.INFO,
			                                    closable:false,
			                                    fn:function(e){
			                                        if(e=='ok'){
			                                            grid.render();
			                                            store.reload();
			                                            win.close();
			                                        }
			                                    }
			                                });
			                            }
			                        });
                            	}
                          	}
                        });
                    } else {
                        Ext.MessageBox.show({
                            title:'信息',
                            width:200,
                            msg:'请填写完成再提交!',
                            animEl:'internal.update.app.win.info',
                            buttons:{'ok':'确定'},
                            icon:Ext.MessageBox.ERROR,
                            closable:false
                        });
                    }
                }
            }),
            new Ext.Button ({
                allowDepress : false,
                handler : function() {win.close();},
                text : '关闭'
            })
        ]
    }).show();
}

/**
 * 修改 目标数据
 */
function internal_update_file_target_win(){
    var grid = Ext.getCmp('grid.file.internal.info');
    var store = Ext.getCmp('grid.file.internal.info').getStore();
    var selModel = grid.getSelectionModel();
    var formPanel;
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
        	var deleteFile = item.data.t_deleteFile;
            var onlyAdd = item.data.t_onlyAdd;
            var isTwoWay = item.data.t_isTwoWay;
            var deleteFileT;
            var deleteFileF;
            var onlyAddT;
            var onlyAddF;
            var isTwoWayT;
            var isTwoWayF;
            if(deleteFile=='true'||deleteFile==true){
                deleteFileT = true;
                deleteFileF = false;
            }else if(deleteFile=='false'||deleteFile == false){
                deleteFileT = false;
                deleteFileF = true;
            }
            if(onlyAdd=='true'||onlyAdd==true){
                onlyAddT = true;
                onlyAddF = false;
            }else if(onlyAdd=='false'||onlyAdd == false){
                onlyAddT = false;
                onlyAddF = true;
            }
            if(isTwoWay=='true'||isTwoWay==true){
            	isTwoWay = true;
            	isTwoWay = false;
            }else if(isTwoWay=='false'||isTwoWay==true){
            	isTwoWayT = false;
            	isTwoWayF = true;
            }
            formPanel  = new Ext.form.FormPanel({
                id:'internal.card-2.update',
                frame:true,
                labelAlign:'right',
                autoScroll:true,
                labelWidth:150,
                defaults:{
                    width:200,
                    allowBlank:false,
                    blankText:'该项不能为空！'
                },
                items:[{
                	xtype:'hidden',
                	name:'typeBase.privated',
                	value:true
                },{
                	xtype:'hidden',
                	name:'typeBase.appName',
                	value:item.data.appName
                },{
                    xtype:'hidden',
                	name:'typeBase.plugin',
                	value:item.data.plugin
                },{
                	fieldLabel:"通信协议", hiddenName:'typeFile.protocol',value:item.data.t_protocol,
                	xtype:'combo',
                	mode:'local',
                	emptyText :'--请选择--',
                	editable : false,
                	typeAhead:true,
                	forceSelection: true,
                	triggerAction:'all',
                	displayField:"key",valueField:"value",
                	store: storeProtocol,
                    listeners:{
                        focus:function(){
                            Ext.getCmp('internal.update.target.win.info').hide();
                            Ext.getCmp('internal.update.target.win.test.info').show();
                            var protocol = this.getValue();
                            var port = '';
                            if(protocol == 'ftp'){
                                port = 21;
                            } else if(protocol == 'ftps'){

                            } else if(protocol == 'smb'){
                                port = 445;
                            } else if(protocol == 'WebDAV'){
                                port = 8888;
                            } else if( protocol == 'ftpdown'){
                                port = 21;
                                Ext.getCmp('threads.info').setValue(5);
                            }
                            Ext.getCmp('port.info').setValue(port);
                        }
                    }
                },{
                    fieldLabel:'文件服务器地址',
                    xtype:'textfield',
                    name:'typeFile.serverAddress',
                    value:item.data.t_serverAddress,
                    regex:/^(((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9]))$/,
                    regexText:'这个不是Ip(例:1.1.1.1)',
                    emptyText:'请输入Ip(例:1.1.1.1)',
                    listeners:{
                        focus:function(){
                            Ext.getCmp('internal.update.target.win.info').hide();
                            Ext.getCmp('internal.update.target.win.test.info').show();
                        }
                    }
                },{
                    fieldLabel:'文件服务器端口',
                    xtype:'textfield',
                    name:'typeFile.port',
                    value:item.data.t_port,
                    regex:/^(6553[0-6]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{3}|[1-9][0-9]{2}|[1-9][0-9]|[1-9])$/,
                    regexText:'这个不是端口类型1~65536',
                    emptyText:'请输入端口1~65536',
                    listeners:{
                        focus:function(){
                            Ext.getCmp('internal.update.target.win.info').hide();
                            Ext.getCmp('internal.update.target.win.test.info').show();
                        }
                    }
                },{
                    fieldLabel:'登录名',
                    xtype:'textfield',
                    name:'typeFile.userName',
                    value:item.data.t_userName,
                    allowBlank:true,
                    regex:/^[A-Za-z0-9!#$%^&*~]{0,16}$/,
                    regexText:'请输入0--30个字符(可以包含A-Za-z0-9!#$%^&*~),或者为空',
                    listeners:{
                        focus:function(){
                            Ext.getCmp('internal.update.target.win.info').hide();
                            Ext.getCmp('internal.update.target.win.test.info').show();
                        }
                    }
                },{
                    fieldLabel:'密码',
                    xtype:'textfield',
                    inputType:'password',
                    name:'typeFile.password',
                    allowBlank:true,
//                    regex:/^(.{0,16})$/,
                    regex:/^[A-Za-z0-9!#$%^&*.~]{0,16}$/,
                    regexText:'密码是1-16位(包含A-Za-z0-9!#$%^&*.~),或者为空',
                    listeners:{
                        focus:function(){
                            Ext.getCmp('internal.update.target.win.info').hide();
                            Ext.getCmp('internal.update.target.win.test.info').show();
                        }
                    }
                },{
                    fieldLabel:"根目录",
                    xtype:'textfield',
                    name:'typeFile.dir',
                    value:item.data.t_dir,
                    regex:/^([\/].*)*$/,
                    regexText:'这个不是目录',
                    emptyText:'请输入目录',
                    listeners:{
                        focus:function(){
                            Ext.getCmp('internal.update.target.win.info').hide();
                            Ext.getCmp('internal.update.target.win.test.info').show();
                        }
                    }
                },{
                	fieldLabel:"编码", hiddenName:'typeFile.charset',value:item.data.t_charset,
                	xtype:'combo',
                	mode:'local',
                	emptyText :'--请选择--',
                	editable : false,
                	typeAhead:true,
                	forceSelection: true,
                	triggerAction:'all',
                	displayField:"key",valueField:"value",
                	store: storeCharset ,
                    listeners:{
                        focus:function(){
                            Ext.getCmp('internal.update.target.win.info').hide();
                            Ext.getCmp('internal.update.target.win.test.info').show();
                        }
                    }
                },{
                    fieldLabel:"删除文件",
                    layout:'column',
                    defaultType: 'radio',
                    items: [
                        { width:50, boxLabel: '是', name: 'typeFile.deleteFile', inputValue: true,  checked: deleteFileT },
                        { width:50, boxLabel: '否', name: 'typeFile.deleteFile', inputValue: false,  checked: deleteFileF }
                    ]
                },{
                    fieldLabel:"只能增加",
                    layout:'column',
                    defaultType: 'radio',
                    items: [
                        { width:50, boxLabel: '是', name: 'typeFile.isOnlyAdd', inputValue: true,  checked: onlyAddT },
                        { width:50, boxLabel: '否', name: 'typeFile.isOnlyAdd', inputValue: false,  checked: onlyAddF }
                    ]
                },{
                    hidden:true,
                    layout:'column',
                    defaultType: 'radio',
                    items: [
                        { width:50, boxLabel: '是', name: 'typeFile.isTwoWay', inputValue: true,  checked: isTwoWayT },
                        { width:50, boxLabel: '否', name: 'typeFile.isTwoWay', inputValue: false,  checked: isTwoWayF }
                    ]
                /*},{
                	fieldLabel:'处理线程数',
                    xtype:'displayfield',
                    name:'typeFile.threads',
                    value: 1
                },{
                    fieldLabel:'分批数',
                    xtype:'displayfield',
                    name:'typeFile.fileListSize',
                    value: 200
                },{
                    fieldLabel:'单次发送数据包大小',
                    xtype:'displayfield',
                    name:'typeFile.packetSize',
                    value: '2MB'*/
                },{
                    id:'threads.info',
                    xtype:'hidden',
                    name:'typeFile.threads',
                    value : 1
                },{
                    xtype:'hidden',
                    name:'typeFile.fileListSize',
                    value : 200
                },{
                    xtype:'hidden',
                    name:'typeFile.packetSize',
                    value : 2
                }]
            });
        });
    }
    var win = new Ext.Window({
        title:"修改信息-可信文件同步目标数据",
        width:450,
        height:360,
        layout:'fit',
        modal:true,
        items: [formPanel],
        bbar:[
            new Ext.Toolbar.Fill(),
            new Ext.Button({
                id:'internal.update.target.win.test.info',
                hidden:false,
                text:'测试',
                handler : function() {
                    if (formPanel.form.isValid()) {
                        formPanel.getForm().submit({
                            url :'../../FileTypeAction_testConnect.action',
                            method :'POST',
                            waitTitle :'系统提示',
                            waitMsg :'正在测试,请稍后...',
                            success : function(form,action) {
                                var msg = action.result.msg;
                                var flag = action.result.flag;
                                Ext.MessageBox.show({
                                    title:'信息',
                                    width:260,
                                    msg:msg,
                                    animEl:'internal.update.target.win.test.info',
                                    buttons:{'ok':'确定'},
                                    icon:Ext.MessageBox.INFO,
                                    closable:false,
                                    fn:function(e){
                                        if(e=='ok'){
                                            if(flag) {
                                                Ext.getCmp('internal.update.target.win.test.info').hide();
                                                Ext.getCmp('internal.update.target.win.info').show();
                                            }
                                        }
                                    }
                                });
                            }
                        });
                    } else {
                        Ext.MessageBox.show({
                            title:'信息',
                            width:200,
                            msg:'请填写完成再提交!',
                            animEl:'internal.update.target.win.test.info',
                            buttons:{'ok':'确定'},
                            icon:Ext.MessageBox.ERROR,
                            closable:false
                        });
                    }
                }
            }),
            new Ext.Button ({
                id:'internal.update.target.win.info',
                text : '修改',
                hidden:true,
                allowDepress : false,
                handler : function() {
                    if (formPanel.form.isValid()) {
                        Ext.MessageBox.show({
                    		title:'信息',
                            width:200,
                            msg:'确定要修改?',
                            animEl:'internal.update.target.win.info',
                            buttons:{'ok':'确定','no':'取消'},
                            icon:Ext.MessageBox.WARNING,
                            closable:false,
                            fn:function(e){
                            	if(e=='ok'){
                            		formPanel.getForm().submit({
			                            url :'../../FileTypeAction_update.action',
			                            method :'POST',
			                            waitTitle :'系统提示',
			                            waitMsg :'正在修改,请稍后...',
			                            success : function(form,action) {
                                            var msg = action.result.msg;
			                                Ext.MessageBox.show({
			                                    title:'信息',
			                                    width:260,
			                                    msg:msg,
			                                    animEl:'internal.update.target.win.info',
			                                    buttons:{'ok':'确定','no':'取消'},
			                                    icon:Ext.MessageBox.INFO,
			                                    closable:false,
			                                    fn:function(e){
			                                        if(e=='ok'){
			                                            grid.render();
			                                            store.reload();
			                                            win.close();
			                                        }
			                                    }
			                                });
			                            }
			                        });
                            	}
                          	}
                        });
                    } else {
                        Ext.MessageBox.show({
                            title:'信息',
                            width:200,
                            msg:'请填写完成再提交!',
                            animEl:'internal.update.target.win.info',
                            buttons:{'ok':'确定'},
                            icon:Ext.MessageBox.ERROR,
                            closable:false
                        });
                    }
                }
            }),
            new Ext.Button ({
                allowDepress : false,
                handler : function() {win.close();},
                text : '关闭'
            })
        ],
        listeners :{
        	show:function(){
                Ext.getCmp('internal.update.target.win.info').hide();
                Ext.getCmp('internal.update.target.win.test.info').show();
            }
        }
    }).show();
}

/**
 * 查看文件同步应用
 */
function internal_detail_file_win(){
    var grid = Ext.getCmp('grid.file.internal.info');
    var selModel = grid.getSelectionModel();
    var formPanel;
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
            formPanel = new Ext.form.FormPanel({
                labelWidth:150,
                frame:true,
                autoScroll:true,
                labelAlign:'right',
                defaultType:'displayfield',
                defaults : {
					width : 200,
					allowBlank : false,
					blankText : '该项不能为空！'
				},
                items:[{fieldLabel:"应用编号",value:item.data.appName},
                       {fieldLabel:"应用名",value:item.data.appDesc},
                       {fieldLabel:'应用源类型',value:'目标'},
                       {fieldLabel:'应用类型',value:'文件同步'},
                       {fieldLabel:'启用',value:show_isActive(item.data.isActive)},
                       {fieldLabel:'通信协议',value:show_protocol(item.data.t_protocol)},
                       {fieldLabel:'文件服务器地址',value:item.data.t_serverAddress},
                       {fieldLabel:'文件服务器端口',value:item.data.t_port},
                       {fieldLabel:'登陆名',value:item.data.t_userName},
                       {fieldLabel:'编码',value:item.data.t_charset},
                       {fieldLabel:'根目录',value:item.data.t_dir},
                       {fieldLabel:'只能增加',value:show_is(item.data.t_onlyAdd)},
                       {fieldLabel:'删除文件',value:show_is(item.data.t_deleteFile)}
                ]
            });
        });
    }
    var win = new Ext.Window({
        title:"详细信息-可信文件同步",
        width:400,
        height:300,
        layout:'fit',
        modal:true,
        items: [formPanel],
        bbar:[
            new Ext.Toolbar.Fill(),
            new Ext.Button ({
                text : '保存',
                allowDepress : false,
                handler : function() {win.close();}
            }),
            new Ext.Button ({
                allowDepress : false,
                text : '关闭',
                handler : function() {win.close();}
            })
        ]
    }).show();
}

//===============================================================external===============================================
/**
 * 重置应用状态
 */
function external_update_status(){
    var grid = Ext.getCmp('grid.file.external.info');
    var store = grid.getStore();
    var selModel = grid.getSelectionModel();
    var count = selModel.getCount();
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
            var appName = item.data.appName;
            Ext.MessageBox.show({
                title:'信息',
                msg:'<font color="green">确定要重置所选记录的状态？</font>',
                width:250,
                buttons:{'ok':'确定','no':'取消'},
                icon:Ext.MessageBox.INFO,
                closable:false,
                fn:function(e){
                    if(e == 'ok'){
                        var myMask = new Ext.LoadMask(Ext.getBody(),{
                            msg:'正在处理,请稍后...',
                            removeMask:true
                        });
                        myMask.show();
                        Ext.Ajax.request({
                            url : '../../AppTypeAction_initStatus.action',             // 删除 连接 到后台
                            params :{appName : appName},
                            success : function(r,o){
                                myMask.hide();
                                var respText = Ext.util.JSON.decode(r.responseText);
                                var msg = respText.msg;
                                Ext.MessageBox.show({
                                    title:'信息',
                                    msg:msg,
                                    width:300,
                                    buttons:{'ok':'确定'},
                                    icon:Ext.MessageBox.INFO,
                                    closable:false,
                                    fn:function(e){
                                        if(e=='ok'){
                                            grid.render();
                                            store.reload();
                                        }
                                    }
                                });
                            }
                        });
                    }
                }
            });

        });
    }

}

/**
 * 查看文件同步应用
 */
function external_detail_file_win(){
    var grid = Ext.getCmp('grid.file.external.info');
    var selModel = grid.getSelectionModel();
    var formPanel;
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
            formPanel = new Ext.form.FormPanel({
                labelWidth:150,
                frame:true,
                autoScroll:true,
                labelAlign:'right',
                defaultType:'displayfield',
                defaults : {
					width : 200,
					allowBlank : false,
					blankText : '该项不能为空！'
				},
                items:[{fieldLabel:"应用编号",value:item.data.appName},
                    {fieldLabel:"应用名",value:item.data.appDesc},
                    {fieldLabel:"应用源类型",value:'数据源'},
                    {fieldLabel:'应用类型',value:'文件同步'},
                    {fieldLabel:'传输速度',value:showURL_speed(item.data.speed)},
                    {fieldLabel:'通道',value:showURL_channel(item.data.channel)},
                    {fieldLabel:'通道端口',value:item.data.channelport},
                    {fieldLabel:'启用状态',value:show_isActive(item.data.isActive)},
                    {fieldLabel:'通信协议',value:show_protocol(item.data.protocol)},
                    {fieldLabel:'文件服务器地址',value:item.data.serverAddress},
                    {fieldLabel:'文件服务器端口',value:item.data.port},
                    {fieldLabel:'登录名',value:item.data.userName},
                    {fieldLabel:'编码',value:item.data.charset},
                    {fieldLabel:'根目录',value:item.data.dir},
                    {fieldLabel:'频率(毫秒)',value:item.data.interval},
                    {fieldLabel:'删除文件',value:show_is(item.data.deleteFile)},
                    {fieldLabel:'包含子目录',value:show_is(item.data.isIncludeSubDir)},
                    {fieldLabel:'过滤类型',value:item.data.filterTypes},
                    {fieldLabel:'非过滤类型',value:item.data.notFilterTypes}
                ]
            });
        });
    }
    var win = new Ext.Window({
        title:"详细信息-非可信文件同步",
        width:400,
        height:300,
        layout:'fit',
        modal:true,
        items: [formPanel],
        bbar:[
            new Ext.Toolbar.Fill(),
            new Ext.Button ({
                text : '保存',
                allowDepress : false,
                handler : function() {win.close();}
            }),
            new Ext.Button ({
                allowDepress : false,
                text : '关闭',
                handler : function() {win.close();}
            })
        ]
    }).show();
}