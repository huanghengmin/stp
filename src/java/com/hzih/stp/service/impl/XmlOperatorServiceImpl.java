package com.hzih.stp.service.impl;

import com.hzih.stp.dao.DeleteStatusDao;
import com.hzih.stp.dao.XmlOperatorDAO;
import com.hzih.stp.dao.impl.XmlOperatorDAOImpl;
import com.hzih.stp.domain.DeleteStatus;
import com.hzih.stp.entity.*;
import com.hzih.stp.service.XmlOperatorService;
import com.hzih.stp.utils.*;
import com.hzih.stp.web.SessionUtils;
import com.inetec.common.config.stp.nodes.Channel;
import com.inetec.common.config.stp.nodes.DataBase;
import com.inetec.common.config.stp.nodes.Field;
import com.inetec.common.config.stp.nodes.IChangeUtils;
import com.inetec.common.config.stp.nodes.IpMac;
import com.inetec.common.config.stp.nodes.Jdbc;
import com.inetec.common.config.stp.nodes.Plugin;
import com.inetec.common.config.stp.nodes.SocketChange;
import com.inetec.common.config.stp.nodes.SourceFile;
import com.inetec.common.config.stp.nodes.Table;
import com.inetec.common.config.stp.nodes.TargetFile;
import com.inetec.common.config.stp.nodes.Type;
import com.inetec.common.exception.Ex;
import com.inetec.common.security.License;
import com.inetec.common.util.OSInfo;
import com.inetec.common.util.Proc;
import com.inetec.ichange.console.config.Constant;
import com.inetec.ichange.console.config.database.DBFactory;
import com.inetec.ichange.console.config.database.IDataBase;
import net.sf.json.JSONObject;

import java.io.File;
import java.io.IOException;
import java.util.*;

public class XmlOperatorServiceImpl implements XmlOperatorService {
	private XmlOperatorDAO xmlOperatorDAO = new XmlOperatorDAOImpl();
    private DeleteStatusDao deleteStatusDao;

    public void setDeleteStatusDao(DeleteStatusDao deleteStatusDao) {
        this.deleteStatusDao = deleteStatusDao;
    }

    /**
	 * 读取内网internal：config.xml的type，以json返回
	 */
	public String readInternalType(Integer start, Integer limit,String appType) throws Ex {
//		Map<Integer,List<String>> internalTypes = xmlOperatorDAO.getInternalTypes(appType);
		List<Type> internalTypes = xmlOperatorDAO.getTypes("internal",appType);
		int total = internalTypes.size();
		String json = "{'success':true,'total':"+total+",rows:[";
		if(total == 0){
			json += ",]}";
		}else {
			if("db".equals(appType)){
				int index = 0;
				for (int i = 0; i < total; i++) {
					if(i==start&&index<limit){
						start ++;
						index ++;						
						Type type = internalTypes.get(i);
						DataBase s = xmlOperatorDAO.getDataBase("internal", type.getTypeName());		
						String t = xmlOperatorDAO.getSrcdbName("internal",type.getTypeName());
						String flag = "flag_0";
						String plugin = "0";
						String tables = "tables_0";
						if(s!=null && t == null){
							flag = "flag_1";
							plugin = "1";
							t = "";
							tables = "tables_1";
							json += "{appName:'"+type.getTypeName()+"',appDesc:'"+type.getDescription()+"',appType:'"+type.getAppType()+"',isAllow:"+type.isAllow()+
								",isActive:'"+type.isActive()+	"',isLocal:'"+type.isLocal()+"',isRecover:'"+type.isRecover()+ "',infoLevel:" +type.getInfoLevel()+
                                ",isFilter:"+type.isFilter()+",isVirusScan:"+type.isVirusScan()+
								",dataPath:'"+type.getDataPath()+"',deleteFile:'"+type.isDeleteFile()+"',dbName:'"+s.getDbName()+
								"',oldStep:'"+s.isOldStep()+"',operation:'"+s.getOperation()+"',enable:'"+s.isEnable()+
								"',tempTable:'"+s.getTempTable()+"',maxRecords:'"+s.getMaxRecords()+"',interval:'"+s.getInterval()+
								"',isTwoway:'"+s.isTwoway()+"',srcdbName:'"+t+"',plugin:'"+plugin+
								"',tables:'"+tables+"',privated:false,deleteFlag:"+getDeleteFlag(type.getTypeName())+",flag:'"+flag+"'},";
						}else if(s==null && t != null){
							flag = "flag_2";
							plugin = "2";
							tables = "tables_2";
                            boolean updateFlag = false;
                            DataBase sourceDataBase = null;
                            try{
                                sourceDataBase = xmlOperatorDAO.getDataBase(StringContext.EXTERNAL,type.getTypeName());
                            } catch (Ex ex){
//                                logger.error("源端不存在该应用"+type.getTypeName());
                            }
                            if(sourceDataBase!=null){
                                String sourceDBName = sourceDataBase.getDbName();
                                if(sourceDBName.equals(t)){
                                    updateFlag = true;
                                }
                            }
							json += "{'appName':'"+type.getTypeName()+"','appDesc':'"+type.getDescription()+"','appType':'"+type.getAppType()+ "',isAllow:"+type.isAllow()+
								",'isActive':'"+type.isActive()+	"','isLocal':'"+type.isLocal()+"','isRecover':'"+type.isRecover()+ "',infoLevel:" +type.getInfoLevel()+
                                ",isFilter:"+type.isFilter()+",isVirusScan:"+type.isVirusScan()+
								",'dataPath':'"+type.getDataPath()+"','deleteFile':'"+type.isDeleteFile()+"','dbName':'"+
								"','oldStep':'','operation':'','enable':'"+
								"','tempTable':'','maxRecords':'','interval':'"+
								"','isTwoway':'','srcdbName':'"+t+"','plugin':'"+plugin+
								"','tables':'"+tables+"','privated':false,deleteFlag:"+getDeleteFlag(type.getTypeName())+",flag:'"+flag+"',updateFlag:"+updateFlag+"},";
						}else if(s!=null && t != null){
							json += "{'appName':'"+type.getTypeName()+"','appDesc':'"+type.getDescription()+"','appType':'"+type.getAppType()+ "',isAllow:"+type.isAllow()+
								",'isActive':'"+type.isActive()+	"','isLocal':'"+type.isLocal()+"','isRecover':'"+type.isRecover()+ "',infoLevel:" +type.getInfoLevel()+
                                ",isFilter:"+type.isFilter()+",isVirusScan:"+type.isVirusScan()+
								",'dataPath':'"+type.getDataPath()+"','deleteFile':'"+type.isDeleteFile()+"','dbName':'"+s.getDbName()+
								"','oldStep':'"+s.isOldStep()+"','operation':'"+s.getOperation()+"','enable':'"+s.isEnable()+
								"','tempTable':'"+s.getTempTable()+"','maxRecords':'"+s.getMaxRecords()+"','interval':'"+s.getInterval()+
								"','isTwoway':'"+s.isTwoway()+"','srcdbName':'"+t+"','plugin':'"+plugin+
								"','tables':'"+tables+"','privated':false,deleteFlag:"+getDeleteFlag(type.getTypeName())+",flag:'"+flag+"'},";
						}else if( s==null && t == null ){
							t = "";
							flag = "flag_1";
							plugin = "3";
							tables = "tables_3";
							json += "{appName:'"+type.getTypeName()+"',appDesc:'"+type.getDescription()+"',appType:'"+type.getAppType()+"',isAllow:"+type.isAllow()+
								",isActive:'"+type.isActive()+	"',isLocal:'"+type.isLocal()+"',isRecover:'"+type.isRecover()+ "',infoLevel:" +type.getInfoLevel()+
                                ",isFilter:"+type.isFilter()+",isVirusScan:"+type.isVirusScan()+
								",dataPath:'"+type.getDataPath()+"',deleteFile:'"+type.isDeleteFile()+"',dbName:'"+
								"',oldStep:'',operation:'',enable:'"+
								"',tempTable:'',maxRecords:'',interval:'"+
								"',isTwoway:'',srcdbName:'"+t+"',plugin:'"+plugin+
								"',tables:'"+tables+"',privated:false,deleteFlag:"+getDeleteFlag(type.getTypeName())+",flag:'"+flag+"'},";
						}
						
					}
				}
			}else if(appType.equals("ftpproxy")||appType.equals("proxy")||appType.equals("proxy")||appType.equals("reproxy")){
				int index = 0;
				for (int i = 0; i < total; i++) {
					if(i==start&&index<limit){
						start ++;
						index ++;
						Type type = internalTypes.get(i);
						SocketChange s = xmlOperatorDAO.getSocketChange("internal", Plugin.s_source_plugin,type.getTypeName());
						SocketChange t = xmlOperatorDAO.getSocketChange("internal", Plugin.s_target_plugin,type.getTypeName());
						String flag = "flag_0";
						String plugin = "0";
						if(s !=null && t == null){
							flag = "flag_1";
							plugin = "1";
							json += "{'appName':'"+type.getTypeName()+"','appDesc':'"+type.getDescription()+ "',isAllow:"+type.isAllow()+
								",'appType':'"+type.getAppType()+"','isActive':'"+type.isActive()+
                                "','isFilter':"+type.isFilter()+",'isVirusScan':"+type.isVirusScan()+ ",infoLevel:" +type.getInfoLevel()+
                                ",'t_name':'','t_serverAddress':'"+
								"','t_port':'','t_poolMin':'"+
								"','t_poolMax':'','t_tryTime':'"+
								"','t_charset':'','t_type':'"+
                                "','authca':'"+s.getAuthca()+"','authaddress':'"+s.getAuthaddress()+
                                "','authport':'"+s.getAuthport()+"','authcapass':'"+
                                "','clientauthenable':'"+s.isClientauthenable()+"','ipfilter':"+s.getIpfilter()+
                                ",'name':'"+s.getName()+"','serverAddress':'"+s.getServerAddress()+
								"','port':'"+s.getPort()+"','poolMin':'"+s.getPoolMin()+
								"','poolMax':'"+s.getPoolMax()+"','tryTime':'"+s.getTryTime()+
								"','charset':'"+s.getCharset()+"','ipAddress':'yes_ip"+
								"','type':'"+s.getType()+"','plugin':'"+plugin+"',deleteFlag:"+getDeleteFlag(type.getTypeName())+",flag:'"+flag+"'},";
						}else if(s ==null && t != null){
							flag = "flag_2";
							plugin = "2";
							json += "{'appName':'"+type.getTypeName()+"','appDesc':'"+type.getDescription()+"',isAllow:"+type.isAllow()+
								",'appType':'"+type.getAppType()+"','isActive':'"+type.isActive()+
                                "','isFilter':"+type.isFilter()+",'isVirusScan':"+type.isVirusScan()+ ",infoLevel:" +type.getInfoLevel()+
                                ",'t_name':'"+t.getName()+"','t_serverAddress':'"+t.getServerAddress()+
								"','t_port':'"+t.getPort()+"','t_poolMin':'"+t.getPoolMin()+
								"','t_poolMax':'"+t.getPoolMax()+"','t_tryTime':'"+t.getTryTime()+
								"','t_charset':'"+t.getCharset()+"','t_type':'"+t.getType()+
                                "','authca':'','authaddress':'"+
                                "','authport':'','authcapass':'"+
                                "','clientauthenable':'','ipfilter':"+t.getIpfilter()+
                                ",'name':'','serverAddress':'"+
								"','port':'','poolMin':'"+
								"','poolMax':'','tryTime':'"+
								"','charset':'','ipAddress':'"+
								"','type':'','plugin':'"+plugin+"',deleteFlag:"+getDeleteFlag(type.getTypeName())+",flag:'"+flag+"'},";
						}else if(s !=null && t != null){
							json += "{'appName':'"+type.getTypeName()+"','appDesc':'"+type.getDescription()+"',isAllow:"+type.isAllow()+
								",'appType':'"+type.getAppType()+"','isActive':'"+type.isActive()+
                                "','isFilter':"+type.isFilter()+",'isVirusScan':"+type.isVirusScan()+ ",infoLevel:" +type.getInfoLevel()+
                                ",'t_name':'"+t.getName()+"','t_serverAddress':'"+t.getServerAddress()+
								"','t_port':'"+t.getPort()+"','t_poolMin':'"+t.getPoolMin()+
								"','t_poolMax':'"+t.getPoolMax()+"','t_tryTime':'"+t.getTryTime()+
								"','t_charset':'"+t.getCharset()+"','t_type':'"+t.getType()+
                                "','authca':'"+s.getAuthca()+"','authaddress':'"+s.getAuthaddress()+
                                "','authport':'"+s.getAuthport()+"','authcapass':'"+
                                "','clientauthenable':'"+s.isClientauthenable()+"','ipfilter':"+s.getIpfilter()+
                                ",'name':'"+s.getName()+"','serverAddress':'"+s.getServerAddress()+
								"','port':'"+s.getPort()+"','poolMin':'"+s.getPoolMin()+
								"','poolMax':'"+s.getPoolMax()+"','tryTime':'"+s.getTryTime()+
								"','charset':'"+s.getCharset()+"','ipAddress':'"+s.getIpaddress()+
								"','type':'"+s.getType()+"','plugin':'"+plugin+"',deleteFlag:"+getDeleteFlag(type.getTypeName())+",flag:'"+flag+"'},";
						}						
					}
				}
			}else if(appType.equals("file")){
				int index = 0;
				for (int i = 0; i < total; i++) {
					if(i==start&&index<limit){
						start ++;
						index ++;
						Type type = internalTypes.get(i);
						SourceFile sourceFile = xmlOperatorDAO.getSourceFiles("internal",type.getTypeName());
						TargetFile targetFile = xmlOperatorDAO.getTargetFiles("internal",type.getTypeName());
						String flag = "flag_0";
						if(sourceFile !=null && targetFile == null){
							flag = "flag_1";
							json += "{'appName':'"+type.getTypeName()+"','appDesc':'"+type.getDescription()+"',isAllow:"+type.isAllow()+
								",'appType':'"+type.getAppType()+"','isActive':"+type.isActive()+
								",'isFilter':"+type.isFilter()+",'isVirusScan':"+type.isVirusScan()+",infoLevel:" +type.getInfoLevel()+
								",'t_dir':'','t_serverAddress':'"+
								"','t_port':'','t_userName':'"+
								"','t_charset':'','t_deleteFile':'"+
								"','t_onlyAdd':'','t_password':'"+
								"','t_isTwoWay':'','t_packetSize':'"+
								"','t_fileListSize':'','t_threads':'"+
								"','dir':'"+sourceFile.getDir()+"','serverAddress':'"+sourceFile.getServerAddress()+
								"','port':'"+sourceFile.getPort()+"','filterTypes':'"+sourceFile.getFiltertypes()+
								"','notFilterTypes':'"+sourceFile.getNotfiltertypes()+"','interval':'"+sourceFile.getInterval()+
								"','charset':'"+sourceFile.getCharset()+"','protocol':'"+sourceFile.getProtocol()+
								"','userName':'"+sourceFile.getUserName()+
								"','deleteFile':'"+sourceFile.isDeletefile()+"','isIncludeSubDir':'"+sourceFile.isIsincludesubdir()+
								"','fileListSize':'"+sourceFile.getFilelistsize()+"','packetSize':'"+sourceFile.getPacketsize()+
								"','threads':'"+sourceFile.getThreads()+"','t_protocol':'"+
								"','isTwoWay':'"+sourceFile.isIstwoway()+"','plugin':'1',deleteFlag:"+getDeleteFlag(type.getTypeName())+",flag:'"+flag+"'},";
						}else if(sourceFile ==null && targetFile != null){
							flag = "flag_2";
							json += "{'appName':'"+type.getTypeName()+"','appDesc':'"+type.getDescription()+"',isAllow:"+type.isAllow()+
								",'appType':'"+type.getAppType()+"','isActive':"+type.isActive()+
								",'isFilter':"+type.isFilter()+",'isVirusScan':"+type.isVirusScan()+ ",infoLevel:" +type.getInfoLevel()+
								",'t_dir':'"+targetFile.getDir()+"','t_serverAddress':'"+targetFile.getServerAddress()+
								"','t_port':'"+targetFile.getPort()+"','t_userName':'"+targetFile.getUserName()+
								"','t_charset':'"+targetFile.getCharset()+"','t_deleteFile':'"+targetFile.isDeletefile()+
								"','t_onlyAdd':'"+targetFile.isOnlyadd()+
								"','t_isTwoWay':'"+targetFile.isIstwoway()+"','t_packetSize':'"+targetFile.getPacketsize()+
								"','t_fileListSize':'"+targetFile.getFilelistsize()+"','t_threads':'"+targetFile.getThreads()+
								"','dir':'','serverAddress':'"+
								"','port':'','filterTypes':'"+
								"','notFilterTypes':'','interval':'"+
								"','charset':'','protocol':'"+
								"','userName':'','password':'"+
								"','deleteFile':'','isIncludeSubDir':'"+
								"','fileListSize':'','packetSize':'"+
								"','threads':'','t_protocol':'"+targetFile.getProtocol()+
								"','isTwoWay':'','plugin':'2',deleteFlag:"+getDeleteFlag(type.getTypeName())+",flag:'"+flag+"'},";
						}else if(sourceFile !=null && targetFile != null){
							json += "{'appName':'"+type.getTypeName()+"','appDesc':'"+type.getDescription()+"',isAllow:"+type.isAllow()+
								",'appType':'"+type.getAppType()+"','isActive':"+type.isActive()+
								",'isFilter':"+type.isFilter()+",'isVirusScan':"+type.isVirusScan()+",infoLevel:" +type.getInfoLevel()+
								",'t_dir':'"+targetFile.getDir()+"','t_serverAddress':'"+targetFile.getServerAddress()+
								"','t_port':'"+targetFile.getPort()+"','t_userName':'"+targetFile.getUserName()+
								"','t_charset':'"+targetFile.getCharset()+"','t_deleteFile':'"+targetFile.isDeletefile()+
								"','t_onlyAdd':'"+targetFile.isOnlyadd()+
								"','t_isTwoWay':'"+targetFile.isIstwoway()+"','t_packetSize':'"+targetFile.getPacketsize()+
								"','t_fileListSize':'"+targetFile.getFilelistsize()+"','t_threads':'"+targetFile.getThreads()+
								"','dir':'"+sourceFile.getDir()+"','serverAddress':'"+sourceFile.getServerAddress()+
								"','port':'"+sourceFile.getPort()+"','filterTypes':'"+sourceFile.getFiltertypes()+
								"','notFilterTypes':'"+sourceFile.getNotfiltertypes()+"','interval':'"+sourceFile.getInterval()+
								"','charset':'"+sourceFile.getCharset()+
								"','userName':'"+sourceFile.getUserName()+"','password':'"+sourceFile.getPassword()+
								"','deleteFile':'"+sourceFile.isDeletefile()+"','isIncludeSubDir':'"+sourceFile.isIsincludesubdir()+
								"','fileListSize':'"+sourceFile.getFilelistsize()+"','packetSize':'"+sourceFile.getPacketsize()+
								"','threads':'"+sourceFile.getThreads()+"','t_protocol':'"+targetFile.getProtocol()+
								"','isTwoWay':'"+sourceFile.isIstwoway()+"','plugin':'0',deleteFlag:"+getDeleteFlag(type.getTypeName())+",flag:'"+flag+"'},";
						}						
					}
				}
			}
			json += "]}";
		}
		return json;
	}

