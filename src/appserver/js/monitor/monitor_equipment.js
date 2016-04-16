/**
 * 设备运行监控
 */
Ext.onReady(function() {

	Ext.BLANK_IMAGE_URL = '../../js/ext/resources/images/default/s.gif';
    Ext.chart.Chart.CHART_URL = '../../js/ext/resources/charts.swf';
	Ext.QuickTips.init();
	Ext.form.Field.prototype.msgTarget = 'side';

    var record = new Ext.data.Record.create([
        {name:'id',			    mapping:'id'},
        {name:'equipmentName',	mapping:'equipmentName'},
        {name:'equipmentDesc',	mapping:'equipmentDesc'},
        {name:'runStatus',       	mapping:'runStatus'},
        {name:'ping',       	mapping:'ping'},
        {name:'telnet',       	mapping:'telnet'},
        {name:'monitorUsed',     mapping:'monitorUsed'},
        {name:'ip',             	mapping:'ip'},
        {name:'port',             	mapping:'port'},
        {name:'otherIp',          mapping:'otherIp'},
        {name:'isKeyDevice',     mapping:'isKeyDevice'},
        {name:'mac',              mapping:'mac'},
        {name:'subNetMask',      mapping:'subNetMask'},
        {name:'equipmentTypeCode',       mapping:'equipmentTypeCode'},
        {name:'equipmentTypeName',       mapping:'equipmentTypeName'},
        {name:'equipmentSysConfig',      mapping:'equipmentSysConfig'},
        {name:'equipmentManagerDepart', mapping:'equipmentManagerDepart'},
        {name:'linkType',       	mapping:'linkType'},
        {name:'linkName',		    mapping:'linkName'},
        {name:'oidName',		    mapping:'oidName'},
        {name:'snmpVer',		    mapping:'snmpVer'},
        {name:'auth',		        mapping:'auth'},
        {name:'common',		    mapping:'common'},
        {name:'test',		    mapping:'test'}
    ]);

    var proxy = new Ext.data.HttpProxy({
        url:"../../MonitorAction_selectEquipment.action"
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
    var rowNumber = new Ext.grid.RowNumberer();         //自动 编号
    var colM = new Ext.grid.ColumnModel([
//        boxM,
        rowNumber,
        {header:"设备编号",		dataIndex:"equipmentName",  align:'center',sortable:true,menuDisabled:true},
        {header:"设备名",		dataIndex:"equipmentDesc",  align:'center',sortable:true,menuDisabled:true},
        {header:"设备类型",	dataIndex:"equipmentTypeName",  align:'center',sortable:true,menuDisabled:true},
        {
			header : '运行状态',
			dataIndex : 'runStatus',
			align : 'center',
			sortable : false,
			menuDisabled : true,
			width : 40,
			renderer : show_runStatus
		},
        {header:"链路类型",	dataIndex:"linkType",	    align:'center',sortable:true,menuDisabled:true,renderer:show_linkType,width:50},
        {header:"IP地址",	    dataIndex:"ip",               align:'center',sortable:true,menuDisabled:true,width:50},
        {header:"端口",	    dataIndex:"port",             align:'center',sortable:true,menuDisabled:true,width:40},
        {
			header : '网络状态',
			dataIndex : 'ping',
			align : 'center',
			sortable : false,
			menuDisabled : true,
			width : 40,
			renderer : show_pingStatus
		},{
			header : '通道测试',
			dataIndex : 'test',
			align : 'center',
			sortable : false,
			menuDisabled : true,
			width : 40,
			renderer : show_test
		},
        {header:'操作标记',	dataIndex:'id',		        align:'center',sortable:true,menuDisabled:true, renderer:show_flag,width:150}
    ]);
    var grid_panel = new Ext.grid.GridPanel({
        id:'grid.info',
        autoScroll:true,
        title:'<center><font size="4">平台设备</font></center>',
        height:100,
        width:setWidth(),
        animCollapse:true,
        loadMask:{msg:'正在加载数据，请稍后...'},
        border:false,
        collapsible:false,
        cm:colM,
        store:store,
        stripeRows:true,
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
       })
    });

    var record_2 = new Ext.data.Record.create([
        {name:'id',			    mapping:'id'},
        {name:'equipmentName',	mapping:'equipmentName'},
        {name:'equipmentDesc',	mapping:'equipmentDesc'},
        {name:'runStatus',       	mapping:'runStatus'},
        {name:'ping',       	mapping:'ping'},
        {name:'telnet',       	mapping:'telnet'},
        {name:'monitorUsed',     mapping:'monitorUsed'},
        {name:'ip',             	mapping:'ip'},
        {name:'port',             	mapping:'port'},
        {name:'otherIp',          mapping:'otherIp'},
        {name:'isKeyDevice',     mapping:'isKeyDevice'},
        {name:'mac',              mapping:'mac'},
        {name:'subNetMask',      mapping:'subNetMask'},
        {name:'equipmentTypeCode',       mapping:'equipmentTypeCode'},
        {name:'equipmentTypeName',       mapping:'equipmentTypeName'},
        {name:'equipmentSysConfig',      mapping:'equipmentSysConfig'},
        {name:'equipmentManagerDepart', mapping:'equipmentManagerDepart'},
        {name:'linkType',       	mapping:'linkType'},
        {name:'linkName',		    mapping:'linkName'},
        {name:'oidName',		    mapping:'oidName'},
        {name:'snmpVer',		    mapping:'snmpVer'},
        {name:'auth',		        mapping:'auth'},
        {name:'common',		    mapping:'common'}
    ]);
    var proxy_2 = new Ext.data.HttpProxy({
        url:"../../MonitorAction_selectEquipment2.action"
    });
    var reader_2 = new Ext.data.JsonReader({
        totalProperty:"total",
        root:"rows",
        id:'id'
    },record_2);
    var store_2 = new Ext.data.GroupingStore({
        id:"store.2.info",
        proxy : proxy_2,
        reader : reader_2
    });
    var rowNumber_2 = new Ext.grid.RowNumberer();         //自动 编号
    var colM_2 = new Ext.grid.ColumnModel([
        rowNumber_2,
        {header:"设备编号",		dataIndex:"equipmentName",  align:'center',sortable:true,menuDisabled:true},
        {header:"设备名",		dataIndex:"equipmentDesc",  align:'center',sortable:true,menuDisabled:true},
        {header:"设备类型",	dataIndex:"equipmentTypeName",  align:'center',sortable:true,menuDisabled:true},
        {
			header : '运行状态',
			dataIndex : 'runStatus',
			align : 'center',
			sortable : false,
			menuDisabled : true,
			width : 40,
			renderer : show_runStatus
		},
        {header:"链路类型",	dataIndex:"linkType",	    align:'center',sortable:true,menuDisabled:true,renderer:show_linkType,width:50},
        {header:"IP地址",	    dataIndex:"ip",               align:'center',sortable:true,menuDisabled:true,width:50},
        {header:"端口",	    dataIndex:"port",             align:'center',sortable:true,menuDisabled:true,width:40},
        {
			header : '网络状态',
			dataIndex : 'ping',
			align : 'center',
			sortable : false,
			menuDisabled : true,
			width : 40,
			renderer : show_pingStatus
		},{
			header : '服务状态',
			dataIndex : 'telnet',
			align : 'center',
			sortable : false,
			menuDisabled : true,
			width : 40,
			renderer : show_telnetStatus
		},
        {header:'操作标记',	dataIndex:'id',		        align:'center',sortable:true,menuDisabled:true, renderer:show_flag_2,width:150}
    ]);
    var grid_panel_2 = new Ext.grid.GridPanel({
        id:'grid.2.info',
        autoScroll:true,
        title:'<center><font size="4">外部设备</font></center>',
        animCollapse:true,
        height:setHeight(),
        width:setWidth(),
        loadMask:{msg:'正在加载数据，请稍后...'},
        border:false,
        collapsible:false,
        cm:colM_2,
        store:store_2,
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
        view:new Ext.grid.GroupingView({
            forceFit:true,
            groupingTextTpl:'{text}({[values.rs.length]}条记录)'
        })
    });

    var port = new Ext.Viewport({
        layout:'fit',
        renderTo: Ext.getBody(),
        items:[{
        	autoScroll:true,
        	items:[grid_panel,grid_panel_2]
        }]
    });
    store.load();
    store_2.load();
    var task = {
		run : function() {
			store.reload();
            store_2.reload();
		},
		interval : 30000 // 30秒
	}
	Ext.TaskMgr.start(task);
});
function setHeight(){
	var h = document.body.clientHeight-8;
	return h-100;
}

