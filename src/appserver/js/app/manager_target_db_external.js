/**
 * Created by IntelliJ IDEA.
 * User: 钱晓盼
 * Date: 11-11-29
 * Time: 下午3:10
 * To change this template use File | Settings | File Templates.
 */
/********************************************* -- external function -- ******************************************************************************/

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
 * 重置应用状态
 */
function external_update_status(){
    var grid = Ext.getCmp('grid.db.external.info');
    var store = grid.getStore();
    var selModel = grid.getSelectionModel();
    var count = selModel.getCount();
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
            var appName = item.data.appName;
            Ext.MessageBox.show({
                title:'信息',
                msg:'<font color="green">确定要重置所选记录的状态？</font>',
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
                            url : '../../AppTypeAction_initStatus.action',             // 删除 连接 到后台
                            params :{appName : appName},
                            success : function(r,o){
                                myMask.hide();
                                var respText = Ext.util.JSON.decode(r.responseText);
                                var msg = respText.msg;
                                Ext.MessageBox.show({
                                    title:'信息',
                                    msg:msg,
                                    width:300,
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
        title:"数据源"+dbName+"下表属性",
        width:600,
        height:330,
        layout:'fit',
        modal:true,
        items: [grid]
    }).show();
    function external_showURL_table_source_attribute_flag(value){
       return "<a href='javascript:;' style='color: green;' onclick='external_update_db_source_attribute(\""+appName+"\",\""+dbName+"\",\""+operation+"\");'>查看表属性</a>";
    }
}


function external_showURL_is_pk(value){
    return (value=='true'||value==true)?'是':'否';
}

/**
 * 数据源 表集合  查看表属性
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
        {header:"主键",  dataIndex:"is_pk",		    align:'center',sortable:true,menuDisabled:true,renderer:external_showURL_is_pk},//editor:is_pk,
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
        height:290,
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
        bbar:new Ext.PagingToolbar({
            pageSize : pageSize,
            store:store,
            displayInfo:true,
            displayMsg:"显示第{0}条记录到第{1}条记录，一共{2}条",
            emptyMsg:"没有记录",
            beforePageText:"当前页",
            afterPageText:"共{0}页"
        })
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