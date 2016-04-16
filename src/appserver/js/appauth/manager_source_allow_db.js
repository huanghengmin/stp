/**
 * 源端--数据库同步--审核
 */
//==================================== -- 数据库同步应用 extjs 页面 -- =============================================================
Ext.onReady(function(){
    Ext.BLANK_IMAGE_URL = '../../js/ext/resources/images/default/s.gif';
    Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget = 'side';
/********************************************* -- external_grid_panel start -- *******************************************************************************************************/
	
   var external_start = 0;			//分页--开始数
   var external_pageSize = 15;		//分页--每页数
   var external_record = new Ext.data.Record.create([
       {name:'appName',			mapping:'appName'},
       {name:'appDesc',			mapping:'appDesc'},
       {name:'appType',			mapping:'appType'},
       {name:'channel',			mapping:'channel'},
       {name:'channelport',	    mapping:'channelport'},
       {name:'isActive',			mapping:'isActive'},
       {name:'isAllow',			mapping:'isAllow'},
       {name:'infoLevel',			mapping:'infoLevel'},
       {name:'isFilter',		    mapping:'isFilter'},
	   {name:'isVirusScan',		mapping:'isVirusScan'},
       {name:'isLocal',			mapping:'isLocal'},
       {name:'isRecover',			mapping:'isRecover'},
       {name:'dataPath',			mapping:'dataPath'},
       {name:'deleteFile',		mapping:'deleteFile'},
       {name:'dbName',			mapping:'dbName'},
       {name:'oldStep',			mapping:'oldStep'},
       {name:'operation',			mapping:'operation'},
       {name:'enable',			mapping:'enable'},
       {name:'tempTable',			mapping:'tempTable'},
       {name:'maxRecords',		mapping:'maxRecords'},
       {name:'interval',			mapping:'interval'},
       {name:'tables',			mapping:'tables'},
       {name:'plugin',			mapping:'plugin'},
       {name:'privated',			mapping:'privated'},
       {name:'deleteFlag',		mapping:'deleteFlag'},
       {name:'speed',		mapping:'speed'},
       {name:'flag',				mapping:'flag'}
   ]);
   var external_allow_record = new Ext.data.Record.create([
       {name:'appName',			mapping:'appName'},
       {name:'appDesc',			mapping:'appDesc'},
       {name:'appType',			mapping:'appType'},
       {name:'channel',			mapping:'channel'},
       {name:'channelport',	    mapping:'channelport'},
       {name:'isActive',			mapping:'isActive'},
       {name:'isAllow',			mapping:'isAllow'},
       {name:'infoLevel',			mapping:'infoLevel'},
       {name:'isFilter',		    mapping:'isFilter'},
	   {name:'isVirusScan',		mapping:'isVirusScan'},
       {name:'isLocal',			mapping:'isLocal'},
       {name:'isRecover',			mapping:'isRecover'},
       {name:'dataPath',			mapping:'dataPath'},
       {name:'deleteFile',		mapping:'deleteFile'},
       {name:'dbName',			mapping:'dbName'},
       {name:'oldStep',			mapping:'oldStep'},
       {name:'operation',			mapping:'operation'},
       {name:'enable',			mapping:'enable'},
       {name:'tempTable',			mapping:'tempTable'},
       {name:'maxRecords',		mapping:'maxRecords'},
       {name:'interval',			mapping:'interval'},
       {name:'tables',			mapping:'tables'},
       {name:'plugin',			mapping:'plugin'},
       {name:'privated',			mapping:'privated'},
       {name:'deleteFlag',		mapping:'deleteFlag'},
       {name:'status',			mapping:'status'},
       {name:'speed',			mapping:'speed'},
       {name:'flag',				mapping:'flag'}
   ]);
   var external_proxy = new Ext.data.HttpProxy({
       url:"../../AppTypeAction_readExternalNotAllowType.action?typeXml=external&appType=db"
   });
   var external_allow_proxy = new Ext.data.HttpProxy({
       url:"../../AppTypeAction_readExternalAllowType.action?typeXml=external&appType=db"
   });
   var external_reader = new Ext.data.JsonReader({
       totalProperty:"total",
       root:"rows"
   },external_record);
   var external_allow_reader = new Ext.data.JsonReader({
       totalProperty:"total",
       root:"rows"
   },external_allow_record);
   var external_store = new Ext.data.GroupingStore({
       id:"store.grid.db.external.info",
       proxy : external_proxy,
       reader : external_reader
   });
   var external_allow_store = new Ext.data.GroupingStore({
       id:"store.grid.db.external.allow.info",
       proxy : external_allow_proxy,
       reader : external_allow_reader
   });

   var external_boxM = new Ext.grid.CheckboxSelectionModel();   //复选框
   var external_allow_boxM = new Ext.grid.CheckboxSelectionModel();   //复选框
   var external_rowNumber = new Ext.grid.RowNumberer();         //自动 编号
   var external_allow_rowNumber = new Ext.grid.RowNumberer();         //自动 编号
   var external_colM = new Ext.grid.ColumnModel([
//       external_boxM,
       external_rowNumber,
       {header:"应用编号",			dataIndex:"appName",	    align:'center',menuDisabled:true,sortable:true},
       {header:"应用名",			    dataIndex:"appDesc",     align:'center',menuDisabled:true,sortable:true},
       {header:"传输速度",			    dataIndex:"speed",     align:'center',menuDisabled:true,sortable:true,renderer:showURL_speed,       width:50},
       {header:'通道',			dataIndex:'channel',	    align:'center',sortable:true,menuDisabled:true, width:50,      renderer:showURL_channel},
       {header:'通道端口',			dataIndex:'channelport',	align:'center',          width:50},
       {header:'审批通过',		dataIndex:'isAllow',	    align:'center',menuDisabled:true,sortable:true,    	renderer:show_isAllow,       width:50},
       {header:'信息等级',	        dataIndex:'infoLevel',	align:'center',menuDisabled:true,renderer:show_InfoLevel,width:50},
       {header:'启用内容过滤',	dataIndex:'isFilter',	align:'center',renderer:show_is},
       {header:'启用病毒扫描',	dataIndex:'isVirusScan',	align:'center',renderer:show_is},
       {header:'应用类型',			dataIndex:'appType',	    align:'center',sortable:true},
       {header:'数据源',				dataIndex:'dbName',		align:'center',sortable:true},
       {header:'同步方式',			dataIndex:'operation',	align:'center',sortable:true,    	renderer:external_showURL_operation},
       {header:'执行恢复操作',		dataIndex:'isRecover',	align:'center',sortable:true,    	renderer:show_is},
       {header:'数据文件存放目录',	dataIndex:'dataPath',	align:'center',sortable:true},
       {header:'数据写入文件',	dataIndex:'deleteFile',	align:'center',sortable:true,    	renderer:show_is},
       {header:'同步原表已存在的数据',	dataIndex:'oldStep',	align:'center',sortable:true,		renderer:show_is},
       {header:'单次传输最大记录',	dataIndex:'maxRecords',	align:'center',sortable:true},
       {header:'传输频率(秒)',		dataIndex:'interval',	align:'center',sortable:true},
       {header:'启用数据表',		dataIndex:'enable',		align:'center',sortable:true,		renderer:show_is},
       {header:'数据表',			dataIndex:'tables',		align:'center',menuDisabled:true,sortable:true,		renderer:external_showURL_tables,       width:40},
       {header:'源、目标',			dataIndex:'plugin',		align:'center',menuDisabled:true,sortable:true,		renderer:external_showURL_plugin,       width:50},
       {header:'操作标记',			dataIndex:'flag',		    align:'center',menuDisabled:true,sortable:true,		renderer:external_showURL_flag,    		width:200}
   ]);
   var external_allow_colM = new Ext.grid.ColumnModel([
//       external_allow_boxM,
       external_allow_rowNumber,
       {header:"应用编号",			dataIndex:"appName",	    align:'center',menuDisabled:true,sortable:true},
       {header:"应用名",			    dataIndex:"appDesc",     align:'center',menuDisabled:true,sortable:true},
       {header:"传输速度",			    dataIndex:"speed",     align:'center',menuDisabled:true,sortable:true,renderer:showURL_speed,       width:50},
       {header:'通道',			dataIndex:'channel',	    align:'center',sortable:true,menuDisabled:true, width:50,      renderer:showURL_channel},
       {header:'通道端口',			dataIndex:'channelport',		align:'center',          width:50},
       {header:'启用状态',			dataIndex:'isActive',	align:'center',menuDisabled:true,sortable:true,    	renderer:showURL_isActive,       width:50},
       {header:'信息等级',	        dataIndex:'infoLevel',	align:'center',menuDisabled:true,renderer:show_InfoLevel,width:50},
       {header:'启用内容过滤',	dataIndex:'isFilter',	align:'center',renderer:show_is},
       {header:'启用病毒扫描',	dataIndex:'isVirusScan',	align:'center',renderer:show_is},
       {header:'应用类型',			dataIndex:'appType',	    align:'center',sortable:true},
       {header:'数据源',				dataIndex:'dbName',		align:'center',sortable:true},
       {header:'同步方式',			dataIndex:'operation',	align:'center',sortable:true,    	renderer:external_showURL_operation},
       {header:'执行恢复操作',		dataIndex:'isRecover',	align:'center',sortable:true,    	renderer:show_is},
       {header:'数据文件存放目录',	dataIndex:'dataPath',	align:'center',sortable:true},
       {header:'数据写入文件',	dataIndex:'deleteFile',	align:'center',sortable:true,    	renderer:show_is},
       {header:'同步原表已存在的数据',	dataIndex:'oldStep',	align:'center',sortable:true,		renderer:show_is},
       {header:'单次传输最大记录',	dataIndex:'maxRecords',	align:'center',sortable:true},
       {header:'传输频率(秒)',		dataIndex:'interval',	align:'center',sortable:true},
       {header:'启用数据表',		dataIndex:'enable',		align:'center',sortable:true,		renderer:show_is},
       {header:'数据表',			dataIndex:'tables',		align:'center',menuDisabled:true,sortable:true,		renderer:external_allow_showURL_tables,       width:50},
       {header:'发送状态',			dataIndex:'status',		align:'center',renderer:showURL_status,       width:70},
       {header:'源、目标',			dataIndex:'plugin',		align:'center',menuDisabled:true,sortable:true,		renderer:external_showURL_plugin,       width:40},
       {header:'操作标记',			dataIndex:'flag',		    align:'center',menuDisabled:true,sortable:true,		renderer:external_allow_showURL_flag,    		width:200}
   ]);
   for(var i=8;i<20;i++){
       external_colM.setHidden(i,!external_colM.isHidden(i));                // 加载后 不显示 该项
       external_allow_colM.setHidden(i,!external_allow_colM.isHidden(i));                // 加载后 不显示 该项
   }

   external_colM.defaultSortable = true;
   external_allow_colM.defaultSortable = true;
   var external_page_toolbar = new Ext.PagingToolbar({
       pageSize : external_pageSize,
       store:external_store,
       displayInfo:true,
       displayMsg:"显示第{0}条记录到第{1}条记录，一共{2}条",
       emptyMsg:"没有记录",
       beforePageText:"当前页",
       afterPageText:"共{0}页",
       refresh:external_store
   });
   var external_allow_page_toolbar = new Ext.PagingToolbar({
       pageSize : external_pageSize,
       store:external_allow_store,
       displayInfo:true,
       displayMsg:"显示第{0}条记录到第{1}条记录，一共{2}条",
       emptyMsg:"没有记录",
       beforePageText:"当前页",
       afterPageText:"共{0}页",
       refresh:external_allow_store
   });
   var external_grid_panel = new Ext.grid.GridPanel({
       id:'grid.db.external.info',
       title:'<center><font size="4">非可信端--审批</font></center>',
       animCollapse:true,
       autoScroll:true,
       height:setHeight(),
       width:setWidth(),
       loadMask:{msg:'正在加载数据，请稍后...'},
       border:false,
       collapsible:false,
//       heightIncrement:true,
       cm:external_colM,
//       sm:external_boxM,
       store:external_store,
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
       }),
       bbar:external_page_toolbar
   });
   var external_allow_grid_panel = new Ext.grid.GridPanel({
       id:'grid.db.external.allow.info',
       title:'<center><font size="4">非可信端--启停、发送</font></center>',
       animCollapse:true,
       autoScroll:true,
       height:setHeight(),
       width:setWidth(),
       loadMask:{msg:'正在加载数据，请稍后...'},
       border:false,
       collapsible:false,
//       heightIncrement:true,
       cm:external_allow_colM,
//       sm:external_allow_boxM,
       store:external_allow_store,
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
       tbar:[
           new Ext.Button({
               id:'send.db.external.info',
               text:'发送',
               iconCls:'send',
               handler:function(){
                   Ext.MessageBox.show({
                       title:'信息',
                       msg:'<font color="green">确定要发送配置文件到可信(目标)端？</font>',
                       width:300,
                       buttons:{'ok':'确定','no':'取消'},
                       icon:Ext.MessageBox.WARNING,
                       closable:false,
                       fn:function(e){
                           if(e == 'ok'){
                               var myMask = new Ext.LoadMask(Ext.getBody(),{
                                   msg : '正在发送,请稍后...',
                                   removeMask : true
                               });
                               myMask.show();
                               Ext.Ajax.request({
                                   url:'../../ConfigSendAction_send.action',
                                   method:'POST',
                                   success:function(response,option){
                                       var respText = Ext.util.JSON.decode(response.responseText);
                                       var msg = respText.msg;
                                       myMask.hide();
                                       Ext.MessageBox.show({
                                           title:'信息',
                                           width:250,
                                           msg:msg,
                                           animEl:'send.db.external.info',
                                           buttons:{'ok':'确定'},
                                           icon:Ext.MessageBox.INFO,
                                           closable:false,
                                            fn:function(e){
                                                if(e=='ok'){
                                                    external_allow_grid_panel.render();
                                                    external_allow_store.reload();
                                                }
                                            }
                                       });
                                   }
                               });
                           }
                       }
                   });
               }
           }),
           {xtype:"tbseparator"},
           new Ext.Button({
                id : 'btnCopy.out',
                text:'存档',
                iconCls:'copy',
                handler:function(){
                    var myMask = new Ext.LoadMask(Ext.getBody(),{
                        msg : '正在处理,请稍后...',
                        removeMask : true
                    });
                    myMask.show();
                    Ext.Ajax.request({
                        url:'../../AppTypeAction_readXmlRootDesc.action',
                        params:{type:'external'},
                        success:function(response,option){
                            var respText = Ext.util.JSON.decode(response.responseText);
                            var description = respText.desc;
                            var msg = respText.msg;
                            myMask.hide();
                            if(msg=='true'){
                                var message;
                                if(description==null||description==''||description=='null'){
                                    message = "存档当前配置文件(可信/非可信)？<br><font color='#808080'>可以输入描述信息用于说明存档后的配置(可选)!</font>";
                                } else {
                                    message = "当前配置文件描述信息:<font color='green'>"+description+"</font><br>存档当前配置文件(可信/非可信)？<br><font color='#808080'>可以输入描述信息用于说明存档后的配置(可选)!</font>";
                                }
                                Ext.MessageBox.show({
                                    title:'信息',
                                    msg:message,
                                    prompt:true,
                                    animEl:'btnCopy.out',
                                    width:350,
                                    buttons:{'ok':'确定','no':'取消'},
                                    icon:Ext.MessageBox.INFO,
                                    closable:false,
                                    fn:function(e,text){
                                        if(e=='ok'){
                                            var myMask = new Ext.LoadMask(Ext.getBody(),{
                                                msg:'正在存档,请稍后...',
                                                removeMask:true
                                            });
                                            myMask.show();
                                            Ext.Ajax.request({
                                                url:'../../AppTypeAction_toFile.action',
                                                params:{text:text,type:'external'},
                                                success:function(r,o){
                                                    var respText = Ext.util.JSON.decode(r.responseText);
                                                    var msg = respText.msg;
                                                    myMask.hide();
                                                    Ext.MessageBox.show({
                                                        title:'信息',
                                                        msg:msg,
                                                        animEl:'btnCopy.out',
                                                        buttons:{'ok':'确定'},
                                                        icon:Ext.MessageBox.INFO,
                                                        closable:false
                                                     });
                                                }
                                            });
                                        }
                                    }
                                });
                            } else {
                                Ext.MessageBox.show({
                                    title:'信息',
                                    msg:msg,
                                    animEl:'btnCopy.out',
                                    width:300,
                                    buttons:{'ok':'确定'},
                                    icon:Ext.MessageBox.WARNING,
                                    closable:false
                                });
                            }
                        }
                    });
                }
            })
       ],
       view:new Ext.grid.GroupingView({
           forceFit:true,
           groupingTextTpl:'{text}({[values.rs.length]}条记录)'
       }),
       bbar:external_allow_page_toolbar
   });


