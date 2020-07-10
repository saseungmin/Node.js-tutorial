const express = require('express');
const util = require('util');
const googleMaps = require('@google/maps');

const History = require('../schemas/history');
const Favorite = require('../schemas/favorite');

const router = express.Router();
// @google/maps 패키지로부터 구글 지도 클라이언트를 만드는 방법
const googleMapsClient = googleMaps.createClient({
  key: process.env.PLACES_API_KEY,
});

router.get('/', async (req, res) => {
  try {
    const favorites = await Favorite.find({});
    res.render('index', {results: favorites});
  } catch (error) {
    console.error(error);
    next(error);
  }
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
  const googlePlacesNearby = util.promisify(googleMapsClient.placesNearby);
  const { lat, lng, type } = req.query;
  try {
    const history = new History({ query: req.params.query });
    // 결괏값 반환 이전에 검색 내역을 구현하기 위해서 데이터베이스에 검색어를 저장한다.
    await history.save();
    let response;
    // 위도와 경도가 존재하면
    if (lat && lng) {
      response = await googlePlacesNearby({
        keyword: req.params.query,
        location: `${lat},${lng}`,
        rankby: 'distance',
        language: 'ko',
        type,
      });
    } else {
      response = await googlePlaces({
        // 검색어
        query: req.params.query,
        language: 'ko',
        type,
      });
    }
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

// 즐겨찾기
router.post('/location/:id/favorite', async (req, res, next) => {
  try {
    const favorite = await Favorite.create({
      placeId: req.params.id,
      name: req.body.name,
      // 경도 위도 순으로
      location: [req.body.lng, req.body.lat],
    });
    res.send(favorite);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
