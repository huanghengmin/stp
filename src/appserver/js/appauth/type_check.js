
function check_insert(grid,store,appName,appType){
    var formPanel = new Ext.form.FormPanel({
        labelWidth:100,
        frame:true,
        autoScroll:true,
        labelAlign:'right',
        defaultType:'displayfield',
        defaults : {
            width : 230,
            allowBlank : false,
            blankText : '该项不能为空！'
        },
        items:[{
            width:370,
            title:'应用审核  -- 使用说明',
            xtype:'fieldset',
            html:"<font color='green'>1.用于审核应用"+appName+"是否正确;<br>2.审核完添加批注信息给配置管理员,并让其修改或回应!</font>"
        },{
            xtype:'hidden',
            name:'typeCheck.appName',
            value:appName
        },{
            xtype:'hidden',
            name:'typeCheck.appType',
            value:appType
        },{
            xtype:'hidden',
            name:'typeCheck.up',
            value:0
        },{
            xtype:'displayfield',
            fieldLabel:'应用编号',
            value:appName
        },{
            xtype:'displayfield',
            fieldLabel:'应用类型',
            value:appType
        },{
            xtype:'textarea',
            fieldLabel:'批注内容',
            name:'typeCheck.desc',
            regex:/^.{0,500}$/,
            regexText:'请输入任意500个以内字符',
            emptyText:'请输入任意500个以内字符'
        }]
    });
    var win = new Ext.Window({
        title:"批注应用",
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
                handler : function() {
                    if (formPanel.form.isValid()) {
                        formPanel.getForm().submit({
                            url :'../../TypeCheckAction_insert.action',
                            method :'POST',
                            waitTitle :'系统提示',
                            waitMsg :'正在保存,请稍后...',
                            success : function(form,action) {
                                Ext.MessageBox.show({
                                    title:'信息',
                                    width:250,
                                    msg:action.result.msg,
                                    animEl:'check.update.info',
                                    buttons:Ext.MessageBox.YESNO,
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
                    } else {
                        Ext.MessageBox.show({
                            title:'信息',
                            width:250,
                            msg:'请填写完成再提交!',
                            animEl:'check.update.info',
                            buttons:Ext.MessageBox.OK,
                            buttons:{'ok':'确定'},
                            icon:Ext.MessageBox.ERROR,
                            closable:false
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

function check_delete(grid,store){
    var selModel = grid.getSelectionModel();
    var count = selModel.getCount();
    if(count==0){
        Ext.MessageBox.show({
            title:'信息',
            msg:'<font color="green">您没有勾选任何记录!</font>',
            animEl:'delete.check.info',
            buttons:Ext.Msg.OK,
            buttons:{'ok':'确定'},
            icon:Ext.MessageBox.INFO,
            closable:false
        });
    }else if(count>0){
        var ids = new Array();
        var record = grid.getSelectionModel().getSelections();
        for(var i = 0; i < record.length; i++){
            ids[i] = record[i].get('id');
        }
        Ext.MessageBox.show({
            title:'信息',
            msg:'<font color="green">确定要删除所选记录？</font>',
            animEl:'delete.check.info',
            width:300,
            buttons:Ext.Msg.YESNO,
            buttons:{'ok':'确定','no':'取消'},
            icon:Ext.MessageBox.INFO,
            closable:false,
            fn:function(e){
                if(e == 'ok'){
                    var myMask = new Ext.LoadMask(Ext.getBody(),{
                        msg:'正在删除,请稍后...',
                        removeMask:true
                    });
                    myMask.show();
                    Ext.Ajax.request({
                        url : '../../TypeCheckAction_delete.action',
                        params :{ids : ids},
                        success : function(r,o){
                            var respText = Ext.util.JSON.decode(r.responseText);
                            var msg = respText.msg;
                            myMask.hide();
                            Ext.MessageBox.show({
                                title:'信息',
                                msg:msg,
                                animEl:'delete.check.info',
                                width:250,
                                buttons:Ext.MessageBox.OK,
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
    }
}

function check_update(){
    var grid = Ext.getCmp('grid.check.info');
    var store = grid.getStore();
    var selModel = grid.getSelectionModel();
    var formPanel;
    var reDesc;
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
            reDesc = item.data.reDesc;

            formPanel = new Ext.form.FormPanel({
                labelWidth:100,
                frame:true,
                autoScroll:true,
                labelAlign:'right',
                defaultType:'displayfield',
                defaults : {
                    width : 200,
                    allowBlank : false,
                    blankText : '该项不能为空！'
                },
                items:[{
                    width:350,
                    title:'应用批注  -- 使用说明',
                    xtype:'fieldset',
                    html:"<font color='green'>1.用于审核应用"+item.data.appName+"是否正确;<br>2.审核完添加批注信息给配置管理员,并让其修改或回应!</font>"
                },{
                    xtype:'hidden',
                    name:'typeCheck.id',
                    value:item.data.id
                },{
                    xtype:'hidden',
                    name:'typeCheck.appName',
                    value:item.data.appName
                },{
                    xtype:'hidden',
                    name:'typeCheck.appType',
                    value:item.data.appType
                },{
                    xtype:'hidden',
                    name:'typeCheck.up',
                    value:0
                },{
                    xtype:'displayfield',
                    fieldLabel:'应用编号',
                    value:item.data.appName
                },{
                    xtype:'displayfield',
                    fieldLabel:'应用类型',
                    value:item.data.appName
                },{
                    xtype:'displayfield',
                    fieldLabel:'是否已有回应',
                    value:check_showURL_update(item.data.up)
                },{
                    xtype:'textarea',
                    fieldLabel:'批注内容',
                    name:'typeCheck.desc',
                    value:item.data.desc,
                    regex:/^.{0,500}$/,
                    regexText:'请输入任意500个以内字符',
                    emptyText:'请输入任意500个以内字符'
                },{
                    id:'reDesc.update.info',
                    fieldLabel:'回应信息',
                    name:'typeCheck.reDesc',
                    value:item.data.reDesc
                }]
            });
        });
    }
    var win = new Ext.Window({
        title:"修改批注",
        width:400,
        height:300,
        layout:'fit',
        modal:true,
        items: [formPanel],
        listeners:{
            show:function(){
                if(reDesc=='null'){
                    Ext.getCmp('reDesc.update.info').destroy();
                }
            }
        },
        bbar:[
            new Ext.Toolbar.Fill(),
            new Ext.Button ({
                id : 'check.update.info',
                text : '修改',
                allowDepress : false,
                handler : function() {
                    if (formPanel.form.isValid()) {
                        Ext.MessageBox.show({
                            title:'信息',
                            width:250,
                            msg:'是否确定要修改批注?',
                            animEl:'check.update.info',
                            buttons:Ext.MessageBox.YESNO,
                            buttons:{'ok':'确定','no':'取消'},
                            icon:Ext.MessageBox.WARNING,
                            closable:false,
                            fn:function(e){
                                if(e=='ok'){
                                    formPanel.getForm().submit({
                                        url :'../../TypeCheckAction_update.action',
                                        method :'POST',
                                        waitTitle :'系统提示',
                                        waitMsg :'正在修改,请稍后...',
                                        success : function(form,action) {
                                            Ext.MessageBox.show({
                                                title:'信息',
                                                width:250,
                                                msg:action.result.msg,
                                                animEl:'check.update.info',
                                                buttons:Ext.MessageBox.YESNO,
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
                            animEl:'check.update.info',
                            buttons:Ext.MessageBox.OK,
                            buttons:{'ok':'确定'},
                            icon:Ext.MessageBox.ERROR,
                            closable:false
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

function check_showURL_update(value){
        if(value==1){
            return '<font color="green">已回应</font>';
        } else if(value==0){
            return '<font color="red">未回应</font>';
        }
    }