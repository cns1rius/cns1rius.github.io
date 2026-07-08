(function () {
  // ========== 1. 爬虫识别 & Umami 追踪 ==========
  const botPattern = /(Googlebot|Baiduspider|bingbot|Bytespider|360Spider|Sogou|YisouSpider|YandexBot|Yeti|Applebot|Slurp|DuckDuckBot|AhrefsBot|DotBot|SemrushBot|MJ12bot|PetalBot|GPTBot|OAI-SearchBot|ClaudeBot|Mediapartners-Google|AdsBot-Google|Diffbot|spider|Crawler|bot)/i;

  // 动态加载脚本
  const getScript = (url, attr = {}) =>
    new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = url;
      script.async = true;
      Object.entries(attr).forEach(([key, val]) => script.setAttribute(key, val));
      script.onload = script.onreadystatechange = () => {
        if (!script.readyState || /loaded|complete/.test(script.readyState))
          resolve();
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });

  // 追踪逻辑
  const runTrack = () => {
    const botMatch = navigator.userAgent.match(botPattern)?.[0];
    console.log("botMatch: ", botMatch);
    if (botMatch) {
      const targetPath = (window.location.pathname + window.location.search + window.location.hash).substring(0, 499);
      umami.track('Crawler', {
        bot: botMatch,
        path: targetPath
      });
    }
    umami.track((props) => ({
      ...props,
      url: window.location.pathname + window.location.search + window.location.hash,
      title: window.location.pathname.split("/")[1],
    }));
  };

  // 加载 Umami 脚本
  const loadUmamiJS = (option = {}) => {
    getScript("https://cloud.umami.is/script.js", {
      "data-website-id": "edb580f9-c557-47e7-b93d-dbd1c97d2c5e",
      "data-auto-track": "false",
      ...option,
    }).then(runTrack);
  };

  loadUmamiJS(); // 开始追踪

  // ========== 2. 域名重定向（若不在指定域名下） ==========
  if (
    window.location.host != "blog.s1rius.space" &&
    window.location.hostname != "localhost"
  ) {
    const mainUrl =
      "https://blog.s1rius.space" +
      window.location.pathname +
      window.location.search +
      window.location.hash;
    window.location.href = mainUrl;
  }

  // ========== 3. 反调试 / 防开发者工具 ==========
  if (window.location.hostname !== "localhost") {
    // 屏蔽控制台输出
    ["log", "error", "warn"].forEach(function (method) {
      console[method] = function () {};
    });

    let hasHandledDevtools = false;

    function showMessage() {
      if (window.btf && typeof btf.snackbarShow === "function") {
        btf.snackbarShow("你真坏，不能打开控制台喔!");
      }
    }

    function handleDevtoolsOpen() {
      if (hasHandledDevtools) return;
      hasHandledDevtools = true;
      alert("你真坏，请关闭控制台！");
      window.location.reload();
    }

    function detectByWindowSize() {
      const widthDiff = Math.abs(window.outerWidth - window.innerWidth);
      const heightDiff = Math.abs(window.outerHeight - window.innerHeight);
      if (widthDiff > 160 || heightDiff > 160) {
        handleDevtoolsOpen();
      }
    }

    function detectByConsoleGetter() {
      let detected = false;
      const probe = new Image();
      Object.defineProperty(probe, "id", {
        get: function () {
          detected = true;
          return "";
        },
      });
      console.dir(probe);
      if (detected) handleDevtoolsOpen();
    }

    // 阻止键盘快捷键
    document.addEventListener(
      "keydown",
      function (e) {
        const key = e.key.toLowerCase();
        const blocked =
          (e.ctrlKey && e.shiftKey && ["i", "j", "c"].includes(key)) ||
          (e.ctrlKey && key === "u") ||
          e.key === "F12";
        if (blocked) {
          e.preventDefault();
          showMessage();
        }
      },
      true
    );

    // 阻止 Ctrl+右键菜单
    document.addEventListener(
      "contextmenu",
      function (e) {
        if (e.ctrlKey) {
          e.preventDefault();
          showMessage();
        }
      },
      true
    );

    // 定时检测开发者工具
    window.setInterval(function () {
      detectByWindowSize();
      detectByConsoleGetter();
    }, 1500);
  }
})();