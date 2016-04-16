/**
 * 设备管理
 */
Ext.onReady(function() {

	Ext.BLANK_IMAGE_URL = '../../js/ext/resources/images/default/s.gif';

	Ext.QuickTips.init();
	Ext.form.Field.prototype.msgTarget = 'side';

    var start = 0;
    var pageSize = 15;
    var record = new Ext.data.Record.create([
        {name:'id',			    mapping:'id'},
        {name:'equipmentName',	mapping:'equipmentName'},
        {name:'equipmentDesc',	mapping:'equipmentDesc'},
        {name:'monitorUsed',     mapping:'monitorUsed'},
        {name:'ip',             	mapping:'ip'},
        {name:'port',       	    mapping:'port'},
        {name:'otherIp',          mapping:'otherIp'},
        {name:'isKeyDevice',     mapping:'isKeyDevice'},
        {name:'mac',              mapping:'mac'},
        {name:'subNetMask',      mapping:'subNetMask'},
        {name:'equipmentTypeCode',       mapping:'equipmentTypeCode'},
        {name:'equipmentTypeName',       mapping:'equipmentTypeName'},
        {name:'equipmentSysConfig',      mapping:'equipmentSysConfig'},
        {name:'equipmentManagerDepartCode', mapping:'equipmentManagerDepartCode'},
        {name:'equipmentManagerDepartName', mapping:'equipmentManagerDepartName'},
        {name:'linkType',       	mapping:'linkType'},
        {name:'linkName',		    mapping:'linkName'},
        {name:'oidName',		    mapping:'oidName'},
        {name:'snmpVer',		    mapping:'snmpVer'},
        {name:'auth',		        mapping:'auth'},
        {name:'common',		    mapping:'common'}
    ]);
    var proxy = new Ext.data.HttpProxy({
        url:"../../EquipmentAction_select.action"
    });
    var reader = new Ext.data.JsonReader({
        totalProperty:"total",
        root:"rows",
        id:'id'
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
        {header:"设备编号",		dataIndex:"equipmentName",  align:'center',sortable:true,menuDisabled:true},
        {header:"设备名",		dataIndex:"equipmentDesc",  align:'center',sortable:true,menuDisabled:true},
        {header:"设备类型",	dataIndex:"equipmentTypeName",  align:'center',sortable:true,menuDisabled:true,renderer:show_type},
        {header:"链路类型",	dataIndex:"linkType",	    align:'center',sortable:true,menuDisabled:true,renderer:show_linkType},
//        {header:"链路名",		dataIndex:"linkName",	    align:'center',sortable:true,menuDisabled:true},
        {header:'操作标记',	dataIndex:'id',		        align:'center',sortable:true,menuDisabled:true, renderer:show_flag,	width:100}

    ]);

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
        height:setHeight(),
        width:setWidth(),
        animCollapse:true,
        loadMask:{msg:'正在加载数据，请稍后...'},
        border:false,
        collapsible:false,
        cm:colM,
        sm:boxM,
        store:store,
        stripeRows:true,
        autoExpandColumn:2,
        disableSelection:true,
        bodyStyle:'width:100%',
        enableDragDrop: true,
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

function show_linkType(value){
    if(value=='ext'){
        return '外部链路';
    } else if(value=='int') {
        return '内部链路';
    }
}

function show_type(value,p,r){
    var code = r.get('equipmentTypeCode');
    return  value;   //'<img src="../../img/equ/'+code+'S.PNG" alt="'+value+'" title="'+value+'"/>' +

}

function show_flag(value, p, r){
    var equipmentName = r.get('equipmentName');
    if( equipmentName=='stp'){
        return String
            .format('<a href="javascript:void(0);" onclick="equipmentDetailInfo();return false;" style="color: green;">详细</a>'
            + '&nbsp;&nbsp;'
            + '<a href="javascript:void(0);" onclick="equipmentUpdatelInfo();return false;" style="color: green;">修改</a>'
            + '&nbsp;&nbsp;'
            + '<font color="gray">删除</font>');
    }else{
        return String
            .format('<a href="javascript:void(0);" onclick="equipmentDetailInfo();return false;" style="color: green;">详细</a>'
            + '&nbsp;&nbsp;'
            + '<a href="javascript:void(0);" onclick="equipmentUpdatelInfo();return false;" style="color: green;">修改</a>'
            + '&nbsp;&nbsp;'
            + '<a id="\''+value+'\'.delete.info" href="javascript:void(0);" onclick="deleteEquipment(\''+value+'\');return false;" style="color: green;">删除</a>');
    }
}

var linkTypeStore = new Ext.data.SimpleStore({
    fields:['value','key'],
    data:[['int','内部链路'],['ext','外部链路']]
});
var snmpVerStore = new Ext.data.SimpleStore({
    fields:['value','key'],
    data:[['v2','v2'],['v3','v3']]
});
var oidNameStore = new Ext.data.SimpleStore({
    fields:['value','key'],
    data:[
        ['lenovofirewall','lenovofirewall'],
        ['linuxos','linuxos'],
        ['netchinafirewall','netchinafirewall'],
        ['rdaps','rdaps'],
        ['secworld','secworld'],
        ['windowsos','windowsos']
    ]
});

var linkRecord = new Ext.data.Record.create([{name:'value',mapping:'value'}, {name:'key',mapping:'key'}]);
var linkStore = new Ext.data.Store({
    url:"../../LinkAction_selectLinkNameKeyValue.action",
    method:'POST',
    reader:new Ext.data.JsonReader({ totalProperty:'total',root:"rows"},linkRecord)
});

var equStore = new Ext.data.SimpleStore({
    fields:['value','icon','key'],
    data:[
        ['1001S','x-flag-1001S','防火墙'],
        ['1002S','x-flag-1002S','可信安全网关'],
        ['1003S','x-flag-1003S','入侵检测系统'],
        ['1004S','x-flag-1004S','网络防毒设备'],
        ['1005S','x-flag-1005S','安全隔离设备'],
        ['1008S','x-flag-1008S','AAA服务器'],
        ['1009S','x-flag-1009S','漏洞扫描系统'],
        ['1011S','x-flag-1011S','应用代理服务器'],
        ['1012S','x-flag-1012S','路由器'],
        ['1013S','x-flag-1013S','交换机'],
        ['1014S','x-flag-1014S','认证服务器'],
        ['2000S','x-flag-2000S','应用服务器'],
        ['2005S','x-flag-2005S','单向光闸外端机'],
        ['2006S','x-flag-2006S','单向光闸内端机'],
        ['2001S','x-flag-2001S','WEB服务器'],
        ['2002S','x-flag-2002S','FTP服务器'],
        ['2003S','x-flag-2003S','邮件服务器'],
        ['2004S','x-flag-2004S','数据库服务器'],
        ['3001S','x-flag-3001S','台式计算机'],
        ['3002S','x-flag-3002S','笔记本电脑'],
        ['3003S','x-flag-3003S','IP音视频终端'],
        ['3004S','x-flag-3004S','手持终端设备']
    ]
});

var equManagerDepartRecord = new Ext.data.Record.create([{name:'value',mapping:'value'}, {name:'key',mapping:'key'}]);

/**
 * 新增设备
 * @param grid
 * @param store
 */
function insert_win(grid,store){
    var equManagerDepartStore = new Ext.data.Store({
        url:"../../EquipmentAction_selectDepartmentNameKeyValue.action",
        method:'POST',
        reader:new Ext.data.JsonReader({ totalProperty:'total',root:"rows"},equManagerDepartRecord)
    });
    equManagerDepartStore.load();
    var formPanel = new Ext.form.FormPanel({
        frame:true,
        autoScroll:true,
        fileUpload:true,
        layout:'column',
        border:false,
        items:[{
            plain:true,
            defaultType:'textfield',
            columnWidth :.5,
            labelAlign:'right',
            labelWidth:90,
            border:false,
            layout: 'form',
            defaults:{
                width:180,
                allowBlank:false,
                blankText:'该项不能为空！'
            },
            items:[{
                id:'equipmentName.insert.info',
                fieldLabel:"设备编号",
                name:'equipment.equipmentName',
                regex:/^.{2,30}$/,
                regexText:'请输入任意2--30个字符',
                emptyText:'请输入任意2--30个字符',
                listeners:{
                    blur:function(){
                        var equipmentName = this.getValue();
                        var myMask = new Ext.LoadMask(Ext.getBody(),{
                            msg:'正在校验,请稍后...',
                            removeMask:true
                        });
                        myMask.show();
                        Ext.Ajax.request({
                            url : '../../EquipmentAction_checkEquipmentName.action',
                            params :{equipmentName:equipmentName},
                            method:'POST',
                            success : function(r,o) {
                                var respText = Ext.util.JSON.decode(r.responseText);
                                var msg = respText.msg;
                                myMask.hide();
                                if(msg != 'true'){
                                    Ext.MessageBox.show({
                                        title:'信息',
                                        width:250,
                                        msg:msg,
                                        animEl:'equipmentName.insert.info',
                                        buttons:{'ok':'确定'},
                                        icon:Ext.MessageBox.INFO,
                                        closable:false,
                                        fn:function(e){
                                            if(e=='ok'){
                                                Ext.getCmp('equipmentName.insert.info').setValue('');
                                            }
                                        }
                                    });
                                }
                            }
                        });
                    }
                }
            },{
                id:'equipmentDesc.insert.info',
                fieldLabel:"设备名",
                name:'equipment.equipmentDesc',
                regex:/^[\u4e00-\u9fa5_a-zA-Z0-9_]{2,10}$/,
                regexText:'请输入2--10个只能包含字母、数字、下划线和汉字中的任意字符',
                emptyText:'请输入2--10个字符,只能包含字母、数字、下划线和汉字中的任意字符',
                listeners:{
                    blur:function(){
                        var equipmentDesc = this.getValue();
                        if(equipmentDesc.length>0) {
                            var myMask = new Ext.LoadMask(Ext.getBody(),{
                                msg:'正在校验,请稍后...',
                                removeMask:true
                            });
                            myMask.show();
                            Ext.Ajax.request({
                                url : '../../EquipmentAction_checkEquipmentDesc.action',
                                params :{equipmentDesc:equipmentDesc},
                                method:'POST',
                                success : function(r,o) {
                                    var respText = Ext.util.JSON.decode(r.responseText);
                                    var msg = respText.msg;
                                    myMask.hide();
                                    if(msg != 'true'){
                                        Ext.MessageBox.show({
                                            title:'信息',
                                            width:250,
                                            msg:msg,
                                            animEl:'equipmentDesc.insert.info',
                                            buttons:{'ok':'确定'},
                                            icon:Ext.MessageBox.INFO,
                                            closable:false,
                                            fn:function(e){
                                                if(e=='ok'){
                                                    Ext.getCmp('equipmentDesc.insert.info').setValue('');
                                                }
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    }
                }
            },new Ext.ux.IconCombo({
                fieldLabel:'设备类型',
                hiddenName:'equipment.equTypeCode',
                emptyText :'--请选择--',
                store:equStore,
                valueField:'value',
                iconClsField:'icon',
                displayField:'key',
                triggerAction:'all',
                mode:'local'
            }),{
                boxLabel:'核心设备',
                xtype:'checkbox',
                name:'equipment.keyDevice'
            },{
                fieldLabel:'IP地址',
                name:'equipment.ip',
                regex:/^(((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9]))$/,
                regexText:'这个不是Ip(例:1.1.1.1)',
                emptyText:'请输入Ip(例:1.1.1.1)'
            },{
                fieldLabel:'端口',
                name:'equipment.port',
                value:161,
                regex:/^(6553[0-6]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{3}|[1-9][0-9]{2}|[1-9][0-9]|[1-9])$/,
                regexText:'这个不是端口类型1~65536',
                emptyText:'请输入端口1~65536'
            },{
                fieldLabel:'次选IP地址',
                name:'equipment.otherIp',
                allowBlank:true,
                regex:/^(((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9]))$/,
                regexText:'这个不是Ip(例:1.1.1.1)',
                emptyText:'请输入Ip(例:1.1.1.1)'
            },{
                fieldLabel:'MAC地址',
                name:'equipment.mac',
                regex:/^((([0-9a-fA-F]{2}\-){5}[0-9a-fA-F]{2})|(([0-9a-fA-F]{2}:){5}[0-9a-fA-F]{2}))$/,
                regexText:'这个不是mac地址:0a-45-be-e6-00-aa或者0a:45:be:e6:00:aa',
                emptyText:'MAC:0a-45-be-e6-00-aa'
            },{
                fieldLabel:'子网掩码',
                name:'equipment.subNetMask',
                regex:/^(((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9]))$/,
                regexText:'这个不是Ip(例:1.1.1.1)',
                emptyText:'请输入Ip(例:1.1.1.1)'
            },{
                id:'uploadFile',
                fieldLabel:'设备系统配置文件',
                allowBlank:true,
                width:100,
                name:'uploadFile',
                xtype:'textfield',
                inputType: 'file'
            }]
        },{
            plain:true,
            border:false,
            columnWidth :.5,
            layout:'form',
            items:[{
                plain:true,
                defaultType:'textfield',
                labelAlign:'right',
                labelWidth:100,
                border:false,
                layout: 'form',
                defaults:{
                    width:200,
                    allowBlank:false,
                    blankText:'该项不能为空！'
                },
                items:[{
                    id:'linkType.insert.info',
                    fieldLabel:"链路类型",hiddenName:'equipment.linkType',
                    xtype:'combo',
                    mode:'local',
                    emptyText :'--请选择--',
                    editable : false,
                    typeAhead:true,
                    forceSelection: true,
                    triggerAction:'all',
                    displayField:"key",valueField:"value",
                    store:linkTypeStore,
                    listeners:{
                        select:function(){
                            var linkType = this.getValue();
                            linkStore.load({params:{linkType:linkType}});
                            linkStore.on('load',function(){
                                var record = linkStore.getAt(0);
                                Ext.getCmp('linkName.insert.info').setValue(record.data.value);
                            });
                        }
                    }
                },{
                    id :'linkName.insert.info',
                    fieldLabel:"链路名",hiddenName:'equipment.linkName',
                    xtype:'combo',
                    mode:'remote',
                    emptyText :'--请选择--',
                    editable : false,
                    typeAhead:true,
                    forceSelection: true,
                    triggerAction:'all',
                    displayField:"key",valueField:"value",
                    store : linkStore
                },{
                    boxLabel:'启用监控',
                    xtype:'checkbox',
                    name:'equipment.monitorUsed'
                },{
                    fieldLabel:"OID名称",hiddenName:'equipment.oidName',
                    xtype:'combo',
                    mode:'local',
                    emptyText :'--请选择--',
                    editable : false,
                    typeAhead:true,
                    forceSelection: true,
                    triggerAction:'all',
                    displayField:"key",valueField:"value",
                    store:oidNameStore
                },{
                    fieldLabel:"设备管理单位",hiddenName:'equipment.equManagerDepart',
                    xtype:'combo',
                    mode:'local',
                    emptyText :'--请选择--',
                    editable : false,
                    typeAhead:true,
                    forceSelection: true,
                    triggerAction:'all',
                    displayField:"key",valueField:"value",
                    store:equManagerDepartStore
                },{
                    fieldLabel:"SNMP类型",hiddenName:'equipment.snmpVer',
                    xtype:'combo',
                    mode:'local',
                    emptyText :'--请选择--',
                    editable : false,
                    typeAhead:true,
                    forceSelection: true,
                    triggerAction:'all',
                    displayField:"key",valueField:"value",
                    store:snmpVerStore,
                    value:'v2',
                    listeners:{
                        select:function(){
                            var value = this.getValue();
                            if(value=='v2'){
                                Ext.getCmp('password_2.panel.info').hide();
                                Ext.getCmp('password_2.panel.info').disable();
                                Ext.getCmp('password.panel.info').enable();
                                Ext.getCmp('password.panel.info').show();
                            } else if (value=='v3'){
                                Ext.getCmp('password.panel.info').hide();
                                Ext.getCmp('password.panel.info').disable();
                                Ext.getCmp('password_2.panel.info').enable();
                                Ext.getCmp('password_2.panel.info').show();
                            }
                        }
                    }
                }]
            },{
                id:'password.panel.info',
                plain:true,
                defaultType:'textfield',
                labelAlign:'right',
                labelWidth:100,
                border:false,
                layout: 'form',
                defaults:{
                    width:200,
                    allowBlank:false,
                    blankText:'该项不能为空！'
                },
                items:[{
                    id:'password.info',
                    fieldLabel:'只读访问密码',
                    inputType:'password',
                    name:'equipment.password',
                    value:'public',
                    allowBlank:true
                }]
            },{
                id:'password_2.panel.info',
                plain:true,
                hidden:true,
                defaultType:'textfield',
                labelAlign:'right',
                labelWidth:100,
                border:false,
                layout: 'form',
                defaults:{
                    width:200,
                    allowBlank:false,
                    blankText:'该项不能为空！'
                },
                items:[{
                    fieldLabel:'授权账号',
                    name:'equipment.auth',
                    allowBlank:true
                },{
                    fieldLabel:'授权密码',
                    inputType:'password',
                    name:'equipment.authPassword',
                    allowBlank:true
                },{
                    fieldLabel:'通讯账号',
                    name:'equipment.common',
                    allowBlank:true
                },{
                    fieldLabel:'通讯密码',
                    inputType:'password',
                    name:'equipment.commonPassword',
                    allowBlank:true
                }]
            }]
        }]
    });
    var win = new Ext.Window({
        title:"新增信息",
        width:710,
        layout:'fit',
        height:400,
        modal:true,
        items:formPanel,
        bbar:[
            '->',
            {
                id:'insert_win.info',
                text:'保存',
                handler:function(){
                    if (formPanel.form.isValid()) {
                        formPanel.getForm().submit({
                            url :'../../EquipmentAction_insert.action',
                            method :'POST',
                            waitTitle :'系统提示',
                            waitMsg :'正在保存,请稍后...',
                            success : function(form,action) {
                                var msg = action.result.msg;
                                Ext.MessageBox.show({
                                    title:'信息',
                                    width:300,
                                    msg:msg,
                                    animEl:'insert_win.info',
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
                            animEl:'insert_win.info',
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
            }
        ]
    }).show();
}

/**
 * 修改设备
 */
function equipmentUpdatelInfo(){
    var equManagerDepartStore = new Ext.data.Store({
        url:"../../EquipmentAction_selectDepartmentNameKeyValue.action",
        method:'POST',
        reader:new Ext.data.JsonReader({ totalProperty:'total',root:"rows"},equManagerDepartRecord),
        listeners:{
            load:function(){
                Ext.getCmp('depart.update.info').setValue(Ext.getCmp('depart.update.info').getValue());
            }
        }
    });
    equManagerDepartStore.load();

    var grid = Ext.getCmp('grid.info');
    var store = grid.getStore();
    var selModel = grid.getSelectionModel();
    var formPanel;
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
            formPanel = new Ext.form.FormPanel({
                frame:true,
                autoScroll:true,
                layout:'column',
                fileUpload:true,
                border:false,
                items:[{
                    plain:true,
                    defaultType:'textfield',
                    columnWidth :.5,
                    labelAlign:'right',
                    labelWidth:100,
                    border:false,
                    layout: 'form',
                    defaults:{
                        width:180,
                        allowBlank:false,
                        blankText:'该项不能为空！'
                    },
                    items:[{
                        xtype:'hidden',
                        name:'equipment.id',
                        value:item.data.id
                    },{
                        xtype:'hidden',
                        name:'equipment.equipmentName',
                        value:item.data.equipmentName
                    },{
                        fieldLabel:"设备编号",
                        xtype:'displayfield',
                        value:item.data.equipmentName
                    },{
                        id:'equipmentDesc.update.info',
                        fieldLabel:"设备名",
                        xtype:'textfield',
                        name:'equipment.equipmentDesc',
                        value:item.data.equipmentDesc,
                        regex:/^[\u4e00-\u9fa5_a-zA-Z0-9_]{2,10}$/,
                        regexText:'请输入2--10个只能包含字母、数字、下划线和汉字中的任意字符',
                        emptyText:'请输入2--10个字符,只能包含字母、数字、下划线和汉字中的任意字符',
                        listeners:{
                            blur:function(){
                                var equipmentDescOld = item.data.equipmentDesc;
                                var equipmentDesc = this.getValue();
                                if(equipmentDesc.length>0&&equipmentDesc!=equipmentDescOld){
                                    var myMask = new Ext.LoadMask(Ext.getBody(),{
                                        msg:'正在校验,请稍后...',
                                        removeMask:true
                                    });
                                    myMask.show();
                                    Ext.Ajax.request({
                                        url : '../../EquipmentAction_checkEquipmentDesc.action',
                                        params :{equipmentDesc:equipmentDesc},
                                        method:'POST',
                                        success : function(r,o) {
                                            var respText = Ext.util.JSON.decode(r.responseText);
                                            var msg = respText.msg;
                                            myMask.hide();
                                            if(msg != 'true'){
                                                Ext.MessageBox.show({
                                                    title:'信息',
                                                    width:250,
                                                    msg:msg,
                                                    animEl:'equipmentDesc.update.info',
                                                    buttons:{'ok':'确定'},
                                                    icon:Ext.MessageBox.INFO,
                                                    closable:false,
                                                    fn:function(e){
                                                        if(e=='ok'){
                                                            Ext.getCmp('equipmentDesc.update.info').setValue('');
                                                        }
                                                    }
                                                });
                                            }
                                        }
                                    });
                                }
                            }
                        }
                    },new Ext.ux.IconCombo({
                        fieldLabel:'设备类型',
                        hiddenName:'equipment.equTypeCode',
                        value:item.data.equipmentTypeCode+'S',
                        emptyText :'--请选择--',
                        store:equStore,
                        valueField:'value',
                        iconClsField:'icon',
                        displayField:'key',
                        triggerAction:'all',
                        mode:'local'
                    }),{
                        boxLabel:'核心设备',
                        xtype:'checkbox',
                        name:'equipment.keyDevice',
                        checked:item.data.isKeyDevice==1?true:false
                    },{
                        fieldLabel:'IP地址',
                        name:'equipment.ip',
                        value:item.data.ip,
                        regex:/^(((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9]))$/,
                        regexText:'这个不是Ip(例:1.1.1.1)',
                        emptyText:'请输入Ip(例:1.1.1.1)'
                    },{
                        fieldLabel:'端口',
                        name:'equipment.port',
                        value:item.data.port
                    },{
                        fieldLabel:'次选IP地址',
                        name:'equipment.otherIp',
                        value:item.data.otherIp,
                        allowBlank:true,
                        regex:/^(((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9]))$/,
                        regexText:'这个不是Ip(例:1.1.1.1)',
                        emptyText:'请输入Ip(例:1.1.1.1)'
                    },{
                        fieldLabel:'MAC地址',
                        name:'equipment.mac',
                        value:item.data.mac,
                        regex:/^((([0-9a-fA-F]{2}\-){5}[0-9a-fA-F]{2})|(([0-9a-fA-F]{2}:){5}[0-9a-fA-F]{2}))$/,
                        regexText:'这个不是mac地址:0a-45-be-e6-00-aa或者0a:45:be:e6:00:aa',
                        emptyText:'请输入MAC地址:0a-45-be-e6-00-aa'
                    },{
                        fieldLabel:'子网掩码',
                        name:'equipment.subNetMask',
                        value:item.data.subNetMask ,
                        regex:/^(((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9]))$/,
                        regexText:'这个不是Ip(例:1.1.1.1)',
                        emptyText:'请输入Ip(例:1.1.1.1)'
                    },{
                        fieldLabel:'设备系统配置文件地址',
                        xtype:'displayfield',
                        value:item.data.equipmentSysConfig=='null'?null:item.data.equipmentSysConfig
                    },{
                        xtype:'hidden',
                        name:'oldEquipmentSysConfig',
                        value:item.data.equipmentSysConfig=='null'?null:item.data.equipmentSysConfig
                    },{
                        id:'uploadFile',
                        fieldLabel:'设备系统配置文件',
                        allowBlank:true,
                        xtype:'textfield',
                        name:'uploadFile',
                        inputType: 'file'
                    }]
                },{
                    plain:true,
                    border:false,
                    columnWidth :.5,
                    layout:'form',
                    items:[{
                        plain:true,
                        defaultType:'textfield',
                        labelAlign:'right',
                        labelWidth:100,
                        border:false,
                        layout: 'form',
                        defaults:{
                            width:200,
                            allowBlank:false,
                            blankText:'该项不能为空！'
                        },
                        items:[{
                            id:'linkType.update.info',
                            fieldLabel:"链路类型",hiddenName:'equipment.linkType',
                            xtype:'combo',
                            mode:'local',
                            emptyText :'--请选择--',
                            editable : false,
                            typeAhead:true,
                            forceSelection: true,
                            triggerAction:'all',
                            displayField:"key",valueField:"value",
                            value:item.data.linkType,
                            store:linkTypeStore,
                            listeners:{
                                select:function(){
                                    var linkType = this.getValue();
                                    linkStore.load({params:{linkType:linkType}});
                                    linkStore.on('load',function(){
                                        var record = linkStore.getAt(0);
                                        Ext.getCmp('linkName.update.info').setValue(record.data.value);
                                    });
                                }
                            }
                        },{
                            id :'linkName.update.info',
                            fieldLabel:"链路名",hiddenName:'equipment.linkName',
                            xtype:'combo',
                            value:item.data.linkName,
                            mode:'remote',
                            emptyText :'--请选择--',
                            editable : false,
                            typeAhead:true,
                            forceSelection: true,
                            triggerAction:'all',
                            displayField:"key",valueField:"value",
                            store:linkStore
                        },{
                            boxLabel:'启用监控',
                            xtype:'checkbox',
                            name:'equipment.monitorUsed',
                            checked:item.data.monitorUsed==1?true:false
                        },{
                            id:'depart.update.info',
                            fieldLabel:"设备管理单位",
                            hiddenName:'equipment.equManagerDepart',
                            value:item.data.equipmentManagerDepartCode,
                            xtype:'combo',
                            mode:'local',
                            emptyText :'--请选择--',
                            editable : false,
                            typeAhead:true,
                            forceSelection: true,
                            triggerAction:'all',
                            displayField:"key",valueField:"value",
                            store:equManagerDepartStore
                        },{
                            fieldLabel:"OID名称",hiddenName:'equipment.oidName',
                            value:item.data.oidName,
                            xtype:'combo',
                            mode:'local',
                            emptyText :'--请选择--',
                            editable : false,
                            typeAhead:true,
                            forceSelection: true,
                            triggerAction:'all',
                            displayField:"key",valueField:"value",
                            store:oidNameStore
                        },{
                            fieldLabel:"SNMP类型",hiddenName:'equipment.snmpVer',
                            value:item.data.snmpVer,
                            xtype:'combo',
                            mode:'local',
                            emptyText :'--请选择--',
                            editable : false,
                            typeAhead:true,
                            forceSelection: true,
                            triggerAction:'all',
                            displayField:"key",valueField:"value",
                            store:snmpVerStore,
                            listeners:{
                                select:function(){
                                    var value = this.getValue();
                                    if(value=='v2'){
                                        Ext.getCmp('password_2.panel.info').hide();
                                        Ext.getCmp('password.panel.info').show();
                                    } else if (value=='v3'){
                                        Ext.getCmp('password.panel.info').hide();
                                        Ext.getCmp('password_2.panel.info').show();
                                    }
                                }
                            }
                        }]
                    },{
                        id:'password.panel.info',
                        plain:true,
                        defaultType:'textfield',
                        labelAlign:'right',
                        labelWidth:100,
                        border:false,
                        layout: 'form',
                        defaults:{
                            width:200,
                            allowBlank:false,
                            blankText:'该项不能为空！'
                        },
                        items:[{
                            id:'password.info',
                            fieldLabel:'只读访问密码',
                            inputType:'password',
                            name:'equipment.password',
                            value:'public',
                            allowBlank:true
                        }]
                    },{
                        id:'password_2.panel.info',
                        plain:true,
                        hidden:true,
                        defaultType:'textfield',
                        labelAlign:'right',
                        labelWidth:100,
                        border:false,
                        layout: 'form',
                        defaults:{
                            width:200,
                            allowBlank:false,
                            blankText:'该项不能为空！'
                        },
                        items:[{
                            id:'auth.update.info',
                            fieldLabel:'授权账号',
                            name:'equipment.auth',
                            value:item.data.auth,
                            allowBlank:true
                        },{
                            fieldLabel:'授权密码',
                            inputType:'password',
                            name:'equipment.authPassword',
                            allowBlank:true
                        },{
                            fieldLabel:'通讯账号',
                            name:'equipment.common',
                            value:item.data.common ,
                            allowBlank:true
                        },{
                            fieldLabel:'通讯密码',
                            inputType:'password',
                            name:'equipment.commonPassword',
                            allowBlank:true
                        }]
                    }]
                }]
            });
        });
    }

    var win = new Ext.Window({
        title:"修改信息",
        width:730,
        layout:'fit',
        height:420,
        modal:true,
        items:formPanel,
        bbar:[
            '->',
            {
                id:'update_win.info',
                text:'修改',
                handler:function(){
                    Ext.MessageBox.show({
                        title:'信息',
                        width:250,
                        msg:'确定要修改?',
                        animEl:'update_win.info',
                        buttons:{'ok':'继续','no':'取消'},
                        icon:Ext.MessageBox.WARNING,
                        closable:false,
                        fn:function(e){
                            if(e == 'ok'){
                                if (formPanel.form.isValid()) {
                                    formPanel.getForm().submit({
                                        url :'../../EquipmentAction_update.action',
                                        method :'POST',
                                        waitTitle :'系统提示',
                                        waitMsg :'正在修改,请稍后...',
                                        success : function(form,action) {
                                            Ext.MessageBox.show({
                                                title:'信息',
                                                width:300,
                                                msg:action.result.msg,
                                                animEl:'update_win.info',
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
                                        animEl:'update_win.info',
                                        buttons:{'ok':'确定'},
                                        icon:Ext.MessageBox.ERROR,
                                        closable:false
                                    });
                                }
                            }
                        }
                    });

                }
            },{
                text:'关闭',
                handler:function(){
                    win.close();
                }
            }
        ]
    }).show();
}

/**
 * 删除设备
 */
function deleteEquipment(value){
    var grid = Ext.getCmp('grid.info');
    var store = grid.getStore();
    var selModel = grid.getSelectionModel();
    var equipmentName;
    var equipmentDesc;
    var linkName;
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
            equipmentName = item.data.equipmentName;
            equipmentDesc = item.data.equipmentDesc;
            linkName = item.data.linkName;
        });
    }
    Ext.MessageBox.show({
        title:'信息',
        msg:'<font color="green">确定要删除所选记录？</font>',
        animEl:value+'.delete.info',
        width:260,
        buttons:{'ok':'确定','no':'取消'},
        icon:Ext.MessageBox.INFO,
        closable:false,
        fn:function(e){
            if(e == 'ok'){
                var myMask = new Ext.LoadMask(Ext.getBody(),{
                    msg:'正在删除,请稍后...',
                    removeMask:true
                });
                myMask.show();
                Ext.Ajax.request({
                    url : '../../EquipmentAction_delete.action',             // 删除 连接 到后台
                    params :{id:value,equipmentName:equipmentName,linkName:linkName,equipmentDesc:equipmentDesc},
                    method:'POST',
                    success : function(r,o){
                        var respText = Ext.util.JSON.decode(r.responseText);
                        var msg = respText.msg;
                        myMask.hide();
                        Ext.MessageBox.show({
                            title:'信息',
                            width:300,
                            msg:msg,
                            buttons:{'ok':'确定'},
                            animEl:value+'.delete.info',
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

function equipmentDetailInfo() {
	var grid = Ext.getCmp('grid.info');
    var store = grid.getStore();
    var selModel = grid.getSelectionModel();
    var formPanel;
    if(selModel.hasSelection()){
        var selections = selModel.getSelections();
        Ext.each(selections,function(item){
            formPanel = new Ext.form.FormPanel({
                frame:true,
                border:false,
                layout:'column',
                items:[{
                    plain:true,
                    columnWidth :.5,
                    labelAlign:'right',
                    labelWidth:100,
                    border:false,
                    layout: 'form',
                    autoScroll:true,
                    defaultType:'displayfield',
                    defaults : {
                        width : 200,
                        allowBlank : false,
                        blankText : '该项不能为空！'
                    },
                    items:[{
                        fieldLabel:'设备编号',
                        value:item.data.equipmentName
                    },{
                        fieldLabel:'设备名',
                        value:item.data.equipmentDesc
                    },{
                        fieldLabel:'设备类型',
                        value:'<img src="../../img/equ/'+item.data.equipmentTypeCode+'S.PNG" alt="'+item.data.equipmentTypeName+'" title="'+item.data.equipmentTypeName+'"/>' + item.data.equipmentTypeName
                    },{
                        fieldLabel:'是否核心设备',
                        value:(item.data.isKeyDevice=='1')?'<font color="green">是</font>':'<font color="red">否</font>'
                    },{
                        fieldLabel:"IP地址",
                        value:item.data.ip
                    },{
                        fieldLabel:"端口",
                        value:item.data.port
                    },{
                        fieldLabel:"次选IP",
                        value:item.data.otherIp
                    },{
                        fieldLabel:"MAC地址",
                        value:item.data.mac
                    },{
                        fieldLabel:"子网掩码",
                        value:item.data.subNetMask
                    },{
                        fieldLabel:"设备系统配置文件",
                        value:item.data.equipmentSysConfig=='null'||item.data.equipmentSysConfig==''?'<font color="gray">下载</font>':'<a href="javascript:;" onclick="download(\''+item.data.equipmentSysConfig+'\')">下载</a>'
                    }]
                },{
                    plain:true,
                    columnWidth :.5,
                    labelAlign:'right',
                    labelWidth:100,
                    border:false,
                    layout: 'form',
                    autoScroll:true,
                    defaultType:'displayfield',
                    defaults : {
                        width : 150,
                        allowBlank : false,
                        blankText : '该项不能为空！'
                    },
                    items:[{
                        fieldLabel:'链路类型',
                        value:show_linkType(item.data.linkType)
                    },{
                        fieldLabel:'链路名',
                        value:item.data.linkName
                    },{
                        fieldLabel:'是否开启监控',
                        value:(item.data.monitorUsed=='1')?'<font color="green">是</font>':'<font color="red">否</font>'
                    },{
                        fieldLabel:'设备管理单位',
                        value:item.data.equipmentManagerDepartName
                    },{
                        fieldLabel:'OID名称',
                        value:item.data.oidName
                    },{
                        fieldLabel:'SNMP类型',
                        value:item.data.snmpVer
                    },{
                        fieldLabel:'授权账号',
                        value:item.data.auth
                    },{
                        fieldLabel:'通讯账号',
                        value:item.data.common
                    }]
                }]
            });
        });
    }
    var win = new Ext.Window({
        title:"设备详细信息",
        width:650,
        layout:'fit',
        height:370,
        modal:true,
        items:formPanel,
        bbar:[
            '->',
            {
                text:'保存',
                handler:function(){
                    win.close();
                }
            },{
                text:'关闭',
                handler:function(){
                    win.close();
                }
            }
        ]
    }).show();
}

function download(fileName){
    if (!Ext.fly('test')) {
        var frm = document.createElement('form');
        frm.id = 'test';
        frm.name = id;
        frm.style.display = 'none';
        document.body.appendChild(frm);
    }
    Ext.Ajax.request({
        url: '../../EquipmentAction_download.action',
        params:{fileName:fileName},
        form: Ext.fly('test'),
        method: 'POST',
        isUpload: true
    });
}