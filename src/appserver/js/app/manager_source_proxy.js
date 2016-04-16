/**
 * 源端--通用代理
 */
//==================================== -- 通用代理应用 extjs 页面 -- =============================================================
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
        {name:'isFilter',		    mapping:'isFilter'},
        {name:'isVirusScan',		mapping:'isVirusScan'},
        {name:'port',				mapping:'port'},
        {name:'poolMin',			mapping:'poolMin'},
        {name:'serverAddress',	mapping:'serverAddress'},
        {name:'tryTime',			mapping:'tryTime'},
        {name:'poolMax',			mapping:'poolMax'},
        {name:'charset',			mapping:'charset'},
        {name:'ipAddress',		mapping:'ipAddress'},
        {name:'type',				mapping:'type'},
        {name:'plugin',			mapping:'plugin'},
        {name:'deleteFlag',		mapping:'deleteFlag'},
        {name:'flag',				mapping:'flag'}
    ]);
    var external_proxy = new Ext.data.HttpProxy({
        url:"../../AppTypeAction_readExternalType.action?typeXml=external"
    });
    var external_reader = new Ext.data.JsonReader({
        totalProperty:"total",
        root:"rows"
    },external_record);
    var external_store = new Ext.data.GroupingStore({
        id:"store.grid.proxy.external.info",
        proxy : external_proxy,
        reader : external_reader
    });
    var external_boxM = new Ext.grid.CheckboxSelectionModel();   //复选框
    var external_rowNumber = new Ext.grid.RowNumberer();         //自动 编号
    var external_colM = new Ext.grid.ColumnModel([
//        external_boxM,
        external_rowNumber,
        {header:"应用编号",			dataIndex:"appName",		    align:'center'},
        {header:"应用名",			    dataIndex:"appDesc",			align:'center'},
        {header:'通道',			dataIndex:'channel',	        align:'center',sortable:true,menuDisabled:true,       renderer:showURL_channel},
        {header:'通道端口',			dataIndex:'channelport',		align:'center',          width:50},
        {header:'启用状态',			dataIndex:'isActive',		align:'center',renderer:showURL_isActive,width:50},
        {header:'应用类型',			dataIndex:'appType',			align:'center',          width:50},
        {header:'应用服务地址',		dataIndex:'serverAddress',	align:'center'},
        {header:'应用服务端口',		dataIndex:'port',				align:'center'},
        {header:'最小连接数',			dataIndex:'poolMin',			align:'center'},
        {header:'最大连接数',			dataIndex:'poolMax',			align:'center'},
        {header:'编码',				dataIndex:'charset',			align:'center'},
        {header:'重试次数',			dataIndex:'tryTime',			align:'center'},
        {header:'类型',				dataIndex:'type',				align:'center'},

        {header:'源、目标',			dataIndex:'plugin',			align:'center',renderer:showURL_plugin,       width:50},
        {header:'操作标记',			dataIndex:'flag',				align:'center',renderer:external_showURL_flag,         width:330}

    ]);
    for(var i=7;i<14;i++){
        external_colM.setHidden(i,!external_colM.isHidden(i));
    }
    external_colM.defaultSortable = true;
    var external_page_toolbar = new Ext.PagingToolbar({
        pageSize : external_pageSize,
        store:external_store,
        displayInfo:true,
        displayMsg:"显示第{0}条记录到第{1}条记录，一共{2}条",
        emptyMsg:"没有记录",
        beforePageText:"当前页",
        afterPageText:"共{0}页"
    });
    var external_grid_panel = new Ext.grid.GridPanel({
        id:'grid.proxy.external.info',
        title:'<center><font size="4">非可信端</font></center>',
        animCollapse:true,
        height:setHeight(),
        width:setWidth(),
        loadMask:{msg:'正在加载数据，请稍后...'},
        border:false,
        collapsible:false,
        cm:external_colM,
//        sm:external_boxM,
        store:external_store,
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
                id:'btnAdd.proxy.external.info',
                text:'新增',
                iconCls:'add',
                handler:function(){
                    external_insert_proxy_win(external_grid_panel,external_store);     //连接到 新增 面板
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
        items:[{autoScroll:true,items:[external_grid_panel]}]
    });
	external_store.load({
        params:{
            start:external_start,limit:external_pageSize,appType:'proxy'
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

/********************************************* -- internal function -- ******************************************************************************/
function showURL_isActive(value){
    if(value == 'true' || value==true){
    	return '<img src="../../img/icon/ok.png" alt="启动" title="运行中" />';
    }else if(value == 'false' || value == false){
    	return '<img src="../../img/icon/off.gif" alt="停止" title="未运行"/>';
    }
}
function showURL_channel(value){
    if(value==1||value=='1'){
        return "通道一";
    } else if(value==2||value=='2'){
        return "通道二";
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

/********************************************* -- external function -- ******************************************************************************/

function external_showURL_flag(value,p,r){
    var deleteType;
    if(r.get('deleteFlag')) {
        deleteType = "<a href='javascript:;' style='color: green;' onclick='external_delete_proxy_row();'>删除应用</a>";
    } else {
        deleteType = "<font color='gray'>等待删除</font>";
    }
    if(value=='flag_0'){
        return "<a href='javascript:;' style='color: green;' onclick='external_detail_proxy_win();'>详细</a>&nbsp;&nbsp;&nbsp;&nbsp;"+deleteType+"&nbsp;&nbsp;&nbsp;&nbsp;<a href='javascript:;' style='color: green;' onclick='external_update_proxy_app_win();'>修改应用</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href='javascript:;' style='color: green;' onclick='external_update_proxy_data_source_win();'>修改源数据</a>";
    }else if(value=='flag_1'){
        return "<a href='javascript:;' style='color: green;' onclick='external_detail_proxy_win();'>详细</a>&nbsp;&nbsp;&nbsp;&nbsp;"+deleteType+"&nbsp;&nbsp;&nbsp;&nbsp;<a href='javascript:;' style='color: green;' onclick='external_update_proxy_app_win();'>修改应用</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href='javascript:;' style='color: green;' onclick='external_update_proxy_data_source_win();'>修改源数据</a>";
    }else if(value=='flag_2'){
        return "<a href='javascript:;' style='color: green;' onclick='external_detail_proxy_win();'>详细</a>&nbsp;&nbsp;&nbsp;&nbsp;"+deleteType+"&nbsp;&nbsp;&nbsp;&nbsp;<a href='javascript:;' style='color: green;' onclick='external_update_proxy_app_win();'>修改应用</a>&nbsp;&nbsp;&nbsp;&nbsp;<font color='gray'>修改源数据</font>";
    }else if(value=='flag_3'){
        return "<a href='javascript:;' style='color: green;' onclick='external_detail_proxy_win();'>详细</a>&nbsp;&nbsp;&nbsp;&nbsp;"+deleteType+"&nbsp;&nbsp;&nbsp;&nbsp;<a href='javascript:;' style='color: green;' onclick='external_update_proxy_app_win();'>修改应用</a>&nbsp;&nbsp;&nbsp;&nbsp;<font color='gray'>修改源数据</font>";
    }
}

var dataIP = [['0','不过虑'],['1','黑名单'],['2','白名单'],['3','黑白名单']];
var storeIP = new Ext.data.SimpleStore({fields:['value','key'],data:dataIP});

var dataTransport = [['TCP','TCP'],['UDP','UDP'],['HTTP','HTTP'],['TCP+UDP','TCP+UDP'],['tcpmport','TCP多端口'],['udpmport','UDP多端口']];
var storeTransport = new Ext.data.SimpleStore({fields:['value','key'],data:dataTransport});

var dataCharset = [['GBK','GBK'],['GB2312','GB2312'],['GB18030','GB18030'],['UTF-8','UTF-8'],['UTF-16','UTF-16']];
var storeCharset = new Ext.data.SimpleStore({fields:['value','key'],data:dataCharset});
