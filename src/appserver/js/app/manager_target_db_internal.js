/**
 * 数据库同步目标端
 */
/********************************************* -- internal function -- ******************************************************************************/

function internal_insert_db_win(grid,store){
    var sourceRecord = new Ext.data.Record.create([
		{name:'value',mapping:'value'},
		{name:'key',mapping:'key'}
	]);
	var sourceReader = new Ext.data.JsonReader({ totalProperty:'total',root:"rows"},sourceRecord);
	var storeSource = new Ext.data.Store({
		url:'../../JdbcAction_readJdbcName.action?typeXml=internal',
		reader:sourceReader
	});
	storeSource.load();
    var targetAppName_record = new Ext.data.Record.create([
		{name:'value',mapping:'value'},
		{name:'key',mapping:'key'}
	]);
	var targetAppName_reader = new Ext.data.JsonReader({ totalProperty:'total',root:"rows"},targetAppName_record);
	var targetAppName_store = new Ext.data.Store({
		url:"../../AppTypeAction_readTargetAppNameKeyValue.action",
		reader:targetAppName_reader
	});
    targetAppName_store.load({ params:{appType:'db'} });

    //应用属性配置
    var form1 = new Ext.form.FormPanel({
        id:'card-0',
        frame:true,
        labelAlign:'right',
        autoScroll:true,
        labelWidth:130,
        defaults:{
            width:240,
            allowBlank:false,
            blankText:'该项不能为空！'
        },
        items:[{
            width:400,
            title:'应用属性配置  -- 使用说明',
            xtype:'fieldset',
            html:"<font color='green'>1.所有项为必填项;"
        },{
            fieldLabel:"应用源类型",
            xtype:'displayfield',
            value:'数据源'
        },{
            id:"external.plugin.info",
            xtype:'hidden',
            name:'typeBase.plugin',
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
            xtype:'hidden',
            name:'typeBase.isActive',
            value:false
        },{
            fieldLabel:"应用类型",
            xtype:'displayfield',
            value:'数据库同步'
        },{
            xtype:'hidden',
            name:'typeBase.appType',
            value:'db'
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
        },{
        	id:'internal.dataPath.info',
            fieldLabel:'数据文件存放目录',
            xtype:'textfield',
            name:'typeBase.dataPath',
            value:'/usr/app/stp/data',
            regex:/^([\/].*)*$/,
		    regexText:'这个不是目录',
		    emptyText:'请输入目录'
        },{
        	id:'internal.deleteFile.info',
            fieldLabel:"数据写入文件",
            layout:'column',
            defaultType: 'radio',
            items: [
                { width:50, boxLabel: '是', name: 'typeBase.deleteFile', inputValue: true,  checked: true },
                { width:50, boxLabel: '否', name: 'typeBase.deleteFile', inputValue: false }
            ]
        },{
        	id:'internal.recover.info',
            fieldLabel:"执行恢复操作",
            layout:'column',
            defaultType: 'radio',
            items: [
                { width:50, boxLabel: '是', name: 'typeBase.recover', inputValue: true,  checked: true },
                { width:50, boxLabel: '否', name: 'typeBase.recover', inputValue: false }
            ]
        }]
    });

    var win = new Ext.Window({
        title:"新增信息",
        width:470,
        height:390,
        layout:'fit',
        modal:true,
        items:form1,
        bbar:[
            '->',
            {
                id: "card-finish",
                text: "保存",
                handler: function() {
                    if (form1.form.isValid()) {
                        form1.getForm().submit({
                            url:'../../DBTypeAction_insert.action',
                            method :'POST',
                            waitTitle :'系统提示',
                            waitMsg :'正在保存,请稍后...',
                            success : function(form,action) {
                                Ext.MessageBox.show({
                                    title:'信息',
                                    msg:action.result.msg,
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
                            msg:'请填写完成再提交!',
                            animEl:'card-finish',
                            buttons:{'ok':'确定'},
                            icon:Ext.MessageBox.ERROR,
                            closable:false
                        });
                    }
                }
            },{
                text: "关闭",
                handler: function() {
                    win.close();
                }
            }
        ]
    }).show();
}

function internal_delete_db_row(){
    var grid = Ext.getCmp('grid.db.internal.info');
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
                            url : '../../DBTypeAction_delete.action',             // 删除 连接 到后台
                            params :{appName : appName,plugin : 'internal',deleteType:1},
                            success : function(r,o){
                                myMask.hide();
                                var respText = Ext.util.JSON.decode(r.responseText);
                                var msg = respText.msg;
                                Ext.MessageBox.show({
                                    title:'信息',
                                    msg:msg,
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

function internal_update_db_target_app_win(){
    var grid = Ext.getCmp('grid.db.internal.info');
    var store = Ext.getCmp('grid.db.internal.info').getStore();
    var selModel = grid.getSelectionModel();
    var formPanel;
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
            var deleteFile = item.data.deleteFile;
            var isRecover = item.data.isRecover;
            var deleteFileT;
            var deleteFileF;
            var isRecoverT;
            var isRecoverF;
            if(deleteFile == 'true'){
                deleteFileT = true;
                deleteFileF = false;
            }else if(deleteFile == 'false'){
                deleteFileT = false;
                deleteFileF = true;
            }
            if(isRecover == 'true'){
                isRecoverT = true;
                isRecoverF = false;
            }else if(isRecover == 'false'){
                isRecoverT = false;
                isRecoverF = true;
            }
            formPanel = new Ext.form.FormPanel({
                labelWidth:150,
                frame:true,
                labelAlign:'right',
                defaults : {
					width : 150,
					allowBlank : false,
					blankText : '该项不能为空！'
				},
				items : [{
                    fieldLabel:'应用源类型',
                    value:'目标',
                    xtype:'displayfield'
                },{
                    xtype:'hidden',
                    name:'typeBase.plugin',
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
                    value:'数据库同步'
                },{
                    xtype:'hidden',
                    name:'typeBase.appType',
                    value:'db'
                },{
                    fieldLabel:"应用编号",
                    xtype:'displayfield',
                    value:item.data.appName
                },{
                    name:'typeBase.appName',
                    xtype:'hidden',
                    value:item.data.appName
                },{
                    id:'internal.appDesc.update.info',
                    fieldLabel:"应用名",
                    xtype:'textfield',
                    name:'typeBase.appDesc',
                    value:item.data.appDesc,
                    regex:/^.{2,30}$/,
                    regexText:'请输入任意2--30个字符',
                    emptyText:'请输入任意2--30个字符'
                },{
                    fieldLabel:'数据文件存放目录',value:item.data.dataPath,
                    xtype:'textfield',
                    name:'typeBase.dataPath',
                    regex:/^([\/].*)*$/,
                    regexText:'这个不是目录',
                    emptyText:'请输入目录'
                },{
                    fieldLabel:"数据写入文件",
                    layout:'column',
                    defaultType: 'radio',
                    items: [
                        { width:50, boxLabel: '是', name: 'typeBase.deleteFile', inputValue: true,  checked: deleteFileT },
                        { width:50, boxLabel: '否', name: 'typeBase.deleteFile', inputValue: false, checked: deleteFileF }
                    ]
                },{
                    fieldLabel:"执行恢复操作",
                    layout:'column',
                    defaultType: 'radio',
                    items: [
                        { width:50, boxLabel: '是', name: 'typeBase.recover', inputValue: true,  checked: isRecoverT },
                        { width:50, boxLabel: '否', name: 'typeBase.recover', inputValue: false, checked: isRecoverF }
                    ]
                }]
            });
        });
    }
    var win = new Ext.Window({
        title:"修改信息-可信目标应用",
        width:400,
        height:300,
        layout:'fit',
        modal:true,
        items: [formPanel],
        bbar:[
            new Ext.Toolbar.Fill(),
            new Ext.Button ({
                id:'internal.update.target.app.win.info',
                text : '修改',
                formBind:true,
                allowDepress : false,
                handler : function() {
                    if (formPanel.form.isValid()) {
                        Ext.MessageBox.show({
                    		title:'信息',
                            width:200,
                            msg:'确定要修改?',
                            animEl:'internal.update.target.app.win.info',
                            buttons:{'ok':'确定','no':'取消'},
                            icon:Ext.MessageBox.WARNING,
                            closable:false,
                            fn:function(e){
                            	if(e=='ok'){
                            		formPanel.getForm().submit({
			                            url :'../../DBTypeAction_updateTargetApp.action',
			                            method :'POST',
			                            waitTitle :'系统提示',
			                            waitMsg :'正在修改,请稍后...',
			                            success : function(form,action) {
			                                Ext.MessageBox.show({
			                                    title:'信息',
			                                    width:260,
			                                    msg:action.result.msg,
			                                    animEl:'internal.update.target.app.win.info',
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
                            animEl:'internal.update.target.app.win.info',
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

function internal_detail_db_win(){
    var grid = Ext.getCmp('grid.db.internal.info');
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
                items:[{
                    fieldLabel:'应用源类型',
                    value:'目标端'
                },{
                    fieldLabel:'应用编号',
                    value:item.data.appName
                },{
                    fieldLabel:'应用名',
                    value:item.data.appDesc
                },{
                    fieldLabel:'应用类型',
                    value:(item.data.appType=='db')?'数据库同步应用管理':'<font color="red">应用类型出错</font>'
                },{
                    fieldLabel:'通道',
                    value:showURL_channel(item.data.channel)
                },{
                    fieldLabel:'启用状态',
                    value:showURL_isActive(item.data.isActive)
                },{
                    fieldLabel:'数据文件存放目录',
                    value:item.data.dataPath
                },{
                    fieldLabel:"数据写入文件",
                    value:item.data.deleteFile?'是':'否'
                },{
                    fieldLabel:"执行恢复操作",
                    value:item.data.isRecover?'是':'否'
                },{
                    fieldLabel:'源数据库名称',
                    value:item.data.srcdbName
                }]
            });
        });
    }
    var win = new Ext.Window({
        title:"详细信息-可信数据库同步",
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

function internal_update_dbName(){
    var sourceRecord = new Ext.data.Record.create([
		{name:'value',mapping:'value'},
		{name:'key',mapping:'key'}
	]);
	var sourceReader = new Ext.data.JsonReader({ totalProperty:'total',root:"rows"},sourceRecord);
	var storeSource = new Ext.data.Store({
		url:'../../JdbcAction_readJdbcName.action?typeXml=external',
		reader:sourceReader
	});
	storeSource.load();
    var grid = Ext.getCmp('grid.db.internal.info');
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
                items:[{
                    id:'update.appName',
                    xtype:'hidden',
                    name:'appName',
                    value:item.data.appName
                },{
                    id:'update.sourceDBNameOld',
                    xtype:'hidden',
                    name:'sourceDBNameOld',
                    value:item.data.srcdbName
                },{
                    fieldLabel:'更新前源端数据源名称',
                    value:item.data.srcdbName
                },{
                    id:'update.sourceDBName',
                    fieldLabel:"更新后源端数据源名称",
                    hiddenName:'sourceDBName',
                    xtype:'combo',
                    mode:'local',
                    emptyText :'--请选择--',
                    editable : false,
                    typeAhead:true,
                    forceSelection: true,
                    triggerAction:'all',
                    displayField:"key",valueField:"value",
                    store:storeSource
                }]
            });
        });
    }
    var win = new Ext.Window({
        title:"更新源数据库-可信数据库同步",
        width:400,
        height:140,
        layout:'fit',
        modal:true,
        items: [formPanel],
        bbar:[
            new Ext.Toolbar.Fill(),
            new Ext.Button ({
                text : '修改',
                id:'internal.update.target.sdb.win.info',
                allowDepress : false,
                handler : function() {
                    if (formPanel.form.isValid()) {
                        var sourceDBNameOld = Ext.getCmp('update.sourceDBNameOld').getValue();
                        var sourceDBName = Ext.getCmp('update.sourceDBName').getValue();
                        if(sourceDBNameOld==sourceDBName){
                            Ext.MessageBox.show({
                                title:'信息',
                                width:200,
                                msg:'请选择另外的数据源!',
                                animEl:'internal.update.target.sdb.win.info',
                                buttons:{'ok':'确定'},
                                icon:Ext.MessageBox.WARNING,
                                closable:false
                            });
                        } else {
                            var appName = Ext.getCmp('update.appName').getValue();
                            Ext.MessageBox.show({
                                title:'信息',
                                width:200,
                                msg:'确定要修改?',
                                animEl:'internal.update.target.sdb.win.info',
                                buttons:{'ok':'确定','no':'取消'},
                                icon:Ext.MessageBox.WARNING,
                                closable:false,
                                fn:function(e){
                                    if(e=='ok'){
                                        formPanel.getForm().submit({
                                            url :'../../DBTargetTableAction_updateSourceDBName.action',
                                            method :'POST',
                                            waitTitle :'系统提示',
                                            waitMsg :'正在修改,请稍后...',
                                            success : function(form,action) {
                                                Ext.MessageBox.show({
                                                    title:'信息',
                                                    width:260,
                                                    msg:action.result.msg,
                                                    animEl:'internal.update.target.sdb.win.info',
                                                    buttons:{'ok':'确定','no':'取消'},
                                                    icon:Ext.MessageBox.INFO,
                                                    closable:false,
                                                    fn:function(e){
                                                        if(e=='ok'){
                                                            grid.render();
                                                            store.reload();
                                                            win.close();
                                                            internal_detail_db_attribute_target(appName,sourceDBName);
                                                        }
                                                    }
                                                });
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    } else {
                        Ext.MessageBox.show({
                            title:'信息',
                            width:200,
                            msg:'请填写完成再提交!',
                            animEl:'internal.update.target.sdb.win.info',
                            buttons:{'ok':'确定'},
                            icon:Ext.MessageBox.ERROR,
                            closable:false
                        });
                    }
                }
            }),
            new Ext.Button ({
                allowDepress : false,
                text : '关闭',
                handler : function() {win.close();}
            })
        ]
    }).show();
}

/**
 * 目标   表集合 增删改查
 */
function internal_detail_db_attribute_target(appName,srcDBName){
    var internal_grid = Ext.getCmp('grid.db.internal.info');
    var internal_store = internal_grid.getStore();
    var selModel = internal_grid.getSelectionModel();
//    var appName;
//    var srcDBName;
//    if(selModel.hasSelection()){
//        var selections = selModel.getSelections();
//        Ext.each(selections,function(item){
//        	appName = item.data.appName;
//            srcDBName = item.data.srcdbName;
//        });
//    }
    var start = 0;			//分页--开始数
    var pageSize = 100;		//分页--每页数
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
        autoScroll:true,
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
        tbar:[
            new Ext.Button({
                id:'btnAdd.db.target.table.internal.info',
                text:'新增',
                iconCls:'add',
                handler:function(){
                    internal_insert_read_db_target_tables();
                }
            }),
            {xtype:"tbseparator"},
			new Ext.Button ({
			    id : 'btnRemove.db.target.table.internal.info',
                text : '删除',
				iconCls : 'remove',
				handler : function() {
					internal_delete_db_target_tables(grid,store,appName);
				}
            })
        ],
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
    function internal_showURL_table_target_attribute_flag(value){
       return "<a href='javascript:;' style='color: green;' onclick='internal_update_db_target_db(\""+appName+"\",\""+srcDBName +"\");'>修改目标表属性</a>";
    }
}

function internal_showURL_is_pk(value){
    Ext.getCmp('internal.is_pk.info').getRawValue();
    return (value=='true'||value==true)?'是':'否';
}

/**
 * 目标   表集合  增加 -- 选择 源表
 */
function internal_insert_read_db_target_tables(){
    var internal_grid = Ext.getCmp('grid.db.internal.info');
    var selModel = internal_grid.getSelectionModel();
    var appName;
    var tempTable;
    var sourceDBName;
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
        	appName = item.data.appName;
            tempTable = item.data.tempTable;
            sourceDBName = item.data.srcdbName;
        });
    }

	//==================================== -- 目标数据库名选择 -- =============================================================
    var target_dbName_record = new Ext.data.Record.create([
        {name:'key',mapping:'key'},
        {name:'value',mapping:'value'}
    ]);
    var target_dbName_proxy = new Ext.data.HttpProxy({
        url:"../../JdbcAction_readJdbcName.action?typeXml=internal"
    });
    var target_dbName_reader = new Ext.data.JsonReader({
        totalProperty:"total",
        root:"rows"
    },target_dbName_record);
    var target_dbName_store = new Ext.data.GroupingStore({
        id:"store.ip.db.external.info",
        proxy : target_dbName_proxy,
        reader : target_dbName_reader
    });
	target_dbName_store.load();
    var target_dbName = new Ext.form.ComboBox({
        id:'internal.target_dbName.info',
        listWidth : 170,
        store :  target_dbName_store,
        valueField : 'value',
        displayField : 'key',
        typeAhead : true,
        mode : 'local',
        triggerAction : 'all',
        selectOnFocus : true,
        allowBlank : false,
        listeners:{
            select:function(combo,record,index){
                target_tableName.clearValue();
                var target_dbName_value = this.getValue();
                target_tableName.store.load({params:{dbName:target_dbName_value}});
            }
        }
    });
	//==================================== -- 目标表选择 -- =============================================================
    var target_tableName_record = new Ext.data.Record.create([
        {name:'key',mapping:'key'},
        {name:'value',mapping:'value'}
    ]);
    var target_tableName_proxy = new Ext.data.HttpProxy({
        url:"../../DBTargetTableAction_readTargetDBNameKeyValue.action?typeXml=internal"
    });
    var target_tableName_reader = new Ext.data.JsonReader({
        totalProperty:"total",
        root:"rows"
    },target_tableName_record);
    var target_tableName_store = new Ext.data.GroupingStore({
        proxy : target_tableName_proxy,
        reader : target_tableName_reader
    });
    var target_tableName = new Ext.form.ComboBox({
        id:'internal.target_tableName.info',
        listWidth : 170,
        store :  target_tableName_store,
        valueField : 'value',
        displayField : 'key',
        typeAhead : true,
        mode : 'local',
        triggerAction : 'all',
        selectOnFocus : true,
        allowBlank : false
    });
	//==================================== -- 同步表选择 -- =============================================================
	//==================================== -- 同步表选择 -- =============================================================
    var start = 0;			//分页--开始数
    var pageSize = 100;		//分页--每页数
    var record = new Ext.data.Record.create([
        {name:'sourceTableName',mapping:'sourceTableName'},
        {name:'targetDBName',mapping:'targetDBName'},
        {name:'tableName',mapping:'tableName'},
        {name:'flag',mapping:'flag'}
    ]);
    var proxy = new Ext.data.HttpProxy({
        url:"../../DBTargetTableAction_readTargetDBName.action?typeXml=internal&appName="+appName
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
	store.load({
        params:{
            start:start,limit:pageSize,srcdbName:sourceDBName
        }
    });
    var boxM = new Ext.grid.CheckboxSelectionModel();   //复选框
    var rowNumber = new Ext.grid.RowNumberer();         //自动 编号
    var colM = new Ext.grid.ColumnModel([
        boxM,
        rowNumber,
        {header:"数据源表名",     dataIndex:"sourceTableName",    align:'center',sortable:true,menuDisabled:true},
        {header:"目标数据库名",   dataIndex:"targetDBName",       align:'center',sortable:true,menuDisabled:true,editor:target_dbName},
        {header:"目标表名",       dataIndex:"tableName",           align:'center',sortable:true,menuDisabled:true,editor:target_tableName},
        {header:"操作标记",       dataIndex:"flag",                 align:'center',sortable:true,menuDisabled:true,renderer:internal_showURL_target_tableAttribute_flag,     width:200}
    ]);
    colM.defaultSortable = true;
    var toolbar = new Ext.Toolbar({
        plain:true,
        height : 30,
        items : ['设置一个默认的目标数据源:',{
            xtype : 'combo',
            store : target_dbName_store,
            valueField : 'value',
            displayField : 'key',
            mode : 'local',
            forceSelection : true,
            triggerAction : 'all',
            emptyText : '--请选择--',
            selectOnFocus : true,
            width : 200,
            listeners:{
                select:function(){
                    var myMask = new Ext.LoadMask(Ext.getBody(),{
                        msg:'匹配中,请稍后...',
                        removeMask:true
                    });
                    myMask.show();
                    var target_dbName_value = this.getValue();
                    var _store = target_tableName.store;
                    _store.load({params:{dbName:target_dbName_value}});
                    var count = store.getCount();
                    _store.addListener('load',function(){
                        var index = 0;
                        for(var j = 0; j < _store.getCount(); j ++){
                            var _record = _store.getAt(j);
                            var tableName = _record.data.value;
                            for(var i=0;i<count;i++){
                                var record = store.getAt(i);
                                record.set("targetDBName",target_dbName_value);
                                var srcTableName = record.data.sourceTableName;
                                if(tableName==srcTableName){
                                    record.set('tableName',srcTableName);
                                    index ++;
                                }
                            }
                            if(index == count){
                                break;
                            }
                        }
                    });
                    myMask.hide();
                }
            }
        }]
    });
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
        id:'grid.table.target.insert.internal.info',
        plain:true,
        animCollapse:true,
        height:300,
        autoScroll:true,
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
        tbar:toolbar,
        bbar:page_toolbar
    });
    var win = new Ext.Window({
        title:"数据目标表属性设置",
        width:600,
        height:330,
        layout:'fit',
        modal:true,
        items: [grid]
    }).show();
    function internal_showURL_target_tableAttribute_flag(value){
       return "<a href='javascript:;' style='color: green;' onclick='internal_insert_set_db_target_table_attribute(\""+appName+"\",\""+sourceDBName+"\");'>表属性设置</a>";
    }
}

/**
 * 目标   表集合  增加 -- 选择 目标表属性
 * @param appName
 * @param sourceDBName
 */
function internal_insert_set_db_target_table_attribute(appName,sourceDBName){
    var grid_target = Ext.getCmp('grid.table.target.insert.internal.info');
    var store_target = grid_target.getStore();
    var selModel = grid_target.getSelectionModel();
    var tableName;
    var targetDBName;
    var sourceTableName;
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
            sourceTableName = item.data.sourceTableName;
            targetDBName = item.data.targetDBName;
        	tableName = item.data.tableName;
        });
    }
    if(targetDBName.length==0||tableName.length==0){
        Ext.MessageBox.show({
            title:'信息',
            msg:'请填写完成再设置属性!',
            buttons:{'ok':'确定'},
            icon:Ext.MessageBox.WARNING,
            closable:false
        });
    } else {
        //==================================== -- target_grid -- =============================================================
        var target_record = new Ext.data.Record.create([
            {name:'value',mapping:'value'},
            {name:'key',mapping:'key'}
        ]);
        var target_proxy = new Ext.data.HttpProxy({
            url:"../../DBTargetTableAction_readTargetTableField.action"
        });
        var target_reader = new Ext.data.JsonReader({
            totalProperty:"total",
            root:"rows"
        },target_record);
        var internal_insert_target_store = new Ext.data.Store({
            id:'internal.target_store.insert.info',
            proxy : target_proxy,
            reader : target_reader
        });
        //==================================== -- source_grid -- =============================================================
        var source_record = new Ext.data.Record.create([
            {name:'field',			    mapping:'field'},
            {name:'is_null',			mapping:'is_null'},
            {name:'column_size',		mapping:'column_size'},
            {name:'db_type',			mapping:'db_type'},
            {name:'jdbc_type',		mapping:'jdbc_type'},
            {name:'is_pk',				mapping:'is_pk'},
            {name:'dest',	            mapping:'dest'},
            {name:'isFixed',	        mapping:'isFixed'}
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

        /*function internal_showURL_dest(value,p,r){
            var index = internal_insert_target_store.find(Ext.getCmp('internal.dest.insert.info').valueField,value);
            var record = internal_insert_target_store.getAt(index);
            var displayText = "";
            if(record == null){
                return value;
            }else {
                return record.data.key;
            }
        }*/
        var source_dest = new Ext.form.ComboBox({
            id:'internal.dest.insert.info',
            listWidth : 250,
            store :  internal_insert_target_store,
            valueField : 'value',
            displayField : 'key',
            typeAhead : true,
            mode : 'remote',
            triggerAction : 'all',
            selectOnFocus : true,
            lazyRender : true,
            allowBlank : false,
            listeners:{
                focus:function(){
                    var store = source_grid.getStore();
                    var count = store.getCount();
                    var dests = new Array();
                    var idx=0;
                    for(var i=0;i<count;i++){
                        var record = store.getAt(i);
                        var dest = record.get('dest');
                        if(dest.length>0){
                            dests[idx++] = dest;
                        }
                    }
                    internal_insert_target_store.load({
                        params:{
                            typeXml:'internal',tableName:tableName,dbName:targetDBName,dests:dests
                        }
                    });
                }

            }
        });
        var start = 0;
        var pageSize = 10;
//        var SelectMap = new Map();
        var source_boxM = new Ext.grid.CheckboxSelectionModel(/*{
            listeners:{
                rowselect:function(obj,rowIndex,record){
                    var key = record.data.field;//往记录集中添加选中的行号,我这里直接保存了一个值
                    if(SelectMap.get(key)==undefined){
                        SelectMap.put(key,record);
                    } else {
                        SelectMap.remove(key);
                        SelectMap.put(key,record);
                    }
                },
                rowdeselect:function(obj,rowIndex,record){
                    var key = record.data.field;
                    if(SelectMap.get(key)!=undefined){
                        SelectMap.remove(key);
                    }
                }
            }
        }*/);   //复选框
        var source_rowNumber = new Ext.grid.RowNumberer();         //自动 编号
        var source_colM = new Ext.grid.ColumnModel([
            source_boxM,
            source_rowNumber,
            {header:"源字段名",	   	dataIndex:"field",		    align:'center',sortable:true,menuDisabled:true},
            {header:"主键",	dataIndex:"is_pk",		    align:'center',sortable:true,menuDisabled:true,renderer:internal_showURL_is},
            {header:"为空",	dataIndex:"is_null",		    align:'center',sortable:true},
            {header:"长度",	   	dataIndex:"column_size",	    align:'center',sortable:true},
            {header:"Jdbc类型",	dataIndex:"jdbc_type",	    align:'center',sortable:true},
            {header:"DB类型",	    dataIndex:"db_type",		    align:'center',sortable:true},
            {header:"目标字段名",	    dataIndex:"dest",			    align:'center',sortable:true,editor:source_dest}
        ]);
        for(var i=4;i<8;i++){
            source_colM.setHidden(i,!source_colM.isHidden(i));                // 加载后 不显示 该项
        }
        source_colM.defaultSortable = true;
        var source_grid = new Ext.grid.EditorGridPanel({
            id:'internal_read_db_target_source_tables.grid.info',
            plain:true,
            animCollapse:true,
            autoScroll:true,
            height:310,
            loadMask:{msg:'正在加载数据，请稍后...'},
            border:false,
            cm:source_colM,
            sm:source_boxM,
            store:source_store,
            stripeRows:true,
            autoExpandColumn:1,
            clicksToEdit:1,
            disableSelection:true,
            bodyStyle:'width:100%',
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
                store:source_store,
                displayInfo:true,
                displayMsg:"显示第{0}条记录到第{1}条记录，一共{2}条",
                emptyMsg:"没有记录",
                beforePageText:"当前页",
                afterPageText:"共{0}页"
            })*/
        });

        var formPanel = new Ext.form.FormPanel({
            plain:true,
            labelAlign:'right',
            autoScroll:true,
            labelWidth:160,
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
                value:tableName
            },{
                xtype:'hidden',
                name:'typeTable.targetDBName',
                value:targetDBName
            },{
                xtype:'hidden',
                name:'typeTable.sourceTableName',
                value:sourceTableName
            },{
                layout:'column',
                items:[{
                    columnWidth:.5,
                    layout:'form',
                    items:[{
                        fieldLabel:"源表名",
                        xtype:'displayfield',
                        value:sourceTableName
                    }]
                },{
                    columnWidth:.5,
                    labelWidth:120,
                    layout:'form',
                    items:[{
                        fieldLabel:"目标表名",
                        xtype:'displayfield',
                        value:tableName
                    }]
                }]
            },{
                layout:'column',
                items:[{
                    columnWidth:.5,
                    layout:'form',
                    items:[{
                        id:'save.deleteEnable.info',
                        width:70,
                        fieldLabel:"允许删除操作",
                        xtype:'checkbox',
                        name:'deleteEnable',
                        checked:false
                    }]
                },{
                    columnWidth:.5,
                    labelWidth:120,
                    layout:'form',
                    items:[{
                        id:'save.onlyInsert.info',
                        width:70,
                        fieldLabel:"只允许插入操作",
                        xtype:'checkbox',
                        name:'onlyInsert',
                        checked:false
                    }]
                }]
            },{
                labelWidth:160,
                layout:'form',
                items:[{
                    width:150,
                    fieldLabel:"分流条件(正则表达式)",
                    xtype: 'textfield',
                    name:'typeTable.condition'
                }]
            }]
        });
        var win = new Ext.Window({
            title:"源表"+sourceTableName+"对应的目标数据库"+targetDBName+"下的目标表"+tableName+"的属性设置",
            width:620,
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
                id:'internal.save.db.target.tables.info',
                text:'保存',
                handler:function(){
                    var onlyInsert = Ext.getCmp('save.onlyInsert.info').getValue();
                    var deleteEnable = Ext.getCmp('save.deleteEnable.info').getValue();
                    var grid_table = Ext.getCmp('internal_read_db_target_source_tables.grid.info');
                    var store_table = Ext.getCmp('internal_read_db_target_source_tables.grid.info').getStore();
//                    var count = SelectMap.size();
                    var selModel = grid_table.getSelectionModel();
                    var count = selModel.getCount();
                    var fields = new Array();
                    var dests = new Array();
                    var is_nulls = new Array();
                    var column_sizes = new Array();
                    var db_types = new Array();
                    var jdbc_types = new Array();
                    var is_pks = new Array();
                    if(count==0){
                        Ext.MessageBox.show({
                            title:'信息',
                            msg:'<font color="green">您没有勾选任何记录!</font>',
                            animEl:'internal.save.db.target.tables.info',
                            buttons:{'ok':'确定'},
                            icon:Ext.MessageBox.INFO,
                            closable:false
                        });
                    }else if(count>0){
//                        var record = SelectMap.values();
                        var record = selModel.getSelections();
                        for(var i = 0; i < record.length; i++){
                            fields[i] = record[i].get('field');
                            dests[i] = record[i].get('dest');
                            is_nulls[i] = record[i].get('is_null');
                            column_sizes[i] = record[i].get('column_size');
                            db_types[i] = record[i].get('db_type');
                            jdbc_types[i] = record[i].get('jdbc_type');
                            is_pks[i] = record[i].get('is_pk');
                        }
                        if(count<source_store.getTotalCount()){
                            Ext.MessageBox.show({
                                title:'信息',
                                msg:'<font color="green">源表与目标表字段位数不一致!</font>',
                                animEl:'internal.save.db.target.tables.info',
                                buttons:{'ok':'继续','no':'返回'},
                                icon:Ext.MessageBox.WARNING,
                                closable:false,
                                fn:function(e){
                                    if(e=='ok'){
                                        if (formPanel.form.isValid()) {
                                            formPanel.getForm().submit({
                                                url:'../../DBTargetTableAction_saveTargetTable.action',
                                                params:{type:'target',operate:'insert',
                                                    onlyInsert:onlyInsert,deleteEnable:deleteEnable,
                                                    fields:fields,is_nulls:is_nulls,dests:dests,
                                                    column_sizes:column_sizes,db_types:db_types,
                                                    jdbc_types:jdbc_types,is_pks:is_pks
                                                },
                                                method :'POST',
                                                waitTitle :'系统提示',
                                                waitMsg :'正在保存,请稍后...',
                                                success : function(form,action) {
                                                    Ext.MessageBox.show({
                                                        title:'信息',
                                                        msg:action.result.msg,
                                                        animEl:'internal.save.db.target.tables.info',
                                                        buttons:{'ok':'确定','no':'取消'},
                                                        icon:Ext.MessageBox.INFO,
                                                        closable:false,
                                                        fn:function(e){
                                                            if(e=='ok'){
                                                                win.close();
//                                                                grid_target.render();
//                                                                store_target.reload();
                                                                Ext.getCmp('grid.table.query.target.internal.info').getStore().reload();
                                                            }
                                                        }
                                                    });
                                                }
                                            });
                                        }else{
                                            Ext.MessageBox.show({
                                                title:'信息',
                                                msg:'请填写完成再提交!',
                                                animEl:'internal.save.db.target.tables.info',
                                                buttons:{'ok':'确定'},
                                                icon:Ext.MessageBox.ERROR,
                                                closable:false
                                            });
                                        }
                                    }
                                }
                            });
                        }else{
                            if (formPanel.form.isValid()) {
                                formPanel.getForm().submit({
                                    url:'../../DBTargetTableAction_saveTargetTable.action',
                                    params:{type:'target',operate:'insert',
                                        onlyInsert:onlyInsert,deleteEnable:deleteEnable,
                                        fields:fields,is_nulls:is_nulls,dests:dests,
                                        column_sizes:column_sizes,db_types:db_types,
                                        jdbc_types:jdbc_types,is_pks:is_pks
                                    },
                                    method :'POST',
                                    waitTitle :'系统提示',
                                    waitMsg :'正在保存,请稍后...',
                                    success : function(form,action) {
                                        Ext.MessageBox.show({
                                            title:'信息',
                                            msg:action.result.msg,
                                            animEl:'internal.save.db.target.tables.info',
                                            buttons:{'ok':'确定','no':'取消'},
                                            icon:Ext.MessageBox.INFO,
                                            closable:false,
                                            fn:function(e){
                                                if(e=='ok'){
                                                    win.close();
//                                                    grid_target.render();
//                                                    store_target.reload();
                                                    Ext.getCmp('grid.table.query.target.internal.info').getStore().reload();
                                                }
                                            }
                                        });
                                    }
                                });
                            }else{
                                Ext.MessageBox.show({
                                    title:'信息',
                                    msg:'请填写完成再提交!',
                                    animEl:'internal.save.db.target.tables.info',
                                    buttons:{'ok':'确定'},
                                    icon:Ext.MessageBox.ERROR,
                                    closable:false
                                });
                            }
                        }
                    }
                }
            },{
                text:'关闭',
                handler:function(){
                    win.close();
                }
            }]
        }).show();
        source_store.load({
            params:{
                start:start,limit:pageSize,typeXml:'internal',type:'insert',appName:appName,sourceDBName:sourceDBName,sourceTableName:sourceTableName,targetTableName:tableName,targetDBName:targetDBName
            }
        });
        source_store.addListener('load',function(){
            var size = source_store.getCount();
            for(var i=0;i<size;i++){
                var _record = source_store.getAt(i);
                source_boxM.selectRow(source_store.indexOf(_record),true);
                /*var isFixed = _record.data.isFixed;
                if(isFixed) {
                    source_boxM.selectRow(source_store.indexOf(_record),true);
                }
                if(SelectMap.get(field)!=undefined){
                    _record.set('is_pk',SelectMap.get(field).data.is_pk);
                    _record.set('jdbc_type',SelectMap.get(field).data.jdbc_type);
                    _record.set('db_type',SelectMap.get(field).data.db_type);
                    _record.set('dest',SelectMap.get(field).data.dest);
                    source_store.commitChanges();
                    source_boxM.selectRow(source_store.indexOf(_record),true);
                }*/
            }
        });
    }
}

/**
 * 目标   表集合  删除 -- 选择表
 * @param grid
 * @param store
 * @param appName
 */
function internal_delete_db_target_tables(grid,store,appName){
    var selModel = grid.getSelectionModel();
    var count = selModel.getCount();
    if(count==0){
        Ext.MessageBox.show({
            title:'信息',
            msg:'<font color="green">您没有勾选任何记录!</font>',
            animEl:'btnRemove.db.target.table.internal.info',
            buttons:{'ok':'确定'},
            icon:Ext.MessageBox.INFO,
            closable:false
        });
    }else if(count > 0){
        var tableNames = new Array();
        var record = grid.getSelectionModel().getSelections();
        for(var i = 0; i < record.length; i++){
            tableNames[i] = record[i].get('srcTableName');
        }
        Ext.MessageBox.show({
            title:'信息',
            msg:'<font color="green">确定要删除所选记录？</font>',
            animEl:'btnRemove.db.target.table.internal.info',
            width:260,
            buttons:{'ok':'确定','no':'取消'},
            icon:Ext.MessageBox.WARNING,
            closable:false,
            fn:function(e){
                if(e == 'ok'){
                    var myMask = new Ext.LoadMask(Ext.getBody(),{
                        msg : '正在删除,请稍后',
                        removeMask : true
                    });
                    myMask.show();
                    Ext.Ajax.request({
                        url : '../../DBTargetTableAction_deleteTargetTable.action',             // 删除 连接 到后台
                        params :{appName : appName,typeXml:'internal',tableNames:tableNames},
                        method:'POST',
                        success : function(r,o){
                            var respText = Ext.util.JSON.decode(r.responseText);
                            var msg = respText.msg;
                            myMask.hide();
                            Ext.MessageBox.show({
                                title:'信息',
                                msg:msg,
                                animEl:'btnRemove.db.target.table.internal.info',
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
    }
}

/**
 * 目标   表集合  修改  -- 选择 目标数据库名
 * @param appName
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
	internal_targetDB_store.load();
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
	store_targetdbName .load({
        params:{
            start:start,limit:pageSize
        }
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
        selModel:new Ext.grid.RowSelectionModel({singleSelect:true}),
        viewConfig:{
            forceFit:true,
            enableRowBody:true,
            getRowClass:function(record,rowIndex,p,store){
                return 'x-grid3-row-collapsed';
            }
        },
        bbar:page_toolbar,
        tbar:[
            new Ext.Button({
                id:'btnAdd.db.target.db.table.internal.info',
                text:'新增',
                iconCls:'add',
                handler:function(){
                    grid_targetdbName.stopEditing();
                    grid_targetdbName.getStore().insert(
                        0,
                        new record({
                            targetDB:'',
                            flag:''
                        })
                    );
                    grid_targetdbName.startEditing(0,0);
                }
            }),
            {xtype:"tbseparator"},
			new Ext.Button ({
			    id : 'btnRemove.db.target.db.table.internal.info',
                text : '删除',
				iconCls : 'remove',
				handler : function() {
					internal_delete_db_target_db_tables(grid_targetdbName,store_targetdbName,appName,srcTableName);
				}
            }),
            {xtype:"tbseparator"},
            new Ext.Button({
                id : 'btnSave.db.target.internal.info',
                text : '保存',
                iconCls : 'save',
				handler : function() {
                     internal_save_db_target_db_tables(grid_targetdbName,store_targetdbName,appName,srcTableName)
				}
            })
        ]
    });
    var win = new Ext.Window({
        title:"源表"+srcTableName+"的目标数据库名",
        width:600,
        height:330,
        layout:'fit',
        modal:true,
        items:[grid_targetdbName]
    }).show();
    function internal_showURL_update_target_db(){
        return "<a href='javascript:;' style='color: green;' onclick='internal_update_db_target_db_table(\""+appName+"\",\""+srcDBName +"\",\""+srcTableName+"\");'>目标表选择</a>"
    }
}

/**
 * 目标   表集合  修改  -- 选择 目标数据库名  增加
 * @param grid
 * @param store
 * @param appName
 * @param srcTableName
 */
function internal_save_db_target_db_tables(grid,store,appName,srcTableName){
    var selModel = grid.getSelectionModel();
    var count = selModel.getCount();
    if(count==0){
        Ext.MessageBox.show({
            title:'信息',
            msg:'<font color="green">您没有勾选任何记录!</font>',
            animEl:'btnSave.db.target.internal.info',
            buttons:{'ok':'确定'},
            icon:Ext.MessageBox.INFO,
            closable:false
        });
    }else if(count > 0){
        var targetDBs = new Array();
        var record = grid.getSelectionModel().getSelections();
        for(var i = 0; i < record.length; i++){
            targetDBs[i] = record[i].get('targetDB');
        }
        Ext.MessageBox.show({
            title:'信息',
            msg:'<font color="green">确定要保存所选记录？</font>',
            animEl:'btnSave.db.target.internal.info',
            width:260,
            buttons:{'ok':'确定','no':'取消'},
            icon:Ext.MessageBox.INFO,
            closable:false,
            fn:function(e){
                if(e == 'ok'){
                    Ext.Ajax.request({
                        url : '../../DBTargetTableAction_saveTargetDB.action',             // 删除 连接 到后台
                        params :{appName : appName,typeXml:'internal',targetDBs:targetDBs,srcTableName:srcTableName},
                        method:'POST',
                        success : function(){
                            Ext.MessageBox.show({
                                title:'信息',
                                width:260,
                                msg:'保存成功,点击返回列表!',
                                animEl:'btnSave.db.target.internal.info',
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
                        },
                        failure : function(){
                            Ext.MessageBox.show({
                                title:'信息',
                                width:260,
                                msg:'请与后台服务人员联系!',
                                animEl:'btnSave.db.target.internal.info',
                                buttons:{'ok':'确定'},
                                icon:Ext.MessageBox.ERROR,
                                closable:false
                            });
                        }
                    });
                }
            }
        });
    }
}

/**
 * 目标   表集合  修改  -- 选择 目标数据库名  删除
 * @param grid
 * @param store
 * @param appName
 * @param srcTableName
 */
function internal_delete_db_target_db_tables(grid,store,appName,srcTableName){
    var selModel = grid.getSelectionModel();
    var count = selModel.getCount();
    if(count==0){
        Ext.MessageBox.show({
            title:'信息',
            msg:'<font color="green">您没有勾选任何记录!</font>',
            animEl:'btnRemove.db.target.db.table.internal.info',
            buttons:{'ok':'确定'},
            icon:Ext.MessageBox.INFO,
            closable:false
        });
    }else if(count > 0){
        var targetDBs = new Array();
        var record = grid.getSelectionModel().getSelections();
        for(var i = 0; i < record.length; i++){
            targetDBs[i] = record[i].get('targetDB');
        }
        Ext.MessageBox.show({
            title:'信息',
            msg:'<font color="green">确定要删除所选记录？</font>',
            animEl:'btnRemove.db.target.db.table.internal.info',
            width:260,
            buttons:{'ok':'确定','no':'取消'},
            icon:Ext.MessageBox.WARNING,
            closable:false,
            fn:function(e){
                if(e == 'ok'){
                    var myMask = new Ext.LoadMask(Ext.getBody(),{
                        msg : '正在删除,请稍后...',
                        removeMask : true
                    });
                    myMask.show();
                    Ext.Ajax.request({
                        url : '../../DBTargetTableAction_deleteTargetDB.action',             // 删除 连接 到后台
                        params :{appName : appName,typeXml:'internal',targetDBs:targetDBs,srcTableName:srcTableName},
                        method:'POST',
                        success : function(r,o){
                            var respText = Ext.util.JSON.decode(r.responseText);
                            var msg = respText.msg;
                            myMask.hide();
                            Ext.MessageBox.show({
                                title:'信息',
                                width:260,
                                msg:msg,
                                animEl:'btnRemove.db.target.db.table.internal.info',
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
    }
}


/**
 * 目标   表集合  修改  -- 选择 目标数据库名  表
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
	internal_targetTable_store.load({
        params:{dbName:targetDB}
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
    var pageSize = 100;		//分页--每页数
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
	store_targetTabel.load({
        params:{
            start:start,limit:pageSize
        }
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
        autoScroll:true,
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
        selModel:new Ext.grid.RowSelectionModel({singleSelect:true}),
        viewConfig:{
            forceFit:true,
            enableRowBody:true,
            getRowClass:function(record,rowIndex,p,store){
                return 'x-grid3-row-collapsed';
            }
        },
        bbar:page_toolbar,
        tbar:[
            new Ext.Button({
                id:'btnAdd.db.target.db.target.table.internal.info',
                text:'新增',
                iconCls:'add',
                handler:function(){
                    grid_targetTabel.stopEditing();
                    grid_targetTabel.getStore().insert(
                        0,
                        new record({
                            targetTable:'',
                            flag:''
                        })
                    );
                    grid_targetTabel.startEditing(0,0);
                }
            }),
            {xtype:"tbseparator"},
			new Ext.Button ({
			    id : 'btnRemove.db.target.db.target.table.internal.info',
                text : '删除',
				iconCls : 'remove',
				handler : function() {
					internal_delete_db_target_db_target_tables(grid_targetTabel,store_targetTabel,appName,srcTableName,targetDB);
				}
            }),
            {xtype:"tbseparator"},
            new Ext.Button({
                id : 'btnSave.db.target.db.target.table.internal.info',
                text : '保存',
                iconCls : 'save',
				handler : function() {
                     internal_save_db_target_db_target_tables(grid_targetTabel,store_targetTabel,appName,srcTableName,targetDB)
				}
            })
        ]
    });
    var win = new Ext.Window({
        title:"源表"+srcTableName+"对应的目标数据库"+targetDB+"下的表",
        width:600,
        height:330,
        layout:'fit',
        modal:true,
        items:[grid_targetTabel]
    }).show();
    function internal_showURL_target_table_attribute(){
        return "<a href='javascript:;' style='color: green;' onclick='internal_update_db_target_db_table_attribute(\""+appName+"\",\""+srcDBName+"\",\""+srcTableName+"\",\""+targetDB+"\");'>目标表属性选择</a>"
    }
}

/**
 * 目标   表集合  修改  -- 选择 目标数据库名  表  删除
 * @param grid
 * @param store
 * @param appName
 * @param srcTableName
 * @param targetDB
 */
function internal_delete_db_target_db_target_tables(grid,store,appName,srcTableName,targetDB){
    var selModel = grid.getSelectionModel();
    var count = selModel.getCount();
    if(count==0){
        Ext.MessageBox.show({
            title:'信息',
            msg:'<font color="green">您没有勾选任何记录!</font>',
            animEl:'btnRemove.db.target.db.target.table.internal.info',
            buttons:{'ok':'确定'},
            icon:Ext.MessageBox.INFO,
            closable:false
        });
    }else if(count > 0){
        var targetTables = new Array();
        var record = grid.getSelectionModel().getSelections();
        for(var i = 0; i < record.length; i++){
            targetTables[i] = record[i].get('targetTable');
        }
        Ext.MessageBox.show({
            title:'信息',
            msg:'<font color="green">确定要删除所选记录？</font>',
            animEl:'btnRemove.db.target.db.target.table.internal.info',
            width:260,
            buttons:{'ok':'确定','no':'取消'},
            icon:Ext.MessageBox.WARNING,
            closable:false,
            fn:function(e){
                if(e == 'ok'){
                    var myMask = new Ext.LoadMask(Ext.getBody(),{
                        msg : '正在删除,请稍后...',
                        removeMask : true
                    });
                    myMask.show();
                    Ext.Ajax.request({
                        url : '../../DBTargetTableAction_deleteTargetTableName.action',             // 删除 连接 到后台
                        params :{appName : appName,typeXml:'internal',srcTableName:srcTableName,targetDB:targetDB,tableNames:targetTables},
                        method:'POST',
                        success : function(r,o){
                            var respText = Ext.util.JSON.decode(r.responseText);
                            var msg = respText.msg;
                            myMask.hide();
                            Ext.MessageBox.show({
                                title:'信息',
                                width:250,
                                msg:msg,
                                animEl:'btnRemove.db.target.db.target.table.internal.info',
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
    }
}

/**
 * 目标   表集合  修改  -- 选择 目标数据库名  表  保存
 * @param grid
 * @param store
 * @param appName
 * @param srcTableName
 * @param targetDB
 */
function internal_save_db_target_db_target_tables(grid,store,appName,srcTableName,targetDB){
    var selModel = grid.getSelectionModel();
    var count = selModel.getCount();
    if(count==0){
        Ext.MessageBox.show({
            title:'信息',
            msg:'<font color="green">您没有勾选任何记录!</font>',
            animEl:'btnSave.db.target.db.target.table.internal.info',
            buttons:{'ok':'确定'},
            icon:Ext.MessageBox.INFO,
            closable:false
        });
    }else if(count > 0){
        var targetTables = new Array();
        var record = grid.getSelectionModel().getSelections();
        for(var i = 0; i < record.length; i++){
            targetTables[i] = record[i].get('targetTable');
        }
        Ext.MessageBox.show({
            title:'信息',
            msg:'<font color="green">确定要保存所选记录？</font>',
            animEl:'btnSave.db.target.db.target.table.internal.info',
            width:260,
            buttons:{'ok':'确定','no':'取消'},
            icon:Ext.MessageBox.WARNING,
            closable:false,
            fn:function(e){
                if(e == 'ok'){
                    var myMask = new Ext.LoadMask(Ext.getBody(),{
                        msg : '正在保存,请稍后...',
                        removeMask : true
                    });
                    myMask.show();
                    Ext.Ajax.request({
                        url : '../../DBTargetTableAction_saveTargetTableName.action',             // 删除 连接 到后台
                        params :{appName : appName,typeXml:'internal',srcTableName:srcTableName,targetDB:targetDB,tableNames:targetTables},
                        method:'POST',
                        success : function(r,o){
                            var respText = Ext.util.JSON.decode(r.responseText);
                            var msg = respText.msg;
                            myMask.hide();
                            Ext.MessageBox.show({
                                title:'信息',
                                width:250,
                                msg:msg,
                                animEl:'btnSave.db.target.db.target.table.internal.info',
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
    }
}

/**
 * 目标   表集合  修改  -- 选择 目标数据库名  表  属性
 * @param appName
 * @param srcTableName
 * @param targetDB
 */
function internal_update_db_target_db_table_attribute(appName,srcDBName ,srcTableName,targetDB){
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
    var target_record = new Ext.data.Record.create([
        {name:'value',mapping:'value'},
		{name:'key',mapping:'key'}
    ]);
    var target_proxy = new Ext.data.HttpProxy({
        url:"../../DBTargetTableAction_readTargetTableField.action"
    });
    var target_reader = new Ext.data.JsonReader({
        totalProperty:"total",
        root:"rows"
    },target_record);
    var internal_update_target_store = new Ext.data.Store({
        proxy : target_proxy,
        reader : target_reader
    });
    var source_dest = new Ext.form.ComboBox({
        id:'internal.dest.update.info',
        listWidth : 250,
        store :  internal_update_target_store,
        valueField : 'value',
        displayField : 'key',
        typeAhead : true,
        mode : 'remote',
        triggerAction : 'all',
        selectOnFocus : true,
        lazyRender : true,
        allowBlank : false,
        listeners:{
            focus:function(){
                var store = source_grid.getStore();
                var count = store.getCount();
                var dests = new Array();
                var idx=0;
                for(var i=0;i<count;i++){
                    var record = store.getAt(i);
                    var dest = record.get('dest');
                    if(dest.length>0){
                        dests[idx++] = dest;
                    }
                }
                var _record = SelectMap.values();
                for(var i=0;i<_record.length;i++){
                    dests[idx++] = _record[i].get('dest');
                }
                internal_update_target_store.load({
                    params:{
                        typeXml:'internal',tableName:targetTable,dbName:targetDB,dests:dests
                    }
                });
            }

        }
    });
    var start = 0;
    var pageSize = 10;
//    var SelectMap = new Map();
//    var SelectDesMap = new Map();
    var source_boxM = new Ext.grid.CheckboxSelectionModel(/*{
        listeners:{
            rowselect:function(obj,rowIndex,record){
                var key = record.data.field;//往记录集中添加选中的行号,我这里直接保存了一个值
                if(SelectMap.get(key)==undefined){
                    SelectMap.put(key,record);
                } else {
                    SelectMap.remove(key);
                    SelectMap.put(key,record);
                }
                if(SelectDesMap.get(key)!=undefined){
                    SelectDesMap.remove(key);
                }
            },
            rowdeselect:function(obj,rowIndex,record){
                var key = record.data.field;
                if(SelectDesMap.get(key)==undefined){
                    SelectDesMap.put(key,record);
                } else {
                    SelectDesMap.remove(key);
                    SelectDesMap.put(key,record);
                }
                if(SelectMap.get(key)!=undefined){
                    SelectMap.remove(key);
                }
            }
        }
    }*/);   //复选框
    var source_rowNumber = new Ext.grid.RowNumberer();         //自动 编号
    var source_colM = new Ext.grid.ColumnModel([
        source_boxM,
        source_rowNumber,
        {header:"源字段名",	   	dataIndex:"field",			align:'center',sortable:true,menuDisabled:true},
        {header:"主键",	dataIndex:"is_pk",			align:'center',sortable:true,menuDisabled:true,renderer:internal_showURL_is},
        {header:"为空",	dataIndex:"is_null",		    align:'center',sortable:true},
        {header:"长度",	    dataIndex:"column_size",	    align:'center',sortable:true},
        {header:"Jdbc类型",	dataIndex:"jdbc_type",	    align:'center',sortable:true},
        {header:"DB类型",		dataIndex:"db_type",		    align:'center',sortable:true},
        {header:"目标字段名",		dataIndex:"dest",			    align:'center',sortable:true,menuDisabled:true,editor:source_dest}
    ]);
    for(var i=4;i<6;i++){
        source_colM.setHidden(i,!source_colM.isHidden(i));                // 加载后 不显示 该项
    }
    source_colM.defaultSortable = true;
    var source_grid = new Ext.grid.EditorGridPanel({
        id:'internal_read_db_target_target_tables.grid.info',
        plain:true,
        animCollapse:true,
        autoScroll:true,
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
        title:"源表"+srcTableName+"对应的目标数据库"+targetDB+"下的目标表"+targetTable+"属性设置",
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
            	var onlyInsert = Ext.getCmp('internal.form.table.onlyInsert.info').getValue(); 
            	var deleteEnable = Ext.getCmp('internal.form.table.deleteEnable.info').getValue(); 
                var grid_table = Ext.getCmp('internal_read_db_target_target_tables.grid.info');
                var store_table = grid_table.getStore();
//                var count = SelectMap.size();

                var selModel = grid_table.getSelectionModel();
               var count = selModel.getCount();
                var fields = new Array();
                var dests = new Array();
                var is_nulls = new Array();
                var column_sizes = new Array();
                var db_types = new Array();
                var jdbc_types = new Array();
                var is_pks = new Array();
                if(count==0){
                    Ext.MessageBox.show({
                        title:'信息',
                        msg:'<font color="green">您没有勾选任何记录!</font>',
                        animEl:'internal.update.db.target.target.tables.info',
                        buttons:{'ok':'确定'},
                        icon:Ext.MessageBox.INFO,
                        closable:false
                    });
                }else if(count>0){
//                    var record = SelectMap.values();
                    var record = selModel.getSelections();
                    for(var i = 0; i < record.length; i++){
                        fields[i] = record[i].get('field');
                        dests[i] = record[i].get('dest');
                        is_nulls[i] = record[i].get('is_null');
                        column_sizes[i] = record[i].get('column_size');
                        db_types[i] = record[i].get('db_type');
                        jdbc_types[i] = record[i].get('jdbc_type');
                        is_pks[i] = record[i].get('is_pk');
                    }
                    if(count<source_store.getTotalCount()){
                        Ext.MessageBox.show({
                            title:'信息',
                            msg:'<font color="green">源表与目标表字段位数不一致!</font>',
                            animEl:'internal.update.db.target.target.tables.info',
                            buttons:{'ok':'继续','no':'返回'},
                            icon:Ext.MessageBox.WARNING,
                            closable:false,
                            fn:function(e){
                                if(e=='ok'){
                                    if (formPanel.form.isValid()) {
                                        formPanel.getForm().submit({
                                            url:'../../DBTargetTableAction_saveTargetTable.action',
                                            params:{type:'target',operate:'update',
                                            	onlyInsert:onlyInsert,deleteEnable:deleteEnable,
                                            	fields:fields,is_nulls:is_nulls,dests:dests,
                                                column_sizes:column_sizes,db_types:db_types,
                                                jdbc_types:jdbc_types,is_pks:is_pks
                                            },
                                            method :'POST',
                                            waitTitle :'系统提示',
                                            waitMsg :'正在修改,请稍后...',
                                            success : function(form,action) {
                                                Ext.MessageBox.show({
                                                    title:'信息',
                                                    msg:action.result.msg,
                                                    animEl:'internal.update.db.target.target.tables.info',
                                                    buttons:{'ok':'确定','no':'取消'},
                                                    icon:Ext.MessageBox.INFO,
                                                    closable:false,
                                                    fn:function(e){
                                                        if(e=='ok'){
                                                            win.close();
                                                            internal_grid.render();
                                                            internal_grid.getStore().reload();
                                                            Ext.getCmp('grid.db.internal.info').render();
                                                            Ext.getCmp('grid.db.internal.info').getStore().reload();
                                                        }
                                                    }
                                                });
                                            }
                                        });
                                    }else{
                                        Ext.MessageBox.show({
                                            title:'信息',
                                            msg:'请填写完成再提交!',
                                            animEl:'internal.update.db.target.target.tables.info',
                                            buttons:{'ok':'确定'},
                                            icon:Ext.MessageBox.ERROR,
                                            closable:false
                                        });
                                    }
                                }
                            }
                        });
                    }else{
                        if (formPanel.form.isValid()) {
                            formPanel.getForm().submit({
                                url:'../../DBTargetTableAction_saveTargetTable.action',
                                params:{type:'target',operate:'update',
                                	onlyInsert:onlyInsert,deleteEnable:deleteEnable,
                                	fields:fields,is_nulls:is_nulls,dests:dests,
                                    column_sizes:column_sizes,db_types:db_types,
                                    jdbc_types:jdbc_types,is_pks:is_pks
                                },
                                method :'POST',
                                waitTitle :'系统提示',
                                waitMsg :'正在修改,请稍后...',
                                success : function(form,action) {
                                    Ext.MessageBox.show({
                                        title:'信息',
                                        msg:action.result.msg,
                                        animEl:'internal.update.db.target.target.tables.info',
                                        buttons:{'ok':'确定','no':'取消'},
                                        icon:Ext.MessageBox.INFO,
                                        closable:false,
                                        fn:function(e){
                                            if(e=='ok'){
                                                win.close();
                                                Ext.getCmp('grid.table.query.target.internal.info').getStore().reload();
                                            }
                                        }
                                    });
                                }
                            });
                        }else{
                            Ext.MessageBox.show({
                                title:'信息',
                                msg:'请填写完成再提交!',
                                animEl:'internal.update.db.target.target.tables.info',
                                buttons:{'ok':'确定'},
                                icon:Ext.MessageBox.ERROR,
                                closable:false
                            });
                        }
                    }
                }
            }
        },{
            text:'关闭',
            handler:function(){
                win.close();
            }
        }]
    }).show();
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
            var isChecked = record.data.checked;
            if(isChecked) {
                source_boxM.selectRow(source_store.indexOf(record),true);
            }
            /*var key = record.data.field;
            if(SelectDesMap.get(key)!=undefined){
                record.set('is_pk',SelectDesMap.get(key).data.is_pk);
                record.set('jdbc_type',SelectDesMap.get(key).data.jdbc_type);
                record.set('db_type',SelectDesMap.get(key).data.db_type);
                record.set('dest',SelectDesMap.get(key).data.dest);
                record.set('checked',false);
                source_store.commitChanges();
            } else{
                if(SelectMap.get(key)==undefined){
                    var isChecked = record.data.checked;
                    if(isChecked){
                        SelectMap.put(key,record);
                        source_boxM.selectRow(source_store.indexOf(record),true);
                    } else {
                        if(SelectDesMap.get(key)!=undefined){
                            SelectDesMap.remove(key);
                        }
                        SelectDesMap.put(key,record);
                    }
                } else {
                    var _record = SelectMap.get(key);
                    if(_record !=undefined){
                        record.set('is_pk',_record.data.is_pk);
                        record.set('jdbc_type',_record.data.jdbc_type);
                        record.set('db_type',_record.data.db_type);
                        record.set('dest',_record.data.dest);
                        record.set('checked',true);
                        source_store.commitChanges();
                    }
                    source_boxM.selectRow(source_store.indexOf(record),true);
                }
            }*/
        }
    });
}
