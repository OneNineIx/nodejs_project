module.exports = {
  HTML: function (title, list, body, control, 
    authStatusUI = '<a href="/auth/login">로그인</a>', 
    authStatusUI2 = '<a href="/auth/register">회원가입</a>',
    selectUIH='<li><a href="/">Home</a></li>',
    selectUIB='<li><a href="/topic">Board</a></li>',
    selectUIM='<li><a href="/mypage">MyPage</a></li>'
    ) {
    return `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
      <style>

        textarea {
          width: 100%;
          height: 80px;
          padding: 12px 20px;
          box-sizing: border-box;
          border: 2px solid #ccc;
          border-radius: 4px;
          background-color: #f8f8f8;
          font-size: 16px;
          resize: none;
        }

        input[type=text], select {
          width: 100%;
          padding: 12px 20px;
          margin: 8px 0;
          display: inline-block;
          border: 1px solid #ccc;
          border-radius: 4px;
          box-sizing: border-box;
        }

        input[type=password], select {
          width: 100%;
          padding: 12px 20px;
          margin: 8px 0;
          display: inline-block;
          border: 1px solid #ccc;
          border-radius: 4px;
          box-sizing: border-box;
        }
      
        input[type=button], input[type=submit], input[type=reset] {
            background-color: #4CAF50;
            border: none;
            color: white;
            padding: 10px 25px;
            text-decoration: none;
            margin: 5px 5px 5px 0px;
            cursor: pointer;
            font-size: 20px;
            float: right;
        }
        


        a:link, a:visited { 
          color: black;
          text-decoration: none;
        }
        a:link:active, a:visited:active { 
            color: (internal value);
        }
        

        table {
          font-family: arial, sans-serif;
          border-collapse: collapse;
          width: 100%;
        }
        td, th {
          border: 1px solid black;
          text-align: left;
          padding: 8px;
         }
  
        tr:nth-child(even) {
            background-color: #dddddd;
        }

        .btn-group .button {
          background-color: #4CAF50; /* Green */
          border: none;
          color: white;
          padding: 10px 25px;
          text-align: center;
          text-decoration: none;
          display: inline-block;
          font-size: 20px;
          cursor: pointer;
          float: left;
          margin: 5px 5px 5px 0px;
          float: right;
        }
      
        .btn-group .button:hover {
            background-color: #3e8e41;
        }
        
        

        body {margin: 0;}

        ul.topnav {
            list-style-type: none;
            margin: 0;
            padding: 0;
            overflow: hidden;
            background-color: #333;
        }

        ul.topnav li {float: left;}

        ul.topnav li a {
            display: block;
            color: white;
            text-align: center;
            padding: 14px 16px;
            text-decoration: none;
        }
        ul.topnav li span {
          display: block;
          color: white;
          text-align: center;
          padding: 14px 16px;
          text-decoration: none;
      }

        ul.topnav li a:hover:not(.active) {background-color: #111;}

        ul.topnav li a.active {background-color: #4CAF50;}

        ul.topnav li.right {float: right;}

        @media screen and (max-width: 600px){
            ul.topnav li.right, 
            ul.topnav li {float: none;}
        }



          .item1 { grid-area: header; }
          .item2 { grid-area: menu; }
          .item3 { grid-area: main; }
          .item4 { grid-area: right; }
          .item5 { grid-area: footer; text-align: center;}

          .grid-container {
            display: grid;
            grid-template-areas:
              'header header header header header header'
              'menu main main main main right'
              'footer footer footer footer footer footer';
            grid-gap: 1px;
            background-color: black;
            padding: 10px;
          }
          .grid-container > div {
            background-color: rgba(255, 255, 255, 0.8);
           
            padding: 20px 0;
            font-size: 30px;
          }
        </style>
    </head>
    <body>
      <ul class="topnav">
        
        ${selectUIH}
        ${selectUIB}
        ${selectUIM}
        
        <li class="right">${authStatusUI2}</li>
        <li class="right">${authStatusUI}</li>
        
      </ul>
      
      <div class="grid-container">
        <div class="item2"></div>
        <div class="item3"> 
        ${body}
        ${control}
        ${list}
        </div>  
        <div class="item4"></div>
        <div class="item5">Footer</div>
      </div>
     
      
    </body>
    </html>
    `;
  }, list: function (topics) {
    // <ol class="board"></ol><li>
    var list = `
    <table>
    <tr>
      <th>글 제목</th>
      <th>작성자</th>
      <th>작성일</th>
    </tr>`;
    var i = 0;
    while (i < topics.length) {

      list = list + `<tr>
      <td><a href="/topic/${topics[i].id}">${topics[i].title}</a></td>
      <td>${topics[i].nickname}</td>
      <td>${topics[i].date}</td>
      </tr>`; // 넘겨받은 filelist가 객체형태이므로 .id, .title형태로 취해야한다. 
      //`<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`; 와 같은 형식에서 위와같이 변경했다
      i = i + 1;


    }
    list = list + '</table>';
    return list;
  }
  , emailCheck: function (users, post) {

    var i = 0;
    while (i < users.length) {
      if (users[i].email === post) {
        return true
      }
      i = i + 1;
    }
  }, commentList: function (comment,user) {
    var list = `
    <table>
    <tr>
      <th>댓글</th>
      <th>작성자</th>
      <th>작성일</th>
      <th>삭제</th>
    </tr>`;
    var i = 0;
    while (i < comment.length) {
      list = list + `
      <tr>
      <td>${comment[i].comment}</a></td>
      <td>${user[i].nickname}</td><td>${comment[i].datetime}</td>
      <td>
      <form action="/topic/comment_delete_process" method="post">
      <input type="hidden" name="commentId" value="${comment[i].id}">
      <input type="hidden" name="boardId" value="${user[i].board_id}">
      <input type="submit" value="삭제하기">
      </form>
      </td>
      </tr>`; 
      i = i + 1;
    }
    list = list + '</table>';
    return list;
  }, mylist: function (topics) {
    // <ol class="board"></ol><li>
    var list = `
    <table>
    <tr>
      <th>글 제목</th>
      <th>작성일</th>
      <th>컨트롤</th>
    </tr>`;
    var i = 0;
    while (i < topics.length) {

      list = list + `<tr>
      <td><a href="/topic/${topics[i].boardid}">${topics[i].boardtitle}</a></td>
      <td>${topics[i].boarddate}</td>
      <td>
      <div class="btn-group"><a href="/topic/${topics[i].boardid}" class="button">이동하기</a></div>
      <form action="/topic/delete_process" method="post">
                      <input type="hidden" name="id" value="${topics[i].boardid}">
                      <input type="submit" value="삭제하기">
                    </form>
      </td>
      </tr>`; // 넘겨받은 filelist가 객체형태이므로 .id, .title형태로 취해야한다. 
      //`<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`; 와 같은 형식에서 위와같이 변경했다
      i = i + 1;


    }
    list = list + '</table>';
    return list;
  }, mycommentList: function (comment) {
    var list = `<h2>내가 작성한 댓글목록</h2>
    <table>
    <tr>
      <th>댓글</th>
      <th>작성일</th>
      <th>컨트롤</th>
    </tr>`;
    var i = 0;
    while (i < comment.length) {
      list = list + `
      <tr>
      <td>${comment[i].comment}</a></td>
      <td>${comment[i].commentdate}</td>
      <td>
      <div class="btn-group"><a href="/topic/${comment[i].boardid}" class="button">이동하기</a></div>
      <form action="/topic/comment_delete_process" method="post">
      <input type="hidden" name="commentId" value="${comment[i].commentid}">
      <input type="hidden" name="boardId" value="${comment[i].boardid}">
      <input type="submit" value="삭제하기">
      </form>
      </td>
      </tr>`; 
      i = i + 1;
    }
    list = list + '</table>';
    return list;
  }
}
