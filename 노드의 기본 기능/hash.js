const crypto = require('crypto');

//createHash() : 사용할 해시 알고리즘을 넣어준다. md5, sha1, sha256, sha512등 사용가능.
// update(문자열) : 변환할 문자열을 넣어준다.
// digest(인코딩) : 인코딩할 알고리즘을 넣어준다. base64, hex, latin1

console.log('base64 : ', crypto.createHash('sha512').update('비밀번호').digest('base64'));
console.log('hex : ', crypto.createHash('sha512').update('비밀번호').digest('hex'));
console.log('base64 : ', crypto.createHash('sha512').update('다른 비번').digest('base64'));


//  sha3 => pbkdf2나 bcrypt, scrypt 비밀번호 암호화
// pbkdf2는 기존 문자열에 salt 문자열을 붙인 후 해시 알고리즘 적용
crypto.randomBytes(64, (err,buf) => { // randomBytes() 64바이트 길이의 문자열을 만든다. (salt)
    const salt = buf.toString('base64');
    console.log('salt :', salt);
    crypto.pbkdf2('비밀번호',salt,100000,64,'sha512',(err,key) => {  // 순서대로 비밀번호, salt, 반복횟수, 출렵 바이트, 해시알고리즘
        console.log('password : ',key.toString('base64'));
    })
})

// base64 :  dvfV6nyLRRt3NxKSlTHOkkEGgqW2HRtfu19Ou/psUXvwlebbXCboxIPmDYOFRIpqav2eUTBFuHaZri5x+usy1g==
// hex :  76f7d5ea7c8b451b773712929531ce92410682a5b61d1b5fbb5f4ebbfa6c517bf095e6db5c26e8c483e60d8385448a6a6afd9e513045b87699ae2e71faeb32d6
// base64 :  Vj+KARQzGH0/aT+oi7QclsaokWKp3wjPPICeAyKgQINtM2QBfwjK6ULM6rElSIIkQoq/CitdfKd/fluZpM3Vag==
// salt : pWXHE56dqlVb+zVRlJ4kLNgzY/QL9JSWMJS8tBqZQLHPny0tofpTZcwaNO+BCI3NzackuMDVnbBB2+f1YL5G7g==
// password :  orDfqGkEpVAfs5/N7q4S/GTH1QhyBX9HI4W+azh08hBIIDmmM4iCMEqpZAT5a8FF7LZqaHJWV+YsT/OntBmHlQ==