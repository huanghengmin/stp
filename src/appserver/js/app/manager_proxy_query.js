/**
 * Created by IntelliJ IDEA.
 * User: 钱晓盼
 * Date: 11-11-8
 * Time: 上午10:24
 * To change this template use File | Settings | File Templates.
 */
//==================================== -- 通用代理应用 查看 extjs 页面 -- =============================================================
Ext.onReady(function(){
    Ext.BLANK_IMAGE_URL = '../../js/ext/resources/images/default/s.gif';
    Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget = 'side';
/********************************************* -- grid_panel start -- *******************************************************************************************************/
    var start = 0;			//分页--开始数
    var pageSize = 15;		//分页--每页数
    var record = new Ext.data.Record.create([
        {name:'appName',			mapping:'appName'},
        {name:'t_port',				mapping:'t_port'},
        {name:'t_serverAddress',	mapping:'t_serverAddress'},
        {name:'t_type',				mapping:'t_type'},
        {name:'port',				mapping:'port'},
        {name:'serverAddress',		mapping:'serverAddress'},
        {name:'type',				mapping:'type'}
    ]);
    var proxy = new Ext.data.HttpProxy({
        url:"../../ProxyAction_readProxyQuery.action"
    });
    var reader = new Ext.data.JsonReader({
        totalProperty:"total",
        root:"rows"
    },record);
    var store = new Ext.data.GroupingStore({
        proxy : proxy,
        reader : reader
    });
    var boxM = new Ext.grid.CheckboxSelectionModel();   //复选框
    var rowNumber = new Ext.grid.RowNumberer();         //自动 编号
    var colM = new Ext.grid.ColumnModel([
//        boxM,
        rowNumber,
        {header:"应用编号",			dataIndex:"appName",			align:'center'},
        {header:'数据源地址',		dataIndex:'serverAddress',		align:'center'},
        {header:'数据源端口',		dataIndex:'port',				align:'center'},
        {header:'类型',				dataIndex:'type',				align:'center'},
        {header:'数据目标地址',		dataIndex:'t_serverAddress',	align:'center'},
        {header:'数据目标端口',		dataIndex:'t_port',				align:'center'},
        {header:'类型(目标)',		dataIndex:'t_type',				align:'center'}

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
        id:'grid.proxy.internal.info',
        animCollapse:true,
        height:setHeight(),
        width:setWidth(),
        loadMask:{msg:'正在加载数据，请稍后...'},
        border:false,
        collapsible:false,
        cm:colM,
//        sm:boxM,
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
        view:new Ext.grid.GroupingView({
            forceFit:true,
            groupingTextTpl:'{text}({[values.rs.length]}条记录)'
        }),
        bbar:page_toolbar
    });
    
/********************************************* -- grid_panel end   -- *******************************************************************************************************/

    var port = new Ext.Viewport({
        layout:'fit',
        renderTo:Ext.getBody(),
        items:[grid_panel]
    });
	store.load({
        params:{
            start:start,limit:pageSize,type:'proxy'
        }
    });
});

//============================================ -- javascript function -- =============================================================================
function setHeight(){
	var h = document.body.clientHeight-8;
	return h;
}
function setWidth(){
    return document.body.clientWidth-8;
}