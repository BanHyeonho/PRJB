package prjb.com.crypto;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import org.apache.ibatis.reflection.MetaObject;
import org.apache.ibatis.reflection.property.PropertyTokenizer;
import org.apache.ibatis.reflection.wrapper.MapWrapper;

import prjb.com.init.InitBean;
import prjb.com.util.CryptoUtil;

public class HashBean extends MapWrapper{

	private final ArrayList<String> ENCRYPT_ARRAY;
	private final CryptoUtil CryptoUtil;
	
	private Map<String, Object> map;
	
	public HashBean(MetaObject metaObject, Object map) {
		super(metaObject, (Map<String, Object>)map);
		this.map = (Map<String, Object>)map;
		this.CryptoUtil = InitBean.CryptoClass;
		this.ENCRYPT_ARRAY = InitBean.encryptArray;
	}

    @Override
	public Object get(PropertyTokenizer prop) {
        if (prop.getIndex() != null) {
            Object collection = this.resolveCollection(prop, this.map);
            return this.getCollectionValue(prop, collection);
        } else {
        	
        	if(this.map.get(prop.getName()) != null && "java.util.HashMap".equals(this.map.get(prop.getName()).getClass().getName())) {
        		
        		return this.map.get(prop.getName());
        		
        	}
        	else {
        		if(ENCRYPT_ARRAY.indexOf(prop.getName()) == -1) {
            		return this.map.get(prop.getName());
            	}
            	//암호화
            	else {
            		return CryptoUtil.encrypt(String.class.cast(this.map.get(prop.getName())));
            	}
        	}
        	
        }
    }

    @Override
	public void set(PropertyTokenizer prop, Object value) {
        if (prop.getIndex() != null) {
            Object collection = this.resolveCollection(prop, this.map);
            this.setCollectionValue(prop, collection, value);
        } else {
        	
        	if(value == null) {
        		this.map.put(prop.getName(), value);
        	}
        	else {
        		if("java.util.HashMap".equals(value.getClass().getName())) {
            		
            		Map m = (HashMap<String, String>)value;
            		if(ENCRYPT_ARRAY.indexOf(m.get("COLUMN_NAME")) == -1) {
    	        		this.map.put(prop.getName(), value);
    	        	}
    	        	//암호화
    	        	else {
    	        		m.put("COLUMN_VALUE", CryptoUtil.encrypt(String.class.cast(m.get("COLUMN_VALUE"))));
    	        		this.map.put(prop.getName(), m);
    	        	}
            		
            	}
    			else {
    				if(ENCRYPT_ARRAY.indexOf(prop.getName()) == -1) {
    	        		this.map.put(prop.getName(), value);
    	        	}
    	        	//복호화
    	        	else {
    	        		this.map.put(prop.getName(), CryptoUtil.decrypt(String.class.cast(value)));
    	        	}
    			}
        	}
        }

    }

}
