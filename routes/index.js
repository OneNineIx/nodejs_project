var express = require('express');
var router = express.Router();
var template = require('../lib/template.js');
var auth = require('../lib/auth')
var status = require('../lib/status');


router.get('/', function(request,response){
  var fmsg = request.flash();
    console.log(fmsg);
    var feedback = ''; // 에러가 없다면 빈문자열이 출력되니 아무런 표시도 되지 않는다.
    if(fmsg.success){ // 만약 세션정보 flash에 error메세지가 있다면
        feedback = fmsg.success; // feedback이라는 변수에 flash의 에러메시지를 담고 아래에 출력한다
    }
      var title = 'HOME';
      var description = '황준성 nodejs.';
      var html = template.HTML(title, '',
        `
        <div style="color:blue;">${feedback}</div>
        <h2>${title}</h2>${description}
        <img src="/images/hello.jpg" style="width:300px; display:block; margin-top:10px;">
        `,
        ``,
        auth.statusUI(request, response), // 다섯번째 인자로 넘겨주면 템플릿에서 다섯번째 인자로 사용된다.
        auth.statusUI2(request, response),
        status.statusUIH(),
        '<li><a href="/topic">Board</a></li>'
     
      );
      response.send(html);
  });

module.exports = router;