    public String readInternalType(Integer start, Integer limit,String appType,boolean isAllow) throws Ex {
//		Map<Integer,List<String>> internalTypes = xmlOperatorDAO.getInternalTypes(appType);
		List<Type> internalTypes = xmlOperatorDAO.getTypes("internal",appType,isAllow);
		int total = internalTypes.size();
		String json = "{'success':true,'total':"+total+",rows:[";
		if(total == 0){
			json += ",]}";
		}else {
			if("db".equals(appType)){
				int index = 0;
				for (int i = 0; i < total; i++) {
					if(i==start&&index<limit){
						start ++;
						index ++;
						Type type = internalTypes.get(i);
						DataBase s = xmlOperatorDAO.getDataBase("internal", type.getTypeName());
						String t = xmlOperatorDAO.getSrcdbName("internal",type.getTypeName());
						String flag = "flag_0";
						String plugin = "0";
						String tables = "tables_0";
						if(s!=null && t == null){
							flag = "flag_1";
							plugin = "1";
							t = "";
							tables = "tables_1";
							json += "{appName:'"+type.getTypeName()+"',appDesc:'"+type.getDescription()+"',appType:'"+type.getAppType()+"',isAllow:"+type.isAllow()+
								",isActive:'"+type.isActive()+	"',isLocal:'"+type.isLocal()+"',isRecover:'"+type.isRecover()+ "',infoLevel:" +type.getInfoLevel()+
                                ",isFilter:"+type.isFilter()+",isVirusScan:"+type.isVirusScan()+
								",dataPath:'"+type.getDataPath()+"',deleteFile:'"+type.isDeleteFile()+"',dbName:'"+s.getDbName()+
								"',oldStep:'"+s.isOldStep()+"',operation:'"+s.getOperation()+"',enable:'"+s.isEnable()+
								"',tempTable:'"+s.getTempTable()+"',maxRecords:'"+s.getMaxRecords()+"',interval:'"+s.getInterval()+
								"',isTwoway:'"+s.isTwoway()+"',srcdbName:'"+t+"',plugin:'"+plugin+
								"',tables:'"+tables+"',privated:false,deleteFlag:"+getDeleteFlag(type.getTypeName())+",flag:'"+flag+"'},";
						}else if(s==null && t != null){
							flag = "flag_2";
							plugin = "2";
							tables = "tables_2";
							json += "{'appName':'"+type.getTypeName()+"','appDesc':'"+type.getDescription()+"','appType':'"+type.getAppType()+ "',isAllow:"+type.isAllow()+
								",'isActive':'"+type.isActive()+	"','isLocal':'"+type.isLocal()+"','isRecover':'"+type.isRecover()+ "',infoLevel:" +type.getInfoLevel()+
                                ",isFilter:"+type.isFilter()+",isVirusScan:"+type.isVirusScan()+
								",'dataPath':'"+type.getDataPath()+"','deleteFile':'"+type.isDeleteFile()+"','dbName':'"+
								"','oldStep':'','operation':'','enable':'"+
								"','tempTable':'','maxRecords':'','interval':'"+
								"','isTwoway':'','srcdbName':'"+t+"','plugin':'"+plugin+
								"','tables':'"+tables+"','privated':false,deleteFlag:"+getDeleteFlag(type.getTypeName())+",flag:'"+flag+"'},";
						}else if(s!=null && t != null){
							json += "{'appName':'"+type.getTypeName()+"','appDesc':'"+type.getDescription()+"','appType':'"+type.getAppType()+ "',isAllow:"+type.isAllow()+
								",'isActive':'"+type.isActive()+	"','isLocal':'"+type.isLocal()+"','isRecover':'"+type.isRecover()+ "',infoLevel:" +type.getInfoLevel()+
                                ",isFilter:"+type.isFilter()+",isVirusScan:"+type.isVirusScan()+
								",'dataPath':'"+type.getDataPath()+"','deleteFile':'"+type.isDeleteFile()+"','dbName':'"+s.getDbName()+
								"','oldStep':'"+s.isOldStep()+"','operation':'"+s.getOperation()+"','enable':'"+s.isEnable()+
								"','tempTable':'"+s.getTempTable()+"','maxRecords':'"+s.getMaxRecords()+"','interval':'"+s.getInterval()+
								"','isTwoway':'"+s.isTwoway()+"','srcdbName':'"+t+"','plugin':'"+plugin+
								"','tables':'"+tables+"','privated':false,deleteFlag:"+getDeleteFlag(type.getTypeName())+",flag:'"+flag+"'},";
						}else if( s==null && t == null ){
							t = "";
							flag = "flag_1";
							plugin = "3";
							tables = "tables_3";
							json += "{appName:'"+type.getTypeName()+"',appDesc:'"+type.getDescription()+"',appType:'"+type.getAppType()+"',isAllow:"+type.isAllow()+
								",isActive:'"+type.isActive()+	"',isLocal:'"+type.isLocal()+"',isRecover:'"+type.isRecover()+ "',infoLevel:" +type.getInfoLevel()+
                                ",isFilter:"+type.isFilter()+",isVirusScan:"+type.isVirusScan()+
								",dataPath:'"+type.getDataPath()+"',deleteFile:'"+type.isDeleteFile()+"',dbName:'"+
								"',oldStep:'',operation:'',enable:'"+
								"',tempTable:'',maxRecords:'',interval:'"+
								"',isTwoway:'',srcdbName:'"+t+"',plugin:'"+plugin+
								"',tables:'"+tables+"',privated:false,deleteFlag:"+getDeleteFlag(type.getTypeName())+",flag:'"+flag+"'},";
						}

					}
				}
			}else if(appType.equals("ftpproxy")||appType.equals("proxy")||appType.equals("proxy")||appType.equals("reproxy")){
				int index = 0;
				for (int i = 0; i < total; i++) {
					if(i==start&&index<limit){
						start ++;
						index ++;
						Type type = internalTypes.get(i);
						SocketChange s = xmlOperatorDAO.getSocketChange("internal", Plugin.s_source_plugin,type.getTypeName());
						SocketChange t = xmlOperatorDAO.getSocketChange("internal", Plugin.s_target_plugin,type.getTypeName());
						String flag = "flag_0";
						String plugin = "0";
						if(s !=null && t == null){
							flag = "flag_1";
							plugin = "1";
							json += "{'appName':'"+type.getTypeName()+"','appDesc':'"+type.getDescription()+ "',isAllow:"+type.isAllow()+
								",'appType':'"+type.getAppType()+"','isActive':'"+type.isActive()+
                                "','isFilter':"+type.isFilter()+",'isVirusScan':"+type.isVirusScan()+ ",infoLevel:" +type.getInfoLevel()+
                                ",'t_name':'','t_serverAddress':'"+
								"','t_port':'','t_poolMin':'"+
								"','t_poolMax':'','t_tryTime':'"+
								"','t_charset':'','t_type':'"+
                                "','authca':'"+s.getAuthca()+"','authaddress':'"+s.getAuthaddress()+
                                "','authport':'"+s.getAuthport()+"','authcapass':'"+
                                "','clientauthenable':'"+s.isClientauthenable()+"','ipfilter':"+s.getIpfilter()+
                                ",'name':'"+s.getName()+"','serverAddress':'"+s.getServerAddress()+
								"','port':'"+s.getPort()+"','poolMin':'"+s.getPoolMin()+
								"','poolMax':'"+s.getPoolMax()+"','tryTime':'"+s.getTryTime()+
								"','charset':'"+s.getCharset()+"','ipAddress':'yes_ip"+
								"','type':'"+s.getType()+"','plugin':'"+plugin+"',deleteFlag:"+getDeleteFlag(type.getTypeName())+",flag:'"+flag+"'},";
						}else if(s ==null && t != null){
							flag = "flag_2";
							plugin = "2";
							json += "{'appName':'"+type.getTypeName()+"','appDesc':'"+type.getDescription()+"',isAllow:"+type.isAllow()+
								",'appType':'"+type.getAppType()+"','isActive':'"+type.isActive()+
                                "','isFilter':"+type.isFilter()+",'isVirusScan':"+type.isVirusScan()+ ",infoLevel:" +type.getInfoLevel()+
                                ",'t_name':'"+t.getName()+"','t_serverAddress':'"+t.getServerAddress()+
								"','t_port':'"+t.getPort()+"','t_poolMin':'"+t.getPoolMin()+
								"','t_poolMax':'"+t.getPoolMax()+"','t_tryTime':'"+t.getTryTime()+
								"','t_charset':'"+t.getCharset()+"','t_type':'"+t.getType()+
                                "','authca':'','authaddress':'"+
                                "','authport':'','authcapass':'"+
                                "','clientauthenable':'','ipfilter':"+t.getIpfilter()+
                                ",'name':'','serverAddress':'"+
								"','port':'','poolMin':'"+
								"','poolMax':'','tryTime':'"+
								"','charset':'','ipAddress':'"+
								"','type':'','plugin':'"+plugin+"',deleteFlag:"+getDeleteFlag(type.getTypeName())+",flag:'"+flag+"'},";
						}else if(s !=null && t != null){
							json += "{'appName':'"+type.getTypeName()+"','appDesc':'"+type.getDescription()+"',isAllow:"+type.isAllow()+
								",'appType':'"+type.getAppType()+"','isActive':'"+type.isActive()+
                                "','isFilter':"+type.isFilter()+",'isVirusScan':"+type.isVirusScan()+ ",infoLevel:" +type.getInfoLevel()+
                                ",'t_name':'"+t.getName()+"','t_serverAddress':'"+t.getServerAddress()+
								"','t_port':'"+t.getPort()+"','t_poolMin':'"+t.getPoolMin()+
								"','t_poolMax':'"+t.getPoolMax()+"','t_tryTime':'"+t.getTryTime()+
								"','t_charset':'"+t.getCharset()+"','t_type':'"+t.getType()+
                                "','authca':'"+s.getAuthca()+"','authaddress':'"+s.getAuthaddress()+
                                "','authport':'"+s.getAuthport()+"','authcapass':'"+
                                "','clientauthenable':'"+s.isClientauthenable()+"','ipfilter':"+s.getIpfilter()+
                                ",'name':'"+s.getName()+"','serverAddress':'"+s.getServerAddress()+
								"','port':'"+s.getPort()+"','poolMin':'"+s.getPoolMin()+
								"','poolMax':'"+s.getPoolMax()+"','tryTime':'"+s.getTryTime()+
								"','charset':'"+s.getCharset()+"','ipAddress':'"+s.getIpaddress()+
								"','type':'"+s.getType()+"','plugin':'"+plugin+"',deleteFlag:"+getDeleteFlag(type.getTypeName())+",flag:'"+flag+"'},";
						}
					}
				}
			}else if(appType.equals("file")){
				int index = 0;
				for (int i = 0; i < total; i++) {
					if(i==start&&index<limit){
						start ++;
						index ++;
						Type type = internalTypes.get(i);
						SourceFile sourceFile = xmlOperatorDAO.getSourceFiles("internal",type.getTypeName());
						TargetFile targetFile = xmlOperatorDAO.getTargetFiles("internal",type.getTypeName());
						String flag = "flag_0";
						if(sourceFile !=null && targetFile == null){
							flag = "flag_1";
							json += "{'appName':'"+type.getTypeName()+"','appDesc':'"+type.getDescription()+"',isAllow:"+type.isAllow()+
								",'appType':'"+type.getAppType()+"','isActive':"+type.isActive()+
								",'isFilter':"+type.isFilter()+",'isVirusScan':"+type.isVirusScan()+",infoLevel:" +type.getInfoLevel()+
								",'t_dir':'','t_serverAddress':'"+
								"','t_port':'','t_userName':'"+
								"','t_charset':'','t_deleteFile':'"+
								"','t_onlyAdd':'','t_password':'"+
								"','t_isTwoWay':'','t_packetSize':'"+
								"','t_fileListSize':'','t_threads':'"+
								"','dir':'"+sourceFile.getDir()+"','serverAddress':'"+sourceFile.getServerAddress()+
								"','port':'"+sourceFile.getPort()+"','filterTypes':'"+sourceFile.getFiltertypes()+
								"','notFilterTypes':'"+sourceFile.getNotfiltertypes()+"','interval':'"+sourceFile.getInterval()+
								"','charset':'"+sourceFile.getCharset()+"','protocol':'"+sourceFile.getProtocol()+
								"','userName':'"+sourceFile.getUserName()+
								"','deleteFile':'"+sourceFile.isDeletefile()+"','isIncludeSubDir':'"+sourceFile.isIsincludesubdir()+
								"','fileListSize':'"+sourceFile.getFilelistsize()+"','packetSize':'"+sourceFile.getPacketsize()+
								"','threads':'"+sourceFile.getThreads()+"','t_protocol':'"+
								"','isTwoWay':'"+sourceFile.isIstwoway()+"','plugin':'1',deleteFlag:"+getDeleteFlag(type.getTypeName())+",flag:'"+flag+"'},";
						}else if(sourceFile ==null && targetFile != null){
							flag = "flag_2";
							json += "{'appName':'"+type.getTypeName()+"','appDesc':'"+type.getDescription()+"',isAllow:"+type.isAllow()+
								",'appType':'"+type.getAppType()+"','isActive':"+type.isActive()+
								",'isFilter':"+type.isFilter()+",'isVirusScan':"+type.isVirusScan()+ ",infoLevel:" +type.getInfoLevel()+
								",'t_dir':'"+targetFile.getDir()+"','t_serverAddress':'"+targetFile.getServerAddress()+
								"','t_port':'"+targetFile.getPort()+"','t_userName':'"+targetFile.getUserName()+
								"','t_charset':'"+targetFile.getCharset()+"','t_deleteFile':'"+targetFile.isDeletefile()+
								"','t_onlyAdd':'"+targetFile.isOnlyadd()+
								"','t_isTwoWay':'"+targetFile.isIstwoway()+"','t_packetSize':'"+targetFile.getPacketsize()+
								"','t_fileListSize':'"+targetFile.getFilelistsize()+"','t_threads':'"+targetFile.getThreads()+
								"','dir':'','serverAddress':'"+
								"','port':'','filterTypes':'"+
								"','notFilterTypes':'','interval':'"+
								"','charset':'','protocol':'"+
								"','userName':'','password':'"+
								"','deleteFile':'','isIncludeSubDir':'"+
								"','fileListSize':'','packetSize':'"+
								"','threads':'','t_protocol':'"+targetFile.getProtocol()+
								"','isTwoWay':'','plugin':'2',deleteFlag:"+getDeleteFlag(type.getTypeName())+",flag:'"+flag+"'},";
						}else if(sourceFile !=null && targetFile != null){
							json += "{'appName':'"+type.getTypeName()+"','appDesc':'"+type.getDescription()+"',isAllow:"+type.isAllow()+
								",'appType':'"+type.getAppType()+"','isActive':"+type.isActive()+
								",'isFilter':"+type.isFilter()+",'isVirusScan':"+type.isVirusScan()+",infoLevel:" +type.getInfoLevel()+
								",'t_dir':'"+targetFile.getDir()+"','t_serverAddress':'"+targetFile.getServerAddress()+
								"','t_port':'"+targetFile.getPort()+"','t_userName':'"+targetFile.getUserName()+
								"','t_charset':'"+targetFile.getCharset()+"','t_deleteFile':'"+targetFile.isDeletefile()+
								"','t_onlyAdd':'"+targetFile.isOnlyadd()+
								"','t_isTwoWay':'"+targetFile.isIstwoway()+"','t_packetSize':'"+targetFile.getPacketsize()+
								"','t_fileListSize':'"+targetFile.getFilelistsize()+"','t_threads':'"+targetFile.getThreads()+
								"','dir':'"+sourceFile.getDir()+"','serverAddress':'"+sourceFile.getServerAddress()+
								"','port':'"+sourceFile.getPort()+"','filterTypes':'"+sourceFile.getFiltertypes()+
								"','notFilterTypes':'"+sourceFile.getNotfiltertypes()+"','interval':'"+sourceFile.getInterval()+
								"','charset':'"+sourceFile.getCharset()+"','protocol':'"+sourceFile.getProtocol()+
								"','userName':'"+sourceFile.getUserName()+
								"','deleteFile':'"+sourceFile.isDeletefile()+"','isIncludeSubDir':'"+sourceFile.isIsincludesubdir()+
								"','fileListSize':'"+sourceFile.getFilelistsize()+"','packetSize':'"+sourceFile.getPacketsize()+
								"','threads':'"+sourceFile.getThreads()+"','t_protocol':'"+targetFile.getProtocol()+
								"','isTwoWay':'"+sourceFile.isIstwoway()+"','plugin':'0',deleteFlag:"+getDeleteFlag(type.getTypeName())+",flag:'"+flag+"'},";
						}
					}
				}
			}
			json += "]}";
		}
		return json;
	}

