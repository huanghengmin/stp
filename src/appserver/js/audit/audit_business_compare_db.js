/**
 *  业务审计比对
 */
Ext.onReady(function(){
    Ext.BLANK_IMAGE_URL = '../../js/ext/resources/images/default/s.gif';
    Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget ='side';

    var start = 0;			//分页--开始数
    var pageSize = 100;		//分页--每页数
    var record = new Ext.data.Record.create([
        {name:'businessName',   mapping:'businessName'},
        {name:'businessType',       mapping:'businessType'},
        {name:'fileName',       mapping:'fileName'},
        {name:'date',       mapping:'date'}
    ]);
    var proxy = new Ext.data.HttpProxy({
        url:"../../AuditCompareAction_select.action"
    });
    var reader = new Ext.data.JsonReader({
        totalProperty:"total",
        root:"rows"
    },record);
    var store = new Ext.data.GroupingStore({
        id:"store.info",
        proxy : proxy,
        reader : reader
    });

	var boxM = new Ext.grid.CheckboxSelectionModel();   //复选框
	var rowNumber = new Ext.grid.RowNumberer();         //自动 编号
	var colM = new Ext.grid.ColumnModel([
        rowNumber,
		boxM,
        {header:"业务名(应用编号)", dataIndex:"businessName",   align:'center',sortable:true},
        {header:"业务类型",        dataIndex:"businessType",   align:'center',sortable:true,renderer:showURL_type},
        {header:"目标端未接收到的文件",     dataIndex:"fileName",        align:'center',sortable:true},
        {header:"日志最后处理时间", dataIndex:"date",  align:'center'}
    ]);
    colM.defaultSortable = true;
    var page_toolbar = new Ext.PagingToolbar({
        pageSize : pageSize,
        store:store,
        displayInfo:true,
        displayMsg:"显示{0}-{1}条记录,共{2}条",
        emptyMsg:"没有记录",
        beforePageText:"当前页",
        afterPageText:"共{0}页"
    });
    var grid = new Ext.grid.GridPanel({
        id:'grid.info',
        height:setHeight(),
        loadMask:{msg:'正在加载数据,请稍后...'},
        border:false,
        cm:colM,
        sm:boxM,
        store:store,
        selModel:new Ext.grid.RowSelectionModel({singleSelect:true}),
        /*viewConfig:{
            forceFit:true,
            enableRowBody:true,
            getRowClass:function(record,rowIndex,p,store){
                return 'x-grid3-row-collapsed';
            }
        },*/
        tbar:[{
            id : 'export.info',
            text : '按选择导出',
            iconCls : 'export',
            handler : function() {
                export_file(grid,store);
            }
        },{
            xtype : 'tbseparator'
        },{
            id : 'export.all.file.info',
            text : '按业务导出',
            iconCls : 'export',
            handler : function() {
                var businessType = Ext.getCmp('businessType.tb.info').getValue();
                export_fileAll(grid,store,businessType);
            }
        },{
            xtype : 'tbseparator'
        },{
            id : 'export.file.info',
            text : '导出文件管理',
            iconCls : 'exportfile',
            handler : function() {
                manager_file(grid,store);
            }
        },{
            xtype : 'tbseparator'
        },'起始日期：', {
            id : 'startDate.tb.info',
            xtype : 'datefield',
            name : 'startDate',
            emptyText : '点击输入日期',
            format : 'Y-m-d'
        }, {
            xtype : 'tbseparator'
        },'结束日期：', {
            id : 'endDate.tb.info',
            xtype : 'datefield',
            name : 'endDate',
            emptyText : '点击输入日期',
            format : 'Y-m-d'
        }, {
            xtype : 'tbseparator'
        }, '业务名:',{
            id:'businessName.tb.info',
            xtype:'textfield',
            emptyText:'请输入业务名',
            width : 100
        },{
            xtype : 'tbseparator'
        },'业务类型:',{
            id : 'businessType.tb.info',
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
            forceSelection : true,
            triggerAction : 'all',
            emptyText : '--请选择--',
            value : 'db',
            selectOnFocus : true,
            editable:false,
            width : 100
        },{
            xtype : 'tbseparator'
        }, {
            text : '查询',
            iconCls:'query',
            listeners : {
                click : function() {
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
                        store.load({
                            params : {
                                start : start,
                                limit : pageSize
                            }
                        });
                    }
                }
            }
        }],
        view:new Ext.grid.GroupingView({
            forceFit:true,
            groupingTextTpl:'{text}({[values.rs.length]}条记录)'
        }),
        bbar:page_toolbar
    });
    new Ext.Viewport({
        renderTo:Ext.getBody(),
        layout:'fit',
        items:[grid]
    });
    store.on('beforeload',function(){
        var startDate = Ext.fly("startDate.tb.info").dom.value == '点击输入日期'
                        ? null
                        : Ext.fly('startDate.tb.info').dom.value;
        var endDate = Ext.fly('endDate.tb.info').dom.value == '点击输入日期'
            ? null
            : Ext.fly('endDate.tb.info').dom.value;
        var businessName = Ext.fly('businessName.tb.info').dom.value == '请输入业务名'
                        ? null
                        :Ext.getCmp('businessName.tb.info').getValue();
        store.setBaseParam('startDate', startDate);
        store.setBaseParam('endDate', endDate);
        store.setBaseParam('businessName', businessName);
        store.setBaseParam('businessType', Ext.getCmp('businessType.tb.info').getValue());
    });
    store.load({
        params:{
            start:start,limit:pageSize,type:'internal',businessType:Ext.getCmp('businessType.tb.info').getValue()
        }
    });

});