/********************************************* -- external_grid_panel end -- *******************************************************************************************************/    
    var port = new Ext.Viewport({
        layout:'fit',
        renderTo:Ext.getBody(),
        items:[{
        	autoScroll:true,
        	items:[external_grid_panel,external_allow_grid_panel]
        }]
    });
    external_store.load({
       params:{
           start:external_start,limit:external_pageSize
       }
    });
    external_allow_store.load({
       params:{
           start:external_start,limit:external_pageSize
       }
    });
});

//============================================ -- javascript function -- =============================================================================
function setHeight(){
	var h = document.body.clientHeight-8;
	return h/2;
}

function setWidth(){
    return document.body.clientWidth-8;
}

function setGroupRadio(id,field,i){
	var a = Ext.getCmp(id);
	return a.find(field)[i].getValue();
}

function showURL_isActive(value){
    if(value == 'true' || value==true){
    	return '<img src="../../img/icon/ok.png" alt="启动" title="运行中" />';
    }else if(value == 'false' || value == false){
    	return '<img src="../../img/icon/off.gif" alt="停止" title="未运行"/>';
    }
}
function show_isAllow(value){
    if(value == 'true' || value==true){
    	return '已通过';
    }else if(value == 'false' || value == false){
    	return '未通过';
    }
}

