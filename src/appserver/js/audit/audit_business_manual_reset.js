/**
 *  业务手动重传
 */
Ext.onReady(function() {

	Ext.BLANK_IMAGE_URL = '../../js/ext/resources/images/default/s.gif';

	Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget = 'quit';

    var start = 0;
    var pageSize = 100;
    var record = new Ext.data.Record.create([
        {name:'id',			   mapping:'id'},
        {name:'businessName',   mapping:'businessName'},
        {name:'businessType',   mapping:'businessType'},
        {name:'fileName',        mapping:'fileName'},
        {name:'date',	       mapping:'date'},
        {name:'resetStatus',	   mapping:'resetStatus'},
        {name:'resetCount',	   mapping:'resetCount'},
        {name:'importTime',	   mapping:'importTime'}
    ]);
    var proxy = new Ext.data.HttpProxy({
        url:"../../AuditResetAction_select.action"
    });
    var reader = new Ext.data.JsonReader({
        totalProperty:"total",
        root:"rows",
        id:'id'
    },record);
    var store = new Ext.data.GroupingStore({
        id:"store.info",
        proxy : proxy,
        reader : reader
    });

    var boxM = new Ext.grid.CheckboxSelectionModel();   //复选框
    var rowNumber = new Ext.grid.RowNumberer();         //自动 编号
    var colM = new Ext.grid.ColumnModel([
        boxM,
        rowNumber,
        {header:"导入时间",		dataIndex:"importTime",    align:'center',sortable:true,width:100},
        {header:"业务名",			dataIndex:"businessName",  align:'center',sortable:true,width:100},
        {header:"业务类型",		dataIndex:"businessType",  align:'center',sortable:true,width:45,renderer:businessType_showUrl},
        {header:'业务对应文件',	dataIndex:'fileName',       align:'center',sortable:true,width:200},
        {header:'文件处理时间',	    dataIndex:'date',       align:'center',sortable:true,width:50},
        {header:"状态",	    	dataIndex:"resetStatus",	   align:'center',sortable:true,width:45,renderer:resetStatus_showUrl},
        {header:"重传次数",    	dataIndex:"resetCount",	   align:'center',sortable:true,width:45},
        {header:'操作标记',  	    dataIndex:'id',              align:'center',sortable:true,renderer:flag_showUrl,width:45}
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
        tbar:[{
            id:'add.info',
            text:'导入重传文件',
            tooltip:'点击可以导入各个应用需要重传的文件信息',
            iconCls:'add',
            handler:function(){
                import_reset_xml(grid_panel,store);
            }
        },{
            xtype : 'tbseparator'
        },{
            id:'reset.info',
            tooltip:'点击可以输入条件,按条件重传',
            text:'重传',
            iconCls:'add',
            handler:function(){
                reset_panel(grid_panel);
            }
        },{
            xtype : 'tbseparator'
        }, {
            text : '查询',
            tooltip:'点击可以输入条件,按条件查询',
            iconCls:'query',
            handler : function() {
                moreQuery(grid_panel,start,pageSize);
            }
        },{
            xtype : 'tbseparator'
        },{
            text:'删除',
            tooltip:'点击可以输入条件,按条件删除',
            iconCls:'remove',
            handler:function(){
                delete_panel(grid_panel,start,pageSize);
            }
        },{
            xtype : 'tbseparator'
        }, {
            text : '清空',
            iconCls:'removeall',
            handler : function() {
                Ext.MessageBox.show({
                    title:'信息',
                    msg:"<font color='green'>确定要清空?</font>",
                    buttons:{'ok':'确定','no':'取消'},
                    icon:Ext.MessageBox.WARNING,
                    closable:false,
                    fn:function(e){
                        if(e=='ok'){
                            var myMask = new Ext.LoadMask(Ext.getBody(),{
                                msg : '正在处理,请稍后...',
                                removeMask : true
                            });
                            myMask.show();
                            Ext.Ajax.request({
                                url : '../../AuditResetAction_truncate.action',
                                params : {resetStatus:'',businessType:'',
                                    startDate:'',endDate:'',businessName:''},
                                method :'POST',
                                success:function(r,o){
                                    var respText = Ext.util.JSON.decode(r.responseText);
                                    var msg = respText.msg;
                                    myMask.hide();
                                    Ext.MessageBox.show({
                                        title:'信息',
                                        width:250,
                                        msg:msg,
                                        animEl:'truncate.tb.info',
                                        buttons:{'ok':'确定'},
                                        icon:Ext.MessageBox.INFO,
                                        closable:false,
                                        fn:function(e){
                                            if(e=='ok'){
                                                grid_panel.render();
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
        },{
            xtype : 'tbseparator'
        }],
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

function businessType_showUrl(value){
    if(value=='file'){
        return '文件同步';
    } else if(value=='db'){
        return '数据库同步';
    } else if(value=='TCPProxy'){
        return 'TCP代理';
    } else if(value=='UDPProxy'){
        return 'UDP代理';
    }
}

function resetStatus_showUrl(value){
    if(value==0){
        return "<font color='red'>需重传</font>";
    } else if(value==1){
        return "<font color='green'>已重传</font>";
    }
}

function flag_showUrl(value,p,r){
    p.attr = ' ext:qtip="' + value + '"';
    if(r.get('resetStatus')==0){
//        return "<a href='javascript:;' onclick='audit_reset(\""+value+"\")' style='color: green;'>重传</a>"
        return "<a href='javascript:;' onclick='audit_reset()' style='color: green;'>重传</a>"
    } else if(r.get('resetStatus')==1) {
        return "<font color='gray'>重传</font> "
    }
}

function import_reset_xml(grid,store){
   var form = new Ext.form.FormPanel({
        frame:true,
        labelWidth:80,
        labelAlign:'right',
        fileUpload:true,
        border:false,
        defaults : {
            width : 300,
            allowBlank : false,
            blankText : '该项不能为空！'
        },
        items:[{
            xtype:'displayfield',
            value:'导入文件为[*.xml]'
        },{
            id:'uploadFile',
            fieldLabel:"导入文件",
            name:'uploadFile',
            xtype:'textfield',
            inputType: 'file',
            listeners:{
                render:function(){
                    Ext.get('uploadFile').on("change",function(){
                        var file = this.getValue();
                        var fs = file.split('.');
                        if(fs[fs.length-1].toLowerCase()=='xml'){
                            Ext.MessageBox.show({
                                title:'信息',
                                msg:'<font color="green">确定要上传文件:'+file+'？</font>',
                                width:300,
                                buttons:{'ok':'确定','no':'取消'},
                                icon:Ext.MessageBox.WARNING,
                                closable:false,
                                fn:function(e){
                                    if(e == 'ok'){
                                        if (form.form.isValid()) {
                                            form.getForm().submit({
                                                url :'../../AuditResetAction_insert.action',
                                                method :'POST',
                                                waitTitle :'系统提示',
                                                waitMsg :'正在导入,请稍后...',
                                                success : function(form,action) {
                                                    var msg = action.result.msg;
                                                    Ext.MessageBox.show({
                                                        title:'信息',
                                                        width:250,
                                                        msg:msg,
//                                                    animEl:'insert.win.info',
                                                        buttons:{'ok':'确定','no':'取消'},
                                                        icon:Ext.MessageBox.INFO,
                                                        closable:false,
                                                        fn:function(e){
                                                            if(e=='ok'){
                                                                grid.render();
                                                                store.reload();
                                                                win.close();
                                                            } else {
                                                                Ext.getCmp('uploadFile').setValue('');
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
//                                            animEl:'insert.win.info',
                                                buttons:{'ok':'确定'},
                                                icon:Ext.MessageBox.ERROR,
                                                closable:false
                                            });
                                        }
                                    }
                                }
                            });
                        } else {
                            Ext.MessageBox.show({
                                title:'信息',
                                width:200,
                                msg:'上传文件格式不对,请重新选择!',
                                buttons:{'ok':'确定'},
                                icon:Ext.MessageBox.ERROR,
                                closable:false,
                                fn:function(e){
                                    if(e=='ok'){
                                        Ext.getCmp('uploadFile').setValue('');
                                    }
                                }
                            });
                        }
                    });
                }
            }
        }]
    });
   var win = new Ext.Window({
		title:'批量导入',
		width:440,
		height:150,
		layout:'fit',
        modal:true,
		items:[form],
		bbar:['->',{
//    		id:'insert.win.info',
//    		text:'导入',
//    		handler:function(){
//    			if (form.form.isValid()) {
//                	form.getForm().submit({
//		            	url :'../../AuditResetAction_insert.action',
//		                method :'POST',
//		                waitTitle :'系统提示',
//		                waitMsg :'正在导入...',
//		                success : function(form,action) {
//		                	var msg = action.result.msg;
//			                Ext.MessageBox.show({
//			                	title:'信息',
//			                    width:250,
//			                    msg:msg,
//		                        animEl:'insert.win.info',
//		                        buttons:Ext.MessageBox.OK,
//		                        buttons:{'ok':'确定'},
//		                        icon:Ext.MessageBox.INFO,
//		                        closable:false,
//		                        fn:function(e){
//		                        	if(e=='ok'){
//		                            	grid.render();
//		                            	store.reload();
//		                            	win.close();
//		                        	}
//		                        }
//		                	});
//		                }
//		        	});
//                } else {
//                    Ext.MessageBox.show({
//                        title:'信息',
//                        width:200,
//                        msg:'请填写完成再提交!',
//                        animEl:'insert.win.info',
//                        buttons:Ext.MessageBox.OK,
//                        buttons:{'ok':'确定'},
//                        icon:Ext.MessageBox.ERROR,
//                        closable:false
//                    });
//                }
//    		}
//    	},{
    		text:'关闭',
    		handler:function(){
    			win.close();
    		}
    	}]
	}).show();
}

/**
 * 重传条件面板
 * @param grid_panel
 */
function reset_panel(grid_panel) {
    var _record = new Ext.data.Record.create([
	    {name:'key',	mapping:'key'},
	    {name:'value',	mapping:'value'}
    ]);
    var _store = new Ext.data.GroupingStore({
        proxy : new Ext.data.HttpProxy({ url:'../../AppTypeAction_readAppNameKeyValue.action' }),
        reader : new Ext.data.JsonReader({ totalProperty:'total', root:'rows' },_record)
    });
    _store.load({params:{appType:'reset'}});
    var store = grid_panel.getStore();
    var selModel = grid_panel.getSelectionModel();
    var record = selModel.getSelections();
    var form;
    var flag = false;
    if(record.length == 0) {
        flag = false;
        form = new Ext.form.FormPanel({
            frame:true,
            labelWidth:100,
            labelAlign:'right',
            fileUpload:true,
            border:false,
            defaults : {
                width : 200,
                allowBlank : true
            },
            items:[{
                id : 'startDate.tb.info',
                fieldLabel:'起始时间',
                name : 'startDate',
                emptyText : '点击输入时间',
                xtype : 'datefield',
                format : 'Y-m-d H:i:s'
            }, {
                id : 'endDate.tb.info',
                fieldLabel:'结束时间',
                xtype : 'datefield',
                name : 'endDate',
                emptyText : '点击输入时间',
                format : 'Y-m-d H:i:s'
            }, {
                id:'businessName.tb.info',
                fieldLabel:"业务名",
                xtype:'combo',
                hiddenName:'businessName',
                mode:'local',
                emptyText :'--请选择--',
                editable : false,
                typeAhead:true,
                forceSelection: true,
                triggerAction:'all',
                displayField:"key",valueField:"value",
                store:_store,
                allowBlank:false
            }]
        });
    } else {
        flag = true;
        form = new Ext.form.FormPanel({
            frame:true,
            labelWidth:100,
            labelAlign:'right',
            fileUpload:true,
            border:false,
            defaults : {
                width : 200,
                allowBlank : true
            },
            items:[{
                id:'businessName.tb.info',
                fieldLabel:"业务名",
                xtype:'combo',
                hiddenName:'businessName',
                mode:'local',
                emptyText :'--请选择--',
                editable : false,
                typeAhead:true,
                forceSelection: true,
                triggerAction:'all',
                displayField:"key",valueField:"value",
                store:_store,
                allowBlank:false
            }]
        });
    }
    var win = new Ext.Window({
		title:'重传条件',
		width:380,
		height:200,
		layout:'fit',
        modal:true,
		items:[form],
		bbar:['->',{
            text:'重传',
            handler:function() {
                var businessName = Ext.fly('businessName.tb.info').dom.value == '--请选择--'
                    ? null
                    :Ext.getCmp('businessName.tb.info').getValue();
                if(businessName!=null && businessName.length>0) {
                    if(flag) {
                        var ids = new Array();
                        for(var i = 0; i < record.length; i++){
                            if(record[i].get('businessName')==businessName) {
                                ids[i] = record[i].get('id');
                            }
                        }
                        var myMask = new Ext.LoadMask(Ext.getBody(),{
                            msg : '正在处理,请稍后...',
                            removeMask : true
                        });
                        myMask.show();
                        Ext.Ajax.request({
                            url : '../../AuditResetAction_update.action',
                            params : {ids:ids,appName:businessName},
                            method :'POST',
                            success:function(r,o){
                                var respText = Ext.util.JSON.decode(r.responseText);
                                var msg = respText.msg;
                                myMask.hide();
                                Ext.MessageBox.show({
                                    title:'信息',
                                    width:250,
                                    msg:msg,
                                    animEl:'truncate.tb.info',
                                    buttons:{'ok':'确定'},
                                    icon:Ext.MessageBox.INFO,
                                    closable:false,
                                    fn:function(e){
                                        if(e=='ok'){
                                            grid_panel.render();
                                            store.reload();
                                            win.close();
                                        }
                                    }
                                });
                            }
                        });
                    } else {
                        var startDate = Ext.fly("startDate.tb.info").dom.value == '点击输入时间'
                            ? null
                            : Ext.getCmp('startDate.tb.info').getValue();
                        var endDate = Ext.fly('endDate.tb.info').dom.value == '点击输入时间'
                            ? null
                            : Ext.getCmp('endDate.tb.info').getValue();
                        if(startDate!=null && endDate!=null) {
                            var myMask = new Ext.LoadMask(Ext.getBody(),{
                                msg : '正在处理,请稍后...',
                                removeMask : true
                            });
                            myMask.show();
                            Ext.Ajax.request({
                                url : '../../AuditResetAction_checkDateTime.action',
                                params : {startDate:startDate,endDate:endDate},
                                method :'POST',
                                success:function(r,o){
                                    var respText = Ext.util.JSON.decode(r.responseText);
                                    var msg = respText.msg;
                                    var clear = respText.clear;
                                    if(!clear){
                                         myMask.hide();
                                        Ext.MessageBox.show({
                                            title:'信息',
                                            width:280,
                                            msg:msg,
                                            animEl:'endDate.tb.info',
                                            buttons:{'ok':'确定'},
                                            icon:Ext.MessageBox.ERROR,
                                            closable:false,
                                            fn:function(e){
                                                if(e=='ok'){
                                                    Ext.getCmp('endDate.tb.info').setValue('');
                                                }
                                            }
                                        });
                                    } else{
                                        Ext.Ajax.request({
                                            url : '../../AuditResetAction_updateByBusinessName.action',
                                            params : {
                                                appName:businessName,
                                                startDate:startDate,endDate:endDate
                                            },
                                            method :'POST',
                                            success:function(r,o){
                                                var respText = Ext.util.JSON.decode(r.responseText);
                                                var msg = respText.msg;
                                                myMask.hide();
                                                Ext.MessageBox.show({
                                                    title:'信息',
                                                    width:250,
                                                    msg:msg,
                                                    buttons:{'ok':'确定','no':'取消'},
                                                    icon:Ext.MessageBox.INFO,
                                                    closable:false,
                                                    fn:function(e){
                                                        if(e=='ok'){
                                                            grid_panel.render();
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
                                msg:'<h5 style="color: red;">填写不完整</h5>',
                                buttons:{'ok':'确定'},
                                icon:Ext.MessageBox.ERROR,
                                closable:false
                            });
                        }
                    }
                } else {
                    Ext.MessageBox.show({
                        title:'信息',
                        width:200,
                        msg:'<h5 style="color: red;">业务名为必选项</h5>',
                        buttons:{'ok':'确定'},
                        icon:Ext.MessageBox.ERROR,
                        closable:false
                    });
                }

                if(businessName!=null && businessName.length>0) {

                    if(startDate!=null && endDate!=null) {

                    } else {

                    }
                } else {

                }
            }
        },{
            text:'关闭',
    		handler:function(){
    			win.close();
    		}
    	}]
	}).show();
}
/**
 * 高级查询
 * @param grid_panel
 */
function moreQuery(grid_panel,start,pageSize) {
    var store = grid_panel.getStore();
    var form = new Ext.form.FormPanel({
        frame:true,
        labelWidth:100,
        labelAlign:'right',
        fileUpload:true,
        border:false,
        defaults : {
            width : 200,
            allowBlank : true
        },
        items:[{
            id : 'startDate.tb.info',
            fieldLabel:'起始日期',
            xtype : 'datefield',
            name : 'startDate',
            emptyText : '点击输入日期',
            format : 'Y-m-d'
        }, {
            id : 'endDate.tb.info',
            fieldLabel:'结束日期',
            xtype : 'datefield',
            name : 'endDate',
            emptyText : '点击输入日期',
            format : 'Y-m-d'
        }, {
            id:'businessName.tb.info',
            fieldLabel:'业务名',
            xtype:'textfield',
            emptyText:'请输入业务名'
        },{
            id : 'businessType.tb.info',
            fieldLabel:'业务类型',
            xtype : 'combo',
            store : new Ext.data.ArrayStore({
                autoDestroy : true,
                fields : ['value', 'key'],
                data : [
                    ['file', '文件同步'],
                    ['db', '数据库同步']
                ]
            }),
            valueField : 'value',
            displayField : 'key',
            value:'db',
            mode : 'local',
            forceSelection : true,
            triggerAction : 'all',
            emptyText : '--请选择--',
            editable:false,
            selectOnFocus : true
        }, {
            id : 'resetStatus.tb.info',
            fieldLabel:'状态',
            xtype : 'combo',
            store : new Ext.data.ArrayStore({
                autoDestroy : true,
                fields : ['value', 'key'],
                data : [
                    ['全部', '全部'],
                    ['0', '需重传'],
                    ['1', '已重传']
                ]
            }),
            valueField : 'value',
            displayField : 'key',
            mode : 'local',
            forceSelection : true,
            triggerAction : 'all',
            emptyText : '--请选择--',
            value : '0',
            editable:false,
            selectOnFocus : true
        }]
    });
    var win = new Ext.Window({
		title:'高级查询',
		width:380,
		height:250,
		layout:'fit',
        modal:true,
		items:[form],
		bbar:['->',{
            text:'查询',
            handler:function() {
                var businessType = Ext.fly('businessType.tb.info').dom.value == '--请选择--'
                    ? null
                    : Ext.getCmp('businessType.tb.info').getValue();
                var resetStatus = Ext.fly('resetStatus.tb.info').dom.value == '--请选择--'
                    ? null
                    : Ext.getCmp('resetStatus.tb.info').getValue();
                var startDate = Ext.fly("startDate.tb.info").dom.value == '点击输入日期'
                    ? null
                    : Ext.fly('startDate.tb.info').dom.value;
                var endDate = Ext.fly('endDate.tb.info').dom.value == '点击输入日期'
                    ? null
                    : Ext.fly('endDate.tb.info').dom.value;
                var businessName = Ext.fly('businessName.tb.info').dom.value == '请输入业务名'
                    ? null
                    :Ext.getCmp('businessName.tb.info').getValue();
                if(startDate!=null && endDate!=null) {
                    var myMask = new Ext.LoadMask(Ext.getBody(),{
                        msg : '正在处理,请稍后...',
                        removeMask : true
                    });
                    myMask.show();
                    Ext.Ajax.request({
                        url : '../../AuditAction_checkDate.action',
                        params : {startDate:startDate,endDate:endDate},
                        method :'POST',
                        success:function(r,o){
                            myMask.hide();
                            var respText = Ext.util.JSON.decode(r.responseText);
                            var msg = respText.msg;
                            var clear = respText.clear;
                            if(!clear){
                                Ext.MessageBox.show({
                                    title:'信息',
                                    width:280,
                                    msg:'结束时间不能早于开始时间',
                                    animEl:'endDate.tb.info',
                                    buttons:{'ok':'确定'},
                                    icon:Ext.MessageBox.ERROR,
                                    closable:false,
                                    fn:function(e){
                                        if(e=='ok'){
                                            Ext.getCmp('endDate.tb.info').setValue('');
                                        }
                                    }
                                });
                            } else{
                                store.setBaseParam('startDate', startDate);
                                store.setBaseParam('endDate', endDate);
                                store.setBaseParam('businessName', businessName);
                                store.setBaseParam('businessType', businessType);
                                store.setBaseParam('resetStatus', resetStatus);
                                store.load({
                                    params : {
                                        start : start,
                                        limit : pageSize
                                    }
                                });
                            }
                        }
                    });
                } else {
                    store.setBaseParam('startDate', startDate);
                    store.setBaseParam('endDate', endDate);
                    store.setBaseParam('businessName', businessName);
                    store.setBaseParam('businessType', businessType);
                    store.setBaseParam('resetStatus', resetStatus);
                    store.load({
                        params : {
                            start : start,
                            limit : pageSize
                        }
                    });
                }
                win.close();
            }
        },{
            text:'关闭',
    		handler:function(){
    			win.close();
    		}
    	}]
	}).show();
}

/**
 * 高级删除
 * @param grid_panel
 * @param start
 * @param pageSize
 */
function delete_panel(grid_panel,start,pageSize) {
    var store = grid_panel.getStore();
    var form = new Ext.form.FormPanel({
        frame:true,
        labelWidth:100,
        labelAlign:'right',
        fileUpload:true,
        border:false,
        defaults : {
            width : 200,
            allowBlank : true
        },
        items:[{
            id : 'startDate.tb.info',
            fieldLabel:'起始日期',
            xtype : 'datefield',
            name : 'startDate',
            emptyText : '点击输入日期',
            format : 'Y-m-d'
        }, {
            id : 'endDate.tb.info',
            fieldLabel:'结束日期',
            xtype : 'datefield',
            name : 'endDate',
            emptyText : '点击输入日期',
            format : 'Y-m-d'
        }, {
            id:'businessName.tb.info',
            fieldLabel:'业务名',
            xtype:'textfield',
            emptyText:'请输入业务名'
        },{
            id : 'businessType.tb.info',
            fieldLabel:'业务类型',
            xtype : 'combo',
            store : new Ext.data.ArrayStore({
                autoDestroy : true,
                fields : ['value', 'key'],
                data : [
                    ['file', '文件同步'],
                    ['db', '数据库同步']
                ]
            }),
            valueField : 'value',
            displayField : 'key',
            mode : 'local',
            value:'db',
            editable:false,
            forceSelection : true,
            triggerAction : 'all',
            emptyText : '--请选择--',
            selectOnFocus : true
        }, {
            id : 'resetStatus.tb.info',
            fieldLabel:'状态',
            xtype : 'combo',
            store : new Ext.data.ArrayStore({
                autoDestroy : true,
                fields : ['value', 'key'],
                data : [
                    ['全部', '全部'],
                    ['0', '需重传'],
                    ['1', '已重传']
                ]
            }),
            valueField : 'value',
            displayField : 'key',
            mode : 'local',
            forceSelection : true,
            triggerAction : 'all',
            emptyText : '--请选择--',
            value : '1',
            editable:false,
            selectOnFocus : true
        }]
    });
    var win = new Ext.Window({
		title:'高级删除',
		width:380,
		height:250,
		layout:'fit',
        modal:true,
		items:[form],
		bbar:['->',{
            text:'删除',
            handler:function() {
                var resetStatus = Ext.fly('resetStatus.tb.info').dom.value == '--请选择--'
                    ? null
                    : Ext.getCmp('resetStatus.tb.info').getValue();
                var businessType = Ext.fly('businessType.tb.info').dom.value == '--请选择--'
                    ? null
                    : Ext.getCmp('businessType.tb.info').getValue();
                var startDate = Ext.fly("startDate.tb.info").dom.value == '点击输入日期'
                    ? null
                    : Ext.fly('startDate.tb.info').dom.value;
                var endDate = Ext.fly('endDate.tb.info').dom.value == '点击输入日期'
                    ? null
                    : Ext.fly('endDate.tb.info').dom.value;
                var businessName = Ext.fly('businessName.tb.info').dom.value == '请输入业务名'
                    ? null
                    :Ext.getCmp('businessName.tb.info').getValue();

                Ext.MessageBox.show({
                    title:'信息',
                    msg:"<font color='green'>确定要删除?</font>",
                    buttons:{'ok':'确定','no':'取消'},
                    icon:Ext.MessageBox.WARNING,
                    closable:false,
                    fn:function(e){
                        if(e=='ok'){
                            var myMask = new Ext.LoadMask(Ext.getBody(),{
                                msg : '正在处理,请稍后...',
                                removeMask : true
                            });
                            myMask.show();
                            Ext.Ajax.request({
                                url : '../../AuditResetAction_truncate.action',
                                params : {resetStatus:resetStatus,businessType:businessType,
                                    startDate:startDate,endDate:endDate,businessName:businessName},
                                method :'POST',
                                success:function(r,o){
                                    var respText = Ext.util.JSON.decode(r.responseText);
                                    var msg = respText.msg;
                                    myMask.hide();
                                    Ext.MessageBox.show({
                                        title:'信息',
                                        width:250,
                                        msg:msg,
                                        animEl:'truncate.tb.info',
                                        buttons:{'ok':'确定'},
                                        icon:Ext.MessageBox.INFO,
                                        closable:false,
                                        fn:function(e){
                                            if(e=='ok'){
                                                grid_panel.render();
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
            }
        },{
            text:'关闭',
    		handler:function(){
    			win.close();
    		}
    	}]
	}).show();
}

/**
 * 单个重传
 * @param id
 */
function audit_reset(){
    var grid = Ext.getCmp('grid.info');
    var store = grid.getStore();
    var selModel = grid.getSelectionModel();
    var record = selModel.getSelections();
    var ids = new Array();
    for(var i = 0; i < record.length; i++){
        ids[i] = record[i].get('id');
    }
    var appName = record[0].get('businessName');
    Ext.MessageBox.show({
        title:'信息',
        msg:'<font color="GREEN">确定要重传?</font> ',
        buttons:{'ok':'确定','no':'取消'},
        icon:Ext.MessageBox.QUESTION,
        closable:false,
        fn:function(e){
            if(e=='ok'){
                var myMask = new Ext.LoadMask(Ext.getBody(),{
                    msg : '正在处理,请稍后...',
                    removeMask : true
                });
                myMask.show();
                Ext.Ajax.request({
                    url : '../../AuditResetAction_update.action',
                    params : {ids:ids,appName:appName},
                    method :'POST',
                    success:function(r,o){
                        var respText = Ext.util.JSON.decode(r.responseText);
                        var msg = respText.msg;
                        myMask.hide();
                        Ext.MessageBox.show({
                            title:'信息',
                            width:250,
                            msg:msg,
                            animEl:'truncate.tb.info',
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