function setWidth(){
    return document.body.clientWidth-8;
}

function show_runStatus (v) {
    if (v == 200) {
        return '<img src="../../img/icon/ok.png" alt="运行正常" title="运行正常" />';
    } else if (v == 501) {
        return '<img src="../../img/icon/warning.png" alt="告警" title="告警"/>';
    } else if (v == 503) {
        return '<img src="../../img/icon/off.gif" alt="服务不可用" title="服务不可用"/>';
    } else {
        return '<img src="../../img/icon/off.gif" alt="异常" title="异常"/>';
    }
}

function show_pingStatus (v) {
    if (v == 200||v=='200') {
        return '<img src="../../img/icon/ok.png" alt="正常" title="正常" />';
    } else {
        return '<img src="../../img/icon/off.gif" alt="异常" title="异常"/>';
    }
}

function show_test(test){
    if(test=='ext'){
        return '<a href="javascript:;" onclick="test_channel_1();" style="color: green;">测试</a>'
    } else if(test=='true') {
        return '<img src="../../img/icon/ok.png" alt="通道连通" title="通道连通" />';
    } else if(test=='false') {
        return '<img src="../../img/icon/off.gif" alt="需要重新测试" title="需要重新测试" />';
    } else if(test = 'int') {
        return "";
    }
}

