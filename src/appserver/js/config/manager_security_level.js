/**
 * 信息安全策略
 */
Ext.onReady(function(){
    Ext.BLANK_IMAGE_URL = '../../js/ext/resources/images/default/s.gif';
//    Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget = 'side';

    var start = 0;			//分页--开始数
    var pageSize = 30;		//分页--每页数
    var record = new Ext.data.Record.create([
        {name:'id',			mapping:'id'},
        {name:'securityLevel',	mapping:'securityLevel'},
        {name:'securityFlag',	mapping:'securityFlag'},
        {name:'levelInfo',		mapping:'levelInfo'}
    ]);
    var proxy = new Ext.data.HttpProxy({
        url:"../../ManagerSecurityLevelAction_select.action"
    });
    var reader = new Ext.data.JsonReader({
        totalProperty:"total",
        root:"rows"
    },record);
    var store = new Ext.data.GroupingStore({
        id:"store.info",
        proxy : proxy,
        reader : reader
    });

    var boxM = new Ext.grid.CheckboxSelectionModel();   //复选框
    var rowNumber = new Ext.grid.RowNumberer();         //自动 编号
    var colM = new Ext.grid.ColumnModel([
        boxM,
        rowNumber,
        {menuDisabled : true, sortable:true, header:"信息等级",	dataIndex:"levelInfo", align:'center',renderer:show_LevelInfo  },
        {menuDisabled : true, sortable:true, header:"加密算法",	dataIndex:"securityFlag", align:'center'  },
        {menuDisabled : true, sortable:true, header:"加密强度",	dataIndex:"securityLevel", align:'center'  },
        {menuDisabled : true, header:'操作标记',			dataIndex:'id',				align:'center',		renderer: showURL_flag}

    ]);
    colM.defaultSortable = true;
    var page_toolbar = new Ext.PagingToolbar({
        pageSize : pageSize,
        store:store,
        displayInfo:true,
        displayMsg:"显示第{0}条记录到第{1}条记录，一共{2}条",
        emptyMsg:"没有记录",
        beforePageText:"当前页",
        afterPageText:"共{0}页"
    });
    var grid_panel = new Ext.grid.GridPanel({
        id:'grid.info',
        plain:true,
        hieght:setHeight(),
        width:setWidth(),
        animCollapse:true,
        loadMask:{msg:'正在加载数据，请稍后...'},
        border:false,
        collapsible:false,
        columnLines : true,
        cm:colM,
        sm:boxM,
        store:store,
        stripeRows:true,
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
        tbar:[
            new Ext.Button({
                id:'btnAdd.info',
                text:'新增',
                iconCls:'add',
                handler:function(){
                    insert_win(grid_panel,store);     //连接到 新增 面板
                }
            }),
            {xtype:"tbseparator"},
			new Ext.Button ({
			    id : 'btnRemove.info',
                text : '删除',
				iconCls : 'remove',
				handler : function() {
					delete_row(grid_panel,store);    //删除 表格 的 一 行 或多行
				}
            })
        ],
        view:new Ext.grid.GroupingView({
            forceFit:true,
            groupingTextTpl:'{text}({[values.rs.length]}条记录)'
        }),
        bbar:page_toolbar
    });
    var port = new Ext.Viewport({
        layout:'fit',
        renderTo: Ext.getBody(),
        items:[grid_panel]
    });
    store.load({
        params:{
            start:start,limit:pageSize
        }
    });
});
function setHeight(){
	var h = document.body.clientHeight-8;
	return h;
}

function setWidth(){
    return document.body.clientWidth-8;
}
//============================================ -- javascript function -- =============================================================================

function showURL_flag(value){
	return "<a href='javascript:;' onclick='detail_win();' style='color: green;'>详细</a>&nbsp;&nbsp;<a href='javascript:;' onclick='update_win();' style='color: green;'>修改</a>";
}

function show_LevelInfo(value){
    if(value==0||value=='0'){
        return "公开信息";
    } else if (value==1||value=='1'){
        return "第一级";
    } else if (value==2||value=='2'){
        return "第二级";
    } else if (value==3||value=='3'){
        return "第三级";
    } else if (value==4||value=='4'){
        return "第四级";
    } else if (value==5||value=='5'){
        return "第五级";
    }  else {
        return "<font color='red'>错误的等级"+value+"</font>"
    }
}

