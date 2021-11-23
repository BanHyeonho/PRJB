package prjb.com.controller;

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

import prjb.com.service.ComService;
import prjb.com.service.StService;

@RequestMapping("/st")
@Controller("StController")
public class StController {

	@Autowired
	ComService comService;
	
	@Autowired
	StService stService;
	
	private static final Logger logger = LoggerFactory.getLogger(StController.class);
		
	/**
	 * 비디오 스트리밍
	 */
	@GetMapping(value = "/video")
	public ResponseEntity<ResourceRegion> getVideo(@RequestHeader HttpHeaders headers, HttpServletRequest request) throws Exception { 

		return stService.getVideo(headers, request);
	}
	

}
