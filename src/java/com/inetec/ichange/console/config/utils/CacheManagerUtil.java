/**
 *
 * User: ������
 * Date: 2009-9-12
 * Time: 20:02:55
 */
package com.inetec.ichange.console.config.utils;

import com.inetec.common.exception.Ex;
import net.sf.ehcache.Cache;
import net.sf.ehcache.CacheException;
import net.sf.ehcache.CacheManager;

public class CacheManagerUtil {
    private static CacheManagerUtil ourInstance = new CacheManagerUtil();

    private static CacheManager manager;

    public static CacheManagerUtil getInstance() {
        return ourInstance;
    }

    private CacheManagerUtil() {

    }

    public Cache getCache() throws Ex {
    	initial();
    	Cache cache = manager.getCache("metaDataCache");
        return cache;
    }

    public void initial() throws Ex {
        if (manager == null)
            try {
                manager = CacheManager.create(this.getClass().getResource("/cache.xml"));
            } catch (CacheException e) {
                throw new Ex().set(e);
            }
    }

    public void destroy() {
        if (manager != null)
            manager.shutdown();
    }

}
