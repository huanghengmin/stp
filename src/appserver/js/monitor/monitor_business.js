/**
 * 业务运行监控
 */
Ext.onReady(function() {

	Ext.BLANK_IMAGE_URL = '../../js/ext/resources/images/default/s.gif';

	Ext.QuickTips.init();
	Ext.form.Field.prototype.msgTarget = 'side';

	var listRecord = Ext.data.Record.create(['id', 'name', 'linkName',
			'exchModel', 'recordCount', 'dataVolume', 'alertCount',
			'linkCount', 'responseTime','runStatus']);

	var store = new Ext.data.Store({
		storeId : 'listStore',
		url : "../../MonitorAction_selectBusiness.action",
		reader : new Ext.data.JsonReader({
			totalProperty : 'total',
			root : 'rows'
		}, listRecord)
	});
	var start = 0;
    var pageSize = 100;
    var record = new Ext.data.Record.create([
        {name:'businessName',	mapping:'businessName'},
        {name:'businessType',	mapping:'businessType'},
        {name:'runStatus',       	mapping:'runStatus'},
        {name:'recordCount',     mapping:'recordCount'},
        {name:'dataVolume',      mapping:'dataVolume'},
        {name:'alertCount',      mapping:'alertCount'},
        {name:'linkCount',       mapping:'linkCount'},
        {name:'responseTime',   mapping:'responseTime'},
        {name:'average',   mapping:'average'}
    ]);
    var proxy = new Ext.data.HttpProxy({
        url:"../../MonitorAction_selectBusiness.action"
    });
    var reader = new Ext.data.JsonReader({
        totalProperty:"total",
        root:'rows'
    },record);
    var store = new Ext.data.GroupingStore({
        id:"store.info",
        proxy : proxy,
        reader : reader
    });

    var boxM = new Ext.grid.CheckboxSelectionModel();   //复选框
    var rowNumber = new Ext.grid.RowNumberer();         //自动 编号
    var colM = new Ext.grid.ColumnModel([
//        boxM,
        rowNumber,
        {header:'业务名',		    dataIndex:'businessName',     align:'center',sortable:true,menuDisabled:true},
        {header:'业务类型',	    dataIndex:'businessType',     align:'center',sortable:true,menuDisabled:true,width:45,renderer:show_businessType},
        {header:'运行状态',       dataIndex:'runStatus',        align:'center',sortable:true,menuDisabled:true,width:45,renderer:show_runStatus},
        {header:'总记录/请求数',	dataIndex:'recordCount',      align:'center',sortable:true,menuDisabled:true,width:50},
        {header:'总流量(M)',	    dataIndex:'dataVolume',       align:'center',sortable:true,menuDisabled:true,width:50},
        {header:'总报警次数',	    dataIndex:'alertCount',       align:'center',sortable:true,menuDisabled:true,width:50},
        {header:'连接数',	        dataIndex:'linkCount',        align:'center',sortable:true,menuDisabled:true,width:50},
//        {header:'响应时间(毫秒)',	dataIndex:'responseTime',     align:'center',sortable:true,menuDisabled:true,width:50},
        {header:'目标处理响应时间',	dataIndex:'average',     align:'center',sortable:true,menuDisabled:true,width:100,renderer:showURL_speed},
        {header:'操作标记',	    dataIndex:'businessName',     align:'center',sortable:true,menuDisabled:true,width:100,renderer:show_flag}
    ]);

    var page_toolbar = new Ext.PagingToolbar({
        pageSize : pageSize,
        store:store,
        displayInfo:true,
        displayMsg:"显示第{0}条记录到第{1}条记录，一共{2}条",
        emptyMsg:"没有记录",
        beforePageText:"当前页",
        afterPageText:"共{0}页"
    });
    var grid_panel = new Ext.grid.GridPanel({
        id:'grid.info',
        plain:true,
        height:setHeight(),
        width:setWidth(),
        animCollapse:true,
        loadMask:{msg:'正在加载数据，请稍后...'},
        border:false,
        collapsible:false,
        cm:colM,
//        sm:boxM,
        store:store,
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
        bbar:page_toolbar
    });
    var port = new Ext.Viewport({
        layout:'fit',
        renderTo: Ext.getBody(),
        items:[grid_panel]
    });
    store.load({
        params:{
            start:start,limit:pageSize
        }
    });
    var task = {
		run : function() {
			store.reload();
		},
		interval : 30000 // 30秒
	}
	Ext.TaskMgr.start(task);
});
function setHeight(){
	var h = document.body.clientHeight-8;
	return h;
}

function setWidth(){
    return document.body.clientWidth-8;
}

function show_businessType(value){
    if(value=='file'){
        return '文件同步';
    } else if(value=='db'){
        return '数据库同步';
    } else if(value=='TCPProxy'){
        return 'TCP代理';
    } else if(value=='UDPProxy'){
        return 'UDP代理';
    } else if(value=='proxy'){
        return '通用代理';
    }
}

function show_runStatus (v) {
    if (v == 200) {
        return '<img src="../../img/icon/ok.png" alt="运行正常" title="运行正常" />';
    } else if (v == 501) {
        return '<img src="../../img/icon/warning.png" alt="告警" title="告警"/>';
    } else if (v == 503) {
        return '<img src="../../img/icon/off.gif" alt="服务不可用" title="服务不可用"/>';
    } else if (v == 0) {
        return '<img src="../../img/icon/off.gif" alt="业务未启动" title="业务未启动"/>';
    } else {
        return '<img src="../../img/icon/off.gif" alt="异常" title="异常"/>';
    }
}

function show_flag(value, p, r){
    var temp = "&nbsp;&nbsp;&nbsp;&nbsp;";
    var type = r.get('businessType');
    var detail;
    if(type=='file') {
        detail = "<a href='javascript:void(0);' onclick='businessDetailInfo_file(\""+value+"\");return false;' style='color: green;'>业务信息</a>" + temp ;
    } else if(type=='proxy') {
        detail = "<a href='javascript:void(0);' onclick='businessDetailInfo_proxy(\""+value+"\");return false;' style='color: green;'>业务信息</a>" + temp ;
    } else if(type=='db') {
        detail = "<a href='javascript:void(0);' onclick='businessDetailInfo_db(\""+value+"\");return false;' style='color: green;'>业务信息</a>" + temp ;
    }

    var count = "<a href='javascript:void(0);' onclick='businessCountInfo();return false;' style='color: green;'>统计信息</a>";
    return detail + count;
}

function show_isActive(value){
    if(value == 'true' || value==true){
    	return '<img src="../../img/icon/ok.png" alt="启动" title="运行中" />';
    }else if(value == 'false' || value == false){
    	return '<img src="../../img/icon/off.gif" alt="停止" title="未运行"/>';
    }
}

function show_isAllow(value){
    if(value == 'true' || value==true){
    	return '已通过';
    }else if(value == 'false' || value == false){
    	return '未通过';
    }
}

function show_InfoLevel(value){
    if(value==0){
        return "公开信息";
    } else if (value==1){
        return "第一级";
    } else if (value==2){
        return "第二级";
    } else if (value==3){
        return "第三级";
    } else if (value==4){
        return "第四级";
    } else if (value==5){
        return "第五级";
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
	}else if(value == 'ftps'){
		return 'FTPS文件传输协议';
	}else if(value=='smb'){
		return '共享文件传输协议(SMB)';
	}else if(value=='WebDAV'){
		return 'WebDAV文件传输协议';
	}
}

function showURL_channel(value){
    if(value==1||value=='1'){
        return "通道一";
    } else if(value==2||value=='2'){
        return "通道二";
    }
}

function showURL_speed(value){
    return value + ' 毫秒'
}


function external_ipFilter_showURL(value){
    if(value==0){
        return "<font color='gray'>IP/Mac黑名单</font>&nbsp;&nbsp;<font color='gray'>IP/Mac白名单</font> ";
    }else if(value==1){
        return "<a href='javascript:;' onclick='external_ipBlackWindow();' style='color: green;'>IP/Mac黑名单</a>&nbsp;&nbsp;<font color='gray'>IP/Mac白名单</font> ";
    }else if(value==2){
        return "<font color='gray'>IP/Mac黑名单</font>&nbsp;&nbsp;<a href='javascript:;' onclick='external_ipWhiteWindow();' style='color: green;'>IP/Mac白名单</a>";
    }else if(value==3){
        return "<a href='javascript:;' onclick='external_ipBlackWindow();' style='color: green;'>IP/Mac黑名单</a>&nbsp;&nbsp;<a href='javascript:;' onclick='external_ipWhiteWindow();' style='color: green;'>IP/Mac白名单</a>";
    }
}

function external_showURL_ipAddress(){
    return "<a href='javascript:;' onclick='external_ipAddress();' style='color: green;'>IP管理</a>"
}

function internal_ipFilter_showURL(value){
    if(value==0){
        return "<font color='gray'>IP/Mac黑名单</font>&nbsp;&nbsp;<font color='gray'>IP/Mac白名单</font> ";
    }else if(value==1){
        return "<a href='javascript:;' onclick='internal_ipBlackWindow();' style='color: green;'>IP/Mac黑名单</a>&nbsp;&nbsp;<font color='gray'>IP/Mac白名单</font> ";
    }else if(value==2){
        return "<font color='gray'>IP/Mac黑名单</font>&nbsp;&nbsp;<a href='javascript:;' onclick='internal_ipWhiteWindow();' style='color: green;'>IP/Mac白名单</a>";
    }else if(value==3){
        return "<a href='javascript:;' onclick='internal_ipBlackWindow();' style='color: green;'>IP/Mac黑名单</a>&nbsp;&nbsp;<a href='javascript:;' onclick='internal_ipWhiteWindow();' style='color: green;'>IP/Mac白名单</a>";
    }
}

