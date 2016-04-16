package com.hzih.stp.web.action.config;

import com.hzih.stp.constant.AppConstant;
import com.hzih.stp.service.LogService;
import com.hzih.stp.utils.JavaMailUtil;
import com.hzih.stp.utils.JavaShortMessageUtil;
import com.hzih.stp.web.SessionUtils;
import com.hzih.stp.web.SiteContext;
import com.hzih.stp.web.action.ActionBase;
import com.opensymphony.xwork2.ActionSupport;
import org.apache.log4j.Logger;
import org.apache.struts2.ServletActionContext;
import org.dom4j.Document;
import org.dom4j.Element;
import org.dom4j.Node;
import org.dom4j.io.OutputFormat;
import org.dom4j.io.SAXReader;
import org.dom4j.io.XMLWriter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileOutputStream;
import java.util.HashMap;
import java.util.Map;

/**
 * 报警配置
 */
public class AlertManagerAction extends ActionSupport{
    private static final Logger logger = Logger.getLogger(AlertManagerAction.class);

    private LogService logService;

    public String loadConfig() throws Exception {
        HttpServletRequest request = ServletActionContext.getRequest();
		HttpServletResponse response = ServletActionContext.getResponse();
		ActionBase base = new ActionBase();
		String result =	base.actionBegin(request);
		String json = null;
        try {
            SAXReader reader = new SAXReader();
            String fileName = SiteContext.getInstance().contextRealPath + AppConstant.XML_ALERT_CONFIG_PATH;
            Document document = reader.read(new File(fileName));

            Map<Object, Object> model = new HashMap<Object, Object>();
            Node tempNode = document.selectSingleNode("//config/mailconfig/server");
            model.put(tempNode.getName(), tempNode.getText());
            tempNode = document.selectSingleNode("//config/mailconfig/port");
            model.put(tempNode.getName(), tempNode.getText());
            tempNode = document.selectSingleNode("//config/mailconfig/email");
            model.put(tempNode.getName(), tempNode.getText());
            tempNode = document.selectSingleNode("//config/mailconfig/account");
            model.put(tempNode.getName(), tempNode.getText());
            tempNode = document.selectSingleNode("//config/mailconfig/password");
            model.put(tempNode.getName(), tempNode.getText());
            tempNode = document.selectSingleNode("//config/mailconfig/title");
            model.put(tempNode.getName(), tempNode.getText());
            tempNode = document.selectSingleNode("//config/mailconfig/mailfrequency");
            model.put(tempNode.getName(), tempNode.getText());
            tempNode = document.selectSingleNode("//config/smsconfig/smsnumber");
            model.put(tempNode.getName(), tempNode.getText());
            tempNode = document.selectSingleNode("//config/smsconfig/smstitle");
            model.put(tempNode.getName(), tempNode.getText());
            tempNode = document.selectSingleNode("//config/smsconfig/smsfrequency");
            model.put(tempNode.getName(), tempNode.getText());
            String modelStr = model.toString();
            //{port=25, smsnumber=1006202102010, title=topwalk, email=andyhero168@sina.com, mailfrequency=10, smstitle=topwalk, account=andyhero168@sina.com, server=smtp.sina.com, smsfrequency=10, password=8701271314520}
            json = "{success:true,";
            String[] fields = modelStr.split("\\{")[1].split("\\}")[0].split(",");
            int index = 0;
            for (int i = 0; i < fields.length; i++) {
                if(index == fields.length - 1){
                    json += "'"+ fields[i].split("=")[0].trim()+"':'"+fields[i].split("=")[1].trim()+"'";
                }else{
                    json += "'"+ fields[i].split("=")[0].trim()+"':'"+fields[i].split("=")[1].trim()+"',";
                }
                index ++;
            }
		    json +="}";
            logService.newLog("INFO",  SessionUtils.getAccount(request).getUserName(), "报警配置","用户获取报警配置信息成功");
        } catch (Exception e) {
            logger.error("报警配置", e);
            logService.newLog("ERROE", SessionUtils.getAccount(request).getUserName(), "报警配置","用户获取报警配置信息失败");
        }
		base.actionEnd(response, json ,result);
        return null;
    }

