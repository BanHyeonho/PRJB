package prjb.com.init;

import java.util.concurrent.Executor;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

@Configuration
@EnableAsync
public class AsyncThreadConfiguration {

	private final int CORE_POOL_SIZE = 10;					//동시 동작하는 최대 Thread 수
	private final int MAX_POOL_SIZE = Integer.MAX_VALUE;	//쓰레드 풀의 최대사이즈
	private final int QUEUE_CAPACITY = Integer.MAX_VALUE;	//MaxPoolSize 초과 요청에서 Thread 생성 요청시, 해당 요청을 Queue에 저장하는데 이때 최대 수용 가능한 Queue의 수, Queue에 저장되어있다가 Thread에 자리가 생기면 하나씩 빠져나가 동작
	private final String THREAD_NAME = "PRJB-THREAD-";		//생성되는 Thread 접두사 지정
	
	@Bean("asyncThreadTaskExeutor")
	public Executor asyncThreadTaskExeutor() {
		
		ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
		
		executor.setCorePoolSize(CORE_POOL_SIZE);
        executor.setMaxPoolSize(MAX_POOL_SIZE);
        executor.setQueueCapacity(QUEUE_CAPACITY);
        executor.setThreadNamePrefix(THREAD_NAME);
        executor.initialize();
        
		return executor;
	}
}
