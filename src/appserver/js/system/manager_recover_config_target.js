/**
 * 目标--配置恢复--存档配置文件恢复
 */
Ext.onReady(function(){
    Ext.BLANK_IMAGE_URL = '../../js/ext/resources/images/default/s.gif';
    Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget ='side';

    var innerStart = 0;			//分页--开始数
    var innerPageSize = 15;		//分页--每页数
    //================================== -- 可信服务配置历史文件 -- ==========================================================
    var innerRecord = new Ext.data.Record.create([
        {name:'config',mapping:'config'},
        {name:'desc',  mapping:'desc'}
    ]);
    var innerProxy = new Ext.data.HttpProxy({
        url:"../../ManagerConfigAction_readInternalFileName.action"
    });
    var innerReader = new Ext.data.JsonReader({
        totalProperty:"total",
        root:"rows"
    },innerRecord);
    var innerStore = new Ext.data.GroupingStore({
        id:"innerStore.xml.info",
        proxy : innerProxy,
        reader : innerReader
    });

	var innerBoxM = new Ext.grid.CheckboxSelectionModel();   //复选框
	var innerRowNumber = new Ext.grid.RowNumberer();         //自动 编号
	var innerColM = new Ext.grid.ColumnModel([
        innerRowNumber,
		innerBoxM,
        {header:"可信服务配置文件",dataIndex:"config",align:'center',renderer:innerXmlShowURL,sortable:true,menuDisabled:true},
        {header:"描述",             dataIndex:"desc",   align:'center',sortable:true,menuDisabled:true},
        {header:"操作标记",           dataIndex:"flag",   align:'center',sortable:true,menuDisabled:true,renderer:showURL_inner_flag,width:50}
    ]);
    innerColM.defaultSortable = true;
    var innerPage_toolbar = new Ext.PagingToolbar({
        pageSize : innerPageSize,
        store:innerStore,
        displayInfo:true,
        displayMsg:"显示第{0}条记录到第{1}条记录，一共{2}条",
        emptyMsg:"没有记录",
        beforePageText:"当前页",
        afterPageText:"共{0}页"
    });
    var innerGrid = new Ext.grid.GridPanel({
        collapsible:false,
        id:'innerGrid.xml.info',
        height:setHeight(),
        animCollapse:true,
        loadMask:{msg:'正在加载数据,请稍后...'},
        border:false,
        cm:innerColM,
        sm:innerBoxM,
        store:innerStore,
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
            new Ext.Button ({
                id : 'btnRemove.inner.xml.info',
                text : '删除',
                iconCls : 'remove',
                handler : function() {
                    deleteInnerRow(innerGrid,innerStore);         //删除 表格 的 一 行 或多行
                }
            })
        ],
        view:new Ext.grid.GroupingView({
            forceFit:true,
            groupingTextTpl:'{text}({[values.rs.length]}条记录)'
        }),
        bbar:innerPage_toolbar
    });

    //================================== -- 非可信服务配置历史文件 -- ==========================================================
    var outStart = 0;			//分页--开始数
    var outPageSize = 15;		//分页--每页数
    var outRecord = new Ext.data.Record.create([
        {name:'config',mapping:'config'},
        {name:'desc',  mapping:'desc'}
    ]);
    var outProxy = new Ext.data.HttpProxy({
        url:"../../ManagerConfigAction_readExternalFileName.action"
    });
    var outReader = new Ext.data.JsonReader({
        totalProperty:"total",
        root:"rows"
    },outRecord);
    var outStore = new Ext.data.GroupingStore({
        id:"outStore.xml.info",
        proxy : outProxy,
        reader : outReader
    });

	var outBoxM = new Ext.grid.CheckboxSelectionModel();   //复选框
	var outRowNumber = new Ext.grid.RowNumberer();         //自动 编号
	var outColM = new Ext.grid.ColumnModel([
        outRowNumber,
		outBoxM,
        {header:"非可信服务配置文件",dataIndex:"config",align:'center',renderer:outXmlShowURL,sortable:true,menuDisabled:true},
        {header:"描述",               dataIndex:"desc",   align:'center',sortable:true,menuDisabled:true},
        {header:"操作标记",           dataIndex:"flag",   align:'center',sortable:true,menuDisabled:true,renderer:showURL_out_flag,width:50}
    ]);
    outColM.defaultSortable = true;
    var outPage_toolbar = new Ext.PagingToolbar({
        pageSize : outPageSize,
        store:outStore,
        displayInfo:true,
        displayMsg:"显示第{0}条记录到第{1}条记录，一共{2}条",
        emptyMsg:"没有记录",
        beforePageText:"当前页",
        afterPageText:"共{0}页"
    });
    var outGrid = new Ext.grid.GridPanel({
        id:'outGrid.xml.info',
        height:setHeight(),
        animCollapse:true,
        loadMask:{msg:'正在加载数据,请稍后...'},
        border:false,
        cm:outColM,
        sm:outBoxM,
        store:outStore,
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
            new Ext.Button ({
                id : 'btnRemove.out.xml.info',
                text : '删除',
                iconCls : 'remove',
                handler : function() {
                    deleteOutRow(outGrid,outStore);         //删除 表格 的 一 行 或多行
                }
            })
        ],
        view:new Ext.grid.GroupingView({
            forceFit:true,
            groupingTextTpl:'{text}({[values.rs.length]}条记录)'
        }),
        bbar:outPage_toolbar
    });

    new Ext.Viewport({
        renderTo:Ext.getBody(),
        layout:'fit',
        items:[{
	        layout:'column',
	        items:[
                {columnWidth:.5,items:[outGrid]},
                {columnWidth:.5,items:[innerGrid]}
            ]
        }]
    });
    outStore.load({
        params:{
            start:outStart,limit:outPageSize,type:'out'
        }
    });
    innerStore.load({
        params:{
            start:innerStart,limit:innerPageSize,type:'inner'
        }
    });
});