function setHeight(){
	var h = document.body.clientHeight-8;
	return h;
}

function setWidth(){
	var h = document.body.clientWidth-8;
	return h;
}

function showURL_type(value) {
    if(value=='db') {
        return '数据库同步';
    } else if(value=='file') {
        return '文件同步';
    } else {
        return '未知业务类型';
    }
}

function export_file(grid,store){
    var selModel = grid.getSelectionModel();
    var count = selModel.getCount();
    if(count==0){
        Ext.MessageBox.show({
            title:'信息',
            msg:'<font color="green">您没有勾选任何记录!</font>',
            animEl:'export.info',
            buttons:{'ok':'确定'},
            icon:Ext.MessageBox.INFO,
            closable:false
        });
    }else if(count > 0){
        var fileNames = new Array();
        var date = new Array();
        var businessNames = new Array();
        var businessTypes = new Array();
        var record = grid.getSelectionModel().getSelections();
        for(var i = 0; i < record.length; i++){
            fileNames[i] = record[i].get('fileName');
            date[i] = record[i].get('date');
            businessNames[i] = record[i].get('businessName');
            businessTypes[i] = record[i].get('businessType');
        }
        Ext.MessageBox.show({
            title:'信息',
            msg:'<font color="green">确定要导出所选记录用于业务手动重传？</font>',
            animEl:'export.info',
            width:300,
            buttons:{'ok':'确定','no':'取消'},
            icon:Ext.MessageBox.INFO,
            closable:false,
            fn:function(e){
                if(e == 'ok'){
                    var myMask = new Ext.LoadMask(Ext.getBody(),{
                        msg:'正在导出,请稍后...',
                        removeMask : true
                    });
                    myMask.show();
                    Ext.Ajax.request({
                        url : '../../AuditCompareAction_export.action',
                        params :{fileNames : fileNames,date:date,businessNames:businessNames,businessTypes:businessTypes},
                        success : function(action){
                            var json = Ext.decode(action.responseText);
                            myMask.hide();
                            Ext.MessageBox.show({
                                title:'信息',
                                width:json.code,
                                msg:json.msg,
                                animEl:'export.info',
                                buttons:{'ok':'确定','no':'下载'},
                                icon:Ext.MessageBox.INFO,
                                closable:false,
		                        fn:function(e){
		                        	if(e=='ok'){
		                            	grid.render();
		                            	store.reload();
		                        	} else {
                                        grid.render();
		                            	store.reload();
                                        var name = json.fileName;
                                        downloadByFileName(name);
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

function export_fileAll(grid,store,businessType){
    var record = new Ext.data.Record.create([
	    {name:'key',	mapping:'key'},
	    {name:'value',	mapping:'value'}
    ]);
    var _store = new Ext.data.GroupingStore({
        proxy : new Ext.data.HttpProxy({ url:'../../AppTypeAction_readAppNameKeyValue.action' }),
        reader : new Ext.data.JsonReader({ totalProperty:'total', root:'rows' },record)
    });
    _store.load({params:{appType:businessType}});
    var formPanel = new Ext.form.FormPanel({
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
             store:_store
         }]
    });
    var win = new Ext.Window({
        title:"按业务导出",
        width:400,
        height:110,
        layout:'fit',
        modal:true,
        items: [formPanel],
        bbar:[
            new Ext.Toolbar.Fill(),
            new Ext.Button ({
                id:'export.info',
                text : '导出',
                allowDepress : false,
                handler : function() {
                    if(formPanel.form.isValid()){
                        formPanel.getForm().submit({
                            url:'../../AuditCompareAction_exportByBusinessName.action',
                            method:'POST',
                            waitTitle :'系统提示',
                            waitMsg:'正在导出,请稍后...',
                            success:function(form,action){
                                Ext.MessageBox.show({
                                    title:'信息',
                                    msg:action.result.msg,
                                    animEl:'export.info',
                                    buttons:{'ok':'确定','no':'下载'},
                                    icon:Ext.MessageBox.INFO,
                                    closable:false,
                                    fn:function(e){
                                        if(e=='ok'){
                                            grid.render();
                                            store.reload();
                                            win.close();
                                        }else if(e=='no'){
                                            grid.render();
                                            store.reload();
                                            win.close();
                                            var name = action.result.fileName;
                                            downloadByFileName(name);
                                        }
                                    }
                                });
                            }
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

function manager_file(grid,store){
    var record = new Ext.data.Record.create([
	    {name:'fileName',	mapping:'fileName'}
    ]);
    var start = 0;
    var pageSize = 10;
    var store = new Ext.data.GroupingStore({
        proxy : new Ext.data.HttpProxy({ url:'../../AuditCompareAction_selectFile.action' }),
        reader : new Ext.data.JsonReader({ totalProperty:'total', root:'rows' },record)
    });
    store.load({params:{ start:start,limit:pageSize} });
    var boxM = new Ext.grid.CheckboxSelectionModel();   //复选框
    var rowNumber = new Ext.grid.RowNumberer();         //自动 编号
    var colM = new Ext.grid.ColumnModel([
        boxM,
        rowNumber,
        {header:"导出文件名",	dataIndex:'fileName',	align:'center',menuDisabled:true},
        {header:'操作标记',	dataIndex:'flag',		align:'center',menuDisabled:true,renderer:showURL_flag,width:30}
    ]);
    colM.defaultSortable = true;
    var gridPanel= new Ext.grid.GridPanel({
        id:'grid.file.info',
        plain:true,
//        animCollapse:true,
        loadMask:{msg:'正在加载数据，请稍后...'},
        border:false,
//        collapsible:false,
        cm:colM,
        sm:boxM,
        store:store,
        stripeRows:true,
//        autoExpandColumn:2,
        disableSelection:true,
        bodyStyle:'width:100%',
        enableDragDrop: true,
        selModel:new Ext.grid.RowSelectionModel({singleSelect:true}),
        /*viewConfig:{
            forceFit:true,
            enableRowBody:true,
            getRowClass:function(record,rowIndex,p,store){
                return 'x-grid3-row-collapsed';
            }
        },*/
        tbar:[
            new Ext.Button({
                id:'delete.check.info',
                text:'删除',
                iconCls:'delete',
                handler:function(){
                    deleteFile(gridPanel,store);
                }
            })
        ],
        view:new Ext.grid.GroupingView({
            forceFit:true,
            groupingTextTpl:'{text}({[values.rs.length]}条记录)'
        }),
        bbar:new Ext.PagingToolbar({
            pageSize : pageSize,
            store:store,
            displayInfo:true,
            displayMsg:"显示第{0}-{1}条,共{2}条记录",
            emptyMsg:"没有记录",
            beforePageText:"当前页",
            afterPageText:"共{0}页"
        })
    });
    var win = new Ext.Window({
        title:"导出文件管理",
        width:480,
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
}

function showURL_flag(v,p,r){
    var fileName = r.get('fileName');
    return "<a href='javascript:;' onclick='downloadByFileName(\""+fileName+"\");' style='color: green;'>下载</a>";
}

function downloadByFileName(fileName){
    if (!Ext.fly('downForm')){
        var downForm = document.createElement('form');
        downForm .id = 'downForm';
        downForm .name = 'downForm';
        downForm .className = 'x-hidden';
        downForm .action = 'AuditCompareAction_download.action';
        downForm .method = 'post';
        //downForm .target = '_blank'; //打开新的下载页面
        var data = document.createElement('input');
        data.type = 'hidden';//隐藏域
        data.name = 'fileName';// form表单参数
        data.value = fileName;//form表单值
        downForm.appendChild(data);
        document.body.appendChild(downForm );
    }
    Ext.fly('downForm').dom.submit();
    if (Ext.fly('downForm')){
        document.body.removeChild(downForm );
    }
}

function deleteFile(grid,store){
    var grid = Ext.getCmp('grid.file.info');
    var store = grid.getStore();
    var fileNames = new Array();
        var record = grid.getSelectionModel().getSelections();
        for(var i = 0; i < record.length; i++){
            fileNames[i] = record[i].get('fileName');
        }
    /*var fileName;
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
            fileName = item.data.fileName;
        });
    }*/
    Ext.MessageBox.show({
        title:'信息',
        msg:'<font color="green">确定要删除所选记录？</font>',
        animEl:'export.info',
        width:250,
        buttons:{'ok':'确定','no':'取消'},
        icon:Ext.MessageBox.INFO,
        closable:false,
        fn:function(e){
            if(e == 'ok'){
                var myMask = new Ext.LoadMask(Ext.getBody(),{
                    msg:'正在删除,请稍后...',
                    removeMask : true
                });
                myMask.show();
                Ext.Ajax.request({
                    url : '../../AuditCompareAction_deleteFile.action',
                    params :{fileNames : fileNames},
                    success : function(action){
                        var json = Ext.decode(action.responseText);
                        myMask.hide();
                        Ext.MessageBox.show({
                            title:'信息',
                            width:json.code,
                            msg:json.msg,
                            animEl:'export.info',
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