function external_showURL_operation(value){
    if(value == 'trigger'){
        return '触发同步';
    }else if(value == 'entirely'){
        return '全表同步';
    }else if(value == 'delete'){
        return '删除同步';
    }else if(value == 'flag'){
        return '标记同步';
    }else if(value == 'timesync'){
        return '时间标记同步';
    }
}

/**
 * 统计信息
 */
function businessCountInfo(){
    var grid = Ext.getCmp('grid.info');
    var store = grid.getStore();
    var selModel = grid.getSelectionModel();
    var formPanel;
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
            formPanel = new Ext.form.FormPanel({
                labelWidth:150,
                frame:true,
                labelAlign:'right',autoScroll:true,
                defaultType:'displayfield',
                defaults : {
					width : 150,
					allowBlank : false,
					blankText : '该项不能为空！'
				},
                items:[
                    {fieldLabel:'业务名',value:item.data.businessName},
                    {fieldLabel:'总记录/请求数',value:item.data.recordCount},
                    {fieldLabel:'总流量(M)',value:item.data.dataVolume},
                    {fieldLabel:"总报警次数",value:item.data.alertCount},
                    {fieldLabel:"连接数",value:item.data.linkCount},
                    {fieldLabel:"响应时间",value:showURL_speed(item.data.responseTime)},
                    {fieldLabel:"目标处理响应时间",value:showURL_speed(item.data.average)}
                ]
            });
        });
    }
    var win = new Ext.Window({
        title:"业务统计信息",
        width:400,
        layout:'fit',
        height:270,
        modal:true,
        items:formPanel,
        bbar:[
            '->',
            {
                text:'保存',
                handler:function(){
                    win.close();
                }
            },{
                text:'关闭',
                handler:function(){
                    win.close();
                }
            }
        ]
    }).show();

}

/**
 * 查看文件同步业务的详细信息
 * @param name
 */
function businessDetailInfo_file(name){
    var type = 'file';
    var panel = new Ext.FormPanel({
		border : false,
		labelAlign : 'right',
		labelWidth : 130,
		width : '100%',
		waitMsgTarget : true,
        frame:true,
        autoScroll:true,
        layout:'column',
        items:[new Ext.form.FieldSet({
            columnWidth:.5,
            title:'源端信息',
            defaultType:'displayfield',
            defaults : {
                width : 180
            },
            items:[
                {fieldLabel:"应用编号",id:'appName',name:'appName'},
                {fieldLabel:"应用名",id:'appDesc',name:'appDesc'},
                {fieldLabel:"应用源类型",value:'数据源'},
                {fieldLabel:'应用类型',value:'文件同步'},
                {fieldLabel:'传输速度',id:'speed',name:'speed'},
                {fieldLabel:'通道',id:'channel',name:'channel'},
                {fieldLabel:'通道端口',id:'channelport',name:'channelport'},
                {fieldLabel:'启用状态',id:'isActive',name:'isActive'},
                {fieldLabel:'信息等级',id:'infoLevel',name:'infoLevel'},
                {fieldLabel:'启用内容过滤',id:'isFilter',name:'isFilter'},
                {fieldLabel:'启用病毒扫描',id:'isVirusScan',name:'isVirusScan'},
                {fieldLabel:'通信协议',id:'protocol',name:'protocol'},
                {fieldLabel:'文件服务器地址',id:'serverAddress',name:'serverAddress'},
                {fieldLabel:'文件服务器端口',id:'port',name:'port'},
                {fieldLabel:'登录名',id:'userName',name:'userName'},
                {fieldLabel:'编码',id:'charset',name:'charset'},
                {fieldLabel:'根目录',id:'dir',name:'dir'},
                {fieldLabel:'频率(毫秒)',id:'interval',name:'interval'},
                {fieldLabel:'删除文件',id:'deleteFile',name:'deleteFile'},
                {fieldLabel:'包含子目录',id:'isIncludeSubDir',name:'isIncludeSubDir'},
                {fieldLabel:'过滤类型',id:'filterTypes',name:'filterTypes'},
                {fieldLabel:'非过滤类型',id:'notFilterTypes',name:'notFilterTypes'}
            ]
        }),new Ext.form.FieldSet({
            columnWidth:.5,
            title:'目标端信息',
            defaultType:'displayfield',
            defaults : {
                width : 180
            },
            items:[
                {fieldLabel:"应用编号",id:'t_appName',name:'t_appName'},
                {fieldLabel:"应用名",id:'t_appDesc',name:'t_appDesc'},
                {fieldLabel:'应用源类型',value:'目标'},
                {fieldLabel:'应用类型',value:'文件同步'},
                {fieldLabel:'启用',id:'t_isActive',name:'t_isActive'},
                {fieldLabel:'信息等级',id:'t_infoLevel',name:'t_infoLevel'},
                {fieldLabel:'启用内容过滤',id:'t_isFilter',name:'t_isFilter'},
                {fieldLabel:'启用病毒扫描',id:'t_isVirusScan',name:'t_isVirusScan'},
                {fieldLabel:'通信协议',id:'t_protocol',name:'t_protocol'},
                {fieldLabel:'文件服务器地址',id:'t_serverAddress',name:'t_serverAddress'},
                {fieldLabel:'文件服务器端口',id:'t_port',name:'t_port'},
                {fieldLabel:'登陆名',id:'t_userName',name:'t_userName'},
                {fieldLabel:'编码',id:'t_charset',name:'t_charset'},
                {fieldLabel:'根目录',id:'t_dir',name:'t_dir'},
                {fieldLabel:'只能增加',id:'t_onlyAdd',name:'t_onlyAdd'},
                {fieldLabel:'删除文件',id:'t_deleteFile',name:'t_deleteFile'}
            ]
        })]
    });
    if(panel){
        var myMask = new Ext.LoadMask(Ext.getBody(),{
            msg : '正在加载数据,请稍后...',
            removeMask:true
        });
        myMask.show();
		Ext.Ajax.request({
			url : '../../FileTypeAction_queryByNameType.action',
			params : {
				appName : name,appType : type
			},
			success : function(response, opts) {
				var data = Ext.util.JSON.decode(response.responseText);
                Ext.getCmp('appName').setValue(data.appName);
                Ext.getCmp('appDesc').setValue(data.appDesc);
                Ext.getCmp('speed').setValue(showURL_speed(data.speed));
                Ext.getCmp('channel').setValue(showURL_channel(data.channel));
                Ext.getCmp('channelport').setValue(data.channelport);
                Ext.getCmp('isActive').setValue(show_isActive(data.isActive));
                Ext.getCmp('infoLevel').setValue(show_InfoLevel(data.infoLevel));
                Ext.getCmp('isFilter').setValue(show_is(data.isFilter));
                Ext.getCmp('isVirusScan').setValue(show_is(data.isVirusScan));
                Ext.getCmp('protocol').setValue(show_protocol(data.protocol));
                Ext.getCmp('serverAddress').setValue(data.serverAddress);
                Ext.getCmp('port').setValue(data.port);
                Ext.getCmp('userName').setValue(data.userName);
                Ext.getCmp('charset').setValue(data.charset);
                Ext.getCmp('dir').setValue(data.dir);
                Ext.getCmp('interval').setValue(data.interval);
                Ext.getCmp('deleteFile').setValue(show_is(data.deleteFile));
//                Ext.getCmp('isTwoWay').setValue(show_is(data.isTwoWay));
                Ext.getCmp('isIncludeSubDir').setValue(show_is(data.isIncludeSubDir));
                Ext.getCmp('filterTypes').setValue(data.filterTypes);
                Ext.getCmp('notFilterTypes').setValue(data.notFilterTypes);
//                Ext.getCmp('threads').setValue(data.threads);
//                Ext.getCmp('packetSize').setValue(data.packetSize);
//                Ext.getCmp('fileListSize').setValue(data.fileListSize);
                Ext.getCmp('t_appName').setValue(data.t_appName);
                Ext.getCmp('t_appDesc').setValue(data.t_appDesc);
                Ext.getCmp('t_isActive').setValue(show_isActive(data.t_isActive));
                Ext.getCmp('t_infoLevel').setValue(show_InfoLevel(data.t_infoLevel));
                Ext.getCmp('t_isFilter').setValue(show_is(data.t_isFilter));
                Ext.getCmp('t_isVirusScan').setValue(show_is(data.t_isVirusScan));
                Ext.getCmp('t_protocol').setValue(show_protocol(data.t_protocol));
                Ext.getCmp('t_serverAddress').setValue(data.t_serverAddress);
                Ext.getCmp('t_port').setValue(data.t_port);
                Ext.getCmp('t_userName').setValue(data.t_userName);
                Ext.getCmp('t_charset').setValue(data.t_charset);
                Ext.getCmp('t_dir').setValue(data.t_dir);
                Ext.getCmp('t_onlyAdd').setValue(show_is(data.t_onlyAdd));
//                Ext.getCmp('t_isTwoWay').setValue(show_is(data.t_isTwoWay));
                Ext.getCmp('t_deleteFile').setValue(show_is(data.t_deleteFile));
//                Ext.getCmp('t_threads').setValue(data.t_threads);
//                Ext.getCmp('t_packetSize').setValue(data.t_packetSize);
//                Ext.getCmp('t_fileListSize').setValue(data.t_fileListSize);
                myMask.hide();
            },
			failure : function(response, opts) {
                myMask.hide();
				Ext.Msg.alert('', "加载配置数据失败,请重试!");
			}
		});
    }
    var win = new Ext.Window({
        title:"文件同步--业务详细信息",
        width:700,
        layout:'fit',
        height:400,
        modal:true,
        items:panel,
        bbar:[
            '->',
            {
                text:'保存',
                handler:function(){
                    win.close();
                }
            },{
                text:'关闭',
                handler:function(){
                    win.close();
                }
            }
        ]
    }).show();
}

