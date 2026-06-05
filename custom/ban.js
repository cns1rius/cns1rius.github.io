(function () {
  if (window.location.hostname === "localhost") return;

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

  window.setInterval(function () {
    detectByWindowSize();
    detectByConsoleGetter();
  }, 1500);
})();
