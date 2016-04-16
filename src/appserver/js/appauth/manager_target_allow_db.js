/**
 * 目标--数据库同步--审核
 */
//==================================== -- 数据库同步应用 extjs 页面 -- =============================================================
Ext.onReady(function(){
    Ext.BLANK_IMAGE_URL = '../../js/ext/resources/images/default/s.gif';
    Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget = 'side';
/********************************************* -- internal_grid_panel start -- *******************************************************************************************************/        
    var internal_start = 0;			//分页--开始数
    var internal_pageSize = 15;		//分页--每页数
    var internal_record = new Ext.data.Record.create([
        {name:'appName',			mapping:'appName'},
        {name:'appDesc',			mapping:'appDesc'},
        {name:'appType',			mapping:'appType'},
        {name:'isActive',			mapping:'isActive'},
        {name:'isAllow',			mapping:'isAllow'},
        {name:'infoLevel',		mapping:'infoLevel'},
        {name:'isFilter',		    mapping:'isFilter'},
	    {name:'isVirusScan',		mapping:'isVirusScan'},
        {name:'isLocal',			mapping:'isLocal'},
        {name:'isRecover',		mapping:'isRecover'},
        {name:'dataPath',			mapping:'dataPath'},
        {name:'deleteFile',		mapping:'deleteFile'},
        {name:'srcdbName',		mapping:'srcdbName'},
        {name:'tables',			mapping:'tables'},
        {name:'plugin',			mapping:'plugin'},
        {name:'privated',			mapping:'privated'},
        {name:'deleteFlag',		mapping:'deleteFlag'},
        {name:'flag',				mapping:'flag'}
    ]);
    var internal_allow_record = new Ext.data.Record.create([
        {name:'appName',			mapping:'appName'},
        {name:'appDesc',			mapping:'appDesc'},
        {name:'appType',			mapping:'appType'},
        {name:'isActive',			mapping:'isActive'},
        {name:'isAllow',			mapping:'isAllow'},
        {name:'infoLevel',		mapping:'infoLevel'},
        {name:'isFilter',		    mapping:'isFilter'},
	    {name:'isVirusScan',		mapping:'isVirusScan'},
        {name:'isLocal',			mapping:'isLocal'},
        {name:'isRecover',		mapping:'isRecover'},
        {name:'dataPath',			mapping:'dataPath'},
        {name:'deleteFile',		mapping:'deleteFile'},
        {name:'srcdbName',		mapping:'srcdbName'},
        {name:'tables',			mapping:'tables'},
        {name:'plugin',			mapping:'plugin'},
        {name:'privated',			mapping:'privated'},
        {name:'deleteFlag',		mapping:'deleteFlag'},
        {name:'flag',				mapping:'flag'}
    ]);
    var internal_proxy = new Ext.data.HttpProxy({
        url:"../../AppTypeAction_readInternalNotAllowType.action?typeXml=internal&appType=db"
    });
    var internal_allow_proxy = new Ext.data.HttpProxy({
        url:"../../AppTypeAction_readInternalAllowType.action?typeXml=internal&appType=db"
    });
    var internal_reader = new Ext.data.JsonReader({
        totalProperty:"total",
        root:"rows"
    },internal_record);
    var internal_allow_reader = new Ext.data.JsonReader({
        totalProperty:"total",
        root:"rows"
    },internal_allow_record);
    var internal_store = new Ext.data.GroupingStore({
        id:"store.grid.db.internal.info",
        proxy : internal_proxy,
        reader : internal_reader
    });
    var internal_allow_store = new Ext.data.GroupingStore({
        id:"store.grid.db.internal.allow.info",
        proxy : internal_allow_proxy,
        reader : internal_allow_reader
    });

    var internal_boxM = new Ext.grid.CheckboxSelectionModel();   //复选框
    var internal_allow_boxM = new Ext.grid.CheckboxSelectionModel();   //复选框
    var internal_rowNumber = new Ext.grid.RowNumberer();         //自动 编号
    var internal_allow_rowNumber = new Ext.grid.RowNumberer();         //自动 编号
    var internal_colM = new Ext.grid.ColumnModel([
//        internal_boxM,
        internal_rowNumber,
        {header:"应用编号",			dataIndex:"appName",	    align:'center',menuDisabled:true,sortable:true},
        {header:"应用名",			    dataIndex:"appDesc",	    align:'center',menuDisabled:true,sortable:true},
        {header:'审批通过',		dataIndex:'isAllow',	    align:'center',menuDisabled:true,sortable:true,    renderer:show_isAllow},
        {header:'信息等级',	        dataIndex:'infoLevel',	align:'center',menuDisabled:true,renderer:show_InfoLevel,width:50},
        {header:'启用内容过滤',	dataIndex:'isFilter',	align:'center',renderer:show_is},
        {header:'启用病毒扫描',	dataIndex:'isVirusScan',	align:'center',renderer:show_is},
        {header:'应用类型',			dataIndex:'appType',	    align:'center',sortable:true},
        {header:'源数据库名称',		dataIndex:'srcdbName',	align:'center',sortable:true},
        {header:'执行恢复操作',		dataIndex:'isRecover',	align:'center',sortable:true,    renderer:internal_showURL_is},
        {header:'数据文件存放目录',	dataIndex:'dataPath',	align:'center',sortable:true},
        {header:'数据写入文件',	dataIndex:'deleteFile',	align:'center',sortable:true,    renderer:internal_showURL_is},
        {header:'数据表集合',			dataIndex:'tables',		align:'center',menuDisabled:true,sortable:true,		renderer:internal_showURL_tables,	width:90},
        {header:'源、目标',			dataIndex:'plugin',		align:'center',menuDisabled:true,sortable:true,		renderer:internal_showURL_plugin},
        {header:'操作标记',			dataIndex:'flag',		    align:'center',menuDisabled:true,sortable:true,		renderer:internal_showURL_flag,		width:200}
    ]);
    var internal_allow_colM = new Ext.grid.ColumnModel([
//        internal_allow_boxM,
        internal_allow_rowNumber,
        {header:"应用编号",			dataIndex:"appName",	    align:'center',menuDisabled:true,sortable:true},
        {header:"应用名",			    dataIndex:"appDesc",	    align:'center',menuDisabled:true,sortable:true},
        {header:'启用状态',		    dataIndex:'isActive',	align:'center',menuDisabled:true,sortable:true,    renderer:showURL_isActive},
        {header:'信息等级',	        dataIndex:'infoLevel',	align:'center',menuDisabled:true,renderer:show_InfoLevel,width:50},
        {header:'启用内容过滤',	dataIndex:'isFilter',	align:'center',renderer:show_is},
        {header:'启用病毒扫描',	dataIndex:'isVirusScan',	align:'center',renderer:show_is},
        {header:'应用类型',			dataIndex:'appType',	    align:'center',sortable:true},
        {header:'源数据库名称',		dataIndex:'srcdbName',	align:'center',sortable:true},
        {header:'执行恢复操作',		dataIndex:'isRecover',	align:'center',sortable:true,    renderer:internal_showURL_is},
        {header:'数据文件存放目录',	dataIndex:'dataPath',	align:'center',sortable:true},
        {header:'数据写入文件',	dataIndex:'deleteFile',	align:'center',sortable:true,    renderer:internal_showURL_is},
        {header:'数据表集合',			dataIndex:'tables',		align:'center',menuDisabled:true,sortable:true,		renderer:internal_allow_showURL_tables,	width:90},
        {header:'源、目标',			dataIndex:'plugin',		align:'center',menuDisabled:true,sortable:true,		renderer:internal_showURL_plugin},
        {header:'操作标记',			dataIndex:'flag',		    align:'center',menuDisabled:true,sortable:true,		renderer:internal_allow_showURL_flag,		width:200}
    ]);
    for(var i=5;i<12;i++){
        internal_colM.setHidden(i,!internal_colM.isHidden(i));                // 加载后 不显示 该项
        internal_allow_colM.setHidden(i,!internal_allow_colM.isHidden(i));                // 加载后 不显示 该项
    }
    internal_colM.defaultSortable = true;
    internal_allow_colM.defaultSortable = true;
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
    var internal_allow_page_toolbar = new Ext.PagingToolbar({
        pageSize : internal_pageSize,
        store:internal_allow_store,
        displayInfo:true,
        displayMsg:"显示第{0}条记录到第{1}条记录，一共{2}条",
        emptyMsg:"没有记录",
        beforePageText:"当前页",
        afterPageText:"共{0}页",
        refresh:internal_allow_store
    });
    var internal_grid_panel = new Ext.grid.GridPanel({
        id:'grid.db.internal.info',
        title:'<center><font size="4">可信端--审批</font></center>',
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
        bbar:internal_page_toolbar
    });
    var internal_allow_grid_panel = new Ext.grid.GridPanel({
        id:'grid.db.internal.allow.info',
        title:'<center><font size="4">可信端--启停</font></center>',
        animCollapse:true,
        autoScroll:true,
        height:setHeight(),
        width:setWidth(),
        loadMask:{msg:'正在加载数据，请稍后...'},
        border:false,
        collapsible:false,
//        heightIncrement:true,
        cm:internal_allow_colM,
//        sm:internal_allow_boxM,
        store:internal_allow_store,
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
        bbar:internal_allow_page_toolbar
    });

/********************************************* -- internal_grid_panel end   -- *******************************************************************************************************/        
    var port = new Ext.Viewport({
        layout:'fit',
        renderTo:Ext.getBody(),
        items:[{
        	autoScroll:true,
        	items:[internal_grid_panel,internal_allow_grid_panel]
        }]
    });
    internal_store.load({
        params:{
            start:internal_start,limit:internal_pageSize
        }
    });
    internal_allow_store.load({
        params:{
            start:internal_start,limit:internal_pageSize
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


function internal_showURL_is(value){
    if(value=='true'||value == true){
        return '是';
    }else if(value == 'false' || value == false){
        return '否';
    }else if(value == '' || value == null){
        return '否';
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
        return "<a href='javascript:;' style='color: green;' onclick='internal_detail_db_attribute_source();'>源表</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href='javascript:;' style='color: green;' onclick='internal_detail_db_attribute_target();'>目标表</a>";//&nbsp;&nbsp;&nbsp;&nbsp;<a href='javascript:;' style='color: green;' onclick='internal_detail_db_attribute_merge();'>辅助表</a>";
        return '时间标记同步';
    }
}

function internal_showURL_tables(value){
    if(value == 'tables_0'){
        return "<a href='javascript:;' style='color: green;' onclick='internal_detail_db_attribute_target();'>目标表</a>";
    }else if(value == 'tables_1'){
        return "<font color='gray'>目标表</font>"
    }else if(value == 'tables_2'){
        return "<a href='javascript:;' style='color: green;' onclick='internal_detail_db_attribute_target();'>目标表</a>";
    }else if(value == 'tables_3'){
        return "<font color='gray'>目标表</font>";
    }
}
function internal_allow_showURL_tables(value){
    if(value == 'tables_0'){
        return "<a href='javascript:;' style='color: green;' onclick='internal_allow_detail_db_attribute_target();'>目标表</a>";
    }else if(value == 'tables_1'){
        return "<font color='gray'>目标表</font>"
    }else if(value == 'tables_2'){
        return "<a href='javascript:;' style='color: green;' onclick='internal_allow_detail_db_attribute_target();'>目标表</a>";
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

function internal_showURL_flag(value,p,r){
    var temp = "&nbsp;&nbsp;&nbsp;&nbsp;";
    var detail = "<a href='javascript:;' style='color: green;' onclick='internal_detail_db_win();'>详细</a>" + temp;
    var deleteType;
    if (r.get('deleteFlag')) {
        deleteType = "<font color='gray'>批准删除</font>" + temp;
    } else {
        deleteType = "<a href='javascript:;' style='color: green;' onclick='internal_delete_db_row();'>批准删除</a>" + temp;
    }
    var security = "<a href='javascript:;' style='color: green;' onclick='internal_update_db_security_win();'>安全属性设置</a>" + temp;
    var allow = "<a href='javascript:;' style='color: green;' onclick='type_allow();' >审核通过</a>" + temp;
    var notAllow = "<a href='javascript:;' style='color: green;' onclick='type_check();' >审核不通过</a>";
    return detail + deleteType + security + allow + notAllow;
}
function internal_allow_showURL_flag(value,p,r){
    var temp = "&nbsp;&nbsp;&nbsp;&nbsp;";
    var detail = "<a href='javascript:;' style='color: green;' onclick='internal_allow_detail_db_win();'>详细</a>" + temp;
    var deleteType;
    if (r.get('deleteFlag')) {
        deleteType = "<font color='gray'>批准删除</font>" + temp;
    } else {
        deleteType = "<a href='javascript:;' style='color: green;' onclick='internal_allow_delete_db_row();'>批准删除</a>" + temp;
    }
    var security = "<a href='javascript:;' style='color: green;' onclick='internal_allow_update_db_security_win();'>安全属性设置</a>" + temp;
    var status;
    if(r.get('isActive') == 'true'|| r.get('isActive') == true){
        status = "<a href='javascript:;' style='color: green;' onclick='internal_stop_db();' >停用</a>";
    } else if(r.get('isActive') == 'false'|| r.get('isActive') == false){
        status = "<a href='javascript:;' style='color: green;' onclick='internal_start_db();'>启用</a>";
    }
    return detail + deleteType + security + status ;
}

var synchronizeMethod = [['entirely','全表同步'],['trigger','触发同步'],['delete','删除同步'],['flag','标记同步'],['timesync','时间标记同步']];
var storeSynchronizeMethod = new Ext.data.SimpleStore({fields:['value','key'],data:synchronizeMethod});
