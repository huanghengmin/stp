DROP TABLE IF EXISTS `account_role`;
DROP TABLE IF EXISTS `role_permission`;
DROP TABLE IF EXISTS `account`;

DROP TABLE IF EXISTS `permission`;
CREATE TABLE `permission` (
  `ID` bigint(20) NOT NULL DEFAULT '0',
  `CODE` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `NAME` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `DESCRIPTION` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `PARENT_ID` int(11) DEFAULT NULL,
  `SEQ` int(11) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='权限表';
LOCK TABLES `permission` WRITE;
INSERT INTO `permission` VALUES (100,'TOP_QXGL','权限管理',NULL,0,0),(101,'SECOND_YHGL','用户管理',NULL,100,1),(102,'SECOND_JSGL','角色管理',NULL,100,2),(103,'SECOND_AQCL','安全策略',NULL,100,3),(110,'TOP_WLGL','网络管理',NULL,0,0),(111,'SECOND_JKGL','接口管理',NULL,110,1),(112,'SECOND_LYGL','路由管理',NULL,110,2),(113,'SECOND_WLCS','网络测试',NULL,110,3),(114,'SECOND_AQPZ','安全配置',NULL,110,4),(120,'TOP_XTGL','系统管理',NULL,0,0),(121,'SECOND_PTSM','平台说明',NULL,120,1),(122,'SECOND_INIT_S','平台初始化',NULL,120,2),(123,'SECOND_PTGL','平台管理',NULL,120,3),(124,'SECOND_ZSGL','许可证管理',NULL,120,4),(125,'SECOND_RZXZ','日志下载',NULL,120,5),(126,'SECOND_BBSJ','版本升级',NULL,120,6),(127,'SECOND_YD_PZHF','源端配置恢复',NULL,120,7),(128,'SECOND_MB_PZHF','目标配置恢复',NULL,120,8),(129,'SECOND_YD_PZWJGL','源端配置文件管理',NULL,120,9),(130,'SECOND_MB_PZWJGL','目标配置文件管理',NULL,120,10),(131,'SECOND_PTPZ','平台配置',NULL,120,11),(132,'SECOND_HFCCSZ','恢复出厂设置',NULL,120,12),(133,'SECOND_INIT_T','平台初始化',NULL,120,13),(140,'TOP_PZGL','配置管理',NULL,0,0),(141,'SECOND_SJKPZ','审计库配置',NULL,140,1),(142,'SECOND_BJPZ','报警配置',NULL,140,2),(143,'SECOND_SBPZ','设备配置',NULL,140,3),(144,'SECOND_SJRB','双机热备',NULL,140,4),(145,'SECOND_XXAQCL','信息安全策略',NULL,140,5),(146,'SECOND_GLPZ','过滤配置',NULL,140,6),(160,'TOP_SJGL','审计日志',NULL,0,0),(161,'SECOND_YHRZ','管理员日志',NULL,160,1),(162,'SECOND_SBRZ','设备日志',NULL,160,2),(163,'SECOND_YWRZ','业务日志',NULL,160,3),(166,'SECOND_XTRZ','系统日志',NULL,160,6),(170,'TOP_BJGL','报警管理',NULL,0,0),(171,'SECOND_YWYCBJ','业务异常报警',NULL,170,1),(172,'SECOND_AQSJBJ','安全事件报警',NULL,170,2),(173,'SECOND_SBGZBJ','设备故障报警',NULL,170,3),(180,'TOP_YXJK','运行监控',NULL,0,0),(181,'SECOND_YWYXJK','业务运行监控',NULL,180,1),(182,'SECOND_SBYXJK','设备运行监控',NULL,180,2),(190,'TOP_SJYGL','数据源管理',NULL,0,0),(191,'SECOND_YDSJY','源端数据源',NULL,190,1),(192,'SECOND_MBSJY','目标数据源',NULL,190,2),(200,'TOP_YYGL','应用管理',NULL,0,0),(201,'SECOND_PZGL','未通过审核的应用',NULL,200,1),(202,'SECOND_MB_WJTB','目标文件同步',NULL,200,2),(203,'SECOND_MB_DBTB','目标数据库同步',NULL,200,3),(204,'SECOND_MB_TYDL','目标通用代理',NULL,200,4),(205,'SECOND_DKYS','端口映射',NULL,200,5),(206,'SECOND_YD_WJTB','源端文件同步',NULL,200,6),(207,'SECOND_YD_DBTB','源端数据库同步',NULL,200,7),(208,'SECOND_YD_TYDL','源端通用代理',NULL,200,8),(209,'SECOND_YWSJBD','业务审计比对',NULL,200,9),(210,'SECOND_YWSDCC','业务手动重传',NULL,200,10),(220,'TOP_SHGL','审核管理',NULL,0,0),(221,'SECOND_YD_WJTBSH','源端文件同步审核',NULL,220,1),(222,'SECOND_MB_WJTBSH','目标文件同步审核',NULL,220,2),(223,'SECOND_YD_DBTBSH','源端数据库同步审核',NULL,220,3),(224,'SECOND_MB_DBTBSH','目标数据库同步审核',NULL,220,4),(225,'SECOND_YD_TYDLSH','源端通用代理审核',NULL,220,5),(226,'SECOND_MB_TYDLSH','目标通用代理审核',NULL,220,6);
UNLOCK TABLES;

DROP TABLE IF EXISTS `role`;
CREATE TABLE `role` (
  `id` bigint(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(30) CHARACTER SET utf8 DEFAULT NULL,
  `description` varchar(50) CHARACTER SET utf8 DEFAULT NULL,
  `createdTime` datetime DEFAULT NULL,
  `modifiedTime` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='角色表';
LOCK TABLES `role` WRITE;
INSERT INTO `role` VALUES (1,'初始化管理员','初始化管理员','2010-07-04 15:07:08','2013-01-18 14:57:26'),(2,'授权管理员','授权管理员','2012-07-03 10:06:20','2012-09-14 11:13:18'),(3,'配置管理员','配置管理员','2012-03-14 12:33:05','2012-09-14 11:15:31'),(4,'审计管理员','审计管理员','2012-06-12 18:37:24','2012-09-29 13:46:38'),(6,'授权测试','授权测试','2013-01-26 18:05:03','2013-02-26 11:27:36');
UNLOCK TABLES;

CREATE TABLE `account` (
  `id` bigint(20) NOT NULL DEFAULT '0',
  `user_name` varchar(20) COLLATE utf8_bin DEFAULT NULL,
  `password` varchar(100) COLLATE utf8_bin DEFAULT NULL,
  `sex` varchar(10) COLLATE utf8_bin DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8_bin DEFAULT NULL,
  `created_time` datetime DEFAULT NULL,
  `modified_time` datetime DEFAULT NULL,
  `status` varchar(20) COLLATE utf8_bin DEFAULT NULL,
  `depart` varchar(20) COLLATE utf8_bin DEFAULT NULL,
  `title` varchar(20) COLLATE utf8_bin DEFAULT NULL,
  `name` varchar(20) COLLATE utf8_bin DEFAULT NULL,
  `email` varchar(30) COLLATE utf8_bin DEFAULT NULL,
  `start_ip` varchar(20) COLLATE utf8_bin DEFAULT NULL,
  `end_ip` varchar(20) COLLATE utf8_bin DEFAULT NULL,
  `start_hour` int(11) DEFAULT NULL,
  `end_hour` int(11) DEFAULT NULL,
  `description` text COLLATE utf8_bin,
  `remote_ip` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `mac` varchar(20) COLLATE utf8_bin DEFAULT NULL,
  `ip_type` int(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='账户表';
LOCK TABLES `account` WRITE;
INSERT INTO `account` VALUES (1,'admin','S8W2gMnH8VWiT9pXRMPQxA==','男','0571-88888888','2010-07-04 13:52:36','2012-09-12 16:50:46','有效','信息中心','主任','初始化管理员','**@hzih.net','0.0.0.0','192.168.200.254',9,18,'这是一个默认的超级用户信息','192.168.2.176','5C-63-BF-1D-72-07',1),(2,'authadmin','S8W2gMnH8VWiT9pXRMPQxA==','男','0571-88888888','2012-04-12 14:22:35','2012-06-12 12:00:06','有效','信息中心','主任','授权管理员','**@hzih.net','0.0.0.0','192.168.200.254',1,22,'这是一个默认的授权用户信息','',NULL,1),(3,'configadmin','S8W2gMnH8VWiT9pXRMPQxA==','男','0571-88888888','2012-06-12 18:04:01','2012-06-12 18:23:16','有效','信息中心','主任','配置管理员','**@hzih.net','0.0.0.0','192.168.200.254',9,21,'这是一个默认的配置用户信息','',NULL,1),(4,'auditadmin','S8W2gMnH8VWiT9pXRMPQxA==','男','0571-88888888','2012-07-03 10:19:57','2012-08-06 18:53:19','有效','信息中心','主任','审计管理员','**@hzih.net','0.0.0.0','192.168.200.254',7,22,'这是一个默认的审计用户信息',NULL,NULL,1),(5,'test','S8W2gMnH8VWiT9pXRMPQxA==','男','12345678','2013-01-26 18:07:51','2013-02-26 10:05:58','有效','信息部','主任','授权测试','hello@hzih.net','0.0.0.0','255.255.255.255',9,18,'这是一个用户信息',NULL,'',1);
UNLOCK TABLES;

CREATE TABLE `role_permission` (
  `permission_id` bigint(20) NOT NULL DEFAULT '0',
  `role_id` bigint(20) NOT NULL DEFAULT '0',
  PRIMARY KEY (`permission_id`,`role_id`),
  KEY `FKBD40D53851BABF58` (`role_id`),
  KEY `FKBD40D53852A81638` (`permission_id`),
  KEY `FKBD40D538FB5DAFD5` (`role_id`),
  KEY `FKBD40D53866C1F4F5` (`permission_id`),
  CONSTRAINT `FK9C6EC93851BABF58` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`),
  CONSTRAINT `FK9C6EC93852A81638` FOREIGN KEY (`permission_id`) REFERENCES `permission` (`ID`),
  CONSTRAINT `FKBD40D53866C1F4F5` FOREIGN KEY (`permission_id`) REFERENCES `permission` (`ID`),
  CONSTRAINT `FKBD40D538FB5DAFD5` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=sjis COLLATE=sjis_bin COMMENT='角色权限关联表';
LOCK TABLES `role_permission` WRITE;
INSERT INTO `role_permission` VALUES (100,1),(102,1),(103,1),(110,1),(111,1),(112,1),(113,1),(114,1),(120,1),(121,1),(122,1),(123,1),(124,1),(125,1),(126,1),(128,1),(130,1),(131,1),(140,1),(141,1),(142,1),(143,1),(144,1),(145,1),(180,1),(181,1),(182,1),(100,2),(101,2),(103,2),(120,2),(128,2),(220,2),(222,2),(224,2),(226,2),(110,3),(111,3),(112,3),(113,3),(120,3),(125,3),(130,3),(131,3),(190,3),(192,3),(200,3),(202,3),(203,3),(204,3),(205,3),(160,4),(161,4),(162,4),(163,4),(166,4),(170,4),(171,4),(172,4),(173,4),(180,4),(181,4),(182,4),(100,6),(101,6),(102,6),(103,6),(110,6),(111,6),(112,6),(113,6),(114,6),(120,6),(121,6),(123,6),(124,6),(125,6),(126,6),(128,6),(130,6),(131,6),(132,6),(133,6),(140,6),(141,6),(142,6),(143,6),(144,6),(145,6),(146,6),(160,6),(161,6),(162,6),(163,6),(166,6),(170,6),(171,6),(172,6),(173,6),(180,6),(181,6),(182,6),(190,6),(192,6),(200,6),(201,6),(202,6),(203,6),(204,6),(205,6),(209,6),(220,6),(222,6),(224,6),(226,6);
UNLOCK TABLES;

CREATE TABLE `account_role` (
  `account_id` bigint(20) NOT NULL DEFAULT '0',
  `role_id` bigint(20) NOT NULL DEFAULT '0',
  PRIMARY KEY (`account_id`,`role_id`),
  KEY `FK410D03481FCE46BD` (`role_id`),
  KEY `FK410D034811351AF7` (`account_id`),
  KEY `FK410D0348FB5DAFD5` (`role_id`),
  KEY `FK410D0348870BFADF` (`account_id`),
  CONSTRAINT `FK410D034811351AF7` FOREIGN KEY (`account_id`) REFERENCES `account` (`id`),
  CONSTRAINT `FK410D03481FCE46BD` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`),
  CONSTRAINT `FK410D0348870BFADF` FOREIGN KEY (`account_id`) REFERENCES `account` (`id`),
  CONSTRAINT `FK410D0348FB5DAFD5` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='账户角色关联表';

LOCK TABLES `account_role` WRITE;
INSERT INTO `account_role` VALUES (1,1),(2,2),(3,3),(4,4),(5,6);
UNLOCK TABLES;

DROP TABLE IF EXISTS `audit_reset`;
CREATE TABLE `audit_reset` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `business_name` varchar(255) COLLATE utf8_bin DEFAULT NULL COMMENT '业务名称',
  `business_type` varchar(255) COLLATE utf8_bin DEFAULT NULL COMMENT '业务类型',
  `file_name` varchar(255) COLLATE utf8_bin DEFAULT NULL COMMENT '业务对应文件全名',
  `file_size` varchar(50) COLLATE utf8_bin DEFAULT NULL COMMENT '文件大小',
  `import_time` datetime NOT NULL COMMENT '导入时间',
  `reset_status` int(4) NOT NULL DEFAULT '0' COMMENT '状态:0需重传1已经重传',
  `reset_count` int(10) NOT NULL DEFAULT '0' COMMENT '导入次数',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='业务手动重传表';
LOCK TABLES `audit_reset` WRITE;
UNLOCK TABLES;

DROP TABLE IF EXISTS `business_log`;
CREATE TABLE `business_log` (
	`Id` INT(11) NOT NULL AUTO_INCREMENT,
	`log_time` DATETIME NULL DEFAULT NULL COMMENT '审计时间',
	`level` VARCHAR(5) NULL DEFAULT NULL COMMENT '日志等级' COLLATE 'utf8_bin',
	`business_name` VARCHAR(255) NULL DEFAULT NULL COMMENT '业务名称' COLLATE 'utf8_bin',
	`business_desc` VARCHAR(255) NULL DEFAULT NULL COMMENT '业务描述' COLLATE 'utf8_bin',
	`business_type` VARCHAR(255) NULL DEFAULT NULL COMMENT '业务类型（文件同步、UDP代理、TCP代理、数据库同步）\\n' COLLATE 'utf8_bin',
	`source_ip` VARCHAR(255) NULL DEFAULT NULL COMMENT '源端地址' COLLATE 'utf8_bin',
	`source_port` VARCHAR(255) NULL DEFAULT NULL COMMENT '源端端口' COLLATE 'utf8_bin',
	`source_jdbc` VARCHAR(255) NULL DEFAULT NULL COMMENT '源端数据库' COLLATE 'utf8_bin',
	`dest_port` VARCHAR(255) NULL DEFAULT NULL COMMENT '目标地址' COLLATE 'utf8_bin',
	`dest_ip` VARCHAR(255) NULL DEFAULT NULL COMMENT '目标端口' COLLATE 'utf8_bin',
	`dest_jdbc` VARCHAR(255) NULL DEFAULT NULL COMMENT '目标数据库' COLLATE 'utf8_bin',
	`audit_count` INT(11) NULL DEFAULT '0' COMMENT '审计量（数据库：条数 文件：文件尺寸大小 代理：字节数）		',
	`audit_count_ex` INT(11) NULL DEFAULT '0' COMMENT '(源端)审计量（数据库：条数 文件：文件尺寸大小 代理：字节数）		',
	`file_name` VARCHAR(255) NULL DEFAULT NULL COMMENT '文件同步的文件全名' COLLATE 'utf8_bin',
	`plugin` VARCHAR(255) NULL DEFAULT NULL COMMENT '源端external,目标internal' COLLATE 'utf8_bin',
	`json_id` INT(11) NULL DEFAULT '0' COMMENT '同一数据源在相同应用中的业务日志id',
	`json_id_ex` INT(11) NULL DEFAULT '0' COMMENT '同一数据源在相同应用中的业务日志id(源端)',
	`flag` INT(4) NOT NULL DEFAULT '0' COMMENT '导出1未导出0',
	PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='业务日志审计表';
LOCK TABLES `business_log` WRITE;
UNLOCK TABLES;

DROP TABLE IF EXISTS `business_security_alert`;
CREATE TABLE `business_security_alert` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `alert_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `business_name` varchar(50) COLLATE utf8_bin NOT NULL,
  `alert_type_code` varchar(50) COLLATE utf8_bin NOT NULL,
  `ip` varchar(50) COLLATE utf8_bin NOT NULL,
  `user_name` varchar(50) COLLATE utf8_bin NOT NULL,
  `isread` varchar(4) COLLATE utf8_bin NOT NULL DEFAULT 'N',
  `alert_info` varchar(500) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='业务异常报警信息';
LOCK TABLES `business_security_alert` WRITE;
UNLOCK TABLES;

DROP TABLE IF EXISTS `business_security_alert_type`;
CREATE TABLE `business_security_alert_type` (
  `code` varchar(10) COLLATE utf8_bin NOT NULL DEFAULT '',
  `name` varchar(50) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='业务异常代码';
LOCK TABLES `business_security_alert_type` WRITE;
INSERT INTO `business_security_alert_type` VALUES ('0000',' 其它'),('0001',' 数据流量异常'),('0002',' 数据传输协议及端口异常'),('0003',' 数据包结构异常'),('0004',' 硬件设备运行情况异常'),('0005',' 异常硬件设备类型'),('0006',' 应用软件运行情况异常'),('0007',' 异常应用软件名称'),('0008',' 操作系统运行情况异常'),('0009',' 数据库运行情况异常');
UNLOCK TABLES;

DROP TABLE IF EXISTS `contentfilter`;
CREATE TABLE `contentfilter` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `filter` varchar(500) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='内容过滤表';
LOCK TABLES `contentfilter` WRITE;
INSERT INTO `contentfilter` VALUES (1,'法轮功'),(2,'反共'),(5,'胡锦涛'),(6,'温家宝'),(7,'习近平');
UNLOCK TABLES;

DROP TABLE IF EXISTS `delete_status`;
CREATE TABLE `delete_status` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `appName` varchar(50) COLLATE utf8_bin NOT NULL COMMENT '应用名',
  `plugin` varchar(50) COLLATE utf8_bin NOT NULL DEFAULT 'external' COMMENT '数据源类型,external表示源端,internal表示目标端',
  `apName` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `deleteType` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='应用删除状态表';
LOCK TABLES `delete_status` WRITE;
UNLOCK TABLES;

DROP TABLE IF EXISTS `department`;
CREATE TABLE `department` (
  `code` varchar(5) NOT NULL,
  `name` varchar(60) NOT NULL,
  PRIMARY KEY (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `department` WRITE;
INSERT INTO `department` VALUES ('00000','信息通信部门'),('01000','国内安全保卫管理部门'),('02000','经济犯罪侦查管理部门'),('03000','治安管理部门'),('04000','边防管理部门'),('05000','刑事侦查管理部门'),('06000','出入境管理部门'),('07000','消防管理部门'),('08000','警卫管理部门'),('10000','铁道公安管理部门'),('11000','网络安全监察管理部门'),('12000','行动技术管理部门 '),('13000','监所管理部门'),('14000','交通公安管理部门'),('15000','民航公安管理部门'),('16000','林业公安管理部门'),('17000','交通管理部门'),('18000','法制管理部门'),('19000','外事管理部门'),('20000','装备财务管理部门'),('21000','禁毒管理部门'),('22000','科技管理部门'),('23000','基础和综合管理部门'),('24000','海关公安管理部门'),('26000','反邪教管理部门'),('27000','反恐怖管理部门'),('31000','办公管理部门(指挥中心管理部门)'),('32000','纪委监察管理部门'),('34000','督察管理部门'),('36000','人事管理部门'),('39000','离退休干部管理部门'),('92000','其他');
UNLOCK TABLES;

DROP TABLE IF EXISTS `equipment`;
CREATE TABLE `equipment` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `equipment_name` varchar(255) COLLATE utf8_bin NOT NULL,
  `equipment_desc` varchar(255) COLLATE utf8_bin NOT NULL,
  `link_name` varchar(255) COLLATE utf8_bin NOT NULL,
  `link_type` varchar(10) COLLATE utf8_bin NOT NULL,
  `equipment_type_code` varchar(6) COLLATE utf8_bin NOT NULL,
  `equipment_sys_config` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `equipment_manager_depart` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `monitor_used` varchar(2) COLLATE utf8_bin NOT NULL DEFAULT '1' COMMENT '是否开启监控 说明：0未开启，1开启',
  `key_device` varchar(2) COLLATE utf8_bin NOT NULL DEFAULT '0' COMMENT '是否核心设备 说明：1是，0否',
  `ip` varchar(20) COLLATE utf8_bin NOT NULL,
  `other_ip` varchar(20) COLLATE utf8_bin DEFAULT NULL,
  `mac` varchar(20) COLLATE utf8_bin NOT NULL,
  `sub_net_mask` varchar(20) COLLATE utf8_bin NOT NULL,
  `port` varchar(20) COLLATE utf8_bin NOT NULL,
  `password` varchar(20) COLLATE utf8_bin NOT NULL,
  `oidname` varchar(50) COLLATE utf8_bin NOT NULL,
  `snmpver` varchar(50) COLLATE utf8_bin NOT NULL,
  `auth` varchar(50) COLLATE utf8_bin NOT NULL,
  `authpassword` varchar(50) COLLATE utf8_bin NOT NULL,
  `common` varchar(50) COLLATE utf8_bin NOT NULL,
  `commonpassword` varchar(50) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='设备表';
LOCK TABLES `equipment` WRITE;
UNLOCK TABLES;

DROP TABLE IF EXISTS `equipment_alert`;
CREATE TABLE `equipment_alert` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `equipment_name` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `cpu` int(11) DEFAULT '80' COMMENT 'CPU告警阀值',
  `memory` int(11) DEFAULT '80' COMMENT '内存告警阀值',
  `disk` int(11) DEFAULT '90' COMMENT '硬盘告警阀值',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='设备告警阀值信息';
LOCK TABLES `equipment_alert` WRITE;
UNLOCK TABLES;

DROP TABLE IF EXISTS `equipment_log`;
CREATE TABLE `equipment_log` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `log_time` datetime DEFAULT NULL,
  `level` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `link_name` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `equipment_name` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `log_info` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='设备日志表';

LOCK TABLES `equipment_log` WRITE;
UNLOCK TABLES;

DROP TABLE IF EXISTS `equipment_security_alert`;
CREATE TABLE `equipment_security_alert` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `alert_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `equipment_name` varchar(50) COLLATE utf8_bin NOT NULL,
  `ip` varchar(50) COLLATE utf8_bin NOT NULL,
  `isread` varchar(4) COLLATE utf8_bin NOT NULL DEFAULT 'N',
  `alert_info` varchar(500) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='设备故障报警信息';
LOCK TABLES `equipment_security_alert` WRITE;
UNLOCK TABLES;

DROP TABLE IF EXISTS `equipment_type`;
CREATE TABLE `equipment_type` (
  `code` varchar(255) NOT NULL DEFAULT '',
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
LOCK TABLES `equipment_type` WRITE;
INSERT INTO `equipment_type` VALUES ('0000','其它'),('1000','安全及网络设备'),('1001','防火墙'),('1002','可信安全网关'),('1003','入侵检测系统'),('1004','网络防毒设备'),('1005','安全隔离设备'),('1006','VPN网关'),('1007','入侵防御系统'),('1008',' AAA 服务器'),('1009','漏洞扫描系统'),('1010','边界安全监测设备'),('1011','应用代理服务器'),('1012','路由器'),('1013','交换机'),('1014','认证服务器'),('1015','串口线'),('1030','其他安全及网络设备'),('2000','应用服务器'),('2001','WEB服务器'),('2002','FTP服务器'),('2003','邮件服务器'),('2004','数据库服务器'),('2005','单向光闸外端机'),('2006','单向光闸内端机'),('2020','其他类型服务器'),('3000','终端'),('3001','台式计算机'),('3002','笔记本电脑'),('3003','IP音视频终端'),('3004','手持终端设备'),('3005','其他终端设备'),('4000','IPSec VPN网关'),('4001','SSL VPN网关'),('4002','短信接入网关'),('4003','B/S应用代理服务器'),('4004','B/S应用管理服务器'),('4005','网络隔离设备'),('4006',''),('4007','设备证书管理中心'),('4008','鉴别评估管理服务器'),('4009','监控管理探针'),('4010','监控管理与级联服务器');
UNLOCK TABLES;

DROP TABLE IF EXISTS `ext_link`;
CREATE TABLE `ext_link` (
  `Id` bigint(20) NOT NULL AUTO_INCREMENT,
  `link_name` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `link_property` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `link_type` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `link_Corp` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `link_security` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `link_amount` bigint(20) DEFAULT NULL,
  `link_bandwidth` bigint(20) DEFAULT NULL,
  `other_security` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='外部链路表';
LOCK TABLES `ext_link` WRITE;
UNLOCK TABLES;

DROP TABLE IF EXISTS `int_link`;
CREATE TABLE `int_link` (
  `Id` bigint(20) NOT NULL AUTO_INCREMENT,
  `link_name` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `jrdx` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `exchange_mode` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `link_bandwidth` int(11) DEFAULT NULL,
  `FW_used` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `sec_gateway_used` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `gap_used` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `VPN_used` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `other_security` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='内部链路表';
LOCK TABLES `int_link` WRITE;
UNLOCK TABLES;

DROP TABLE IF EXISTS `safe_event_security_alert`;
CREATE TABLE `safe_event_security_alert` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `alert_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `name` varchar(50) COLLATE utf8_bin NOT NULL,
  `obj_type` varchar(50) COLLATE utf8_bin NOT NULL COMMENT 'business or equipment',
  `alert_type_code` varchar(50) COLLATE utf8_bin NOT NULL,
  `ip` varchar(50) COLLATE utf8_bin NOT NULL,
  `isread` varchar(4) COLLATE utf8_bin NOT NULL DEFAULT 'N',
  `alert_info` varchar(500) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='安全事件报警信息';
LOCK TABLES `safe_event_security_alert` WRITE;
UNLOCK TABLES;

DROP TABLE IF EXISTS `safe_event_security_alert_type`;
CREATE TABLE `safe_event_security_alert_type` (
  `code` varchar(5) COLLATE utf8_bin NOT NULL DEFAULT '',
  `name` varchar(500) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='安全事件报警类型';
LOCK TABLES `safe_event_security_alert_type` WRITE;
INSERT INTO `safe_event_security_alert_type` VALUES ('0000',' 其它'),('0001',' 自然灾害类'),('0002',' 人为破坏类'),('0003',' 误操作类'),('0004',' 网络攻击类'),('0005',' 操作系统攻击类'),('0006',' 数据库攻击类'),('0007',' 病毒类'),('0008',' 应用系统（软件）程序故障类'),('0009',' 设备硬件故障类'),('0010',' 黑客入侵类'),('0011',' 越权访问类'),('0012',' 应用系统攻击类'),('0013','设备负载过高类');
UNLOCK TABLES;

DROP TABLE IF EXISTS `safe_policy`;
CREATE TABLE `safe_policy` (
  `id` bigint(20) NOT NULL DEFAULT '0',
  `timeout` int(11) DEFAULT NULL,
  `passwordLength` int(11) DEFAULT NULL,
  `errorLimit` int(11) DEFAULT NULL,
  `remoteDisabled` tinyint(1) DEFAULT NULL,
  `macDisabled` tinyint(1) DEFAULT NULL,
  `passwordRules` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `lockTime` int(10) NOT NULL DEFAULT '24' COMMENT '锁定时间(小时)',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='安全策略表';
LOCK TABLES `safe_policy` WRITE;
INSERT INTO `safe_policy` VALUES (1,1800,0,3,0,0,'^[0-9a-zA-Z!$#%@^&amp;amp;amp;amp;amp;amp;amp;*()~_+]{8,20}$',1);
UNLOCK TABLES;

DROP TABLE IF EXISTS `securitylevel`;
CREATE TABLE `securitylevel` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `level_info` varchar(100) COLLATE utf8_bin NOT NULL DEFAULT '0' COMMENT '信息等级',
  `security_flag` varchar(100) COLLATE utf8_bin NOT NULL DEFAULT 'DES' COMMENT '加密算法',
  `security_level` int(2) NOT NULL DEFAULT '0' COMMENT '加密强度',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='加密等级表';
LOCK TABLES `securitylevel` WRITE;
INSERT INTO `securitylevel` VALUES (1,'0','DES',0),(2,'1','DES',1),(3,'2','DES',2),(4,'3','DES',3);
UNLOCK TABLES;

DROP TABLE IF EXISTS `snmpoid`;
CREATE TABLE `snmpoid` (
  `name` varchar(50) COLLATE utf8_bin NOT NULL DEFAULT '',
  `oidtype` varchar(50) COLLATE utf8_bin NOT NULL DEFAULT '',
  `company` varchar(50) COLLATE utf8_bin DEFAULT NULL,
  `snmpver` varchar(50) COLLATE utf8_bin DEFAULT NULL,
  `cpuuse` varchar(50) COLLATE utf8_bin DEFAULT NULL,
  `disktotal` varchar(50) COLLATE utf8_bin DEFAULT NULL,
  `diskuse` varchar(50) COLLATE utf8_bin DEFAULT NULL,
  `memtotal` varchar(50) COLLATE utf8_bin DEFAULT NULL,
  `memuse` varchar(50) COLLATE utf8_bin DEFAULT NULL,
  `curconn` varchar(50) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
LOCK TABLES `snmpoid` WRITE;
INSERT INTO `snmpoid` VALUES ('lenovofirewall','firewall','lenovo','v2','.1.3.6.1.4.1.9833.1.4.1.14','.1.3.6.1.4.1.9833.1.4.3.1.6','','.1.3.6.1.4.1.9833.1.4.3.2.5','.1.3.6.1.4.1.9833.1.4.2.6','.0.100.101.20'),('linuxos','pcserver','pcserver','v2','.1.3.6.1.4.1.2021.11.9.0','.1.3.6.1.4.1.2021.9.1.6.1','.1.3.6.1.4.1.2021.9.1.7.1','.1.3.6.1.4.1.2021.4.5.0','.1.3.6.1.4.1.2021.4.6.0','1.3.6.1.2.1.6.4'),('netchinafirewall','firewall','netchina','v2','.1.3.6.1.4.1.3000.2.2','.1.3.6.1.4.1.3000.2.3','.1.3.6.1.4.1.3000.2.4','.1.3.6.1.4.1.3000.2.5','.1.3.6.1.4.1.3000.2.9','.1.3.6.1.4.1.3000.2.10'),('rdaps','appdirector','radware','v2','.1.3.6.1.4.1.89.35.1.112','.1.3.6.1.4.1.89.35.1.112','.1.3.6.1.4.1.89.35.1.112','.1.3.6.1.4.1.89.35.1.112','.1.3.6.1.4.1.89.35.1.112','.1.3.6.1.4.1.89.35.1.123.2'),('secworld','firewall','legendsec','v2','.1.3.6.1.4.1.24968.1.3.9.0','','','','.1.3.6.1.4.1.24968.1.3.10.0','.1.3.6.1.4.1.24968.1.3.8.0'),('windowsos','pcserver','pcserver','v2','.1.3.6.1.2.1.25.3.3.1.2','.1.3.6.1.2.1.25.2.3.1.5','.1.3.6.1.2.1.25.2.3.1.6','.1.3.6.1.2.1.25.2.2','.1.3.6.1.2.1.25.2.3.1.6.6','.1.3.6.2.1.6.4');
UNLOCK TABLES;

DROP TABLE IF EXISTS `sys_log`;
CREATE TABLE `sys_log` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `log_time` datetime DEFAULT NULL COMMENT '产生时间',
  `level` varchar(10) CHARACTER SET utf8 DEFAULT NULL COMMENT '日志等级',
  `audit_module` varchar(40) CHARACTER SET utf8 DEFAULT NULL COMMENT '审计模块',
  `audit_action` varchar(40) CHARACTER SET utf8 DEFAULT NULL COMMENT '审计行为',
  `audit_info` varchar(255) CHARACTER SET utf8 DEFAULT NULL COMMENT '审计内容',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='系统日志审计表';
LOCK TABLES `sys_log` WRITE;
UNLOCK TABLES;

DROP TABLE IF EXISTS `type_check`;
CREATE TABLE `type_check` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `appName` varchar(100) COLLATE utf8_bin NOT NULL COMMENT '应用编号',
  `appType` varchar(10) COLLATE utf8_bin NOT NULL COMMENT '应用类型',
  `up` int(4) NOT NULL COMMENT '0表示未修改应用,1表示已经回应审核信息',
  `description` varchar(500) COLLATE utf8_bin DEFAULT NULL COMMENT '审核批注内容',
  `redescription` varchar(500) COLLATE utf8_bin DEFAULT NULL COMMENT '回应批注内容',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='应用批注表';
LOCK TABLES `type_check` WRITE;
UNLOCK TABLES;

DROP TABLE IF EXISTS `user_oper_log`;
CREATE TABLE `user_oper_log` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `log_time` datetime DEFAULT NULL COMMENT '审计时间',
  `level` varchar(10) CHARACTER SET utf8 DEFAULT NULL COMMENT '日志级别',
  `username` varchar(30) CHARACTER SET utf8 DEFAULT NULL COMMENT '用户名',
  `audit_module` varchar(255) CHARACTER SET utf8 DEFAULT NULL COMMENT '审计模块',
  `audit_info` varchar(255) CHARACTER SET utf8 DEFAULT NULL COMMENT '审计内容',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='用户操作审计表';
LOCK TABLES `user_oper_log` WRITE;
UNLOCK TABLES;

DROP TABLE IF EXISTS `business_log_time`;
CREATE TABLE `business_log_time` (
	`appName` VARCHAR(50) NOT NULL COMMENT '应用名' COLLATE 'utf8_bin',
	`average` DOUBLE(10,2) NOT NULL COMMENT '一个临时文件的平均耗时',
	`count` INT(10) NOT NULL COMMENT '平均耗时的统计次数'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='统计目标端一个临时文件的平均耗时';
LOCK TABLES `business_log_time` WRITE;
UNLOCK TABLES;

DROP TABLE IF EXISTS `business_log_handle_db`;
CREATE TABLE `business_log_handle_db` (
    `id` INT(10) NOT NULL AUTO_INCREMENT,
	`appName` VARCHAR(50) NOT NULL COMMENT '应用名' COLLATE 'utf8_bin',
	`fileName` VARCHAR(20) NOT NULL COMMENT '临时文件名' COLLATE 'utf8_bin',
	`operate` VARCHAR(8) NOT NULL COMMENT 'internal(目标端) or external(源端)' COLLATE 'utf8_bin',
	`logTime` BIGINT(15) NOT NULL,
	`flag` INT(1) NOT NULL DEFAULT '0',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='业务日志处理,重传统计';
LOCK TABLES `business_log_handle_db` WRITE;
UNLOCK TABLES;