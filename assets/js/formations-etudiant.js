(function () {
  var API = "https://script.google.com/macros/s/AKfycbxLQA5MHnRBD2UnkfAfiGXTFlWoJSoBiuVO_3xwf3_oVLXsr0YYsepsoy5-A51UVJIGvA/exec";
  var session = sessionStorage.getItem("gtsi_session"), email = sessionStorage.getItem("gtsi_email");
  var LABEL = { en_attente: "En attente", valide: "Validée", refuse: "Refusée" };

  function call(payload) {
    return fetch(API, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(Object.assign({ email: email, session: session }, payload)) }).then(function (r) { return r.json(); });
  }
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text !== undefined) e.textContent = text; return e; }
  function set(id, text) { var n = document.getElementById(id); if (n) n.textContent = text; }

  function render(mine, all) {
    var main = mine.filter(function (m) { return m.statut === "valide"; })[0] || mine[0];
    if (main) {
      set("trainingName", main.titre);
      set("trainingLevel", "Niveau : " + main.niveau);
      set("trainingStatus", LABEL[main.statut] || main.statut);
    }
    var host = document.getElementById("formations");
    if (!host) return;
    var old = document.getElementById("catalogueFormations");
    if (old) old.remove();
    var box = el("div", "", ""); box.id = "catalogueFormations"; box.style.marginTop = "18px";
    box.append(el("h3", "", "Formations disponibles"));
    var taken = {}; mine.forEach(function (m) { taken[m.id] = m.statut; });
    if (!all.length) box.append(el("p", "muted", "Aucune formation n’est ouverte pour le moment."));
    all.forEach(function (f) {
      var row = el("div", "", ""); row.style.cssText = "padding:10px 0;border-top:1px solid #e3e9f2";
      row.append(el("b", "", f.titre), el("br"), el("small", "muted", f.domaine + " · " + f.niveau));
      if (taken[f.id]) {
        var st = el("div", "", "Votre demande : " + (LABEL[taken[f.id]] || taken[f.id])); st.style.marginTop = "6px"; row.append(st);
      } else {
        var b = el("button", "", "Demander l’inscription"); b.type = "button";
        b.style.cssText = "margin-top:8px;padding:9px 14px;border:0;border-radius:8px;background:#1769e0;color:#fff;font-weight:700;cursor:pointer";
        b.onclick = function () {
          b.disabled = true; b.textContent = "Envoi...";
          call({ action: "formation_enroll", formation_id: f.id }).then(function (d) {
            if (d.ok || d.error === "EXISTS") load(); else { b.disabled = false; b.textContent = d.message || "Échec, réessayer"; }
          }).catch(function () { b.disabled = false; b.textContent = "Connexion impossible"; });
        };
        row.append(b);
      }
      box.append(row);
    });
    host.append(box);
  }

  function load() {
    if (!session || !email) return;
    Promise.all([call({ action: "my_formations" }), call({ action: "formations_list" })]).then(function (r) {
      render(r[0].ok ? r[0].items : [], r[1].ok ? r[1].items : []);
    }).catch(function () {});
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", load); else load();
})();
