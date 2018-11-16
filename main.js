var express = require('express');
var app = express(); // application 객체를 리턴해준다.
// var express = require('express');
// var router = express.Router(); // router 객체를 리턴하고




var compression = require('compression'); // 사용자 request를 zip형태로 저장하여 전달
var bodyParser = require('body-parser');


var helmet = require('helmet');
var session = require('express-session')
var FileStore = require('session-file-store')(session)// 세션을 파일에 저장하는 모듈
var flash = require('connect-flash'); // 로그인 실패시 경고창을 띄우는 미들웨어 npm istall -s connect-flash


app.use(helmet());// 보안설정을 자동으로 해준다 

app.use(express.static('public')); // 퍼블릭 디렉토리 안에서 스태틱(정적인)파일을 찾겠다 하는 설정
// 이설정으로 아래와 같은 설정이 가능해진다.
//  <img src="/images/hello.jpg" style="width:300px; display:block; margin-top:10px;"> url패스로 경로를 찾아갈 수 있게된다.

app.use(bodyParser.urlencoded({ extended: false })); // 미들웨어의 등록방법
// app.use는 미들웨어의 사용명령어 bodyParser는 함수이다
// form형 데이터의 처리방법
// 이코드가 실행되면서 결과로 use함수의 인자로 미들웨어가 들어오게 되고
// 사용자가 보낸 데이터를 parse해서 app.post(function(request))의 콜백 인자로 호출해준다.
// 그리고 request에 body라는 인자를 자동으로 만들어준다
// 그리고 우리는 var post = request.body의 형태로 코드를 축약해서 사용가능하게 해준다

// app.use(bodyPaser.json()); json데이터의 처리방법

app.use(compression()); // 이 모듈을 호출하면 미들웨어를 리턴하도록 약속 되어있고 app.use를 통해 장착되도록 약속되어있다.
// 이렇게 함으로써 모든 요청이 들어올 떄마다 위의 bodyParser()함수가 실행되고 compression()함수가 실행되도록 약속되어 있다. 

app.use(session({ // session이라는 함수가 실행되고
  // 그 안에 전달하는 객체로 옵션을 선택할 수 있다.
  secret: 'asadlfkj!@#!@#dfgasdg', // 다른사람에게 노출되면 안되는 코드
  resave: false, // false이면 session데이터가 바뀌기 전까지 세션값을 저장하지 않는다. 걍 false로 둬라
  saveUninitialized: true, //session이 필요하기 전까지는 session을 구동시키지 않는다 이건 기본적으로 true로 
  store: new FileStore()
})) // 사용자가 세션id를 가지고 잇는 상태에서 서버에 접속하면 request 헤더에 쿠키값으로 서버쪽으로 세션id를 전달하는데
// 그럼 session미들웨어가 저 id값을 가지고 sessionStore에서 적당한 저 id값에 대응되는 파일의 값을 읽고 request객체의 session프로퍼티에 객체를 추가한다
// 그리고 거기에 있는 값중에 num의 값에 따라 공급해준다


app.use(flash()); // request.flash라는 함수를 사용할수 있게 해준다
// conect-flash는 세션을 이용하는 것이기 때문에 반드시 세션 뒤에 구동되도록 해야한다
// 미들웨어는 구동순서가 매우 중요하다
// app.get('/flash', function(req, res){
//   // Set a flash message by passing the key, followed by the value, to req.flash().
//   req.flash('msg', 'Flash is back!!'); // flash메소드는 sessionstore에다가 "msg":["Flash is back!!","Flash is back!!"]형태로 리로드 할때마다 추가된다. 
//   res.send('flash');
// });

// app.get('/flash-display', function(req, res){
//   var fmsg = req.flash(); // req.flash()메소드에 비어있는 인자를 
//      사용하면 기존에 세션에 추가되어 있던 "msg":["Flash is back!!","Flash is back!!"]형태의 데이터가 삭제된다.
//   console.log(fmsg);
//   res.send(fmsg);
// });




var passport = require('./lib/passport')(app);// passport를 함수 모듈화 했으니 함수의 인자로 app을 주어 실행했다.
// 그리고 이 함수를 실행하면 passport를 리턴하므로 아래의 passport.~를 사용할 수 있게 된다



app.get('*', function (request, response, next) { // 특정경로에서만 미들웨어가 실행되도록 하거나 get이나 post방식 등에서만 동작하도록 지정할 수 있다.
  // 모든 get방식으로 주어지는 요청에 대해서만 사용한다는 의미이다.
  // request.list = db.get('topics').value();
  // request.authors = db.get('users').value();
  // request.list = sql.query(`select * from user`,function(err,result){

  // })
  // 이런식으로 자주사용하는 쿼리를 함수처럼 쓰면 되겠다.
  // request.authors = function(author){sql.query(`selelct * from board WHERE user_email=?`,[author],function(err,result){
    // return result
  // })}
  
  
  // fs.readdir('./data', function (error, filelist) {
  //   request.list = filelist; // request객체에 list의 값을 세팅함으로써 모든 코드에서 request객체의 list프로퍼티를 통해 글목록에 접근할 수 있게된다.
    next();// 이 next변수에 담겨있는건 그 다음에 호출되어야할 미들웨어가 담기게 된다 
    // 인자가 없는 next()는 즉 다음 미들웨어를 실행하라는 의미이다.
  // });
});


var topicRouter = require('./routes/topic'); // 라우터 파일로 분류하기
var mypageRouter = require('./routes/mypage');
var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth')(passport); // passport를 인자로 주어 router를 모듈화해 사용

app.use('/', indexRouter) // home으로 가는 라우터 설정
app.use('/topic', topicRouter) // /topic이라고 시작하는 주소들에게 topicRouter라고 하는 미들웨어를 적용하겠다 라는 의미.
app.use('/auth', authRouter)
app.use('/mypage', mypageRouter)


app.use(function (request, response, next) {
  response.status(404).send('미안 없어여기. Not Found 404야')
  // 미들웨어는 순차적으로 실행되기 때문에 맨마지막에 에러처리를 해야 위에서 처리하지 못한 에러처리를 한다.
})

app.use(function (err, request, response, next) { // 4개의 인자를 가지고 있는 함수는 error를 핸들링 하기 위한 미들웨어로 쓰이는 약속
  console.log(err.stack)
  response.status(500).send('500Error 4개의 인자를 가지고 있는 함수는 error를 핸들링 하기 위한 미들웨어로 쓰이는 약속')
})

// app.listen(3000, () => console.log('Example app listening on port 3000!'))
app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});


