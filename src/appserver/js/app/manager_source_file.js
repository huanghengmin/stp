/**
 * 源端--文件同步
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
	    {name:'deleteFile',			mapping:'deleteFile'},
	    {name:'serverAddress',		mapping:'serverAddress'},
	    {name:'port',				mapping:'port'},
	    {name:'userName',			mapping:'userName'},
	    {name:'password',			mapping:'password'},
	    {name:'charset',			mapping:'charset'},
	    {name:'dir',			    mapping:'dir'},
	    {name:'protocol',			mapping:'protocol'},
	    {name:'filterTypes',	    mapping:'filterTypes'},
	    {name:'notFilterTypes',		mapping:'notFilterTypes'},
	    {name:'interval',			mapping:'interval'},
	    {name:'isTwoWay',			mapping:'isTwoWay'},
	    {name:'isIncludeSubDir',	mapping:'isIncludeSubDir'},
	    {name:'fileListSize',		mapping:'fileListSize'},
	    {name:'threads',			mapping:'threads'},
	    {name:'packetSize',			mapping:'packetSize'},
	    {name:'plugin',				mapping:'plugin'},
        {name:'deleteFlag',		mapping:'deleteFlag'},
        {name:'speed',		mapping:'speed'},
	    {name:'flag',				mapping:'flag'}
    ]);

    var external_store = new Ext.data.GroupingStore({
        proxy : new Ext.data.HttpProxy({ url:'../../AppTypeAction_readExternalType.action?typeXml=external' }),
        reader : new Ext.data.JsonReader({ totalProperty:'total', root:'rows' },external_record)
    });


    var external_boxM = new Ext.grid.CheckboxSelectionModel();   //复选框
    var external_rowNumber = new Ext.grid.RowNumberer();         //自动 编号
    var external_colM = new Ext.grid.ColumnModel([
//        external_boxM,
        external_rowNumber,
        {header:"应用编号",		dataIndex:"appName",			align:'center'},
        {header:"应用名",			dataIndex:"appDesc",			align:'center'},
        {header:"传输速度",			    dataIndex:"speed",     align:'center',sortable:true,renderer:showURL_speed},
        {header:'通道',			dataIndex:'channel',	    align:'center',sortable:true,menuDisabled:true, width:50,      renderer:showURL_channel},
        {header:'通道端口',			dataIndex:'channelport',		align:'center',          width:50},
        {header:'启用状态',	    dataIndex:'isActive',		align:'center',renderer:show_isActive,width:50},
        {header:'通信协议',		dataIndex:'protocol',        align:'center',renderer:show_protocol,width:80},
//        {header:'应用类型',		dataIndex:'appType',			align:'center',width:50},
        {header:'服务地址',		dataIndex:'serverAddress',	align:'center'},
        {header:'服务端口',		dataIndex:'port',				align:'center'},
        {header:'用户名称',		dataIndex:'userName',		align:'center'},
        {header:'用户密码',		dataIndex:'password',		align:'center'},
        {header:'文件编码',		dataIndex:'charset',			align:'center'},
        {header:'文件目录',		dataIndex:'dir',             	align:'center'},
        {header:'频率',			dataIndex:'interval',		align:'center'},
//        {header:'双向',		dataIndex:'isTwoWay',		align:'center',renderer:show_is},
        {header:'包含目录',	dataIndex:'isIncludeSubDir',align:'center',renderer:show_is},
        {header:'删除文件',	dataIndex:'deleteFile',		align:'center',renderer:show_is},
        {header:'过滤类型',	dataIndex:'filterTypes',     align:'center'},
        {header:'非过滤类型',	dataIndex:'notFilterTypes', align:'center'},
//        {header:'线程数',			dataIndex:'threads',    		align:'center'},
//        {header:'分批数',			dataIndex:'fileListSize',    align:'center'},
//        {header:'单次发送数据包大小',	dataIndex:'packetSize',  align:'center'},

        {header:'源、目标',			dataIndex:'plugin',		align:'center',renderer:showURL_plugin},
        {header:'操作标记',			dataIndex:'flag',			align:'center',renderer:external_showURL_flag,menuDisabled:true,        width:200}
    ]);

    for(var i=8;i<19;i++){
        external_colM.setHidden(i,!external_colM.isHidden(i));
    }

    external_colM.defaultSortable = true;

    var external_grid_panel= new Ext.grid.GridPanel({
        id:'grid.file.external.info',
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
                id:'btnAdd.file.external.info',
                text:'新增',
                iconCls:'add',
                handler:function(){
                    external_insert_file_win(external_grid_panel,external_store);
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
            store:external_store,
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
            items:[external_grid_panel]
        }]
    });
    external_store.load({params:{ start:start,limit:pageSize,appType:'file' } });
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

function showURL_channel(value){
    if(value==1||value=='1'){
        return "通道一";
    } else if(value==2||value=='2'){
        return "通道二";
    }
}

function show_isActive(value){
    if(value == 'true' || value==true){
    	return '<img src="../../img/icon/ok.png" alt="启动" title="运行中" />';
    }else if(value == 'false' || value == false){
    	return '<img src="../../img/icon/off.gif" alt="停止" title="未运行"/>';
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

function showURL_speed(value){
    return value + ' 毫秒'
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

/********************************************* -- external function -- ******************************************************************************/

