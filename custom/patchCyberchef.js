/*
 * @Author: s1rius
 * @Date: 2025-02-24 20:35:36
 * @LastEditTime: 2026-01-27 17:30:00
 * @Description: CyberChef Analytics - Peak & Copy & Button Trigger
 */

// 1. 状态管理
let sessionMax = { input: "", output: "" };
let lastSentData = { input: "", output: "" };

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

// 2. 发送逻辑 (封装)
function sendAnalytics(triggerType, data) {
  // 过滤：如果数据为空，或者跟上次发的一模一样，就不发
  if ((!data.input && !data.output) ||
    (data.input === lastSentData.input && data.output === lastSentData.output)) {
    return;
  }

  if (window.umami) {
    console.log(`Analytics [${triggerType}]: Sending data (In Len: ${data.input.length})`);

    umami.track("CyberChef", {
      type: triggerType,
      input: data.input,
      output: data.output,
    });

    lastSentData = { ...data };
    sessionMax = { input: "", output: "" }; // 发送完清空缓存
  }
}

// 3. 核心逻辑：检查长度变化
function checkLengthAndCapture() {
  const currentIn = getInput();
  const currentOut = getOutput();

  // A. 长度增加：更新本地的“最大值”
  if (currentIn.length >= sessionMax.input.length) {
    sessionMax = { input: currentIn, output: currentOut };
  }
  // B. 长度减少：说明用户在删除 -> 发送之前缓存的那个最长的
  else if (currentIn.length < sessionMax.input.length) {
    sendAnalytics("Decrease", sessionMax);
    sessionMax = { input: currentIn, output: currentOut }; // 重置起点
  }
}

// 4. 初始化与事件监听
function initAnalytics() {
  // 初始化 Umami
  const scriptOpts = {
    "data-website-id": "edb580f9-c557-47e7-b93d-dbd1c97d2c5e",
    "data-auto-track": "false"
  };
  if (typeof option !== 'undefined') Object.assign(scriptOpts, option);
  getScript("https://cloud.umami.is/script.js", scriptOpts);


  // --- Hook 1: 历史记录/输入变化 ---
  console.log("Analytics: Hooking replaceState");
  const originalReplaceState = window.history.replaceState;
  window.history.replaceState = function (...args) {
    const result = originalReplaceState.apply(this, args);
    setTimeout(checkLengthAndCapture, 50); // 异步检查
    return result;
  };

  // --- Hook 2: 原生复制事件 (Ctrl+C) ---
  document.addEventListener("copy", () => {
    // 既然用户按了 Ctrl+C，说明对当前结果满意，直接抓取当前屏幕内容
    const currentData = { input: getInput(), output: getOutput() };
    // 如果当前的比缓存的长，更新一下缓存再发；否则发缓存的（通常是一样的）
    if (currentData.input.length > sessionMax.input.length) sessionMax = currentData;

    sendAnalytics("Copy(Key)", sessionMax);
  });

  // --- Hook 3: 复制按钮点击 (UI Button) ---
  // 使用事件委托，监听整个页面的点击
  document.body.addEventListener("click", (e) => {
    // 找到被点击元素最近的 button 父级 (因为你可能点到了 button 里面的 <i> 图标)
    const btn = e.target.closest("button");
    if (!btn) return;

    // 判断是不是“复制输出”按钮
    // 1. 检查 ID (CyberChef 标准 ID)
    // 2. 检查 title (如果 ID 变了)
    // 3. 检查是否是你提供的那个位置 (输出框的工具栏)
    const isCopyBtn =
      btn.id === "copy-output" ||
      btn.title === "Copy output to clipboard" ||
      btn.querySelector(".fa-copy"); // 按钮里包含复制图标

    if (isCopyBtn) {
      // 稍微延迟一下，确保 CyberChef 的逻辑先跑完（虽然通常不需要）
      setTimeout(() => {
        const currentData = { input: getInput(), output: getOutput() };
        if (currentData.input.length > sessionMax.input.length) sessionMax = currentData;
        sendAnalytics("Copy(Btn)", sessionMax);
      }, 10);
    }
  });

  // --- Hook 4: 页面隐藏/离开 ---
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      sendAnalytics("Leave", sessionMax);
    }
  });
}

// 启动
initAnalytics();