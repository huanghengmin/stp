/**
 * Created by IntelliJ IDEA.
 * User: 钱晓盼
 * Date: 12-6-19
 * Time: 上午10:19
 * To change this template use File | Settings | File Templates.
 * 设备日志审计(设备审计表)
 */
Ext.onReady(function() {

	Ext.BLANK_IMAGE_URL = '../../js/ext/resources/images/default/s.gif';

	Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget = 'side';
    var equipmentNameRecord = new Ext.data.Record.create([
        {name:'value',mapping:'value'},
        {name:'key',mapping:'key'}
    ]);
    var equipmentNameStore = new Ext.data.Store({
        url:'../../EquipmentAction_selectEquipmentNameKeyValue.action',
        reader:new Ext.data.JsonReader({totalProperty:'total',root:"rows"},equipmentNameRecord)
    });
    equipmentNameStore.load();
    var start = 0;
    var pageSize = 15;
    var tb = new Ext.Toolbar({
        width : 800,
        height : 30,
        items : []
    });
    var record = new Ext.data.Record.create([
        {name:'id',			   mapping:'id'},
        {name:'equipmentName',  mapping:'equipmentName'},
        {name:'equipmentDesc',  mapping:'equipmentDesc'},
        {name:'level',		       mapping:'level'},
        {name:'linkName',	       mapping:'linkName'},
        {name:'auditInfo',	   mapping:'auditInfo'},
        {name:'logTime',		   mapping:'logTime'}
    ]);
    var proxy = new Ext.data.HttpProxy({
        url:"../../AuditAction_selectEquipmentAudit.action"
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
        {header:'审计时间',		dataIndex:'logTime',		   align:'center',sortable:true,width:120},
        {header:"设备编号",			dataIndex:"equipmentName", align:'center',sortable:true,width:120},
        {header:"设备名",			dataIndex:"equipmentDesc", align:'center',sortable:true,width:200},
//        {header:'链路名称',	    dataIndex:'linkName',	   align:'center',sortable:true,},
        {header:"日志等级",		dataIndex:"level",	       align:'center',sortable:true,width:80},
        {header:'审计信息',	    dataIndex:'auditInfo',      align:'center',sortable:true,width:setWidth()-520}

    ]);
    /*for(var i=6;i<14;i++){
        colM.setHidden(i,!colM.isHidden(i));                // 加载后 不显示 该项
    }
    colM.defaultSortable = true;*/
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
        tbar:['起始日期：', {
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
        }, '设备名',{
            id:'equipmentName.tb.info',
            xtype:'combo',
            store:equipmentNameStore,
            valueField : 'value',
            displayField : 'key',
            mode : 'local',
            forceSelection : true,
            triggerAction : 'all',
            emptyText : '--请选择--',
            value : '',
            editable : true,
            selectOnFocus : true,
            width : 150
        },{
            xtype : 'tbseparator'
        },'日志等级',{
            id : 'logLevel.tb.info',
            xtype : 'combo',
            store : new Ext.data.ArrayStore({
                autoDestroy : true,
                fields : ['value', 'key'],
                data : [
                    ['INFO', 'INFO'],
                    ['WARN', 'WARN'],
                    ['ERROR', 'ERROR']
                ]
            }),
            valueField : 'value',
            displayField : 'key',
            mode : 'local',
            forceSelection : true,
            triggerAction : 'all',
            emptyText : '--请选择--',
            value : '',
            selectOnFocus : true,
            width : 100
        }, {
            xtype : 'tbseparator'
        }, {
            text : '查询',
            iconCls:'query',
            listeners : {
                click : function() {
                    var logLevel = Ext.fly('logLevel.tb.info').dom.value == '--请选择--'
                        ? null
                        : Ext.getCmp('logLevel.tb.info').getValue();
                    var startDate = Ext.fly("startDate.tb.info").dom.value == '点击输入日期'
                        ? null
                        : Ext.fly('startDate.tb.info').dom.value;
                    var endDate = Ext.fly('endDate.tb.info').dom.value == '点击输入日期'
                        ? null
                        : Ext.fly('endDate.tb.info').dom.value;
                    var equipmentName = Ext.fly('equipmentName.tb.info').dom.value == '--请选择--'
                        ? null
                        :Ext.getCmp('equipmentName.tb.info').getValue();
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
                                    store.setBaseParam('logLevel', logLevel);
                                    store.setBaseParam('equipmentName', equipmentName);
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
                        store.setBaseParam('logLevel', logLevel);
                        store.setBaseParam('equipmentName', equipmentName);
                        store.load({
                            params : {
                                start : start,
                                limit : pageSize
                            }
                        });
                    }
                }
            }
        }, {
            xtype : 'tbseparator'
        },{
            id :'truncate.tb.info',
            text : '清空',
            iconCls:'removeall',
            listeners : {
                click : function() {
                    var logLevel = Ext.fly('logLevel.tb.info').dom.value == '--请选择--'
                        ? null
                        : Ext.fly('logLevel.tb.info').dom.value;
                    var startDate = Ext.fly("startDate.tb.info").dom.value == '点击输入日期'
                        ? null
                        : Ext.fly('startDate.tb.info').dom.value;
                    var endDate = Ext.fly('endDate.tb.info').dom.value == '点击输入日期'
                        ? null
                        : Ext.fly('endDate.tb.info').dom.value;
                    var equipmentName = Ext.fly('equipmentName.tb.info').dom.value == '--请选择--'
                        ? null
                        :Ext.getCmp('equipmentName.tb.info').getValue();
                    Ext.MessageBox.show({
                        title:'信息',
                        msg:"<font color='green'>确定要清空?</font>",
                        animEl:'truncate.tb.info',
                        buttons:{'ok':'确定','no':'取消'},
                        icon:Ext.MessageBox.WARNING,
                        closable:false,
                        fn:function(e){
                            if(e=='ok'){
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
                                         id:'password.info',
                                         fieldLabel:"请输入密码",
                                         xtype:'textfield',
                                         name:'password',
                                         emptyText :'请输入密码'
                                     }]
                                });
                                var win = new Ext.Window({
                                    title:"提示信息",
                                    width:400,
                                    height:110,
                                    layout:'fit',
                                    modal:true,
                                    items: [formPanel],
                                    bbar:[
                                        new Ext.Toolbar.Fill(),
                                        new Ext.Button ({
                                            id:'ok.info',
                                            text : '确定',
                                            allowDepress : false,
                                            handler : function() {
                                                if(formPanel.form.isValid()){
                                                    var myMask = new Ext.LoadMask(Ext.getBody(),{
                                                        msg : '正在处理,请稍后...',
                                                        removeMask : true
                                                    });
                                                    myMask.show();
                                                    var password = Ext.getCmp('password.info').getValue();
                                                    Ext.Ajax.request({
                                                        url : '../../AuditAction_truncateEquipment.action',
                                                        params : {logLevel:logLevel,startDate:startDate,endDate:endDate,equipmentName:equipmentName,password:password},
                                                        method :'POST',
                                                        success:function(r,o){
                                                            myMask.hide();
                                                            var respText = Ext.util.JSON.decode(r.responseText);
                                                            var msg = respText.msg;
                                                            Ext.MessageBox.show({
                                                                title:'信息',
                                                                width:250,
                                                                msg:msg,
                                                                animEl:'ok.info',
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
                                        }),
                                        new Ext.Button ({
                                            allowDepress : false,
                                            text : '关闭',
                                            handler : function() {win.close();}
                                        })
                                    ]
                                }).show();
                            }
                        }
                    });
                }
            }
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
