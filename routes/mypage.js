var express = require('express');
var router = express.Router();
var template = require('../lib/template.js');
var auth = require('../lib/auth')
var status = require('../lib/status');
var sanitizeHtml = require('sanitize-html');
var sql = require('../lib/mysql');
var bcrypt = require('bcrypt');


router.get('/', function (request, response) {
    if (!auth.isOwner(request, response)) { // 로그인되어있지 않으면 글작성 불가능
        request.flash('error', '로그인 해주세요.');
        response.redirect('/auth/login');
        return false;
    }
    sql.query(`SELECT board.id AS boardid,board.title AS boardtitle, board.description AS boarddescription,SUBSTR(board.date,1,16) AS boarddate,
    comment.id AS commentid,board_id,comment,SUBSTR(comment.date,1,16) AS commentdate 
    FROM board LEFT JOIN comment 
    ON board.id = comment.board_id 
    WHERE comment.user_email =?`, [request.user], function (error, comment) {

            sql.query(`SELECT board.id AS boardid,board.title AS boardtitle, board.description AS boarddescription,SUBSTR(board.date,1,16) AS boarddate,
        comment.id AS commentid,board_id,comment,SUBSTR(comment.date,1,16) AS commentdate 
        FROM board LEFT JOIN comment 
        ON board.id = comment.board_id 
        WHERE board.user_email =?`, [request.user], function (error2, board) {

                    sql.query(`select * from user where email =?`, [request.user], function (error3, user) {
                        var myboard = template.mylist(board);
                        var mycomment = template.mycommentList(comment);

                        console.log('유저모야', user);

                        var fmsg = request.flash();
                        console.log(fmsg);
                        var feedback = ''; // 에러가 없다면 빈문자열이 출력되니 아무런 표시도 되지 않는다.
                        if (fmsg.success) { // 만약 세션정보 flash에 error메세지가 있다면
                            feedback = fmsg.success; // feedback이라는 변수에 flash의 에러메시지를 담고 아래에 출력한다
                        }
                        var title = 'MyPage';

                        var html = template.HTML(title, '',
                            `
                    <div style="color:blue;">${feedback}</div>
                    <h2>내가 작성한 글 목록</h2>
                    ${myboard}
                    <hr>
                    ${mycomment}
                    <hr>
                    <h2>회원정보 수정</h2>
                    <form action="/mypage/update_process" method="post">
                    <input type="hidden" name="mail" value="${user[0].email}">
                    <p> 별명 : <input type="text" name="nic" placeholder="${user[0].nickname}"></p>
                    <p> 비밀번호 : <input type="text" name="pwd" placeholder="password"></p>
                    <p> 전화번호 : <input type="text" name="phone" placeholder="${user[0].phone_number}"></p>
                    <p>
                        <input type="submit" value="수정하기">
                    </p>
                    </form>
                    `,
                            ``,
                            auth.statusUI(request, response), // 다섯번째 인자로 넘겨주면 템플릿에서 다섯번째 인자로 사용된다.
                            auth.statusUI2(request, response),
                            '<li><a href="/">Home</a></li>',
                            '<li><a href="/topic">Board</a></li>',
                            status.statusUIM()

                        );
                        response.send(html);
                    })
                })
        })
});


router.post('/update_process', function (request, response) {
    if (!auth.isOwner(request, response)) { // 로그인되어있지 않으면 글작성 불가능
        response.redirect('/');
        return false;
    }
    console.log(request.body);

    var post = request.body;
    var nic = post.nic;
    var pwd = post.pwd;
    var phone = post.phone;
    var email = post.mail;
    console.log(nic);

    bcrypt.hash(pwd, 10, function (err, hash) { // 사용자가 입력한 패스워드, 솔트라운드, 콜백함수
        // Store hash in your password DB.
        console.log(hash); // 알아보기 힘들게 변형된 hash를 db에 저장하면된다

        sql.query(`UPDATE user SET password=?, nickname=?, phone_number=? WHERE email=?`, [hash, nic, phone, email], function (err, update) {
            if (err) {
                throw err
            }
            response.redirect(`/mypage`);
        })
    });
});

module.exports = router;