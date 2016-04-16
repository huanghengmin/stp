/**
 * Created by IntelliJ IDEA.
 * User: 钱晓盼
 * Date: 11-10-3
 * Time: 下午2:35
 * 平台初始化
 */
Ext.onReady(function(){
    Ext.BLANK_IMAGE_URL = '../../js/ext/resources/images/default/s.gif';
    Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget ='side';

    var record = new Ext.data.Record.create([
        {name:'privated',  mapping:'privated'},
        {name:'channelCount', mapping:'channelCount'},
        {name:'mac1',       mapping:'mac1'},
        {name:'mac2',       mapping:'mac2'},
        {name:'count',     mapping:'count'},
        {name:'size',      mapping:'size'}
    ]);
    var proxy = new Ext.data.HttpProxy({
        url:"../../InitAction_select.action"
    });
    var reader = new Ext.data.JsonReader({
        totalProperty:'total',
        root:'rows'
    },record);
    var store = new Ext.data.Store({
        proxy : proxy,
        reader : reader
    });

    var button = new Ext.Button({
        id:'refresh.info',
        text:'保存',
        handler:function(){
            var mac1 = Ext.getCmp('mac1.info').getValue();
            var mac2 = Ext.getCmp('mac2.info').getValue();
            var test_1 = false;
            var test_2 = false;
            var test = false;
            if(mac1.length>0){
                test_1 = form_test_1.form.isValid()
                test = test_1;
            }
            if(mac2.length>0){
                test_2 = form_test_2.form.isValid()
                test = test_2
            }
            if(test&&formPanel_1.form.isValid()){
                var privated = Ext.getCmp('privated.hidden.info').getValue();
                var count = Ext.getCmp('1.count.info').getValue();
                var myMask = new Ext.LoadMask(Ext.getBody(),{
                    msg : '正在处理,请稍后...',
                    removeMask : true
                });
                myMask.show();
                Ext.Ajax.request({
                    url:'../../InitAction_update.action',
                    method:'POST',
                    params:{privated:privated,count:count,mac1:mac1,mac2:mac2},
                    success: function(response,option){
                        var respText = Ext.util.JSON.decode(response.responseText);
                        var msg = respText.msg;
                        myMask.hide();
                        Ext.Msg.show({
                            title:'信息',
                            msg:msg,
                            width:300,
                            animEl:'refresh.info',
                            buttons:{'ok':'确定'},
                            icon:Ext.MessageBox.INFO,
                            closable:false,
                            fn:function(e){
                                if(e=='ok'){

                                }
                            }
                        });
                    }
                });
            }else{
                Ext.Msg.show({
                    title:'信息',
                    msg:'请填写完整!',
                    animEl:'refresh.info',
                    buttons:{'ok':'确定'},
                    icon:Ext.MessageBox.ERROR,
                    closable:false
                });
            }

        }
    });
    var formPanel = new Ext.form.FormPanel({
        plain:true,
        labelAlign:'right',
        labelWidth:130,
        defaultType:'textfield',
        defaults:{
            width:200,
            allowBlank:false,
            blankText:'该项不能为空!'
        },
        items:[{
            id:'privated.info',
            xtype:'displayfield',
            fieldLabel:'指定本机为'
        },{
            id:'privated.hidden.info',
            name:'channel.privated',
            xtype:'hidden'
        }]
    });

    var formPanel_1 = new Ext.form.FormPanel({
        plain:true,
        labelAlign:'right',
        labelWidth:130,
        defaultType:'textfield',
        defaults:{
            width:220,
            allowBlank:false,
            blankText:'该项不能为空!'
        },
        items:[{
            id:'1.count.info',
            fieldLabel:'审计发送条数',
            regex:/^(5000|[1-4][0-9]{3}|[1-9][0-9]{0,2})$/,
		    regexText:'这个不是100~5000之间的数字',
		    emptyText:'请输入100~5000'
        },{
            id:'1.size.info',
            fieldLabel:'审计发送文件大小',
            xtype:'displayfield',
            value:'1 MB'
        }]
    });

    var form_test_1 = new Ext.form.FormPanel({
        plain:true,
        labelAlign:'right',
        labelWidth:130,
        height : 50,
        defaultType:'displayfield',
        layout:'column',
        items:[{
            columnWidth:.2
        },{
            columnWidth:.15,
            value:'通道一:'
        },{
            id:'1.info',
            columnWidth:.1,
            xtype:'checkbox',
            checked:true
        },{
            id:'mac1.info',
            columnWidth:.4,
            xtype:'textfield',
            allowBlank:false,
            regex:/^(([0-9a-fA-F]{2}:){5}[0-9a-fA-F]{2})$/,
            regexText:'这个不是mac地址:0a:45:be:e6:00:aa',
            blankText:'该项不能为空!'
        },{
            columnWidth:.15,
            html:'&nbsp;&nbsp;&nbsp;&nbsp;<a href="javascript:;" onclick="test_channel_1();" style="color: green;">测试</a>'
        }]
    });
    var form_test_2 = new Ext.form.FormPanel({
        plain:true,
        labelAlign:'right',
        labelWidth:130,
        defaultType:'displayfield',
        layout:'column',
        height : 50,
        items:[{
            columnWidth:.2
        },{
            value:'通道二:',
            columnWidth:.15
        },{
            id:'2.info',
            columnWidth:.1,
            xtype:'checkbox',
            checked:true
        },{
            id:'mac2.info',
            columnWidth:.4,
            xtype:'textfield',
            allowBlank:false,
            regex:/^(([0-9a-fA-F]{2}:){5}[0-9a-fA-F]{2})$/,
            regexText:'这个不是mac地址:0a:45:be:e6:00:aa',
            blankText:'该项不能为空!'
        },{
            columnWidth:.15,
            xtype:'displayfield',
            html:'&nbsp;&nbsp;&nbsp;&nbsp;<a href="javascript:;" onclick="test_channel_2();" style="color: green;">测试</a>'
        }]
    });

    var panel = new Ext.Panel({
        plain:true,
        width:450,
        border:false,
        items:[{
            xtype:'fieldset',
            title:'平台指定',
            width:440,
            items:[formPanel]
        },{
            xtype:'fieldset',
            title:'通道',
            width:440,
            items:[{items:[form_test_1,form_test_2,formPanel_1]}]
        }]
    });
    var about = new Ext.Panel({
        plain:true,
        width:420,
        border:false,
        items:[{
            xtype:'fieldset',
            title:'说明',
            width:400,
            html:'<font color="green"> 1.源端端口默认为6666;<br>2.目标端端口默认为6666;<br>3.审计端口默认为6667.</font>'
        }]
    });
    var panel2 = new Ext.Panel({
        plain:true,
        width:setWidth(),
        border:false,
        buttonAlign :'left',
        buttons:[
            new Ext.Toolbar.Spacer({width:130}),
            button
        ]
    });
    new Ext.Viewport({
    	layout :'fit',
    	renderTo:Ext.getBody(),
        autoScroll:true,
        items:[{frame:true,autoScroll:true,items:[{layout:'column',plain:true,autoScroll:true,items:[panel]},panel2]}]
    });
    store.load();
	store.on('load',function(){
        var total = store.getCount();
        var channelCount = store.getAt(0).get('channelCount');
        if(channelCount==1) {
            form_test_1.show();
            form_test_2.hide();
        } else if(channelCount==2) {
            form_test_1.show();
            form_test_2.show();
            if(total==1) {
                Ext.getCmp('2.info').setValue(false);
            }
            Ext.getCmp('mac2.info').setValue(store.getAt(0).get('mac2'));
        }
        Ext.getCmp('privated.info').setValue(store.getAt(0).get('privated')?'可信服务端':'非可信服务端');
        Ext.getCmp('privated.hidden.info').setValue(store.getAt(0).get('privated'));
        Ext.getCmp('1.count.info').setValue(store.getAt(0).get('count'));
        Ext.getCmp('mac1.info').setValue(store.getAt(0).get('mac1'));

    });
});

