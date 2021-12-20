package prjb.com.util;

import net.bramp.ffmpeg.FFmpeg;
import net.bramp.ffmpeg.FFmpegExecutor;
import net.bramp.ffmpeg.FFprobe;
import net.bramp.ffmpeg.builder.FFmpegBuilder;

public class FFmpegUtil {

	final static String ffmepgPath = "/usr/bic/ffmpeg";
	final static String ffprobePath = "/usr/bin/ffprobe";
	
	public static boolean convert(String input, String output, String outputType) throws Exception{
		
		boolean result = false;

		FFmpeg	ffmpeg = new FFmpeg(ffmepgPath);
		FFprobe ffprobe = new FFprobe(ffprobePath);
		
//		FFmpegBuilder builder = new FFmpegBuilder().setInput("usr/local/video/test.mov") // 파일경로
		FFmpegBuilder builder = new FFmpegBuilder().setInput(input) // 파일경로
													.overrideOutputFiles(true) // 오버라이드
//													.addOutput("usr/local/video/test.mp4") // 저장 경로 ( mov to mp4 )
													.addOutput(output) // 저장 경로 ( mov to mp4 )
//													.setFormat("mp4") // 포맷 ( 확장자 )
													.setFormat(outputType) // 포맷 ( 확장자 )
													.setVideoCodec("libx264") // 비디오 코덱
													.disableSubtitle() // 서브타이틀 제거
													.setAudioChannels(2) // 오디오 채널 ( 1 : 모노 , 2 : 스테레오 )
													.setVideoResolution(1280, 720) // 동영상 해상도
													.setVideoBitRate(1464800) // 비디오 비트레이트
													.setStrict(FFmpegBuilder.Strict.EXPERIMENTAL) // ffmpeg 빌더 실행 허용
													.done();
		
		FFmpegExecutor executor = new FFmpegExecutor(ffmpeg, ffprobe);
		executor.createJob(builder).run();
		
		result = true;
		return result;
	}
	
}
