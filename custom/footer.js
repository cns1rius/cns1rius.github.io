var now = new Date;
function createtime() {
    now.setTime(now.getTime() + 1e3);
    var r = new Date("12/01/2021 00:00:00"), o = (now - r) / 1e3 / 60 / 60 / 24, i = Math.floor(o), n = (now - r) / 1e3 / 60 / 60 - 24 * i, s = Math.floor(n);
    1 == String(s).length && (s = "0" + s);
    var l = (now - r) / 1e3 / 60 - 1440 * i - 60 * s, g = Math.floor(l);
    1 == String(g).length && (g = "0" + g);
    var d = (now - r) / 1e3 - 86400 * i - 3600 * s - 60 * g, c = Math.round(d);
    1 == String(c).length && (c = "0" + c);
    let h = ""; h = s < 18 && s >= 9 ? `<img class='boardsign' src= "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" data-lazy-src='https://img.shields.io/badge/s1rius-摸鱼中-6adea8?style=social&logo=cakephp' title='距离月入25k也就还差一个大佬带我~'><br> 小破站在各种灾难中苟活了 ${i} 天 ${s} 小时 ${g} 分 ${c} 秒 <i id="heartbeat" class='fas fa-heartbeat'></i> <br> 欢迎参观我的space✨ <br> 人若无名，便可专心练剑🗡` : `<img class='boardsign' src= "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" data-lazy-src='https://img.shields.io/badge/s1rius-打烊休息啦-6adea8?style=social&logo=coffeescript' title='下班了就该开开心心的玩耍，嘿嘿~'><br> 小破站在各种灾难中苟活了 ${i} 天 ${s} 小时 ${g} 分 ${c} 秒 <i id="heartbeat" class='fas fa-heartbeat'></i> <br> 欢迎参观我的space✨ `, document.getElementById("workboard") && (document.getElementById("workboard").innerHTML = h)
} setInterval((() => { createtime() }), 1e3);
//小破站在各种灾难中苟活了