    /**
     * 目标端判断是否为删除等待状态
     * @param appName
     * @return
     */
    private boolean getDeleteFlag(String appName) {
        DeleteStatus deleteStatus = null;
        try {
            deleteStatus = deleteStatusDao.findByAppName(appName);
        } catch (Exception e) {

        }
        if(deleteStatus!=null){
            return false;
        }
        return true;
    }

    public boolean isSource(String plugin) {
		if("1".equals(plugin)){
			return true;
		}else if("2".equals(plugin)){
			return false;
		}
		return true;
	}

	/**
	 * 读取外网external：config.xml的type，以json返回
	 */
	public String readExternalType(Integer start, Integer limit,String appType) throws Ex {
		List<Type> externalTypes = xmlOperatorDAO.getTypes("external",appType);
		int total = externalTypes.size();
		String json = "{'success':true,'total':"+total+",rows:[";
		if(total == 0){
			json += ",]}";
		}else {
			if("db".equals(appType)){
				int index = 0;
				for (int i = 0; i < total; i++) {
					if(i==start&&index<limit){
						start ++;
						index ++;
						Type type = externalTypes.get(i);
						DataBase s = xmlOperatorDAO.getDataBase("external", type.getTypeName());		
						String t = xmlOperatorDAO.getSrcdbName("external",type.getTypeName());
						String flag = "flag_0";
						String plugin = "0";
						String tables = "tables_0";
						if(s!=null && t == null){
							flag = "flag_1";
							plugin = "1";
							t = "";
							tables = "tables_1";
							json += "{'appName':'"+type.getTypeName()+"','appDesc':'"+type.getDescription()+
                                    "','appType':'"+type.getAppType()+"',isAllow:"+type.isAllow()+",speed:"+type.getSpeed()+
                                ",channel:'"+type.getChannel()+"',channelport:'"+type.getChannelPort()+"',status:'"+type.getStatus()+
								"','isActive':'"+type.isActive()+	"','isLocal':'"+type.isLocal()+"','isRecover':'"+type.isRecover()+ "',infoLevel:" +type.getInfoLevel()+
                                ",isFilter:"+type.isFilter()+",isVirusScan:"+type.isVirusScan()+
								",'dataPath':'"+type.getDataPath()+"','deleteFile':'"+type.isDeleteFile()+
                                "','dbName':'"+s.getDbName()+"',operateDB:"+StringUtils.isNotBlank(s.getStatus())+
								",'oldStep':'"+s.isOldStep()+"','operation':'"+s.getOperation()+"','enable':'"+s.isEnable()+
								"','tempTable':'"+s.getTempTable()+"','maxRecords':'"+s.getMaxRecords()+"','interval':'"+s.getInterval()+
								"','isTwoway':'"+s.isTwoway()+"','srcdbName':'"+t+"','plugin':'"+plugin+
								"','tables':'"+tables+"','privated':false,deleteFlag:"+getSourceDeleteFlag(type.getTypeName())+",flag:'"+flag+"'},";
						}else if(s==null && t != null){
							flag = "flag_2";
							plugin = "2";
							tables = "tables_2";
							json += "{'appName':'"+type.getTypeName()+"','appDesc':'"+type.getDescription()+"','appType':'"+type.getAppType()+"',isAllow:"+type.isAllow()+",speed:"+type.getSpeed()+
                                ",channel:'"+type.getChannel()+"',channelport:'"+type.getChannelPort()+"',status:'"+type.getStatus()+
								"','isActive':'"+type.isActive()+	"','isLocal':'"+type.isLocal()+"','isRecover':'"+type.isRecover()+ "',infoLevel:" +type.getInfoLevel()+
                                ",isFilter:"+type.isFilter()+",isVirusScan:"+type.isVirusScan()+
								",'dataPath':'"+type.getDataPath()+"','deleteFile':'"+type.isDeleteFile()+
                                "','dbName':'"+"',operateDB:"+StringUtils.isNotBlank(s.getStatus())+
								",'oldStep':'','operation':'','enable':'"+
								"','tempTable':'','maxRecords':'','interval':'"+
								"','isTwoway':'','srcdbName':'"+t+"','plugin':'"+plugin+
								"','tables':'"+tables+"','privated':false,deleteFlag:"+getSourceDeleteFlag(type.getTypeName())+",flag:'"+flag+"'},";
						}else if(s!=null && t != null){
							json += "{'appName':'"+type.getTypeName()+"','appDesc':'"+type.getDescription()+"','appType':'"+type.getAppType()+"',isAllow:"+type.isAllow()+ ",speed:"+type.getSpeed()+
                                ",channel:'"+type.getChannel()+"',channelport:'"+type.getChannelPort()+"',status:'"+type.getStatus()+
								"','isActive':'"+type.isActive()+	"','isLocal':'"+type.isLocal()+"','isRecover':'"+type.isRecover()+ "',infoLevel:" +type.getInfoLevel()+
                                ",isFilter:"+type.isFilter()+",isVirusScan:"+type.isVirusScan()+
								",'dataPath':'"+type.getDataPath()+"','deleteFile':'"+type.isDeleteFile()+
                                "','dbName':'"+s.getDbName()+"',operateDB:"+StringUtils.isNotBlank(s.getStatus())+
								",'oldStep':'"+s.isOldStep()+"','operation':'"+s.getOperation()+"','enable':'"+s.isEnable()+
								"','tempTable':'"+s.getTempTable()+"','maxRecords':'"+s.getMaxRecords()+"','interval':'"+s.getInterval()+
								"','isTwoway':'"+s.isTwoway()+"','srcdbName':'"+t+"','plugin':'"+plugin+
								"','tables':'"+tables+"','privated':false,deleteFlag:"+getSourceDeleteFlag(type.getTypeName())+",flag:'"+flag+"'},";
						}else if( s==null && t == null ){
							t = "";
							flag = "flag_1";
							plugin = "3";
							tables = "tables_3";
							json += "{'appName':'"+type.getTypeName()+"','appDesc':'"+type.getDescription()+"','appType':'"+type.getAppType()+ "',isAllow:"+type.isAllow()+ ",speed:"+type.getSpeed()+
                                ",channel:'"+type.getChannel()+"',channelport:'"+type.getChannelPort()+ "',status:'"+type.getStatus()+
								"','isActive':'"+type.isActive()+	"','isLocal':'"+type.isLocal()+"','isRecover':'"+type.isRecover()+ "',infoLevel:" +type.getInfoLevel()+
                                ",isFilter:"+type.isFilter()+",isVirusScan:"+type.isVirusScan()+
								",'dataPath':'"+type.getDataPath()+"','deleteFile':'"+type.isDeleteFile()+"','dbName':'"+"',operateDB:false"+
								",'oldStep':'','operation':'','enable':'"+
								"','tempTable':'','maxRecords':'','interval':'"+
								"','isTwoway':'','srcdbName':'"+t+"','plugin':'"+plugin+
								"','tables':'"+tables+"','privated':false,deleteFlag:"+getSourceDeleteFlag(type.getTypeName())+",flag:'"+flag+"'},";
						}
					}
				}
			}else if(appType.equals("ftpproxy")||appType.equals("proxy")||appType.equals("proxy")||appType.equals("reproxy")){
				int index = 0;
				for (int i = 0; i < total; i++) {
					if(i==start&&index<limit){
						start ++;
						index ++;
						Type type = externalTypes.get(i);
						SocketChange s = xmlOperatorDAO.getSocketChange("external", Plugin.s_source_plugin,type.getTypeName());
						SocketChange t = xmlOperatorDAO.getSocketChange("external", Plugin.s_target_plugin,type.getTypeName());
						String flag = "flag_0";
						String plugin = "0";
						if(s !=null && t == null){
							flag = "flag_1";
							plugin = "1";
							json += "{'appName':'"+type.getTypeName()+"','appDesc':'"+type.getDescription()+"',isAllow:"+type.isAllow()+
                                ",channel:'"+type.getChannel()+"',channelport:'"+type.getChannelPort()+ "',status:'"+type.getStatus()+
								"','appType':'"+type.getAppType()+"','isActive':'"+type.isActive()+
                                "','isFilter':"+type.isFilter()+",'isVirusScan':"+type.isVirusScan()+ ",infoLevel:" +type.getInfoLevel()+
                                ",'t_name':'','t_serverAddress':'"+
								"','t_port':'','t_poolMin':'"+
								"','t_poolMax':'','t_tryTime':'"+
								"','t_charset':'','t_type':'"+
								"','authca':'"+s.getAuthca()+"','authaddress':'"+s.getAuthaddress()+
								"','authport':'"+s.getAuthport()+"','authcapass':'"+
                                "','clientauthenable':'"+s.isClientauthenable()+"','ipfilter':"+s.getIpfilter()+
								",'name':'"+s.getName()+"','serverAddress':'"+s.getServerAddress()+
								"','port':'"+s.getPort()+"','poolMin':'"+s.getPoolMin()+
								"','poolMax':'"+s.getPoolMax()+"','tryTime':'"+s.getTryTime()+
								"','charset':'"+s.getCharset()+"','ipAddress':'yes_ip"+
								"','type':'"+s.getType()+"','plugin':'"+plugin+
                                "',safeType:'"+
                                "',deleteFlag:"+getSourceDeleteFlag(type.getTypeName())+
                                 ",flag:'"+flag+"'},";
						}else if(s ==null && t != null){
							flag = "flag_2";
							plugin = "2";
							json += "{'appName':'"+type.getTypeName()+"','appDesc':'"+type.getDescription()+"',isAllow:"+type.isAllow()+
                                ",channel:'"+type.getChannel()+"',channelport:'"+type.getChannelPort()+ "',status:'"+type.getStatus()+
								"','appType':'"+type.getAppType()+"','isActive':'"+type.isActive()+
                                "','isFilter':"+type.isFilter()+",'isVirusScan':"+type.isVirusScan()+ ",infoLevel:" +type.getInfoLevel()+
                                ",'t_name':'"+t.getName()+"','t_serverAddress':'"+t.getServerAddress()+
								"','t_port':'"+t.getPort()+"','t_poolMin':'"+t.getPoolMin()+
								"','t_poolMax':'"+t.getPoolMax()+"','t_tryTime':'"+t.getTryTime()+
								"','t_charset':'"+t.getCharset()+"','t_type':'"+t.getType()+
                                "','authca':'','authaddress':'"+
                                "','authport':'','authcapass':'"+
								"','clientauthenable':'','ipfilter':"+t.getIpfilter()+
								",'name':'','serverAddress':'"+
								"','port':'','poolMin':'"+
								"','poolMax':'','tryTime':'"+
								"','charset':'','ipAddress':'"+
								"','type':'','plugin':'"+plugin+"',deleteFlag:"+getSourceDeleteFlag(type.getTypeName())+",flag:'"+flag+"'},";
						}else if(s !=null && t != null){
							json += "{'appName':'"+type.getTypeName()+"','appDesc':'"+type.getDescription()+"',isAllow:"+type.isAllow()+
                                ",channel:'"+type.getChannel()+"',channelport:'"+type.getChannelPort()+ "',status:'"+type.getStatus()+
								"','appType':'"+type.getAppType()+"','isActive':'"+type.isActive()+
                                "','isFilter':"+type.isFilter()+",'isVirusScan':"+type.isVirusScan()+ ",infoLevel:" +type.getInfoLevel()+
                                ",'t_name':'"+t.getName()+"','t_serverAddress':'"+t.getServerAddress()+
								"','t_port':'"+t.getPort()+"','t_poolMin':'"+t.getPoolMin()+
								"','t_poolMax':'"+t.getPoolMax()+"','t_tryTime':'"+t.getTryTime()+
								"','t_charset':'"+t.getCharset()+"','t_type':'"+t.getType()+
                                "','authca':'"+s.getAuthca()+"','authaddress':'"+s.getAuthaddress()+
                                "','authport':'"+s.getAuthport()+"','authcapass':'"+
                                "','clientauthenable':'"+s.isClientauthenable()+"','ipfilter':"+s.getIpfilter()+
								",'name':'"+s.getName()+"','serverAddress':'"+s.getServerAddress()+
								"','port':'"+s.getPort()+"','poolMin':'"+s.getPoolMin()+
								"','poolMax':'"+s.getPoolMax()+"','tryTime':'"+s.getTryTime()+
								"','charset':'"+s.getCharset()+"','ipAddress':'"+s.getIpaddress()+
								"','type':'"+s.getType()+"','plugin':'"+plugin+"',deleteFlag:"+getSourceDeleteFlag(type.getTypeName())+",flag:'"+flag+"'},";
						}						
					}
				}
			}else if(appType.equals("file")){
				int index = 0;
				for (int i = 0; i < total; i++) {
					if(i==start&&index<limit){
						start ++;
						index ++;
						Type type = externalTypes.get(i);
						SourceFile sourceFile = xmlOperatorDAO.getSourceFiles("external",type.getTypeName());
						TargetFile targetFile = xmlOperatorDAO.getTargetFiles("external",type.getTypeName());
						String flag = "flag_0";
						if(sourceFile !=null && targetFile == null){
							flag = "flag_1";
							json += "{'appName':'"+type.getTypeName()+"','appDesc':'"+type.getDescription()+"',isAllow:"+type.isAllow()+",speed:"+type.getSpeed()+
                                ",channel:'"+type.getChannel()+"',channelport:'"+type.getChannelPort()+ "',status:'"+type.getStatus()+
								"','appType':'"+type.getAppType()+"','isActive':"+type.isActive()+
								",'isFilter':"+type.isFilter()+",'isVirusScan':"+type.isVirusScan()+ ",infoLevel:" +type.getInfoLevel()+
								",'t_dir':'','t_serverAddress':'"+
								"','t_port':'','t_userName':'"+
								"','t_charset':'','t_deleteFile':'"+
								"','t_onlyAdd':'','t_password':'"+
								"','t_isTwoWay':'','t_packetSize':'"+
								"','t_fileListSize':'','t_threads':'"+
								"','dir':'"+sourceFile.getDir()+"','serverAddress':'"+sourceFile.getServerAddress()+
								"','port':'"+sourceFile.getPort()+"','filterTypes':'"+sourceFile.getFiltertypes()+
								"','notFilterTypes':'"+sourceFile.getNotfiltertypes()+"','interval':'"+sourceFile.getInterval()+
								"','charset':'"+sourceFile.getCharset()+"','protocol':'"+sourceFile.getProtocol()+
								"','userName':'"+sourceFile.getUserName()+
								"','deleteFile':'"+sourceFile.isDeletefile()+"','isIncludeSubDir':'"+sourceFile.isIsincludesubdir()+
								"','fileListSize':'"+sourceFile.getFilelistsize()+"','packetSize':'"+sourceFile.getPacketsize()+
								"','threads':'"+sourceFile.getThreads()+"','t_protocol':'"+
								"','isTwoWay':'"+sourceFile.isIstwoway()+"','plugin':'1',deleteFlag:"+getSourceDeleteFlag(type.getTypeName())+",flag:'"+flag+"'},";
						}else if(sourceFile ==null && targetFile != null){
							flag = "flag_2";
							json += "{'appName':'"+type.getTypeName()+"','appDesc':'"+type.getDescription()+"',isAllow:"+type.isAllow()+",speed:"+type.getSpeed()+
                                ",channel:'"+type.getChannel()+"',channelport:'"+type.getChannelPort()+ "',status:'"+type.getStatus()+
								"','appType':'"+type.getAppType()+"','isActive':"+type.isActive()+
								",'isFilter':"+type.isFilter()+",'isVirusScan':"+type.isVirusScan()+ ",infoLevel:" +type.getInfoLevel()+
								",'t_dir':'"+targetFile.getDir()+"','t_serverAddress':'"+targetFile.getServerAddress()+
								"','t_port':'"+targetFile.getPort()+"','t_userName':'"+targetFile.getUserName()+
								"','t_charset':'"+targetFile.getCharset()+"','t_deleteFile':'"+targetFile.isDeletefile()+
								"','t_onlyAdd':'"+targetFile.isOnlyadd()+
								"','t_isTwoWay':'"+targetFile.isIstwoway()+"','t_packetSize':'"+targetFile.getPacketsize()+
								"','t_fileListSize':'"+targetFile.getFilelistsize()+"','t_threads':'"+targetFile.getThreads()+
								"','dir':'','serverAddress':'"+
								"','port':'','filterTypes':'"+
								"','notFilterTypes':'','interval':'"+
								"','charset':'','protocol':'"+
								"','userName':'','password':'"+
								"','deleteFile':'','isIncludeSubDir':'"+
								"','fileListSize':'','packetSize':'"+
								"','threads':'','t_protocol':'"+targetFile.getProtocol()+
								"','isTwoWay':'','plugin':'2',deleteFlag:"+getSourceDeleteFlag(type.getTypeName())+",flag:'"+flag+"'},";
						}else if(sourceFile !=null && targetFile != null){
							json += "{'appName':'"+type.getTypeName()+"','appDesc':'"+type.getDescription()+ "',isAllow:"+type.isAllow()+",speed:"+type.getSpeed()+
                                ",channel:'"+type.getChannel()+"',channelport:'"+type.getChannelPort()+ "',status:'"+type.getStatus()+
								"','appType':'"+type.getAppType()+"','isActive':"+type.isActive()+
								",'isFilter':"+type.isFilter()+",'isVirusScan':"+type.isVirusScan()+ ",infoLevel:" +type.getInfoLevel()+
								",'t_dir':'"+targetFile.getDir()+"','t_serverAddress':'"+targetFile.getServerAddress()+
								"','t_port':'"+targetFile.getPort()+"','t_userName':'"+targetFile.getUserName()+
								"','t_charset':'"+targetFile.getCharset()+"','t_deleteFile':'"+targetFile.isDeletefile()+
								"','t_onlyAdd':'"+targetFile.isOnlyadd()+
								"','t_isTwoWay':'"+targetFile.isIstwoway()+"','t_packetSize':'"+targetFile.getPacketsize()+
								"','t_fileListSize':'"+targetFile.getFilelistsize()+"','t_threads':'"+targetFile.getThreads()+
								"','dir':'"+sourceFile.getDir()+"','serverAddress':'"+sourceFile.getServerAddress()+
								"','port':'"+sourceFile.getPort()+"','filterTypes':'"+sourceFile.getFiltertypes()+
								"','notFilterTypes':'"+sourceFile.getNotfiltertypes()+"','interval':'"+sourceFile.getInterval()+
								"','charset':'"+sourceFile.getCharset()+"','protocol':'"+sourceFile.getProtocol()+
								"','userName':'"+sourceFile.getUserName()+
								"','deleteFile':'"+sourceFile.isDeletefile()+"','isIncludeSubDir':'"+sourceFile.isIsincludesubdir()+
								"','fileListSize':'"+sourceFile.getFilelistsize()+"','packetSize':'"+sourceFile.getPacketsize()+
								"','threads':'"+sourceFile.getThreads()+"','t_protocol':'"+targetFile.getProtocol()+
								"','isTwoWay':'"+sourceFile.isIstwoway()+"','plugin':'0',deleteFlag:"+getSourceDeleteFlag(type.getTypeName())+",flag:'"+flag+"'},";
						}						
					}
				}
			}
			json += "]}";
		}
		return json;
	}

