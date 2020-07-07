# ✔ 구글 API로 장소 검색 서비스 만들기
## 🌈 기본 설정
- *package.json* 패키지 설치
<pre>
$ npm i
</pre>
- 몽고디비와 몽고디비 ODM인 몽구스 사용
- 즐겨찾기 스키마 생성 (장소아이디(`placeId`), 장소명(`name`), 좌표(`location`), 생성 시간(`createdAt`))
    -  `location` 필드는 좌푤흘 저장하는 필드로, 경도와 위도 정보가 배열로 들어있고, `index`가 `2dsphere`로 되어 있는데, 위치 정보를 저장한다.
- 검색 내역 스키마는 검색어(`query`)와 생성 시간(`createAt`) 스키마로 구성되어 있다.
- 만들 스키마들을 index.js 파일에서 몽고비디와 연결한다.
- app.js를 작성하고, 몽구스를 서버와 연결한다.
- 비밀키를 관리할 `.env` 파일 생성
<pre>
COOKIE_SECRET=[비밀키]
</pre>

## 🌈 Google Places API 사용하기
- 구글 지도와 구글 플러스가 사용하는 장소 데이터베이스에서 데이터를 가져올 수 있다.
- 구글 또는 G-mail 계정이 있어야 사용할 수 있다.
- https://developers.google.com/maps/gmp-get-started#quickstart
- 발급한 키를 `.env`파일에 저장한다.
<pre>
PLACES_API_KEY=[API key]
</pre>
- 구글은 노드를 위한 API 모듈을 제공한다.
<pre>
$ npm i @google/maps
</pre>

#### 🔸 라우터 생성(routes/index.js)
-  @google/maps 패키지로부터 구글 지도 클라이언트를 만드는 방법
<pre>
const googleMapsClient = <b>googleMaps.createClient</b>({
  key: process.env.PLACES_API_KEY,
});
</pre>
- 구글 지도 클라이언트의 `placesQueryAutoComplete` API는 검색어 자동완성이다.
- 전달된 쿼리를 input에다가 넣어준다.
- 콜백 방식으로 동작하고, 결과는 `response.json.predictions`에 담겨있다.
- 예상 검색어는 최대 다섯 개까지 반환된다.
<pre>
  googleMapsClient.<b>placesQueryAutoComplete</b>(
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
</pre>
- 실제 장소 검색 시 결괏값을 반환한다.
- `response.json.results` 에 결과가 담겨있다.
<pre>
const googlePlaces = util.promisify(<b>googleMapsClient.places</b>);
const response = await googlePlaces({
    query: req.params.query,
    language: 'ko',
});
</pre>
- `util.promisify`를 사용한 이유는 구글 지도 클라이언트는 콜백 방식으로 동작하는데, 몽구스 프로미스와 같이 사용하기 위해 프로미스 패턴으로 바꾸어주었다.
- 이렇게 바꿀 수 있는 콜백들은 프로미스로 배꿔서 최종적으로 `async/await` 문법을 사용한다.

#### 🔸 서비스 프런트 화면 부분 (views)
- `layout.js` 중요 로직
- API 데이터 연관 검색어 결과

![search](./img/2.PNG)
<pre>
predictions.forEach(function (pred) {
    console.log(pred);
    var li = document.createElement('li');
    li.textContent = pred.terms[0].value; // 연관검색어 이름
    li.onclick = function () {
    // 클릭시 href로 해당 이름으로 보낸다.
    location.href = '/search/' + pred.terms[0].value;
    };
    ul.appendChild(li);
});
</pre>

![search2](./img/1.PNG)

- 연관검색어

![search3](./img/3.PNG)

- 검색 결과

![search4](./img/4.PNG)