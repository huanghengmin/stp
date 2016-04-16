/**
 * 内网数据源 -- 目标端
 */
//==================================== -- 内网数据源 extjs 页面-- =============================================================
Ext.onReady(function(){
    Ext.BLANK_IMAGE_URL = '../../js/ext/resources/images/default/s.gif';
    Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget = 'qtip';

    var start = 0;			//分页--开始数
    var pageSize = 15;		//分页--每页数
    var record = new Ext.data.Record.create([
        {name:'jdbcName',			mapping:'jdbcName'},
        {name:'jdbcDesc',			mapping:'jdbcDesc'},
        {name:'dbType',			mapping:'dbType'},
        {name:'version',			mapping:'version'},
        {name:'dbName',			mapping:'dbName'},
        {name:'dbVender',			mapping:'dbVender'},
        {name:'dbCatalog',		mapping:'dbCatalog'},
        {name:'dbUrl',				mapping:'dbUrl'},
        {name:'dbOwner',			mapping:'dbOwner'},
        {name:'dbHost',			mapping:'dbHost'},
        {name:'dbPort',			mapping:'dbPort'},
        {name:'driverClass',		mapping:'driverClass'},
        {name:'dbUser',			mapping:'dbUser'},
        {name:'password',			mapping:'password'},
        {name:'encoding',			mapping:'encoding'},
        {name:'isUsed',			mapping:'isUsed'},
        {name:'flag',				mapping:'flag'}
    ]);
    var proxy = new Ext.data.HttpProxy({
        url:"../../JdbcAction_select.action?typeXml=internal"
    });
    var reader = new Ext.data.JsonReader({
        totalProperty:"total",
        root:"rows"
    },record);
    var store = new Ext.data.GroupingStore({
        id:"store.grid.internal.source.info",
        proxy : proxy,
        reader : reader
    });

    var boxM = new Ext.grid.CheckboxSelectionModel();   //复选框
    var rowNumber = new Ext.grid.RowNumberer();         //自动 编号
    var colM = new Ext.grid.ColumnModel([
        boxM,
        rowNumber,
        {header:"数据源名称",			dataIndex:"jdbcName",		align:'center'},
        {header:"数据源描述",			dataIndex:"jdbcDesc",		align:'center'},
        {header:'数据库类型',			dataIndex:'dbType',			align:'center',renderer:internal_showURL_dbType},
        {header:'数据库版本',			dataIndex:'version',			align:'center'},
        {header:'地址',				dataIndex:'dbHost',			align:'center'},
        {header:'数据库名称',			dataIndex:'dbName',			align:'center'},
        {header:'数据库供应商',		dataIndex:'dbVender',		align:'center'},
        {header:'模式所有者',			dataIndex:'dbOwner',		    align:'center'},
        {header:'用户',				dataIndex:'dbUser',			align:'center'},
        {header:'CATALOG',			dataIndex:'dbCatalog',		align:'center'},
        {header:'URL',				    dataIndex:'dbUrl',			align:'center'},
        {header:'数据库驱动',			dataIndex:'driverClass',	    align:'center'},
        {header:'口令',				dataIndex:'password',		align:'center'},
        {header:'编码',				dataIndex:'encoding',		align:'center'},
        {header:'使用状态',			dataIndex:'isUsed',		    align:'center',       renderer:internal_showURL_used},
        {header:'操作标记',			dataIndex:'flag',			    align:'center',		renderer:internal_showURL_flag,	width:100}

    ]);
    for(var i=7;i<15;i++){
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
    var grid_panel = new Ext.grid.GridPanel({
        id:'grid.internal.source.info',
        plain:true,
        hieght:setHeight(),
        width:setWidth(),
        animCollapse:true,
        loadMask:{msg:'正在加载数据，请稍后...'},
        border:false,
        collapsible:false,
        cm:colM,
        sm:boxM,
        store:store,
        stripeRows:true,
        autoExpandColumn:'Position',
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
                id:'btnAdd.internal.source.info',
                text:'新增',
                iconCls:'add',
                handler:function(){
                    insert_internal_source_win(grid_panel,store);     //连接到 新增 面板
                }
            }),
            {xtype:"tbseparator"},
			new Ext.Button ({
			    id : 'btnRemove.internal.source.info',
                text : '删除',
				iconCls : 'remove',
				handler : function() {
					delete_internal_source_row(grid_panel,store);         //删除 表格 的 一 行 或多行
				}
            })
        ],
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
});
function setHeight(){
	var h = document.body.clientHeight-8;
	return h;
}

function setWidth(){
    return document.body.clientWidth-8;
}
//============================================ -- javascript function -- =============================================================================

function internal_showURL_dbType(value) {
    if(value=='mssql') {
        return 'MicroSoft SqlServer';
    } else if(value=='oracle'){
        return 'Oracle';
    /*} else if(value==''){
        return '';
    } else if(value==''){
        return '';*/
    } else {
        return value;
    }
}

function internal_showURL_used(value){
    if(value){
        return "<font color='green'>使用中</font> ";
    } else {
        return "空闲中";
    }
}


function internal_showURL_flag(value,p,r){
    var isUsed = r.get('isUsed');
    var update;
    if(isUsed){
        update = "<a href='javascript:;' onclick='update_internal_source_win_2();' style='color: green;'>修改</a>";
    } else {
        update = "<a href='javascript:;' onclick='update_internal_source_win();' style='color: green;'>修改</a>";
    }
	return "<a href='javascript:;' onclick='detail_internal_source_win();' style='color: green;'>详细</a>" +
        "&nbsp;&nbsp;&nbsp;&nbsp;" +
        "<a href='javascript:;' onclick='test_internal_source_row();' style='color: green;'>测试</a>" +
        "&nbsp;&nbsp;&nbsp;&nbsp;" +
        update;
}

var dataDB = [['oracle','oracle'],['mssql','mssql'],['sybase','sybase'],['db2_net','DB2:net连接(utf-8编码/8.x)']];//['db2_jcc','DB2:jcc连接(需安装DB2客户端)'],['db2_app','DB2:app连接'],
var storeDB = new Ext.data.SimpleStore({fields:['value','key'],data:dataDB});
var dataCharset = [['gbk','gbk'],['gb2312','gb2312'],['gb18030','gb18030'],['utf-8','utf-8'],['utf-16','utf-16']];
var storeCharset = new Ext.data.SimpleStore({fields:['value','key'],data:dataCharset});

