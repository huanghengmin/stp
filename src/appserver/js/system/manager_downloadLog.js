/**
 * 日志下载
 */
Ext.onReady(function(){
    Ext.BLANK_IMAGE_URL = '../../js/ext/resources/images/default/s.gif';
    Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget ='side';

    var pageStart = 0;
    var pageSize = 15;
	var internal_record = new Ext.data.Record.create([
        {name:'fileName',mapping:'fileName'}
    ]);
    var internal_proxy = new Ext.data.HttpProxy({
        url:"../../ManagerLogAction_readLocalLogName.action"
    });
    var internal_reader = new Ext.data.JsonReader({
        totalProperty:"total",
        root:"rows"
    },internal_record);
    var internal_store = new Ext.data.Store({
        proxy : internal_proxy,
        reader : internal_reader
    });

	
	var internal_logBoxM = new Ext.grid.CheckboxSelectionModel();   //复选框
    var internal_logRowNumber = new Ext.grid.RowNumberer();         //自动 编号
    var internal_logColM = new Ext.grid.ColumnModel({
        columns:[
//            internal_logBoxM,
            internal_logRowNumber,
            {header:"下载本地日志文件名",dataIndex:"fileName",align:'center',sortable:true,renderer : internal_logDownloadShowUrl},
            {header:"描述",dataIndex:"fileName",align:'center',sortable:true,renderer : internal_descriptionShowUrl},
            {header:"操作标记",dataIndex:"fileName",align:'center',sortable:true,renderer : flag_showUrl}
        ],
        defaults:{sortable:false}//不允许客户端点击列头排序，可以打开s
    });
    var internal_logGrid = new Ext.grid.GridPanel({
        id:'internal.grid.info',
        store:internal_store,
        cm:internal_logColM,
//        sm:internal_logBoxM,
//        height:setHeight,
        columnLines:true,
        autoScroll:true,
        loadMask:{msg:'正在加载数据，请稍后...'},
        border:false,
        collapsible:false,
        stripeRows:true,
        autoExpandColumn:'Position',
        enableHdMenu:true,
        enableColumnHide:true,
        bodyStyle:'width:100%',
        selModel:new Ext.grid.RowSelectionModel({singleSelect:true}),
        viewConfig:{
            forceFit:true,
            enableRowBody:true,
            getRowClass:function(record,rowIndex,p,store){
                return 'x-grid3-row-collapsed';
            }
        },
        bbar:new Ext.PagingToolbar({
            pageSize : pageSize,
            store:internal_store,
            displayInfo:true,
            displayMsg:"显示第{0}条记录到第{1}条记录，一共{2}条",
            emptyMsg:"没有记录",
            beforePageText:"当前页",
            afterPageText:"共{0}页"
        })
    });
    new Ext.Viewport({
    	border:false,
    	renderTo:Ext.getBody(),
        layout:'fit',
        items:[internal_logGrid]
    });
    internal_store.load({params:{start:pageStart,limit:pageSize}});
});

function setHeight(){
	var h = document.body.clientHeight-8;
	return h;
}

function internal_logDownloadShowUrl(value){
	var type = 'internal_log';
	return "<a href='javascript:;' onclick='download_log(\""+value+"\",\""+type+"\");' style='color: green;'>"+value+"</a>";
}

function internal_descriptionShowUrl(value) {
    if(value.split('.')[0]=='platform') {
        return '平台业务运行日志'
    } else if(value.split('.')[0]=='stp') {
        return '配置管理日志'
    } else if(value.split('.')[0]=='service') {
        return '平台服务运行日志'
    }
}

function external_logDownloadShowUrl(value){
	var type = 'external_log';
	return "<a href='javascript:;' onclick='download_log(\""+value+"\",\""+type+"\");' style='color: green;'>"+value+"</a>";
}

function flag_showUrl(value){
    var type = 'internal_log';
    var download = "<a href='javascript:;' onclick='download_log(\""+value+"\",\""+type+"\");' style='color: green;'>下载</a>";
    var clear = "<a href='javascript:;' onclick='clearLog(\""+value+"\")' style='color: green;'>清空日志</a>";
    return download + "&nbsp;&nbsp;&nbsp;&nbsp;"+clear;
}

function download_log(logName,type){
    if (!Ext.fly('test')) {
        var frm = document.createElement('form');
        frm.id = 'test';
        frm.name = id;
        frm.style.display = 'none';
        document.body.appendChild(frm);
    }
    Ext.Ajax.request({
        url: '../../ManagerLogAction_download.action',
        params:{type:type,logName:logName },
        form: Ext.fly('test'),
        method: 'POST',
        isUpload: true
    });
}

function clearLog(fileName){
    var grid = Ext.getCmp('internal.grid.info');
    var store = grid.getStore();
    Ext.MessageBox.show({
        title:'信息',
        msg:'<font color="green">确定要清空'+fileName+'内容?请下载备份!</font>',
        width:360,
        buttons:{'ok':'确定','no':'取消'},
        icon:Ext.MessageBox.WARNING,
        closable:false,
        fn:function(e){
            if(e=='ok'){
                var formPanel = new Ext.form.FormPanel({
                    frame:true,
                    labelAlign:'right',
                    autoScroll:true,
                    labelWidth:100,
                    defaults:{
                        width:200,
                        allowBlank:false,
                        blankText:'该项不能为空！'
                    },
                    items:[{
                        id:'password.info',
                        fieldLabel:"请输入密码",
                        xtype:'textfield',
                        inputType: 'password',
                        name:'password',
                        emptyText :'请输入密码'
                    }]
                });
                var win = new Ext.Window({
                    title:"提示信息",
                    width:400,
                    height:110,
                    layout:'fit',
                    modal:true,
                    items: [formPanel],
                    bbar:[
                        new Ext.Toolbar.Fill(),
                        new Ext.Button ({
                            id:'ok.info',
                            text : '确定',
                            allowDepress : false,
                            handler : function() {
                                if(formPanel.form.isValid()){
                                    var myMask = new Ext.LoadMask(Ext.getBody(),{
                                        msg : '正在清空,请稍后...',
                                        removeMask : true
                                    });
                                    myMask.show();
                                    var password = Ext.getCmp('password.info').getValue();
                                    Ext.Ajax.request({
                                        url: '../../ManagerLogAction_clear.action',
                                        params : {logName:fileName,password:password},
                                        method :'POST',
                                        success:function(r,o){
                                            myMask.hide();
                                            var respText = Ext.util.JSON.decode(r.responseText);
                                            var msg = respText.msg;
                                            Ext.MessageBox.show({
                                                title:'信息',
                                                width:250,
                                                msg:msg,
                                                animEl:'ok.info',
                                                buttons:{'ok':'确定'},
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
                        }),
                        new Ext.Button ({
                            allowDepress : false,
                            text : '关闭',
                            handler : function() {win.close();}
                        })
                    ]
                }).show();
            }
        }
    });
}
