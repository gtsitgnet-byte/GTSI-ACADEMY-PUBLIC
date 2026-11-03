document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.getElementById("sidebar");
  const toggle = document.getElementById("menuToggle");
  const year = document.getElementById("year");

  if (year) year.textContent = new Date().getFullYear();

  if (sidebar && toggle) {
    const layout = document.querySelector(".layout");

    toggle.addEventListener("click", () => {
      if (window.innerWidth > 760) {
        layout.classList.toggle("sidebar-collapsed");
        const visible = !layout.classList.contains("sidebar-collapsed");
        toggle.setAttribute("aria-expanded", String(visible));
        toggle.setAttribute("aria-label", visible ? "Masquer le menu" : "Afficher le menu");
      } else {
        sidebar.classList.toggle("open");
        const visible = sidebar.classList.contains("open");
        toggle.setAttribute("aria-expanded", String(visible));
        toggle.setAttribute("aria-label", visible ? "Fermer le menu" : "Ouvrir le menu");
      }
    });

    sidebar.querySelectorAll("nav a, .help a").forEach(link => {
      link.addEventListener("click", () => {
        sidebar.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("click", event => {
      if (
        window.innerWidth <= 760 &&
        sidebar.classList.contains("open") &&
        !sidebar.contains(event.target) &&
        !toggle.contains(event.target)
      ) {
        sidebar.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }
});
