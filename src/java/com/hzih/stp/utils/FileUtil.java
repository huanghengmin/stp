package com.hzih.stp.utils;

import com.hzih.stp.domain.AuditReset;
import com.inetec.common.client.ECommonUtil;
import com.inetec.common.client.util.LogBean;
import com.inetec.common.client.util.XChange;
import com.inetec.common.exception.Ex;
import com.inetec.common.util.OSInfo;
import org.apache.commons.io.FileUtils;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Created by IntelliJ IDEA.
 * User: 钱晓盼
 * Date: 12-6-11
 * Time: 下午2:15
 * To change this template use File | Settings | File Templates.
 */
public class FileUtil {

    /**
     * 上传文件
     * @param savePath          保存路径
     * @param uploadFile        上传文件
     * @param uploadFileFileName  上传文件文件名
     * @throws IOException
     */
    public static void upload(String savePath,File uploadFile,String uploadFileFileName) throws IOException {
        File dir = new File(savePath);
        if(!dir.exists()){
            dir.mkdir();
        }
        String newFile = dir+"/"+uploadFileFileName;
        copy(uploadFile, newFile);
    }

    /**
     *
     * @param from   被复制文件
     * @param to     保存后文件地址
     */
    public static void copy(File from,String to) throws IOException {
        BufferedInputStream bis = null;
        BufferedOutputStream bos = null;
        bis = new BufferedInputStream(
                new FileInputStream(from));
        bos = new BufferedOutputStream(
                new FileOutputStream(
                        new File(to)));
        byte[] buf = new byte[1024];
        int len = -1;
        while ((len = bis.read(buf))!=-1){
            bos.write(buf,0,len);
        }
        bos.flush();
        bos.close();
        bis.close();
    }

    /**
     * 读取
     * @return
     */
    public static String readFileNames(String path,int start,int limit) {
        String[] files = readFileName(path);
        String json = null;
        if(files.length==0){
            json = "{success:true,total:0,rows:[]}";
        }else{
            json = "{success:true,total:"+files.length+",rows:[";
            int count = 0;
            for (int i = 0; i<files.length; i++){
                if(i==start&& count<limit){
                    start ++;
                    count ++;
                    json += "{fileName:'"+files[i]+"'},";
                }
            }
            json += "]}";
        }
        return json;
    }

    public static String readRemoteFileNames() throws XChange {
         String[] files = readRemoteLogFileName();
        String json = null;
        if(files.length==0){
            json = "{'success':true,'total':"+files.length+",rows:[,]}";
        }else{
            json = "{'success':true,'total':"+files.length+",rows:[";
            int count = 0;
            for (int i = 0; i<files.length; i++){
//                if(i==start&& count<limit){
//                    start ++;
//                    count ++;
                    json += "{'fileName':'"+files[i]+"'},";
//                }
            }
            json += "]}";
        }
        return json;
    }

    /**
	 * 读取外网服务器日志
	 */
	public static String[] readRemoteLogFileName() throws XChange {
		ECommonUtil ecu = new ECommonUtil();
		LogBean[] bean = ecu.getLogFiles();
		int total = bean.length;
		List<String> logs = new ArrayList<String>();
		for (int i = 0; i < total; i++) {
			String length = setLength(bean[i].getLogFileLength());
			String externalLog = bean[i].getLogFileName()+"("+length+")";
			logs.add(externalLog);
		}
		return logs.toArray(new String[logs.size()]);
	}

    /**
     * 计算long成 MB KB B
     * @param l
     * @return
     */
    public static String setLength(long l) {
		String a = "0";
		if(l>0){
			if(l<512){
				a =l+"B";
			}else if(l >=512&&l <= 10485){
				a = new DecimalFormat("0.00").format((double)l/(1024));
				String[] b = a.split("\\.");
				if(b[1].equals("00")){
					a = b[0]+"KB";
				}else{
					a +="KB";
				}
			}else if(l > 10485 && l < 1024*1024*1024){
				a = new DecimalFormat("0.00").format((double)l/(1024*1024));
				String[] b = a.split("\\.");
				if(b[1].equals("00")){
					a = b[0]+"MB";
				}else{
					a +="MB";
				}
			}else if(l >= 1024*1024*1024){
				a = new DecimalFormat("0.00").format((double)l/(1024*1024*1024));
				String[] b = a.split("\\.");
				if(b[1].equals("00")){
					a = b[0]+"GB";
				}else{
					a +="GB";
				}
			}
		}
		return a;
	}