function external_showURL_flag(value,p,r){
    var deleteType;
    if(r.get('deleteFlag')) {
        deleteType = "<a href='javascript:;' style='color: green;' onclick='external_delete_file_row();'>删除应用</a>";
    } else {
        deleteType = "<font color='gray'>等待删除</font>";
    }
    if(value=='flag_0'){
        return "<a href='javascript:;' style='color: green;' onclick='external_detail_file_win();'>详细</a>&nbsp;&nbsp;&nbsp;&nbsp;"+deleteType+"&nbsp;&nbsp;&nbsp;&nbsp;<a href='javascript:;' style='color: green;' onclick='external_update_file_app_win();'>修改应用</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href='javascript:;' style='color: green;' onclick='external_update_file_source_win();'>修改源数据</a>";
    }else if(value=='flag_1'){
        return "<a href='javascript:;' style='color: green;' onclick='external_detail_file_win();'>详细</a>&nbsp;&nbsp;&nbsp;&nbsp;"+deleteType+"&nbsp;&nbsp;&nbsp;&nbsp;<a href='javascript:;' style='color: green;' onclick='external_update_file_app_win();'>修改应用</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href='javascript:;' style='color: green;' onclick='external_update_file_source_win();'>修改源数据</a>";
    }else if(value=='flag_2'){
        return "<a href='javascript:;' style='color: green;' onclick='external_detail_file_win();'>详细</a>&nbsp;&nbsp;&nbsp;&nbsp;"+deleteType+"&nbsp;&nbsp;&nbsp;&nbsp;<a href='javascript:;' style='color: green;' onclick='external_update_file_app_win();'>修改应用</a>&nbsp;&nbsp;&nbsp;&nbsp;<font color='gray'>修改源数据</font>";
    }else if(value=='flag_3'){
        return "<a href='javascript:;' style='color: green;' onclick='external_detail_file_win();'>详细</a>&nbsp;&nbsp;&nbsp;&nbsp;"+deleteType+"&nbsp;&nbsp;&nbsp;&nbsp;<a href='javascript:;' style='color: green;' onclick='external_update_file_app_win();'>修改应用</a>&nbsp;&nbsp;&nbsp;&nbsp;<font color='gray'>修改源数据</font>";
    }
}

var dataProtocol = [['ftp','FTP文件传输协议'],['ftpdown','FTP文件传输协议(备份)'],['smb','共享文件传输协议(SMB)'],['ftps','FTPS文件传输协议'],['WebDAV','WebDAV文件传输协议']];

var dataFilterType = [[true,'过滤'],[false,'非过滤']];
var dataCharset = [['GBK','GBK'],['GB2312','GB2312'],['GB18030','GB18030'],['UTF-8','UTF-8'],['UTF-16','UTF-16']];
var dataFilterTypes = [['*.dat','*.dat'],['*.doc','*.doc'],['*.exe','*.exe'],['*.pdf','*.pdf'],['*.ppt','*.ppt'],['*.rar','*.rar'],['*.txt','*.txt'],['*.xml','*.xml'],['*.xls','*.xls'],['*.*','*.*']];
var targetAppName_record = new Ext.data.Record.create([{name:'value',mapping:'value'},{name:'key',mapping:'key'}]);
var targetAppName_reader = new Ext.data.JsonReader({ totalProperty:'total',root:"rows"},targetAppName_record);
var storeFilterType = new Ext.data.SimpleStore({fields:['value','key'],data:dataFilterType});
var storeCharset = new Ext.data.SimpleStore({fields:['value','key'],data:dataCharset});
var storeProtocol = new Ext.data.SimpleStore({fields:['value','key'],data:dataProtocol});
var storeFilterTypes = new Ext.data.SimpleStore({fields:['value','key'],data:dataFilterTypes});
var storeNotFilterTypes = new Ext.data.SimpleStore({fields:['value','key'],data:dataFilterTypes});


//===============================================================external===============================================

/**
 * 新增文件同步应用
 * @param grid
 * @param store
 */
