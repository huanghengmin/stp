/**
 * Created by IntelliJ IDEA.
 * User: 钱晓盼
 * Date: 11-11-8
 * Time: 上午10:24
 * To change this template use File | Settings | File Templates.
 */
//==================================== -- 数据库同步应用 extjs 页面 -- =============================================================
Ext.onReady(function(){
    Ext.BLANK_IMAGE_URL = '../../js/ext/resources/images/default/s.gif';
    Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget = 'side';
/********************************************* -- internal_grid_panel start -- *******************************************************************************************************/        
    var internal_start = 0;			//分页--开始数
    var internal_pageSize = 5;		//分页--每页数
    var internal_record = new Ext.data.Record.create([
        {name:'appName',			mapping:'appName'},
        {name:'appDesc',			mapping:'appDesc'},
        {name:'appType',			mapping:'appType'},
        {name:'isActive',			mapping:'isActive'},
        {name:'isLocal',			mapping:'isLocal'},
        {name:'isRecover',			mapping:'isRecover'},
        {name:'dataPath',			mapping:'dataPath'},
        {name:'deleteFile',			mapping:'deleteFile'},
        {name:'srcdbName',			mapping:'srcdbName'},
        {name:'tables',				mapping:'tables'},
        {name:'plugin',				mapping:'plugin'},
        {name:'privated',			mapping:'privated'},
        {name:'deleteFlag',			mapping:'deleteFlag'},
        {name:'flag',				mapping:'flag'},
        {name:'updateFlag',				mapping:'updateFlag'}
    ]);
    var internal_proxy = new Ext.data.HttpProxy({
        url:"../../AppTypeAction_readInternalType.action?typeXml=internal&appType=db"
    });
    var internal_reader = new Ext.data.JsonReader({
        totalProperty:"total",
        root:"rows"
    },internal_record);
    var internal_store = new Ext.data.GroupingStore({
        id:"store.grid.db.internal.info",
        proxy : internal_proxy,
        reader : internal_reader
    });

    var internal_boxM = new Ext.grid.CheckboxSelectionModel();   //复选框
    var internal_rowNumber = new Ext.grid.RowNumberer();         //自动 编号
    var internal_colM = new Ext.grid.ColumnModel([
//        internal_boxM,
        internal_rowNumber,
        {header:"应用编号",			dataIndex:"appName",	align:'center',sortable:true},
        {header:"应用名",			    dataIndex:"appDesc",	align:'center',sortable:true},
        {header:'应用类型',			dataIndex:'appType',	align:'center',sortable:true},
        {header:'启用状态',		    dataIndex:'isActive',	align:'center',sortable:true,    renderer:showURL_isActive},
        {header:'源数据库名称',		dataIndex:'srcdbName',	align:'center',sortable:true},
        {header:'执行恢复操作',		dataIndex:'isRecover',	align:'center',sortable:true,    renderer:internal_showURL_is},
        {header:'数据文件存放目录',	dataIndex:'dataPath',	align:'center',sortable:true},
        {header:'数据写入文件',	dataIndex:'deleteFile',	align:'center',sortable:true,    renderer:internal_showURL_is},
        {header:'数据表集合',			dataIndex:'tables',		align:'center',sortable:true,		renderer:internal_showURL_tables,	width:90},
        {header:'源、目标',			dataIndex:'plugin',		align:'center',sortable:true,		renderer:internal_showURL_plugin},
        {header:'操作标记',			dataIndex:'flag',		align:'center',sortable:true,		renderer:internal_showURL_flag,		width:200}
    ]);
    internal_colM.setHidden(3,!internal_colM.isHidden(3));
    for(var i=6;i<9;i++){
        internal_colM.setHidden(i,!internal_colM.isHidden(i));                // 加载后 不显示 该项
    }
    internal_colM.defaultSortable = true;
    var internal_page_toolbar = new Ext.PagingToolbar({
        pageSize : internal_pageSize,
        store:internal_store,
        displayInfo:true,
        displayMsg:"显示第{0}条记录到第{1}条记录，一共{2}条",
        emptyMsg:"没有记录",
        beforePageText:"当前页",
        afterPageText:"共{0}页",
        refresh:internal_store
    });
    var internal_grid_panel = new Ext.grid.GridPanel({
        id:'grid.db.internal.info',
        title:'<center><font size="4">可信端</font></center>',
        animCollapse:true,
        autoScroll:true,
        height:setHeight(),
        width:setWidth(),
        loadMask:{msg:'正在加载数据，请稍后...'},
        border:false,
        collapsible:false,
//        heightIncrement:true,
        cm:internal_colM,
//        sm:internal_boxM,
        store:internal_store,
        stripeRows:true,
        autoExpandColumn:2,
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
        tbar:[
            new Ext.Button({
                id:'btnAdd.db.internal.info',
                text:'新增',
                iconCls:'add',
                handler:function(){
                    internal_insert_db_win(internal_grid_panel,internal_store);     //连接到 新增 面板
                }
            }),
            {xtype:"tbseparator"},
            new Ext.Button({
                id : 'btnCopy.inner',
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
                        params:{type:'internal'},
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
                                    message = "存档当前配置文件描述信息:<font color='green'>"+description+"</font><br>存档当前配置文件(可信/非可信)？<br><font color='#808080'>可以输入描述信息用于说明存档后的配置(可选)!</font>";
                                }
                                Ext.MessageBox.show({
                                    title:'信息',
                                    msg:message,
                                    prompt:true,
                                    animEl:'btnCopy.inner',
                                    width:350,
                                    buttons:{'ok':'确定','no':'取消'},
                                    icon:Ext.MessageBox.WARNING,
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
                                                params:{text:text,type:'internal'},
                                                success:function(r,o){
                                                    var respText = Ext.util.JSON.decode(r.responseText);
                                                    var msg = respText.msg;
                                                    myMask.hide();
                                                    Ext.MessageBox.show({
                                                        title:'信息',
                                                        msg:msg,
                                                        animEl:'btnCopy.inner',
                                                        buttons:{'ok':'确定'},
                                                        icon:Ext.MessageBox.INFO,
                                                        closable:false
                                                     });
                                                }
                                            });
                                        }
                                    }
                                });
                            }else {
                                Ext.MessageBox.show({
                                    title:'信息',
                                    msg:msg,
                                    animEl:'btnCopy.inner',
                                    width:300,
                                    buttons:{'ok':'确定'},
                                    icon:Ext.MessageBox.ERROR,
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
        bbar:internal_page_toolbar
    });

/********************************************* -- internal_grid_panel end   -- *******************************************************************************************************/        
/********************************************* -- external_grid_panel start -- *******************************************************************************************************/    
	
   var external_start = 0;			//分页--开始数
   var external_pageSize = 5;		//分页--每页数
   var external_record = new Ext.data.Record.create([
       {name:'appName',			mapping:'appName'},
       {name:'appDesc',			mapping:'appDesc'},
       {name:'appType',			mapping:'appType'},
       {name:'speed',			mapping:'speed'},
       {name:'channel',			mapping:'channel'},
       {name:'channelport',	    mapping:'channelport'},
       {name:'isActive',			mapping:'isActive'},
       {name:'isLocal',			mapping:'isLocal'},
       {name:'isRecover',			mapping:'isRecover'},
       {name:'dataPath',			mapping:'dataPath'},
       {name:'deleteFile',			mapping:'deleteFile'},
       {name:'dbName',				mapping:'dbName'},
       {name:'oldStep',			mapping:'oldStep'},
       {name:'operation',			mapping:'operation'},
       {name:'enable',				mapping:'enable'},
       {name:'tempTable',			mapping:'tempTable'},
       {name:'maxRecords',			mapping:'maxRecords'},
       {name:'interval',			mapping:'interval'},
       {name:'tables',				mapping:'tables'},
       {name:'plugin',				mapping:'plugin'},
       {name:'privated',			mapping:'privated'},
       {name:'deleteFlag',			mapping:'deleteFlag'},
       {name:'status',			mapping:'status'},
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
       {header:'应用类型',			dataIndex:'appType',	    align:'center',sortable:true},
       {header:'传输速度',			dataIndex:'speed',	    align:'center',sortable:true,menuDisabled:true,       renderer:showURL_speed},
       {header:'通道',			dataIndex:'channel',	    align:'center',sortable:true,menuDisabled:true,       renderer:showURL_channel},
       {header:'通道端口',			dataIndex:'channelport',		align:'center',          width:50},
       {header:'启用状态',			dataIndex:'isActive',	align:'center',sortable:true,    	renderer:showURL_isActive},
       {header:'数据源',				dataIndex:'dbName',		align:'center',sortable:true},
       {header:'同步方式',			dataIndex:'operation',	align:'center',sortable:true,    	renderer:external_showURL_operation},
       {header:'执行恢复操作',		dataIndex:'isRecover',	align:'center',sortable:true,    	renderer:external_showURL_is},
       {header:'数据文件存放目录',	dataIndex:'dataPath',	align:'center',sortable:true},
       {header:'数据写入文件',	dataIndex:'deleteFile',	align:'center',sortable:true,    	renderer:external_showURL_is},
       {header:'同步原表已存在的数据',	dataIndex:'oldStep',	align:'center',sortable:true,		renderer:external_showURL_is},
       {header:'单次传输最大记录',	dataIndex:'maxRecords',	align:'center',sortable:true},
       {header:'传输频率(秒)',		dataIndex:'interval',	align:'center',sortable:true},
       {header:'启用数据表',		dataIndex:'enable',		align:'center',sortable:true,		renderer:external_showURL_is},
       {header:'数据表集合',			dataIndex:'tables',		align:'center',sortable:true,		renderer:external_showURL_tables,       width:90},
       {header:'源、目标',			dataIndex:'plugin',		align:'center',sortable:true,		renderer:external_showURL_plugin},
       {header:'操作标记',			dataIndex:'flag',		    align:'center',sortable:true,		renderer:external_showURL_flag}
   ]);
       external_colM.setHidden(3,!external_colM.isHidden(3));
   for(var i=9;i<16;i++){
       external_colM.setHidden(i,!external_colM.isHidden(i));                // 加载后 不显示 该项
   }

   external_colM.defaultSortable = true;
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


/********************************************* -- external_grid_panel end -- *******************************************************************************************************/    
    var port = new Ext.Viewport({
        layout:'fit',
        renderTo:Ext.getBody(),
        items:[{
        	autoScroll:true,
        	items:[internal_grid_panel,external_grid_panel]
        }]
    });
    var msg;
    internal_store.load({
        params:{
            start:internal_start,limit:internal_pageSize
        }
    });
    internal_store.on('load',function(){
        for(var i = 0; i < internal_store.getCount(); i ++){
            var record = internal_store.getAt(i);
            if(record.data.updateFlag==false){
                msg = '可信端</br>注意处理[<font color="blue">更改源数据库名称</font>]所对应的可信应用';
                Ext.MessageBox.show({
                    title:'信息-存在需要更新的应用',
                    width:400,
                    msg:msg,
                    buttons:{'ok':'确定'},
                    icon:Ext.MessageBox.WARNING,
                    closable:false
                });
                break;
            }
        }
    });

    external_store.load({
       params:{
           start:external_start,limit:external_pageSize
       }
    });
    external_store.on('load',function(){
        for(var i = 0; i < external_store.getCount(); i ++){
            var record = external_store.getAt(i);
            if(record.data.status!=0||record.data.status!='0'){
                Ext.MessageBox.show({
                    title:'信息-存在需要更新的应用',
                    width:400,
                    msg:(msg==undefined?"":msg+'<br>')+'非可信端&nbsp;&nbsp;&nbsp;&nbsp;(修改后请点击[存在更新]取消更新提示)</br>注意处理[<font color="blue">存在更新</font>]所对应的可信应用',
                    buttons:{'ok':'确定'},
                    icon:Ext.MessageBox.WARNING,
                    closable:false
                });
                break;
            }
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

function internal_showURL_is(value){
    if(value == 'true'){
        return '是';
    }else if(value == 'false'){
        return '否';
    }else if(value == ''){
        return '否';
    }
}

function internal_showURL_operation(value){
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

function internal_showURL_tables(value,p,r){
    var appName = r.get('appName');
    var sourceDBName = r.get('srcdbName');
    if(value == 'tables_0'){
        return "<a href='javascript:;' style='color: green;' onclick='internal_detail_db_attribute_target(\""+appName+"\",\""+sourceDBName+"\");'>目标表</a>";
    }else if(value == 'tables_1'){
        return "<font color='gray'>目标表</font>"
    }else if(value == 'tables_2'){
        return "<a href='javascript:;' style='color: green;' onclick='internal_detail_db_attribute_target(\""+appName+"\",\""+sourceDBName+"\");'>目标表</a>";
    }else if(value == 'tables_3'){
        return "<font color='gray'>目标表</font>";
    }
}

function internal_showURL_plugin(value){
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



function internal_showURL_flag(value,p,r){
    var deleteType;
    if(r.get('deleteFlag')) {
        deleteType = "<a href='javascript:;' style='color: green;' onclick='internal_delete_db_row();'>删除应用</a>";
    } else {
        deleteType = "<font color='gray'>等待删除</font>";
    }
    var updateFlag;
    if(!r.get('updateFlag')){
        updateFlag = "&nbsp;&nbsp;&nbsp;&nbsp;<a href='javascript:;' style='color: green;' onclick='internal_update_dbName();'>更改源数据库名称</a>";
    } else {
        updateFlag = "&nbsp;&nbsp;&nbsp;&nbsp;<font color='gray'>更改源数据库名称</font>";;
    }
    if(value == 'flag_0'){
        return "<a href='javascript:;' style='color: green;' onclick='internal_detail_db_win();'>详细</a>&nbsp;&nbsp;&nbsp;&nbsp;"+deleteType+"&nbsp;&nbsp;&nbsp;&nbsp;<font color='gray'>修改应用</font>"+updateFlag;
    }else if(value == 'flag_1'){
        return "<a href='javascript:;' style='color: green;' onclick='internal_detail_db_win();'>详细</a>&nbsp;&nbsp;&nbsp;&nbsp;"+deleteType+"&nbsp;&nbsp;&nbsp;&nbsp;<font color='gray'>修改应用</font>"+updateFlag;
    }else if(value == 'flag_2'){
        return "<a href='javascript:;' style='color: green;' onclick='internal_detail_db_win();'>详细</a>&nbsp;&nbsp;&nbsp;&nbsp;"+deleteType+"&nbsp;&nbsp;&nbsp;&nbsp;<a href='javascript:;' style='color: green;' onclick='internal_update_db_target_app_win();'>修改应用</a>"+updateFlag;
    }
}


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
    var status = r.get('status');
    var initStatus;
    if(status!=0||status!='0'){
        initStatus = "<a href='javascript:;' style='color: green;' onclick='external_update_status();'>存在更新</a>";
    } else {
        initStatus = "<font color='gray'>暂无更新</font>";
    }
    return "<a href='javascript:;' style='color: green;' onclick='external_detail_db_win();'>详细</a>" +
        "&nbsp;&nbsp;&nbsp;&nbsp;" + initStatus ;
}


/**
 manager_target_db_internal.js
 manager_target_db_external.js
 */