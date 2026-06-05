(function () {
  if (window.__rightMenuAbortController) {
    window.__rightMenuAbortController.abort();
  }

  const controller = new AbortController();
  const signal = controller.signal;
  window.__rightMenuAbortController = controller;

  const mobileRe =
    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i;

  const rmf = (window.rmf = window.rmf || {});
  let currentTarget = null;
  let mask = null;

  function byId(id) {
    return document.getElementById(id);
  }

  function all(selector) {
    return Array.from(document.querySelectorAll(selector));
  }

  function show(el) {
    if (el) el.style.display = "block";
  }

  function hide(el) {
    if (el) el.style.display = "none";
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text);
      return;
    }

    const txa = document.createElement("textarea");
    txa.value = text;
    txa.style.position = "fixed";
    txa.style.opacity = "0";
    document.body.appendChild(txa);
    txa.select();
    document.execCommand("copy");
    txa.remove();
  }

  function showToast(text, pos) {
    if (window.Snackbar && typeof Snackbar.show === "function") {
      Snackbar.show({ text, pos: pos || "top-right", showAction: false });
    } else if (window.btf && typeof btf.snackbarShow === "function") {
      btf.snackbarShow(text);
    }
  }

  function insertAtCursor(field, value) {
    if (!field) return;

    if (typeof field.selectionStart === "number") {
      const startPos = field.selectionStart;
      const endPos = field.selectionEnd;
      const restoreTop = field.scrollTop;
      field.value = field.value.slice(0, startPos) + value + field.value.slice(endPos);
      field.scrollTop = restoreTop;
      field.focus();
      field.selectionStart = startPos + value.length;
      field.selectionEnd = startPos + value.length;
      return;
    }

    field.value += value;
    field.focus();
  }

  function ensureMask() {
    if (mask && document.body.contains(mask)) return mask;

    mask = document.createElement("div");
    mask.className = "rmMask";
    mask.style.cssText =
      "width:100vw;height:100vh;background:#fff;opacity:0;position:fixed;top:0;left:0;z-index:998;";
    document.body.appendChild(mask);
    mask.addEventListener("click", hideRightMenu, { signal });

    const rightMenu = byId("rightMenu");
    if (rightMenu) rightMenu.style.zIndex = "19198";

    return mask;
  }

  function hideRightMenu() {
    const rightMenu = byId("rightMenu");
    if (rightMenu) rightMenu.style.display = "none";
    if (mask && document.body.contains(mask)) mask.remove();
  }

  function showRightMenu(x, y) {
    const rightMenu = byId("rightMenu");
    if (!rightMenu) return;

    rightMenu.style.display = "block";
    rightMenu.style.top = `${y}px`;
    rightMenu.style.left = `${x}px`;
  }

  function resetGroups() {
    all(".rightMenu-group.hide").forEach(hide);
  }

  function isInternalLink(href) {
    try {
      return new URL(href, window.location.href).origin === window.location.origin;
    } catch {
      return false;
    }
  }

  rmf.showRightMenu = function (isTrue, y = 0, x = 0) {
    if (isTrue) showRightMenu(x, y);
    else hideRightMenu();
  };

  rmf.switchDarkMode = function () {
    const nowMode = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
    if (nowMode === "light") {
      btf.activateDarkMode();
      btf.saveToLocal.set("theme", "dark", 2);
      GLOBAL_CONFIG.Snackbar !== undefined && btf.snackbarShow(GLOBAL_CONFIG.Snackbar.day_to_night);
    } else {
      btf.activateLightMode();
      btf.saveToLocal.set("theme", "light", 2);
      GLOBAL_CONFIG.Snackbar !== undefined && btf.snackbarShow(GLOBAL_CONFIG.Snackbar.night_to_day);
    }

    typeof utterancesTheme === "function" && utterancesTheme();
    typeof FB === "object" && window.loadFBComment();
    window.DISQUS &&
      document.getElementById("disqus_thread").children.length &&
      setTimeout(() => window.disqusReset(), 200);
  };

  rmf.yinyong = function () {
    const textarea = document.getElementsByClassName("el-textarea__inner")[0];
    if (!textarea) return;

    textarea.value = `> ${getSelection().toString()}\n\n`;
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
    showToast("为保证最佳评论阅读体验，建议不要删除空行", "top-center");
  };

  rmf.copyWordsLink = function () {
    copyText(window.location.href);
    showToast("链接复制成功！快去分享吧！");
  };

  rmf.switchReadMode = function () {
    const body = document.body;
    if (body.classList.contains("read-mode")) return;

    body.classList.add("read-mode");
    const newEle = document.createElement("button");
    newEle.type = "button";
    newEle.className = "fas fa-sign-out-alt exit-readmode";
    body.appendChild(newEle);

    newEle.addEventListener("click", function clickFn() {
      body.classList.remove("read-mode");
      newEle.remove();
      newEle.removeEventListener("click", clickFn);
    });
  };

  rmf.copySelect = function () {
    copyText(window.getSelection().toString());
  };

  rmf.scrollToTop = function () {
    const menuItems = document.getElementsByClassName("menus_items")[1];
    const nameContainer = byId("name-container");
    if (menuItems) menuItems.style.display = "";
    if (nameContainer) nameContainer.style.display = "none";
    btf.scrollToDest(0, 500);
  };

  rmf.translate = function () {
    const translateLink = byId("translateLink");
    if (translateLink) translateLink.click();
  };

  rmf.searchinThisPage = function () {
    hideRightMenu();
    const searchInput = document.getElementsByClassName("local-search-box--input")[0];
    const searchButton = document.getElementsByClassName("search")[0];
    if (!searchInput || !searchButton) return;

    searchInput.value = window.getSelection().toString();
    searchButton.click();
    searchInput.dispatchEvent(new Event("input", { bubbles: true }));
  };

  rmf.open = function () {
    if (!currentTarget || currentTarget.tagName !== "A") return;
    if (isInternalLink(currentTarget.href) && window.pjax) {
      pjax.loadUrl(currentTarget.href);
    } else {
      window.location.href = currentTarget.href;
    }
  };

  rmf.openWithNewTab = function () {
    if (!currentTarget) return;
    const url = currentTarget.tagName === "IMG" ? currentTarget.src : currentTarget.href;
    if (url) window.open(url);
  };

  rmf.copyLink = function () {
    if (!currentTarget) return;
    const url = currentTarget.tagName === "IMG" ? currentTarget.src : currentTarget.href;
    if (url) copyText(url);
  };

  rmf.click = function () {
    if (currentTarget) currentTarget.click();
  };

  rmf.saveAs = function () {
    if (!currentTarget || currentTarget.tagName !== "IMG") return;
    const a = document.createElement("a");
    a.href = currentTarget.src;
    a.download = currentTarget.src.split("/").pop() || "image";
    a.click();
  };

  rmf.paste = function () {
    if (!currentTarget || !["TEXTAREA", "INPUT"].includes(currentTarget.tagName)) return;

    navigator.clipboard
      .readText()
      .then(text => insertAtCursor(currentTarget, text))
      .catch(() => showToast("请允许读取剪贴板！", "top-center"));
  };

  window.RemoveRightMenu = hideRightMenu;

  function showContextMenu(event) {
    if (event.ctrlKey) return;

    const rightMenu = byId("rightMenu");
    if (!rightMenu) return;

    currentTarget = event.target;
    resetGroups();

    const selection = window.getSelection().toString();
    if (selection) show(byId("menu-text"));
    if (byId("post") || byId("body-wrap") || byId("page")) show(byId("menu-post"));

    const maybeUrl =
      /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/;
    if (selection && maybeUrl.test(selection) && currentTarget.tagName !== "A") {
      show(byId("menu-too"));
    }

    if (currentTarget.tagName === "A") show(byId("menu-to"));
    if (currentTarget.tagName === "IMG") show(byId("menu-img"));
    if (["TEXTAREA", "INPUT"].includes(currentTarget.tagName)) show(byId("menu-paste"));

    rightMenu.style.display = "block";
    const rect = rightMenu.getBoundingClientRect();
    let x = event.clientX + 10;
    let y = event.clientY;
    if (x + rect.width > window.innerWidth) x -= rect.width + 10;
    if (y + rect.height > window.innerHeight) y -= y + rect.height - window.innerHeight;

    ensureMask();
    showRightMenu(x, y);
    event.preventDefault();
  }

  if (!mobileRe.test(navigator.userAgent)) {
    window.addEventListener("contextmenu", showContextMenu, { signal });
  } else {
    let longPressTimer = 0;
    let touchStartPoint = null;

    document.documentElement.addEventListener(
      "touchstart",
      function (event) {
        const touch = event.touches[0];
        if (!touch) return;

        touchStartPoint = {
          x: touch.clientX,
          y: touch.clientY,
          target: event.target,
        };

        longPressTimer = window.setTimeout(function () {
          if (!touchStartPoint) return;
          showContextMenu({
            ctrlKey: false,
            target: touchStartPoint.target,
            clientX: touchStartPoint.x,
            clientY: touchStartPoint.y,
            preventDefault: function () {
              event.preventDefault();
            },
          });
          longPressTimer = 0;
        }, 380);
      },
      { passive: false, signal }
    );

    document.documentElement.addEventListener(
      "touchmove",
      function () {
        window.clearTimeout(longPressTimer);
        longPressTimer = 0;
        touchStartPoint = null;
      },
      { passive: true, signal }
    );

    document.documentElement.addEventListener(
      "touchend",
      function () {
        window.clearTimeout(longPressTimer);
        longPressTimer = 0;
        touchStartPoint = null;
      },
      { passive: true, signal }
    );
  }

  window.addEventListener("click", hideRightMenu, { signal });
  window.addEventListener("scroll", hideRightMenu, { passive: true, signal });
  window.addEventListener("resize", hideRightMenu, { signal });
  all(".rightMenu-item").forEach(item => item.addEventListener("click", hideRightMenu, { signal }));
})();
