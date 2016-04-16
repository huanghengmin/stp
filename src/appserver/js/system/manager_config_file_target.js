/**
 * Created by IntelliJ IDEA.
 * User: 钱晓盼
 * Date: 11-10-3
 * Time: 下午2:35
 * To change this template use File | Settings | File Templates.
 */
Ext.onReady(function(){
    Ext.BLANK_IMAGE_URL = '../../js/ext/resources/images/default/s.gif';
    Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget ='side';

    var download = new Ext.Panel({
        plain:true,
        layout:'form',
        border:false,
        labelWidth:150,
        autoScroll:true,
        labelAlign:'left',
        items:[
        	{height:50},
        	{height:100,items:[{xtype:'fieldset',title:'说明',html:"<font color='green'>下载的文件名都是 “config.xml”,保存时要加以区分！</font>"}]},
            {
                fieldLabel:"可信配置文件下载",
                xtype:'displayfield',
                html:"<a href='javascript:;' onclick='download_inner()' style='color: green;'>可信配置文件</a>"
            },
            {height:50},
            {
                fieldLabel:"非可信配置文件下载",
                xtype:'displayfield',
                html:"<a href='javascript:;' onclick='download_out()' style='color: green;'>非可信配置文件</a>"
            }
        ]
    });
    var innerForm = new Ext.form.FormPanel({
        plain:true,
        labelWidth:150,
        labelAlign:'left',
        fileUpload:true,
        border:false,
        defaults : {
            width : 200,
            allowBlank : false,
            blankText : '该项不能为空！'
        },
        items:[
            {
                id:'innerFile.info',
                fieldLabel:"可信配置文件上传",
                name:'uploadFile',
                xtype:'textfield',
                inputType: 'file',
                listeners:{
                    render:function(){
                        Ext.get('innerFile.info').on("change",function(){
                            var file = this.getValue();
                            var fs = file.split('.');
                            if(fs[fs.length-1].toLowerCase()=='xml'){
                                Ext.MessageBox.show({
                                    title:'信息',
                                    msg:'<font color="green">确定要上传文件:'+file+'？</font>',
                                    width:300,
                                    buttons:{'ok':'确定','no':'取消'},
                                    icon:Ext.MessageBox.WARNING,
                                    closable:false,
                                    fn:function(e){
                                        if(e == 'ok'){
                                            if (innerForm.form.isValid()) {
                                                var type = 'inner';
                                                innerForm.getForm().submit({
                                                    url :'../../ManagerConfigFileAction_upload.action',
                                                    method :'POST',
                                                    params:{type:type},
                                                    waitTitle :'系统提示',
                                                    waitMsg :'正在上传,请稍后...',
                                                    success : function(form,action) {
                                                        var msg = action.result.msg;
                                                        Ext.MessageBox.show({
                                                            title:'信息',
                                                            width:250,
                                                            msg:msg,
                                                            //                                                    animEl:'insert.win.info',
                                                            buttons:{'ok':'确定','no':'取消'},
                                                            icon:Ext.MessageBox.INFO,
                                                            closable:false,
                                                            fn:function(e){
                                                                if(e=='ok'){
                                                                    Ext.getCmp('innerFile.info').setValue('');
                                                                }
                                                            }
                                                        });
                                                    }
                                                });
                                            } else {
                                                Ext.MessageBox.show({
                                                    title:'信息',
                                                    width:200,
                                                    msg:'请填写完成再提交!',
                                                    //                                            animEl:'insert.win.info',
                                                    buttons:{'ok':'确定'},
                                                    icon:Ext.MessageBox.ERROR,
                                                    closable:false
                                                });
                                            }
                                        }
                                    }
                                });
                            } else {
                                Ext.MessageBox.show({
                                    title:'信息',
                                    width:200,
                                    msg:'上传文件格式不对,请重新选择!',
                                    buttons:{'ok':'确定'},
                                    icon:Ext.MessageBox.ERROR,
                                    closable:false,
                                    fn:function(e){
                                        if(e=='ok'){
                                            Ext.getCmp('innerFile.info').setValue('');
                                        }
                                    }
                                });
                            }
                        });
                    }
                }
            }
        ]
    });
    var outForm = new Ext.form.FormPanel({
        plain:true,
        labelWidth:150,
        labelAlign:'left',
        fileUpload:true,
        border:false,
        defaults : {
            width : 200,
            allowBlank : false,
            blankText : '该项不能为空！'
        },
        items:[
            {
                id:'outFile.info',
                fieldLabel:"非可信配置文件上传",
                name:'uploadFile',
                xtype:'textfield',
                inputType: 'file',
                listeners:{
                    render:function(){
                        Ext.get('outFile.info').on("change",function(){
                            var file = this.getValue();
                            var fs = file.split('.');
                            if(fs[fs.length-1].toLowerCase()=='xml'){
                                Ext.MessageBox.show({
                                    title:'信息',
                                    msg:'<font color="green">确定要上传文件:'+file+'？</font>',
                                    width:300,
                                    buttons:{'ok':'确定','no':'取消'},
                                    icon:Ext.MessageBox.WARNING,
                                    closable:false,
                                    fn:function(e){
                                        if(e == 'ok'){
                                            if (outForm.form.isValid()) {
                                                var type = 'out';
                                                outForm.getForm().submit({
                                                    url :'../../ManagerConfigFileAction_upload.action',
                                                    method :'POST',
                                                    params:{type:type},
                                                    waitTitle :'系统提示',
                                                    waitMsg :'正在上传,请稍后...',
                                                    success : function(form,action) {
                                                        var msg = action.result.msg;
                                                        Ext.MessageBox.show({
                                                            title:'信息',
                                                            width:250,
                                                            msg:msg,
                                                            //                                                    animEl:'insert.win.info',
                                                            buttons:{'ok':'确定','no':'取消'},
                                                            icon:Ext.MessageBox.INFO,
                                                            closable:false,
                                                            fn:function(e){
                                                                if(e=='ok'){
                                                                    Ext.getCmp('outFile.info').setValue('');
                                                                }
                                                            }
                                                        });
                                                    }
                                                });
                                            } else {
                                                Ext.MessageBox.show({
                                                    title:'信息',
                                                    width:200,
                                                    msg:'请填写完成再提交!',
                                                    //                                            animEl:'insert.win.info',
                                                    buttons:{'ok':'确定'},
                                                    icon:Ext.MessageBox.ERROR,
                                                    closable:false
                                                });
                                            }
                                        }
                                    }
                                });
                            } else {
                                Ext.MessageBox.show({
                                    title:'信息',
                                    width:200,
                                    msg:'上传文件格式不对,请重新选择!',
                                    buttons:{'ok':'确定'},
                                    icon:Ext.MessageBox.ERROR,
                                    closable:false,
                                    fn:function(e){
                                        if(e=='ok'){
                                            Ext.getCmp('outFile.info').setValue('');
                                        }
                                    }
                                });
                            }
                        });
                    }
                }
            }
        ]
    });
/*    var innerButton = new Ext.Button({
        text:'上传',
        id:'loading.inner.info',
        handler: function() {
            if(innerForm.form.isValid()){
                var type = 'inner';
                innerForm.getForm().submit({
                    url:'../../ManagerConfigFileAction_upload.action',
                    params:{type:type},
                    method:'POST',
                    waitTitle :'系统提示',
                    waitMsg :'正在上传,请稍后...',
                    success: function(form,action) {
                        var flag = action.result.msg;
                        Ext.MessageBox.show({
                            title:'信息',
                            msg:flag,
                            width:230,
                            animEl:'loading.inner.info',
                            buttons:Ext.Msg.OK,
                            buttons:{'ok':'确定'},
                            icon:Ext.MessageBox.INFO,
                            closable:false,
                            fn:function(e){
                                if(e=='ok'){
                                    Ext.getCmp('innerFile.info').setValue('');
                                }
                            }
                        });
                    }
                });
            }else{
                Ext.Msg.show({
                    title:'信息',
                    msg:'请选择需要上传的可信配置文件！',
                    width:300,
                    animEl:'loading.inner.info',
                    buttons:Ext.Msg.OK,
                    buttons:{'ok':'确定'},
                    icon:Ext.MessageBox.ERROR,
                    closable:false
                });
            }
        }
    });
    var outButton = new Ext.Button({
        text:'上传',
        id:'loading.out.info',
        handler: function() {
            if(outForm.form.isValid()){
                var type = 'out';
                outForm.getForm().submit({
                    url:'../../ManagerConfigFileAction_upload.action',
                    params:{type:type},
                    method:'POST',
                    waitTitle :'系统提示',
                    waitMsg :'正在上传,请稍后...',
                    success: function(form,action) {
                        var flag = action.result.msg;
                        Ext.Msg.show({
                            title:'信息',
                            msg:flag,
                            width:230,
                            animEl:'loading.out.info',
                            buttons:Ext.Msg.OK,
                            buttons:{'ok':'确定'},
                            icon:Ext.MessageBox.INFO,
                            closable:false,
                            fn:function(e){
                                if(e=='ok'){
                                    Ext.getCmp('outFile.info').setValue('');
                                }
                            }
                        });
                    }
                });
            }else{
                Ext.Msg.show({
                    title:'信息',
                    msg:'请选择需要上传的非可信配置文件！',
                    width:300,
                    animEl:'loading.out.info',
                    buttons:Ext.Msg.OK,
                    buttons:{'ok':'确定'},
                    icon:Ext.MessageBox.ERROR,
                    closable:false
                });
            }
        }
    });*/
    var upload = new Ext.Panel({
        plain:true,
        border:false,
        autoScroll:true,
        items:[
        	{height:50},
        	{
                layout:'column',
                width:500,
                items:[{items:[innerForm],columnWidth:.8}]
            },
            {height:30},
            {
            	width:500,
                layout:'column',
                items:[{items:[outForm],columnWidth:.8}]
            }
        ]
    });
    new Ext.Viewport({
    	renderTo:Ext.getBody(),
        layout:'fit',
        items:[{frame:true,items:[download,upload]}]
    });
});

function download_inner(){
     if (!Ext.fly('test')) {
        var frm = document.createElement('form');
        frm.id = 'test';
        frm.name = id;
        frm.style.display = 'none';
        document.body.appendChild(frm);
    }
    var type = 'inner';
    Ext.Ajax.request({
        url: '../../ManagerConfigFileAction_download.action',params:{type:type},
        form: Ext.fly('test'),
        method: 'POST',
        isUpload: true
    });
}
function download_out(){
   if (!Ext.fly('test')) {
       var frm = document.createElement('form');
       frm.id = 'test';
       frm.name = id;
       frm.style.display = 'none';
       document.body.appendChild(frm);
   }
   var type = 'out';
   Ext.Ajax.request({
       url: '../../ManagerConfigFileAction_download.action',params:{type:type},
       form: Ext.fly('test'),
       method: 'POST',
       isUpload: true
   });
}