	public String readExternalType(Integer start, Integer limit,String appType,boolean isAllow) throws Ex {
		List<Type> externalTypes = xmlOperatorDAO.getTypes("external",appType,isAllow);
		int total = externalTypes.size();
		String json = "{'success':true,'total':"+total+",rows:[";
		if(total == 0){
			json += ",]}";
		}else {
			if("db".equals(appType)){
				int index = 0;
				for (int i = 0; i < total; i++) {
					if(i==start&&index<limit){
						start ++;
						index ++;
						Type type = externalTypes.get(i);
						DataBase s = xmlOperatorDAO.getDataBase("external", type.getTypeName());
						String t = xmlOperatorDAO.getSrcdbName("external",type.getTypeName());
						String flag = "flag_0";
						String plugin = "0";
						String tables = "tables_0";
						if(s!=null && t == null){
							flag = "flag_1";
							plugin = "1";
							t = "";
							tables = "tables_1";
							json += "{'appName':'"+type.getTypeName()+"','appDesc':'"+type.getDescription()+
                                    "','appType':'"+type.getAppType()+"',isAllow:"+type.isAllow()+",speed:"+type.getSpeed()+
                                ",channel:'"+type.getChannel()+"',channelport:'"+type.getChannelPort()+"',status:'"+type.getStatus()+
								"','isActive':'"+type.isActive()+	"','isLocal':'"+type.isLocal()+"','isRecover':'"+type.isRecover()+ "',infoLevel:" +type.getInfoLevel()+
                                ",isFilter:"+type.isFilter()+",isVirusScan:"+type.isVirusScan()+
								",'dataPath':'"+type.getDataPath()+"','deleteFile':'"+type.isDeleteFile()+"','dbName':'"+s.getDbName()+
								"','oldStep':'"+s.isOldStep()+"','operation':'"+s.getOperation()+"','enable':'"+s.isEnable()+
								"','tempTable':'"+s.getTempTable()+"','maxRecords':'"+s.getMaxRecords()+"','interval':'"+s.getInterval()+
								"','isTwoway':'"+s.isTwoway()+"','srcdbName':'"+t+"','plugin':'"+plugin+
								"','tables':'"+tables+"','privated':false,deleteFlag:"+getSourceDeleteFlag(type.getTypeName())+",flag:'"+flag+"'},";
						}else if(s==null && t != null){
							flag = "flag_2";
							plugin = "2";
							tables = "tables_2";
							json += "{'appName':'"+type.getTypeName()+"','appDesc':'"+type.getDescription()+
                                    "','appType':'"+type.getAppType()+"',isAllow:"+type.isAllow()+",speed:"+type.getSpeed()+
                                ",channel:'"+type.getChannel()+"',channelport:'"+type.getChannelPort()+"',status:'"+type.getStatus()+
								"','isActive':'"+type.isActive()+	"','isLocal':'"+type.isLocal()+"','isRecover':'"+type.isRecover()+ "',infoLevel:" +type.getInfoLevel()+
                                ",isFilter:"+type.isFilter()+",isVirusScan:"+type.isVirusScan()+
								",'dataPath':'"+type.getDataPath()+"','deleteFile':'"+type.isDeleteFile()+"','dbName':'"+
								"','oldStep':'','operation':'','enable':'"+
								"','tempTable':'','maxRecords':'','interval':'"+
								"','isTwoway':'','srcdbName':'"+t+"','plugin':'"+plugin+
								"','tables':'"+tables+"','privated':false,deleteFlag:"+getSourceDeleteFlag(type.getTypeName())+",flag:'"+flag+"'},";
						}else if(s!=null && t != null){
							json += "{'appName':'"+type.getTypeName()+"','appDesc':'"+type.getDescription()+
                                    "','appType':'"+type.getAppType()+"',isAllow:"+type.isAllow()+",speed:"+type.getSpeed()+
                                ",channel:'"+type.getChannel()+"',channelport:'"+type.getChannelPort()+"',status:'"+type.getStatus()+
								"','isActive':'"+type.isActive()+	"','isLocal':'"+type.isLocal()+"','isRecover':'"+type.isRecover()+ "',infoLevel:" +type.getInfoLevel()+
                                ",isFilter:"+type.isFilter()+",isVirusScan:"+type.isVirusScan()+
								",'dataPath':'"+type.getDataPath()+"','deleteFile':'"+type.isDeleteFile()+"','dbName':'"+s.getDbName()+
								"','oldStep':'"+s.isOldStep()+"','operation':'"+s.getOperation()+"','enable':'"+s.isEnable()+
								"','tempTable':'"+s.getTempTable()+"','maxRecords':'"+s.getMaxRecords()+"','interval':'"+s.getInterval()+
								"','isTwoway':'"+s.isTwoway()+"','srcdbName':'"+t+"','plugin':'"+plugin+
								"','tables':'"+tables+"','privated':false,deleteFlag:"+getSourceDeleteFlag(type.getTypeName())+",flag:'"+flag+"'},";
						}else if( s==null && t == null ){
							t = "";
							flag = "flag_1";
							plugin = "3";
							tables = "tables_3";
							json += "{'appName':'"+type.getTypeName()+"','appDesc':'"+type.getDescription()+
                                    "','appType':'"+type.getAppType()+ "',isAllow:"+type.isAllow()+",speed:"+type.getSpeed()+
                                ",channel:'"+type.getChannel()+"',channelport:'"+type.getChannelPort()+ "',status:'"+type.getStatus()+
								"','isActive':'"+type.isActive()+	"','isLocal':'"+type.isLocal()+"','isRecover':'"+type.isRecover()+ "',infoLevel:" +type.getInfoLevel()+
                                ",isFilter:"+type.isFilter()+",isVirusScan:"+type.isVirusScan()+
								",'dataPath':'"+type.getDataPath()+"','deleteFile':'"+type.isDeleteFile()+"','dbName':'"+
								"','oldStep':'','operation':'','enable':'"+
								"','tempTable':'','maxRecords':'','interval':'"+
								"','isTwoway':'','srcdbName':'"+t+"','plugin':'"+plugin+
								"','tables':'"+tables+"','privated':false,deleteFlag:"+getSourceDeleteFlag(type.getTypeName())+",flag:'"+flag+"'},";
						}
					}
				}
			}else if(appType.equals("ftpproxy")||appType.equals("proxy")||appType.equals("proxy")||appType.equals("reproxy")){
				int index = 0;
				for (int i = 0; i < total; i++) {
					if(i==start&&index<limit){
						start ++;
						index ++;
						Type type = externalTypes.get(i);
						SocketChange s = xmlOperatorDAO.getSocketChange("external", Plugin.s_source_plugin,type.getTypeName());
						SocketChange t = xmlOperatorDAO.getSocketChange("external", Plugin.s_target_plugin,type.getTypeName());
						String flag = "flag_0";
						String plugin = "0";
						if(s !=null && t == null){
							flag = "flag_1";
							plugin = "1";
							json += "{'appName':'"+type.getTypeName()+"','appDesc':'"+type.getDescription()+"',isAllow:"+type.isAllow()+
                                ",channel:'"+type.getChannel()+"',channelport:'"+type.getChannelPort()+ "',status:'"+type.getStatus()+
								"','appType':'"+type.getAppType()+"','isActive':'"+type.isActive()+
                                "','isFilter':"+type.isFilter()+",'isVirusScan':"+type.isVirusScan()+ ",infoLevel:" +type.getInfoLevel()+
                                ",'t_name':'','t_serverAddress':'"+
								"','t_port':'','t_poolMin':'"+
								"','t_poolMax':'','t_tryTime':'"+
								"','t_charset':'','t_type':'"+
								"','authca':'"+s.getAuthca()+"','authaddress':'"+s.getAuthaddress()+
								"','authport':'"+s.getAuthport()+"','authcapass':'"+
                                "','clientauthenable':'"+s.isClientauthenable()+"','ipfilter':"+s.getIpfilter()+
								",'name':'"+s.getName()+"','serverAddress':'"+s.getServerAddress()+
								"','port':'"+s.getPort()+"','poolMin':'"+s.getPoolMin()+
								"','poolMax':'"+s.getPoolMax()+"','tryTime':'"+s.getTryTime()+
								"','charset':'"+s.getCharset()+"','ipAddress':'yes_ip"+
								"','type':'"+s.getType()+"','plugin':'"+plugin+
                                "',safeType:'"+
                                "',deleteFlag:"+getSourceDeleteFlag(type.getTypeName())+
                                 ",flag:'"+flag+"'},";
						}else if(s ==null && t != null){
							flag = "flag_2";
							plugin = "2";
							json += "{'appName':'"+type.getTypeName()+"','appDesc':'"+type.getDescription()+"',isAllow:"+type.isAllow()+
                                ",channel:'"+type.getChannel()+"',channelport:'"+type.getChannelPort()+ "',status:'"+type.getStatus()+
								"','appType':'"+type.getAppType()+"','isActive':'"+type.isActive()+
                                "','isFilter':"+type.isFilter()+",'isVirusScan':"+type.isVirusScan()+ ",infoLevel:" +type.getInfoLevel()+
                                ",'t_name':'"+t.getName()+"','t_serverAddress':'"+t.getServerAddress()+
								"','t_port':'"+t.getPort()+"','t_poolMin':'"+t.getPoolMin()+
								"','t_poolMax':'"+t.getPoolMax()+"','t_tryTime':'"+t.getTryTime()+
								"','t_charset':'"+t.getCharset()+"','t_type':'"+t.getType()+
                                "','authca':'','authaddress':'"+
                                "','authport':'','authcapass':'"+
								"','clientauthenable':'','ipfilter':"+t.getIpfilter()+
								",'name':'','serverAddress':'"+
								"','port':'','poolMin':'"+
								"','poolMax':'','tryTime':'"+
								"','charset':'','ipAddress':'"+
								"','type':'','plugin':'"+plugin+"',deleteFlag:"+getSourceDeleteFlag(type.getTypeName())+",flag:'"+flag+"'},";
						}else if(s !=null && t != null){
							json += "{'appName':'"+type.getTypeName()+"','appDesc':'"+type.getDescription()+"',isAllow:"+type.isAllow()+
                                ",channel:'"+type.getChannel()+"',channelport:'"+type.getChannelPort()+ "',status:'"+type.getStatus()+
								"','appType':'"+type.getAppType()+"','isActive':'"+type.isActive()+
                                "','isFilter':"+type.isFilter()+",'isVirusScan':"+type.isVirusScan()+ ",infoLevel:" +type.getInfoLevel()+
                                ",'t_name':'"+t.getName()+"','t_serverAddress':'"+t.getServerAddress()+
								"','t_port':'"+t.getPort()+"','t_poolMin':'"+t.getPoolMin()+
								"','t_poolMax':'"+t.getPoolMax()+"','t_tryTime':'"+t.getTryTime()+
								"','t_charset':'"+t.getCharset()+"','t_type':'"+t.getType()+
                                "','authca':'"+s.getAuthca()+"','authaddress':'"+s.getAuthaddress()+
                                "','authport':'"+s.getAuthport()+"','authcapass':'"+
                                "','clientauthenable':'"+s.isClientauthenable()+"','ipfilter':"+s.getIpfilter()+
								",'name':'"+s.getName()+"','serverAddress':'"+s.getServerAddress()+
								"','port':'"+s.getPort()+"','poolMin':'"+s.getPoolMin()+
								"','poolMax':'"+s.getPoolMax()+"','tryTime':'"+s.getTryTime()+
								"','charset':'"+s.getCharset()+"','ipAddress':'"+s.getIpaddress()+
								"','type':'"+s.getType()+"','plugin':'"+plugin+"',deleteFlag:"+getSourceDeleteFlag(type.getTypeName())+",flag:'"+flag+"'},";
						}
					}
				}
			}else if(appType.equals("file")){
				int index = 0;
				for (int i = 0; i < total; i++) {
					if(i==start&&index<limit){
						start ++;
						index ++;
						Type type = externalTypes.get(i);
						SourceFile sourceFile = xmlOperatorDAO.getSourceFiles("external",type.getTypeName());
						TargetFile targetFile = xmlOperatorDAO.getTargetFiles("external",type.getTypeName());
						String flag = "flag_0";
						if(sourceFile !=null && targetFile == null){
							flag = "flag_1";
							json += "{'appName':'"+type.getTypeName()+"','appDesc':'"+type.getDescription()+"',isAllow:"+type.isAllow()+",speed:"+type.getSpeed()+
                                ",channel:'"+type.getChannel()+"',channelport:'"+type.getChannelPort()+ "',status:'"+type.getStatus()+
								"','appType':'"+type.getAppType()+"','isActive':"+type.isActive()+
								",'isFilter':"+type.isFilter()+",'isVirusScan':"+type.isVirusScan()+ ",infoLevel:" +type.getInfoLevel()+
								",'t_dir':'','t_serverAddress':'"+
								"','t_port':'','t_userName':'"+
								"','t_charset':'','t_deleteFile':'"+
								"','t_onlyAdd':'','t_password':'"+
								"','t_isTwoWay':'','t_packetSize':'"+
								"','t_fileListSize':'','t_threads':'"+
								"','dir':'"+sourceFile.getDir()+"','serverAddress':'"+sourceFile.getServerAddress()+
								"','port':'"+sourceFile.getPort()+"','filterTypes':'"+sourceFile.getFiltertypes()+
								"','notFilterTypes':'"+sourceFile.getNotfiltertypes()+"','interval':'"+sourceFile.getInterval()+
								"','charset':'"+sourceFile.getCharset()+"','protocol':'"+sourceFile.getProtocol()+
								"','userName':'"+sourceFile.getUserName()+
								"','deleteFile':'"+sourceFile.isDeletefile()+"','isIncludeSubDir':'"+sourceFile.isIsincludesubdir()+
								"','fileListSize':'"+sourceFile.getFilelistsize()+"','packetSize':'"+sourceFile.getPacketsize()+
								"','threads':'"+sourceFile.getThreads()+"','t_protocol':'"+
								"','isTwoWay':'"+sourceFile.isIstwoway()+"','plugin':'1',deleteFlag:"+getSourceDeleteFlag(type.getTypeName())+",flag:'"+flag+"'},";
						}else if(sourceFile ==null && targetFile != null){
							flag = "flag_2";
							json += "{'appName':'"+type.getTypeName()+"','appDesc':'"+type.getDescription()+"',isAllow:"+type.isAllow()+ ",speed:"+type.getSpeed()+
                                ",channel:'"+type.getChannel()+"',channelport:'"+type.getChannelPort()+ "',status:'"+type.getStatus()+
								"','appType':'"+type.getAppType()+"','isActive':"+type.isActive()+
								",'isFilter':"+type.isFilter()+",'isVirusScan':"+type.isVirusScan()+ ",infoLevel:" +type.getInfoLevel()+
								",'t_dir':'"+targetFile.getDir()+"','t_serverAddress':'"+targetFile.getServerAddress()+
								"','t_port':'"+targetFile.getPort()+"','t_userName':'"+targetFile.getUserName()+
								"','t_charset':'"+targetFile.getCharset()+"','t_deleteFile':'"+targetFile.isDeletefile()+
								"','t_onlyAdd':'"+targetFile.isOnlyadd()+
								"','t_isTwoWay':'"+targetFile.isIstwoway()+"','t_packetSize':'"+targetFile.getPacketsize()+
								"','t_fileListSize':'"+targetFile.getFilelistsize()+"','t_threads':'"+targetFile.getThreads()+
								"','dir':'','serverAddress':'"+
								"','port':'','filterTypes':'"+
								"','notFilterTypes':'','interval':'"+
								"','charset':'','protocol':'"+
								"','userName':'','password':'"+
								"','deleteFile':'','isIncludeSubDir':'"+
								"','fileListSize':'','packetSize':'"+
								"','threads':'','t_protocol':'"+targetFile.getProtocol()+
								"','isTwoWay':'','plugin':'2',deleteFlag:"+getSourceDeleteFlag(type.getTypeName())+",flag:'"+flag+"'},";
						}else if(sourceFile !=null && targetFile != null){
							json += "{'appName':'"+type.getTypeName()+"','appDesc':'"+type.getDescription()+ "',isAllow:"+type.isAllow()+ ",speed:"+type.getSpeed()+
                                ",channel:'"+type.getChannel()+"',channelport:'"+type.getChannelPort()+ "',status:'"+type.getStatus()+
								"','appType':'"+type.getAppType()+"','isActive':"+type.isActive()+
								",'isFilter':"+type.isFilter()+",'isVirusScan':"+type.isVirusScan()+ ",infoLevel:" +type.getInfoLevel()+
								",'t_dir':'"+targetFile.getDir()+"','t_serverAddress':'"+targetFile.getServerAddress()+
								"','t_port':'"+targetFile.getPort()+"','t_userName':'"+targetFile.getUserName()+
								"','t_charset':'"+targetFile.getCharset()+"','t_deleteFile':'"+targetFile.isDeletefile()+
								"','t_onlyAdd':'"+targetFile.isOnlyadd()+
								"','t_isTwoWay':'"+targetFile.isIstwoway()+"','t_packetSize':'"+targetFile.getPacketsize()+
								"','t_fileListSize':'"+targetFile.getFilelistsize()+"','t_threads':'"+targetFile.getThreads()+
								"','dir':'"+sourceFile.getDir()+"','serverAddress':'"+sourceFile.getServerAddress()+
								"','port':'"+sourceFile.getPort()+"','filterTypes':'"+sourceFile.getFiltertypes()+
								"','notFilterTypes':'"+sourceFile.getNotfiltertypes()+"','interval':'"+sourceFile.getInterval()+
								"','charset':'"+sourceFile.getCharset()+"','protocol':'"+sourceFile.getProtocol()+
								"','userName':'"+sourceFile.getUserName()+
								"','deleteFile':'"+sourceFile.isDeletefile()+"','isIncludeSubDir':'"+sourceFile.isIsincludesubdir()+
								"','fileListSize':'"+sourceFile.getFilelistsize()+"','packetSize':'"+sourceFile.getPacketsize()+
								"','threads':'"+sourceFile.getThreads()+"','t_protocol':'"+targetFile.getProtocol()+
								"','isTwoWay':'"+sourceFile.isIstwoway()+"','plugin':'0',deleteFlag:"+getSourceDeleteFlag(type.getTypeName())+",flag:'"+flag+"'},";
						}
					}
				}
			}
			json += "]}";
		}
		return json;
	}