function setWidth(){
    return (document.body.clientWidth-215)/2;
}

function test_channel_1() {
    var isChecked = Ext.getCmp('1.info').getValue();
    if(isChecked) {
        Ext.MessageBox.show({
            title:'信息',
            msg:'<font color="green">确定要测试通道一的连通状态？</font>',
            width:300,
            buttons:{'ok':'确定','no':'取消'},
            icon:Ext.MessageBox.WARNING,
            closable:false,
            fn:function(e){
                if(e == 'ok'){
                    var myMask = new Ext.LoadMask(Ext.getBody(),{
                        msg : '正在发送测试消息,请稍后...',
                        removeMask : true
                    });
                    myMask.show();
                    Ext.Ajax.request({
                        url:'../../InitAction_send.action',
                        method:'POST',
                        params:{channel:1},
                        success:function(response,option){
                            var respText = Ext.util.JSON.decode(response.responseText);
                            var msg = respText.msg;
                            myMask.hide();
                            Ext.MessageBox.show({
                                title:'信息',
                                width:250,
                                msg:msg,
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
            width:200,
            msg:'通道一没有选中!',
            buttons:{'ok':'确定'},
            icon:Ext.MessageBox.ERROR,
            closable:false
        });
    }
}

function test_channel_2() {
    var isChecked = Ext.getCmp('2.info').getValue();
    if(isChecked) {
        Ext.MessageBox.show({
            title:'信息',
            msg:'<font color="green">确定要测试通道二的连通状态？</font>',
            width:300,
            buttons:{'ok':'确定','no':'取消'},
            icon:Ext.MessageBox.WARNING,
            closable:false,
            fn:function(e){
                if(e == 'ok'){
                    var myMask = new Ext.LoadMask(Ext.getBody(),{
                        msg : '正在发送测试消息,请稍后...',
                        removeMask : true
                    });
                    myMask.show();
                    Ext.Ajax.request({
                        url:'../../InitAction_send.action',
                        method:'POST',
                        params:{channel:2},
                        success:function(response,option){
                            var respText = Ext.util.JSON.decode(response.responseText);
                            var msg = respText.msg;
                            myMask.hide();
                            Ext.MessageBox.show({
                                title:'信息',
                                width:250,
                                msg:msg,
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
            width:200,
            msg:'通道二没有选中!',
            buttons:{'ok':'确定'},
            icon:Ext.MessageBox.ERROR,
            closable:false
        });
    }
}