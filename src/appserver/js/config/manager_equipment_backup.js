/*
 *双机热备配置
 */

Ext.onReady(function() {
    Ext.BLANK_IMAGE_URL = '../../js/ext/resources/images/default/s.gif';
	Ext.QuickTips.init();
	Ext.form.Field.prototype.msgTarget = 'side';
    var start = 0;
    var pageSize = 10;

    /////////////////////////////////////////////////////////////////////////////////////

    var record_ping = new Ext.data.Record.create([
        {name:'ip',mapping:'ip'}
    ]);
    var proxy_ping = new Ext.data.HttpProxy({
        url:"../../SecurityConfigAction_selectPing.action"
    });
    var reader_ping = new Ext.data.JsonReader({
        totalProperty:"total",
        root:"rows"
    },record_ping);
    var store_ping = new Ext.data.GroupingStore({
        proxy : proxy_ping,
        reader : reader_ping
    });
    store_ping.load({
        params:{
            start:start,limit:pageSize
        }
    });
    var ip_edit_ping = new Ext.form.TextField({
        id:'ip_edit_ping.info',
        regex:/^(((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9]))$/,
        regexText:'这个不是IP(例:1.1.1.1)'
    });
    var boxM_ping = new Ext.grid.CheckboxSelectionModel();   //复选框
    var rowNumber_ping = new Ext.grid.RowNumberer();         //自动 编号
    var colM_ping = new Ext.grid.ColumnModel([
		boxM_ping,
        rowNumber_ping,
        {header:"IP地址",dataIndex:"ip",align:'center',menuDisabled:true,sortable:true,editor:ip_edit_ping}
    ]);
    var page_toolbar_ping = new Ext.PagingToolbar({
        pageSize : pageSize,
        store:store_ping,
        displayInfo:true,
        displayMsg:"显示第{0}条记录到第{1}条记录，一共{2}条",
        emptyMsg:"没有记录",
        beforePageText:"当前页",
        afterPageText:"共{0}页"
    });
    var grid_ping = new Ext.grid.EditorGridPanel({
        id:'grid.ping.info',
        plain:true,
        renderTo:Ext.getBody(),
        animCollapse:true,
        height:310,width:500,
        loadMask:{msg:'正在加载数据,请稍后...'},
        border:false,
        collapsible:false,
        heightIncrement:true,
        cm:colM_ping,
        sm:boxM_ping,
        store:store_ping,
        clicksToEdit:1,
        autoExpandColumn:2,
        disableSelection:true,
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
                id:'btnAdd.info',
                text:'新增',
                iconCls:'add',
                handler:function(){
                    grid_ping.stopEditing();
                    grid_ping.getStore().insert(
                        0,
                        new record_ping({
                            ip:'',
                            flag:2
                        })
                    );
                    grid_ping.startEditing(0,0);
                }
            }),
            {xtype:"tbseparator"},
            new Ext.Button ({
                id : 'btnRemove.info',
                text : '删除',
                iconCls : 'delete',
                handler : function() {
                    deleteGridRow(grid_ping,store_ping);
                }
            }),
            {xtype:"tbseparator"},
            new Ext.Button({
                id:'btnSave.info',
                text:'保存',
                iconCls:'add',
                handler:function(){
                    insertGridFormWin(grid_ping,store_ping);
                }
            })
        ],
        view:new Ext.grid.GroupingView({
            forceFit:true,
            groupingTextTpl:'{text}({[values.rs.length]}条记录)'
        }),
        bbar:page_toolbar_ping
    });

    /////////////////////////////////////////////////////////////////////////////////////

    var record_telnet = new Ext.data.Record.create([
        {name:'ip',mapping:'ip'}
    ]);
    var proxy_telnet = new Ext.data.HttpProxy({
        url:"../../SecurityConfigAction_selectTelnet.action"
    });
    var reader_telnet = new Ext.data.JsonReader({
        totalProperty:"total",
        root:"rows"
    },record_telnet);
    var store_telnet = new Ext.data.GroupingStore({
        proxy : proxy_telnet,
        reader : reader_telnet
    });
    store_telnet.load({
        params:{
            start:start,limit:pageSize
        }
    });
    var ip_edit_tenet = new Ext.form.TextField({
        id:'ip_edit_tenet.info',
        regex:/^(((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9]))$/,
        regexText:'这个不是IP(例:1.1.1.1)'
    });
    var boxM_telnet = new Ext.grid.CheckboxSelectionModel();   //复选框
    var rowNumber_telnet = new Ext.grid.RowNumberer();         //自动 编号
    var colM_telnet = new Ext.grid.ColumnModel([
		boxM_telnet,
        rowNumber_telnet,
        {header:"IP地址",dataIndex:"ip",align:'center',menuDisabled:true,sortable:true,editor:ip_edit_tenet}
    ]);
    var page_toolbar_telnet = new Ext.PagingToolbar({
        pageSize : pageSize,
        store:store_telnet,
        displayInfo:true,
        displayMsg:"显示第{0}条记录到第{1}条记录，一共{2}条",
        emptyMsg:"没有记录",
        beforePageText:"当前页",
        afterPageText:"共{0}页"
    });
    var grid_telnet = new Ext.grid.EditorGridPanel({
        id:'grid.telnet.info',
        plain:true,
        renderTo:Ext.getBody(),
        animCollapse:true,
        height:310,width:500,
        loadMask:{msg:'正在加载数据,请稍后...'},
        border:false,
        collapsible:false,
        heightIncrement:true,
        cm:colM_telnet,
        sm:boxM_telnet,
        store:store_telnet,
        clicksToEdit:1,
        autoExpandColumn:2,
        disableSelection:true,
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
                id:'btnAdd.info',
                text:'新增',
                iconCls:'add',
                handler:function(){
                    grid_telnet.stopEditing();
                    grid_telnet.getStore().insert(
                        0,
                        new record_telnet({
                            ip:'',
                            flag:2
                        })
                    );
                    grid_telnet.startEditing(0,0);
                }
            }),
            {xtype:"tbseparator"},
            new Ext.Button ({
                id : 'btnRemove.info',
                text : '删除',
                iconCls : 'delete',
                handler : function() {
                    deleteGridRow(grid_telnet,store_telnet);
                }
            }),
            {xtype:"tbseparator"},
            new Ext.Button({
                id:'btnSave.info',
                text:'保存',
                iconCls:'add',
                handler:function(){
                    insertGridFormWin(grid_telnet,store_telnet);
                }
            })
        ],
        view:new Ext.grid.GroupingView({
            forceFit:true,
            groupingTextTpl:'{text}({[values.rs.length]}条记录)'
        }),
        bbar:page_toolbar_telnet
    });

    /////////////////////////////////////////////////////////////////////////////////////

    var record_514 = new Ext.data.Record.create([
        {name:'ip',mapping:'ip'}
    ]);
    var proxy_514 = new Ext.data.HttpProxy({
        url:"../../SecurityConfigAction_select514.action"
    });
    var reader_514 = new Ext.data.JsonReader({
        totalProperty:"total",
        root:"rows"
    },record_514);
    var store_514 = new Ext.data.GroupingStore({
        proxy : proxy_514,
        reader : reader_514
    });
    store_514.load({
        params:{
            start:start,limit:pageSize
        }
    });
    var ip_edit_514 = new Ext.form.TextField({
        id:'ip_edit_514.info',
        regex:/^(((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9]))$/,
        regexText:'这个不是IP(例:1.1.1.1)'
    });
    var boxM_514 = new Ext.grid.CheckboxSelectionModel();   //复选框
    var rowNumber_514 = new Ext.grid.RowNumberer();         //自动 编号
    var colM_514 = new Ext.grid.ColumnModel([
		boxM_514,
        rowNumber_514,
        {header:"IP地址",dataIndex:"ip",align:'center',menuDisabled:true,sortable:true,editor:ip_edit_514}
    ]);
    var page_toolbar_514 = new Ext.PagingToolbar({
        pageSize : pageSize,
        store:store_514,
        displayInfo:true,
        displayMsg:"显示第{0}条记录到第{1}条记录，一共{2}条",
        emptyMsg:"没有记录",
        beforePageText:"当前页",
        afterPageText:"共{0}页"
    });
    var grid_514 = new Ext.grid.EditorGridPanel({
        id:'grid.514.info',
        plain:true,
        renderTo:Ext.getBody(),
        animCollapse:true,
        height:310,width:500,
        loadMask:{msg:'正在加载数据,请稍后...'},
        border:false,
        collapsible:false,
        heightIncrement:true,
        cm:colM_514,
        sm:boxM_514,
        store:store_514,
        clicksToEdit:1,
        autoExpandColumn:2,
        disableSelection:true,
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
                id:'btnAdd.info',
                text:'新增',
                iconCls:'add',
                handler:function(){
                    grid_514.stopEditing();
                    grid_514.getStore().insert(
                        0,
                        new record_514({
                            ip:'',
                            flag:2
                        })
                    );
                    grid_514.startEditing(0,0);
                }
            }),
            {xtype:"tbseparator"},
            new Ext.Button ({
                id : 'btnRemove.info',
                text : '删除',
                iconCls : 'delete',
                handler : function() {
                    deleteGridRow(grid_514,store_514);
                }
            }),
            {xtype:"tbseparator"},
            new Ext.Button({
                id:'btnSave.info',
                text:'保存',
                iconCls:'add',
                handler:function(){
                    insertGridFormWin(grid_514,store_514);
                }
            })
        ],
        view:new Ext.grid.GroupingView({
            forceFit:true,
            groupingTextTpl:'{text}({[values.rs.length]}条记录)'
        }),
        bbar:page_toolbar_514
    });

    /////////////////////////////////////////////////////////////////////////////////////

	var fp = new Ext.FormPanel({
		plain : true,
		border : false,
		labelAlign : 'right',
		labelWidth : 120,
		width : '100%',
		waitMsgTarget : true,
        autoScroll:true,
//        layout:'column',
		items : [new Ext.form.FieldSet({
			title : '列表',
			autoHeight : true,
            width:400,
			items : [{
                fieldLabel:'设备类型',
                xtype:'displayfield',
                value:'主设备'
            },{
                fieldLabel:'对应设备的IP',
                xtype:'textfield',
                value:'192.168.2.206'
            }]
		}), new Ext.form.FieldSet({
			title : 'PING 列表',
			autoHeight : true,
            width:400,
			items : [grid_ping]
		}), new Ext.form.FieldSet({
			title : 'TELNET 列表',
			autoHeight : true,
            width:400,
			items : [grid_telnet]
		}),new Ext.form.FieldSet({
			title : '514 列表',
			autoHeight : true,
            width:400,
			items : [grid_514]
		})]
	});
	// 加载配置数据
	/*if (fp) {
        var myMask = new Ext.LoadMask(Ext.getBody(),{
            msg : '正在加载数据,请稍后...',
            removeMask:true
        });
        myMask.show();
		Ext.Ajax.request({
			url : '../../AlertManagerAction_loadConfig.action',
			params : {
				dc : new Date()
			},
			success : function(response, opts) {
				var data = Ext.util.JSON.decode(response.responseText);
                Ext.fly("server").dom.value = data.server;
                myMask.hide();
            },
			failure : function(response, opts) {
                myMask.hide();
				Ext.Msg.alert('', "加载配置数据失败，请重试！");
			}
		});
	}*/
    var button = new Ext.FormPanel({
		plain : true,
		border : false,
        buttonAlign : 'left',
		renderTo : document.body,
		buttons : [new Ext.Toolbar.Spacer({width:120}),{
			text : '测试',
			listeners : {
				click : function() {
//					Ext.Msg.alert('温馨提示', '该功能暂时未开放...');
                    Ext.Msg.show({
						width : 200,
						title : "输入接收手机号码",
						prompt : true,
						buttons : Ext.Msg.OKCANCEL,
						fn : function(btnId, text, opt) {
							if (btnId == "ok") {
                                var myMask = new Ext.LoadMask(Ext.getBody(),{
                                    msg : '正在处理,请稍后...',
                                    removeMask:true
                                });
                                myMask.show();
								Ext.Ajax.request({
									url : '../../AlertManagerAction_validateShortMessage.action',
									params : {
										contact : text
									},
									success : function(response, opts) {
                                        var respText = Ext.util.JSON.decode(response.responseText);
                                        var msg = respText.msg;
                                        myMask.hide();
										Ext.Msg.alert('温馨提示', msg);
									}
								});
							}
						}
					});
				}
			}
		}, {
			text : '邮件测试',
			listeners : {
				click : function() {
					Ext.Msg.show({
						width : 200,
						title : "输入接收邮件的邮箱地址",
						prompt : true,
						buttons : Ext.Msg.OKCANCEL,
						fn : function(btnId, text, opt) {
							if (btnId == "ok") {
                                var myMask = new Ext.LoadMask(Ext.getBody(),{
                                    msg : '正在处理,请稍后...',
                                    removeMask:true
                                });
                                myMask.show();
								Ext.Ajax.request({
									url : '../../AlertManagerAction_validateEmail.action',
									params : {
										contact : text
									},
									success : function(response, opts) {
                                        var respText = Ext.util.JSON.decode(response.responseText);
                                        var msg = respText.msg;
                                        myMask.hide();
										Ext.Msg.alert('温馨提示', msg);
									}
								});
							}
						}
					});
				}
			}
		}, {
			text : '保存',
			listeners : {
				click : function() {
					fp.getForm().submit({
						clientValidation : true,
						url: '../../AlertManagerAction_saveConfig.action',
                        waitTitle :'系统提示',
                        waitMsg :'正在处理...',
						params : {
							newStatus : 'delivered'
						},
						success : function(form, action) {
							Ext.Msg.alert('温馨提示', action.result.msg);
						}
					});

				}
			}
		}]
	});
	new Ext.Viewport({
        renderTo:Ext.getBody(),
		layout : 'fit',
		border : false,
		items : [fp]
	});
});
