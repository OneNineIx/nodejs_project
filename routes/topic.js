var express = require('express');
var router = express.Router(); // router 객체를 리턴하고
var sanitizeHtml = require('sanitize-html');
var template = require('../lib/template.js');
var auth = require('../lib/auth');
var status = require('../lib/status');
var sql = require('../lib/mysql');


// main.js의 아래 선언한 것들과 대응하는 코드이다.
// var express = require('express');
// var app = express(); // application객체를 리턴해준다


router.get('/', function (request, response) {
    var fmsg = request.flash();
    console.log(fmsg);
    var feedback = ''; // 에러가 없다면 빈문자열이 출력되니 아무런 표시도 되지 않는다.
    if (fmsg.success) { // 만약 세션정보 flash에 error메세지가 있다면
        feedback = fmsg.error[0]; // feedback이라는 변수에 flash의 에러메시지를 담고 아래에 출력한다
    }
    console.log('/', request.user); // passport미들웨어가 request에
    // deserialize에서 전달한 user라는 객체를 주입해 사용할 수 있게 해준다.

    // console.log(request.list);//[ 'bodyparser33', 'express', 'HTML', 'Nodejs2' ] 전역적으로 호출됨을 확인할 수 있다.
    console.log(request.session);// 아래와같은 세션객체 정보가 담겨있다.
    // Session {
    //            cookie:
    //             { path: '/',
    //               _expires: null,
    //               originalMaxAge: null,
    //               httpOnly: true },
    //            __lastAccess: 1538248708912,
    //            is_logined: true,
    //            nickname: 'egoing' }
    // fs.readdir('./data', function(error, filelist){ // 그럼 이게 필요없어진다
    sql.query(`select id,title,description,user_email,SUBSTR(date,1,16) as date,nickname from board left join user on board.user_email = user.email order by date desc`, function (err, boardList) {
        if (err) {
            throw err
        }
        var title = 'Board';
        var list = template.list(boardList); // 인자로 filelist 대신 request.list를 준다.
        var html = template.HTML(title, list,
            `
            <div style="color:blue;">${feedback}</div>
            `,
            `<div class="btn-group" ><a href="/topic/create" class="button">글 작성하기</a></div>`,
            auth.statusUI(request, response), // 다섯번째 인자로 넘겨주면 템플릿에서 다섯번째 인자로 사용된다.
            auth.statusUI2(request, response),
            '<li><a href="/">Home</a></li>',
                    status.statusUIB()
        );
        response.send(html);
        // });
    })

});

router.get('/create', function (request, response) {
    if (!auth.isOwner(request, response)) { // 로그인되어있지 않으면 글작성 불가능
        request.flash('error', '로그인 해주세요.');
        response.redirect('/auth/login');
        return false;
    }
    sql.query(`select * from board`, function (err, boardList) {
        if (err) {
            throw err
        }
        var title = 'WEB - create';
        var list = template.list(boardList);
        var html = template.HTML(title, '', `
          <form action="/topic/create_process" method="post">
            <p>제목 : <input type="text" name="title" placeholder="title"></p>
            <p>
              본문 : <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
        `, '',
            auth.statusUI(request, response),
            auth.statusUI2(request, response),
            '<li><a href="/">Home</a></li>',
                    status.statusUIB()
            );
        response.send(html);
    })

});

router.post('/create_process', function (request, response) {
    // 미들웨어를 생성해보면서 알게된 사실 app.post('패스',두번째 인자콜백은) 사실 미들웨어였다라는 사실을 알 수 있게되었다.
    // express에서는 사실 모든게 미들웨어라고 할수도 있다.
    // 미들웨어는 중간에 있는 작은 소프트웨어라는 표현으로 이해하면 쉽다.
    if (!auth.isOwner(request, response)) {
        
        response.redirect('/');
        return false;
    }
    var post = request.body;
    var title = post.title;
    var description = post.description;
    sql.query(`INSERT INTO board (title,description,user_email,date)
            VALUE(?,?,?,NOW())`, [title, description, request.user],
        function (error, createBoard) {
            if (error) {
                throw error;
            }
            response.redirect(`/topic/${createBoard.insertId}`)
        })

});


router.get('/update/:pageId', function (request, response) {
    if (!auth.isOwner(request, response)) { // 로그인되어있지 않으면 글작성 불가능
        request.flash('error', '로그인 해주세요.');
        response.redirect('/auth/login');
        return false;
    }
    sql.query(`select * from user left join board on user.email = board.user_email where board.id=?`, [request.params.pageId], function (error, userCheck) {
        console.log('유저값맞냐이거', userCheck[0].email);

        if (userCheck[0].email !== request.user) {
            request.flash('error', '작성자만이 글을 수정할 수 있습니다.');
            return response.redirect(`/topic/${request.params.pageId}`);
        } else{
            sql.query(`select * from board WHERE id=?`, [request.params.pageId], function (err, board) {
                console.log('보드맞냐이거', board[0].id);
        
                if (err) {
                    throw err
                }
                var title = board[0].title;
                var description = board[0].description;
                var html = template.HTML(title, '',
                    `
                
                <form action="/topic/update_process" method="post">
                  <input type="hidden" name="id" value="${board[0].id}">
                  <p>제목 : <input type="text" name="title" placeholder="title" value="${title}"></p>
                  <p>
                    본문 : <textarea name="description" placeholder="description">${description}</textarea>
                  </p>
                  <p>
                    <input type="submit">
                  </p>
                </form>
                `,
                    `<a href="/topic/create">create</a> <a href="/topic/update/${board[0].id}">update</a>`,
                    auth.statusUI(request, response),
                    auth.statusUI2(request, response),
                    '<li><a href="/">Home</a></li>',
                            status.statusUIB()
                );
                response.send(html);
            })
        }
    })
})

