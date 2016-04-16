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
        {name:'count',     mapping:'count'},
        {name:'s1',     mapping:'s1'},
        {name:'r1',     mapping:'r1'},
        {name:'s2',     mapping:'s2'},
        {name:'r2',     mapping:'r2'},
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
            if(formPanel_1.form.isValid()){
                var privated = Ext.getCmp('privated.hidden.info').getValue();
                formPanel_1.getForm().submit({
                    url:'../../InitAction_update.action',
                    method:'POST',
                    params:{privated:privated},
                    success: function(form,action) {
                        var flag = action.result.msg;
                        Ext.Msg.show({
                            title:'信息',
                            msg:flag,
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
            width:200,
            allowBlank:false,
            blankText:'该项不能为空!'
        },
        items:[{
            id:'1.count.info',
            fieldLabel:'审计发送条数',
            name:'channel.count',
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

    var form_test_0 = new Ext.form.FormPanel({
        plain:true,
        labelAlign:'right',
        labelWidth:130,
        height : 50,
        defaultType:'displayfield',
        layout:'column',
        items:[{
            columnWidth:.2
        },{
            columnWidth:.2
        },{
            columnWidth:.3,
            value:'测试时间'
        },{
            columnWidth:.3,
            value:'接收时间'
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
            columnWidth:.2,
            value:'通道一:'
        },{
            id:'1.s.info',
            columnWidth:.3
        },{
            id:'1.r.info',
            columnWidth:.3
        }]
    });
    var form_test_2 = new Ext.form.FormPanel({
        plain:true,
        labelAlign:'right',
        labelWidth:130,
        height : 50,
        defaultType:'displayfield',
        layout:'column',
        items:[{
            columnWidth:.2
        },{
            value:'通道二:',
            columnWidth:.2
        },{
            id:'2.s.info',
            columnWidth:.3
        },{
            id:'2.r.info',
            columnWidth:.3
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
            items:[{items:[form_test_0,form_test_1,form_test_2]}]
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
        items:[{frame:true,autoScroll:true,items:[{layout:'column',plain:true,autoScroll:true,items:[panel]}]}]
    });
    store.load();
	store.on('load',function(){
        var total = store.getCount();
        var channelCount = store.getAt(0).get('channelCount');
        var s1 = store.getAt(0).get('s1');
        var r1 = store.getAt(0).get('r1');
        if(channelCount==1) {
            form_test_1.show();
            Ext.getCmp('1.s.info').setValue(s1);
            Ext.getCmp('1.r.info').setValue(r1);
            form_test_2.hide();
        } else if(channelCount==2) {
            form_test_1.show();
            form_test_2.show();
            var s2 = store.getAt(0).get('s2');
            var r2 = store.getAt(0).get('r2');
            Ext.getCmp('1.s.info').setValue(s1);
            Ext.getCmp('1.r.info').setValue(r1);
            Ext.getCmp('2.s.info').setValue(s2);
            Ext.getCmp('2.r.info').setValue(r2);
        }
        Ext.getCmp('privated.info').setValue(store.getAt(0).get('privated')?'可信服务端':'非可信服务端');
        Ext.getCmp('privated.hidden.info').setValue(store.getAt(0).get('privated'));
//        Ext.getCmp('1.count.info').setValue(store.getAt(0).get('count'));
    });
});

function setWidth(){
    return (document.body.clientWidth-215)/2;
}