/**
 * 平台配置
 * Created by IntelliJ IDEA.
 * User: 钱晓盼
 * Date: 11-9-21
 * Time: 下午4:22
 * To change this template use File | Settings | File Templates.
 */
Ext.onReady(function(){
    Ext.BLANK_IMAGE_URL = '../../js/ext/resources/images/default/s.gif';
    Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget = 'side';

    var record = new Ext.data.Record.create([
        {name:'interval',mapping:'interval'},
        {name:'gcinterval',mapping:'gcinterval'},
        {name:'recover',mapping:'recover'},
        {name:'systemmeantime',mapping:'systemmeantime'},
        {name:'restarttime',mapping:'restarttime'},
        {name:'virusscan',mapping:'virusscan'},
        {name:'snmpclientset',mapping:'snmpclientset'},
        {name:'syslogclientset',mapping:'syslogclientset'},
        {name:'flag',mapping:'flag'}
    ]);
    var proxy = new Ext.data.HttpProxy({
        url:"../../PlatformConfigAction_selectChangeUtils.action"
    });
    var reader = new Ext.data.JsonReader({
        totalProperty:"total",
        root:'rows'
    },record);
    var store = new Ext.data.Store({
        proxy : proxy,
        reader : reader
    });

    var button = new Ext.Panel({
        plain:true,
        buttonAlign :'left',
        autoScroll:true,
        buttons:[
        	new Ext.Toolbar.Spacer({width:190}),
            {
                text:"保存",
                id:'systemManager.save.info',
                handler:function(){
                    if (initForm1.form.isValid()) {
                        initForm1.getForm().submit({
                            url :'../../PlatformConfigAction_updateChangeUtils.action',
                            method :'POST',
                            waitTitle :'系统提示',
                            waitMsg :'正在保存,请稍后...',
                            success : function(form,action) {
                                var msg = action.result.msg;
                                Ext.MessageBox.show({
                                	title:'信息',
                                    msg:msg,
                                    animEl:'systemManager.save.info',
                                    width:300,
                                    buttons:{'ok':'确定'},
                                    icon:Ext.MessageBox.INFO,
                                    closable:false,
                                    fn:function(e){
                                        if(e=='ok'){
                                            store.reload();
                                            location.reload();
                                        }
                                    }
                                });
                            }
                        });
                    } else {
                        Ext.MessageBox.show({
                        	title:'信息',
                            msg:'保存失败，请填写完成再保存!',
                            animEl:'systemManager.save.info',
                            width:300,
                            buttons:{'ok':'确定'},
                            icon:Ext.MessageBox.ERROR,
                            closable:false
                        });
                    }
                }
            }
        ]
    });
    var initForm1 = new Ext.form.FormPanel({
        plain:true,
        border:false,
        loadMask : { msg : '正在加载数据，请稍后.....' },
        labelAlign:'right',
        labelWidth:190,
        defaultType:'textfield',
        defaults:{
            width:200,
            allowBlank:false,
            blankText:'该项不能为空!'
        },
        items:[{
        	fieldLabel : "目录扫描频率(秒)",
        	name:'channelIChangeUtils.interval',value:1000,
        	id:'interval.info',
        	regex:/^([1-9]([0-9]{0,5}|[0-9]{0,4}|[0-9]{0,3}|[0-9]{0,2}|[0-9]|[0-9]{0}))$/,
        	regexText:'这个不是数字1--999999(单位:秒)',
        	emptyText:'请输入数字1--999999(单位:秒)'
        },{                       //<gcinterval>10</gcinterval><!--内存回收频率-->
        	fieldLabel : "内存回收频率(分钟)",
        	name:'channelIChangeUtils.gcinterval',value:10,
        	id:'gcinterval.info',
        	regex:/^([1-9]([0-9]{0,5}|[0-9]{0,4}|[0-9]{0,3}|[0-9]{0,2}|[0-9]|[0-9]{0}))$/,
        	regexText:'这个不是数字1--999999(单位:分钟)',
        	emptyText:'请输入数字1--999999(单位:分钟)'
        },
        {                       //<recover>10</recover><!--数据恢复频率-->
        	fieldLabel:"数据恢复频率(分钟)",
        	name:'channelIChangeUtils.recover', value:10,
        	id:'recover.info',
        	regex:/^([1-9]([0-9]{0,5}|[0-9]{0,4}|[0-9]{0,3}|[0-9]{0,2}|[0-9]|[0-9]{0}))$/,
        	regexText:'这个不是数字1--999999(单位:分钟)',
        	emptyText:'请输入数字1--999999(单位:分钟)'
        },{
        	fieldLabel:"系统测试间隔时间(秒)",
            xtype:'displayfield',
        	value:300
        },{
            name:'channelIChangeUtils.systemmeantime',
            xtype:'hidden',
        	value:300
        },{                       //<virusscan>/usr/bin/nod32</virusscan><!--病毒扫描程序目录-->
        	fieldLabel:"病毒扫描程序目录",
            xtype:'displayfield',
        	value:'/usr/app/stp/data'
        },{
            xtype:'hidden',
        	name:'channelIChangeUtils.virusscan',
        	value:'/usr/app/stp/data'
        },{                       //<restarttime/><!--服务自动重启-->
        	fieldLabel:"系统重启策略",
        	id:'restarttime.info',
        	html:"<a href='javascript:;' onclick='toInnerRestartTime(null);'style='color: green;'>管理</a>",
        	xtype:'displayfield'
        },{                       //<snmpclientset><!--SNMP管理主机地址-->
        	fieldLabel:"SNMP管理主机",
        	html:"<a href='javascript:;' onclick='toInnerSNMPClient();' style='color: green;'>管理</a>",
        	xtype:'displayfield'
        },{                       //<syslogclientset><!--syslog接收主机地址和端口-->
        	fieldLabel:"日志接收主机",
        	html:"<a href='javascript:;' onclick='toInnerSysLogClient();'style='color: green;'>管理</a>",
        	xtype:'displayfield'
        }]
    });

    var panel = new Ext.Panel({
        plain:true,
        width:setWidth(),
        border:false,
        autoScroll:true,
        items:[{
//            xtype:'fieldset',
//            title:'属性说明',
//            width:500,
//            html:'<div></div>'
//        },{
            xtype:'fieldset',
            title:'平台配置',
            width:500,
            items:[initForm1]
        }]
    });
    var panel2 = new Ext.Panel({
        plain:true,
        width:setWidth(),
        border:false,
        buttonAlign :'left',
        buttons:[
//            new Ext.Toolbar.Spacer({width:130}),
            button
        ]
    });
    new Ext.Viewport({
    	layout:'fit',
    	renderTo:Ext.getBody(),
    	items:[{
            frame:true,
            autoScroll:true,
            items:[panel,panel2]
        }]
    });
    store.load();
    store.on('load',function(){
        var interval = store.getAt(0).get('interval');
        var gcinterval = store.getAt(0).get('gcinterval');
        var recover = store.getAt(0).get('recover');
//        var systemmeantime = store.getAt(0).get('systemmeantime');
        var restarttime = setRestartTime(store.getAt(0).get('restarttime'));
        var flag = store.getAt(0).get('flag');
        Ext.getCmp('interval.info').setValue(interval);
        Ext.getCmp('gcinterval.info').setValue(gcinterval);
        Ext.getCmp('recover.info').setValue(recover);
//        Ext.getCmp('systemmeantime.info').setValue(systemmeantime);
        Ext.getCmp('restarttime.info').setValue("<a href='javascript:;' onclick='toInnerRestartTime(\""+restarttime+"\");'style='color: green;'>管理</a>");
	});
});