function show_telnetStatus (v) {
    if (v == 200||v=='200') {
        return '<img src="../../img/icon/ok.png" alt="开启" title="开启" />';
    } else {
        return '<img src="../../img/icon/off.gif" alt="关闭" title="关闭"/>';
    }
}

function show_linkType(value){
    if(value=='ext'){
        return '外部链路';
    } else if(value=='int') {
        return '内部链路';
    }
}

function show_flag(value, p, r){
    var equipmentName = r.get('equipmentName');
    var runStatus = r.get('runStatus');
    var ip = r.get('ip');
    var port = r.get('port');
    var otherIp = r.get('otherIp');
    var temp = "&nbsp;&nbsp;";
    var ping = "<a href='javascript:void(0);' onclick='pingTest(\""+ip+"\",\""+equipmentName+"\");return false;' style='color: green;'>连通测试</a>" + temp ;
    var telnet = "<a href='javascript:void(0);' onclick='telnetTest(\""+ip+"\",\""+port+"\",\""+equipmentName+"\");return false;' style='color: green;'>端口测试</a>" + temp ;
    var run = "<a href='javascript:void(0);' onclick='equipmentRunInfo(\""+value+"\",\""+equipmentName+"\",\""+runStatus+"\");return false;' style='color: green;'>运行信息</a>" + temp ;
    var detail = "<a href='javascript:void(0);' onclick='equipmentDetailInfo();return false;' style='color: green;'>设备信息</a>" + temp ;
    var alertConfig = "<a href='javascript:void(0);' onclick='equipmentAlertConfig(\""+value+"\",\""+equipmentName+"\");return false;' style='color: green;'>告警配置</a>";
    var flag = value.indexOf("ext_");
    if(r.get('linkType')=='ext'&& flag == 0){
        ping = "<font color='gray'>连通测试</font>" + temp;
        telnet = "<font color='gray'>端口测试</font>" + temp;
        alertConfig = "<a href='javascript:void(0);' onclick='equipmentAlertConfigDisplay(\""+value+"\",\""+equipmentName+"\");return false;' style='color: green;'>告警配置</a>";
    }
    return detail + ping + telnet + run + alertConfig;
}