    public static void downType(HttpServletResponse response,String name,String userBrowser) {
		response.reset();
		response.setBufferSize(5*1024*1024);
		response.addHeader("Content-Disposition", "attachment;filename=\"" + name + "\"");
		if(userBrowser.indexOf("Firefox")>0){
			response.setHeader("Pragma", "No-cache");
			response.setHeader("Cache-Control", "no-cache");
		}
		response.setContentType("application/octet-stream; charset=UTF-8");
	}

    /**
     *
     * @param from       被复制文件
     * @param response   传输响应 用于文件下载时
     */
    public static HttpServletResponse copy(File from,HttpServletResponse response){ //下载
//    	response.addHeader("Content-Length", ""+from);

        ServletOutputStream out =null;
        BufferedInputStream in = null;
        try {
            out = response.getOutputStream();
            in = new BufferedInputStream(new FileInputStream(from));
            byte[] content = new byte[1024*1024];
            int length;
            while ((length = in.read(content, 0, content.length)) != -1){
                out.write(content, 0, length);
                out.flush();
            }
            in.close();
            out.flush();
//            out.close();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return response;
    }

    /**
    *
    * @param path  文件夹路径  xml
    * @return      文件夹中所有文件名
    */
   public static String[] readXmlFileName(String path){
       File file = new File(path);
       String[] files = file.list();
       List<String> list = new ArrayList<String>();
       for (int i = 0; i < files.length; i++) {
			if(files[i].indexOf(".xml")>0){
				list.add(files[i]);
			}
		}
       return list.toArray(new String[list.size()]);
   }

    /**
     *
     * @param path  文件夹路径 rizhi
     * @return      文件夹中所有文件名
     */
    public static String[] readFileName(String path){
        File file = new File(path);
        File[] files = file.listFiles();
        List<String> list = new ArrayList<String>();
        for (int i = 0; i < files.length; i++) {
			if(files[i].getName().indexOf(".log")>0){
				String length = setLength(files[i].length());
			    String logName = files[i].getName()+"("+length+")";
				list.add(logName);
			}else if (files[i].getName().indexOf(".xml")>0){
			    String logName = files[i].getName();
				list.add(logName);
            }
		}
        return list.toArray(new String[list.size()]);
    }

    /**
     *
     * @param fileName   上传文件名
     * @param path       上传路径
     * @param file       上传文件
     * @return           保存后的文件地址
     */
    public String upload(String fileName,String path,File file) {
        long now = new Date().getTime();
        int index = fileName.lastIndexOf('.');
        File dir = new File(path);
        if(!dir.exists()){
            dir.mkdir();
        }
        String saveFileName =null;
        if(index!=-1){
            saveFileName = fileName.substring(0,index) +"_"+ now + fileName.substring(index);
        }
        String newFile = dir+"/"+saveFileName;
        OSInfo osInfo = OSInfo.getOSInfo();
		if (osInfo.isWin()) {
			newFile.replace('\\', '/');
		}
        return newFile;
    }

    /**
     *
     *
     * @param from   "E:/../xx/xx.xxx"
     * @param to     "E:/../yy"
     * @param addName "E:/../yy/xxaddName.xxx"
     * @return
     */
    public String copy(String from, String to, String addName) {

        File file = new File(from);
        String saveFileName =  from.substring(from.lastIndexOf('/')+1,from.lastIndexOf('.'));
        String saveFile = to+"/"+saveFileName+addName+from.substring(from.lastIndexOf('.'));
        BufferedInputStream bis = null;
        BufferedOutputStream bos = null;
        try {
            bis = new BufferedInputStream(
                    new FileInputStream(file));
            bos = new BufferedOutputStream(
                    new FileOutputStream(
                            new File(saveFile)));
            byte[] buf = new byte[1024];
            int len = -1;
            while ((len = bis.read(buf))!=-1){
                bos.write(buf,0,len);
            }
            bos.flush();
            bos.close();
            bis.close();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return saveFile;
    }

    public void copyRecover(String from, String to) {
        File file = new File(from);
        BufferedInputStream bis = null;
        BufferedOutputStream bos = null;
        try {
            bis = new BufferedInputStream(
                    new FileInputStream(file));
            bos = new BufferedOutputStream(
                    new FileOutputStream(
                            new File(to)));
            byte[] buf = new byte[1024];
            int len = -1;
            while ((len = bis.read(buf))!=-1){
                bos.write(buf,0,len);
            }
            bos.flush();
            bos.close();
            bis.close();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public String[] readLogFileName(String logpath) {
		File file = new File(logpath);
        String[] files = file.list();
        int length = 0;
        for (int i = 0; i < files.length; i++) {
            if(files[i].endsWith("log")){
                length ++;
            }
        }
        int index = 0;
        String[] filesReturn = new String[length];
        for (int i = 0; i < files.length; i++) {
            if(files[i].endsWith("log")){
                filesReturn[index++] = files[i];
            }
        }
        return filesReturn;
	}

	public void delete(String file) {
		File f = new File(file);
		f.delete();
	}

    public static String copyInternalXmlToVersion(String addName) {
        String saveFile = StringContext.INTERNALVERSIONPATH+"/config"+addName+".xml";
    	try {
			FileUtils.copyFile(new File(StringContext.INTERNALXML), new File(saveFile));
		} catch (IOException e) {
			e.printStackTrace();
		}
        return saveFile;
    }

    public static String copyExternalXmlToVersion(String addName) {
        String saveFile = StringContext.EXTERNALVERSIONPATH+"/config"+addName+".xml";
    	try {
			FileUtils.copyFile(new File(StringContext.EXTERNALXML), new File(saveFile));
		} catch (IOException e) {
			e.printStackTrace();
		}
        return saveFile;
    }

    public static void deleteFileByFileNames(String path,String[] fileNames){
        for (int i=0;i<fileNames.length;i++) {
            File file = new File(path+"/"+fileNames[i]);
            if(file.exists()){
                file.delete();
            }
        }
    }

    public static void copyVersionToInternalXml(String fileName) throws IOException {
        File file = new File(StringContext.INTERNALXML);
        if(file.exists()){
            file.delete();
        }
        copy(new File(StringContext.INTERNALVERSIONPATH+"/"+fileName),StringContext.INTERNALXML);
    }

    public static void copyVersionToExternalXml(String fileName) throws IOException {
        File file = new File(StringContext.EXTERNALXML);
        if(file.exists()){
            file.delete();
        }
        copy(new File(StringContext.EXTERNALVERSIONPATH+"/"+fileName),StringContext.EXTERNALXML);
    }

    public static String export(List<AuditReset> list) throws IOException, Ex {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd_HH-mm-ss");
        Date date = new Date();
        String flag = sdf.format(date);
        String resetaudit = StringContext.RESETFILEPATH+"/resetaudit_" + flag + ".xml";

        File file = new File(resetaudit);
        String str = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<audit>\n</audit>";
        OutputStreamWriter out = new OutputStreamWriter(new FileOutputStream(file));
        out.write(str);
        out.flush();
        out.close();
        Configuration config = new Configuration(resetaudit) ;
        config.addAuditReset(list);
        config.saveAuditReset();
        return "resetaudit_" + flag + ".xml";
    }


    public static void copyDirectoryToDirectory(File srcDir, File destDir) throws IOException {
        InputStream in = new FileInputStream(srcDir);
        byte[] b = new byte[in.available()];
        in.read(b);
        OutputStream out = new FileOutputStream(destDir);
        out.write(b);
        in.close();
        out.close();
    }

    /**
     * 删除目录下的所有文件;
     * @param dir
     */
    public static void deleteFiles(String dir) {
        File file = new File(dir);
        File[] files = file.listFiles();
        for (int i=0;i<files.length;i++) {
            if(files[i].exists()) {
                files[i].delete();
            }
        }
    }

    /**
     * 按行读取文件,组成 list列表;
     * @param fileName
     * @return
     * @throws IOException
     */
    public static List<String> readFileLines(String fileName) throws IOException {
        List<String> list = new ArrayList<String>();
    	BufferedReader in = null;
		in = new BufferedReader(new FileReader(fileName));
		String r = in.readLine();
		while(r!=null){
			list.add(r.trim());
			r = in.readLine();
		}
		in.close();
        return list;
    }

    /**
     * 判断文件是否存在,不存在则创建
     * @param fileFullName
     * @throws IOException
     */
    public static void createFile(String fileFullName) throws IOException {
        File file = new File(fileFullName);
        if(!(file.exists()&&file.isFile())){
            String filePath = fileFullName.substring(0,fileFullName.lastIndexOf("/"));
            File dir = new File(filePath);
            dir.mkdirs();
            file.createNewFile();
        }
    }

    public static void createDir(String dir) throws IOException {
        File file = new File(dir);
        file.mkdirs();
    }


    /**
     * 按行写文件,在文件后换行写
     * @param fileFullName 文件路径
     * @param arps 行
     */
    public static void writeOnline(String fileFullName, List<String> arps) throws IOException {
        File file = new File(fileFullName);
        PrintWriter pw = new PrintWriter(new FileWriter(file,true));
        for(String arp : arps){
            pw.println(arp);
            pw.flush();
        }
        pw.close();
    }

    /**
     * 覆盖写
     * @param fileFullName
     * @param arp
     */
    public static void write(String fileFullName, String arp) throws Exception {
        File file = new File(fileFullName);
        FileOutputStream out = new FileOutputStream(file);
        out.write(arp.getBytes());
        out.flush();
        out.close();
    }
}
