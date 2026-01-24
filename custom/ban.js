/*
 * @Author: s1rius
 * @Date: 2025-02-23 21:56:23
 * @LastEditTime: 2025-02-26 13:01:15
 * @Description: https://s1rius.space/
 */

if (window.location.hostname != "localhost") {
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
}
