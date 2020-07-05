var es = new EventSource('/sse');
es.onmessage = function (e) {
  document.querySelectorAll('.time').forEach(function (td) {
    var end = new Date(td.dataset.start);
    var server = new Date(parseInt(e.data, 10));
    end.setDate(end.getDate() + 1);
    if (server >= end) {
      return (td.textContent = '00:00:00');
    } else {
      var t = end - server;
      var seconds = ('0' + Math.floor((t / 1000) % 60)).slice(-2);
      var minutes = ('0' + Math.floor((t / 1000 / 60) % 60)).slice(-2);
      var hours = ('0' + Math.floor((t / (1000 * 60 * 60)) % 24)).slice(-2);
      return (td.textContent = hours + ':' + minutes + ':' + seconds);
    }
  });
};
