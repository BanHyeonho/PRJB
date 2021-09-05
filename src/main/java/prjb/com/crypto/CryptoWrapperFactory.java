package prjb.com.crypto;

import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import org.apache.ibatis.reflection.MetaObject;
import org.apache.ibatis.reflection.wrapper.ObjectWrapper;
import org.apache.ibatis.reflection.wrapper.ObjectWrapperFactory;

import prjb.com.util.ComUtil;

public class CryptoWrapperFactory implements ObjectWrapperFactory {

	private static Map<Class<?>, Boolean> hasWrapperForCache = new HashMap();
	
	public CryptoWrapperFactory(){}
	
	/*
	 * true 일경우 getWrapperFor 실행
	 */
	@Override
	public boolean hasWrapperFor(Object object) {
        Class<? extends Object> clazz = object.getClass();
        String fullName = clazz.getName();
        if(fullName.equals("java.util.HashMap")) {
        	return true;
        }
        else if (!clazz.getName().startsWith("com.")) {
            return false;
        } else {
            Boolean cached = hasWrapperForCache.get(clazz);
            if (null != cached) {
                return cached;
            } else {
                Iterator var4 = ComUtil.getAllFields(clazz).iterator();

                Field field;
                do {
                    if (!var4.hasNext()) {
                        hasWrapperForCache.put(clazz, false);
                        return false;
                    }

                    field = (Field)var4.next();
                } while(null == field.getAnnotation(Crypto.class));

                hasWrapperForCache.put(clazz, true);
                return true;
            }
        }
    }

	@Override
	public ObjectWrapper getWrapperFor(MetaObject metaObject, Object object) {
		if("java.util.HashMap".equals(object.getClass().getName())) {
    		return new HashBean(metaObject, object);
    	}else {
    		return new CryptoBean(metaObject, object);	
    	}
		
	}
	  
}
