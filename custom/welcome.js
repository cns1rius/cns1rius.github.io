//首次访问弹窗
if (localStorage.getItem("popWelcomeWindow") != "0") {
  if (
    document.referrer == undefined ||
    document.referrer.indexOf("s1rius.space") != -1 ||
    document.referrer.indexOf("cns1rius.space") != -1 ||
    document.referrer.indexOf("s1rius.vercel.app") != -1
  ) {
    //改成自己域名，注意是referrer!!! qwq
    Snackbar.show({
      pos: "top-right",
      showAction: false,
      text: "欢迎访问本站！",
    });
  } else {
    Snackbar.show({
      pos: "top-right",
      showAction: false,
      text: `欢迎来自${
        document.referrer.split("://")[1].split("/")[0]
      }的童鞋访问本站！`,
    });
    localStorage.setItem("popWelcomeWindow", "0");
  }
}
if (sessionStorage.getItem("popCookieWindow") != "0") {
  setTimeout(function () {
    Snackbar.show({
      text: "本站使用Cookie和本地/会话存储保证浏览体验和网站统计",
      pos: "bottom-right",
      actionText: "查看博客声明",
      onActionClick: function (element) {
        window.open("/license");
      },
    });
  }, 3000);
}
//不在弹出Cookie提醒
sessionStorage.setItem("popCookieWindow", "0");

//自带上文浏览器提示

function browserTC() {
  btf.snackbarShow("");
  Snackbar.show({
    text: "浏览器版本较低，网站样式可能错乱",
    actionText: "关闭",
    duration: "6000",
    pos: "bottom-right",
  });
}
function browserVersion() {
  var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
  var isIE =
    userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
  var isIE11 =
    userAgent.indexOf("Trident") > -1 && userAgent.indexOf("rv:11.0") > -1;
  var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //Edge浏览器
  var isFirefox = userAgent.indexOf("Firefox") > -1; //Firefox浏览器
  var isOpera =
    userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1; //Opera浏览器
  var isChrome =
    userAgent.indexOf("Chrome") > -1 &&
    userAgent.indexOf("Safari") > -1 &&
    userAgent.indexOf("Edge") == -1 &&
    userAgent.indexOf("OPR") == -1; //Chrome浏览器
  var isSafari =
    userAgent.indexOf("Safari") > -1 &&
    userAgent.indexOf("Chrome") == -1 &&
    userAgent.indexOf("Edge") == -1 &&
    userAgent.indexOf("OPR") == -1; //Safari浏览器
  if (isEdge) {
    if (userAgent.split("Edge/")[1].split(".")[0] < 90) {
      browserTC();
    }
  } else if (isFirefox) {
    if (userAgent.split("Firefox/")[1].split(".")[0] < 90) {
      browserTC();
    }
  } else if (isOpera) {
    if (userAgent.split("OPR/")[1].split(".")[0] < 80) {
      browserTC();
    }
  } else if (isChrome) {
    if (userAgent.split("Chrome/")[1].split(".")[0] < 90) {
      browserTC();
    }
  } else if (isSafari) {
    //不知道Safari哪个版本是该淘汰的老旧版本
  }
}
//2022-10-29修正了一个错误：过期时间应使用toGMTString()，而不是toUTCString()，否则实际过期时间在中国差了8小时
function setCookies(obj, limitTime) {
  let data = new Date(
    new Date().getTime() + limitTime * 24 * 60 * 60 * 1000
  ).toGMTString();
  for (let i in obj) {
    document.cookie = i + "=" + obj[i] + ";expires=" + data;
  }
}
function getCookie(name) {
  var arr,
    reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if ((arr = document.cookie.match(reg))) return unescape(arr[2]);
  else return null;
}
if (getCookie("browsertc") != 1) {
  setCookies(
    {
      browsertc: 1,
    },
    1
  );
  browserVersion();
}

var now1 = new Date();

function createtime1() {
  var grt = new Date("08/09/2022 00:00:00"); //此处修改你的建站时间或者网站上线时间
  now1.setTime(now1.getTime() + 250);
  var days = (now1 - grt) / 1000 / 60 / 60 / 24;
  var dnum = Math.floor(days);

  var ascll = [
    `欢迎来到s1rius' blog!`,
    `Have fun 🍭🍭🍭`,
    `
                 __
                /  \\            __
          ____ /\\_  \\   _ __  /\\_\\   __  __    ____
         /',__\\\\/_/\\ \\ /\\ '__\\\\/\\ \\ /\\ \\/\\ \\ / ',__\\
        /\\__,  \\  \\ \\ \\\\ \\ \\/  \\ \\ \\\\ \\ \\_\\ \\/\\__,  \\
        \\/\\____/   \\ \\_\\\\ \\_\\   \\ \\_\\\\ \\____/\\/\\____/
         \\/___/     \\/_/ \\/_/    \\/_/ \\/___/  \\/___/
`,
    "小站已经苟活",
    dnum,
    "天啦!",
    "©2021 By s1rius",
  ];

  setTimeout(
    console.log.bind(
      console,
      `\n%c${ascll[0]} %c ${ascll[1]} %c ${ascll[2]} %c${ascll[3]}%c ${ascll[4]}%c ${ascll[5]}\n\n%c ${ascll[6]}\n`,
      "color:#00a3d9",
      "",
      "color:#4ea1e1",
      "color:#00a3d9",
      "",
      "color:#00a3d9",
      ""
    )
  );

  setTimeout(
    console.warn.bind(
      console,
      "%c S013-782 %c 你现在正处于监控中",
      "color:white; background-color:#d9534f",
      ""
    )
  );
}

createtime1();

// 重写console方法
console.log = function () {};
console.error = function () {};
console.warn = function () {};

// 阻止特定键盘事件
document.addEventListener(
  "keydown",
  function (e) {
    if (
      (e.ctrlKey &&
        e.shiftKey &&
        ["I", "J", "C", "i", "j", "c"].includes(e.key)) ||
      (e.ctrlKey && ["u", "U"].includes(e.key)) ||
      e.key === "F12"
    ) {
      e.preventDefault();
      btf.snackbarShow("你真坏，不能打开控制台喔!");
      return false;
    }
  },
  true
);

// 阻止Ctrl+鼠标右键
document.addEventListener(
  "contextmenu",
  function (e) {
    if (e.ctrlKey) {
      e.preventDefault();
      btf.snackbarShow("你真坏，不能打开控制台喔!");
    }
  },
  true
);

(function () {
  var callbacks = [],
    timeLimit = 50,
    open = false;
  setInterval(loop, 1);
  return {
    addListener: function (fn) {
      callbacks.push(fn);
    },
    cancleListenr: function (fn) {
      callbacks = callbacks.filter(function (v) {
        return v !== fn;
      });
    },
  };
  function loop() {
    var startTime = new Date();
    debugger;
    if (new Date() - startTime > timeLimit) {
      if (!open) {
        callbacks.forEach(function (fn) {
          fn.call(null);
        });
      }
      open = true;
      window.stop();
      alert("你真坏，请关闭控制台！");
      document.body.innerHTML = "";
    } else {
      open = false;
    }
  }
})().addListener(function () {
  window.location.reload();
});

function toDevtools() {
  let num = 0;
  let devtools = new Date();
  devtools.toString = function () {
    num++;
    if (num > 1) {
      alert("你真坏，请关闭控制台！");
      window.location.href = "about:blank";
      blast();
    }
  };
  console.log("", devtools);
}
toDevtools();
