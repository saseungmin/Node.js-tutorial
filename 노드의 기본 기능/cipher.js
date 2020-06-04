const crypto = require('crypto');

// crypto.createCipher(알고리즘, 키) : 알고리즘 목록은 crypto.getCipher()
// cipher.update(문자열, 인코딩, 출력 인코딩) : 암호화할 대상과 대상의 인코딩, 출력 결과물의 인코딩을 넣어준다.
// cipher.final(출력 인코딩) : 출력 결과물의 인코딩을 넣어주면 암호화가 된다.
const cipher = crypto.createCipher('aes-256-cbc', '열쇠');
let result = cipher.update('암호화할 문장', 'utf8', 'base64');
result += cipher.final('base64');
console.log('암호화',result);

// crypto.createDecipher(알고리즘, 키) : 암호화할때 사용한 알고리즘과 키를 그대로 넣어준다.
// decipher.update(문자열, 인코딩, 출력 인코딩) : 역순으로 넣어준다.
// decipher.final(출력 인코딩) : 복호화 결과물의 인코딩을 넣어준다.
const decipher = crypto.createDecipher('aes-256-cbc','열쇠');
let result2 = decipher.update(result, 'base64', 'utf8');
result2 += decipher.final('utf8');
console.log('복호화:',result2);