/**
 * 查看数据库同步业务的详细信息
 * @param name
 */
function businessDetailInfo_db(name){
    var type = 'db';
    var panel = new Ext.FormPanel({
		border : false,
		labelAlign : 'right',
		labelWidth : 150,
		width : '100%',
		waitMsgTarget : true,
        frame:true,
        autoScroll:true,
        layout:'column',
        items:[new Ext.form.FieldSet({
            columnWidth:.5,
            title:'源端信息',
            defaultType:'displayfield',
            defaults : {
                width : 180
            },
            items:[
                {fieldLabel:"应用编号",id:'appName',name:'appName'},
                {fieldLabel:"应用名",id:'appDesc',name:'appDesc'},
                {fieldLabel:"应用源类型",value:'数据源'},
                {fieldLabel:'应用类型',value:'数据库同步'},
                {fieldLabel:'传输速度',id:'speed',name:'speed'},
                {fieldLabel:'通道',id:'channel',name:'channel'},
                {fieldLabel:'通道端口',id:'channelport',name:'channelport'},
                {fieldLabel:'启用状态',id:'isActive',name:'isActive'},
                {fieldLabel:'信息等级',id:'infoLevel',name:'infoLevel'},
                {fieldLabel:'启用内容过滤',id:'isFilter',name:'isFilter'},
                {fieldLabel:'启用病毒扫描',id:'isVirusScan',name:'isVirusScan'},
                {fieldLabel:'数据文件存放目录',id:'dataPath',name:'dataPath'},
                {fieldLabel:"数据写入文件",id:'deleteFile',name:'deleteFile'},
                {fieldLabel:"执行恢复操作",id:'isRecover',name:'isRecover'},
                {fieldLabel:"数据源",id:'dbName',name:'dbName'},
                {fieldLabel:"同步方式", id:'operation',name:'operation'},
                {fieldLabel:"同步原表已存在数据",id:'oldStep',name:'oldStep'},
                {fieldLabel:'临时表表名',id:'tempTable',name:'tempTable'},
                {fieldLabel:'单次传输最大记录',id:'maxRecords',name:'maxRecords'},
                {fieldLabel:'传输频率(单位:秒)',id:'interval',name:'interval'},
                {fieldLabel:"可用",id:'enable',name:'enable'},
                {fieldLabel:"数据表集合",id:'sourcetables'}
            ]
        }),new Ext.form.FieldSet({
            columnWidth:.5,
            title:'目标端信息',
            defaultType:'displayfield',
            defaults : {
                width : 180
            },
            items:[
                {fieldLabel:"应用编号",id:'t_appName',name:'t_appName'},
                {fieldLabel:"应用名",id:'t_appDesc',name:'t_appDesc'},
                {fieldLabel:'应用源类型',value:'目标'},
                {fieldLabel:'应用类型',value:'数据库同步'},
                {fieldLabel:'启用',id:'t_isActive',name:'t_isActive'},
                {fieldLabel:'信息等级',id:'t_infoLevel',name:'t_infoLevel'},
                {fieldLabel:'启用内容过滤',id:'t_isFilter',name:'t_isFilter'},
                {fieldLabel:'启用病毒扫描',id:'t_isVirusScan',name:'t_isVirusScan'},
                {fieldLabel:'数据文件存放目录',id:'t_dataPath',name:'t_dataPath'},
                {fieldLabel:"数据写入文件",id:'t_deleteFile',name:'t_deleteFile'},
                {fieldLabel:"执行恢复操作",id:'t_isRecover',name:'t_isRecover'},
                {fieldLabel:'源端数据源名称',id:'srcdbName',name:'srcdbName'},
                {fieldLabel:"目标表集合",id:'targettables'}
            ]
        })]
    });
    if(panel){
        var myMask = new Ext.LoadMask(Ext.getBody(),{
            msg : '正在加载数据,请稍后...',
            removeMask:true
        });
        myMask.show();
		Ext.Ajax.request({
			url : '../../DBTypeAction_queryByNameType.action',
			params : {
				appName : name,appType : type
			},
			success : function(response, opts) {
				var data = Ext.util.JSON.decode(response.responseText);
                Ext.getCmp('appName').setValue(data.appName);
                Ext.getCmp('appDesc').setValue(data.appDesc);
                Ext.getCmp('speed').setValue(showURL_speed(data.speed));
                Ext.getCmp('channel').setValue(showURL_channel(data.channel));
                Ext.getCmp('channelport').setValue(data.channelport);
                Ext.getCmp('isActive').setValue(show_isActive(data.isActive));
                Ext.getCmp('infoLevel').setValue(show_InfoLevel(data.infoLevel));
                Ext.getCmp('isFilter').setValue(show_is(data.isFilter));
                Ext.getCmp('isVirusScan').setValue(show_is(data.isVirusScan));
                Ext.getCmp('dataPath').setValue(data.dataPath);
                Ext.getCmp('deleteFile').setValue(show_is(data.deleteFile));
                Ext.getCmp('isRecover').setValue(show_is(data.isRecover));
                Ext.getCmp('dbName').setValue(data.dbName);
                Ext.getCmp('operation').setValue(external_showURL_operation(data.operation));
                Ext.getCmp('oldStep').setValue(show_is(data.oldStep));
                Ext.getCmp('tempTable').setValue(data.tempTable);
                Ext.getCmp('maxRecords').setValue(data.maxRecords);
                Ext.getCmp('interval').setValue(data.interval);
                Ext.getCmp('enable').setValue(show_is(data.enable));
                var appName = data.appName;
                var dbName = data.dbName;
                var operation = data.operation;
                Ext.getCmp('sourcetables').setValue('<a href="javascript:;" onclick="external_detail_db_attribute_source(\''+appName+'\',\''+dbName+'\',\''+operation+'\')" style="color: green;">源表</a>');  //+','+dbName+','+operation
                Ext.getCmp('t_appName').setValue(data.t_appName);
                Ext.getCmp('t_appDesc').setValue(data.t_appDesc);
                Ext.getCmp('t_isActive').setValue(show_isActive(data.t_isActive));
                Ext.getCmp('t_infoLevel').setValue(show_InfoLevel(data.t_infoLevel));
                Ext.getCmp('t_isFilter').setValue(show_is(data.t_isFilter));
                Ext.getCmp('t_isVirusScan').setValue(show_is(data.t_isVirusScan));
                Ext.getCmp('t_dataPath').setValue(data.t_dataPath);
                Ext.getCmp('t_deleteFile').setValue(show_is(data.t_deleteFile));
                Ext.getCmp('t_isRecover').setValue(show_is(data.t_isRecover));
                Ext.getCmp('srcdbName').setValue(data.srcdbName);
                var srcDBName = data.srcdbName;
                Ext.getCmp('targettables').setValue('<a href="javascript:;" onclick="internal_detail_db_attribute_target(\''+appName+'\',\''+srcDBName+'\')" style="color: green;">目标表</a>');
                myMask.hide();
            },
			failure : function(response, opts) {
                myMask.hide();
				Ext.Msg.alert('', "加载配置数据失败,请重试!");
			}
		});
    }
    var win = new Ext.Window({
        title:"数据库同步--业务详细信息",
        width:730,
        layout:'fit',
        height:400,
        modal:true,
        items:panel,
        bbar:[
            '->',
            {
                text:'保存',
                handler:function(){
                    win.close();
                }
            },{
                text:'关闭',
                handler:function(){
                    win.close();
                }
            }
        ]
    }).show();
}

/**
 * 查看通用代理业务的详细信息
 * @param name
 */