function show_flag_2(value, p, r){
    var equipmentName = r.get('equipmentName');
    var runStatus = r.get('runStatus');
    var ip = r.get('ip');
    var port = r.get('port');
    var otherIp = r.get('otherIp');
    var temp = "&nbsp;&nbsp;";
    var ping = "<a href='javascript:void(0);' onclick='pingTest(\""+ip+"\",\""+equipmentName+"\");return false;' style='color: green;'>连通测试</a>" + temp ;
    var telnet = "<a href='javascript:void(0);' onclick='telnetTest(\""+ip+"\",\""+port+"\",\""+equipmentName+"\");return false;' style='color: green;'>端口测试</a>" + temp ;
    var run = "<a href='javascript:void(0);' onclick='equipmentRunInfo(\""+value+"\",\""+equipmentName+"\",\""+runStatus+"\");return false;' style='color: green;'>运行信息</a>" + temp ;
    var detail = "<a href='javascript:void(0);' onclick='equipmentDetailInfo();return false;' style='color: green;'>设备信息</a>" + temp ;
    var alertConfig = "<a href='javascript:void(0);' onclick='equipmentAlertConfig(\""+value+"\",\""+equipmentName+"\");return false;' style='color: green;'>告警配置</a>";
    var flag = value.indexOf("ext_");
    if(r.get('linkType')=='ext'&& flag == 0){
        ping = "<font color='gray'>连通测试</font>" + temp;
        telnet = "<font color='gray'>端口测试</font>" + temp;
        alertConfig = "<a href='javascript:void(0);' onclick='equipmentAlertConfigDisplay(\""+value+"\",\""+equipmentName+"\");return false;' style='color: green;'>告警配置</a>";
    }
    return detail + ping + telnet + run + alertConfig;
}

function test_channel_1() {
    Ext.MessageBox.show({
        title:'信息',
        msg:'<font color="green">确定要测试通道的连通状态？</font>',
        width:300,
        buttons:{'ok':'确定','no':'取消'},
        icon:Ext.MessageBox.WARNING,
        closable:false,
        fn:function(e){
            if(e == 'ok'){
                var myMask = new Ext.LoadMask(Ext.getBody(),{
                    msg : '正在发送测试消息,请稍后...',
                    removeMask : true
                });
                myMask.show();
                Ext.Ajax.request({
                    url:'../../InitAction_sendMonitor.action',
                    method:'POST',
                    params:{channel:1},
                    success:function(response,option){
                        var respText = Ext.util.JSON.decode(response.responseText);
                        var msg = respText.msg;
                        myMask.hide();
                        Ext.MessageBox.show({
                            title:'信息',
                            width:250,
                            msg:msg,
                            buttons:{'ok':'确定'},
                            icon:Ext.MessageBox.INFO,
                            closable:false
                        });
                    }
                });
            }
        }
    });

}

function pingTest(ip,equipmentName){
    var myMask = new Ext.LoadMask(Ext.getBody(),{
        msg:'正在测试,请稍后...',
        removeMask:true
    });
    myMask.show();
    Ext.Ajax.request({
        url:'../../MonitorAction_ping.action',
        method:'POST',
        params:{ip:ip,equipmentName:equipmentName},
        success:function(r,o){
            var respText = Ext.util.JSON.decode(r.responseText);
            var msg = respText.msg;
            myMask.hide();
            Ext.MessageBox.show({
                title:'信息',
                width:400,
                msg:msg,
                buttons:{'ok':'确定'},
                icon:Ext.MessageBox.INFO,
                closable:false,
                fn:function(e){
                    if(e=='ok'){

                    }
                }
            });
        }
    });
}

function telnetTest(ip,port,equipmentName){
    var myMask = new Ext.LoadMask(Ext.getBody(),{
        msg:'正在测试,请稍后...',
        removeMask:true
    });
    myMask.show();
    Ext.Ajax.request({
        url:'../../MonitorAction_telnet.action',
        method:'POST',
        params:{ip:ip,port:port,equipmentName:equipmentName},
        success:function(r,o){
            var respText = Ext.util.JSON.decode(r.responseText);
            var msg = respText.msg;
            myMask.hide();
            Ext.MessageBox.show({
                title:'信息',
                width:200,
                msg:msg,
                buttons:{'ok':'确定'},
                icon:Ext.MessageBox.INFO,
                closable:false,
                fn:function(e){
                    if(e=='ok'){

                    }
                }
            });
        }
    });
}

