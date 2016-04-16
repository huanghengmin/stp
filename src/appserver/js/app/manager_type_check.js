/**
 * 未通过审核的应用管理
 */
Ext.onReady(function(){
    Ext.BLANK_IMAGE_URL = '../../js/ext/resources/images/default/s.gif';
    Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget = 'side';
    var start = 0;
    var pageSize = 15;
    var toolbar = new Ext.Toolbar({
        plain:true,
        width : 600,
        height : 30,
        items : [ '应用编号',{
            id:'appName.tb.info',
            xtype:'textfield',
            emptyText :'输入应用编号',
            width : 100
        },{
            xtype : 'tbseparator'
        },'应用类型',{
            id : 'appType.tb.info',
            xtype : 'combo',
            store : new Ext.data.ArrayStore({
                autoDestroy : true,
                fields : ['value', 'key'],
                data : [
                    ['db', '数据库同步'],
                    ['file', '文件同步'],
                    ['proxy', '通用代理']
                ]
            }),
            valueField : 'value',
            displayField : 'key',
            mode : 'local',
            forceSelection : true,
            triggerAction : 'all',
            emptyText : '--请选择--',
            value : '',
            selectOnFocus : true,
            width : 100
        }, {
            xtype : 'tbseparator'
        }, '是否修改',{
            id : 'update.tb.info',
            xtype : 'combo',
            store : new Ext.data.ArrayStore({
                autoDestroy : true,
                fields : ['value', 'key'],
                data : [
                    ['0', '未通过审核'],
                    ['1', '已回应审核']
                ]
            }),
            valueField : 'value',
            displayField : 'key',
            mode : 'local',
            forceSelection : true,
            triggerAction : 'all',
            emptyText : '--请选择--',
            value : '',
            selectOnFocus : true,
            width : 100
        }, {
            xtype : 'tbseparator'
        }, {
            text : '查询',
            listeners : {
                click : function() {
                    var update = Ext.fly('update.tb.info').dom.value == '--请选择--'
                        ? null
                        : Ext.getCmp('update.tb.info').getValue();
                    var appName = Ext.fly("appName.tb.info").dom.value == '输入应用编号'
                        ? null
                        : Ext.getCmp('appName.tb.info').getValue();
                    var appType = Ext.fly('appType.tb.info').dom.value == '--请选择--'
                        ? null
                        :Ext.getCmp('appType.tb.info').getValue();
                    store.setBaseParam('up', update);
                    store.setBaseParam('appName', appName);
                    store.setBaseParam('appType', appType);
                    store.load({
                        params : {
                            start : start,
                            limit : pageSize
                        }
                    });
                }
            }
        }]
    });
    var check_record = new Ext.data.Record.create([
	    {name:'appName',	mapping:'appName'},
	    {name:'appType',	mapping:'appType'},
	    {name:'up',        mapping:'up'},
        {name:'desc',		mapping:'desc'},
        {name:'reDesc',   mapping:'reDesc'},
	    {name:'id',		mapping:'id'}
    ]);
    var store = new Ext.data.GroupingStore({
        proxy : new Ext.data.HttpProxy({ url:'../../TypeCheckAction_select.action' }),
        reader : new Ext.data.JsonReader({ totalProperty:'total', root:'rows' },check_record)
    });

    var check_boxM = new Ext.grid.CheckboxSelectionModel();   //复选框
    var check_rowNumber = new Ext.grid.RowNumberer();         //自动 编号
    var check_colM = new Ext.grid.ColumnModel([
//        check_boxM,
        check_rowNumber,
        {header:"应用编号",	dataIndex:"appName",	align:'center',menuDisabled:true},
        {header:'应用类型',	dataIndex:'appType',	align:'center',menuDisabled:true},
        {header:'已通过审核',	dataIndex:'up',	align:'center',menuDisabled:true,renderer:check_showURL_update},
        {header:'审核信息',	dataIndex:'desc',		align:'center',menuDisabled:true},
        {header:'回应信息',	dataIndex:'reDesc',	align:'center',menuDisabled:true,renderer:check_showURL_reDesc},
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
        height : setHeight(),
        width : setWidth(),
        cm:check_colM,
//        sm:check_boxM,
        store:store,
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
        tbar:[new Ext.Button({
            id:'change.check.info',
            text:'标记',
            iconCls:'change',
            handler:function(){
                check_change(gridPanel,store);
            }
        }),{
            xtype : 'tbseparator'
        },toolbar],
        view:new Ext.grid.GroupingView({
            forceFit:true,
            groupingTextTpl:'{text}({[values.rs.length]}条记录)'
        }),
        bbar:new Ext.PagingToolbar({
            pageSize : pageSize,
            store:store,
            displayInfo:true,
            displayMsg:"显示第{0}条记录到第{1}条记录，一共{2}条",
            emptyMsg:"没有记录",
            beforePageText:"当前页",
            afterPageText:"共{0}页"
        })
    });

    var port = new Ext.Viewport({
        layout:'fit',
        renderTo: Ext.getBody(),
        items:[gridPanel]
    });
    store.load({params:{ start:start,limit:pageSize,up:0} });
});


