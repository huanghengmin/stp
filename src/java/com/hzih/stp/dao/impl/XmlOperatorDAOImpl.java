package com.hzih.stp.dao.impl;

import com.hzih.stp.dao.XmlOperatorDAO;
import com.hzih.stp.entity.*;
import com.hzih.stp.utils.Configuration;
import com.hzih.stp.utils.StringContext;
import com.hzih.stp.utils.StringUtils;
import com.inetec.common.config.stp.ConfigParser;
import com.inetec.common.config.stp.nodes.*;
import com.inetec.common.config.stp.nodes.Channel;
import com.inetec.common.exception.Ex;
import com.inetec.ichange.console.config.Constant;
import com.inetec.ichange.console.config.database.DBFactory;
import com.inetec.ichange.console.config.database.IDataBase;
import com.inetec.ichange.console.config.utils.TriggerBean;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class XmlOperatorDAOImpl implements XmlOperatorDAO{
//	private Logger log = Logger.getLogger(XmlOperatorDAOImpl.class);
	

    private IChange getIChange(String path) throws Ex {
        ConfigParser config = new ConfigParser(path);
        return config.getRoot();
    }

    public Type getInternalTypeByName(String appName) throws Ex {
        return this.getIChange(StringContext.INTERNALXML).getType(appName);  //
    }

    public Type getExternalTypeByName(String appName) throws Ex {
        return this.getIChange(StringContext.EXTERNALXML).getType(appName);  //
    }

    @Override
    public void saveInternalProxyBlackIpMac(String appName, IpMac[] ipMacs) throws Ex {
        Configuration config = new Configuration(StringContext.INTERNALXML);
        config.addProxyBlackIpMac(appName,ipMacs);
        config.saveInternal();
    }

    @Override
    public void saveExternalProxyBlackIpMac(String appName, IpMac[] ipMacs) throws Ex {
        Configuration config = new Configuration(StringContext.EXTERNALXML);
        config.addProxyBlackIpMac(appName,ipMacs);
        config.saveExternal();
    }

    @Override
    public void saveInternalProxyWhiteIpMac(String appName, IpMac[] ipMacs) throws Ex {
        Configuration config = new Configuration(StringContext.INTERNALXML);
        config.addProxyWhiteIpMac(appName, ipMacs);
        config.saveInternal();
    }

    @Override
    public void saveExternalProxyWhiteIpMac(String appName, IpMac[] ipMacs) throws Ex {
        Configuration config = new Configuration(StringContext.EXTERNALXML);
        config.addProxyWhiteIpMac(appName,ipMacs);
        config.saveExternal();
    }

    @Override
    public void deleteInternalProxyBlackIpMac(String appName, IpMac[] ipMacs) throws Ex {
        Configuration config = new Configuration(StringContext.INTERNALXML);
        config.removeProxyBlackIpMac(appName, ipMacs);
        config.saveInternal();
    }

    @Override
    public void deleteExternalProxyBlackIpMac(String appName, IpMac[] ipMacs) throws Ex {
        Configuration config = new Configuration(StringContext.EXTERNALXML);
        config.removeProxyBlackIpMac(appName, ipMacs);
        config.saveExternal();
    }

    @Override
    public void deleteInternalProxyWhiteIpMac(String appName, IpMac[] ipMacs) throws Ex {
        Configuration config = new Configuration(StringContext.INTERNALXML);
        config.removeProxyWhiteIpMac(appName,ipMacs);
        config.saveInternal();
    }

    @Override
    public void deleteExternalProxyWhiteIpMac(String appName, IpMac[] ipMacs) throws Ex {
        Configuration config = new Configuration(StringContext.EXTERNALXML);
        config.removeProxyWhiteIpMac(appName,ipMacs);
        config.saveExternal();
    }

    @Override
    public void updateInternalProxyBlackIpMac(String appName, IpMac ipMac, String oldUpdateIp) throws Ex {
        Configuration config = new Configuration(StringContext.INTERNALXML);
        config.editProxyBlackIpMac(appName,ipMac,oldUpdateIp);
        config.saveInternal();
    }

    @Override
    public void updateExternalProxyBlackIpMac(String appName, IpMac ipMac, String oldUpdateIp) throws Ex {
        Configuration config = new Configuration(StringContext.EXTERNALXML);
        config.editProxyBlackIpMac(appName,ipMac,oldUpdateIp);
        config.saveExternal();
    }

    @Override
    public void updateInternalProxyWhiteIpMac(String appName, IpMac ipMac, String oldUpdateIp) throws Ex {
        Configuration config = new Configuration(StringContext.INTERNALXML);
        config.editProxyWhiteIpMac(appName,ipMac,oldUpdateIp);
        config.saveInternal();
    }

    @Override
    public void updateExternalProxyWhiteIpMac(String appName, IpMac ipMac, String oldUpdateIp) throws Ex {
        Configuration config = new Configuration(StringContext.EXTERNALXML);
        config.editProxyWhiteIpMac(appName,ipMac,oldUpdateIp);
        config.saveExternal();
    }

    /**
     *  更新根节点属性desc
     * @param pathFile  文件全名
     * @param text       更新信息
     * @throws Ex
     */
    public void updateDescription(String pathFile, String text) throws Ex {
        Configuration config = new Configuration(pathFile);
        config.editRootDesc(text);
        config.editTypeIsActiveToFalse();
        config.saveInternal();
    }

    /**
     * 修改通用代理应用的安全属性
     * @param typeBase
     * @param typeSafe
     * @throws Ex
     */
    public void updateProxyTypeSafe(TypeBase typeBase, TypeSafe typeSafe) throws Ex {
        Configuration config = getConfigPrivatedHead(typeBase.getPrivated());
        Type type = config.getType(typeBase.getAppName());
        type.setActive(String.valueOf(false));
        type.setAllow(String.valueOf(false));
        type.setFilter(String.valueOf(typeBase.isFilter()));
        type.setVirusScan(String.valueOf(typeBase.isVirusScan()));
        type.setInfoLevel(String.valueOf(typeBase.getInfoLevel()));
        config.editType(type, typeBase.getAppType());
        String pluginType = null;
        if("1".equals(typeBase.getPlugin())){
            pluginType = Plugin.s_source_plugin;
            SocketChange sourceSocket = config.getSocketChange(typeBase.getAppName(),pluginType);
            if(typeSafe!=null){
                sourceSocket.setClientauthenable(String.valueOf(typeSafe.getClientauthenable()));
                sourceSocket.setIpfilter(typeSafe.getIpfilter());
                sourceSocket.setAuthaddress(typeSafe.getAuthaddress());
                sourceSocket.setAuthca(typeSafe.getAuthca());
                sourceSocket.setAuthport(typeSafe.getAuthport());
                sourceSocket.setAuthcapass(typeSafe.getAuthcapass());
            }
            config.editSocketChange(typeBase.getAppName(), sourceSocket, pluginType);
        }else if("2".equals(typeBase.getPlugin())){
            pluginType = Plugin.s_target_plugin;
            SocketChange targetSocket = config.getSocketChange(typeBase.getAppName(),pluginType);
            if(typeSafe!=null){
                targetSocket.setIpfilter(typeSafe.getIpfilter());
            }
            config.editSocketChange(typeBase.getAppName(), targetSocket, pluginType);
        }
        getConfigPrivatedEnd(config, typeBase.getPrivated());
    }

    /**
     * 修改通用代理应用的应用属性和数据属性
     * @param typeBase
     * @param typeData
     * @throws Ex
     */
    public void updateProxyType(TypeBase typeBase, TypeData typeData) throws Ex {
        Configuration config = getConfigPrivatedHead(typeBase.getPrivated());
        Type type = config.getType(typeBase.getAppName());
        type.setActive(String.valueOf(false));
        type.setAllow(String.valueOf(false));
        if(typeData == null ){
			type.setDescription(typeBase.getAppDesc());
            type.setChannel(typeBase.getChannel());
            type.setChannelPort(typeBase.getChannelport());
			config.editType(type, typeBase.getAppType());
		}else{
                 /*type.setChannel(typeBase.getChannel());
            type.setChannelPort(typeBase.getChannelport());*/
            config.editType(type, type.getAppType());

			String pluginType = null;
			if("1".equals(typeBase.getPlugin())){
				pluginType = Plugin.s_source_plugin;
                SocketChange sourceSocket = config.getSocketChange(typeBase.getAppName(),pluginType);
                if(typeData!=null){
                    sourceSocket.setServerAddress(typeData.getServerAddress()==null?"127.0.0.1":typeData.getServerAddress());
                    sourceSocket.setPort(typeData.getPort()==null?"8060":typeData.getPort());
                    sourceSocket.setPoolMin(typeData.getPoolMin());
                    sourceSocket.setPoolMax(typeData.getPoolMax());
                    sourceSocket.setCharset(typeData.getCharset());
                    sourceSocket.setName(typeData.getName()==null?"":typeData.getName());
                    sourceSocket.setTryTime(typeData.getTryTime());
                    sourceSocket.setType(typeData.getType());
                }
                config.editSocketChange(typeBase.getAppName(), sourceSocket, pluginType);
			}else if("2".equals(typeBase.getPlugin())){
				pluginType = Plugin.s_target_plugin;
                SocketChange targetSocket = config.getSocketChange(typeBase.getAppName(),pluginType);
                if(typeData!=null){
                    targetSocket.setServerAddress(typeData.getServerAddress()==null?"127.0.0.1":typeData.getServerAddress());
                    targetSocket.setPort(typeData.getPort()==null?"8060":typeData.getPort());
                    targetSocket.setPoolMin(typeData.getPoolMin());
                    targetSocket.setPoolMax(typeData.getPoolMax());
                    targetSocket.setCharset(typeData.getCharset());
                    targetSocket.setName(typeData.getName()==null?"":typeData.getName());
                    targetSocket.setTryTime(typeData.getTryTime());
                    targetSocket.setType(typeData.getType());
                }
                config.editSocketChange(typeBase.getAppName(), targetSocket, pluginType);
            }
		}
		getConfigPrivatedEnd(config, typeBase.getPrivated());
    }

    @Override
    public String readRootDesc(String type,String fileName) throws Ex {
        Configuration config = null;
        if(fileName!=null){
            config = getVersionConfigTypeXmlHead(type,fileName);
        } else {
            config = getConfigTypeXmlHead(type);
        }
        return config.getRootDesc();
    }

    /**
     * 启动或停止应用
     * @param typeXml
     * @param appName
     * @param isActive  @throws Ex
     * @throws Ex
     */
    public void updateTypeActive(String typeXml, String appName, boolean isActive) throws Ex {
        Configuration config = getConfigTypeXmlHead(typeXml);
        Type type = config.getType(appName);
        type.setActive(String.valueOf(isActive));
        config.editType(type,type.getAppType());
        getConfigTypeXmlEnd(config, typeXml);
    }


    public void updateSecurityFile(TypeBase typeBase) throws Ex {
        Configuration config = getConfigPrivatedHead(typeBase.getPrivated());
        Type type = config.getType(typeBase.getAppName());
        type.setAllow(String.valueOf(false));
        type.setActive(String.valueOf(false));
        type.setInfoLevel(String.valueOf(typeBase.getInfoLevel()));
        type.setVirusScan(String.valueOf(typeBase.isVirusScan()));
        type.setFilter(String.valueOf(typeBase.isFilter()));
        config.editType(type,type.getAppType());
        getConfigPrivatedEnd(config,typeBase.getPrivated());
    }

    @Override
    public void updateSecurityDB(TypeBase typeBase) throws Ex {
        Configuration config = getConfigPrivatedHead(typeBase.getPrivated());
        Type type = config.getType(typeBase.getAppName());
        type.setAllow(String.valueOf(false));
        type.setActive(String.valueOf(false));
        type.setInfoLevel(String.valueOf(typeBase.getInfoLevel()));
        type.setVirusScan(String.valueOf(typeBase.isVirusScan()));
        type.setFilter(String.valueOf(typeBase.isFilter()));
        config.editType(type,type.getAppType());
        getConfigPrivatedEnd(config,typeBase.getPrivated());
    }

    /**
     * 修改应用的 infolevel、isfilter、isvirusscan、clientauthenable、authca、authaddress、authpass、authport、ipfilter 、ipblacklist、ipwhitelist和ipaddress节点
     * @param typeBase
     * @param typeSafe
     * @throws Ex
     */
    public void updateSecurityProxy(TypeBase typeBase, TypeSafe typeSafe) throws Ex {
        Configuration config = getConfigPrivatedHead(typeBase.getPrivated());
        Type type = config.getType(typeBase.getAppName());
        type.setAllow(String.valueOf(false));
        type.setActive(String.valueOf(false));
        type.setInfoLevel(String.valueOf(typeBase.getInfoLevel()));
        type.setVirusScan(String.valueOf(typeBase.isVirusScan()));
        type.setFilter(String.valueOf(typeBase.isFilter()));
        config.editType(type,type.getAppType());
        String pluginType = null;
        if("1".equals(typeBase.getPlugin())){
            pluginType = Plugin.s_source_plugin;
            SocketChange sourceSocket = config.getSocketChange(typeBase.getAppName(),pluginType);
            sourceSocket.setClientauthenable(String.valueOf(typeSafe.getClientauthenable()));
            sourceSocket.setAuthaddress(typeSafe.getAuthaddress());
            sourceSocket.setAuthport(typeSafe.getAuthport());
            sourceSocket.setAuthca(typeSafe.getAuthca());
            sourceSocket.setAuthcapass(typeSafe.getAuthcapass());
            sourceSocket.setIpfilter(typeSafe.getIpfilter());
            config.editSocketChange(typeBase.getAppName(), sourceSocket, pluginType);
        }else if("2".equals(typeBase.getPlugin())){
            pluginType = Plugin.s_target_plugin;
            SocketChange targetSocket = config.getSocketChange(typeBase.getAppName(),pluginType);
            targetSocket.setIpfilter(typeSafe.getIpfilter());
            config.editSocketChange(typeBase.getAppName(), targetSocket, pluginType);
        }
        getConfigPrivatedEnd(config,typeBase.getPrivated());
    }

    /**
	 * 读取JDBC的名称数组
	 */
	public String[] readJdbcName(String typeXml) throws Ex {
		Configuration config = getConfigTypeXmlHead(typeXml);
		return config.getJdbcNames();
	}
	
	/**
	 * 读取可信JDBC
	 */
	public List<Jdbc> getInternalJdbc() throws Ex {
		Configuration config = new Configuration(StringContext.INTERNALXML);
		List<Jdbc> jdbcs = config.getJdbcs();
		return jdbcs;
	}
    
	/**
	 * 读取非可信JDBC
	 */
	public List<Jdbc> getExternalJdbc() throws Ex {
		Configuration config = new Configuration(StringContext.EXTERNALXML);
		List<Jdbc> jdbcs = config.getJdbcs();
		return jdbcs;
	}
	
	/**
	 * 读取非可信应用appName的type类型表
	 */
	public List<Table> getExternalTypeTable(String appName,String type) throws Ex {
		Configuration config = new Configuration(StringContext.EXTERNALXML);
		List<Table> tables = new ArrayList<Table>();
		if("source".equals(type)){
			tables = config.getListedSourceTableNames(appName);
		}else if("target".equals(type)){
			tables = config.getListedTargetTableNames(appName);
		}
		return tables;
	}

	/**
	 * 读取可信应用appName的type类型表
	 */
	public List<Table> getInternalTypeTable(String appName,String type) throws Ex {
		List<Table> tables = new ArrayList<Table>();
		Configuration config = new Configuration(StringContext.INTERNALXML);
		if("source".equals(type)){
			tables = config.getListedSourceTableNames(appName);
		}else if("target".equals(type)){
			tables = config.getListedTargetTableNames(appName);
		}
		return tables;
	}
	
	/**
	 * 读取应用列表
	 * @throws com.inetec.common.exception.Ex
	 */
	public List<Type> getTypes(String xmlType, String appType) throws Ex {
		List<Type> types = new ArrayList<Type>();
		Configuration config = null;
		if("internal".equals(xmlType)){
			config = new Configuration(StringContext.INTERNALXML);
			types = config.getTypesList(appType);
		}else if("external".equals(xmlType)){
			config = new Configuration(StringContext.EXTERNALXML);
			types = config.getTypesList(appType);
		}
		return types;
	}

    public List<Type> getTypes(String xmlType, String appType,boolean isAllow) throws Ex {
		List<Type> types = new ArrayList<Type>();
		Configuration config = null;
		if("internal".equals(xmlType)){
			config = new Configuration(StringContext.INTERNALXML);
			types = config.getTypesList(appType,isAllow);
		}else if("external".equals(xmlType)){
			config = new Configuration(StringContext.EXTERNALXML);
			types = config.getTypesList(appType,isAllow);
		}
		return types;
	}

	/**
	 * 读取源端文件
	 */
	public SourceFile getSourceFiles(String xmlType, String typeName) throws Ex {
		SourceFile sourceFile = null;
		Configuration config = null;
		if("internal".equals(xmlType)){
			config = new Configuration(StringContext.INTERNALXML);
			sourceFile = config.getSourceFile(typeName, Plugin.s_source_plugin);
		}else if("external".equals(xmlType)){
			config = new Configuration(StringContext.EXTERNALXML);
			sourceFile = config.getSourceFile(typeName, Plugin.s_source_plugin);
		}
		return sourceFile;
	}

	/**
	 * 读取目标端文件
	 */
	public TargetFile getTargetFiles(String xmlType, String typeName) throws Ex {
		TargetFile targetFile = null;
		Configuration config = null;
		if("internal".equals(xmlType)){
			config = new Configuration(StringContext.INTERNALXML);
			targetFile = config.getTargetFile(typeName, Plugin.s_target_plugin);
		}else if("external".equals(xmlType)){
			config = new Configuration(StringContext.EXTERNALXML);
			targetFile = config.getTargetFile(typeName, Plugin.s_target_plugin);
		}
		return targetFile;
	}

	/**
	 * 保存文件同步应用
	 */
	public void saveFileType(TypeBase typeBase, TypeFile typeFile) throws Ex {
		Configuration config = getConfigPrivatedHead(typeBase.getPrivated());
		String sourceClassName = null;
		String targetClassName = null;
		String appName = typeBase.getAppName();
		String appType = typeBase.getAppType();
        Type type = new Type();
        type.setTypeName(typeBase.getAppName());
        type.setAllow(String.valueOf(false));
        type.setActive(String.valueOf(false));
        type.setAppType(typeBase.getAppType());
        type.setDescription(typeBase.getAppDesc());
        type.setFilter(String.valueOf(typeBase.isFilter()));
        type.setVirusScan(String.valueOf(typeBase.isVirusScan()));
        type.setChannel(typeBase.getChannel());
        type.setChannelPort(typeBase.getChannelport());
        type.setSpeed(String.valueOf(typeBase.getSpeed()));
        config.addType(type, appType);

		Plugin plugin = new Plugin();
		if("file".equals(typeBase.getAppType())){
			sourceClassName = "com.fartec.ichange.plugin.filechange.FileChangeSource";
			targetClassName = "com.fartec.ichange.plugin.filechange.FileChangeTarget";
		}
		plugin.setSourceClassName(sourceClassName);
		plugin.setTargetClassName(targetClassName);
		if("1".equals(typeBase.getPlugin())){
			SourceFile sourceFile = new SourceFile();
			sourceFile.setCharset(typeFile.getCharset());
			sourceFile.setDeletefile(String.valueOf(typeFile.getDeleteFile()));
			sourceFile.setDir(typeFile.getDir());
			sourceFile.setFiltertypes("用\",\"隔开(例:*.*,*.txt)".equals(typeFile.getFilterTypes())||typeFile.getFilterTypes()==null?"":typeFile.getFilterTypes());
			sourceFile.setInterval(""+typeFile.getInterval());
			sourceFile.setIsincludesubdir(""+typeFile.getIsIncludeSubDir());
			sourceFile.setIstwoway(""+typeFile.getIsTwoWay());
			sourceFile.setNotfiltertypes("用\",\"隔开(例:*.*,*.txt)".equals(typeFile.getNotFilterTypes())||typeFile.getNotFilterTypes()==null?"":typeFile.getNotFilterTypes());
			sourceFile.setPassword(typeFile.getPassword());
			sourceFile.setPort(typeFile.getPort());
			sourceFile.setProtocol(typeFile.getProtocol());
			sourceFile.setServerAddress(typeFile.getServerAddress());
			sourceFile.setUserName(typeFile.getUserName());
			sourceFile.setThreads(String.valueOf(typeFile.getThreads()));
			sourceFile.setFileListSize(String.valueOf(typeFile.getFileListSize()));
			sourceFile.setPacketSize(String.valueOf(typeFile.getPacketSize()));
			plugin.setSourceFile(sourceFile);
			config.addSourcePlugin(plugin, appName, appType);
		}else if("2".equals(typeBase.getPlugin())){
			TargetFile targetFile = new TargetFile();
			targetFile.setCharset(typeFile.getCharset());
			targetFile.setDeletefile(""+typeFile.getDeleteFile());
			targetFile.setDir(typeFile.getDir());
			targetFile.setOnlyadd(""+typeFile.getIsOnlyAdd());
			targetFile.setPassword(typeFile.getPassword());
			targetFile.setPort(typeFile.getPort());
			targetFile.setServerAddress(typeFile.getServerAddress());
			targetFile.setUserName(typeFile.getUserName());
			targetFile.setProtocol(typeFile.getProtocol());
			targetFile.setIstwoway(String.valueOf(typeFile.getIsTwoWay()));
			targetFile.setThreads(String.valueOf(typeFile.getThreads()));
			targetFile.setFileListSize(String.valueOf(typeFile.getFileListSize()));
			targetFile.setPacketSize(String.valueOf(typeFile.getPacketSize()));
			plugin.setTargetFile(targetFile);
			config.addTargetPlugin(plugin, appName, appType);
		}
		getConfigPrivatedEnd(config, typeBase.getPrivated());
	}

	/**
	 * 修改文件同步应用
	 */
	public void updateFileType(TypeBase typeBase, TypeFile typeFile) throws Ex {
		Configuration config = getConfigPrivatedHead(typeBase.getPrivated());
		String appName = typeBase.getAppName();
		if(typeFile == null){
			Type type = config.getType(appName);
			type.setActive(String.valueOf(false));
            type.setAllow(String.valueOf(false));
			type.setDescription(typeBase.getAppDesc());
            type.setChannel(typeBase.getChannel());
            type.setChannelPort(typeBase.getChannelport());
            type.setSpeed(String.valueOf(typeBase.getSpeed()));
			config.editType(type, typeBase.getAppType());
		}else{
            Type type = config.getType(appName);
            type.setActive(String.valueOf(false));
            type.setAllow(String.valueOf(false));
            /*type.setChannel(typeBase.getChannel());
            type.setChannelPort(typeBase.getChannelport());
            type.setSpeed(String.valueOf(typeBase.getSpeed()));*/
            config.editType(type, type.getAppType());
			String pluginType = null;
			if("1".equals(typeBase.getPlugin())){
				pluginType = Plugin.s_source_plugin;
				SourceFile sourceFile = config.getSourceFile(appName, pluginType);
				sourceFile.setCharset(typeFile.getCharset());
				sourceFile.setDeletefile(String.valueOf(typeFile.getDeleteFile()));
				sourceFile.setDir(typeFile.getDir());
				sourceFile.setFiltertypes("用\",\"隔开(例:*.*,*.txt)".equals(typeFile.getFilterTypes())||typeFile.getFilterTypes()==null?"":typeFile.getFilterTypes());
				sourceFile.setInterval(""+typeFile.getInterval());
				sourceFile.setIsincludesubdir(""+typeFile.getIsIncludeSubDir());
				sourceFile.setIstwoway(""+typeFile.getIsTwoWay());
				sourceFile.setNotfiltertypes("用\",\"隔开(例:*.*,*.txt)".equals(typeFile.getNotFilterTypes())||typeFile.getNotFilterTypes()==null?"":typeFile.getNotFilterTypes());
				sourceFile.setPassword(typeFile.getPassword());
				sourceFile.setPort(typeFile.getPort());
				sourceFile.setProtocol(typeFile.getProtocol());
				sourceFile.setServerAddress(typeFile.getServerAddress());
				sourceFile.setUserName(typeFile.getUserName());
				sourceFile.setThreads(String.valueOf(typeFile.getThreads()));
				sourceFile.setFileListSize(String.valueOf(typeFile.getFileListSize()));
				sourceFile.setPacketSize(String.valueOf(typeFile.getPacketSize()));
				config.editSourceFile(appName,sourceFile,pluginType);
			}else if("2".equals(typeBase.getPlugin())){
				pluginType = Plugin.s_target_plugin;
				TargetFile targetFile = new TargetFile();
				targetFile.setCharset(typeFile.getCharset());
				targetFile.setDeletefile(""+typeFile.getDeleteFile());
				targetFile.setDir(typeFile.getDir());
				targetFile.setOnlyadd(""+typeFile.getIsOnlyAdd());
				targetFile.setPassword(typeFile.getPassword());
				targetFile.setProtocol(typeFile.getProtocol());
				targetFile.setPort(typeFile.getPort());
				targetFile.setServerAddress(typeFile.getServerAddress());
				targetFile.setUserName(typeFile.getUserName());
				targetFile.setIstwoway(String.valueOf(typeFile.getIsTwoWay()));
				targetFile.setThreads(String.valueOf(typeFile.getThreads()));
				targetFile.setFileListSize(String.valueOf(typeFile.getFileListSize()));
				targetFile.setPacketSize(String.valueOf(typeFile.getPacketSize()));
				config.editTargetFile(appName,targetFile,pluginType);
			}
		}
		getConfigPrivatedEnd(config,typeBase.getPrivated());
	}

	/**
	 * 保存代理应用
	 */
	public void saveProxyType(TypeBase typeBase, TypeSafe typeSafe, TypeData typeData) throws Ex {
		Configuration config = getConfigPrivatedHead(typeBase.getPrivated());
		String sourceClassName = null;
		String targetClassName = null;
		String appName = typeBase.getAppName();
		String appType = typeBase.getAppType();
        Type type = new Type();
        type.setTypeName(appName);
        type.setActive(String.valueOf(false));
        type.setAllow(String.valueOf(false));
        type.setAppType(appType);
        type.setDescription(typeBase.getAppDesc());
        type.setChannel(typeBase.getChannel());
        type.setChannelPort(typeBase.getChannelport());
        type.setFilter(String.valueOf(false));
        type.setVirusScan(String.valueOf(false));
        type.setInfoLevel(String.valueOf(0));
        config.addType(type, appType);

		Plugin plugin = new Plugin();
		if("aproxy".equals(typeBase.getAppType())){
			sourceClassName = "com.inetec.ichange.plugin.httpchange.HttpChangeSource";
			targetClassName = "com.inetec.ichange.plugin.httpchange.HttpChangeTarget";
		}else if("proxy".equals(typeBase.getAppType())){
			sourceClassName = "com.inetec.ichange.plugin.socketchange.SocketChangeSource";
			targetClassName = "com.inetec.ichange.plugin.socketchange.SocketChangeTarget";
		}else if("reproxy".equals(typeBase.getAppType())){
			sourceClassName = "com.inetec.ichange.plugin.rehttpchange.RehttpChangeSource";
			targetClassName = "com.inetec.ichange.plugin.rehttpchange.RehttpChangeTarget";
		}else if("ftpproxy".equals(typeBase.getAppType())){
			sourceClassName = "com.inetec.ichange.plugin.ftpchange.FtpChangeSource";
			targetClassName = "com.inetec.ichange.plugin.ftpchange.FtpChangeTarget";
		}
		plugin.setSourceClassName(sourceClassName);
		plugin.setTargetClassName(targetClassName);
		SocketChange socket = new SocketChange();
        socket.setPort(typeData.getPort());
        socket.setPoolMin(typeData.getPoolMin());
        socket.setPoolMax(typeData.getPoolMax());
        socket.setCharset(typeData.getCharset());
        socket.setName(typeData.getName() == null ? "" : typeData.getName());
        socket.setTryTime(typeData.getTryTime());
        socket.setType(typeData.getType());
        socket.setServerAddress(typeData.getServerAddress() == null ? "127.0.0.1" : typeData.getServerAddress());

        if(typeSafe==null){
            typeSafe = new TypeSafe();
            typeSafe.setIpfilter(String.valueOf(0));
            typeSafe.setClientauthenable(false);
        }
        socket.setIpfilter(typeSafe.getIpfilter());
        if("1".equals(typeBase.getPlugin())){
            socket.setClientauthenable(String.valueOf(typeSafe.getClientauthenable()));
            socket.setAuthaddress("");
            socket.setAuthca("");
            socket.setAuthcapass("");
            socket.setAuthport("");
            plugin.setSourceSocket(socket);
            config.addSourcePlugin(plugin, appName, appType);
		}else if("2".equals(typeBase.getPlugin())){
            plugin.setTargetSocket(socket);
			config.addTargetPlugin(plugin, appName, appType);
		}
		getConfigPrivatedEnd(config, typeBase.getPrivated());
	}

	/**
	 * 删除非可信应用
	 */
	public boolean deleteExternalTypeByName(String appName) throws Ex {
		Configuration config = new Configuration(StringContext.EXTERNALXML);
        boolean isRemove = config.removeType(appName);
        if (isRemove) {
            config.saveExternal();
            return true;
        } else {
            return false;
        }
	}

	/**
	 * 删除可信应用
	 */
	public boolean deleteInternalTypeByName(String appName) throws Ex {
		Configuration config = new Configuration(StringContext.INTERNALXML);
        boolean isRemove = config.removeType(appName);
        if (isRemove) {
            config.saveInternal();
            return true;
        } else {
            return false;
        }
	}

	/**
	 * 通过应用名appName判断是否存在非可信应用
	 */
	public boolean isExistExternalType(String appName) throws Ex {
		Configuration config = new Configuration(StringContext.EXTERNALXML);
		return config.isType(appName);
	}

	/**
	 * 通过应用名appName判断是否存在可信应用
	 */
	public boolean isExistInternalType(String appName) throws Ex {
		Configuration config = new Configuration(StringContext.INTERNALXML);
		return config.isType(appName);
	}

	/**
	 * 读取非可信代理应用appName的可访问IP
	 */
	public String[] getExternalProxyIp(String appName) throws Ex {
		Configuration config = new Configuration(StringContext.EXTERNALXML);
		return config.getProxyIp(appName);
	}

	/**
	 * 读取可信代理应用appName的可访问IP
	 */
	public String[] getInternalProxyIp(String appName) throws Ex {
		Configuration config = new Configuration(StringContext.INTERNALXML);
		return config.getProxyIp(appName);
	}

	/**
	 * 保存非可信代理appName的可访问IP
	 */
	public void saveExternalProxyIp(String appName, String ip) throws Ex {
		Configuration config = new Configuration(StringContext.EXTERNALXML);
		config.editProxyIp(appName,ip);
		config.saveExternal();
	}

	/**
	 * 保存可信代理appName的可访问IP
	 */
	public void saveInternalProxyIp(String appName, String ip) throws Ex {
		Configuration config = new Configuration(StringContext.INTERNALXML);
		config.editProxyIp(appName,ip);

		config.saveInternal();
	}

    /**
     *  读取  typeXml对应的  JDBC
     * @param typeXml
     * @param dbName    jdbc的名字
     * @return
     * @throws Ex
     */
    public Jdbc getJdbcByName(String typeXml,String dbName) throws Ex{
        Configuration config = getConfigTypeXmlHead(typeXml);
        return config.getJdbc(dbName);
    }

    /**
     * 读取非可信JDBC
     * @param dbName
     * @return
     * @throws Ex
     */
	public Jdbc getExternalJdbcByName(String dbName) throws Ex {
		Configuration config = new Configuration(StringContext.EXTERNALXML);
		return config.getJdbc(dbName);
	}

    /**
     *  读取可信JDBC
     * @param dbName
     * @return
     * @throws Ex
     */
	public Jdbc getInternalJdbcByName(String dbName) throws Ex {
		Configuration config = new Configuration(StringContext.INTERNALXML);
		return config.getJdbc(dbName);
	}

	/**
	 * 保存数据库同步应用
	 */
	public void saveDBType(TypeBase typeBase, TypeDB typeDB) throws Ex {
    	String appName = typeBase.getAppName();
		String appType = typeBase.getAppType();
		Configuration config = getConfigPrivatedHead(typeBase.getPrivated());
        Type type =  new Type();
        type.setActive(String.valueOf(false));
        type.setAllow(String.valueOf(false));
        type.setAppType(typeBase.getAppType());
        type.setDescription(typeBase.getAppDesc());
        type.setTypeName(typeBase.getAppName());
        type.setChannel(typeBase.getChannel());
        type.setChannelPort(typeBase.getChannelport());
        type.setDataPath(typeBase.getDataPath()==null?"/usr/app/ichange/dest":typeBase.getDataPath());
        type.setDeleteFile(String.valueOf(typeBase.getDeleteFile()));
        type.setLocal(String.valueOf(typeBase.getLocal()));
        type.setRecover(String.valueOf(typeBase.getRecover()));
        type.setSpeed(String.valueOf(typeBase.getSpeed()));
        config.addType(type, appType);

        Plugin plugin = new Plugin();
        plugin.setSourceClassName("com.inetec.ichange.plugin.dbchange.DbChangeSource");
        plugin.setTargetClassName("com.inetec.ichange.plugin.dbchange.DbChangeTarget");
       	if("1".equals(typeBase.getPlugin())){
        	DataBase dataBase = new DataBase();
        	dataBase.setDbName(typeDB.getDbName());
        	dataBase.setOperation(typeDB.getOperation());
        	dataBase.setTwoway(String.valueOf(typeDB.getIsTwoway()));
        	dataBase.setOldStep(String.valueOf(typeDB.getOldStep()));
        	dataBase.setTempTable(typeDB.getTempTable()==null?"":typeDB.getTempTable());
        	dataBase.setMaxRecords(typeDB.getMaxRecords());
        	dataBase.setInterval(typeDB.getInterval());
        	dataBase.setEnable(""+typeDB.getEnable());
            dataBase.setStatus("insert");
        	plugin.setDataBase(dataBase);
        	config.addSourcePlugin(plugin, appName, appType);
        	if(typeDB != null && typeDB.getTempTable()!=null){
    	       	Jdbc jdbc = null;
    	       	String dblocal = null;
    			if(typeBase.getPrivated()){
    				jdbc = getInternalJdbcByName(typeDB.getDbName());
    				dblocal = Constant.DB_INTERNAL;
    			}else{
    				jdbc = getExternalJdbcByName(typeDB.getDbName());
    				dblocal = Constant.DB_INTERNAL;
    			}
    			IDataBase iDataBase = DBFactory.getDataBase(jdbc, dblocal);
    			iDataBase.openConnection();
    			iDataBase.createTempTable(typeDB.getTempTable());			//create tempTable
    			if("ORACLE".equals(jdbc.getDbVender())){					//oracle sequence
    				iDataBase.createSequence();
    			}
    			iDataBase.closeConnection();
           	}
       	}else if("2".equals(typeBase.getPlugin())){
       		String srcdbName = null;
       		Configuration c = null;
       		if(typeBase.getPrivated()){
       			c = new Configuration(StringContext.EXTERNALXML);
       		}else {
       			c = new Configuration(StringContext.INTERNALXML);
       		}
       		srcdbName = c.getSourceDbName(appName);
       		SourceDb sourceDb = new SourceDb();
        	sourceDb.setDbName(srcdbName);

        	plugin.setSourceDb(sourceDb);
       		config.addTargetPlugin(plugin, appName, appType);
       		if(typeBase.getPrivated()){
       			c.saveExternal();
       		}else {
       			c.saveInternal();
       		}
       	}
       	getConfigPrivatedEnd(config, typeBase.getPrivated());

	}

	/**
	 * 保存数据库同步应用的表
	 */
	public void saveDBTypeTable(String type, TypeBase typeBase, TypeDB typeDB, TypeTable typeTable, Field[] tableFields) throws Ex {
		Configuration config = getConfigPrivatedHead(typeBase.getPrivated());
		String appName = typeBase.getAppName();
		Table table = new Table();
		if("source".equals(type)){
			String tableName = typeTable.getTableName();
			table.setTableName(typeTable.getTableName());
            table.setStatus(StringContext.DB_INSERT);
			table.setMonitorDelete(String.valueOf(typeTable.getDelete()));
			table.setMonitorInsert(String.valueOf(typeTable.getInsert()));
			table.setMonitorUpdate(String.valueOf(typeTable.getUpdate()));
			table.setSeqNumber(typeTable.getSeqnumber()==null?"":typeTable.getSeqnumber());
			table.setInterval(typeTable.getInterval()==null?"":typeTable.getInterval());
			config.addSourceTable(appName,typeDB.getDbName(),table);
			for (int i = 0; i < tableFields.length; i++) {      //新增字段
				config.addSourceField(appName,typeDB.getDbName(),tableName,tableFields[i]);
			}
			getConfigPrivatedEnd(config, typeBase.getPrivated());
		}else if("target".equals(type)){
			String srcTableName = typeTable.getSourceTableName();
			String targetDbName = typeTable.getTargetDBName();
			String tableName = typeTable.getTableName();
			String dbName = typeTable.getTargetDBName();
			boolean isTargetTable = config.isTargetTable(srcTableName, appName);
			if(isTargetTable){
				config.removeTargetTable(appName, targetDbName, tableName, srcTableName);
			}
			table.setTableName(tableName);
			table.setDeleteEnable(String.valueOf(typeTable.getDeleteEnable()));
			table.setOnlyinsert(String.valueOf(typeTable.getOnlyInsert()));
			table.setCondition(typeTable.getCondition() == null ? "" : typeTable.getCondition());

			boolean isTargetDB = config.isTargetDB(targetDbName, srcTableName, appName);
			TargetDb targetDb = null;
			if(isTargetDB){
				targetDb = config.getTargetDB(targetDbName, srcTableName, appName);
				config.addTargetTable(table,targetDbName, srcTableName, appName);
			}else{
				targetDb = new TargetDb();
				targetDb.setDbName(dbName);
				targetDb.setTable(table);
				boolean isSrcTable = config.isTargetSrcTable(appName, srcTableName);
				SourceTable srcTable = null;
				if(isSrcTable){
					srcTable = config.getTargetSrcTable(appName,srcTableName);

				}else{
					srcTable = new SourceTable();
					srcTable.setTableName(srcTableName);
				}
				srcTable.setTargetDb(targetDb);
				config.addTargetTable(srcTable, appName);
			}
			for (int i = 0; i < tableFields.length; i++) {
				config.addTargetField(tableName,srcTableName,appName,targetDbName,tableFields[i]);
			}
			getConfigPrivatedEnd(config, typeBase.getPrivated());
		}
	}


	public void updateDBTypeTable(String type, TypeBase typeBase, TypeDB typeDB, TypeTable typeTable, Field[] tableFields) throws Ex {
		Configuration config = getConfigPrivatedHead(typeBase.getPrivated());
		String appName = typeBase.getAppName();
        if("source".equals(type)){
            String dbName = typeDB.getDbName();
            String tableName = typeTable.getTableName();
            Table table = config.getSourceTable(appName, dbName, typeTable.getTableName());
            boolean isSourceTable = config.isSourceTable(appName,tableName);
            DataBase database = config.getDataBase(appName,dbName);
            database.setStatus(StringContext.DB_UPDATE);
            if("trigger".equals(database.getOperation())){
                boolean isNeedOperateDB = needOperateDB(table,typeTable,dbName,config,appName,tableFields);
                if(isNeedOperateDB){  //需要修改数据库
                    table.setStatus(StringContext.DB_UPDATE);
                }
            } else if("flag".equals(database.getOperation())){
                table.setStatus(StringContext.DB_UPDATE);
            }
            table.setMonitorDelete(String.valueOf(typeTable.getDelete()));
            table.setMonitorInsert(String.valueOf(typeTable.getInsert()));
            table.setMonitorUpdate(String.valueOf(typeTable.getUpdate()));
            table.setSeqNumber(typeTable.getSeqnumber()==null?"":typeTable.getSeqnumber());
            table.setInterval(typeTable.getInterval()==null?"":typeTable.getInterval());
            config.editSourceTable(appName, dbName, table);
            config.editDataBase(appName,database);
            List<Field> list = config.getSourceFileds(appName,dbName,tableName);
            for (Field field : list){
                config.removeSourceField(appName, dbName, tableName, field.getFieldName());
            }
            for (int i = 0; i < tableFields.length; i++) {
				config.addSourceField(appName, dbName,tableName, tableFields[i]);
			}
			getConfigPrivatedEnd(config, typeBase.getPrivated());
		}else if("target".equals(type)){
			String srcTableName = typeTable.getSourceTableName();
			String targetDbName = typeTable.getTargetDBName();
			String tableName = typeTable.getTableName();
			String dbName = typeTable.getTargetDBName();
			boolean isTargetTable = config.isTargetTable(srcTableName, appName);
			if(isTargetTable){
				config.removeTargetTable(appName, targetDbName, tableName, srcTableName);
			}
            Table table = config.getTargetTable(appName,srcTableName,targetDbName,tableName);
			table.setTableName(tableName);
			table.setDeleteEnable(String.valueOf(typeTable.getDeleteEnable()));
			table.setOnlyinsert(String.valueOf(typeTable.getOnlyInsert()));
			table.setCondition(typeTable.getCondition() == null ? "" : typeTable.getCondition());

			boolean isTargetDB = config.isTargetDB(targetDbName, srcTableName, appName);
			TargetDb targetDb = null;
			if(isTargetDB){
				targetDb = config.getTargetDB(targetDbName, srcTableName, appName);
				config.addTargetTable(table,targetDbName, srcTableName, appName);
			}else{
				targetDb = new TargetDb();
				targetDb.setDbName(dbName);
				targetDb.setTable(table);
				boolean isSrcTable = config.isTargetSrcTable(appName, srcTableName);
				SourceTable srcTable = null;
				if(isSrcTable){
					srcTable = config.getTargetSrcTable(appName,srcTableName);
				}else{
					srcTable = new SourceTable();
					srcTable.setTableName(srcTableName);
				}
				srcTable.setTargetDb(targetDb);
				config.addTargetTable(srcTable, appName);
			}
			for (int i = 0; i < tableFields.length; i++) {
				config.addTargetField(tableName,srcTableName,appName,targetDbName,tableFields[i]);
			}
			getConfigPrivatedEnd(config, typeBase.getPrivated());
		}
	}

    /**
     *  比较配置文件信息 table,和新的typeTable 是否存在需要修改触发器,
     *
     * @param table
     * @param typeTable
     * @param dbName
     *@param config
     * @param appName
     * @param tableFields    @return
     */
    private boolean needOperateDB(Table table, TypeTable typeTable, String dbName, Configuration config, String appName, Field[] tableFields) throws Ex {
        boolean isNotUpdateFields = true;
        for(int i=0;i<tableFields.length;i++){
            Field field = config.getSourceField(appName,dbName,table.getTableName(),tableFields[i].getFieldName());
            if(field.equals(tableFields[i])){
                continue;
            } else {
                isNotUpdateFields = false;
                break;
            }
        }
        if(table.isMonitorDelete()==typeTable.getDelete()
                && table.isMonitorInsert()==typeTable.getInsert()
                       && table.isMonitorUpdate()==typeTable.getUpdate()
                               && isNotUpdateFields){
            return false;
        }
        return true;
    }

    /**
     * 1.如果jdbc正在使用,则加入列表返回
     * 2.如果没有正在使用,则删除
     * @param jdbcNameArray
     * @param typeXml
     * @return
     * @throws Ex
     */
	public List<String> deleteJdbcByName(String[] jdbcNameArray, String typeXml) throws Ex {
		Configuration config = getConfigTypeXmlHead(typeXml);
		List<String> jdbcs = new ArrayList<String>();
		for (int i = 0; i < jdbcNameArray.length; i++) {
			boolean isUsed = config.getTypeDBName(jdbcNameArray[i]);
			if(!isUsed){
				config.removeJdbc(jdbcNameArray[i]);
			}else{
				jdbcs.add(jdbcNameArray[i]);
			}
		}
		getConfigTypeXmlEnd(config,typeXml);
		return jdbcs;
	}

	/**
	 * 保存JDBC
	 */
	public void saveJdbc(Jdbc jdbc, Boolean privated) throws Ex {
		Configuration config = getConfigPrivatedHead(privated);
		config.addJdbcConfig(jdbc);
		getConfigPrivatedEnd(config, privated);
	}
	
	/**
	 * 更新JDBC
	 */
	public void updateJdbc(Jdbc jdbc, Boolean privated) throws Ex {
		Configuration config = getConfigPrivatedHead(privated);
		config.editJdbcConfig(jdbc);
		getConfigPrivatedEnd(config, privated);
	}
	
	public String[] getExternalSourceTableName(String appName) throws Ex {
		Configuration config = new Configuration(StringContext.EXTERNALXML);
		return config.getSourceTableNames(appName);
	}
	
	public String[] getInternalSourceTableName(String appName) throws Ex {
		Configuration config = new Configuration(StringContext.INTERNALXML);
		return config.getSourceTableNames(appName);
	}
	
	public String[] getJdbcName(String typeXml, String appName) throws Ex {
		Configuration config = getConfigTypeXmlHead(typeXml);
		return config.getJdbcNames();
	}

	public void saveDBTargetName(String typeXml, String appName, String[] targetdbNames) throws Ex {
		Configuration config = getConfigTypeXmlHead(typeXml);
//		SourceTable srcTable = 
//		config.addTargetTable(srcTable, appName);
		getConfigTypeXmlEnd(config, typeXml);
	}
	
	public List<Field> getExternalTypeFields(String appName, String dbName, String tableName) throws Ex {
		Configuration config = new Configuration(StringContext.EXTERNALXML);
		return config.getSourceFileds(appName,dbName, tableName);
	}
	
	public List<Field> getInternalTypeFields(String appName, String tableName) throws Ex {
		Configuration config = new Configuration(StringContext.INTERNALXML);
		return config.getSourceFileds(appName,"",tableName);
	}
	
	public void saveDBTypeMergeTable(TypeBase typeBase, TypeDB typeDB, TypeTable typeTable, String[] merge_table_names, Map<String, MergeField[]> mergeTables) throws Ex {
		Configuration config = getConfigPrivatedHead(typeBase.getPrivated());
		String appName = typeBase.getAppName();
		
		Table table = new Table();
		String tableName = typeTable.getTableName();
		boolean isExist = config.isMergeTables(appName,tableName);
		if(isExist){
			config.removeMergeTables(appName,tableName);
		}
		List<MergeField> mergeFields = new ArrayList<MergeField>();
		MergeTable mergeTable = new MergeTable();
		for (int i = 0; i < merge_table_names.length; i++) {
			mergeTable.setMergeTableName(merge_table_names[i]);
			MergeField[] mFields = mergeTables.get(merge_table_names[i]);
			for (int j = 0; j < mFields.length; j++) {
				String fieldName = mFields[j].getFieldName();
				String mergeFieldName = mFields[j].getMergeFieldName();
				MergeField mergeField = new MergeField(fieldName,mergeFieldName);
				mergeFields.add(mergeField);
			}
		}
		mergeTable.setMergeFieldList(mergeFields);
		table.setTableName(tableName);
		table.setMergeTable(mergeTable);
		config.addSourceMergeTable(table, appName);
		getConfigPrivatedEnd(config, typeBase.getPrivated());
	}
	/**
	 * 更新数据库同步源端的应用
	 */
	public void updateDBTypeSourceApp(TypeBase typeBase) throws Ex {
		Configuration config = getConfigPrivatedHead(typeBase.getPrivated());
		Type type = config.getType(typeBase.getAppName());
		type.setActive(String.valueOf(false));
        type.setAllow(String.valueOf(false));
		type.setDescription(typeBase.getAppDesc());
		type.setDataPath(typeBase.getDataPath());
		type.setDeleteFile(""+typeBase.getDeleteFile());
		type.setRecover(""+typeBase.getRecover());
        type.setChannel(typeBase.getChannel());
        type.setChannelPort(typeBase.getChannelport());
        type.setSpeed(String.valueOf(typeBase.getSpeed()));
		config.editType(type, typeBase.getAppType());
		getConfigPrivatedEnd(config, typeBase.getPrivated());
	}

    /**
     *
     * @param typeBase     应用信息
     * @param dbName       修改后数据源
     * @param dbNameOld    修改前数据源
     * @throws Ex
     */
    public void updateDBName(TypeBase typeBase, String dbName, String dbNameOld) throws Ex{
        boolean privated = typeBase.getPrivated();
        Configuration config = getConfigPrivatedHead(privated);
        String appName = typeBase.getAppName();
        DataBase dataBaseOld = config.getDataBase(appName,dbNameOld);
        DataBase dataBaseBack = config.getDataBase(appName,dbName);
        if(dataBaseBack!=null){
            config.removeDataBase(appName,dbNameOld);
            dataBaseBack.setStatus("");
            dataBaseBack.setTempTable(dataBaseOld.getTempTable());
            dataBaseBack.setTempTableOld(dataBaseOld.getTempTableOld());
            config.editDataBase(appName,dataBaseBack);
        } else {
            DataBase dataBaseNew = config.getDataBase(appName,dbNameOld);
            dataBaseOld.setStatus(StringContext.DB_DELETE);
            dataBaseOld.setTempTable("");
            dataBaseOld.setTempTableOld("");
            config.editDataBase(appName, dataBaseOld);
            dataBaseNew.setDbName(dbName);
            dataBaseNew.setStatus(StringContext.DB_INSERT);
            config.addDataBase(appName,dataBaseNew);
        }
        getConfigPrivatedEnd(config, privated);
    }

    /**
     *
     * @param typeXml
     * @param appName
     * @return
     * @throws Ex
     */
    public List<DataBase> getDataBases(String typeXml, String appName) throws Ex {
        Configuration config = getConfigTypeXmlHead(typeXml);
        return config.getDataBases(appName);
    }

    /**
     * 删除database
     * @param typeXml  内外网
     * @param appName  应用名
     * @param dbName database 的 name
     * @throws Ex
     */
    public void deleteDataBase(String typeXml, String appName, String dbName) throws Ex{
        Configuration config = getConfigTypeXmlHead(typeXml);
        config.removeDataBase(appName,dbName);
        getConfigTypeXmlEnd(config,typeXml);
    }

    /**
     *
     * @param typeXml
     * @param appName  应用编号
     * @param dbName   database名
     * @return
     * @throws Ex
     */
    public List<Table> getTypeTables(String typeXml, String appName, String dbName) throws Ex {
        Configuration config = getConfigTypeXmlHead(typeXml);
        return config.getSourceTables(appName,dbName);
    }

    @Override
    public void updateSourceTable(String typeXml, String appName, String dbName, Table table) throws Ex {
        Configuration config = getConfigTypeXmlHead(typeXml);
        config.editSourceTable(appName,dbName,table);
        getConfigTypeXmlEnd(config,typeXml);
    }

    @Override
    public List<Field> getSourceFields(String typeXml, String appName, String dbName, String tableTame) throws Ex {
        Configuration config = getConfigTypeXmlHead(typeXml);
        return config.getSourceFileds(appName,dbName,tableTame);
    }

    @Override
    public void updateDataBase(String typeXml, String appName, DataBase dataBase) throws Ex {
        Configuration config = getConfigTypeXmlHead(typeXml);
        config.editDataBase(appName,dataBase);
        getConfigTypeXmlEnd(config, typeXml);

    }

    /**
     *
     * @param xmlPath  文件名
     * @param appType 应用类型-数据库同步
     * @return
     * @throws Ex
     */
    public Map<String, List<String>> getTempTables(String xmlPath, String appType) throws Ex {
        Map<String, List<String>> map = new HashMap<String, List<String>>();

        Configuration config = new Configuration(xmlPath);
        List<Type> types = config.getTypesList(appType);
        for (Type type : types){
            DataBase dataBase = config.getDataBase(type.getTypeName());
            String dbName = dataBase.getDbName();
            String tempTable = dataBase.getTempTable();
            if(StringUtils.isNotBlank(tempTable)){
                List<String> list = new ArrayList<String>();
                list = map.get(dbName);
                if(list!=null&&list.size()>0){
                    map.remove(dbName);
                    list.add(tempTable);
                } else {
                    list = new ArrayList<String>();
                    list.add(tempTable);
                }
                map.put(dbName,list);
            }
        }
        return map;
    }

    @Override
    public void deleteSourceTable(String typeXml, String appName, String dbName, Table table) throws Ex {
        Configuration config = getConfigTypeXmlHead(typeXml);
        config.removeSourceTable(appName,dbName,table.getTableName());
        getConfigTypeXmlEnd(config,typeXml);
    }

    @Override
    public void updateTargetSourceDBName(String typeXml, String appName, String sourceDBNameOld, String sourceDBName) throws Ex {
        Configuration config = getConfigTypeXmlHead(typeXml);
        config.removeTargetTables(appName,sourceDBNameOld);
        config.editTargetSrcDb(sourceDBName,sourceDBNameOld,appName);
        getConfigTypeXmlEnd(config,typeXml);
    }

    @Override
    public boolean getJdbcsByName(boolean privated, String jdbcName) throws Ex {
        Configuration config = getConfigPrivatedHead(privated);
        if(privated){
            return config.getTypeDBNameTarget(jdbcName);
        } else {
            return config.getTypeDBName(jdbcName);
        }
    }

    @Override
    public void setDataBaseDelete(String appName, String plugin) throws Ex {
        Configuration config = getConfigTypeXmlHead(plugin);
        List<DataBase> dataBases = config.getDataBases(appName);
        for(DataBase db : dataBases){
            if(!StringContext.DB_INSERT.equals(db.getStatus())){
                db.setStatus(StringContext.DB_DELETE);
                db.setTempTableOld(db.getTempTable());
                db.setTempTable("");
                config.editDataBase(appName,db);
            }
        }
    }

    @Override
    public Field getSourceFile(String typeXml, String appName, String dbName, String tableName, String fieldName) throws Ex {
        Configuration config = getConfigTypeXmlHead(typeXml);
        return config.getSourceField(appName,dbName,tableName,fieldName);
    }

    @Override
    public String[] getTypesByActive(String typeXml, boolean isActive) throws Ex {
        Configuration config = getConfigTypeXmlHead(typeXml);
        return config.getTypeNamesByActive(isActive);
    }

    /**
	 * 更新数据库同步目标的应用
	 */
	public void updateDBTypeTargetApp(TypeBase typeBase) throws Ex {
		Configuration config = getConfigPrivatedHead(typeBase.getPrivated());
		Type type = config.getType(typeBase.getAppName());
		type.setActive(String.valueOf(false));
        type.setAllow(String.valueOf(false));
		type.setDescription(typeBase.getAppDesc());
		type.setDataPath(typeBase.getDataPath());
		type.setDeleteFile(""+typeBase.getDeleteFile());
		type.setRecover(""+typeBase.getRecover());
        type.setChannel(typeBase.getChannel());
        type.setChannelPort(typeBase.getChannelport());
		config.editType(type, typeBase.getAppType());
		getConfigPrivatedEnd(config, typeBase.getPrivated());
	}
	
	/**
	 * 修改数据源应用,如果修改 '数据源' 判断 是否存在表集合,存在则要删除触发,标记,sequnce(oracle)等
	 */
	public void updateDBTypeSourceData(TypeBase typeBase,TypeDB typeDB) throws Ex {
		Configuration config = null;
		String dblocal = null;
		if(typeBase.getPrivated()){
			config = new Configuration(StringContext.INTERNALXML);
		}else{
			config = new Configuration(StringContext.EXTERNALXML);
			dblocal = Constant.DB_INTERNAL;
		}
		String appName = typeBase.getAppName();
		String dataBaseName = typeDB.getDbName();
		Type type = config.getType(appName);
		type.setActive(String.valueOf(false));
        type.setAllow(String.valueOf(false));
		type.setDescription(typeBase.getAppDesc());
		type.setDataPath(typeBase.getDataPath());
		type.setDeleteFile(""+typeBase.getDeleteFile());
		type.setRecover(""+typeBase.getRecover());
		config.editType(type, typeBase.getAppType());
		if(!typeDB.getDbName().equals(config.getSourceDbName(appName))){
			DataBase dataBase = new DataBase();
			dataBase.setDbName(dataBaseName);
            dataBase.setStatus(StringContext.DB_INSERT);
			dataBase.setEnable(String.valueOf(typeDB.getEnable()));
			dataBase.setInterval(typeDB.getInterval()==null?"1":typeDB.getInterval());
			dataBase.setMaxRecords(typeDB.getMaxRecords()==null?"1":typeDB.getMaxRecords());
			dataBase.setOldStep(String.valueOf(typeDB.getOldStep()));
			dataBase.setTwoway(String.valueOf(typeDB.getIsTwoway()));
			dataBase.setTempTable(typeDB.getTempTable()==null?"":typeDB.getTempTable());
			dataBase.setOperation(typeDB.getOperation()==null?"entirely":typeDB.getOperation());
			DataBase _dataBase = getDataBase(dblocal,appName);
			String dbName = _dataBase.getDbName();
			Jdbc jdbc = null;
			if(typeBase.getPrivated()){
				jdbc = getInternalJdbcByName(dbName);
			}else{
				jdbc = getExternalJdbcByName(dbName);
			}
			String tempTable = _dataBase.getTempTable();
			String operation = _dataBase.getOperation();
			String[] tableNames = getFlags(dblocal, appName, operation);
			TriggerBean[] triggers = getTriggerBeans(dblocal,appName, operation);
			boolean isRemove = config.removeSourceTables(appName);
			config.editDataBase(appName, dataBase);
			Configuration con = null;
			if(typeBase.getPrivated()){
				con = new Configuration(StringContext.EXTERNALXML);
			}else{
				con = new Configuration(StringContext.INTERNALXML);
			}
			boolean isType = con.isType(appName);
			if(isType){
				con.removeTargetTables(appName,jdbc.getJdbcName());
				con.editTargetSrcDb(typeDB.getDbName(), jdbc.getJdbcName(), appName);
				if(typeBase.getPrivated()){
					con.saveExternal();
				}else{
					con.saveInternal();
				}
			}
			getConfigPrivatedEnd(config, typeBase.getPrivated());
			if("".equals(_dataBase.getTempTable())){
				if(isRemove){
					deleteTableTriggerOrFlag(operation, jdbc, dblocal, triggers, tempTable, tableNames);
				}
			}else{
				if(isRemove){
					deleteTypeTableTriggerOrFlag(operation, jdbc, dblocal, triggers, tempTable, tableNames);
				}
			}

		}else{
			getConfigPrivatedEnd(config, typeBase.getPrivated());
		}
	}
	
	public String[] readSourceTableNames(String typeXml, String appName) throws Ex {
		Configuration config = getConfigTypeXmlHead(typeXml);
		return config.getSourceTableNames(appName);
	}

    public List readSourceTables(String typeXml, String appName, String dbName) throws Ex{
        Configuration config = getConfigTypeXmlHead(typeXml);
        List list = config.getSourceTables(appName,dbName);
//        for(int i=0;i<list.size();i++){
//            Table table = (Table) list.get(i);
//            String status = table.getStatus();
//            if(StringUtils.isBlank(status)){
//                tables.add(table);
//            } else if( status!=null
//                    && !status.equals(StringContext.DB_DELETE)){
//                tables.add(table);
//            }
//        }
        return list;

    }

	public String[] readTargetTableNames(String typeXml, String appName) throws Ex {
		Configuration config = getConfigTypeXmlHead(typeXml);
		return config.getTargetSrcTableNames(appName);
	}
		
	public void updateDBTypeFields(TypeBase typeBase, String dbName, TypeTable typeTable, String[] fields, String[] is_pks) throws Ex {
		Configuration config = getConfigPrivatedHead(typeBase.getPrivated());
		String tableName = typeTable.getTableName();
		String appName = typeBase.getAppName();
		Field field = null;
		for (int i = 0; i < fields.length; i++) {
			field = config.getSourceField(appName,dbName, tableName, fields[i]);
			field.setPk(is_pks[i]);
			config.editSourceField(tableName, appName, field);
		}
		getConfigPrivatedEnd(config, typeBase.getPrivated());
	}
		
	public String[] readThisTargetDBNames(String typeXml, String srcTableName, String appName) throws Ex {
		Configuration config = getConfigTypeXmlHead(typeXml);
		return config.getTargetDbNames(appName,srcTableName);
	}
		
	public String[] readThisTargetTableNames(String typeXml, String srcTableName, String targetDB, String appName) throws Ex {
		Configuration config = getConfigTypeXmlHead(typeXml);
		return config.getTargetTableNames(appName, srcTableName,targetDB);
	}
		
	public List<Field> getThisTargetTableField(String typeXml, String appName, String sourceDBName, String sourceTableName, String targetDBName, String targetTableName) throws Ex {
		Configuration config = getConfigTypeXmlHead(typeXml);
		return config.getTargetDbFields(appName,sourceDBName, sourceTableName, targetDBName, targetTableName);
	}
		
	public void updateDBTypeTargetFields(TypeBase typeBase, TypeTable typeTable, String[] fields, String[] is_pks) throws Ex {
		Configuration config = getConfigPrivatedHead(typeBase.getPrivated());
		String tableName = typeTable.getTableName();
		String targetDB = typeTable.getTargetDBName();
		String srcTableName = typeTable.getSourceTableName();
		String appName = typeBase.getAppName();
		Field field = null;
		for (int i = 0; i < fields.length; i++) {
			field = config.getTargetDbField(appName, srcTableName, targetDB, tableName,fields[i]);
			
			field.setPk(is_pks[i]);
			config.editTargetField(tableName, targetDB,srcTableName,appName, field);
		}
		getConfigPrivatedEnd(config, typeBase.getPrivated());
	}
	
	public Map<String, List<MergeField>> getThisMergeTableField(String typeXml, String appName,String tableName) throws Ex {
		Configuration config = getConfigTypeXmlHead(typeXml);
		return config.getmergetable(appName,tableName);
	}
	
	public boolean deleteTypeMergeTable(String typeXml, String appName, String[] tableNames) throws Ex {
		Configuration config = getConfigTypeXmlHead(typeXml);
		for (int i = 0; i < tableNames.length; i++) {
			config.removeMergeTables(appName, tableNames[i]);
		}
		getConfigTypeXmlEnd(config, typeXml);
		return true;
	}

    /**
     * 改变源表的状态为 '删除' ,界面读取时可恢复
     *
     * @param typeXml
     * @param appName
     * @param dbName
     *@param tableNames  @return
     * @throws Ex
     */
	public boolean deleteTypeSourceTable(String typeXml, String appName, String dbName, String[] tableNames) throws Ex {
        Configuration config = getConfigTypeXmlHead(typeXml);
        for (int i = 0; i < tableNames.length; i++) {
            Table table = config.getSourceTable(appName, dbName, tableNames[i]);
            table.setStatus(StringContext.DB_DELETE);
            config.editSourceTable(appName,dbName,table);
        }
        DataBase dataBase = config.getDataBase(appName, dbName);
        dataBase.setStatus(StringContext.DB_UPDATE);
        config.editDataBase(appName,dataBase);
        getConfigTypeXmlEnd(config, typeXml);
		return true;
	}

    /**
     * 改变源表的状态 '删除' 为 '' ,界面读取时可删除;
     *
     * @param typeXml
     * @param appName
     * @param dbName
     *@param tableName  @return
     * @throws Ex
     */
	public boolean deleteTypeSourceTableBackUp(String typeXml, String appName, String dbName, String tableName) throws Ex {
		Configuration config = getConfigTypeXmlHead(typeXml);
        Table table = config.getSourceTable(appName,dbName,tableName);
        table.setStatus("");
        config.editSourceTable(appName,dbName,table);
		getConfigTypeXmlEnd(config, typeXml);
		return true;
	}
	
	public boolean deleteTypeSrcTable(String typeXml, String appName, String[] tableNames) throws Ex {
		Configuration config = getConfigTypeXmlHead(typeXml);
		for (int i = 0; i < tableNames.length; i++) {
			config.removeTargetSrcTable(tableNames[i],appName);
		}
		getConfigTypeXmlEnd(config, typeXml);
		return true;
	}
	
	public boolean deleteDBTypeFields(String typeXml, String appName,String dbName, String tableName, String[] fields) throws Ex {
		Configuration config = getConfigTypeXmlHead(typeXml);
		for (int i = 0; i < fields.length; i++) {
			config.removeSourceField(appName, dbName, tableName, fields[i]);
		}
		getConfigTypeXmlEnd(config, typeXml);
		return true;
	}
	
	public Table readSourceTable(String typeXml, String appName,String dbName, String tableName) throws Ex {
		Configuration config = getConfigTypeXmlHead(typeXml);
		return config.getSourceTable(appName, dbName, tableName);
	}
	
	public Field readSourceField(String typeXml, String appName,String dbName, String tableName,String fieldName) throws Ex {
		Configuration config = getConfigTypeXmlHead(typeXml);
		return config.getSourceField(appName,dbName, tableName, fieldName);
	}
	
	public void saveTypeTargetDB(String typeXml, String appName, String srcTableName, String[] targetDBs) throws Ex {
		Configuration config = getConfigTypeXmlHead(typeXml);
		for (int i = 0; i < targetDBs.length; i++) {
			boolean isTargetDB = config.isTargetDB(targetDBs[i], srcTableName, appName);
			if(!isTargetDB){
				config.addTargetTableDB(targetDBs[i],srcTableName,appName);
			}
		}
		getConfigTypeXmlEnd(config, typeXml);
	}
	
	public void deleteTypeTargetDB(String typeXml, String appName, String srcTableName, String[] targetDBs) throws Ex {
		Configuration config = getConfigTypeXmlHead(typeXml);
		if("internal".equals(typeXml)){
			config = new Configuration(StringContext.INTERNALXML);
		}else if("external".equals(typeXml)){
			config = new Configuration(StringContext.EXTERNALXML);
		}
		for (int i = 0; i < targetDBs.length; i++) {
			config.removeTargetTableDB(targetDBs[i],srcTableName,appName);
		}
		getConfigTypeXmlEnd(config, typeXml);
	}
	
	public boolean deleteTypeTargetTable(String typeXml, String appName, String srcTableName, String targetDB, String[] targetTableNames) throws Ex {
		Configuration config = getConfigTypeXmlHead(typeXml);
		boolean isDelete = false;
		for (int i = 0; i < targetTableNames.length; i++) {
			isDelete = config.removeTargetTable(appName, targetDB, targetTableNames[i], srcTableName);
		}
		getConfigTypeXmlEnd(config, typeXml);
		return isDelete;
	}
	
	public void saveTypeTargetTableName(String typeXml, String appName, String srcTableName, String targetDB, String[] targetTableNames) throws Ex {
		Configuration config = getConfigTypeXmlHead(typeXml);
		for (int i = 0; i < targetTableNames.length; i++) {
			config.addTargetTableName(appName, targetDB, targetTableNames[i], srcTableName);
			
		}
		getConfigTypeXmlEnd(config, typeXml);
	}
	
	public Table getThisTargetTable(String typeXml, String appName, String srcTableName, String targetDB, String targetTable) throws Ex {
		Configuration config = getConfigTypeXmlHead(typeXml);
		return config.getTargetTable(appName,srcTableName, targetDB, targetTable);
	}
	
	public String[] readTypeName(String typeXml, String appType) throws Ex {
		Configuration config = null;
		if("internal".equals(typeXml)){
			config = new Configuration(StringContext.EXTERNALXML);
		}else if("external".equals(typeXml)){
			config = new Configuration(StringContext.INTERNALXML);
		}
		String[] appNamesThatS = config.getTypeNamesThatS(appType); // 对应端 数据源应用名

		Configuration con = null;
		if("internal".equals(typeXml)){
			con = new Configuration(StringContext.INTERNALXML);
		}else if("external".equals(typeXml)){
			con = new Configuration(StringContext.EXTERNALXML);
		}
		String[] appNamesThisT = con.getTypeNamesThisT(appType);  // 本端 存在目标的应用名
		
		String[] appNameT = null;
		if(appNamesThisT.length > 0){
			appNameT = new StringUtils().getArray(appNamesThatS,appNamesThisT);  // 本端 剩余对应 对应端数据源 的目标应用名
		}else{
			appNameT = appNamesThatS;
		}

		return new StringUtils().array_unique(appNameT); //去除数组中重复的记录
	}

    public String[] readTypeNameSingle(String typeXml, String appType) throws Ex {
        Configuration config = null;
		if("internal".equals(typeXml)){
			config = new Configuration(StringContext.INTERNALXML);
		}else if("external".equals(typeXml)){
			config = new Configuration(StringContext.EXTERNALXML);
		}
        return config.getTypeNamesThisT(appType);
    }

    @Override
    public List<Type> readTypes(String typeXml) throws Ex {
        Configuration config = null;
		if("internal".equals(typeXml)){
			config = new Configuration(StringContext.INTERNALXML);
		}else if("external".equals(typeXml)){
			config = new Configuration(StringContext.EXTERNALXML);
		}
        return config.readTypes();
    }


    public List<Channel> readChannel() throws Ex {
        Configuration config = new Configuration(StringContext.EXTERNALXML);
        return config.getChannels();
    }

    @Override
    public void updateChannel(Boolean privated, List<Channel> channels) throws Ex {
        Configuration externalConfig = new Configuration(StringContext.EXTERNALXML);
        externalConfig.updateChannel(channels);
        externalConfig.saveExternal();
        Configuration internalConfig = new Configuration(StringContext.INTERNALXML);
        List<Channel> list = new ArrayList<Channel>();
        for (Channel channel : channels){
            if("1".equals(channel.getChannelValue())){
                channel.setPrivated(String.valueOf(!privated));
            }
            list.add(channel);
        }
        internalConfig.updateChannel(list);
        internalConfig.saveInternal();
    }

    public void updateChannelCount(Boolean privated, String count) throws Ex {
        Configuration externalConfig = new Configuration(StringContext.EXTERNALXML);
        externalConfig.updateChannelCount(count);
        externalConfig.saveExternal();
        Configuration internalConfig = new Configuration(StringContext.INTERNALXML);
        internalConfig.updateChannelCount(count);
        internalConfig.saveInternal();
    }

    @Override
    public boolean isExistExternalChannelPort(int channelPort) throws Ex{
        Configuration config = new Configuration(StringContext.EXTERNALXML);
        List<Type> list = config.readTypes();
        for (Type t : list){
            if(Integer.valueOf(t.getChannelPort())==channelPort){
                return true;
            }
        }
        return false;
    }

    @Override
    public void updateTypeAppSend(String appName, int status) throws Ex {
        Configuration config = new Configuration(StringContext.EXTERNALXML);
        if(appName!=null){
            config.updateTypeAppSend(appName,status);
        } else {
            config.updateTypeAppSend(status);
        }
        config.saveExternal();
    }

    @Override
    public List<Type> readTypeNameForBusiness(String xml) throws Ex {
        Configuration config = new Configuration(xml);
        List<Type> types = config.readTypes();
        return types;
    }

    @Override
    public IChangeUtils getIChangeUtils() throws Ex {

        return this.getIChange(StringContext.EXTERNALXML).getIchangeUtils();
    }

    @Override
    public void updateChangeUtils(ChannelIChangeUtils channelIChangeUtils) throws Ex {
        Configuration config = new Configuration(StringContext.EXTERNALXML);
        config.editIChangeUtils(channelIChangeUtils);
        config.saveExternal();
    }

    @Override
    public void saveRestartTime(String time) throws Ex {
        Configuration config = new Configuration(StringContext.EXTERNALXML);
        config.addRestartTime(time);
        config.saveExternal();
    }

    @Override
    public String[] getSNMPClient() throws Ex {
        Configuration config = new Configuration(StringContext.EXTERNALXML);
        return config.getSNMPClient();
    }

    @Override
    public String[] getSysLogClient() throws Ex {
        Configuration config = new Configuration(StringContext.EXTERNALXML);
        return config.getSysLogClient();
    }

    @Override
    public void saveSNMPClient(String ip) throws Ex {
        Configuration config = new Configuration(StringContext.EXTERNALXML);
        config.addSNMPClient(ip);
        config.saveExternal();
    }

    @Override
    public void saveSysLogClient(String ip) throws Ex {
        Configuration config = new Configuration(StringContext.EXTERNALXML);
        config.addSysLogClient(ip);
        config.saveExternal();
    }

    @Override
    public void deleteSNMPClient(String ip) throws Ex {
        Configuration config = new Configuration(StringContext.EXTERNALXML);
        config.removeSNMPClient(ip);
        config.saveExternal();
    }

    @Override
    public void deleteSysLogClient(String ip) throws Ex {
        Configuration config = new Configuration(StringContext.EXTERNALXML);
        config.removeSysLogClient(ip);
        config.saveExternal();
    }

    @Override
    public void updateSNMPClient(String snmpclient, String oldSNMPClient) throws Ex {
        Configuration config = new Configuration(StringContext.EXTERNALXML);
        config.editSNMPClient(snmpclient,oldSNMPClient);
        config.saveExternal();
    }

    @Override
    public void updateSysLogClient(String syslogclient, String oldSysLogClient) throws Ex {
        Configuration config = new Configuration(StringContext.EXTERNALXML);
        config.editSysLogClient(syslogclient,oldSysLogClient);
        config.saveExternal();
    }

    @Override
    public void updateTypeAllow(String plugin, String appName, boolean allow) throws Ex {
        Configuration config = getConfigTypeXmlHead(plugin);
        Type type = config.getType(appName);
        type.setAllow(String.valueOf(allow));
        config.editType(type,type.getAppType());
        getConfigTypeXmlEnd(config, plugin);
    }

    /**
     * 1.先设置应用为审核不通过,应用不启用
     * 2.增加临时表
     * 3.增加
     *
     * @param typeBase
     * @param typeDB
     * @param operateDB
     * @throws Ex
     */
    public void updateToTrigger(TypeBase typeBase, TypeDB typeDB, boolean operateDB) throws Ex {
        Configuration config = getConfigPrivatedHead(typeBase.getPrivated());
        String appName = typeBase.getAppName();
        String dbName = typeDB.getDbName();
        Type type = config.getType(appName);
        type.setAllow(String.valueOf(false));
        type.setActive(String.valueOf(false));
        config.editType(type, type.getAppType());
        updateDatabase(config,appName,typeDB,operateDB);
        if(!operateDB){
            updateMonitor(config, appName,dbName, true);
        }
        getConfigPrivatedEnd(config,typeBase.getPrivated());
    }

    public void updateTriggerTo(TypeBase typeBase, TypeDB typeDB, boolean operateDB) throws Ex {
        Configuration config = getConfigPrivatedHead(typeBase.getPrivated());
        String appName = typeBase.getAppName();
        String dbName = typeDB.getDbName();
        Type type = config.getType(appName);
        type.setAllow(String.valueOf(false));
        type.setActive(String.valueOf(false));
        config.editType(type, type.getAppType());
        updateDatabase(config,appName,typeDB,operateDB);
        if(!operateDB){
            updateMonitor(config, appName,dbName, false);
        }
        getConfigPrivatedEnd(config,typeBase.getPrivated());
    }

    private void updateDatabase(Configuration config, String appName, TypeDB typeDB, boolean operateDB) throws Ex{
        DataBase dataBase = config.getDataBase(appName);
        if(!operateDB){
            if(typeDB.getTempTable()!=null){
                dataBase.setTempTable(typeDB.getTempTable());
                dataBase.setStatus(StringContext.DB_INSERT);
            } else {
                dataBase.setTempTableOld(dataBase.getTempTable());
                dataBase.setTempTable("");
                dataBase.setStatus(StringContext.DB_UPDATE);
            }
        } else {
            if(typeDB.getTempTable()!=null){
                if(!typeDB.getTempTable().equals(dataBase.getTempTable())){
                    dataBase.setTempTableOld(dataBase.getTempTable());//设置临时表需要删除的表名
                    dataBase.setTempTable(typeDB.getTempTable());
                    dataBase.setStatus(StringContext.DB_UPDATE);
                }
            }
        }
        dataBase.setOldStep(String.valueOf(typeDB.getOldStep()));
        dataBase.setMaxRecords(typeDB.getMaxRecords());
        dataBase.setInterval(typeDB.getInterval());
        dataBase.setOperation(typeDB.getOperation());
        dataBase.setEnable(String.valueOf(typeDB.getEnable()));
        config.editDataBase(appName, dataBase);
    }

    /**
     * 设置 /configuration/system/ichange/types/type[@value='" + appName + "']/plugin/sourceplugin/dbchange/database/tables/table
     * 的monitordelete、monitorinsert和monitorupdate值为 value
     * @param config
     * @param appName
     * @param value
     * @throws Ex
     */
    private void updateMonitor(Configuration config, String appName,String dbName, boolean value) throws Ex{
        List list = config.getSourceTables(appName, dbName);
        for(int i=0;i<list.size();i++){
            Table table = (Table) list.get(i);
            table.setMonitorInsert(String.valueOf(value));
            table.setMonitorDelete(String.valueOf(value));
            table.setMonitorUpdate(String.valueOf(value));
            config.editSourceTable(appName,dbName,table);
        }
    }
    @Override
    public void updateEntirelyDeleteTimeSyncToTrigger(TypeBase typeBase, TypeDB typeDB) throws Ex {

    }
    @Override
    public void updateTriggerToEntirelyDeleteTimeSync(TypeBase typeBase, TypeDB typeDB) throws Ex {

    }

    @Override
    public void updateEntirelyDeleteTimeSyncToFlag(TypeBase typeBase, TypeDB typeDB) throws Ex {

    }

    @Override
    public void updateFlagToEntirelyDeleteTimeSync(TypeBase typeBase, TypeDB typeDB) throws Ex {

    }

    @Override
    public void updateFlagToTrigger(TypeBase typeBase, TypeDB typeDB) throws Ex {

    }

    @Override
    public void updateTriggerToFlag(TypeBase typeBase, TypeDB typeDB) throws Ex {

    }


    //type存在 sourceplugin || type不存在
	public boolean isExistExternalTypeS(String appName) throws Ex {
		Configuration config = new Configuration(StringContext.EXTERNALXML);
		return config.isTypeS(appName);
	}

	public boolean isExistInternalTypeS(String appName) throws Ex {
		Configuration config = new Configuration(StringContext.INTERNALXML);
		return config.isTypeS(appName);
	}

    public boolean isExistExternalTypeDescS(String appDesc) throws Ex {
		Configuration config = new Configuration(StringContext.EXTERNALXML);
		return config.isTypeDescS(appDesc);
	}

	public boolean isExistInternalTypeDescT(String appDesc) throws Ex {
		Configuration config = new Configuration(StringContext.INTERNALXML);
		return config.isTypeDescT(appDesc);
	}
	
	public boolean isInternalTwowayApp(String appName) throws Ex {
		Configuration config = new Configuration(StringContext.INTERNALXML);
		return config.isTwoway(appName);
	}
	
	public boolean isExternalTwowayApp(String appName) throws Ex {
		Configuration config =  new Configuration(StringContext.EXTERNALXML);
		return config.isTwoway(appName);
	}
	
	public DataBase getDataBase(String typeXml, String appName) throws Ex {
		Configuration config = getConfigTypeXmlHead(typeXml);
		return config.getDataBase(appName);
	}
	
	public String getSrcdbName(String xmlType, String appName) throws Ex {
		Configuration config = getConfigTypeXmlHead(xmlType);
		return config.getSrcdbName(appName);
	}

    @Override
    public Type readInternalProxyType(String appName, String proxyType) throws Ex {
        Configuration config = new Configuration(StringContext.INTERNALXML);
        return config.getType(appName);
    }

    @Override
    public Type readExternalProxyType(String appName, String proxyType) throws Ex {
        Configuration config =  new Configuration(StringContext.EXTERNALXML);
        return config.getType(appName);
    }

    public SocketChange getSocketChange(String xmlType, String pluginType, String appName) throws Ex {
		SocketChange socketChange = null;
		Configuration config = null;
		if("internal".equals(xmlType)){
			config = new Configuration(StringContext.INTERNALXML);
			socketChange = config.getSocketChange(appName, pluginType);
		}else if("external".equals(xmlType)){
			config = new Configuration(StringContext.EXTERNALXML);
			socketChange = config.getSocketChange(appName, pluginType);
		}
		return socketChange;
	}

    public Map<Integer, Map<Integer, Map<String,Object>>> readProxyType(String appType) throws Ex {
        Map<Integer, Map<Integer, Map<String,Object>>> map = new HashMap<Integer, Map<Integer, Map<String,Object>>>();

        Configuration config = new Configuration(StringContext.INTERNALXML);
        Configuration externalConfig =  new Configuration(StringContext.EXTERNALXML);
        String[] appNames = config.getTypeNames(appType);
        String[] externalAppNames = externalConfig.getTypeNames(appType);
        Map<String,Object> internalProxyTypeS = null;
        Map<String,Object> externalProxyTypeT = null;
        int index = 0;
        for (int i = 0 ; i <appNames.length; i++){
            Map<Integer, Map<String,Object>> types = new HashMap<Integer, Map<String,Object>>();
            internalProxyTypeS = config.getListSourceTypes(appNames[i]);
            externalProxyTypeT = externalConfig.getListTargetTypes(appNames[i]);
            types.put(1,internalProxyTypeS);
            types.put(2,externalProxyTypeT);
            map.put(index ++,types);
        }
        Map<String,Object> externalProxyTypeS = null;
        Map<String,Object> internalProxyTypeT = null;
        for (int i = 0 ; i < externalAppNames.length; i++){
            Map<Integer, Map<String,Object>> types = new HashMap<Integer, Map<String,Object>>();
            externalProxyTypeS = externalConfig.getListSourceTypes(externalAppNames[i]);
            internalProxyTypeT = config.getListTargetTypes(externalAppNames[i]);
            types.put(1,externalProxyTypeS);
            types.put(2,internalProxyTypeT);
            map.put(index ++,types);
        }

        return map;
    }

    public TriggerBean[] getTriggerBeans(String dblocal, String appName,String dbName,String operation,String tableName ) throws Ex {
		TriggerBean[] triggers = null;
		List<TriggerBean> triggersList = new ArrayList<TriggerBean>();
    	if("trigger".equals(operation)){
    		Table table = null;
    		Configuration config = null;
    		if("internal".equals(dblocal)){
    			config = new Configuration(StringContext.INTERNALXML);
    			table = config.getSourceTable(appName, dbName, tableName);
    		}else if("external".equals(dblocal)){
    			config = new Configuration(StringContext.EXTERNALXML);
    			table = config.getSourceTable(appName, dbName, tableName);
    		}
    		TriggerBean trigger = new TriggerBean();
    		boolean monitorDelete = table.isMonitorDelete();
    		boolean monitorUpdate = table.isMonitorUpdate();
    		boolean monitorInsert = table.isMonitorInsert();
    		List<String> pkFieldsList = new ArrayList<String>();
    		List<Field> fields = new ArrayList<Field>();
    		if("internal".equals(dblocal)){
    			fields = getInternalTypeFields(appName, tableName);
    		}else if("external".equals(dblocal)){
    			fields = getExternalTypeFields(appName, appName, tableName);
    		}
    		
    		for (Field field : fields) {
    			if(field.isPk()){
    				pkFieldsList.add(field.getFieldName());
    			}
    		}
    		String[] pkFields = pkFieldsList.toArray(new String[pkFieldsList.size()]);
    		if(monitorDelete){
    			trigger.setMonitorDelete(monitorDelete);
    		}
    		if(monitorUpdate){
    			trigger.setMonitorUpdate(monitorUpdate);
    		}
    		if(monitorInsert){
    			trigger.setMonitorInsert(monitorInsert);
    		}
    		trigger.setPkFields(pkFields);
    		trigger.setTableName(tableName);
    		triggersList.add(trigger);
    		
    		triggers = triggersList.toArray(new TriggerBean[triggersList.size()]);
    	}
		return triggers;
	}
    
    public TriggerBean[] getTriggerBeans(String dblocal, String appName,String operation) throws Ex {
		TriggerBean[] triggers = null;
		List<TriggerBean> triggersList = new ArrayList<TriggerBean>();
    	if("trigger".equals(operation)){
    		List<Table> tables = null;
    		if("internal".equals(dblocal)){
    			tables = getInternalTypeTable(appName, "source");
    		}else if("external".equals(dblocal)){
    			tables = getExternalTypeTable(appName, "source");
    		}
    		for (Table table : tables) {
    			String tableName = table.getTableName();
    			TriggerBean trigger = new TriggerBean();
    			boolean monitorDelete = table.isMonitorDelete();
    			boolean monitorUpdate = table.isMonitorUpdate();
    			boolean monitorInsert = table.isMonitorInsert();
    			List<String> pkFieldsList = new ArrayList<String>();
    			List<Field> fields = new ArrayList<Field>();
    			if("internal".equals(dblocal)){
        			fields = getInternalTypeFields(appName, tableName);
        		}else if("external".equals(dblocal)){
        			fields = getExternalTypeFields(appName, appName, tableName);
        		}
    			 
    			for (Field field : fields) {
					if(field.isPk()){
						pkFieldsList.add(field.getFieldName());
					}
				}
    			String[] pkFields = pkFieldsList.toArray(new String[pkFieldsList.size()]);
    			if(monitorDelete){
    				trigger.setMonitorDelete(monitorDelete);
    			}
    			if(monitorUpdate){
    				trigger.setMonitorUpdate(monitorUpdate);
    			}
    			if(monitorInsert){
    				trigger.setMonitorInsert(monitorInsert);
    			}
    			trigger.setPkFields(pkFields);
    			trigger.setTableName(tableName);
    			triggersList.add(trigger);
			}
    		triggers = triggersList.toArray(new TriggerBean[triggersList.size()]);
    	}
		return triggers;
	}
   
	public String[] getFlags (String dblocal, String appName,String operation) throws Ex {
		String[] tableNames = null;
		if("flag".equals(operation)){
    		tableNames = readSourceTableNames(dblocal, appName);//getTableNames(dblocal,appName);
    	}
		return tableNames;
	}
	
	public void deleteTableTriggerOrFlag(String operation,Jdbc jdbc,String dblocal,TriggerBean[] triggers,String tempTable,String[] tableNames) throws Ex {
		if("trigger".equals(operation)){
        	IDataBase iDataBase = DBFactory.getDataBase(jdbc, dblocal);
        	iDataBase.openConnection();
//        	if("ORACLE".equals(jdbc.getDbVender())){		//oracle sequence
//        		iDataBase.removeSequence();
//        	}
        	iDataBase.removeTrigger(triggers, tempTable);
//        	iDataBase.removeTempTable(tempTable);			//delete tempTable
        	iDataBase.closeConnection();
        }else if("flag".equals(operation)){
        	IDataBase iDataBase = DBFactory.getDataBase(jdbc, dblocal);
        	iDataBase.openConnection();
        	iDataBase.removeFlag(tableNames);			//delete flag 
        	iDataBase.closeConnection();
        }
	}
	
	public void deleteTypeTableTriggerOrFlag(String operation,Jdbc jdbc,String dblocal,TriggerBean[] triggers,String tempTable,String[] tableNames) throws Ex {
		if("trigger".equals(operation)){
        	IDataBase iDataBase = DBFactory.getDataBase(jdbc, dblocal);
        	iDataBase.openConnection();
        	iDataBase.removeTrigger(triggers, tempTable);
        	iDataBase.removeTempTable(tempTable);			//delete tempTable
        	if("ORACLE".equals(jdbc.getDbVender())){		//oracle sequence
        		iDataBase.removeSequence();
        	}
        	iDataBase.closeConnection();
        }else if("flag".equals(operation)){
        	IDataBase iDataBase = DBFactory.getDataBase(jdbc, dblocal);
        	iDataBase.openConnection();
        	iDataBase.removeFlag(tableNames);			//delete flag 
        	iDataBase.closeConnection();
        }
	}

	private void getConfigTypeXmlEnd(Configuration config,String typeXml) throws Ex {
		if("internal".equals(typeXml)){
			config.saveInternal();
		}else if("external".equals(typeXml)){
			config.saveExternal();
		}
		
	}

	private Configuration getConfigTypeXmlHead(String typeXml) throws Ex {
		Configuration config = null;
		if("internal".equals(typeXml)){
			config = new Configuration(StringContext.INTERNALXML);
		}else if("external".equals(typeXml)){
			config = new Configuration(StringContext.EXTERNALXML);
		}
		return config;
	}

    private Configuration getVersionConfigTypeXmlHead(String typeXml,String fileName) throws Ex {
		Configuration config = null;
		if("internal".equals(typeXml)){
			config = new Configuration(StringContext.INTERNALVERSIONPATH+"/"+fileName);
		}else if("external".equals(typeXml)){
			config = new Configuration(StringContext.EXTERNALVERSIONPATH+"/"+fileName);
		}
		return config;
	}
	
	private void getConfigPrivatedEnd(Configuration config, Boolean privated) throws Ex {
		if(privated){
			config.saveInternal();
		}else{
			config.saveExternal();
		}
	}
	
	private Configuration getConfigPrivatedHead(boolean privated) throws Ex {
		Configuration config = null;
		if(privated){
			config = new Configuration(StringContext.INTERNALXML);
		}else{
			config = new Configuration(StringContext.EXTERNALXML);
		}
		return config;
	}
}