function equipmentRunInfo(id,equipmentName,runStatus) {
    if(runStatus!=200){
        Ext.MessageBox.show({
            title:'信息',
            width:250,
            msg:'设备'+equipmentName+'监控服务错误!',
            buttons:{'ok':'确定'},
            icon:Ext.MessageBox.INFO,
            closable:false
        });
    } else {
        var record = new Ext.data.Record.create([
            {name:'maxConnect',      mapping:'maxConnect'},
            {name:'connect',       	mapping:'connect'},
            {name:'vpnCount',		    mapping:'vpnCount'},
            {name:'cpu',		        mapping:'cpu'},
            {name:'memory',		    mapping:'memory'},
            {name:'memory_total',	mapping:'memory_total'},
            {name:'disk',		        mapping:'disk'},
            {name:'disk_total',		mapping:'disk_total'}
        ]);
        var proxy = new Ext.data.HttpProxy({
            url:"../../MonitorAction_equipmentRunInfo.action"
        });
        var reader = new Ext.data.JsonReader({
            totalProperty:"total",
            root:"rows"
        },record);
        var store = new Ext.data.GroupingStore({
            id:"store.run.info",
            proxy : proxy,
            reader : reader
        });
        store.load({params:{id:id,equipmentName:equipmentName}});
        store.addListener('load',function(){
            Ext.getCmp('vpnCount.run.info').setValue(store.getAt(0).get('vpnCount'));
            Ext.getCmp('maxConnect.run.info').setValue(store.getAt(0).get('maxConnect'));
            Ext.getCmp('connect.run.info').setValue(store.getAt(0).get('connect'));
            var cpu = store.getAt(0).get('cpu');
            cpuStore.load({params:{cpu:cpu}});
            var disk = store.getAt(0).get('disk');
            var disk_total = store.getAt(0).get('disk_total');
            diskStore.load({params:{disk:disk,disk_total:disk_total}});
            var memory = store.getAt(0).get('memory');
            var memory_total = store.getAt(0).get('memory_total');
            memoryStore.load({params:{memory:memory,memory_total:memory_total}});
        });
        var cpuStore = new Ext.data.Store({
            url:'../../MonitorAction_selectCpu.action',
            reader:new Ext.data.JsonReader({
                    totalProperty:'total',
                    root:'rows'
                },new Ext.data.Record.create([
                {name:'season',mapping:'season'},
                {name:'cpu',mapping:'cpu'}
            ])
            )
        });
        var memoryStore = new Ext.data.Store({
            url:'../../MonitorAction_selectMemory.action',
            reader:new Ext.data.JsonReader({
                    totalProperty:'total',
                    root:'rows'
                },new Ext.data.Record.create([
                {name:'season',mapping:'season'},
                {name:'memory',mapping:'memory'}
            ])
            )
        });
        var diskStore = new Ext.data.Store({
            url:'../../MonitorAction_selectDisk.action',
            reader:new Ext.data.JsonReader({
                    totalProperty:'total',
                    root:'rows'
                },new Ext.data.Record.create([
                {name:'season',mapping:'season'},
                {name:'disk',mapping:'disk'}
            ])
            )
        });

        var formPanel = new Ext.Panel({
            frame:true,
            autoScroll:true,
            border:false,
            layout: 'form',
            items:[{
                plain:true,
                xtype:'form',
                layout:'column',
                border:false,
                items:[{
                    width:170,
                    labelAlign:'right',
                    layout: 'form',
                    labelWidth:70,
                    defaults:{
                        width:90
                    },
                    items:[{
                        xtype:'displayfield',
                        fieldLabel:'设备名',
                        value:equipmentName
                    }]
                },{
                    width:500,
                    items:[{
                        layout: 'column',
                        defaults:{
                            labelAlign:'right'
                        },
                        items:[{
                            columnWidth:.3,
                            labelWidth:90,
                            layout: 'form',
                            items:[{
                                id:'vpnCount.run.info',
                                xtype:'displayfield',
                                fieldLabel:'VPN隧道数'
                            }]
                        },{
                            columnWidth:.35,
                            labelWidth:115,
                            layout: 'form',
                            items:[{
                                id:'maxConnect.run.info',
                                xtype:'displayfield',
                                fieldLabel:'最大允许连接数'
                            }]
                        },{
                            columnWidth:.3,
                            labelWidth:90,
                            layout: 'form',
                            items:[{
                                id:'connect.run.info',
                                xtype:'displayfield',
                                fieldLabel:'当前连接数'
                            }]
                        }]
                    }]
                }]
            },{
                plain:true,
                layout:'fit',
                items:[{
                    plain:true,
                    xtype:'form',
                    labelWidth:50,
                    layout:'column',
                    items:[{
                        columnWidth:.33,
                        xtype:'displayfield',
                        value:'CPU使用状况'
                    },{
                        columnWidth:.33,
                        xtype:'displayfield',
                        value:'内存使用状况'
                    },{
                        columnWidth:.33,
                        xtype:'displayfield',
                        value:'硬盘使用状况'
                    }]
                }]
            },{
                plain:true,
                layout:'column',
                items:[{
                    columnWidth:.33,
                    height:280,
                    items:[{
                        xtype : 'piechart',
                        store : cpuStore,
                        dataField:'cpu',
                        categoryField:'season',
                        series:[{
                            style:{
                                colors:["#00ff00", "#006400"]
                            }
                        }],
                        extraStyle:{
                            legend:{
                                display:'top',
                                padding:5,
                                font:{
                                    family: 'Tahoma',
                                    size: 13
                                }
                            }
                        }
                    }]
                },{
                    columnWidth:.33,
                    height:280,
                    items:[{
                        xtype : 'piechart',
                        store : memoryStore,
                        dataField:'memory',
                        categoryField:'season',
                        series:[{
                            style:{
                                colors:["#00ff00", "#006400"]
                            }
                        }],
                        extraStyle:{
                            legend:{
                                display:'top',
                                padding:5,
                                font:{
                                    family: 'Tahoma',
                                    size: 13
                                }
                            }
                        }
                    }]
                },{
                    columnWidth:.33,
                    height:280,
                    items:[{
                        xtype : 'piechart',
                        store : diskStore,
                        dataField:'disk',
                        categoryField:'season',
                        series:[{
                            style:{
                                colors:["#0000ff", "#ff00ff"]
                            }
                        }],
                        extraStyle:{
                            legend:{
                                display:'top',
                                padding:5,
                                font:{
                                    family: 'Tahoma',
                                    size: 13
                                }
                            }
                        }
                    }]
                }]
            }]
        });

        var win = new Ext.Window({
            title:"设备运行信息",
            width:700,
            layout:'fit',
            height:385,
            modal:true,
            items:formPanel,
            bbar:[
                '->',
                {
                    text:'保存',
                    handler:function(){
                        win.close();
                    }
                },{
                    text:'关闭',
                    handler:function(){
                        win.close();
                    }
                }
            ]
        }).show();

        var task = {
            run : function() {
                store.reload();
            },
            interval : 20000
        }
        Ext.TaskMgr.start(task);
        win.on("close", function() {
            Ext.TaskMgr.stop(task);
        });
    }
}

