(function () {
  "use strict";

  const scriptUrl = document.currentScript
    ? document.currentScript.src
    : window.location.href;

  const base = new URL("../../", scriptUrl);
  const url = path => new URL(path, base).href;
  const logo =
    '<img src="' + url("assets/img/logo-gtsi.webp") +
    '" alt="GTSI Academy" class="logo-img">' +
    '<span>GTSI <strong>ACADEMY</strong></span>';

  const header = document.getElementById("site-header");
  const minimal = document.body.dataset.header === "minimal";

  if (header) {
    header.className = "header";

    if (minimal) {
      header.innerHTML =
        '<a href="' + url("index.html") + '" class="logo">' + logo + '</a>' +
        '<div class="header-actions">' +
        '<a href="' + url("index.html") + '" class="login">← Retour à l’accueil</a>' +
        '</div>';
    } else {
      const nav =
        '<a href="' + url("index.html") + '">Accueil</a>' +
        '<a href="' + url("pages/formations.html") + '">Formations</a>' +
        '<a href="' + url("pages/paiement.html") + '">Paiement</a>' +
        '<a href="' + url("index.html#apropos") + '">À propos</a>' +
        '<a href="' + url("index.html#contact") + '">Contact</a>';

      const actions =
        '<span class="login" aria-disabled="true">Connexion bientôt disponible</span>' +
        '<span class="btn-primary" aria-disabled="true">Candidature bientôt disponible</span>';

      header.innerHTML =
        '<a href="' + url("index.html") + '" class="logo">' + logo + '</a>' +
        '<nav aria-label="Navigation principale">' + nav + '</nav>' +
        '<div class="header-actions">' + actions + '</div>';
    }
  }

  const footer = document.getElementById("site-footer");

  if (footer) {
    footer.innerHTML =
      '<div class="footer-brand">' +
      '<div class="logo">' + logo + '</div>' +
      '<p>Apprendre aujourd’hui, innover demain.</p>' +
      '</div>' +
      '<div class="footer-links">' +
      '<a href="' + url("pages/formations.html") + '">Nos formations</a>' +
      '<a href="' + url("pages/paiement.html") + '">Modalités de paiement</a>' +
      '<span>Inscription bientôt disponible</span>' +
      '<span>Connexion bientôt disponible</span>' +
      '</div>' +
      '<p class="footer-copy">© ' + new Date().getFullYear() +
      ' GTSI Academy — Global Technology Solutions &amp; Innovation.</p>';
  }
})();
