var express = require('express');
var router = express.Router(); // router 객체를 리턴하고
var sanitizeHtml = require('sanitize-html');
var template = require('../lib/template.js');
var sql = require('../lib/mysql');
var bcrypt = require('bcrypt');




// main.js의 아래 선언한 것들과 대응하는 코드이다.
// var express = require('express');
// var app = express(); // application객체를 리턴해준다


module.exports = function (passport) {
  router.get('/login', function (request, response) {
    var fmsg = request.flash();
    console.log(fmsg);
    var feedback = ''; // 에러가 없다면 빈문자열이 출력되니 아무런 표시도 되지 않는다.
    if (fmsg.error) { // 만약 세션정보 flash에 error메세지가 있다면
      feedback = fmsg.error[0]; // feedback이라는 변수에 flash의 에러메시지를 담고 아래에 출력한다
    }
    var title = 'WEB - login';
    // var list = template.list(request.list, request.authors);
    var html = template.HTML(title, '', `
        <div style= "color:red;">${feedback}</div>
          <form action="/auth/login_process" method="post">
            <p>이메일 : <input type="text" name="email" placeholder="email"></p>
            <p>비밀번호 : <input type="password" name="pwd" placeholder="password"></p>
            <p>
              <input type="submit" value="로그인">
            </p>
          </form>
        `, '');
    response.send(html);
  });


  router.post('/login_process',  // 인증정보를 받는 경로
    passport.authenticate('local', { // local전략으로 하는것이란 username과 password로 하는방식 구글,페이스북등을 제외한 방식이 이것.
      successRedirect: '/', // 성공했을때는 홈으로
      failureRedirect: '/auth/login', // 실패했을때에 보내는 경로
      failureFlash: true, // error시 세션의 flash값으로 "flash":{"error":["Incorrect username."]형태로 추가된다
      successFlash: true
    }));

  router.get('/register', function (request, response) {
    var fmsg = request.flash();
    var feedback = ''; // 에러가 없다면 빈문자열이 출력되니 아무런 표시도 되지 않는다.
    if (fmsg.error) { // 만약 세션정보 flash에 error메세지가 있다면
      feedback = fmsg.error[0]; // feedback이라는 변수에 flash의 에러메시지를 담고 아래에 출력한다
    }
    var title = 'WEB - Register';
    // var list = template.list(request.list, request.authors);
    var html = template.HTML(title, '', `
        <div style= "color:red;">${feedback}</div>
          <form action="/auth/register_process" method="post">
            <p>이메일 : <input type="text" name="email" placeholder="email"></p>
            <p>비밀번호 : <input type="password" name="pwd" placeholder="password"></p>
            <p>비밀번호 확인 : <input type="password" name="pwd2" placeholder="password"></p>
            <p>닉네임 : <input type="text" name="displayName" placeholder="display name"><p>
            <p>전화번호 : <input type="text" name="phone" placeholder="Phone-number"><p>
            <p>
              <input type="submit" value="회원가입">
            </p>
          </form>
        `, '');
    response.send(html);
  });

  router.post('/register_process', function (request, response) {
    
    
    var post = request.body;
    var email = post.email;
    var pwd = post.pwd;
    var pwd2 = post.pwd2;
    var displayName = post.displayName;
    var phone = post.phone;
    console.log(1);
    
    console.log(email);
    console.log(2);
    
    sql.query(`select email from user`,function(err1,users){
      console.log(users);
      var emailCheck = template.emailCheck(users,email);
      console.log(emailCheck);
      if(emailCheck){
            request.flash('error', '이미 존재하는 이메일 입니다!');
            response.redirect('/auth/register');
            console.log('이미 존재하는 이메일');
      } else if (email === '') {
        request.flash('error', '이메일을 입력해주세요!');
        response.redirect('/auth/register');
        console.log('이메일을 입력해주세요!');
      } else if (pwd !== pwd2) {
        request.flash('error', '같은 비밀번호를 입력하였는지 확인해주세요!');
        response.redirect('/auth/register');
        console.log('같은비밀번호확인해주세요');
      } else {
        bcrypt.hash(pwd, 10, function (err, hash) { // 사용자가 입력한 패스워드, 솔트라운드, 콜백함수
          // Store hash in your password DB.
          console.log(hash); // 알아보기 힘들게 변형된 hash를 db에 저장하면된다
  
          sql.query(`INSERT INTO user (email, password, nickname,phone_number)
            VALUES(?, ?, ?, ?)`, // id컬럼은 생략 보안을 위해서 쿼리를 ?로 만들고 쉼표를 하고 배열로 변수를 집어넣는다
            [email, hash, displayName, phone], // post.author는 <select name="author">의 author다
            function (error, result) { // 콜백함수의 두번째 인자의 멤버로 insert되는 Id를 찾아 넣을 수 있다. (.insertId로)
              if (error) {
                throw error;
              }
              response.writeHead(302, { Location: `/` });// {Location: `/author`}으로 바로 리다이렉션된다
              response.end();
            })
        });
      }
    })
  });

  router.get('/logout', function (request, response) {
    request.logout(); // logout메소드를 통해 세션에 추가된 passport식별자만을 삭제된다
    //logout ()을 호출하면 req.user 등록 정보가 제거되고 로그인 세션이 삭제됩니다 (있는 경우).

    // request.session.destroy(function(err){ // 식별자가 삭제되고 남은 기존의 모든 세션을 삭제하고 
    //     response.redirect('/'); //리다이렉트한다 로그아웃완성! 그러나... 시간차에따라 로그아웃 되지 않는 문제가 생기네?
    request.session.save(function () { //기존세션을 저장하고
      response.redirect('/'); // 시간차에 따라 로그아웃이 되지 않는 문제점을 해결하기 위해 시도한 코드
    })
  });

  return router; // router를 모듈화 해서 바깥에서 사용가능하게 했다.
}