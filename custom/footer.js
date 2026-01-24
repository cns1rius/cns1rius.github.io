/*
用于托管 footer 上的一些会随着时间改变的内容
footer 上的 HTML 内容：
白天的：
<img class='boardsign' src='https://img.shields.io/badge/s1rius-摸鱼中-6adea8?style=social&logo=cakephp' title='距离月入25k也就还差一个大佬带我~'>
<br/>
小破站在各种灾难中苟活了<span id="create-time"></span>
<i id="heartbeat" class='fas fa-heartbeat'></i>
<br/>
欢迎参观我的 Space✨
<br/>
人若无名，便可专心练剑🗡
<br/>
<div id="upyun" onclick="javascript:location.href='https:/\/www.upyun.com/'" style="display: flex; align-items: center; justify-content: center;">本网站由<img class="entered loading" style="width: 5rem; transform: translateY(-0.1rem);" src="https://s1rius.space/img/custom/upyun.png" data-ll-status="loading">提供CDN加速服务</div>

晚上的：
<img class='boardsign' src='https://img.shields.io/badge/s1rius-打烊休息啦-6adea8?style=social&logo=coffeescript' title='下班了就该开开心心的玩耍，嘿嘿~'>
<br/>
小破站在各种灾难中苟活了<span id="create-time"></span>
<i id="heartbeat" class='fas fa-heartbeat'></i>
<br/>
欢迎参观我的 Space✨
<br/>
<div id="upyun" onclick="javascript:location.href='https:/\/www.upyun.com/'" style="display: flex; align-items: center; justify-content: center;">本网站由<img class="entered loading" style="width: 5rem; transform: translateY(-0.1rem);" src="https://s1rius.space/img/custom/upyun.png" data-ll-status="loading">提供CDN加速服务</div>
*/
(function (outerDocument) {
  // 博客从现在距创建时间
  let blogCreateTime = Date.now() - 1638288000000;

  // 白天和晚上时 footer 上的内容：
  const footerDay = `<img class='boardsign'src='https://img.shields.io/badge/s1rius-摸鱼中-6adea8?style=social&logo=cakephp'title='距离月入25k也就还差一个大佬带我~'><br/>小破站在各种灾难中苟活了<span id="create-time"></span><i id="heartbeat"class='fas fa-heartbeat'></i><br/>欢迎参观我的Space✨<br/>人若无名，便可专心练剑🗡<br/><div id="upyun"onclick="javascript:location.href='https:/\/www.upyun.com/'"style="display: flex; align-items: center; justify-content: center;">本网站由<img class="entered loading"style="width: 5rem; transform: translateY(-0.1rem);"src="https://s1rius.space/img/custom/upyun.png"data-ll-status="loading">提供CDN加速服务</div>`;
  const footerNight = `<img class='boardsign'src='https://img.shields.io/badge/s1rius-打烊休息啦-6adea8?style=social&logo=coffeescript'title='下班了就该开开心心的玩耍，嘿嘿~'><br/>小破站在各种灾难中苟活了<span id="create-time"></span><i id="heartbeat"class='fas fa-heartbeat'></i><br/>欢迎参观我的Space✨<br/><div id="upyun"onclick="javascript:location.href='https:/\/www.upyun.com/'"style="display: flex; align-items: center; justify-content: center;">本网站由<img class="entered loading"style="width: 5rem; transform: translateY(-0.1rem);"src="https://s1rius.space/img/custom/upyun.png"data-ll-status="loading">提供CDN加速服务</div>`;

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
  setInterval(function () {
    blogCreateTime += 1000;
    outerDocument.getElementById("create-time").innerText = getBlogAgeString();
  }, 1000);
})(document);