function equipmentDetailInfo() {
	var grid = Ext.getCmp('grid.info');
    var store = grid.getStore();
    var selModel = grid.getSelectionModel();
    var formPanel;
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
            formPanel = new Ext.form.FormPanel({
                frame:true,
                border:false,
                layout:'column',
                items:[{
                    plain:true,
                    columnWidth :.5,
                    labelAlign:'right',
                    labelWidth:100,
                    border:false,
                    layout: 'form',
                    autoScroll:true,
                    defaultType:'displayfield',
                    defaults : {
                        width : 200,
                        allowBlank : false,
                        blankText : '该项不能为空！'
                    },
                    items:[{
                        fieldLabel:'设备编号',
                        value:item.data.equipmentName
                    },{
                        fieldLabel:'设备名',
                        value:item.data.equipmentDesc
                    },{
                        fieldLabel:'设备类型',
                        value:'<img src="../../img/equ/'+item.data.equipmentTypeCode+'S.PNG" alt="'+item.data.equipmentTypeName+'" title="'+item.data.equipmentTypeName+'"/>' + item.data.equipmentTypeName
                    },{
                        fieldLabel:'是否核心设备',
                        value:(item.data.isKeyDevice=='1')?'<font color="green">是</font>':'<font color="red">否</font>'
                    },{
                        fieldLabel:"IP地址",
                        value:item.data.ip
                    },{
                        fieldLabel:"端口",
                        value:item.data.port
                    },{
                        fieldLabel:"次选IP",
                        value:item.data.otherIp
                    },{
                        fieldLabel:"MAC地址",
                        value:item.data.mac
                    },{
                        fieldLabel:"子网掩码",
                        value:item.data.subNetMask
                    },{
                        fieldLabel:"设备系统配置文件",
                        value:item.data.equipmentSysConfig=='null'||item.data.equipmentSysConfig==''?'<font color="gray">下载</font>':'<a href="javascript:;" onclick="download(\''+item.data.equipmentSysConfig+'\')">下载</a>'
                    }]
                },{
                    plain:true,
                    columnWidth :.5,
                    labelAlign:'right',
                    labelWidth:120,
                    border:false,
                    layout: 'form',
                    autoScroll:true,
                    defaultType:'displayfield',
                    defaults : {
                        width : 150,
                        allowBlank : false,
                        blankText : '该项不能为空！'
                    },
                    items:[{
                        fieldLabel:'链路类型',
                        value:show_linkType(item.data.linkType)
                    },{
                        fieldLabel:'链路名',
                        value:item.data.linkName
                    },{
                        fieldLabel:'是否开启监控',
                        value:(item.data.monitorUsed=='1')?'<font color="green">是</font>':'<font color="red">否</font>'
                    },{
                        fieldLabel:'设备管理单位',
                        value:item.data.equipmentManagerDepart
                    },{
                        fieldLabel:'OID名称',
                        value:item.data.oidName
                    },{
                        fieldLabel:'SNMP类型',
                        value:item.data.snmpVer
                    },{
                        fieldLabel:'授权账号',
                        value:item.data.auth
                    },{
                        fieldLabel:'通讯账号',
                        value:item.data.common
                    }]
                }]
            });
        });
    }
    var win = new Ext.Window({
        title:"设备详细信息",
        width:650,
        layout:'fit',
        height:370,
        modal:true,
        items:formPanel,
        bbar:[
            '->',
            {
                text:'保存',
                handler:function(){
                    win.close();
                }
            },{
                text:'关闭',
                handler:function(){
                    win.close();
                }
            }
        ]
    }).show();
}