function setHeight(){
	var h = document.body.clientHeight-8;
	return h;
}

function setWidth(){
    return document.body.clientWidth-8;
}
//============================================ -- javascript function -- =============================================================================

function check_showURL_update(value){
    if(value==1){
        return '<font color="green">已回应审核</font>';
    } else if(value==0){
        return '<font color="red">未通过审核</font>';
    }
}

function check_showURL_reDesc(value){
    if(value=='null'||value==''){
        return "<font color='red'>配置管理员还没有查看或回应过!</font>"
    }else{
        return "<font color='green'>"+value+"</font> "
    }
}

function check_showURL_flag(value){
    return "<a href='javascript:;' style='color: green;' onclick='check_update();'>回应审核批注</a>";
}

/*function check_delete(grid,store){
    var selModel = grid.getSelectionModel();
    var count = selModel.getCount();
    if(count==0){
        Ext.MessageBox.show({
            title:'信息',
            msg:'<font color="green">您没有勾选任何记录!</font>',
            animEl:'delete.check.info',
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
}*/

function check_change(grid,store){
    var selModel = grid.getSelectionModel();
    var count = selModel.getCount();
    if(count==0){
        Ext.MessageBox.show({
            title:'信息',
            msg:'<font color="green">您没有勾选任何记录!</font>',
            animEl:'change.check.info',
            buttons:{'ok':'确定'},
            icon:Ext.MessageBox.INFO,
            closable:false
        });
    }else if(count>0){
        var ids = new Array();
        var record = grid.getSelectionModel().getSelections();
        var flag = false;
        for(var i = 0; i < record.length; i++){
            ids[i] = record[i].get('id');
            if(record[i].get('up')==1){
                flag = true;
                break;
            }
        }
        if(flag){
            Ext.MessageBox.show({
                title:'信息',
                msg:'<font color="red">您勾选的记录中存在已经通过审核的记录!</font>',
                animEl:'change.check.info',
                buttons:{'ok':'确定'},
                icon:Ext.MessageBox.WARNING,
                closable:false
            });
        } else {
            Ext.MessageBox.show({
                title:'信息',
                msg:'<font color="green">确定要标记所选记录为已通过审核？</font>',
                animEl:'change.check.info',
                width:300,
                buttons:{'ok':'确定','no':'取消'},
                icon:Ext.MessageBox.INFO,
                closable:false,
                fn:function(e){
                    if(e == 'ok'){
                        var myMask = new Ext.LoadMask(Ext.getBody(),{
                            msg:'正在标记,请稍后...',
                            removeMask:true
                        });
                        myMask.show();
                        Ext.Ajax.request({
                            url : '../../TypeCheckAction_change.action',
                            params :{ids : ids},
                            success : function(r,o){
                                var respText = Ext.util.JSON.decode(r.responseText);
                                var msg = respText.msg;
                                myMask.hide();
                                Ext.MessageBox.show({
                                    title:'信息',
                                    msg:msg,
                                    animEl:'change.check.info',
                                    width:250,
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
}

function check_update(){
    var grid = Ext.getCmp('grid.check.info');
    var store = grid.getStore();
    var selModel = grid.getSelectionModel();
    var formPanel;
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
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
                    html:"<font color='green'>1.用于管理未通过审核的应用"+item.data.appName+";<br>2.处理完的信息可给授权管理员查看并让其查看!</font>"
                },{
                    xtype:'hidden',
                    name:'typeCheck.appName',
                    value:item.data.appName
                },{
                    xtype:'hidden',
                    name:'typeCheck.id',
                    value:item.data.id
                },{
                    xtype:'hidden',
                    name:'typeCheck.appType',
                    value:item.data.appType
                },{
                    xtype:'hidden',
                    name:'typeCheck.up',
                    value:1
                },{
                    fieldLabel:'应用编号',
                    value:item.data.appName
                },{
                    fieldLabel:'应用类型',
                    value:item.data.appName
                },{
                    fieldLabel:'已通过审核',
                    value:check_showURL_update(item.data.up)
                },{
                    fieldLabel:'审核内容',
                    value:item.data.desc
                },{
                    xtype:'hidden',
                    name:'typeCheck.desc',
                    value:item.data.desc
                },{
                    xtype:'textarea',
                    fieldLabel:'回应内容',
                    name:'typeCheck.reDesc',
                    value:(item.data.reDesc=='null'?"":item.data.reDesc),
                    regex:/^.{0,500}$/,
                    regexText:'请输入任意500个以内字符',
                    emptyText:'请输入任意500个以内字符'
                }]
            });
        });
    }
    var win = new Ext.Window({
        title:"管理审核批注内容",
        width:600,
        height:380,
        layout:'fit',
        modal:true,
        items: [formPanel],
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
                            msg:'确定要修改审核后的批注?',
                            animEl:'check.update.info',
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
