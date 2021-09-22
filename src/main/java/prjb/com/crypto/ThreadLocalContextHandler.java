package prjb.com.crypto;
//
//import java.util.HashMap;
//import java.util.Map;
//import java.util.Optional;
//import java.util.function.Supplier;
//
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//
//public class ThreadLocalContextHandler extends ThreadLocal<ThreadLocalContextHolder> {
//    private static final Logger log = LoggerFactory.getLogger(ThreadLocalContextHandler.class);
//    private static final ThreadLocalContextHandler local = new ThreadLocalContextHandler();
//    private static boolean alreadyWarned = false;
//
//    private ThreadLocalContextHandler() {
//    }
//
//    @Override
//	protected ThreadLocalContextHolder initialValue() {
//        return new ThreadLocalContextHolder();
//    }
//
//    private static ThreadLocalContextHolder getContextHolder() {
//        return getContextHolder(true);
//    }
//
//    private static ThreadLocalContextHolder getContextHolder(boolean checkWarn) {
//        ThreadLocalContextHolder holder = local.get();
//        if (!alreadyWarned && checkWarn && !holder.isClearByOther()) {
//            log.warn("WARNING!!! This thread's ThreadLocalContextHolder object may NOT managed.");
//            alreadyWarned = true;
//        }
//
//        return holder;
//    }
//
//    public static void clearContextHolder() {
//        ThreadLocalContextHolder holder = getContextHolder(false);
//        holder.setClearByOther(true);
//        holder.clear();
//    }
//
//    public static <T> Optional<T> get(String key) {
//        return getContextHolder().get(key);
//    }
//
//    public static <T> Optional<T> get(Class<T> ctxClass) {
//        return getContextHolder().get(ctxClass);
//    }
//
//    public static <T> T getOrDefault(String key, T defaultValue) {
//        Optional<T> optional = get(key);
//        return optional.orElse(defaultValue);
//    }
//
//    public static <T> T getOrDefault(String key, Supplier<T> defaultValueSupplier) {
//        Optional<T> optional = get(key);
//        return optional.orElseGet(defaultValueSupplier);
//    }
//
//    public static <T> T getOrDefault(Class<T> ctxClass, T defaultValue) {
//        Optional<T> optional = get(ctxClass);
//        return optional.orElse(defaultValue);
//    }
//
//    public static <T> T getOrDefault(Class<T> ctxClass, Supplier<T> defaultValueSupplier) {
//        Optional<T> optional = get(ctxClass);
//        return optional.orElseGet(defaultValueSupplier);
//    }
//
//    public static <T> T getOrDefaultAndPut(String key, T defaultValue) {
//        Optional<T> optional = get(key);
//        return optional.orElseGet(() -> {
//            put(key, defaultValue);
//            return defaultValue;
//        });
//    }
//
//    public static <T> T getOrDefaultAndPut(String key, Supplier<T> defaultValueSupplier) {
//        Optional<T> optional = get(key);
//        return optional.orElseGet(() -> {
//            T defaultValue = defaultValueSupplier.get();
//            put(key, defaultValue);
//            return defaultValue;
//        });
//    }
//
//    public static <T> T getOrDefaultAndPut(Class<T> ctxClass, T defaultValue) {
//        Optional<T> optional = get(ctxClass);
//        return optional.orElseGet(() -> {
//            put(defaultValue);
//            return defaultValue;
//        });
//    }
//
//    public static <T> T getOrDefaultAndPut(Class<T> ctxClass, Supplier<T> defaultValueSupplier) {
//        Optional<T> optional = get(ctxClass);
//        return optional.orElseGet(() -> {
//            T defaultValue = defaultValueSupplier.get();
//            put(defaultValue);
//            return defaultValue;
//        });
//    }
//
//    public static void put(Object ctx) {
//        getContextHolder().put(ctx);
//    }
//
//    public static void put(String key, Object ctx) {
//        getContextHolder().put(key, ctx);
//    }
//
//    public static void remove(String key) {
//        getContextHolder().remove(key);
//    }
//
//    public static void remove(Class<?> ctxClass) {
//        getContextHolder().remove(ctxClass);
//    }
//}
//
//class ThreadLocalContextHolder {
//    private Map<String, Object> contextMap = new HashMap();
//    private boolean clearByOther;
//
//    ThreadLocalContextHolder() {
//    }
//
//    void clear() {
//        this.contextMap.clear();
//    }
//
//    <T> Optional<T> get(String key) {
//        try {
//            return (Optional<T>) Optional.ofNullable(this.contextMap.get(key));
//        } catch (ClassCastException var3) {
//            return Optional.empty();
//        }
//    }
//
//    <T> Optional<T> get(Class<T> ctxClass) {
//        Optional<T> result = this.get(ctxClass.getName());
//        if (result.isPresent()) {
//            return result;
//        } else {
//            Optional<Object> ctxObj = this.contextMap.values().stream().filter((ctx) -> {
//                return null != ctx && ctxClass.isInstance(ctx);
//            }).findAny();
//            return Optional.ofNullable(ctxClass.cast(ctxObj.orElse((Object)null)));
//        }
//    }
//
//    void put(Object ctx) {
//        if (null != ctx) {
//            this.contextMap.put(ctx.getClass().getName(), ctx);
//        }
//    }
//
//    void put(String key, Object ctx) {
//        if (null != key) {
//            this.contextMap.put(key, ctx);
//        }
//    }
//
//    void remove(String key) {
//        this.contextMap.remove(key);
//    }
//
//    void remove(Class<?> ctxClass) {
//        this.remove(ctxClass.getName());
//    }
//
//    boolean isClearByOther() {
//        return this.clearByOther;
//    }
//
//    void setClearByOther(boolean clearByOther) {
//        this.clearByOther = clearByOther;
//    }
//}