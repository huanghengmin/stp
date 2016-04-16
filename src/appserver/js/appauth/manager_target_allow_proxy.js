/**
 * 目标--通用代理--审核
 */
//==================================== -- 通用代理应用 extjs 页面 -- =============================================================
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
        {name:'t_port',			mapping:'t_port'},
        {name:'t_poolMin',		mapping:'t_poolMin'},
        {name:'t_serverAddress',	mapping:'t_serverAddress'},
        {name:'t_tryTime',		mapping:'t_tryTime'},
        {name:'t_poolMax',		mapping:'t_poolMax'},
        {name:'t_charset',		mapping:'t_charset'},
        {name:'t_type',			mapping:'t_type'},
        {name:'plugin',			mapping:'plugin'},
        {name:'deleteFlag',		mapping:'deleteFlag'},
        {name:'ipfilter',			mapping:'ipfilter'},
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
        {name:'t_port',			mapping:'t_port'},
        {name:'t_poolMin',		mapping:'t_poolMin'},
        {name:'t_serverAddress',	mapping:'t_serverAddress'},
        {name:'t_tryTime',		mapping:'t_tryTime'},
        {name:'t_poolMax',		mapping:'t_poolMax'},
        {name:'t_charset',		mapping:'t_charset'},
        {name:'t_type',			mapping:'t_type'},
        {name:'plugin',			mapping:'plugin'},
        {name:'deleteFlag',		mapping:'deleteFlag'},
        {name:'ipfilter',			mapping:'ipfilter'},
        {name:'flag',				mapping:'flag'}
    ]);
    var internal_proxy = new Ext.data.HttpProxy({
        url:"../../AppTypeAction_readInternalNotAllowType.action?typeXml=internal"
    });
    var internal_allow_proxy = new Ext.data.HttpProxy({
        url:"../../AppTypeAction_readInternalAllowType.action?typeXml=internal"
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
        proxy : internal_proxy,
        reader : internal_reader
    });
    var internal_allow_store = new Ext.data.GroupingStore({
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
        {header:"应用编号",			dataIndex:"appName",			align:'center',menuDisabled:true},
        {header:"应用名",			    dataIndex:"appDesc",			align:'center',menuDisabled:true},
        {header:'审批通过',		dataIndex:'isAllow',		align:'center',menuDisabled:true,renderer:show_isAllow,width:50},
        {header:'信息等级',	        dataIndex:'infoLevel',		align:'center',menuDisabled:true,renderer:show_InfoLevel,width:50},
        {header:'启用内容过滤',	dataIndex:'isFilter',		align:'center',renderer:is_showURL},
        {header:'启用病毒扫描',	dataIndex:'isVirusScan',		align:'center',renderer:is_showURL},
        {header:'应用类型',			dataIndex:'appType',			align:'center',          width:50},
        {header:'应用服务地址',       dataIndex:'t_serverAddress',align:'center'},
        {header:'平台服务端口',       dataIndex:'t_port',			align:'center'},
        {header:'最小连接数',	        dataIndex:'t_poolMin',		align:'center'},
        {header:'最大连接数',	        dataIndex:'t_poolMax',		align:'center'},
        {header:'编码',       			dataIndex:'t_charset',		align:'center'},
        {header:'重试次数',		    dataIndex:'t_tryTime',		align:'center'},
        {header:'类型',	       		dataIndex:'t_type',			align:'center',menuDisabled:true},
        {header:'可访问IP',			dataIndex:'ipAddress',		align:'center',menuDisabled:true,renderer:internal_showURL_ipAddress,    width:50},
        {header:'源、目标',			dataIndex:'plugin',			align:'center',menuDisabled:true,renderer:showURL_plugin,       width:50},
        {header:"IP/Mac过虑策略",	dataIndex:"ipfilter",        align:'center',menuDisabled:true,renderer:internal_ipFilter_showURL,     width:160},
        {header:'操作标记',			dataIndex:'flag',				align:'center',menuDisabled:true,renderer:internal_showURL_flag,         width:200}

    ]);
    var internal_allow_colM = new Ext.grid.ColumnModel([
//        internal_allow_boxM,
        internal_allow_rowNumber,
        {header:"应用编号",			dataIndex:"appName",			align:'center',menuDisabled:true},
        {header:"应用名",			    dataIndex:"appDesc",			align:'center',menuDisabled:true},
        {header:'启用状态',			dataIndex:'isActive',		align:'center',menuDisabled:true,renderer:showURL_isActive,width:50},
        {header:'信息等级',	        dataIndex:'infoLevel',		align:'center',menuDisabled:true,renderer:show_InfoLevel,width:50},
        {header:'启用内容过滤',	dataIndex:'isFilter',		align:'center',renderer:is_showURL},
        {header:'启用病毒扫描',	dataIndex:'isVirusScan',		align:'center',renderer:is_showURL},
        {header:'应用类型',			dataIndex:'appType',			align:'center',          width:50},
        {header:'应用服务地址',       dataIndex:'t_serverAddress',align:'center'},
        {header:'平台服务端口',       dataIndex:'t_port',			align:'center'},
        {header:'最小连接数',	        dataIndex:'t_poolMin',		align:'center'},
        {header:'最大连接数',	        dataIndex:'t_poolMax',		align:'center'},
        {header:'编码',       			dataIndex:'t_charset',		align:'center'},
        {header:'重试次数',		    dataIndex:'t_tryTime',		align:'center'},
        {header:'类型',	       		dataIndex:'t_type',			align:'center',menuDisabled:true},
        {header:'可访问IP',			dataIndex:'ipAddress',		align:'center',menuDisabled:true,renderer:internal_allow_showURL_ipAddress,    width:50},
        {header:'源、目标',			dataIndex:'plugin',			align:'center',menuDisabled:true,renderer:showURL_plugin,       width:50},
        {header:"IP/Mac过虑策略",	dataIndex:"ipfilter",        align:'center',menuDisabled:true,renderer:internal_allow_ipFilter_showURL,     width:160},
        {header:'操作标记',			dataIndex:'flag',				align:'center',menuDisabled:true,renderer:internal_allow_showURL_flag,         width:200}

    ]);
    for(var i=6;i<15;i++){
        internal_colM.setHidden(i,!internal_colM.isHidden(i));
        internal_allow_colM.setHidden(i,!internal_allow_colM.isHidden(i));
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
        id:'grid.proxy.internal.info',
        title:'<center><font size="4">可信端--审批</font></center>',
        animCollapse:true,
        height:setHeight(),
        width:setWidth(),
        loadMask:{msg:'正在加载数据，请稍后...'},
        border:false,
        collapsible:false,
        cm:internal_colM,
//        sm:internal_boxM,
        store:internal_store,
        stripeRows:true,
        autoExpandColumn:'Posistion',
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
        id:'grid.proxy.internal.allow.info',
        title:'<center><font size="4">可信端--启停</font></center>',
        animCollapse:true,
        height:setHeight(),
        width:setWidth(),
        loadMask:{msg:'正在加载数据，请稍后...'},
        border:false,
        collapsible:false,
        cm:internal_allow_colM,
//        sm:internal_allow_boxM,
        store:internal_allow_store,
        stripeRows:true,
        autoExpandColumn:'Posistion',
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
        bbar:internal_allow_page_toolbar
    });