function showURL_speed(value){
    return value + ' 毫秒'
}

function showURL_channel(value){
    if(value==1||value=='1'){
        return "通道一";
    } else if(value==2||value=='2'){
        return "通道二";
    }
}

function show_is(value){
    if(value=='true'||value == true){
        return '是';
    }else if(value == 'false' || value == false){
        return '否';
    }else if(value == '' || value == null){
        return '否';
    }
}

function external_showURL_operation(value){
    if(value == 'trigger'){
        return '触发同步';
    }else if(value == 'entirely'){
        return '全表同步';
    }else if(value == 'delete'){
        return '删除同步';
    }else if(value == 'flag'){
        return '标记同步';
    }else if(value == 'timesync'){
        return '时间标记同步';
    }
}
function show_InfoLevel(value){
    if(value==0){
        return "公开信息";
    } else if (value==1){
        return "第一级";
    } else if (value==2){
        return "第二级";
    } else if (value==3){
        return "第三级";
    } else if (value==4){
        return "第四级";
    } else if (value==5){
        return "第五级";
    }
}
function external_showURL_tables(value){
    if(value == 'tables_0'){
        return "<a href='javascript:;' style='color: green;' onclick='external_detail_db_attribute_source();'>源表</a>";
    }else if(value == 'tables_1'){
        return "<a href='javascript:;' style='color: green;' onclick='external_detail_db_attribute_source();'>源表</a>";
    }else if(value == 'tables_2'){
        return "<font color='gray'>源表</font>";
    }else if(value == 'tables_3'){
        return "<font color='gray'>源表</font>";
    }
}