function equipmentAlertConfig(id,equipmentName){
    var record = new Ext.data.Record.create([
        {name:'cpu',      mapping:'cpu'},
        {name:'disk',     mapping:'disk'},
        {name:'memory',	mapping:'memory'}
    ]);
    var proxy = new Ext.data.HttpProxy({
        url:"../../EquipmentAlertAction_select.action"
    });
    var reader = new Ext.data.JsonReader({
        totalProperty:"total",
        root:"rows"
    },record);
    var store = new Ext.data.GroupingStore({
        id:"store.alert.info",
        proxy : proxy,
        reader : reader
    });
    var formPanel = new Ext.form.FormPanel({
        frame:true,
        autoScroll:true,
        defaultType:'textfield',
        labelAlign:'right',
        labelWidth:140,
        border:false,
        layout: 'form',
        defaults:{
            width:200,
            allowBlank:false,
            blankText:'该项不能为空！'
        },
        items:[{
            xtype:'hidden',
            name:'equipmentAlert.id',
            value:id
        },{
            xtype:'hidden',
            name:'equipmentAlert.equipmentName',
            value:equipmentName
        },{
            id:'cpu.alert.info',
            fieldLabel:'CPU报警阀值(%)',
            name:'equipmentAlert.cpu',
        	regex:/^(100|[1-9][0-9]|[0-9])$/,
        	regexText:'这个不是0--100之间的数',
        	emptyText:'请输入0--100之间的数'
        },{
            id:'memory.alert.info',
            fieldLabel:'内存报警阀值(%)',
            name:'equipmentAlert.memory',
        	regex:/^(100|[1-9][0-9]|[0-9])$/,
        	regexText:'这个不是0--100之间的数',
        	emptyText:'请输入0--100之间的数'
        },{
            id:'disk.alert.info',
            fieldLabel:'硬盘报警阀值(%)',
            name:'equipmentAlert.disk',
        	regex:/^(100|[1-9][0-9]|[0-9])$/,
        	regexText:'这个不是0--100之间的数',
        	emptyText:'请输入0--100之间的数'
        }]
    });
	var win = new Ext.Window({
        title:"设备告警配置信息",
        width:400,
        layout:'fit',
        height:170,
        modal:true,
        items:formPanel,
        bbar:[
            '->',
            {
                text:'设置',
                handler:function(){
                    if(formPanel.form.isValid()){
                        formPanel.getForm().submit({
                            url :'../../EquipmentAlertAction_insertOrUpdate.action',
                            method :'POST',
                            waitTitle :'系统提示',
                            waitMsg :'正在设置,请稍后...',
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
                                            win.close();
                                        }
                                    }
                                });
                            }
                        });
                    }
                }
            },{
                text:'关闭',
                handler:function(){
                    win.close();
                }
            }
        ]
    }).show();
    store.load({params:{id:id,equipmentName:equipmentName}});
    store.addListener('load',function(){
        Ext.getCmp('cpu.alert.info').setValue(store.getAt(0).get('cpu'));
        Ext.getCmp('memory.alert.info').setValue(store.getAt(0).get('memory'));
        Ext.getCmp('disk.alert.info').setValue(store.getAt(0).get('disk'));
    });
}

