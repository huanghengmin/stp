/**
 * 源端--文件同步 -- 审核
 */
Ext.onReady(function(){
    Ext.BLANK_IMAGE_URL = '../../js/ext/resources/images/default/s.gif';
    Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget = 'side';
    var start = 0;			//分页--开始数
    var pageSize = 15;		//分页--每页数

    var external_record = new Ext.data.Record.create([
	    {name:'appName',			mapping:'appName'},
	    {name:'appDesc',			mapping:'appDesc'},
	    {name:'appType',			mapping:'appType'},
        {name:'channel',			mapping:'channel'},
        {name:'channelport',	    mapping:'channelport'},
        {name:'isActive',			mapping:'isActive'},
        {name:'isAllow',			mapping:'isAllow'},
        {name:'infoLevel',		mapping:'infoLevel'},
        {name:'isFilter',		    mapping:'isFilter'},
	    {name:'isVirusScan',		mapping:'isVirusScan'},
	    {name:'deleteFile',		mapping:'deleteFile'},
	    {name:'serverAddress',	mapping:'serverAddress'},
	    {name:'port',				mapping:'port'},
	    {name:'userName',			mapping:'userName'},
	    {name:'charset',			mapping:'charset'},
	    {name:'dir',			    mapping:'dir'},
	    {name:'protocol',			mapping:'protocol'},
	    {name:'filterTypes',	    mapping:'filterTypes'},
	    {name:'notFilterTypes',	mapping:'notFilterTypes'},
	    {name:'interval',			mapping:'interval'},
	    {name:'isTwoWay',			mapping:'isTwoWay'},
	    {name:'isIncludeSubDir',	mapping:'isIncludeSubDir'},
	    {name:'fileListSize',	mapping:'fileListSize'},
	    {name:'threads',			mapping:'threads'},
	    {name:'packetSize',		mapping:'packetSize'},
	    {name:'plugin',			mapping:'plugin'},
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
        {name:'infoLevel',		mapping:'infoLevel'},
        {name:'isFilter',		    mapping:'isFilter'},
	    {name:'isVirusScan',		mapping:'isVirusScan'},
	    {name:'deleteFile',		mapping:'deleteFile'},
	    {name:'serverAddress',	mapping:'serverAddress'},
	    {name:'port',				mapping:'port'},
	    {name:'userName',			mapping:'userName'},
	    {name:'charset',			mapping:'charset'},
	    {name:'dir',			    mapping:'dir'},
	    {name:'protocol',			mapping:'protocol'},
	    {name:'filterTypes',	    mapping:'filterTypes'},
	    {name:'notFilterTypes',	mapping:'notFilterTypes'},
	    {name:'interval',			mapping:'interval'},
	    {name:'isTwoWay',			mapping:'isTwoWay'},
	    {name:'isIncludeSubDir',	mapping:'isIncludeSubDir'},
	    {name:'fileListSize',	mapping:'fileListSize'},
	    {name:'threads',			mapping:'threads'},
	    {name:'packetSize',		mapping:'packetSize'},
	    {name:'plugin',			mapping:'plugin'},
        {name:'deleteFlag',		mapping:'deleteFlag'},
        {name:'status',			mapping:'status'},
        {name:'speed',		mapping:'speed'},
	    {name:'flag',				mapping:'flag'}
    ]);

    var external_store = new Ext.data.GroupingStore({
        proxy : new Ext.data.HttpProxy({ url:'../../AppTypeAction_readExternalNotAllowType.action?typeXml=external' }),
        reader : new Ext.data.JsonReader({ totalProperty:'total', root:'rows' },external_record)
    });
    var external_allow_store = new Ext.data.GroupingStore({
        proxy : new Ext.data.HttpProxy({ url:'../../AppTypeAction_readExternalAllowType.action?typeXml=external' }),
        reader : new Ext.data.JsonReader({ totalProperty:'total', root:'rows' },external_allow_record)
    });


    var external_boxM = new Ext.grid.CheckboxSelectionModel();   //复选框
    var external_allow_boxM = new Ext.grid.CheckboxSelectionModel();   //复选框
    var external_rowNumber = new Ext.grid.RowNumberer();         //自动 编号
    var external_allow_rowNumber = new Ext.grid.RowNumberer();         //自动 编号
    var external_colM = new Ext.grid.ColumnModel([
//        external_boxM,
        external_rowNumber,
        {header:"应用编号",		dataIndex:"appName",			align:'center',menuDisabled:true},
        {header:"应用名",			dataIndex:"appDesc",			align:'center',menuDisabled:true},
        {header:"传输速度",			    dataIndex:"speed",     align:'center',sortable:true,renderer:showURL_speed},
        {header:'通道',		dataIndex:'channel',	        align:'center',sortable:true,menuDisabled:true,       renderer:showURL_channel},
        {header:'通道端口',		dataIndex:'channelport',		align:'center',          width:50},
        {header:'审批通过',	dataIndex:'isAllow',		    align:'center',menuDisabled:true,renderer:show_isAllow,width:50},
        {header:'信息等级',	    dataIndex:'infoLevel',		align:'center',menuDisabled:true,renderer:show_InfoLevel,width:50},
        {header:'启用内容过滤',	dataIndex:'isFilter',		align:'center',renderer:show_is},
        {header:'启用病毒扫描',	dataIndex:'isVirusScan',		align:'center',renderer:show_is},
        {header:'通信协议',		dataIndex:'protocol',        align:'center',renderer:show_protocol,width:80},
        {header:'应用类型',		dataIndex:'appType',			align:'center',width:50},
        {header:'文件服务器地址',		dataIndex:'serverAddress',	align:'center'},
        {header:'文件服务器端口',		dataIndex:'port',				align:'center'},
        {header:'登录名',		dataIndex:'userName',		align:'center'},
        {header:'编码',		dataIndex:'charset',			align:'center'},
        {header:'根目录',		dataIndex:'dir',             	align:'center'},
        {header:'频率',			dataIndex:'interval',		align:'center'},
        {header:'包含子目录',	dataIndex:'isIncludeSubDir',align:'center',renderer:show_is},
        {header:'删除文件',	dataIndex:'deleteFile',		align:'center',renderer:show_is},
        {header:'过滤类型',	dataIndex:'filterTypes',     align:'center'},
        {header:'非过滤类型',	dataIndex:'notFilterTypes', align:'center'},

        {header:'源、目标',			dataIndex:'plugin',		align:'center',renderer:showURL_plugin},
        {header:'操作标记',			dataIndex:'flag',			align:'center',menuDisabled:true,renderer:external_showURL_flag,        width:200}
    ]);
    var external_allow_colM = new Ext.grid.ColumnModel([
//        external_allow_boxM,
        external_allow_rowNumber,
        {header:"应用编号",		dataIndex:"appName",			align:'center',menuDisabled:true},
        {header:"应用名",			dataIndex:"appDesc",			align:'center',menuDisabled:true},
        {header:"传输速度",			    dataIndex:"speed",     align:'center',sortable:true,renderer:showURL_speed},
        {header:'通道',		dataIndex:'channel',	        align:'center',sortable:true,menuDisabled:true,       renderer:showURL_channel},
        {header:'通道端口',		dataIndex:'channelport',		align:'center',          width:50},
        {header:'启用状态',	    dataIndex:'isActive',		align:'center',menuDisabled:true,renderer:show_isActive,width:50},
        {header:'信息等级',	    dataIndex:'infoLevel',		align:'center',menuDisabled:true,renderer:show_InfoLevel,width:50},
        {header:'启用内容过滤',	dataIndex:'isFilter',		align:'center',renderer:show_is},
        {header:'启用病毒扫描',	dataIndex:'isVirusScan',		align:'center',renderer:show_is},
        {header:'通信协议',		dataIndex:'protocol',        align:'center',renderer:show_protocol,width:80},
        {header:'应用类型',		dataIndex:'appType',			align:'center',width:50},
        {header:'文件服务器地址',		dataIndex:'serverAddress',	align:'center'},
        {header:'文件服务器端口',		dataIndex:'port',				align:'center'},
        {header:'登录名',		dataIndex:'userName',		align:'center'},
        {header:'密码',		dataIndex:'password',		align:'center'},
        {header:'编码',		dataIndex:'charset',			align:'center'},
        {header:'根目录',		dataIndex:'dir',             	align:'center'},
        {header:'频率',			dataIndex:'interval',		align:'center'},
        {header:'包含子目录',	dataIndex:'isIncludeSubDir',align:'center',renderer:show_is},
        {header:'删除文件',	dataIndex:'deleteFile',		align:'center',renderer:show_is},
        {header:'过滤类型',	dataIndex:'filterTypes',     align:'center'},
        {header:'非过滤类型',	dataIndex:'notFilterTypes', align:'center'},
        {header:'发送状态',			dataIndex:'status',		align:'center',renderer:showURL_status},
        {header:'源、目标',			dataIndex:'plugin',		align:'center',renderer:showURL_plugin},
        {header:'操作标记',			dataIndex:'flag',			align:'center',menuDisabled:true,renderer:external_allow_showURL_flag,        width:200}
    ]);
    for(var i=8;i<21;i++){
        external_colM.setHidden(i,!external_colM.isHidden(i));
        external_allow_colM.setHidden(i,!external_allow_colM.isHidden(i));
    }
    external_colM.defaultSortable = true;
    external_allow_colM.defaultSortable = true;

    var external_grid_panel= new Ext.grid.GridPanel({
        id:'grid.file.external.info',
        title:'<center><font size="4">非可信端--审批</font></center>',
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
        bbar:new Ext.PagingToolbar({
            pageSize : pageSize,
            store:external_store,
            displayInfo:true,
            displayMsg:"显示第{0}条记录到第{1}条记录，一共{2}条",
            emptyMsg:"没有记录",
            beforePageText:"当前页",
            afterPageText:"共{0}页"
        })
    });

    var external_allow_grid_panel= new Ext.grid.GridPanel({
        id:'grid.file.external.allow.info',
        title:'<center><font size="4">非可信端--启停、发送</font></center>',
        animCollapse:true,
        height:setHeight(),
        width:setWidth(),
        loadMask:{msg:'正在加载数据，请稍后...'},
        border:false,
        collapsible:false,
        cm:external_allow_colM,
//        sm:external_allow_boxM,
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
                id:'send.file.external.info',
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
                                            animEl:'send.file.external.info',
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
        bbar:new Ext.PagingToolbar({
            pageSize : pageSize,
            store:external_allow_store,
            displayInfo:true,
            displayMsg:"显示第{0}条记录到第{1}条记录，一共{2}条",
            emptyMsg:"没有记录",
            beforePageText:"当前页",
            afterPageText:"共{0}页"
        })
    });
    var port = new Ext.Viewport({
        layout:'fit',
        renderTo:Ext.getBody(),
        items:[{
            autoScroll:true,
            items:[external_grid_panel,external_allow_grid_panel]
        }]
    });
    external_store.load({params:{ start:start,limit:pageSize,appType:'file' } });
    external_allow_store.load({params:{ start:start,limit:pageSize,appType:'file' } });
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

function show_isActive(value){
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

function show_is(value){
    if(value=='true'||value == true){
        return '是';
    }else if(value == 'false' || value == false){
        return '否';
    }else if(value == '' || value == null){
    	return '否';
    }
}
function show_protocol(value){
	if(value == 'ftp'){
		return 'FTP文件传输协议';
	}else if(value == 'ftpdown'){
		return 'FTPS文件传输协议(备份)';
	}else if(value == 'ftps'){
		return 'FTPS文件传输协议';
	}else if(value=='smb'){
		return '共享文件传输协议(SMB)';
	}else if(value=='WebDAV'){
		return 'WebDAV文件传输协议';
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

function showURL_status(value){
    if(value==0||value=='0'){
        return "<font color='green'>已发送</font> ";
    } else if (value==-1||value=='-1') {
        return "<font color='red'>已修改,需重新发送</font>"
    } else if (value==1||value=='1') {
        return "<font color='red'>未发送</font>"
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

/********************************************* -- external function -- ******************************************************************************/

function external_showURL_flag(value,p,r) {
    var temp = "&nbsp;&nbsp;&nbsp;&nbsp;";
    var detail = "<a href='javascript:;' style='color: green;' onclick='external_detail_file_win();'>详细</a>" + temp;
    var deleteType;
    if (r.get('deleteFlag')) {
        deleteType = "<font color='gray'>批准删除</font>" + temp;
    } else {
        deleteType = "<a href='javascript:;' style='color: green;' onclick='external_delete_file_row();'>批准删除</a>" + temp;
    }
    var security = "<a href='javascript:;' style='color: green;' onclick='external_update_file_security_win();'>安全属性设置</a>" + temp;
    var allow = "<a href='javascript:;' style='color: green;' onclick='type_allow();' >审核通过</a>" + temp;
    var notAllow = "<a href='javascript:;' style='color: green;' onclick='type_check();' >审核不通过</a>";
    return detail + deleteType + security + allow + notAllow;
}

function external_allow_showURL_flag(value,p,r) {
    var temp = "&nbsp;&nbsp;&nbsp;&nbsp;";
    var detail = "<a href='javascript:;' style='color: green;' onclick='external_allow_detail_file_win();'>详细</a>" + temp;
    var deleteType;
    if (r.get('deleteFlag')) {
        deleteType = "<font color='gray'>批准删除</font>" + temp;
    } else {
        deleteType = "<a href='javascript:;' style='color: green;' onclick='external_allow_delete_file_row();'>批准删除</a>" + temp;
    }
    var security = "<a href='javascript:;' style='color: green;' onclick='external_allow_update_file_security_win();'>安全属性设置</a>" + temp;
    var status;
    if(r.get('isActive') == 'true'|| r.get('isActive') == true){
        status = "<a href='javascript:;' style='color: green;' onclick='external_stop_file();' >停用</a>";
    } else if(r.get('isActive') == 'false'|| r.get('isActive') == false){
        status = "<a href='javascript:;' style='color: green;' onclick='external_start_file();'>启用</a>";
    }
    return detail + deleteType + security + status;
}

var dataProtocol = [['ftp','FTP文件传输协议'],['smb','共享文件传输协议(SMB)'],['ftps','FTPS文件传输协议'],['WebDAV','WebDAV文件传输协议']];
var dataCharset = [['GBK','GBK'],['GB2312','GB2312'],['GB18030','GB18030'],['UTF-8','UTF-8'],['UTF-16','UTF-16']];
var dataFilterTypes = [['*.dat','*.dat'],['*.doc','*.doc'],['*.exe','*.exe'],['*.pdf','*.pdf'],['*.ppt','*.ppt'],['*.rar','*.rar'],['*.txt','*.txt'],['*.xml','*.xml'],['*.xls','*.xls'],['*.*','*.*']];
var targetAppName_record = new Ext.data.Record.create([{name:'value',mapping:'value'},{name:'key',mapping:'key'}]);
var targetAppName_reader = new Ext.data.JsonReader({ totalProperty:'total',root:"rows"},targetAppName_record);
var storeCharset = new Ext.data.SimpleStore({fields:['value','key'],data:dataCharset});
var storeProtocol = new Ext.data.SimpleStore({fields:['value','key'],data:dataProtocol});
var storeFilterTypes = new Ext.data.SimpleStore({fields:['value','key'],data:dataFilterTypes});
var storeNotFilterTypes = new Ext.data.SimpleStore({fields:['value','key'],data:dataFilterTypes});
//===============================================================external===============================================

/**
 * 删除文件同步应用
 * */
function external_delete_file_row(){
    var grid = Ext.getCmp('grid.file.external.info');
    var store = grid.getStore();
    var selModel = grid.getSelectionModel();
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
            var appName = item.data.appName;
            Ext.MessageBox.show({
                title:'信息',
                msg:'<font color="green">确定要删除'+appName+'应用？</font>',
                animEl:'btnRemove.file.external.info',
                width:300,
                buttons:{'ok':'确定','no':'取消'},
                icon:Ext.MessageBox.WARNING,
                closable:false,
                fn:function(e){
                    if(e == 'ok'){
                        var myMask = new Ext.LoadMask(Ext.getBody(),{
                            msg:'正在处理,请稍后...',
                            removeMask:true
                        });
                        myMask.show();
                        Ext.Ajax.request({
                            url : '../../AuthAction_delete.action',
                            params :{appName : appName,plugin : 'external'},
                            success : function(r,o){
                                myMask.hide();
                                var respText = Ext.util.JSON.decode(r.responseText);
                                var msg = respText.msg;
                                Ext.MessageBox.show({
                                    title:'信息',
                                    msg:msg,
                                    animEl:'btnRemove.file.external.info',
                                    buttons:{'ok':'确定'},
                                    icon:Ext.MessageBox.INFO,
                                    closable:false,
                                    fn:function(e){
                                        if(e=='ok'){
                                            grid.render();
                                            store.reload();
                                        }
                                    }
                                });
                            }
                        });
                    }
                }
            });
        });
    }
}
function external_allow_delete_file_row(){
    var grid = Ext.getCmp('grid.file.external.allow.info');
    var store = grid.getStore();
    var selModel = grid.getSelectionModel();
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
            var appName = item.data.appName;
            Ext.MessageBox.show({
                title:'信息',
                msg:'<font color="green">确定要删除'+appName+'应用？</font>',
                animEl:'btnRemove.file.external.info',
                width:300,
                buttons:{'ok':'确定','no':'取消'},
                icon:Ext.MessageBox.WARNING,
                closable:false,
                fn:function(e){
                    if(e == 'ok'){
                        var myMask = new Ext.LoadMask(Ext.getBody(),{
                            msg:'正在处理,请稍后...',
                            removeMask:true
                        });
                        myMask.show();
                        Ext.Ajax.request({
                            url : '../../AuthAction_delete.action',
                            params :{appName : appName,plugin : 'external'},
                            success : function(r,o){
                                myMask.hide();
                                var respText = Ext.util.JSON.decode(r.responseText);
                                var msg = respText.msg;
                                Ext.MessageBox.show({
                                    title:'信息',
                                    msg:msg,
                                    animEl:'btnRemove.file.external.info',
                                    buttons:{'ok':'确定'},
                                    icon:Ext.MessageBox.INFO,
                                    closable:false,
                                    fn:function(e){
                                        if(e=='ok'){
                                            grid.render();
                                            store.reload();
                                        }
                                    }
                                });
                            }
                        });
                    }
                }
            });
        });
    }
}

/**
 * 安全属性设置
 */
function external_update_file_security_win(){
    var infoLevelRecord = new Ext.data.Record.create([
    {name:'value',mapping:'value'},
    {name:'key',mapping:'key'}
    ]);
    var infoLevelReader = new Ext.data.JsonReader({ totalProperty:'total',root:"rows"},infoLevelRecord);
    var storeInfoLevel = new Ext.data.Store({
        url:'../../ManagerSecurityLevelAction_readLevelKeyValue.action',
        reader:infoLevelReader,
        listeners : {
			load : function(){
				var infoLevel = Ext.getCmp('infoLevel.info').getValue();
                Ext.getCmp('infoLevel.info').setValue(infoLevel);
			}
		}
    });
    storeInfoLevel.load();

    var grid = Ext.getCmp('grid.file.external.info');
    var store = grid.getStore();
    var selModel = grid.getSelectionModel();
    var formPanel;
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
            var isFilter = item.data.isFilter;
            var isFilterT;
            var isFilterF;
            if(isFilter=='true'||isFilter==true){
            	isFilterT = true;
            	isFilterF = false;
            }else if(isFilter=='false'||isFilter == false){
            	isFilterT = false;
            	isFilterF = true;
            }
            var isVirusScan = item.data.isVirusScan;
            var isVirusScanT;
            var isVirusScanF;
            if(isVirusScan=='true'||isVirusScan==true){
            	isVirusScanT = true;
            	isVirusScanF = false;
            }else if(isVirusScan=='false'||isVirusScan == false){
            	isVirusScanT = false;
            	isVirusScanF = true;
            }
            formPanel = new Ext.form.FormPanel({
                labelWidth:150,
                frame:true,
                defaults : {
                    width : 200,
                    allowBlank:false,
                    blankText:'该项不能为空'
                },
                fileUpload :true,
                labelAlign:'right',
                items : [{
                    width:370,
                    title:'安全属性 -- 使用说明',
                    xtype:'fieldset',
                    html:"<font color='green'>1.所有项都为必填项；"
                },{
                    xtype:'hidden',name:'typeBase.appName',value:item.data.appName
                },{
                    xtype:'hidden',name:'typeBase.privated',value:false
                },{
                    xtype:'hidden',name:'typeBase.appType',value:'file'
                },{
                    xtype:'hidden',name:'typeBase.plugin',value:item.data.plugin
                },{
                    fieldLabel:"启用内容过滤",
                    layout:'column',
                    defaultType: 'radio',
                    items: [
                        { columnWidth:.5, boxLabel: '是', name: 'typeBase.isFilter', inputValue: true,  checked: isFilterT },
                        { columnWidth:.5, boxLabel: '否', name: 'typeBase.isFilter', inputValue: false,  checked: isFilterF }
                    ]
                },{
                    fieldLabel:"启用病毒扫描",
                    layout:'column',
                    defaultType: 'radio',
                    items: [
                        { columnWidth:.5, boxLabel: '是', name: 'typeBase.isVirusScan', inputValue: true,  checked: isVirusScanT },
                        { columnWidth:.5, boxLabel: '否', name: 'typeBase.isVirusScan', inputValue: false,  checked: isVirusScanF }
                    ]
                },{
                    id:'infoLevel.info',
                    fieldLabel:'保密等级',
                    xtype:'combo',
                    width:140,
                    hiddenName:'typeBase.infoLevel',value:item.data.infoLevel,
                    mode:'local',
                    emptyText :'--请选择--',
                    editable : false,
                    typeAhead:true,
                    forceSelection: true,
                    triggerAction:'all',
                    displayField:"key",valueField:"value",
                    store: storeInfoLevel
                }]
            });
        });
    }
    var win = new Ext.Window({
        title:"信息-文件同步安全属性设置",
        width:400,
        height:300,
        layout:'fit',
        modal:true,
        items: [formPanel],
        bbar:[
            new Ext.Toolbar.Fill(),
            new Ext.Button ({
                id:'external.SafeS.update.info',
                text : '设置',
                formBind:true,
                allowDepress : false,
                handler : function() {
                    if (formPanel.form.isValid()) {
                        Ext.MessageBox.show({
                            title:'信息',
                            width:250,
                            msg:'确定要重新设置?',
                            animEl:'external.SafeS.update.info',
                            buttons:{'ok':'确定','no':'取消'},
                            icon:Ext.MessageBox.WARNING,
                            closable:false,
                            fn:function(e){
                                if(e=='ok'){
                                    formPanel.getForm().submit({
                                        url :'../../AuthAction_updateFile.action',
                                        method :'POST',
                                        waitTitle :'系统提示',
                                        waitMsg :'正在设置,请稍后...',
                                        success : function(form,action) {
                                            Ext.MessageBox.show({
                                                title:'信息',
                                                width:250,
                                                msg:action.result.msg,
                                                animEl:'external.SafeS.update.info',
                                                buttons:{'ok':'确定','no':'取消'},
                                                icon:Ext.MessageBox.INFO,
                                                closable:false,
                                                fn:function(e){
                                                    if(e=='ok'){
                                                        grid.render();
                                                        store.reload();
                                                        win.close();
                                                    }
                                                }
                                            });
                                        }
                                    });
                                }
                            }
                        });
                    } else {
                        Ext.MessageBox.show({
                            title:'信息',
                            width:250,
                            msg:'请填写完成再提交!',
                            animEl:'external.SafeS.update.info',
                            buttons:{'ok':'确定'},
                            icon:Ext.MessageBox.ERROR,
                            closable:false
                        });
                    }
                }
            }),
            new Ext.Button ({
                allowDepress : false,
                handler : function() {win.close();},
                text : '关闭'
            })
        ]
    }).show();
}
function external_allow_update_file_security_win(){
    var infoLevelRecord = new Ext.data.Record.create([
    {name:'value',mapping:'value'},
    {name:'key',mapping:'key'}
    ]);
    var infoLevelReader = new Ext.data.JsonReader({ totalProperty:'total',root:"rows"},infoLevelRecord);
    var storeInfoLevel = new Ext.data.Store({
        url:'../../ManagerSecurityLevelAction_readLevelKeyValue.action',
        reader:infoLevelReader,
        listeners : {
			load : function(){
				var infoLevel = Ext.getCmp('infoLevel.info').getValue();
                Ext.getCmp('infoLevel.info').setValue(infoLevel);
			}
		}
    });
    storeInfoLevel.load();

    var grid = Ext.getCmp('grid.file.external.allow.info');
    var store = grid.getStore();
    var selModel = grid.getSelectionModel();
    var formPanel;
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
            var isFilter = item.data.isFilter;
            var isFilterT;
            var isFilterF;
            if(isFilter=='true'||isFilter==true){
            	isFilterT = true;
            	isFilterF = false;
            }else if(isFilter=='false'||isFilter == false){
            	isFilterT = false;
            	isFilterF = true;
            }
            var isVirusScan = item.data.isVirusScan;
            var isVirusScanT;
            var isVirusScanF;
            if(isVirusScan=='true'||isVirusScan==true){
            	isVirusScanT = true;
            	isVirusScanF = false;
            }else if(isVirusScan=='false'||isVirusScan == false){
            	isVirusScanT = false;
            	isVirusScanF = true;
            }
            formPanel = new Ext.form.FormPanel({
                labelWidth:150,
                frame:true,
                defaults : {
                    width : 200,
                    allowBlank:false,
                    blankText:'该项不能为空'
                },
                fileUpload :true,
                labelAlign:'right',
                items : [{
                    width:370,
                    title:'安全属性 -- 使用说明',
                    xtype:'fieldset',
                    html:"<font color='green'>1.所有项都为必填项；"
                },{
                    xtype:'hidden',name:'typeBase.appName',value:item.data.appName
                },{
                    xtype:'hidden',name:'typeBase.privated',value:false
                },{
                    xtype:'hidden',name:'typeBase.appType',value:'file'
                },{
                    xtype:'hidden',name:'typeBase.plugin',value:item.data.plugin
                },{
                    fieldLabel:"启用内容过滤",
                    layout:'column',
                    defaultType: 'radio',
                    items: [
                        { columnWidth:.5, boxLabel: '是', name: 'typeBase.isFilter', inputValue: true,  checked: isFilterT },
                        { columnWidth:.5, boxLabel: '否', name: 'typeBase.isFilter', inputValue: false,  checked: isFilterF }
                    ]
                },{
                    fieldLabel:"启用病毒扫描",
                    layout:'column',
                    defaultType: 'radio',
                    items: [
                        { columnWidth:.5, boxLabel: '是', name: 'typeBase.isVirusScan', inputValue: true,  checked: isVirusScanT },
                        { columnWidth:.5, boxLabel: '否', name: 'typeBase.isVirusScan', inputValue: false,  checked: isVirusScanF }
                    ]
                },{
                    id:'infoLevel.info',
                    fieldLabel:'保密等级',
                    xtype:'combo',
                    width:140,
                    hiddenName:'typeBase.infoLevel',value:item.data.infoLevel,
                    mode:'local',
                    emptyText :'--请选择--',
                    editable : false,
                    typeAhead:true,
                    forceSelection: true,
                    triggerAction:'all',
                    displayField:"key",valueField:"value",
                    store: storeInfoLevel
                }]
            });
        });
    }
    var win = new Ext.Window({
        title:"信息-文件同步安全属性设置",
        width:400,
        height:300,
        layout:'fit',
        modal:true,
        items: [formPanel],
        bbar:[
            new Ext.Toolbar.Fill(),
            new Ext.Button ({
                id:'external.SafeS.update.info',
                text : '设置',
                formBind:true,
                allowDepress : false,
                handler : function() {
                    if (formPanel.form.isValid()) {
                        Ext.MessageBox.show({
                            title:'信息',
                            width:250,
                            msg:'确定要重新设置?',
                            animEl:'external.SafeS.update.info',
                            buttons:{'ok':'确定','no':'取消'},
                            icon:Ext.MessageBox.WARNING,
                            closable:false,
                            fn:function(e){
                                if(e=='ok'){
                                    formPanel.getForm().submit({
                                        url :'../../AuthAction_updateFile.action',
                                        method :'POST',
                                        waitTitle :'系统提示',
                                        waitMsg :'正在设置,请稍后...',
                                        success : function(form,action) {
                                            Ext.MessageBox.show({
                                                title:'信息',
                                                width:250,
                                                msg:action.result.msg,
                                                animEl:'external.SafeS.update.info',
                                                buttons:{'ok':'确定','no':'取消'},
                                                icon:Ext.MessageBox.INFO,
                                                closable:false,
                                                fn:function(e){
                                                    if(e=='ok'){
                                                        grid.render();
                                                        store.reload();
                                                        Ext.getCmp('grid.file.external.info').render();
                                                        Ext.getCmp('grid.file.external.info').getStore().reload();
                                                        win.close();
                                                    }
                                                }
                                            });
                                        }
                                    });
                                }
                            }
                        });
                    } else {
                        Ext.MessageBox.show({
                            title:'信息',
                            width:250,
                            msg:'请填写完成再提交!',
                            animEl:'external.SafeS.update.info',
                            buttons:{'ok':'确定'},
                            icon:Ext.MessageBox.ERROR,
                            closable:false
                        });
                    }
                }
            }),
            new Ext.Button ({
                allowDepress : false,
                handler : function() {win.close();},
                text : '关闭'
            })
        ]
    }).show();
}