    /**
     * 判断源端是否删除等待状态
     * @param appName
     * @return
     */
    private boolean getSourceDeleteFlag(String appName) {
        DeleteStatus deleteStatus = null;
        try {
            deleteStatus = deleteStatusDao.findByAppName(appName);
        } catch (Exception e) {

        }
        if(deleteStatus!=null ){
            return false;
        }
        return true;
    }

    /**
	 * 读取内网internal：config.xml的jdbc，以json返回
	 */
	public String readInternalJdbc(Integer start, Integer limit) throws Ex {
		List<Jdbc> jdbcs = xmlOperatorDAO.getInternalJdbc();
		int total = jdbcs.size();
		String json = "{success:true,total:"+total+",rows:[";
		if(total == 0){
			json +=",]}";
		}else {
			int index = 0;
			for (int i = 0; i < total; i++) {
				if(i==start&&index<limit){
					start ++;
					index ++;
					Jdbc jdbc = jdbcs.get(i);
                    boolean isUsed = checkJdbcNameIsUsed(true,jdbc.getJdbcName());
					json += "{'jdbcName':'"+jdbc.getJdbcName()+"','jdbcDesc':'"+jdbc.getDescription()+"','dbType':'"+jdbc.getDbType()+
							"','dbCatalog':'"+jdbc.getDbCatalog()+"','dbHost':'"+jdbc.getDbHost()+"','dbOwner':'"+jdbc.getDbOwner()+
							"','dbUrl':'"+jdbc.getDbUrl()+"','dbUser':'"+jdbc.getDbUser()+"','dbVender':'"+jdbc.getDbVender()+
							"','driverClass':'"+jdbc.getDriverClass()+"','encoding':'"+jdbc.getEncoding()+"','password':'"+jdbc.getPassword()+
							"','dbName':'"+new StringUtils().trimUrl(jdbc.getDbUrl())+"',isUsed:"+isUsed+
                            ",version:'"+jdbc.getVersion()+"',dbPort:'"+jdbc.getDbPort()+"',flag:'jdbc_internal_flag'},";
				}
			}
			json +="]}";
		}
		return json;
	}
	/**
	 * 读取外网目标external：config.xml的jdbc，以json返回
	 */
	public String readExternalJdbc(Integer start, Integer limit) throws Ex {
		List<Jdbc> jdbcs = xmlOperatorDAO.getExternalJdbc();
		int total = jdbcs.size();
		String json = "{'success':true,'total':"+total+",'rows':[";
		if(total == 0){
			json +=",]}";
		}else {
			int index = 0;
			for (int i = 0; i < total; i++) {
				if(i==start&&index<limit){
					start ++;
					index ++;
					Jdbc jdbc = jdbcs.get(i);
                    boolean isUsed = checkJdbcNameIsUsed(false,jdbc.getJdbcName());
					json += "{jdbcName:'"+jdbc.getJdbcName()+"',jdbcDesc:'"+jdbc.getDescription()+"',dbType:'"+jdbc.getDbType()+
							"',dbCatalog:'"+jdbc.getDbCatalog()+"',dbHost:'"+jdbc.getDbHost()+"',dbOwner:'"+jdbc.getDbOwner()+
							"',dbUrl:'"+jdbc.getDbUrl()+"',dbUser:'"+jdbc.getDbUser()+"',dbVender:'"+jdbc.getDbVender()+
							"',driverClass:'"+jdbc.getDriverClass()+"',encoding:'"+jdbc.getEncoding()+"',password:'"+jdbc.getPassword()+
							"',dbName:'"+new StringUtils().trimUrl(jdbc.getDbUrl())+"',isUsed:"+isUsed+
                            ",version:'"+jdbc.getVersion()+"',dbPort:'"+jdbc.getDbPort()+"',flag:'jdbc_external_flag'},";
				}
			}
			json +="]}";
		}
		return json;
	}

	public String readExternalTypeTable(Integer start, Integer limit,String appName,String type) throws Ex {
		List<Table> tables = xmlOperatorDAO.getExternalTypeTable(appName,type);
		int total = tables.size();
		String json = "{'success':true,'total':"+total+",'rows':[";
		if(total == 0){
			json +=",]}";
		}else {
			int index = 0;
			for (int i = 0; i < total; i++) {
				if(i==start&&index<limit){
					start ++;
					index ++;
					Table table = tables.get(i);
					json += "{'tableName':'"+table.getTableName()+"','id':'id','name':'name','addr':'addr','phone':'phone'},";
				}
			}
			json +="]}";
		}
		return json;
	}

	public String readInternalTypeTable(Integer start, Integer limit,String appName,String type) throws Ex {
		List<Table> tables = xmlOperatorDAO.getInternalTypeTable(appName,type);
		int total = tables.size();
		String json = "{'success':true,'total':"+total+",'rows':[";
		if(total == 0){
			json +=",]}";
		}else {
			int index = 0;
			for (int i = 0; i < total; i++) {
				if(i==start&&index<limit){
					start ++;
					index ++;
					Table table = tables.get(i);
					json += "{'tableName':'"+table.getTableName()+"','id':'id','name':'name','addr':'addr','phone':'phone'},";
				}
			}
			json +="]}";
		}
		return json;
	}
	
	/**
	 *  保存**代理应用
	 */
	public void saveProxyType(TypeBase typeBase, TypeSafe typeSafe, TypeData typeData) throws Ex {
		xmlOperatorDAO.saveProxyType(typeBase,typeSafe,typeData);
	}


    public void saveProxyTypeSafe(TypeBase typeBase, TypeSafe typeSafe) throws Ex{
        xmlOperatorDAO.updateProxyTypeSafe(typeBase, typeSafe);
    }

    @Override
    public void updateProxyType(TypeBase typeBase, TypeData typeData) throws Ex {
        xmlOperatorDAO.updateProxyType(typeBase, typeData);
    }

    @Override
    public void updateProxyTypeSafe(TypeBase typeBase, TypeSafe typeSafe) throws Ex {
        xmlOperatorDAO.updateProxyTypeSafe(typeBase,typeSafe);
    }

	public String deleteInternalTypeByName(String appName, int index) throws Ex {
		String json = null;
        if(index == 1){
        	
            boolean isRemoveTarget = xmlOperatorDAO.deleteInternalTypeByName(appName);
            if(isRemoveTarget){
                json = "{'success':true}";
            }
        }else if(index == 2){
        	
            boolean  isRemoveSource = xmlOperatorDAO.deleteInternalTypeByName(appName);
            boolean  isRemoveTarget = true;
            if(xmlOperatorDAO.isExistExternalType(appName)){
                isRemoveTarget = xmlOperatorDAO.deleteExternalTypeByName(appName);
                if(isRemoveTarget){
                    json = "{'success':true}";
                }
            }else {
            	if(isRemoveSource){
            		json = "{'success':true}";
            	}
            }
           
        }
		return json;
	}

	public String deleteExternalTypeByName(String appName, int i) throws Ex {
		String json = null;
        if(i == 1){
            boolean isRemoveTarget = xmlOperatorDAO.deleteExternalTypeByName(appName);
            if(isRemoveTarget){
                json = "{'success':true}";
            }
        }else if(i == 2){
            boolean  isRemoveSource = xmlOperatorDAO.deleteExternalTypeByName(appName);
            boolean  isRemoveTarget = true;
            if(xmlOperatorDAO.isExistInternalType(appName)){
                isRemoveTarget = xmlOperatorDAO.deleteInternalTypeByName(appName);
                if(isRemoveTarget){
                    json = "{'success':true}";
                }
            }else{
            	if(isRemoveSource){
            		json = "{'success':true}";
            	}
            }
        }
		return json;
	}

	public String readExternalProxyIp(Integer start, Integer limit,String appName) throws Ex {
		String[] ips = xmlOperatorDAO.getExternalProxyIp(appName);
        String json =null;
        if(ips.length==0){
            json = "{'success':true,'total':0,'rows':[,]}";
        }else{
            json = "{'success':true,'total':"+ips.length+",'rows':[";
            int index = 0;
            for (int i = 0; i < ips.length; i ++){
                 if(i == start&& index <limit){   //0,6
                    start++;
                    index++;
                    if(!"".equals(ips[i])){
                    	String[] ip = ips[i].split("-");
                    	if(ip.length>1){
                    		json += "{'ip':'"+ip[0]+"','ipEnd':'"+ip[1]+"','flag':'ip_flag'},";
                    	}else{
                    		json += "{'ip':'"+ip[0]+"','ipEnd':'','flag':'ip_flag'},";
                    	}
                    }
                }
            }
            json += "]}";
        }
		return json;
	}
	
	/**
	 * 读取代理应用的可访问IP
	 */
	public String readInternalProxyIp(Integer start, Integer limit, String appName) throws Ex {
		String[] ips = xmlOperatorDAO.getInternalProxyIp(appName);
        String json =null;
        if(ips.length==0){
            json = "{'success':true,'total':0,'rows':[,]}";
        }else{
            json = "{'success':true,'total':"+ips.length+",'rows':[";
            int index = 0;
            for (int i = 0; i < ips.length; i ++){
                 if(i == start&& index <limit){   //0,6
                    start++;
                    index++;
                    if(!"".equals(ips[i])){
                    	String[] ip = ips[i].split("-");
                    	if(ip.length>1){
                    		json += "{'ip':'"+ip[0]+"','ipEnd':'"+ip[1]+"','flag':'ip_flag'},";
                    	}else{
                    		json += "{'ip':'"+ip[0]+"','ipEnd':'','flag':'ip_flag'},";
                    	}
                    }
                }
            }
            json += "]}";
        }
		return json;
	}

	public String checkInternalProxyIp(String appName, String ip) throws Ex {
		String[] ips = xmlOperatorDAO.getInternalProxyIp(appName);
		if(ips !=null){
			for(int i = 0; i < ips.length;i++){
	            if(ip.equals(ips[i])){
	                return "这个Ip已经存在！";
	            }
	        }
		}
        return "0000";
	}
	
	public String checkExternalProxyIp(String appName, String ip) throws Ex {
		String[] ips = xmlOperatorDAO.getExternalProxyIp(appName);
		if(ips !=null){
			for(int i = 0; i < ips.length;i++){
				if(ip.equals(ips[i])){
					return "这个Ip已经存在！";
				}
			}
		}
        return "0000";
	}
	
	public String saveExternalProxyIp(String appName, String ip) throws Ex {
		String[] ips = xmlOperatorDAO.getExternalProxyIp(appName);
		if(ip.split("-").length>1){
			String[] ipArray = ip.split("-");
			String check = checkExternalProxyIp(appName,ipArray[0]);
			if("0000".equals(check)){
				ip = new StringUtils().appendString(ips,ip);
			}else{
				return "保存失败,起始IP已经存在!";
			}
		}else{
			String check = checkExternalProxyIp(appName,ip);
			if("0000".equals(check)){
				ip = new StringUtils().appendString(ips,ip);
			}else{
				return "保存失败,起始IP已经存在!";
			}
		}
		xmlOperatorDAO.saveExternalProxyIp(appName,ip);
		return "保存成功,点击[确定]返回列表!";
	}
	
	public String saveInternalProxyIp(String appName, String ip) throws Ex {
		String[] ips = xmlOperatorDAO.getInternalProxyIp(appName);
		if(ip.split("-").length>1){
			String[] ipArray = ip.split("-");
			String check = checkInternalProxyIp(appName,ipArray[0]);
			if("0000".equals(check)){
				ip = new StringUtils().appendString(ips,ip);
			}else{
				return "保存失败,起始IP已经存在!";
			}
		}else{
			String check = checkInternalProxyIp(appName,ip);
			if("0000".equals(check)){
				ip = new StringUtils().appendString(ips,ip);
			}else{
				return "保存失败,起始IP已经存在!";
			}
		}
		xmlOperatorDAO.saveInternalProxyIp(appName,ip);
		return "保存成功,点击[确定]返回列表!";
	}
	
	public void updateExternalProxyIp(String appName, String ip, String oldIp) throws Ex {
		String[] ips = xmlOperatorDAO.getExternalProxyIp(appName);
		ip = new StringUtils().updateString(ips,ip,oldIp);
		xmlOperatorDAO.saveExternalProxyIp(appName,ip);		
	}
	
	public void updateInternalProxyIp(String appName, String ip, String oldIp) throws Ex {
		String[] ips = xmlOperatorDAO.getInternalProxyIp(appName);
		ip = new StringUtils().updateString(ips,ip,oldIp);
		xmlOperatorDAO.saveInternalProxyIp(appName,ip);		
	}
	
	/**
	 * 删除非可信端代理应用的可访问Ip
	 */
	public void deleteExternalProxyIp(String appName, String[] array) throws Ex {
		String[] ips = xmlOperatorDAO.getExternalProxyIp(appName);
		String ip = new StringUtils().deleteArray(ips,array);
		xmlOperatorDAO.saveExternalProxyIp(appName,ip);
	}
	
	/**
	 * 删除可信端代理应用的可访问Ip
	 */
	public void deleteInternalProxyIp(String appName, String[] array) throws Ex {
		String[] ips = xmlOperatorDAO.getInternalProxyIp(appName);
		String ip = new StringUtils().deleteArray(ips,array);
		xmlOperatorDAO.saveInternalProxyIp(appName,ip);
	}

	public String readJdbcName(String typeXml) throws Ex {
		String[] jdbcNames = xmlOperatorDAO.readJdbcName(typeXml);
		int total = jdbcNames.length;
		String json = "{'success':true,'total':"+total+",'rows':[";
		if(total == 0){
			json +=",]}";
		}else {
			for (int i = 0; i < jdbcNames.length; i++) {
				json += "{'key':'"+jdbcNames[i]+"','value':'"+jdbcNames[i]+"'},";
			}
            json += "]}";
        }
		return json;
	}
	
	/**
	 * 保存数据库同步应用管理
	 */
	public void saveDBType(TypeBase typeBase, TypeDB typeDB) throws Ex {
		xmlOperatorDAO.saveDBType(typeBase, typeDB);
	}

	public void saveDBTypeTable(String type,TypeBase typeBase, TypeDB typeDB, TypeTable typeTable, Field[] tableFields) throws Ex {
		xmlOperatorDAO.saveDBTypeTable(type,typeBase,typeDB,typeTable,tableFields);
	}

    public void updateDBTypeTable(String type,TypeBase typeBase, TypeDB typeDB, TypeTable typeTable, Field[] tableFields) throws Ex {
		xmlOperatorDAO.updateDBTypeTable(type, typeBase, typeDB, typeTable, tableFields);
	}

	public String deleteJdbcByName(String[] jdbcNameArray, String typeXml) throws Ex {
		
		List<String> jdbcs = xmlOperatorDAO.deleteJdbcByName(jdbcNameArray,typeXml);
		String msg = "删除成功,点击[确定]返回列表!";
		if(jdbcs.size()>0){
			msg = jdbcs.toString()+"数据源正在被使用,不能删除!";
		}
		return msg;
	}
	
	public void saveJdbc(Jdbc jdbc, Boolean privated) throws Ex {
		xmlOperatorDAO.saveJdbc(jdbc, privated);		
	}
	
	public void updateJdbc(Jdbc jdbc, Boolean privated) throws Ex {
		xmlOperatorDAO.updateJdbc(jdbc, privated);		
	}

	public void saveDBTargetName(String typeXml, String appName, String[] targetdbNames) throws Ex {
		xmlOperatorDAO.saveDBTargetName(typeXml,appName,targetdbNames);		
	}

