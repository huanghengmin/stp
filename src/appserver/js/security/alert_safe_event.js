/**
 * 安全事件报警
 */
Ext.onReady(function(){
	Ext.QuickTips.init();
	var pageSize = 15;
    var equRecord = new Ext.data.Record.create([
        {name:'key',mapping:'key'},
        {name:'value',mapping:'value'}
    ]);
    var equStore = new Ext.data.Store({
        autoLoad : true,
        url:'../../SecurityAction_equ.action',
        reader:new Ext.data.JsonReader({totalProperty:'total',root:'rows'},equRecord)
    });
    equStore.load();
    var bizRecord = new Ext.data.Record.create([
        {name:'biz',mapping:'biz'}
    ]);
    var bizStore = new Ext.data.Store({
        url:'../../SecurityAction_biz.action',
        reader:new Ext.data.JsonReader({totalProperty:'total',root:'rows'},bizRecord)
    });
    bizStore.load();
    var sysRecord = new Ext.data.Record.create([
        {name:'system',mapping:'system'}
    ]);
    var sysStore = new Ext.data.Store({
        url:'../../SecurityAction_system.action',
        reader:new Ext.data.JsonReader({totalProperty:'total',root:'rows'},sysRecord)
    });
    sysStore.load();
	var alertTypeStore = new Ext.data.JsonStore({
        autoLoad : true,
		url:'../../SecurityAction_alertTypeEvent.action',
        storeId : 'alertType',
		root : 'rows',
		idProperty : 'value',
		fields : ['value', 'key']
	});
//	alertTypeStore.load();
	var b=new Ext.Toolbar({
		width:720,height:30,
		items:["起始日期：",
            {id:"startDate",xtype:"datefield",name:"startDate",emptyText:"点击输入日期",format:"Y-m-d"},
            {xtype:"tbspacer",width:10},
            "结束日期：",
            {id:"endDate",xtype:"datefield",name:"endDate",emptyText:"点击输入日期",format:"Y-m-d"},
            {xtype:"tbspacer",width:10},
            "事件类型：",
            {
                id:'event.type.info',
                xtype : 'combo',
                store : new Ext.data.ArrayStore({
                    autoDestroy : true,
                    fields : ['value', 'key'],
                    data : [
                        ['business', '业务安全事件'],
                        ['equipment', '设备安全事件'],
                        ['system', '系统安全事件']
                    ]
                }),
                valueField : 'value',
                displayField : 'key',
                mode : 'local',
                forceSelection : true,
                editable:true,
                triggerAction : 'all',
                emptyText : '--请选择--',
                selectOnFocus : true,
                width : 100,
                listeners:{
                    select : function(combo, record,index){
                        var value = this.getValue();
                        Ext.getCmp('eventName.info').show();
                        if(value=='business'){
                            Ext.getCmp('name.b.tb.info').show();
                            Ext.getCmp('name.e.tb.info').hide();
                            Ext.getCmp('name.s.tb.info').hide();
                            Ext.getCmp('name.e.tb.info').setValue('');
                            Ext.getCmp('name.s.tb.info').setValue('');
                        } else if(value == 'equipment') {
                            Ext.getCmp('name.e.tb.info').show();
                            Ext.getCmp('name.b.tb.info').hide();
                            Ext.getCmp('name.s.tb.info').hide();
                            Ext.getCmp('name.b.tb.info').setValue('');
                            Ext.getCmp('name.s.tb.info').setValue('');
                        } else if(value == 'system') {
                            Ext.getCmp('name.s.tb.info').show();
                            Ext.getCmp('name.b.tb.info').hide();
                            Ext.getCmp('name.b.tb.info').setValue('');
                            Ext.getCmp('name.e.tb.info').hide();
                            Ext.getCmp('name.e.tb.info').setValue('');
                        }
                    }
                }
            }, { xtype : 'tbspacer', width : 10 },
            new Ext.form.DisplayField({
                id:'eventName.info',
                hidden:true,value:"事件名："}),
            new Ext.form.ComboBox({
                hidden:true,
                id:"name.b.tb.info",
                autoLoad:true,
                store:bizStore,
                valueField : 'biz',
                displayField : 'biz',
                mode:"remote",
                value:"",emptyText : '--请选择--',
                forceSelection:true,triggerAction:"all",selectOnFocus:true
            }),
            new Ext.form.ComboBox({
                id:"name.e.tb.info",
                store:equStore,
                hidden:true,
                valueField : 'value',
                displayField : 'key',
                mode:"remote",
                value:"",emptyText : '--请选择--',
                forceSelection:true,triggerAction:"all",selectOnFocus:true
            }),
            new Ext.form.ComboBox({
                id:"name.s.tb.info",
                store:sysStore,
                hidden:true,
                valueField : 'system',
                displayField : 'system',
                mode:"remote",
                value:"",emptyText : '--请选择--',
                forceSelection:true,
                triggerAction:"all",selectOnFocus:true
            }),
            {xtype:"tbspacer",width:10},
            "报警类型：",
            new Ext.form.ComboBox({
                id:"alertType",
                store:alertTypeStore,
                valueField:"value",
                displayField:"key",
                mode:"remote",
                emptyText : '--请选择--',forceSelection:true,triggerAction:"all",selectOnFocus:true
            }),
            {xtype:"tbspacer",width:10},
            '状态',{
                id : 'read.tb.info',
                xtype : 'combo',
                store : new Ext.data.ArrayStore({
                    autoDestroy : true,
                    fields : ['value', 'key'],
                    data : [
                        ['all', '全部'],
                        ['Y', '已读'],
                        ['N', '未读']
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
                width : 80
            }, {
                xtype : 'tbspacer',
                width : 10
            }, {text:"查询",iconCls:'query',listeners:{
                click:function(){
                    var f=Ext.fly("startDate").dom.value=="点击输入日期"?null:Ext.fly("startDate").dom.value;
                    var i=Ext.fly("endDate").dom.value=="点击输入日期"?null:Ext.fly("endDate").dom.value;
                    var name = Ext.fly('name.b.tb.info').dom.value == '--请选择--'
                        ? ''
                        : Ext.getCmp("name.b.tb.info").getValue();
                    if(name==''){
                        name = Ext.fly('name.e.tb.info').dom.value == '--请选择--'
                            ? ''
                            : Ext.getCmp("name.e.tb.info").getValue();
                    }
                    var alertCode = Ext.fly('alertType').dom.value == '--请选择--'
                        ? ''
                        : Ext.getCmp("alertType").getValue();
                    var read = Ext.fly('read.tb.info').dom.value == '--请选择--'
                        ? ''
                        : Ext.getCmp("read.tb.info").getValue();
                    var eventType = Ext.fly('event.type.info').dom.value == '--请选择--'
                        ? ''
                        : Ext.getCmp('event.type.info').getValue();
                    if(f!=null && i!=null) {
                        var myMask = new Ext.LoadMask(Ext.getBody(),{
                            msg : '正在处理,请稍后...',
                            removeMask : true
                        });
                        myMask.show();
                        Ext.Ajax.request({
                            url : '../../AuditAction_checkDate.action',
                            params : {startDate:f,endDate:i},
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
                                                Ext.getCmp('endDate').setValue('');
                                            }
                                        }
                                    });
                                } else{
                                    store.setBaseParam("startDate",f);
                                    store.setBaseParam("endDate",i);
                                    store.setBaseParam("name",name);
                                    store.setBaseParam("alertCode",alertCode);
                                    store.setBaseParam("read", read);
                                    store.setBaseParam("eventType", eventType);
                                    store.load({
                                        params : {
                                            start : 0,
                                            limit : pageSize
                                        }
                                    });
                                }
                            }
                        });
                    } else {
                        store.setBaseParam("startDate",f);
                        store.setBaseParam("endDate",i);
                        store.setBaseParam("name",name);
                        store.setBaseParam("alertCode",alertCode);
                        store.setBaseParam("read", read);
                        store.setBaseParam("eventType", eventType);
                        store.load({
                            params : {
                                start : 0,
                                limit : pageSize
                            }
                        });
                    }
                }
            }},"-",
            {pressed:false,text:"标记为已读",id:"delete_btn",
                handler:function(){
                    var selectedRows=d.getSelectionModel().getSelections();
                    if(selectedRows.length==0){
                        Ext.Msg.alert("警告","请选中你要标记的行！")
                    }else{
                        var ids = new Array();
                        for (var i = 0; i < selectedRows.length; i++) {
                            ids[i] = selectedRows[i].data.id;
                        }
                        var myMask = new Ext.LoadMask(Ext.getBody(),{
                            msg:'正在标记,请稍后...',
                            removeMask:true
                        });
                        myMask.show();
                        Ext.Ajax.request({
                            url : '../../SecurityAction_setEventRead.action',
                            params:{ids:ids},
                            success:function(i,j){
                                myMask.hide();
                                d.render();
                                store.reload()
                            }
                        })
                    }
                }
            }
		]
	});
    var record = new Ext.data.Record.create([
        {name:'id',			mapping:'id'},
        {name:'alertTime',	mapping:'alertTime'},
        {name:'name',		    mapping:'name'},
        {name:'objType',		mapping:'objType'},
        {name:'alertType',	mapping:'alertType'},
        {name:'alertInfo',	mapping:'alertInfo'},
        {name:'ip',		    mapping:'ip'},
        {name:'isRead',		mapping:'isRead'}
    ]);
    var proxy = new Ext.data.HttpProxy({
        url : '../../SecurityAction_selectEvent.action'
    });
    var reader = new Ext.data.JsonReader({
        totalProperty:'total',
        root:'rows',
        idProperty : 'id'
    },record);
    var store = new Ext.data.GroupingStore({
        id:"store.info",
        proxy : proxy,
        reader : reader
    });
	var e=new Ext.grid.CheckboxSelectionModel();
    var rowNumber = new Ext.grid.RowNumberer();         //自动 编号
	var d=new Ext.grid.GridPanel({
		store:store,
		loadMask:true,trackMouseOver:true,columnLines:true,
		columns:[e,rowNumber,{id:"id",dataIndex:"id",hidden:true},
		         {align:'center',header:"报警时间",dataIndex:"alertTime",width:150,menuDisabled:true,sortable:true},
		         {align:'center',header:"事件名",dataIndex:"name",width:200,menuDisabled:true},
		         {align:'center',header:"事件类型",dataIndex:"objType",width:100,menuDisabled:true,renderer:objTypeShowURL},
		         {align:'center',header:"报警类型",dataIndex:"alertType",width:150,menuDisabled:true},
		         {align:'center',header:"IP地址",dataIndex:"ip",width:150,menuDisabled:true},
		         {align:'center',header:"状态",dataIndex:"isRead",width:100,menuDisabled:true,renderer:function(f,h,g){return f== 'Y' ? '<font color="green">已读</font>' : '<font color="red">未读</font>';}},
		         {align:'center',header:"报警内容",dataIndex:"alertInfo",width:300,menuDisabled:true}
		 ],
		sm:e,
		bbar:new Ext.PagingToolbar({
            pageSize : pageSize,
            store:store,
            displayInfo:true,
            displayMsg:"显示第{0}条记录到第{1}条记录，一共{2}条",
            emptyMsg:"没有记录",
            beforePageText:"当前页",
            afterPageText:"共{0}页"
        }),
        tbar:b,
        viewConfig:{}
	});

    function objTypeShowURL(value){
        if(value=='business'){
            return '业务安全事件';
        } else if(value=='equipment'){
            return '设备安全事件';
        } else if(value='system') {
            return '系统安全事件';
        }
    }
	var a=new Ext.Viewport({
		layout:"fit",
		border:false,
		items:[d]
	});
	store.load({params:{start:0,limit:pageSize}});
});
