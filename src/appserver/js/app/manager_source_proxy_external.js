/**
 * 通用代理非可信端新增应用--业务管理员
 * @param grid
 * @param store
 */
function external_insert_proxy_win(grid,store){
    var channelRecord = new Ext.data.Record.create([
		{name:'value',mapping:'value'},
		{name:'key',mapping:'key'}
	]);
	var channelReader = new Ext.data.JsonReader({ totalProperty:'total',root:"rows"},channelRecord);
	var storeChannel = new Ext.data.Store({
		url:'../../AppTypeAction_readChannelKeyValue.action',
		reader:channelReader
	});
	storeChannel.load();
    //应用属性配置
     var form1 = new Ext.form.FormPanel({
        id:'card-0',
        frame:true,
        labelAlign:'right',
        autoScroll:true,
        labelWidth:130,
        defaults:{
            width:230,
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
            name:'typeBase.plugin',
            xtype:'hidden',
            value:'1'
        },{
            fieldLabel:"配置类型",
            xtype:'displayfield',
            value:'非可信'
        },{
            xtype:'hidden',
            name:'typeBase.privated',
            value:false
        },{
            fieldLabel:"应用类型",
            xtype:'displayfield',
            value:'通用代理'
        },{
            xtype:'hidden',
            name:'typeBase.appType',
            value:'proxy'
        },{
            id:'appName.external.info',
            fieldLabel:"应用编号",
            xtype:'textfield',
            name:'typeBase.appName',
            regex:/^.{2,30}$/,
            regexText:'请输入任意2--30个字符',
            emptyText:'请输入任意2--30个字符',
            listeners:{
                blur:function(){
                    var appName = this.getValue();
                    if(appName.length>0){
                        var myMask = new Ext.LoadMask(Ext.getBody(),{
                            msg:'正在校验,请稍后...',
                            removeMask:true
                        });
                        myMask.show();
                        Ext.Ajax.request({
                            url:'../../AppTypeAction_check.action',
                            params:{appName:appName},
                            method:'POST',
                            success:function(action){
                                var json = Ext.decode(action.responseText);
                                var msg = json.msg;
                                myMask.hide();
                                if(msg != '0000'){
                                    Ext.MessageBox.show({
                                        title:'信息',
                                        msg:'<font color="red">'+msg+'</font>',
                                        prompt:false,
                                        animEl:'appName.external.info',
                                        width:200,
                                        buttons:{'ok':'确定'},
                                        icon:Ext.MessageBox.ERROR,
                                        closable:false,
                                        fn:function(e){
                                            if(e=='ok'){
                                                Ext.getCmp('appName.external.info').setValue('');
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
            id:'external.appDesc.info',
        	fieldLabel:"应用名",
            xtype:'textfield',
            name:'typeBase.appDesc',
            regex:/^.{2,30}$/,
            regexText:'请输入任意2--30个字符',
            emptyText:'请输入任意2--30个字符'
        },{
            id:'external.combo.channel.info',
            fieldLabel:"通道",
            hiddenName:'typeBase.channel',
            xtype:'combo',
            mode:'local',
            emptyText :'--请选择--',
            editable : false,
            typeAhead:true,
            forceSelection: true,
            triggerAction:'all',
            displayField:"key",valueField:"value",
            store:storeChannel
        },{
            id:'external.channelport.info',
        	fieldLabel:"通道端口",
            xtype:'textfield',
            name:'typeBase.channelport',
            regex:/^((6553[0-6]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{3})|(6553[0-6]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{3})[:](6553[0-6]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{3}))$/,
            regexText:'这个不是正确输入类型(例子:1000~65536之间任一或者任意2个1000:65536)',
            emptyText:'请输入1000~65536或1000:65536'/*,
            listeners:{
                blur:function(){
                    var channelPort = this.getValue();
                    if(channelPort.length>0){
                        var myMask = new Ext.LoadMask(Ext.getBody(),{
                            msg:'正在校验,请稍后...',
                            removeMask:true
                        });
                        myMask.show();
                        Ext.Ajax.request({
                            url:'../../AppTypeAction_checkPort.action',
                            params:{channelPort:channelPort},
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
                                        animEl:'external.channelport.info',
                                        width:250,
                                        buttons:{'ok':'确定'},
                                        icon:Ext.MessageBox.ERROR,
                                        closable:false,
                                        fn:function(e){
                                            if(e=='ok'){
                                                Ext.getCmp('external.channelport.info').setValue('');
                                            }
                                        }
                                    });
                                }
                            }
                        });
                    }
                }
            }*/
        }]
    });
    //源端属性配置
    var form2 = new Ext.form.FormPanel({
    	id:'card-1',
        frame:true,
        labelAlign:'right',
        labelWidth:130,
        defaults:{
            width:220,
            allowBlank:false,
            blankText:'该项不能为空！'
        },
        items:[{
        	width:400,
            title:'源端属性配置  -- 使用说明',
            xtype:'fieldset',
            html:"<font color='green'>1.所有项为必填项;<br>2.编码和类型项要与目标端保持一致！</font>"
        },{
            id:'external.insert.source.server_address.info',
            fieldLabel:'应用服务地址',
        	xtype:'textfield',
        	name:'typeData.serverAddress',
            regex:/^(((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9]))$/,
            regexText:'这个不是IP',
            emptyText:'请输入IP'
        },{
            id:'external.insert.source.port.info',
            fieldLabel:'应用服务端口',
        	xtype:'textfield',
        	name:'typeData.port',
            regex:/^((6553[0-6]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{3})|(6553[0-6]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{3})[:](6553[0-6]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{3}))$/,
            regexText:'这个不是正确输入类型(例子:1000~65536之间任一或者任意2个1000:65536)',
            emptyText:'请输入1000~65536或1000:65536'
        },{
            id:'external.insert.source.pool_min.info',
        	fieldLabel:'最小连接数',
        	xtype:'textfield',
        	name:'typeData.poolMin',
            regex:/^([1-9][0-9]{0,2})$/,
		    regexText:'这个不是1~999之间的数字',
		    emptyText:'请输入1~999'
        },{
            id:'external.insert.source.pool_max.info',
        	fieldLabel:'最大连接数',
        	xtype:'textfield',
        	name:'typeData.poolMax',
            regex:/^([1-9][0-9]{0,2})$/,
		    regexText:'这个不是1~999之间的数字',
		    emptyText:'请输入1~999'
        },{
            id:'external.insert.source.try_time.info',
        	fieldLabel:'重试次数',
        	xtype:'textfield',
        	name:'typeData.tryTime',
            regex:/^(100|[1-9][0-9]|[0-9])$/,
            regexText:'这个不是0~100之间的数字',
            emptyText:'请输入0~100之间的数字'
        },{
            id:'external.insert.source.charset.info',
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
            id:'external.insert.source.type.info',
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
        bbar:[ '->', {
                id:'card-prev',
                text:'上一页',
                handler:external_CardNav.createDelegate(this,[-1]),
                disabled:true
            }, {
                id:'card-next',
                text:'下一页',
                handler:external_CardNav.createDelegate(this,[+1])
            }, {
                id: "card-finish",
                text: "保存",
                handler: function() {
                    var appName = Ext.getCmp('appName.external.info').getValue();
                    var appDesc = Ext.getCmp('external.appDesc.info').getValue();
                    var channel = Ext.getCmp('external.combo.channel.info').getValue();
                    var channelport = Ext.getCmp('external.channelport.info').getValue();
                    var appType = 'proxy';

                    if (form1.form.isValid()&&form2.form.isValid()) {
                        form2.getForm().submit({
                            url:'../../ProxyAction_insert.action',
                            params:{
                                appName:appName,appDesc:appDesc,appType:appType,privated:false,isActive:false,
                                channel:channel,channelport:channelport,plugin:'1'
                            },
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
                            width:200,
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
        title:"新增信息-非可信通用代理应用",
        width:450,
        height:370,
        layout:'fit',
        modal:true,
        items:card
    }).show();
}

/**
 * 导航方法
 * @param incr
 */
function external_CardNav(incr){
    var cardPanel = Ext.getCmp('card-wizard-panel').getLayout();
    var i = cardPanel.activeItem.id.split('card-')[1];
    var text = document.getElementById('external.plugin.info').value;
    var next = parseInt(i)+incr;
    cardPanel.setActiveItem(next);
    Ext.getCmp('card-prev').setDisabled(next==0);
    Ext.getCmp('card-next').setDisabled(next==1);
}

/**
 * 通用代理非可信端删除应用--业务管理员
 */
function external_delete_proxy_row(){
    var grid = Ext.getCmp('grid.proxy.external.info');
    var store = grid.getStore();
    var selModel = grid.getSelectionModel();
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
            var appName = item.data.appName;
            var appType = item.data.appType;
            Ext.MessageBox.show({
                title:'信息',
                msg:'<font color="green">确定要删除'+appName+'应用？</font>',
                animEl:'btnRemove.proxy.external.info',
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
                            url : '../../ProxyAction_delete.action',
                            params :{appName : appName,plugin : 'external',deleteType:2},
                            success : function(r,o){
                                myMask.hide();
                                var respText = Ext.util.JSON.decode(r.responseText);
                                var msg = respText.msg;
                                Ext.MessageBox.show({
                                    title:'信息',
                                    msg:msg,
                                    animEl:'btnRemove.proxy.external.info',
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
 * 通用代理非可信端修改应用属性--业务管理员
 */
function external_update_proxy_app_win(){
    var channelRecord = new Ext.data.Record.create([
		{name:'value',mapping:'value'},
		{name:'key',mapping:'key'}
	]);
	var channelReader = new Ext.data.JsonReader({ totalProperty:'total',root:"rows"},channelRecord);
	var storeChannel = new Ext.data.Store({
		url:'../../AppTypeAction_readChannelKeyValue.action',
		reader:channelReader,
        listeners : {
			load : function(){
				var value = Ext.getCmp('channel.external.info').getValue();
				Ext.getCmp('channel.external.info').setValue(value);
			}
		}
	});
	storeChannel.load();
    var grid = Ext.getCmp('grid.proxy.external.info');
    var store = grid.getStore();
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
                    width:400,
                    title:'应用属性配置  -- 使用说明',
                    xtype:'fieldset',
                    html:"<font color='green'>1.所有项为必填项;"
                },{
                    fieldLabel:"应用源类型",
                    xtype:'displayfield',
                    value:"数据源"
                },{
                    xtype:'hidden',
                    name:'typeBase.plugin',
                    value:item.data.plugin
                },{
                    fieldLabel:"配置类型",
                    xtype:'displayfield',
                    value:'非可信'
                },{
                    xtype:'hidden',
                    name:'typeBase.privated',
                    value:false
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
                },{
                    id:'channel.external.info',
                    fieldLabel:"通道",
                    hiddenName:'typeBase.channel',value:item.data.channel,
                    xtype:'combo',
                    mode:'local',
                    emptyText :'--请选择--',
                    editable : false,
                    typeAhead:true,
                    forceSelection: true,
                    triggerAction:'all',
                    displayField:"key",valueField:"value",
                    store:storeChannel
                },{
                    id:'external.channelport.update.info',
                    fieldLabel:"通道端口",
                    xtype:'textfield',
                    name:'typeBase.channelport',
                    value:item.data.channelport,
                    regex:/^((6553[0-6]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{3})|(6553[0-6]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{3})[:](6553[0-6]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{3}))$/,
                    regexText:'这个不是正确输入类型(例子:1000~65536之间任一或者任意2个1000:65536)',
                    emptyText:'请输入1000~65536或1000:65536'
                    /*listeners:{
                        blur:function(){
                            var old = item.data.channelport;
                            var channelPort = this.getValue();
                            if(channelPort!=old&&channelPort.length>0){
                                var myMask = new Ext.LoadMask(Ext.getBody(),{
                                    msg:'正在校验,请稍后...',
                                    removeMask:true
                                });
                                myMask.show();
                                Ext.Ajax.request({
                                    url:'../../AppTypeAction_checkPort.action',
                                    params:{channelPort:channelPort},
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
                                                animEl:'external.channelport.info',
                                                width:250,
                                                buttons:{'ok':'确定'},
                                                icon:Ext.MessageBox.ERROR,
                                                closable:false,
                                                fn:function(e){
                                                    if(e=='ok'){
                                                        Ext.getCmp('external.channelport.update.info').setValue('');
                                                    }
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        }
                    }*/
                }]
            });
        });
    }
    var win = new Ext.Window({
        title:"修改信息-非可信通用代理应用属性",
        width:430,
        height:350,
        layout:'fit',
        modal:true,
        items: [formPanel],
        bbar:[
            new Ext.Toolbar.Fill(),
            new Ext.Button ({
                id:'external.update.win.info',
                text : '修改',
                formBind:true,
                allowDepress : false,
                handler : function() {
                    if (formPanel.form.isValid()) {
                        Ext.MessageBox.show({
                    		title:'信息',
                            width:200,
                            msg:'确定要修改?',
                            animEl:'external.update.win.info',
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
			                                    msg:msg,
			                                    animEl:'external.update.win.info',
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
                            animEl:'external.update.win.info',
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
 * 通用代理非可信端修改数据属性--业务管理员
 */
function external_update_proxy_data_source_win(){
    var grid = Ext.getCmp('grid.proxy.external.info');
    var store = Ext.getCmp('grid.proxy.external.info').getStore();
    var selModel = grid.getSelectionModel();
    var formPanel;
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
            formPanel = new Ext.form.FormPanel({
                labelWidth:120,
                frame:true,
                labelAlign:'right',
                defaults : {
					width : 200,
					allowBlank : false,
					blankText : '该项不能为空！'
				},
                items:[{
                	width:380,
                    title:'源端属性配置  -- 使用说明',
                    xtype:'fieldset',
                    html:"<font color='green'>1.编码和类型项要与目标端保持一致！</font>"
                },{
                	xtype:'hidden',
                	name:'typeBase.privated',
                	value:false
                },{
                	xtype:'hidden',
                	name:'typeBase.appName',
                	value:item.data.appName
                },{
                    xtype:'hidden',
                	name:'typeBase.plugin',
                	value:item.data.plugin
                },{
                    fieldLabel:'应用服务地址',   //ip
                    xtype:'textfield',
                    name:'typeData.serverAddress',
                    value:item.data.serverAddress,
                    regex:/^(((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9]))$/,
                    regexText:'这个不是IP',
                    emptyText:'请输入IP'
                },{
                    fieldLabel:'应用服务端口',
                    xtype:'textfield',
                    name:'typeData.port',
                    value:item.data.port,
                    regex:/^((6553[0-6]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{3})|(6553[0-6]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{3})[:](6553[0-6]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{3}))$/,
                    regexText:'这个不是端口类型1000~65536或者1000:65536',
                    emptyText:'请输入端口1000~65536或者1000:65536'
                },{
                    fieldLabel:'最小连接数',
                    xtype:'textfield',
                    name:'typeData.poolMin',
                    value:item.data.poolMin,
                    regex:/^([1-9][0-9]{0,2})$/,
                    regexText:'这个不是1~999之间的数字',
                    emptyText:'请输入1~999'
                },{
                    fieldLabel:'最大连接数',
                    xtype:'textfield',
                    name:'typeData.poolMax',
                    value:item.data.poolMax,
                    regex:/^([1-9][0-9]{0,2})$/,
                    regexText:'这个不是1~999之间的数字',
                    emptyText:'请输入1~999'
                },{
                    fieldLabel:'重试次数',
                    xtype:'textfield',
                    name:'typeData.tryTime',
                    value:item.data.tryTime,
                    regex:/^(100|[1-9][0-9]|[0-9])$/,
                    regexText:'这个不是0~100之间的数字',
                    emptyText:'请输入0~100之间的数字'
                },{
                    fieldLabel:"编码", hiddenName:'typeData.charset',value:item.data.charset,
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
                    fieldLabel:"类型", hiddenName:'typeData.type',value:item.data.type,
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
        title:"修改信息-非可信通用代理数据属性",
        width:410,
        height:355,
        layout:'fit',
        modal:true,
        items: [formPanel],
        bbar:[
            new Ext.Toolbar.Fill(),
            new Ext.Button ({
                id:'external.update.win.info',
                text : '修改',
                formBind:true,
                allowDepress : false,
                handler : function() {
                    if (formPanel.form.isValid()) {
                        Ext.MessageBox.show({
                    		title:'信息',
                            width:200,
                            msg:'确定要修改?',
                            animEl:'external.update.win.info',
                            buttons:{'ok':'确定','no':'取消'},
                            icon:Ext.MessageBox.QUESTION,
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
			                                    msg:msg,
			                                    animEl:'external.update.win.info',
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
                            animEl:'external.update.win.info',
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
 * 通用代理非可信端纤细查看应用--业务管理员
 */
function external_detail_proxy_win(){
    var grid = Ext.getCmp('grid.proxy.external.info');
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
                    fieldLabel:'通道端口',
                    value:item.data.channelport
                },{
                    fieldLabel:'启用状态',
                    value:showURL_isActive(item.data.isActive)
                },{
                    fieldLabel:'应用服务地址',
                    value:item.data.serverAddress
                },{
                    fieldLabel:'应用服务端口',
                    value:item.data.port
                },{
                    fieldLabel:'最小连接数',
                    value:item.data.poolMin
                },{
                    fieldLabel:'最大连接数',
                    value:item.data.poolMax
                },{
                    fieldLabel:'编码',
                    value:item.data.charset
                },{
                    fieldLabel:'重试次数',
                    value:item.data.tryTime
                },{
                    fieldLabel:'类型',
                    value:item.data.type
                }]
            });
        });
    }
    var win = new Ext.Window({
        title:"详细信息-非可信通用代理",
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