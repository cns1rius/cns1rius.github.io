/*
 * @Author: s1rius
 * @Date: 2025-01-22 08:59:05
 * @LastEditTime: 2025-01-25 09:21:11
 * @Description: https://s1rius.space/
 */
document.addEventListener("pjax:complete", tonav);
document.addEventListener("DOMContentLoaded", tonav);
//响应pjax
function tonav() {
  document
    .getElementById("name-container")
    .setAttribute("style", "display:none");
  var position = $(window).scrollTop();
  $(window).scroll(function () {
    var scroll = $(window).scrollTop();
    if (scroll > position) {
      document.getElementById("name-container").setAttribute("style", "");
      document
        .getElementsByClassName("menus_items")[1]
        .setAttribute("style", "display:none!important");
    } else {
      document
        .getElementsByClassName("menus_items")[1]
        .setAttribute("style", "");
      document
        .getElementById("name-container")
        .setAttribute("style", "display:none");
    }
    position = scroll;
  });
  //修复没有弄右键菜单的童鞋无法回顶部的问题
  document.getElementById("page-name").innerText =
    document.title.split(" | s1rius")[0];
}

function scrollToTop() {
  document.getElementsByClassName("menus_items")[1].setAttribute("style", "");
  document
    .getElementById("name-container")
    .setAttribute("style", "display:none");
  btf.scrollToDest(0, 500);
}