function equipmentAlertConfigDisplay(id,equipmentName){
    var record = new Ext.data.Record.create([
        {name:'cpu',      mapping:'cpu'},
        {name:'disk',     mapping:'disk'},
        {name:'memory',	mapping:'memory'}
    ]);
    var proxy = new Ext.data.HttpProxy({
        url:"../../EquipmentAlertAction_selectDisplay.action"
    });
    var reader = new Ext.data.JsonReader({
        totalProperty:"total",
        root:"rows"
    },record);
    var store = new Ext.data.GroupingStore({
        id:"store.alert.info",
        proxy : proxy,
        reader : reader
    });
    var formPanel = new Ext.form.FormPanel({
        frame:true,
        defaultType:'displayfield',
        labelAlign:'right',
        labelWidth:140,
        border:false,
        layout: 'form',
        defaults:{
            width:100,
            allowBlank:false,
            blankText:'该项不能为空！'
        },
        items:[{
            id:'cpu.alert.info',
            fieldLabel:'CPU报警阀值(%)',
            name:'equipmentAlert.cpu'
        },{
            id:'memory.alert.info',
            fieldLabel:'内存报警阀值(%)',
            name:'equipmentAlert.memory'
        },{
            id:'disk.alert.info',
            fieldLabel:'硬盘报警阀值(%)',
            name:'equipmentAlert.disk'
        }]
    });
	var win = new Ext.Window({
        title:"设备告警配置信息",
        width:300,
        layout:'fit',
        height:160,
        modal:true,
        items:formPanel,
        bbar:[
            '->',
            {
                text:'保存',
                handler:function(){
                    win.close();
                }
            },{
                text:'关闭',
                handler:function(){
                    win.close();
                }
            }
        ]
    }).show();
    store.load({params:{id:id,equipmentName:equipmentName}});
    store.addListener('load',function(){
        Ext.getCmp('cpu.alert.info').setValue(store.getAt(0).get('cpu'));
        Ext.getCmp('memory.alert.info').setValue(store.getAt(0).get('memory'));
        Ext.getCmp('disk.alert.info').setValue(store.getAt(0).get('disk'));
    });
}

function download(fileName){
    if (!Ext.fly('test')) {
        var frm = document.createElement('form');
        frm.id = 'test';
        frm.name = id;
        frm.style.display = 'none';
        document.body.appendChild(frm);
    }
    Ext.Ajax.request({
        url: '../../EquipmentAction_download.action',
        params:{fileName:fileName},
        form: Ext.fly('test'),
        method: 'POST',
        isUpload: true
    });
}