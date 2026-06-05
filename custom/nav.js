/*
 * @Author: s1rius
 * @Date: 2025-01-22 08:59:05
 * @Description: https://s1rius.space/
 */
(function () {
  let lastScrollY = window.scrollY || document.documentElement.scrollTop || 0;
  let ticking = false;

  function getMenuItems() {
    return document.getElementsByClassName("menus_items")[1];
  }

  function hideNameContainer() {
    const nameContainer = document.getElementById("name-container");
    if (nameContainer) nameContainer.style.display = "none";
  }

  function showNameContainer() {
    const nameContainer = document.getElementById("name-container");
    if (nameContainer) nameContainer.style.display = "";
  }

  function setMenuVisible(visible) {
    const menuItems = getMenuItems();
    if (menuItems) {
      menuItems.style.setProperty("display", visible ? "" : "none", visible ? "" : "important");
    }
  }

  function updateNavTitle() {
    const pageName = document.getElementById("page-name");
    if (!pageName) return;
    pageName.innerText = document.title.split(" | s1rius")[0];
  }

  function onScroll() {
    const currentScrollY = window.scrollY || document.documentElement.scrollTop || 0;
    if (currentScrollY > lastScrollY) {
      showNameContainer();
      setMenuVisible(false);
    } else {
      setMenuVisible(true);
      hideNameContainer();
    }
    lastScrollY = currentScrollY;
    ticking = false;
  }

  function requestScrollUpdate() {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }

  function initNav() {
    hideNameContainer();
    updateNavTitle();
    lastScrollY = window.scrollY || document.documentElement.scrollTop || 0;
  }

  window.scrollToTop = function () {
    setMenuVisible(true);
    hideNameContainer();
    btf.scrollToDest(0, 500);
  };

  document.addEventListener("DOMContentLoaded", initNav);
  document.addEventListener("pjax:complete", initNav);
  window.addEventListener("scroll", requestScrollUpdate, { passive: true });
})();
