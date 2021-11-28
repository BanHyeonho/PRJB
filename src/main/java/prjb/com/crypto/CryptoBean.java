
package prjb.com.crypto;

import java.lang.reflect.Field;

import org.apache.ibatis.reflection.ExceptionUtil;
import org.apache.ibatis.reflection.MetaClass;
import org.apache.ibatis.reflection.MetaObject;
import org.apache.ibatis.reflection.ReflectionException;
import org.apache.ibatis.reflection.invoker.Invoker;
import org.apache.ibatis.reflection.property.PropertyTokenizer;
import org.apache.ibatis.reflection.wrapper.BeanWrapper;

import prjb.com.util.ComUtil;
import prjb.com.util.CryptoUtil;

public class CryptoBean extends BeanWrapper {
    
    private final Object object;
    private final MetaClass metaClass;

    public CryptoBean(MetaObject metaObject, Object object) {
        super(metaObject, object);
        this.object = object;
        this.metaClass = MetaClass.forClass(object.getClass(), null);
    }

    @Override
	public String findProperty(String name, boolean useCamelCaseMapping) {
        return metaClass.findProperty(name, true);
    }
    
    @Override
	public Object get(PropertyTokenizer prop) {
        if (prop.getIndex() != null) {
            Object collection = this.resolveCollection(prop, this.object);
            return this.getCollectionValue(prop, collection);
        } else {
            return this.getBeanProperty(prop, this.object);
        }
    }

    @Override
	public void set(PropertyTokenizer prop, Object value) {
        if (prop.getIndex() != null) {
            Object collection = this.resolveCollection(prop, this.object);
            this.setCollectionValue(prop, collection, value);
        } else {
            this.setBeanProperty(prop, this.object, value);
        }

    }

    private Object getBeanProperty(PropertyTokenizer prop, Object object) {
        try {
            Invoker method = this.metaClass.getGetInvoker(prop.getName());

            try {
                Object value = method.invoke(object, NO_ARGUMENTS);
                Field field = ComUtil.getField(object.getClass(), prop.getName());
                return String.class.isInstance(value) && null != field.getAnnotation(Crypto.class) ? CryptoUtil.encrypt(String.class.cast(value)) : value;
            } catch (Throwable var6) {
                throw ExceptionUtil.unwrapThrowable(var6);
            }
        } catch (RuntimeException var7) {
            throw var7;
        } catch (Throwable var8) {
            throw new ReflectionException("Could not get property '" + prop.getName() + "' from " + object.getClass() + ".  Cause: " + var8.toString(), var8);
        }
    }

    private void setBeanProperty(PropertyTokenizer prop, Object object, Object value) {
        try {
            Field field = ComUtil.getField(object.getClass(), prop.getName());
            if (String.class.isInstance(value) && null != field.getAnnotation(Crypto.class)) {
                value = CryptoUtil.decrypt(String.class.cast(value));
            }

            Invoker method = this.metaClass.getSetInvoker(prop.getName());
            Object[] params = new Object[]{value};

            try {
                method.invoke(object, params);
            } catch (Throwable var8) {
                throw ExceptionUtil.unwrapThrowable(var8);
            }
        } catch (Throwable var9) {
            throw new ReflectionException("Could not set property '" + prop.getName() + "' of '" + object.getClass() + "' with value '" + value + "' Cause: " + var9.toString(), var9);
        }
    }
}
