/**
 * 通用代理可信端新增应用--业务管理员
 * @param grid
 * @param store
 */
function internal_insert_proxy_win(grid,store){
    var targetAppName_record = new Ext.data.Record.create([
		{name:'value',mapping:'value'},
		{name:'key',mapping:'key'}
	]);
	var targetAppName_reader = new Ext.data.JsonReader({ totalProperty:'total',root:"rows"},targetAppName_record);
	var targetAppName_store = new Ext.data.Store({
		url:"../../AppTypeAction_readTargetAppNameKeyValue.action",
		reader:targetAppName_reader
	});
    targetAppName_store.load({ params:{appType:'proxy'} });
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
        	width:400,
            title:'应用属性配置  -- 使用说明',
            xtype:'fieldset',
            html:"<font color='green'>1.所有项为必填项;<br>2.选择数据源或者目标后才能进行‘下一步’操作！</font>"
        },{
            fieldLabel:"应用源类型",
            xtype:'displayfield',
            value:'数据目标'
        },{
            id:"internal.plugin.info",
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
            value:'通用代理'
        },{
            xtype:'hidden',
            name:'typeBase.appType',
            value:'proxy'
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
        labelWidth:130,
        defaults:{
            width:200,
            allowBlank:false,
            blankText:'该项不能为空！'
        },
        items:[{
        	width:400,
            title:'目标端属性配置  -- 使用说明',
            xtype:'fieldset',
            html:"<font color='green'>1.所有项为必填项;<br>2.编码和类型项要与数据源端保持一致！</font>"
        },{
        	fieldLabel:'应用服务端地址',   //ip:port
        	xtype:'textfield',
        	name:'typeData.serverAddress',
            regex:/^((((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9]))(\:(6553[0-6]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{3}|[1-9][0-9]{2}|[1-9][0-9]{1}|[1-9])){1,2})$/,
            regexText:'这个不是Ip:Port',
            emptyText:'请输入Ip:Port'
        },{
            id:'port.info',
        	fieldLabel:'应用服务端口',
            xtype:'displayfield'
        },{
            id:'port.hidden.info',
            xtype:'hidden',
            name:'typeData.port'
        },{
        	fieldLabel:'最小连接数',
        	xtype:'textfield',
        	name:'typeData.poolMin',
            regex:/^([1-9][0-9]{0,2})$/,
		    regexText:'这个不是1~999之间的数字',
		    emptyText:'请输入1~999'
        },{
        	fieldLabel:'最大连接数',
        	xtype:'textfield',
        	name:'typeData.poolMax',
            regex:/^([1-9][0-9]{0,2})$/,
		    regexText:'这个不是1~999之间的数字',
		    emptyText:'请输入1~999'
        },{
        	fieldLabel:'重试次数',
        	xtype:'textfield',
        	name:'typeData.tryTime',
            regex:/^(100|[1-9][0-9]|[0-9])$/,
            regexText:'这个不是0~100之间的数字',
            emptyText:'请输入0~100之间的数字'
        },{
            fieldLabel:"编码", hiddenName:'typeData.charset',
            xtype:'combo',
            mode:'local',
            emptyText :'--请选择--',
            editable : false,
            typeAhead:true,
            forceSelection: true,
            triggerAction:'all',
            displayField:"key",valueField:"value",
            store: storeCharset
        },{
            fieldLabel:"类型", hiddenName:'typeData.type',
            xtype:'combo',
            mode:'local',
            emptyText :'--请选择--',
            editable : false,
            typeAhead:true,
            forceSelection: true,
            triggerAction:'all',
            displayField:"key",valueField:"value",
            store: storeTransport
        }]
    });

    var card = new Ext.Panel({
        id:'card-wizard-panel',
        layout:'card',
        activeItem:0,
        layoutConfig:{
            animate:true
        },
        bbar:[  '->', {
                id:'card-prev',
                text:'上一页',
                handler:internal_CardNav.createDelegate(this,[-1]),
                disabled:true
            }, {
                id:'card-next',
                text:'下一页',
                handler:internal_CardNav.createDelegate(this,[+1]),
                listeners:{
                    click:function(){
                        var myMask = new Ext.LoadMask(Ext.getBody(),{
                            msg:'正在校验,请稍后...',
                            removeMask:true
                        });
                        myMask.show();
                        var appName = Ext.getCmp('appName.internal.info').getValue();
                        Ext.Ajax.request({
                            url:'../../ProxyAction_loadChannelPort.action',
                            params:{appName:appName},
                            method:'POST',
                            success:function(action){
                                var json = Ext.decode(action.responseText);
                                var port = json.msg;
                                Ext.getCmp('port.hidden.info').setValue(port);
                                Ext.getCmp('port.info').setValue(port);
                                myMask.hide();
                            }
                        });

                    }
                }
            }, {
                id: "card-finish",
                text: "保存",
                handler: function() {
                    var appName = Ext.getCmp('appName.internal.info').getValue();
                    var appDesc = Ext.getCmp('internal.appDesc.info').getValue();
                    if (form1.form.isValid()&&form2.form.isValid()) {
                        form2.getForm().submit({
                            url:'../../ProxyAction_insert.action',
                            params:{
                                appName:appName,appDesc:appDesc,privated:true,plugin:'2',appType:'proxy',isActive:false
                            },
                            method :'POST',
                            waitTitle :'系统提示',
                            waitMsg :'正在保存...',
                            success : function(form,action) {
                                var msg = action.result.msg;
                                Ext.MessageBox.show({
                                    title:'信息',
                                    msg:msg,
                                    animEl:'card-finish',
                                    buttons:{'ok':'确定'},
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
            }
        ],
        items:[form1,form2]
    });

    var win = new Ext.Window({
        title:"新增信息-可信通用代理应用",
        width:450,
        height:360,
        layout:'fit',
        modal:true,
        items:card
    }).show();
}

/**
 * 导航方法
 * @param incr
 */
function internal_CardNav(incr){
    var cardPanel = Ext.getCmp('card-wizard-panel').getLayout();
    var i = cardPanel.activeItem.id.split('card-')[1];
    var text = document.getElementById('internal.plugin.info').value;
    var next = parseInt(i)+incr;
    cardPanel.setActiveItem(next);
    Ext.getCmp('card-prev').setDisabled(next==0);
    Ext.getCmp('card-next').setDisabled(next==1);
}

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
                msg:'<font color="green">确定要删除所选记录？</font>',
                animEl:'btnRemove.proxy.internal.info',
                width:300,
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
                            url : '../../ProxyAction_delete.action',             // 删除 连接 到后台
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
function internal_showURL_plugin(value){
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
/**
 * 通用代理可信端修改应用属性--业务管理员
 */
function internal_update_proxy_app_win(){
    var grid = Ext.getCmp('grid.proxy.internal.info');
    var store = Ext.getCmp('grid.proxy.internal.info').getStore();
    var selModel = grid.getSelectionModel();
    var formPanel;
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
            formPanel = new Ext.form.FormPanel({
                labelWidth:130,
                frame:true,
                labelAlign:'right',
                defaults : {
					width : 200,
					allowBlank : false,
					blankText : '该项不能为空！'
				},
                items:[{
                    width:350,
                    title:'应用属性配置  -- 使用说明',
                    xtype:'fieldset',
                    html:"<font color='green'>1.所有项为必填项！</font>"
                },{
                    fieldLabel:"数据源或目标",
                    xtype:'displayfield',
                    value:internal_showURL_plugin(item.data.plugin)
                },{
                    xtype:'hidden',
                    name:'typeBase.plugin',
                    value:item.data.plugin
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
                    value:'通用代理'
                },{
                    xtype:'hidden',
                    name:'typeBase.appType',
                    value:'proxy'
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
        title:"修改信息-可信通用代理应用属性",
        width:400,
        height:300,
        layout:'fit',
        modal:true,
        items: [formPanel],
        bbar:[
            new Ext.Toolbar.Fill(),
            new Ext.Button ({
                id:'internal.update.win.info',
                text : '修改',
                formBind:true,
                allowDepress : false,
                handler : function() {
                    if (formPanel.form.isValid()) {
                        Ext.MessageBox.show({
                    		title:'信息',
                            msg:'确定要修改?',
                            animEl:'internal.update.win.info',
                            buttons:{'ok':'确定','no':'取消'},
                            icon:Ext.MessageBox.WARNING,
                            closable:false,
                            fn:function(e){
                            	if(e=='ok'){
                            		formPanel.getForm().submit({
			                            url :'../../ProxyAction_update.action',
			                            method :'POST',
			                            waitTitle :'系统提示',
			                            waitMsg :'正在保存...',
			                            success : function(form,action) {
                                            var msg = action.result.msg;
			                                Ext.MessageBox.show({
			                                    title:'信息',
			                                    width:200,
			                                    msg:msg,
			                                    animEl:'internal.update.win.info',
			                                    buttons:{'ok':'确定'},
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
                            msg:'请填写完成再提交!',
                            animEl:'internal.update.win.info',
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
 * 通用代理可信端修改数据属性--业务管理员
 */
function internal_update_proxy_data_target_win(){
    var grid = Ext.getCmp('grid.proxy.internal.info');
    var store = Ext.getCmp('grid.proxy.internal.info').getStore();
    var selModel = grid.getSelectionModel();
    var formPanel;
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
            formPanel = new Ext.form.FormPanel({
                labelWidth:150,
                frame:true,
                labelAlign:'right',
                defaults : {
					width : 200,
					allowBlank : false,
					blankText : '该项不能为空！'
				},
                items:[{
                	width:400,
                    title:'目标端属性配置  -- 使用说明',
                    xtype:'fieldset',
                    html:"<font color='green'>1.编码和类型项要与数据源端保持一致！</font>"
                },{
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
                	value:'2'
                },{
                    fieldLabel:'应用服务地址',   //ip:port
                    xtype:'textfield',
                    name:'typeData.serverAddress',
                    value:item.data.t_serverAddress,
                    regex:/^((((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9]))(\:(6553[0-6]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{3}|[1-9][0-9]{2}|[1-9][0-9]{1}|[1-9])){1,2})$/,
                    regexText:'这个不是Ip:Port',
                    emptyText:'请输入Ip:Port'
//                },{
//                    fieldLabel:'平台服务端口',
//                    xtype:'textfield',
//                    name:'typeData.port',
//                    value:item.data.t_port,
//                    regex:/^((6553[0-6]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{3})|(6553[0-6]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{3})[:](6553[0-6]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{3}))$/,
//                    regexText:'这个不是端口类型1000~65536或者1000:65536',
//                    emptyText:'请输入端口1000~65536或者1000:65536'
                },{
                    fieldLabel:'平台服务端口',
                    xtype:'displayfield',
                    value:item.data.t_port
                },{
                    xtype:'hidden',
                    name:'typeData.port',
                    value:item.data.t_port
                },{
                    fieldLabel:'最小连接数',
                    xtype:'textfield',
                    name:'typeData.poolMin',
                    value:item.data.t_poolMin,
                    regex:/^([1-9][0-9]{0,2})$/,
                    regexText:'这个不是1~999之间的数字',
                    emptyText:'请输入1~999'
                },{
                    fieldLabel:'最大连接数',
                    xtype:'textfield',
                    name:'typeData.poolMax',
                    value:item.data.t_poolMax,
                    regex:/^([1-9][0-9]{0,2})$/,
                    regexText:'这个不是1~999之间的数字',
                    emptyText:'请输入1~999'
                },{
                    fieldLabel:'重试次数',
                    xtype:'textfield',
                    name:'typeData.tryTime',
                    value:item.data.t_tryTime,
                    regex:/^(100|[1-9][0-9]|[0-9])$/,
                    regexText:'这个不是0~100之间的数字',
                    emptyText:'请输入0~100之间的数字'
                },{
                    fieldLabel:"编码", hiddenName:'typeData.charset',value:item.data.t_charset,
                    xtype:'combo',
                    mode:'local',
                    emptyText :'--请选择--',
                    editable : false,
                    typeAhead:true,
                    forceSelection: true,
                    triggerAction:'all',
                    displayField:"key",valueField:"value",
                    store: storeCharset
                },{
                    fieldLabel:"类型", hiddenName:'typeData.type',value:item.data.t_type,
                    xtype:'combo',
                    mode:'local',
                    emptyText :'--请选择--',
                    editable : false,
                    typeAhead:true,
                    forceSelection: true,
                    triggerAction:'all',
                    displayField:"key",valueField:"value",
                    store: storeTransport
                }]
             });
        });
    }
    var win = new Ext.Window({
        title:"修改信息-可信通用代理目标数据属性",
        width:420,
        height:360,
        layout:'fit',
        modal:true,
        autoScroll:true,
        items: [formPanel],
        bbar:[
            new Ext.Toolbar.Fill(),
            new Ext.Button ({
                id:'internal.update.win.info',
                text : '修改',
                formBind:true,
                allowDepress : false,
                handler : function() {
                    if (formPanel.form.isValid()) {
                        Ext.MessageBox.show({
                    		title:'信息',
                            msg:'确定要修改?',
                            animEl:'internal.update.win.info',
                            buttons:{'ok':'确定','no':'取消'},
                            icon:Ext.MessageBox.WARNING,
                            closable:false,
                            fn:function(e){
                            	if(e=='ok'){
                            		formPanel.getForm().submit({
			                           url :'../../ProxyAction_update.action',
			                            method :'POST',
			                            waitTitle :'系统提示',
			                            waitMsg :'正在保存...',
			                            success : function(form,action) {
                                            var msg = action.result.msg;
			                                Ext.MessageBox.show({
			                                    title:'信息',
			                                    width:200,
			                                    msg:msg,
			                                    animEl:'internal.update.win.info',
			                                    buttons:{'ok':'确定'},
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
                            msg:'请填写完成再提交!',
                            animEl:'internal.update.win.info',
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

function internal_detail_proxy_win(){
    var grid = Ext.getCmp('grid.proxy.internal.info');
    var store = Ext.getCmp('grid.proxy.internal.info').getStore();
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
					width : 150,
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
                    fieldLabel:'通道',
                    value:showURL_channel(item.data.channel)
                },{
                    fieldLabel:'启用状态',
                    value:showURL_isActive(item.data.isActive)
                },{
                    fieldLabel:'应用服务地址(目标)',
                    value:item.data.t_serverAddress
                },{
                    fieldLabel:'应用服务端口(目标)',
                    value:item.data.t_port
                },{
                    fieldLabel:'最小连接数(目标)',
                    value:item.data.t_poolMin
                },{
                    fieldLabel:'最大连接数(目标)',
                    value:item.data.t_poolMax
                },{
                    fieldLabel:'编码(目标)',
                    value:item.data.t_charset
                },{
                    fieldLabel:'重试次数(目标)',
                    value:item.data.t_tryTime
                },{
                    fieldLabel:'类型(目标)',
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