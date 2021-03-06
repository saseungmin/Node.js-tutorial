var timer;
// keyup 자동완성
document.querySelector('#search').addEventListener('keyup', function (e) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === xhr.DONE) {
      if (xhr.status === 200) {
        var predictions = JSON.parse(xhr.responseText);
        var ul = document.querySelector('#search-list');
        // 초기화를 먼저시켜주고
        ul.innerHTML = '';
        // 받은 데이터 for문 돌려준다.
        predictions.forEach(function (pred) {
          var li = document.createElement('li');
          li.textContent = pred.terms[0].value;
          li.onclick = function () {
            // 클릭시 href로 해당 이름으로 보낸다.
            location.href = '/search/' + pred.terms[0].value;
          };
          ul.appendChild(li);
        });
      } else {
        console.error(xhr.responseText);
      }
    }
  };
  // query 공백제거
  var query = this.value.trim();
  // 타이머가 존재하면 clear
  if (timer) {
    clearTimeout(timer);
  }
  // 0.2초마다 보낸다.
  timer = setTimeout(function () {
    if (query) {
      xhr.open('GET', '/autocomplete/' + query);
      xhr.send();
    }
  }, 200);
});

document.querySelector('#search-form').addEventListener('submit', function (e) {
  e.preventDefault();
  // 검색어를 입력하지 않으면 submit하지 않는다.
  if (!this.search.value || !this.search.value.trim()) {
    this.search.focus();
    return false;
  }
  if (this.type.value) {
    return (location.href = '/search/' + this.search.value.trim() + '?type=' + this.type.value);
  }
  // 검색어에 맞게 form요청 전송
  this.action = '/search/' + this.search.value.trim();
  return this.submit();
});

document.querySelector('#loc-search-btn').addEventListener('click', function (e) {
  e.preventDefault();
  if (navigator.geolocation) {
    // GPS를 지원하면
    navigator.geolocation.getCurrentPosition(
      function (position) {
        var search = document.querySelector('#search');
        var type = document.querySelector('#type').value;

        if (!search.value || !search.value.trim()) {
          search.focus();
          return false;
        }
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        location.href =
          '/search/' + search.value.trim() + '?lat=' + lat + '&lng=' + lng + '&type=' + type;
      },
      function () {
        alert('내 위치 확인 권한을 허용하세요.');
      },
      {
        enableHighAccuracy: false,
        maximumAge: 0,
        timeout: Infinity,
      },
    );
  } else {
    alert('GPS를 지원하지 않습니다.');
  }
});