function businessDetailInfo_proxy(name){
    var type = 'proxy';
    var panel = new Ext.FormPanel({
		border : false,
		labelAlign : 'right',
		labelWidth : 130,
		width : '100%',
		waitMsgTarget : true,
        frame:true,
        autoScroll:true,
        layout:'column',
        items:[new Ext.form.FieldSet({
            columnWidth:.5,
            title:'源端信息',
            defaultType:'displayfield',
            defaults : {
                width : 200
            },
            items:[
                {fieldLabel:"应用编号",id:'appName',name:'appName'},
                {fieldLabel:"应用名",id:'appDesc',name:'appDesc'},
                {fieldLabel:"应用源类型",value:'数据源'},
                {fieldLabel:'应用类型',value:'通用代理'},
                {fieldLabel:'通道',id:'channel',name:'channel'},
                {fieldLabel:'通道端口',id:'channelport',name:'channelport'},
                {fieldLabel:'启用状态',id:'isActive',name:'isActive'},
                {fieldLabel:'信息等级',id:'infoLevel',name:'infoLevel'},
                {fieldLabel:'启用内容过滤',id:'isFilter',name:'isFilter'},
                {fieldLabel:'启用病毒扫描',id:'isVirusScan',name:'isVirusScan'},
                {fieldLabel:"启用用户认证",id:'clientauthenable',name:'clientauthenable'},
                {fieldLabel:'用户认证服务器IP地址',id:'authaddress',name:'authaddress'},
                {fieldLabel:'用户认证服务端口',id:'authport',name:'authport'},
                {fieldLabel:'服务器证书',id:'authca',name:'authca'},
                {fieldLabel:'IP/Mac过虑策略',id:'ipfilter',name:'ipfilter'},
                {fieldLabel:'可访问IP',value:external_showURL_ipAddress()},
                {fieldLabel:'应用服务地址', id:'serverAddress',name:'serverAddress'},
                {fieldLabel:'应用服务端口',id:'port',name:'port'},
                {fieldLabel:'最小连接数',id:'poolMin',name:'poolMin'},
                {fieldLabel:'最大连接数',id:'poolMax',name:'poolMax'},
                {fieldLabel:'编码',id:'charset',name:'charset'},
                {fieldLabel:'重试次数',id:'tryTime',name:'tryTime'},
                {fieldLabel:'类型',id:'type',name:'type'}
            ]
        }),new Ext.form.FieldSet({
            columnWidth:.5,
            title:'目标端信息',
            defaultType:'displayfield',
            defaults : {
                width : 200
            },
            items:[
                {fieldLabel:"应用编号",id:'t_appName',name:'t_appName'},
                {fieldLabel:"应用名",id:'t_appDesc',name:'t_appDesc'},
                {fieldLabel:'应用源类型',value:'目标'},
                {fieldLabel:'应用类型',value:'通用代理'},
                {fieldLabel:'启用',id:'t_isActive',name:'t_isActive'},
                {fieldLabel:'信息等级',id:'t_infoLevel',name:'t_infoLevel'},
                {fieldLabel:'启用内容过滤',id:'t_isFilter',name:'t_isFilter'},
                {fieldLabel:'启用病毒扫描',id:'t_isVirusScan',name:'t_isVirusScan'},
                {fieldLabel:'IP/Mac过虑策略',id:'t_ipfilter',name:'t_ipfilter'},
                {fieldLabel:'应用服务地址',id:'t_serverAddress',name:'t_serverAddress'},
                {fieldLabel:'应用服务端口',id:'t_port',name:'t_port'},
                {fieldLabel:'最小连接数',id:'t_poolMin',name:'t_poolMin'},
                {fieldLabel:'最大连接数',id:'t_poolMax',name:'t_poolMax'},
                {fieldLabel:'编码',id:'t_charset',name:'t_charset'},
                {fieldLabel:'重试次数',id:'t_tryTime',name:'t_tryTime'},
                {fieldLabel:'类型',id:'t_type',name:'t_type'}
            ]
        })]
    });
    if(panel){
        var myMask = new Ext.LoadMask(Ext.getBody(),{
            msg : '正在加载数据,请稍后...',
            removeMask:true
        });
        myMask.show();
		Ext.Ajax.request({
			url : '../../ProxyAction_queryByNameType.action',
			params : {
				appName : name,appType : type
			},
			success : function(response, opts) {
				var data = Ext.util.JSON.decode(response.responseText);
                Ext.getCmp('appName').setValue(data.appName);
                Ext.getCmp('appDesc').setValue(data.appDesc);
                Ext.getCmp('channel').setValue(showURL_channel(data.channel));
                Ext.getCmp('channelport').setValue(data.channelport);
                Ext.getCmp('isActive').setValue(show_isActive(data.isActive));
                Ext.getCmp('infoLevel').setValue(show_InfoLevel(data.infoLevel));
                Ext.getCmp('isFilter').setValue(show_is(data.isFilter));
                Ext.getCmp('isVirusScan').setValue(show_is(data.isVirusScan));
                Ext.getCmp('clientauthenable').setValue(show_is(data.clientauthenable));
                Ext.getCmp('authaddress').setValue(data.authaddress);
                Ext.getCmp('authport').setValue(data.authport);
                Ext.getCmp('authca').setValue(data.authca);
                Ext.getCmp('ipfilter').setValue(external_ipFilter_showURL(data.ipfilter));
                Ext.getCmp('serverAddress').setValue(data.serverAddress);
                Ext.getCmp('port').setValue(data.port);
                Ext.getCmp('poolMin').setValue(data.poolMin);
                Ext.getCmp('poolMax').setValue(data.poolMax);
                Ext.getCmp('charset').setValue(data.charset);
                Ext.getCmp('tryTime').setValue(data.tryTime);
                Ext.getCmp('type').setValue(data.type);
                Ext.getCmp('t_appName').setValue(data.t_appName);
                Ext.getCmp('t_appDesc').setValue(data.t_appDesc);
                Ext.getCmp('t_isActive').setValue(show_isActive(data.t_isActive));
                Ext.getCmp('t_infoLevel').setValue(show_InfoLevel(data.t_infoLevel));
                Ext.getCmp('t_isFilter').setValue(show_is(data.t_isFilter));
                Ext.getCmp('t_isVirusScan').setValue(show_is(data.t_isVirusScan));
                Ext.getCmp('t_ipfilter').setValue(internal_ipFilter_showURL(data.t_ipfilter));
                Ext.getCmp('t_serverAddress').setValue(data.t_serverAddress);
                Ext.getCmp('t_port').setValue(data.t_port);
                Ext.getCmp('t_poolMin').setValue(data.t_poolMin);
                Ext.getCmp('t_poolMax').setValue(data.t_poolMax);
                Ext.getCmp('t_charset').setValue(data.t_charset);
                Ext.getCmp('t_tryTime').setValue(data.t_tryTime);
                Ext.getCmp('t_type').setValue(data.t_type);
                myMask.hide();
            },
			failure : function(response, opts) {
                myMask.hide();
				Ext.Msg.alert('', "加载配置数据失败,请重试!");
			}
		});
    }
    var win = new Ext.Window({
        title:"通用代理--业务详细信息",
        width:750,
        layout:'fit',
        height:400,
        modal:true,
        items:panel,
        bbar:[
            '->',
            {
                text:'保存',
                handler:function(){
                    win.close();
                }
            },{
                text:'关闭',
                handler:function(){
                    win.close();
                }
            }
        ]
    }).show();
}

/**
 * 可信端黑名单 - 查看
 */
function internal_ipBlackWindow(){
    var grid = Ext.getCmp('grid.info');
    var selModel = grid.getSelectionModel();
    var appName;
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
            appName=item.data.businessName;
        });
    }
    var start = 0;			//分页--开始数
    var pageSize = 10;		//分页--每页数
    var record = new Ext.data.Record.create([
        {name:'ip',mapping:'ip'},
        {name:'mac',mapping:'mac'}
    ]);
    var proxy = new Ext.data.HttpProxy({
        url:"../../ProxyIpMacAction_readIpMac.action?typeXml=internal&proxyType=proxy&ipMacType=black"
    });
    var reader = new Ext.data.JsonReader({
        totalProperty:"total",
        root:"rows"
    },record);
    var store = new Ext.data.GroupingStore({
        id:"store.ip.proxy.internal.info",
        proxy : proxy,
        reader : reader
    });
	store.load({
        params:{
            start:start,limit:pageSize,appName:appName
        }
    });
    var boxM = new Ext.grid.CheckboxSelectionModel();   //复选框
    var rowNumber = new Ext.grid.RowNumberer();         //自动 编号
    var colM = new Ext.grid.ColumnModel([
        boxM,
        rowNumber,
        {header:"IP",dataIndex:"ip",align:'center'},
        {header:"Mac",dataIndex:"mac",align:'center'}
    ]);
    colM.defaultSortable = true;
    var page_toolbar = new Ext.PagingToolbar({
        pageSize : pageSize,
        store:store,
        displayInfo:true,
        displayMsg:"显示第{0}条记录到第{1}条记录，一共{2}条",
        emptyMsg:"没有记录",
        beforePageText:"当前页",
        afterPageText:"共{0}页"
    });
    var grid_ip = new Ext.grid.EditorGridPanel({
        id:'grid.ip.proxy.internal.info',
        plain:true,
        animCollapse:true,
        height:300,
        loadMask:{msg:'正在加载数据，请稍后...'},
        border:false,
        collapsible:false,
        heightIncrement:true,
        cm:colM,
        sm:boxM,
        store:store,
        stripeRows:true,
        autoExpandColumn:1,
        clicksToEdit:1,
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
        bbar:page_toolbar
    });
    var win = new Ext.Window({
        title:"IP/Mac黑名单",
        width:510,
        height:333,
        layout:'fit',
        modal:true,
        items: [grid_ip]
    }).show();
}

/**
 * 可信端白名单 - 查看
 */
function internal_ipWhiteWindow(){
    var grid = Ext.getCmp('grid.info');
    var selModel = grid.getSelectionModel();
    var appName;
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
            appName=item.data.businessName;
        });
    }
    var start = 0;			//分页--开始数
    var pageSize = 10;		//分页--每页数
    var record = new Ext.data.Record.create([
        {name:'ip',mapping:'ip'},
        {name:'mac',mapping:'mac'}
    ]);
    var proxy = new Ext.data.HttpProxy({
        url:"../../ProxyIpMacAction_readIpMac.action?typeXml=internal&proxyType=proxy&ipMacType=white"
    });
    var reader = new Ext.data.JsonReader({
        totalProperty:"total",
        root:"rows"
    },record);
    var store = new Ext.data.GroupingStore({
        proxy : proxy,
        reader : reader
    });
    store.load({
        params:{
            start:start,limit:pageSize,appName:appName
        }
    });
    var boxM = new Ext.grid.CheckboxSelectionModel();   //复选框
    var rowNumber = new Ext.grid.RowNumberer();         //自动 编号
    var colM = new Ext.grid.ColumnModel([
        boxM,
        rowNumber,
        {header:"IP",dataIndex:"ip",align:'center'},
        {header:"Mac",dataIndex:"mac",align:'center'}

    ]);
    colM.defaultSortable = true;
    var page_toolbar = new Ext.PagingToolbar({
        pageSize : pageSize,
        store:store,
        displayInfo:true,
        displayMsg:"显示第{0}条记录到第{1}条记录，一共{2}条",
        emptyMsg:"没有记录",
        beforePageText:"当前页",
        afterPageText:"共{0}页"
    });
    var grid_ip = new Ext.grid.EditorGridPanel({
        id:'grid.ip.proxy.internal.white.info',
        plain:true,
        animCollapse:true,
        height:300,
        loadMask:{msg:'正在加载数据，请稍后...'},
        border:false,
        collapsible:false,
        heightIncrement:true,
        cm:colM,
        sm:boxM,
        store:store,
        stripeRows:true,
        autoExpandColumn:1,
        clicksToEdit:1,
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
        bbar:page_toolbar
    });
    var win = new Ext.Window({
        title:"IP/Mac白名单",
        width:510,
        height:333,
        layout:'fit',
        modal:true,
        items: [grid_ip]
    }).show();
}