/**
 * 查看文件同步应用
 */
function external_detail_file_win(){
    var grid = Ext.getCmp('grid.file.external.info');
    var selModel = grid.getSelectionModel();
    var formPanel;
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
            formPanel = new Ext.form.FormPanel({
                labelWidth:150,
                frame:true,
                autoScroll:true,
                labelAlign:'right',
                defaultType:'displayfield',
                defaults : {
					width : 200,
					allowBlank : false,
					blankText : '该项不能为空！'
				},
                items:[{fieldLabel:"应用编号",value:item.data.appName},
                    {fieldLabel:"应用名",value:item.data.appDesc},
                    {fieldLabel:"应用源类型",value:'数据源'},
                    {fieldLabel:'应用类型',value:'文件同步'},
                    {fieldLabel:'传输速度',value:showURL_speed(item.data.speed)},
                    {fieldLabel:'通道',value:showURL_channel(item.data.channel)},
                    {fieldLabel:'通道端口',value:item.data.channelport},
                    {fieldLabel:'启用状态',value:show_isActive(item.data.isActive)},
                    {fieldLabel:'审核通过',value:show_isAllow(item.data.isAllow)},
                    {fieldLabel:'信息等级',value:show_InfoLevel(item.data.infoLevel)},
                    {fieldLabel:'启用内容过滤',value:show_is(item.data.isFilter)},
                    {fieldLabel:'启用病毒扫描',value:show_is(item.data.isVirusScan)},
                    {fieldLabel:'通信协议',value:show_protocol(item.data.protocol)},
                    {fieldLabel:'文件服务器地址',value:item.data.serverAddress},
                    {fieldLabel:'文件服务器端口',value:item.data.port},
                    {fieldLabel:'登录名',value:item.data.userName},
                    {fieldLabel:'文件编码',value:item.data.charset},
                    {fieldLabel:'根目录',value:item.data.dir},
                    {fieldLabel:'频率(毫秒)',value:item.data.interval},
                    {fieldLabel:'删除文件',value:show_is(item.data.deleteFile)},
                    {fieldLabel:'包含子目录',value:show_is(item.data.isIncludeSubDir)},
                    {fieldLabel:'过滤类型',value:item.data.filterTypes},
                    {fieldLabel:'非过滤类型',value:item.data.notFilterTypes}
                ]
            });
        });
    }
    var win = new Ext.Window({
        title:"详细信息-非可信文件同步",
        width:400,
        height:300,
        layout:'fit',
        modal:true,
        items: [formPanel],
        bbar:[
            new Ext.Toolbar.Fill(),
            new Ext.Button ({
                text : '保存',
                allowDepress : false,
                handler : function() {win.close();}
            }),
            new Ext.Button ({
                allowDepress : false,
                text : '关闭',
                handler : function() {win.close();}
            })
        ]
    }).show();
}
function external_allow_detail_file_win(){
    var grid = Ext.getCmp('grid.file.external.allow.info');
    var selModel = grid.getSelectionModel();
    var formPanel;
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
            formPanel = new Ext.form.FormPanel({
                labelWidth:150,
                frame:true,
                autoScroll:true,
                labelAlign:'right',
                defaultType:'displayfield',
                defaults : {
					width : 200,
					allowBlank : false,
					blankText : '该项不能为空！'
				},
                items:[{fieldLabel:"应用编号",value:item.data.appName},
                    {fieldLabel:"应用名",value:item.data.appDesc},
                    {fieldLabel:"应用源类型",value:'数据源'},
                    {fieldLabel:'应用类型',value:'文件同步'},
                    {fieldLabel:'传输速度',value:showURL_speed(item.data.speed)},
                    {fieldLabel:'通道',value:showURL_channel(item.data.channel)},
                    {fieldLabel:'通道端口',value:item.data.channelport},
                    {fieldLabel:'启用状态',value:show_isActive(item.data.isActive)},
                    {fieldLabel:'审核通过',value:show_isAllow(item.data.isAllow)},
                    {fieldLabel:'信息等级',value:show_InfoLevel(item.data.infoLevel)},
                    {fieldLabel:'启用内容过滤',value:show_is(item.data.isFilter)},
                    {fieldLabel:'启用病毒扫描',value:show_is(item.data.isVirusScan)},
                    {fieldLabel:'通信协议',value:show_protocol(item.data.protocol)},
                    {fieldLabel:'文件服务器地址',value:item.data.serverAddress},
                    {fieldLabel:'文件服务器端口',value:item.data.port},
                    {fieldLabel:'登录名',value:item.data.userName},
                    {fieldLabel:'文件编码',value:item.data.charset},
                    {fieldLabel:'根目录',value:item.data.dir},
                    {fieldLabel:'频率(毫秒)',value:item.data.interval},
                    {fieldLabel:'删除文件',value:show_is(item.data.deleteFile)},
                    {fieldLabel:'包含子目录',value:show_is(item.data.isIncludeSubDir)},
                    {fieldLabel:'过滤类型',value:item.data.filterTypes},
                    {fieldLabel:'非过滤类型',value:item.data.notFilterTypes}
                ]
            });
        });
    }
    var win = new Ext.Window({
        title:"详细信息-非可信文件同步",
        width:400,
        height:300,
        layout:'fit',
        modal:true,
        items: [formPanel],
        bbar:[
            new Ext.Toolbar.Fill(),
            new Ext.Button ({
                text : '保存',
                allowDepress : false,
                handler : function() {win.close();}
            }),
            new Ext.Button ({
                allowDepress : false,
                text : '关闭',
                handler : function() {win.close();}
            })
        ]
    }).show();
}

