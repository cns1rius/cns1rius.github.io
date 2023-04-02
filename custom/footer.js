// var now = new Date;
// function createtime() {
//     now.setTime(now.getTime() + 1e3);
//     var r = new Date("12/01/2021 00:00:00"), o = (now - r) / 1e3 / 60 / 60 / 24, i = Math.floor(o), n = (now - r) / 1e3 / 60 / 60 - 24 * i, s = Math.floor(n);
//     1 == String(s).length && (s = "0" + s);
//     var l = (now - r) / 1e3 / 60 - 1440 * i - 60 * s, g = Math.floor(l);
//     1 == String(g).length && (g = "0" + g);
//     var d = (now - r) / 1e3 - 86400 * i - 3600 * s - 60 * g, c = Math.round(d);
//     1 == String(c).length && (c = "0" + c);
//     let h = ""; h = s < 18 && s >= 9 ? `<img class='boardsign' src= 'https://img.shields.io/badge/s1rius-摸鱼中-6adea8?style=social&logo=cakephp' title='距离月入25k也就还差一个大佬带我~'><br> 小破站在各种灾难中苟活了 ${i} 天 ${s} 小时 ${g} 分 ${c} 秒 <i id="heartbeat" class='fas fa-heartbeat'></i> <br> 欢迎参观我的space✨ <br> 人若无名，便可专心练剑🗡` : `<img class='boardsign' src= 'https://img.shields.io/badge/s1rius-打烊休息啦-6adea8?style=social&logo=coffeescript' title='下班了就该开开心心的玩耍，嘿嘿~'><br> 小破站在各种灾难中苟活了 ${i} 天 ${s} 小时 ${g} 分 ${c} 秒 <i id="heartbeat" class='fas fa-heartbeat'></i> <br> 欢迎参观我的space✨ `, document.getElementById("workboard") && (document.getElementById("workboard").innerHTML = h)
// } setInterval((() => { createtime() }), 1e3);

/*
用于托管 footer 上的一些会随着时间改变的内容
footer 上的 HTML 内容：
白天的：
<img class='boardsign' src= 'https://img.shields.io/badge/s1rius-摸鱼中-6adea8?style=social&logo=cakephp' title='距离月入25k也就还差一个大佬带我~'>
<br/>
小破站在各种灾难中苟活了<span id="create-time"></span>
<i id="heartbeat" class='fas fa-heartbeat'></i>
<br/>
欢迎参观我的 Space✨
<br/>
人若无名，便可专心练剑🗡
<br/>
<div id="upyun" onclick="javascript:location.href='https:/\/www.upyun.com\/'">本网站由<img src= "https://s1rius.space/img/upyun.png"/>提供CDN加速服务</div>

晚上的：
<img class='boardsign' src= 'https://img.shields.io/badge/s1rius-打烊休息啦-6adea8?style=social&logo=coffeescript' title='下班了就该开开心心的玩耍，嘿嘿~'>
<br/>
小破站在各种灾难中苟活了<span id="create-time"></span>
<i id="heartbeat" class='fas fa-heartbeat'></i>
<br/>
欢迎参观我的 Space✨
<br/>
<div id="upyun" onclick="javascript:location.href='https:/\/www.upyun.com\/'">本网站由<img src= "https://s1rius.space/img/upyun.png"/>提供CDN加速服务</div>
*/
(function(outerDocument){

    // 博客从现在距创建时间
    let blogCreateTime = Date.now() - 1638288000000;
    
    // 白天和晚上时 footer 上的内容：
    const footerDay = `<img class='boardsign'src='https://img.shields.io/badge/s1rius-摸鱼中-6adea8?style=social&logo=cakephp'title='距离月入25k也就还差一个大佬带我~'><br/>小破站在各种灾难中苟活了<span id="create-time"></span><i id="heartbeat"class='fas fa-heartbeat'></i><br/>欢迎参观我的&nbsp;Space✨<br/>人若无名，便可专心练剑🗡<br/><div id="upyun"onclick="javascript:location.href='https:/\\/www.upyun.com/'">本网站由<img src= "https://s1rius.space/img/custom/upyun.png"/>提供CDN加速服务</div>`;
    const footerNight = `<img class='boardsign'src='https://img.shields.io/badge/s1rius-打烊休息啦-6adea8?style=social&logo=coffeescript'title='下班了就该开开心心的玩耍，嘿嘿~'><br/>小破站在各种灾难中苟活了<span id="create-time"></span><i id="heartbeat"class='fas fa-heartbeat'></i><br/>欢迎参观我的&nbsp;Space✨<br/><div id="upyun"onclick="javascript:location.href='https:/\\/www.upyun.com/'">本网站由<img src= "https://s1rius.space/img/custom/upyun.png"/>提供CDN加速服务</div>`;
    
    // 生成类似 xxx 天 x 小时 x 分钟 x 秒 的字符串
    function getBlogAgeString() {
      let days = Math.floor(blogCreateTime / 86400000);
      let hours = Math.floor((blogCreateTime % 86400000) / 3600000);
      let minutes = Math.floor((blogCreateTime % 3600000) / 60000);
      let seconds = Math.floor((blogCreateTime % 60000) / 1000);
      return `${days} 天 ${hours} 小时 ${minutes} 分钟 ${seconds} 秒`;
    }
    
    // 根据时间将 footer 上的内容改为白天或晚上的
    let hoursNow = new Date().getHours();
    if (hoursNow >= 6 && hoursNow <= 22) {
      outerDocument.getElementById("workboard").innerHTML = footerDay;
    } else {
      outerDocument.getElementById("workboard").innerHTML = footerNight;
    }
    
    // 每秒更新一次博客创建时间
    setInterval(function() {
      blogCreateTime += 1000;
      outerDocument.getElementById("create-time").innerText = getBlogAgeString();
    }, 1000);
    
    })(document);