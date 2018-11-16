module.exports = {
    statusUIH: function () {
        var StatusUI = '<li><a class="active" href="/">Home</a></li>'
        return StatusUI;
    },
    statusUIB: function () {
        var StatusUI = `<li><a class="active" href="/topic">Board</a></li>`
        return StatusUI;
    },
    statusUIM: function () {
        var StatusUI = `<li><a class="active" href="/mypage">MyPage</a></li>`
        return StatusUI;
    }
}