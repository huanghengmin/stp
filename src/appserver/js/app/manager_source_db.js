/**
 * 源端数据库同步
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
       {name:'tables',				mapping:'tables'},
       {name:'plugin',				mapping:'plugin'},
       {name:'privated',			mapping:'privated'},
       {name:'deleteFlag',			mapping:'deleteFlag'},
       {name:'operateDB',			mapping:'operateDB'},
       {name:'speed',			mapping:'speed'},
       {name:'flag',				mapping:'flag'}
   ]);
   var external_proxy = new Ext.data.HttpProxy({
       url:"../../AppTypeAction_readExternalType.action?typeXml=external&appType=db"
   });
   var external_reader = new Ext.data.JsonReader({
       totalProperty:"total",
       root:"rows"
   },external_record);
   var external_store = new Ext.data.GroupingStore({
       id:"store.grid.db.external.info",
       proxy : external_proxy,
       reader : external_reader
   });
   var external_boxM = new Ext.grid.CheckboxSelectionModel();   //复选框
   var external_rowNumber = new Ext.grid.RowNumberer();         //自动 编号
   var external_colM = new Ext.grid.ColumnModel([
//       external_boxM,
       external_rowNumber,
       {header:"应用编号",			dataIndex:"appName",	    align:'center',sortable:true},
       {header:"应用名",			    dataIndex:"appDesc",     align:'center',sortable:true},
       {header:"传输速度",			    dataIndex:"speed",     align:'center',sortable:true,renderer:showURL_speed},
//       {header:'应用类型',			dataIndex:'appType',	    align:'center',sortable:true},
       {header:'通道',			dataIndex:'channel',	    align:'center',sortable:true,       renderer:showURL_channel},
       {header:'通道端口',			dataIndex:'channelport',	align:'center',sortable:true,          width:50},
       {header:'启用状态',			dataIndex:'isActive',	align:'center',sortable:true,    	renderer:showURL_isActive,       width:50},
       {header:'数据源',				dataIndex:'dbName',		align:'center',sortable:true},
       {header:'同步方式',			dataIndex:'operation',	align:'center',sortable:true,    	renderer:external_showURL_operation,       width:50},
       {header:'执行恢复操作',		dataIndex:'isRecover',	align:'center',sortable:true,    	renderer:external_showURL_is},
       {header:'数据文件存放目录',	dataIndex:'dataPath',	align:'center',sortable:true},
       {header:'数据写入文件',	dataIndex:'deleteFile',	align:'center',sortable:true,    	renderer:external_showURL_is},
       {header:'同步原表已存在的数据',	dataIndex:'oldStep',	align:'center',sortable:true,		renderer:external_showURL_is},
       {header:'单次传输最大记录',	dataIndex:'maxRecords',	align:'center',sortable:true},
       {header:'传输频率(秒)',		dataIndex:'interval',	align:'center',sortable:true},
       {header:'启用数据表',		dataIndex:'enable',		align:'center',sortable:true,		renderer:external_showURL_is},
       {header:'数据表',			dataIndex:'tables',		align:'center',sortable:true,		renderer:external_showURL_tables,       width:40},
       {header:'源、目标',			dataIndex:'plugin',		align:'center',sortable:true,		renderer:external_showURL_plugin,       width:50},
       {header:'操作标记',			dataIndex:'flag',		    align:'center',sortable:true,   	renderer:external_showURL_flag,    		width:250}
   ]);
       external_colM.setHidden(4,!external_colM.isHidden(4));
   for(var i=9;i<16;i++){
       external_colM.setHidden(i,!external_colM.isHidden(i));                // 加载后 不显示 该项
   }

//   external_colM.defaultSortable = true;
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
   var external_grid_panel = new Ext.grid.GridPanel({
       id:'grid.db.external.info',
       title:'<center><font size="4">非可信端</font></center>',
       animCollapse:true,
       autoScroll:true,
       height:setHeight(),
       width:setWidth(),
       loadMask:{msg:'正在加载数据，请稍后...'},
       border:false,
//       sm:external_boxM,
       cm:external_colM,
       store:external_store,
       stripeRows:true,
//       autoExpandColumn:2,
       disableSelection:true,
       bodyStyle:'width:100%',
       selModel:new Ext.grid.RowSelectionModel({singleSelect:true}),
//       viewConfig:{
//           forceFit:true,
//           enableRowBody:true,
//           getRowClass:function(record,rowIndex,p,store){
//               return 'x-grid3-row-collapsed';
//           }
//       },
       tbar:[
           new Ext.Button({
               id:'btnAdd.db.external.info',
               text:'新增',
               iconCls:'add',
               handler:function(){
                   external_insert_db_win(external_grid_panel,external_store);     //连接到 新增 面板
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
       bbar:external_page_toolbar
   });


/********************************************* -- external_grid_panel end -- *******************************************************************************************************/    
    var port = new Ext.Viewport({
        layout:'fit',
        renderTo:Ext.getBody(),
        items:[{
        	autoScroll:true,

        	items:[external_grid_panel]
        }]
    });
   external_store.load({
       params:{
           start:external_start,limit:external_pageSize
       }
   });

});