/**
 * 非可信端黑名单 - 查看
 */
function external_ipBlackWindow(){
    var grid = Ext.getCmp('grid.info');
    var selModel = grid.getSelectionModel();
    var appName;
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
            appName=item.data.businessName;
        });
    }
    var start = 0;			//分页--开始数
    var pageSize = 10;		//分页--每页数
    var record = new Ext.data.Record.create([
        {name:'ip',mapping:'ip'},
        {name:'mac',mapping:'mac'}
    ]);
    var proxy = new Ext.data.HttpProxy({
        url:"../../ProxyIpMacAction_readIpMac.action?typeXml=external&proxyType=proxy&ipMacType=black"
    });
    var reader = new Ext.data.JsonReader({
        totalProperty:"total",
        root:"rows"
    },record);
    var store = new Ext.data.GroupingStore({
        id:"store.ip.proxy.external.info",
        proxy : proxy,
        reader : reader
    });
    var boxM = new Ext.grid.CheckboxSelectionModel();   //复选框
    var rowNumber = new Ext.grid.RowNumberer();         //自动 编号
    var colM = new Ext.grid.ColumnModel([
        boxM,
        rowNumber,
        {header:"IP",dataIndex:"ip",align:'center'},
        {header:"Mac",dataIndex:"mac",align:'center'}
    ]);
    colM.defaultSortable = true;
    var page_toolbar = new Ext.PagingToolbar({
        pageSize : pageSize,
        store:store,
        displayInfo:true,
        displayMsg:"显示第{0}条记录到第{1}条记录，一共{2}条",
        emptyMsg:"没有记录",
        beforePageText:"当前页",
        afterPageText:"共{0}页"
    });
    var grid_ip = new Ext.grid.EditorGridPanel({
        id:'grid.ip.proxy.external.info',
        plain:true,
        animCollapse:true,
        height:300,
        loadMask:{msg:'正在加载数据，请稍后...'},
        border:false,
        collapsible:false,
        heightIncrement:true,
        cm:colM,
        sm:boxM,
        store:store,
        stripeRows:true,
        autoExpandColumn:1,
        clicksToEdit:1,
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
        bbar:page_toolbar
    });
    var win = new Ext.Window({
        title:"IP/Mac黑名单",
        width:510,
        height:333,
        layout:'fit',
        modal:true,
        items: [grid_ip]
    }).show();
    store.load({
        params:{
            start:start,limit:pageSize,appName:appName
        }
    });
}

/**
 * 非可信端白名单 - 查看
 */
function external_ipWhiteWindow(){
    var grid = Ext.getCmp('grid.info');
    var selModel = grid.getSelectionModel();
    var appName;
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
            appName=item.data.businessName;
        });
    }
    var start = 0;			//分页--开始数
    var pageSize = 10;		//分页--每页数
    var record = new Ext.data.Record.create([
        {name:'ip',mapping:'ip'},
        {name:'mac',mapping:'mac'}
    ]);
    var proxy = new Ext.data.HttpProxy({
        url:"../../ProxyIpMacAction_readIpMac.action?typeXml=external&proxyType=proxy&ipMacType=white"
    });
    var reader = new Ext.data.JsonReader({
        totalProperty:"total",
        root:"rows"
    },record);
    var store = new Ext.data.GroupingStore({
        proxy : proxy,
        reader : reader
    });
    var boxM = new Ext.grid.CheckboxSelectionModel();   //复选框
    var rowNumber = new Ext.grid.RowNumberer();         //自动 编号
    var colM = new Ext.grid.ColumnModel([
        boxM,
        rowNumber,
        {header:"IP",dataIndex:"ip",align:'center'},
        {header:"Mac",dataIndex:"mac",align:'center'}
    ]);
    colM.defaultSortable = true;
    var page_toolbar = new Ext.PagingToolbar({
        pageSize : pageSize,
        store:store,
        displayInfo:true,
        displayMsg:"显示第{0}条记录到第{1}条记录，一共{2}条",
        emptyMsg:"没有记录",
        beforePageText:"当前页",
        afterPageText:"共{0}页"
    });
    var grid_ip = new Ext.grid.EditorGridPanel({
        id:'grid.ip.proxy.external.white.info',
        plain:true,
        animCollapse:true,
        height:300,
        loadMask:{msg:'正在加载数据，请稍后...'},
        border:false,
        collapsible:false,
        heightIncrement:true,
        cm:colM,
        sm:boxM,
        store:store,
        stripeRows:true,
        autoExpandColumn:1,
        clicksToEdit:1,
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
        bbar:page_toolbar
    });
    var win = new Ext.Window({
        title:"IP/Mac白名单",
        width:510,
        height:333,
        layout:'fit',
        modal:true,
        items: [grid_ip]
    }).show();
    store.load({
        params:{
            start:start,limit:pageSize,appName:appName
        }
    });
}

/**
 * 非可信可访问IP - 查看
 */
function external_ipAddress(){
    var grid = Ext.getCmp('grid.info');
    var selModel = grid.getSelectionModel();
    var appName;
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
            appName=item.data.businessName;
        });
    }
    var start = 0;			//分页--开始数
    var pageSize = 10;		//分页--每页数
    var record = new Ext.data.Record.create([
        {name:'ip',mapping:'ip'},
        {name:'ipEnd',mapping:'ipEnd'}
    ]);
    var proxy = new Ext.data.HttpProxy({
        url:"../../ProxyIpAllowAction_select.action?typeXml=external&type=proxy"
    });
    var reader = new Ext.data.JsonReader({
        totalProperty:"total",
        root:"rows"
    },record);
    var store = new Ext.data.GroupingStore({
        id:"store.ip.proxy.external.info",
        proxy : proxy,
        reader : reader
    });
    var boxM = new Ext.grid.CheckboxSelectionModel();   //复选框
    var rowNumber = new Ext.grid.RowNumberer();         //自动 编号
    var colM = new Ext.grid.ColumnModel([
        boxM,
        rowNumber,
        {header:"IP",       dataIndex:"ip",      align:'center',menuDisabled:true},
        {header:"终止IP",   dataIndex:"ipEnd",  align:'center',menuDisabled:true}
    ]);
    colM.defaultSortable = true;
    var page_toolbar = new Ext.PagingToolbar({
        pageSize : pageSize,
        store:store,
        displayInfo:true,
        displayMsg:"显示第{0}条记录到第{1}条记录，一共{2}条",
        emptyMsg:"没有记录",
        beforePageText:"当前页",
        afterPageText:"共{0}页"
    });
    var grid_ip = new Ext.grid.EditorGridPanel({
        id:'grid.ip.proxy.external.info',
        plain:true,
        animCollapse:true,
        height:300,
        loadMask:{msg:'正在加载数据，请稍后...'},
        border:false,
        collapsible:false,
        heightIncrement:true,
        cm:colM,
        sm:boxM,
        store:store,
        stripeRows:true,
        autoExpandColumn:1,
        clicksToEdit:1,
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
        bbar:page_toolbar
    });
    var win = new Ext.Window({
        title:"IP管理-可信认证代理",
        width:600,
        height:300,
        layout:'fit',
        modal:true,
        items: [grid_ip]
    }).show();
    store.load({
        params:{
            start:start,limit:pageSize,appName:appName
        }
    });
}

/**
 * 数据源 表集合 查找
 */
