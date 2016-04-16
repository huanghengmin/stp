/**
 * 删除非可信应用
 */
function external_delete_db_row(){
    var grid = Ext.getCmp('grid.db.external.info');
    var store = grid.getStore();
    var selModel = grid.getSelectionModel();
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
            var appName = item.data.appName;
            Ext.MessageBox.show({
                title:'信息',
                msg:'<font color="green">确定要删除'+appName+'应用？</font>',
                width:300,
                buttons:{'ok':'确定','no':'取消'},
                icon:Ext.MessageBox.WARNING,
                closable:false,
                fn:function(e){
                    if(e == 'ok'){
                        var myMask = new Ext.LoadMask(Ext.getBody(),{
                            msg:'正在处理,请稍后...',
                            removeMask:true
                        });
                        myMask.show();
                        Ext.Ajax.request({
                            url : '../../AuthAction_delete.action',
                            params :{appName : appName,plugin : 'external'},
                            success : function(r,o){
                                var respText = Ext.util.JSON.decode(r.responseText);
                                var msg = respText.msg;
                                myMask.hide();
                                Ext.MessageBox.show({
                                    title:'信息',
                                    msg:msg,
                                    animEl:'btnRemove.db.external.info',
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
function external_allow_delete_db_row(){
    var grid = Ext.getCmp('grid.db.external.allow.info');
    var store = grid.getStore();
    var selModel = grid.getSelectionModel();
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
            var appName = item.data.appName;
            Ext.MessageBox.show({
                title:'信息',
                msg:'<font color="green">确定要删除'+appName+'应用？</font>',
                width:300,
                buttons:{'ok':'确定','no':'取消'},
                icon:Ext.MessageBox.WARNING,
                closable:false,
                fn:function(e){
                    if(e == 'ok'){
                        var myMask = new Ext.LoadMask(Ext.getBody(),{
                            msg:'正在处理,请稍后...',
                            removeMask:true
                        });
                        myMask.show();
                        Ext.Ajax.request({
                            url : '../../AuthAction_delete.action',
                            params :{appName : appName,plugin : 'external'},
                            success : function(r,o){
                                var respText = Ext.util.JSON.decode(r.responseText);
                                var msg = respText.msg;
                                myMask.hide();
                                Ext.MessageBox.show({
                                    title:'信息',
                                    msg:msg,
                                    animEl:'btnRemove.db.external.info',
                                    buttons:{'ok':'确定'},
                                    icon:Ext.MessageBox.INFO,
                                    closable:false,
                                    fn:function(e){
                                        if(e=='ok'){
                                            grid.render();
                                            store.reload();
//                                            var ingrid = Ext.getCmp('grid.db.internal.info');
//                                            ingrid.render();
//                                            ingrid.getStore().reload();
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
 * 安全属性设置
 */
function external_update_db_security_win(){
    var infoLevelRecord = new Ext.data.Record.create([
        {name:'value',mapping:'value'},
        {name:'key',mapping:'key'}
    ]);
    var infoLevelReader = new Ext.data.JsonReader({ totalProperty:'total',root:"rows"},infoLevelRecord);
    var storeInfoLevel = new Ext.data.Store({
        url:'../../ManagerSecurityLevelAction_readLevelKeyValue.action',
        reader:infoLevelReader,
        listeners : {
			load : function(){
				var infoLevel = Ext.getCmp('infoLevel.info').getValue();
                Ext.getCmp('infoLevel.info').setValue(infoLevel);
			}
		}
    });
    storeInfoLevel.load();

    var grid = Ext.getCmp('grid.db.external.info');
    var store = grid.getStore();
    var selModel = grid.getSelectionModel();
    var formPanel;
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
            var isFilter = item.data.isFilter;
            var isFilterT;
            var isFilterF;
            if(isFilter=='true'||isFilter==true){
            	isFilterT = true;
            	isFilterF = false;
            }else if(isFilter=='false'||isFilter == false){
            	isFilterT = false;
            	isFilterF = true;
            }
            var isVirusScan = item.data.isVirusScan;
            var isVirusScanT;
            var isVirusScanF;
            if(isVirusScan=='true'||isVirusScan==true){
            	isVirusScanT = true;
            	isVirusScanF = false;
            }else if(isVirusScan=='false'||isVirusScan == false){
            	isVirusScanT = false;
            	isVirusScanF = true;
            }
            formPanel = new Ext.form.FormPanel({
                labelWidth:150,
                frame:true,
                defaults : {
                    width : 200,
                    allowBlank:false,
                    blankText:'该项不能为空'
                },
                fileUpload :true,
                labelAlign:'right',
                items : [{
                    width:370,
                    title:'安全属性 -- 使用说明',
                    xtype:'fieldset',
                    html:"<font color='green'>1.所有项都为必填项；"
                },{
                    xtype:'hidden',name:'typeBase.appName',value:item.data.appName
                },{
                    xtype:'hidden',name:'typeBase.privated',value:false
                },{
                    xtype:'hidden',name:'typeBase.appType',value:item.data.appType
                },{
                    xtype:'hidden',name:'typeBase.plugin',value:item.data.plugin
                },{
                    fieldLabel:"启用内容过滤",
                    layout:'column',
                    defaultType: 'radio',
                    items: [
                        { columnWidth:.5, boxLabel: '是', name: 'typeBase.isFilter', inputValue: true,  checked: isFilterT },
                        { columnWidth:.5, boxLabel: '否', name: 'typeBase.isFilter', inputValue: false,  checked: isFilterF }
                    ]
                },{
                    fieldLabel:"启用病毒扫描",
                    layout:'column',
                    defaultType: 'radio',
                    items: [
                        { columnWidth:.5, boxLabel: '是', name: 'typeBase.isVirusScan', inputValue: true,  checked: isVirusScanT },
                        { columnWidth:.5, boxLabel: '否', name: 'typeBase.isVirusScan', inputValue: false,  checked: isVirusScanF }
                    ]
                },{
                    id:'infoLevel.info',
                    fieldLabel:'保密等级',
                    xtype:'combo',
                    width:140,
                    hiddenName:'typeBase.infoLevel',value:item.data.infoLevel,
                    mode:'local',
                    emptyText :'--请选择--',
                    editable : true,
                    typeAhead:true,
                    forceSelection: true,
                    triggerAction:'all',
                    displayField:"key",valueField:"value",
                    store: storeInfoLevel
                }]
            });
        });
    }
    var win = new Ext.Window({
        title:"信息-数据库步安全属性设置",
        width:400,
        height:300,
        layout:'fit',
        modal:true,
        items: [formPanel],
        bbar:[
            new Ext.Toolbar.Fill(),
            new Ext.Button ({
                id:'external.SafeS.update.info',
                text : '设置',
                formBind:true,
                allowDepress : false,
                handler : function() {
                    if (formPanel.form.isValid()) {
                        Ext.MessageBox.show({
                            title:'信息',
                            width:250,
                            msg:'确定要重新设置?',
                            animEl:'external.SafeS.update.info',
                            buttons:{'ok':'确定','no':'取消'},
                            icon:Ext.MessageBox.WARNING,
                            closable:false,
                            fn:function(e){
                                if(e=='ok'){
                                    formPanel.getForm().submit({
                                        url :'../../AuthAction_updateDB.action',
                                        method :'POST',
                                        waitTitle :'系统提示',
                                        waitMsg :'正在设置,请稍后...',
                                        success : function(form,action) {
                                            Ext.MessageBox.show({
                                                title:'信息',
                                                width:250,
                                                msg:action.result.msg,
                                                animEl:'external.SafeS.update.info',
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
                            width:250,
                            msg:'请填写完成再提交!',
                            animEl:'external.SafeS.update.info',
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
function external_allow_update_db_security_win(){
    var infoLevelRecord = new Ext.data.Record.create([
        {name:'value',mapping:'value'},
        {name:'key',mapping:'key'}
    ]);
    var infoLevelReader = new Ext.data.JsonReader({ totalProperty:'total',root:"rows"},infoLevelRecord);
    var storeInfoLevel = new Ext.data.Store({
        autoLoad:true,
        url:'../../ManagerSecurityLevelAction_readLevelKeyValue.action',
        reader:infoLevelReader,
        listeners : {
			load : function(){
				var infoLevel = Ext.getCmp('infoLevel.external.info').getValue();
                Ext.getCmp('infoLevel.external.info').setValue(infoLevel);
			}
		}
    });
    var grid = Ext.getCmp('grid.db.external.allow.info');
    var store = grid.getStore();
    var selModel = grid.getSelectionModel();
    var formPanel;
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
            var isFilter = item.data.isFilter;
            var isFilterT;
            var isFilterF;
            if(isFilter=='true'||isFilter==true){
            	isFilterT = true;
            	isFilterF = false;
            }else if(isFilter=='false'||isFilter == false){
            	isFilterT = false;
            	isFilterF = true;
            }
            var isVirusScan = item.data.isVirusScan;
            var isVirusScanT;
            var isVirusScanF;
            if(isVirusScan=='true'||isVirusScan==true){
            	isVirusScanT = true;
            	isVirusScanF = false;
            }else if(isVirusScan=='false'||isVirusScan == false){
            	isVirusScanT = false;
            	isVirusScanF = true;
            }
            formPanel = new Ext.form.FormPanel({
                labelWidth:150,
                frame:true,
                defaults : {
                    width : 200,
                    allowBlank:false,
                    blankText:'该项不能为空'
                },
                fileUpload :true,
                labelAlign:'right',
                items : [{
                    width:370,
                    title:'安全属性 -- 使用说明',
                    xtype:'fieldset',
                    html:"<font color='green'>1.所有项都为必填项；"
                },{
                    xtype:'hidden',name:'typeBase.appName',value:item.data.appName
                },{
                    xtype:'hidden',name:'typeBase.privated',value:false
                },{
                    xtype:'hidden',name:'typeBase.appType',value:item.data.appType
                },{
                    xtype:'hidden',name:'typeBase.plugin',value:item.data.plugin
                },{
                    fieldLabel:"启用内容过滤",
                    layout:'column',
                    defaultType: 'radio',
                    items: [
                        { columnWidth:.5, boxLabel: '是', name: 'typeBase.isFilter', inputValue: true,  checked: isFilterT },
                        { columnWidth:.5, boxLabel: '否', name: 'typeBase.isFilter', inputValue: false,  checked: isFilterF }
                    ]
                },{
                    fieldLabel:"启用病毒扫描",
                    layout:'column',
                    defaultType: 'radio',
                    items: [
                        { columnWidth:.5, boxLabel: '是', name: 'typeBase.isVirusScan', inputValue: true,  checked: isVirusScanT },
                        { columnWidth:.5, boxLabel: '否', name: 'typeBase.isVirusScan', inputValue: false,  checked: isVirusScanF }
                    ]
                },{
                    fieldLabel:'保密等级',
                    width:140,
                    value:item.data.infoLevel,
                    id:'infoLevel.external.info',
                    hiddenName:'typeBase.infoLevel',
                    xtype:'combo',
                    mode:'local',
                    emptyText :'--请选择--',
                    editable : false,
                    typeAhead:true,
                    forceSelection: true,
                    triggerAction:'all',
                    displayField:"key",valueField:"value",
                    store:storeInfoLevel
                }]
            });
        });
    }
    var win = new Ext.Window({
        title:"信息-数据库同步安全属性设置",
        width:400,
        height:300,
        layout:'fit',
        modal:true,
        items: [formPanel],
        bbar:[
            new Ext.Toolbar.Fill(),
            new Ext.Button ({
                id:'external.SafeS.update.info',
                text : '设置',
                formBind:true,
                allowDepress : false,
                handler : function() {
                    if (formPanel.form.isValid()) {
                        Ext.MessageBox.show({
                            title:'信息',
                            width:250,
                            msg:'确定要重新设置?',
                            animEl:'external.SafeS.update.info',
                            buttons:{'ok':'确定','no':'取消'},
                            icon:Ext.MessageBox.WARNING,
                            closable:false,
                            fn:function(e){
                                if(e=='ok'){
                                    formPanel.getForm().submit({
                                        url :'../../AuthAction_updateDB.action',
                                        method :'POST',
                                        waitTitle :'系统提示',
                                        waitMsg :'正在设置,请稍后...',
                                        success : function(form,action) {
                                            Ext.MessageBox.show({
                                                title:'信息',
                                                width:250,
                                                msg:action.result.msg,
                                                animEl:'external.SafeS.update.info',
                                                buttons:{'ok':'确定','no':'取消'},
                                                icon:Ext.MessageBox.INFO,
                                                closable:false,
                                                fn:function(e){
                                                    if(e=='ok'){
                                                        grid.render();
                                                        store.reload();
                                                        Ext.getCmp('grid.db.external.info').render();
                                                        Ext.getCmp('grid.db.external.info').getStore().reload();
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
                            width:250,
                            msg:'请填写完成再提交!',
                            animEl:'external.SafeS.update.info',
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
 * 详细信息
 */
function external_detail_db_win(){
    var grid = Ext.getCmp('grid.db.external.info');
    var selModel = grid.getSelectionModel();
    var formPanel;
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
            formPanel = new Ext.form.FormPanel({
                labelWidth:170,
                frame:true,
                labelAlign:'right',autoScroll:true,
                defaultType:'displayfield',
                defaults : {
					width : 200,
					allowBlank : false,
					blankText : '该项不能为空！'
				},
                items:[{
                    fieldLabel:'应用源类型',
                    value:external_showURL_plugin(item.data.plugin)
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
                    fieldLabel:'传输速度',
                    value:showURL_speed(item.data.speed)
                },{
                    fieldLabel:'通道',
                    value:showURL_channel(item.data.channel)
                },{
                    fieldLabel:'启用状态',
                    value:showURL_isActive(item.data.isActive)
                },{
                    fieldLabel:'审批通过',
                    value:show_isAllow(item.data.isAllow)
                },
                {fieldLabel:'信息等级',value:show_InfoLevel(item.data.infoLevel)},
                {fieldLabel:'启用内容过滤',value:show_is(item.data.isFilter)},
                {fieldLabel:'启用病毒扫描',value:show_is(item.data.isVirusScan)},
                {
                    fieldLabel:'数据文件存放目录',
                    value:item.data.dataPath
                },{
                    fieldLabel:"数据写入文件",
                    value:item.data.deleteFile?'是':'否'
                },{
                    fieldLabel:"执行恢复操作",
                    value:item.data.isRecover?'是':'否'
                },{
                    fieldLabel:"数据源",
                    value:item.data.dbName
                },{
                    fieldLabel:"同步方式",
                    value:external_showURL_operation(item.data.operation)
                },{
                    fieldLabel:"同步原表已存在的数据",
                    value:item.data.oldStep=='true'?'是':'否'
                },{
                    fieldLabel:'临时表表名',
                    value:item.data.tempTable
                },{
                    fieldLabel:'单次传输最大记录',
                    value:item.data.maxRecords
                },{
                    fieldLabel:'传输频率（单位:秒）',
                    value:item.data.interval
                },{
                    fieldLabel:"可用",
                    value:item.data.enable?'是':'否'
                },{
                    fieldLabel:'数据表集合',
                    value:external_showURL_tables(item.data.tables)
                }]
            });
        });
    }
    var win = new Ext.Window({
        title:"详细信息-非可信认证代理",
        width:420,
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
function external_allow_detail_db_win(){
    var grid = Ext.getCmp('grid.db.external.allow.info');
    var selModel = grid.getSelectionModel();
    var formPanel;
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
            formPanel = new Ext.form.FormPanel({
                labelWidth:170,
                frame:true,
                labelAlign:'right',autoScroll:true,
                defaultType:'displayfield',
                defaults : {
					width : 200,
					allowBlank : false,
					blankText : '该项不能为空！'
				},
                items:[{
                    fieldLabel:'应用源类型',
                    value:external_showURL_plugin(item.data.plugin)
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
                    fieldLabel:'传输速度',
                    value:showURL_speed(item.data.speed)
                },{
                    fieldLabel:'通道',
                    value:showURL_channel(item.data.channel)
                },{
                    fieldLabel:'启用状态',
                    value:showURL_isActive(item.data.isActive)
                },{
                    fieldLabel:'审批通过',
                    value:show_isAllow(item.data.isAllow)
                },
                {fieldLabel:'信息等级',value:show_InfoLevel(item.data.infoLevel)},
                {fieldLabel:'启用内容过滤',value:show_is(item.data.isFilter)},
                {fieldLabel:'启用病毒扫描',value:show_is(item.data.isVirusScan)},
                {
                    fieldLabel:'数据文件存放目录',
                    value:item.data.dataPath
                },{
                    fieldLabel:"数据写入文件",
                    value:item.data.deleteFile?'是':'否'
                },{
                    fieldLabel:"执行恢复操作",
                    value:item.data.isRecover?'是':'否'
                },{
                    fieldLabel:"数据源",
                    value:item.data.dbName
                },{
                    fieldLabel:"同步方式",
                    value:external_showURL_operation(item.data.operation)
                },{
                    fieldLabel:"同步原表已存在的数据",
                    value:item.data.oldStep=='true'?'是':'否'
                },{
                    fieldLabel:'临时表表名',
                    value:item.data.tempTable
                },{
                    fieldLabel:'单次传输最大记录',
                    value:item.data.maxRecords
                },{
                    fieldLabel:'传输频率（单位:秒）',
                    value:item.data.interval
                },{
                    fieldLabel:"可用",
                    value:item.data.enable?'是':'否'
                },{
                    fieldLabel:'数据表集合',
                    value:external_allow_showURL_tables(item.data.tables)
                }]
            });
        });
    }
    var win = new Ext.Window({
        title:"详细信息-非可信认证代理",
        width:420,
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

/**
 * 启用应用
 */
function external_start_db(){
    var grid = Ext.getCmp('grid.db.external.allow.info');
    var store = grid.getStore();
    var selModel = grid.getSelectionModel();
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
            var appName = item.data.appName;
            Ext.MessageBox.show({
                title:'信息',
                msg:'<font color="green">确定要启动'+appName+'应用？</font>',
                width:300,
                buttons:{'ok':'确定','no':'取消'},
                icon:Ext.MessageBox.WARNING,
                closable:false,
                fn:function(e){
                    if(e == 'ok'){
                        var myMask = new Ext.LoadMask(Ext.getBody(),{
                            msg:'正在启动,请稍后...',
                            removeMask:true
                        });
                        myMask.show();
                        Ext.Ajax.request({
                            url : '../../AuthAction_start.action',
                            params :{appName : appName,plugin : 'external'},
                            success : function(r,o){
                                myMask.hide();
                                var respText = Ext.util.JSON.decode(r.responseText);
                                var msg = respText.msg;
                                Ext.MessageBox.show({
                                    title:'信息',
                                    msg:msg,
                                    width:320,
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
 * 停用应用
 */
function external_stop_db(){
    var grid = Ext.getCmp('grid.db.external.allow.info');
    var store = grid.getStore();
    var selModel = grid.getSelectionModel();
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
            var appName = item.data.appName;
            Ext.MessageBox.show({
                title:'信息',
                msg:'<font color="green">确定要停止'+appName+'应用？</font>',
                animEl:'btnRemove.file.external.info',
                width:300,
                buttons:{'ok':'确定','no':'取消'},
                icon:Ext.MessageBox.WARNING,
                closable:false,
                fn:function(e){
                    if(e == 'ok'){
                        var myMask = new Ext.LoadMask(Ext.getBody(),{
                            msg:'正在停止,请稍后...',
                            removeMask:true
                        });
                        myMask.show();
                        Ext.Ajax.request({
                            url : '../../AuthAction_stop.action',
                            params :{appName : appName,plugin : 'external'},
                            success : function(r,o){
                                myMask.hide();
                                var respText = Ext.util.JSON.decode(r.responseText);
                                var msg = respText.msg;
                                Ext.MessageBox.show({
                                    title:'信息',
                                    msg:msg,
                                    width:320,
                                    animEl:'btnRemove.file.external.info',
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
 * 审核通过
 */
function type_allow(){
    var grid = Ext.getCmp('grid.db.external.info');
    var store = grid.getStore();
    var selModel = grid.getSelectionModel();
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
            var appName = item.data.appName;
            Ext.MessageBox.show({
                title:'信息',
                msg:'<font color="green">确定要通过'+appName+'应用的审核？</font>',
                width:300,
                buttons:{'ok':'确定','no':'取消'},
                icon:Ext.MessageBox.WARNING,
                closable:false,
                fn:function(e){
                    if(e == 'ok'){
                        var myMask = new Ext.LoadMask(Ext.getBody(),{
                            msg:'正在处理,请稍后...',
                            removeMask:true
                        });
                        myMask.show();
                        Ext.Ajax.request({
                            url : '../../AuthAction_allow.action',
                            params :{appName : appName,plugin : 'external'},
                            success : function(r,o){
                                myMask.hide();
                                var respText = Ext.util.JSON.decode(r.responseText);
                                var msg = respText.msg;
                                var flag = respText.flag;
                                if(flag){
                                    Ext.MessageBox.show({
                                        title:'信息',
                                        msg:msg + ',点击[启动]启用应用',
                                        buttons:{'ok':'启动','no':'取消'},
                                        icon:Ext.MessageBox.INFO,
                                        closable:false,
                                        fn:function(e){
                                            if(e=='no'){
                                                grid.render();
                                                store.reload();
                                                Ext.getCmp('grid.db.external.allow.info').render();
                                                Ext.getCmp('grid.db.external.allow.info').getStore().reload();
                                            } else if(e=='ok'){
                                                var myMask = new Ext.LoadMask(Ext.getBody(),{
                                                    msg:'正在启动,请稍后...',
                                                    removeMask:true
                                                });
                                                myMask.show();
                                                Ext.Ajax.request({
                                                    url : '../../AuthAction_start.action',
                                                    params :{appName : appName,plugin : 'external'},
                                                    success : function(r,o){
                                                        myMask.hide();
                                                        var respText = Ext.util.JSON.decode(r.responseText);
                                                        var msg = respText.msg;
                                                        Ext.MessageBox.show({
                                                            title:'信息',
                                                            msg:msg,
                                                            width:320,
                                                            buttons:{'ok':'确定'},
                                                            icon:Ext.MessageBox.INFO,
                                                            closable:false,
                                                            fn:function(e){
                                                                if(e=='ok'){
                                                                    grid.render();
                                                                    store.reload();
                                                                    Ext.getCmp('grid.db.external.allow.info').render();
                                                                    Ext.getCmp('grid.db.external.allow.info').getStore().reload();
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
                                        msg:msg,
                                        buttons:{'ok':'确定'},
                                        icon:Ext.MessageBox.INFO,
                                        closable:false,
                                        fn:function(e){
                                            if(e=='ok'){
                                                grid.render();
                                                store.reload();
                                                Ext.getCmp('grid.db.external.allow.info').render();
                                                Ext.getCmp('grid.db.external.allow.info').getStore().reload();
                                            }
                                        }
                                    });
                                }
                            }
                        });
                    }
                }
            });
        });
    }
}

/**
 *批注
 */
function type_check(){
    var grid = Ext.getCmp('grid.db.external.info');
    var store = grid.getStore();
    var selModel = grid.getSelectionModel();
    var appName;
    var appType;
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
            appName = item.data.appName;
            appType = item.data.appType;
        });
    }
    var check_record = new Ext.data.Record.create([
	    {name:'appName',	mapping:'appName'},
	    {name:'appType',	mapping:'appType'},
	    {name:'up',        mapping:'up'},
        {name:'desc',		mapping:'desc'},
        {name:'reDesc',		mapping:'reDesc'},
	    {name:'id',		mapping:'id'}
    ]);
    var start = 0;
    var pageSize = 10;
    var check_store = new Ext.data.GroupingStore({
        proxy : new Ext.data.HttpProxy({ url:'../../TypeCheckAction_select.action' }),
        reader : new Ext.data.JsonReader({ totalProperty:'total', root:'rows' },check_record)
    });

    var check_boxM = new Ext.grid.CheckboxSelectionModel();   //复选框
    var check_rowNumber = new Ext.grid.RowNumberer();         //自动 编号
    var check_colM = new Ext.grid.ColumnModel([
        check_boxM,
        check_rowNumber,
        {header:"应用编号",	dataIndex:"appName",	align:'center',menuDisabled:true},
        {header:'应用类型',	dataIndex:'appType',	align:'center',menuDisabled:true},
        {header:'已修改应用',	dataIndex:'up',	align:'center',menuDisabled:true,renderer:check_showURL_update},
        {header:'批注信息',	dataIndex:'desc',		align:'center',menuDisabled:true},
        {header:'操作标记',	dataIndex:'id',		align:'center',menuDisabled:true,renderer:check_showURL_flag}
    ]);
    check_colM.defaultSortable = true;
    var gridPanel= new Ext.grid.GridPanel({
        id:'grid.check.info',
        plain:true,
        animCollapse:true,
        loadMask:{msg:'正在加载数据，请稍后...'},
        border:false,
        collapsible:false,
        cm:check_colM,
        sm:check_boxM,
        store:check_store,
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
                id:'add.check.info',
                text:'新增',
                iconCls:'add',
                handler:function(){
                    check_insert(gridPanel,check_store,appName,appType);
                }
            }),
            {xtype:"tbseparator"},
            new Ext.Button({
                id:'delete.check.info',
                text:'删除',
                iconCls:'delete',
                handler:function(){
                    check_delete(gridPanel,check_store);
                }
            })
        ],
        view:new Ext.grid.GroupingView({
            forceFit:true,
            groupingTextTpl:'{text}({[values.rs.length]}条记录)'
        }),
        bbar:new Ext.PagingToolbar({
            pageSize : pageSize,
            store:check_store,
            displayInfo:true,
            displayMsg:"显示第{0}条记录到第{1}条记录，一共{2}条",
            emptyMsg:"没有记录",
            beforePageText:"当前页",
            afterPageText:"共{0}页"
        })
    });
    var win = new Ext.Window({
        title:"批注应用",
        width:600,
        height:300,
        layout:'fit',
        modal:true,
        items: [gridPanel],
        bbar:[
            new Ext.Toolbar.Fill(),
            new Ext.Button ({
                text : '保存',
                allowDepress : false,
                handler : function() { win.close(); }
            }),
            new Ext.Button ({
                allowDepress : false,
                text : '关闭',
                handler : function() {win.close();}
            })
        ]
    }).show();
    check_store.load({params:{ start:start,limit:pageSize,appName:appName,appType:appType} });
    function check_showURL_update(value){
        if(value==1){
            return '<font color="green">已回应</font>';
        } else if(value==0){
            return '<font color="red">未回应</font>';
        }
    }
    function check_showURL_flag(value){
        return "<a href='javascript:;' style='color: green;' onclick='check_update();'>修改</a>";
    }
}

/**
 * 数据源 表集合 查找
 */
function external_detail_db_attribute_source(){
    var external_grid = Ext.getCmp('grid.db.external.info');
    var external_store = external_grid.getStore();
    var selModel = external_grid.getSelectionModel();
    var appName;
    var dbName;
    var operation;
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
        	appName = item.data.appName;
            dbName = item.data.dbName;
            operation = item.data.operation;
        });
    }
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
            start:start,limit:pageSize,appName:appName
        }
    });
    function external_showURL_table_source_attribute_flag(value){
       return "<a href='javascript:;' style='color: green;' onclick='external_update_db_source_attribute(\""+appName+"\",\""+dbName+"\",\""+operation+"\");'>查看表属性</a>";
    }
}
function external_allow_detail_db_attribute_source(){
    var external_grid = Ext.getCmp('grid.db.external.allow.info');
    var external_store = external_grid.getStore();
    var selModel = external_grid.getSelectionModel();
    var appName;
    var dbName;
    var operation;
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
        	appName = item.data.appName;
            dbName = item.data.dbName;
            operation = item.data.operation;
        });
    }
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
        listeners:{
            close:function(){
                external_grid.render();
                external_store.reload();
                Ext.getCmp('grid.db.external.info').render();
                Ext.getCmp('grid.db.external.info').getStore().reload();
            }
        },
        items: [grid]
    }).show();
    store.load({
        params:{
            start:start,limit:pageSize,appName:appName
        }
    });
    function external_showURL_table_source_attribute_flag(value){
       return "<a href='javascript:;' style='color: green;' onclick='external_allow_update_db_source_attribute(\""+appName+"\",\""+dbName+"\",\""+operation+"\");'>查看表属性</a>";
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
        autoScroll:true,
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
function external_allow_update_db_source_attribute(appName,dbName,operation){
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
        autoScroll:true,
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