var db_record = new Ext.data.Record.create([{name:'value',mapping:'value'},{name:'key',mapping:'key'}]);
var db_proxy = new Ext.data.HttpProxy({url:"../../JdbcAction_readDataBaseNamesKeyValue.action"});
var db_reader = new Ext.data.JsonReader({totalProperty:"total",root:"rows"},db_record);
var version_record = new Ext.data.Record.create([{name:'value',mapping:'value'},{name:'key',mapping:'key'}]);
var version_proxy = new Ext.data.HttpProxy({url:"../../JdbcAction_readDataBaseVersionsKeyValue.action"});
var version_reader = new Ext.data.JsonReader({totalProperty:"total",root:"rows"},version_record);
var driver_record = new Ext.data.Record.create([{name:'value',mapping:'value'},{name:'key',mapping:'key'}]);
var driver_proxy = new Ext.data.HttpProxy({url:"../../JdbcAction_readDataBaseDriversKeyValue.action"});
var driver_reader = new Ext.data.JsonReader({totalProperty:"total",root:"rows"},driver_record);

function insert_internal_source_win(grid,store){
    var db_store = new Ext.data.Store({
        proxy : db_proxy,
        reader : db_reader
    });
    db_store.load();
    var version_store = new Ext.data.Store({
        proxy : version_proxy,
        reader : version_reader
    });
    var driver_store = new Ext.data.Store({
        proxy : driver_proxy,
        reader : driver_reader
    });
    var formPanel = new Ext.form.FormPanel({
        defaultType:'textfield',
        frame:true,
        labelAlign:'right',
        autoScroll:true,
        labelWidth:100,
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
            name:'operatorType',
            value:'insert'
        },{
            id:'jdbcName.internal.info',
            fieldLabel:"数据源名称",
            name:'jdbc.jdbcName',
            regex:/^.{2,30}$/,
            regexText:'请输入任意2--30个字符',
            emptyText:'请输入任意2--30个字符',
            listeners:{
                blur:function(){
                    var jdbcName = this.getValue();
                    var myMask = new Ext.LoadMask(Ext.getBody(),{
                        msg:'正在校验,请稍后...',
                        removeMask:true
                    });
                    myMask.show();
                    Ext.Ajax.request({
                        url:'../../JdbcAction_check.action',
                        params:{jdbcName:jdbcName,typeXml:'internal'},
                        method:'POST',
                        success:function(action){
                            var json = Ext.decode(action.responseText);
                            var msg = json.msg;
                            myMask.hide();
                            if(json.msg != '0000'){
                                Ext.MessageBox.show({
                                    title:'信息',
                                    msg:'<font color="red">'+json.msg+'</font>',
                                    prompt:false,
                                    animEl:'jdbcName.internal.info',
                                    width:200,
                                    buttons:{'ok':'确定'},
                                    icon:Ext.MessageBox.ERROR,
                                    closable:false,
                                    fn:function(e){
                                        if(e=='ok'){
                                            Ext.getCmp('jdbcName.internal.info').setValue('');
                                        }
                                    }
                                });
                            }
                        }
                     });
                }
            }
        },{
            fieldLabel:"描述信息",
            name:'jdbc.description',
            regex:/^.{2,30}$/,
            regexText:'请输入任意2--30个字符',
            emptyText:'请输入任意2--30个字符'
        },{
        	id:'dbType.internal.insert.info',
            fieldLabel:"数据库类型", hiddenName:'jdbc.dbType',
            xtype:'combo',
            mode:'local',
            emptyText :'--请选择--',
            editable : false,
            typeAhead:true,
            forceSelection: true,
            triggerAction:'all',
            displayField:"key",valueField:"value",
            store:db_store,
            listeners:{
                select:function(){
                    var myMask = new Ext.LoadMask(Ext.getBody(), {
                        msg: '正在处理,请稍后...',
                        removeMask: true //完成后移除
                    });
                    myMask.show();
                    var dbType = this.getValue();
                    version_store.load({params:{dbType:dbType}});
                    myMask.hide();
                }
            }
        },{
            id:'version.internal.insert.info',
            fieldLabel:"数据库版本", hiddenName:'jdbc.version',
            xtype:'combo',
            mode:'local',
            emptyText :'--请选择--',
            editable : false,
            typeAhead:true,
            forceSelection: true,
            triggerAction:'all',
            displayField:"key",valueField:"value",
            store:version_store,
            listeners:{
                select:function() {
                    var myMask = new Ext.LoadMask(Ext.getBody(), {
                        msg:'正在处理,请稍后...',
                        removeMask:true //完成后移除
                    });
                    myMask.show();
                    var dbType = Ext.getCmp('dbType.internal.insert.info').getValue();
                    var version = this.getValue();
                    driver_store.load({params:{dbType:dbType,version:version}});
                    myMask.hide();
                }
            }
        },{
            id:'driverClass.internal.insert.info',
            fieldLabel:"数据库驱动", hiddenName:'jdbc.driverClass',
            xtype:'combo',
            mode:'local',
            emptyText :'--请选择--',
            editable : false,
            typeAhead:true,
            forceSelection: true,
            triggerAction:'all',
            displayField:"key",valueField:"value",
            store:driver_store,
            listeners:{
                select:function() {
                    var myMask = new Ext.LoadMask(Ext.getBody(), {
                        msg:'正在处理,请稍后...',
                        removeMask:true //完成后移除
                    });
                    myMask.show();
                    var dbType = Ext.getCmp('dbType.internal.insert.info').getValue();
                    var version = Ext.getCmp('version.internal.insert.info').getValue();;
                    var driver = this.getValue();
                    Ext.Ajax.request({
                        url:'../../JdbcAction_readDriverInfo.action',
                        params:{dbType:dbType, version:version,driver:driver},
                        success:function(r,o){
                            var respText = Ext.util.JSON.decode(r.responseText);
                            var dbPort = respText.port;
                            var dbVender = respText.vender;
                            var dbUrl = respText.url;
                            var dbCatalog = respText.catalog;
                            Ext.getCmp('dbPort.internal.insert.info').setValue(dbPort);
                            Ext.getCmp('dbVender.internal.insert.info').setValue(dbVender);
                            Ext.getCmp('hidden.dbVender.internal.insert.info').setValue(dbVender);
                            Ext.getCmp('hidden.dbUrl.internal.insert.info').setValue(dbUrl);
                            Ext.getCmp('default.dbUrl.internal.insert.info').setValue(dbUrl);
                            if(dbCatalog.length>0){
                                Ext.getCmp('dbCatalog.internal.insert.info').enable();
                                Ext.getCmp('dbCatalog.internal.insert.info').setValue();
                            } else {
                                Ext.getCmp('dbCatalog.internal.insert.info').disable();
                                Ext.getCmp('dbCatalog.internal.insert.info').setValue('');
                            }
                        }
                    });
                    myMask.hide();
                }
            }
        },{
        	id:'dbHost.internal.insert.info',
            fieldLabel:"地址",
            name:'jdbc.dbHost',
            regex:/^(((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9]))$/,
            regexText:'这个不是Ip',
            emptyText:'请输入Ip',
            listeners:{
                blur:function(){
                    var dbHost = this.getValue();
                    var dbName = Ext.getCmp('dbName.internal.insert.info').getValue();
                    var dbPort = Ext.getCmp('dbPort.internal.insert.info').getValue();
                    var dbUrl = Ext.getCmp('default.dbUrl.internal.insert.info').getValue();
                    dbUrl = dbUrl.replace(/\{0\}/,dbHost);
                    dbUrl = dbUrl.replace(/\{1\}/,dbPort);
                    dbUrl = dbUrl.replace(/\{2\}/,dbName);
                    Ext.getCmp('dbUrl.internal.insert.info').setValue(dbUrl);
                    Ext.getCmp('hidden.dbUrl.internal.insert.info').setValue(dbUrl);
                }
            }
        },{
        	id:'dbPort.internal.insert.info',name:'jdbc.dbPort',
            fieldLabel:"端口",
            regex:/^(6553[0-6]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{3}|[1-9][0-9]{2}|[1-9][0-9]{1}|[1-9])$/,
            regexText:'这个不是端口类型1~65536',
            emptyText:'请输入端口1~65536',
            listeners:{
                blur:function(){
                    var dbHost = Ext.getCmp('dbHost.internal.insert.info').getValue();
                    var dbName = Ext.getCmp('dbName.internal.insert.info').getValue();
                    var dbPort = this.getValue();
                    var dbUrl = Ext.getCmp('default.dbUrl.internal.insert.info').getValue();
                    dbUrl = dbUrl.replace(/\{0\}/,dbHost);
                    dbUrl = dbUrl.replace(/\{1\}/,dbPort);
                    dbUrl = dbUrl.replace(/\{2\}/,dbName);
                    Ext.getCmp('dbUrl.internal.insert.info').setValue(dbUrl);
                    Ext.getCmp('hidden.dbUrl.internal.insert.info').setValue(dbUrl);
                }
            }
        },{
        	id:'dbName.internal.insert.info',
            fieldLabel:'数据库名称',
            name:'dbName',
            regex:/^.{2,30}$/,
            regexText:'请输入任意2--30个字符',
            emptyText:'请输入任意2--30个字符',
            listeners:{
                blur:function(){
                    var dbHost = Ext.getCmp('dbHost.internal.insert.info').getValue();
                    var dbName = this.getValue();
                    var dbPort = Ext.getCmp('dbPort.internal.insert.info').getValue();
                    var dbType = Ext.getCmp('dbType.internal.insert.info').getValue();
                    var dbUrl = Ext.getCmp('default.dbUrl.internal.insert.info').getValue();
                    dbUrl = dbUrl.replace(/\{0\}/,dbHost);
                    dbUrl = dbUrl.replace(/\{1\}/,dbPort);
                    dbUrl = dbUrl.replace(/\{2\}/,dbName);
                    Ext.getCmp('dbUrl.internal.insert.info').setValue(dbUrl);
                    Ext.getCmp('hidden.dbUrl.internal.insert.info').setValue(dbUrl);
                }
            }
        },{
            id:'dbUrl.internal.insert.info',
            fieldLabel:"URL连接",
            xtype:'displayfield'
        },{
            id:'dbVender.internal.insert.info',
            xtype:'displayfield',
            fieldLabel:"数据库供应商"
        },{
            id:'default.dbUrl.internal.insert.info',
            xtype:'hidden'
        },{
            id:'hidden.dbUrl.internal.insert.info',
            xtype:'hidden',
            name:'jdbc.dbUrl'
        },{
            id:'hidden.dbVender.internal.insert.info',
            xtype:'hidden',
            name:'jdbc.dbVender'
        },{
        	id:'dbCatalog.internal.insert.info',
            fieldLabel:"CATALOG",
            name:'jdbc.dbCatalog',
            regex:/^.{2,30}$/,
            regexText:'请输入任意2--30个字符',
            emptyText:'请输入任意2--30个字符'
        },{
            fieldLabel:'模式所有者',
            name:'jdbc.dbOwner',
            regex:/^.{2,30}$/,
            regexText:'请输入任意2--30个字符',
            emptyText:'请输入任意2--30个字符'
        },{
            fieldLabel:"用户",
            name:'jdbc.dbUser',
            regex:/^.{2,30}$/,
            regexText:'请输入任意2--30个字符',
            emptyText:'请输入任意2--30个字符'
        },{
            fieldLabel:"口令",
            inputType:'password',
            name:'jdbc.password',
            regex:/^(.{1,32})$/,
            regexText:'密码是1-32位 ',
            emptyText:'请输入密码1-32位！'
        },{
            fieldLabel:"编码", hiddenName:'jdbc.encoding',
            xtype:'combo',
            mode:'local',
            emptyText :'--请选择--',
            editable : false,
            typeAhead:true,
            forceSelection: true,
            triggerAction:'all',
            displayField:"key",valueField:"value",
            store:storeCharset
        }]
    });
    var win = new Ext.Window({
        title:"新增信息",
        width:500,
		layout:'fit',
        height:430,
        modal:true,
        items:formPanel,
        bbar:[
        	'->',
        	{
        		id:'internal.insert.test.win.info',
        		text:'测试连接',
        		handler:function(){
        			if (formPanel.form.isValid()) {
                    	formPanel.getForm().submit({
			            	url :'../../JdbcAction_testConnect.action',
			                method :'POST',
			                waitTitle :'系统提示',
			                waitMsg :'正在测试,请稍后...',
			                success : function(form,action) {
				                Ext.MessageBox.show({
				                	title:'信息',
				                    msg:action.result.msg,
			                        animEl:'internal.insert.test.win.info',
			                        buttons:{'ok':'确定'},
			                        icon:Ext.MessageBox.INFO,
			                        closable:false,
			                        fn:function(e){
			                        	if(e=='ok'){
			                            	Ext.getCmp('internal.insert.save.win.info').enable();		                                        
			                        	}
			                        }
			                	});
			                }
			        	});
                    } else {
                        Ext.MessageBox.show({
                            title:'信息',
                            msg:'请填写完成再提交!',
                            animEl:'internal.insert.test.win.info',
                            buttons:{'ok':'确定'},
                            icon:Ext.MessageBox.ERROR,
                            closable:false
                        });
                    }
        		}
        	},{
        		id:'internal.insert.save.win.info',
        		text:'保存配置',
        		disabled:true,
        		handler:function(){
        			if (formPanel.form.isValid()) {
                    	formPanel.getForm().submit({
			            	url :'../../JdbcAction_insert.action',
			                method :'POST',
			                waitTitle :'系统提示',
			                waitMsg :'正在保存,请稍后...',
			                success : function(form,action) {
				                Ext.MessageBox.show({
				                	title:'信息',
				                    msg:action.result.msg,
			                        animEl:'internal.insert.save.win.info',
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
                    } else {
                        Ext.MessageBox.show({
                            title:'信息',
                            msg:'请填写完成再提交!',
                            animEl:'internal.insert.save.win.info',
                            buttons:{'ok':'确定'},
                            icon:Ext.MessageBox.ERROR,
                            closable:false
                        });
                    }
        		}
        	}
        ]
    }).show();
}

function delete_internal_source_row(grid,store){
    var selModel = grid.getSelectionModel();
    var count = selModel.getCount();
    if(count==0){
        Ext.MessageBox.show({
            title:'信息',
            msg:'<font color="green">您没有勾选任何记录!</font>',
            animEl:'btnRemove.internal.source.info',
            buttons:{'ok':'确定'},
            icon:Ext.MessageBox.INFO,
            closable:false
        });
    }else if(count > 0){
        var jdbcNameArray = new Array();
        var record = grid.getSelectionModel().getSelections();
        for(var i = 0; i < record.length; i++){
            jdbcNameArray[i] = record[i].get('jdbcName');
        }
        Ext.MessageBox.show({
            title:'信息',
            msg:'<font color="green">确定要删除所选记录？</font>',
            animEl:'btnRemove.internal.source.info',
            width:250,
            buttons:{'ok':'确定','no':'取消'},
            icon:Ext.MessageBox.INFO,
            closable:false,
            fn:function(e){
                if(e == 'ok'){
                    var myMask = new Ext.LoadMask(Ext.getBody(),{
                        msg : '正在删除,请稍后...',
                        removeMask :'true'
                    });
                    myMask.show();
                    Ext.Ajax.request({
                        url : '../../JdbcAction_delete.action',                 // 删除 连接 到后台
                        params :{jdbcNameArray : jdbcNameArray,typeXml : 'internal'},
                        success : function(action){
                            var json = Ext.decode(action.responseText);
                            myMask.hide();
                            Ext.MessageBox.show({
                                title:'信息',
                                msg:json.msg,
                                animEl:'btnRemove.internal.source.info',
                                buttons:{'ok':'确定'},
                                icon:Ext.MessageBox.INFO,
                                closable:false,
                                fn:function(e){
                                    if(e=='ok'){
                                        store.reload();
                                    }
                                }
                            });
                        }
                    });
                }
            }
        });
    }
}

function test_internal_source_row(){
	var grid = Ext.getCmp('grid.internal.source.info');
    var selModel = grid.getSelectionModel();
    var jdbcName;
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
        	var myMask = new Ext.LoadMask(Ext.getBody(), {
                msg: '正在测试,请稍后...',
                removeMask: true //完成后移除
            });
        	myMask.show();
        	var jdbcName = item.data.jdbcName;
        	Ext.Ajax.request({
            	url :'../../JdbcAction_testConnect.action',
            	params:{dbName:jdbcName,operatorType:'test_internal'},
                method :'POST',
                success : function(r,o) {
                    var respText = Ext.util.JSON.decode(r.responseText);
                    var msg = respText.msg;
                	myMask.hide();
	                Ext.MessageBox.show({
	                	title:'信息',
	                    width:260,
	                    msg:msg,
                        buttons:{'ok':'确定'},
                        icon:Ext.MessageBox.INFO,
                        closable:false
                	});
                }
        	});
        });
    }
}

function update_internal_source_win(){
    var db_store = new Ext.data.Store({
        proxy : db_proxy,
        reader : db_reader,
        listeners:{
            load:function(){
                var dbType = Ext.getCmp('dbType.internal.update.info').getValue();
                Ext.getCmp('dbType.internal.update.info').setValue(dbType);
                version_store.load({params:{dbType:dbType}});
                var version = Ext.getCmp('version.internal.update.info').getValue();
                driver_store.load({params:{dbType:dbType,version:version}});
                var driver = Ext.getCmp('driverClass.internal.update.info').getValue();
                Ext.Ajax.request({
                    url:'../../JdbcAction_readDriverInfo.action',
                    params:{dbType:dbType, version:version,driver:driver},
                    success:function(r,o){
                        var respText = Ext.util.JSON.decode(r.responseText);
                        var dbUrl = respText.url;
                        var dbCatalog = respText.catalog;
                        Ext.getCmp('default.dbUrl.internal.update.info').setValue(dbUrl);
                        if(dbCatalog.length>0){
                            Ext.getCmp('dbCatalog.internal.update.info').enable();
                            Ext.getCmp('dbCatalog.internal.update.info').setValue();
                        } else {
                            Ext.getCmp('dbCatalog.internal.update.info').disable();
                            Ext.getCmp('dbCatalog.internal.update.info').setValue('');
                        }
                    }
                });
            }
        }
    });
    db_store.load();
    var version_store = new Ext.data.Store({
        proxy : version_proxy,
        reader : version_reader
    });
    var driver_store = new Ext.data.Store({
        proxy : driver_proxy,
        reader : driver_reader
    });
    var grid = Ext.getCmp('grid.internal.source.info');
    var store = Ext.getCmp('grid.internal.source.info').getStore();
    var selModel = grid.getSelectionModel();
    var formPanel;
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
            formPanel = new Ext.form.FormPanel({
                defaultType:'textfield',
                frame:true,
                labelAlign:'right',
                autoScroll:true,
                labelWidth:100,
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
                    name:'operatorType',
                    value:'update'
                },{
                    fieldLabel:"数据源名称",
                    xtype:'displayfield',
                    value:item.data.jdbcName
                },{
                    xtype:'hidden',
                    name:'jdbc.jdbcName',
                    value:item.data.jdbcName
                },{
                    fieldLabel:"描述信息",
                    name:'jdbc.description',
                    value:item.data.jdbcDesc,
                    regex:/^.{2,30}$/,
                    regexText:'请输入任意2--30个字符',
                    emptyText:'请输入任意2--30个字符'
                },{
                     id:'dbType.internal.update.info',
                    fieldLabel:"数据库类型", hiddenName:'jdbc.dbType',value:item.data.dbType,
                    xtype:'combo',
                    mode:'local',
                    emptyText :'--请选择--',
                    editable : false,
                    typeAhead:true,
                    forceSelection: true,
                    triggerAction:'all',
                    displayField:"key",valueField:"value",
                    store:db_store,
                    listeners:{
                        select:function(){
                            var myMask = new Ext.LoadMask(Ext.getBody(), {
                                msg: '正在处理,请稍后...',
                                removeMask: true //完成后移除
                            });
                            myMask.show();
                            var old_dbType = item.data.dbType;
                            var dbType = this.getValue();
                            if(old_dbType!=dbType){
                                version_store.load({params:{dbType:dbType}});
                                Ext.getCmp('version.internal.update.info').setValue('');
                                Ext.getCmp('driverClass.internal.update.info').setValue('');
                                Ext.getCmp('dbPort.internal.update.info').setValue('');
                                Ext.getCmp('dbVender.internal.update.info').setValue('');
                                Ext.getCmp('hidden.dbVender.internal.update.info').setValue('');
                                Ext.getCmp('hidden.dbUrl.internal.update.info').setValue('');
                                Ext.getCmp('dbUrl.internal.update.info').setValue('');
                                Ext.getCmp('dbHost.internal.update.info').setValue('');
                                Ext.getCmp('dbName.internal.update.info').setValue('');
                                Ext.getCmp('default.dbUrl.internal.update.info').setValue('');
                            } else {
                                version_store.load({params:{dbType:dbType}});
                                var version = item.data.version;
                                driver_store.load({params:{dbType:dbType,version:version}});
                                var driver = item.data.driverClass;
                                Ext.Ajax.request({
                                    url:'../../JdbcAction_readDriverInfo.action',
                                    params:{dbType:dbType, version:version,driver:driver},
                                    success:function(r,o){
                                        var respText = Ext.util.JSON.decode(r.responseText);
                                        var dbUrl = respText.url;
                                        var dbCatalog = respText.catalog;
                                        Ext.getCmp('default.dbUrl.internal.update.info').setValue(dbUrl);
                                        Ext.getCmp('version.internal.update.info').setValue(version);
                                        Ext.getCmp('driverClass.internal.update.info').setValue(driver);
                                        Ext.getCmp('dbVender.internal.update.info').setValue(item.data.dbVender);
                                        Ext.getCmp('hidden.dbUrl.internal.update.info').setValue(item.data.dbUrl);
                                        Ext.getCmp('dbHost.internal.update.info').setValue(item.data.dbHost);
                                        Ext.getCmp('dbName.internal.update.info').setValue(item.data.dbName);
                                        Ext.getCmp('dbUrl.internal.update.info').setValue(item.data.dbUrl);
                                        Ext.getCmp('dbPort.internal.update.info').setValue(item.data.dbPort);
                                        if(dbCatalog.length>0){
                                            Ext.getCmp('dbCatalog.internal.update.info').enable();
                                            Ext.getCmp('dbCatalog.internal.update.info').setValue();
                                        } else {
                                            Ext.getCmp('dbCatalog.internal.update.info').disable();
                                            Ext.getCmp('dbCatalog.internal.update.info').setValue('');
                                        }
                                    }
                                });
                            }
                            myMask.hide();
                        }
                    }
                },{
                    id:'version.internal.update.info',
                    fieldLabel:"数据库版本", hiddenName:'jdbc.version',value:item.data.version,
                    xtype:'combo',
                    mode:'local',
                    emptyText :'--请选择--',
                    editable : false,
                    typeAhead:true,
                    forceSelection: true,
                    triggerAction:'all',
                    displayField:"key",valueField:"value",
                    store:version_store,
                    listeners:{
                        select:function() {
                            var myMask = new Ext.LoadMask(Ext.getBody(), {
                                msg:'正在处理,请稍后...',
                                removeMask:true //完成后移除
                            });
                            myMask.show();
                            var dbType = Ext.getCmp('dbType.internal.update.info').getValue();
                            var old_version = item.data.version;
                            var version = this.getValue();
                            if(old_version != version){
                                driver_store.load({params:{dbType:dbType,version:version}});
                                Ext.getCmp('driverClass.internal.update.info').setValue('');
                                Ext.getCmp('dbPort.internal.update.info').setValue('');
                                Ext.getCmp('dbVender.internal.update.info').setValue('');
                                Ext.getCmp('hidden.dbVender.internal.update.info').setValue('');
                                Ext.getCmp('hidden.dbUrl.internal.update.info').setValue('');
                                Ext.getCmp('dbUrl.internal.update.info').setValue('');
                                Ext.getCmp('dbHost.internal.update.info').setValue('');
                                Ext.getCmp('dbName.internal.update.info').setValue('');
                                Ext.getCmp('default.dbUrl.internal.update.info').setValue('');
                            } else if(old_version == version) {
                                driver_store.load({params:{dbType:dbType,version:version}});
                                var driver = item.data.driverClass;
                                Ext.Ajax.request({
                                    url:'../../JdbcAction_readDriverInfo.action',
                                    params:{dbType:dbType, version:version,driver:driver},
                                    success:function(r,o){
                                        var respText = Ext.util.JSON.decode(r.responseText);
                                        var dbUrl = respText.url;
                                        var dbCatalog = respText.catalog;
                                        Ext.getCmp('default.dbUrl.internal.update.info').setValue(dbUrl);
                                        Ext.getCmp('driverClass.internal.update.info').setValue(driver);
                                        Ext.getCmp('dbVender.internal.update.info').setValue(item.data.dbVender);
                                        Ext.getCmp('hidden.dbUrl.internal.update.info').setValue(item.data.dbUrl);
                                        Ext.getCmp('dbHost.internal.update.info').setValue(item.data.dbHost);
                                        Ext.getCmp('dbName.internal.update.info').setValue(item.data.dbName);
                                        Ext.getCmp('dbUrl.internal.update.info').setValue(item.data.dbUrl);
                                        Ext.getCmp('dbPort.internal.update.info').setValue(item.data.dbPort);
                                        if(dbCatalog.length>0){
                                            Ext.getCmp('dbCatalog.internal.update.info').enable();
                                            Ext.getCmp('dbCatalog.internal.update.info').setValue();
                                        } else {
                                            Ext.getCmp('dbCatalog.internal.update.info').disable();
                                            Ext.getCmp('dbCatalog.internal.update.info').setValue('');
                                        }
                                    }
                                });
                            }
                            myMask.hide();
                        }
                    }
                },{
                    id:'driverClass.internal.update.info',
                    fieldLabel:"数据库驱动", hiddenName:'jdbc.driverClass',value:item.data.driverClass,
                    xtype:'combo',
                    mode:'local',
                    emptyText :'--请选择--',
                    editable : false,
                    typeAhead:true,
                    forceSelection: true,
                    triggerAction:'all',
                    displayField:"key",valueField:"value",
                    store:driver_store,
                    listeners:{
                        select:function() {
                            var myMask = new Ext.LoadMask(Ext.getBody(), {
                                msg:'正在处理,请稍后...',
                                removeMask:true //完成后移除
                            });
                            myMask.show();
                            var dbType = Ext.getCmp('dbType.internal.update.info').getValue();
                            var version = Ext.getCmp('version.internal.update.info').getValue();
                            var old_driver = item.data.driverClass;
                            var driver = this.getValue();
                            if(driver!=old_driver){
                                Ext.getCmp('dbUrl.internal.update.info').setValue('');
                                Ext.getCmp('dbHost.internal.update.info').setValue('');
                                Ext.getCmp('dbName.internal.update.info').setValue('');
                                Ext.Ajax.request({
                                    url:'../../JdbcAction_readDriverInfo.action',
                                    params:{dbType:dbType, version:version,driver:driver},
                                    success:function(r,o){
                                        var respText = Ext.util.JSON.decode(r.responseText);
                                        var dbPort = respText.port;
                                        var dbVender = respText.vender;
                                        var dbUrl = respText.url;
                                        var dbCatalog = respText.catalog;
                                        Ext.getCmp('dbPort.internal.update.info').setValue(dbPort);
                                        Ext.getCmp('dbVender.internal.update.info').setValue(dbVender);
                                        Ext.getCmp('hidden.dbVender.internal.update.info').setValue(dbVender);
                                        Ext.getCmp('hidden.dbUrl.internal.update.info').setValue(dbUrl);
                                        Ext.getCmp('default.dbUrl.internal.update.info').setValue(dbUrl);
                                        if(dbCatalog.length>0){
                                            Ext.getCmp('dbCatalog.internal.update.info').enable();
                                            Ext.getCmp('dbCatalog.internal.update.info').setValue();
                                        } else {
                                            Ext.getCmp('dbCatalog.internal.update.info').disable();
                                            Ext.getCmp('dbCatalog.internal.update.info').setValue('');
                                        }
                                    }
                                });
                            } else {
                                Ext.Ajax.request({
                                    url:'../../JdbcAction_readDriverInfo.action',
                                    params:{dbType:dbType, version:version,driver:driver},
                                    success:function(r,o){
                                        var respText = Ext.util.JSON.decode(r.responseText);
                                        var dbUrl = respText.url;
                                        var dbCatalog = respText.catalog;
                                        Ext.getCmp('default.dbUrl.internal.update.info').setValue(dbUrl);
                                        Ext.getCmp('dbVender.internal.update.info').setValue(item.data.dbVender);
                                        Ext.getCmp('hidden.dbUrl.internal.update.info').setValue(item.data.dbUrl);
                                        Ext.getCmp('dbHost.internal.update.info').setValue(item.data.dbHost);
                                        Ext.getCmp('dbName.internal.update.info').setValue(item.data.dbName);
                                        Ext.getCmp('dbUrl.internal.update.info').setValue(item.data.dbUrl);
                                        Ext.getCmp('dbPort.internal.update.info').setValue(item.data.dbPort);
                                        if(dbCatalog.length>0){
                                            Ext.getCmp('dbCatalog.internal.update.info').enable();
                                            Ext.getCmp('dbCatalog.internal.update.info').setValue();
                                        } else {
                                            Ext.getCmp('dbCatalog.internal.update.info').disable();
                                            Ext.getCmp('dbCatalog.internal.update.info').setValue('');
                                        }
                                    }
                                });
                            }
                            myMask.hide();
                        }
                    }
                },{
                    id:'dbHost.internal.update.info', value:item.data.dbHost,
                    fieldLabel:"地址",
                    name:'jdbc.dbHost',
                    regex:/^(((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9]))$/,
                    regexText:'这个不是Ip',
                    emptyText:'请输入Ip',
                    listeners:{
                        blur:function(){
                            var dbHost = this.getValue();
                            var dbName = Ext.getCmp('dbName.internal.update.info').getValue();
                            var dbPort = Ext.getCmp('dbPort.internal.update.info').getValue();
                            var dbUrl = Ext.getCmp('default.dbUrl.internal.update.info').getValue();
                            dbUrl = dbUrl.replace(/\{0\}/,dbHost);
                            dbUrl = dbUrl.replace(/\{1\}/,dbPort);
                            dbUrl = dbUrl.replace(/\{2\}/,dbName);
                            Ext.getCmp('dbUrl.internal.update.info').setValue(dbUrl);
                            Ext.getCmp('hidden.dbUrl.internal.update.info').setValue(dbUrl);
                        }
                    }
                },{
                    id:'dbPort.internal.update.info',name:'jdbc.dbPort',value:item.data.dbPort,
                    fieldLabel:"端口",
                    regex:/^(6553[0-6]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{3}|[1-9][0-9]{2}|[1-9][0-9]{1}|[1-9])$/,
                    regexText:'这个不是端口类型1~65536',
                    emptyText:'请输入端口1~65536',
                    listeners:{
                        blur:function(){
                            var dbHost = Ext.getCmp('dbHost.internal.update.info').getValue();
                            var dbName = Ext.getCmp('dbName.internal.update.info').getValue();
                            var dbPort = this.getValue();
                            var dbUrl = Ext.getCmp('default.dbUrl.internal.update.info').getValue();
                            dbUrl = dbUrl.replace(/\{0\}/,dbHost);
                            dbUrl = dbUrl.replace(/\{1\}/,dbPort);
                            dbUrl = dbUrl.replace(/\{2\}/,dbName);
                            Ext.getCmp('dbUrl.internal.update.info').setValue(dbUrl);
                            Ext.getCmp('hidden.dbUrl.internal.update.info').setValue(dbUrl);
                        }
                    }
                },{
                    id:'dbName.internal.update.info',value:item.data.dbName,
                    fieldLabel:'数据库名称',
                    name:'dbName',
                    regex:/^.{2,30}$/,
                    regexText:'请输入任意2--30个字符',
                    emptyText:'请输入任意2--30个字符',
                    listeners:{
                        blur:function(){
                            var dbHost = Ext.getCmp('dbHost.internal.update.info').getValue();
                            var dbName = this.getValue();
                            var dbPort = Ext.getCmp('dbPort.internal.update.info').getValue();
                            var dbType = Ext.getCmp('dbType.internal.update.info').getValue();
                            var dbUrl = Ext.getCmp('default.dbUrl.internal.update.info').getValue();
                            dbUrl = dbUrl.replace(/\{0\}/,dbHost);
                            dbUrl = dbUrl.replace(/\{1\}/,dbPort);
                            dbUrl = dbUrl.replace(/\{2\}/,dbName);
                            Ext.getCmp('dbUrl.internal.update.info').setValue(dbUrl);
                            Ext.getCmp('hidden.dbUrl.internal.update.info').setValue(dbUrl);
                        }
                    }
                },{
                    id:'dbUrl.internal.update.info',value:item.data.dbUrl,
                    fieldLabel:"URL连接",
                    xtype:'displayfield'
                },{
                    id:'dbVender.internal.update.info',value:item.data.dbVender,
                    xtype:'displayfield',
                    fieldLabel:"数据库供应商"
                },{
                    id:'default.dbUrl.internal.update.info',
                    xtype:'hidden'
                },{
                    id:'hidden.dbUrl.internal.update.info',value:item.data.dbUrl,
                    xtype:'hidden',
                    name:'jdbc.dbUrl'
                },{
                    id:'hidden.dbVender.internal.update.info',value:item.data.dbVender,
                    xtype:'hidden',
                    name:'jdbc.dbVender'
                },{
                    id:'dbCatalog.internal.update.info',value:item.data.dbCatalog,
                    fieldLabel:"CATALOG",
                    disabled:true,
                    name:'jdbc.dbCatalog',
                    regex:/^.{2,30}$/,
                    regexText:'请输入任意2--30个字符',
                    emptyText:'请输入任意2--30个字符'
                },{
                    fieldLabel:'模式所有者',value:item.data.dbOwner,
                    name:'jdbc.dbOwner',
                    regex:/^.{2,30}$/,
                    regexText:'请输入任意2--30个字符',
                    emptyText:'请输入任意2--30个字符'
                },{
                    fieldLabel:"用户",value:item.data.dbUser,
                    name:'jdbc.dbUser',
                    regex:/^.{2,30}$/,
                    regexText:'请输入任意2--30个字符',
                    emptyText:'请输入任意2--30个字符'
                },{
                    id:'update.internal.password.info',
                    fieldLabel:"口令",
                    inputType:'password',
                    name:'jdbc.password',
                    value:item.data.password,
                    regex:/^(.{1,32})$/,
                    regexText:'密码是1-32位',
                    emptyText:'请输入密码1-32位！'
                },{
                    fieldLabel:"编码", hiddenName:'jdbc.encoding',value:item.data.encoding,
                    xtype:'combo',
                    mode:'local',
                    emptyText :'--请选择--',
                    editable : false,
                    typeAhead:true,
                    forceSelection: true,
                    triggerAction:'all',
                    displayField:"key",valueField:"value",
                    store:storeCharset
                }]
            });
        });
    }
    var win = new Ext.Window({
        title:"修改信息",
        width:500,
		layout:'fit',
        height:430,
        modal:true,
        items:formPanel,
        bbar:[
        	'->',
        	{
        		id:'internal.update.test.win.info',
        		text:'测试连接',
        		handler:function(){
        			if (formPanel.form.isValid()) {

                    	formPanel.getForm().submit({
			            	url :'../../JdbcAction_testConnect.action',
			                method :'POST',
			                waitTitle :'系统提示',
			                waitMsg :'正在测试,请稍后...',
			                success : function(form,action) {
				                Ext.MessageBox.show({
				                	title:'信息',
				                    msg:action.result.msg,
			                        animEl:'internal.update.test.win.info',
			                        buttons:{'ok':'确定'},
			                        icon:Ext.MessageBox.INFO,
			                        closable:false,
			                        fn:function(e){
			                        	if(e=='ok'){
			                            	Ext.getCmp('internal.update.save.win.info').enable();
			                        	}
			                        }
			                	});
			                }
			        	});
                    } else {
                        Ext.MessageBox.show({
                            title:'信息',
                            msg:'请填写完成再提交!',
                            animEl:'internal.update.test.win.info',
                            buttons:{'ok':'确定'},
                            icon:Ext.MessageBox.ERROR,
                            closable:false
                        });
                    }
        		}
        	},
        	{
        		id:'internal.update.save.win.info',
        		text:'修改配置',
        		disabled:true,
        		handler:function(){
        			if (formPanel.form.isValid()) {
                        Ext.MessageBox.show({
                    		title:'信息',
                            msg:'是否确定要修改?',
                            animEl:'internal.update.save.win.info',
                            buttons:{'ok':'确定','no':'取消'},
                            icon:Ext.MessageBox.WARNING,
                            closable:false,
                            fn:function(e){
                            	if(e=='ok'){
                                    formPanel.getForm().submit({
                                        url :'../../JdbcAction_update.action',
                                        method :'POST',
                                        waitTitle :'系统提示',
                                        waitMsg :'正在修改,请稍后...',
                                        success : function(form,action) {
                                            Ext.MessageBox.show({
                                                title:'信息',
                                                msg:action.result.msg,
                                                animEl:'internal.update.save.win.info',
                                                buttons:{'ok':'确定','no':'取消'},
                                                icon:Ext.MessageBox.INFO,
                                                closable:false,
                                                fn:function(e){
                                                    if(e == 'ok'){
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
                            msg:'请填写完成再提交!',
                            animEl:'internal.update.save.win.info',
                            buttons:{'ok':'确定'},
                            icon:Ext.MessageBox.ERROR,
                            closable:false
                        });
                    }
        		}
        	}
        ]
    }).show();

}

function update_internal_source_win_2(){
    var grid = Ext.getCmp('grid.internal.source.info');
    var store = Ext.getCmp('grid.internal.source.info').getStore();
    var selModel = grid.getSelectionModel();
    var formPanel;
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
            formPanel = new Ext.form.FormPanel({
                defaultType:'textarea',
                frame:true,
                labelAlign:'right',
                autoScroll:true,
                labelWidth:110,
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
                    fieldLabel:"数据源名称",
                    xtype:'displayfield',
                    value:item.data.jdbcName
                },{
                    xtype:'hidden',
                    name:'jdbc.jdbcName',
                    value:item.data.jdbcName
                },{
                    fieldLabel:"描述信息",
                    name:'jdbc.description',
                    value:item.data.jdbcDesc,
                    regex:/^.{2,30}$/,
                    regexText:'请输入任意2--30个字符',
                    emptyText:'请输入任意2--30个字符'
                }]
            });
        });
    }
    var win = new Ext.Window({
        title:"修改信息",
        width:400,
		layout:'fit',
        height:180,
        modal:true,
        items:formPanel,
        bbar:[
        	'->',
        	{
        		id:'internal.update.save.win.info',
        		text:'修改配置',
        		handler:function(){
        			if (formPanel.form.isValid()) {
                        Ext.MessageBox.show({
                    		title:'信息',
                            msg:'是否确定要修改?',
                            animEl:'internal.update.save.win.info',
                            buttons:{'ok':'确定','no':'取消'},
                            icon:Ext.MessageBox.WARNING,
                            closable:false,
                            fn:function(e){
                            	if(e=='ok'){
                                    formPanel.getForm().submit({
                                        url :'../../JdbcAction_update.action',
                                        method :'POST',
                                        waitTitle :'系统提示',
                                        waitMsg :'正在修改,请稍后...',
                                        success : function(form,action) {
                                            Ext.MessageBox.show({
                                                title:'信息',
                                                msg:action.result.msg,
                                                animEl:'internal.update.save.win.info',
                                                buttons:{'ok':'确定','no':'取消'},
                                                icon:Ext.MessageBox.INFO,
                                                closable:false,
                                                fn:function(e){
                                                    if(e == 'ok'){
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
                            msg:'请填写完成再提交!',
                            animEl:'internal.update.save.win.info',
                            buttons:{'ok':'确定'},
                            icon:Ext.MessageBox.ERROR,
                            closable:false
                        });
                    }
        		}
        	}
        ]
    }).show();

}

function detail_internal_source_win(){
    var grid = Ext.getCmp('grid.internal.source.info');
    var selModel = grid.getSelectionModel();
    var formPanel;
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
            formPanel = new Ext.form.FormPanel({
                defaultType:'displayfield',
                frame:true,
                labelAlign:'right',
                autoScroll:true,
                labelWidth:100,
                defaults:{
                    width:200,
                    allowBlank:false,
                    blankText:'该项不能为空！'
                },
                items:[{
                    fieldLabel:"数据源名称",
                    value:item.data.jdbcName
                },{
                    fieldLabel:"描述信息",
                    value:item.data.jdbcDesc
                },{
                    fieldLabel:"地址",
                    value:item.data.dbHost
                },{
                    fieldLabel:'数据库名称',
                    value:item.data.dbName
                },{
                    fieldLabel:"数据库类型",
                    value:internal_showURL_dbType(item.data.dbType)
                },{
                    fieldLabel:"数据库版本",
                    value:item.data.version
                },{
                    value:item.data.driverClass,
                    fieldLabel:"数据库驱动"
                },{
                    value:item.data.dbUrl,
                    fieldLabel:"URL连接"
                },{
                    fieldLabel:"数据库供应商",
                    value:item.data.dbVender
                },{
                    fieldLabel:"CATALOG",
                    value:item.data.dbCatalog
                },{
                    fieldLabel:'模式所有者',
                    value:item.data.dbOwner
                },{
                    fieldLabel:"用户",
                    value:item.data.dbUser
                },{
                    fieldLabel:"编码",
                    value:item.data.encoding
                }]
            });
        });
    }
    var win = new Ext.Window({
        title:"详细信息",
        width:500,
		layout:'fit',
        height:430,
        modal:true,
        items:formPanel,
        bbar:[
        	'->',
        	{
        		text:'保存',
        		handler:function(){
        			win.close();
        		}
        	},
        	{
        		text:'关闭',
        		handler:function(){
        			win.close();
        		}
        	}
        ]
    }).show();
}