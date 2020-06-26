const express = require("express");
const axios = require("axios");

const router = express.Router();
const URL = "http://localhost:8002/v1";

axios.defaults.headers.origin = "http://localhost:8003";
const request = async (req, api) => {
  try {
    // 세션에 토큰이 없으면
    if (!req.session.jwt) {
      const tokenResult = await axios.post(`${URL}/token`, {
        clientSecret: process.env.CLIENT_SECRET,
      });
      req.session.jwt = tokenResult.data.token; // 세션에 토큰 저장
    }
    return await axios.get(`${URL}${api}`, {
      headers: { authorization: req.session.jwt },
    }); // API 요청
  } catch (error) {
    console.error(error);
    if (error.response.status < 500) {
      // 410이나 419처럼 의도된 에러면 발생
      return error.response;
    }
    throw error;
  }
};

// 자신이 작성한 포스트를 JSON 형식으로 가져오는 라우터
router.get("/mypost", async (req, res, next) => {
  try {
    // 발급 받은 토큰 테스트
    const result = await request(req, "/posts/my");
    res.json(result.data);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 해시태그를 검색하는 라우터
router.get("/search/:hashtag", async (req, res, next) => {
  try {
    const result = await request(
      req,
      `/posts/hashtag/${encodeURIComponent(req.params.hashtag)}`
    );
    res.json(result.data);
  } catch (error) {
    if (error.code) {
      console.error(error);
      next(error);
    }
  }
});

module.exports = router;