function external_detail_db_attribute_source(appName,dbName,operation){
    var start = 0;			//分页--开始数
    var pageSize = 5;		//分页--每页数
    var record = new Ext.data.Record.create([
        {name:'tableName',mapping:'tableName'},
        {name:'seqnumber',mapping:'seqnumber'},
        {name:'interval',     mapping:'interval'},
        {name:'monitorinsert',mapping:'monitorinsert'},
        {name:'monitordelete',mapping:'monitordelete'},
        {name:'monitorupdate',mapping:'monitorupdate'},
        {name:'flag',mapping:'flag'}
    ]);
    var proxy = new Ext.data.HttpProxy({
        url:"../../DBSourceTableAction_readSourceTableNames.action?typeXml=external&tables=tables_1"
    });
    var reader = new Ext.data.JsonReader({
        totalProperty:"total",
        root:"rows"
    },record);
    var store = new Ext.data.GroupingStore({
        proxy : proxy,
        reader : reader
    });

    var boxM = new Ext.grid.CheckboxSelectionModel();   //复选框
    var rowNumber = new Ext.grid.RowNumberer();         //自动 编号
    var colM = new Ext.grid.ColumnModel([
        boxM,
        rowNumber,
        {header:"表名",dataIndex:"tableName",align:'center',menuDisabled:true,sortable:true},
        {header:"同步顺序",dataIndex:"seqnumber",align:'center',menuDisabled:true,sortable:true},
        {header:"表频率",dataIndex:"interval",align:'center',sortable:true},
        {header:"触发增加",dataIndex:"monitorinsert",align:'center',sortable:true,renderer:show_is},
        {header:"触发删除",dataIndex:"monitordelete",align:'center',sortable:true,renderer:show_is},
        {header:"触发修改",dataIndex:"monitorupdate",align:'center',sortable:true,renderer:show_is},
        {header:"操作标记",dataIndex:"flag",align:'center',menuDisabled:true,sortable:true,      renderer:external_showURL_table_source_attribute_flag,     width:200}

    ]);
    for(var i=5;i<8;i++){
        colM.setHidden(i,!colM.isHidden(i));                // 加载后 不显示 该项
    }
    colM.defaultSortable = true;
    var page_toolbar = new Ext.PagingToolbar({
        pageSize : pageSize,
        store:store,
        displayInfo:true,
        displayMsg:"显示第{0}条记录到第{1}条记录，一共{2}条",
        emptyMsg:"没有记录",
        beforePageText:"当前页",
        afterPageText:"共{0}页"
    });
    var grid = new Ext.grid.EditorGridPanel({
        id:'grid.table.query.source.external.info',
        plain:true,
        animCollapse:true,
        height:300,
        loadMask:{msg:'正在加载数据，请稍后...'},
        border:false,
        collapsible:false,
        heightIncrement:true,
        cm:colM,
        sm:boxM,
        store:store,
        stripeRows:true,
        autoExpandColumn:1,

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
        view:new Ext.grid.GroupingView({
            forceFit:true,
            groupingTextTpl:'{text}({[values.rs.length]}条记录)'
        }),
        bbar:page_toolbar
    });
    var win = new Ext.Window({
        title:"数据源"+dbName+"下表属性",
        width:600,
        height:330,
        layout:'fit',
        modal:true,
        items: [grid]
    }).show();
    store.load({
        params:{
            start:start,limit:pageSize,appName:appName,dbName:dbName
        }
    });
    function external_showURL_table_source_attribute_flag(value){
       return "<a href='javascript:;' onclick='external_update_db_source_attribute(\""+appName+"\",\""+dbName+"\",\""+operation+"\");' style='color: green;'>查看表属性</a>";
    }
}

function show_is_pk(value){
    return (value=='true'||value==true)?'是':'否';
}

/**
 * 数据源 表集合  查看
 * @param appName
 * @param dbName
 * @param operation
 */
function external_update_db_source_attribute(appName,dbName,operation){
	var source_table_grid = Ext.getCmp('grid.table.query.source.external.info');
    var source_table_store = source_table_grid.getStore();
    var selModel = source_table_grid.getSelectionModel();
    var tableName;
    var seqnumber;
    var interval;
    var monitorinsert;
    var monitordelete;
    var monitorupdate;
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
        	tableName = item.data.tableName;
            seqnumber = item.data.seqnumber;
            interval = item.data.interval;
            monitorinsert = item.data.monitorinsert;
            monitordelete = item.data.monitordelete;
            monitorupdate = item.data.monitorupdate;
        });
    }

    //==================================== --  -- =============================================================

    var record = new Ext.data.Record.create([
        {name:'field',			mapping:'field'},
        {name:'is_null',		mapping:'is_null'},
        {name:'column_size',	mapping:'column_size'},
        {name:'db_type',		mapping:'db_type'},
        {name:'jdbc_type',	mapping:'jdbc_type'},
        {name:'is_pk',			mapping:'is_pk'},
        {name:'checked',      mapping:'checked'}
    ]);
    var proxy = new Ext.data.HttpProxy({
        url:"../../DBSourceTableAction_readSourceTableField.action"
    });
    var reader = new Ext.data.JsonReader({
        totalProperty:"total",
        root:"rows"
    },record);
    var store = new Ext.data.GroupingStore({
        id:"store.grid.db.info",
        proxy : proxy,
        reader : reader
    });
    //==================================== --  -- =============================================================
    var start = 0;
    var pageSize = 10;
    var boxM = new Ext.grid.CheckboxSelectionModel();   //复选框
    var rowNumber = new Ext.grid.RowNumberer();         //自动 编号
    var colM = new Ext.grid.ColumnModel([
        boxM,
        rowNumber,
        {header:"字段名",	   dataIndex:"field",		    align:'center',sortable:true,menuDisabled:true},
        {header:"主键",  dataIndex:"is_pk",		    align:'center',sortable:true,menuDisabled:true,renderer:show_is_pk},//editor:is_pk,
        {header:"为空",  dataIndex:"is_null",		align:'center',sortable:true},
        {header:"长度",	   dataIndex:"column_size",	align:'center',sortable:true},
        {header:"Jdbc类型",  dataIndex:"jdbc_type",	align:'center',sortable:true},//,editor:jdbc_type
        {header:"DB类型",	   dataIndex:"db_type",		align:'center',sortable:true,menuDisabled:true}//,editor:db_type

    ]);
    colM.defaultSortable = true;
    colM.setHidden(4,!colM.isHidden(4));
    colM.setHidden(5,!colM.isHidden(5));
    var grid = new Ext.grid.EditorGridPanel({
        id:'external_update_db_source_tables.grid.info',
        plain:true,
        animCollapse:true,
        autoScroll : true,
        height:310,
        loadMask:{msg:'正在加载数据，请稍后...'},
        border:false,
        collapsible:false,
        heightIncrement:true,
        cm:colM,
        sm:boxM,
        store:store,
        stripeRows:true,
        autoExpandColumn:1,
        clicksToEdit:1,
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
        }/*,
        bbar:new Ext.PagingToolbar({
            pageSize : pageSize,
            store:store,
            displayInfo:true,
            displayMsg:"显示第{0}条记录到第{1}条记录，一共{2}条",
            emptyMsg:"没有记录",
            beforePageText:"当前页",
            afterPageText:"共{0}页"
        })*/
    });
    //==================================== --  -- =============================================================
    var formPanel = new Ext.form.FormPanel({
        plain:true,
        labelAlign:'right',
//        autoScroll:true,
        labelWidth:65,
        height:60,
        items:[{
            xtype:'hidden',
            name:'typeBase.appName',
            value:appName
        },{
            xtype:'hidden',
            name:'typeBase.privated',
            value:false
        },{
            xtype:'hidden',
            name:'typeDB.dbName',
            value:dbName
        },{
            xtype:'hidden',
            name:'typeDB.operation',
            value:operation
        },{
            xtype:'hidden',
            name:'typeTable.tableName',
            value:tableName
        },{
            id:'cf.info',
            layout:'column',
            items:[{
                columnWidth:.3,
                layout:'form',
                items:[{
                    id:'external.form.table.monitorinsert.info',
                    fieldLabel:"增加",
                    xtype:'checkbox',
                    name:'typeTable.insert',
                    checked:monitorinsert
                }]
            },{
                columnWidth:.3,
                layout:'form',
                items:[{
                    id:'external.form.table.monitordelete.info',
                    fieldLabel:"删除",
                    xtype:'checkbox',
                    name:'typeTable.delete',
                    checked:monitordelete
                }]
            },{
                columnWidth:.3,
                layout:'form',
                items:[{
                    id:'external.form.table.monitorupdate.info',
                    fieldLabel:"修改",
                    xtype:'checkbox',
                    name:'typeTable.update',
                    checked:monitorupdate
                }]
            }]
        },{
            layout:'column',
            items:[{
                columnWidth:.5,
                labelWidth:100,
                layout:'form',
                items:[{
                    id:'external.form.table.seqnumber.info',
                    width:100,
                    fieldLabel:"同步顺序",
                    name:'typeTable.seqnumber',
                    xtype:'displayfield',
                    value:seqnumber
                }]
            },{
                columnWidth:.5,
                layout:'form',
                labelWidth:100,
                items:[{
                    id:'external.form.table.interval.info',
                    width:100,
                    fieldLabel:"表频率",
                    name:'typeTable.interval',
                    xtype:'displayfield',
                    value:interval
                }]
            }]
        }]
    });
	var win = new Ext.Window({
        title:"详细信息-数据源"+dbName+"下表"+tableName+"的属性设置",
        width:600,
        height:430,
        layout:'fit',
        modal:true,
        items: [{
            frame:true,
            autoScroll:true,
            items:[{
                layout:'fit',
                items:formPanel
            },grid]
        }],
        bbar:["->",{
            id:'external.update.db.source.tables.info',
            text:'保存',
            handler:function(){
                win.close();
            }
        },{
            text:'关闭',
            handler:function(){
                win.close();
            }
        }],
        listeners:{
            show:function(){
                if(operation=='entirely'||operation=='timesync'||operation=='delete'||operation=='flag'){
                    Ext.getCmp('cf.info').disable();
                }
            }
        }
    }).show();
    store.load({
        params:{
            start:start,limit:pageSize,typeXml:'external',type:'update',tableName:tableName,dbName:dbName,appName:appName
        }
    });
    store.addListener('load',function(){
    	for(var i = 0; i < store.getCount(); i ++){
            var record = store.getAt(i);
            if(record.data.checked){
                boxM.selectRow(store.indexOf(record),true);
            }
        }
    });
}

/**
 *目标   表集合 查找
 */
