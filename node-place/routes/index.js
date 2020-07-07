const express = require('express');
const util = require('util');
const googleMaps = require('@google/maps');

const History = require('../schemas/history');

const router = express.Router();
// @google/maps 패키지로부터 구글 지도 클라이언트를 만드는 방법
const googleMapsClient = googleMaps.createClient({
  key: process.env.PLACES_API_KEY,
});

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/autocomplete/:query', (req, res, next) => {
  // 구글 지도 클라이언트의 placesQueryAutoComplete API는 검색어 자동완성이다.
  googleMapsClient.placesQueryAutoComplete(
    {
      input: req.params.query,
      language: 'ko',
    },
    (err, response) => {
      if (err) {
        return next(err);
      }
      return res.json(response.json.predictions);
    },
  );
});

// 실제 장소 검색 시 결괏값을 반환한다.
router.get('/search/:query', async (req, res, next) => {
  // googleMapsClient.places 장소 검색
  const googlePlaces = util.promisify(googleMapsClient.places);
  try {
    const history = new History({ query: req.params.query });
    // 결괏값 반환 이전에 검색 내역을 구현하기 위해서 데이터베이스에 검색어를 저장한다.
    await history.save();
    const response = await googlePlaces({
      // 검색어
      query: req.params.query,
      language: 'ko',
    });
    // result.pug 랜더링
    res.render('result', {
      title: `${req.params.query} 검색 결과`,
      // response.json.results에 결과가 담겨있다.
      results: response.json.results,
      query: req.params.query,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
