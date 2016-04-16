/**
 * Created by IntelliJ IDEA.
 * User: 钱晓盼
 * Date: 11-9-29
 * Time: 下午2:44
 * To change this template use File | Settings | File Templates.
 */
function innerSysLogShowURL(value){
    if(value==2){
        return "<a href='javascript:;' onclick='innerUpdateSysLogWin()' style='color: green;'>修改信息</a>";
    }
}

function innerInsertSysLogGridFormWin(syslogGrid,store){
    var selModel = syslogGrid.getSelectionModel();
    var count = selModel.getCount();
    if(count==0){
    	Ext.MessageBox.show({
        	title:'信息',
        	width:200,
        	msg:'您没有勾选任何记录!',
        	animEl:'btnSave.innerSysLog',
        	buttons:{'ok':'确定'},
        	icon:Ext.MessageBox.QUESTION,
        	closable:false
		});
    }else if(count > 0){
        var sysArray = new Array();
        var record = syslogGrid.getSelectionModel().getSelections();
        for(var i = 0; i < record.length; i++){
            sysArray[i] = record[i].get('syslogclient');
        }
        Ext.MessageBox.show({
            title:'信息',
            width:230,
            msg:'确定要保存所选的所有记录?',
            animEl:'btnSave.innerSysLog',
            buttons:{'ok':'确定','no':'取消'},
            icon:Ext.MessageBox.WARNING,
            closable:false,
            fn:function(e){
                if(e=='ok'){
                    var myMask = new Ext.LoadMask(Ext.getBody(),{
                        msg:'正在保存,请稍后...',
                        removeMask:true
                    });
                    myMask.show();
                    Ext.Ajax.request({
                        url : '../../PlatformConfigAction_saveSysLog.action',
                        params :{sysArray : sysArray},
                        success : function(r,o){
                            var respText = Ext.util.JSON.decode(r.responseText);
                            var msg = respText.msg;
                            myMask.hide();
                            Ext.MessageBox.show({
                                title:'信息',
                                width:300,
                                msg:msg,
                                animEl:'btnSave.innerSysLog',
                                buttons:{'ok':'确定'},
                                icon:Ext.MessageBox.INFO,
                                closable:false,
                                fn:function(e){
                                    if(e=='ok'){
                                        syslogGrid.render();
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

function innerDeleteSysLogGridRow(syslogGrid,store){
    var selModel = syslogGrid.getSelectionModel();
    var count = selModel.getCount();
    if(count==0){
    	Ext.MessageBox.show({
        	title:'信息',
        	width:200,
        	msg:'您没有勾选任何记录!',
        	animEl:'btnRemove.syslog',
        	buttons:{'ok':'确定'},
        	icon:Ext.MessageBox.QUESTION,
        	closable:false
		});

    }else if(count > 0){
        var sysArray = new Array();
        var record = syslogGrid.getSelectionModel().getSelections();
        for(var i = 0; i < record.length; i++){
            sysArray[i] = record[i].get('syslogclient');
        }
        Ext.MessageBox.show({
            title:'信息',
            width:200,
            msg:'确定要删除所选的所有记录?',
            animEl:'btnSave.syslog',
            buttons:{'ok':'确定','no':'取消'},
            icon:Ext.MessageBox.WARNING,
            closable:false,
            fn:function(e){
                if(e=='ok'){
                    var myMask = new Ext.LoadMask(Ext.getBody(),{
                        msg:'正在删除,请稍后...',
                        removeMask:true
                    });
                    myMask.show();
                    Ext.Ajax.request({
                        url : '../../PlatformConfigAction_deleteSysLog.action',    // 删除 连接 到后台
                        params :{sysArray : sysArray },
                        success : function(r,o){
                            var respText = Ext.util.JSON.decode(r.responseText);
                            var msg = respText.msg;
                            myMask.hide();
                            Ext.MessageBox.show({
                                title:'信息',
                                width:300,
                                msg:msg,
                                animEl:'btnRemove.syslog',
                                buttons:{'ok':'确定'},
                                icon:Ext.MessageBox.INFO,
                                closable:false,
                                fn:function(e){
                                    if(e=='ok'){
                                        syslogGrid.render();
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

function innerUpdateSysLogWin(){
    var grid = Ext.getCmp("innerSysLogGrid.info");//获取对应grid
    var store = Ext.getCmp("innerSysLogGrid.info").getStore();
    var selModel = grid.getSelectionModel();
    var formPanel;
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
            formPanel = new Ext.form.FormPanel({
                defaultType : 'textfield',
                labelWidth:100,
                frame:true,
                loadMask : { msg : '正在加载数据，请稍后.....' },
                height : 100,
                labelAlign:'right',
                defaults : {
                    width : 150,
                    allowBlank : false,
                    blankText : '该项不能为空!'
                },
				items : [
                    {                     //
                        id:'syslogclient.update.info',
                        fieldLabel:"日志接收主机",
                        name:'syslogclient',
                        value:item.data.syslogclient,
                        emptyText:'--请输入Ip:Port--',
                        regex:/^((((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\:)(6553[0-6]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{3}|[1-9][0-9]{2}|[1-9][0-9]{1}|[1-9]))$/,
                        regexText:'这个不是Ip:Port' ,
                        listeners:{
                            blur:function(){
                                var syslogclient = this.getValue();
                                var myMask = new Ext.LoadMask(Ext.getBody(),{
                                    msg:'正在校验,请稍后...',
                                    removeMask:true
                                });
                                myMask.show();
                                Ext.Ajax.request({
                                    url:'../../PlatformConfigAction_checkSysLogClient.action',
                                    method:'POST',
                                    params:{syslogclient:syslogclient},
                                    success:function(action){
                                        var json = Ext.decode(action.responseText);
                                        myMask.hide();
                                        if(json.msg != '0000'){
                                            Ext.MessageBox.show({
                                                title:'信息',
                                                msg:json.msg,
                                                animEl:'syslogclient.update.info',
                                                buttons:{'ok':'确定'},
                                                icon:Ext.MessageBox.WARNING,
                                                fn:function(e){
                                                    if(e=='ok'){
                                                    }
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        }
                    },
                    {
                        xtype:'hidden',
                        name:'oldSysLogClient',
                        value:item.data.syslogclient
                    }
                ]
            });
        });
    }
    var win = new Ext.Window({
        title:"日志管理主机-修改信息",
        width:320,
        height:120,
        layout:'fit',
        modal:true,
        items: [formPanel],
        bbar:[
            new Ext.Toolbar.Fill(),
            new Ext.Button ({
            	id:'update.syslog.info',
                text : '修改',
                formBind:true,
                allowDepress : false,
                handler : function() {
                    if (formPanel.form.isValid()) {
                    	Ext.MessageBox.show({
                            title:'信息',
                            width:200,
                            msg:'确定要修改以上内容?',
                            animEl:'update.syslog.info',
                            buttons:{'ok':'确定','no':'取消'},
                            icon:Ext.MessageBox.WARNING,
                            closable:false,
                            fn:function(e){
                         	   if(e=='ok'){
                         		   formPanel.getForm().submit({
                         			   url :'../../PlatformConfigAction_updateSysLog.action',
                         			   method :'POST',
                         			   waitTitle :'系统提示',
                         			   waitMsg :'正在保存...',
                         			   success : function(form,action) {
                         				  Ext.MessageBox.show({
	                      					   title:'信息',
	                      					   width:300,
	                      					   msg:action.result.msg,
	                      					   animEl:'update.syslog.info',
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
                        });
                    } else {
                    	Ext.MessageBox.show({
                    		title:'信息',
                    		width:200,
                    		msg:'请填写完成再提交!',
                    		animEl:'update.syslog.info',
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
    });
    win.show();
}