	public String readExternalFields(Integer start, Integer limit, String appName, String sourceDBName, String sourceTableName, String targetDBName, String targetTableName) throws Ex {
		List<Field> fields = xmlOperatorDAO.getExternalTypeFields(appName, sourceDBName,sourceTableName);
        int total = fields.size();
		String json = "{'success':true,'total':"+total+",'rows':[";
		if(total == 0){
			json +=",]}";
		}else {
            int count = 0;
            int index = 0;
			for (Field field : fields) {
//                if(start == index && count < limit){
                    String dest = getDest(field, targetDBName,targetTableName);
                    json += "{field:'"+field.getFieldName()+"',is_pk:'"+field.isPk()+"',is_null:'"+field.isNull()
                            +"',jdbc_type:'"+field.getJdbcType()+"',column_size:'"+field.getColumnSize()+
                            "',db_type:'"+field.getDbType()+"',dest:'"+dest+"',isFixed:"+(dest.length()>0?true:false)+"},";
//                    start ++;
//                    count ++;
//                }
//                index ++;
            }
            json += "]}";
        }
		return json;
	}

    /**
     * 获取dbName代表的内网jdbc对应的表tableName,
     * 如果field对应的字段存在,则返回字段名,否则返回""
     * @param field    源端字段属性
     * @param dbName   内网jdbc名
     * @param tableName  内网表
     * @return
     * @throws Ex
     */
    private String getDest(Field field, String dbName, String tableName) throws Ex{
        Jdbc jdbc = xmlOperatorDAO.getInternalJdbcByName(dbName);
        IDataBase db = DBFactory.getDataBase(jdbc, Constant.DB_INTERNAL);
		db.openConnection();
		Field f = db.getField(tableName, field.getFieldName());
		db.closeConnection();
        if(field.equals(f)){
            return f.getFieldName();
        }
        return "";
    }

    public String readInternalFields(String appName, String tableName) throws Ex {
		List<Field> fields = xmlOperatorDAO.getInternalTypeFields(appName, tableName);
		int total = fields.size();
		String json = "{'success':true,'total':"+total+",'rows':[";
		if(total == 0){
			json +=",]}";
		}else {
			for (Field field : fields) {
				boolean target_is_pk = false;

				json += "{'field':'"+field.getFieldName()+"','is_pk':'"+field.isPk()+"','is_null':'"+field.isNull()
						+"','jdbc_type':'"+field.getJdbcType()+"','column_size':'"+field.getColumnSize()+
						"','db_type':'"+field.getDbType()+"','dest':'','target_is_pk':'"+target_is_pk+"'},";
			}
            json += "]}";
        }
		return json;
	}
	
	@Override
	public String readExternalFieldsExist(String appName, String tableName,String targetTable, String targetDB) throws Ex {
		List<Field> fields = xmlOperatorDAO.getInternalTypeFields(appName, tableName);
//		List<Field> targetFields = xmlOperatorDAO.getThisTargetTableField("external",appName, targetTable, tableName, targetDB, targetTableName);
		int total = fields.size();
		String json = "{'success':true,'total':"+total+",'rows':[";
//		if(total == 0){
			json +=",]}";
//		}else {
//			for (Field field : fields) {
//				String destField = "";
//				boolean target_is_pk = false;
//				for (Field targetField : targetFields) {
//					if(field.getFieldName().equals(targetField.getFieldName())){
//						destField = setDest(targetField);
//						target_is_pk = targetField.isPk();
//					}
//				}
//				json += "{'field':'"+field.getFieldName()+"','is_pk':'"+field.isPk()+"','is_null':'"+field.isNull()
//						+"','jdbc_type':'"+field.getJdbcType()+"','column_size':'"+field.getColumnSize()+
//						"','db_type':'"+field.getDbType()+"','dest':'"+destField+"','target_is_pk':'"+target_is_pk+"'},";
//			}
//            json += "]}";
//        }
		return json;
	}
	
	private String setDest(Field field){
		String dest = field.getDestField();
		if(field.getJdbcType().equals("date")&& field.getDbType().equals("date")){
			dest += "(JDBC[date][date])";
		}else if(field.getJdbcType().equals("date")&& field.getDbType().equals("timestamp")){
			dest += "J(DBC[date]DB[timestamp])";
		}else if(field.getJdbcType().equals("timestamp")&& field.getDbType().equals("date")){
			dest += "(JDBC[timestamp]DB[date])";
		}else if(field.getJdbcType().equals("timestamp")&& field.getDbType().equals("timestamp")){
			dest += "(JDBC[timestamp]DB[timestamp])";
		}
		return dest;
	}
	
	public String readInternalFieldsExist(Integer start, Integer limit, String appName, String sourceDBName, String sourceTableName, String targetDBName, String targetTableName) throws Ex {
		List<Field> fields = xmlOperatorDAO.getExternalTypeFields(appName, sourceDBName, sourceTableName);
		List<Field> targetFields = xmlOperatorDAO.getThisTargetTableField(StringContext.INTERNAL,appName,sourceDBName ,sourceTableName,targetDBName,targetTableName );
		int total = fields.size();
		String json = "{'success':true,'total':"+total+",'rows':[";
		if(total == 0){
			json +=",]}";
		}else {
//            int index = 0;
//            int count = 0;
            for (Field field : fields) {
//                if(index==start && count<limit){
                    String destField = "";
                    boolean checked = false;
                    for (Field targetField : targetFields) {
                        if(field.getFieldName().equals(targetField.getFieldName())){
                            destField = targetField.getDestField();
                            checked = true;
                            break;
                        }
                    }
                if(StringUtils.isBlank(destField)) {
                    destField = getDest(field, targetDBName,targetTableName);
                }
                    json += "{'field':'"+field.getFieldName()+"','is_pk':'"+field.isPk()+"','is_null':'"+field.isNull()
                            +"','jdbc_type':'"+field.getJdbcType()+"','column_size':'"+field.getColumnSize()+
                            "','db_type':'"+field.getDbType()+"','dest':'"+destField+"',checked:"+checked+"},";
//                    start ++;
//                    count ++;
//                }
//                index ++;
            }



            json += "]}";
        }
		return json;
	}
	
	public String readThisTableField(String typeXml, String tableName, String appName) throws Ex {
		List<Field> fields = null;
		if("internal".equals(typeXml)){
			fields = xmlOperatorDAO.getInternalTypeFields(appName, tableName);
		}else if("external".equals(typeXml)){
			fields = xmlOperatorDAO.getExternalTypeFields(appName, appName, tableName);
		}
		int total = fields.size();
		String json = "{'success':true,'total':"+total+",'rows':[";
		if(total == 0){
			json +=",]}";
		}else {
			for (Field field : fields) {
				json += "{'field':'"+field.getFieldName()+"','is_pk':'"+field.isPk()+"','is_null':'"+field.isNull()
						+"','jdbc_type':'"+field.getJdbcType()+"','column_size':'"+field.getColumnSize()+
						"','db_type':'"+field.getDbType()+"'},";
			}
            json += "]}";
        }
		return json;
	}
	

	public void updateDBTypeSourceApp(TypeBase typeBase) throws Ex {
		xmlOperatorDAO.updateDBTypeSourceApp(typeBase);
	}

    public void updateDBName(TypeBase typeBase, String dbName, String dbNameOld) throws Ex{
        xmlOperatorDAO.updateDBName(typeBase, dbName, dbNameOld);
    }

    /**
     * 1.取得当前配置文件的按数据源组成的临时表列表
     * 2.取得存档配置文件的按数据源组成的临时表列表
     * 3.遍历1的列表,取到2中相同数据源的列表
     * 4.去掉2中取得的列表中与1中取得的交集
     * 5.第4中取得的与数据源中取到的数据取交集
     * @param filename
     * @return
     * @throws Ex
     */
    public Map<String,List<String>> readAllTempTable(String filename) throws Ex {
        Map<String,List<String>> tempTablse = xmlOperatorDAO.getTempTables(StringContext.EXTERNALXML, Type.s_app_db);
        Map<String,List<String>> _tempTablse = xmlOperatorDAO.getTempTables(filename, Type.s_app_db);
        Map<String,List<String>> map = new HashMap<String, List<String>>();
        Set<String> keys = tempTablse.keySet();
        for(String key:keys){
            List<String> value = tempTablse.get(key);
            List<String> _value = _tempTablse.get(key);
            if(_value!=null&&_value.size()>0){
                _value = remove(value,_value);//把_value中等于value中的去掉
                if(_value.size()>0){
                    _value = removeOutOfDataBase(_value, key); //去掉不存在于数据库中的
                    if (_value.size()>0){
                        map.put(key,_value);
                    }
                }
            }
        }
        return map;
    }

    /**
     *
     * @param typeXml            内外网区分
     * @param appName            应用名
     * @param sourceDBNameOld   修改前数据源名称
     * @param sourceDBName      修改后数据源名称
     * @return
     * @throws Ex
     */
    public String updateTargetSourceDBName(String typeXml, String appName, String sourceDBNameOld, String sourceDBName) throws Ex {
        xmlOperatorDAO.updateTargetSourceDBName(typeXml,appName,sourceDBNameOld,sourceDBName);
        return "修改成功,点击[确定]返回列表!";
    }

    /**
     *
     * @param privated
     * @param jdbcName
     * @return    true:正在使用,false:没有使用
     * @throws Ex
     */
    public boolean checkJdbcNameIsUsed(boolean privated, String jdbcName) throws Ex {
        return xmlOperatorDAO.getJdbcsByName(privated,jdbcName);
    }

    @Override
    public void setDataBaseDelete(String appName, String plugin) throws Ex {
        xmlOperatorDAO.setDataBaseDelete(appName,plugin);
    }

    @Override
    public String readExternalTypeChannelPort(String appName) throws Ex {
        Type type = xmlOperatorDAO.readExternalProxyType(appName,Type.s_app_proxy);
        return type.getChannelPort();
    }

    @Override
    public String[] getSysArray(String[] sysArray) throws Ex {
        String[] sys = xmlOperatorDAO.getSysLogClient();
        return StringUtils.arrayTrim(sys,sysArray);
    }

    @Override
    public String[] getSnmpArray(String[] snmpArray) throws Ex {
        String[] snmps = xmlOperatorDAO.getSNMPClient();
        return StringUtils.arrayTrim(snmps,snmpArray);
    }

    /**
     *
     * @param value   ["a","b","c"]
     * @param _value  ["d","e","c"]
     * @return         ["d","e"]
     */
    private List<String> remove(List<String> value, List<String> _value) {
        value.retainAll(_value);
        _value.removeAll(value);
        return _value;
    }

    /**
     *
     * @param value ["d","e"]
     * @param key   数据源 可以获取["e","f","g","h"]
     * @return      ["e"]
     */
    private List<String> removeOutOfDataBase(List<String> value, String key) throws Ex {
        Jdbc jdbc = xmlOperatorDAO.getExternalJdbcByName(key);
        IDataBase iDataBase = DBFactory.getDataBase(jdbc, Constant.DB_INTERNAL);
        iDataBase.openConnection();
        String[] tableNames = iDataBase.getTableNames();			//delete flag
        iDataBase.closeConnection();
        List<String> list = new ArrayList<String>(Arrays.asList(tableNames));
        list.retainAll(value);
        return list;
    }

    public void updateDBTypeTargetApp(TypeBase typeBase) throws Ex {
		xmlOperatorDAO.updateDBTypeTargetApp(typeBase);
	}

	public void updateDBTypeSourceData(TypeBase typeBase, TypeDB typeDB) throws Ex {
		xmlOperatorDAO.updateDBTypeSourceData(typeBase,typeDB);
	}

	public String readTableNames(Integer start, Integer limit, String typeXml, String tables, String appName, String dbName) throws Ex {
		String json = null;
		if("tables_1".equals(tables)){
            List list = xmlOperatorDAO.readSourceTables(typeXml, appName,dbName);
			int total = list.size();
			json = "{'success':true,'total':"+total+",'rows':[";
			if(total == 0){
				json +=",]}";
			}else {
				int index = 0;
				for (int i = 0; i < total; i++) {
					Table table = (Table) list.get(i);
					if(i==start&&index<limit){
						start ++;
						index ++;
						json += "{tableName:'"+table.getTableName()+"','seqnumber':'"+table.getSeqNumber()+"',interval:"+table.getInterval()+
								",monitorinsert:"+table.isMonitorInsert()+",monitordelete:"+table.isMonitorDelete()+
                                ",monitorupdate:"+table.isMonitorUpdate()+",status:'"+table.getStatus()+"'},";
					}
				}
				json +="]}";
			}
		}else if("tables_2".equals(tables)){
			String[] srcTableNames = xmlOperatorDAO.readTargetTableNames(typeXml,appName);
			int total = srcTableNames.length;
			json = "{'success':true,'total':"+total+",'rows':[";
			if(total == 0){
				json +=",]}";
			}else {
				int index = 0;
				for (int i = 0; i < total; i++) {
					if(i==start&&index<limit){
						start ++;
						index ++;
						json += "{'srcTableName':'"+srcTableNames[i]+"'},";
					}
				}
				json +="]}";
			}
		}
		return json;
	}

	public void updateDBTypeFields(TypeBase typeBase, String dbName, TypeTable typeTable, String[] fields, String[] is_pks) throws Ex {
		xmlOperatorDAO.updateDBTypeFields(typeBase,dbName,typeTable,fields,is_pks);
	}
	
	public String readThisTargetDBNames(Integer start, Integer limit,String typeXml, String srcTableName, String appName) throws Ex {
		String[] targetDBNames = xmlOperatorDAO.readThisTargetDBNames(typeXml,srcTableName,appName);
		int total = targetDBNames.length;
		String json = "{'success':true,'total':"+total+",'rows':[";
		if(total == 0){
			json +=",]}";
		}else {
			int index = 0;
			for (int i = 0; i < total; i++) {
				if(i==start&&index<limit){
					start ++;
					index ++;
					json += "{'targetDB':'"+targetDBNames[i]+"'},";
				}
			}
			json +="]}";
		}
		return json;
	}
	
	public String readThisTargetTableNames(Integer start, Integer limit, String typeXml, String srcTableName, String targetDB, String appName) throws Ex {
		String[] targetTableNames = xmlOperatorDAO.readThisTargetTableNames(typeXml,srcTableName,targetDB,appName);
		int total = targetTableNames.length;
		String json = "{'success':true,'total':"+total+",'rows':[";
		if(total == 0){
			json +=",]}";
		}else {
			int index = 0;
			for (int i = 0; i < total; i++) {
				if(i==start&&index<limit){
					start ++;
					index ++;
					json += "{'targetTable':'"+targetTableNames[i]+"'},";
				}
			}
			json +="]}";
		}
		return json;
	}

	public String readThisTargetTableField(String typeXml, String srcTableName, String targetDBName, String targetTableName, String appName) throws Ex {
		/*List<Field> fields = xmlOperatorDAO.getThisTargetTableField(typeXml,appName, sourceTableName, srcTableName, targetDBName, targetTableName);
		int total = fields.size();
		String json = "{'success':true,'total':"+total+",'rows':[";
		if(total == 0){
			json +=",]}";
		}else {
			for (Field field : fields) {
				json += "{'field':'"+field.getFieldName()+"','destField':'"+field.getDestField()+"','is_pk':'"+field.isPk()+
						"','is_null':'"+field.isNull()+"','jdbc_type':'"+field.getJdbcType()+
						"','column_size':'"+field.getColumnSize()+"','db_type':'"+field.getDbType()+"'},";
			}
            json += "]}";
        }
		return json;*/
        return "";
	}
	
	public String readThisTargetTableAttribute(String typeXml, String srcTableName, String targetDB, String targetTable, String appName) throws Ex {
		Table table = xmlOperatorDAO.getThisTargetTable(typeXml,appName,srcTableName, targetDB,targetTable);
		String json = null;
		if(table !=null){
			json = "{'success':true,'total':1,'rows':[{'condition':'"+table.getCondition()+"','deleteEnable':'"+table.isDeleteEnable()+"','onlyInsert':'"+table.isOnlyinsert()+"'},]}";
			
		}else{	
			json +="{'success':true,'total':0,'rows':[,]}";
		}
		return json;
	}
	
	public void updateDBTypeTargetFields(TypeBase typeBase, TypeTable typeTable, String[] fields, String[] is_pks) throws Ex {
		xmlOperatorDAO.updateDBTypeTargetFields(typeBase,typeTable,fields,is_pks);
	}
	
	public String deleteTypeSourceTable(String typeXml, String appName, String dbName, String[] tableNames) throws Ex {
		boolean isDelete = xmlOperatorDAO.deleteTypeSourceTable(typeXml,appName,dbName,tableNames);
		if(isDelete){
			return "删除成功,点击[确定]返回列表";
		}else{
			return "删除失败";
		}
	}
	public String deleteTypeSourceTableBackUp(String typeXml, String appName, String dbName, String tableName) throws Ex {
		boolean isDeleteBack = xmlOperatorDAO.deleteTypeSourceTableBackUp(typeXml,appName,dbName,tableName);
		if(isDeleteBack){
			return "删除恢复成功,点击[确定]返回列表";
		}else{
			return "删除恢复失败";
		}
	}

	public String deleteTypeSrcTable(String typeXml, String appName, String[] tableNames) throws Ex {
		boolean isDelete = xmlOperatorDAO.deleteTypeSrcTable(typeXml, appName, tableNames);
		if(isDelete){
			return "删除成功,点击[确定]返回列表";
		}else{
			return "删除失败";
		}
	}
	
	public String deleteDBTypeFields(String typeXml, String appName,String dbName, String tableName, String[] fields) throws Ex {
		boolean isDelete = xmlOperatorDAO.deleteDBTypeFields(typeXml,appName,dbName,tableName,fields);
		if(isDelete){
			return "{'success':true}";
		}else{
			return "{'success':false}";
		}
	}
	
	public String readSourceTableAttribute(String typeXml, String appName,String dbName, String tableName) throws Ex {
		Table table = xmlOperatorDAO.readSourceTable(typeXml,appName,dbName,tableName);
		String json = null;
		if(table !=null){
			json = "{'success':true,'total':1,'rows':[{'seqnumber':'"+table.getSeqNumber()+"','interval':'"+table.getInterval()+
					"','monitorinsert':"+table.isMonitorInsert()+",'monitordelete':"+table.isMonitorDelete()+",'monitorupdate':"+table.isMonitorUpdate()+"},]}";
			
		}else{	
			json +="{'success':true,'total':0,'rows':[{,]}";
		}
		return json;
	}
	
