/**
 * 通用代理可信端删除应用--业务管理员
 */
function internal_delete_proxy_row(){
    var grid = Ext.getCmp('grid.proxy.internal.info');
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
                animEl:'btnRemove.proxy.internal.info',
                width:300,
                buttons:{'ok':'确定','cancel':'取消'},
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
                            url : '../../AuthAction_delete.action',
                            params :{appName : appName,plugin : 'internal'},
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
function internal_allow_delete_proxy_row(){
    var grid = Ext.getCmp('grid.proxy.internal.allow.info');
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
                animEl:'btnRemove.proxy.internal.info',
                width:300,
                buttons:{'ok':'确定','cancel':'取消'},
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
                            url : '../../AuthAction_delete.action',
                            params :{appName : appName,plugin : 'internal'},
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
 * 通用代理可信端--安全属性设置
 */
function internal_update_proxy_security_win(){
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
    var grid = Ext.getCmp('grid.proxy.internal.info');
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
                autoScroll : true,
                items : [{
                    width:370,
                    title:'安全属性 -- 使用说明',
                    xtype:'fieldset',
                    html:"<font color='green'>1.所有项都为必填项；<br>2.IP/Mac过虑策略选择后，需要在列表中进行操作黑白名单！"
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
                    hiddenName:'typeBase.infoLevel',value:item.data.infoLevel,
                    mode:'local',
                    emptyText :'--请选择--',
                    editable : false,
                    typeAhead:true,
                    forceSelection: true,
                    triggerAction:'all',
                    displayField:"key",valueField:"value",
                    store: storeInfoLevel
                },{
                    fieldLabel:"IP/Mac过虑策略",hiddenName:'typeSafe.ipfilter',value:item.data.ipfilter,
                    xtype:'combo',
                    mode:'local',
                    emptyText :'--请选择--',
                    editable : false,
                    typeAhead:true,
                    forceSelection: true,
                    triggerAction:'all',
                    displayField:"key",valueField:"value",
                    store:storeIP
                }]
            });
        });
    }
    var win = new Ext.Window({
        title:"信息-通用代理安全属性设置",
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
                                        url :'../../AuthAction_updateProxy.action',
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
function internal_allow_update_proxy_security_win(){
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

    var grid = Ext.getCmp('grid.proxy.internal.allow.info');
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
                autoScroll : true,
                items : [{
                    width:370,
                    title:'安全属性 -- 使用说明',
                    xtype:'fieldset',
                    html:"<font color='green'>1.所有项都为必填项；<br>2.IP/Mac过虑策略选择后，需要在列表中进行操作黑白名单！"
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
                    hiddenName:'typeBase.infoLevel',value:item.data.infoLevel,
                    mode:'local',
                    emptyText :'--请选择--',
                    editable : false,
                    typeAhead:true,
                    forceSelection: true,
                    triggerAction:'all',
                    displayField:"key",valueField:"value",
                    store: storeInfoLevel
                },{
                    fieldLabel:"IP/Mac过虑策略",hiddenName:'typeSafe.ipfilter',value:item.data.ipfilter,
                    xtype:'combo',
                    mode:'local',
                    emptyText :'--请选择--',
                    editable : false,
                    typeAhead:true,
                    forceSelection: true,
                    triggerAction:'all',
                    displayField:"key",valueField:"value",
                    store:storeIP
                }]
            });
        });
    }
    var win = new Ext.Window({
        title:"信息-通用代理安全属性设置",
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
                                        url :'../../AuthAction_updateProxy.action',
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
                                                        Ext.getCmp('grid.proxy.internal.info').render();
                                                        Ext.getCmp('grid.proxy.internal.info').getStore().reload();
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
 * 通用代理可信端详细查看应用--业务管理员
 */
function internal_detail_proxy_win(){
    var grid = Ext.getCmp('grid.proxy.internal.info');
    var store = grid.getStore();
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
                items:[{
                    fieldLabel:'应用编号',
                    value:item.data.appName
                },{
                    fieldLabel:'应用名',
                    value:item.data.appDesc
                },{
                    fieldLabel:'应用类型',
                    value:(item.data.appType=='proxy')?'通用代理应用管理':'<font color="red">应用类型出错</font>'
                },{
                    fieldLabel:'启用状态',
                    value:showURL_isActive(item.data.isActive)
                },{
                    fieldLabel:'通过审批',
                    value:show_isAllow(item.data.isAllow)
                },{
                    fieldLabel:'启用内容过滤',
                    value:is_showURL(item.data.isFilter)
                },{
                    fieldLabel:'启用病毒扫描',
                    value:is_showURL(item.data.isVirusScan)
                },{
                    fieldLabel:'信息等级',value:show_InfoLevel(item.data.infoLevel)
                },{
                    fieldLabel:'IP/Mac过虑策略',
                    value:internal_ipFilter_showURL(item.data.ipfilter)
                },{
                    fieldLabel:'应用服务地址',
                    value:item.data.t_serverAddress
                },{
                    fieldLabel:'应用服务端口',
                    value:item.data.t_port
                },{
                    fieldLabel:'最小连接数',
                    value:item.data.t_poolMin
                },{
                    fieldLabel:'最大连接数',
                    value:item.data.t_poolMax
                },{
                    fieldLabel:'编码',
                    value:item.data.t_charset
                },{
                    fieldLabel:'重试次数',
                    value:item.data.t_tryTime
                },{
                    fieldLabel:'类型',
                    value:item.data.t_type
                }]
            });
        });
    }
    var win = new Ext.Window({
        title:"详细信息-可信通用代理",
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
function internal_allow_detail_proxy_win(){
    var grid = Ext.getCmp('grid.proxy.internal.allow.info');
    var store = grid.getStore();
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
                items:[{
                    fieldLabel:'应用编号',
                    value:item.data.appName
                },{
                    fieldLabel:'应用名',
                    value:item.data.appDesc
                },{
                    fieldLabel:'应用类型',
                    value:(item.data.appType=='proxy')?'通用代理应用管理':'<font color="red">应用类型出错</font>'
                },{
                    fieldLabel:'启用状态',
                    value:showURL_isActive(item.data.isActive)
                },{
                    fieldLabel:'通过审批',
                    value:show_isAllow(item.data.isAllow)
                },{
                    fieldLabel:'启用内容过滤',
                    value:is_showURL(item.data.isFilter)
                },{
                    fieldLabel:'启用病毒扫描',
                    value:is_showURL(item.data.isVirusScan)
                },{
                    fieldLabel:'信息等级',value:show_InfoLevel(item.data.infoLevel)
                },{
                    fieldLabel:'IP/Mac过虑策略',
                    value:internal_allow_ipFilter_showURL(item.data.ipfilter)
                },{
                    fieldLabel:'应用服务地址',
                    value:item.data.t_serverAddress
                },{
                    fieldLabel:'应用服务端口',
                    value:item.data.t_port
                },{
                    fieldLabel:'最小连接数',
                    value:item.data.t_poolMin
                },{
                    fieldLabel:'最大连接数',
                    value:item.data.t_poolMax
                },{
                    fieldLabel:'编码',
                    value:item.data.t_charset
                },{
                    fieldLabel:'重试次数',
                    value:item.data.t_tryTime
                },{
                    fieldLabel:'类型',
                    value:item.data.t_type
                }]
            });
        });
    }
    var win = new Ext.Window({
        title:"详细信息-可信通用代理",
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
function internal_start_proxy(){
    var grid = Ext.getCmp('grid.proxy.internal.allow.info');
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
function internal_stop_proxy(){
    var grid = Ext.getCmp('grid.proxy.internal.allow.info');
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
    var grid = Ext.getCmp('grid.proxy.internal.info');
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
                                                Ext.getCmp('grid.proxy.internal.allow.info').render();
                                                Ext.getCmp('grid.proxy.internal.allow.info').getStore().reload();
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
                                                                    Ext.getCmp('grid.proxy.internal.allow.info').render();
                                                                    Ext.getCmp('grid.proxy.internal.allow.info').getStore().reload();
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
                                                Ext.getCmp('grid.proxy.internal.allow.info').render();
                                                Ext.getCmp('grid.proxy.internal.allow.info').getStore().reload();
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
    var grid = Ext.getCmp('grid.proxy.internal.info');
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
        {name:'reDesc',	mapping:'reDesc'},
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
        return "<a href='javascript:;' style='color: green;' onclick='check_update();'>批注</a>";
    }
}

/**
 * 可信可访问IP
 */
function internal_ipAddress(){
    var grid = Ext.getCmp('grid.proxy.internal.info');
    var selModel = grid.getSelectionModel();
    var appName;
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
            appName=item.data.appName;
        });
    }
    var start = 0;			//分页--开始数
    var pageSize = 5;		//分页--每页数
    var record = new Ext.data.Record.create([
        {name:'ip',mapping:'ip'},
        {name:'ipEnd',mapping:'ipEnd'},
        {name:'flag',mapping:'flag'}
    ]);
    var proxy = new Ext.data.HttpProxy({
        url:"../../ProxyIpAllowAction_select.action?typeXml=internal&type=proxy"
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
    var ip_old;
    var ip_edit = new Ext.form.TextField({
        id:'ip_edit.internal.info',
        regex:/^((((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\:)(6553[0-6]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{3}))$/,
        regexText:'这个不是Ip:Port',
        allowBlank : false,
        listeners:{
            focus:function(){
                ip_old = ip_edit.getValue();
            },
            blur:function(){
                var ip = ip_edit.getValue();
                if(ip!=''){
                    var myMask = new Ext.LoadMask(Ext.getBody(),{
                        msg : '正在校验,请稍后...',
                        removeMask : true
                    });
                    myMask.show();
                    Ext.Ajax.request({
                        url:'../../ProxyIpAllowAction_check.action',
                        method:'POST',
                        params:{ip:ip,typeXml:'internal',appName:appName},
                        success:function(r){
                            var json = Ext.decode(r.responseText);
                            myMask.hide();
                            if(json.msg != '0000'&&ip!=ip_old){
                                Ext.MessageBox.show({
                                    title:'信息',
                                    msg:json.msg,
                                    animEl:'ip_edit.internal.info',
                                    icon:Ext.MessageBox.WARNING,
                                    fn:function(e){
                                        if(e=='ok'){

                                        }
                                    }
                                });
                            }
                        }
                    });
                }
            }
        }
    });
    var ipEnd_old;
    var ipEnd_edit = new Ext.form.TextField({
        id:'ipEnd_edit.internal.info',
        regex:/^((((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\:)(6553[0-6]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{3}))$/,
        regexText:'这个不是Ip:Port',
        listeners:{
            focus:function(){
                ipEnd_old = ipEnd_edit.getValue();
            },
            blur:function(){
                var ipEnd = ipEnd_edit.getValue();
                if(ipEnd!=''){
                    var myMask = new Ext.LoadMask(Ext.getBody(),{
                        msg : '正在校验,请稍后...',
                        removeMask : true
                    });
                    myMask.show();
                    Ext.Ajax.request({
                        url:'../../ProxyIpAllowAction_check.action',
                        method:'POST',
                        params:{ip:ipEnd,typeXml:'internal',appName:appName},
                        success:function(r){
                            var json = Ext.decode(r.responseText);
                            myMask.hide();
                            if(json.msg != '0000'&&ipEnd!=ipEnd_old){
                                Ext.MessageBox.show({
                                    title:'信息',
                                    msg:json.msg,
                                    animEl:'ipEnd_edit.internal.info',
                                    icon:Ext.MessageBox.WARNING,
                                    fn:function(e){
                                        if(e=='ok'){

                                        }
                                    }
                                });
                            }
                        }
                    });
                }
            }
        }
    });
    var boxM = new Ext.grid.CheckboxSelectionModel();   //复选框
    var rowNumber = new Ext.grid.RowNumberer();         //自动 编号
    var colM = new Ext.grid.ColumnModel([
        boxM,
        rowNumber,
        {header:"IP",dataIndex:"ip",align:'center',editor:ip_edit},
        {header:"终止IP",dataIndex:"ipEnd",align:'center',editor:ipEnd_edit},
        {header:"操作标记",dataIndex:"flag",align:'center',renderer:internal_showURL_ip,width:50}

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
        tbar:[
            new Ext.Button({
                id:'btnAdd.ip.proxy.internal.info',
                text:'新增',
                iconCls:'add',
                handler:function(){
                    grid_ip.stopEditing();
                    grid_ip.getStore().insert(
                        0,
                        new record({
                            ip:'',
                            flag:'ip_flag'
                        })
                    );
                    grid_ip.startEditing(0,0);
                }
            }),
            {xtype:"tbseparator"},
			new Ext.Button ({
			    id : 'btnRemove.ip.proxy.internal.info',
                text : '删除',
				iconCls : 'remove',
				handler : function() {
					internal_delete_ip_proxy_row(grid_ip,store,appName);         //删除 表格 的 一 行 或多行
				}
            }),
            {xtype:"tbseparator"},
            new Ext.Button ({
                id : 'btnSave.ip.proxy.internal.info',
                text : '保存',
                iconCls : 'save',
                handler : function() {
                    internal_save_ip_proxy_row(grid_ip,store,appName);
                }
            })
        ],
        bbar:page_toolbar
    });
    var win = new Ext.Window({
        title:"IP管理-可信认证代理",
        width:440,
        height:300,
        layout:'fit',
        modal:true,
        items: [grid_ip]
    }).show();

    function internal_showURL_ip(value){
        return "<a href='javascript:;' style='color: green;' onclick='internal_update_ip(\""+appName+"\");'>修改</a>";
    }
}

function internal_save_ip_proxy_row(grid,store,appName){
    var selModel = grid.getSelectionModel();
    var count = selModel.getCount();
    if(count==0){
        Ext.MessageBox.show({
            title:'信息',
            msg:'您没有勾选任何记录!',
            animEl:'btnSave.ip.proxy.internal.info',
            width:200,
            buttons:{'ok':'确定'},
            icon:Ext.MessageBox.INFO,
            closable:false
        });
    }else if(count > 0){
        var arrayIp = new Array();
        var arrayIpEnd = new Array();
        var flag = true;
        var record = grid.getSelectionModel().getSelections();
        for(var i = 0; i < record.length; i++){
        	if(record[i].get('ip')==''){
        		flag = false;
        		break;
        	}
        	if(record[i].get('ipEnd')==undefined){
        		arrayIp[i] = record[i].get('ip');
        	}else{
        		arrayIp[i] = record[i].get('ip')+'-'+record[i].get('ipEnd');
        	}
        }
        if(flag){
        	Ext.MessageBox.show({
        		title:'信息',
        		msg:'确定要保存所选的所有记录？',
        		animEl:'btnSave.ip.proxy.internal.info',
        		width:260,
        		buttons:{'ok':'确定','no':'取消'},
        		icon:Ext.MessageBox.WARNING,
        		closable:false,
        		fn:function(e){
        			if(e=='ok'){
                        var myMask = new Ext.LoadMask(Ext.getBody(),{
                            msg : '正在保存,请稍后...',
                            removeMask : true
                        });
                        myMask.show();
        				Ext.Ajax.request({
        					url : '../../ProxyIpAllowAction_insert.action',    // 删除 连接 到后台
        					params :{ arrayIp : arrayIp,typeXml : 'internal',appName:appName },
        					success : function(form,action){
        						var json = Ext.util.JSON.decode(form.responseText);
                                myMask.hide();
        						Ext.MessageBox.show({
        							title:'信息',
        							msg:json.msg,
        							animEl:'btnSave.ip.proxy.internal.info',
        							width:250,
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
        }else{
        	Ext.MessageBox.show({
        		title:'信息',
        		msg:'您没有输入起始IP!',
        		animEl:'btnSave.ip.proxy.internal.info',
        		width:200,
        		buttons:{'ok':'确定'},
        		icon:Ext.MessageBox.INFO,
        		closable:false
        	});
        }
        
    }
}

function internal_delete_ip_proxy_row(grid,store,appName){
    var selModel = grid.getSelectionModel();
    var count = selModel.getCount();
    if(count==0){
        Ext.MessageBox.show({
            title:'信息',
            msg:'您没有勾选任何记录!',
            animEl:'btnRemove.ip.proxy.internal.info',
            width:200,
            buttons:{'ok':'确定'},
            icon:Ext.MessageBox.INFO,
            closable:false
        });
    }else if(count > 0){
        var array = new Array();
        var record = grid.getSelectionModel().getSelections();
        for(var i = 0; i < record.length; i++){
        	if(record[i].get('ipEnd')==''){
        		array[i] = record[i].get('ip');
        	}else{
        		array[i] = record[i].get('ip')+'-'+record[i].get('ipEnd');
        	}
        }
        Ext.MessageBox.show({
            title:'信息',
            msg:'确定要删除所选记录？',
            animEl:'btnRemove.ip.proxy.internal.info',
            width:260,
            buttons:{'ok':'确定','no':'取消'},
            icon:Ext.MessageBox.QUESTION,
            closable:false,
            fn:function(e){
                if(e == 'ok'){
                    var myMask = new Ext.LoadMask(Ext.getBody(),{
                        msg : '正在删除,请稍后...',
                        removeMask : true
                    });
                    myMask.show();
                    Ext.Ajax.request({
                        url : '../../ProxyIpAllowAction_delete.action',    // 删除 连接 到后台
                        params :{ array : array,typeXml : 'internal',appName:appName },
                        success : function(r,o){
                            var respText = Ext.util.JSON.decode(r.responseText);
                            var msg = respText.msg;
                            myMask.hide();
                            Ext.MessageBox.show({
                                title:'信息',
                                msg:msg,
                                animEl:'btnRemove.ip.proxy.internal.info',
                                width:250,
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

function internal_update_ip(appName){
    var grid = Ext.getCmp('grid.ip.proxy.internal.info');
    var store = Ext.getCmp('grid.ip.proxy.internal.info').getStore();
    var selModel = grid.getSelectionModel();
    var formPanel;
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
            formPanel = new Ext.form.FormPanel({
                defaultType : 'textfield',
                labelWidth:80,
                frame:true,
                loadMask : { msg : '正在加载数据，请稍后.....' },
                height : 100,
                labelAlign:'right',
                defaults : {
                    width : 150
                },
				items : [
                    {                     //
                        id:'internal.ip.update.info',
                        fieldLabel:"IP",
                        name:'ip',
                        value:item.data.ip,
                        allowBlank : false,
                        blankText : '该项不能为空！',
                        regex:/^((((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\:)(6553[0-6]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{3}))$/,
                        regexText:'这个不是Ip:Port',
                        emptyText:'请输入Ip:Port',
                        listeners:{
                           blur:function(){
                               var ip = this.getValue();
                               var ipHidden = Ext.getCmp('internal.hidden.ip.update.info').getValue();
                               if(ip!=''&&ip!=ipHidden){
                                   var myMask = new Ext.LoadMask(Ext.getBody(),{
                                        msg : '正在校验,请稍后...',
                                        removeMask : true
                                    });
                                    myMask.show();
                                   Ext.Ajax.request({
                                       url:'../../ProxyIpAllowAction_check.action',
                                       method:'POST',
                                       params:{ip:ip,typeXml:'internal',appName:appName},
                                       success:function(r,o){
                                           var json = Ext.decode(r.responseText);
                                           myMask.hide();
                                           if(json.msg != '0000'){
                                               Ext.MessageBox.show({
                                                   title:'信息',
                                                   msg:json.msg,
                                                   animEl:'internal.ip.update.info',
                                                   icon:Ext.MessageBox.WARNING,
                                                   fn:function(e){
                                                       if(e=='ok'){
                                                           Ext.getCmp('internal.ip.update.info').setValue('');
                                                       }
                                                   }
                                               });
                                           }
                                       }
                                   });
                               }
                           }
                        }
                    },
                    {
                        id:'internal.hidden.ip.update.info',
                        xtype:'hidden',name:'oldIp',value:item.data.ip
                    },
                    {                     //
                        id:'internal.ipEnd.update.info',
                        fieldLabel:"终止IP",
                        name:'ipEnd',
                        value:item.data.ipEnd,
                        regex:/^((((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\:)(6553[0-6]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{3}))$/,
                        regexText:'这个不是Ip:Port',
                        emptyText:'请输入Ip:Port',
                        listeners:{
                           blur:function(){
                               var ip = this.getValue();
                               var ipHidden = Ext.getCmp('internal.hidden.ipEnd.update.info').getValue();
                               if(ip!=''&&ip!=ipHidden){
                                   var myMask = new Ext.LoadMask(Ext.getBody(),{
                                        msg : '正在校验,请稍后...',
                                        removeMask : true
                                    });
                                    myMask.show();
                                   Ext.Ajax.request({
                                       url:'../../ProxyIpAllowAction_check.action',
                                       method:'POST',
                                       params:{ip:ip,typeXml:'internal',appName:appName},
                                       success:function(r,o){
                                           var json = Ext.decode(r.responseText);
                                           myMask.hide();
                                           if(json.msg != '0000'){
                                               Ext.MessageBox.show({
                                                   title:'信息',
                                                   msg:json.msg,
                                                   animEl:'internal.ipEnd.update.info',
                                                   icon:Ext.MessageBox.WARNING,
                                                   fn:function(e){
                                                       if(e=='ok'){
                                                           Ext.getCmp('internal.ipEnd.update.info').setValue('');
                                                       }
                                                   }
                                               });
                                           }
                                       }
                                   });
                               }
                           }
                        }
                    },{
                    	id:'internal.hidden.ipEnd.update.info',
                        xtype:'hidden',name:'oldIpEnd',value:item.data.ipEnd
                    },{
                        xtype:'hidden',name:'typeXml',value:'internal'
                    },{
                        xtype:'hidden',name:'appName',value:appName
                    }
                ]
            });
        });
    }
    var win = new Ext.Window({
        title:"修改信息-IP",
        width:280,
        height:120,
        layout:'fit',modal:true,
        items: [formPanel],
        bbar:[
            new Ext.Toolbar.Fill(),
            new Ext.Button ({
                id:'internal.ip.update.win.info',
                text : '修改',
                formBind:true,
                allowDepress : false,
                handler : function() {
                    Ext.MessageBox.show({
                        title:'请确认',
                        msg:'真的要修改以上内容?',
                        animEl:'internal.ip.update.win.info',
                        buttons:{'ok':'确定','no':'取消'},
                        icon:Ext.Msg.WARNING,
                        fn:function(e){
                            if(e=="ok"){
                                if (formPanel.form.isValid()) {
                                    formPanel.getForm().submit({
                                        url :'../../ProxyIpAllowAction_update.action',
                                        method :'POST',
                                        waitTitle :'系统提示',
                                        waitMsg :'正在修改,请稍后...',
                                        success : function(form,action) {
                                            Ext.MessageBox.show({
                                                title:'信息',
                                                msg:action.msg,
                                                animEl:'internal.ip.update.win.info',
                                                buttons:{'ok':'确定','no':'取消'},
                                                icon:Ext.MessageBox.INFO,
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
                                    Ext.Msg.alert('信息', '请填写完成再提交!');
                                    Ext.MessageBox.show({
                                        title:'信息',
                                        msg:'请填写完成再提交',
                                        animEl:'internal.ip.update.win.info',
                                        icon:Ext.MessageBox.INFO,
                                        buttons:{'ok':'确定'}
                                    });
                                }
                            }else if(e=='no'){
                                win.close();
                            }
                        }
                    });
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
 * 可信可访问IP--ALLOW
 */
function internal_allow_ipAddress(){
    var grid = Ext.getCmp('grid.proxy.internal.allow.info');
    var _store = grid.getStore();
    var selModel = grid.getSelectionModel();
    var appName;
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
            appName=item.data.appName;
        });
    }
    var start = 0;			//分页--开始数
    var pageSize = 5;		//分页--每页数
    var record = new Ext.data.Record.create([
        {name:'ip',mapping:'ip'},
        {name:'ipEnd',mapping:'ipEnd'},
        {name:'flag',mapping:'flag'}
    ]);
    var proxy = new Ext.data.HttpProxy({
        url:"../../ProxyIpAllowAction_select.action?typeXml=internal&type=proxy"
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
    var ip_old;
    var ip_edit = new Ext.form.TextField({
        id:'ip_edit.internal.info',
        regex:/^((((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\:)(6553[0-6]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{3}))$/,
        regexText:'这个不是Ip:Port',
        allowBlank : false,
        listeners:{
            focus:function(){
                ip_old = ip_edit.getValue();
            },
            blur:function(){
                var ip = ip_edit.getValue();
                if(ip!=''){
                    var myMask = new Ext.LoadMask(Ext.getBody(),{
                        msg : '正在校验,请稍后...',
                        removeMask : true
                    });
                    myMask.show();
                    Ext.Ajax.request({
                        url:'../../ProxyIpAllowAction_check.action',
                        method:'POST',
                        params:{ip:ip,typeXml:'internal',appName:appName},
                        success:function(r){
                            var json = Ext.decode(r.responseText);
                            myMask.hide();
                            if(json.msg != '0000'&&ip!=ip_old){
                                Ext.MessageBox.show({
                                    title:'信息',
                                    msg:json.msg,
                                    animEl:'ip_edit.internal.info',
                                    icon:Ext.MessageBox.WARNING,
                                    fn:function(e){
                                        if(e=='ok'){

                                        }
                                    }
                                });
                            }
                        }
                    });
                }
            }
        }
    });
    var ipEnd_old;
    var ipEnd_edit = new Ext.form.TextField({
        id:'ipEnd_edit.internal.info',
        regex:/^((((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\:)(6553[0-6]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{3}))$/,
        regexText:'这个不是Ip:Port',
        listeners:{
            focus:function(){
                ipEnd_old = ipEnd_edit.getValue();
            },
            blur:function(){
                var ipEnd = ipEnd_edit.getValue();
                if(ipEnd!=''){
                    var myMask = new Ext.LoadMask(Ext.getBody(),{
                        msg : '正在校验,请稍后...',
                        removeMask : true
                    });
                    myMask.show();
                    Ext.Ajax.request({
                        url:'../../ProxyIpAllowAction_check.action',
                        method:'POST',
                        params:{ip:ipEnd,typeXml:'internal',appName:appName},
                        success:function(r){
                            var json = Ext.decode(r.responseText);
                            myMask.hide();
                            if(json.msg != '0000'&&ipEnd!=ipEnd_old){
                                Ext.MessageBox.show({
                                    title:'信息',
                                    msg:json.msg,
                                    animEl:'ipEnd_edit.internal.info',
                                    icon:Ext.MessageBox.WARNING,
                                    fn:function(e){
                                        if(e=='ok'){

                                        }
                                    }
                                });
                            }
                        }
                    });
                }
            }
        }
    });
    var boxM = new Ext.grid.CheckboxSelectionModel();   //复选框
    var rowNumber = new Ext.grid.RowNumberer();         //自动 编号
    var colM = new Ext.grid.ColumnModel([
        boxM,
        rowNumber,
        {header:"IP",dataIndex:"ip",align:'center',editor:ip_edit},
        {header:"终止IP",dataIndex:"ipEnd",align:'center',editor:ipEnd_edit},
        {header:"操作标记",dataIndex:"flag",align:'center',renderer:internal_showURL_ip,width:50}

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
        id:'grid.ip.proxy.internal.allow.info',
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
        tbar:[
            new Ext.Button({
                id:'btnAdd.ip.proxy.internal.info',
                text:'新增',
                iconCls:'add',
                handler:function(){
                    grid_ip.stopEditing();
                    grid_ip.getStore().insert(
                        0,
                        new record({
                            ip:'',
                            flag:'ip_flag'
                        })
                    );
                    grid_ip.startEditing(0,0);
                }
            }),
            {xtype:"tbseparator"},
			new Ext.Button ({
			    id : 'btnRemove.ip.proxy.internal.info',
                text : '删除',
				iconCls : 'remove',
				handler : function() {
					internal_allow_delete_ip_proxy_row(grid_ip,store,appName);         //删除 表格 的 一 行 或多行
				}
            }),
            {xtype:"tbseparator"},
            new Ext.Button ({
                id : 'btnSave.ip.proxy.internal.info',
                text : '保存',
                iconCls : 'save',
                handler : function() {
                    internal_allow_save_ip_proxy_row(grid_ip,store,appName);
                }
            })
        ],
        bbar:page_toolbar
    });
    var win = new Ext.Window({
        title:"IP管理-可信认证代理",
        width:440,
        height:300,
        layout:'fit',
        modal:true,
        listeners:{
            close:function(){
                grid.render();
                _store.reload();
                Ext.getCmp('grid.proxy.internal.info').render();
                Ext.getCmp('grid.proxy.internal.info').getStore().reload();
            }
        },
        items: [grid_ip]
    }).show();

    function internal_showURL_ip(value){
        return "<a href='javascript:;' style='color: green;' onclick='internal_allow_update_ip(\""+appName+"\");'>修改</a>";
    }
}

function internal_allow_save_ip_proxy_row(grid,store,appName){
    var selModel = grid.getSelectionModel();
    var count = selModel.getCount();
    if(count==0){
        Ext.MessageBox.show({
            title:'信息',
            msg:'您没有勾选任何记录!',
            animEl:'btnSave.ip.proxy.internal.info',
            width:200,
            buttons:{'ok':'确定'},
            icon:Ext.MessageBox.INFO,
            closable:false
        });
    }else if(count > 0){
        var arrayIp = new Array();
        var arrayIpEnd = new Array();
        var flag = true;
        var record = grid.getSelectionModel().getSelections();
        for(var i = 0; i < record.length; i++){
        	if(record[i].get('ip')==''){
        		flag = false;
        		break;
        	}
        	if(record[i].get('ipEnd')==undefined){
        		arrayIp[i] = record[i].get('ip');
        	}else{
        		arrayIp[i] = record[i].get('ip')+'-'+record[i].get('ipEnd');
        	}
        }
        if(flag){
        	Ext.MessageBox.show({
        		title:'信息',
        		msg:'确定要保存所选的所有记录？',
        		animEl:'btnSave.ip.proxy.internal.info',
        		width:260,
        		buttons:{'ok':'确定','no':'取消'},
        		icon:Ext.MessageBox.WARNING,
        		closable:false,
        		fn:function(e){
        			if(e=='ok'){
                        var myMask = new Ext.LoadMask(Ext.getBody(),{
                            msg : '正在保存,请稍后...',
                            removeMask : true
                        });
                        myMask.show();
        				Ext.Ajax.request({
        					url : '../../ProxyIpAllowAction_insert.action',    // 删除 连接 到后台
        					params :{ arrayIp : arrayIp,typeXml : 'internal',appName:appName },
        					success : function(form,action){
        						var json = Ext.util.JSON.decode(form.responseText);
                                myMask.hide();
        						Ext.MessageBox.show({
        							title:'信息',
        							msg:json.msg,
        							animEl:'btnSave.ip.proxy.internal.info',
        							width:250,
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
        }else{
        	Ext.MessageBox.show({
        		title:'信息',
        		msg:'您没有输入起始IP!',
        		animEl:'btnSave.ip.proxy.internal.info',
        		width:200,
        		buttons:{'ok':'确定'},
        		icon:Ext.MessageBox.INFO,
        		closable:false
        	});
        }

    }
}

function internal_allow_delete_ip_proxy_row(grid,store,appName){
    var selModel = grid.getSelectionModel();
    var count = selModel.getCount();
    if(count==0){
        Ext.MessageBox.show({
            title:'信息',
            msg:'您没有勾选任何记录!',
            animEl:'btnRemove.ip.proxy.internal.info',
            width:200,
            buttons:{'ok':'确定'},
            icon:Ext.MessageBox.INFO,
            closable:false
        });
    }else if(count > 0){
        var array = new Array();
        var record = grid.getSelectionModel().getSelections();
        for(var i = 0; i < record.length; i++){
        	if(record[i].get('ipEnd')==''){
        		array[i] = record[i].get('ip');
        	}else{
        		array[i] = record[i].get('ip')+'-'+record[i].get('ipEnd');
        	}
        }
        Ext.MessageBox.show({
            title:'信息',
            msg:'确定要删除所选记录？',
            animEl:'btnRemove.ip.proxy.internal.info',
            width:260,
            buttons:{'ok':'确定','no':'取消'},
            icon:Ext.MessageBox.QUESTION,
            closable:false,
            fn:function(e){
                if(e == 'ok'){
                    var myMask = new Ext.LoadMask(Ext.getBody(),{
                        msg : '正在删除,请稍后...',
                        removeMask : true
                    });
                    myMask.show();
                    Ext.Ajax.request({
                        url : '../../ProxyIpAllowAction_delete.action',    // 删除 连接 到后台
                        params :{ array : array,typeXml : 'internal',appName:appName },
                        success : function(r,o){
                            var respText = Ext.util.JSON.decode(r.responseText);
                            var msg = respText.msg;
                            myMask.hide();
                            Ext.MessageBox.show({
                                title:'信息',
                                msg:msg,
                                animEl:'btnRemove.ip.proxy.internal.info',
                                width:250,
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

function internal_allow_update_ip(appName){
    var grid = Ext.getCmp('grid.ip.proxy.internal.allow.info');
    var store = grid.getStore();
    var selModel = grid.getSelectionModel();
    var formPanel;
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
            formPanel = new Ext.form.FormPanel({
                defaultType : 'textfield',
                labelWidth:80,
                frame:true,
                loadMask : { msg : '正在加载数据，请稍后.....' },
                height : 100,
                labelAlign:'right',
                defaults : {
                    width : 150
                },
				items : [
                    {                     //
                        id:'internal.ip.update.info',
                        fieldLabel:"IP",
                        name:'ip',
                        value:item.data.ip,
                        allowBlank : false,
                        blankText : '该项不能为空！',
                        regex:/^((((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\:)(6553[0-6]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{3}))$/,
                        regexText:'这个不是Ip:Port',
                        emptyText:'请输入Ip:Port',
                        listeners:{
                           blur:function(){
                               var ip = this.getValue();
                               var ipHidden = Ext.getCmp('internal.hidden.ip.update.info').getValue();
                               if(ip!=''&&ip!=ipHidden){
                                   var myMask = new Ext.LoadMask(Ext.getBody(),{
                                        msg : '正在校验,请稍后...',
                                        removeMask : true
                                    });
                                    myMask.show();
                                   Ext.Ajax.request({
                                       url:'../../ProxyIpAllowAction_check.action',
                                       method:'POST',
                                       params:{ip:ip,typeXml:'internal',appName:appName},
                                       success:function(r,o){
                                           var json = Ext.decode(r.responseText);
                                           myMask.hide();
                                           if(json.msg != '0000'){
                                               Ext.MessageBox.show({
                                                   title:'信息',
                                                   msg:json.msg,
                                                   animEl:'internal.ip.update.info',
                                                   icon:Ext.MessageBox.WARNING,
                                                   fn:function(e){
                                                       if(e=='ok'){
                                                           Ext.getCmp('internal.ip.update.info').setValue('');
                                                       }
                                                   }
                                               });
                                           }
                                       }
                                   });
                               }
                           }
                        }
                    },
                    {
                        id:'internal.hidden.ip.update.info',
                        xtype:'hidden',name:'oldIp',value:item.data.ip
                    },
                    {                     //
                        id:'internal.ipEnd.update.info',
                        fieldLabel:"终止IP",
                        name:'ipEnd',
                        value:item.data.ipEnd,
                        regex:/^((((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\:)(6553[0-6]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{3}))$/,
                        regexText:'这个不是Ip:Port',
                        emptyText:'请输入Ip:Port',
                        listeners:{
                           blur:function(){
                               var ip = this.getValue();
                               var ipHidden = Ext.getCmp('internal.hidden.ipEnd.update.info').getValue();
                               if(ip!=''&&ip!=ipHidden){
                                   var myMask = new Ext.LoadMask(Ext.getBody(),{
                                        msg : '正在校验,请稍后...',
                                        removeMask : true
                                    });
                                    myMask.show();
                                   Ext.Ajax.request({
                                       url:'../../ProxyIpAllowAction_check.action',
                                       method:'POST',
                                       params:{ip:ip,typeXml:'internal',appName:appName},
                                       success:function(r,o){
                                           var json = Ext.decode(r.responseText);
                                           myMask.hide();
                                           if(json.msg != '0000'){
                                               Ext.MessageBox.show({
                                                   title:'信息',
                                                   msg:json.msg,
                                                   animEl:'internal.ipEnd.update.info',
                                                   icon:Ext.MessageBox.WARNING,
                                                   fn:function(e){
                                                       if(e=='ok'){
                                                           Ext.getCmp('internal.ipEnd.update.info').setValue('');
                                                       }
                                                   }
                                               });
                                           }
                                       }
                                   });
                               }
                           }
                        }
                    },{
                    	id:'internal.hidden.ipEnd.update.info',
                        xtype:'hidden',name:'oldIpEnd',value:item.data.ipEnd
                    },{
                        xtype:'hidden',name:'typeXml',value:'internal'
                    },{
                        xtype:'hidden',name:'appName',value:appName
                    }
                ]
            });
        });
    }
    var win = new Ext.Window({
        title:"修改信息-IP",
        width:280,
        height:120,
        layout:'fit',modal:true,
        items: [formPanel],
        bbar:[
            new Ext.Toolbar.Fill(),
            new Ext.Button ({
                id:'internal.ip.update.win.info',
                text : '修改',
                formBind:true,
                allowDepress : false,
                handler : function() {
                    Ext.MessageBox.show({
                        title:'请确认',
                        msg:'真的要修改以上内容?',
                        animEl:'internal.ip.update.win.info',
                        buttons:{'ok':'确定','no':'取消'},
                        icon:Ext.Msg.WARNING,
                        fn:function(e){
                            if(e=="ok"){
                                if (formPanel.form.isValid()) {
                                    formPanel.getForm().submit({
                                        url :'../../ProxyIpAllowAction_update.action',
                                        method :'POST',
                                        waitTitle :'系统提示',
                                        waitMsg :'正在修改,请稍后...',
                                        success : function(form,action) {
                                            Ext.MessageBox.show({
                                                title:'信息',
                                                msg:action.msg,
                                                animEl:'internal.ip.update.win.info',
                                                buttons:{'ok':'确定','no':'取消'},
                                                icon:Ext.MessageBox.INFO,
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
                                    Ext.Msg.alert('信息', '请填写完成再提交!');
                                    Ext.MessageBox.show({
                                        title:'信息',
                                        msg:'请填写完成再提交',
                                        animEl:'internal.ip.update.win.info',
                                        icon:Ext.MessageBox.INFO,
                                        buttons:{'ok':'确定'}
                                    });
                                }
                            }else if(e=='no'){
                                win.close();
                            }
                        }
                    });
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
 * 可信端黑名单
 */
function internal_ipBlackWindow(){
    var grid = Ext.getCmp('grid.proxy.internal.info');
    var selModel = grid.getSelectionModel();
    var appName;
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
            appName=item.data.appName;
        });
    }
    var start = 0;			//分页--开始数
    var pageSize = 5;		//分页--每页数
    var record = new Ext.data.Record.create([
        {name:'ip',mapping:'ip'},
        {name:'mac',mapping:'mac'},
        {name:'flag',mapping:'flag'}
    ]);
    var proxy = new Ext.data.HttpProxy({
        url:"ProxyIpMacAction_readIpMac.action?typeXml=internal&proxyType=proxy&ipMacType=black"
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
    var ip_old;
    var ip_edit = new Ext.form.TextField({
        id:'ip_edit.internal.info',
        regex:/^(((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9]))$/,
        regexText:'这个不是Ip',
        listeners:{
            focus:function(){
                ip_old = ip_edit.getValue();
            },
            blur:function(){
                var ip = ip_edit.getValue();
                Ext.Ajax.request({
                    url:'ProxyIpMacAction_checkIp.action?typeXml=internal&type=proxy&ipMacType=black',
                    method:'POST',
                    params:{ip:ip,appName:appName},
                    success:function(r,o){
                        var json = Ext.decode(r.responseText);
                        if(json.msg != '0000'&&ip!=ip_old){
                            Ext.MessageBox.show({
                                title:'信息',
                                msg:json.msg,
                                animEl:'ip_edit.internal.info',
                                icon:Ext.MessageBox.WARNING,
                                fn:function(e){
                                    if(e=='ok'){

                                    }
                                }
                            });
                        }
                    }
                });
            }
        }
    });
    var mac_edit = new Ext.form.TextField({
        regex:/^(([0-9a-fA-F]{2}\-){5}[0-9a-fA-F]{2})$/,
        regexText:'这个不是mac地址:0a-45-be-e6-00-aa'
    });
    var boxM = new Ext.grid.CheckboxSelectionModel();   //复选框
    var rowNumber = new Ext.grid.RowNumberer();         //自动 编号
    var colM = new Ext.grid.ColumnModel([
        boxM,
        rowNumber,
        {header:"IP",dataIndex:"ip",align:'center',editor:ip_edit},
        {header:"Mac",dataIndex:"mac",align:'center',editor:mac_edit},
        {header:"操作标记",dataIndex:"flag",align:'center',renderer:internal_showURL_ip,width:50}

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
        tbar:[
            new Ext.Button({
                id:'btnAdd.ip.proxy.internal.info',
                text:'新增',
                iconCls:'add',
                handler:function(){
                    grid_ip.stopEditing();
                    grid_ip.getStore().insert(
                        0,
                        new record({
                            ip:'',
                            flag:'ip_flag'
                        })
                    );
                    grid_ip.startEditing(0,0);
                }
            }),
            {xtype:"tbseparator"},
			new Ext.Button ({
			    id : 'btnRemove.ip.proxy.internal.info',
                text : '删除',
				iconCls : 'remove',
				handler : function() {
					internal_delete_ipMac_black_proxy_row(grid_ip,store,appName);         //删除 表格 的 一 行 或多行
				}
            }),
            {xtype:"tbseparator"},
            new Ext.Button ({
                id : 'btnSave.ip.proxy.internal.info',
                text : '保存',
                iconCls : 'save',
                handler : function() {
                    internal_save_ipMac_black_proxy_row(grid_ip,store,appName);
                }
            })
        ],
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

    function internal_showURL_ip(value){
        return "<a href='javascript:;' style='color: green;' onclick='internal_update_ipMac_black_proxy_win(\""+appName+"\");'>修改信息</a>";
    }
}

function internal_save_ipMac_black_proxy_row(grid,store,appName){
    var selModel = grid.getSelectionModel();
    var count = selModel.getCount();
    if(count==0){
        Ext.MessageBox.show({
            title:'信息',
            msg:'您没有勾选任何记录!',
            animEl:'btnSave.ip.proxy.internal.info',
            width:250,
            buttons:{'ok':'确定'},
            icon:Ext.MessageBox.WARNING,
            closable:false
        });
    }else if(count > 0){
        var arrayIp = new Array();
        var arrayMac = new Array();
        var record = grid.getSelectionModel().getSelections();
        for(var i = 0; i < record.length; i++){
            arrayIp[i] = record[i].get('ip');
            arrayMac[i] = record[i].get('mac');
        }
        Ext.MessageBox.show({
            title:'信息',
            msg:'确定要保存所选的所有记录？',
            animEl:'btnSave.ip.proxy.internal.info',
            width:300,
            buttons:{'ok':'确定','no':'取消'},
            icon:Ext.MessageBox.WARNING,
            closable:false,
            fn:function(e){
                if(e=='ok'){
                    var myMask = new Ext.LoadMask(Ext.getBody(),{
                        msg:'正在处理,请稍后...',
                        removeMask:true
                    });
                    myMask.show();
                    Ext.Ajax.request({
                        url : 'ProxyIpMacAction_saveIpMac.action?typeXml=internal&type=proxy&ipMacType=black',
                        method:'POST',
                        params :{ arrayIp : arrayIp,arrayMac:arrayMac,appName:appName },
                        success : function(r,o){
                            myMask.hide();
                            var json = Ext.decode(r.responseText);
                            Ext.MessageBox.show({
                                title:'信息',
                                msg:json.msg,
                                animEl:'btnSave.ip.proxy.internal.info',
                                width:200,
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

function internal_delete_ipMac_black_proxy_row(grid,store,appName){
    var selModel = grid.getSelectionModel();
    var count = selModel.getCount();
    if(count==0){
        Ext.MessageBox.show({
            title:'信息',
            msg:'您没有勾选任何记录!',
            animEl:'btnRemove.ip.proxy.internal.info',
            width:250,
            buttons:{'ok':'确定'},
            icon:Ext.MessageBox.WARNING,
            closable:false
        });
    }else if(count > 0){
        var arrayIp = new Array();
        var arrayMac = new Array();
        var record = grid.getSelectionModel().getSelections();
        for(var i = 0; i < record.length; i++){
            arrayIp[i] = record[i].get('ip');
            arrayMac[i] = record[i].get('mac');
        }
        Ext.MessageBox.show({
            title:'信息',
            msg:'确定要删除所选的所有记录？',
            animEl:'btnRemove.ip.proxy.internal.info',
            width:300,
            buttons:{'ok':'确定','no':'取消'},
            icon:Ext.MessageBox.WARNING,
            closable:false,
            fn:function(e){
                if(e=='ok'){
                    var myMask = new Ext.LoadMask(Ext.getBody(),{
                        msg:'正在处理,请稍后...',
                        removeMask:true
                    });
                    myMask.show();
                    Ext.Ajax.request({
                        url : 'ProxyIpMacAction_deleteIpMac.action?typeXml=internal&type=proxy&ipMacType=black',
                        method:'POST',
                        params :{ arrayIp : arrayIp,arrayMac:arrayMac,appName:appName },
                        success : function(r,o){
                            myMask.hide();
                            var json = Ext.decode(r.responseText);
                            Ext.MessageBox.show({
                                title:'信息',
                                msg:json.msg,
                                animEl:'btnRemove.ip.proxy.internal.info',
                                width:200,
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

function internal_update_ipMac_black_proxy_win(appName){
    var grid = Ext.getCmp('grid.ip.proxy.internal.info');
    var store = grid.getStore();
    var selModel = grid.getSelectionModel();
    var formPanel;
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
            formPanel = new Ext.form.FormPanel({
                defaultType : 'textfield',
                labelWidth:80,
                frame:true,
                loadMask : { msg : '正在加载数据，请稍后.....' },
                height : 100,
                labelAlign:'right',
                defaults : {
                    width : 130,
                    allowBlank : false,
                    blankText : '该项不能为空！'
                },
                items : [{
                        id:'innerBlackIp.update.info',
                        fieldLabel:"黑名单IP",
                        name:'ipMac.ip',
                        value:item.data.ip,
                        regex:/^(((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9]))$/,
                        regexText:'这个不是Ip',
                        emptyText:'请输入Ip',
                        listeners:{
                            blur:function(){
                                var ip = this.getValue();
                                var ipHidden = Ext.getCmp('innerBlackIpHidden.update.info').getValue();
                                if(ip!=ipHidden){
                                    var myMask = new Ext.LoadMask(Ext.getBody(),{
                                        msg:'正在处理,请稍后...',
                                        removeMask:true
                                    });
                                    myMask.show();
                                    Ext.Ajax.request({
                                        url:'ProxyIpMacAction_checkIp.action?typeXml=internal&type=proxy&ipMacType=black',
                                        method:'POST',
                                        params:{ip:ip,appName:appName},
                                        success:function(action){
                                            myMask.hide();
                                            var json = Ext.decode(action.responseText);
                                            if(json.msg != '0000'){
                                                Ext.MessageBox.show({
                                                    title:'信息',
                                                    width:250,
                                                    msg:json.msg,
                                                    animEl:'innerBlackIp.update.info',
                                                    icon:Ext.MessageBox.WARNING,
                                                    fn:function(e){
                                                        if(e=='ok'){
                                                            Ext.getCmp('innerBlackIp.update.info').setValue('');
                                                        }
                                                    }
                                                });
                                            }
                                        }
                                    });
                                }
                            }
                        }
                    },{
                        id:'innerBlackIpHidden.update.info',
                        xtype:'hidden',name:'oldUpdateIp',value:item.data.ip
                    },{                     //
                        fieldLabel:"黑名单Mac",
                        name:'ipMac.mac',
                        value:item.data.mac,
                        regex:/^(([0-9a-fA-F]{2}\-){5}[0-9a-fA-F]{2})$/,
                        regexText:'这个不是mac地址:0a-45-be-e6-00-aa',
                        emptyText:'请输入mac地址'
                    }
                ]
            });
        });
    }
    var win = new Ext.Window({
        title:"黑名单-修改信息",
        width:270,
        height:120,
        layout:'fit',modal:true,
        items: [formPanel],
        bbar:[
            new Ext.Toolbar.Fill(),
            new Ext.Button ({
                id:'innerBlackIp.updateWin.info',
                text : '修改',
                formBind:true,
                allowDepress : false,
                handler : function() {
                    Ext.MessageBox.show({
                        title:'请确认',
                        width:250,
                        msg:'真的要修改以上内容?',
                        buttons:{'ok':'确定','no':'取消'},
                        icon:Ext.Msg.WARNING,
                        fn:function(e){
                            if(e=="ok"){
                                if (formPanel.form.isValid()) {
                                    formPanel.getForm().submit({
                                        url :'ProxyIpMacAction_updateIpMac.action?typeXml=internal&type=proxy&ipMacType=black',
                                        method :'POST',
                                        params:{appName:appName},
                                        waitTitle :'系统提示',
                                        waitMsg :'正在保存...',
                                        success : function(form,action) {
                                            Ext.MessageBox.show({
                                                title:'信息',
                                                width:250,
                                                msg:action.result.msg,
                                                animEl:'innerBlackIp.updateWin.info',
                                                icon:Ext.MessageBox.WARNING,
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
                                    Ext.Msg.alert('信息', '请填写完成再提交!');
                                }
                            }else if(e=='no'){
                                win.close();
                            }
                        }
                    });
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
 * 可信端黑名单--ALLOW
 */
function internal_allow_ipBlackWindow(){
    var grid = Ext.getCmp('grid.proxy.internal.allow.info');
    var _store = grid.getStore();
    var selModel = grid.getSelectionModel();
    var appName;
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
            appName=item.data.appName;
        });
    }
    var start = 0;			//分页--开始数
    var pageSize = 5;		//分页--每页数
    var record = new Ext.data.Record.create([
        {name:'ip',mapping:'ip'},
        {name:'mac',mapping:'mac'},
        {name:'flag',mapping:'flag'}
    ]);
    var proxy = new Ext.data.HttpProxy({
        url:"ProxyIpMacAction_readIpMac.action?typeXml=internal&proxyType=proxy&ipMacType=black"
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
    var ip_old;
    var ip_edit = new Ext.form.TextField({
        id:'ip_edit.internal.info',
        regex:/^(((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9]))$/,
        regexText:'这个不是Ip',
        listeners:{
            focus:function(){
                ip_old = ip_edit.getValue();
            },
            blur:function(){
                var ip = ip_edit.getValue();
                Ext.Ajax.request({
                    url:'ProxyIpMacAction_checkIp.action?typeXml=internal&type=proxy&ipMacType=black',
                    method:'POST',
                    params:{ip:ip,appName:appName},
                    success:function(r,o){
                        var json = Ext.decode(r.responseText);
                        if(json.msg != '0000'&&ip!=ip_old){
                            Ext.MessageBox.show({
                                title:'信息',
                                msg:json.msg,
                                animEl:'ip_edit.internal.info',
                                icon:Ext.MessageBox.WARNING,
                                fn:function(e){
                                    if(e=='ok'){

                                    }
                                }
                            });
                        }
                    }
                });
            }
        }
    });
    var mac_edit = new Ext.form.TextField({
        regex:/^(([0-9a-fA-F]{2}\-){5}[0-9a-fA-F]{2})$/,
        regexText:'这个不是mac地址:0a-45-be-e6-00-aa'
    });
    var boxM = new Ext.grid.CheckboxSelectionModel();   //复选框
    var rowNumber = new Ext.grid.RowNumberer();         //自动 编号
    var colM = new Ext.grid.ColumnModel([
        boxM,
        rowNumber,
        {header:"IP",dataIndex:"ip",align:'center',editor:ip_edit},
        {header:"Mac",dataIndex:"mac",align:'center',editor:mac_edit},
        {header:"操作标记",dataIndex:"flag",align:'center',renderer:internal_showURL_ip,width:50}

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
        tbar:[
            new Ext.Button({
                id:'btnAdd.ip.proxy.internal.info',
                text:'新增',
                iconCls:'add',
                handler:function(){
                    grid_ip.stopEditing();
                    grid_ip.getStore().insert(
                        0,
                        new record({
                            ip:'',
                            flag:'ip_flag'
                        })
                    );
                    grid_ip.startEditing(0,0);
                }
            }),
            {xtype:"tbseparator"},
			new Ext.Button ({
			    id : 'btnRemove.ip.proxy.internal.info',
                text : '删除',
				iconCls : 'remove',
				handler : function() {
					internal_allow_delete_ipMac_black_proxy_row(grid_ip,store,appName);         //删除 表格 的 一 行 或多行
				}
            }),
            {xtype:"tbseparator"},
            new Ext.Button ({
                id : 'btnSave.ip.proxy.internal.info',
                text : '保存',
                iconCls : 'save',
                handler : function() {
                    internal_allow_save_ipMac_black_proxy_row(grid_ip,store,appName);
                }
            })
        ],
        bbar:page_toolbar
    });
    var win = new Ext.Window({
        title:"IP/Mac黑名单",
        width:510,
        height:333,
        layout:'fit',
        modal:true,
        listeners:{
            close:function(){
                grid.render();
                _store.reload();
                Ext.getCmp('grid.proxy.internal.info').render();
                Ext.getCmp('grid.proxy.internal.info').getStore().reload();
            }
        },
        items: [grid_ip]
    }).show();

    function internal_showURL_ip(value){
        return "<a href='javascript:;' style='color: green;' onclick='internal_allow_update_ipMac_black_proxy_win(\""+appName+"\");'>修改信息</a>";
    }
}

function internal_allow_save_ipMac_black_proxy_row(grid,store,appName){
    var selModel = grid.getSelectionModel();
    var count = selModel.getCount();
    if(count==0){
        Ext.MessageBox.show({
            title:'信息',
            msg:'您没有勾选任何记录!',
            animEl:'btnSave.ip.proxy.internal.info',
            width:250,
            buttons:{'ok':'确定'},
            icon:Ext.MessageBox.WARNING,
            closable:false
        });
    }else if(count > 0){
        var arrayIp = new Array();
        var arrayMac = new Array();
        var record = grid.getSelectionModel().getSelections();
        for(var i = 0; i < record.length; i++){
            arrayIp[i] = record[i].get('ip');
            arrayMac[i] = record[i].get('mac');
        }
        Ext.MessageBox.show({
            title:'信息',
            msg:'确定要保存所选的所有记录？',
            animEl:'btnSave.ip.proxy.internal.info',
            width:300,
            buttons:{'ok':'确定','no':'取消'},
            icon:Ext.MessageBox.WARNING,
            closable:false,
            fn:function(e){
                if(e=='ok'){
                    var myMask = new Ext.LoadMask(Ext.getBody(),{
                        msg:'正在处理,请稍后...',
                        removeMask:true
                    });
                    myMask.show();
                    Ext.Ajax.request({
                        url : 'ProxyIpMacAction_saveIpMac.action?typeXml=internal&type=proxy&ipMacType=black',
                        method:'POST',
                        params :{ arrayIp : arrayIp,arrayMac:arrayMac,appName:appName },
                        success : function(r,o){
                            myMask.hide();
                            var json = Ext.decode(r.responseText);
                            Ext.MessageBox.show({
                                title:'信息',
                                msg:json.msg,
                                animEl:'btnSave.ip.proxy.internal.info',
                                width:200,
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

function internal_allow_delete_ipMac_black_proxy_row(grid,store,appName){
    var selModel = grid.getSelectionModel();
    var count = selModel.getCount();
    if(count==0){
        Ext.MessageBox.show({
            title:'信息',
            msg:'您没有勾选任何记录!',
            animEl:'btnRemove.ip.proxy.internal.info',
            width:250,
            buttons:{'ok':'确定'},
            icon:Ext.MessageBox.WARNING,
            closable:false
        });
    }else if(count > 0){
        var arrayIp = new Array();
        var arrayMac = new Array();
        var record = grid.getSelectionModel().getSelections();
        for(var i = 0; i < record.length; i++){
            arrayIp[i] = record[i].get('ip');
            arrayMac[i] = record[i].get('mac');
        }
        Ext.MessageBox.show({
            title:'信息',
            msg:'确定要删除所选的所有记录？',
            animEl:'btnRemove.ip.proxy.internal.info',
            width:300,
            buttons:{'ok':'确定','no':'取消'},
            icon:Ext.MessageBox.WARNING,
            closable:false,
            fn:function(e){
                if(e=='ok'){
                    var myMask = new Ext.LoadMask(Ext.getBody(),{
                        msg:'正在处理,请稍后...',
                        removeMask:true
                    });
                    myMask.show();
                    Ext.Ajax.request({
                        url : 'ProxyIpMacAction_deleteIpMac.action?typeXml=internal&type=proxy&ipMacType=black',
                        method:'POST',
                        params :{ arrayIp : arrayIp,arrayMac:arrayMac,appName:appName },
                        success : function(r,o){
                            myMask.hide();
                            var json = Ext.decode(r.responseText);
                            Ext.MessageBox.show({
                                title:'信息',
                                msg:json.msg,
                                animEl:'btnRemove.ip.proxy.internal.info',
                                width:200,
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

function internal_allow_update_ipMac_black_proxy_win(appName){
    var grid = Ext.getCmp('grid.ip.proxy.internal.allow.info');
    var store = grid.getStore();
    var selModel = grid.getSelectionModel();
    var formPanel;
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
            formPanel = new Ext.form.FormPanel({
                defaultType : 'textfield',
                labelWidth:80,
                frame:true,
                loadMask : { msg : '正在加载数据，请稍后.....' },
                height : 100,
                labelAlign:'right',
                defaults : {
                    width : 130,
                    allowBlank : false,
                    blankText : '该项不能为空！'
                },
                items : [{
                        id:'innerBlackIp.update.info',
                        fieldLabel:"黑名单IP",
                        name:'ipMac.ip',
                        value:item.data.ip,
                        regex:/^(((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9]))$/,
                        regexText:'这个不是Ip',
                        emptyText:'请输入Ip',
                        listeners:{
                            blur:function(){
                                var ip = this.getValue();
                                var ipHidden = Ext.getCmp('innerBlackIpHidden.update.info').getValue();
                                if(ip!=ipHidden){
                                    var myMask = new Ext.LoadMask(Ext.getBody(),{
                                        msg:'正在处理,请稍后...',
                                        removeMask:true
                                    });
                                    myMask.show();
                                    Ext.Ajax.request({
                                        url:'ProxyIpMacAction_checkIp.action?typeXml=internal&type=proxy&ipMacType=black',
                                        method:'POST',
                                        params:{ip:ip,appName:appName},
                                        success:function(action){
                                            myMask.hide();
                                            var json = Ext.decode(action.responseText);
                                            if(json.msg != '0000'){
                                                Ext.MessageBox.show({
                                                    title:'信息',
                                                    width:250,
                                                    msg:json.msg,
                                                    animEl:'innerBlackIp.update.info',
                                                    icon:Ext.MessageBox.WARNING,
                                                    fn:function(e){
                                                        if(e=='ok'){
                                                            Ext.getCmp('innerBlackIp.update.info').setValue('');
                                                        }
                                                    }
                                                });
                                            }
                                        }
                                    });
                                }
                            }
                        }
                    },{
                        id:'innerBlackIpHidden.update.info',
                        xtype:'hidden',name:'oldUpdateIp',value:item.data.ip
                    },{                     //
                        fieldLabel:"黑名单Mac",
                        name:'ipMac.mac',
                        value:item.data.mac,
                        regex:/^(([0-9a-fA-F]{2}\-){5}[0-9a-fA-F]{2})$/,
                        regexText:'这个不是mac地址:0a-45-be-e6-00-aa',
                        emptyText:'请输入mac地址'
                    }
                ]
            });
        });
    }
    var win = new Ext.Window({
        title:"黑名单-修改信息",
        width:270,
        height:120,
        layout:'fit',modal:true,
        items: [formPanel],
        bbar:[
            new Ext.Toolbar.Fill(),
            new Ext.Button ({
                id:'innerBlackIp.updateWin.info',
                text : '修改',
                formBind:true,
                allowDepress : false,
                handler : function() {
                    Ext.MessageBox.show({
                        title:'请确认',
                        width:250,
                        msg:'真的要修改以上内容?',
                        buttons:{'ok':'确定','no':'取消'},
                        icon:Ext.Msg.WARNING,
                        fn:function(e){
                            if(e=="ok"){
                                if (formPanel.form.isValid()) {
                                    formPanel.getForm().submit({
                                        url :'ProxyIpMacAction_updateIpMac.action?typeXml=internal&type=proxy&ipMacType=black',
                                        method :'POST',
                                        params:{appName:appName},
                                        waitTitle :'系统提示',
                                        waitMsg :'正在保存...',
                                        success : function(form,action) {
                                            Ext.MessageBox.show({
                                                title:'信息',
                                                width:250,
                                                msg:action.result.msg,
                                                animEl:'innerBlackIp.updateWin.info',
                                                icon:Ext.MessageBox.WARNING,
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
                                    Ext.Msg.alert('信息', '请填写完成再提交!');
                                }
                            }else if(e=='no'){
                                win.close();
                            }
                        }
                    });
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
 * 可信端白名单
 */
function internal_ipWhiteWindow(){
    var grid = Ext.getCmp('grid.proxy.internal.info');
    var selModel = grid.getSelectionModel();
    var appName;
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
            appName=item.data.appName;
        });
    }
    var start = 0;			//分页--开始数
    var pageSize = 5;		//分页--每页数
    var record = new Ext.data.Record.create([
        {name:'ip',mapping:'ip'},
        {name:'mac',mapping:'mac'},
        {name:'flag',mapping:'flag'}
    ]);
    var proxy = new Ext.data.HttpProxy({
        url:"ProxyIpMacAction_readIpMac.action?typeXml=internal&proxyType=proxy&ipMacType=white"
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
    var ip_old;
    var ip_edit = new Ext.form.TextField({
        id:'ip_edit.internal.white.info',
        regex:/^(((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9]))$/,
        regexText:'这个不是Ip',
        listeners:{
            focus:function(){
                ip_old = ip_edit.getValue();
            },
            blur:function(){
                var ip = ip_edit.getValue();
                Ext.Ajax.request({
                    url:'ProxyIpMacAction_checkIp.action?typeXml=internal&type=proxy&ipMacType=white',
                    method:'POST',
                    params:{ip:ip,appName:appName},
                    success:function(r,o){
                        var json = Ext.decode(r.responseText);
                        if(json.msg != '0000'&&ip!=ip_old){
                            Ext.MessageBox.show({
                                title:'信息',
                                msg:json.msg,
                                animEl:'ip_edit.internal.white.info',
                                icon:Ext.MessageBox.WARNING,
                                fn:function(e){
                                    if(e=='ok'){

                                    }
                                }
                            });
                        }
                    }
                });
            }
        }
    });
    var mac_edit = new Ext.form.TextField({
        regex:/^(([0-9a-fA-F]{2}\-){5}[0-9a-fA-F]{2})$/,
        regexText:'这个不是mac地址:0a-45-be-e6-00-aa'
    });
    var boxM = new Ext.grid.CheckboxSelectionModel();   //复选框
    var rowNumber = new Ext.grid.RowNumberer();         //自动 编号
    var colM = new Ext.grid.ColumnModel([
        boxM,
        rowNumber,
        {header:"IP",dataIndex:"ip",align:'center',editor:ip_edit},
        {header:"Mac",dataIndex:"mac",align:'center',editor:mac_edit},
        {header:"操作标记",dataIndex:"flag",align:'center',renderer:internal_showURL_ip,width:50}

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
        tbar:[
            new Ext.Button({
                id:'btnAdd.ip.proxy.internal.info',
                text:'新增',
                iconCls:'add',
                handler:function(){
                    grid_ip.stopEditing();
                    grid_ip.getStore().insert(
                        0,
                        new record({
                            ip:'',
                            flag:'ip_flag'
                        })
                    );
                    grid_ip.startEditing(0,0);
                }
            }),
            {xtype:"tbseparator"},
            new Ext.Button ({
                id : 'btnRemove.ip.proxy.internal.info',
                text : '删除',
                iconCls : 'remove',
                handler : function() {
                    internal_delete_ipMac_white_proxy_row(grid_ip,store,appName);         //删除 表格 的 一 行 或多行
                }
            }),
            {xtype:"tbseparator"},
            new Ext.Button ({
                id : 'btnSave.ip.proxy.internal.info',
                text : '保存',
                iconCls : 'save',
                handler : function() {
                    internal_save_ipMac_white_proxy_row(grid_ip,store,appName);
                }
            })
        ],
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

    function internal_showURL_ip(value){
        return "<a href='javascript:;' style='color: green;' onclick='internal_update_ipMac_white_proxy_win(\""+appName+"\");'>修改信息</a>";
    }
}

function internal_save_ipMac_white_proxy_row(grid,store,appName){
    var selModel = grid.getSelectionModel();
    var count = selModel.getCount();
    if(count==0){
        Ext.MessageBox.show({
            title:'信息',
            msg:'您没有勾选任何记录!',
            animEl:'btnSave.ip.proxy.internal.info',
            width:250,
            buttons:{'ok':'确定'},
            icon:Ext.MessageBox.WARNING,
            closable:false
        });
    }else if(count > 0){
        var arrayIp = new Array();
        var arrayMac = new Array();
        var record = grid.getSelectionModel().getSelections();
        for(var i = 0; i < record.length; i++){
            arrayIp[i] = record[i].get('ip');
            arrayMac[i] = record[i].get('mac');
        }
        Ext.MessageBox.show({
            title:'信息',
            msg:'确定要保存所选的所有记录？',
            animEl:'btnSave.ip.proxy.internal.info',
            width:300,
            buttons:{'ok':'确定','no':'取消'},
            icon:Ext.MessageBox.WARNING,
            closable:false,
            fn:function(e){
                if(e=='ok'){
                    var myMask = new Ext.LoadMask(Ext.getBody(),{
                        msg:'正在处理,请稍后...',
                        removeMask:true
                    });
                    myMask.show();
                    Ext.Ajax.request({
                        url : 'ProxyIpMacAction_saveIpMac.action?typeXml=internal&type=proxy&ipMacType=white',
                        method:'POST',
                        params :{ arrayIp : arrayIp,arrayMac:arrayMac,appName:appName },
                        success : function(r,o){
                            myMask.hide();
                            var json = Ext.decode(r.responseText);
                            Ext.MessageBox.show({
                                title:'信息',
                                msg:json.msg,
                                animEl:'btnSave.ip.proxy.internal.info',
                                width:200,
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

function internal_delete_ipMac_white_proxy_row(grid,store,appName){
    var selModel = grid.getSelectionModel();
    var count = selModel.getCount();
    if(count==0){
        Ext.MessageBox.show({
            title:'信息',
            msg:'您没有勾选任何记录!',
            animEl:'btnRemove.ip.proxy.internal.info',
            width:250,
            buttons:{'ok':'确定'},
            icon:Ext.MessageBox.WARNING,
            closable:false
        });
    }else if(count > 0){
        var arrayIp = new Array();
        var arrayMac = new Array();
        var record = grid.getSelectionModel().getSelections();
        for(var i = 0; i < record.length; i++){
            arrayIp[i] = record[i].get('ip');
            arrayMac[i] = record[i].get('mac');
        }
        Ext.MessageBox.show({
            title:'信息',
            msg:'确定要删除所选的所有记录？',
            animEl:'btnRemove.ip.proxy.internal.info',
            width:300,
            buttons:{'ok':'确定','no':'取消'},
            icon:Ext.MessageBox.WARNING,
            closable:false,
            fn:function(e){
                if(e=='ok'){
                    var myMask = new Ext.LoadMask(Ext.getBody(),{
                        msg:'正在处理,请稍后...',
                        removeMask:true
                    });
                    myMask.show();
                    Ext.Ajax.request({
                        url : 'ProxyIpMacAction_deleteIpMac.action?typeXml=internal&type=proxy&ipMacType=white',
                        method:'POST',
                        params :{ arrayIp : arrayIp,arrayMac:arrayMac,appName:appName },
                        success : function(r,o){
                            myMask.hide();
                            var json = Ext.decode(r.responseText);
                            Ext.MessageBox.show({
                                title:'信息',
                                msg:json.msg,
                                animEl:'btnRemove.ip.proxy.internal.info',
                                width:200,
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

function internal_update_ipMac_white_proxy_win(appName){
    var grid = Ext.getCmp('grid.ip.proxy.internal.white.info');
    var store = grid.getStore();
    var selModel = grid.getSelectionModel();
    var formPanel;
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
            formPanel = new Ext.form.FormPanel({
                defaultType : 'textfield',
                labelWidth:80,
                frame:true,
                loadMask : { msg : '正在加载数据，请稍后.....' },
                height : 100,
                labelAlign:'right',
                defaults : {
                    width : 130,
                    allowBlank : false,
                    blankText : '该项不能为空！'
                },
                items : [{
                        id:'innerWhiteIp.update.info',
                        fieldLabel:"白名单IP",
                        name:'ipMac.ip',
                        value:item.data.ip,
                        regex:/^(((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9]))$/,
                        regexText:'这个不是Ip',
                        emptyText:'请输入Ip',
                        listeners:{
                            blur:function(){
                                var ip = this.getValue();
                                var ipHidden = Ext.getCmp('innerWhiteIpHidden.update.info').getValue();
                                if(ip!=ipHidden){
                                    var myMask = new Ext.LoadMask(Ext.getBody(),{
                                        msg:'正在处理,请稍后...',
                                        removeMask:true
                                    });
                                    myMask.show();
                                    Ext.Ajax.request({
                                        url:'ProxyIpMacAction_checkIp.action?typeXml=internal&type=proxy&ipMacType=white',
                                        method:'POST',
                                        params:{ip:ip,appName:appName},
                                        success:function(action){
                                            myMask.hide();
                                            var json = Ext.decode(action.responseText);
                                            if(json.msg != '0000'){
                                                Ext.MessageBox.show({
                                                    title:'信息',
                                                    width:250,
                                                    msg:json.msg,
                                                    animEl:'innerWhiteIp.update.info',
                                                    icon:Ext.MessageBox.WARNING,
                                                    fn:function(e){
                                                        if(e=='ok'){
                                                            Ext.getCmp('innerWhiteIp.update.info').setValue('');
                                                        }
                                                    }
                                                });
                                            }
                                        }
                                    });
                                }
                            }
                        }
                    },{
                        id:'innerWhiteIpHidden.update.info',
                        xtype:'hidden',name:'oldUpdateIp',value:item.data.ip
                    },{                     //
                        fieldLabel:"白名单Mac",
                        name:'ipMac.mac',
                        value:item.data.mac,
                        regex:/^(([0-9a-fA-F]{2}\-){5}[0-9a-fA-F]{2})$/,
                        regexText:'这个不是mac地址:0a-45-be-e6-00-aa',
                        emptyText:'请输入mac地址'
                    }
                ]
            });
        });
    }
    var win = new Ext.Window({
        title:"白名单-修改信息",
        width:270,
        height:120,
        layout:'fit',modal:true,
        items: [formPanel],
        bbar:[
            new Ext.Toolbar.Fill(),
            new Ext.Button ({
                id:'innerWhiteIp.updateWin.info',
                text : '修改',
                formBind:true,
                allowDepress : false,
                handler : function() {
                    Ext.MessageBox.show({
                        title:'请确认',
                        width:250,
                        msg:'真的要修改以上内容?',
                        buttons:{'ok':'确定','no':'取消'},
                        icon:Ext.Msg.WARNING,
                        fn:function(e){
                            if(e=="ok"){
                                if (formPanel.form.isValid()) {
                                    formPanel.getForm().submit({
                                        url :'ProxyIpMacAction_updateIpMac.action?typeXml=internal&type=proxy&ipMacType=white',
                                        method :'POST',
                                        params:{appName:appName},
                                        waitTitle :'系统提示',
                                        waitMsg :'正在保存...',
                                        success : function(form,action) {
                                            Ext.MessageBox.show({
                                                title:'信息',
                                                width:250,
                                                msg:action.result.msg,
                                                animEl:'innerWhiteIp.updateWin.info',
                                                icon:Ext.MessageBox.WARNING,
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
                                    Ext.Msg.alert('信息', '请填写完成再提交!');
                                }
                            }else if(e=='no'){
                                win.close();
                            }
                        }
                    });
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
 * 可信端白名单 -- ALLOW
 */
function internal_allow_ipWhiteWindow(){
    var grid = Ext.getCmp('grid.proxy.internal.allow.info');
    var _store = grid.getStore();
    var selModel = grid.getSelectionModel();
    var appName;
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
            appName=item.data.appName;
        });
    }
    var start = 0;			//分页--开始数
    var pageSize = 5;		//分页--每页数
    var record = new Ext.data.Record.create([
        {name:'ip',mapping:'ip'},
        {name:'mac',mapping:'mac'},
        {name:'flag',mapping:'flag'}
    ]);
    var proxy = new Ext.data.HttpProxy({
        url:"ProxyIpMacAction_readIpMac.action?typeXml=internal&proxyType=proxy&ipMacType=white"
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
    var ip_old;
    var ip_edit = new Ext.form.TextField({
        id:'ip_edit.internal.white.info',
        regex:/^(((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9]))$/,
        regexText:'这个不是Ip',
        listeners:{
            focus:function(){
                ip_old = ip_edit.getValue();
            },
            blur:function(){
                var ip = ip_edit.getValue();
                Ext.Ajax.request({
                    url:'ProxyIpMacAction_checkIp.action?typeXml=internal&type=proxy&ipMacType=white',
                    method:'POST',
                    params:{ip:ip,appName:appName},
                    success:function(r,o){
                        var json = Ext.decode(r.responseText);
                        if(json.msg != '0000'&&ip!=ip_old){
                            Ext.MessageBox.show({
                                title:'信息',
                                msg:json.msg,
                                animEl:'ip_edit.internal.white.info',
                                icon:Ext.MessageBox.WARNING,
                                fn:function(e){
                                    if(e=='ok'){

                                    }
                                }
                            });
                        }
                    }
                });
            }
        }
    });
    var mac_edit = new Ext.form.TextField({
        regex:/^(([0-9a-fA-F]{2}\-){5}[0-9a-fA-F]{2})$/,
        regexText:'这个不是mac地址:0a-45-be-e6-00-aa'
    });
    var boxM = new Ext.grid.CheckboxSelectionModel();   //复选框
    var rowNumber = new Ext.grid.RowNumberer();         //自动 编号
    var colM = new Ext.grid.ColumnModel([
        boxM,
        rowNumber,
        {header:"IP",dataIndex:"ip",align:'center',editor:ip_edit},
        {header:"Mac",dataIndex:"mac",align:'center',editor:mac_edit},
        {header:"操作标记",dataIndex:"flag",align:'center',renderer:internal_showURL_ip,width:50}

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
        id:'grid.ip.proxy.internal.allow.white.info',
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
        tbar:[
            new Ext.Button({
                id:'btnAdd.ip.proxy.internal.info',
                text:'新增',
                iconCls:'add',
                handler:function(){
                    grid_ip.stopEditing();
                    grid_ip.getStore().insert(
                        0,
                        new record({
                            ip:'',
                            flag:'ip_flag'
                        })
                    );
                    grid_ip.startEditing(0,0);
                }
            }),
            {xtype:"tbseparator"},
            new Ext.Button ({
                id : 'btnRemove.ip.proxy.internal.info',
                text : '删除',
                iconCls : 'remove',
                handler : function() {
                    internal_allow_delete_ipMac_white_proxy_row(grid_ip,store,appName);         //删除 表格 的 一 行 或多行
                }
            }),
            {xtype:"tbseparator"},
            new Ext.Button ({
                id : 'btnSave.ip.proxy.internal.info',
                text : '保存',
                iconCls : 'save',
                handler : function() {
                    internal_allow_save_ipMac_white_proxy_row(grid_ip,store,appName);
                }
            })
        ],
        bbar:page_toolbar
    });
    var win = new Ext.Window({
        title:"IP/Mac白名单",
        width:510,
        height:333,
        layout:'fit',
        modal:true,
        listeners:{
            close:function(){
                grid.render();
                _store.reload();
                Ext.getCmp('grid.proxy.internal.info').render();
                Ext.getCmp('grid.proxy.internal.info').getStore().reload();
            }
        },
        items: [grid_ip]
    }).show();

    function internal_showURL_ip(value){
        return "<a href='javascript:;' style='color: green;' onclick='internal_allow_update_ipMac_white_proxy_win(\""+appName+"\");'>修改信息</a>";
    }
}

function internal_allow_save_ipMac_white_proxy_row(grid,store,appName){
    var selModel = grid.getSelectionModel();
    var count = selModel.getCount();
    if(count==0){
        Ext.MessageBox.show({
            title:'信息',
            msg:'您没有勾选任何记录!',
            animEl:'btnSave.ip.proxy.internal.info',
            width:250,
            buttons:{'ok':'确定'},
            icon:Ext.MessageBox.WARNING,
            closable:false
        });
    }else if(count > 0){
        var arrayIp = new Array();
        var arrayMac = new Array();
        var record = grid.getSelectionModel().getSelections();
        for(var i = 0; i < record.length; i++){
            arrayIp[i] = record[i].get('ip');
            arrayMac[i] = record[i].get('mac');
        }
        Ext.MessageBox.show({
            title:'信息',
            msg:'确定要保存所选的所有记录？',
            animEl:'btnSave.ip.proxy.internal.info',
            width:300,
            buttons:{'ok':'确定','no':'取消'},
            icon:Ext.MessageBox.WARNING,
            closable:false,
            fn:function(e){
                if(e=='ok'){
                    var myMask = new Ext.LoadMask(Ext.getBody(),{
                        msg:'正在处理,请稍后...',
                        removeMask:true
                    });
                    myMask.show();
                    Ext.Ajax.request({
                        url : 'ProxyIpMacAction_saveIpMac.action?typeXml=internal&type=proxy&ipMacType=white',
                        method:'POST',
                        params :{ arrayIp : arrayIp,arrayMac:arrayMac,appName:appName },
                        success : function(r,o){
                            myMask.hide();
                            var json = Ext.decode(r.responseText);
                            Ext.MessageBox.show({
                                title:'信息',
                                msg:json.msg,
                                animEl:'btnSave.ip.proxy.internal.info',
                                width:200,
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

function internal_allow_delete_ipMac_white_proxy_row(grid,store,appName){
    var selModel = grid.getSelectionModel();
    var count = selModel.getCount();
    if(count==0){
        Ext.MessageBox.show({
            title:'信息',
            msg:'您没有勾选任何记录!',
            animEl:'btnRemove.ip.proxy.internal.info',
            width:250,
            buttons:{'ok':'确定'},
            icon:Ext.MessageBox.WARNING,
            closable:false
        });
    }else if(count > 0){
        var arrayIp = new Array();
        var arrayMac = new Array();
        var record = grid.getSelectionModel().getSelections();
        for(var i = 0; i < record.length; i++){
            arrayIp[i] = record[i].get('ip');
            arrayMac[i] = record[i].get('mac');
        }
        Ext.MessageBox.show({
            title:'信息',
            msg:'确定要删除所选的所有记录？',
            animEl:'btnRemove.ip.proxy.internal.info',
            width:300,
            buttons:{'ok':'确定','no':'取消'},
            icon:Ext.MessageBox.WARNING,
            closable:false,
            fn:function(e){
                if(e=='ok'){
                    var myMask = new Ext.LoadMask(Ext.getBody(),{
                        msg:'正在处理,请稍后...',
                        removeMask:true
                    });
                    myMask.show();
                    Ext.Ajax.request({
                        url : 'ProxyIpMacAction_deleteIpMac.action?typeXml=internal&type=proxy&ipMacType=white',
                        method:'POST',
                        params :{ arrayIp : arrayIp,arrayMac:arrayMac,appName:appName },
                        success : function(r,o){
                            myMask.hide();
                            var json = Ext.decode(r.responseText);
                            Ext.MessageBox.show({
                                title:'信息',
                                msg:json.msg,
                                animEl:'btnRemove.ip.proxy.internal.info',
                                width:200,
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

function internal_allow_update_ipMac_white_proxy_win(appName){
    var grid = Ext.getCmp('grid.ip.proxy.internal.allow.white.info');
    var store = grid.getStore();
    var selModel = grid.getSelectionModel();
    var formPanel;
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
            formPanel = new Ext.form.FormPanel({
                defaultType : 'textfield',
                labelWidth:80,
                frame:true,
                loadMask : { msg : '正在加载数据，请稍后.....' },
                height : 100,
                labelAlign:'right',
                defaults : {
                    width : 130,
                    allowBlank : false,
                    blankText : '该项不能为空！'
                },
                items : [{
                        id:'innerWhiteIp.update.info',
                        fieldLabel:"白名单IP",
                        name:'ipMac.ip',
                        value:item.data.ip,
                        regex:/^(((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9]))$/,
                        regexText:'这个不是Ip',
                        emptyText:'请输入Ip',
                        listeners:{
                            blur:function(){
                                var ip = this.getValue();
                                var ipHidden = Ext.getCmp('innerWhiteIpHidden.update.info').getValue();
                                if(ip!=ipHidden){
                                    var myMask = new Ext.LoadMask(Ext.getBody(),{
                                        msg:'正在处理,请稍后...',
                                        removeMask:true
                                    });
                                    myMask.show();
                                    Ext.Ajax.request({
                                        url:'ProxyIpMacAction_checkIp.action?typeXml=internal&type=proxy&ipMacType=white',
                                        method:'POST',
                                        params:{ip:ip,appName:appName},
                                        success:function(action){
                                            myMask.hide();
                                            var json = Ext.decode(action.responseText);
                                            if(json.msg != '0000'){
                                                Ext.MessageBox.show({
                                                    title:'信息',
                                                    width:250,
                                                    msg:json.msg,
                                                    animEl:'innerWhiteIp.update.info',
                                                    icon:Ext.MessageBox.WARNING,
                                                    fn:function(e){
                                                        if(e=='ok'){
                                                            Ext.getCmp('innerWhiteIp.update.info').setValue('');
                                                        }
                                                    }
                                                });
                                            }
                                        }
                                    });
                                }
                            }
                        }
                    },{
                        id:'innerWhiteIpHidden.update.info',
                        xtype:'hidden',name:'oldUpdateIp',value:item.data.ip
                    },{                     //
                        fieldLabel:"白名单Mac",
                        name:'ipMac.mac',
                        value:item.data.mac,
                        regex:/^(([0-9a-fA-F]{2}\-){5}[0-9a-fA-F]{2})$/,
                        regexText:'这个不是mac地址:0a-45-be-e6-00-aa',
                        emptyText:'请输入mac地址'
                    }
                ]
            });
        });
    }
    var win = new Ext.Window({
        title:"白名单-修改信息",
        width:270,
        height:120,
        layout:'fit',modal:true,
        items: [formPanel],
        bbar:[
            new Ext.Toolbar.Fill(),
            new Ext.Button ({
                id:'innerWhiteIp.updateWin.info',
                text : '修改',
                formBind:true,
                allowDepress : false,
                handler : function() {
                    Ext.MessageBox.show({
                        title:'请确认',
                        width:250,
                        msg:'真的要修改以上内容?',
                        buttons:{'ok':'确定','no':'取消'},
                        icon:Ext.Msg.WARNING,
                        fn:function(e){
                            if(e=="ok"){
                                if (formPanel.form.isValid()) {
                                    formPanel.getForm().submit({
                                        url :'ProxyIpMacAction_updateIpMac.action?typeXml=internal&type=proxy&ipMacType=white',
                                        method :'POST',
                                        params:{appName:appName},
                                        waitTitle :'系统提示',
                                        waitMsg :'正在保存...',
                                        success : function(form,action) {
                                            Ext.MessageBox.show({
                                                title:'信息',
                                                width:250,
                                                msg:action.result.msg,
                                                animEl:'innerWhiteIp.updateWin.info',
                                                icon:Ext.MessageBox.WARNING,
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
                                    Ext.Msg.alert('信息', '请填写完成再提交!');
                                }
                            }else if(e=='no'){
                                win.close();
                            }
                        }
                    });
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