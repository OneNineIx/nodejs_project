var sql = require('../lib/mysql');
const bcrypt = require('bcrypt');

module.exports = function (app) { // 패스포트라는 모듈은 이 함수 자체가 되었다
  // 인자로는 express의 app을 받았다 그래야 app.use할 수 있으니까.


  var passport = require('passport') // 패스포트를 인클루드 했다.
    , LocalStrategy = require('passport-local').Strategy; // 패스포트는 세션객체를 사용하기 때문에 세션객체 다음에 위치시키도록 한다.

  app.use(passport.initialize()); // express가 호출 될 때마다 패스포트가 개입된다
  app.use(passport.session()); // passport가 세션미들웨어를 활용해서 그 위에서 동작한다.

  passport.serializeUser(function (user, done) { // authData를 user라는 인자로 넘겨받아 session에 저장하고 쿠키에 식별자를 만드는 방법
    console.log('serializeUser', user); // 로그인에 성공하면 done이라는 함수의 결과값(디비에있는유저정보)을 첫번째 인자로 넘겨준다
    // serializeUser { email: 'onenieix@gmail.com',
    //  password: '111111',
    //  nickname: 'onenieix' }
    done(null, user[0].email); // done이라는 함수의 두번째 인자로 고유한primary키를가진 컬럼값을 준다 user.email
    // 이 done이라는 함수를 실행하면 세션데이터 안에 데이터베이스에 있는 user.id를 패스포트에 id값으로
    // "passport":{"id":"8hGRmPnyq"}형태의 식별자값을 세션데이터에 추가하게된다
    // 즉 serializeUser함수는 딱한번 호출되면서 로그인의 성공여부를 식별자값을 추가해서 성공여부를 기록하는 함수다
  });

  passport.deserializeUser(function (id, done) { // 페이지를 방문할때마다 db를 조회해 세션에 있는 식별자와 비교해 로그인상태를 조회
    // 파라미터 id에는 세션데이터에 저장된 식별자가 들어있다

    // var user = db.get('users').find({ id: id }).value();
    sql.query(`SELECT * FROM user WHERE email=?`,[id],function(error,user){ // tpamnoix@gmail.com과 같은 쿼리로 데이터베이스를 조회해서 콜백으로 user라는 인자에 객체형태로 담기게 된다
      if(error){
        throw error;
      }
      console.log('deserializeUser', id, user);
      // 0|main  | deserializeUser _l1_osd_8 { id: '_l1_osd_8',
      // 0|main  |   email: 'onenieix@gmail.com',
      // 0|main  |   password: '111111',
      // 0|main  |   displayName: 'onenieix' }
  
      done(null, user[0].email); //done함수의 두번째 인자로 데이터베이스에 사용자가 실존하는지를 비교를 한다
      // 실제로는 인자로 받은 serializeUser에서 done함수로 넘겨준 id값(user.email)로 데이터베이스에서 조회해(우리는 편의상 authdata객체로 대체)
      // 페이지가 리로드 될 때마다 데이터베이스를 조회한다 현재 디비에연결한 상태가 아니므로 편의상 authData를 인자로 주었다.
      // 즉 deserializeUser함수는 "passport":{"user":"onenieix@gmail.com"}형태의 식별자값이 세션데이터에 존재하는지를 
      // 페이지가 리로드 될때마다 조회하여 사용자인증여부를 조회한다.
      // 페이지를 들어갈때마다 deserializeUser를 호출하고 onenieix@gmail.com값을 조회해 확인한다.
    })
  });

  passport.use(new LocalStrategy( // local전략
    {
      usernameField: 'email', // 패스포트로 전송하는 form에서 post하는 데이터에서 어떤 변수를 id와 비밀번호로 인식하게끔 하는지 설정하는 방법
      passwordField: 'pwd'
    },
    //사용자가 데이터를 전송할 때마다 두번째 콜백함수가 호출된다.
    function (email, password, done) { // 콜백함수가 실행될때 우리가 폼에서 전송한 데이터가 주입되는데 아래와 같이 확인된다.
      // var user = db.get('users').find({ email: email }).value(); // users의 키:입력받은프로퍼티
      
      // console.log('LocalStrategy', email, password);
      // LocalStrategy onenieix@gmail.com 111111 콜백내로 패스포트가 주입시켜준 데이터이다
      sql.query(`select * from user where email=?`,[email],function(error,user){
        if(error){
          throw error;
        }
        if (user) { // email정보가 true이면
          console.log('유저가어딨는데',user,'---------------------------------');
          
          bcrypt.compare(password, user[0].password, function (err, result) {// 사용자가입력한 패스워드, db에 있는 해쉬값,콜백
            if (result) { // 입력한 패스워드가 맞다면
              return done(null, user, {
                message: `${user[0].nickname}님의 방문을 환영합니다.`
              });
            } else { // 비밀번호가 맞지 않으면
              return done(null, false, {
                message: 'Password is not correct.'
              });
            }
          });
        } else { // 이메일정보가 맞지 않다면
          return done(null, false, {
            message: 'There is no email.'
          });
        }
      })
       
    }
  ));
  return passport; // return함으로써 외부에서도 사용가능하게 한다.
}


