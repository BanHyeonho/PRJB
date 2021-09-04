package com.mapper;

import java.util.List;
import java.util.Map;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Repository;

/*
 * Vo를 사용하지않고 Map을 사용하여 쿼리호출 
 */

@Repository("CommDao")
public class CommDao {

	@Autowired
	@Qualifier("sqlSession")
	private SqlSessionTemplate sqlSession;

	public List<Map> selectList(String queryId, Map param) throws Exception {
		return sqlSession.selectList(queryId, param);
	}

	public Map selectOne(String queryId, Map param) throws Exception {
		return sqlSession.selectOne(queryId, param);
	}

	public String insert(String queryId, Map map) throws Exception {
		sqlSession.insert(queryId, map);
		return String.valueOf(map.get("seqPk"));
	}

	public void update(String queryId, Map map) throws Exception {
		sqlSession.update(queryId, map);
	}

	public void delete(String queryId, Map map) throws Exception {
		sqlSession.delete(queryId, map);
	}
	
}
