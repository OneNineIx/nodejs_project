# nodejs_project

<a id="chap-0"></a>


|목차|
|:---|
|[1. 프로젝트 시작](#chap-1)<br>[2. 게시판의 접근권한](#chap-2)<br>[3. connect-flash모듈 경고메세지](#chap-3)<br>[4. 회원가입](#chap-4)<br>[5. bcrypt모듈을 이용한 사용자정보 암호화](#chap-5)<br>[6. passport, express-session 모듈을 이용한 로그인구현](#chap-6)<br>[7. 로그인 여부에 따른 접근권한](#chap-7)<br>[8. 상태정보의 시각화](#chap-8)<br>[9. 보안_자바스크립트 인젝션](#chap-9)<br>[10. 보안_sql인젝션](#chap-10)<br>[11. 그 외 세부기능](#chap-10)<br>[12. 마이페이지](#chap-10)|


<a id="chap-1"></a>
### 안녕하세요 황준성입니다.

nodejs와 몇가지 모듈들로 게시판을 만들어 보았습니다.

#### 테스트영상 youtube

[![Video Label](https://img.youtube.com/vi/qDeDjdF59DI/0.jpg)](https://youtu.be/qDeDjdF59DI?t=0s)

---------------------

![joonseong](http://drive.google.com/uc?export=view&id=1MIQguagXzlIoYV6pfEj0b9xWmGYOs-vX "nodejs_project")
<a id="chap-2"></a>

로그인을 하지 않은상태에서도 게시판의 내용과 댓글은 확인할 수 있도록 하였구요.

![joonseong](http://drive.google.com/uc?export=view&id=18VhUMUPXJd9lxl8o6BRSonHvGxU1FkWE "nodejs_project")
![joonseong](http://drive.google.com/uc?export=view&id=1nRl63Stvk00Lv6e-UUAw1LSMhthWD1pB "nodejs_project")


-----------------

<a id="chap-3"></a>
## connect-flash모듈 경고메세지

글의 수정이나 mypage로의 이동은 로그인한 상태에서만 가능하도록 구현하였는데요.

또 그에대한 경고사항을 **connect-flash** 라는 모듈을 사용해서 
세션에 상황에 맞는 경고메세지를 추가해 웹에 보여주도록 하였습니다.

![joonseong](http://drive.google.com/uc?export=view&id=1-mQRQ1WeC5VpY1vM4eJTZiJlHCkfQa0o "nodejs_project")
![joonseong](http://drive.google.com/uc?export=view&id=1TNFTMU00JJHCoF6yoElGPBJhMaWq0HD4 "nodejs_project")

이 모듈은 **휘발성**이라 한번 사용되고 나서는 사라지는 특성으로  사용자에게 **경고메시지 피드백**을 전달하기에 좋아 사용하였습니다.

------------------------

<a id="chap-4"></a>
## 회원가입

회원가입시에는 **emailCheck()** 라는 함수를 만들어서 

![joonseong](http://drive.google.com/uc?export=view&id=1AczIJIYB9_KoPhiY_xnQl-3WfL_HcBEB "nodejs_project")

사용자가 입력한 이메일이 **이미 디비에 같은 이메일주소가 존재하는지**를 검토하도록 하였는데요.

![joonseong](http://drive.google.com/uc?export=view&id=1KUYHklkkqcYw6qhqj8vOcv-0qmLAXGEo "nodejs_project")

emailCheck()가 **true를 반환하면** 경고메시지를 출력하고, **false일 경우** 다음 조건문들이 실행됩니다.
이메일을 입력하였는지, 입력한 비밀번호 2개가 동일한지 정도를 체크하도록 하였습니다.

![joonseong](http://drive.google.com/uc?export=view&id=1R9BUUkSI50oxYX8CNl7p1kmBYMTXgN0y "nodejs_project")
![joonseong](http://drive.google.com/uc?export=view&id=1WvZ68U5SXEPYWxafSbpyAGFyu-JPoUeN "nodejs_project")
![joonseong](http://drive.google.com/uc?export=view&id=1zVfO6vK9od8mcvbVYVucHZC0QTCqu-3b "nodejs_project")

이와같이 해당하는 부분에도 connect-flash모듈을 사용해서 
**사용자에게 피드백을 전달해 어떤 부분이 잘못 작성되었는지 혼동하지 않도록** 하였습니다.

-----------------

<a id="chap-5"></a>
## bcrypt모듈을 이용한 사용자정보 암호화

그리고 그 모든 조건문을 벗어나면
bcrypt 라는 보안모듈을 사용해 사용자의 비밀번호를 암호화해서 db에 저장하도록 했는데요.

![joonseong](http://drive.google.com/uc?export=view&id=1PdBZQtGGrNEuyq0_z9kT5IdSw1nagjvT "nodejs_project")

**사용자가 입력한 비밀번호 pwd를** 10번 솔트하여 **hash값**으로 반환하면 그 값을 user테이블의 password 컬럼에 저장하도록 하였습니다.

**bcrypt** 라는 모듈은 사용자가 입력한 비밀번호를 **웹의 관리자도 알아볼수 없도록** 해쉬값으로 변환 해주는데요.

![joonseong](http://drive.google.com/uc?export=view&id=1oYwjdHeXMLDsUEeps9GbANCVy1F3ooDP "nodejs_project")

이와같이 저장된 모습을 볼수 있습니다.

------------------

<a id="chap-6"></a>
## passport, express-session 모듈을 이용한 로그인구현

로그인에 사용된 모듈은 **passport**와 **express-session**을 이용하였습니다.

![joonseong](http://drive.google.com/uc?export=view&id=1WibGyX38OgYNoBJYixkn-ZyHdm2b3pxD "nodejs_project")

사용자가 전송한 email로 데이터베이스를 조회해서 해당하는 로우가 존재하면 

![joonseong](http://drive.google.com/uc?export=view&id=14Viq3w_TbYsgstWO1xEL-bZJQOF7hHQL "nodejs_project")
![joonseong](http://drive.google.com/uc?export=view&id=1OPo9xIEL-X8SjBNBm4XEAUZ0HBLZZ-dP "nodejs_project")



**bcrypt모듈의 compare함수**로 사용자가 입력한 password를 다시 해당하는 **해쉬값으로 변환해서 데이터베이스와 대조**하고 일치여부에 따라 로그인에 성공하고

![joonseong](https://drive.google.com/open?id=1g104wixjmHDyRRTboIT6bEx96QIsOD82 "nodejs_project")

passport의 **serializeUser로 세션에 식별자값을 추가**하는 방식입니다.

![joonseong](http://drive.google.com/uc?export=view&id=1CQ9i_Yw59PS6YVWKuwiP-qMcupPxb-WF "nodejs_project")
![joonseong](http://drive.google.com/uc?export=view&id=1Tv_X2wtzselfMRks9RS3ROH1yDn9WZ9S "nodejs_project")


passport의 **deserialize는 페이지를 이동할 때마다 호출**되는데요.
세션에 저장된 정보로 데이터베이스와 **세션정보를 비교해 로그인 상태를 확인**합니다.

![joonseong](http://drive.google.com/uc?export=view&id=1fCkw6z2K8AbGax-PiAXUbDCxf2VYkxOP "nodejs_project")

-------------

<a id="chap-7"></a>
## 로그인 여부에 따른 접근권한

그리고 **세션에 저장된 이메일정보로 로그인 상태 여부를 확인**할 수 있는 **isOwner함수**를 만들어서

![joonseong](http://drive.google.com/uc?export=view&id=1d4eRM4PUO3HJCISuKCOMu9Ol8o7Swi1x "nodejs_project")

사용자의 **로그인상태에 따라 접근권한을 제한**하였습니다.

![joonseong](http://drive.google.com/uc?export=view&id=1uXH1mA391c1TBc0fObFowUNisrDv6csR "nodejs_project")

------------------

<a id="chap-8"></a>
## 상태정보의 시각화

또 **statusUI라는 함수**를 만들어서 isOwner가 true일때 **로그인/회원가입 부분을 사용자의 email주소와 로그아웃 버튼으로 치환**하도록 하고 

![joonseong](http://drive.google.com/uc?export=view&id=1Aa9_5lXixZ44vve-6v1GfyEN1J7oDyG0 "nodejs_project")

**사용자가 라우팅된 위치를 시각화** 하기위해 해당하는 위치에서 statusUI를 인자로 주어 **태그 속성을 active로 치환**하도록 하였습니다.

![joonseong](http://drive.google.com/uc?export=view&id=1m0qspIXCdz6zXAQW43sQfDPjxsU7R7b5 "nodejs_project")
![joonseong](http://drive.google.com/uc?export=view&id=1Xzfv_Fi2jN2Dew--0clpaKVQnvh8IKDX "nodejs_project")
![joonseong](http://drive.google.com/uc?export=view&id=1Y1YuhAeBuYP06WyrZSgFom4OIe1lnjNR "nodejs_project")



-----------------

<a id="chap-9"></a>
## 자바스크립트 인젝션

자바스크립트 인젝션을 예방하기 위해서 **sanitize-html**모듈을 사용하였는데요

![joonseong](http://drive.google.com/uc?export=view&id=1PGM06TIlQORdmhu4W05_k4hB3FeJDY3p "nodejs_project")

사용자가 입력한 정보에 **자바스크립트 코드가 있을경우 이것을 무시**하도록 하는 모듈입니다.

![joonseong](http://drive.google.com/uc?export=view&id=1Lvj0ZW8odHqL3LzdIg6Euc43Ane2sK77 "nodejs_project")

이와같이 입력해주고 데이터베이스 전달했지만 내용이 표시되지 않고 자바스크립트 코드가 작동하지 않는걸 확인할 수 있죠.

-----------------

<a id="chap-10"></a>
## SQL인젝션

mysql모듈에는 sql인젝션을 막을수 있는 기능이 포함되어 있는데요.
``` bash
http://localhost:3000/topic/18;drop table board;
```

이와같이 세미콜론 뒤에 쿼리를 작성하는 방식의 공격을 하더라도

![joonseong](http://drive.google.com/uc?export=view&id=1KsqFUfGprJArdu4cG3gtzF7B2Rx88y_L "nodejs_project")

**사용자가 입력한 파라미터를 문자열로 치환**해서 쿼리가 동작하지 않도록 하게됩니다.

가령 이런식으로 바뀌게 되는 것이죠.
``` bash
    SELECT board.id AS boardid,comment.*,SUBSTR(comment.date,1,16) AS datetime 
    FROM board LEFT JOIN comment 
    ON board.id=comment.board_id  
    WHERE board.id='18;drop table board;'
```

--------------

<a id="chap-11"></a>
## 그 외 세부기능

그외 세부적인 기능으로는 각각의 유저가 **자신이 작성한 글과 댓글만을 삭제,수정이 가능**하도록 하였구요.

게시물을 삭제하면 **그에 해당하는 댓글이 먼저 db에서 삭제된 다음에 게시물이 삭제**되도록 하였습니다.
![joonseong](http://drive.google.com/uc?export=view&id=1BFOqTNrcN-Fyr8sdzT8U7C3bKhmll2r_ "nodejs_project")

-------------------

<a id="chap-12"></a>
## 마이페이지

**내가 작성한 글과 댓글을 mypage에서 확인**할 수 있게하고 **해당하는 글로 이동**할 수도 있고 이곳에서 직접 **삭제**하는 것도 가능합니다.
![joonseong](http://drive.google.com/uc?export=view&id=1TmpmCRX1HCf0OdMHSIhFFoRscrG2Tmjv "nodejs_project")

**회원정보의 수정**도 가능하도록 하였구요.

현재 **내정보 상태는 form의 placeholder속성으로 표시**하도록 해두었습니다.
![joonseong](http://drive.google.com/uc?export=view&id=1SUWROvBkEqvJ4s0crkxQfwSWjq4i0A8J "nodejs_project")

### 감사합니다.
[처음으로](#chap-0)

> 프로젝트 설명
https://onenineix.github.io/2018/11/13/Nodejs-project/