//============================================ -- javascript function -- =============================================================================
function setHeight(){
	var h = document.body.clientHeight-8;
	return h;
}

function setWidth(){
    return document.body.clientWidth-8;
}

function setGroupRadio(id,field,i){
	var a = Ext.getCmp(id);
	return a.find(field)[i].getValue();
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

function showURL_isActive(value){
    if(value == 'true' || value==true){
    	return '<img src="../../img/icon/ok.png" alt="启动" title="运行中" />';
    }else if(value == 'false' || value == false){
    	return '<img src="../../img/icon/off.gif" alt="停止" title="未运行"/>';
    }
}

var synchronizeMethod = [['entirely','全表同步'],['trigger','触发同步'],['delete','删除同步'],['flag','标记同步'],['timesync','时间标记同步']];
var storeSynchronizeMethod = new Ext.data.SimpleStore({fields:['value','key'],data:synchronizeMethod});

function external_showURL_is(value){
    if(value == 'true'){
        return '是';
    }else if(value == 'false'){
        return '否';
    }else if(value == ''){
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

function external_showURL_tables(value,p,r){
    var appName = r.get('appName');
    var dbName = r.get('dbName');
    var operation = r.get('operation');

	if(value == 'tables_0'){
		return "<a href='javascript:;' onclick='external_detail_db_attribute_source(\""+appName+"\",\""+dbName+"\",\""+operation+"\");' style='color: green;'>源表</a>";
	}else if(value == 'tables_1'){
		return "<a href='javascript:;' onclick='external_detail_db_attribute_source(\""+appName+"\",\""+dbName+"\",\""+operation+"\");' style='color: green;'>源表</a>";
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

function external_showURL_flag(value,p,r){
    var deleteType;
    if(r.get('deleteFlag')) {
        deleteType = "<a href='javascript:;' onclick='external_delete_db_row();' style='color: green;'>删除应用</a>";
    } else {
        deleteType = "<font color='gray'>等待删除</font>";
    }
    var operateDB;
    if(r.get('operateDB')){
        var appName = r.get('appName');
        operateDB = "<a href='javascript:;' onclick='external_operate_db(\""+appName+"\");' style='color: green;'>操作数据库</a>";
    } else {
        operateDB = "<font color='gray'>操作数据库</font>";
    }
    if(value == 'flag_0'){
        return "<a href='javascript:;' onclick='external_detail_db_win();' style='color: green;'>详细</a>&nbsp;&nbsp;&nbsp;&nbsp;"
            +operateDB+"&nbsp;&nbsp;&nbsp;&nbsp;"
            +deleteType
            +"&nbsp;&nbsp;&nbsp;&nbsp;<a href='javascript:;' onclick='external_update_db_source_app_win();' style='color: green;'>修改应用</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href='javascript:;' onclick='external_update_db_source_data_win();' style='color: green;'>修改数据</a>";
    }else if(value == 'flag_1'){
        return "<a href='javascript:;' onclick='external_detail_db_win();' style='color: green;'>详细</a>&nbsp;&nbsp;&nbsp;&nbsp;"
            +operateDB+"&nbsp;&nbsp;&nbsp;&nbsp;"
            +deleteType
            +"&nbsp;&nbsp;&nbsp;&nbsp;<a href='javascript:;' onclick='external_update_db_source_app_win();' style='color: green;'>修改应用</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href='javascript:;' onclick='external_update_db_source_data_win();' style='color: green;'>修改数据</a>";
    }else if(value == 'flag_2'){
        return "<a href='javascript:;' onclick='external_detail_db_win();' style='color: green;'>详细</a>&nbsp;&nbsp;&nbsp;&nbsp;"
            +operateDB+"&nbsp;&nbsp;&nbsp;&nbsp;"
            +deleteType
            +"&nbsp;&nbsp;&nbsp;&nbsp;<font color='gray'>修改应用</font>&nbsp;&nbsp;&nbsp;&nbsp;<font color='gray'>修改数据</font>";
    }
}