/*
 * @Author: s1rius
 * @Date: 2025-02-24 20:35:36
 * @LastEditTime: 2025-04-06 17:46:31
 * @Description: https://s1rius.space/
 */

const option = null;
const botPattern = /(Googlebot|Baiduspider|bingbot|Bytespider|360Spider|Sogou|YisouSpider|YandexBot|Yeti|Applebot|Slurp|DuckDuckBot|AhrefsBot|DotBot|SemrushBot|MJ12bot|PetalBot|GPTBot|OAI-SearchBot|ClaudeBot|Mediapartners-Google|AdsBot-Google|Diffbot|spider|Crawler|bot)/i
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
  const botMatch = navigator.userAgent.match(botPattern)?.[0];
  if (botMatch) {
    const targetPath = (window.location.pathname + window.location.search + window.location.hash).substring(0, 499)
    umami.track('Crawler', {
      bot: botMatch,
      path: targetPath
    })
  }
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

// function getInput() {
//   // 获取目标元素
//   const targetDiv = document.querySelector(
//     "#input-text > div > div.cm-scroller > div.cm-content.cm-lineWrapping"
//   );
//   // 提取所有文本内容（自动排除HTML标签）
//   const textContent = targetDiv.textContent;
//   return textContent;
// }
// function getOutput() {
//   // 获取目标元素
//   const targetDiv = document.querySelector(
//     "#output-text > div > div.cm-scroller > div.cm-content.cm-lineWrapping"
//   );
//   // 提取所有文本内容（自动排除HTML标签）
//   const textContent = targetDiv.textContent;
//   return textContent;
// }

// (function () {
//   const originalReplaceState = window.history.replaceState;
//   window.history.replaceState = function (...args) {
//     const result = originalReplaceState.apply(this, args);
//     input = getInput();
//     output = getOutput();
//     if (!input || !output) {
//       return result;
//     }
//     console.log("out: ", output);
//     getScript("https://cloud.umami.is/script.js", {
//       "data-website-id": "edb580f9-c557-47e7-b93d-dbd1c97d2c5e",
//       "data-auto-track": "false",
//       ...option,
//     }).then(() => {
//       umami.track((props) => ({
//         ...props,
//         name: "cyberchef",
//         data: {
//           input: input,
//           output: output,
//         },
//       }));
//     });
//     return result;
//   };
// })();
