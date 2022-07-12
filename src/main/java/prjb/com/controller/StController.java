package prjb.com.controller;

import java.io.File;
import java.io.FileInputStream;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.support.ResourceRegion;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import fr.noop.subtitle.sami.SamiObject;
import fr.noop.subtitle.sami.SamiParser;
import prjb.com.service.ComService;
import prjb.com.service.ScheduleService;
import prjb.com.service.StService;

@RequestMapping("/st")
@Controller("StController")
public class StController {

	@Autowired
	ComService comService;
	
	@Autowired
	StService stService;
	
	@Autowired
	ScheduleService scheduleService;
	
	private static final Logger logger = LoggerFactory.getLogger(StController.class);
		
	/**
	 * 비디오 스트리밍
	 */
	@GetMapping(value = "/video")
	public ResponseEntity<ResourceRegion> getVideo(@RequestHeader HttpHeaders headers, HttpServletRequest request) throws Exception { 

		return stService.getVideo(headers, request);
	}
	
	/**
	 * 비디오 스트리밍
	 */
	@GetMapping(value = "/subtitle")
	public @ResponseBody Object subtitle(HttpServletRequest request) throws Exception { 

		return stService.subtitle(request);
	}
	
	/**
	 * 파일변환
	 */
	@RequestMapping(value = "/convert", method = RequestMethod.POST)
	public @ResponseBody Map convert(HttpServletRequest request) throws Exception {
		logger.info("URL is {}.", "[" + request.getRequestURI() + "]");
		
		return stService.convert(request);
	}
	
	/**
	 * 스케쥴러 파일변환 강제시작
	 */
	@RequestMapping(value = "/scheduleConvert", method = RequestMethod.POST)
	public @ResponseBody Map scheduleConvert(HttpServletRequest request) throws Exception {
		logger.info("URL is {}.", "[" + request.getRequestURI() + "]");
		Map resultMap = new HashMap();
		
		scheduleService.fileConvert();
		
		return resultMap;
	}
	
	/**
	 * 테스트
	 */
	@RequestMapping(value = "/test")
	public @ResponseBody Map test(HttpServletRequest request) throws Exception {
		logger.info("URL is {}.", "[" + request.getRequestURI() + "]");
		Map<String, Object> resultMap = new HashMap();
		
		SamiObject so = new SamiParser("EUC-KR").parse(new FileInputStream(new File("C:\\Users\\Administrator\\Desktop\\task\\3id.smi")));
		
		System.out.println(so.toString());
		return resultMap;
	}
}
