/**
 * 删除可信应用
 */
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
                            params :{appName : appName,plugin : 'internal'},
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
function internal_allow_delete_db_row(){
    var grid = Ext.getCmp('grid.db.internal.allow.info');
    var store = grid.getStore();
    var selModel = grid.getSelectionModel();
    var count = selModel.getCount();
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
                            params :{appName : appName,plugin : 'internal'},
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

/**
 * 安全属性设置
 */
function internal_update_db_security_win(){
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

    var grid = Ext.getCmp('grid.db.internal.info');
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
                    xtype:'hidden',name:'typeBase.privated',value:true
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
                    editable : false,
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
        title:"信息-数据库同步安全属性设置",
        width:400,
        height:300,
        layout:'fit',
        modal:true,
        items: [formPanel],
        bbar:[
            new Ext.Toolbar.Fill(),
            new Ext.Button ({
                id:'internal.SafeS.update.info',
                text : '设置',
                formBind:true,
                allowDepress : false,
                handler : function() {
                    if (formPanel.form.isValid()) {
                        Ext.MessageBox.show({
                            title:'信息',
                            width:250,
                            msg:'确定要重新设置?',
                            animEl:'internal.SafeS.update.info',
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
                                                animEl:'internal.SafeS.update.info',
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
                            animEl:'internal.SafeS.update.info',
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
function internal_allow_update_db_security_win(){
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

    var grid = Ext.getCmp('grid.db.internal.allow.info');
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
                    xtype:'hidden',name:'typeBase.privated',value:true
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
                    editable : false,
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
        title:"信息-数据库同步安全属性设置",
        width:400,
        height:300,
        layout:'fit',
        modal:true,
        items: [formPanel],
        bbar:[
            new Ext.Toolbar.Fill(),
            new Ext.Button ({
                id:'internal.SafeS.update.info',
                text : '设置',
                formBind:true,
                allowDepress : false,
                handler : function() {
                    if (formPanel.form.isValid()) {
                        Ext.MessageBox.show({
                            title:'信息',
                            width:250,
                            msg:'确定要重新设置?',
                            animEl:'internal.SafeS.update.info',
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
                                                animEl:'internal.SafeS.update.info',
                                                buttons:{'ok':'确定','no':'取消'},
                                                icon:Ext.MessageBox.INFO,
                                                closable:false,
                                                fn:function(e){
                                                    if(e=='ok'){
                                                        grid.render();
                                                        store.reload();
                                                        Ext.getCmp('grid.db.internal.info').render();
                                                        Ext.getCmp('grid.db.internal.info').getStore().reload();
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
                            animEl:'internal.SafeS.update.info',
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
                    fieldLabel:'源数据库名称',
                    value:item.data.srcdbName
                },{
                    fieldLabel:'数据表集合',
                    value:internal_showURL_tables(item.data.tables)
                }]
            });
        });
    }
    var win = new Ext.Window({
        title:"详细信息-可信认证代理",
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
function internal_allow_detail_db_win(){
    var grid = Ext.getCmp('grid.db.internal.allow.info');
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
                    fieldLabel:'源数据库名称',
                    value:item.data.srcdbName
                },{
                    fieldLabel:'数据表集合',
                    value:internal_allow_showURL_tables(item.data.tables)
                }]
            });
        });
    }
    var win = new Ext.Window({
        title:"详细信息-可信认证代理",
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

/**
 * 启用应用
 */
function internal_start_db(){
    var grid = Ext.getCmp('grid.db.internal.allow.info');
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
                            params :{appName : appName,plugin : 'internal'},
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
function internal_stop_db(){
    var grid = Ext.getCmp('grid.db.internal.allow.info');
    var store = grid.getStore();
    var selModel = grid.getSelectionModel();
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
            var appName = item.data.appName;
            Ext.MessageBox.show({
                title:'信息',
                msg:'<font color="green">确定要停止'+appName+'应用？</font>',
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
                            params :{appName : appName,plugin : 'internal'},
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
 * 审核通过
 */
function type_allow(){
    var grid = Ext.getCmp('grid.db.internal.info');
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
                            params :{appName : appName,plugin : 'internal'},
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
                                                Ext.getCmp('grid.db.internal.allow.info').render();
                                                Ext.getCmp('grid.db.internal.allow.info').getStore().reload();
                                            } else if(e=='ok'){
                                                var myMask = new Ext.LoadMask(Ext.getBody(),{
                                                    msg:'正在启动,请稍后...',
                                                    removeMask:true
                                                });
                                                myMask.show();
                                                Ext.Ajax.request({
                                                    url : '../../AuthAction_start.action',
                                                    params :{appName : appName,plugin : 'internal'},
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
                                                                    Ext.getCmp('grid.db.internal.allow.info').render();
                                                                    Ext.getCmp('grid.db.internal.allow.info').getStore().reload();
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
                                                Ext.getCmp('grid.db.internal.allow.info').render();
                                                Ext.getCmp('grid.db.internal.allow.info').getStore().reload();
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
    var grid = Ext.getCmp('grid.db.internal.info');
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
	    {name:'up',   mapping:'up'},
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
        enableDragDrop: true,
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
 *目标   表集合 查找
 */
function internal_detail_db_attribute_target(){
    var internal_grid = Ext.getCmp('grid.db.internal.info');
    var internal_store = internal_grid.getStore();
    var selModel = internal_grid.getSelectionModel();
    var appName;
    var srcDBName;
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
        	appName = item.data.appName;
            srcDBName = item.data.srcdbName;
        });
    }
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
function internal_allow_detail_db_attribute_target(){
    var internal_grid = Ext.getCmp('grid.db.internal.allow.info');
    var internal_store = internal_grid.getStore();
    var selModel = internal_grid.getSelectionModel();
    var appName;
    var srcDBName;
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
        	appName = item.data.appName;
            srcDBName = item.data.srcdbName;
        });
    }
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
        id:'grid.table.query.target.internal.allow.info',
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
        listeners:{
            close:function(){
                internal_grid.render();
                internal_store.reload();
                Ext.getCmp('grid.db.internal.info').render();
                Ext.getCmp('grid.db.internal.info').getStore().reload();
            }
        },
        items: [grid]
    }).show();

	store.load({
        params:{
            start:start,limit:pageSize,appName:appName
        }
    });
    function internal_showURL_table_target_attribute_flag(value){
       return "<a href='javascript:;' style='color: green;' onclick='internal_allow_update_db_target_db(\""+appName+"\",\""+srcDBName+"\");'>查找目标表属性</a>";
    }
}

function internal_showURL_is_pk(value){
    if(Ext.getCmp('internal.is_pk.info').getRawValue().length==0){
        return value=='true'?'是':'否';
    }else {
        return Ext.getCmp('internal.is_pk.info').getRawValue();
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
function internal_allow_update_db_target_db(appName,srcDBName){
    var grid = Ext.getCmp('grid.table.query.target.internal.allow.info');
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
        id:'grid.targetdbName.db.internal.allow.info',
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
        return "<a href='javascript:;' style='color: green;' onclick='internal_allow_update_db_target_db_table(\""+appName+"\",\""+srcDBName+"\",\""+srcTableName+"\");'>目标表选择</a>"
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
function internal_allow_update_db_target_db_table(appName,srcDBName,srcTableName){
    var grid = Ext.getCmp('grid.targetdbName.db.internal.allow.info');
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
        id:'grid.targetdbName.table.db.internal.allow.info',
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
        return "<a href='javascript:;' style='color: green;' onclick='internal_allow_update_db_target_db_table_attribute(\""+appName+"\",\""+srcDBName+"\",\""+srcTableName+"\",\""+targetDB+"\");'>查找目标表属性</a>"
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
        {header:"主键",	dataIndex:"is_pk",			align:'center',sortable:true,renderer:internal_showURL_is},
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
function internal_allow_update_db_target_db_table_attribute(appName,srcDBName,srcTableName,targetDB){
    var internal_grid = Ext.getCmp('grid.targetdbName.table.db.internal.allow.info');
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
        {header:"主键",	dataIndex:"is_pk",			align:'center',sortable:true,renderer:internal_showURL_is},
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
