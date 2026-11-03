(function () {
  var API = "https://script.google.com/macros/s/AKfycbxLQA5MHnRBD2UnkfAfiGXTFlWoJSoBiuVO_3xwf3_oVLXsr0YYsepsoy5-A51UVJIGvA/exec";
  var need = document.currentScript.getAttribute("data-role");
  var s = sessionStorage.getItem("gtsi_session"), em = sessionStorage.getItem("gtsi_email");
  var html = document.documentElement;
  html.style.visibility = "hidden";
  function out() { sessionStorage.clear(); location.replace("../pages/connexion.html"); }
  if (!s || !em) return out();
  function fill(d) {
    document.querySelectorAll("[data-me]").forEach(function (n) {
      var v = d[n.getAttribute("data-me")];
      if (v) n.textContent = v;
    });
  }
  fetch(API, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ action: "me", email: em, session: s }) })
    .then(function (r) { return r.json(); })
    .then(function (d) {
      if (!d.ok || d.role !== need) return out();
      if (d.mustChange) { location.replace("../pages/mot-de-passe.html"); return; }
      if (d.prenom || d.nom) {
        d.nom_complet = ((d.prenom || "") + " " + (d.nom || "")).trim();
        d.initiales = ((d.prenom || " ")[0] + (d.nom || " ")[0]).toUpperCase().trim();
      }
      d.statut_label = { approuve: "Approuvé", en_attente: "En attente", rejete: "Rejeté" }[d.statut] || "";
      window.GTSI_ME = d;
      if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { fill(d); });
      else fill(d);
      html.style.visibility = "visible";
    })
    .catch(out);
})();