	public void saveTypeTargetDB(String typeXml, String appName, String srcTableName, String[] targetDBs) throws Ex {
		xmlOperatorDAO.saveTypeTargetDB(typeXml,appName,srcTableName,targetDBs);
	}
	
	public void deleteTypeTargetDB(String typeXml, String appName, String srcTableName, String[] targetDBs) throws Ex {
		xmlOperatorDAO.deleteTypeTargetDB(typeXml,appName,srcTableName,targetDBs);
	}
	
	public String deleteTypeTargetTable(String typeXml, String appName, String srcTableName, String targetDB, String[] targetTableNames) throws Ex {
		boolean isDelete = xmlOperatorDAO.deleteTypeTargetTable(typeXml,appName,srcTableName,targetDB,targetTableNames);
        if(isDelete){
			return "删除成功,点击[确定]返回列表";
		}else{
			return "删除失败";
		}
	}
	
	public void saveTypeTargetTableName(String typeXml, String appName, String srcTableName, String targetDB, String[] targetTableNames) throws Ex {
		xmlOperatorDAO.saveTypeTargetTableName(typeXml,appName,srcTableName,targetDB,targetTableNames);		
	}
	
	public String readTargetTypeNameKeyValue(String typeXml, String appType) throws Ex {
		String[] appNames = xmlOperatorDAO.readTypeName(typeXml,appType);
		int total = appNames.length;
		String json = "{'success':true,'total':"+total+",'rows':[";
		if(total == 0){
			json +=",]}";
		}else {
			for (int i = 0; i < total; i++) {
				json += "{'key':'"+appNames[i]+"','value':'"+appNames[i]+"'},";
			}
            json += "]}";
        }
		return json;
	}

    @Override
    public void updateTypeActive(String typeXml, String appName, boolean isActive) throws Ex {
        xmlOperatorDAO.updateTypeActive(typeXml,appName,isActive);
    }

    @Override
    public void updateSecurityFile(TypeBase typeBase) throws Ex {
        xmlOperatorDAO.updateSecurityFile(typeBase);
    }

    @Override
    public void updateSecurityDB(TypeBase typeBase) throws Ex {
        xmlOperatorDAO.updateSecurityDB(typeBase);
    }

    @Override
    public void updateSecurityProxy(TypeBase typeBase, TypeSafe typeSafe) throws Ex {
        xmlOperatorDAO.updateSecurityProxy(typeBase,typeSafe);
    }

    @Override
    public String readTypeNameKeyValue(String plugin, String appType) throws Ex {
        String[] appNames = null;
        if("reset".equals(appType)) {
            appNames = xmlOperatorDAO.getTypesByActive("external",true);
        } else {
            appNames = xmlOperatorDAO.readTypeNameSingle(plugin,appType);
        }
		int total = appNames.length;
		String json = "{success:true,total:"+total+",rows:[";
        for (int i = 0; i < total; i++) {
            json += "{key:'"+appNames[i]+"',value:'"+appNames[i]+"'},";
        }
        json += "]}";
        return json;
    }

    @Override
    public String readChannel() throws Ex, IOException {
        List<Channel> list = xmlOperatorDAO.readChannel();
        String json = "{success:true,total:"+list.size()+",rows:[";
        String s1 = "";
        String r1 = "";
        String s2 = "";
        String r2 = "";
        if(StringUtils.getPrivated()){//内网
            String[][] params = new String[][] {
                    { "SERVICEREQUESTTYPE", "SERVICECONTROLPOST" },
                    { "Command", "initreceive" }
            };
            ServiceResponse serviceResponse = ServiceUtil.callService(params);
            if (serviceResponse.getCode()==200) {
                JSONObject obj = JSONObject.fromObject(serviceResponse.getData());
                s1 = obj.getString("s1");
                r1 = obj.getString("r1");
                s2 = obj.getString("s2");
                r2 = obj.getString("r2");
            } else {
                s1 = "取值错误";
                r1 = "取值错误";
                s2 = "取值错误";
                r2 = "取值错误";
            }
        }
        String mac1 = "00:99:00:99:00:11";
        String mac2 = "00:99:00:99:00:99";
        OSInfo osInfo = OSInfo.getOSInfo();
        if(osInfo.isLinux()&&!StringUtils.getPrivated()){
            String fileName = "/etc/ethers";
            File file = new File(fileName);
            if(file.exists()) {
                List<String> ipMacs = FileUtil.readFileLines(fileName);
                for(Channel channel : list){
                    String tIp = channel.gettIp();
                    if("1".equals(channel.getChannelValue())){
                        for(String ipMac : ipMacs){
                            if(ipMac.startsWith(tIp)){
                                mac1 = ipMac.split("\\s")[1];
                            }
                        }
                    }
                    if("2".equals(channel.getChannelValue())){
                        for(String ipMac : ipMacs){
                            if(ipMac.startsWith(tIp)){
                                mac2 = ipMac.split("\\s")[1];
                            }
                        }
                    }
                }
            } else {
                for(Channel channel : list){
                    if("1".equals(channel.getChannelValue())){
                        mac1 = "00:99:00:99:00:11";
                    }
                    if("2".equals(channel.getChannelValue())){
                        mac2 = "00:99:00:99:00:99";
                    }
                }
            }
        }
        for(Channel channel : list){
            json += "{privated:"+channel.getPrivated()+",channelCount:" + LicenseUtils.getChannelCount() +
                    ",s1:'"+s1+"',r1:'"+r1+
                    "',s2:'"+s2+"',r2:'"+r2+
                    "',mac1:'"+mac1+"',mac2:'"+mac2+
                    "',count:'"+channel.getCount()+"',size:'"+channel.getSize()+"'},";
        }
        json += "]}";
        return json;
    }

    public List<Channel> readChannels() throws Ex{
        List<Channel> list = xmlOperatorDAO.readChannel();
        return list;
    }

    public String updateChannel(Boolean privated, List<Channel> channels) throws Ex {
        xmlOperatorDAO.updateChannel(privated,channels);
        return "初始化设置成功";
    }

    public String updateChannelCount(Boolean privated, String count) throws Ex{
        xmlOperatorDAO.updateChannelCount(privated,count);
        return "初始化设置成功";
    }

    @Override
    public String readChannelKeyValue() throws Ex {
        int channelCount = LicenseUtils.getChannelCount();
        String json = "{success:true,total:"+channelCount+",rows:[";
        if(channelCount==1){
            json += "{key:'通道一',value:1}";
        } else if(channelCount==2) {
            json += "{key:'通道一',value:1},{key:'通道二',value:1}";
        }
        json += "]}";
//        List<Channel> list = xmlOperatorDAO.readChannel();
//        String json = "{success:true,total:"+list.size()+",rows:[";
//        for(Channel channel : list){
//            String key = null;
//            if(channel.getChannelValue().equals("1")){
//                key = "通道一";
//            } else if(channel.getChannelValue().equals("2")) {
//                key = "通道二";
//            }
//            json += "{key:'"+key+"',value:'"+channel.getChannelValue()+"'},";
//        }
//        json += "]}";
        return json;
    }

    @Override
    public String checkAppPort(int channelPort) throws Ex {
        boolean isExit  = xmlOperatorDAO.isExistExternalChannelPort(channelPort);
		if(isExit){
			return "该通道端口["+channelPort+"]已经被使用!";
	    }
        return "0000";
    }

    @Override
    public void updateTypeAppSend(String appName, int status) throws Ex {
        xmlOperatorDAO.updateTypeAppSend(appName,status);
    }

    @Override
    public String readTypeNameForBusiness(String xmlType) throws Ex {
        List<Type> list = xmlOperatorDAO.readTypeNameForBusiness(xmlType);
        String json = "{success:true,total:"+list.size()+",rows:[";
        for ( Type type : list){
            json += "{biz:'"+type.getTypeName()+"'},";
        }
        json +="]}";
        return json;
    }

    @Override
    public void updateChangeUtils(ChannelIChangeUtils channelIChangeUtils) throws Ex {
        xmlOperatorDAO.updateChangeUtils(channelIChangeUtils);
    }

    @Override
    public String selectChangeUtils() throws Ex {
        IChangeUtils iChangeUtils = xmlOperatorDAO.getIChangeUtils();
        String json = "{success:true,total:1,rows:[{restarttime:'"+iChangeUtils.getRestartTime()+"',interval:"+iChangeUtils.getInterval()+
                ",gcinterval:"+iChangeUtils.getGcInterval()+",recover:"+iChangeUtils.getRecover()+
                ",systemmeantime:"+iChangeUtils.getSystemMeantime()+",virusscan:'"+iChangeUtils.getVirusscan()+"',flag:'1'}]}";
        return json;
    }

    @Override
    public void saveRestartTime(String time) throws Ex {
        xmlOperatorDAO.saveRestartTime(time);
    }

    @Override
    public String readSNMP(int start, int limit) throws Ex {
        String[] sNMPClients = xmlOperatorDAO.getSNMPClient();
        String jsonData = null;
        if(sNMPClients.length == 0){
            jsonData = "{success:true,total:0,rows:[]}";
        }else{
            jsonData = "{success:true,total:"+sNMPClients.length+",rows:[";
            int index = 0;
            for(int i = 0 ; i < sNMPClients.length ; i ++){
                if(i==start&&index<limit){
                    start ++;
                    index ++;
                    jsonData +="{snmpclient:'"+sNMPClients[i]+"',flag:'2'},";
                }
            }
            jsonData += "]}";
        }
        return jsonData;
    }

    @Override
    public String readSysLog(int start, int limit) throws Ex {
        String[] sysLogClients = xmlOperatorDAO.getSysLogClient();
        String jsonData = null;
        if(sysLogClients.length == 0){
            jsonData = "{success:true,total:0,rows:[]}";
        }else{
            jsonData = "{success:true,total:"+sysLogClients.length+",rows:[";
            int index = 0;
            for(int i = 0 ; i < sysLogClients.length ; i ++){
                if(i==start&&index<limit){
                    start ++;
                    index ++;
                    jsonData +="{syslogclient:'"+sysLogClients[i]+"',flag:'2'},";
                }
            }
            jsonData += "]}";
        }
        return jsonData;
    }

    @Override
    public String checkSNMPClient(String snmpclient) throws Ex {
        String[] clients = xmlOperatorDAO.getSNMPClient();
        for(int i = 0; i<clients.length;i++){
            if(snmpclient.equals(clients[i])){
                return "这个SNMPClient已经存在！";
            }
        }
        return "0000";
    }

    @Override
    public String checkSysLogClient(String syslogclient) throws Ex {
        String[] clients = xmlOperatorDAO.getSysLogClient();
        for(int i = 0; i<clients.length;i++){
            if(syslogclient.equals(clients[i])){
                return "这个SysLogClient已经存在！";
            }
        }
        return "0000";
    }

    @Override
    public void saveSNMPClient(String ip) throws Ex {
        xmlOperatorDAO.saveSNMPClient(ip);
    }

    @Override
    public void saveSysLogClient(String ip) throws Ex {
        xmlOperatorDAO.saveSysLogClient(ip);
    }

    @Override
    public void deleteSNMPClient(String ip) throws Ex {
        xmlOperatorDAO.deleteSNMPClient(ip);
    }

    @Override
    public void deleteSysLogClient(String ip) throws Ex {
        xmlOperatorDAO.deleteSysLogClient(ip);
    }

    @Override
    public void updateSNMPClient(String snmpclient, String oldSNMPClient) throws Ex {
        xmlOperatorDAO.updateSNMPClient(snmpclient,oldSNMPClient);
    }

    @Override
    public void updateSysLogClient(String syslogclient, String oldSysLogClient) throws Ex {
        xmlOperatorDAO.updateSysLogClient(syslogclient,oldSysLogClient);
    }

    @Override
    public void updateTypeAllow(String plugin, String appName, boolean isAllow) throws Ex {
        xmlOperatorDAO.updateTypeAllow(plugin,appName,isAllow);
    }

    @Override
    public String queryByNameType(String appName,String appType) throws Ex {
        Type ex = xmlOperatorDAO.getExternalTypeByName(appName);
        Type in = xmlOperatorDAO.getInternalTypeByName(appName);
        String json = null;
        if(appType.equals("file")){
            SourceFile sourceFile = xmlOperatorDAO.getSourceFiles(StringContext.EXTERNAL,ex.getTypeName());
            TargetFile targetFile = xmlOperatorDAO.getTargetFiles(StringContext.INTERNAL,in.getTypeName());
            json = "{success:true,appName:'"+ex.getTypeName()+"',appDesc:'"+ex.getDescription()+"',isAllow:"+ex.isAllow()+",speed:"+ex.getSpeed()+
                    ",t_appName:'"+in.getTypeName()+"',t_appDesc:'"+in.getDescription()+"',t_isAllow:"+in.isAllow()+
                    ",appType:'"+ex.getAppType()+"',isActive:"+ex.isActive()+",channel:'"+ex.getChannel()+"',channelport:"+ex.getChannelPort()+
                    ",t_appType:'"+in.getAppType()+"',t_isActive:"+in.isActive()+
                    ",isFilter:"+ex.isFilter()+",isVirusScan:"+ex.isVirusScan()+",infoLevel:" +ex.getInfoLevel()+
                    ",t_isFilter:"+in.isFilter()+",t_isVirusScan:"+in.isVirusScan()+",t_infoLevel:" +in.getInfoLevel()+
                    ",t_dir:'"+targetFile.getDir()+"',t_serverAddress:'"+targetFile.getServerAddress()+
                    "',t_port:'"+targetFile.getPort()+"',t_userName:'"+targetFile.getUserName()+
                    "',t_charset:'"+targetFile.getCharset()+"',t_deleteFile:'"+targetFile.isDeletefile()+
                    "',t_onlyAdd:'"+targetFile.isOnlyadd()+
                    "',t_isTwoWay:'"+targetFile.isIstwoway()+"',t_packetSize:'"+targetFile.getPacketsize()+
                    "',t_fileListSize:'"+targetFile.getFilelistsize()+"',t_threads:'"+targetFile.getThreads()+
                    "',dir:'"+sourceFile.getDir()+"',serverAddress:'"+sourceFile.getServerAddress()+
                    "',port:'"+sourceFile.getPort()+"',filterTypes:'"+sourceFile.getFiltertypes()+
                    "',notFilterTypes:'"+sourceFile.getNotfiltertypes()+"',interval:'"+sourceFile.getInterval()+
                    "',charset:'"+sourceFile.getCharset()+"',protocol:'"+sourceFile.getProtocol()+
                    "',userName:'"+sourceFile.getUserName()+
                    "',deleteFile:'"+sourceFile.isDeletefile()+"',isIncludeSubDir:'"+sourceFile.isIsincludesubdir()+
                    "',fileListSize:'"+sourceFile.getFilelistsize()+"',packetSize:'"+sourceFile.getPacketsize()+
                    "',threads:'"+sourceFile.getThreads()+"',t_protocol:'"+targetFile.getProtocol()+
                    "',isTwoWay:'"+sourceFile.isIstwoway()+"'}";
        } else if(appType.equals("db")){
            DataBase s = xmlOperatorDAO.getDataBase(StringContext.EXTERNAL, ex.getTypeName());
            String t = xmlOperatorDAO.getSrcdbName(StringContext.INTERNAL,in.getTypeName());
            json = "{success:true,appName:'"+ex.getTypeName()+"',appDesc:'"+ex.getDescription()+"',appType:'"+ex.getAppType()+"',isAllow:"+ex.isAllow()+",speed:"+ex.getSpeed()+
                    ",t_appName:'"+in.getTypeName()+"',t_appDesc:'"+in.getDescription()+"',t_appType:'"+in.getAppType()+"',t_isAllow:"+in.isAllow()+
                    ",channel:'"+ex.getChannel()+"',channelport:'"+ex.getChannelPort()+"',status:'"+ex.getStatus()+
                    "',t_channel:'"+in.getChannel()+"',t_channelport:'"+in.getChannelPort()+"',t_status:'"+in.getStatus()+
				    "',isActive:"+ex.isActive()+",isLocal:"+ex.isLocal()+",isRecover:"+ex.isRecover()+ ",infoLevel:" +ex.getInfoLevel()+
				    ",t_isActive:"+in.isActive()+",t_isLocal:"+in.isLocal()+",t_isRecover:"+in.isRecover()+ ",t_infoLevel:" +in.getInfoLevel()+
                    ",isFilter:"+ex.isFilter()+",isVirusScan:"+ex.isVirusScan()+
                    ",t_isFilter:"+in.isFilter()+",t_isVirusScan:"+in.isVirusScan()+
				    ",dataPath:'"+ex.getDataPath()+"',deleteFile:"+ex.isDeleteFile()+
				    ",t_dataPath:'"+in.getDataPath()+"',t_deleteFile:"+in.isDeleteFile()+
                    ",dbName:'"+s.getDbName()+"',oldStep:"+s.isOldStep()+",operation:'"+s.getOperation()+"',enable:"+s.isEnable()+
					",tempTable:'"+s.getTempTable()+"',maxRecords:"+s.getMaxRecords()+",interval:"+s.getInterval()+
					",isTwoway:"+s.isTwoway()+",srcdbName:'"+t+"'}";
        } else if(appType.equals("proxy")){
            SocketChange s = xmlOperatorDAO.getSocketChange(StringContext.EXTERNAL, Plugin.s_source_plugin,ex.getTypeName());
			SocketChange t = xmlOperatorDAO.getSocketChange(StringContext.INTERNAL, Plugin.s_target_plugin,in.getTypeName());
            json = "{success:true,appName:'"+ex.getTypeName()+"',appDesc:'"+ex.getDescription()+"',isAllow:"+ex.isAllow()+
                    ",t_appName:'"+in.getTypeName()+"',t_appDesc:'"+in.getDescription()+"',t_isAllow:"+in.isAllow()+
                    ",appType:'"+ex.getAppType()+"',isActive:"+ex.isActive()+",channel:'"+ex.getChannel()+"',channelport:"+ex.getChannelPort()+
                    ",t_appType:'"+in.getAppType()+"',t_isActive:'"+in.isActive()+
                    "',isFilter:"+ex.isFilter()+",isVirusScan:"+ex.isVirusScan()+ ",infoLevel:" +ex.getInfoLevel()+
                    ",t_isFilter:"+in.isFilter()+",t_isVirusScan:"+in.isVirusScan()+ ",t_infoLevel:" +in.getInfoLevel()+
                    ",t_name:'"+t.getName()+"',t_serverAddress:'"+t.getServerAddress()+
                    "',t_port:'"+t.getPort()+"',t_poolMin:'"+t.getPoolMin()+
                    "',t_poolMax:'"+t.getPoolMax()+"',t_tryTime:'"+t.getTryTime()+
                    "',t_charset:'"+t.getCharset()+"',t_type:'"+t.getType()+
                    "',t_ipfilter:"+t.getIpfilter()+
                    ",authca:'"+s.getAuthca()+"',authaddress:'"+s.getAuthaddress()+
                    "',authport:'"+s.getAuthport()+"',authcapass:'"+
                    "',clientauthenable:"+s.isClientauthenable()+",ipfilter:"+s.getIpfilter()+
                    ",name:'"+s.getName()+"',serverAddress:'"+s.getServerAddress()+
                    "',port:'"+s.getPort()+"',poolMin:'"+s.getPoolMin()+
                    "',poolMax:'"+s.getPoolMax()+"',tryTime:'"+s.getTryTime()+
                    "',charset:'"+s.getCharset()+"',type:'"+s.getType()+"'}";
        }
        return json;
    }

