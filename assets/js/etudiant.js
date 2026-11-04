document.addEventListener("DOMContentLoaded", () => {
  const $ = id => document.getElementById(id);
  const sidebar = $("sidebar");
  const toggle = $("menuToggle");
  const layout = document.querySelector(".layout");

  if ($("year")) $("year").textContent = new Date().getFullYear();

  // Horloge locale, actualisée chaque seconde.
  const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long", day: "2-digit", month: "long", year: "numeric"
  });
  function updateClock() {
    const now = new Date();
    if ($("todayDate")) $("todayDate").textContent =
      dateFormatter.format(now).replace(/^./, c => c.toLocaleUpperCase("fr-FR"));
    if ($("liveClock")) $("liveClock").textContent =
      new Intl.DateTimeFormat("fr-FR", {
        hour: "2-digit", minute: "2-digit", second: "2-digit"
      }).format(now);
  }
  updateClock();
  window.setInterval(updateClock, 1000);

  // Menu latéral : mobile et ordinateur.
  if (sidebar && toggle) {
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
      if (window.innerWidth <= 760 && sidebar.classList.contains("open") &&
          !sidebar.contains(event.target) && !toggle.contains(event.target)) {
        sidebar.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Le backend pourra fournir cet objet après validation du contrat API.
  // Aucun chiffre ou cours fictif n'est affiché si les données sont absentes.
  const data = window.GTSI_STUDENT_DATA || null;
  const setText = (id, value, fallback = "—") => {
    const node = $(id);
    if (node) node.textContent = value === 0 ? "0" : (value ?? fallback);
  };
  const formatDate = value => {
    if (!value) return "—";
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? String(value) :
      new Intl.DateTimeFormat("fr-FR", {day:"2-digit", month:"long", year:"numeric"}).format(d);
  };

  if (data) {
    const training = data.training || {};
    const session = data.nextSession || {};
    const attendance = data.attendance || {};

    if (training.name) setText("trainingName", training.name);
    if (training.level) setText("trainingLevel", "Niveau : " + training.level);
    if (training.startDate) setText("trainingStart", formatDate(training.startDate));
    if (training.endDate) setText("trainingEnd", formatDate(training.endDate));
    if (training.status) setText("trainingStatus", training.status);
    if (Number.isFinite(Number(training.progress))) {
      const progress = Math.max(0, Math.min(100, Number(training.progress)));
      setText("trainingProgressLabel", progress + " %");
      $("trainingProgressBar").style.width = progress + "%";
    }

    if (session.courseName) {
      setText("nextCourseName", session.courseName);
      if (session.date) {
        const d = new Date(session.date);
        if (!Number.isNaN(d.getTime())) {
          setText("nextDay", new Intl.DateTimeFormat("fr-FR", {weekday:"short"}).format(d).replace(".", "").toUpperCase());
          setText("nextDateNumber", new Intl.DateTimeFormat("fr-FR", {day:"2-digit"}).format(d));
          setText("nextMonth", new Intl.DateTimeFormat("fr-FR", {month:"short"}).format(d).replace(".", "").toUpperCase());
        }
      }
      setText("sessionStatus", session.status || "Séance planifiée");
      setText("nextCourseTime", [session.startTime, session.endTime].filter(Boolean).join(" – ") || "—");
      setText("nextTrainerName", session.trainerName || "Non communiqué");
      setText("nextCourseDate", formatDate(session.date));
      setText("nextCourseRoom", session.location || "Non communiqué");
      setText("sessionNote", session.note || "Informations issues du planning de formation.");
    }

    const attended = Number(attendance.attended);
    const missed = Number(attendance.missed);
    const held = Number(attendance.held);
    const rate = Number.isFinite(Number(attendance.rate))
      ? Number(attendance.rate)
      : (Number.isFinite(attended) && Number.isFinite(held) && held > 0 ? attended / held * 100 : null);
    if (Number.isFinite(attended)) {
      setText("attendedCount", attended);
      setText("detailAttended", attended);
    }
    if (Number.isFinite(missed)) {
      setText("missedCount", missed);
      setText("detailMissed", missed);
    }
    if (Number.isFinite(held)) {
      setText("plannedCount", held);
      setText("detailHeld", held);
    }
    if (rate !== null && Number.isFinite(rate)) {
      const formatted = rate.toLocaleString("fr-FR", {maximumFractionDigits:1}) + " %";
      setText("attendanceRate", formatted);
      setText("detailRate", formatted);
    }
    if (training.name) setText("attendanceTrainingName", "Formation : " + training.name);

    const history = $("attendanceHistory");
    if (history && Array.isArray(attendance.history) && attendance.history.length) {
      const list = document.createElement("div");
      list.className = "attendance-history-list";
      attendance.history.forEach(item => {
        const row = document.createElement("div");
        row.className = "history-row";
        const details = document.createElement("div");
        const course = document.createElement("strong");
        course.textContent = item.courseName || "Cours";
        const meta = document.createElement("small");
        meta.textContent = [formatDate(item.date), item.startTime, item.trainerName].filter(Boolean).join(" · ");
        details.append(course, meta);
        const status = document.createElement("span");
        status.className = "history-status";
        status.textContent = item.status || "Non renseigné";
        row.append(details, status);
        list.appendChild(row);
      });
      history.replaceChildren(list);
    }
  }


  // Centre de notifications alimenté uniquement par les données réelles du backend.
  const notificationToggle = $("notificationToggle");
  const notificationPanel = $("notificationPanel");
  const notificationClose = $("notificationClose");
  const notificationList = $("notificationList");
  const notificationDot = $("notificationDot");
  const notificationCount = $("notificationCount");

  function closeNotifications() {
    if (!notificationPanel || !notificationToggle) return;
    notificationPanel.hidden = true;
    notificationToggle.setAttribute("aria-expanded", "false");
  }
  function renderNotifications(items) {
    if (!notificationList) return;
    const notifications = Array.isArray(items) ? items : [];
    const unread = notifications.filter(item => !item.read).length;
    if (notificationDot) notificationDot.hidden = unread === 0;
    if (notificationCount) notificationCount.textContent =
      unread ? `${unread} non lue${unread > 1 ? "s" : ""}` : "Centre de notifications";
    if (!notifications.length) {
      const empty = document.createElement("div");
      empty.className = "notification-empty";
      const symbol = document.createElement("span");
      symbol.textContent = "♧";
      const title = document.createElement("b");
      title.textContent = "Tout est à jour";
      const message = document.createElement("p");
      message.textContent = "Vous n'avez aucune nouvelle notification.";
      empty.append(symbol, title, message);
      notificationList.replaceChildren(empty);
      return;
    }
    const list = document.createDocumentFragment();
    notifications.slice(0, 12).forEach(item => {
      const row = document.createElement("article");
      row.className = "notification-item";
      const symbol = document.createElement("span");
      symbol.className = "notification-symbol";
      symbol.textContent = item.icon || "•";
      const body = document.createElement("div");
      const title = document.createElement("b");
      title.textContent = item.title || "Information";
      const message = document.createElement("p");
      message.textContent = item.message || "";
      body.append(title, message);
      if (item.date) {
        const date = document.createElement("time");
        date.textContent = String(item.date);
        body.append(date);
      }
      row.append(symbol, body);
      list.append(row);
    });
    notificationList.replaceChildren(list);
  }
  renderNotifications(data && data.notifications);
  if (notificationToggle && notificationPanel) {
    notificationToggle.addEventListener("click", () => {
      const willOpen = notificationPanel.hidden;
      notificationPanel.hidden = !willOpen;
      notificationToggle.setAttribute("aria-expanded", String(willOpen));
    });
    notificationClose?.addEventListener("click", closeNotifications);
    document.addEventListener("click", event => {
      if (!notificationPanel.hidden &&
          !notificationPanel.contains(event.target) &&
          !notificationToggle.contains(event.target)) closeNotifications();
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closeNotifications();
    });
    $("allNotifications")?.addEventListener("click", closeNotifications);
  }

  // Dossier détaillé accessible à la demande, sans surcharger l'accueil.
  const modal = $("attendanceModal");
  const open = $("openAttendance");
  const close = $("closeAttendance");
  function closeModal() {
    if (!modal) return;
    modal.hidden = true;
    if (open) open.focus();
  }
  if (open && modal) open.addEventListener("click", () => {
    modal.hidden = false;
    close?.focus();
  });
  if (close) close.addEventListener("click", closeModal);
  if (modal) {
    modal.addEventListener("click", event => {
      if (event.target === modal) closeModal();
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && !modal.hidden) closeModal();
    });
  }

  // Navigation active.
  document.querySelectorAll(".sidebar nav a").forEach(link => {
    link.addEventListener("click", () => {
      document.querySelectorAll(".sidebar nav a").forEach(a => a.classList.remove("active"));
      link.classList.add("active");
    });
  });
});
