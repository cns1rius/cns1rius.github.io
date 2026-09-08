/*
 * EBCTFCodeBox Analytics
 *
 * Collects the longest input/output pair in a work session, following the
 * same peak-capture semantics as patchCyberchef.js: send when the input
 * shrinks, when the user copies a result, or when the page is left/hidden.
 * The home decoder also sends as soon as its best-summary result is ready.
 *
 * The app renders its IO areas dynamically, so this file deliberately uses
 * delegated events and a MutationObserver instead of binding to one render.
 */
(function initEBCTFAnalytics() {
  "use strict";

  const WEBSITE_ID = "edb580f9-c557-47e7-b93d-dbd1c97d2c5e";
  const SCRIPT_SRC = "https://cloud.umami.is/script.js";
  const EVENT_NAME = "EBCTFCodeBox";
  const MAX_PENDING_EVENTS = 4;
  const DEBUG = true;
  const LOG_PREFIX = "[EBCTF Analytics]";

  // 调试只记录长度和上下文，不打印用户实际输入/输出内容。
  function log(...args) {
    if (DEBUG) console.log(LOG_PREFIX, ...args);
  }

  let sessionMax = emptySnapshot();
  let lastSent = emptySnapshot();
  let lastContextKey = "";
  let checkTimer = 0;
  let umamiLoadPromise = null;
  let homeInputDirty = false;
  let staleHomeSummaryNode = null;
  let staleHomeSummaryText = "";
  const pendingEvents = [];

  function emptySnapshot() {
    return { input: "", output: "", context: getContext() };
  }

  function textOf(node) {
    return node ? String(node.textContent || "") : "";
  }

  function visible(node) {
    return !!node && (node.getClientRects().length > 0 || node === document.activeElement);
  }

  function firstVisible(selectors) {
    for (const selector of selectors) {
      const nodes = document.querySelectorAll(selector);
      for (const node of nodes) if (visible(node)) return node;
    }
    return null;
  }

  function getContext() {
    const route = location.hash || "";
    const view = route === "#/recipe"
      ? "recipe"
      : route === "#/exhaust"
        ? "exhaustive"
        : route === "#/inspect"
          ? "inspect"
          : route === "#/codeimg"
            ? "codeimg"
            : route === "#/quickconv"
              ? "quickconv"
              : route === "#/about"
                ? "about"
                : route === "#/plugins"
                  ? "plugins"
                  : route.startsWith("#/op/")
                    ? "op"
                    : document.getElementById("recipeChain")
                      ? "recipe"
                      : document.querySelector(".exhaustive-view, .exhaust-view, .exhaust-input")
                        ? "exhaustive"
                        : document.querySelector("#workspace .home-input")
                          ? "home"
                          : document.querySelector("#workspace .op-head")
                            ? "op"
                            : "home";
    const title = textOf(document.querySelector("#workspace .op-title"))
      .replace(/\s+/g, " ")
      .trim();
    const direction = document.querySelector("#dirSeg button.on")?.textContent.trim() || "";
    return {
      view,
      op: title,
      direction,
      route,
      // 标题可能由 i18n 异步补齐；路由+方向才是稳定的上下文标识。
      key: view === "op" ? `${view}|${direction}|${route}` : `${view}|||${route}`,
    };
  }

  function getInput() {
    const recipeInput = document.getElementById("recipeIn");
    const opInput = document.getElementById("ioIn");
    const cryptoInput = document.querySelector(".crypto-form .io-area");
    const homeInput = document.querySelector(".home-input");
    const uvInput = document.querySelector(".uv-input");
    const exhaustiveInput = firstVisible([".exhaust-input"]);
    const fields = [...document.querySelectorAll("#workspace .io-field-area")]
      .filter(visible)
      .map((node) => textOf(node));

    if (opInput && visible(opInput)) return fields.length ? fields.join("\n") : textOf(opInput);
    if (cryptoInput && visible(cryptoInput)) {
      const cryptoFields = [cryptoInput, ...document.querySelectorAll(".crypto-form .crypto-input")]
        .filter(visible)
        .map((node) => "value" in node ? String(node.value || "") : textOf(node));
      return cryptoFields.join("\n");
    }
    if (recipeInput && visible(recipeInput)) return textOf(recipeInput);
    if (homeInput && visible(homeInput)) return textOf(homeInput);
    if (exhaustiveInput) return textOf(exhaustiveInput);
    if (uvInput && visible(uvInput)) return textOf(uvInput);
    return fields.join("\n");
  }

  function getOutput() {
    const opOutput = document.getElementById("ioOut");
    if (opOutput && visible(opOutput)) return textOf(opOutput);

    const recipeOutput = document.getElementById("recipeOut");
    if (recipeOutput && visible(recipeOutput)) return textOf(recipeOutput);

    // 首页「一把梭」会同时渲染原文、最优候选、普通候选和暴力结果。
    // 采集时只把置顶的最优摘要作为输出，避免一条事件混入大量候选结果。
    if (getContext().view === "home") {
      // 用户改了输入但还没重新运行时，忽略 DOM 中上一轮残留的摘要。
      const summary = document.querySelector(".onekey-out .onekey-summary .ok-val");
      if (homeInputDirty) {
        const summaryText = textOf(summary);
        if (summary && (summary !== staleHomeSummaryNode || summaryText !== staleHomeSummaryText)) {
          homeInputDirty = false;
        } else {
          return "";
        }
      }
      return visible(summary) ? (summary._ebctfFullText || textOf(summary)) : "";
    }

    const cryptoOutput = document.querySelector(".crypto-out .onekey-card .ok-val");
    if (cryptoOutput && visible(cryptoOutput)) return cryptoOutput._ebctfFullText || textOf(cryptoOutput);

    if (getContext().view === "inspect") {
      const viewerOutput = document.querySelector(".uv-out");
      return visible(viewerOutput) ? textOf(viewerOutput) : "";
    }

    const exhaustiveValues = [...document.querySelectorAll(".exhaust-out .exhaust-val")]
      .filter(visible)
      .map((node) => node._ebctfFullText || textOf(node));
    return exhaustiveValues.join("\n");
  }

  function currentSnapshot() {
    const context = getContext();
    return { input: getInput(), output: getOutput(), context };
  }

  function markHomeInputDirty() {
    const oldSummary = document.querySelector(".onekey-out .onekey-summary .ok-val");
    homeInputDirty = true;
    staleHomeSummaryNode = oldSummary;
    staleHomeSummaryText = textOf(oldSummary);
  }

  function sameData(a, b) {
    return a.input === b.input && a.output === b.output && a.context.key === b.context.key;
  }

  function umamiReady() {
    return !!(window.umami && typeof window.umami.track === "function");
  }

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

  function waitForUmamiApi(attempts = 0) {
    if (umamiReady()) return Promise.resolve();
    if (attempts >= 20) return Promise.reject(new Error("Umami track API 不可用"));
    return new Promise((resolve, reject) => {
      window.setTimeout(() => {
        waitForUmamiApi(attempts + 1).then(resolve, reject);
      }, 100);
    });
  }

  // 参考 patchCyberchef.js：启动时显式初始化 Umami，再处理采集队列。
  function initUmami() {
    if (umamiReady()) {
      log("Umami 已就绪");
      flushPending();
      return Promise.resolve();
    }

    if (umamiLoadPromise) return umamiLoadPromise;

    const scriptOpts = {
      "data-website-id": WEBSITE_ID,
      "data-auto-track": "false",
    };
    if (typeof option !== "undefined" && option && typeof option === "object") {
      Object.assign(scriptOpts, option);
    }

    log("初始化 Umami", { url: SCRIPT_SRC, options: scriptOpts });
    umamiLoadPromise = getScript(SCRIPT_SRC, scriptOpts)
      .then(() => {
        log("Umami 脚本加载完成", { pending: pendingEvents.length });
        return waitForUmamiApi();
      })
      .then(() => {
        log("Umami track API 已就绪", { pending: pendingEvents.length });
        flushPending();
      })
      .catch((error) => {
        log("Umami 初始化失败", error.message || String(error));
        umamiLoadPromise = null;
      });
    return umamiLoadPromise;
  }

  function requestUmami() {
    if (umamiReady()) return;
    initUmami();
  }

  function flushPending() {
    if (!umamiReady()) {
      log("暂不能刷新队列：Umami track API 不可用");
      return;
    }
    if (pendingEvents.length) log("刷新待发送事件", pendingEvents.length);
    while (pendingEvents.length) {
      const event = pendingEvents.shift();
      try {
        window.umami.track(EVENT_NAME, event);
        log("已发送待发送事件", event.type, {
          inputLength: event.input.length,
          outputLength: event.output.length,
          view: event.view,
          op: event.op,
        });
      } catch { /* analytics must not affect the app */ }
    }
  }

  function sendAnalytics(triggerType, snapshot) {
    if (!snapshot.input && !snapshot.output) {
      log("跳过空数据", triggerType);
      return;
    }
    if (sameData(snapshot, lastSent)) {
      log("跳过重复数据", triggerType, snapshot.context.key);
      return;
    }

    const event = {
      type: triggerType,
      input: snapshot.input,
      output: snapshot.output,
      view: snapshot.context.view,
      op: snapshot.context.op,
      direction: snapshot.context.direction,
      route: snapshot.context.route,
    };

    if (umamiReady()) {
      try {
        window.umami.track(EVENT_NAME, event);
        log("已发送事件", triggerType, {
          inputLength: event.input.length,
          outputLength: event.output.length,
          view: event.view,
          op: event.op,
        });
      } catch { /* analytics must not affect the app */ }
    } else {
      pendingEvents.push(event);
      if (pendingEvents.length > MAX_PENDING_EVENTS) pendingEvents.shift();
      log("Umami 未就绪，事件进入队列", triggerType, {
        pending: pendingEvents.length,
        inputLength: event.input.length,
        outputLength: event.output.length,
      });
      requestUmami();
    }
    lastSent = { ...snapshot, context: { ...snapshot.context } };
  }

  function checkLengthAndCapture() {
    checkTimer = 0;
    const current = currentSnapshot();
    const contextChanged = lastContextKey && current.context.key !== lastContextKey;

    if (contextChanged) {
      log("检测到视图变化", { from: lastContextKey, to: current.context.key });
      // 首次渲染时主应用会先挂空 workspace，再异步补上首页标题；这不是用户切页。
      if (sessionMax.input || sessionMax.output) {
        sendAnalytics("ViewChange", sessionMax);
      } else {
        log("忽略初始化阶段的空视图变化");
      }
      sessionMax = current;
    } else if (current.input.length >= sessionMax.input.length) {
      const inputChanged = current.input !== sessionMax.input;
      const outputChanged = current.output !== sessionMax.output;
      if (inputChanged || outputChanged) {
        log(current.context.view === "home" && outputChanged ? "最优摘要更新" : "更新采集快照", {
          inputLength: current.input.length,
          outputLength: current.output.length,
          view: current.context.view,
          op: current.context.op,
        });
      }
      // 原脚本会在 Decrease/Copy/Leave 时发送峰值；首页点击「一把梭」后
      // 输入通常不会立刻变短，因此摘要生成时补发一次结果，避免用户
      // 只运行一次并停留在页面时数据永远只留在本地缓存。
      if (current.context.view === "home" && current.output && outputChanged) {
        log("首页最优摘要已生成，立即上传", {
          inputLength: current.input.length,
          outputLength: current.output.length,
        });
        sendAnalytics("ResultUpdate", current);
      }
      sessionMax = current;
    } else if (current.input.length < sessionMax.input.length) {
      log("检测到输入缩短", {
        previousInputLength: sessionMax.input.length,
        currentInputLength: current.input.length,
        outputLength: sessionMax.output.length,
      });
      sendAnalytics("Decrease", sessionMax);
      sessionMax = current;
    }
    lastContextKey = current.context.key;
  }

  function scheduleCheck() {
    if (checkTimer) return;
    checkTimer = window.setTimeout(checkLengthAndCapture, 60);
  }

  function updateBeforeSend() {
    const current = currentSnapshot();
    if (current.input.length >= sessionMax.input.length) sessionMax = current;
    return current;
  }

  function isCopyAction(target) {
    if (target.closest?.(".ok-expand, .onekey-brute > summary")) return false;
    if (target.closest?.(".onekey-card:not(.onekey-brute), .onekey-brute-branch, .exhaust-row")) return true;
    const button = target.closest?.("button, [role=button]");
    if (!button) return false;
    const label = `${button.id} ${button.title} ${button.getAttribute("aria-label") || ""} ${textOf(button)}`.toLowerCase();
    if (!/(copy|复制|content_copy)/.test(label)) return false;
    return !!button.closest(".io-pane, .et-toolbar, .onekey-card, .exhaustive-view, .exhaust-view");
  }

  document.addEventListener("input", (event) => {
    if (event.target?.closest?.(".home-input")) markHomeInputDirty();
    scheduleCheck();
  }, true);
  document.addEventListener("change", scheduleCheck, true);
  document.addEventListener("keydown", (event) => {
    if (event.target?.closest?.(".home-input") && event.key === "Enter" && !event.shiftKey) {
      // 首页回车会直接触发一把梭；保持旧摘要保护，等待新结果生成。
      markHomeInputDirty();
    }
  }, true);
  document.addEventListener("drop", (event) => {
    if (event.target?.closest?.(".home-input")) markHomeInputDirty();
  }, true);
  document.addEventListener("copy", () => {
    log("捕获键盘复制");
    updateBeforeSend();
    sendAnalytics("Copy(Key)", sessionMax);
  }, true);
  document.addEventListener("click", (event) => {
    if (event.target?.closest?.(".magic-run")) markHomeInputDirty();
    if (!isCopyAction(event.target)) return;
    log("捕获复制按钮/结果卡点击");
    window.setTimeout(() => {
      updateBeforeSend();
      sendAnalytics("Copy(Btn)", sessionMax);
    }, 30);
  }, true);
  window.addEventListener("hashchange", scheduleCheck);
  window.addEventListener("popstate", scheduleCheck);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      log("页面进入 hidden 状态");
      updateBeforeSend();
      sendAnalytics("Leave", sessionMax);
    }
  });
  window.addEventListener("pagehide", () => {
    log("捕获 pagehide");
    updateBeforeSend();
    sendAnalytics("Leave", sessionMax);
  });

  const observer = new MutationObserver((mutations) => {
    // 工具栏粘贴/清空通过 textContent 改值，不一定派发 input 事件。
    if (mutations.some((mutation) => {
      const target = mutation.target.nodeType === 1 ? mutation.target : mutation.target.parentElement;
      return target?.closest?.(".home-input");
    })) {
      markHomeInputDirty();
    }
    scheduleCheck();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true });
  initUmami();
  scheduleCheck();
  log("采集脚本初始化完成", { event: EVENT_NAME, websiteId: WEBSITE_ID });
})();
