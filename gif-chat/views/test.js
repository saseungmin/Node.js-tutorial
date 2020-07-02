document.querySelector('#gif').addEventListener('change', function (e) {
  var formData = new FormData();
  var xhr = new XMLHttpRequest();
  console.log(e.target.files);
  formData.append('gif', e.target.files[0]);
  xhr.onload = function () {
    if (xhr.status === 200) {
      e.target.file = null;
    } else {
      console.error(xhr.responseText);
    }
  };
  xhr.open('POST', '/room/#{room._id}/gif');
  xhr.send(formData);
});