function internal_detail_db_attribute_target(appName,srcDBName){
    var start = 0;			//分页--开始数
    var pageSize = 10;		//分页--每页数
    var record = new Ext.data.Record.create([
        {name:'srcTableName',mapping:'srcTableName'},
        {name:'flag',mapping:'flag'}
    ]);
    var proxy = new Ext.data.HttpProxy({
        url:"../../DBTargetTableAction_readTargetTableNames.action?typeXml=internal&tables=tables_2"
    });
    var reader = new Ext.data.JsonReader({
        totalProperty:"total",
        root:"rows"
    },record);
    var store = new Ext.data.GroupingStore({
        proxy : proxy,
        reader : reader
    });
    var boxM = new Ext.grid.CheckboxSelectionModel();   //复选框
    var rowNumber = new Ext.grid.RowNumberer();         //自动 编号
    var colM = new Ext.grid.ColumnModel([
        boxM,
        rowNumber,
        {header:"源表名",  dataIndex:"srcTableName", align:'center',sortable:true,menuDisabled:true},
        {header:"目标表名",dataIndex:"flag",          align:'center',sortable:true,menuDisabled:true,renderer:internal_showURL_table_target_attribute_flag,width:100}

    ]);
    colM.defaultSortable = true;
    var page_toolbar = new Ext.PagingToolbar({
        pageSize : pageSize,
        store:store,
        displayInfo:true,
        displayMsg:"显示第{0}条记录到第{1}条记录，一共{2}条",
        emptyMsg:"没有记录",
        beforePageText:"当前页",
        afterPageText:"共{0}页"
    });
    var grid = new Ext.grid.EditorGridPanel({
        id:'grid.table.query.target.internal.info',
        plain:true,
        animCollapse:true,
        height:300,
        loadMask:{msg:'正在加载数据，请稍后...'},
        border:false,
        collapsible:false,
        heightIncrement:true,
        cm:colM,
        sm:boxM,
        store:store,
        stripeRows:true,
        autoExpandColumn:1,
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
        bbar:page_toolbar
    });
    var win = new Ext.Window({
        title:"目标表属性",
        width:600,
        height:330,
        layout:'fit',
        modal:true,
        items: [grid]
    }).show();

	store.load({
        params:{
            start:start,limit:pageSize,appName:appName
        }
    });
    function internal_showURL_table_target_attribute_flag(value){
       return "<a href='javascript:;' style='color: green;' onclick='internal_update_db_target_db(\""+appName+"\",\""+srcDBName+"\");'>查找目标表属性</a>";
    }
}

/**
 * 目标   表集合  查找  -- 选择 目标数据库名
 */
function internal_update_db_target_db(appName,srcDBName){
    var grid = Ext.getCmp('grid.table.query.target.internal.info');
    var selModel = grid.getSelectionModel();
    var srcTableName;
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
        	srcTableName = item.data.srcTableName;
        });
    }
	//==================================== --  -- =============================================================
    var internal_targetDB_record = new Ext.data.Record.create([
        {name:'value',mapping:'value'},
		{name:'key',mapping:'key'}
    ]);
    var internal_targetDB_proxy = new Ext.data.HttpProxy({
        url:"../../JdbcAction_readJdbcName.action?typeXml=internal"
    });
    var internal_targetDB_reader = new Ext.data.JsonReader({
        totalProperty:"total",
        root:"rows"
    },internal_targetDB_record);
    var internal_targetDB_store = new Ext.data.Store({
        proxy : internal_targetDB_proxy,
        reader : internal_targetDB_reader
    });

    var internal_targetDB = new Ext.form.ComboBox({
        id:'internal_targetDB.update.db.info',
        listWidth : 170,
        store :  internal_targetDB_store,
        valueField : 'value',
        displayField : 'key',
        emptyText:'-- 请选择 --',
        typeAhead : true,
        mode : 'local',
        triggerAction : 'all',
        selectOnFocus : true,
        allowBlank : false
    });
   //===================================================================================================================
    var start = 0;			//分页--开始数
    var pageSize = 5;		//分页--每页数
    var record = new Ext.data.Record.create([
        {name:'targetDB',mapping:'targetDB'}
    ]);
    var proxy = new Ext.data.HttpProxy({
        url:"../../DBTargetTableAction_readTargetDBNamesInXml.action?typeXml=internal&appName="+appName+"&srcTableName="+srcTableName
    });
    var reader = new Ext.data.JsonReader({
        totalProperty:"total",
        root:"rows"
    },record);
    var store_targetdbName  = new Ext.data.GroupingStore({
        id:"store.ip.db.external.info",
        proxy : proxy,
        reader : reader
    });

    var boxM = new Ext.grid.CheckboxSelectionModel();   //复选框
    var rowNumber = new Ext.grid.RowNumberer();         //自动 编号
    var colM = new Ext.grid.ColumnModel([
        boxM,
        rowNumber,
        {header:"目标数据库名",dataIndex:"targetDB",align:'center',sortable:true,editor:internal_targetDB},
        {header:"目标表选择",dataIndex:"flag",align:'center',sortable:true,renderer:internal_showURL_update_target_db,width:100}
    ]);
    colM.defaultSortable = true;
    var page_toolbar = new Ext.PagingToolbar({
        pageSize : pageSize,
        store:store_targetdbName,
        displayInfo:true,
        displayMsg:"显示第{0}条记录到第{1}条记录，一共{2}条",
        emptyMsg:"没有记录",
        beforePageText:"当前页",
        afterPageText:"共{0}页"
    });
    var grid_targetdbName = new Ext.grid.EditorGridPanel({
        id:'grid.targetdbName.db.internal.info',
        plain:true,
        animCollapse:true,
        height:300,
        loadMask:{msg:'正在加载数据，请稍后...'},
        border:false,
        collapsible:false,
        heightIncrement:true,
        cm:colM,
        sm:boxM,
        store:store_targetdbName,
        stripeRows:true,
        autoExpandColumn:1,
        clicksToEdit:1,
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
        bbar:page_toolbar
    });
    var win = new Ext.Window({
        title:"源表"+srcTableName+"的目标数据库名",
        width:600,
        height:330,
        layout:'fit',
        modal:true,
        items:[grid_targetdbName]
    }).show();
    internal_targetDB_store.load();
    store_targetdbName .load({
        params:{
            start:start,limit:pageSize
        }
    });
    function internal_showURL_update_target_db(){
        return "<a href='javascript:;' style='color: green;' onclick='internal_update_db_target_db_table(\""+appName+"\",\""+srcDBName+"\",\""+srcTableName+"\");'>目标表选择</a>"
    }
}

/**
 * 目标   表集合  查找  -- 选择 目标数据库名  表
 * @param appName
 * @param srcTableName
 */
function internal_update_db_target_db_table(appName,srcDBName,srcTableName){
    var grid = Ext.getCmp('grid.targetdbName.db.internal.info');
    var selModel = grid.getSelectionModel();
    var targetDB;
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
        	targetDB = item.data.targetDB;
        });
    }
    //==================================== --  -- =============================================================
    var internal_targetTable_record = new Ext.data.Record.create([
        {name:'value',mapping:'value'},
		{name:'key',mapping:'key'}
    ]);
    var internal_targetTable_proxy = new Ext.data.HttpProxy({
        url:"../../DBTargetTableAction_readTargetDBKeyValue.action"
    });
    var internal_targetTable_reader = new Ext.data.JsonReader({
        totalProperty:"total",
        root:"rows"
    },internal_targetTable_record);
    var internal_targetTable_store = new Ext.data.Store({
        proxy : internal_targetTable_proxy,
        reader : internal_targetTable_reader
    });

    var internal_targetTable = new Ext.form.ComboBox({
        id:'internal_targetTable.update.db.info',
        listWidth : 170,
        store :  internal_targetTable_store,
        valueField : 'value',
        displayField : 'key',
        emptyText:'-- 请选择 --',
        typeAhead : true,
        mode : 'local',
        triggerAction : 'all',
        selectOnFocus : true,
        allowBlank : false
    });

    //==================================== --  -- =============================================================
    var start = 0;			//分页--开始数
    var pageSize = 5;		//分页--每页数
    var record = new Ext.data.Record.create([
        {name:'targetTable',mapping:'targetTable'}
    ]);
    var proxy = new Ext.data.HttpProxy({
        url:"../../DBTargetTableAction_readTargetTableNamesInXml.action?typeXml=internal&appName="+appName+"&srcTableName="+srcTableName+"&targetDB="+targetDB
    });
    var reader = new Ext.data.JsonReader({
        totalProperty:"total",
        root:"rows"
    },record);
    var store_targetTabel = new Ext.data.GroupingStore({
        id:"store.ip.db.external.info",
        proxy : proxy,
        reader : reader
    });

    var boxM = new Ext.grid.CheckboxSelectionModel();   //复选框
    var rowNumber = new Ext.grid.RowNumberer();         //自动 编号
    var colM = new Ext.grid.ColumnModel([
        boxM,
        rowNumber,
        {header:"目标表名",     dataIndex:"targetTable",align:'center',sortable:true,menuDisabled:true,editor:internal_targetTable},
        {header:"目标表属性",   dataIndex:"flag",        align:'center',sortable:true,menuDisabled:true,renderer:internal_showURL_target_table_attribute}
    ]);
    colM.defaultSortable = true;
    var page_toolbar = new Ext.PagingToolbar({
        pageSize : pageSize,
        store:store_targetTabel,
        displayInfo:true,
        displayMsg:"显示第{0}条记录到第{1}条记录，一共{2}条",
        emptyMsg:"没有记录",
        beforePageText:"当前页",
        afterPageText:"共{0}页"
    });
    var grid_targetTabel = new Ext.grid.EditorGridPanel({
        id:'grid.targetdbName.table.db.internal.info',
        plain:true,
        animCollapse:true,
        height:300,
        loadMask:{msg:'正在加载数据，请稍后...'},
        border:false,
        collapsible:false,
        heightIncrement:true,
        cm:colM,
        sm:boxM,
        store:store_targetTabel,
        stripeRows:true,
        autoExpandColumn:1,
        clicksToEdit:1,
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
        bbar:page_toolbar
    });
    var win = new Ext.Window({
        title:"源表"+srcTableName+"对应的目标数据库"+targetDB+"下的表",
        width:600,
        height:330,
        layout:'fit',
        modal:true,
        items:[grid_targetTabel]
    }).show();
    internal_targetTable_store.load({
        params:{dbName:targetDB}
    });
    store_targetTabel.load({
        params:{
            start:start,limit:pageSize
        }
    });
    function internal_showURL_target_table_attribute(){
        return "<a href='javascript:;' style='color: green;' onclick='internal_update_db_target_db_table_attribute(\""+appName+"\",\""+srcDBName+"\",\""+srcTableName+"\",\""+targetDB+"\");'>查找目标表属性</a>"
    }
}

