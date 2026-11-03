(function () {
  "use strict";

  const sidebar = document.getElementById("portalSidebar");
  const overlay = document.getElementById("portalOverlay");
  const toggle = document.getElementById("menuToggle");
  const logout = document.getElementById("portalLogout");
  const year = document.getElementById("portalYear");

  function closeMenu() {
    if (sidebar) sidebar.classList.remove("open");
    if (overlay) overlay.classList.remove("visible");
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      const layout = document.querySelector(".portal-layout");

      if (window.innerWidth > 760) {
        layout.classList.toggle("sidebar-collapsed");
        const visible = !layout.classList.contains("sidebar-collapsed");
        toggle.setAttribute("aria-expanded", String(visible));
        toggle.setAttribute("aria-label", visible ? "Masquer le menu" : "Afficher le menu");
      } else {
        sidebar.classList.toggle("open");
        overlay.classList.toggle("visible");
        const visible = sidebar.classList.contains("open");
        toggle.setAttribute("aria-expanded", String(visible));
        toggle.setAttribute("aria-label", visible ? "Fermer le menu" : "Ouvrir le menu");
      }
    });
  }

  if (overlay) overlay.addEventListener("click", closeMenu);

  if (logout) {
    logout.addEventListener("click", function () {
      if (confirm("Voulez-vous vraiment vous déconnecter ?")) {
        sessionStorage.clear();
        location.href = "../pages/connexion.html";
      }
    });
  }

  if (year) year.textContent = new Date().getFullYear();
})();