function setWidth(){
    return document.body.clientWidth-15;
}

function setRestartTime(value){
    return value;
}

// h:1     每1小时,
// d:12    每天的12点.
// w:3:12  每周3的12点,
// m:3:12  每月3号12小时   1-31 如果当月不存在日期(如;2月31日),则自动换算成下月的3日
function toInnerRestartTime(restarttime){
    var restart;
    var month;
    var week;
    var day;
    var hour;
    if(restarttime!=null&&restarttime.length>0){
        var array = restarttime.split(":");
        restart = array[0];
        if(restart=='m'){
            month = array[1];
            day = array[2];
        } else if(restart=='w'){
            week = array[1];
            day = array[2];
        } else if(restart=='d'){
            day = array[1];
        } else if(restart=='h'){
            hour = array[1];
        }
    } else {
        restart = 'n';
    }
    var dataRestartTime = [
        ['n','不使用策略'],
        ['h','每隔几小时重启'],
        ['d','每天几时重启'],
        ['w','每周周几几时重启'],
        ['m','每月几日几时重启']
    ];
    var dataMonth = [
        [1,'1日'],[2,'2日'],[3,'3日'],[4,'4日'],[5,'5日'],[6,'6日'],[7,'7日'],[8,'8日'],[9,'9日'],
        [10,'10日'],[11,'11日'],[12,'12日'],[13,'13日'],[14,'14日'],[15,'15日'],[16,'16日'],[17,'17日'],[18,'18日'],[19,'19日'],
        [20,'20日'],[21,'21日'],[22,'22日'],[23,'23日'],[24,'24日'],[25,'25日'],[26,'26日'],[27,'27日'],[28,'28日'],[29,'29日'],
        [30,'30日'],[31,'31日']
    ];
    var dataWeek = [
        ['7','日'],
        ['1','一'],
        ['2','二'],
        ['3','三'],
        ['4','四'],
        ['5','五'],
        ['6','六']
    ];
    var dataDay = [
        [0,'00:00'],  [1,'01:00'], [2,'02:00'], [3,'03:00'], [4,'04:00'], [5,'05:00'], [6,'06:00'], [7,'07:00'], [8,'08:00'], [9,'09:00'],
        [10,'10:00'],[11,'11:00'],[12,'12:00'],[13,'13:00'],[14,'14:00'],[15,'15:00'],[16,'16:00'],[17,'17:00'],[18,'18:00'],[19,'19:00'],
        [20,'20:00'],[21,'21:00'],[22,'22:00'],[23,'23:00']
    ];
    var dataHour = [
        [1,1],[2,2],[3,3],[4,4],[5,5],[6,6],[7,7],[8,8],[9,9],
        [10,10],[11,11],[12,12],[13,13],[14,14],[15,15],[16,16],[17,17],[18,18],[19,19],
        [20,20],[21,21],[22,22],[23,23],[24,24]
    ];
    var storeRestartTime = new Ext.data.SimpleStore({fields:['value','key'],data:dataRestartTime});
    var storeMonth = new Ext.data.SimpleStore({fields:['value','key'],data:dataMonth});
    var storeWeek = new Ext.data.SimpleStore({fields:['value','key'],data:dataWeek});
    var storeDay = new Ext.data.SimpleStore({fields:['value','key'],data:dataDay});
    var storeHour = new Ext.data.SimpleStore({fields:['value','key'],data:dataHour});

    var formRe = new Ext.form.FormPanel({
        frame:true,
        border:false,
        items:[{
            fieldLabel:"重启策略",
            hiddenName:'restart',
            width:140,
            xtype:'combo',
            mode:'local',
            emptyText :'--请选择--',
            editable : false,
            allowBlank:false,
            typeAhead:true,
            forceSelection: true,
            triggerAction:'all',
            displayField:"key",valueField:"value",
            store: storeRestartTime,
            value:restart,
            listeners:{
                select:function(combo,record,index){
                    Ext.getCmp('m.combo.info').clearValue();
                    Ext.getCmp('w.combo.info').clearValue();
                    Ext.getCmp('d.combo.info').clearValue();
                    Ext.getCmp('h.combo.info').clearValue();
                    if(index ==0){
                        Ext.getCmp('m.info').hide();
                        Ext.getCmp('w.info').hide();
                        Ext.getCmp('d.info').hide();
                        Ext.getCmp('h.info').hide();
                    } else if (index == 1){
                        Ext.getCmp('m.info').hide();
                        Ext.getCmp('w.info').hide();
                        Ext.getCmp('d.info').hide();
                        Ext.getCmp('h.info').show();
                    } else if (index == 2){
                        Ext.getCmp('m.info').hide();
                        Ext.getCmp('w.info').hide();
                        Ext.getCmp('d.info').show();
                        Ext.getCmp('h.info').hide();
                    } else if (index == 3){
                        Ext.getCmp('m.info').hide();
                        Ext.getCmp('w.info').show();
                        Ext.getCmp('d.info').show();
                        Ext.getCmp('h.info').hide();
                    } else if (index == 4){
                        Ext.getCmp('m.info').show();
                        Ext.getCmp('w.info').hide();
                        Ext.getCmp('d.info').show();
                        Ext.getCmp('h.info').hide();
                    }
                }
            }
        },{
            plain:true,
            id:'m.info',
            hidden:true,
            layout:'form',
            border:false,
            items:[{
                id:'m.combo.info',
                fieldLabel:"每月",hiddenName:'mTime',value:month,
                width:140,
                xtype:'combo',
                mode:'local',
                editable : false,
                typeAhead:true,
                forceSelection: true,
                triggerAction:'all',
                displayField:"key",valueField:"value",
                store:storeMonth
            }]
        },{
            plain:true,
            id:'w.info',
            hidden:true,
            layout:'form',
            border:false,
            items:[{
                id:'w.combo.info',
                fieldLabel:"每周",hiddenName:'wTime',value:week,
                width:140,
                xtype:'combo',
                mode:'local',
                editable : false,
                typeAhead:true,
                forceSelection: true,
                triggerAction:'all',
                displayField:"key",valueField:"value",
                store:storeWeek
            }]
        },{
            plain:true,
            id:'d.info',
            hidden:true,
            layout:'form',
            border:false,
            items:[{
                id:'d.combo.info',
                fieldLabel:"每天",hiddenName:'dTime',value:day,
                width:140,
                xtype:'combo',
                mode:'local',
                editable : false,
                typeAhead:true,
                forceSelection: true,
                triggerAction:'all',
                displayField:"key",valueField:"value",
                store:storeDay
            }]
        },{
            plain:true,
            id:'h.info',
            hidden:true,
            layout:'form',
            border:false,
            items:[{
                id:'h.combo.info',
                fieldLabel:"间隔小时",
                hiddenName:'hTime',value:hour,
                width:140,
                xtype:'combo',
                mode:'local',
                editable : false,
                typeAhead:true,
                forceSelection: true,
                triggerAction:'all',
                displayField:"key",valueField:"value",
                store:storeHour
            }]
        }]
    });
    var win = new Ext.Window({
        title:'重启策略管理',
        width:300,height:180,
        modal:true,
        layout:'fit',
        items:[formRe],
        listeners:{
            show : function(){
                if(restart =='n'){
                    Ext.getCmp('m.info').hide();
                    Ext.getCmp('w.info').hide();
                    Ext.getCmp('d.info').hide();
                    Ext.getCmp('h.info').hide();
                }else if(restart == 'm'){
                    Ext.getCmp('m.info').show();
                    Ext.getCmp('w.info').hide();
                    Ext.getCmp('d.info').show();
                    Ext.getCmp('h.info').hide();
                }else if(restart == 'w'){
                    Ext.getCmp('m.info').hide();
                    Ext.getCmp('w.info').show();
                    Ext.getCmp('d.info').show();
                    Ext.getCmp('h.info').hide();
                }else if(restart == 'd'){
                    Ext.getCmp('m.info').hide();
                    Ext.getCmp('w.info').hide();
                    Ext.getCmp('d.info').show();
                    Ext.getCmp('h.info').hide();
                }else if(restart == 'h'){
                    Ext.getCmp('m.info').hide();
                    Ext.getCmp('w.info').hide();
                    Ext.getCmp('d.info').hide();
                    Ext.getCmp('h.info').show();
                }
            }
        },
        bbar:[
            "->",
            {
                id:'restart.save.info',
                text:"保存",
                handler:function(){
                    if (formRe.form.isValid()) {
                        formRe.getForm().submit({
                            url :'../../PlatformConfigAction_saveRestartTime.action',
                            method :'POST',
                            waitTitle :'系统提示',
                            waitMsg :'正在保存,请稍后...',
                            success : function(form,action) {
                                var msg = action.result.msg;
                                Ext.MessageBox.show({
                                	title:'信息',
                                    msg:msg,
                                    animEl:'restart.save.info',
                                    width:300,
                                    buttons:{'ok':'确定','no':'取消'},
                                    icon:Ext.MessageBox.INFO,
                                    closable:false,
                                    fn:function(e){
                                        if(e=='ok'){
                                             win.close();
                                             location.reload();
                                        }
                                    }
                                });
                            }
                        });
                    } else {
                        Ext.MessageBox.show({
                        	title:'信息',
                            msg:'保存失败，请填写完成再保存!',
                            animEl:'restart.save.info',
                            width:300,
                            buttons:{'ok':'确定'},
                            icon:Ext.MessageBox.ERROR,
                            closable:false
                        });
                    }
                }
            },
            {
                text:"关闭",
                handler:function(){
                    win.close();
                }
            }
        ]
    }).show();
}