    @Override
    public String updateDBSourceDataType(String beforeUpdate, String afterUpdate, TypeBase typeBase, TypeDB typeDB, boolean operateDB) throws Ex {
        if(afterUpdate.equals("trigger")){
            xmlOperatorDAO.updateToTrigger(typeBase,typeDB,operateDB);
        } else {
            xmlOperatorDAO.updateTriggerTo(typeBase,typeDB,operateDB);
        }
        return null;
    }

    public String checkAppName(String appName) throws Ex {
        boolean isExitExternalS  = xmlOperatorDAO.isExistExternalTypeS(appName);
		if(isExitExternalS){
			return "该应用编号已经存在!";
	    }
        return "0000";
    }


    public String checkAppName(String typeXml, String appName) throws Ex {
		if("internal".equals(typeXml)){
			boolean isExistInternalS = xmlOperatorDAO.isExistInternalTypeS(appName);
			if(isExistInternalS == true ){
				return "该应用名为非法的应用名！";
			}
		}else if("external".equals(typeXml)){
			boolean isExitExternalS  = xmlOperatorDAO.isExistExternalTypeS(appName);
			if(isExitExternalS == true  ){
				return "该应用名为非法的应用名！";
			}
		}
        return "0000";
	}

    public String checkAppDesc(String typeXml, String appDesc) throws Ex {
		if("internal".equals(typeXml)){
			boolean isExistInternalS = xmlOperatorDAO.isExistInternalTypeDescT(appDesc);
			if(isExistInternalS == true ){
				return "该应用名已经存在！";
			}
		}else if("external".equals(typeXml)){
			boolean isExitExternalS  = xmlOperatorDAO.isExistExternalTypeDescS(appDesc);
			if(isExitExternalS == true  ){
				return "该应用名已经存在！";
			}
		}
        return "0000";
	}

	public Jdbc getJdbc(TypeBase typeBase,String dbName) throws Ex {
		List<Jdbc> jdbcs = new ArrayList<Jdbc>();
		if(typeBase.getPrivated()){
			jdbcs = xmlOperatorDAO.getInternalJdbc();
		}else{
			jdbcs = xmlOperatorDAO.getExternalJdbc();
		}
		for (Jdbc jdbc : jdbcs) {
			if(dbName.equals(jdbc.getJdbcName())){
				return jdbc;
			}
		}
		return null;
	}
	
	public boolean isExistJdbc(TypeBase typeBase,String dbName) throws Ex {
		List<Jdbc> jdbcs = new ArrayList<Jdbc>();
		if(typeBase.getPrivated()){
			jdbcs = xmlOperatorDAO.getInternalJdbc();
		}else{
			jdbcs = xmlOperatorDAO.getExternalJdbc();
		}
		for (Jdbc jdbc : jdbcs) {
			if(dbName.equals(jdbc.getJdbcName())){
				return true;
			}
		}
		return false;
	}

    @Override
    public String checkJdbcName(String jdbcName, String typeXml) throws Ex {
        List<Jdbc> jdbcs = new ArrayList<Jdbc>();
		if(typeXml.equals(StringContext.INTERNAL)){
			jdbcs = xmlOperatorDAO.getInternalJdbc();
		}else if(typeXml.equals(StringContext.EXTERNAL)) {
			jdbcs = xmlOperatorDAO.getExternalJdbc();
		}
		for (Jdbc jdbc : jdbcs) {
			if(jdbcName.equals(jdbc.getJdbcName())){
				return "数据源名称已经存在";
			}
		}
        return "0000";
    }

    public String readProxyType(Integer start, Integer limit, String appType) throws Ex {
        Map<Integer, Map<Integer, Map<String,Object>>> proxyTypes = xmlOperatorDAO.readProxyType(appType);

        int total = proxyTypes.size();
        String json = "{'success':true,'total':"+total+",rows:[";
        if(total == 0){
            json += ",]}";
        }else {
            int index = 0;
            for (int i = 0; i < total; i++) {
                if(i==start&&index<limit){
                    start ++;
                    index ++;
                    Map<Integer, Map<String,Object>> types = proxyTypes.get(i);
                    Map<String,Object> map = types.get(1);
                    Type type = (Type)map.get("type");
                    SocketChange socketChange = (SocketChange) map.get("socketChange");
                    Map<String,Object> t_map = types.get(2);
                    Type t_type = null;
                    SocketChange t_socketChange = null;
                    String appName = null;
                    if(t_map!=null){
                    	t_type = (Type) t_map.get("type");
                    	t_socketChange = (SocketChange) t_map.get("socketChange");                  	
                    	if(type!=null){
                    		appName = type.getTypeName();
                    	}else if(t_type!=null){
                    		appName = t_type.getTypeName();
                    	}
                    }else{
                    	appName = type.getTypeName();
                    }
                    if(socketChange!=null||t_socketChange!=null){
                    	json += "{'appName':'"+appName+"','t_serverAddress':'"+(t_socketChange==null?"":t_socketChange.getServerAddress().split(":")[0])+
                    	"','t_port':'"+ setTPort(t_socketChange)+"','t_type':'"+(t_socketChange==null?"":t_socketChange.getType())+
                    	"','serverAddress':'"+(socketChange==null?"":socketChange.getServerAddress())+
                    	"','port':'"+(socketChange==null?"":socketChange.getPort())+"','type':'"+(socketChange==null?"":socketChange.getType())+"'},";
                    }
                }
            }
        }
        json += "]}";
        return json;
    }

	private String setTPort(SocketChange t_socketChange) {
		if(t_socketChange!=null){
			String[] ports = t_socketChange.getServerAddress().split(":");
			if(ports.length == 2){
				return t_socketChange.getServerAddress().split(":")[1];
			}else if(ports.length == 3){
				return t_socketChange.getServerAddress().split(":")[1]+":"+t_socketChange.getServerAddress().split(":")[2];
			}
			return null;
		}else{
			return "";
		}
	}

    /**
     * 读取根节点属性
     */
    public String readRootDesc(String type,String fileName) throws Ex {
        return xmlOperatorDAO.readRootDesc(type, fileName);
    }

    /**
     *
     *
     *
     * @param pathFile    保存后的文件全名
     * @param text   根节点属性内容
     * @throws Ex
     */
    public void updateDescription(String pathFile, String text) throws Ex {
        xmlOperatorDAO.updateDescription(pathFile, text);
    }

    /**
	 * 保存文件同步应用
	 */
	public void saveFileType(TypeBase typeBase, TypeFile typeFile) throws Ex {
		xmlOperatorDAO.saveFileType(typeBase,typeFile);		
	}
	
	/**
	 * 修改文件同步应用
	 */
	public void updateFileType(TypeBase typeBase, TypeFile typeFile) throws Ex {
		xmlOperatorDAO.updateFileType(typeBase,typeFile);
	}

    /**
     * 读取可信代理应用的黑名单
     */
    public String readInternalProxyBlackIpMac(Integer start, Integer limit, String appName, String proxyType) throws Ex {
        Type type = xmlOperatorDAO.getInternalTypeByName(appName);
        IpMac[] ipMacs = null;
        SocketChange socketChange = type.getPlugin().getSourceSocket();
        if(socketChange != null){
            ipMacs = socketChange.getIpblacklist();
        } else {
            socketChange = type.getPlugin().getTargetSocket();
            if(socketChange!=null){
                ipMacs = socketChange.getIpblacklist();
            }
        }
        String json = "{success:true,total:" +ipMacs.length+",rows:[";
        int count = 0;
        for (int i=0; i<ipMacs.length;i++){
            if(i==start && count< limit){
                json += "{ip:'"+ipMacs[i].getIp()+"',mac:'"+ipMacs[i].getMac()+"'},";
                start ++;
                count ++;
            }
        }
        json += "]}";
        return json;
    }

    /*
     *  读取可信代理应用的白名单
     */
    public String readInternalProxyWhiteIpMac(Integer start, Integer limit, String appName, String proxyType) throws Ex {
        Type type = xmlOperatorDAO.getInternalTypeByName(appName);
        IpMac[] ipMacs = null;
        SocketChange socketChange = type.getPlugin().getSourceSocket();
        if(socketChange != null){
            ipMacs = socketChange.getIpwhitelist();
        } else {
            socketChange = type.getPlugin().getTargetSocket();
            if(socketChange!=null){
                ipMacs = socketChange.getIpwhitelist();
            }
        }
        String json = "{success:true,total:" +ipMacs.length+",rows:[";
        int count = 0;
        for (int i=0; i<ipMacs.length;i++){
            if(i==start && count< limit){
                json += "{ip:'"+ipMacs[i].getIp()+"',mac:'"+ipMacs[i].getMac()+"'},";
                start ++;
                count ++;
            }
        }
        json += "]}";
        return json;
    }

    /**
     * 读取非可信代理应用的黑名单
     */
    public String readExternalProxyBlackIpMac(Integer start, Integer limit, String appName, String proxyType) throws Ex {
        Type type = xmlOperatorDAO.getExternalTypeByName(appName);
        IpMac[] ipMacs = null;
        SocketChange socketChange = type.getPlugin().getSourceSocket();
        if(socketChange != null){
            ipMacs = socketChange.getIpblacklist();
        } else {
            socketChange = type.getPlugin().getTargetSocket();
            if(socketChange!=null){
                ipMacs = socketChange.getIpblacklist();
            }
        }
        String json = "{success:true,total:" +ipMacs.length+",rows:[";
        int count = 0;
        for (int i=0; i<ipMacs.length;i++){
            if(i==start && count< limit){
                json += "{ip:'"+ipMacs[i].getIp()+"',mac:'"+ipMacs[i].getMac()+"'},";
                start ++;
                count ++;
            }
        }
        json += "]}";
        return json;
    }

    /**
     * 读取非可信代理应用的白名单
     */
    public String readExternalProxyWhiteIpMac(Integer start, Integer limit, String appName, String proxyType) throws Ex {
        Type type = xmlOperatorDAO.getExternalTypeByName(appName);
        IpMac[] ipMacs = null;
        SocketChange socketChange = type.getPlugin().getSourceSocket();
        if(socketChange != null){
            ipMacs = socketChange.getIpwhitelist();
        } else {
            socketChange = type.getPlugin().getTargetSocket();
            if(socketChange!=null){
                ipMacs = socketChange.getIpwhitelist();
            }
        }
        String json = "{success:true,total:" +ipMacs.length+",rows:[";
        int count = 0;
        for (int i=0; i<ipMacs.length;i++){
            if(i==start && count< limit){
                json += "{ip:'"+ipMacs[i].getIp()+"',mac:'"+ipMacs[i].getMac()+"'},";
                start ++;
                count ++;
            }
        }
        json += "]}";
        return json;
    }


    public String checkInternalProxyBlackIp(String appName, String ip) throws Ex {
        Type type = xmlOperatorDAO.getInternalTypeByName(appName);
        IpMac[] ipMacs = null;
        SocketChange socketChange = type.getPlugin().getSourceSocket();
        if(socketChange != null){
            ipMacs = socketChange.getIpblacklist();
        } else {
            socketChange = type.getPlugin().getTargetSocket();
            if(socketChange!=null){
                ipMacs = socketChange.getIpblacklist();
            }
        }
        for (int i=0; i<ipMacs.length;i++ ){
            if(ip.equals(ipMacs[i].getIp())){
                return "这个IP已经存在!";
            }
        }
        return "0000";
    }

    @Override
    public String checkExternalProxyBlackIp(String appName, String ip) throws Ex {
        Type type = xmlOperatorDAO.getExternalTypeByName(appName);
        IpMac[] ipMacs = null;
        SocketChange socketChange = type.getPlugin().getSourceSocket();
        if(socketChange != null){
            ipMacs = socketChange.getIpblacklist();
        } else {
            socketChange = type.getPlugin().getTargetSocket();
            if(socketChange!=null){
                ipMacs = socketChange.getIpblacklist();
            }
        }
        for (int i=0; i<ipMacs.length;i++ ){
            if(ip.equals(ipMacs[i].getIp())){
                return "这个IP已经存在!";
            }
        }
        return "0000";
    }

    @Override
    public String checkInternalProxyWhiteIp(String appName, String ip) throws Ex {
        Type type = xmlOperatorDAO.getInternalTypeByName(appName);
        IpMac[] ipMacs = null;
        SocketChange socketChange = type.getPlugin().getSourceSocket();
        if(socketChange != null){
            ipMacs = socketChange.getIpwhitelist();
        } else {
            socketChange = type.getPlugin().getTargetSocket();
            if(socketChange!=null){
                ipMacs = socketChange.getIpwhitelist();
            }
        }
        for (int i=0; i<ipMacs.length;i++ ){
            if(ip.equals(ipMacs[i].getIp())){
                return "这个IP已经存在!";
            }
        }
        return "0000";
    }

    @Override
    public String checkExternalProxyWhiteIp(String appName, String ip) throws Ex {
        Type type = xmlOperatorDAO.getExternalTypeByName(appName);
        IpMac[] ipMacs = null;
        SocketChange socketChange = type.getPlugin().getSourceSocket();
        if(socketChange != null){
            ipMacs = socketChange.getIpwhitelist();
        } else {
            socketChange = type.getPlugin().getTargetSocket();
            if(socketChange!=null){
                ipMacs = socketChange.getIpwhitelist();
            }
        }
        for (int i=0; i<ipMacs.length;i++ ){
            if(ip.equals(ipMacs[i].getIp())){
                return "这个IP已经存在!";
            }
        }
        return "0000";
    }

    @Override
    public void saveInternalProxyBlackIpMac(String appName, IpMac[] ipMacs) throws Ex {
        xmlOperatorDAO.saveInternalProxyBlackIpMac(appName,ipMacs);
    }

    @Override
    public void saveExternalProxyBlackIpMac(String appName, IpMac[] ipMacs) throws Ex {
        xmlOperatorDAO.saveExternalProxyBlackIpMac(appName, ipMacs);
    }

    @Override
    public void saveInternalProxyWhiteIpMac(String appName, IpMac[] ipMacs) throws Ex {
        xmlOperatorDAO.saveInternalProxyWhiteIpMac(appName, ipMacs);
    }

    @Override
    public void saveExternalProxyWhiteIpMac(String appName, IpMac[] ipMacs) throws Ex {
        xmlOperatorDAO.saveExternalProxyWhiteIpMac(appName, ipMacs);
    }

    @Override
    public void deleteInternalProxyBlackIpMac(String appName, IpMac[] ipMacs) throws Ex {
        xmlOperatorDAO.deleteInternalProxyBlackIpMac(appName,ipMacs);
    }

    @Override
    public void deleteExternalProxyBlackIpMac(String appName, IpMac[] ipMacs) throws Ex {
        xmlOperatorDAO.deleteExternalProxyBlackIpMac(appName, ipMacs);
    }

    @Override
    public void deleteInternalProxyWhiteIpMac(String appName, IpMac[] ipMacs) throws Ex {
        xmlOperatorDAO.deleteInternalProxyWhiteIpMac(appName, ipMacs);
    }

    @Override
    public void deleteExternalProxyWhiteIpMac(String appName, IpMac[] ipMacs) throws Ex {
        xmlOperatorDAO.deleteExternalProxyWhiteIpMac(appName, ipMacs);
    }

    @Override
    public void updateInternalProxyBlackIpMac(String appName, IpMac ipMac, String oldUpdateIp) throws Ex {
        xmlOperatorDAO.updateInternalProxyBlackIpMac(appName,ipMac,oldUpdateIp);
    }

    @Override
    public void updateExternalProxyBlackIpMac(String appName, IpMac ipMac, String oldUpdateIp) throws Ex {
        xmlOperatorDAO.updateExternalProxyBlackIpMac(appName,ipMac,oldUpdateIp);
    }

    @Override
    public void updateInternalProxyWhiteIpMac(String appName, IpMac ipMac, String oldUpdateIp) throws Ex {
        xmlOperatorDAO.updateInternalProxyWhiteIpMac(appName,ipMac,oldUpdateIp);
    }

    @Override
    public void updateExternalProxyWhiteIpMac(String appName, IpMac ipMac, String oldUpdateIp) throws Ex {
        xmlOperatorDAO.updateExternalProxyWhiteIpMac(appName,ipMac,oldUpdateIp);
    }


}