    public String saveConfig() throws Exception {
        HttpServletRequest request = ServletActionContext.getRequest();
		HttpServletResponse response = ServletActionContext.getResponse();
		ActionBase base = new ActionBase();
		String result =	base.actionBegin(request);
		String msg = null;
        SAXReader reader = new SAXReader();
		String fileName = SiteContext.getInstance().contextRealPath	+ AppConstant.XML_ALERT_CONFIG_PATH;
		Document document = reader.read(new File(fileName));
		request.getCharacterEncoding();
		response.setCharacterEncoding("UTF-8");
		Element root = document.getRootElement();
		XMLWriter writer = null;
		try {
			Node tempNode = document.selectSingleNode("//config/mailconfig/server");
			tempNode.setText(request.getParameter("server"));
			tempNode = document.selectSingleNode("//config/mailconfig/port");
			tempNode.setText(request.getParameter("port"));
			tempNode = document.selectSingleNode("//config/mailconfig/email");
			tempNode.setText(request.getParameter("email"));
			tempNode = document.selectSingleNode("//config/mailconfig/account");
			tempNode.setText(request.getParameter("account"));
			tempNode = document.selectSingleNode("//config/mailconfig/password");
			tempNode.setText(request.getParameter("password"));
			tempNode = document.selectSingleNode("//config/mailconfig/title");
			tempNode.setText(request.getParameter("title"));
			tempNode = document.selectSingleNode("//config/mailconfig/mailfrequency");
			tempNode.setText(request.getParameter("mailfrequency"));
			tempNode = document.selectSingleNode("//config/smsconfig/smsnumber");
			tempNode.setText(request.getParameter("smsnumber"));
			tempNode = document.selectSingleNode("//config/smsconfig/smstitle");
			tempNode.setText(request.getParameter("smstitle"));
			tempNode = document.selectSingleNode("//config/smsconfig/smsfrequency");
			tempNode.setText(request.getParameter("smsfrequency"));

			OutputFormat format = OutputFormat.createPrettyPrint();

            format.setEncoding("UTF-8");

			writer = new XMLWriter(new FileOutputStream(fileName),format);

			writer.write(document);
			logger.info("write file success:" + fileName);
			writer.close();
            msg = "修改成功";
            logService.newLog("INFO",  SessionUtils.getAccount(request).getUserName(), "报警配置","用户修改报警配置信息成功");
        } catch (Exception e) {
            logger.error("报警配置", e);
            logService.newLog("ERROE", SessionUtils.getAccount(request).getUserName(), "报警配置","用户修改报警配置信息失败");
            msg = "修改失败";
        }
        String json = "{success:true,msg:'"+msg+"'}";
		base.actionEnd(response, json ,result);
        return null;
    }