function toInnerSNMPClient(){
    var record = new Ext.data.Record.create([
        {name:'snmpclient',mapping:'snmpclient'},
        {name:'flag',mapping:'flag'}
    ]);
    var proxy = new Ext.data.HttpProxy({
        url:"../../PlatformConfigAction_readSNMPIp.action"
    });
    var reader = new Ext.data.JsonReader({
        totalProperty:"total",
        root:"rows"
    },record);
    var store = new Ext.data.GroupingStore({
        id:"storeInnerSnmp.info",
        proxy : proxy,
        reader : reader
    });

    var start = 0;			//分页--开始数
	var pageSize = 5;		//分页--每页数

	store.load({
        params:{
            start:start,limit:pageSize
        }
    });
    var client_edit = new Ext.form.TextField({
        id:'client_edit.snmp.info',
        regex:/^((((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\:)(6553[0-6]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{3}|[1-9][0-9]{2}|[1-9][0-9]{1}|[1-9]))$/,
        regexText:'这个不是Ip:Port',
        listeners:{
           blur:function(){
               var snmpclient = client_edit.getValue();
               var myMask = new Ext.LoadMask(Ext.getBody(),{
                   msg:'正在校验,请稍后...',
                   removeMask:true
               });
               myMask.show();
               Ext.Ajax.request({
                   url:'../../PlatformConfigAction_checkSNMPClient.action',
                   method:'POST',
                   params:{snmpclient:snmpclient},
                   success:function(action){
                       var json = Ext.decode(action.responseText);
                       myMask.hide();
                       if(json.msg != '0000'){
                           Ext.MessageBox.show({
                               title:'信息',
                               msg:json.msg,
                               animEl:'client_edit.snmp.info',
                               buttons:Ext.Msg.OK,
                               icon:Ext.MessageBox.WARNING,
                               fn:function(e){
                                   if(e=='ok'){
//                                       Ext.getCmp('innerIpMacBlackGrid.info').getSelectionModel().getSelections();
                                   }
                               }
                           });
                       }
                   }
               });
           }
        }
    });
	var boxM = new Ext.grid.CheckboxSelectionModel();   //复选框
	var rowNumber = new Ext.grid.RowNumberer();         //自动 编号
	var colM = new Ext.grid.ColumnModel([
        rowNumber,
		boxM,
        {header:"SNMP管理主机",dataIndex:"snmpclient",align:'center',editor:client_edit},
        {header:"操作标记",dataIndex:"flag",align:'center',renderer:innerSNMPShowURL,width:40}
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
    var snmpGrid = new Ext.grid.EditorGridPanel({
        id:'innerSnmpGrid.info',
        plain:true,
        renderTo:Ext.getBody(),
        animCollapse:true,
        height:300,width:500,
        loadMask:{msg:'正在加载数据,请稍后...'},
        border:false,
        collapsible:false,
        heightIncrement:true,
        cm:colM,
        sm:boxM,
        store:store,
        clicksToEdit:1,
        autoExpandColumn:2,
        disableSelection:true,
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
                id:'btnAdd.innerSnmp',
                text:'新增',
                iconCls:'add',
                handler:function(){
                    snmpGrid.stopEditing();
                    snmpGrid.getStore().insert(
                        0,
                        new record({
                            snmpclient:'',
                            flag:2
                        })
                    );
                    snmpGrid.startEditing(0,0);
                }
            }),
            {xtype:"tbseparator"},
            new Ext.Button ({
                id : 'btnRemove.snmp',
                text : '删除',
                iconCls : 'remove',
                handler : function() {
                    innerDeleteSnmpGridRow(snmpGrid,store);         //删除 表格 的 一 行 或多行
                }
            }),
            {xtype:"tbseparator"},
            new Ext.Button({
                id:'btnSave.innerSnmp',
                text:'保存',
                iconCls:'save',
                handler:function(){
                    innerInsertSnmpGridFormWin(snmpGrid,store);     //连接到 新增 面板
                }
            })
        ],
        view:new Ext.grid.GroupingView({
            forceFit:true,
            groupingTextTpl:'{text}({[values.rs.length]}条记录)'
        }),
        bbar:page_toolbar
    });
    var win = new Ext.Window({
        title:'SNMP管理主机',
        width:510,height:333,
        frame:true,modal:true,
        items:[snmpGrid]
    }).show();
}

function toInnerSysLogClient(){
    var record = new Ext.data.Record.create([
        {name:'syslogclient',mapping:'syslogclient'},
        {name:'flag',mapping:'flag'}
    ]);
    var proxy = new Ext.data.HttpProxy({
        url:"../../PlatformConfigAction_readSysLogIp.action"
    });
    var reader = new Ext.data.JsonReader({
        totalProperty:"total",
        root:"rows"
    },record);
    var store = new Ext.data.GroupingStore({
        id:"storeInnerSysLog.info",
        proxy : proxy,
        reader : reader
    });
    var start = 0;			//分页--开始数
	var pageSize = 5;		//分页--每页数
	store.load({
        params:{
            start:start,limit:pageSize
        }
    });
    var client_edit = new Ext.form.TextField({
        id:'client_edit.syslog.info',
        regex:/^((((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\:)(6553[0-6]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{3}|[1-9][0-9]{2}|[1-9][0-9]{1}|[1-9]))$/,
        regexText:'这个不是Ip:Port',
        listeners:{
           blur:function(){
               var syslogclient = client_edit.getValue();
               var myMask = new Ext.LoadMask(Ext.getBody(),{
                   msg:'正在校验,请稍后...',
                   removeMask:true
               });
               myMask.show();
               Ext.Ajax.request({
                   url:'../../PlatformConfigAction_checkSysLogClient.action',
                   method:'POST',
                   params:{syslogclient:syslogclient},
                   success:function(action){
                       var json = Ext.decode(action.responseText);
                       myMask.hide();
                       if(json.msg != '0000'){
                           Ext.MessageBox.show({
                               title:'信息',
                               msg:json.msg,
                               animEl:'client_edit.syslog.info',
                               buttons:{'ok':'确定'},
                               icon:Ext.MessageBox.WARNING,
                               fn:function(e){
                                   if(e=='ok'){
//                                       Ext.getCmp('innerIpMacBlackGrid.info').getSelectionModel().getSelections();
                                   }
                               }
                           });
                       }
                   }
               });
           }
        }
    });
	var boxM = new Ext.grid.CheckboxSelectionModel();   //复选框
	var rowNumber = new Ext.grid.RowNumberer();         //自动 编号
	var colM = new Ext.grid.ColumnModel([
        rowNumber,
		boxM,
        {header:"日志接收主机",dataIndex:"syslogclient",align:'center',editor: client_edit},
        {header:"操作标记",dataIndex:"flag",align:'center',renderer:innerSysLogShowURL,width:40}
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
    var syslogGrid = new Ext.grid.EditorGridPanel({
        id:'innerSysLogGrid.info',
        frame:true,
        renderTo:Ext.getBody(),
        animCollapse:true,
        height:300,width:500,
        loadMask:{msg:'正在加载数据,请稍后...'},
        border:false,
        collapsible:false,
        heightIncrement:true,
        cm:colM,
        sm:boxM,
        store:store,
        clicksToEdit:1,
        autoExpandColumn:2,
        disableSelection:true,
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
                id:'btnAdd.innerSysLog',
                text:'新增',
                iconCls:'add',
                handler:function(){
                    syslogGrid.stopEditing();
                    syslogGrid.getStore().insert(
                        0,
                        new record({
                            syslogclient:'',
                            flag:2
                        })
                    );
                    syslogGrid.startEditing(0,0);
                }
            }),
                {xtype:"tbseparator"},
            new Ext.Button ({
                id : 'btnRemove.syslog',
                text : '删除',
                iconCls : 'remove',
                handler : function() {
                    innerDeleteSysLogGridRow(syslogGrid,store);         //删除 表格 的 一 行 或多行
                }
            }),
            {xtype:"tbseparator"},
            new Ext.Button({
                id:'btnSave.innerSysLog',
                text:'保存',
                iconCls:'save',
                handler:function(){
                    innerInsertSysLogGridFormWin(syslogGrid,store);     //连接到 新增 面板
                }
            })
        ],
        view:new Ext.grid.GroupingView({
            forceFit:true,
            groupingTextTpl:'{text}({[values.rs.length]}条记录)'
        }),
        bbar:page_toolbar
    });
    var win = new Ext.Window({
        title:'日志接收主机',
        width:510,height:333,
        frame:true,modal:true,
        items:[syslogGrid]
    }).show();
}