/**
 * 启用应用
 */
function external_start_file(){
    var grid = Ext.getCmp('grid.file.external.allow.info');
    var store = grid.getStore();
    var selModel = grid.getSelectionModel();
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
            var appName = item.data.appName;
            Ext.MessageBox.show({
                title:'信息',
                msg:'<font color="green">确定要启动'+appName+'应用？</font>',
                width:300,
                buttons:{'ok':'确定','no':'取消'},
                icon:Ext.MessageBox.WARNING,
                closable:false,
                fn:function(e){
                    if(e == 'ok'){
                        var myMask = new Ext.LoadMask(Ext.getBody(),{
                            msg:'正在启动,请稍后...',
                            removeMask:true
                        });
                        myMask.show();
                        Ext.Ajax.request({
                            url : '../../AuthAction_start.action',
                            params :{appName : appName,plugin : 'external'},
                            success : function(r,o){
                                myMask.hide();
                                var respText = Ext.util.JSON.decode(r.responseText);
                                var msg = respText.msg;
                                Ext.MessageBox.show({
                                    title:'信息',
                                    msg:msg,
                                    width:320,
                                    buttons:{'ok':'确定'},
                                    icon:Ext.MessageBox.INFO,
                                    closable:false,
                                    fn:function(e){
                                        if(e=='ok'){
                                            grid.render();
                                            store.reload();
                                        }
                                    }
                                });
                            }
                        });
                    }
                }
            });
        });
    }
}