/********************************************* -- internal_grid_panel end   -- *******************************************************************************************************/        
    var port = new Ext.Viewport({
        layout:'fit',
        renderTo:Ext.getBody(),
        items:[{autoScroll:true,items:[internal_grid_panel,internal_allow_grid_panel]}]
    });
    internal_store.load({
        params:{
            start:internal_start,limit:internal_pageSize,appType:'proxy'
        }
    });
    internal_allow_store.load({
        params:{
            start:internal_start,limit:internal_pageSize,appType:'proxy'
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

/********************************************* -- internal function -- ******************************************************************************/

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

function is_showURL(value){
    if(value == 'true' || value==true){
    	return '是';
    }else if(value == 'false' || value == false){
    	return '否';
    }
}
function showURL_plugin(value){
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

function internal_showURL_ipAddress(value){
    if(value=='yes_ip'){
        return "<a href='javascript:;' style='color: green;' onclick='internal_ipAddress();'>IP管理</a>"
    }else{
    	return "<font color='gray'>IP管理</font>";
    }
}
function internal_allow_showURL_ipAddress(value){
    if(value=='yes_ip'){
        return "<a href='javascript:;' style='color: green;' onclick='internal_allow_ipAddress();'>IP管理</a>"
    }else{
    	return "<font color='gray'>IP管理</font>";
    }
}

function internal_ipFilter_showURL(value){
    if(value==0){
        return "<font color='gray'>IP/Mac黑名单</font>&nbsp;&nbsp;<font color='gray'>IP/Mac白名单</font> ";
    }else if(value==1){
        return "<a href='javascript:;' style='color: green;' onclick='internal_ipBlackWindow();'>IP/Mac黑名单</a>&nbsp;&nbsp;<font color='gray'>IP/Mac白名单</font> ";
    }else if(value==2){
        return "<font color='gray'>IP/Mac黑名单</font>&nbsp;&nbsp;<a href='javascript:;' style='color: green;' onclick='internal_ipWhiteWindow();'>IP/Mac白名单</a>";
    }else if(value==3){
        return "<a href='javascript:;' style='color: green;' onclick='internal_ipBlackWindow();'>IP/Mac黑名单</a>&nbsp;&nbsp;<a href='javascript:;' style='color: green;' onclick='internal_ipWhiteWindow();'>IP/Mac白名单</a>";
    }
}
function internal_allow_ipFilter_showURL(value){
    if(value==0){
        return "<font color='gray'>IP/Mac黑名单</font>&nbsp;&nbsp;<font color='gray'>IP/Mac白名单</font> ";
    }else if(value==1){
        return "<a href='javascript:;' style='color: green;' onclick='internal_allow_ipBlackWindow();'>IP/Mac黑名单</a>&nbsp;&nbsp;<font color='gray'>IP/Mac白名单</font> ";
    }else if(value==2){
        return "<font color='gray'>IP/Mac黑名单</font>&nbsp;&nbsp;<a href='javascript:;' style='color: green;' onclick='internal_allow_ipWhiteWindow();'>IP/Mac白名单</a>";
    }else if(value==3){
        return "<a href='javascript:;' style='color: green;' onclick='internal_allow_ipBlackWindow();'>IP/Mac黑名单</a>&nbsp;&nbsp;<a href='javascript:;' style='color: green;' onclick='internal_allow_ipWhiteWindow();'>IP/Mac白名单</a>";
    }
}

function internal_showURL_flag(value,p,r){
    var temp = "&nbsp;&nbsp;&nbsp;&nbsp;";
    var detail = "<a href='javascript:;' style='color: green;' onclick='internal_detail_proxy_win();'>详细</a>" + temp;

    var deleteType;
    if(r.get('deleteFlag')) {
        deleteType = "<font color='gray'>批准删除</font>" + temp;
    } else {
        deleteType = "<a href='javascript:;' style='color: green;' onclick='internal_delete_proxy_row();'>批准删除</a>" + temp;
    }
    var security = "<a href='javascript:;' style='color: green;' onclick='internal_update_proxy_security_win();'>安全属性设置</a>" + temp;
    var allow = "<a href='javascript:;' style='color: green;' onclick='type_allow();' >审核通过</a>" + temp;
    var notAllow = "<a href='javascript:;' style='color: green;' onclick='type_check();' >审核不通过</a>";
    return detail + deleteType + security + allow + notAllow;
}

function internal_allow_showURL_flag(value,p,r){
    var temp = "&nbsp;&nbsp;&nbsp;&nbsp;";
    var detail = "<a href='javascript:;' style='color: green;' onclick='internal_allow_detail_proxy_win();'>详细</a>" + temp;

    var deleteType;
    if(r.get('deleteFlag')) {
        deleteType = "<font color='gray'>批准删除</font>" + temp;
    } else {
        deleteType = "<a href='javascript:;' style='color: green;' onclick='internal_allow_delete_proxy_row();'>批准删除</a>" + temp;
    }
    var security = "<a href='javascript:;' style='color: green;' onclick='internal_allow_update_proxy_security_win();'>安全属性设置</a>" + temp;
    var status;
    if(r.get('isActive') == 'true'|| r.get('isActive') == true){
        status = "<a href='javascript:;' style='color: green;' onclick='internal_stop_proxy();' >停用</a>" ;
    } else if(r.get('isActive') == 'false'|| r.get('isActive') == false){
        status = "<a href='javascript:;' style='color: green;' onclick='internal_start_proxy();'>启用</a>" ;
    }
    return detail + deleteType + security + status ;
}


var dataIP = [['0','不过虑'],['1','黑名单'],['2','白名单'],['3','黑白名单']];
var storeIP = new Ext.data.SimpleStore({fields:['value','key'],data:dataIP});

var dataTransport = [['TCP','TCP'],['UDP','UDP'],['HTTP','HTTP'],['TCP+UDP','TCP+UDP'],['tcpmport','TCP多端口'],['udpmport','UDP多端口']];
var storeTransport = new Ext.data.SimpleStore({fields:['value','key'],data:dataTransport});

var dataCharset = [['GBK','GBK'],['GB2312','GB2312'],['GB18030','GB18030'],['UTF-8','UTF-8'],['UTF-16','UTF-16']];
var storeCharset = new Ext.data.SimpleStore({fields:['value','key'],data:dataCharset});