var dataLevelInfo = [[0,'公开信息'],[1,'第一级'],[2,'第二级'],[3,'第三级'],[4,'第四级'],[5,'第五级']];
var storeLevelInfo = new Ext.data.SimpleStore({fields:['value','key'],data:dataLevelInfo});
var dataLevelType = [['3DES','3DES'],['DES','DES'],['SM1','SM1'],['SM2','SM2']];
var storeLevelType = new Ext.data.SimpleStore({fields:['value','key'],data:dataLevelType});
var dataSecurityLevel = [[0,0],[1,1],[2,2],[3,3],[4,4],[5,5]];
var storeSecurityLevel = new Ext.data.SimpleStore({fields:['value','key'],data:dataSecurityLevel});

function insert_win(grid,store){
    var formPanel = new Ext.form.FormPanel({
        frame:true,
        labelAlign:'right',
        autoScroll:true,
        labelWidth:80,
        defaults:{
            width:200,
            allowBlank:false,
            blankText:'该项不能为空！'
        },
        items:[{
            fieldLabel:'信息等级',
            xtype:'combo',
            hiddenName:'securityLevel.levelInfo',
            mode:'local',
            emptyText :'--请选择--',
            editable : false,
            typeAhead:true,
            forceSelection: true,
            triggerAction:'all',
            displayField:"key",valueField:"value",
            store: storeLevelInfo
        },{
            fieldLabel:'加密算法',
            xtype:'combo',
            hiddenName:'securityLevel.securityFlag',
            mode:'local',
            emptyText :'--请选择--',
            editable : false,
            typeAhead:true,
            forceSelection: true,
            triggerAction:'all',
            displayField:"key",valueField:"value",
            store: storeLevelType
        },{
            fieldLabel:'加密强度',
            xtype:'combo',
            hiddenName:'securityLevel.securityLevel',
            mode:'local',
            emptyText :'--请选择--',
            editable : false,
            typeAhead:true,
            forceSelection: true,
            triggerAction:'all',
            displayField:"key",valueField:"value",
            store: storeSecurityLevel
        }]
    });
    var win = new Ext.Window({
        title:"新增信息",
        width:420,
		layout:'fit',
        height:180,
        modal:true,
        items:formPanel,
        bbar:[
        	'->',
        	{
        		id:'insert.win.info',
        		text:'保存',
        		handler:function(){
        			if (formPanel.form.isValid()) {
                    	formPanel.getForm().submit({
			            	url :'../../ManagerSecurityLevelAction_insert.action',
			                method :'POST',
			                waitTitle :'系统提示',
			                waitMsg :'正在保存,请稍后...',
			                success : function(form,action) {
								var msg = action.result.msg;
				                Ext.MessageBox.show({
				                	title:'信息',
				                    width:250,
				                    msg:msg,
			                        animEl:'insert.win.info',
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
                    } else {
                        Ext.MessageBox.show({
                            title:'信息',
                            width:200,
                            msg:'请填写完成再提交!',
                            animEl:'insert.win.info',
                            buttons:{'ok':'确定'},
                            icon:Ext.MessageBox.ERROR,
                            closable:false
                        });
                    }
        		}
        	},
        	{
        		text:'关闭',
        		handler:function(){
        			win.close();
        		}
        	}
        ]
    }).show();
}

function delete_row(grid,store){
    var selModel = grid.getSelectionModel();
    var count = selModel.getCount();
    if(count==0){
        Ext.MessageBox.show({
            title:'信息',
            msg:'<font color="green">您没有勾选任何记录!</font>',
            animEl:'btnRemove.info',
            buttons:{'ok':'确定'},
            icon:Ext.MessageBox.INFO,
            closable:false
        });
    }else if(count > 0){
        var ids = new Array();
        var record = grid.getSelectionModel().getSelections();
        for(var i = 0; i < record.length; i++){
            ids[i] = record[i].get('id');
        }
        Ext.MessageBox.show({
            title:'信息',
            msg:'<font color="green">确定要删除所选记录？</font>',
            animEl:'btnRemove.info',
            width:250,
            buttons:{'ok':'确定','no':'取消'},
            icon:Ext.MessageBox.INFO,
            closable:false,
            fn:function(e){
                if(e == 'ok'){
                    Ext.Ajax.request({
                        url : '../../ManagerSecurityLevelAction_delete.action',             // 删除 连接 到后台
                        params :{ids : ids},
                        success : function(action){
                            var json = Ext.decode(action.responseText)
                            Ext.MessageBox.show({
                                title:'信息',
                                width:json.code,
                                msg:json.msg,
                                animEl:'btnRemove.info',
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

function update_win(){
    var grid = Ext.getCmp('grid.info');
    var store = grid.getStore();
    var selModel = grid.getSelectionModel();
    var formPanel;
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
            formPanel = new Ext.form.FormPanel({
                defaultType:'textarea',
                frame:true,
                labelAlign:'right',
                autoScroll:true,
                labelWidth:80,
                defaults:{
                    width:280,
                    allowBlank:false,
                    blankText:'该项不能为空！'
                },
                items:[{
                    name:'securityLevel.id',value: item.data.id,xtype:'hidden'
                },{
                    fieldLabel:'信息等级',
                    xtype:'combo',
                    hiddenName:'securityLevel.levelInfo', value:item.data.levelInfo,
                    mode:'local',
                    emptyText :'--请选择--',
                    editable : false,
                    typeAhead:true,
                    forceSelection: true,
                    triggerAction:'all',
                    displayField:"key",valueField:"value",
                    store: storeLevelInfo
                },{
                    fieldLabel:'加密算法',
                    xtype:'combo',
                    hiddenName:'securityLevel.securityFlag',
                    mode:'local',
                    emptyText :'--请选择--',
                    editable : false,
                    typeAhead:true,
                    forceSelection: true,
                    triggerAction:'all',
                    displayField:"key",valueField:"value",
                    store: storeLevelType,
                    value:item.data.securityFlag
                },{
                    fieldLabel:'加密强度',
                    xtype:'combo',
                    hiddenName:'securityLevel.securityLevel',value:item.data.securityLevel,
                    mode:'local',
                    emptyText :'--请选择--',
                    editable : false,
                    typeAhead:true,
                    forceSelection: true,
                    triggerAction:'all',
                    displayField:"key",valueField:"value",
                    store: dataSecurityLevel
                }]
            });
        });
    }
    var win = new Ext.Window({
        title:"修改信息",
        width:420,
		layout:'fit',
        height:180,
        modal:true,
        items:formPanel,
        bbar:['->', {
        	id:'update.win.info',
        	text:'修改',
        	handler:function(){
        		if (formPanel.form.isValid()) {        			
        			formPanel.getForm().submit({
        				url :'../../ManagerSecurityLevelAction_update.action',
        				method :'POST',
        				waitTitle :'系统提示',
        				waitMsg :'正在修改,请稍后...',
        				success : function(form,action) {
							var msg = action.result.msg;
        					Ext.MessageBox.show({
        						title:'信息',
        						width:260,
        						msg: msg ,
        						animEl:'update.win.info',
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
        		} else {
        			Ext.MessageBox.show({
        				title:'信息',
        				width:260,
        				msg:'请填写完成再提交!',
        				animEl:'update.win.info',
        				buttons:{'ok':'确定'},
        				icon:Ext.MessageBox.ERROR,
        				closable:false
        			});
        		}
        	}
        },{
        	text:'关闭',
        	handler:function(){
        		win.close();
        	}
        }]
        	
    }).show();

}

function detail_win(){
    var grid = Ext.getCmp('grid.info');
    var selModel = grid.getSelectionModel();
    var formPanel;
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
            formPanel = new Ext.form.FormPanel({
                defaultType:'displayfield',
                frame:true,
                labelAlign:'right',
                autoScroll:true,
                labelWidth:80,
                defaults:{
                    width:200,
                    allowBlank:false,
                    blankText:'该项不能为空！'
                },
                items:[
                    {fieldLabel:"内容ID", 	value: item.data.id},
                	{fieldLabel:"信息等级",	value: show_LevelInfo(item.data.levelInfo)},
                	{fieldLabel:"加密算法",	value: item.data.securityFlag},
                	{fieldLabel:"加密强度",	value: item.data.securityLevel}
                ]
            });
        });
    }
    var win = new Ext.Window({
        title:"详细信息",
        width:350,
		layout:'fit',
        height:200,
        modal:true,
        items:formPanel,
        bbar:[
        	'->',
        	{
        		text:'保存',
        		handler:function(){
        			win.close();
        		}
        	},
        	{
        		text:'关闭',
        		handler:function(){
        			win.close();
        		}
        	}
        ]
    }).show();
}