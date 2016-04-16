/**
 * 通用代理非可信端纤细查看应用--业务管理员
 */
function external_detail_proxy_win(){
    var grid = Ext.getCmp('grid.proxy.external.info');
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
					width : 150,
					allowBlank : false,
					blankText : '该项不能为空！'
				},
                items:[{
                    fieldLabel:'应用编号',
                    value:item.data.appName
                },{
                    fieldLabel:'应用名',
                    value:item.data.appDesc
                },{
                    fieldLabel:'应用类型',
                    value:(item.data.appType=='proxy')?'通用代理应用管理':'<font color="red">应用类型出错</font>'
                },{
                    fieldLabel:'通道',
                    value:showURL_channel(item.data.channel)
                },{
                    fieldLabel:'启用状态',
                    value:showURL_isActive(item.data.isActive)
                },{
                    fieldLabel:'应用服务地址',
                    value:item.data.serverAddress
                },{
                    fieldLabel:'应用服务端口',
                    value:item.data.port
                },{
                    fieldLabel:'最小连接数',
                    value:item.data.poolMin
                },{
                    fieldLabel:'最大连接数',
                    value:item.data.poolMax
                },{
                    fieldLabel:'编码',
                    value:item.data.charset
                },{
                    fieldLabel:'重试次数',
                    value:item.data.tryTime
                },{
                    fieldLabel:'类型',
                    value:item.data.type
                }]
            });
        });
    }
    var win = new Ext.Window({
        title:"详细信息-非可信通用代理",
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
 * 重置应用状态
 */
function external_update_status(){
    var grid = Ext.getCmp('grid.proxy.external.info');
    var store = grid.getStore();
    var selModel = grid.getSelectionModel();
    var count = selModel.getCount();
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
            var appName = item.data.appName;
            Ext.MessageBox.show({
                title:'信息',
                msg:'<font color="green">确定要重置所选记录的状态？</font>',
                width:250,
                buttons:{'ok':'确定','no':'取消'},
                icon:Ext.MessageBox.INFO,
                closable:false,
                fn:function(e){
                    if(e == 'ok'){
                        var myMask = new Ext.LoadMask(Ext.getBody(),{
                            msg:'正在处理,请稍后...',
                            removeMask:true
                        });
                        myMask.show();
                        Ext.Ajax.request({
                            url : '../../AppTypeAction_initStatus.action',             // 删除 连接 到后台
                            params :{appName : appName},
                            success : function(r,o){
                                myMask.hide();
                                var respText = Ext.util.JSON.decode(r.responseText);
                                var msg = respText.msg;
                                Ext.MessageBox.show({
                                    title:'信息',
                                    msg:msg,
                                    width:300,
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