function setHeight(){
	var h = document.body.clientHeight-8;
	return h;
}

function innerXmlShowURL(value){
    return "<a id='"+value+".inner.info' href='javascript:;' onclick='recoverInner()' style='color: green;'>"+value+"</a>";
}
function outXmlShowURL(value){
    return "<a id='"+value+".out.info' href='javascript:;' onclick='recoverOut()' style='color: green;'>"+value+"</a>";
}

function showURL_out_flag(){
    return "<a href='javascript:;' onclick='recoverOut()' style='color: green;'>恢复</a>"
}

function showURL_inner_flag(){
    return "<a href='javascript:;' onclick='recoverInner()' style='color: green;'>恢复</a>"
}

/**
 * 恢复可信存档文件,同时恢复对应的非可信存档文件
 */
function recoverInner(){
    var grid = Ext.getCmp("innerGrid.xml.info");//获取对应grid
    var store = Ext.getCmp("innerGrid.xml.info").getStore();
    var selModel = grid.getSelectionModel();
    var config;
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
            config = item.data.config;
        });
    }
    var myMask = new Ext.LoadMask(Ext.getBody(),{
        msg : '正在处理,请稍后...',
        removeMask : true
    });
    myMask.show();
    Ext.Ajax.request({
        url:'../../ManagerConfigAction_readRecoverXml.action',
        params:{fileName:config,type:'internal'},
        success:function(response,option){
            var respText = Ext.util.JSON.decode(response.responseText);
            var description = respText.desc;
            var msg = respText.msg;
            myMask.hide();
            if(msg=='true'){
                var message;
                if(description==null||description==''||description=='null'){
                    message = "是否恢复所选存档配置成为配置文件？<br><font color='red'>确保当前配置文件已经存档!</font><br><font color='#808080'>可以输入描述信息用于说明恢复后的配置(可选)!</font>";
                } else {
                    message = "存档配置文件描述信息:<font color='green'>"+description+"</font><br>是否恢复所选存档配置成为配置文件？<br><font color='red'>确保当前配置文件已经存档!</font><br><font color='#808080'>可以输入描述信息用于说明恢复后的配置(可选)!</font>";
                }
                Ext.MessageBox.show({
                    title:'信息',
                    msg:message,
                    prompt:true,
                    animEl:config+'.inner.info',
                    width:350,
                    buttons:{'ok':'确定','no':'取消'},
                    icon:Ext.MessageBox.WARNING,
                    closable:false,
                    fn:function(e,text){
                        if(e=='ok'){
                            myMask.show();
                            Ext.Ajax.request({
                                url:'../../ManagerConfigAction_recover.action',
                                params:{text:text,type:'internal',fileName:config},
                                waitTitle :'系统提示',
                                waitMsg :'正在保存...',
                                success : function(r,o) {
                                    var respText = Ext.util.JSON.decode(r.responseText);
                                    var msg = respText.msg;
                                    myMask.hide();
                                    Ext.MessageBox.show({
                                        title:'信息',
                                        msg:msg,
                                        animEl:config+'.inner.info',
                                        width:300,
                                        buttons:{'ok':'确定'},
                                        icon:Ext.MessageBox.INFO,
                                        closable:false ,
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
            } else {
                Ext.MessageBox.show({
                    title:'信息',
                    msg:msg,
                    animEl:config+'.inner.info',
                    width:300,
                    buttons:{'ok':'确定'},
                    icon:Ext.MessageBox.WARNING,
                    closable:false
                });
            }
        }
    });
}

/**
 * 恢复非可信存档文件,同时恢复对应的可信存档文件
 */
function recoverOut(){
    var grid = Ext.getCmp("outGrid.xml.info");//获取对应grid
    var store = Ext.getCmp("outGrid.xml.info").getStore();
    var selModel = grid.getSelectionModel();
    var config;
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
            config = item.data.config;
        });
    }
    var myMask = new Ext.LoadMask(Ext.getBody(),{
        msg : '正在处理,请稍后...',
        removeMask : true
    });
    myMask.show();
    Ext.Ajax.request({
        url:'../../ManagerConfigAction_readRecoverXml.action',
        params:{fileName:config,type:'external'},
        success:function(response,option){
            var respText = Ext.util.JSON.decode(response.responseText);
            var description = respText.desc;
            var msg = respText.msg;
            myMask.hide();
            if(msg=='true'){
                var message;
                if(description==null||description==''||description=='null'){
                    message = "是否恢复所选存档配置成为配置文件？<br><font color='red'>确保当前配置文件已经存档!</font><br><font color='#808080'>可以输入描述信息用于说明恢复后的配置(可选)!</font>";
                } else {
                    message = "存档配置文件描述信息:<font color='green'>"+description+"</font><br>是否恢复所选存档配置成为配置文件？<br><font color='red'>确保当前配置文件已经存档!</font><br><font color='#808080'>可以输入描述信息用于说明恢复后的配置(可选)!</font>";
                }
                Ext.MessageBox.show({
                    title:'信息',
                    msg:message,
                    prompt:true,
                    animEl:config+'.out.info',
                    width:350,
                    buttons:{'ok':'确定','no':'取消'},
                    icon:Ext.MessageBox.WARNING,
                    closable:false,
                    fn:function(e,text){
                        if(e=='ok'){
                            myMask.show();
                            Ext.Ajax.request({
                                url:'../../ManagerConfigAction_recover.action',
                                params:{text:text,type:'external',fileName:config},
                                waitTitle :'系统提示',
                                waitMsg :'正在保存...',
                                success : function(r,o) {
                                    var respText = Ext.util.JSON.decode(r.responseText);
                                    var msg = respText.msg;
                                    myMask.hide();
                                    Ext.MessageBox.show({
                                        title:'信息',
                                        msg:msg,
                                        animEl:config+'.out.info',
                                        width:300,
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
            } else {
                Ext.MessageBox.show({
                    title:'信息',
                    msg:msg,
                    animEl:config+'.inner.info',
                    width:300,
                    buttons:{'ok':'确定'},
                    icon:Ext.MessageBox.WARNING,
                    closable:false
                });
            }
        }
    });
}

/**
 * 删除可信存档文件,同时删除对应的非可信存档文件
 * @param innerGrid
 * @param innerStore
 */
function deleteInnerRow(innerGrid,innerStore){
    var selModel = innerGrid.getSelectionModel();
    var count = selModel.getCount();
    if(count==0){
        Ext.MessageBox.show({
			title:'信息',
			msg:"您没有勾选任何记录！",
			animEl:'btnRemove.inner.xml.info',
			width:200,
			buttons:{'ok':'确定'},
            icon:Ext.MessageBox.INFO,
            closable:false
        });
    }else if(count > 0){
        var array = new Array();
        var record = innerGrid.getSelectionModel().getSelections();
        for(var i = 0; i < record.length; i++){
            array[i] = record[i].get('config');
        }
        Ext.MessageBox.show({
            title:'信息',
            msg:"确定要删除所选的所有记录？",
            animEl:'btnRemove.inner.xml.info',
            width:300,
            buttons:{'ok':'确定','no':'取消'},
            icon:Ext.MessageBox.WARNING,
            closable:false,
            fn:function(e,text){
            	if(e=='ok'){
                    var myMask = new Ext.LoadMask(Ext.getBody(),{
                        msg : '正在处理,请稍后...',
                        removeMask : true
                    });
                    myMask.show();
                    Ext.Ajax.request({
	                    url : '../../ManagerConfigAction_deleteRecoverConfig.action',    // 删除 连接 到后台
	                    params :{ fileNames : array },
	                    success : function(r,o) {
                            var respText = Ext.util.JSON.decode(r.responseText);
                            var msg = respText.msg;
                            myMask.hide();
	                        Ext.MessageBox.show({
					            title:'信息',
					            msg:msg,
					            animEl:'btnRemove.inner.xml.info',
					            width:200,
					            buttons:{'ok':'确定'},
					            icon:Ext.MessageBox.INFO,
					            closable:false,
                                fn:function(e){
                                    if(e=='ok'){
                                        innerGrid.render();
                                        innerStore.reload();
                                        var outGrid = Ext.getCmp('outGrid.xml.info');
                                        outGrid.render();
                                        outGrid.getStore().reload();
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

/**
 * 删除非可信存档文件,同时删除对应的可信存档文件
 * @param outGrid
 * @param outStore
 */
function deleteOutRow(outGrid,outStore){
    var selModel = outGrid.getSelectionModel();
    var count = selModel.getCount();
    if(count==0){
        Ext.MessageBox.show({
			title:'信息',
			msg:"您没有勾选任何记录！",
			animEl:'btnRemove.out.xml.info',
			width:200,
			buttons:{'ok':'确定'},
            icon:Ext.MessageBox.INFO,
            closable:false
        });
    }else if(count > 0){
        var array = new Array();
        var record = outGrid.getSelectionModel().getSelections();
        for(var i = 0; i < record.length; i++){
            array[i] = record[i].get('config');
        }
        Ext.MessageBox.show({
            title:'信息',
            msg:"确定要删除所选的所有记录？",
            animEl:'btnRemove.out.xml.info',
            width:300,
            buttons:{'ok':'确定','no':'取消'},
            icon:Ext.MessageBox.WARNING,
            closable:false,
            fn:function(e,text){
            	if(e=='ok'){
                    var myMask = new Ext.LoadMask(Ext.getBody(),{
                        msg : '正在处理,请稍后...',
                        removeMask : true
                    });
                    myMask.show();
                    Ext.Ajax.request({
	                    url : '../../ManagerConfigAction_deleteRecoverConfig.action',    // 删除 连接 到后台
	                    params :{ fileNames : array },
	                    success : function(r,o) {
                            var respText = Ext.util.JSON.decode(r.responseText);
                            var msg = respText.msg;
                            myMask.hide();
	                        Ext.MessageBox.show({
					            title:'信息',
					            msg:msg,
					            animEl:'btnRemove.out.xml.info',
					            width:200,
					            buttons:{'ok':'确定'},
					            icon:Ext.MessageBox.INFO,
					            closable:false,
                                fn:function(e){
                                    if(e=='ok'){
                                        outGrid.render();
                                        outStore.reload();
                                        var innerGrid = Ext.getCmp('innerGrid.xml.info');
                                        innerGrid.render();
                                        innerGrid.getStore().reload();
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