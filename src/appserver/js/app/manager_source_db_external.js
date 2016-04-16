
/********************************************* -- external function -- ******************************************************************************/

/**
 * 源端新增数据库同步应用
 * @param grid
 * @param store
 */
function external_insert_db_win(grid,store){
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
        labelWidth:150,
        defaults:{
            width:240,
            allowBlank:false,
            blankText:'该项不能为空！'
        },
        items:[{
            fieldLabel:"应用源类型",
            xtype:'displayfield',
            value:'数据源'
        },{
            id:"external.plugin.info",
            xtype:'hidden',
            name:'typeBase.plugin',
            value:'1'
        },{
            fieldLabel:"配置类型",
            xtype:'displayfield',
            value:'非可信'
        },{
            xtype:'hidden',
            name:'typeBase.privated',
            value: false
        },{
            fieldLabel:"应用类型",
            xtype:'displayfield',
            value:'数据库同步'
        },{
            xtype:'hidden',
            name:'typeBase.appType',
            value:'db'
        },{
            id:'appName.external.info',
            fieldLabel:"应用编号",
            xtype:'textfield',
            name:'typeBase.appName',
            regex:/^\w{2,30}$/,
            regexText:'请输入2--30个只能包含字母、数字、下划线和汉字中的任意字符',
            emptyText:'请输入2--30个字符,只能包含字母、数字、下划线和汉字中的任意字符',
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
                                if(json.msg != '0000'){
                                    Ext.MessageBox.show({
                                        title:'信息',
                                        msg:'<font color="red">'+json.msg+'</font>',
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
            regex:/^(7700|7[0-6][0-9]{2}|6[7-9][0-9]{2})$/,
            regexText:'这个不是端口类型6700~7700',
            emptyText:'请输入端口6700~7700',
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
            }
        },{
        	id:'external.dataPath.info',
            fieldLabel:'数据文件存放目录',
            xtype:'textfield',
            name:'typeBase.dataPath',
            value:'/usr/app/stp/data',
            regex:/^([\/].*)*$/,
		    regexText:'这个不是目录',
		    emptyText:'请输入目录'
        },{
        	id:'external.deleteFile.info',
            fieldLabel:"数据写入文件",
            layout:'column',
            defaultType: 'radio',
            items: [
                { width:50, boxLabel: '是', name: 'typeBase.deleteFile', inputValue: true,  checked: true },
                { width:50, boxLabel: '否', name: 'typeBase.deleteFile', inputValue: false }
            ]
        },{
        	id:'external.recover.info',
            fieldLabel:"执行恢复操作",
            layout:'column',
            defaultType: 'radio',
            items: [
                { width:50, boxLabel: '是', name: 'typeBase.recover', inputValue: true,  checked: true },
                { width:50, boxLabel: '否', name: 'typeBase.recover', inputValue: false }
            ]
        },{
            id:'external.speed.info',
            fieldLabel:"源端发送速度(毫秒)", name:'typeBase.speed',
            xtype:'numberfield',
            value:3000,
		    emptyText:'请输入整数'
        }]
    });
    //远端属性配置
    var form2 = new Ext.form.FormPanel({
        id:'card-1',
        frame:true,
        labelAlign:'right',
        labelWidth:170,
        defaults:{
            width:220,
            allowBlank:false,
            blankText:'该项不能为空！'
        },
        items:[{
        	width:400,
            title:'源端属性配置  -- 使用说明',
            xtype:'fieldset',
            html:"<font color='green'>1.所有有效项为必填项;<br>2.保存成功后,可点击’<strong>源表</strong>‘添加数据表集合！</font>"
        },{
			id:'tbfs.combo.info',
            fieldLabel:"同步方式", hiddenName:'typeDB.operation',
            xtype:'combo',
            mode:'local',
            emptyText :'--请选择--',
            editable : false,
            typeAhead:true,
            forceSelection: true,
            triggerAction:'all',
            displayField:"key",valueField:"value",
            store:storeSynchronizeMethod,
            listeners:{
            	select:function(){
	                var value = this.getValue();
	                if(value == 'trigger'){
	                	Ext.getCmp('tbybyczdsj.checkbox.info').enable();
	                	Ext.getCmp('external.fzbm.textfield.info').enable();
	                }else{
	                	Ext.getCmp('tbybyczdsj.checkbox.info').disable();
	                	Ext.getCmp('external.fzbm.textfield.info').disable();
	                	Ext.getCmp('external.fzbm.textfield.info').setValue('');
	                }
	            }
            }
        },{
            id:'tbybyczdsj.checkbox.info',
            fieldLabel:"同步原表已存在的数据",
            defaultType: 'radio',
            layout:'column',
            disabled:true,
            items: [
                { width:50, boxLabel: '是', name: 'typeDB.oldStep', inputValue: true},
                { width:50, boxLabel: '否', name: 'typeDB.oldStep', inputValue: false,  checked: true  }
            ]
        },{
            xtype:'hidden',
            name: 'typeDB.isTwoway',
            value: false
        },{
            id:'external.combo.dbName.info',
            fieldLabel:"数据源", hiddenName:'typeDB.dbName',
            xtype:'combo',
            mode:'local',
            emptyText :'--请选择--',
            editable : false,
            typeAhead:true,
            forceSelection: true,
            triggerAction:'all',
            displayField:"key",valueField:"value",
            store:storeSource
        },{
        	id:'external.fzbm.textfield.info',
            fieldLabel:'临时表表名',
            xtype:'textfield',
            disabled:true,
            name:'typeDB.tempTable',
            regex:/^.{2,30}$/,
            regexText:'请输入任意2--30个字符',
            emptyText:'请输入任意2--30个字符',
            listeners:{
                blur:function(){
                    var dbName = Ext.getCmp('external.combo.dbName.info').getValue();
                    var tempTable = this.getValue();
                    if(dbName.length>0&& tempTable.length>0){
                        var myMask = new Ext.LoadMask(Ext.getBody(),{
                            msg : '正在校验,请稍后...',
                            removeMask : true
                        });
                        myMask.show();
                        Ext.Ajax.request({
                            url:'../../DBTypeAction_checkTempTable.action',
                            params:{tempTable:tempTable,typeXml:'external',dbName:dbName},
                            method:'POST',
                            success:function(action){
                                var json = Ext.decode(action.responseText);
                                myMask.hide();
                                if(json.msg != '0000'){
                                    Ext.MessageBox.show({
                                        title:'信息',
                                        msg:'<font color="red">'+json.msg+'</font>',
                                        animEl:'external.fzbm.textfield.info',
                                        width:250,
                                        buttons:{'ok':'确定'},
                                        icon:Ext.MessageBox.ERROR,
                                        closable:false,
                                        fn:function(e){
                                            if(e=='ok'){
                                                Ext.getCmp('external.fzbm.textfield.info').setValue('');
                                            }
                                        }
                                    });
                                }
                            }
                        });
                    }else if(dbName!=''&&tempTable==''){
                        Ext.MessageBox.show({
                            title:'信息',
                            msg:'<font color="red">临时表为空,请先输入临时表名!</font>',
                            animEl:'external.fzbm.textfield.info',
                            width:250,
                            buttons:{'ok':'确定'},
                            icon:Ext.MessageBox.ERROR,
                            closable:false
                        });
                    }else if(dbName==''&&tempTable!=''){
                        Ext.MessageBox.show({
                            title:'信息',
                            msg:'<font color="red">数据源为空,请先选择数据源!</font>',
                            animEl:'external.fzbm.textfield.info',
                            width:250,
                            buttons:{'ok':'确定'},
                            icon:Ext.MessageBox.ERROR,
                            closable:false,
                            fn:function(e){
                                if(e=='ok'){
                                    Ext.getCmp('external.fzbm.textfield.info').setValue('');
                                }
                            }
                        });
                    }
                }
            }
        },{
            fieldLabel:'单次传输最大记录',
            xtype:'textfield',
            name:'typeDB.maxRecords',
            regex:/^([0-9]{0,3})$/,
		    regexText:'这个不是0~999之间的数字',
		    emptyText:'请输入0~999'
        },{
            fieldLabel:'传输频率（单位:秒）',
            xtype:'textfield',
            name:'typeDB.interval',
            regex:/^([0-9]{0,2})$/,
		    regexText:'这个不是0~99之间的数字',
		    emptyText:'请输入0~99'
        },{
            fieldLabel:"启用数据表",
            layout:'column',
            defaultType: 'radio',
            items: [
                { width:50, boxLabel: '是', name: 'typeDB.enable', inputValue: true,  checked: true },
                { width:50, boxLabel: '否', name: 'typeDB.enable', inputValue: false }
            ]
        }]
    });
    var card = new Ext.Panel({
        id:'card-wizard-panel',
        layout:'card',
        activeItem:0,
        layoutConfig:{
            animate:true
        },
        bbar:[
            '->',
            {
                id:'card-prev',
                text:'上一页',
                handler:external_CardNav.createDelegate(this,[-1]),
                disabled:true
            },
            {
                id:'card-next',
                text:'下一页',
                handler:external_CardNav.createDelegate(this,[+1])
            },
            {
                id: "card-finish",
                text: "保存",
                handler: function() {
                    if (form1.form.isValid()&&form2.form.isValid()) {
                        var appName = Ext.getCmp('appName.external.info').getValue();
                        var appDesc = Ext.getCmp('external.appDesc.info').getValue();
                        var channel = Ext.getCmp('external.combo.channel.info').getValue();
                        var channelport = Ext.getCmp('external.channelport.info').getValue();
                        var dataPath = Ext.getCmp('external.dataPath.info').getValue();
                        var deleteFile = setGroupRadio('external.deleteFile.info','typeBase.deleteFile',0);
                        var recover = setGroupRadio('external.recover.info','typeBase.recover',0);
                        var speed = Ext.getCmp('external.speed.info').getValue();
                        form2.getForm().submit({
                            url:'../../DBTypeAction_insert.action',
                            params:{
                                appName:appName,appDesc:appDesc,privated:false,plugin:'1',appType:'db',channel:channel,channelport:channelport,
                                dataPath:dataPath,isActive:false,deleteFile:deleteFile,recover:recover,speed:speed
                            },
                            method :'POST',
                            waitTitle :'系统提示',
                            waitMsg :'正在保存,请稍后...',
                            success : function(form,action) {
                                var msg = action.result.msg;
                                Ext.MessageBox.show({
                                    title:'信息',
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
            }
        ],
        items:[form1,form2]
    });
    var win = new Ext.Window({
        title:"新增信息",
        width:480,
        height:420,
        layout:'fit',
        modal:true,
        items:card
    }).show();
}

function external_CardNav(incr){
    var cardPanel = Ext.getCmp('card-wizard-panel').getLayout();
    var i = cardPanel.activeItem.id.split('card-')[1];
    var next = parseInt(i)+incr;
    cardPanel.setActiveItem(next);
    Ext.getCmp('card-prev').setDisabled(next==0);
    Ext.getCmp('card-next').setDisabled(next==1);
}

/**
 * 源端数据库 删除应用
 */
function external_delete_db_row(){
    var grid = Ext.getCmp('grid.db.external.info');
    var store = grid.getStore();
    var selModel = grid.getSelectionModel();
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
            var appName = item.data.appName;
            var appType = item.data.appType;
            Ext.MessageBox.show({
                title:'信息',
                msg:'<font color="green">确定要删除'+appName+'应用？同时会删除目标端应用!</font>',
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
                            url : '../../DBTypeAction_delete.action',
                            params :{appName : appName,plugin : 'external',deleteType:2},
                            success : function(r,o){
                                myMask.hide();
                                var respText = Ext.util.JSON.decode(r.responseText);
                                var msg = respText.msg;
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
                                            var ingrid = Ext.getCmp('grid.db.internal.info');
                                            ingrid.render();
                                            ingrid.getStore().reload();
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
 * 源端数据库 修改应用属性
 */
function external_update_db_source_app_win(){

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
    var grid = Ext.getCmp('grid.db.external.info');
    var store = Ext.getCmp('grid.db.external.info').getStore();
    var selModel = grid.getSelectionModel();
    var formPanel;
    var appName;
    var operation;
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
            appName = item.data.appName;
            operation = item.data.operation;
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
					width : 240,
					allowBlank : false,
					blankText : '该项不能为空！'
				},
				items : [{
                    fieldLabel:"应用源类型",value:external_showURL_plugin(item.data.plugin),
                    id:"external.plugin.info",
                    xtype:'displayfield'
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
                    xtype:'hidden',
                    name:'typeBase.appName',
                    value:item.data.appName
                },{
                    id:'external.appDesc.update.info',
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
                    regex:/^(7700|7[0-6][0-9]{2}|6[7-9][0-9]{2})$/,
                    regexText:'这个不是端口类型6700~7700',
                    emptyText:'请输入端口6700~7700',
                    listeners:{
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
                    }
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
                },{
                    fieldLabel:"源端发送速度(毫秒)", name:'typeBase.speed',
                    xtype:'numberfield',
                    value:item.data.speed,
                    emptyText:'请输入整数'
                }]
            });
        });
    }
    var win = new Ext.Window({
        title:"修改信息",
        width:500,
        height:410,
        layout:'fit',
        modal:true,
        items: [formPanel],
        bbar:[
            new Ext.Toolbar.Fill(),
            new Ext.Button ({
                id:'external.update.app.win.info',
                text : '修改',
                formBind:true,
                allowDepress : false,
                handler : function() {
//                    var dbName = Ext.getCmp('comboVendor.external.info').getValue();
                    if (formPanel.form.isValid()) {
                        Ext.MessageBox.show({
                    		title:'信息',
                            width:200,
                            msg:'确定要修改?',
                            animEl:'external.update.app.win.info',
                            buttons:{'ok':'确定','no':'取消'},
                            icon:Ext.MessageBox.WARNING,
                            closable:false,
                            fn:function(e){
                            	if(e=='ok'){
                            		formPanel.getForm().submit({
			                            url :'../../DBTypeAction_updateSourceApp.action',
			                            method :'POST',
			                            waitTitle :'系统提示',
			                            waitMsg :'正在修改,请稍后...',
			                            success : function(form,action) {
			                                Ext.MessageBox.show({
			                                    title:'信息',
			                                    width:260,
			                                    msg:action.result.msg,
			                                    animEl:'external.update.app.win.info',
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
                            animEl:'external.update.app.win.info',
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
 * 源端数据库 修改数据属性
 */
function external_update_db_source_data_win(){
    var sourceRecord = new Ext.data.Record.create([
		{name:'value',mapping:'value'},
		{name:'key',mapping:'key'}
	]);
    var sourceReader = new Ext.data.JsonReader({ totalProperty:'total',root:"rows"},sourceRecord);
	var storeSource = new Ext.data.Store({
		url:'../../JdbcAction_readJdbcName.action?typeXml=external',
		reader:sourceReader,
        listeners : {
			load : function(){
				var value = Ext.getCmp('update.dbName.info').getValue();
				Ext.getCmp('update.dbName.info').setValue(value);
			}
		}
	});
	storeSource.load();
    var grid = Ext.getCmp('grid.db.external.info');
    var store = grid.getStore();
    var selModel = grid.getSelectionModel();
    var formPanel;
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
            var oldStep  = item.data.oldStep;
            var enable   = item.data.enable;
            var dbName   = item.data.dbName;
            var oldStepT;
            var oldStepF;
            var enableT;
            var enableF;
            if(oldStep == 'true'){
                oldStepT = true;
                oldStepF = false;
            }else if(oldStep =='false'){
                oldStepT = false;
                oldStepF = true;
            }
            if(enable == 'true'){
                enableT = true;
                enableF = false;
            }else if(enable =='false'){
                enableT = false;
                enableF = true;
            }
            formPanel = new Ext.form.FormPanel({
                labelWidth:190,
                frame:true,
                labelAlign:'right',
                defaults : {
					width : 200,
					allowBlank : false,
					blankText : '该项不能为空！'
				},
				items:[{
                    id:'update.appName.info',
                    name:'typeBase.appName',
                    xtype:'hidden',
                    value:item.data.appName
                },{
                    name:'typeBase.appType',
                    xtype:'hidden',
                    value:item.data.appType
                /*},{
                    id:'update.dbName.info',
                    name:'typeDB.dbName',
                    xtype:'hidden',
                    value:item.data.dbName*/
                },{
                    xtype:'hidden',
                    name:'typeBase.privated',
                    value:false
                },{
                    xtype:'hidden',
                    name:'beforeUpdate',
                    value:item.data.operation
                },{
                    id:'update.tbfs.combo.info',
                    fieldLabel:"同步方式", hiddenName:'typeDB.operation',value:item.data.operation,
                    xtype:'combo',
                    mode:'local',
                    emptyText :'--请选择--',
                    editable : false,
                    typeAhead:true,
                    forceSelection: true,
                    triggerAction:'all',
                    displayField:"key",valueField:"value",
                    store:storeSynchronizeMethod,
                    listeners:{
                        select:function(){
                            var value = this.getValue();
                            if(value == 'trigger'){
                                Ext.getCmp('tbybyczdsj.checkbox.info').enable();
                                Ext.getCmp('external.update.fzbm.textfield.info').enable();
                            }else{
                                Ext.getCmp('tbybyczdsj.checkbox.info').disable();
                                Ext.getCmp('external.update.fzbm.textfield.info').disable();
                                Ext.getCmp('external.update.fzbm.textfield.info').setValue('');
                            }
                        }
                    }
                },{
                    id:'tbybyczdsj.checkbox.info',
                    fieldLabel:"同步原表已存在的数据",
                    defaultType: 'radio',
                    layout:'column',
                    disabled:true,
                    items: [
                        { width:50, boxLabel: '是', name: 'typeDB.oldStep', inputValue: true,   checked: oldStepT  },
                        { width:50, boxLabel: '否', name: 'typeDB.oldStep', inputValue: false,  checked: oldStepF  }
                    ]
                },{
                    xtype:'hidden',
                    name: 'typeDB.isTwoway',
                    value: false
                },{
                    xtype:'hidden',
                    name:'dbNameOld',
                    value:item.data.dbName
                },{
                    id:'update.dbName.info',
                    fieldLabel:"数据源", hiddenName:'typeDB.dbName',value:dbName,
                    xtype:'combo',
                    mode:'local',
                    emptyText :'--请选择--',
                    editable : false,
                    typeAhead:true,
                    forceSelection: true,
                    triggerAction:'all',
                    displayField:"key",valueField:"value",
                    store:storeSource
                },{
                    id:'external.update.fzbm.textfield.info',
                    fieldLabel:'临时表名',value:item.data.tempTable,
                    xtype:'textfield',
                    disabled:true,
                    name:'typeDB.tempTable',
                    regex:/^.{2,30}$/,
                    regexText:'请输入任意2--30个字符',
                    emptyText:'请输入任意2--30个字符',
                    listeners:{
                        blur:function(){
                            var tempTable = this.getValue();
                            if(tempTable.length>0){
                                var myMask = new Ext.LoadMask(Ext.getBody(),{
                                    msg : '正在校验,请稍后...',
                                    removeMask : true
                                });
                                myMask.show();
                                var _dbName = Ext.getCmp('update.dbName.info');
                                Ext.getCmp('external.update.data.win.info').setDisabled(true);
                                Ext.Ajax.request({
                                    url:'../../DBTypeAction_checkTempTable.action',
                                    params:{tempTable:tempTable,typeXml:'external',dbName:_dbName},
                                    method:'POST',
                                    success:function(action){
                                        var json = Ext.decode(action.responseText);
                                        myMask.hide();
                                        if(json.msg != '0000'){
                                            Ext.MessageBox.show({
                                                title:'信息',
                                                msg:'<font color="red">'+json.msg+'</font>',
                                                animEl:'external.update.fzbm.textfield.info',
                                                width:250,
                                                buttons:{'ok':'确定'},
                                                icon:Ext.MessageBox.ERROR,
                                                closable:false,
                                                fn:function(e){
                                                    if(e=='ok'){
                                                        Ext.getCmp('external.update.fzbm.textfield.info').setValue('');

                                                    }
                                                }
                                            });
                                        } else {
                                            Ext.getCmp('external.update.data.win.info').setDisabled(false);
                                        }
                                    }
                                });
                            }else if(tempTable== '' || tempTable == null){
                                Ext.MessageBox.show({
                                    title:'信息',
                                    msg:'<font color="red">临时表为空,请先输入临时表名!</font>',
                                    animEl:'external.fzbm.textfield.info',
                                    width:250,
                                    buttons:{'ok':'确定'},
                                    icon:Ext.MessageBox.ERROR,
                                    closable:false
                                });
                            }
                        }
                    }
                },{
                    fieldLabel:'单次传输最大记录',value:item.data.maxRecords,
                    xtype:'textfield',
                    name:'typeDB.maxRecords',
                    regex:/^([0-9]{0,3})$/,
                    regexText:'这个不是0~999之间的数字',
                    emptyText:'请输入0~999'
                },{
                    fieldLabel:'传输频率（单位:秒）',value:item.data.interval,
                    xtype:'textfield',
                    name:'typeDB.interval',
                    regex:/^([0-9]{0,2})$/,
                    regexText:'这个不是0~99之间的数字',
                    emptyText:'请输入0~99'
                },{
                    fieldLabel:"启用数据表",
                    layout:'column',
                    defaultType: 'radio',
                    items: [
                        { width:50, boxLabel: '是', name: 'typeDB.enable', inputValue: true,  checked: enableT },
                        { width:50, boxLabel: '否', name: 'typeDB.enable', inputValue: false, checked: enableF }
                    ]
                }]
            });
        });
    }
    var win = new Ext.Window({
        title:"修改信息 - 非可信数据源数据",
        width:480,
        height:300,
        layout:'fit',
        modal:true,
        items: [formPanel],
        bbar:[
            new Ext.Toolbar.Fill(),
            new Ext.Button ({
                id:'external.update.data.win.info',
                text : '修改',
                formBind:true,
                allowDepress : false,
                handler : function() {
                    var appName = Ext.getCmp('update.appName.info').getValue();
                    var dbName = Ext.getCmp('update.dbName.info').getValue();
                    var operation = Ext.getCmp('update.tbfs.combo.info').getValue();
                    if (formPanel.form.isValid()) {
                        Ext.MessageBox.show({
                    		title:'信息',
                            width:200,
                            msg:'确定要修改?',
                            animEl:'external.update.data.win.info',
                            buttons:{'ok':'确定','no':'取消'},
                            icon:Ext.MessageBox.WARNING,
                            closable:false,
                            fn:function(e){
                            	if(e=='ok'){
                            		formPanel.getForm().submit({
			                            url :'../../DBTypeAction_updateSourceData.action',
			                            method :'POST',
			                            waitTitle :'系统提示',
			                            waitMsg :'正在修改,请稍后...',
			                            success : function(form,action) {
			                                Ext.MessageBox.show({
			                                    title:'信息',
			                                    width:250,
			                                    msg:action.result.msg,
			                                    animEl:'external.update.data.win.info',
			                                    buttons:{'ok':'确定','no':'取消'},
			                                    icon:Ext.MessageBox.INFO,
			                                    closable:false,
			                                    fn:function(e){
			                                        if(e=='ok'){
                                                        grid.render();
                                                        store.reload();
                                                        win.close();
                                                        external_detail_db_attribute_source(appName,dbName,operation);
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
                            animEl:'external.update.data.win.info',
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
        listeners:{
            show:function(){
                var value = Ext.getCmp('update.tbfs.combo.info').getValue();
                if(value == 'trigger'){
                    Ext.getCmp('tbybyczdsj.checkbox.info').enable();
                    Ext.getCmp('external.update.fzbm.textfield.info').enable();
                }else{
                    Ext.getCmp('tbybyczdsj.checkbox.info').disable();
                    Ext.getCmp('external.update.fzbm.textfield.info').disable();
                    Ext.getCmp('external.update.fzbm.textfield.info').setValue('');
                }
            }
        }
    }).show();
}

/**
 * 源端数据库 详细信息
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
					width : 150,
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
                    fieldLabel:'通道端口',
                    value:item.data.channelport
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
                }]
            });
        });
    }
    var win = new Ext.Window({
        title:"详细信息-非可信认证代理",
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
 * 操作数据库
 */
function external_operate_db(appName){
    Ext.MessageBox.show({
        title:'信息',
        msg:'<font color="green">确定要操作所选记录对应的数据库？</font>',
        width:300,
        buttons:{'ok':'确定','no':'取消'},
        icon:Ext.MessageBox.INFO,
        closable:false,
        fn:function(e){
            if(e == 'ok'){
                var myMask = new Ext.LoadMask(Ext.getBody(),{
                    msg : '正在处理,请稍后',
                    removeMask : true
                });
                myMask.show();
                Ext.Ajax.request({
                    url : '../../DBTypeAction_operateDB.action',
                    params :{appName : appName,typeXml:'external'},
                    method:'POST',
                    success : function(r,o){
                        var respText = Ext.util.JSON.decode(r.responseText);
                        var msg = respText.msg;
                        myMask.hide();
                        Ext.MessageBox.show({
                            title:'信息',
                            msg:msg,
                            buttons:{'ok':'确定','no':'取消'},
                            icon:Ext.MessageBox.INFO,
                            closable:false,
                            fn:function(e){
                                if(e=='ok'){
                                    Ext.getCmp('grid.db.external.info').render();
                                    Ext.getCmp('grid.db.external.info').getStore().reload();
                                }
                            }
                        });
                    }
                });
            }
        }
    });
}

/**
 * 数据源 表集合 查找
 */
function external_detail_db_attribute_source(appName,dbName,operation){
    var external_grid = Ext.getCmp('grid.db.external.info');
    var external_store = external_grid.getStore();
    var selModel = external_grid.getSelectionModel();
//    var appName;
//    var dbName;
//    var operation;
//    if(selModel.hasSelection()){
//        var selections = selModel.getSelections();
//        Ext.each(selections,function(item){
//        	appName = item.data.appName;
//            dbName = item.data.dbName;
//            operation = item.data.operation;
//        });
//    }
    var start = 0;			//分页--开始数
    var pageSize = 100;		//分页--每页数
    var record = new Ext.data.Record.create([
        {name:'tableName',mapping:'tableName'},
        {name:'seqnumber',mapping:'seqnumber'},
        {name:'interval',     mapping:'interval'},
        {name:'monitorinsert',mapping:'monitorinsert'},
        {name:'monitordelete',mapping:'monitordelete'},
        {name:'monitorupdate',mapping:'monitorupdate'},
        {name:'status',mapping:'status'}
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
	store.load({
        params:{
            start:start,limit:pageSize,appName:appName,dbName:dbName
        }
    });
    var boxM = new Ext.grid.CheckboxSelectionModel();   //复选框
    var rowNumber = new Ext.grid.RowNumberer();         //自动 编号
    var colM = new Ext.grid.ColumnModel([
        boxM,
        rowNumber,
        {header:"表名",dataIndex:"tableName",align:'center',menuDisabled:true,sortable:true},
        {header:"同步顺序",dataIndex:"seqnumber",align:'center',menuDisabled:true,sortable:true},
        {header:"表频率",dataIndex:"interval",align:'center',sortable:true},
        {header:"触发增加",dataIndex:"monitorinsert",align:'center',sortable:true,renderer:external_showURL_is},
        {header:"触发删除",dataIndex:"monitordelete",align:'center',sortable:true,renderer:external_showURL_is},
        {header:"触发修改",dataIndex:"monitorupdate",align:'center',sortable:true,renderer:external_showURL_is},
        {header:"操作标记",dataIndex:"status",align:'center',menuDisabled:true,sortable:true,      renderer:external_showURL_table_source_attribute_flag,     width:200}

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
//        enableDragDrop: true,
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
                id:'btnAdd.db.external.source.table.info',
                text:'新增',
                iconCls:'add',
                handler:function(){
                    external_insert_read_db_source_tables();
                }
            }),
            {xtype:"tbseparator"},
			new Ext.Button ({
			    id : 'btnRemove.db.external.source.table.info',
                text : '删除',
				iconCls : 'remove',
				handler : function() {
					external_delete_db_source_tables(grid,store,appName,dbName);
				}
            })
        ],
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
            }
        },
        items: [grid]
    }).show();
    function external_showURL_table_source_attribute_flag(value,p,r){
        if(value=='delete'){
            var tableName = r.get('tableName');
            return "<a href='javascript:;' style='color: green;' onclick='external_update_db_source_attribute_delete_back(\""+appName+"\",\""+dbName+"\",\""+tableName+"\");'>删除恢复</a>";
        }
        return "<a href='javascript:;' style='color: green;' onclick='external_update_db_source_attribute(\""+appName+"\",\""+dbName+"\",\""+operation+"\");'>修改表属性</a>";
    }
}

/**
 * 数据源 表集合 增加 -- 选择 源表
 */
function external_insert_read_db_source_tables(){
    var external_grid = Ext.getCmp('grid.db.external.info');
    var external_store = external_grid.getStore();
    var selModel = external_grid.getSelectionModel();
    var appName;
    var dbName;
    var operation;
    var tempTable;
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
        	appName = item.data.appName;
            dbName = item.data.dbName;
            operation = item.data.operation;
            tempTable = item.data.tempTable;
        });
    }
	//==================================== -- 同步表选择 -- =============================================================
    var start = 0;			//分页--开始数
    var pageSize = 100;		//分页--每页数
    var record = new Ext.data.Record.create([
        {name:'tableName',mapping:'tableName'},
        {name:'index',mapping:'index'},
        {name:'flag',mapping:'flag'}
    ]);
    var proxy = new Ext.data.HttpProxy({
        url:"../../DBSourceTableAction_readSourcedDBName.action"
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
            start:start,limit:pageSize,dbName:dbName,appName:appName,typeXml:'external'
        }
    });
    var boxM = new Ext.grid.CheckboxSelectionModel();   //复选框
    var rowNumber = new Ext.grid.RowNumberer();         //自动 编号
    var colM = new Ext.grid.ColumnModel([
        boxM,
        rowNumber,
        {header:"表名",dataIndex:"tableName",align:'center',sortable:true,menuDisabled:true,width:300},
        {header:"同步顺序",dataIndex:"index",align:'center',sortable:true,menuDisabled:true,width:50},
        {header:"操作标记",dataIndex:"flag",align:'center',sortable:true, menuDisabled:true,renderer:external_showURL_tableAttribute_flag}

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
        id:'grid.table.external.info',
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
//        enableDragDrop: true,
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
        title:"新增信息-数据源"+dbName+"下表属性设置",
        width:600,
        height:330,
        layout:'fit',
        modal:true,
        items: [grid]
    }).show();
    function external_showURL_tableAttribute_flag(value){
        return "<a href='javascript:;' style='color: green;' onclick='external_insert_set_db_source_attribute(\""+appName+"\",\""+dbName+"\",\""+operation+"\",\""+tempTable+"\");'>表属性设置</a>";
    }
}

/**
 * 数据源 表集合 增加 -- 选择 源表属性
 * @param appName
 * @param dbName
 * @param operation
 * @param tempTable
 */
function external_insert_set_db_source_attribute(appName,dbName,operation,tempTable){
	var source_table_grid = Ext.getCmp('grid.table.external.info');
    var source_table_store = source_table_grid.getStore();
    var selModel = source_table_grid.getSelectionModel();
    var tableName;
    var index;
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
        	tableName = item.data.tableName;
            index = item.data.index;
        });
    }
	//==================================== --  -- =============================================================
    var record = new Ext.data.Record.create([
        {name:'field',			mapping:'field'},
        {name:'is_null',		mapping:'is_null'},
        {name:'column_size',	mapping:'column_size'},
        {name:'db_type',		mapping:'db_type'},
        {name:'jdbc_type',	mapping:'jdbc_type'},
        {name:'is_pk',			mapping:'is_pk'}
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

    var is_pk = new Ext.form.ComboBox({
        id:'external.is_pk.info',
        listWidth : 170,
        store :  new Ext.data.SimpleStore({
            fields : ['value', 'key'],
            data : [['true','是'],['false','否']]
        }),
        valueField : 'value',
        displayField : 'key',
        typeAhead : true,
        mode : 'local',
        triggerAction : 'all',
        selectOnFocus : true,
        allowBlank : false
    });
    var jdbc_type = new Ext.form.ComboBox({
        id:'external.jdbc_type.info',
        listWidth : 170,
        store :  new Ext.data.SimpleStore({
            fields : ['value', 'key'],
            data : [['date','date'],['timestamp','timestamp']]
        }),
        valueField : 'value',
        displayField : 'key',
        typeAhead : true,
        mode : 'local',
        triggerAction : 'all',
        selectOnFocus : true,
        editable:true,
        allowBlank : false
    });
    var db_type = new Ext.form.ComboBox({
        id:'external.db_type.info',
        listWidth : 170,
        store :  new Ext.data.SimpleStore({
            fields : ['value', 'key'],
            data : [['date','date'],['timestamp','timestamp']]
        }),
        valueField : 'value',
        displayField : 'key',
        typeAhead : true,
        mode : 'local',
        triggerAction : 'all',
        selectOnFocus : true,
        editable:true,
        allowBlank : false
    });
    var start = 0;
    var pageSize = 10;
    var SelectMap = new Map();
    var boxM = new Ext.grid.CheckboxSelectionModel(/*{
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
    var rowNumber = new Ext.grid.RowNumberer();         //自动 编号
    var colM = new Ext.grid.ColumnModel([
        boxM,
        rowNumber,
        {header:"字段名",	   dataIndex:"field",	align:'center',menuDisabled:true,sortable:true},
        {header:"主键",	   dataIndex:"is_pk",		align:'center',sortable:true,editor:is_pk,renderer:external_showURL_is_pk},
        {header:"为空",	   dataIndex:"is_null",		align:'center',sortable:true},
        {header:"长度",	   dataIndex:"column_size",		align:'center',sortable:true},
        {header:"Jdbc类型",	   dataIndex:"jdbc_type",	align:'center',menuDisabled:true,sortable:true,editor:jdbc_type},
        {header:"DB类型",	   dataIndex:"db_type",		align:'center',menuDisabled:true,sortable:true,editor:db_type}

    ]);
    colM.defaultSortable = true;
    colM.setHidden(4,!colM.isHidden(4));
    colM.setHidden(5,!colM.isHidden(5));
    var grid = new Ext.grid.EditorGridPanel({
        id:'external_read_db_source_tables.grid.info',
        plain:true,
        animCollapse:true,
        autoScroll:true,
        height:310,
        loadMask:{msg:'正在加载数据，请稍后...'},
        border:false,
        heightIncrement:true,
        cm:colM,
        sm:boxM,
        store:store,
        stripeRows:true,
        autoExpandColumn:1,
        clicksToEdit:1,
        disableSelection:true,
        bodyStyle:'width:100%',
//        enableDragDrop: true,
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
    var isCheck = false;
    if(operation=='trigger'){
        isCheck = true;
    }
    var formPanel = new Ext.form.FormPanel({
        plain:true,
        labelAlign:'right',
        autoScroll:true,
        labelWidth:65,
        height:65,
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
            name:'typeDB.tempTable',
            value:tempTable
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
                    id:'save.insert.info',
                	fieldLabel:"增加",
                    xtype:'checkbox',
                    name:'monitorinsert',
                    checked:isCheck
                }]
            },{
                columnWidth:.3,
                layout:'form',
                items:[{
                	id:'save.delete.info',
                    fieldLabel:"删除",
                    xtype:'checkbox',
                    name:'monitordelete',
                    checked:isCheck
                }]
            },{
                columnWidth:.3,
                layout:'form',
                items:[{
                    id:'save.update.info',
                    fieldLabel:"修改",
                    xtype:'checkbox',
                    name:'monitorupdate',
                    checked:isCheck
                }]
            }]
        },{
            layout:'column',
            defaults:{
                allowBlank:false,
                blankText:'该项不能为空！'
            },
            items:[{
                columnWidth:.5,
                labelWidth:100,
                layout:'form',
                items:[{
                    width:100,
                    fieldLabel:"同步顺序",
                    name:'typeTable.seqnumber',
                    xtype:'textfield',
                    value:index,
                    regex:/^([1-9][0-9]{0,2})$/,
                    regexText:'这个不是1~999之间的数字',
                    emptyText:'请输入1~999之间的数字'
                }]
            },{
                columnWidth:.5,
                layout:'form',
                labelWidth:100,
                items:[{
                    width:100,
                    fieldLabel:"表频率",
                    name:'typeTable.interval',
                    xtype:'textfield',
                    value:12,
                    regex:/^([0-9]{0,2})$/,
                    regexText:'这个不是0~99之间的数字',
                    emptyText:'请输入0~99之间的数字'
                }]
            }]
        }]
    });
	var win = new Ext.Window({
        title:"数据源"+dbName+"下表"+tableName+"的属性设置",
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
            id:'external.save.db.source.tables.info',
            text:'保存',
            handler:function(){
            	var monitorinsert = Ext.getCmp('save.insert.info').getValue();
            	var monitorupdate = Ext.getCmp('save.update.info').getValue();
            	var monitordelete = Ext.getCmp('save.delete.info').getValue();
                var grid_table = Ext.getCmp('external_read_db_source_tables.grid.info');
                var store_table = Ext.getCmp('external_read_db_source_tables.grid.info').getStore();
//                var count = SelectMap.size();
               var selModel = grid_table.getSelectionModel();
               var count = selModel.getCount();
                var fields = new Array();
                var is_pks = new Array();
                var is_nulls = new Array();
                var column_sizes = new Array();
                var db_types = new Array();
                var jdbc_types = new Array();
                if(count==0){
                    Ext.MessageBox.show({
                        title:'信息',
                        msg:'<font color="green">您没有勾选任何记录!</font>',
                        animEl:'external.save.db.source.tables.info',
                        buttons:{'ok':'确定'},
                        icon:Ext.MessageBox.INFO,
                        closable:false
                    });
                }else if(count>0){
//                    var record = SelectMap.values();
                    var record = selModel.getSelections();
                    for(var i = 0; i < record.length; i++){
                        fields[i] = record[i].get('field');
                        is_pks[i] = record[i].get('is_pk');
                        is_nulls[i] = record[i].get('is_null');
                        column_sizes[i] = record[i].get('column_size');
                        jdbc_types[i] = record[i].get('jdbc_type');
                        db_types[i] = record[i].get('db_type');
                    }
                    if(count<store_table.getTotalCount()){
                        Ext.MessageBox.show({
                            title:'信息',
                            msg:'<font color="green">源表与目标表字段位数不一致!</font>',
                            animEl:'external.save.db.source.tables.info',
                            buttons:{'ok':'继续','no':'返回'},
                            icon:Ext.MessageBox.WARNING,
                            closable:false,
                            fn:function(e){
                                if(e=='ok'){
                                    if (formPanel.form.isValid()) {
                                        var flag = 0;
                                        for(var i = 0; i < is_pks.length; i++){
                                            if(is_pks[i] == 'true'){
                                                flag ++;
                                            }
                                        }
                                        if(flag==0){
                                            Ext.MessageBox.show({
                                                title:'信息',
                                                msg:'<font color="green">请确保勾选的记录中至少存在一个主键为\"是\"!</font>',
                                                animEl:'external.save.db.source.tables.info',
                                                buttons:{'ok':'返回','no':'取消'},
                                                icon:Ext.MessageBox.INFO,
                                                closable:false
                                            });
                                        }else if(flag>0){
                                            formPanel.getForm().submit({
                                                url:'../../DBSourceTableAction_saveSourceTable.action',
                                                params:{type:'source',operate:'insert',monitorinsert:monitorinsert,monitorupdate:monitorupdate,monitordelete:monitordelete,
                                                    fields:fields,is_pks:is_pks,is_nulls:is_nulls,column_sizes:column_sizes,jdbc_types:jdbc_types,db_types:db_types},
                                                method :'POST',
                                                waitTitle :'系统提示',
                                                waitMsg :'正在保存,请稍后...',
                                                success : function(form,action) {
                                                    Ext.MessageBox.show({
                                                        title:'信息',
                                                        msg:action.result.msg,
                                                        width:260,
                                                        animEl:'external.save.db.source.tables.info',
                                                        buttons:{'ok':'确定','no':'取消'},
                                                        icon:Ext.MessageBox.INFO,
                                                        closable:false,
                                                        fn:function(e){
                                                            if(e=='ok'){
                                                                source_table_grid.render();
                                                                source_table_store.reload();
                                                                win.close();
                                                                Ext.getCmp('grid.table.external.info').render();
                                                                Ext.getCmp('grid.table.external.info').getStore().reload();
                                                                Ext.getCmp('grid.table.query.source.external.info').getStore().reload();
                                                            }
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    }else{
                                        Ext.MessageBox.show({
                                            title:'信息',
                                            msg:'请填写完成再提交!',
                                            width:260,
                                            animEl:'external.save.db.source.tables.info',
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
                            var flag = 0;
                            for(var i = 0; i < is_pks.length; i++){
                                if(is_pks[i] == 'true'){
                                    flag ++;
                                }
                            }
                            if(flag==0){
                                Ext.MessageBox.show({
                                    title:'信息',
                                    msg:'<font color="green">请确保勾选的记录中至少存在一个主键为\"是\"!</font>',
                                    animEl:'external.save.db.source.tables.info',
                                    buttons:{'ok':'返回','no':'取消'},
                                    icon:Ext.MessageBox.INFO,
                                    closable:false
                                });
                            }else if(flag>0){
                                formPanel.getForm().submit({
                                    url:'../../DBSourceTableAction_saveSourceTable.action',
                                    params:{type:'source',operate:'insert',monitorinsert:monitorinsert,monitorupdate:monitorupdate,monitordelete:monitordelete,
                                        fields:fields,is_pks:is_pks,is_nulls:is_nulls,column_sizes:column_sizes,jdbc_types:jdbc_types,db_types:db_types},
                                    method :'POST',
                                    waitTitle :'系统提示',
                                    waitMsg :'正在保存,请稍后...',
                                    success : function(form,action) {
                                        Ext.MessageBox.show({
                                            title:'信息',
                                            msg:action.result.msg,
                                            width:260,
                                            animEl:'external.save.db.source.tables.info',
                                            buttons:{'ok':'确定','no':'取消'},
                                            icon:Ext.MessageBox.INFO,
                                            closable:false,
                                            fn:function(e){
                                                if(e=='ok'){
                                                    win.close();
                                                    Ext.getCmp('grid.table.external.info').render();
                                                    Ext.getCmp('grid.table.external.info').getStore().reload();
                                                    Ext.getCmp('grid.table.query.source.external.info').getStore().reload();
                                                }
                                            }
                                        });
                                    }
                                });
                            }
                        }else{
                            Ext.MessageBox.show({
                                title:'信息',
                                msg:'请填写完成再提交!',
                                width:260,
                                animEl:'external.save.db.source.tables.info',
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
            start:start,limit:pageSize,typeXml:'external',type:'insert',tableName:tableName,dbName:dbName
        }
    });
    store.addListener('load',function(){
        var size = store.getCount();
        for(var i=0;i<size;i++){
            var _record = store.getAt(i);

            boxM.selectRow(store.indexOf(_record),true);

            /*var field = _record.data.field;
            if(SelectMap.get(field)!=undefined){
                _record.set('is_pk',SelectMap.get(field).data.is_pk);
                _record.set('jdbc_type',SelectMap.get(field).data.jdbc_type);
                _record.set('db_type',SelectMap.get(field).data.db_type);
                store.commitChanges();
                boxM.selectRow(store.indexOf(_record),true);
            } else {
                boxM.selectRow(store.indexOf(_record),true);
            }*/
        }
    });
}

function external_showURL_is_pk(value){
    Ext.getCmp('external.is_pk.info').getRawValue();
    return value=='true'?'是':'否';
}

/**
 * 数据源  表集合  删除 -- 选择表
 * @param grid
 * @param store
 * @param appName
 */
function external_delete_db_source_tables(grid,store,appName,dbName){
    var selModel = grid.getSelectionModel();
    var count = selModel.getCount();
    if(count==0){
        Ext.MessageBox.show({
            title:'信息',
            msg:'<font color="green">您没有勾选任何记录!</font>',
            animEl:'btnRemove.db.external.source.table.info',
            buttons:{'ok':'确定'},
            icon:Ext.MessageBox.INFO,
            closable:false
        });
    }else if(count > 0){
        var tableNames = new Array();
        var record = grid.getSelectionModel().getSelections();
        for(var i = 0; i < record.length; i++){
            tableNames[i] = record[i].get('tableName');
        }
        Ext.MessageBox.show({
            title:'信息',
            msg:'<font color="green">确定要删除所选记录？</font>',
            animEl:'btnRemove.db.external.source.table.info',
            width:260,
            buttons:{'ok':'确定','no':'取消'},
            icon:Ext.MessageBox.INFO,
            closable:false,
            fn:function(e){
                if(e == 'ok'){
                    var myMask = new Ext.LoadMask(Ext.getBody(),{
                        msg : '正在删除,请稍后',
                        removeMask : true
                    });
                    myMask.show();
                    Ext.Ajax.request({
                        url : '../../DBSourceTableAction_deleteSourceTable.action',
                        params :{appName : appName,typeXml:'external',tableNames:tableNames,dbName:dbName},
                        method:'POST',
                        success : function(r,o){
                            var respText = Ext.util.JSON.decode(r.responseText);
                            var msg = respText.msg;
                            myMask.hide();
                            Ext.MessageBox.show({
                                title:'信息',
                                msg:msg,
                                animEl:'btnRemove.db.external.source.table.info',
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
 * 数据源 表集合  修改
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

    var is_pk = new Ext.form.ComboBox({
        id:'external.is_pk.info',
        listWidth : 170,
        store :  new Ext.data.SimpleStore({
            fields : ['value', 'key'],
            data : [['true','是'],['false','否']]
        }),
        valueField : 'value',
        displayField : 'key',
        typeAhead : true,
        mode : 'local',
        triggerAction : 'all',
        selectOnFocus : true,
        allowBlank : false
    });
    var jdbc_type = new Ext.form.ComboBox({
        id:'external.jdbc_type.info',
        listWidth : 170,
        store :  new Ext.data.SimpleStore({
            fields : ['value', 'key'],
            data : [['date','date'],['timestamp','timestamp']]
        }),
        valueField : 'value',
        displayField : 'key',
        typeAhead : true,
        mode : 'local',
        triggerAction : 'all',
        selectOnFocus : true,
        editable:true,
        allowBlank : false
    });
    var db_type = new Ext.form.ComboBox({
        id:'external.db_type.info',
        listWidth : 170,
        store :  new Ext.data.SimpleStore({
            fields : ['value', 'key'],
            data : [['date','date'],['timestamp','timestamp']]
        }),
        valueField : 'value',
        displayField : 'key',
        typeAhead : true,
        mode : 'local',
        triggerAction : 'all',
        selectOnFocus : true,
        editable:true,
        allowBlank : false
    });
    //==================================== --  -- =============================================================
    var start = 0;
    var pageSize = 10;
//    var SelectMap = new Map();
//    var SelectDesMap = new Map();
    var boxM = new Ext.grid.CheckboxSelectionModel(/*{
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
    var rowNumber = new Ext.grid.RowNumberer();         //自动 编号
    var colM = new Ext.grid.ColumnModel([
        boxM,
        rowNumber,
        {header:"字段名",	   dataIndex:"field",		    align:'center',sortable:true,menuDisabled:true},
        {header:"主键",  dataIndex:"is_pk",		    align:'center',sortable:true,menuDisabled:true,editor:is_pk,renderer:external_showURL_is_pk},
        {header:"为空",  dataIndex:"is_null",		align:'center',sortable:true},
        {header:"长度",	   dataIndex:"column_size",	align:'center',sortable:true},
        {header:"Jdbc类型",  dataIndex:"jdbc_type",	align:'center',sortable:true,editor:jdbc_type},
        {header:"DB类型",	   dataIndex:"db_type",		align:'center',sortable:true,menuDisabled:true,editor:db_type}

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
        cm:colM,
        sm:boxM,
        store:store,
        stripeRows:true,
        autoExpandColumn:1,
        clicksToEdit:1,
        disableSelection:true,
        bodyStyle:'width:100%',
//        enableDragDrop: true,
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
        autoScroll:true,
        labelWidth:65,
        height:65,
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
            value:false
        },{
            xtype:'hidden',
            name:'typeDB.dbName',
            value:dbName
        },{
            xtype:'hidden',
            name:'typeTable.tableName',
            value:tableName
        },{
            xtype:'hidden',
            name:'typeDB.operation',
            value:operation
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
                    xtype:'textfield',
                    value:seqnumber
                }]
            },{
                columnWidth:.5,
                labelWidth:100,
                layout:'form',
                items:[{
                    id:'external.form.table.interval.info',
                    width:100,
                    fieldLabel:"表频率",
                    name:'typeTable.interval',
                    xtype:'textfield',
                    value:interval
                }]
            }]
        }]

    });
	var win = new Ext.Window({
        title:"修改信息-数据源"+dbName+"下表"+tableName+"的属性设置",
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
                Ext.MessageBox.show({
                    title:'信息',
                    msg:'<font color="green">确定要修改?</font>',
                    animEl:'external.update.db.source.tables.info',
                    buttons:{'ok':'确定','no':'取消'},
                    icon:Ext.MessageBox.WARNING,
                    closable:false,
                    fn:function(e){
                        if(e=='ok'){
                            var monitorinsert = Ext.getCmp('external.form.table.monitorinsert.info').getValue();
                            var monitorupdate = Ext.getCmp('external.form.table.monitorupdate.info').getValue();
                            var monitordelete = Ext.getCmp('external.form.table.monitordelete.info').getValue();
                            var grid_table = Ext.getCmp('external_update_db_source_tables.grid.info');
                            var store_table = Ext.getCmp('external_update_db_source_tables.grid.info').getStore();
//                            var count = SelectMap.size();
                            var selModel = grid_table.getSelectionModel();
                            var count = selModel.getCount();
                            var fields = new Array();
                            var is_pks = new Array();
                            var is_nulls = new Array();
                            var column_sizes = new Array();
                            var db_types = new Array();
                            var jdbc_types = new Array();
                            if(count==0){
                                Ext.MessageBox.show({
                                    title:'信息',
                                    msg:'<font color="green">您没有勾选任何记录!</font>',
                                    animEl:'external.update.db.source.tables.info',
                                    buttons:{'ok':'确定'},
                                    icon:Ext.MessageBox.INFO,
                                    closable:false
                                });
                            }else if(count>0){
//                                var record = SelectMap.values();
                                var record = selModel.getSelections();
                                for(var i = 0; i < record.length; i++){
                                    fields[i] = record[i].get('field');
                                    is_pks[i] = record[i].get('is_pk');
                                    is_nulls[i] = record[i].get('is_null');
                                    column_sizes[i] = record[i].get('column_size');
                                    jdbc_types[i] = record[i].get('jdbc_type');
                                    db_types[i] = record[i].get('db_type');
                                }
                                if(count<store_table.getTotalCount()){
                                    Ext.MessageBox.show({
                                        title:'信息',
                                        msg:'<font color="green">源表与目标表字段位数不一致!</font>',
                                        animEl:'external.save.db.source.tables.info',
                                        buttons:{'ok':'继续','no':'返回'},
                                        icon:Ext.MessageBox.WARNING,
                                        closable:false,
                                        fn:function(e){
                                            if(e=='ok'){
                                                if (formPanel.form.isValid()) {
                                                    var flag = 0;
                                                    for(var i = 0; i < is_pks.length; i++){
                                                        if(is_pks[i] == 'true'){
                                                            flag ++;
                                                        }
                                                    }
                                                    if(flag==0){
                                                        Ext.MessageBox.show({
                                                            title:'信息',
                                                            msg:'<font color="green">请确保勾选的记录中至少存在一个主键为\"是\"!</font>',
                                                            animEl:'external.save.db.source.tables.info',
                                                            buttons:{'ok':'返回','no':'取消'},
                                                            icon:Ext.MessageBox.INFO,
                                                            closable:false
                                                        });
                                                    }else if(flag>0){
                                                        formPanel.getForm().submit({
                                                            url:'../../DBSourceTableAction_saveSourceTable.action',
                                                            params:{type:'source',operate:'update',
                                                                monitorinsert:monitorinsert,monitorupdate:monitorupdate,monitordelete:monitordelete,
                                                                fields:fields,is_pks:is_pks,is_nulls:is_nulls,column_sizes:column_sizes,jdbc_types:jdbc_types,db_types:db_types},
                                                            method :'POST',
                                                            waitTitle :'系统提示',
                                                            waitMsg :'正在修改,请稍后...',
                                                            success : function(form,action) {
                                                                Ext.MessageBox.show({
                                                                    title:'信息',
                                                                    msg:action.result.msg,
                                                                    animEl:'external.update.db.source.tables.info',
                                                                    buttons:{'ok':'确定','no':'取消'},
                                                                    icon:Ext.MessageBox.INFO,
                                                                    closable:false,
                                                                    fn:function(e){
                                                                            if(e=='ok'){
                                                                                win.close();
                                                                                Ext.getCmp('grid.table.query.source.external.info').getStore().reload();
                                                                            }
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        }
                                                }else{
                                                    Ext.MessageBox.show({
                                                        title:'信息',
                                                        msg:'请填写完成再提交!',
                                                        animEl:'external.update.db.source.tables.info',
                                                        buttons:{'ok':'确定'},
                                                        icon:Ext.MessageBox.ERROR,
                                                        closable:false
                                                    });
                                                }
                                            }
                                        }
                                    });
                                } else {
                                    if (formPanel.form.isValid()) {
                                        var flag = 0;
                                        for(var i = 0; i < is_pks.length; i++){
                                            if(is_pks[i] == 'true'){
                                                flag ++;
                                            }
                                        }
                                        if(flag==0){
                                            Ext.MessageBox.show({
                                                title:'信息',
                                                msg:'<font color="green">请确保勾选的记录中至少存在一个主键为\"是\"!</font>',
                                                animEl:'external.save.db.source.tables.info',
                                                buttons:{'ok':'返回','no':'取消'},
                                                icon:Ext.MessageBox.INFO,
                                                closable:false
                                            });
                                        }else if(flag>0){
                                            formPanel.getForm().submit({
                                                url:'../../DBSourceTableAction_saveSourceTable.action',
                                                params:{type:'source',operate:'update',
                                                    monitorinsert:monitorinsert,monitorupdate:monitorupdate,monitordelete:monitordelete,
                                                    fields:fields,is_pks:is_pks,is_nulls:is_nulls,column_sizes:column_sizes,jdbc_types:jdbc_types,db_types:db_types},
                                                method :'POST',
                                                waitTitle :'系统提示',
                                                waitMsg :'正在修改,请稍后...',
                                                success : function(form,action) {
                                                    Ext.MessageBox.show({
                                                        title:'信息',
                                                        msg:action.result.msg,
                                                        animEl:'external.update.db.source.tables.info',
                                                        buttons:{'ok':'确定','no':'取消'},
                                                        icon:Ext.MessageBox.INFO,
                                                        closable:false,
                                                        fn:function(e){
                                                            if(e=='ok'){
                                                                win.close();
                                                                Ext.getCmp('grid.table.query.source.external.info').getStore().reload();
                                                            }
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    }else{
                                        Ext.MessageBox.show({
                                            title:'信息',
                                            msg:'请填写完成再提交!',
                                            animEl:'external.update.db.source.tables.info',
                                            buttons:{'ok':'确定'},
                                            icon:Ext.MessageBox.ERROR,
                                            closable:false
                                        });
                                    }
                                }
                            }
                        }
                    }
                });
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
            var isChecked = record.data.checked;
            if(isChecked) {
                boxM.selectRow(store.indexOf(record),true);
            }
            /*var key = record.data.field;
            if(SelectDesMap.get(key)!=undefined){
                record.set('is_pk',SelectDesMap.get(key).data.is_pk);
                record.set('jdbc_type',SelectDesMap.get(key).data.jdbc_type);
                record.set('db_type',SelectDesMap.get(key).data.db_type);
                record.set('checked',false);
                store.commitChanges();
            } else{
                if(SelectMap.get(key)==undefined){
                    var isChecked = record.data.checked;
                    if(isChecked){
                        SelectMap.put(key,record);
                        boxM.selectRow(store.indexOf(record),true);
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
                        record.set('checked',true);
                        store.commitChanges();
                    }
                    boxM.selectRow(store.indexOf(record),true);
                }
            }*/
    	}
    });
}

/**
 * 数据源 表集合 删除恢复
 * @param appName
 * @param tableName
 */
function external_update_db_source_attribute_delete_back(appName,dbName,tableName){
    Ext.MessageBox.show({
        title:'信息',
        msg:'<font color="green">确定要恢复所选记录？</font>',
        width:260,
        buttons:{'ok':'确定','no':'取消'},
        icon:Ext.MessageBox.INFO,
        closable:false,
        fn:function(e){
            if(e == 'ok'){
                var myMask = new Ext.LoadMask(Ext.getBody(),{
                    msg : '正在恢复,请稍后',
                    removeMask : true
                });
                myMask.show();
                Ext.Ajax.request({
                    url : '../../DBSourceTableAction_deleteBackUpSourceTable.action',
                    params :{appName : appName,typeXml:'external',tableName:tableName,dbName:dbName},
                    method:'POST',
                    success : function(r,o){
                        var respText = Ext.util.JSON.decode(r.responseText);
                        var msg = respText.msg;
                        myMask.hide();
                        Ext.MessageBox.show({
                            title:'信息',
                            msg:msg,
                            buttons:{'ok':'确定'},
                            icon:Ext.MessageBox.INFO,
                            closable:false,
                            fn:function(e){
                                if(e=='ok'){
                                    Ext.getCmp('grid.table.query.source.external.info').render();
                                    Ext.getCmp('grid.table.query.source.external.info').getStore().reload();
                                }
                            }
                        });
                    }
                });
            }
        }
    });
}