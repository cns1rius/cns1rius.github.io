(function () {
  let ticking = false;

  function updatePercent() {
    const up = document.querySelector("#go-up");
    if (!up || up.childNodes.length < 2) {
      ticking = false;
      return;
    }

    const scrollTop = document.documentElement.scrollTop || window.pageYOffset;
    const scrollHeight =
      Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.body.clientHeight,
        document.documentElement.clientHeight
      ) - document.documentElement.clientHeight;
    const result = scrollHeight > 0 ? Math.round((scrollTop / scrollHeight) * 100) : 0;

    if (result <= 95) {
      up.childNodes[0].style.display = "none";
      up.childNodes[1].style.display = "block";
      up.childNodes[1].innerHTML = result;
    } else {
      up.childNodes[1].style.display = "none";
      up.childNodes[0].style.display = "block";
    }

    ticking = false;
  }

  function requestUpdate() {
    if (!ticking) {
      window.requestAnimationFrame(updatePercent);
      ticking = true;
    }
  }

  window.addEventListener("scroll", requestUpdate, { passive: true });
  document.addEventListener("DOMContentLoaded", requestUpdate);
  document.addEventListener("pjax:complete", requestUpdate);
})();