router.post('/update_process', function (request, response) {
    if (!auth.isOwner(request, response)) { // 로그인되어있지 않으면 글작성 불가능
        response.redirect('/');
        return false;
    }
    var datetime = new Date();
    var post = request.body;
    var id = post.id;
    var title = post.title;
    var description = post.description;
    sql.query(`select * from user left join board on user.email = board.user_email where board.id=?`, [id], function (error, result) {
        if (result[0].email !== request.user) {
            request.flash('error', '글 작성자만이 수정할 수 있습니다');
            return response.redirect(`/topic/${post.id}`);
        }
        sql.query(`UPDATE board SET title=?, description=?, date=? WHERE id=?`, [title, description, datetime, id], function (err, update) {
            if (err) {
                throw err
            }
            response.redirect(`/topic/${post.id}`);
        })
    })
});


router.post('/delete_process', function (request, response) {
    if (!auth.isOwner(request, response)) { // 로그인되어있지 않으면 글작성 불가능
        request.flash('error', '로그인 해주세요.');
        response.redirect('/auth/login');
        return false;
    }
    var post = request.body;
    var id = post.id;
    sql.query(`select * from user left join board on user.email = board.user_email where board.id=?`, [id], function (error, userCheck) {
        
        sql.query(`select *,comment.id AS commentid from board left join comment on board.user_email=comment.user_email WHERE board.id=?`,[id],function(err,commentCheck){
            if(commentCheck[0].commentid === undefined){
                sql.query(`DELETE FROM board WHERE id=?`, [id], function (err, boardDelete) {
                    if (err) {
                        throw err
                    }
                    response.redirect(`/topic`);
                })
            } else{
                sql.query(`DELETE FROM comment WHERE board_id=?`, [id], function (err1, boardDelete2) {
                    if (err1) {
                        throw err1
                    }
                    sql.query(`DELETE FROM board WHERE id=?`, [id], function (err2, boardDelete3) {
                        if (err) {
                            throw err
                        }
                        response.redirect(`/topic`);
                    })
                })
            }
        })
        if (userCheck[0].email !== request.user) {
            request.flash('error', '작성자만이 삭제할 수 있습니다.');
            return response.redirect(`/topic/${id}`);
        }
    })
    response.redirect('/');
})