function external_allow_showURL_tables(value){
    if(value == 'tables_0'){
        return "<a href='javascript:;' style='color: green;' onclick='external_allow_detail_db_attribute_source();'>源表</a>";
    }else if(value == 'tables_1'){
        return "<a href='javascript:;' style='color: green;' onclick='external_allow_detail_db_attribute_source();'>源表</a>";
    }else if(value == 'tables_2'){
        return "<font color='gray'>源表</font>";
    }else if(value == 'tables_3'){
        return "<font color='gray'>源表</font>";
    }
}

function external_showURL_plugin(value){
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

function showURL_status(value){
    if(value==0||value=='0'){
        return "<font color='green'>已发送</font> ";
    } else if (value==-1||value=='-1') {
        return "<font color='red'>已修改,需重新发送</font>"
    } else if (value==1||value=='1') {
        return "<font color='red'>未发送</font>"
    }
}

function external_showURL_flag(value,p,r){
    var temp = "&nbsp;&nbsp;&nbsp;&nbsp;";
    var detail = "<a href='javascript:;' style='color: green;' onclick='external_detail_db_win();'>详细</a>" + temp;
    var deleteType;
    if (r.get('deleteFlag')) {
        deleteType = "<font color='gray'>批准删除</font>" + temp;
    } else {
        deleteType = "<a href='javascript:;' style='color: green;' onclick='external_delete_db_row();'>批准删除</a>" + temp;
    }
    var security = "<a href='javascript:;' style='color: green;' onclick='external_update_db_security_win();'>安全属性设置</a>" + temp;
    var allow = "<a href='javascript:;' style='color: green;' onclick='type_allow();' >审核通过</a>" + temp;
    var notAllow = "<a href='javascript:;' style='color: green;' onclick='type_check();' >审核不通过</a>";
    return detail + deleteType + security + allow + notAllow;
}

function external_allow_showURL_flag(value,p,r){
    var temp = "&nbsp;&nbsp;&nbsp;&nbsp;";
    var detail = "<a href='javascript:;' style='color: green;' onclick='external_allow_detail_db_win();'>详细</a>" + temp;
    var deleteType;
    if (r.get('deleteFlag')) {
        deleteType = "<font color='gray'>批准删除</font>" + temp;
    } else {
        deleteType = "<a href='javascript:;' style='color: green;' onclick='external_allow_delete_db_row();'>批准删除</a>" + temp;
    }
    var security = "<a href='javascript:;' style='color: green;' onclick='external_allow_update_db_security_win();'>安全属性设置</a>" + temp;

    var status;
    if(r.get('isActive') == 'true'|| r.get('isActive') == true){
        status = "<a href='javascript:;' style='color: green;' onclick='external_stop_db();' >停用</a>" ;
    } else if(r.get('isActive') == 'false'|| r.get('isActive') == false){
        status = "<a href='javascript:;' style='color: green;' onclick='external_start_db();'>启用</a>" ;
    }

    return detail + deleteType + security + status ;
}

var synchronizeMethod = [['entirely','全表同步'],['trigger','触发同步'],['delete','删除同步'],['flag','标记同步'],['timesync','时间标记同步']];
var storeSynchronizeMethod = new Ext.data.SimpleStore({fields:['value','key'],data:synchronizeMethod});


