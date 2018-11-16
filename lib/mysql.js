var mysql = require('mysql'); // 모듈선언하고

var sql = mysql.createConnection({ //커넥션함수에 접속정보설정

  host:'localhost',
  user:'root',
  password:'1234',
  database:'eunsung'
});
sql.connect(); // db와 연결해라는 함수

module.exports = sql;
