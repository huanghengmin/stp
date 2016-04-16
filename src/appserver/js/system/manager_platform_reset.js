/**
 * 恢复出厂设置
 */
Ext.onReady(function(){
    Ext.BLANK_IMAGE_URL = '../../js/ext/resources/images/default/s.gif';
	Ext.QuickTips.init();
	Ext.form.Field.prototype.msgTarget = 'side';

    var initForm = new Ext.form.FormPanel({
        plain:true,
        border:false,
        loadMask : { msg : '正在加载数据,请稍后.....' },
        labelAlign:'right',
        labelWidth:190,
        defaultType:'displayfield',
        defaults:{
            width:200,
            allowBlank:false,
            blankText:'该项不能为空!'
        },
        items:[{
        	fieldLabel:"数据库初始化",
        	html:"<a href='javascript:;' onclick='init_db();' style='color: green;'>恢复</a>"
        },{
        	fieldLabel:"配置文件初始化",
        	html:"<a href='javascript:;' onclick='init_config();'style='color: green;'>恢复</a>"
        }]
    });

    var panel = new Ext.Panel({
        plain:true,
        width:setWidth(),
        border:false,
        autoScroll:true,
        items:[{
//            xtype:'fieldset',
//            title:'属性说明',
//            width:500,
//            html:'<div></div>'
        },{
            xtype:'fieldset',
            title:'恢复出厂设置',
            width:500,
            items:[initForm]
        }]
    });

    new Ext.Viewport({
    	layout:'fit',
    	renderTo:Ext.getBody(),
    	items:[{
            frame:true,
            autoScroll:true,
            items:[panel]
        }]
    });

});

function setWidth(){
    return document.body.clientWidth-15;
}

/**
 * 初始化数据库
 */
function init_db() {
    Ext.MessageBox.show({
        title:'信息',
        width:200,
        msg:'确定要初始化数据库?',
        animEl:'init.info',
        buttons:{'ok':'确定','no':'取消'},
        icon:Ext.MessageBox.QUESTION,
        closable:false,
        fn:function(e){
            if(e=='ok'){
                var myMask = new Ext.LoadMask(Ext.getBody(), {
					msg: '正在初始化,请稍后...',
					removeMask: true //完成后移除
				});
				myMask.show();
				Ext.Ajax.request({
                    url : '../../ManagerDataBaseAction_initDB.action',
                    method:'POST',
                    success : function(form, action) {
                        myMask.hide();
                        Ext.Msg.alert('提示信息',
                            '初始化数据库<font color="green">成功</font>!请重启系统!');
                    },
                    failure : function(form, action) {
                        myMask.hide();
                        Ext.Msg.alert('提示信息',
                            '初始化数据库<font color="red">失败</font>！');
                    }
                });
            }
        }
    });


}

/**
 * 初始化配置文件
 */
function init_config() {
    Ext.MessageBox.show({
        title:'信息',
        width:200,
        msg:'确定要初始化配置文件?',
        animEl:'init.info',
        buttons:{'ok':'确定','no':'取消'},
        icon:Ext.MessageBox.QUESTION,
        closable:false,
        fn:function(e){
            if(e=='ok'){
                var myMask = new Ext.LoadMask(Ext.getBody(), {
					msg: '正在初始化,请稍后...',
					removeMask: true //完成后移除
				});
				myMask.show();
				Ext.Ajax.request({
                    url : '../../ManagerDataBaseAction_initConfig.action',
                    method:'POST',
                    success : function(form, action) {
                        myMask.hide();
                        Ext.Msg.alert('提示信息',
                            '初始化配置文件<font color="green">成功</font>!请重启系统重!');
                    },
                    failure : function(form, action) {
                        myMask.hide();
                        Ext.Msg.alert('提示信息',
                            '初始化配置文件<font color="red">失败</font>!');
                    }
                });
            }
        }
    });
}


