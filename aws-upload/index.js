const AWS = require('aws-sdk');
// gm 패키지는 이미지 조작을 위한 패키지
// imageMagick 방식으로 이미지를 리사이징하기 위해 subClass 메서드로 imageMagick를 설정
// ImageMagick : 이미지 파일을 생성,수정 등의 작업하기 위한 오픈소스 소프트웨어
const gm = require('gm').subClass({ imageMagick: true });
const s3 = new AWS.S3();

// handler 함수가 Lambda 호출 시 실행되는 함수
// event 매개변수는 호출 상황에 대한 정보가 담겨 있고, context는 실행되는 함수 환경에 대한 정보가 담겨 있다.
// callback은 함수가 완료되었는지를 람다에게 알려준다.
exports.handler = (event, context, callback) => {
  // event 객체로부터 버킷 이름(Bucket)과 파일 경로(Key)를 받아온다.
  const Bucket = event.Records[0].s3.bucket.name;
  const Key = event.Records[0].s3.object.key;
  // 파일 경로(Key)를 통해서 파일명(filename)과 확장자(ext)도 얻을 수 있다.
  const filename = Key.split('/')[Key.split('/').length - 1];
  const ext = Key.split('.')[Key.split('.').length - 1];
  // s3.getObject 메서드로 버킷으로부터 파일을 불러오고 data.Body에 파일 버퍼가 담겨 있다.
  console.log('name', filename, 'ext', ext);
  s3.getObject({ Bucket, Key }, (err, data) => {
    if (err) {
      console.error(err);
      return callback(err);
    }
    // gm 함수에 파일 버퍼를 넣고, resize 메서드로 크기를 지정하고 첫 번째와 두 번째 인자는 가로와 세로 너비를 의미한다.
    // 하지만 첫 번째 두 번째 인자 크기로 리사이징하라는 뜻이 아니라 세 번째 인자인 옵션에 따라 리사이징한다.
    // quality 메서드는 화질을 결정하고 90%로 설정하였다.
    // toBuffer 메서드는 리사이징된 이미지 결과를 버퍼로 출력한다.
    return gm(data.Body)
      .resize(200, 200, '^')
      .quality(90)
      .toBuffer(ext, (err, buffer) => {
        if (err) {
          console.error(err);
          return callback(err);
        }
        // 리사이징된 이미지를 thumb 폴더 아래에 저장한다.
        console.log(buffer);
        return s3.putObject(
          {
            Bucket,
            Key: `thumb/${filename}`,
            Body: buffer,
          },
          (err) => {
            if (err) {
              console.error(err);
              return callback(err);
            }
            return callback(null, `thumb/${filename}`);
          },
        );
      });
  });
};
