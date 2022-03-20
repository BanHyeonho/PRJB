package prjb.com.service;

import java.util.concurrent.Future;

import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.AsyncResult;
import org.springframework.stereotype.Service;



@Service("AsyncService")
public class AsyncService {

	@Async("asyncThreadTaskExeutor")
	public Future<Void> run(Runnable runnable) {
		runnable.run();
		return new AsyncResult<>(null);
	}
	
}
