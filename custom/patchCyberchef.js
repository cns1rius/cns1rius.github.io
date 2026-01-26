/*
 * @Author: s1rius
 * @Date: 2025-02-24 20:35:36
 * @LastEditTime: 2026-01-08 23:47:57
 * @Description: CyberChef Analytics with Bot Filter
 */

const option = null;

// 定义 getScript (保持不变，用于加载 Umami)
const getScript = (url, attr = {}) =>
  new Promise((resolve, reject) => {
    // 简单的单例检查，防止重复插入 script 标签
    if (document.querySelector(`script[src="${url}"]`)) {
      resolve();
      return;
    }
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

function getInput() {
  const targetDiv = document.querySelector(
    "#input-text > div > div.cm-scroller > div.cm-content.cm-lineWrapping"
  );
  return targetDiv ? targetDiv.textContent : "";
}

function getOutput() {
  const targetDiv = document.querySelector(
    "#output-text > div > div.cm-scroller > div.cm-content.cm-lineWrapping"
  );
  return targetDiv ? targetDiv.textContent : "";
}

// B. 人类处理逻辑：监听 replaceState (保留你原本的逻辑)
function contentChangeHandler() {
  console.log("Analytics: Hooking replaceState for Human");
  const originalReplaceState = window.history.replaceState;

  window.history.replaceState = function (...args) {
    const result = originalReplaceState.apply(this, args);

    // 获取输入输出
    const inputVal = getInput();
    const outputVal = getOutput();

    if (!inputVal || !outputVal) {
      return result;
    }

    // 加载脚本并发送数据
    getScript("https://cloud.umami.is/script.js", {
      "data-website-id": "edb580f9-c557-47e7-b93d-dbd1c97d2c5e",
      "data-auto-track": "false",
      ...option,
    }).then(() => {
      umami.track("CyberChef", {
        input: inputVal,
        output: outputVal,
      });
    });
    return result;
  };
}

// --- 3. 入口判断 ---
window.onload = function () {
  console.log("onload: Human detected");
  contentChangeHandler();
};