// 审计库配置
Ext.onReady(function() {
    Ext.BLANK_IMAGE_URL = '../../js/ext/resources/images/default/s.gif';
	Ext.QuickTips.init();

	Ext.form.Field.prototype.msgTarget = 'side';

	var listRecord = Ext.data.Record.create(['name']);

	var listStore = new Ext.data.Store({
		storeId : 'listStore',
		url : "../../ManagerDataBaseAction_showSqlFiles.action",
		reader : new Ext.data.JsonReader({
			totalProperty : 'total',
			root : "rows",
			id : 'name'
		}, listRecord)
	});

	var fp = new Ext.FormPanel({
		plain : true,
		autoScroll : true,
		border : false,
		layout : 'form',
		labelAlign : 'right',
        buttonAlign : 'left',
		labelWidth : 190,
		autoWidth : true,
		waitMsgTarget : true,
		renderTo : document.body,
		reader : new Ext.data.JsonReader({}, [{
			name : 'dbip'
		}, {
			name : 'dbport'
		}, {
			name : 'dbname'
		}, {
			name : 'username'
        }, {
            name : 'dbUsed'
        }, {
            name : '_disk'
        }, {
            name : 'disk'
		}, {
			name : 'backup_dbip'
		}, {
			name : 'backup_dbport'
		}, {
			name : 'backup_dbname'
		}, {
			name : 'backup_username'
		}]),
		items : [ new Ext.form.FieldSet({
            title : '数据库配置',
            autoHeight : true,
            autoWidth : true,
            defaultType : 'textfield',
                defaults:{
                width:200,
                allowBlank:false,
                blankText:'该项不能为空!'
            },
            items : [{
                fieldLabel : 'IP',
                name : 'dbip',
                id : 'dbip',
                width : 300,
                xtype:'displayfield',
                regex:/^(((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9]))$/,
                regexText:'这个不是IP(例:1.1.1.1)',
                emptyText:'请输入IP(例:1.1.1.1)'
            }, {
                fieldLabel : '数据库端口',
                name : 'dbport',
                id : 'dbport',
                width : 300,
                xtype:'displayfield',
                regex:/^(6553[0-6]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{3}|[1-9][0-9]{2}|[1-9][0-9]|[1-9])$/,
                regexText:'这个不是端口类型1—65536',
                emptyText:'请输入端口1—65536'
            }, {
                fieldLabel : '数据库名称',
                name : 'dbname',
                id : 'dbname',
                width : 300,
                xtype:'displayfield',
                regex:/^\w{1,63}$/,
                regexText:'只能输入1--63位英文字母、数字和下划线',
                emptyText:'请输入1--63位英文字母、数字和下划线'
            }, {
                fieldLabel : '用户名',
                name : 'username',
                id : 'username',
                xtype:'displayfield',
                width : 300,
                regex:/^\w{1,63}$/,
                regexText:'只能输入1--63位英文字母、数字和下划线',
                emptyText:'请输入1--63位英文字母、数字和下划线'
            }]
        }),new Ext.form.FieldSet({
            title : '报警阀值',
            autoHeight : true,
            autoWidth : true,
            defaultType : 'textfield',
//                layout:'form',
            items:[{
                width : 300,
                fieldLabel:"审计存储总容量",
                xtype:'displayfield',
                id:'disk'
            },{
                width : 300,
                fieldLabel:"审计存储容量报警阀值(%)",
                xtype:'textfield',
                id:'dbUsed.info',
                name:'dbUsed',
                regex:/^(100|[1-9][0-9]|[0-9])$/,
                regexText : '大小为[0-100]',
                emptyText : '大小为[0-100]',
                listeners:{
                    specialkey : function(textfield,e){
                        if(e.getKey() == Ext.EventObject.ENTER){
                            var dbUsed = this.getValue();
                            if(dbUsed>=0&&dbUsed<=100){
                                Ext.getCmp('dbUsed.slider.info').setValue(Number(dbUsed));
                            }else{
                                Ext.Msg.alert('修改失败', '请输入0—100之间的整数!');
                            }
                        }
                    }
                }
            },{
                width:300,
                fieldLabel:'滑动设置',
                id:'dbUsed.slider.info',
                xtype:'slider',
                increment:1,
                minValue:0,
                maxValue:100,
                plugins: new Ext.slider.Tip({
                    getText: function(thumb){
                        Ext.getCmp('dbUsed.info').setValue(thumb.value);
                        var disk = Ext.getCmp('_disk').getValue()*thumb.value*0.01;
                        Ext.getCmp('disk.alert.info').setValue(disk +' GB');
                        return String.format('<b>{0}% 开始报警</b>', thumb.value);
                    }
                })
            },{
                width : 300,
                fieldLabel:"报警阀值",
                xtype:'displayfield',
                id:'disk.alert.info'
            },{
                xtype:'hidden',
                id:'_disk'
            }]
        }), new Ext.form.FieldSet({
            title : '备份数据库配置',
            autoHeight : true,
            autoWidth : true,
            hidden : true,
            defaultType : 'textfield',
            items : [{
                fieldLabel : 'IP',
                name : 'backup_dbip',
                id : 'backup_dbip',
                width : 300
            }, {
                fieldLabel : '数据库端口',
                name : 'backup_dbport',
                id : 'backup_dbport',
                width : 300
            }, {
                fieldLabel : '数据库名称',
                name : 'backup_dbname',
                id : 'backup_dbname',
                width : 300
            }, {
                fieldLabel : '用户名',
                name : 'backup_username',
                id : 'backup_username',
                width : 300
            }]
	    })]
	});

	// 加载配置数据
	if (fp) {
		fp.getForm().load({
			url : '../../ManagerDataBaseAction_select.action',
            success : function(form,action){
                var dbUsed = Ext.getCmp('dbUsed.info').getValue();
                Ext.getCmp('dbUsed.slider.info').setValue(Number(dbUsed));
                var disk = Ext.getCmp('_disk').getValue()*dbUsed*0.01;
                Ext.getCmp('disk.alert.info').setValue(disk +' GB');
            },
			failure : function(form, action) {
				Ext.Msg.alert('错误', '加载数据出错！');
			}
		});
	}
    var button = new Ext.FormPanel({
		plain : true,
		border : false,
        buttonAlign : 'left',
		renderTo : document.body,
		buttons : [new Ext.Toolbar.Spacer({width:190}),{
			text : '备份数据信息导入',
			listeners : {
				'click' : function() {
					var window = new Ext.Window({
						width : 300,
						height : 400,
						modal : true,
						layout : 'border',
						title : '请选择要导入的备份数据信息备份文件',
						items : {
							id : 'grid',
							xtype : 'grid',
							region : 'center',
							border : false,
							store : listStore,
							columns : [new Ext.grid.RowNumberer({
								header : '',
								dataIndex : 'id',
								width : 24,
								align : 'center'
							}), {
								header : '名称',
								dataIndex : 'name',
								align : 'center',
								sortable : false,
								menuDisabled : true,
								width : 60
							}],
							viewConfig : {
								forceFit : true
							},
							loadMask : {
								msg : '正在加载数据,请稍侯……'
							},
							stripeRows : true,
							sm : new Ext.grid.RowSelectionModel({
								singleSelect : true
							})
						},
						closeAction : 'hide',
						buttons : [{
							xtype : "tbfill"
						}, {
							text : '导入',
							handler : function() {
								var selectGridRow = Ext.getCmp('grid').getSelectionModel().getSelected();
								if (!selectGridRow) {
									Ext.Msg.alert('警告', '请选中你要导入的文件！');
									return;
								}
								Ext.Ajax.request({
									url : '../../ManagerDataBaseAction_importConfigTables.action',
									params : {
										file : selectGridRow.data.name
									},
									success : function(response, options) {
										Ext.Msg.alert('导入成功', '导入成功！');
										window.close();
									}
								});
							}
						}, {
							text : '关闭',
							handler : function() {
								window.hide();
							}
						}],
						listeners : {
							'hide' : function() {

							}
						}
					});
					window.show();
					listStore.load();
				}
			}
		}, {
            id : 'update.info',
			text : '保存',
			listeners : {
				'click' : function() {
                    Ext.MessageBox.show({
                        title:'信息',
                        width:250,
                        msg:'确定要修改?',
                        animEl:'update.info',
                        buttons:{'ok':'继续','no':'取消'},
                        icon:Ext.MessageBox.WARNING,
                        closable:false,
                        fn:function(e){
                            if(e == 'ok'){
                                fp.getForm().submit({
                                    clientValidation : true,
                                    url : '../../ManagerDataBaseAction_update.action',
                                    waitTitle:'信息提示',
                                    waitMsg:'正在处理,请稍后...',
                                    success : function(form, action) {
                                        Ext.MessageBox.show({
                                            title:'信息',
                                            width:250,
                                            msg:action.result.msg,
                                            animEl:'update.info',
                                            buttons:{'ok':'确定'},
                                            icon:Ext.MessageBox.INFO,
                                            closable:false
                                        });
                                    }
                                });
                            }
                        }
                    });
				}
			}
		}, {
			text : '取消',
			listeners : {
				'click' : function() {
					fp.getForm().reset();
				}
			}
		}]
    });

    var formBack = new Ext.FormPanel({
		plain : true,
		title : '',
		border : false,
		labelAlign : 'right',
        buttonAlign :'left',
		labelWidth : 100,
		width : '100%',
		waitMsgTarget : true,
		renderTo : document.body,
		reader : new Ext.data.JsonReader({}, [{
			name : 'conf_type'
		}, {
			name : 'conf_time'
		}, {
			name : 'conf_day'
		}, {
			name : 'conf_time2'
		}, {
			name : 'conf_month_day'
		}, {
			name : 'conf_time3'
		}, {
			name : 'log_type'
		}, {
			name : 'log_time'
		}, {
			name : 'log_day'
		}, {
			name : 'log_time2'
		}, {
			name : 'log_month_day'
		}, {
			name : 'log_time3'
		}, {
			name : 'conf_file_path'
		}, {
			name : 'conf_enabled'
		}]),
		items : [new Ext.form.FieldSet({
			title : '配置信息备份设置',
			autoHeight : true,
			defaultType : 'textfield',
			items : [{
				xtype : 'compositefield',
				hideLabel : true,
				width : 190,
				items : [{
					name : 'conf_type',
					xtype : 'radio',
					inputValue : 'day',
					boxLabel : '按日备份'
				}, {
					xtype : 'textfield',
					name : 'conf_time',
					width : 50,
					value : '23:00',
                    regex:/^([0][0-9]|[1][0-9]|[2][0-3]|[0-9]):([0-5][0-9])$/,
                    regexText:'只能输入00:00--23:59',
                    emptyText:'请输入00:00--23:59'
				}]
			}, {
				xtype : 'compositefield',
				hideLabel : true,
				items : [{
					name : 'conf_type',
					xtype : 'radio',
					inputValue : 'week',
					boxLabel : '按周备份'
				}, {
					xtype : 'radiogroup',
					columns : 4,
					vertical : false,
					width : 300,
					items : [{
						boxLabel : '周一',
						inputValue : 1,
						name : 'conf_day'
					}, {
						boxLabel : '周二',
						inputValue : 2,
						name : 'conf_day'
					}, {
						boxLabel : '周三',
						inputValue : 3,
						name : 'conf_day'
					}, {
						boxLabel : '周四',
						inputValue : 4,
						name : 'conf_day'
					}, {
						boxLabel : '周五',
						inputValue : 5,
						name : 'conf_day'
					}, {
						boxLabel : '周六',
						inputValue : 6,
						name : 'conf_day'
					}, {
						boxLabel : '周日',
						inputValue : 7,
						name : 'conf_day'
					}],
					name : 'conf_day'
				}, {
					xtype : 'textfield',
					name : 'conf_time2',
					width : 50,
					value : '23:00',
                    regex:/^([0][0-9]|[1][0-9]|[2][0-3]|[0-9]):([0-5][0-9])$/,
                    regexText:'只能输入00:00--23:59',
                    emptyText:'请输入00:00--23:59'
				}]
			}, {
				xtype : 'compositefield',
				hideLabel : true,
				items : [{
					name : 'conf_type',
					xtype : 'radio',
					inputValue : 'month',
					boxLabel : '按月备份'
				}, {
					xtype : 'textfield',
					name : 'conf_month_day',
					width : 40,
                    regex:/^[1-9]|[1-2][0-9]|3[0-1]$/,
                    regexText:'只能输入0-31',
                    emptyText:'请输入0-31'
				}, {
					xtype : 'displayfield',
					value : '日'
				}, {
					xtype : 'textfield',
					name : 'conf_time3',
					width : 50,
					value : '23:00',
                    regex:/^([0][0-9]|[1][0-9]|[2][0-3]|[0-9]):([0-5][0-9])$/,
                    regexText:'只能输入00:00--23:59',
                    emptyText:'请输入00:00--23:59'
				}]
			}, {
				xtype : 'compositefield',
				hideLabel : true,
				items : [{
					xtype : 'displayfield',
					value : '备份目录：'
				}, {
					xtype : 'textfield',
					name : 'conf_file_path',
					width : 200,
                    regex:/^([\/].*)*$/,
                    regexText:'这个不是目录',
                    emptyText:'请输入目录'
				}]
			},{
				xtype : 'checkbox',
				boxLabel :'启用备份',
				hideLabel : true,
				inputValue : '1',
				id : 'conf_enabled',
				name : 'conf_enabled'
			}]
		}), new Ext.form.FieldSet({
			title : '日志备份设置',
			autoHeight : true,
			defaultType : 'textfield',
			hidden : true,
			items : [{
				xtype : 'compositefield',
				hideLabel : true,
				width : 190,
				items : [{
					name : 'log_type',
					xtype : 'radio',
					inputValue : 'day',
					boxLabel : '按日备份'
				}, {
					xtype : 'textfield',
					name : 'log_time',
					width : 60,
					value : '23:00'
				}]
			}, {
				xtype : 'compositefield',
				hideLabel : true,
				items : [{
					name : 'log_type',
					xtype : 'radio',
					inputValue : 'week',
					boxLabel : '按周备份'
				}, {
					xtype : 'radiogroup',
					columns : 4,
					vertical : false,
					width : 300,
					items : [{
						boxLabel : '周一',
						inputValue : 1,
						value : 1,
						name : 'log_day'
					}, {
						boxLabel : '周二',
						inputValue : 2,
						name : 'log_day'
					}, {
						boxLabel : '周三',
						inputValue : 3,
						name : 'log_day'
					}, {
						boxLabel : '周四',
						inputValue : 4,
						name : 'log_day'
					}, {
						boxLabel : '周五',
						inputValue : 5,
						name : 'log_day'
					}, {
						boxLabel : '周六',
						inputValue : 6,
						name : 'log_day'
					}, {
						boxLabel : '周日',
						inputValue : 7,
						name : 'log_day'
					}],
					name : 'log_day'
				}, {
					xtype : 'textfield',
					name : 'log_time2',
					width : 60,
					value : '23:00'
				}]
			}, {
				xtype : 'compositefield',
				hideLabel : true,
				items : [{
					name : 'log_type',
					xtype : 'radio',
					inputValue : 'month',
					boxLabel : '按月备份'
				}, {
					xtype : 'textfield',
					name : 'log_month_day',
					width : 40
				}, {
					xtype : 'displayfield',
					value : '日'
				}, {
					xtype : 'textfield',
					name : 'log_time3',
					width : 60,
					value : '23:00'
				}]
			}]
		})]
	});

	// 加载配置数据
	if (formBack) {
		formBack.getForm().load({
			url : '../../ManagerDataBaseAction_selectBackup.action',
			success : function(form, action) {

			},
			failure : function(form, action) {
				Ext.Msg.alert('错误', '加载数据出错！');
			}
		});
	}
    var buttonBack = new Ext.FormPanel({
		plain : true,
		border : false,
        buttonAlign : 'left',
		renderTo : document.body,
		buttons : [new Ext.Toolbar.Spacer({width:80}),{
            id : 'update.info',
			text : '保存',
			listeners : {
				'click' : function() {
                    Ext.MessageBox.show({
                        title:'信息',
                        width:250,
                        msg:'确定要修改?',
                        animEl:'update.info',
                        buttons:{'ok':'继续','no':'取消'},
                        icon:Ext.MessageBox.WARNING,
                        closable:false,
                        fn:function(e){
                            if(e == 'ok'){
                                formBack.getForm().submit({
                                    clientValidation : true,
                                    url : '../../ManagerDataBaseAction_updateBackup.action',
                                    waitTitle:'信息提示',
                                    waitMsg:'正在处理,请稍后...',
                                    success : function(form, action) {
                                        Ext.MessageBox.show({
                                            title:'信息',
                                            width:250,
                                            msg:action.result.msg,
                                            animEl:'update.info',
                                            buttons:{'ok':'确定'},
                                            icon:Ext.MessageBox.INFO,
                                            closable:false
                                        });
                                    }
                                });
                            }
                        }
                    });

				}
			}
		}]
    });

	var viewPort = new Ext.Viewport({
		layout : 'fit',
		border : false,
		items : [{frame:true,autoScroll :true,items:[fp,button,formBack,buttonBack]}]
	});

});
