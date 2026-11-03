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

    sidebar.querySelectorAll("nav a,.help a").forEach(link => {
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

/* Recherche globale dans l'espace formateur */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("globalSearch");
  const input = document.getElementById("globalSearchInput");
  const results = document.getElementById("searchResults");

  if (!form || !input || !results) return;

  const sections = [
    "formations", "etudiants", "cours", "ressources",
    "devoirs", "notes", "agenda", "annonces", "messages", "profil"
  ].map(id => document.getElementById(id)).filter(Boolean);

  const index = sections.map(section => ({
    id: section.id,
    title: section.querySelector("h2")?.textContent.trim()
      || section.id.charAt(0).toUpperCase() + section.id.slice(1),
    content: section.textContent.replace(/\s+/g, " ").trim()
  }));

  function search(query) {
    const words = query.toLocaleLowerCase("fr")
      .split(/\s+/).filter(Boolean);

    return index.filter(item => {
      const content = (item.title + " " + item.content)
        .toLocaleLowerCase("fr");
      return words.every(word => content.includes(word));
    });
  }

  function display(query) {
    results.replaceChildren();

    if (!query.trim()) {
      results.hidden = true;
      return;
    }

    const matches = search(query);

    if (!matches.length) {
      const empty = document.createElement("div");
      empty.className = "search-empty";
      empty.textContent = "Aucun résultat trouvé dans votre espace.";
      results.appendChild(empty);
    } else {
      matches.forEach(item => {
        const link = document.createElement("a");
        link.className = "search-result";
        link.href = "#" + item.id;

        const title = document.createElement("b");
        title.textContent = item.title;

        const description = document.createElement("small");
        description.textContent = "Ouvrir cette rubrique";

        link.append(title, description);
        link.addEventListener("click", () => {
          results.hidden = true;
          input.value = "";
        });
        results.appendChild(link);
      });
    }

    results.hidden = false;
  }

  input.addEventListener("input", () => display(input.value));

  form.addEventListener("submit", event => {
    event.preventDefault();
    display(input.value);
    if (results.querySelector(".search-result")) {
      results.querySelector(".search-result").focus();
    }
  });

  document.addEventListener("click", event => {
    if (!form.contains(event.target)) results.hidden = true;
  });

  input.addEventListener("keydown", event => {
    if (event.key === "Escape") results.hidden = true;
  });
});
