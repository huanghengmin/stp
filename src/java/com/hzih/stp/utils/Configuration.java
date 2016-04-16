package com.hzih.stp.utils;

import com.hzih.stp.domain.AuditReset;
import com.hzih.stp.entity.ChannelIChangeUtils;
import com.inetec.common.config.stp.EConfig;
import com.inetec.common.config.stp.nodes.*;
import com.inetec.common.exception.E;
import com.inetec.common.exception.Ex;
import com.inetec.common.i18n.Message;
import com.inetec.ichange.console.config.utils.HelperTargetTable;
import org.apache.log4j.Logger;
import org.dom4j.Attribute;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.Element;
import org.dom4j.io.OutputFormat;
import org.dom4j.io.SAXReader;
import org.dom4j.io.XMLWriter;

import java.io.*;
import java.text.SimpleDateFormat;
import java.util.*;

public class Configuration {
    static Logger logger = Logger.getLogger(Configuration.class);
    private Document document;
    public String confPath;

    public Configuration(Document doc) {
        this.document = doc;
    }

    public Configuration(String path) throws Ex {
        this.confPath = path;
        SAXReader saxReader = new SAXReader();
        try {
            document = saxReader.read(path);
        } catch (DocumentException e) {
            e.printStackTrace();
            logger.info(e.getMessage());
        }
    }

    public Configuration(InputStream is, String path) throws Ex {
        this.confPath = path;
        SAXReader saxReader = new SAXReader();
        try {
            document = saxReader.read(is);
        } catch (DocumentException e) {
            logger.info(e.getMessage());
        }
    }

/**********************************************************************************************************************/
/***********  安全配置   **********************************************************************************************/
/**********************************************************************************************************************/

    public String saveConnectorAllowIp() {
        String result = null;
        XMLWriter output = null;
        try {
            File file = new File(confPath);
            FileInputStream fin = new FileInputStream(file);
            byte[] bytes = new byte[fin.available()];
            while (fin.read(bytes) < 0) fin.close();
            OutputFormat format = OutputFormat.createPrettyPrint();
            format.setEncoding("UTF-8");
            output = new XMLWriter(new FileOutputStream(file),format);
            if(document != null){
                output.write(document);
                return result = "保存成功";
            }else{
                result = "dom4j处理出错";
            }
        } catch (FileNotFoundException e) {
            result = e.getMessage();
        } catch (IOException e) {
            result = e.getMessage();
        } finally {
            try {
                if (output != null)
                    output.close();
            } catch (IOException e) {
                result = e.getMessage();
            }
        }
        return "保存失败,"+result;
    }

    public String editConnectorIp(String ip, String port) {
        try{
            Element connector = (Element) document.selectSingleNode("/Server/Service/Connector[@port=" + port + "]");
            if(connector != null){
                connector.attribute("address").setText(ip);
                String result = saveConnectorAllowIp();
                if(result.equals("保存成功")){
                    if(port.equals(""+8443)){
                        return "更新管理服务接口设定IP地址成功";
                    }else if(port.equals(""+8000)){
                        return "更新集控采集数据接口设定IP地址成功";
                    }else{
                        return "更新成功,端口是"+port;
                    }
                }else{
                    return result;
                }
            }
        } catch (Exception e){
            logger.info(e.getMessage());
        }
        return "更新出错";
    }

    public String getConnectorIp(String port) {
        String ip = "";
        try{
           Element connector = (Element) document.selectSingleNode("/Server/Service/Connector[@port=" + port + "]");
            if(connector != null){
                ip = connector.attribute("address").getText();
            }
        } catch (Exception e){
            logger.info(e.getMessage());
        }
        return ip;
    }

    public List<String> getAllowIPs(){
        List<String> allowIps = new ArrayList<String>();
        try{
            Element valve = (Element) document.selectSingleNode("/Server/Service/Engine/Valve");
            if(valve!=null){
                String ip = valve.attribute("allow").getText();
                String[] ips = ip.split("\\|");
                if(ips.length>1){
                    for (int i = 0; i < ips.length; i ++){
                        if(ips[i].length()>6){
                            allowIps.add(ips[i]);
                        }
                    }
                }else{
                    if(ip.length()>6){
                        allowIps.add(ip);
                    }
                }
            }
        } catch (Exception e){
            logger.info(e.getMessage());
        }
        return allowIps;
    }

    public String editAllowIp(String ip) {
        try{
            Element value = (Element) document.selectSingleNode("/Server/Service/Engine/Valve");
            if(value!=null){
                ip = value.attribute("allow").getText() + ip;
                value.attribute("allow").setText(ip);
                String result = saveConnectorAllowIp();
                if(result.equals("保存成功")){
                    return "更新管理客户机地址成功";
                }else{
                    return result;
                }
            }
        } catch (Exception e){
            logger.info(e.getMessage());
        }
        return "更新出错";
    }

    public String deleteAllowIp(String ip) {
        try{
            Element value = (Element) document.selectSingleNode("/Server/Service/Engine/Valve");
            if(value!=null){
                value.attribute("allow").setText(ip);
                String result = saveConnectorAllowIp();
                if(result.equals("保存成功")){
                        return "删除管理客户机地址成功";
                }else{
                    return result;
                }
            }
        } catch (Exception e){
            logger.info(e.getMessage());
        }
        return "删除出错";
    }

/**********************************************************************************************************************/
    public void addType(Type type, String appType) throws Ex {
        if (type == null)
            throw new Ex().set(E.E_NullPointer, new Message("Add Type NullPoint. "));

        if (appType == null) {
            throw new Ex().set(E.E_NullPointer, new Message( "type name is null {0} ."), "appType");
        }

        else if (!appType.equals(Type.s_app_db) && !appType.equals(Type.s_app_proxy) && !appType.equals(Type.s_app_aproxy) && !appType.equals(Type.s_app_ftpproxy) && !appType.equals(Type.s_app_reproxy) && !appType.equals(Type.s_app_sipproxy )&& !appType.equals(Type.s_app_file)) {
            throw new Ex().set(E.E_NullPointer, new Message("type type  {0} not supported."), "appType");
        }

        if (type.getTypeName() == null) {
            throw new Ex().set(E.E_NullPointer, new Message("type name is null"));
        }

        Element types = (Element) document.selectSingleNode("/configuration/system/ichange/types");
        if (types == null) {
            throw new Ex().set(EConfig.E_AppNotExisted, EConfig.KEY_AppNotExisted, type.getTypeName());
        }
        List typeNodes = document.selectNodes("/configuration/system/ichange/types/type");
        if (typeNodes != null) {
            for (Iterator it = typeNodes.iterator(); it.hasNext();) {
                Element typeNode = (Element) it.next();
                if (typeNode.attribute("value").getText().equalsIgnoreCase(type.getTypeName())) {
                    throw new Ex().set(EConfig.E_AppAlreadyExisted, EConfig.KEY_AppAlreadyExisted, type.getTypeName());
                }
            }
        }

        Element typenode = types.addElement("type");

        typenode.addAttribute("value", type.getTypeName());
        typenode.addAttribute("desc", type.getDescription());
        typenode.addAttribute("apptype", appType);
        typenode.addAttribute("status",String.valueOf(StringContext.INSERT_APP));

        Element child = typenode.addElement("isactive");
        child.setText(type.isActive() ? "true" : "false");

        child = typenode.addElement("isallow");
        child.setText(type.isAllow() ? "true" : "false");

        child = typenode.addElement("isfilter");
        child.setText(type.isFilter() ? "true" : "false");
        child = typenode.addElement("isvirusscan");
        child.setText(type.isVirusScan() ? "true" : "false");
        child = typenode.addElement("infolevel");
        child.setText(String.valueOf(type.getInfoLevel()));
        child = typenode.addElement("channel");
        child.setText(type.getChannel()==null?"":type.getChannel());
        child = typenode.addElement("channelport");
        child.setText(type.getChannelPort()==null?"":type.getChannelPort());

        if (appType.equals(Type.s_app_db)) {
            child = typenode.addElement("islocal");
            child.setText(type.isLocal() ? "true" : "false");

            child = typenode.addElement("isrecover");
            child.setText(type.isRecover() ? "true" : "false");

            child = typenode.addElement("datapath");
            child.setText(type.getDataPath());

            child = typenode.addElement("deletefile");
            child.setText(type.isDeleteFile() ? "true" : "false");

            child = typenode.addElement("speed");
            child.setText(String.valueOf(type.getSpeed()));

        } else if(appType.equals(Type.s_app_file) ){
            child = typenode.addElement("speed");
            child.setText(String.valueOf(type.getSpeed()));
        } else if( appType.equals(Type.s_app_ftpproxy) || appType.equals(Type.s_app_proxy ) ) {

        }

        Element plugin = typenode.addElement("plugin");
        plugin.addElement("sourceclassname");
        plugin.addElement("targetclassname");
    }

    public void addSourcePlugin(Plugin plugin, String appName, String appType) throws Ex {

        if (plugin == null)
            throw new Ex().set(E.E_NullPointer, new Message("Plugin is null."));
        if (appName == null)
            throw new Ex().set(E.E_NullPointer, new Message("appName is null."));

        Element sourceplugin = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceplugin");
        if (sourceplugin == null) {
            Element pluginnode = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin");
            pluginnode.element("sourceclassname").setText(plugin.getSourceClassName());
            pluginnode.element("targetclassname").setText(plugin.getTargetClassName());
            sourceplugin = pluginnode.addElement("sourceplugin");

            if (appType.equals(Type.s_app_db)) {
                Element dbchange = sourceplugin.addElement("dbchange");
                Element database = dbchange.addElement("database");
                DataBase db = plugin.getDataBase();
                database.addAttribute("name", db.getDbName());
                database.addAttribute("status", db.getStatus());

                Element child = database.addElement("oldstep");
                child.setText(db.isOldStep() ? "true" : "false");

                child = database.addElement("operation");
                child.setText(db.getOperation());

                child = database.addElement("enable");
                child.setText(db.isEnable() ? "true" : "false");

                child = database.addElement("temptable");
                child.setText(db.getTempTable());

                child = database.addElement("temptableold");
                child.setText("");

                child = database.addElement("maxrecords");
                child.setText(String.valueOf(db.getMaxRecords()));

                child = database.addElement("interval");
                child.setText(String.valueOf(db.getInterval()));

                child = database.addElement("istwoway");
                child.setText(String.valueOf(db.isTwoway()));

                database.addElement("tables");
            } else if (appType.equals(Type.s_app_proxy) || appType.equals(Type.s_app_aproxy) || appType.equals(Type.s_app_ftpproxy) || appType.equals(Type.s_app_reproxy)) {
            	Element sourceclassname = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceclassname");
                sourceclassname.setText(plugin.getSourceClassName());
                Element targetclassname = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/targetclassname");
                targetclassname.setText(plugin.getTargetClassName());

            	Element socketChange = sourceplugin.addElement("socketchange");
                SocketChange change = plugin.getSourceSocket();
                Element child = socketChange.addElement("name");
                child.setText(change.getName());

                child = socketChange.addElement("serveraddress");
                child.setText(change.getServerAddress());

                child = socketChange.addElement("port");
                child.setText(change.getPort());

                child = socketChange.addElement("poolmin");
                child.setText(change.getPoolMin());

                child = socketChange.addElement("poolmax");
                child.setText(change.getPoolMax());

                child = socketChange.addElement("trytime");
                child.setText(change.getTryTime());

                child = socketChange.addElement("charset");
                child.setText(change.getCharset());

                child = socketChange.addElement("clientauthenable");
                child.setText(String.valueOf(change.isClientauthenable()));

                child = socketChange.addElement("authaddress");
                child.setText(change.getAuthaddress());

                child = socketChange.addElement("authca");
                child.setText(change.getAuthca());

                child = socketChange.addElement("authport");
                child.setText(change.getAuthport());

                child = socketChange.addElement("authcapass");
                child.setText(change.getAuthcapass());

                child = socketChange.addElement("ipfilter");
                child.setText(String.valueOf(change.getIpfilter()));

                socketChange.addElement("ipblacklist");

                socketChange.addElement("ipwhitelist");

                if (change.getIpaddress() != null && !change.getIpaddress().equals("")) {
                    child = socketChange.addElement("ipaddress");
                    child.setText(change.getIpaddress());

                } else {
                    child = socketChange.addElement("ipaddress");
                    child.setText("");
                }
                child = socketChange.addElement("type");

                child.setText(change.getType());
            } else if (appType.equals(Type.s_app_sipproxy)) {
                Element dbchange = sourceplugin.addElement("videochange");
                Element sourceclassname = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceclassname");
                sourceclassname.setText(plugin.getSourceClassName());

                Element targetclassname = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/targetclassname");
                targetclassname.setText(plugin.getTargetClassName());

                addVideoChange(dbchange, plugin.getSourceVideo());
            } else if (appType.equals(Type.s_app_file)){
            	Element sourceclassname = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceclassname");
                sourceclassname.setText(plugin.getSourceClassName());
                Element targetclassname = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/targetclassname");
                targetclassname.setText(plugin.getTargetClassName());

                Element sourcefile = sourceplugin.addElement("sourcefile");
                SourceFile sourceFile = plugin.getSourceFile();
                addSourceFile(sourcefile,sourceFile);

            }
        }
    }

    public void addSourceFile(Element sourcefile, SourceFile sourceFile) {
    	if(sourceFile!=null){
        	Element child = sourcefile.addElement("deletefile");
        	child.setText(""+sourceFile.isDeletefile());
        	child = sourcefile.addElement("isincludesubdir");
        	child.setText(""+sourceFile.isIsincludesubdir());
        	child = sourcefile.addElement("istwoway");
        	child.setText(""+sourceFile.isIstwoway());
        	child = sourcefile.addElement("dir");
        	child.setText(sourceFile.getDir());
        	child = sourcefile.addElement("filtertypes");
        	child.setText(sourceFile.getFiltertypes()==null?"":sourceFile.getFiltertypes());
        	child = sourcefile.addElement("notfiltertypes");
        	child.setText(sourceFile.getNotfiltertypes()==null?"":sourceFile.getNotfiltertypes());
        	child = sourcefile.addElement("interval");
        	child.setText(""+sourceFile.getInterval());
        	child = sourcefile.addElement("charset");
        	child.setText(sourceFile.getCharset());
        	child = sourcefile.addElement("protocol");
        	child.setText(sourceFile.getProtocol());
        	child = sourcefile.addElement("serverAddress");
        	child.setText(sourceFile.getServerAddress());
        	child = sourcefile.addElement("port");
        	child.setText(""+sourceFile.getPort());
        	child = sourcefile.addElement("userName");
        	child.setText(sourceFile.getUserName());
        	child = sourcefile.addElement("password");
        	child.setText(sourceFile.getPassword());
        	child = sourcefile.addElement("packetsize");
        	child.setText(String.valueOf(sourceFile.getPacketsize()));
        	child = sourcefile.addElement("filelistsize");
        	child.setText(String.valueOf(sourceFile.getFilelistsize()));
        	child = sourcefile.addElement("threads");
        	child.setText(String.valueOf(sourceFile.getThreads()));
        }

	}

	public void addTargetPlugin(Plugin plugin, String appName, String appType) throws Ex {

        if (plugin == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "TargetPlugin");
        if (appName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "type name is null.");

        Element targetplugin = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/targetplugin");

        if (targetplugin == null) {
            Element pluginnode = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin");
            targetplugin = pluginnode.addElement("targetplugin");

            if (appType.equals(Type.s_app_db)) {
                Element dbchange = targetplugin.addElement("dbchange");
                Element srcdb = dbchange.addElement("srcdb");

                Element sourceclassname = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceclassname");
                sourceclassname.setText(plugin.getSourceClassName());

                Element targetclassname = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/targetclassname");
                targetclassname.setText(plugin.getTargetClassName());

                SourceDb db = plugin.getSourceDb();
                srcdb.addAttribute("value", db.getDbName());

                srcdb.addElement("tables");
            } else if (appType.equals(Type.s_app_proxy) || appType.equals(Type.s_app_aproxy) || appType.equals(Type.s_app_ftpproxy) || appType.equals(Type.s_app_reproxy)) {
                SocketChange change = plugin.getTargetSocket();
                Element socketChange = targetplugin.addElement("socketchange");

                Element sourceclassname = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceclassname");
                sourceclassname.setText(plugin.getSourceClassName());

                Element targetclassname = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/targetclassname");
                targetclassname.setText(plugin.getTargetClassName());

                Element child = socketChange.addElement("name");
                child.setText(change.getName());

                child = socketChange.addElement("serveraddress");
                child.setText(change.getServerAddress());

                child = socketChange.addElement("port");
                child.setText(change.getPort());

                child = socketChange.addElement("poolmin");
                child.setText(change.getPoolMin());

                child = socketChange.addElement("poolmax");
                child.setText(change.getPoolMax());

                child = socketChange.addElement("trytime");
                child.setText(change.getTryTime());

                child = socketChange.addElement("charset");
                child.setText(change.getCharset());

                child = socketChange.addElement("type");
                child.setText(change.getType());

                child = socketChange.addElement("ipfilter");
                child.setText(String.valueOf(change.getIpfilter()));

                socketChange.addElement("ipblacklist");

                socketChange.addElement("ipwhitelist");

            }else if (appType.equals(Type.s_app_sipproxy)) {
                Element dbchange = targetplugin.addElement("servicechange");
                Element sourceclassname = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceclassname");
                sourceclassname.setText(plugin.getSourceClassName());

                Element targetclassname = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/targetclassname");
                targetclassname.setText(plugin.getTargetClassName());
                addServiceChange(dbchange, plugin.getTargetService());
            }else if (appType.equals(Type.s_app_file)){
            	Element sourceclassname = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceclassname");
                sourceclassname.setText(plugin.getSourceClassName());
                Element targetclassname = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/targetclassname");
                targetclassname.setText(plugin.getTargetClassName());

                Element targetfile = targetplugin.addElement("targetfile");

                TargetFile targetFile = plugin.getTargetFile();
                addTargetFile(targetfile,targetFile);

            }
        }
        else {
            throw new Ex().set(EConfig.E_PluginAlreadyExisted, EConfig.KEY_PluginAlreadyExisted, appName);
        }
    }

