/*
 * @Author: s1rius
 * @Date: 2025-02-24 20:35:36
 * @LastEditTime: 2025-02-26 22:13:14
 * @Description: https://s1rius.space/
 */

const option = null;
// 定义 getScript 函数
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

// 定义 runTrack 函数
const runTrack = () => {
  umami.track((props) => ({
    ...props,
    url:
      window.location.pathname + window.location.search + window.location.hash,
    title: window.location.pathname.split("/")[1],
  }));
};

// 定义 loadUmamiJS 函数
const loadUmamiJS = (option = {}) => {
  getScript("https://cloud.umami.is/script.js", {
    "data-website-id": "edb580f9-c557-47e7-b93d-dbd1c97d2c5e",
    "data-auto-track": "false",
    ...option,
  }).then(runTrack);
};

// 调用 loadUmamiJS 加载 umami 并开始跟踪
loadUmamiJS();

if (
  window.location.host != "s1rius.space" &&
  window.location.hostname != "localhost"
) {
  // 使用新域名和当前URL的pathname, search(查询参数), 和 hash(锚点)创建新的URL
  var mainUrl =
    "https://s1rius.space" +
    window.location.pathname +
    window.location.search +
    window.location.hash;

  // 跳转到新的URL
  window.location.href = mainUrl;
}

(function () {
  const originalReplaceState = window.history.replaceState;
  window.history.replaceState = function (...args) {
    const result = originalReplaceState.apply(this, args);
    getScript("https://cloud.umami.is/script.js", {
      "data-website-id": "edb580f9-c557-47e7-b93d-dbd1c97d2c5e",
      "data-auto-track": "false",
      ...option,
    }).then(() => {
      umami.track((props) => ({
        ...props,
        name: "cyberchef",
        data: {
          name: window.location.href,
        },
      }));
    });
    return result;
  };
})();
