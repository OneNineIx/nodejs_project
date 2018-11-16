
module.exports = {
    isOwner: function (request, response) { // 셔션정보로 사용자를 인증
        if (request.user) { // 로그인되어 있다면 desirialize의 request.user객체가 들어있을 것이고 
            // 로그인되어있지 않다면 user객체가 없을것이다.
            return true;
        } else {
            return false;
        }
    },
    statusUI: function (request, response) {
        var authStatusUI = '<a href="/auth/login">로그인</a>'
        
        if (this.isOwner(request, response)) { 
            // isOwner가 true라면 request.user가 들어있다는 의미이고
            //this는 자신이 속해있는 객체를 참조한다
            // 인증정보가 true이면 아래값을 대입해서 닉네임 | logout버튼을 출력
            authStatusUI = `<span>${request.user}</span>`;
        }
        return authStatusUI;
    },
    statusUI2: function (request, response) {
        
        var authStatusUI2 = '<a href="/auth/register">회원가입</a>'
        if (this.isOwner(request, response)) {
            authStatusUI2 = `<a href="/auth/logout">로그아웃</a>`;
        }
        return authStatusUI2;
    }



}