/**
 * 停用应用
 */
function external_stop_file(){
    var grid = Ext.getCmp('grid.file.external.allow.info');
    var store = grid.getStore();
    var selModel = grid.getSelectionModel();
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
            var appName = item.data.appName;
            Ext.MessageBox.show({
                title:'信息',
                msg:'<font color="green">确定要停止'+appName+'应用？</font>',
                animEl:'btnRemove.file.external.info',
                width:300,
                buttons:{'ok':'确定','no':'取消'},
                icon:Ext.MessageBox.WARNING,
                closable:false,
                fn:function(e){
                    if(e == 'ok'){
                        var myMask = new Ext.LoadMask(Ext.getBody(),{
                            msg:'正在停止,请稍后...',
                            removeMask:true
                        });
                        myMask.show();
                        Ext.Ajax.request({
                            url : '../../AuthAction_stop.action',
                            params :{appName : appName,plugin : 'external'},
                            success : function(r,o){
                                myMask.hide();
                                var respText = Ext.util.JSON.decode(r.responseText);
                                var msg = respText.msg;
                                Ext.MessageBox.show({
                                    title:'信息',
                                    msg:msg,
                                    width:320,
                                    animEl:'btnRemove.file.external.info',
                                    buttons:{'ok':'确定'},
                                    icon:Ext.MessageBox.INFO,
                                    closable:false,
                                    fn:function(e){
                                        if(e=='ok'){
                                            grid.render();
                                            store.reload();
                                        }
                                    }
                                });
                            }
                        });
                    }
                }
            });
        });
    }
}