function external_insert_file_win(grid,store){
    var channelRecord = new Ext.data.Record.create([
		{name:'value',mapping:'value'},
		{name:'key',mapping:'key'}
	]);
	var channelReader = new Ext.data.JsonReader({ totalProperty:'total',root:"rows"},channelRecord);
	var storeChannel = new Ext.data.Store({
		url:'../../AppTypeAction_readChannelKeyValue.action',
		reader:channelReader
	});
	storeChannel.load();
    //应用属性配置
     var form1 = new Ext.form.FormPanel({
        id:'card-0',
        frame:true,
        labelAlign:'right',
        autoScroll:true,
        labelWidth:150,
        defaults:{
            width:200,
            allowBlank:false,
            blankText:'该项不能为空！'
        },
        items:[{
        	width:400,
            title:'应用属性配置  -- 使用说明',
            xtype:'fieldset',
            html:"<font color='green'>1.所有项为必填项;</font>"
        },{
            fieldLabel:"应用源类型",
            xtype:'displayfield',
            value:'数据源'
        },{
            name:'typeBase.plugin',
            id:"external.plugin.info",
            xtype:'hidden',
            value:'1'
        },{
            fieldLabel:"配置类型",
            xtype:'displayfield',
            value:'非可信'
        },{
            xtype:'hidden',
            name:'typeBase.privated',
            value:false
        },{
            fieldLabel:"应用类型",
            xtype:'displayfield',
            value:'文件同步'
        },{
            xtype:'hidden',
            name:'typeBase.appType',
            value:'file'
        },{
            id:'appName.external.info',
            fieldLabel:"应用编号",
            xtype:'textfield',
            name:'typeBase.appName',
            regex:/^.{2,30}$/,
            regexText:'请输入任意2--30个字符',
            emptyText:'请输入任意2--30个字符',
            listeners:{
                blur:function(){
                    var appName = this.getValue();
                    if(appName.length>0){
                        var myMask = new Ext.LoadMask(Ext.getBody(),{
                            msg:'正在校验,请稍后...',
                            removeMask:true
                        });
                        myMask.show();
                        Ext.Ajax.request({
                            url:'../../AppTypeAction_check.action',
                            params:{appName:appName},
                            method:'POST',
                            success:function(action){
                                var json = Ext.decode(action.responseText);
                                myMask.hide();
                                if(json.msg != '0000'){
                                    Ext.MessageBox.show({
                                        title:'信息',
                                        msg:'<font color="red">'+json.msg+'</font>',
                                        prompt:false,
                                        animEl:'appName.external.info',
                                        width:200,
                                        buttons:{'ok':'确定'},
                                        icon:Ext.MessageBox.ERROR,
                                        closable:false,
                                        fn:function(e){
                                            if(e=='ok'){
                                                Ext.getCmp('appName.external.info').setValue('');
                                            }
                                        }
                                    });
                                }
                            }
                        });
                    }
                }
            }
        },{
        	id:'external.appDesc.info',
            fieldLabel:"应用名",
            xtype:'textfield',
            name:'typeBase.appDesc',
            regex:/^.{2,30}$/,
            regexText:'请输入任意2--30个字符',
            emptyText:'请输入任意2--30个字符'
        },{
            id:'external.combo.channel.info',
            fieldLabel:"通道",
            hiddenName:'typeBase.channel',
            xtype:'combo',
            mode:'local',
            emptyText :'--请选择--',
            editable : false,
            typeAhead:true,
            forceSelection: true,
            triggerAction:'all',
            displayField:"key",valueField:"value",
            store:storeChannel
        },{
            id:'external.channelport.info',
        	fieldLabel:"通道端口",
            xtype:'textfield',
            name:'typeBase.channelport',
            regex:/^(7700|7[0-6][0-9]{2}|6[7-9][0-9]{2})$/,
            regexText:'这个不是端口类型6700~7700',
            emptyText:'请输入端口6700~7700',
            listeners:{
                blur:function(){
                    var channelPort = this.getValue();
                    if(channelPort.length>0){
                        var myMask = new Ext.LoadMask(Ext.getBody(),{
                            msg:'正在校验,请稍后...',
                            removeMask:true
                        });
                        myMask.show();
                        Ext.Ajax.request({
                            url:'../../AppTypeAction_checkPort.action',
                            params:{channelPort:channelPort},
                            method:'POST',
                            success:function(action){
                                var json = Ext.decode(action.responseText);
                                var msg = json.msg;
                                myMask.hide();
                                if(json.msg != '0000'){
                                    Ext.MessageBox.show({
                                        title:'信息',
                                        msg:'<font color="red">'+json.msg+'</font>',
                                        prompt:false,
                                        animEl:'external.channelport.info',
                                        width:250,
                                        buttons:{'ok':'确定'},
                                        icon:Ext.MessageBox.ERROR,
                                        closable:false,
                                        fn:function(e){
                                            if(e=='ok'){
                                                Ext.getCmp('external.channelport.info').setValue('');
                                            }
                                        }
                                    });
                                }
                            }
                        });
                    }
                }
            }
        },{
            id:'external.speed.info',
            fieldLabel:"源端发送速度(毫秒)", name:'typeBase.speed',
            xtype:'numberfield',
            value:3000,
		    emptyText:'请输入整数'
        }]
    });
    //源端属性配置
    var form2 = new Ext.form.FormPanel({
    	id:'card-1',
        frame:true,
        autoScroll:true,
        labelAlign:'right',
        labelWidth:130,
        defaults:{
            width:230,
            allowBlank:false,
            blankText:'该项不能为空！'
        },
        items:[{
            id:'protocol.info',
        	fieldLabel:"通信协议", hiddenName:'typeFile.protocol',
        	xtype:'combo',
        	mode:'local',
        	emptyText :'--请选择--',
        	editable : false,
        	typeAhead:true,
        	forceSelection: true,
        	triggerAction:'all',
        	displayField:"key",valueField:"value",
        	store: storeProtocol,
            listeners:{
                focus:function(){
                    Ext.getCmp('card-finish').hide();
                    Ext.getCmp('card-test').show();
                },
                select : function() {
                    var protocol = Ext.getCmp('protocol.info').getValue();
                    var port = '';
                    if(protocol == 'ftp'){
                        port = 21;
                    } else if(protocol == 'ftps'){

                    } else if(protocol == 'smb'){
                        port = 445;
                    } else if(protocol == 'WebDAV'){
                        port = 8888;
                    } else if( protocol == 'ftpdown'){
                        port = 21;
                        Ext.getCmp('threads.info').setValue(5);
                    }
                    Ext.getCmp('port.info').setValue(port);
                }
            }
        },{
        	fieldLabel:'文件服务器地址',
        	xtype:'textfield',
        	name:'typeFile.serverAddress',
            regex:/^(((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9]))$/,
            regexText:'这个不是Ip(例:1.1.1.1)',
            emptyText:'请输入Ip(例:1.1.1.1)',
            listeners:{
                focus:function(){
                    Ext.getCmp('card-finish').hide();
                    Ext.getCmp('card-test').show();
                }
            }
        },{
            id:'port.info',
        	fieldLabel:'文件服务器端口',
        	xtype:'textfield',
        	name:'typeFile.port',
            regex:/^(6553[0-6]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{3}|[1-9][0-9]{2}|[1-9][0-9]|[1-9])$/,
            regexText:'这个不是端口类型1~65536',
            emptyText:'请输入端口1~65536',
            listeners:{
                focus:function(){
                    Ext.getCmp('card-finish').hide();
                    Ext.getCmp('card-test').show();
                }
            }
        },{
            fieldLabel:'登录名',
            xtype:'textfield',
            name:'typeFile.userName',
            allowBlank:true,
            regex:/^[A-Za-z0-9!#$%^&*~]{0,16}$/,
            regexText:'请输入0--30个字符(可以包含A-Za-z0-9!#$%^&*~),或者为空',
            listeners:{
                focus:function(){
                    Ext.getCmp('card-finish').hide();
                    Ext.getCmp('card-test').show();
                }
            }
        },{
            fieldLabel:'密码',
            xtype:'textfield',
            inputType:'password',
            name:'typeFile.password',
            allowBlank:true,
            regex:/^[A-Za-z0-9!#$%^&*.~]{0,16}$/,
            regexText:'密码是1-16位(可以包含A-Za-z0-9!#$%^&*.~),或者为空',
            listeners:{
                focus:function(){
                    Ext.getCmp('card-finish').hide();
                    Ext.getCmp('card-test').show();
                }
            }
        },{
        	fieldLabel:"根目录",
            xtype:'textfield',
        	name:'typeFile.dir',
            value:'/',
            regex:/^([\/].*)*$/,
        	regexText:'这个不是目录',
        	emptyText:'请输入目录',
            listeners:{
                focus:function(){
                    Ext.getCmp('card-finish').hide();
                    Ext.getCmp('card-test').show();
                }
            }
        },{
        	fieldLabel:'源频率(单位:毫秒)',
            xtype:'displayfield',
//        	name:'typeFile.interval',
            value:60000
        },{
        	fieldLabel:"编码", hiddenName:'typeFile.charset',
        	xtype:'combo',
        	mode:'local',
        	emptyText :'--请选择--',
        	editable : false,
        	typeAhead:true,
        	forceSelection: true,
        	triggerAction:'all',
        	displayField:"key",valueField:"value",
        	store: storeCharset,
            listeners:{
                focus:function(){
                    Ext.getCmp('card-finish').hide();
                    Ext.getCmp('card-test').show();
                }
            }
        },{
            fieldLabel:'删除文件',
            layout:'column',
            defaultType: 'radio',
            items: [
                { width:50, boxLabel: '是', name: 'typeFile.deleteFile', inputValue: true},
                { width:50, boxLabel: '否', name: 'typeFile.deleteFile', inputValue: false,  checked: true  }
            ]
        },{
            hidden:true,
            layout:'column',
            defaultType: 'radio',
            items: [
                { width:50, boxLabel: '是', name: 'typeFile.isTwoWay', inputValue: true},
                { width:50, boxLabel: '否', name: 'typeFile.isTwoWay', inputValue: false,  checked: true  }
            ]
        },{
            fieldLabel:"包含子目录",
            layout:'column',
            defaultType: 'radio',
            items: [
                { width:50, boxLabel: '是', name: 'typeFile.isIncludeSubDir', inputValue: true,  checked: true },
                { width:50, boxLabel: '否', name: 'typeFile.isIncludeSubDir', inputValue: false }
            ]
        },{
            fieldLabel:"过滤类型选择",
        	xtype:'combo',
        	mode:'local',
        	emptyText :'--请选择--',
        	editable : false,
        	typeAhead:true,
        	forceSelection: true,
        	triggerAction:'all',
        	displayField:"key",valueField:"value",
        	store: storeFilterType,
            value:true,
            listeners:{
                select : function(){
                    var filterType = this.getValue();
	            	if(filterType==false){
                        Ext.getCmp('filter.panel.info').hide();
                        Ext.getCmp('notfilter.panel.info').show();
                    }else if(filterType==true){
                        Ext.getCmp('filter.panel.info').show();
	            		Ext.getCmp('notfilter.panel.info').hide();
	            	}
	            }
            }
        },{
            id:'filter.panel.info',
            plain:true,
            width : 400,
            defaultType:'textfield',
            labelAlign:'right',
            hidden:false,
            labelWidth:130,
            border:false,
            layout: 'form',
            defaults:{
                width:230,
                allowBlank:true,
                blankText:'该项不能为空！'
            },
            items:[{
                id:'external.filterTypes.info',
                fieldLabel:"文件类型", hiddenName:'typeFile.filterTypes',
                name:'typeFile.filterTypes',
                xtype:'textfield',
                regex:/^((\*\.)(([a-zA-Z]*)|\*)|((\*\.)([a-zA-Z]*),)*(\*\.)([a-zA-Z]*))$/,
                regexText:'用","隔开(例:*.*,*.txt)',
                emptyText :'用","隔开(例:*.*,*.txt)'
            }]
        },{
        	id:'notfilter.panel.info',
            width : 400,
            plain:true,
            hidden:true,
            defaultType:'textfield',
            labelAlign:'right',
            labelWidth:130,
            border:false,
            layout: 'form',
            defaults:{
                width:230,
                allowBlank:true,
                blankText:'该项不能为空！'
            },
            items:[{
                id:'external.notFilterTypes.info',
                fieldLabel:"文件类型",
                name:'typeFile.notFilterTypes',
                xtype:'textfield',
                regex:/^((\*\.)(([a-zA-Z]*)|\*)|((\*\.)([a-zA-Z]*),)*(\*\.)([a-zA-Z]*))$/,
                regexText:'用","隔开(例:*.*,*.txt)',
                emptyText :'用","隔开(例:*.*,*.txt)'
            }]
        },{
            xtype:'hidden',
        	name:'typeFile.interval',
            value:60000
        },{
            id:'threads.info',
            xtype:'hidden',
        	name:'typeFile.threads',
        	value : 1
        },{
            xtype:'hidden',
        	name:'typeFile.fileListSize',
        	value : 200
        },{
            xtype:'hidden',
        	name:'typeFile.packetSize',
        	value : 2
        }]
    });

    var card = new Ext.Panel({
        id:'card-wizard-panel',
        layout:'card',
        activeItem:0,
        layoutConfig:{
            animate:true
        },
        bbar:['->',{
            id:'card-prev',
            text:'上一页',
            handler:external_CardNav.createDelegate(this,[-1]),
            disabled:true
        },{
            id:'card-next',
            text:'下一页',
            handler:external_CardNav.createDelegate(this,[+1])
        },{
            id:'card-test',
            text:'测试',
            handler:function(){
                if (form1.form.isValid()&&form2.form.isValid()) {
                    var appName = Ext.getCmp('appName.external.info').getValue();
                    var appDesc = Ext.getCmp('external.appDesc.info').getValue();
                    var channel = Ext.getCmp('external.combo.channel.info').getValue();
                    var channelport = Ext.getCmp('external.channelport.info').getValue();

                    form2.getForm().submit({
                        url :'../../FileTypeAction_testConnect.action',
                        params:{
                            appName:appName,appDesc:appDesc,privated:false,plugin:'1',channel:channel,channelport:channelport,
                            appType:'file',isActive:false
                        },
                        method :'POST',
                        waitTitle :'系统提示',
                        waitMsg :'正在测试,请稍后...',
                        success : function(form,action) {
                            var msg = action.result.msg;
                            var flag = action.result.flag;
                            Ext.MessageBox.show({
                                title:'信息',
                                width:260,
                                msg:msg,
                                animEl:'card-test',
                                buttons:{'ok':'确定'},
                                icon:Ext.MessageBox.INFO,
                                closable:false,
                                fn:function(e){
                                    if(e=='ok'){
                                        if(flag) {
                                            Ext.getCmp('card-test').hide();
                                            Ext.getCmp('card-finish').show();
                                        }
                                    }
                                }
                            });
                        }
                    });
                } else {
                    Ext.MessageBox.show({
                        title:'信息',
                        width:200,
                        msg:'请填写完成再提交!',
                        animEl:'card-test',
                        buttons:{'ok':'确定'},
                        icon:Ext.MessageBox.ERROR,
                        closable:false
                    });
                }
            }
        },{
            id: "card-finish",
            text: "保存",
            handler: function() {
                if (form1.form.isValid()&&form2.form.isValid()) {
                    var appName = Ext.getCmp('appName.external.info').getValue();
                    var appDesc = Ext.getCmp('external.appDesc.info').getValue();
                    var channel = Ext.getCmp('external.combo.channel.info').getValue();
                    var channelport = Ext.getCmp('external.channelport.info').getValue();
                    var speed = Ext.getCmp('external.speed.info').getValue();
                    form2.getForm().submit({
                        url:'../../FileTypeAction_insert.action',
                        params:{
                            appName:appName,appDesc:appDesc,privated:false,plugin:'1',channel:channel,channelport:channelport,
                            appType:'file',isActive:false ,speed:speed
                        },
                        method :'POST',
                        waitTitle :'系统提示',
                        waitMsg :'正在保存,请稍后...',
                        success : function(form,action) {
                            var msg = action.result.msg;
                            Ext.MessageBox.show({
                                title:'信息',
                                msg:msg,
                                animEl:'card-finish',
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
                }else{
                    Ext.MessageBox.show({
                        title:'信息',
                        width:200,
                        msg:'请填写完成再提交!',
                        animEl:'card-finish',
                        buttons:{'ok':'确定'},
                        icon:Ext.MessageBox.ERROR,
                        closable:false
                    });
                }
            }
        }],
        items:[form1,form2]
    });
    var win = new Ext.Window({
        title:"新增信息-非可信文件同步应用",
        width:450,
        height:380,
        layout:'fit',
        modal:true,
        items:card,
        listeners:{
            show:function(){
                Ext.getCmp('card-finish').hide();
                Ext.getCmp('card-test').show();
            }
        }
    }).show();
}
function external_CardNav(incr){
    var cardPanel = Ext.getCmp('card-wizard-panel').getLayout();
    var i = cardPanel.activeItem.id.split('card-')[1];
    var text = document.getElementById('external.plugin.info').value;
    var next = parseInt(i)+incr;
    cardPanel.setActiveItem(next);
    Ext.getCmp('card-prev').setDisabled(next==0);
    Ext.getCmp('card-next').setDisabled(next==1);
}

/**
 * 删除文件同步应用
 */
function external_delete_file_row(){
    var grid = Ext.getCmp('grid.file.external.info');
    var store = grid.getStore();
    var selModel = grid.getSelectionModel();
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
            var appName = item.data.appName;
            var appType = item.data.appType;
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
                            url : '../../FileTypeAction_delete.action',
                            params :{appName : appName,plugin : 'external',deleteType:2},
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
 * 修改 应用
 */
function external_update_file_app_win(){
    var channelRecord = new Ext.data.Record.create([
		{name:'value',mapping:'value'},
		{name:'key',mapping:'key'}
	]);
	var channelReader = new Ext.data.JsonReader({ totalProperty:'total',root:"rows"},channelRecord);
	var storeChannel = new Ext.data.Store({
		url:'../../AppTypeAction_readChannelKeyValue.action',
		reader:channelReader,
        listeners : {
			load : function(){
				var value = Ext.getCmp('channel.external.info').getValue();
				Ext.getCmp('channel.external.info').setValue(value);
			}
		}
	});
	storeChannel.load();
    var grid = Ext.getCmp('grid.file.external.info');
    var store = Ext.getCmp('grid.file.external.info').getStore();
    var selModel = grid.getSelectionModel();
    var formPanel;
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
            formPanel  = new Ext.form.FormPanel({
                frame:true,
                labelAlign:'right',
                autoScroll:true,
                labelWidth:150,
                defaults:{
                    width:200,
                    allowBlank:false,
                    blankText:'该项不能为空！'
                },
                items:[{
                	fieldLabel:"应用源类型",
                	xtype:'displayfield',
                	value:'数据源'
                },{
                    fieldLabel:"配置类型",
                    xtype:'displayfield',
                    value:'非可信'
                },{
                    xtype:'hidden',
                    name:'typeBase.plugin',
                    value:'1'
                },{
                    xtype:'hidden',
                    name:'typeBase.privated',
                    value:false
                },{
                    fieldLabel:"应用类型",
                    xtype:'displayfield',
                    value:'文件同步'
                },{
                    xtype:'hidden',
                    name:'typeBase.appType',
                    value:'file'
                },{
                    fieldLabel:"应用编号",
                    xtype:'displayfield',
                    value:item.data.appName
                },{
                    xtype:'hidden',
                    name:'typeBase.appName',
                    value:item.data.appName
                },{
                    fieldLabel:"应用名",
                    xtype:'textfield',
                    name:'typeBase.appDesc',
                    value:item.data.appDesc,
                    regex:/^.{2,30}$/,
                    regexText:'请输入任意2--30个字符',
                    emptyText:'请输入任意2--30个字符'
                },{
                    id:'channel.external.info',
                    fieldLabel:"通道",
                    hiddenName:'typeBase.channel',value:item.data.channel,
                    xtype:'combo',
                    mode:'local',
                    emptyText :'--请选择--',
                    editable : false,
                    typeAhead:true,
                    forceSelection: true,
                    triggerAction:'all',
                    displayField:"key",valueField:"value",
                    store:storeChannel
                },{
                    id:'external.channelport.update.info',
                    fieldLabel:"通道端口",
                    xtype:'textfield',
                    name:'typeBase.channelport',
                    value:item.data.channelport,
                    regex:/^(7700|7[0-6][0-9]{2}|6[7-9][0-9]{2})$/,
                    regexText:'这个不是端口类型6700~7700',
                    emptyText:'请输入端口6700~7700',
                    listeners:{
                        blur:function(){
                            var old = item.data.channelport;
                            var channelPort = this.getValue();
                            if(channelPort!=old&&channelPort.length>0){
                                var myMask = new Ext.LoadMask(Ext.getBody(),{
                                    msg:'正在校验,请稍后...',
                                    removeMask:true
                                });
                                myMask.show();
                                Ext.Ajax.request({
                                    url:'../../AppTypeAction_checkPort.action',
                                    params:{channelPort:channelPort},
                                    method:'POST',
                                    success:function(action){
                                        var json = Ext.decode(action.responseText);
                                        var msg = json.msg;
                                        myMask.hide();
                                        if(json.msg != '0000'){
                                            Ext.MessageBox.show({
                                                title:'信息',
                                                msg:'<font color="red">'+json.msg+'</font>',
                                                prompt:false,
                                                animEl:'external.channelport.info',
                                                width:250,
                                                buttons:{'ok':'确定'},
                                                icon:Ext.MessageBox.ERROR,
                                                closable:false,
                                                fn:function(e){
                                                    if(e=='ok'){
                                                        Ext.getCmp('external.channelport.update.info').setValue('');
                                                    }
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        }
                    }
                },{
                    fieldLabel:"源端发送速度(毫秒)", name:'typeBase.speed',
                    xtype:'numberfield',
                    value:item.data.speed,
                    emptyText:'请输入整数'
                }]
            });
        });
    }
    var win = new Ext.Window({
        title:"修改信息-非可信文件同步应用",
        width:430,
        height:315,
        layout:'fit',
        modal:true,
        items: [formPanel],
        bbar:[
            new Ext.Toolbar.Fill(),
            new Ext.Button ({
                id:'external.update.app.win.info',
                text : '修改',
                formBind:true,
                allowDepress : false,
                handler : function() {
                    if (formPanel.form.isValid()) {
                        Ext.MessageBox.show({
                    		title:'信息',
                            width:200,
                            msg:'确定要修改?',
                            animEl:'external.update.app.win.info',
                            buttons:{'ok':'确定','no':'取消'},
                            icon:Ext.MessageBox.WARNING,
                            closable:false,
                            fn:function(e){
                            	if(e=='ok'){
                            		formPanel.getForm().submit({
			                            url :'../../FileTypeAction_update.action',
			                            method :'POST',
			                            waitTitle :'系统提示',
			                            waitMsg :'正在修改,请稍后...',
			                            success : function(form,action) {
                                            var msg = action.result.msg;
			                                Ext.MessageBox.show({
			                                    title:'信息',
			                                    width:260,
			                                    msg:msg,
			                                    animEl:'external.update.app.win.info',
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
                            width:200,
                            msg:'请填写完成再提交!',
                            animEl:'external.update.app.win.info',
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
 * 修改 源数据
 */
function external_update_file_source_win(){
    var grid = Ext.getCmp('grid.file.external.info');
    var store = Ext.getCmp('grid.file.external.info').getStore();
    var selModel = grid.getSelectionModel();
    var filterTypes;
    var notFilterTypes;
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
            filterTypes = item.data.filterTypes;
            notFilterTypes = item.data.notFilterTypes;
        });
    }
    var filterTypeT;
    var filterTypeF;
    if((filterTypes == null || filterTypes == '')&&(notFilterTypes != null)){
		filterTypeT = false;
		filterTypeF = true;
	}else if((filterTypes != null)&&(notFilterTypes == null || notFilterTypes == '')){
		filterTypeT = true;
		filterTypeF = false;
	}
    var formPanel;
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
            var deleteFile = item.data.deleteFile;
            var isTwoWay = item.data.isTwoWay;
            var isIncludeSubDir = item.data.isIncludeSubDir;
            var deleteFileT;
            var deleteFileF;
            var isTwoWayT;
            var isTwoWayF;
            var isIncludeSubDirT;
            var isIncludeSubDirF;
            if(deleteFile=='true'){
                deleteFileT = true;
                deleteFileF = false;
            }else if(deleteFile=='false'){
                deleteFileT = false;
                deleteFileF = true;
            }
            if(isTwoWay=='true'){
                isTwoWayT = true;
                isTwoWayF = false;
            }else if(isTwoWay=='false'){
                isTwoWayT = false;
                isTwoWayF = true;
            }
            if(isIncludeSubDir=='true'){
                isIncludeSubDirT = true;
                isIncludeSubDirF = false;
            }else if(isIncludeSubDir=='false'){
                isIncludeSubDirT = false;
                isIncludeSubDirF = true;
            }
            formPanel  =  new Ext.form.FormPanel({
                id:'external.card-1.update',
                frame:true,
                autoScroll:true,
                labelAlign:'right',
                labelWidth:130,
                defaults:{
                    width:230,
                    allowBlank:false,
                    blankText:'该项不能为空！'
                },
                items:[{
                	xtype:'hidden',
                	name:'typeBase.privated',
                	value:false
                },{
                	xtype:'hidden',
                	name:'typeBase.appName',
                	value:item.data.appName
                },{
                    xtype:'hidden',
                	name:'typeBase.plugin',
                	value:item.data.plugin
                },{
                	fieldLabel:"通信协议", hiddenName:'typeFile.protocol',value:item.data.protocol,
                	xtype:'combo',
                	mode:'local',
                	emptyText :'--请选择--',
                	editable : false,
                	typeAhead:true,
                	forceSelection: true,
                	triggerAction:'all',
                	displayField:"key",valueField:"value",
                	store: storeProtocol,
                    listeners:{
                        focus:function(){
                            Ext.getCmp('external.update.source.win.info').hide();
                            Ext.getCmp('external.update.source.win.test.info').show();
                            var protocol = this.getValue();
                            var port = '';
                            if(protocol == 'ftp'){
                                port = 21;
                            } else if(protocol == 'ftps'){

                            } else if(protocol == 'smb'){
                                port = 445;
                            } else if(protocol == 'WebDAV'){
                                port = 8888;
                            } else if( protocol == 'ftpdown'){
                                port = 21;
                                Ext.getCmp('threads.info').setValue(5);
                            }
                            Ext.getCmp('port.info').setValue(port);
                        }
                    }
                },{
                    fieldLabel:'文件服务器地址',
                    xtype:'textfield',
                    name:'typeFile.serverAddress',
                    value:item.data.serverAddress,
                    regex:/^(((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9]))$/,
                    regexText:'这个不是Ip(例:1.1.1.1)',
                    emptyText:'请输入Ip(例:1.1.1.1)',
                    listeners:{
                        focus:function(){
                            Ext.getCmp('external.update.source.win.info').hide();
                            Ext.getCmp('external.update.source.win.test.info').show();
                        }
                    }
                },{
                    fieldLabel:'文件服务器端口',
                    xtype:'textfield',
                    name:'typeFile.port',
                    value:item.data.port,
                    regex:/^(6553[0-6]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{3}|[1-9][0-9]{2}|[1-9][0-9]|[1-9])$/,
                    regexText:'这个不是端口类型1~65536',
                    emptyText:'请输入端口1~65536',
                    listeners:{
                        focus:function(){
                            Ext.getCmp('external.update.source.win.info').hide();
                            Ext.getCmp('external.update.source.win.test.info').show();
                        }
                    }
                },{
                    fieldLabel:'登录名',
                    xtype:'textfield',
                    name:'typeFile.userName',
                    value:item.data.userName,
                    allowBlank:true,
//                    regex:/^.{0,30}$/,
                    regex:/^[A-Za-z0-9!#$%^&*~]{0,16}$/,
                    regexText:'请输入0--30个字符(可以包含A-Za-z0-9!#$%^&*~),或者为空',
                    listeners:{
                        focus:function(){
                            Ext.getCmp('external.update.source.win.info').hide();
                            Ext.getCmp('external.update.source.win.test.info').show();
                        }
                    }
                },{
                    fieldLabel:'密码',
                    xtype:'textfield',
                    inputType:'password',
                    name:'typeFile.password',
                    allowBlank:true,
                    regex:/^[A-Za-z0-9!#$%^&*.~]{0,16}$/,
                    regexText:'密码是1-16位(可以包含A-Za-z0-9!#$%^&*.~),或者为空',
                    listeners:{
                        focus:function(){
                            Ext.getCmp('external.update.source.win.info').hide();
                            Ext.getCmp('external.update.source.win.test.info').show();
                        }
                    }
                },{
                    fieldLabel:"根目录",
                    xtype:'textfield',
                    name:'typeFile.dir',
                    value:item.data.dir,
                    regex:/^([\/].*)*$/,
                    regexText:'这个不是目录',
                    emptyText:'请输入目录',
                    listeners:{
                        focus:function(){
                            Ext.getCmp('external.update.source.win.info').hide();
                            Ext.getCmp('external.update.source.win.test.info').show();
                        }
                    }
                },{
                    fieldLabel:'频率',
                    xtype:'displayfield',
                    value:60000
                },{
                	fieldLabel:"编码", hiddenName:'typeFile.charset',value:item.data.charset,
                	xtype:'combo',
                	mode:'local',
                	emptyText :'--请选择--',
                	editable : false,
                	typeAhead:true,
                	forceSelection: true,
                	triggerAction:'all',
                	displayField:"key",valueField:"value",
                	store: storeCharset,
                    listeners:{
                        focus:function(){
                            Ext.getCmp('external.update.source.win.info').hide();
                            Ext.getCmp('external.update.source.win.test.info').show();
                        }
                    }
                },{
                    fieldLabel:'删除文件',
                    layout:'column',
                    defaultType: 'radio',
                    items: [
                        { width:50, boxLabel: '是', name: 'typeFile.deleteFile', inputValue: true,  checked: deleteFileT },
                        { width:50, boxLabel: '否', name: 'typeFile.deleteFile', inputValue: false,  checked: deleteFileF }
                    ]
                },{
                    hidden:true,
                    layout:'column',
                    defaultType: 'radio',
                    items: [
                        { width:50, boxLabel: '是', name: 'typeFile.isTwoWay', inputValue: true,  checked: isTwoWayT },
                        { width:50, boxLabel: '否', name: 'typeFile.isTwoWay', inputValue: false,  checked: isTwoWayF }
                    ]
                },{
                    fieldLabel:"包含子目录",
                    layout:'column',
                    defaultType: 'radio',
                    items: [
                        { width:50, boxLabel: '是', name: 'typeFile.isIncludeSubDir', inputValue: true,  checked: isIncludeSubDirT },
                        { width:50, boxLabel: '否', name: 'typeFile.isIncludeSubDir', inputValue: false,  checked: isIncludeSubDirF }
                    ]
                },{
                	fieldLabel:"过滤类型选择",
                    xtype:'combo',
                    mode:'local',
                    emptyText :'--请选择--',
                    editable : false,
                    typeAhead:true,
                    forceSelection: true,
                    triggerAction:'all',
                    displayField:"key",valueField:"value",
                    store: storeFilterType,
                    value:true,
                    listeners:{
                        select : function(){
                            var filterType = this.getValue();
                            if(filterType==false){
                                Ext.getCmp('filter.panel.info').hide();
                                Ext.getCmp('notfilter.panel.info').show();
                            }else if(filterType==true){
                                Ext.getCmp('filter.panel.info').show();
                                Ext.getCmp('notfilter.panel.info').hide();
                            }
                        }
                    }
                },{
                    id:'filter.panel.info',
                    plain:true,
                    width:400,
                    defaultType:'textfield',
                    labelAlign:'right',
                    hidden:filterTypeF,
                    labelWidth:130,
                    border:false,
                    layout: 'form',
                    defaults:{
                        width:230,
                        allowBlank:false,
                        blankText:'该项不能为空！'
                    },
                    items:[{
                        id:'external.filterTypes.info',
                        fieldLabel:"文件类型", hiddenName:'typeFile.filterTypes',
                        name:'typeFile.filterTypes',
                        value:item.data.filterTypes,
                        xtype:'textfield',
                        regex:/^((\*\.)(([a-zA-Z]*)|\*)|((\*\.)([a-zA-Z]*),)*(\*\.)([a-zA-Z]*))$/,
                        regexText:'用","隔开(例:*.*,*.txt)',
                        emptyText :'用","隔开(例:*.*,*.txt)'
                    }]
                },{
                    id:'notfilter.panel.info',
                    plain:true,
                    width:400,
                    hidden:filterTypeT,
                    defaultType:'textfield',
                    labelAlign:'right',
                    labelWidth:130,
                    border:false,
                    layout: 'form',
                    defaults:{
                        width:230,
                        allowBlank:true,
                        blankText:'该项不能为空！'
                    },
                    items:[{
                        id:'external.notFilterTypes.info',
                        disabled :true,
                        fieldLabel:"文件类型",
                        name:'typeFile.notFilterTypes',
                        value:item.data.notFilterTypes,
                        xtype:'textfield',
                        regex:/^((\*\.)(([a-zA-Z]*)|\*)|((\*\.)([a-zA-Z]*),)*(\*\.)([a-zA-Z]*))$/,
                        regexText:'用","隔开(例:*.*,*.txt)',
                        emptyText :'用","隔开(例:*.*,*.txt)'
                    }]
                },{
                    xtype:'hidden',
                    name:'typeFile.interval',
                    value:60000
                },{
                    id:'threads.info',
                    xtype:'hidden',
                    name:'typeFile.threads',
                    value : 1
                },{
                    xtype:'hidden',
                    name:'typeFile.fileListSize',
                    value : 200
                },{
                    xtype:'hidden',
                    name:'typeFile.packetSize',
                    value : 2
                }]
            });
        });
    }
    var win = new Ext.Window({
        title:"修改信息-非可信文件同步源数据",
        width:500,
        height:360,
        layout:'fit',
        modal:true,
        items: [formPanel],
        listeners :{
        	show:function(){
                Ext.getCmp('external.update.source.win.info').hide();
                Ext.getCmp('external.update.source.win.test.info').show();
        		if((filterTypes == null || filterTypes == '')&&(notFilterTypes != null)){
        			Ext.getCmp('external.filterTypes.info').reset();
        			Ext.getCmp('external.filterTypes.info').disable();
        			Ext.getCmp('external.notFilterTypes.info').enable();
        		}else if((filterTypes != null)&&(notFilterTypes == null || notFilterTypes == '')){
        			Ext.getCmp('external.filterTypes.info').enable();
        			Ext.getCmp('external.notFilterTypes.info').reset();
        			Ext.getCmp('external.notFilterTypes.info').disable();
        		}        		
        	}
        },
        bbar:[
            new Ext.Toolbar.Fill(),
            new Ext.Button({
                id:'external.update.source.win.test.info',
                hidden:false,
                text:'测试',
                handler : function() {
                    if (formPanel.form.isValid()) {
                        formPanel.getForm().submit({
                            url :'../../FileTypeAction_testConnect.action',
                            method :'POST',
                            waitTitle :'系统提示',
                            waitMsg :'正在测试,请稍后...',
                            success : function(form,action) {
                                var msg = action.result.msg;
                                var flag = action.result.flag;
                                Ext.MessageBox.show({
                                    title:'信息',
                                    width:260,
                                    msg:msg,
                                    animEl:'external.update.source.win.test.info',
                                    buttons:{'ok':'确定'},
                                    icon:Ext.MessageBox.INFO,
                                    closable:false,
                                    fn:function(e){
                                        if(e=='ok'){
                                            if(flag) {
                                                Ext.getCmp('external.update.source.win.test.info').hide();
                                                Ext.getCmp('external.update.source.win.info').show();
                                            }
                                        }
                                    }
                                });
                            }
                        });
                    } else {
                        Ext.MessageBox.show({
                            title:'信息',
                            width:200,
                            msg:'请填写完成再提交!',
                            animEl:'external.update.source.win.test.info',
                            buttons:{'ok':'确定'},
                            icon:Ext.MessageBox.ERROR,
                            closable:false
                        });
                    }
                }
            }),
            new Ext.Button ({
                id:'external.update.source.win.info',
                text : '修改',
                formBind:true,
                allowDepress : false,
                handler : function() {
                    if (formPanel.form.isValid()) {
                        Ext.MessageBox.show({
                    		title:'信息',
                            width:200,
                            msg:'确定要修改?',
                            animEl:'external.update.source.win.info',
                            buttons:{'ok':'确定','no':'取消'},
                            icon:Ext.MessageBox.WARNING,
                            closable:false,
                            fn:function(e){
                            	if(e=='ok'){
                            		formPanel.getForm().submit({
			                            url :'../../FileTypeAction_update.action',
			                            method :'POST',
			                            waitTitle :'系统提示',
			                            waitMsg :'正在修改,请稍后...',
			                            success : function(form,action) {
			                                Ext.MessageBox.show({
			                                    title:'信息',
			                                    width:260,
			                                    msg:action.result.msg,
			                                    animEl:'external.update.source.win.info',
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
                            width:200,
                            msg:'请填写完成再提交!',
                            animEl:'external.update.source.win.info',
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
 *查看文件同步应用
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
                    {fieldLabel:'通信协议',value:show_protocol(item.data.protocol)},
                    {fieldLabel:'文件服务器地址',value:item.data.serverAddress},
                    {fieldLabel:'文件服务器端口',value:item.data.port},
                    {fieldLabel:'登录名',value:item.data.userName},
                    {fieldLabel:'编码',value:item.data.charset},
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