/**
 * 目标   表集合  查找  -- 选择 目标数据库名  表  属性
 * @param appName
 * @param srcTableName
 * @param targetDB
 */
function internal_update_db_target_db_table_attribute(appName,srcDBName,srcTableName,targetDB){
    var internal_grid = Ext.getCmp('grid.targetdbName.table.db.internal.info');
    var selModel = internal_grid.getSelectionModel();
    var targetTable;
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
           targetTable = item.data.targetTable;
        });
    }
    var form_store = new Ext.data.JsonStore({
        url : '../../DBTargetTableAction_readTargetTableAttribute.action',
        totalProperty : 'total',
        root : 'rows',
        fields : [
            {name : 'deleteEnable', mapping:'deleteEnable'},
            {name : 'onlyInsert',   mapping:'onlyInsert'},
            {name : 'condition',    mapping:'condition'}
        ]
    });

    var formPanel = new Ext.form.FormPanel({
        plain:true,
        labelAlign:'right',
        autoScroll:true,
        labelWidth:100,
        height:100,
        defaults:{
            allowBlank:false,
            blankText:'该项不能为空！'
        },
        items:[{
            xtype:'hidden',
            name:'typeBase.appName',
            value:appName
        },{
            xtype:'hidden',
            name:'typeBase.privated',
            value:true
        },{
            xtype:'hidden',
            name:'typeTable.tableName',
            value:targetTable
        },{
            xtype:'hidden',
            name:'typeTable.targetDBName',
            value:targetDB
        },{
            xtype:'hidden',
            name:'typeTable.sourceTableName',
            value:srcTableName
        },{
            layout:'column',
            items:[{
                columnWidth:.5,
                labelWidth:170,
                layout:'form',
                items:[{
                    fieldLabel:"源表名",
                    xtype:'displayfield',
                    value:srcTableName
                }]
            },{
                columnWidth:.5,
                labelWidth:120,
                layout:'form',
                items:[{
                    fieldLabel:"目标表名",
                    xtype:'displayfield',
                    value:targetTable
                }]
            }]
        },{
            layout:'column',
            items:[{
                columnWidth:.5,
                labelWidth:170,
                layout:'form',
                items:[{
                    id:'internal.form.table.deleteEnable.info',
                    width:70,
                    fieldLabel:"允许删除操作",
                    xtype:'checkbox',
                    name:'typeTable.deleteEnable'
                }]
            },{
                columnWidth:.5,
                labelWidth:120,
                layout:'form',
                items:[{
                    id:'internal.form.table.onlyInsert.info',
                    width:70,
                    fieldLabel:"只允许插入操作",
                    xtype:'checkbox',
                    name:'typeTable.onlyInsert'
                }]
            }]
        },{
            labelWidth:170,
            layout:'form',
            items:[{
                id:'internal.form.table.condition.info',
                width:150,
                fieldLabel:"分流条件(正则表达式)",
                xtype: 'textfield',
                name:'typeTable.condition'
            }]
        }]
    });
    //==================================== -- source_grid -- =============================================================
    var start = 0;
    var pageSize = 10;
    var source_record = new Ext.data.Record.create([
        {name:'field',			mapping:'field'},
        {name:'is_null',		mapping:'is_null'},
        {name:'column_size',	mapping:'column_size'},
        {name:'db_type',		mapping:'db_type'},
        {name:'jdbc_type',	mapping:'jdbc_type'},
        {name:'is_pk',			mapping:'is_pk'},
        {name:'dest',			mapping:'dest'},
        {name:'checked',		mapping:'checked'}
    ]);
    var source_proxy = new Ext.data.HttpProxy({
        url:"../../DBTargetTableAction_readSourceTableField.action"
    });
    var source_reader = new Ext.data.JsonReader({
        totalProperty:"total",
        root:"rows"
    },source_record);
    var source_store = new Ext.data.GroupingStore({
        id:"store.grid.db.info",
        proxy : source_proxy,
        reader : source_reader
    });

    //==================================== -- target_grid -- =============================================================

    var source_boxM = new Ext.grid.CheckboxSelectionModel();   //复选框
    var source_rowNumber = new Ext.grid.RowNumberer();         //自动 编号
    var source_colM = new Ext.grid.ColumnModel([
        source_boxM,
        source_rowNumber,
        {header:"源字段名",	   	dataIndex:"field",			align:'center',sortable:true,menuDisabled:true},
        {header:"主键",	dataIndex:"is_pk",			align:'center',sortable:true,renderer:show_is_pk},
        {header:"为空",	dataIndex:"is_null",		    align:'center',sortable:true},
        {header:"长度",	    dataIndex:"column_size",	    align:'center',sortable:true},
        {header:"Jdbc类型",	dataIndex:"jdbc_type",	    align:'center',sortable:true},
        {header:"DB类型",		dataIndex:"db_type",		    align:'center',sortable:true},
        {header:"目标字段名",		dataIndex:"dest",			    align:'center',sortable:true,menuDisabled:true}
    ]);
    for(var i=4;i<6;i++){
        source_colM.setHidden(i,!source_colM.isHidden(i));                // 加载后 不显示 该项
    }
    source_colM.defaultSortable = true;
    var source_grid = new Ext.grid.EditorGridPanel({
        id:'internal_read_db_target_target_tables.grid.info',
        plain:true,
        animCollapse:true,
        height:310,
        loadMask:{msg:'正在加载数据，请稍后...'},
        border:false,
        collapsible:false,
        heightIncrement:true,
        cm:source_colM,
        sm:source_boxM,
        store:source_store,
        stripeRows:true,
        autoExpandColumn:1,
        clicksToEdit:1,
        disableSelection:true,
        bodyStyle:'width:100%',
        enableDragDrop: true,
        selModel:new Ext.grid.RowSelectionModel({singleSelect:false}),
        viewConfig:{
            forceFit:true,
            enableRowBody:true,
            getRowClass:function(record,rowIndex,p,store){
                return 'x-grid3-row-collapsed';
            }
        }/*,
        bbar:new Ext.PagingToolbar({
            pageSize : pageSize,
            store:source_store,
            displayInfo:true,
            displayMsg:"显示第{0}条记录到第{1}条记录，一共{2}条",
            emptyMsg:"没有记录",
            beforePageText:"当前页",
            afterPageText:"共{0}页"
        })*/
    });
	var win = new Ext.Window({
        title:"源表"+srcTableName+"对应的目标数据库"+targetDB+"下的目标表"+targetTable+"属性查找",
        width:600,
        height:480,
        layout:'fit',
        modal:true,
        items: [{
            frame:true,
            autoScroll:true,
            items:[{
                layout:'fit',
                items:formPanel
            },source_grid]
        }],
        bbar:["->",{
            id:'internal.update.db.target.target.tables.info',
            text:'保存',
            handler:function(){
            	win.close();
            }
        },{
            text:'关闭',
            handler:function(){
                win.close();
            }
        }]
    }).show();
    form_store.load({ params:{typeXml:'internal',targetTable:targetTable,targetDB:targetDB,appName:appName,srcTableName:srcTableName}});
    form_store.on('load',function(){
        var deleteEnable = form_store.getAt(0).get('deleteEnable');
        var onlyInsert = form_store.getAt(0).get('onlyInsert');
        var condition = form_store.getAt(0).get('condition');
        if(deleteEnable=='true'){
            Ext.getCmp('internal.form.table.deleteEnable.info').setValue(true);
        }else if(deleteEnable=='false'){
            Ext.getCmp('internal.form.table.deleteEnable.info').setValue(false);
        }
        if(onlyInsert=='true'){
            Ext.getCmp('internal.form.table.onlyInsert.info').setValue(true);
        }else if(onlyInsert=='false'){
            Ext.getCmp('internal.form.table.onlyInsert.info').setValue(false);
        }
        Ext.getCmp('internal.form.table.condition.info').setValue(condition);
	});
    source_store.load({
        params:{
            start:start,limit:pageSize,typeXml:'internal',type:'update',appName:appName,
            sourceDBName:srcDBName,sourceTableName:srcTableName,
            targetTableName:targetTable,targetDBName:targetDB
        }
    });
    source_store.addListener('load',function(){
        for(var i = 0; i < source_store.getCount(); i ++){
            var record = source_store.getAt(i);
            if(record.data.checked){
                source_boxM.selectRow(source_store.indexOf(record),true);
            }
        }
    });
}