    public void addTargetFile(Element targetfile, TargetFile targetFile) {
    	if(targetFile!=null){
        	Element child = targetfile.addElement("deletefile");
        	child.setText(""+targetFile.isDeletefile());
        	child = targetfile.addElement("dir");
        	child.setText(targetFile.getDir());
        	child = targetfile.addElement("onlyadd");
        	child.setText(""+targetFile.isOnlyadd());
        	child = targetfile.addElement("charset");
        	child.setText(targetFile.getCharset());
        	child = targetfile.addElement("serverAddress");
        	child.setText(targetFile.getServerAddress());
        	child = targetfile.addElement("port");
        	child.setText(""+targetFile.getPort());
        	child = targetfile.addElement("userName");
        	child.setText(targetFile.getUserName());
        	child = targetfile.addElement("password");
        	child.setText(targetFile.getPassword());
        	child = targetfile.addElement("istwoway");
        	child.setText(String.valueOf(targetFile.isIstwoway()));
        	child = targetfile.addElement("packetsize");
        	child.setText(String.valueOf(targetFile.getPacketsize()));
        	child = targetfile.addElement("filelistsize");
        	child.setText(String.valueOf(targetFile.getFilelistsize()));
        	child = targetfile.addElement("threads");
        	child.setText(String.valueOf(targetFile.getThreads()));
        	child = targetfile.addElement("protocol");
        	child.setText(String.valueOf(targetFile.getProtocol()));

        }
	}

	public void addSourceTable(String appName,String dbName,Table table) throws Ex {
        if (appName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "appname is null.");
        if (dbName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "dbName is null.");
        if (table == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "table node is null");
        Element tables = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceplugin/dbchange/database[@name='"+dbName+"']/tables");

        if (tables != null) {
            Element tablenode = tables.addElement("table");
            tablenode.addAttribute("value", table.getTableName());

            Element child = tablenode.addElement("status");
            child.setText(table.getStatus()==null?"":table.getStatus());

            child = tablenode.addElement("flag");
            child.setText(table.getFlag()==null?"":table.getFlag());

            child = tablenode.addElement("monitordelete");
            child.setText(table.isMonitorDelete() ? "true" : "false");

            child = tablenode.addElement("monitorupdate");
            child.setText(table.isMonitorUpdate() ? "true" : "false");

            child = tablenode.addElement("monitorinsert");
            child.setText(table.isMonitorInsert() ? "true" : "false");

            child = tablenode.addElement("deletetrigger");

            child = tablenode.addElement("inserttrigger");

            child = tablenode.addElement("updatetrigger");

            child = tablenode.addElement("seqnumber");
            child.setText(String.valueOf(table.getSeqNumber()));


            child = tablenode.addElement("interval");
            child.setText(String.valueOf(table.getInterval()));
            if (table.getAllMergeTables().length > 0) {
                addSourceMergeTable(table, appName);
            }

            tablenode.addElement("fields");
        }
//        else {
//            throw new Ex().set(EConfig.E_PluginNotExisted, EConfig.KEY_PluginNotExisted, appName);
//        }
    }

	public void addTargetTable(Table table, String targetDbName, String srcTableName, String appName) throws Ex{
        Element targetdb = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/targetplugin/dbchange/srcdb/tables/srctable[@value='"+srcTableName+"']/targetdb[@value='"+targetDbName+"']");
        if(targetdb!=null){
        	Element t = targetdb.addElement("table");
        	t.addAttribute("value", table.getTableName());

        	Element child = t.addElement("deleteenable");
        	child.addText(""+table.isDeleteEnable());

        	child = t.addElement("onlyinsert");
        	child.addText(""+table.isOnlyinsert());

        	child = t.addElement("condition");
        	child.addText(table.getCondition()==null?"":table.getCondition());

        	child = t.addElement("fields");
        }

	}

    public void addTargetTable(SourceTable srcTable, String appName) throws Ex {

        if (srcTable == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "Դ表为空");
        if (appName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "appName 应用名为空");

        Element tables = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/targetplugin/dbchange/srcdb/tables");
        if (tables != null) {
            boolean isSrcTableExist = false;
            List srcs = tables.elements("srctable");
            Element srctb = null;
            for (Iterator isrc = srcs.iterator(); isrc.hasNext();) {
                Element srcTableNode = (Element) isrc.next();
                if (srcTableNode.attribute("value").getText().equals(srcTable.getTableName())) {
                    isSrcTableExist = true;
                    srctb = srcTableNode;
                    break;
                }
            }

            if (!isSrcTableExist) {
                srctb = tables.addElement("srctable");
                srctb.addAttribute("value", srcTable.getTableName());
            }

            Set targetDbs = srcTable.getAllTargetDbs();
            for (Iterator it = targetDbs.iterator(); it.hasNext();) {
                Element db = null;
                TargetDb targetDb = (TargetDb) it.next();
                List tdbs = srctb.elements("targetdb");
                Set dbnames = new HashSet();
                for (Iterator dbs = tdbs.iterator(); dbs.hasNext();) {
                    Element tdb = (Element) dbs.next();
                    dbnames.add(tdb.attribute("value"));
                }

                if (dbnames.contains(targetDb.getDbName())) {
                    for (Iterator dbs = tdbs.iterator(); dbs.hasNext();) {
                        Element tdb = (Element) dbs.next();
                        if (tdb.attribute("value").getText().equals(targetDb.getDbName())) {
                            db = tdb;
                            break;
                        }
                    }
                } else {
                    db = srctb.addElement("targetdb");
                    db.addAttribute("value", targetDb.getDbName());
                }

                Table table = targetDb.getTable();
                Element tb = db.addElement("table");
                tb.addAttribute("value", table.getTableName());

                Element client = tb.addElement("deleteenable");
                client.setText(table.isDeleteEnable() ? "true" : "false");

                client = tb.addElement("onlyinsert");
                client.setText(table.isOnlyinsert() ? "true" : "false");

                client = tb.addElement("condition");
                client.setText(table.getCondition());

                tb.addElement("fields");
            }
        }
    }

    public void addSourceField(String appName, String dbName, String tableName, Field field) throws Ex {

        if (appName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "appName 应用名为空");
        if (dbName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "dbName 为空");
        if (tableName == null) {
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "tableName 表名为空");
        }
        if (field == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "字段为空");