/**
 * 审核通过
 */
function type_allow(){
    var grid = Ext.getCmp('grid.file.external.info');
    var store = grid.getStore();
    var selModel = grid.getSelectionModel();
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
            var appName = item.data.appName;
            Ext.MessageBox.show({
                title:'信息',
                msg:'<font color="green">确定要通过'+appName+'应用的审核？</font>',
                width:300,
                buttons:{'ok':'确定','no':'取消'},
                icon:Ext.MessageBox.WARNING,
                closable:false,
                fn:function(e){
                    if(e == 'ok'){
                        var myMask = new Ext.LoadMask(Ext.getBody(),{
                            msg:'正在处理,请稍后...',
                            removeMask:true
                        });
                        myMask.show();
                        Ext.Ajax.request({
                            url : '../../AuthAction_allow.action',
                            params :{appName : appName,plugin : 'external'},
                            success : function(r,o){
                                myMask.hide();
                                var respText = Ext.util.JSON.decode(r.responseText);
                                var msg = respText.msg;
                                var flag = respText.flag;
                                if(flag){
                                    Ext.MessageBox.show({
                                        title:'信息',
                                        msg:msg + ',点击[启动]启用应用',
                                        buttons:{'ok':'启动','no':'取消'},
                                        icon:Ext.MessageBox.INFO,
                                        closable:false,
                                        fn:function(e){
                                            if(e=='no'){
                                                grid.render();
                                                store.reload();
                                                Ext.getCmp('grid.file.external.allow.info').render();
                                                Ext.getCmp('grid.file.external.allow.info').getStore().reload();
                                            } else if(e=='ok'){
                                                var myMask = new Ext.LoadMask(Ext.getBody(),{
                                                    msg:'正在启动,请稍后...',
                                                    removeMask:true
                                                });
                                                myMask.show();
                                                Ext.Ajax.request({
                                                    url : '../../AuthAction_start.action',
                                                    params :{appName : appName,plugin : 'external'},
                                                    success : function(r,o){
                                                        myMask.hide();
                                                        var respText = Ext.util.JSON.decode(r.responseText);
                                                        var msg = respText.msg;
                                                        Ext.MessageBox.show({
                                                            title:'信息',
                                                            msg:msg,
                                                            width:320,
                                                            buttons:{'ok':'确定'},
                                                            icon:Ext.MessageBox.INFO,
                                                            closable:false,
                                                            fn:function(e){
                                                                if(e=='ok'){
                                                                    grid.render();
                                                                    store.reload();
                                                                    Ext.getCmp('grid.file.external.allow.info').render();
                                                                    Ext.getCmp('grid.file.external.allow.info').getStore().reload();
                                                                }
                                                            }
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
                                        buttons:{'ok':'确定'},
                                        icon:Ext.MessageBox.INFO,
                                        closable:false,
                                        fn:function(e){
                                            if(e=='ok'){
                                                grid.render();
                                                store.reload();
                                                Ext.getCmp('grid.file.external.allow.info').render();
                                                Ext.getCmp('grid.file.external.allow.info').getStore().reload();
                                            }
                                        }
                                    });
                                }
                            }
                        });
                    }
                }
            });
        });
    }
}
/**
 *审核未通过 -- 批注
 */
function type_check(){
    var grid = Ext.getCmp('grid.file.external.info');
    var store = grid.getStore();
    var selModel = grid.getSelectionModel();
    var appName;
    var appType;
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
            appName = item.data.appName;
            appType = item.data.appType;
        });
    }
    var check_record = new Ext.data.Record.create([
	    {name:'appName',	mapping:'appName'},
	    {name:'appType',	mapping:'appType'},
	    {name:'up',        mapping:'up'},
        {name:'desc',		mapping:'desc'},
        {name:'reDesc',	mapping:'reDesc'},
	    {name:'id',		mapping:'id'}
    ]);
    var start = 0;
    var pageSize = 10;
    var check_store = new Ext.data.GroupingStore({
        proxy : new Ext.data.HttpProxy({ url:'../../TypeCheckAction_select.action' }),
        reader : new Ext.data.JsonReader({ totalProperty:'total', root:'rows' },check_record)
    });
    check_store.load({params:{ start:start,limit:pageSize,appName:appName,appType:appType} });
    var check_boxM = new Ext.grid.CheckboxSelectionModel();   //复选框
    var check_rowNumber = new Ext.grid.RowNumberer();         //自动 编号
    var check_colM = new Ext.grid.ColumnModel([
        check_boxM,
        check_rowNumber,
        {header:"应用编号",	dataIndex:"appName",	align:'center',menuDisabled:true},
        {header:'应用类型',	dataIndex:'appType',	align:'center',menuDisabled:true},
        {header:'已修改应用',	dataIndex:'up',	align:'center',menuDisabled:true,renderer:check_showURL_update},
        {header:'批注信息',	dataIndex:'desc',		align:'center',menuDisabled:true},
        {header:'操作标记',	dataIndex:'id',		align:'center',menuDisabled:true,renderer:check_showURL_flag}
    ]);
    check_colM.defaultSortable = true;
    var gridPanel= new Ext.grid.GridPanel({
        id:'grid.check.info',
        plain:true,
        animCollapse:true,
        loadMask:{msg:'正在加载数据，请稍后...'},
        border:false,
        collapsible:false,
        cm:check_colM,
        sm:check_boxM,
        store:check_store,
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
                id:'add.check.info',
                text:'新增',
                iconCls:'add',
                handler:function(){
                    check_insert(gridPanel,check_store,appName,appType);
                }
            }),
            {xtype:"tbseparator"},
            new Ext.Button({
                id:'delete.check.info',
                text:'删除',
                iconCls:'delete',
                handler:function(){
                    check_delete(gridPanel,check_store);
                }
            })
        ],
        view:new Ext.grid.GroupingView({
            forceFit:true,
            groupingTextTpl:'{text}({[values.rs.length]}条记录)'
        }),
        bbar:new Ext.PagingToolbar({
            pageSize : pageSize,
            store:check_store,
            displayInfo:true,
            displayMsg:"显示第{0}条记录到第{1}条记录，一共{2}条",
            emptyMsg:"没有记录",
            beforePageText:"当前页",
            afterPageText:"共{0}页"
        })
    });
    var win = new Ext.Window({
        title:"批注应用",
        width:600,
        height:300,
        layout:'fit',
        modal:true,
        items: [gridPanel],
        bbar:[
            new Ext.Toolbar.Fill(),
            new Ext.Button ({
                text : '保存',
                allowDepress : false,
                handler : function() { win.close(); }
            }),
            new Ext.Button ({
                allowDepress : false,
                text : '关闭',
                handler : function() {win.close();}
            })
        ]
    }).show();
    function check_showURL_update(value){
        if(value==1){
            return '<font color="green">已回应</font>';
        } else if(value==0){
            return '<font color="red">未回应</font>';
        }
    }
    function check_showURL_flag(value){
        return "<a href='javascript:;' style='color: green;' onclick='check_update();'>修改</a>";
    }
}