    public String validateEmail() throws Exception {
        HttpServletRequest request = ServletActionContext.getRequest();
		HttpServletResponse response = ServletActionContext.getResponse();
		ActionBase base = new ActionBase();
		String result =	base.actionBegin(request);
		String msg = null;
        String subject = " 测试邮件 ";
		String text = " 测试邮件 ";
		String contact = request.getParameter("contact");

		SAXReader reader = new SAXReader();
		String fileName = SiteContext.getInstance().contextRealPath
				+ AppConstant.XML_ALERT_CONFIG_PATH;
		Document document = reader.read(new File(fileName));
		try {
			Map<String, String> model = new HashMap<String, String>();
            Node tempNode = document.selectSingleNode("//config/mailconfig/server");
            model.put(tempNode.getName(), tempNode.getText());
            tempNode = document.selectSingleNode("//config/mailconfig/port");
            model.put(tempNode.getName(), tempNode.getText());
            tempNode = document.selectSingleNode("//config/mailconfig/email");
            model.put(tempNode.getName(), tempNode.getText());
            tempNode = document.selectSingleNode("//config/mailconfig/account");
            model.put(tempNode.getName(), tempNode.getText());
            tempNode = document.selectSingleNode("//config/mailconfig/password");
            model.put(tempNode.getName(), tempNode.getText());
            tempNode = document.selectSingleNode("//config/mailconfig/title");
            model.put(tempNode.getName(), tempNode.getText());

            tempNode = document.selectSingleNode("//config/smsconfig/smsnumber");
            model.put(tempNode.getName(), tempNode.getText());
            tempNode = document.selectSingleNode("//config/smsconfig/smstitle");
            model.put(tempNode.getName(), tempNode.getText());
            logger.info(" 发送测试邮件...To: " + contact);

            JavaMailUtil.sendMail(model, subject, text, contact);

            msg = "测试邮件已发出,请注意查收!";
            logService.newLog("INFO",  SessionUtils.getAccount(request).getUserName(), "报警配置","用户测试邮件发送报警信息成功");
        } catch (Exception e) {
            logger.error("报警配置", e);
            logService.newLog("ERROE", SessionUtils.getAccount(request).getUserName(), "报警配置","用户测试邮件发送报警信息失败");
            msg = "测试邮件发送失败,请稍后再试!";
        }
        String json = "{success:true,msg:'"+msg+"'}";
		base.actionEnd(response, json ,result);
        return null;
    }

    public String validateShortMessage() throws Exception {
        HttpServletRequest request = ServletActionContext.getRequest();
		HttpServletResponse response = ServletActionContext.getResponse();
		ActionBase base = new ActionBase();
		String result =	base.actionBegin(request);
		String msg = null;
        String subject = " 测试短信 ";
		String text = " 测试短信 ";
		String contact = request.getParameter("contact");

		SAXReader reader = new SAXReader();
		String fileName = SiteContext.getInstance().contextRealPath
				+ AppConstant.XML_ALERT_CONFIG_PATH;
		Document document = reader.read(new File(fileName));
		try {
			Map<String, String> model = new HashMap<String, String>();
            Node tempNode = document.selectSingleNode("//config/mailconfig/server");
            model.put(tempNode.getName(), tempNode.getText());
            tempNode = document.selectSingleNode("//config/mailconfig/port");
            model.put(tempNode.getName(), tempNode.getText());
            tempNode = document.selectSingleNode("//config/mailconfig/email");
            model.put(tempNode.getName(), tempNode.getText());
            tempNode = document.selectSingleNode("//config/mailconfig/account");
            model.put(tempNode.getName(), tempNode.getText());
            tempNode = document.selectSingleNode("//config/mailconfig/password");
            model.put(tempNode.getName(), tempNode.getText());
            tempNode = document.selectSingleNode("//config/mailconfig/title");
            model.put(tempNode.getName(), tempNode.getText());

            tempNode = document.selectSingleNode("//config/smsconfig/smsnumber");
            model.put(tempNode.getName(), tempNode.getText());
            tempNode = document.selectSingleNode("//config/smsconfig/smstitle");
            model.put(tempNode.getName(), tempNode.getText());
            logger.info(" 发送测试短信...To: " + contact);

            JavaShortMessageUtil.sendMessage(model, subject, text, contact);

            msg = "测试短信已发出,请注意查收!";
            logService.newLog("INFO",  SessionUtils.getAccount(request).getUserName(), "报警配置","用户测试短信发送报警信息成功");
        } catch (Exception e) {
            logger.error("报警配置", e);
            logService.newLog("ERROE", SessionUtils.getAccount(request).getUserName(), "报警配置","用户测试短信发送报警信息失败");
            msg = "测试短信发送失败,请稍后再试!";
        }
        String json = "{success:true,msg:'"+msg+"'}";
		base.actionEnd(response, json ,result);
        return null;
    }


    public LogService getLogService() {
        return logService;
    }

    public void setLogService(LogService logService) {
        this.logService = logService;
    }

}