        Element fields = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceplugin/dbchange/database[@name='"+dbName+"']/tables/table[@value='" + tableName + "']/fields");
        if (fields != null) {
            Element fieldnode = fields.addElement("field");
            fieldnode.addAttribute("value", field.getFieldName());

            Element child = fieldnode.addElement("JDBC_TYPE");
            child.setText(field.getJdbcType());

            child = fieldnode.addElement("IS_PK");
            child.setText(field.isPk() ? "true" : "false");

            child = fieldnode.addElement("COLUMN_SIZE");
            child.setText(String.valueOf(field.getColumnSize()));

            child = fieldnode.addElement("IS_NULL");
            child.setText(field.isNull() ? "true" : "false");

            child = fieldnode.addElement("DB_TYPE");
            child.setText(field.getDbType());
        }
    }

    public void addSourceMergeTable(Table table, String appName) throws Ex {

        if (table == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "表为空");
        if (appName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "appName 应用名为空");

        Element fields = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceplugin/dbchange/database/tables/table[@value='" + table.getTableName() + "']");
        if (fields != null) {
            Element mergeTables = fields.addElement("mergetables");
            MergeTable merges[] = table.getAllMergeTables();
            for (int i = 0; i < merges.length; i++) {
                Element fieldnode = mergeTables.addElement("mergetable");
                fieldnode.addAttribute("value", merges[i].getMergeTableName());
                MergeField mergeFields[] = merges[i].getAllFields();
                Element mergefieldnodes = fieldnode.addElement("mergefields");
                for (int j = 0; j < mergeFields.length; j++) {
                    Element mergefieldnode = mergefieldnodes.addElement("mergefield");
                    mergefieldnode.addAttribute("name", mergeFields[j].getFieldName());
                    mergefieldnode.addAttribute("value", mergeFields[j].getMergeFieldName());
                }
            }
        }
//        else {
//            throw new Ex().set(EConfig.E_PluginNotExisted, EConfig.KEY_PluginNotExisted, appName);
//        }
    }

    public void editSourceMergeTable(Table table, String appName) throws Ex {

        if (table == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "表为空");
        if (appName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "appName 应用名为空");

        Element fields = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceplugin/dbchange/database/tables/table[@value='" + table.getTableName() + "']");
        if (fields != null) {
            Element mergeTables = fields.addElement("mergetables");
            MergeTable merges[] = table.getAllMergeTables();
            for (int i = 0; i < merges.length; i++) {
                Element fieldnode = mergeTables.addElement("mergetable");
                fieldnode.addAttribute("value", merges[i].getMergeTableName());
                MergeField mergeFields[] = merges[i].getAllFields();
                Element mergefieldnodes = fieldnode.addElement("mergefields");
                for (int j = 0; j < mergeFields.length; j++) {
                    Element mergefieldnode = mergefieldnodes.addElement("mergefield");
                    mergefieldnode.addAttribute("name", mergeFields[j].getFieldName());
                    mergefieldnode.addAttribute("value", mergeFields[j].getMergeFieldName());
                }
            }
        }
//        else {
//            throw new Ex().set(EConfig.E_PluginNotExisted, EConfig.KEY_PluginNotExisted, appName);
//        }
    }

	public void addTargetTableDB(String targetDB, String srcTableName, String appName) throws Ex {
		Element srctable = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/targetplugin/dbchange/srcdb/tables/srctable[@value='"+srcTableName+"']");
		Element targetdb = (Element)srctable.selectSingleNode("target[@value='"+targetDB+"']");
		if(targetdb==null){
			Element e = srctable.addElement("targetdb");
			e.addAttribute("value",targetDB);
		}

	}

	public void addTargetTableName(String appName, String targetDB,String targetTableName, String srcTableName) throws Ex{
		Element targetdb = (Element)document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/targetplugin/dbchange/srcdb/tables/srctable[@value='"+srcTableName+"']/target[@value='"+targetDB+"']");
		Element table = (Element) targetdb.selectSingleNode("table[@value='"+targetTableName+"']");
		if(table == null){
			Element e = targetdb.addElement("table");
			e.addAttribute("value",targetTableName);
		}
	}

    public void addTargetField(String tableName, String srctable, String appName, String targetDb, Field field) throws Ex {

        if (tableName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "ԴtableName 表名为空�");
        if (appName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "appName 应用名为空");
        if (field == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "字段为空");

        Element fields = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/targetplugin/*/*/*/srctable[@value='" + srctable + "']/targetdb[@value='" + targetDb + "']/table[@value='" + tableName + "']/fields");
        if (fields != null) {
            Element fieldnode = fields.addElement("field");
            fieldnode.addAttribute("value", field.getFieldName());

            Element child = fieldnode.addElement("JDBC_TYPE");
            child.setText(field.getJdbcType());

            child = fieldnode.addElement("IS_PK");
            child.setText(field.isPk() ? "true" : "false");

            child = fieldnode.addElement("COLUMN_SIZE");
            child.setText(String.valueOf(field.getColumnSize()));

            child = fieldnode.addElement("IS_NULL");
            child.setText(field.isNull() ? "true" : "false");

            child = fieldnode.addElement("DB_TYPE");
            child.setText(field.getDbType());

            child = fieldnode.addElement("DESTFIELD");
            child.setText(field.getDestField()==null?"":field.getDestField());
        }
//        else {
//            throw new Ex().set(EConfig.E_PluginNotExisted, EConfig.KEY_PluginNotExisted, appName);
//        }
    }

    public void addRestartTime(String time) {
        Element restartTime = (Element) document.selectSingleNode("/configuration/system/ichange/ichangeutils/restarttime");
        if(restartTime!=null){
            restartTime.setText(time);
        }
    }

    public void addSNMPClient(String snmpclient) {
        Element ichangeutils = (Element) document.selectSingleNode("/configuration/system/ichange/ichangeutils");
        Element snmpClientSet = (Element) document.selectSingleNode("/configuration/system/ichange/ichangeutils/snmpclientset");
        Element snmpClient = null;
        if(snmpClientSet!=null){
            snmpClient = snmpClientSet.addElement("snmpclient");
        }else{
        	snmpClientSet = ichangeutils.addElement("snmpclientset");
        	snmpClient = snmpClientSet.addElement("snmpclient");
        }
        Element host = snmpClient.addElement("host");
        host.setText(snmpclient.split(":")[0]);
        Element port = snmpClient.addElement("port");
        port.setText(snmpclient.split(":")[1]);
    }

    public void editSNMPClient(String newSNMPClient,String snmpclient){
        Iterator client = document.selectNodes("/configuration/system/ichange/ichangeutils/snmpclientset/snmpclient").iterator();
        if(client!=null){
            for(;client.hasNext();){
                Element snmpClient = (Element) client.next();
                Element host = snmpClient.element("host");
                Element port = snmpClient.element("port");
                String oldSNMPClient = host.getText()+":"+port.getText();
                if(snmpclient.equals(oldSNMPClient)){
                	host.setText(newSNMPClient.split(":")[0]);
                    port.setText(newSNMPClient.split(":")[1]);
                    break;
                }
            }
        }
    }

    public void addSysLogClient(String syslogclient){
        Element ichangeutils = (Element)document.selectSingleNode("/configuration/system/ichange/ichangeutils");
        Element sysLogClientSet = (Element)document.selectSingleNode("/configuration/system/ichange/ichangeutils/syslogclientset");
        Element sysLogClient = null;
        if(sysLogClientSet!=null){
            sysLogClient = sysLogClientSet.addElement("syslogclient");
        }else{
        	sysLogClientSet = ichangeutils.addElement("syslogclientset");
        	sysLogClient = sysLogClientSet.addElement("syslogclient");
        }
        Element host = sysLogClient.addElement("host");
        host.setText(syslogclient.split(":")[0]);
        Element port = sysLogClient.addElement("port");
        port.setText(syslogclient.split(":")[1]);
    }

    public void editSysLogClient(String newSysLogClient,String syslogclient){
        Iterator client = document.selectNodes("/configuration/system/ichange/ichangeutils/syslogclientset/syslogclient").iterator();
        if(client!=null){
            for(;client.hasNext();){
                Element sysLogClient = (Element) client.next();
                Element host = sysLogClient.element("host");
                Element port = sysLogClient.element("port");
                String oldSysLogClient = host.getText()+":"+port.getText();
                if(syslogclient.equals(oldSysLogClient)){
                    host.setText(newSysLogClient.split(":")[0]);
                    port.setText(newSysLogClient.split(":")[1]);
                    break;
                }
            }
        }
    }

    public void addJdbcConfig(Jdbc jdbc) throws Ex {
        if (jdbc == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "jdbctableName 表名为空表为空Ϣ");

        Element jdbcs = (Element) document.selectSingleNode("/configuration/system/ichange/jdbcs");

        if (jdbcs != null) {

            Element jdbcnode = jdbcs.addElement("jdbc");

            jdbcnode.addAttribute("value", jdbc.getJdbcName());
            jdbcnode.addAttribute("desc", jdbc.getDescription());

            Element child = jdbcnode.addElement("dbtype");
            child.setText(jdbc.getDbType());

            child = jdbcnode.addElement("version");
            child.setText(jdbc.getVersion());

            child = jdbcnode.addElement("dbvender");
            child.setText(jdbc.getDbVender());

            child = jdbcnode.addElement("dbcatalog");
            child.setText((jdbc.getDbCatalog() != null) ? jdbc.getDbCatalog() : "");

            child = jdbcnode.addElement("dburl");
            child.setText(jdbc.getDbUrl());

            child = jdbcnode.addElement("dbowner");
            child.setText(jdbc.getDbOwner());

            child = jdbcnode.addElement("dbhost");
            child.setText(jdbc.getDbHost());

            child = jdbcnode.addElement("dbport");
            child.setText(jdbc.getDbPort());

            child = jdbcnode.addElement("driverclass");
            child.setText(jdbc.getDriverClass());

            child = jdbcnode.addElement("dbuser");
            child.setText(jdbc.getDbUser());

            child = jdbcnode.addElement("password");
            child.setText(jdbc.getPassword());

            child = jdbcnode.addElement("encoding");
            child.setText(jdbc.getEncoding());
        }
    }

    public void editJdbcConfig(Jdbc jdbc) throws Ex {
        if (jdbc == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "JDBC表为空Ϣ");

        Element jdbcnode = (Element) document.selectSingleNode("/configuration/system/ichange/jdbcs/jdbc[@value='" + jdbc.getJdbcName() + "']");
        if (jdbcnode != null) {
            jdbcnode.attribute("desc").setText(jdbc.getDescription());

            jdbcnode.element("driverclass").setText(jdbc.getDriverClass());
            jdbcnode.element("dburl").setText(jdbc.getDbUrl());
            jdbcnode.element("dbowner").setText(jdbc.getDbOwner());
            jdbcnode.element("dbhost").setText(jdbc.getDbHost());
            if(jdbcnode.element("dbport")==null){
                jdbcnode.addElement("dbport");
            }
            jdbcnode.element("dbport").setText(jdbc.getDbPort());
            jdbcnode.element("dbtype").setText(jdbc.getDbType());
            if(jdbcnode.element("version")==null){
                jdbcnode.addElement("version");
            }
            jdbcnode.element("version").setText(jdbc.getVersion());
            jdbcnode.element("dbuser").setText(jdbc.getDbUser());
            jdbcnode.element("password").setText(jdbc.getPassword());
            jdbcnode.element("encoding").setText(jdbc.getEncoding());
            jdbcnode.element("dbvender").setText(jdbc.getDbVender());
            jdbcnode.element("dbcatalog").setText((jdbc.getDbCatalog() != null) ? jdbc.getDbCatalog() : "");
        } else {
            throw new Ex().set(EConfig.E_JdbcNotExisted, EConfig.KEY_JdbcNotExisted, jdbc.getJdbcName());
        }
    }

    public void editType(Type type, String appType) throws Ex {
        if (type == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "应用为空");
        Element typeNode = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + type.getTypeName() + "']");
        if (typeNode != null) {
            typeNode.attribute("apptype").setText(appType);
            typeNode.attribute("status").setText(String.valueOf(StringContext.UPDATE_APP));
            if(type.getDescription()!=null){
                typeNode.attribute("desc").setText(type.getDescription());
            }
            typeNode.element("isactive").setText(type.isActive() ? "true" : "false");
            typeNode.element("isallow").setText(type.isAllow() ? "true" : "false");
            typeNode.element("isfilter").setText(type.isFilter() ? "true" : "false");
            typeNode.element("isvirusscan").setText(type.isVirusScan() ? "true" : "false");
            typeNode.element("infolevel").setText(String.valueOf(type.getInfoLevel()));
            if(type.getChannel()!=null&&type.getChannel().length()>0){
                typeNode.element("channel").setText(type.getChannel());
            }
            if(type.getChannelPort()!=null&&type.getChannelPort().length()>0){
                typeNode.element("channelport").setText(type.getChannelPort());
            }
            if (appType.equals(Type.s_app_db)) {
                typeNode.element("islocal").setText(type.isLocal() ? "true" : "false");
                typeNode.element("isrecover").setText(type.isRecover() ? "true" : "false");
                if(type.getDataPath()!=null){
                    typeNode.element("datapath").setText(type.getDataPath());
                }
                typeNode.element("deletefile").setText(type.isDeleteFile() ? "true" : "false");
                typeNode.element("speed").setText(String.valueOf(type.getSpeed()));
            }if(appType.equals(Type.s_app_file)){
                typeNode.element("speed").setText(String.valueOf(type.getSpeed()));
            } else if(appType.equals(Type.s_app_ftpproxy)||appType.equals(Type.s_app_proxy)){

            }
        } else {
            throw new Ex().set(EConfig.E_AppNotExisted, EConfig.KEY_AppNotExisted, type.getTypeName());
        }
    }


    public void updateTypeAppSend(String appName, int status) throws Ex{
        Element typeNode = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']");
        typeNode.attribute("status").setText(String.valueOf(status));
    }

    public void updateTypeAppSend(int status) {
        List typeNodes = document.selectNodes("/configuration/system/ichange/types/type");
        if (typeNodes != null) {
            List types = new ArrayList();
            for (Iterator it = typeNodes.iterator(); it.hasNext();) {
                Element tp = (Element) it.next();
                tp.attribute("status").setText(String.valueOf(status));
            }
        }
    }

    public void editTypeIsActiveToFalse() throws Ex{
        Element types = (Element) document.selectSingleNode("/configuration/system/ichange/types");
        Iterator typeNode = document.selectNodes("/configuration/system/ichange/types/type").iterator();
        if (typeNode != null) {
            for (; typeNode.hasNext();) {
                Element type = (Element) typeNode.next();
                type.attribute("status").setText(String.valueOf(0));
                type.element("isactive").setText("false");
            }
        }
    }
    public void addDataBase(String appName, DataBase db) throws Ex{
        if (appName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "appName 应用名为空");
        Element dataBase = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceplugin/dbchange/database[@name='"+db.getDbName()+"']");
        if(dataBase==null){
            Element dbchange = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceplugin/dbchange");
            Element database = dbchange.addElement("database");
            database.addAttribute("name", db.getDbName());
            database.addAttribute("status", db.getStatus());

            Element child = database.addElement("oldstep");
            child.setText(db.isOldStep() ? "true" : "false");

            child = database.addElement("operation");
            child.setText(db.getOperation());

            child = database.addElement("enable");
            child.setText(db.isEnable() ? "true" : "false");

            child = database.addElement("temptable");
            child.setText(db.getTempTable()==null?"":db.getTempTable());

            child = database.addElement("temptableold");
            child.setText(db.getTempTableOld()==null?"":db.getTempTableOld());

            child = database.addElement("maxrecords");
            child.setText(String.valueOf(db.getMaxRecords()));

            child = database.addElement("interval");
            child.setText(String.valueOf(db.getInterval()));

            child = database.addElement("istwoway");
            child.setText(String.valueOf(db.isTwoway()));

            database.addElement("tables");
        } else {
            if(dataBase.attribute("status")==null){
                dataBase.addAttribute("status","");
            }
            dataBase.attribute("status").setText(StringContext.DB_UPDATE);
        }

    }
    public void editDataBase(String appName, DataBase database) throws Ex {
        if (appName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "appName 应用名为空");

        Element db = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceplugin/dbchange/database[@name='"+database.getDbName()+"']");
        if (db != null) {
            if(db.attribute("status")==null){
                db.addAttribute("status","");
            }
            db.attribute("status").setText(database.getStatus());
            db.element("istwoway").setText(String.valueOf(database.isTwoway()));
            db.element("enable").setText(String.valueOf(database.isEnable()));
            db.element("interval").setText(String.valueOf(database.getInterval()));
            db.element("maxrecords").setText(String.valueOf(database.getMaxRecords()));
            db.element("oldstep").setText(String.valueOf(database.isOldStep()));
            db.element("operation").setText(database.getOperation());
            db.element("temptable").setText(database.getTempTable()==null?"":database.getTempTable());
            if(db.element("temptableold")==null){
                db.addElement("temptableold");
            }
            db.element("temptableold").setText(database.getTempTableOld()==null?"":database.getTempTableOld());
        }
    }

    public void editSocketChange(String appName, SocketChange socketChange, String pluginType) throws Ex {
        if (appName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "appName为空");
        if (pluginType == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "pluginType为空");
        Element change = null;
        if (pluginType.equals(Plugin.s_source_plugin)){
            change = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceplugin/socketchange");
            if (change != null) {
                change.element("clientauthenable").setText(String.valueOf(socketChange.isClientauthenable()));
                change.element("authca").setText(socketChange.getAuthca()==null?"":socketChange.getAuthca());
                change.element("authaddress").setText(socketChange.getAuthaddress()==null?"":socketChange.getAuthaddress());
                change.element("authcapass").setText(socketChange.getAuthcapass()==null?"":socketChange.getAuthcapass());
                change.element("authport").setText(socketChange.getAuthport()==null?"":socketChange.getAuthport());
            }
        } else if (pluginType.equals(Plugin.s_target_plugin)){
            change = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/targetplugin/socketchange");
        }

        if (change != null) {
            if (socketChange.getName() != null)
                change.element("name").setText(socketChange.getName());
            else
                change.element("name").setText("");
            if (socketChange.getServerAddress() != null) {
                change.element("serveraddress").setText(socketChange.getServerAddress());
            } else {
                change.element("serveraddress").setText("0.0.0.0");
            }
            change.element("ipfilter").setText(String.valueOf(socketChange.getIpfilter()));
            change.element("port").setText(socketChange.getPort());
            change.element("poolmin").setText(socketChange.getPoolMin());
            change.element("poolmax").setText(socketChange.getPoolMax());
            change.element("trytime").setText(socketChange.getTryTime());
            change.element("charset").setText(socketChange.getCharset());
            change.element("type").setText(socketChange.getType());
            if (socketChange.getIpaddress() != null && !socketChange.getIpaddress().equals("")) {
                if (socketChange.getIpaddress().equalsIgnoreCase("null")) {
                    socketChange.setIpAddress("");
                }
                change.element("ipaddress").setText(socketChange.getIpaddress());
            }
        }
    }

    public void editSourceFile(String appName, SourceFile sourceFile, String pluginType) throws Ex {
        if (appName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "appName 应用名为空");
        if (pluginType == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "pluginType");
        Element sourcefile = null;
        if (pluginType.equals(Plugin.s_source_plugin)){
        	sourcefile = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceplugin/sourcefile");
        	if (sourcefile != null) {
//        		Element sourcefile = change.element("sourcefile");
        		sourcefile.element("deletefile").setText(""+sourceFile.isDeletefile());
        		sourcefile.element("isincludesubdir").setText(""+sourceFile.isIsincludesubdir());
        		sourcefile.element("istwoway").setText(""+sourceFile.isIstwoway());
        		sourcefile.element("dir").setText(sourceFile.getDir());
        		sourcefile.element("filtertypes").setText(sourceFile.getFiltertypes()==null?"":sourceFile.getFiltertypes());
        		sourcefile.element("notfiltertypes").setText(sourceFile.getNotfiltertypes()==null?"":sourceFile.getNotfiltertypes());
        		sourcefile.element("interval").setText(""+sourceFile.getInterval());
        		sourcefile.element("charset").setText(sourceFile.getCharset());
        		sourcefile.element("protocol").setText(sourceFile.getProtocol());
        		sourcefile.element("serverAddress").setText(sourceFile.getServerAddress());
        		sourcefile.element("port").setText(""+sourceFile.getPort());
        		sourcefile.element("userName").setText(sourceFile.getUserName());
        		sourcefile.element("password").setText(sourceFile.getPassword());
        		sourcefile.element("threads").setText(""+sourceFile.getThreads());
        		sourcefile.element("filelistsize").setText(""+sourceFile.getFilelistsize());
        		sourcefile.element("packetsize").setText(""+sourceFile.getPacketsize());
        	}
        }
    }

    public void editTargetFile(String appName, TargetFile targetFile, String pluginType) throws Ex {
        if (appName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "appName 应用名为空");
        if (pluginType == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "pluginType");
        Element targetfile = null;
        if (pluginType.equals(Plugin.s_target_plugin)){
        	targetfile = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/targetplugin/targetfile");
            if(targetfile!=null){
//            	Element targetfile = change.element("targetfile");
            	targetfile.element("deletefile").setText(""+targetFile.isDeletefile());
            	targetfile.element("onlyadd").setText(""+targetFile.isOnlyadd());
            	targetfile.element("dir").setText(targetFile.getDir());
            	targetfile.element("charset").setText(targetFile.getCharset());
            	targetfile.element("serverAddress").setText(targetFile.getServerAddress());
            	targetfile.element("port").setText(""+targetFile.getPort());
            	targetfile.element("userName").setText(targetFile.getUserName());
            	targetfile.element("password").setText(targetFile.getPassword());
            	targetfile.element("threads").setText(""+targetFile.getThreads());
            	targetfile.element("packetsize").setText(""+targetFile.getPacketsize());
            	targetfile.element("filelistsize").setText(""+targetFile.getFilelistsize());
            	targetfile.element("protocol").setText(targetFile.getProtocol());
            	targetfile.element("istwoway").setText(String.valueOf(targetFile.isIstwoway()));
            }
        }

    }

    //todo add by wxh 2009-03-21

    public void editServiceChange(String appName, ServiceChange socketChange, String pluginType) throws Ex {
        if (appName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "appName 应用名为空");
        if (pluginType == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "pluginType");
        Element change = null;
        if (pluginType.equals(Plugin.s_source_plugin))
            change = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceplugin/videochange");
        else if (pluginType.equals(Plugin.s_target_plugin))
            change = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/targetplugin/servicechange");

        if (change != null) {
            change.element("serveraddress").setText(socketChange.getServerAddress());
            change.element("serviceaddress").setText(socketChange.getServiceAddress());
            change.element("serviceport").setText(socketChange.getServicePort());
            change.element("port").setText(String.valueOf(socketChange.getPort()));
            change.element("udpportmin").setText(String.valueOf(socketChange.getUdpPortMin()));
            change.element("udpportmax").setText(String.valueOf(socketChange.getUdpPortMax()));
            change.element("transport").setText(socketChange.getTransport());
            change.element("authserver").setText(socketChange.getAuthServer());
            change.element("videoserverset").setText(socketChange.getVideoServerSet());
            change.element("managerserverset").setText(socketChange.getManagerServerSet());
            change.element("ptzserverset").setText(socketChange.getPtzServerSet());
            change.element("charset").setText(socketChange.getCharset());
            change.element("vendorcode").setText(socketChange.getVendorCode());
            change.element("videoencode").setText(socketChange.getVideoencode());
            change.element("rtspportset").setText(socketChange.getRtspportset());
            change.element("udprecvaddress").setText(socketChange.getUdprecvAddress());
            change.element("webaddress").setText(socketChange.getWebAddress());
            change.element("webport").setText(String.valueOf(socketChange.getWebPort()));
            change.element("ipfilter").setText(String.valueOf(socketChange.getIpfilter()));


            /* if (socketChange.getIpaddress() != null && !socketChange.getIpaddress().equals("")) {
                change.element("ipaddress").setText(socketChange.getIpaddress());
            }*/
        }
    }

    public void addServiceChange(Element change, ServiceChange socketChange) throws Ex {

        if (change != null) {
            //change.element("name").setText(socketChange.getName());
            Element child = change.addElement("serveraddress");
            child.setText(socketChange.getServerAddress());

            child = change.addElement("serviceaddress");
            child.setText(socketChange.getServiceAddress());

            child = change.addElement("serviceport");
            child.setText(socketChange.getServicePort());

            child = change.addElement("port");
            child.setText(String.valueOf(socketChange.getPort()));

            child = change.addElement("udpportmin");
            child.setText(String.valueOf(socketChange.getUdpPortMin()));

            child = change.addElement("udpportmax");
            child.setText(String.valueOf(socketChange.getUdpPortMax()));

            child = change.addElement("transport");
            child.setText(String.valueOf(socketChange.getTransport()));
        /*
            child.setText(String.valueOf(socketChange.getUdpdatalength()));
            child = change.addElement("udpdatalength");

            child = change.addElement("poolmin");
            child.setText(socketChange.getPoolMin());

            child = change.addElement("poolmax");
            child.setText(socketChange.getPoolMax());

            child = change.addElement("looptime");
            child.setText(socketChange.getLoopTime());

            child = change.addElement("length");
            child.setText(String.valueOf(socketChange.getLength()));
         */
            child = change.addElement("charset");
            child.setText(socketChange.getCharset());

            child = change.addElement("authserver");
            child.setText(socketChange.getAuthServer());

            child = change.addElement("videoserverset");
            child.setText(socketChange.getVideoServerSet());

            child = change.addElement("managerserverset");
            child.setText(socketChange.getManagerServerSet());

            child = change.addElement("ptzserverset");
            child.setText(socketChange.getPtzServerSet());

            child = change.addElement("rtspportset");
            child.setText(socketChange.getRtspportset());

            child = change.addElement("vendorcode");
            child.setText(socketChange.getVendorCode());

            child = change.addElement("videoencode");
            child.setText(socketChange.getVideoencode());

            child = change.addElement("udprecvaddress");
            child.setText(socketChange.getUdprecvAddress());

            child = change.addElement("webaddress");
            child.setText(socketChange.getWebAddress());

            child = change.addElement("webport");
            child.setText(String.valueOf(socketChange.getWebPort()));

            child = change.addElement("ipfilter");
            child.setText(String.valueOf(socketChange.getIpfilter()));

            child = change.addElement("ipwhitelist");

            child = change.addElement("ipblacklist");




            /* if (socketChange.getIpaddress() != null && !socketChange.getIpaddress().equals("")) {
                change.element("ipaddress").setText(socketChange.getIpaddress());
            }*/
        }
    }

    //todo add by wxh 2009-03-21

    public void editVideoChange(String appName, VideoChange socketChange, String pluginType) throws Ex {
        if (appName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "appName 应用名为空");
        if (pluginType == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "pluginType");
        Element change = null;
        if (pluginType.equals(Plugin.s_source_plugin))
            change = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceplugin/videochange");
        else if (pluginType.equals(Plugin.s_target_plugin))
            change = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/targetplugin/servicechange");
        if (change != null) {
            change.element("serveraddress").setText(socketChange.getServerAddress());
            change.element("serviceaddress").setText(socketChange.getServiceAddress());
            change.element("serviceport").setText(socketChange.getServicePort());
            change.element("port").setText(String.valueOf(socketChange.getPort()));
            change.element("udpportmin").setText(String.valueOf(socketChange.getUdpPortMin()));
            change.element("udpportmax").setText(String.valueOf(socketChange.getUdpPortMax()));

            change.element("transport").setText(socketChange.getTransport());

            change.element("charset").setText(socketChange.getCharset());
            change.element("clientauthenable").setText(String.valueOf(socketChange.isClientauthenable()));
            change.element("authaddress").setText(socketChange.getAuthaddress());
            change.element("vendorcode").setText(socketChange.getVendorCode());
            change.element("rtspportset").setText(socketChange.getRtspportset());
            change.element("ipfilter").setText(String.valueOf(socketChange.getIpfilter()));
            change.element("authca").setText(socketChange.getAuthca());
            change.element("authcapass").setText(socketChange.getAuthcapass());
            change.element("authport").setText(socketChange.getAuthport());
            change.element("webport").setText(String.valueOf(socketChange.getWebPort()));
        }
    }

    public void addVideoChange(Element change, VideoChange socketChange) throws Ex {

        if (change != null) {
            Element child = change.addElement("serveraddress");
            child.setText(socketChange.getServerAddress());

            child = change.addElement("serviceaddress");
            child.setText(socketChange.getServiceAddress());

            child = change.addElement("serviceport");
            child.setText(socketChange.getServicePort());

            child = change.addElement("port");
            child.setText(String.valueOf(socketChange.getPort()));

            child = change.addElement("udpportmin");
            child.setText(String.valueOf(socketChange.getUdpPortMin()));

            child = change.addElement("udpportmax");
            child.setText(String.valueOf(socketChange.getUdpPortMax()));

            child = change.addElement("charset");
            child.setText(socketChange.getCharset());

            child = change.addElement("clientauthenable");
            child.setText(String.valueOf(socketChange.isClientauthenable()));

            child = change.addElement("authaddress");
            while(socketChange.getAuthaddress()!=null){
            	child.setText(socketChange.getAuthaddress());
            }

            child = change.addElement("rtspportset");
            child.setText(socketChange.getRtspportset());

            child = change.addElement("transport");
            child.setText(socketChange.getTransport());

            child = change.addElement("vendorcode");
            child.setText(socketChange.getVendorCode());

            child = change.addElement("ipfilter");
            child.setText(String.valueOf(socketChange.getIpfilter()));

            child = change.addElement("ipblacklist");

            child = change.addElement("ipwhitelist");

            child = change.addElement("authport");
            while(socketChange.getAuthport()!=null){
            	child.setText(socketChange.getAuthport());
            }

            child = change.addElement("authca");
            while(socketChange.getAuthca()!=null){
            	child.setText(socketChange.getAuthca());
            }

            child = change.addElement("authcapass");
            while(socketChange.getAuthcapass() != null){
            	child.setText(socketChange.getAuthcapass());
            }

            child = change.addElement("webport");
           	child.setText(String.valueOf(socketChange.getWebPort()));

        }
    }

    public void addBlackIpMac(String appName, IpMac ipMac,String pluginType) throws Ex {
        if (appName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "appName 应用名为空");
        if (pluginType == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "pluginType");
        Element ipMacList = null;
        if (pluginType.equals(Plugin.s_source_plugin))
            ipMacList = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceplugin/videochange/ipblacklist");
        else if (pluginType.equals(Plugin.s_target_plugin))
            ipMacList = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/targetplugin/servicechange/ipblacklist");
        if(ipMacList!=null){
            Element ipBlack = ipMacList.addElement("ipblack");

            Element child = ipBlack.addElement("ip");
            child.setText(ipMac.getIp());

            child= ipBlack.addElement("mac");
            child.setText(ipMac.getMac());
        }

    }

    public void addWhiteIpMac(String appName, IpMac ipMac,String pluginType) throws Ex {
        if (appName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "appName 应用名为空");
        if (pluginType == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "pluginType");
        Element ipMacList = null;
        if (pluginType.equals(Plugin.s_source_plugin))
            ipMacList = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceplugin/videochange/ipwhitelist");
        else if (pluginType.equals(Plugin.s_target_plugin))
            ipMacList = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/targetplugin/servicechange/ipwhitelist");
        if(ipMacList!=null){
            Element ipWhite = ipMacList.addElement("ipwhite");

            Element child = ipWhite.addElement("ip");
            child.setText(ipMac.getIp());

            child= ipWhite.addElement("mac");
            child.setText(ipMac.getMac());
        }

    }

    public void addProxyBlackIpMac(String appName, IpMac[] ipMacs) throws Ex{
        if (appName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "appName为空");
        Element ipMacList = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceplugin/socketchange/ipblacklist");
        if(ipMacList == null){
            ipMacList = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/targetplugin/socketchange/ipblacklist");
        }
        if(ipMacList!=null){
            for(int i=0;i<ipMacs.length;i++){
                Element ipBlack = ipMacList.addElement("ipblack");
                Element child = ipBlack.addElement("ip");
                child.setText(ipMacs[i].getIp());
                child= ipBlack.addElement("mac");
                child.setText(ipMacs[i].getMac());
            }

        }
    }

    public void addProxyWhiteIpMac(String appName, IpMac[] ipMacs) throws Ex{
        if (appName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "appName为空");
        Element ipMacList = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceplugin/socketchange/ipwhitelist");
        if(ipMacList == null){
            ipMacList = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/targetplugin/socketchange/ipwhitelist");
        }
        if(ipMacList!=null){
            for(int i=0;i<ipMacs.length;i++){
                Element ipWhite = ipMacList.addElement("ipwhite");
                Element child = ipWhite.addElement("ip");
                child.setText(ipMacs[i].getIp());
                child= ipWhite.addElement("mac");
                child.setText(ipMacs[i].getMac());
            }
        }
    }

    public void editAuth(String appName, String pluginType) throws Ex {
    	if (appName == null)
    		throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "appName 应用名为空");
    	Element videochange = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceplugin/videochange");
    	if(videochange!=null){
    		videochange.remove(videochange.element("authadress"));
    		videochange.remove(videochange.element("authport"));
    		videochange.remove(videochange.element("authca"));
    		videochange.remove(videochange.element("authcapass"));
    		videochange.addElement("authadress");
    		videochange.addElement("authport");
    		videochange.addElement("authca");
    		videochange.addElement("authcapass");
    	}
    }

    public void editRootDesc(String text){
        if(text!=null){
            Element root = document.getRootElement();
            Attribute desc = root.attribute("desc");
            if(desc == null){
                root.addAttribute("desc",text);
            }else {
                root.attribute("desc").setText(text);
            }
        }
    }

    public void editSourcePlugin(Plugin plugin, String appName) throws Ex {
        if (plugin == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "SourcePlugin");
        if (appName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "appName 应用名为空");

        Element sourceplugin = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceplugin");
        //todo throw null exception
        if (sourceplugin != null) {
            DataBase database = plugin.getDataBase();

            sourceplugin.element("sourceclassname").setText(plugin.getSourceClassName());
            sourceplugin.element("targetclassname").setText(plugin.getTargetClassName());

            Element db = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceplugin/dbchange/database");
            //todo throw null exception
            db.attribute("name").setText(database.getDbName());
            db.element("istwoway").setText(String.valueOf(database.isTwoway()));
            db.element("oldstep").setText(String.valueOf(database.isOldStep()));
            db.element("operation").setText(database.getOperation());
            db.element("temptable").setText(database.getTempTable());
            db.element("maxrecords").setText(String.valueOf(database.getMaxRecords()));
            db.element("interval").setText(String.valueOf(database.getInterval()));
            db.element("enable").setText(String.valueOf(database.isEnable()));
        } else {
            throw new Ex().set(EConfig.E_PluginNotExisted, EConfig.KEY_PluginNotExisted, appName);
        }
    }

    public void editTargetPlugin(Plugin plugin, String appName) throws Ex {
        if (plugin == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "TargetPlugin");
        if (appName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "appName 应用名为空");

        Element targetplugin = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/targetplugin");
        if (targetplugin != null) {
            Element sourceclassname = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceclassname");
            sourceclassname.setText(plugin.getSourceClassName());

            Element targetclassname = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/targetclassname");
            targetclassname.setText(plugin.getTargetClassName());

            Element srcdb = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/targetplugin/dbchange/srcdb");
            SourceDb src = plugin.getSourceDb();
            srcdb.attribute("value").setText(src.getDbName());
        } else {
            throw new Ex().set(EConfig.E_PluginNotExisted, EConfig.KEY_PluginNotExisted, appName);
        }
    }

    public void editSourceTable(String appName,String dbName,Table table) throws Ex {
        if (appName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "appName 应用名为空");
        if (dbName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "dbName 应用名为空");
        if (table == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "tableName 表名为空");

        Element tb = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceplugin/dbchange/database[@name='"+dbName+"']/tables/table[@value='" + table.getTableName() + "']");
        if (tb == null)
            throw new Ex().set(EConfig.E_TableNotExisted, EConfig.KEY_TableNotExisted, table.getTableName());
        if(tb.element("deletetrigger")==null){
            tb.addElement("deletetrigger");
        }
        tb.element("deletetrigger").setText(table.getDeleteTrigger()==null?"":table.getDeleteTrigger());
        if(tb.element("updatetrigger")==null){
            tb.addElement("updatetrigger");
        }
        tb.element("updatetrigger").setText(table.getUpdateTrigger()==null?"":table.getUpdateTrigger());
        if(tb.element("inserttrigger")==null){
            tb.addElement("inserttrigger");
        }
        tb.element("inserttrigger").setText(table.getInsertTrigger()==null?"":table.getInsertTrigger());
        if(tb.element("status")==null){
            tb.addElement("status");
        }
        if(tb.element("flag")==null){
            tb.addElement("flag");
        }
        tb.element("status").setText(table.getStatus()==null?"":table.getStatus());
        tb.element("flag").setText(table.getFlag()==null?"":table.getFlag());
        tb.element("monitordelete").setText(String.valueOf(table.isMonitorDelete()));
        tb.element("monitorupdate").setText(String.valueOf(table.isMonitorUpdate()));
        tb.element("monitorinsert").setText(String.valueOf(table.isMonitorInsert()));
        tb.element("seqnumber").setText(String.valueOf(table.getSeqNumber()));
        tb.element("interval").setText(String.valueOf(table.getInterval()));
        Element merge = tb.element("mergetables");
        if (merge != null) {
            tb.remove(merge);
            editSourceMergeTable(table, appName);
        }

    }

    public void editTargetTable(SourceTable srcTable, String appName, String targetDbName) throws Ex {
        if (srcTable == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "srcTable 源表名为空");
        if (appName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "appName 应用名为空");
        Element tb = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/targetplugin/dbchange/srcdb/tables/srctable/targetdb[@value='" + targetDbName + "']/table[@value='" + srcTable.getTableName() + "']");
        if (tb != null) {
            Table table = srcTable.getTargetDb(targetDbName).getTable();
            tb.element("deleteenable").setText(String.valueOf(table.isDeleteEnable()));
            tb.element("onlyinsert").setText(String.valueOf(table.isOnlyinsert()));
            tb.element("condition").setText(table.getCondition());
        } else {
            throw new Ex().set(EConfig.E_TableNotExisted, EConfig.KEY_TableNotExisted, srcTable.getTableName());
        }
    }

    public void editSourceField(String tableName, String appName, Field field) throws Ex {
        if (tableName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "tableName 表名为空");
        if (appName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "appName 应用名为空");
        if (field == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "字段为空");

        Element fieldNode = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceplugin/dbchange/database/tables/table[@value='" + tableName + "']/fields/field[@value='" + field.getFieldName() + "']");
        if (fieldNode != null) {
            fieldNode.element("JDBC_TYPE").setText(field.getJdbcType());
            fieldNode.element("IS_PK").setText(String.valueOf(field.isPk()));
            fieldNode.element("COLUMN_SIZE").setText(String.valueOf(field.getColumnSize()));
            fieldNode.element("IS_NULL").setText(String.valueOf(field.isNull()));
            fieldNode.element("DB_TYPE").setText(field.getDbType());
        } else {
            throw new Ex().set(EConfig.E_FieldNotExisted, EConfig.KEY_FieldNotExisted, tableName, field.getFieldName());
        }
    }

    public void editTargetField(String tableName, String targetDb,String srcTableName,String appName, Field field) throws Ex {
        if (tableName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "tableName 表名为空");
        if (appName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "appName 应用名为空");
        if (field == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "");
        Element fieldNode = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/targetplugin/dbchange/srcdb/tables/srctable[@value='" + srcTableName + "']/targetdb[@value='" + targetDb + "']/table[@value='" + tableName + "']/fields/field[@value='" + field.getFieldName() + "']");
        if (fieldNode != null) {
            fieldNode.element("JDBC_TYPE").setText(field.getJdbcType());
            fieldNode.element("IS_PK").setText(String.valueOf(field.isPk()));
            fieldNode.element("COLUMN_SIZE").setText(String.valueOf(field.getColumnSize()));
            fieldNode.element("IS_NULL").setText(String.valueOf(field.isNull()));
            fieldNode.element("DB_TYPE").setText(field.getDbType());
        } else {
            throw new Ex().set(EConfig.E_FieldNotExisted, EConfig.KEY_FieldNotExisted, tableName, field.getFieldName());
        }
    }

    /**Delete Methods*/

    public boolean removeType(String appName) throws Ex {
        if (appName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "appName 应用名为空");
        Element types = (Element) document.selectSingleNode("/configuration/system/ichange/types");
        Iterator typeNode = document.selectNodes("/configuration/system/ichange/types/type").iterator();
        if (typeNode != null) {
            for (; typeNode.hasNext();) {
                Element type = (Element) typeNode.next();
                if (type.attribute("value").getText().equals(appName))
                    return types.remove(type);
            }
        }
        return false;
    }

    public boolean removeSNMPClient(String snmpclient){
        Element snmpClientSet = (Element) document.selectSingleNode("/configuration/system/ichange/ichangeutils/snmpclientset");
        Iterator client = document.selectNodes("/configuration/system/ichange/ichangeutils/snmpclientset/snmpclient").iterator();
        if(client!=null){
            for(;client.hasNext();){
                Element snmpClient = (Element) client.next();
                String oldSNMPClient = snmpClient.element("host").getText()+":"+snmpClient.element("port").getText();
                if(snmpclient.equals(oldSNMPClient)){
                    return snmpClientSet.remove(snmpClient);
                }
            }
        }
        return false;
    }

    public boolean removeSysLogClient(String syslogclient){
        Element sysLogClientSet = (Element) document.selectSingleNode("/configuration/system/ichange/ichangeutils/syslogclientset");
        Iterator client = document.selectNodes("/configuration/system/ichange/ichangeutils/syslogclientset/syslogclient").iterator();
        if(client!=null){
            for(;client.hasNext();){
                Element sysLogClient = (Element) client.next();
                String oldSysLogClient = sysLogClient.element("host").getText()+":"+sysLogClient.element("port").getText();
                if(syslogclient.equals(oldSysLogClient)){
                    return sysLogClientSet.remove(sysLogClient);
                }
            }
        }
        return false;
    }

    public boolean removeIpBlack(String appName, String namePlugin, String ip) throws Ex {
        if (appName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "appName 应用名为空");
        Element ipBlackList = null;
        Iterator ipBlackNode = null;
        if("targetplugin".equals(namePlugin)) {
            ipBlackList = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/targetplugin/servicechange/ipblacklist");
            ipBlackNode = document.selectNodes("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/targetplugin/servicechange/ipblacklist/ipblack").iterator();
        }
        else if("sourceplugin".equals(namePlugin)){
            ipBlackList = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceplugin/videochange/ipblacklist");
            ipBlackNode = document.selectNodes("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceplugin/videochange/ipblacklist/ipblack").iterator();
        }
        if(ipBlackNode != null){
            for(;ipBlackNode.hasNext();){
                Element ipBlack = (Element) ipBlackNode.next();
                String newIp = ipBlack.element("ip").getText();
                if(newIp.equals(ip)){
                    return ipBlackList.remove(ipBlack);
                }
            }
        }
        return false;
    }

    public boolean removeIpWhite(String appName, String namePlugin, String ip) throws Ex {
        if (appName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "appName 应用名为空");
        Element ipWhiteList = null;
        Iterator ipWhiteNode = null;
        if("targetplugin".equals(namePlugin)) {
            ipWhiteList = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/targetplugin/servicechange/ipwhitelist");
            ipWhiteNode = document.selectNodes("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/targetplugin/servicechange/ipwhitelist/ipwhite").iterator();
        }
        else if("sourceplugin".equals(namePlugin)){
            ipWhiteList = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceplugin/videochange/ipwhitelist");
            ipWhiteNode = document.selectNodes("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceplugin/videochange/ipwhitelist/ipwhite").iterator();
        }
        if(ipWhiteNode != null){
            for(;ipWhiteNode.hasNext();){
                Element ipWhite = (Element) ipWhiteNode.next();
                String newIp = ipWhite.element("ip").getText();
                if(newIp.equals(ip)){
                    return ipWhiteList.remove(ipWhite);
                }
            }
        }
        return false;
    }

    public boolean removeProxyBlackIpMac(String appName, IpMac[] ipMacs) throws Ex {
        if (appName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "appName为空");
        Element ipBlackList = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/targetplugin/socketchange/ipblacklist");
        Iterator ipBlackNode = null;
        if(ipBlackList!=null){
            ipBlackNode = document.selectNodes("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/targetplugin/socketchange/ipblacklist/ipblack").iterator();
        }
        if(ipBlackNode == null){
            ipBlackList = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceplugin/socketchange/ipblacklist");
            if(ipBlackList!=null){
                ipBlackNode = document.selectNodes("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceplugin/socketchange/ipblacklist/ipblack").iterator();
            }
        }
        if(ipBlackNode != null){
            for(;ipBlackNode.hasNext();){
                Element ipBlack = (Element) ipBlackNode.next();
                String ip = ipBlack.element("ip").getText();
                for(int i=0;i<ipMacs.length;i++){
                    if(ip.equals(ipMacs[i].getIp())){
                        return ipBlackList.remove(ipBlack);
                    }
                }
            }
        }
        return false;
    }

    public boolean removeProxyWhiteIpMac(String appName, IpMac[] ipMacs) throws Ex {
        if (appName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "appName为空");
        Element ipWhiteList = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/targetplugin/socketchange/ipwhitelist");
        Iterator ipWhiteNode = null;
        if(ipWhiteList!=null){
            ipWhiteNode = document.selectNodes("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/targetplugin/socketchange/ipwhitelist/ipwhite").iterator();
        }
        if(ipWhiteNode == null){
            ipWhiteList = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceplugin/socketchange/ipwhitelist");
            if(ipWhiteList!=null){
                ipWhiteNode = document.selectNodes("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceplugin/socketchange/ipwhitelist/ipwhite").iterator();
            }
        }
        if(ipWhiteNode != null){
            for(;ipWhiteNode.hasNext();){
                Element ipWhite = (Element) ipWhiteNode.next();
                String ip = ipWhite.element("ip").getText();
                for(int i=0;i<ipMacs.length;i++){
                    if(ip.equals(ipMacs[i].getIp())){
                        return ipWhiteList.remove(ipWhite);
                    }
                }
            }
        }
        return false;
    }

    public boolean removeDataBase(String appName,String dataBaseName) throws Ex{
    	if (appName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "appName 应用名为空");
        Element dbchange = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceplugin/dbchange");


        Iterator databaseNodes = document.selectNodes("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceplugin/dbchange/database").iterator();
        if (databaseNodes != null) {
            for (; databaseNodes.hasNext();) {
                Element e = (Element) databaseNodes.next();
                if(e.attribute("name").getText().equals(dataBaseName)){
                    return dbchange.remove(e);
                }
            }
        }
		return false;
	}

    public boolean removeSourceTable(String appName,String dbName, String tableName) throws Ex {
        if (tableName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "表为空");
        if (appName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "appName 应用名为空");
        Element tables = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceplugin/dbchange/database[@name='"+dbName+"']/tables");
//        if (tables == null)
//            throw new Ex().set(E.E_NullPointer, new Message("应用为空 \"{0}\" �вtableName 表名为空表为空κα�"), appName);
        Iterator tableNodes = document.selectNodes("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceplugin/dbchange/database[@name='"+dbName+"']/tables/table").iterator();
        for (; tableNodes.hasNext();) {
            Element table = (Element) tableNodes.next();
            if (table.attribute("value").getText().equals(tableName))
                return tables.remove(table);
        }
        return false;
    }


	public boolean isSourceTable(String appName, String tableName) {
		Element table = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceplugin/dbchange/database/tables/table[@value='"+tableName+"']");
		if(table==null){
			return false;
		}else{
			return true;
		}
	}

	public boolean isTargetSrcTable(String appName, String srcTableName) throws Ex{
		Element srctable = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/targetplugin/dbchange/srcdb/tables/srctable[@value='"+srcTableName+"']");
		if(srctable==null){
			return false;
		}else{
			return true;
		}
	}

	public void removeMergeTables(String appName, String tableName) {
		Element tableNode = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceplugin/dbchange/database/tables/table[@value='" + tableName + "']");
		Element mergetablesNode = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceplugin/dbchange/database/tables/table[@value='" + tableName + "']/mergetables");

		tableNode.remove(mergetablesNode);

	}
    public boolean removeSourceTables(String appName) throws Ex {
        if (appName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "appName 应用名为空");
        Element tables = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceplugin/dbchange/database/tables");
        Iterator tableNodes = document.selectNodes("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceplugin/dbchange/database/tables/table").iterator();
        boolean returnVal = true;
        if (tableNodes != null) {
            for (; tableNodes.hasNext();) {
                Element table = (Element) tableNodes.next();
                returnVal = returnVal && tables.remove(table);
            }
        }
        return returnVal;
    }

    public boolean removeSourceFields(String appName, String tableName) throws Ex {
        if (appName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "appName 应用名为空");
        Element fields = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceplugin/dbchange/database/tables/table[@value='" + tableName + "']/fields");
        Iterator fieldNodes = document.selectNodes("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceplugin/dbchange/database/tables/table[@value='" + tableName + "']/fields/field").iterator();
        boolean returnVal = true;
        if (fieldNodes != null) {
            for (; fieldNodes.hasNext();) {
                Element field = (Element) fieldNodes.next();
                returnVal = returnVal && fields.remove(field);
            }
        }
        return returnVal;
    }

    public boolean removeSourceField(String appName, String dbName, String tableName, String fieldName) throws Ex {
        if (appName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "appName 应用名为空");
        Element fields = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceplugin/dbchange/database[@name='"+dbName+"']/tables/table[@value='" + tableName + "']/fields");
        Iterator fieldNodes = document.selectNodes("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceplugin/dbchange/database[@name='"+dbName+"']/tables/table[@value='" + tableName + "']/fields/field").iterator();
        if (fieldNodes != null) {
            for (; fieldNodes.hasNext();) {
                Element field = (Element) fieldNodes.next();
                if (field.attribute("value").getText().equals(fieldName))
                    return fields.remove(field);
            }
        }
        return false;
    }

    public boolean removeTargetSrcTable(String tableName, String appName) throws Ex {
        if (tableName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "表为空");
        if (appName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "appName 应用名为空");
        Element tables = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/targetplugin/dbchange/srcdb/tables");
//        if (tables == null)
//            throw new Ex().set(E.E_NullPointer, new Message("应用为空 \"{0}\" �вtableName 表名为空表为空κα�"), appName);
        return tables.remove(tables.selectSingleNode("srctable[@value='" + tableName + "']"));
    }

    public boolean isTargetTable(String srcTableName, String appName) {
    	Element srctable = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/targetplugin/dbchange/srcdb/tables/srctable[@value='" + srcTableName + "']");
    	if(srctable==null){
    		return false;
    	}else {
    		return true;
    	}
	}

    public boolean isTargetDB(String targetDBName, String srcTableName, String appName) {
    	Element targetdb = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/targetplugin/dbchange/srcdb/tables/srctable[@value='" + srcTableName + "']/targetdb[@value='"+targetDBName+"']");
    	if(targetdb==null){
    		return false;
    	}else {
    		return true;
    	}
	}

    public boolean removeTargetDb(String appName, String targetdb) throws Ex {
        if (appName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "appName 应用名为空");
        if (targetdb == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "Ŀ表为空�");
        boolean removed = true;
        List targetdbs = document.selectNodes("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/targetplugin/*/*/*/*/targetdb[@value='" + targetdb + "']");
        for (Iterator it = targetdbs.iterator(); it.hasNext();) {
            Element db = (Element) it.next();
            if (db.getParent().elements("targetdb").size() <= 1) {
//                removed = removed && db.getParent().getParent().remove(db.getParent());

                Element srcdb = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceplugin/dbchange/database");
                if (srcdb != null)
                    removed = removeTargetPlugin(appName);
                else
                    removed = removeType(appName);

            } else
                removed = removed && db.getParent().remove(db);
        }

        return removed;
    }

    public boolean removeTargetTableDB(String targetDB, String srcTableName, String appName) throws Ex{
    	Element srctable = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/targetplugin/dbchange/srcdb/tables/srctable[@value='"+srcTableName+"']");
    	Iterator<Element> targetdbs = document.selectNodes("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/targetplugin/dbchange/srcdb/tables/srctable[@value='"+srcTableName+"']/targetdb").iterator();
    	if(targetdbs!=null){
    		for (; targetdbs.hasNext();) {
				Element e = (Element) targetdbs.next();
				if(e.attribute("value").getText().equals(targetDB)){
					return srctable.remove(e);
				}
			}
    	}
    	return false;

	}

    public boolean removeTargetTable(String appName, String targetdb, String table, String srctable) throws Ex{
    	if (appName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "appName 应用名为空");
        if (targetdb == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "Ŀ表为空�");
        Element targetDB = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/targetplugin/*/*/*/srctable[@value='" + srctable + "']/targetdb[@value='" + targetdb + "']");
        Iterator<Element> targetTables = document.selectNodes("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/targetplugin/*/*/*/srctable[@value='" + srctable + "']/targetdb[@value='" + targetdb + "']/table").iterator();
        if(targetTables!=null){
    		for (; targetTables.hasNext();) {
				Element e = (Element) targetTables.next();
				if(table.equals(e.attribute("value").getText())){
					return targetDB.remove(e);
				}
			}
    	}
        return false;
    }

    public boolean removeTargetDbTable(String appName, String targetdb, String table, String srctable) throws Ex {
        if (appName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "appName 应用名为空");
        if (targetdb == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "Ŀ表为空�");
        boolean removed = true;
        Element targetTable = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/targetplugin/*/*/*/srctable[@value='" + srctable + "']/targetdb[@value='" + targetdb + "']/table[@value='" + table + "']");
        if (targetTable != null) {
            removed = targetTable.getParent().getParent().remove(targetTable.getParent());
        }

        return removed;
    }

    public boolean removeSourcePlugin(String appName) throws Ex {
        if (appName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "appName 应用名为空");
        Element plugin = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin");
//        if (plugin == null)
//            throw new Ex().set(EConfig.E_PluginNotExisted, EConfig.KEY_PluginNotExisted, appName);
        return plugin.remove(plugin.element("sourceplugin"));
    }

    public boolean removeTargetPlugin(String appName) throws Ex {
        if (appName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "appName 应用名为空");
        Element plugin = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin");
        if (plugin == null)
            throw new Ex().set(EConfig.E_PluginNotExisted, EConfig.KEY_PluginNotExisted, appName);
        return plugin.remove(plugin.element("targetplugin"));
    }

    public boolean removeTargetTables(String appName,String jdbc) throws Ex {
        if(appName == null && jdbc == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "appName 应用名为空");
        Element tables = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/targetplugin/dbchange/srcdb[@value='" + jdbc + "']/tables");
        if (tables == null)
            throw new Ex().set(EConfig.E_TableNotExisted, EConfig.KEY_TableNotExisted, appName);
        return tables.remove(tables.element("srctable"));
    }

    public void editTargetSrcDb(String dbName,String oldDbName, String appName) throws Ex{
    	if(appName == null && dbName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "appName 应用名为空");
        Element srcdb = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/targetplugin/dbchange/srcdb[@value='" + oldDbName + "']");
        if (srcdb == null)
            throw new Ex().set(EConfig.E_TableNotExisted, EConfig.KEY_TableNotExisted, appName);
        else{
        	srcdb.attribute("value").setText(dbName);
        }

	}


    public boolean removeJdbc(String jdbcName) throws Ex {
        if (jdbcName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "JDBC表为空�");
        Element jdbcs = (Element) document.selectSingleNode("/configuration/system/ichange/jdbcs");
//        if (jdbcs == null)
//            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "jdbc�ڵ�");
        return jdbcs.remove(jdbcs.selectSingleNode("jdbc[@value='" + jdbcName + "']"));
    }

    //getter
    public boolean isType(String appName,String pluginType) throws Ex{
        Element change = null;
        if (pluginType.equals(Plugin.s_source_plugin))
            change = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceplugin/videochange");
        else if (pluginType.equals(Plugin.s_target_plugin))
            change = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/targetplugin/servicechange");
        if (change == null) {
            return false;
        }
        return true;
    }

    public boolean isType(String appName) throws Ex{
        Element type = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']");
        if (type == null) {
            return false;
        }
        return true;
    }

    public boolean isTypeS(String appName) throws Ex{
        Element type = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']");
        if (type != null) {
        	Element sourceplugin = (Element)type.selectSingleNode("plugin/sourceplugin");
        	if(sourceplugin != null){
        		return true;
        	}else {
        		return false;
        	}
        }
        return false;
    }

    public boolean isTypeT(String appName) throws Ex{
        Element type = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']");
        if (type != null) {
        	Element targetplugin = (Element)type.selectSingleNode("plugin/targetplugin");
        	if(targetplugin != null){
        		return true;
        	}else {
        		return false;
        	}
        }
        return false;
    }

    public boolean isTypeDescS(String appDesc) throws Ex{
        Element type = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@desc='" + appDesc + "']");
        if (type != null) {
        	Element sourceplugin = (Element)type.selectSingleNode("plugin/sourceplugin");
        	if(sourceplugin != null){
        		return true;
        	}else {
        		return false;
        	}
        }
        return false;
    }

    public boolean isTypeDescT(String appDesc) throws Ex{
        Element type = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@desc='" + appDesc + "']");
        if (type != null) {
        	Element targetplugin = (Element)type.selectSingleNode("plugin/targetplugin");
        	if(targetplugin != null){
        		return true;
        	}else {
        		return false;
        	}
        }
        return false;
    }

    public boolean isTwoway(String appName) throws Ex{
        Element istwoway = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceplugin/dbchange/database/istwoway");
        if(istwoway != null){
        	if ("true".equals(istwoway.getText())) {
        		return true;
        	}else{
        		return false;
        	}
        }
        return false;
    }

	public boolean getTypeDBName(String dbName) {
		Element database = (Element) document.selectSingleNode("/configuration/system/ichange/types/type/plugin/sourceplugin/dbchange/database[@name='"+dbName+"']");
        if(database != null){
        	return true;
        }
        return false;
	}
    
    public boolean getTypeDBNameTarget(String dbName) {
//		List tableNodes = document.selectNodes("/configuration/system/ichange/types/type/plugin/targetplugin/dbchange/srcdb/tables/srctable/targetdb[@value='"+dbName+"']");
		Element targetdb = (Element) document.selectSingleNode("/configuration/system/ichange/types/type/plugin/targetplugin/dbchange/srcdb/tables/srctable/targetdb[@value='"+dbName+"']");
        if(targetdb != null){
        	return true;
        }
        return false;
	}
    public Type getType(String appName) throws Ex {
        Element typeNode = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']");
        if (typeNode != null) {
            Type type = new Type();
            type.setTypeName(typeNode.attribute("value").getText());
            type.setStatus(typeNode.attribute("status").getText() != null ? typeNode.attribute("status").getText() : "0");
            type.setDescription(typeNode.attribute("desc") != null ? typeNode.attribute("desc").getText() : "");
            type.setAppType(typeNode.attribute("apptype") != null ? typeNode.attribute("apptype").getText() : "");
            type.setLocal(typeNode.element("islocal") != null ? typeNode.element("islocal").getText() : "false");
            type.setActive(typeNode.element("isactive") != null ? typeNode.element("isactive").getText() : "false");
            type.setAllow(typeNode.element("isallow") != null ? typeNode.element("isallow").getText() : "false");
            type.setDataPath(typeNode.element("datapath") != null ? typeNode.element("datapath").getText() : "");
            type.setDeleteFile(typeNode.element("deletefile") != null ? typeNode.element("deletefile").getText() : "false");
            type.setRecover(typeNode.element("isrecover") != null ? typeNode.element("isrecover").getText() : "false");
            type.setFilter(typeNode.element("isfilter") != null ? typeNode.element("isfilter").getText() : "false");
            type.setVirusScan(typeNode.element("isvirusscan") != null ? typeNode.element("isvirusscan").getText() : "false");
            type.setInfoLevel(typeNode.element("infolevel") != null ? typeNode.element("infolevel").getText() : "0");
            type.setSpeed(String.valueOf(Integer.parseInt(typeNode.element("speed") != null ? typeNode.element("speed").getText() : "0")));
            type.setChannel(typeNode.element("channel") != null ? typeNode.element("channel").getText() : "");
            type.setChannelPort(typeNode.element("channelport") != null ? typeNode.element("channelport").getText() : "");
            return type;
        }
        return null;
    }

    public List getTypes() throws Ex {
        List typeNodes = document.selectNodes("/configuration/system/ichange/types/type");
        if (typeNodes != null) {
            List types = new ArrayList();
            for (Iterator it = typeNodes.iterator(); it.hasNext();) {
                Element tp = (Element) it.next();
                String appName = tp.attribute("value").getText();
                Type type = getType(appName);
                types.add(type);
            }
            return types;
        } else {
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "应用为空");
        }
    }

    public String[] getTypeNames() throws Ex {
        List typeNodes = document.selectNodes("/configuration/system/ichange/types/type");
        if (typeNodes != null) {
            List types = new ArrayList();
            for (Iterator it = typeNodes.iterator(); it.hasNext();) {
                Element tp = (Element) it.next();
                types.add(tp.attribute("value").getText());
            }
            return (String[]) types.toArray(new String[types.size()]);
        } else {
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "应用为空");
        }
    }
    public Set getTypeNamesByAppType(String appType) throws Ex {
        List typeNodes = document.selectNodes("/configuration/system/ichange/types/type[@apptype='"+appType+"']");
        if (typeNodes != null) {
            Set types = new HashSet();
            for (Iterator it = typeNodes.iterator(); it.hasNext();) {
                Element tp = (Element) it.next();
                types.add(tp.attribute("value").getText());
            }
            return types;
        } else {
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "应用为空");
        }
    }

    public String[] getTypeNamesByActive(boolean active) throws Ex {
         List typeNodes = document.selectNodes("/configuration/system/ichange/types/type");
        if (typeNodes != null) {
            List types = new ArrayList();
            for (Iterator it = typeNodes.iterator(); it.hasNext();) {
                Element tp = (Element) it.next();
                if(Boolean.valueOf(tp.element("isactive").getText())==active) {
                    types.add(tp.attribute("value").getText());
                }
            }
            return (String[]) types.toArray(new String[types.size()]);
        } else {
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "应用为空");
        }
    }

    public String[] getTypeNames(String appType) throws Ex {
        List typeNodes = document.selectNodes("/configuration/system/ichange/types/type[@apptype='"+appType+"']");
        if (typeNodes != null) {
            List types = new ArrayList();
            for (Iterator it = typeNodes.iterator(); it.hasNext();) {
                Element tp = (Element) it.next();
                types.add(tp.attribute("value").getText());
            }
            return (String[]) types.toArray(new String[types.size()]);
        } else {
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "应用为空");
        }
    }

    public String[] getTypeNamesThatS(String appType) throws Ex {
        List<Element> typeNodes = document.selectNodes("/configuration/system/ichange/types/type[@apptype='"+appType+"']");
        if (typeNodes != null) {
            List<String> types = new ArrayList<String>();
            for (Iterator<Element> it = typeNodes.iterator(); it.hasNext();) {
                Element tp = (Element) it.next();
                Element sourceplugin = (Element)tp.selectSingleNode("plugin/sourceplugin");
                Element targetplugin = (Element)tp.selectSingleNode("plugin/targetplugin");
                if(sourceplugin!=null){
                	types.add(tp.attribute("value").getText());
                }
            }
            return (String[]) types.toArray(new String[types.size()]);
        } else {
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "应用为空");
        }
    }

	public String[] getTypeNamesThisT(String appType) throws Ex {
        List<Element> typeNodes = document.selectNodes("/configuration/system/ichange/types/type[@apptype='"+appType+"']");
        if (typeNodes != null) {
            List<String> types = new ArrayList<String>();
            for (Iterator<Element> it = typeNodes.iterator(); it.hasNext();) {
                Element tp = (Element) it.next();
                Element sourceplugin = (Element)tp.selectSingleNode("plugin/sourceplugin");
                Element targetplugin = (Element)tp.selectSingleNode("plugin/targetplugin");
                if(targetplugin != null){
                	types.add(tp.attribute("value").getText());
                }
            }
            return (String[]) types.toArray(new String[types.size()]);
        } else {
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "应用为空");
        }
    }

     public List<Type> readTypes() throws Ex {
        List types = document.selectNodes("/configuration/system/ichange/types/type");
        if (types == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "没有应用");
        List<Type> list = new ArrayList<Type>();
        for (Iterator it = types.iterator(); it.hasNext();) {
            Element typeNode = (Element) it.next();
            String name = typeNode.attribute("value").getText();
            String appType = typeNode.attribute("apptype").getText();
            String isActive = typeNode.element("isactive").getText();
            String channelport = null;
            try{
                channelport = typeNode.element("channelport").getText();
            } catch (Exception e){

            }
            Type t = new Type();
            t.setTypeName(name);
            t.setActive(isActive);
            t.setAppType(appType);
            if(channelport!=null){
                t.setChannelPort(channelport);
            }
            list.add(t);
        }
        return list;
    }


    public String[] getSourceAppNames() throws Ex {
        List types = document.selectNodes("/configuration/system/ichange/types/type/plugin/sourceplugin");
        if (types == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "ԴtableName 表名为空表为空");
        String[] names = new String[types.size()];
        int i = 0;
        for (Iterator it = types.iterator(); it.hasNext();) {
            Element element = (Element) it.next();
            Element typeNode = element.getParent().getParent();
            names[i] = typeNode.attribute("value").getText();
            i++;
        }
        return names;
    }

    public String[] getLocalSourceAppNames() throws Ex {
        List types = document.selectNodes("/configuration/system/ichange/types/type");
        if (types == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "ԴtableName 表名为空表为空");
        List names = new ArrayList();
        for (Iterator it = types.iterator(); it.hasNext();) {
            Element typeNode = (Element) it.next();
            if (typeNode.element("islocal").getText().equals("true")) {
                names.add(typeNode.attribute("value").getText());
            }
        }
        return (String[]) names.toArray(new String[0]);
    }

    public String[] getTargetAppNames() throws Ex {
        List types = document.selectNodes("/configuration/system/ichange/types/type/plugin/targetplugin");
        if (types == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "应用为空");
        String[] names = new String[types.size()];
        int i = 0;
        for (Iterator it = types.iterator(); it.hasNext();) {
            Element element = (Element) it.next();
            Element typeNode = element.getParent().getParent();
            names[i] = typeNode.attribute("value").getText();
            i++;
        }
        return names;
    }

    public String[] getJdbcNames() throws Ex {
        List jdbcs = document.selectNodes("/configuration/system/ichange/jdbcs/jdbc");
        if (jdbcs == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "jdbc列为空");
        String[] names = new String[jdbcs.size()];
        int i = 0;
        for (Iterator it = jdbcs.iterator(); it.hasNext();) {
            Element element = (Element) it.next();
            names[i] = element.attribute("value").getText();
            i++;
        }
        return names;
    }

    public Jdbc getJdbc(String name) throws Ex {
        Element jdbc = (Element) document.selectSingleNode("/configuration/system/ichange/jdbcs/jdbc[@value='" + name + "']");
        if (jdbc != null) {
            Jdbc jdbcInfo = new Jdbc();
            jdbcInfo.setJdbcName(jdbc.attribute("value").getText());
            jdbcInfo.setDescription(jdbc.attribute("desc").getText());
            jdbcInfo.setDbHost(jdbc.element("dbhost").getText());
            jdbcInfo.setDbOwner(jdbc.element("dbowner").getText());
            jdbcInfo.setDbType(jdbc.element("dbtype").getText());
            if(jdbc.element("dbport")==null){
                jdbcInfo.setDbPort("");
            } else {
                jdbcInfo.setDbPort(jdbc.element("dbport").getText());
            }
            if(jdbc.element("version")==null){
                jdbcInfo.setVersion("");
            } else {
                jdbcInfo.setVersion(jdbc.element("version").getText());
            }
            jdbcInfo.setDbUrl(jdbc.element("dburl").getText());
            jdbcInfo.setDbUser(jdbc.element("dbuser").getText());
            jdbcInfo.setDbVender(jdbc.element("dbvender").getText());
            jdbcInfo.setDriverClass(jdbc.element("driverclass").getText());
            jdbcInfo.setEncoding(jdbc.element("encoding").getText());
            jdbcInfo.setPassword(jdbc.element("password").getText());
            jdbcInfo.setDbCatalog(jdbc.element("dbcatalog").getText());
            return jdbcInfo;
        } else {
            throw new Ex().set(EConfig.E_JdbcNotExisted, EConfig.KEY_JdbcNotExisted, name);
        }

    }

    public List<Jdbc> getJdbcs() throws Ex {
        List jdbcs = document.selectNodes("/configuration/system/ichange/jdbcs/jdbc");
        if (jdbcs == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "�ڵ�jdbcs");
        List jdbcNodes = new ArrayList();
        for (Iterator it = jdbcs.iterator(); it.hasNext();) {
            Element jdbc = (Element) it.next();
            Jdbc jdbcInfo = new Jdbc();
            jdbcInfo.setJdbcName(jdbc.attribute("value").getText());
            jdbcInfo.setDescription(jdbc.attribute("desc").getText());
            jdbcInfo.setDbHost(jdbc.element("dbhost").getText());
            jdbcInfo.setDbOwner(jdbc.element("dbowner").getText());
            jdbcInfo.setDbType(jdbc.element("dbtype").getText());
            if(jdbc.element("dbport")==null){
                jdbcInfo.setDbPort("");
            } else {
                jdbcInfo.setDbPort(jdbc.element("dbport").getText());
            }
            if(jdbc.element("version")==null){
                jdbcInfo.setVersion("");
            } else {
                jdbcInfo.setVersion(jdbc.element("version").getText());
            }
            jdbcInfo.setDbUrl(jdbc.element("dburl").getText());
            jdbcInfo.setDbUser(jdbc.element("dbuser").getText());
            jdbcInfo.setDbVender(jdbc.element("dbvender").getText());
            jdbcInfo.setDriverClass(jdbc.element("driverclass").getText());
            jdbcInfo.setEncoding(jdbc.element("encoding").getText());
            jdbcInfo.setPassword(jdbc.element("password").getText());
            jdbcInfo.setDbCatalog(jdbc.element("dbcatalog").getText());
            jdbcNodes.add(jdbcInfo);

        }
        return jdbcNodes;

    }

    public List getSourceTables(String appName, String dbName) throws Ex {
        if (appName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "appName 应用名为空");
        List tableNodes = document.selectNodes("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceplugin/dbchange/database[@name='"+dbName+"']/tables/table");
        if (tableNodes == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "tables为空");
        List tables = new ArrayList();
        for (Iterator it = tableNodes.iterator(); it.hasNext();) {
            Element tb = (Element) it.next();
            Table table = new Table();
            table.setTableName(tb.attribute("value").getText());
            table.setStatus(tb.element("status") == null ? "" : tb.element("status").getText());
            table.setMonitorDelete(tb.element("monitordelete").getText());
            table.setMonitorInsert(tb.element("monitorinsert").getText());
            table.setMonitorUpdate(tb.element("monitorupdate").getText());
            table.setDeleteTrigger(tb.element("deletetrigger") == null ? "" : tb.element("deletetrigger").getText());
            table.setInsertTrigger(tb.element("inserttrigger") == null ? "" : tb.element("inserttrigger").getText());
            table.setUpdateTrigger(tb.element("updatetrigger") == null ? "" : tb.element("updatetrigger").getText());
            table.setSeqNumber(tb.element("seqnumber").getText());
            table.setInterval(tb.element("interval").getText());
            table.setFlag(tb.element("flag").getText());
            tables.add(table);
        }
        return tables;
    }

    public List getFullSourceTables(String appName) throws Ex {
        if (appName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "appName 应用名为空");
        List tableNodes = document.selectNodes("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceplugin/dbchange/database/tables/table");
        if (tableNodes == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "tables为空");
        List tables = new ArrayList();
//        for (Iterator it = tableNodes.iterator(); it.hasNext();) {
//            Element tb = (Element) it.next();
//            HelperSourceTable table = new HelperSourceTable();
//            table.setTableName(tb.attribute("value").getText());
//
//            Element fields = tb.element("fields");
//            List filedNodes = fields.elements("field");
//            for (Iterator fds = filedNodes.iterator(); fds.hasNext();) {
//                Element fieldNode = (Element) fds.next();
//                table.setField(fieldNode.attribute("value").getText());
//            }
//            tables.add(table);
//        }
        return tables;
    }

    public Table getSourceTable(String appName, String dbName, String tableName) throws Ex {
        if (appName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "appName 应用名为空");
        if (dbName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "dbName 数据源名为空");
        if (tableName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "tableName 表名为空");
        Element tableNode = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceplugin/dbchange/database[@name='"+dbName+"']/tables/table[@value='" + tableName + "']");

        Table table = null;
        if (tableNode != null) {
            table = new Table();
            table.setTableName(tableNode.attribute("value").getText());
            table.setMonitorDelete(tableNode.element("monitordelete").getText());
            table.setMonitorInsert(tableNode.element("monitorinsert").getText());
            table.setMonitorUpdate(tableNode.element("monitorupdate").getText());
            table.setSeqNumber(tableNode.element("seqnumber").getText());
            table.setInterval(tableNode.element("interval").getText());
            table.setFlag(tableNode.element("flag").getText());
            table.setStatus(tableNode.element("status").getText());
            table.setDeleteTrigger(tableNode.element("deletetrigger").getText());
            table.setInsertTrigger(tableNode.element("inserttrigger").getText());
            table.setUpdateTrigger(tableNode.element("updatetrigger").getText());
        }
        return table;
    }

    public String[] getSourceTableNames(String appName) throws Ex {
        if (appName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "appName 应用名为空");
        List tableNodes = document.selectNodes("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceplugin/dbchange/database/tables/table");
        if (tableNodes == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "table is null");
        String[] names = new String[tableNodes.size()];
        int i = 0;
        for (Iterator it = tableNodes.iterator(); it.hasNext();) {
            Element tb = (Element) it.next();
            names[i] = tb.attribute("value").getText();
            i++;
        }
        return names;
    }

    public List<Table>  getListedSourceTableNames(String appName) throws Ex {
        if (appName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "appName 应用名为空");
        List tableNodes = document.selectNodes("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceplugin/dbchange/database/tables/table");
        if (tableNodes == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "tables为空");
        List<Table>  tables = new ArrayList();
        for (Iterator it = tableNodes.iterator(); it.hasNext();) {
        	Table table = new Table();
            Element tb = (Element) it.next();
            table.setTableName(tb.attribute("value").getText());
            table.setMonitorDelete(tb.element("monitordelete").getText());
            table.setMonitorInsert(tb.element("monitorinsert").getText());
            table.setMonitorUpdate(tb.element("monitorupdate").getText());
            table.setSeqNumber(tb.element("seqnumber").getText());
            table.setInterval(tb.element("interval").getText());
            tables.add(table);
        }
        return tables;
    }

    public List<Table> getListedTargetTableNames(String appName) throws Ex{
    	if (appName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "appName 应用名为空");
        List tableNodes = document.selectNodes("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/targetplugin/dbchange/srcdb/tables/srctable/targetdb/table");
        if (tableNodes == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "tables为空");
        List<Table> tables = new ArrayList();
        for (Iterator it = tableNodes.iterator(); it.hasNext();) {
        	Table table = new Table();
            Element tb = (Element) it.next();
            table.setTableName(tb.attribute("value").getText());
            table.setMonitorDelete(tb.element("monitordelete").getText());
            table.setMonitorInsert(tb.element("monitorinsert").getText());
            table.setMonitorUpdate(tb.element("monitorupdate").getText());
            table.setSeqNumber(tb.element("seqnumber").getText());
            table.setInterval(tb.element("interval").getText());
            tables.add(table);
        }
        return tables;
    }

    public String getSourceDbName(String appName) throws Ex {
        if (appName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "appName 应用名为空");
        Element srcdb = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceplugin/dbchange/database");
        if (srcdb == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "database 为空");

        return srcdb.attribute("name").getText();
    }

    public String getSourceName(String appName) throws Ex {
        if (appName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "appName 应用名为空");
        Element src = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceplugin");
        if (src == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "sourceplugin 为空");
        Element sourceplugin = src.element("dbchange");
        String sourceName = "change";
        if (sourceplugin != null) {
            sourceName = sourceplugin.element("database").attribute("name").getText();
        } else {
            sourceplugin = src.element("socketchange");
            if (sourceplugin == null) {
                sourceplugin = src.element("videochange");
                if (sourceplugin == null)
                    sourceplugin = src.element("servicechange");
            }
            if (sourceplugin != null)
                sourceName = sourceplugin.elementText("name");

        }
        return sourceName;
    }

    public Field getSourceField(String appName,String dbName, String tableName, String fieldName) throws Ex {
        if (appName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "appName 应用名为空");
        if (tableName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "tableName 表名为空");
        if (fieldName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "字段为空表为空");
        Element f = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceplugin/dbchange/database[@name='"+dbName+"']/tables/table[@value='" + tableName + "']/fields/field[@value='" + fieldName + "']");
        if (f == null) {
            return null;
//            throw new Ex().set(EConfig.E_FieldNotExisted, EConfig.KEY_FieldNotExisted, fieldName);
        } else {
            Field field = new Field();
            field.setFieldName(f.attribute("value").getText());
            field.setColumnSize(f.element("COLUMN_SIZE").getText());
            field.setDbType(f.element("DB_TYPE").getText());
            field.setJdbcType(f.element("JDBC_TYPE").getText());
            field.setPk(f.element("IS_PK").getText());
            field.setNull(f.element("IS_NULL").getText());

            return field;
        }
    }

    public List<Field> getSourceFileds(String appName, String dbName,String tableName) throws Ex {
        if (appName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "appName 应用名为空");
        if (tableName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "tableName 表名为空");
        if (dbName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "dbName 表名为空");
        List fieldNodes = document.selectNodes("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceplugin/dbchange/database[@name='"+dbName+"']/tables/table[@value='" + tableName + "']/fields/field");
        if (fieldNodes == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "fields 为空");
        List<Field> fields = new ArrayList<Field>();
        for (Iterator it = fieldNodes.iterator(); it.hasNext();) {
            Element f = (Element) it.next();
            Field field = new Field();
            field.setFieldName(f.attribute("value").getText());
            field.setColumnSize(f.element("COLUMN_SIZE").getText());
            field.setDbType(f.element("DB_TYPE").getText());
            field.setJdbcType(f.element("JDBC_TYPE").getText());
            field.setPk(f.element("IS_PK").getText());
            field.setNull(f.element("IS_NULL").getText());

            fields.add(field);
        }

        return fields;
    }

    public String[] getSourceFiledNames(String appName, String tableName) throws Ex {
        if (appName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "appName 应用名为空");
        if (tableName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "tableName 表名为空");
        List fieldNodes = document.selectNodes("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceplugin/dbchange/database/tables/table[@value='" + tableName + "']/fields/field");
        if (fieldNodes == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "fields 为空");
        String[] names = new String[fieldNodes.size()];
        int i = 0;
        for (Iterator it = fieldNodes.iterator(); it.hasNext();) {
            Element f = (Element) it.next();
            names[i] = f.attribute("value").getText();
            i++;
        }

        return names;
    }

    public List getListedSourceFiledNames(String appName, String tableName) throws Ex {
        if (appName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "appName 应用名为空");
        if (tableName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "tableName 表名为空");
        List fieldNodes = document.selectNodes("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceplugin/dbchange/database/tables/table[@value='" + tableName + "']/fields/field");
        if (fieldNodes == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "fields 为空");
        List names = new ArrayList();
        for (Iterator it = fieldNodes.iterator(); it.hasNext();) {
            Element f = (Element) it.next();
            names.add(f.attribute("value").getText());
        }
        return names;
    }

    public DataBase getDataBase(String appName) throws Ex {
        if (appName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "appName 应用名为空");
        List databases = document.selectNodes("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceplugin/dbchange/database");
        if (databases == null){
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "dbchange 为空");
        }
        for (Iterator it = databases.iterator(); it.hasNext();) {
            Element db = (Element) it.next();
            String status = null;
            if(db.attribute("status")!=null){
                status = db.attribute("status").getText();
            } else {
                status = "";
            }
            if(status!=null && status.equals(StringContext.DB_DELETE)){
                continue;
            }
            DataBase database = new DataBase();

            database.setDbName(db.attribute("name").getText());
            database.setStatus(status);
            database.setTwoway(db.element("istwoway").getText());
            database.setEnable(db.element("enable").getText());
            database.setInterval(db.element("interval").getText());
            database.setMaxRecords(db.element("maxrecords").getText());
            database.setOldStep(db.element("oldstep").getText());
            database.setOperation(db.element("operation").getText());
            database.setTempTable(db.element("temptable").getText());
            return database;
        }
        return null;
    }

    public List<DataBase> getDataBases(String appName) throws Ex {
        if (appName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "appName 应用名为空");
        List databases = document.selectNodes("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceplugin/dbchange/database");
        if (databases == null){
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "dbchange 为空");
        }
        List<DataBase> list = new ArrayList<DataBase>();
        for (Iterator it = databases.iterator(); it.hasNext();) {
            Element db = (Element) it.next();
            String status = null;
            if(db.attribute("status")!=null){
                status = db.attribute("status").getText();
            } else {
                status = "";
            }
            DataBase database = new DataBase();

            database.setDbName(db.attribute("name").getText());
            database.setStatus(status);
            database.setTwoway(db.element("istwoway").getText());
            database.setEnable(db.element("enable").getText());
            database.setInterval(db.element("interval").getText());
            database.setMaxRecords(db.element("maxrecords").getText());
            database.setOldStep(db.element("oldstep").getText());
            database.setOperation(db.element("operation").getText());
            database.setTempTable(db.element("temptable").getText());
            if(db.element("temptableold")!=null){
                database.setTempTableOld(db.element("temptableold").getText());
            } else {
                db.addElement("temptableold");
                database.setTempTableOld("");
            }
            list.add(database);
        }
        return list;
    }

    public DataBase getDataBase(String appName,String dbName) throws Ex {
        if (appName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "appName 应用名为空");
        if (dbName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "dbName 数据源名为空");
        Element db = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceplugin/dbchange/database[@name='" + dbName + "']");
        if (db == null){
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "database 为空");
        }
        String status = null;
        if(db.attribute("status")!=null){
            status = db.attribute("status").getText();
        } else {
            status = "";
        }
        DataBase database = new DataBase();

        database.setDbName(db.attribute("name").getText());
        database.setStatus(status);
        database.setTwoway(db.element("istwoway").getText());
        database.setEnable(db.element("enable").getText());
        database.setInterval(db.element("interval").getText());
        database.setMaxRecords(db.element("maxrecords").getText());
        database.setOldStep(db.element("oldstep").getText());
        database.setOperation(db.element("operation").getText());
        database.setTempTable(db.element("temptable").getText());
        return database;

    }

    public SocketChange getSocketChange(String appName, String pluginType) throws Ex {
        if (appName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "appName 应用名为空");
        if (pluginType == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "pluginType");
        Element change = null;
        if (pluginType.equals(Plugin.s_source_plugin))
            change = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceplugin/socketchange");
        else if (pluginType.equals(Plugin.s_target_plugin))
            change = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/targetplugin/socketchange");
        if (change != null) {
            SocketChange socketChange = new SocketChange();
            socketChange.setName(change.element("name").getText());
            socketChange.setServerAddress(change.element("serveraddress").getText());
            socketChange.setPort(change.element("port").getText());
            socketChange.setPoolMin(change.element("poolmin").getText());
            socketChange.setPoolMax(change.element("poolmax").getText());
            socketChange.setTryTime(change.element("trytime").getText());
            socketChange.setCharset(change.element("charset").getText());
            socketChange.setType(change.element("type").getText());

            if(change.element("clientauthenable")!=null){
                socketChange.setClientauthenable(change.element("clientauthenable").getText());
                socketChange.setAuthaddress(change.element("authaddress").getText());
                socketChange.setAuthca(change.element("authca").getText());
                socketChange.setAuthcapass(change.element("authcapass").getText());
                socketChange.setAuthport(change.element("authport").getText());
            }
            socketChange.setIpfilter(change.element("ipfilter").getText());
            Element ipad = change.element("ipaddress");
            if (ipad != null) {
                String ipaddress = ipad.getText();
                if (ipaddress != null && !ipaddress.equals("")) {
                    socketChange.setIpAddress(ipaddress);
                } else {
                    socketChange.setIpAddress("");
                }
            }
            return socketChange;
        }
        return null;
    }

    public SourceFile getSourceFile(String appName, String pluginType) throws Ex {
        if (appName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "appName 应用名为空");
        if (pluginType == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "pluginType");
        Element file = null;
        if (pluginType.equals(Plugin.s_source_plugin))
            file = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceplugin/sourcefile");
        if (file != null) {
            SourceFile sourceFile = new SourceFile();
            sourceFile.setServerAddress(file.element("serverAddress").getText());
            sourceFile.setPort(file.element("port").getText());
            sourceFile.setCharset(file.element("charset").getText());
            sourceFile.setDeletefile(file.element("deletefile").getText());
            sourceFile.setDir(file.element("dir").getText());
            sourceFile.setFiltertypes(file.element("filtertypes").getText());
            sourceFile.setInterval(file.element("interval").getText());
            sourceFile.setIsincludesubdir(file.element("isincludesubdir").getText());
            sourceFile.setIstwoway(file.element("istwoway").getText());
            sourceFile.setNotfiltertypes(file.element("notfiltertypes").getText());
            sourceFile.setUserName(file.element("userName").getText());
            sourceFile.setPassword(file.element("password").getText());
            sourceFile.setProtocol(file.element("protocol").getText());
            sourceFile.setFileListSize(file.element("filelistsize").getText());
            sourceFile.setPacketSize(file.element("packetsize").getText());
            sourceFile.setThreads(file.element("threads").getText());
            return sourceFile;
        }
        return null;
    }

    public TargetFile getTargetFile(String appName, String pluginType) throws Ex {
        if (appName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "appName 应用名为空");
        if (pluginType == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "pluginType");
        Element file = null;
        if (pluginType.equals(Plugin.s_target_plugin))
            file = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/targetplugin/targetfile");
        if (file != null) {
        	TargetFile targetFile = new TargetFile();
            targetFile.setServerAddress(file.element("serverAddress").getText());
            targetFile.setPort(file.element("port").getText());
            targetFile.setCharset(file.element("charset").getText());
            targetFile.setDeletefile(file.element("deletefile").getText());
            targetFile.setDir(file.element("dir").getText());
            targetFile.setUserName(file.element("userName").getText());
            targetFile.setPassword(file.element("password").getText());
            targetFile.setOnlyadd(file.element("onlyadd").getText());
            targetFile.setProtocol(file.element("protocol").getText());
            targetFile.setFileListSize(file.element("filelistsize").getText());
            targetFile.setPacketSize(file.element("packetsize").getText());
            targetFile.setThreads(file.element("threads").getText());
            return targetFile;
        }
        return null;
    }

    //todo: Sip Change Target Config.

    public ServiceChange getServiceChange(String appName, String pluginType) throws Ex {
        if (appName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "appName 应用名为空");
        if (pluginType == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "pluginType");
        Element change = null;
        if (pluginType.equals(Plugin.s_source_plugin))
            change = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceplugin/videochange");
        else if (pluginType.equals(Plugin.s_target_plugin))
            change = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/targetplugin/servicechange");
        if (change != null) {
            ServiceChange socketChange = new ServiceChange();
            socketChange.setServiceAddress(change.element("serviceaddress").getText());
            socketChange.setServerAddress(change.element("serveraddress").getText());
            socketChange.setPort(change.element("port").getText());
            socketChange.setCharset(change.element("charset").getText());
            socketChange.setAuthServer(change.element("authserver").getText());
            socketChange.setServicePort(change.element("serviceport").getText());
            socketChange.setManagerServerSet(change.element("managerserverset").getText());
            socketChange.setPtzServerSet(change.element("ptzserverset").getText());
            socketChange.setTransport(change.element("transport").getText());
            socketChange.setUdpPortMax(change.element("udpportmax").getText());
            socketChange.setUdpPortMin(change.element("udpportmin").getText());
            socketChange.setVideoServerSet(change.element("videoserverset").getText());
            socketChange.setWebAddress(change.element("webaddress").getText());
            socketChange.setRtspportset(change.element("rtspportset").getText());
            socketChange.setWebPort(change.element("webport").getText());
            socketChange.setVendorCode(change.element("vendorcode").getText());
            socketChange.setVideoencode(change.element("videoencode").getText());
            socketChange.setUdprecvAddress(change.element("udprecvaddress").getText());

            socketChange.setIpfilter(change.element("ipfilter").getText());

            return socketChange;
        }
        return null;
    }

    //todo:�޸�

    public VideoChange getVideoChange(String appName, String pluginType) throws Ex {
        if (appName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "appName 应用名为空");
        if (pluginType == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "pluginType");
        Element change = null;
        if (pluginType.equals(Plugin.s_source_plugin))
            change = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceplugin/videochange");
        else if (pluginType.equals(Plugin.s_target_plugin))
            change = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/targetplugin/servicechange");
        if (change != null) {
            VideoChange socketChange = new VideoChange();
            socketChange.setServiceAddress(change.element("serviceaddress").getText());
            socketChange.setServerAddress(change.element("serveraddress").getText());
            socketChange.setPort(change.element("port").getText());
//            socketChange.setPoolMin(change.element("poolmin").getText());
//            socketChange.setPoolMax(change.element("poolmax").getText());
//            socketChange.setLoopTime(change.element("looptime").getText());
            socketChange.setCharset(change.element("charset").getText());
//            socketChange.setLength(change.element("length").getText());
            socketChange.setServicePort(change.element("serviceport").getText());
            socketChange.setTransport(change.element("transport").getText());
            socketChange.setUdpPortMax(change.element("udpportmax").getText());
            socketChange.setUdpPortMin(change.element("udpportmin").getText());
//            socketChange.setUpddatalength(change.element("udpdatalength").getText());
            socketChange.setClientauthenable(change.element("clientauthenable").getText());
            socketChange.setVendorCode(change.element("vendorcode").getText());
            socketChange.setAuthaddress(change.element("authaddress").getText());
            socketChange.setAuthport(change.element("authport").getText());
            socketChange.setAuthca(change.element("authca").getText());
            socketChange.setAuthcapass(change.element("authcapass").getText());
            socketChange.setIpfilter(change.element("ipfilter").getText());
            socketChange.setWebPort(change.element("webport").getText());
            socketChange.setRtspportset(change.element("rtspportset").getText());

            return socketChange;
        }
        return null;
    }

    public List<Channel> getChannels() throws Ex{
        List<Channel> list = new ArrayList<Channel>();
        List channels = document.selectNodes("/configuration/system/ichange/stp/channel");
        for (Iterator it = channels.iterator(); it.hasNext();) {
            Element channel = (Element) it.next();
            Channel c = new Channel();
            c.setChannelValue(channel.attribute("value").getText());
            c.setIp(channel.element("ip").getText());
            c.setPrivated(channel.element("privated").getText());
            c.setPort(channel.element("port").getText());
            c.settIp(channel.element("tip").getText());
            c.settPort(channel.element("tport").getText());
            c.setProtocol(channel.element("protocol").getText());
            c.setAuditPort(channel.element("auditport").getText()==null?"":channel.element("auditport").getText());
            c.setCount(channel.element("count").getText()==null?"":channel.element("count").getText());
            c.setSize(channel.element("size").getText()==null?"":channel.element("size").getText());
            list.add(c);
        }
        return list;
    }

    public boolean getPrivated() {
        String value = "1";
        Element channel = (Element)document.selectSingleNode("/configuration/system/ichange/stp/channel[@value='"+value+"']");
        return Boolean.valueOf(channel.element("privated").getText());
    }

    public void updateChannel(List<Channel> channels) {
        for(Channel c : channels){
            Element channel = (Element)document.selectSingleNode("/configuration/system/ichange/stp/channel[@value='"+c.getChannelValue()+"']");
            if(channel==null){
                Element stp = (Element)document.selectSingleNode("/configuration/system/ichange/stp");
                channel = stp.addElement("channel");
                channel.addAttribute("value",c.getChannelValue());

                Element child = channel.addElement("privated");
                child.setText((c.getChannelValue().equals("1"))?"": String.valueOf(c.getPrivated()));
                child = channel.addElement("ip");
                child.setText(c.getIp());
                child = channel.addElement("port");
                child.setText(c.getPort());
                child = channel.addElement("tip");
                child.setText(c.gettIp());
                child = channel.addElement("tport");
                child.setText(c.gettPort());
                child = channel.addElement("protocol");
                child.setText(c.getProtocol());
                child = channel.addElement("auditport");
                child.setText(c.getAuditPort()==null?"":c.getAuditPort());
                child = channel.addElement("count");
                child.setText(c.getCount()==null?"":c.getCount());
                child = channel.addElement("size");
                child.setText(c.getSize()==null?"":c.getSize());
            } else {
                channel.element("privated").setText((c.getChannelValue().equals("1")) ? String.valueOf(c.getPrivated()) : "");
                channel.element("ip").setText(c.getIp());
                channel.element("port").setText(c.getPort());
                channel.element("tip").setText(c.gettIp());
                channel.element("tport").setText(c.gettPort());
                channel.element("protocol").setText(c.getProtocol());
                channel.element("auditport").setText(c.getAuditPort()==null?"":c.getAuditPort());
                channel.element("count").setText(c.getCount()==null?"":c.getCount());
                channel.element("size").setText(c.getSize()==null?"":c.getSize());
            }
        }
    }

    public void updateChannelCount(String count) {
        List<Element> channels = document.selectNodes("/configuration/system/ichange/stp/channel");
        for(Element channel : channels) {
            channel.element("count").setText(count);
        }
    }
    public IChangeUtils getIChangeUtils() throws Ex {
        Element utilNode = (Element) document.selectSingleNode("/configuration/system/ichange/ichangeutils");
        IChangeUtils util = new IChangeUtils();
        util.setGcInterval(utilNode.element("gcinterval").getText());
        util.setRecover(utilNode.element("recover").getText());
        util.setSystemMeantime(utilNode.element("systemmeantime").getText());
       // util.setLogServerPort(utilNode.element("logserverport").getText());
        util.setRestartTime(utilNode.element("restarttime").getText());
       // util.setLogServerPassword(utilNode.element("logserverpassword").getText());
       // util.setLogServerUser(utilNode.element("logserveruser").getText());
        return util;
    }

    //business

    public Table getTargetTable(String appName,String srcTableName, String targetDb, String tableName) throws Ex {
        Table table = new Table();
        Element targetTable = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/targetplugin/dbchange/srcdb/tables/srctable[@value='"+srcTableName+"']/targetdb[@value='" + targetDb + "']/table[@value='" + tableName + "']");
        if (targetTable != null) {
            table.setDeleteEnable(targetTable.element("deleteenable").getText());
            table.setOnlyinsert(targetTable.element("onlyinsert").getText());
            table.setCondition(targetTable.element("condition").getText());
            table.setTableName(tableName);
        }
        return table;
    }

	public TargetDb getTargetDB(String targetDbName, String srcTableName, String appName) throws Ex{
		TargetDb targetDb = new TargetDb();

		targetDb.setDbName(targetDbName);
		return targetDb;
	}

	public SourceTable getTargetSrcTable(String appName, String srcTableName) throws Ex {
		SourceTable srcTable = new SourceTable();
		Element srctable = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/targetplugin/dbchange/srcdb/tables/srctable[@value='"+srcTableName+"']");
		if(srctable!=null){
			srcTable.setTableName(srctable.attribute("value").getText());
		}
		return srcTable;
	}

    public List getFullTargetDbTables(String appName, String targetDb) throws Ex {
        List tables = new ArrayList();
        List targetTables = document.selectNodes("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/targetplugin/targetdb[@value='" + targetDb + "']/table");
        for (Iterator it = targetTables.iterator(); it.hasNext();) {
            Element tableNode = (Element) it.next();
            HelperTargetTable table = new HelperTargetTable();
            //ȡ表为空sourceTable
            table.setSourceTableName(tableNode.getParent().getParent().attribute("value").getText());
            table.setTargetTableName(tableNode.attribute("value").getText());
            Element fields = tableNode.element("fields");
            List fieldNodes = fields.elements("field");
            for (Iterator fds = fieldNodes.iterator(); fds.hasNext();) {
                Element field = (Element) fds.next();
                table.setField(field.attribute("value").getText());
            }
            tables.add(table);
        }
        return tables;
    }

    public List getTargetDbTableNames(String appName, String targetDb) throws Ex {
        List tables = new ArrayList();
        List targetTables = document.selectNodes("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/targetplugin/targetdb[@value='" + targetDb + "']/table");
        for (Iterator it = targetTables.iterator(); it.hasNext();) {
            Element tableNode = (Element) it.next();
            tables.add(tableNode.attribute("value").getText());
        }
        return tables;
    }

    public String[] getTargetDbNames(String appName, String srcTableName) throws Ex {
        Set targetDBNames = new HashSet();
        List targetDBs = document.selectNodes("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/targetplugin/dbchange/srcdb/tables/srctable[@value='" + srcTableName + "']/targetdb");
        for (Iterator it = targetDBs.iterator(); it.hasNext();) {
            Element targetDB = (Element) it.next();
            targetDBNames.add(targetDB.attribute("value").getText());
        }
        return (String[])targetDBNames.toArray(new String[targetDBNames.size()]);
    }

    public String[] getTargetTableNames(String appName, String srcTableName,String targetDB) throws Ex{
    	Set targetTableNames = new HashSet();
        List tables = document.selectNodes("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/targetplugin/dbchange/srcdb/tables/srctable[@value='" + srcTableName + "']/targetdb[@value='" + targetDB + "']/table");
        for (Iterator it = tables.iterator(); it.hasNext();) {
            Element table = (Element) it.next();
            targetTableNames.add(table.attribute("value").getText());
        }
        return (String[])targetTableNames.toArray(new String[targetTableNames.size()]);
    }

    public Map getTargetDbTables(String appName, String targetDb) throws Ex {
        Map tables = new HashMap();
        List targetTables = document.selectNodes("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/targetplugin/targetdb[@value='" + targetDb + "']/table");
        for (Iterator it = targetTables.iterator(); it.hasNext();) {
            Element tableNode = (Element) it.next();
            //ȡ表为空sourceTable
            tables.put(tableNode.getParent().getParent().attribute("value").getText(), tableNode.attribute("value").getText());
        }
        return tables;
    }

    public List<Field> getTargetDbFields(String appName,String srcDBName, String srcTableName,String targetDBName, String targetTableName) throws Ex {
        List<Field> fields = new ArrayList<Field>();
        Element targetTableFields = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/targetplugin/dbchange/srcdb[@value='"+srcDBName+"']/tables/srctable[@value='" + srcTableName + "']/targetdb[@value='" + targetDBName + "']/table[@value='" + targetTableName + "']/fields");
        if (targetTableFields != null) {
            List fieldNodes = targetTableFields.elements("field");
            for (Iterator it = fieldNodes.iterator(); it.hasNext();) {
                Element fieldNode = (Element) it.next();
                Field field = new Field();
                field.setFieldName(fieldNode.attribute("value").getText());
                field.setDestField(fieldNode.element("DESTFIELD").getText());
                field.setDbType(fieldNode.element("DB_TYPE").getText());
                field.setJdbcType(fieldNode.element("JDBC_TYPE").getText());
                field.setColumnSize(fieldNode.element("COLUMN_SIZE").getText());
                field.setNull(fieldNode.element("IS_NULL").getText());
                field.setPk(fieldNode.element("IS_PK").getText());
                fields.add(field);
            }
        }
        return fields;
    }

    public Field getTargetDbField(String appName, String srcTableName,String targetDb, String table,String fieldName) throws Ex{
    	Field field = new Field();
    	Element fieldNode = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/targetplugin/dbchange/srcdb/tables/srctable[@value='" + srcTableName + "']/targetdb[@value='" + targetDb + "']/table[@value='" + table + "']/fields/field[@value='" + fieldName + "']");
    	if (fieldNode != null) {
    		field.setFieldName(fieldNode.attribute("value").getText());
            field.setDestField(fieldNode.element("DESTFIELD").getText());
            field.setDbType(fieldNode.element("DB_TYPE").getText());
            field.setJdbcType(fieldNode.element("JDBC_TYPE").getText());
            field.setColumnSize(fieldNode.element("COLUMN_SIZE").getText());
            field.setNull(fieldNode.element("IS_NULL").getText());
            field.setPk(fieldNode.element("IS_PK").getText());
        } else {
            throw new Ex().set(EConfig.E_FieldNotExisted, EConfig.KEY_FieldNotExisted, table, field.getFieldName());
        }
    	return field;
    }

    public String[] getAllTargetDBs(String appName) throws Ex {
        Set targetDbs = new HashSet();
        List targetNodes = document.selectNodes("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/targetplugin/targetdb");
        for (Iterator it = targetNodes.iterator(); it.hasNext();) {
            Element target = (Element) it.next();
            targetDbs.add(target.attribute("value").getText());
        }

        return (String[]) targetDbs.toArray(new String[targetDbs.size()]);
    }

    public String[] getTargetSrcTableNames(String appName) {
    	Set srctables = new HashSet();
    	List tables = document.selectNodes("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/targetplugin/dbchange/srcdb/tables/srctable");
        for (Iterator it = tables.iterator(); it.hasNext();) {
            Element srctable = (Element) it.next();
            srctables.add(srctable.attribute("value").getText());
        }
		return (String[]) srctables.toArray(new String[srctables.size()]);
	}

    public String[] getTargetDBs(String appName) throws Ex {
        Set targetDbs = new HashSet();
        List targetNodes = document.selectNodes("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/targetplugin/socketchange/name");
        if (targetNodes.size() > 0) {
            for (Iterator it = targetNodes.iterator(); it.hasNext();) {
                Element target = (Element) it.next();
                targetDbs.add(target.getText());
            }
        } else {
            targetNodes = document.selectNodes("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/targetplugin/targetdb");

            for (Iterator it = targetNodes.iterator(); it.hasNext();) {
                Element target = (Element) it.next();
                targetDbs.add(target.attribute("value").getText());
            }
        }

        return (String[]) targetDbs.toArray(new String[targetDbs.size()]);
    }

    public Set getListedTargetDBs(String appName) throws Ex {
        Set targetDbs = new HashSet();
        List targetNodes = document.selectNodes("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/targetplugin/targetdb");
        for (Iterator it = targetNodes.iterator(); it.hasNext();) {
            Element target = (Element) it.next();
            targetDbs.add(target.attribute("value").getText());
        }

        return targetDbs;
    }

    public String[] getSNMPClient(){
        List sNMPClients = document.selectNodes("/configuration/system/ichange/ichangeutils/snmpclientset/snmpclient");
        String[] sNMPClientArray = new String[sNMPClients.size()];
        int i = 0;
        for (Iterator it = sNMPClients.iterator(); it.hasNext();) {
            Element sNMPClient = (Element) it.next();
               sNMPClientArray[i++] = sNMPClient.element("host").getText()+":"+sNMPClient.element("port").getText();
        }
        return sNMPClientArray;
    }

    public String[] getSysLogClient(){
        List sysLogClients = document.selectNodes("/configuration/system/ichange/ichangeutils/syslogclientset/syslogclient");
        String[] sysLogClientArray = new String[sysLogClients.size()];
        int i = 0;
        for (Iterator it = sysLogClients.iterator(); it.hasNext();) {
            Element sysLogClient = (Element) it.next();
               sysLogClientArray[i++] = sysLogClient.element("host").getText()+":"+sysLogClient.element("port").getText();
        }
        return sysLogClientArray;
    }

    public String getRootDesc() {
        Element root = document.getRootElement();
        return root.attributeValue("desc");
    }

    public Map<String,Object> getListSourceTypes(String appName) throws Ex{
        Map<String,Object> ts = null;
        List types = document.selectNodes("/configuration/system/ichange/types/type[@value='" + appName + "']");

        for( Iterator it = types.iterator();it.hasNext();){
            ts = new HashMap<String, Object>();
            Element type = (Element)it.next();
            Type t = new Type();
            t.setTypeName(type.attribute("value").getText());
            t.setDescription(type.attribute("desc").getText());
            t.setAppType(type.attribute("apptype").getText());
            t.setActive(type.element("isactive").getText());
            ts.put("type",t);
            Element sourceplugin = (Element)document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceplugin");
            if(sourceplugin!=null){
                SocketChange socketChange = getSocketChange(type.attribute("value").getText(), "sourcePlugin");
                ts.put("socketChange",socketChange);
            }
        }
        return ts;
    }

    public Map<String,Object> getListTargetTypes(String appName) throws Ex{
        Map<String,Object> ts = null;
        List types = document.selectNodes("/configuration/system/ichange/types/type[@value='" + appName + "']");

        for( Iterator it = types.iterator();it.hasNext();){
            ts = new HashMap<String, Object>();
            Element type = (Element)it.next();
            Type t = new Type();
            t.setTypeName(type.attribute("value").getText());
            t.setDescription(type.attribute("desc").getText());
            t.setAppType(type.attribute("apptype").getText());
            t.setActive(type.element("isactive").getText());
            ts.put("type",t);
            Element targetplugin = (Element)document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/targetplugin");
            if(targetplugin!=null){
                SocketChange socketChange = getSocketChange(type.attribute("value").getText(), "targetPlugin");
                ts.put("socketChange",socketChange);
            }
        }
        return ts;
    }

    public List<Type> getTypesList(String appType) throws Ex{
    	List<Type> typeLists = new ArrayList<Type>();
    	List types = document.selectNodes("/configuration/system/ichange/types/type[@apptype='" + appType + "']");
    	if(types.size() >0){
    		for( Iterator it = types.iterator();it.hasNext();){
    			Element type = (Element)it.next();
    			String appName = type.attribute("value").getText();
    			Type t = getType(appName);
    			typeLists.add(t);
    		}
    	}
    	return typeLists;
    }

    public List<Type> getTypesList(String appType,boolean isAllow) throws Ex{
    	List<Type> typeLists = new ArrayList<Type>();
    	List types = document.selectNodes("/configuration/system/ichange/types/type[@apptype='" + appType + "']");
    	if(types.size() >0){
    		for( Iterator it = types.iterator();it.hasNext();){
    			Element type = (Element)it.next();
    			String appName = type.attribute("value").getText();
    			Type t = getType(appName);
                if(t.isAllow()==isAllow){
                    typeLists.add(t);
                }
    		}
    	}
    	return typeLists;
    }


    public String[] getProxyIp(String appName) {
    	Element ipAddress = (Element)document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceplugin/socketchange/ipaddress");

        String[] ips = null;
        if(ipAddress!=null){
        	if(ipAddress.getText()!=null){
        		ips= ipAddress.getText().split(",");
        	}else{
        		ips = null;
        	}
        }
        return ips;
	}

    public void editProxyIp(String appName, String ip) {
    	Element ipAddress = (Element)document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceplugin/socketchange/ipaddress");
    	ipAddress.setText(ip==null?"":ip.substring(0));
	}

    public void editProxyBlackIpMac(String appName, IpMac ipMac, String oldUpdateIp) throws Ex{
        if (appName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "appName为空");
        Element ipBlackList = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/targetplugin/socketchange/ipblacklist");
        Iterator ipBlackNode = null;
        if(ipBlackList!=null){
            ipBlackNode = document.selectNodes("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/targetplugin/socketchange/ipblacklist/ipblack").iterator();
        }
        if(ipBlackNode==null){
            ipBlackList = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceplugin/socketchange/ipblacklist");
            ipBlackNode = document.selectNodes("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceplugin/socketchange/ipblacklist/ipblack").iterator();
        }
        if(ipBlackNode != null){
            for(;ipBlackNode.hasNext();){
                Element ipBlack = (Element) ipBlackNode.next();
                String oldIp = ipBlack.element("ip").getText();
                if(oldUpdateIp.equals(oldIp)){
                    ipBlack.element("ip").setText(ipMac.getIp());
                    ipBlack.element("mac").setText(ipMac.getMac());
                }
            }
        }
    }

    public void editProxyWhiteIpMac(String appName, IpMac ipMac, String oldUpdateIp) throws Ex{
        if (appName == null)
            throw new Ex().set(E.E_NullPointer, E.KEY_NULLPOINTER, "appName为空");
        Element ipWhiteList = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/targetplugin/socketchange/ipwhitelist");
        Iterator ipWhiteNode = null;
        if(ipWhiteList!=null){
            ipWhiteNode = document.selectNodes("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/targetplugin/socketchange/ipwhitelist/ipwhite").iterator();
        }
        if(ipWhiteNode==null){
            ipWhiteList = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceplugin/socketchange/ipwhitelist");
            ipWhiteNode = document.selectNodes("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceplugin/socketchange/ipwhitelist/ipwhite").iterator();
        }
        if(ipWhiteNode != null){
            for(;ipWhiteNode.hasNext();){
                Element ipWhite = (Element) ipWhiteNode.next();
                String oldIp = ipWhite.element("ip").getText();
                if(oldUpdateIp.equals(oldIp)){
                    ipWhite.element("ip").setText(ipMac.getIp());
                    ipWhite.element("mac").setText(ipMac.getMac());
                }
            }
        }
    }

	public Map<String, List<MergeField>> getmergetable(String appName, String tableName) {
		Map<String, List<MergeField>> map = new HashMap<String, List<MergeField>>();
		List<MergeField> list = new ArrayList<MergeField>();
		Element mergetablesNode = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceplugin/dbchange/database/tables/table[@value='" + tableName + "']/mergetables");
		if(mergetablesNode!=null){
			List mergeTables = mergetablesNode.elements("mergetable");
			for (Iterator it = mergeTables.iterator(); it.hasNext();) {
				Element mergetableNode = (Element)it.next();
				Element mergefieldsNode = mergetableNode.element("mergefields");
				List mergeFields = mergefieldsNode.elements("mergefield");
				for (Iterator ite = mergeFields.iterator(); ite.hasNext();) {
					Element e = (Element)ite.next();
					MergeField mergeField = new MergeField();
					mergeField.setFieldName(e.attribute("name").getText());
					mergeField.setMergeFieldName(e.attribute("value").getText());
					list.add(mergeField);
				}
				map.put(mergetableNode.attribute("value").getText(), list);
			}
		}
		return map;
	}

	public boolean isMergeTables(String appName, String tableName) {
		Element mergetablesNode = (Element) document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceplugin/dbchange/database/tables/table[@value='" + tableName + "']/mergetables");
		if(mergetablesNode==null){
			return false;
		}else{
			return true;
		}
	}

    public void saveInternal() throws Ex {
        String fileName = confPath.substring(confPath.lastIndexOf("/"), confPath.lastIndexOf("."));
        SimpleDateFormat sdf = new SimpleDateFormat("'['yyyy-MM-dd_HH-mm-ss']'");

        String historyPath =System.getProperty("ichange.home") + "/repository/internal/history";
        String historyFile = historyPath + fileName + sdf.format(new Date()) + ".xml";
        XMLWriter output = null;
        try {
            File file = new File(confPath);
            FileInputStream fin = new FileInputStream(file);
            byte[] bytes = new byte[fin.available()];
            while (fin.read(bytes) < 0) fin.close();

            File history = new File(historyFile);
            if (!history.getParentFile().exists())
                history.getParentFile().mkdir();
            FileOutputStream out = new FileOutputStream(history);
            out.write(bytes);
            out.close();
            OutputFormat format = OutputFormat.createPrettyPrint();
            format.setEncoding("UTF-8");
//            output = new XMLWriter(new FileWriter(file), format);
            output = new XMLWriter(new FileOutputStream(file),format);
            output.write(document);


        } catch (FileNotFoundException e) {
            throw new Ex().set(E.E_FileNotFound, e, new Message("File {0} not found!", historyPath));
        } catch (IOException e) {
            throw new Ex().set(E.E_IOException, e, new Message("ccured exception when move Internal configuration To History"));
        } finally {
            try {
                if (output != null)
                    output.close();
            } catch (IOException e) {
                throw new Ex().set(E.E_IOException, e, new Message("Occured exception when close XMLWrite"));
            }
        }
    }

    public void saveExternal() throws Ex {
        String fileName = confPath.substring(confPath.lastIndexOf("/"), confPath.lastIndexOf("."));
        SimpleDateFormat sdf = new SimpleDateFormat("'['yyyy-MM-dd_HH-mm-ss']'");
        String historyPath = System.getProperty("ichange.home") + "/repository/external/history";
        String historyFile = historyPath + fileName + sdf.format(new Date()) + ".xml";
        XMLWriter output = null;
        try {
            File file = new File(confPath);
            FileInputStream fin = new FileInputStream(file);
            byte[] bytes = new byte[fin.available()];
            while (fin.read(bytes) < 0) fin.close();

            File history = new File(historyFile);
            if (!history.getParentFile().exists())
                history.getParentFile().mkdir();
            FileOutputStream out = new FileOutputStream(history);
            out.write(bytes);
            out.close();

            OutputFormat format = OutputFormat.createPrettyPrint();

            format.setEncoding("UTF-8");

//            output = new XMLWriter(new FileWriter(file), format);
            output = new XMLWriter(new FileOutputStream(file),format);
            output.write(document);

        } catch (FileNotFoundException e) {
            throw new Ex().set(E.E_FileNotFound, e, new Message("File {0} not found!", historyPath));
        } catch (IOException e) {
            throw new Ex().set(E.E_IOException, e, new Message("ccured exception when move Internal configuration To History"));
        } finally {
            try {
                if (output != null)
                    output.close();
            } catch (IOException e) {
                throw new Ex().set(E.E_IOException, e, new Message("ccured exception when close XMLWrite"));
            }
        }
    }

	public String getSrcdbName(String appName) {
		Element srcdb = (Element)this.document.selectSingleNode("/configuration/system/ichange/types/type[@value='" + appName + "']/plugin/targetplugin/dbchange/srcdb");
        if(srcdb != null){
        	return srcdb.attribute("value").getText();
        }
		return null;
	}

    public List<AuditReset> getAuditResets() throws Exception {
        List<AuditReset> list = new ArrayList<AuditReset>();
        List auditresets = document.selectNodes("/audit/auditreset");
        for(Iterator it = auditresets.iterator();it.hasNext();){
            Element e = (Element) it.next();
            AuditReset auditReset = new AuditReset();
            auditReset.setBusinessName(e.element("name").getText());
            auditReset.setFileName(e.element("file").getText());
            auditReset.setBusinessType(e.element("type").getText());
            auditReset.setDate(e.element("date").getText());
            auditReset.setResetStatus(0);
            list.add(auditReset);
        }
        return list;
    }

    public void addAuditReset(List<AuditReset> list) {
        Element audit = (Element) document.selectSingleNode("/audit");
        for (AuditReset a : list ){
            Element auditreset = audit.addElement("auditreset");
            auditreset.addAttribute("importtime", String.valueOf(System.currentTimeMillis()));
            Element child = auditreset.addElement("name");
            child.setText(a.getBusinessName());
            child = auditreset.addElement("type");
            child.setText(a.getBusinessType());
            child = auditreset.addElement("file");
            child.setText(a.getFileName());
            child = auditreset.addElement("date");
            child.setText(String.valueOf(a.getDate()));
        }
    }

    public void saveAuditReset() throws Ex {
        XMLWriter output = null;
        try {
            File file = new File(confPath);
            FileInputStream fin = new FileInputStream(file);
            byte[] bytes = new byte[fin.available()];
            while (fin.read(bytes) < 0) fin.close();
            OutputFormat format = OutputFormat.createPrettyPrint();
            format.setEncoding("UTF-8");
            output = new XMLWriter(new FileOutputStream(file),format);
            if(document != null){
                output.write(document);
            }else{

            }
        } catch (IOException e) {
            throw new Ex().set(E.E_IOException, e, new Message("ccured exception when move Internal configuration To History"));
        } finally {
            try {
                if (output != null)
                    output.close();
            } catch (IOException e) {
                throw new Ex().set(E.E_IOException, e, new Message("Occured exception when close XMLWrite"));
            }
        }
    }


    public void editIChangeUtils(ChannelIChangeUtils cic) {
        Element iChangeUtils = (Element)document.selectSingleNode("/configuration/system/ichange/ichangeutils");
        Element child = null;
        if(iChangeUtils!=null){
            if(iChangeUtils.element("interval")!=null){
                iChangeUtils.element("interval").setText(cic.getInterval());
            }else{
                child = iChangeUtils.addElement("interval");
                child.setText(cic.getInterval());
            }
            if(iChangeUtils.element("gcinterval")!=null){
                iChangeUtils.element("gcinterval").setText(cic.getGcinterval());
            }else{
                child = iChangeUtils.addElement("gcinterval");
                child.setText(cic.getGcinterval());
            }
            if(iChangeUtils.element("recover")!=null){
                iChangeUtils.element("recover").setText(cic.getRecover());
            }else {
                child = iChangeUtils.addElement("recover");
                child.setText(cic.getRecover());
            }
            if(iChangeUtils.element("systemmeantime")!=null){
                iChangeUtils.element("systemmeantime").setText(cic.getSystemmeantime());
            }else{
                child = iChangeUtils.addElement("systemmeantime");
                child.setText(cic.getSystemmeantime());
            }
            if(iChangeUtils.element("virusscan")!=null){
                iChangeUtils.element("virusscan").setText(cic.getVirusscan());
            }else{
                child = iChangeUtils.addElement("virusscan");
                child.setText(cic.getVirusscan());
            }
            if(iChangeUtils.element("cpuuse")==null){
                child = iChangeUtils.addElement("cpuuse");
            }
            if(iChangeUtils.element("memuse")==null){
                child = iChangeUtils.addElement("memuse");
            }
        }
    }


}