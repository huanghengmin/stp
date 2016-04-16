package com.hzih.stp.web.action.system;

import com.hzih.stp.service.DataBaseService;
import com.hzih.stp.service.LogService;
import com.hzih.stp.service.XmlOperatorService;
import com.hzih.stp.utils.FileUtil;
import com.hzih.stp.utils.StringContext;
import com.hzih.stp.utils.StringUtils;
import com.hzih.stp.web.SessionUtils;
import com.hzih.stp.web.action.ActionBase;
import com.inetec.common.exception.Ex;
import com.opensymphony.xwork2.ActionSupport;
import org.apache.log4j.Logger;
import org.apache.struts2.ServletActionContext;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Created by IntelliJ IDEA.
 * User: 钱晓盼
 * Date: 12-5-18
 * Time: 下午3:54
 * 配置恢复
 */
public class ManagerConfigAction extends ActionSupport {

	private static final Logger logger = Logger.getLogger(ManagerConfigAction.class);
    private XmlOperatorService xmlOperatorService;
    private DataBaseService dataBaseService;
    private LogService logService;
    private int start;
    private int limit;
    private String[] fileNames;
    private String fileName;
    private String type;

    /**
     * 读取可信目标端存档文件列表
     * @return
     * @throws Exception
     */
    public String readInternalFileName() throws Exception {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result =	actionBase.actionBegin(request);
        String json = null;
        try{
            String[] files = FileUtil.readXmlFileName(StringContext.INTERNALVERSIONPATH);
            int total = files.length;
            json = "{success:true,total:"+total+",rows:[";
            int count = 0;
            for (int i = 0; i<total; i++){
                if(i==start&& count<limit){
                    start ++;
                    count ++;
                    json += "{config:'"+files[i]+"',desc:'"+getDesc(StringContext.INTERNAL,files[i])+"'},";
                }
            }
            json += "]}";
        } catch (Exception e){
            logger.error("配置恢复",e);
        }
        actionBase.actionEnd(response, json, result);
        return null;
    }

    private String getDesc(String typeXml,String file) throws Ex {
        return xmlOperatorService.readRootDesc(typeXml, file);
    }

    /**
     * 读取非可信源端存档文件列表
     * @return
     * @throws Exception
     */
    public String readExternalFileName() throws Exception {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result =	actionBase.actionBegin(request);
        String json = null;
        try{
            String[] files = FileUtil.readXmlFileName(StringContext.EXTERNALVERSIONPATH);
            int total = files.length;
            json = "{success:true,total:"+total+",rows:[";
            int count = 0;
            for (int i = 0; i<total; i++){
                if(i==start&& count<limit){
                    start ++;
                    count ++;
                    json += "{config:'"+files[i]+"',desc:'"+getDesc(StringContext.EXTERNAL,files[i])+"'},";
                }
            }
            json += "]}";
        } catch (Exception e){
            logger.error("配置恢复",e);
        }
        actionBase.actionEnd(response, json, result);
        return null;
    }

    /**
     * 删除存档的配置文件
     * @return
     * @throws Exception
     */
    public String deleteRecoverConfig() throws Exception {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result =	actionBase.actionBegin(request);
        String msg = null;
        try{
            FileUtil.deleteFileByFileNames(StringContext.INTERNALVERSIONPATH,fileNames);
            FileUtil.deleteFileByFileNames(StringContext.EXTERNALVERSIONPATH,fileNames);
            msg = "删除成功,点击返回列表!";
        } catch (Exception e){
            logger.error("配置恢复",e);
            msg = "删除失败!";
        }
        String json = "{success:true,msg:'"+msg+"'}";
        actionBase.actionEnd(response, json, result);
        return null;
    }

    public String readRecoverXml() throws Exception {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result =	actionBase.actionBegin(request);
        String msg = null;
        String desc = null;
        try{
            desc = xmlOperatorService.readRootDesc(type,fileName);
            msg = "true";
        } catch (Exception e){
            logger.error("配置恢复",e);
            msg = "读取存档配置文件描述信息失败!";
        }
        String json = "{success:true,msg:'"+msg+"',desc:'"+desc+"'}";
        actionBase.actionEnd(response, json, result);
        return null;
    }

    /**
     * 恢复选中的存档文件
     * @return
     * @throws Exception
     */
    public String recover() throws Exception {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpServletResponse response = ServletActionContext.getResponse();
        ActionBase actionBase = new ActionBase();
        String result =	actionBase.actionBegin(request);
        String msg = null;
        try{
            String text = request.getParameter("text");
            Map<String, List<String>> map = null;
            if(!StringUtils.getPrivated()) {
                map = xmlOperatorService.readAllTempTable(StringContext.EXTERNALVERSIONPATH+"/"+fileName);
            }
            if(map!=null && map.size()==0){
                if(!StringUtils.getPrivated()){
                    dataBaseService.operateDBRemoveApp(StringContext.EXTERNAL);
                    FileUtil.copyVersionToExternalXml(fileName);
                    dataBaseService.operateDBInsertApp(StringContext.EXTERNAL);
                }
                FileUtil.copyVersionToInternalXml(fileName);
                if(text!=null){
                    xmlOperatorService.updateDescription(StringContext.EXTERNALXML,text);
                    xmlOperatorService.updateDescription(StringContext.INTERNALXML,text);
                }
                msg = "配置恢复成功";
                logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"配置恢复",msg);
            } else if(map!=null&&map.size()>0) {
                msg = "";
                Set<String> keys = map.keySet();
                for(String key:keys){
                    List<String> value = map.get(key);
                    msg += "在数据源" + key + "中临时表:"+value.toString()+"<br>";
                }
                msg += "已经存在,删除已存在临时表,或者修改配置文件!";
                logger.info(msg);
                logService.newLog("INFO", SessionUtils.getAccount(request).getUserName(),"配置恢复","恢复失败,临时表建立失败!");
            } else {
                msg = "配置恢复失败";
                logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(),"配置恢复",msg);
            }
        } catch (Exception e){
            logger.error("配置恢复",e);
            msg = "配置恢复失败";
            logService.newLog("ERROR", SessionUtils.getAccount(request).getUserName(),"配置恢复",msg);
        }
        String json = "{success:true,msg:'"+msg+"'}";
        actionBase.actionEnd(response, json, result);
        return null;
    }

    public void setXmlOperatorService(XmlOperatorService xmlOperatorService) {
        this.xmlOperatorService = xmlOperatorService;
    }

    public void setDataBaseService(DataBaseService dataBaseService) {
        this.dataBaseService = dataBaseService;
    }

    public void setLogService(LogService logService) {
        this.logService = logService;
    }

    public int getStart() {
        return start;
    }

    public void setStart(int start) {
        this.start = start;
    }

    public int getLimit() {
        return limit;
    }

    public void setLimit(int limit) {
        this.limit = limit;
    }

    public String[] getFileNames() {
        return fileNames;
    }

    public void setFileNames(String[] fileNames) {
        this.fileNames = fileNames;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