// main.js에서 app.use('/topic',topicRouter);와 같이 선언하면
// router.get('/:pageId', function(request,response,next){와 같이 작성한다. 
// /topic루트뒤에 /:pageId루트를 경로로 잡는 것이기 때문에 생략해야한다.
router.get('/:pageId', function (request, response, next) { // /page/:어떤값에 pageId라는 이름을 붙인것. 프리티url
    // 간편 URL은 질의어 없이, 경로만 가진 간단한 구조의 URL을 말한다. 
    // 사용자 친화적 URL, 검색엔진 친화적 URL 또는 간단히 친화적 URL이라고도 한다. 
    // 깔끔하지 않은 URL에 비해 기억하기 쉽고, 입력하기 쉽다는 장점이 있다


    sql.query(`select *,SUBSTR(date,1,16) as date from board left join user on board.user_email = user.email where id =?`, [request.params.pageId], function (error, detailPage) {
        if (error) {
            throw error
        }
        sql.query(`select board.id as boardid,comment.*,SUBSTR(comment.date,1,16) as datetime from board left join comment on board.id=comment.board_id  where board.id=?`, [request.params.pageId], function (err, comment) {
            if (err) {
                throw err
            }
            sql.query(`select *,comment.id as commentid from user left join comment on user.email=comment.user_email where board_id=?`, [comment[0].boardid], function (err2, commentUser) {
                // 해당하는 게시물에 댓글을 단 사용자의 목록이 USER테이블과 comment테이블이 조인되어 담겨있다.
                if (err2) {
                    throw err2
                }
            
            var fmsg = request.flash();
            console.log(fmsg);
            var feedback = ''; // 에러가 없다면 빈문자열이 출력되니 아무런 표시도 되지 않는다.
            if (fmsg.success) { // 만약 세션정보 flash에 error메세지가 있다면
                feedback = fmsg.success; // feedback이라는 변수에 flash의 에러메시지를 담고 아래에 출력한다
            }
            // var title = topic.title;
            var sanitizedTitle = sanitizeHtml(detailPage[0].title);
            var sanitizedDescription = sanitizeHtml(detailPage[0].description, {
                allowedTags: ['h1']
            });
            var commentList = ''
            if(commentUser[0] === undefined){
                var commentList = ''
            } else{
                console.log('여기머가들었니',commentUser);
                var commentList = template.commentList(comment,commentUser);
            }
            var html = template.HTML(sanitizedTitle, commentList,
                `
                <div style="color:blue;">${feedback}</div>
                <h3>${sanitizedTitle}</h3>
                
                ${sanitizedDescription}
                <p>by ${detailPage[0].nickname}    ${detailPage[0].date}</p>
                
                `,
                ` <div class="btn-group"><a href="/topic" class="button">글목록</a></div>

                <div class="btn-group"><a href="/topic/update/${request.params.pageId}" class="button">수정하기</a></div>

                    <form action="/topic/delete_process" method="post">
                      <input type="hidden" name="id" value="${request.params.pageId}">
                      <input type="submit" value="삭제하기">
                    </form>

                    <form action="/topic/comment_process" method="post">
                    <input type="hidden" name="id" value="${request.params.pageId}">
                    <br><br>
                    <hr>
                    <div align="center" >
                    <textarea name="comment" placeholder="댓글을 입력하세요"></textarea> <input type="submit" value="댓글등록">
                    </div>
                    </form>
                    
                    `,
                auth.statusUI(request, response),
                auth.statusUI2(request, response),
                '<li><a href="/">Home</a></li>',
                        status.statusUIB()
            );
            response.send(html);
            })
        })
    })


    // 사용자가 요청한 url을 데이터베이스에서 id컬럼에서 req.params.pageId 인것을 찾아서 url에 대입해준다.
    // request.params는 {"pageId":"사용자가입력한url"} 형태의 객체이다


   
    // request.params에는 {"pageId":"html"}(사용자가 입력한 url)이 담긴다.
    // http://localhost:3000/page/html로 접속할 경우
    // {"pageId":"html"} 
});

// app.get('/page/:pageId/:chapterId', function(request,response){ // /page/:어떤값에 pageId라는 이름을 붙인것.
//   return response.send(request.params); // request.params에는 {"pageId":"html","chapterId":"css"} 형태로 "사용자가 입력한 url"이 담긴다.
//   // http://localhost:3000/page/html로 접속할 경우
//   // {"pageId":"html","chapterId":"css"} 
// });



router.post('/comment_process', function (request, response) {
    if (!auth.isOwner(request, response)) { // 로그인되어있지 않으면 글작성 불가능
        request.flash('error', '로그인 해주세요.');
        response.redirect('/auth/login');
        return false;
    }
    var datetime = new Date();
    var post = request.body;
    var id = post.id;
    var comment = post.comment;
    sql.query(`select email from user`,function(err1,users){
      console.log(users);
      var emailCheck = template.emailCheck(users,request.user);
      console.log(emailCheck);
      if(emailCheck){
            sql.query(`INSERT INTO comment (user_email, board_id, comment, date) VALUE(?,?,?,?)`, [request.user, id, comment, datetime], function (err, update) {
                if (err) {
                    throw err
                }
                response.redirect(`/topic/${post.id}`);
            })
      } else{
        request.flash('error', '로그인해야 댓글을 달수 있습니다.');
            return response.redirect(`/topic/${post.id}`);
      }
    })
});

router.post('/comment_delete_process', function (request, response) {
    if (!auth.isOwner(request, response)) { // 로그인되어있지 않으면 글작성 불가능
        request.flash('error', '로그인 해주세요.');
        response.redirect('/auth/login');
        return false;
    }

    var post = request.body;
    var commentId = post.commentId;// commentid니까 사용자인증만 하면될거같다.
    var boardId = post.boardId; // 작성자가 아닐경우 해당게시물로 redirect하기위한 변수
    console.log('boardID가먼데',boardId);
    console.log(commentId);
    
    sql.query(`select a.id as a_id, b.id as b_id, a.user_email as a_user_email, b.user_email as b_user_email from comment a left join board b on b.id = a.board_id where a.id = ?`, [commentId], function (error, userCheck) {
        console.log('여긴왔어?1');
        if (userCheck[0].a_user_email !== request.user) {
            console.log('여긴왔어?2');
            console.log(userCheck[0].a_user_email);
            request.flash('error', '작성자만이 삭제할 수 있습니다.');
            response.redirect(`/topic/${boardId}`);
        } else{
            sql.query(`DELETE FROM comment WHERE id=?`, [commentId], function (err1, boardDelete2) { // 전달받은 인자의 코멘트 id로 코멘트를 삭제
                if (err1) {
                    throw err1
                }
                console.log(commentId);
                console.log('여긴왔어?');
                response.redirect(`/topic/${boardId}`); //그리고 코멘트를 삭제한 해당 게시물로 redirect
            })
        }
    })
})

module.exports = router; // router를 모듈화 해서 바깥에서 불러오게 하는 설정



