(function () {
  "use strict";

  const toggle = document.getElementById("homeMenuToggle");
  const nav = document.getElementById("homeNav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      const opened = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(opened));
      toggle.textContent = opened ? "✕" : "☰";
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.textContent = "☰";
      });
    });
  }
})();
