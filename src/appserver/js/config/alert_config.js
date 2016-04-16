/*
 *报警配置
 */

Ext.onReady(function() {

	Ext.QuickTips.init();

	// turn on validation errors beside the field globally
	Ext.form.Field.prototype.msgTarget = 'side';
	var fp = new Ext.FormPanel({
		plain : true,
		border : false,
		labelAlign : 'right',
		labelWidth : 140,
		width : '100%',
		waitMsgTarget : true,
		renderTo : document.body,

		items : [new Ext.form.FieldSet({
			title : '邮件报警设置',
			autoHeight : true,
			defaultType : 'textfield',
            width:450,
            defaults:{
                allowBlank:false,
                blankText:'该项不能为空!',
                width:200
            },
			items : [{
				fieldLabel : '邮件服务器地址',
				name : 'server',
				id : 'server',
                regex:/^[\w\.]+\w$/,
                regexText:'只能输入(例:smtp.sina.com)',
                emptyText:'请输入(例:smtp.sina.com)'
			}, {
				fieldLabel : '端口',
				name : 'port',
				id : 'port',
                regex:/^(6553[0-6]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{3}|[1-9][0-9]{2}|[1-9][0-9]|[1-9])$/,
                regexText:'这个不是端口类型1~65536',
                emptyText:'请输入端口1~65536'
			}, {
				fieldLabel : '邮箱地址',
				name : 'email',
				id : 'email',
				vtype : 'email',
                regex:/^\w+[\w.]*@[\w.]+\.\w+$/,
                regexText:'请输入(例:xiaom@hzih.com)',
                emptyText:'请输入(例:xiaom@hzih.com)'
			}, {
				fieldLabel : '用户名',
				name : 'account',
				id : 'account',
                regex:/^(\w{1,63})|(\w+[\w.]*@[\w.]+\.\w+)$/,
                regexText:'只能输入1--63位英文字母、数字和下划线或者(例:xiaom@hzih.com)',
                emptyText:'请输入1--63位英文字母、数字和下划线或者(例:xiaom@hzih.com)'
			}, {
				fieldLabel : '密码',
				name : 'password',
				id : 'password',
				inputType : 'password',
                regex:/^[\@A-Za-z0-9\!\#\$\%\^\&\*\.\~_]{6,22}$/,
                regexText:'只能输入6--22位(a-z、A-Z、0-9、~、!、@、#、$、%、^、&、*或_)',
                emptyText:'请输入6--22位(a-z、A-Z、0-9、~、!、@、#、$、%、^、&、*或_)'
			}, {
				fieldLabel : '报警标题',
				name : 'title',
				id : 'title',
                regex:/^.{1,500}$/,
                regexText:'只能输入1--500位任意字符',
                emptyText:'请输入1--500位任意字符'
			}, {
				fieldLabel : '报警频率(分钟)',
				name : 'mailfrequency',
				id : 'mailfrequency',
                regex:/^([1-9]([0-9]{0,5}|[0-9]{0,4}|[0-9]{0,3}|[0-9]{0,2}|[0-9]|[0-9]{0}))$/,
                regexText:'这个不是数字1--999999(单位:分钟)',
                emptyText:'请输入数字1--999999(单位:分钟)'
			}]
		}), new Ext.form.FieldSet({
			title : '短信报警设置',
			autoHeight : true,
			defaultType : 'textfield',
            width:450,
            defaults:{
                allowBlank:false,
                blankText:'该项不能为空!',
                width:200
            },
			items : [{
				fieldLabel : '服务中心号码',
				name : 'smsnumber',
				id : 'smsnumber',
                regex:/^\d{1,20}$/,
                regexText:'这个不是1-20位的数字',
                emptyText:'请输入1-20位的数字'
			}, {
				fieldLabel : '报警标题',
				name : 'smstitle',
				id : 'smstitle',
                regex:/^.{1,500}$/,
                regexText:'只能输入1--500位任意字符',
                emptyText:'请输入1--500位任意字符'
			}, {
				fieldLabel : '报警频率(分钟)',
				name : 'smsfrequency',
				id : 'smsfrequency',
                regex:/^([1-9]([0-9]{0,5}|[0-9]{0,4}|[0-9]{0,3}|[0-9]{0,2}|[0-9]|[0-9]{0}))$/,
                regexText:'这个不是数字1--999999(单位:分钟)',
                emptyText:'请输入数字1--999999(单位:分钟)'
			}]
		})]
	});

	// 加载配置数据
	if (fp) {
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
                Ext.fly("port").dom.value = data.port;
                Ext.fly("email").dom.value = data.email;
                Ext.fly("account").dom.value = data.account;
                Ext.fly("password").dom.value = data.password;
                Ext.fly("title").dom.value = data.title;
                Ext.fly("mailfrequency").dom.value = data.mailfrequency;
				Ext.fly("smsnumber").dom.value = data.smsnumber;

                Ext.fly("smstitle").dom.value = data.smstitle;
                Ext.fly("smsfrequency").dom.value = data.smsfrequency;
                myMask.hide();
            },
			failure : function(response, opts) {
                myMask.hide();
				Ext.Msg.alert('', "加载配置数据失败，请重试！");
			}
		});
	}
    var button = new Ext.FormPanel({
		plain : true,
		border : false,
        buttonAlign : 'left',
		renderTo : document.body,
		buttons : [new Ext.Toolbar.Spacer({width:140}),{
			text : '短信测试',
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
		layout : 'fit',
		border : false,
		items : [{frame:true,autoScroll:true,items : [fp,button]}]
	});

});
