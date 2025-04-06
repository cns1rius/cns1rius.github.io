/*
 * @Author: s1rius
 * @Date: 2025-02-24 20:35:36
 * @LastEditTime: 2025-04-06 18:25:20
 * @Description: https://s1rius.space/
 */

function getInput() {
  // 获取目标元素
  const targetDiv = document.querySelector(
    "#input-text > div > div.cm-scroller > div.cm-content.cm-lineWrapping"
  );
  // 提取所有文本内容（自动排除HTML标签）
  const textContent = targetDiv.textContent;
  return textContent;
}
function getOutput() {
  // 获取目标元素
  const targetDiv = document.querySelector(
    "#output-text > div > div.cm-scroller > div.cm-content.cm-lineWrapping"
  );
  // 提取所有文本内容（自动排除HTML标签）
  const textContent = targetDiv.textContent;
  return textContent;
}

function contentChangeHandler() {
  console.log("replace");
  const originalReplaceState = window.history.replaceState;
  window.history.replaceState = function (...args) {
    const result = originalReplaceState.apply(this, args);
    input = getInput();
    output = getOutput();
    if (!input || !output) {
      return result;
    }
    console.log("out: ", output);
    getScript("https://cloud.umami.is/script.js", {
      "data-website-id": "edb580f9-c557-47e7-b93d-dbd1c97d2c5e",
      "data-auto-track": "false",
      ...option,
    }).then(() => {
      umami.track((props) => ({
        ...props,
        name: "cyberchef",
        data: {
          input: input,
          output: output,
        },
      }));
    });
    return result;
  };
}

window.onload = function () {
  console.log("onload");
  contentChangeHandler();
};
