const form = document.getElementById("registrationForm");
const steps = [...document.querySelectorAll(".form-step")];
const countrySelect = document.getElementById("pays");
const phoneInput = document.getElementById("telephone");
const phoneInfo = document.getElementById("phoneInfo");
const emailInput = document.getElementById("email");
const otpInput = document.getElementById("otpCode");
const continueOtp = document.getElementById("continueAfterOtp");

let currentStep = 1;
let emailVerified = false;
let iti = null;

function showStep(number) {
  if (number > 3 && !emailVerified) {
    showStep(3);
    return;
  }

  currentStep = number;
  steps.forEach(step => {
    step.classList.toggle("active", Number(step.dataset.step) === number);
  });

  window.scrollTo({top: 0, behavior: "smooth"});
}

const FAKE_WORDS = /^(test|tests|essai|azerty|qwerty|asdf|abc|abcd|xxx|nom|prenom|prénom|fake|faux|null|none|inconnu)$/i;

function textError(value, label, min) {
  const v = value.trim().replace(/\s+/g, " ");
  if (v.length < min) return label + " : trop court.";
  if (v.length > 60) return label + " : trop long.";
  if (!/^[\p{L}][\p{L}\p{M}'’ ,.\-]*$/u.test(v))
    return label + " : lettres uniquement (accents, tirets et apostrophes autorisés).";
  if (/(.)\1{2,}/iu.test(v)) return label + " : saisie invalide.";
  const words = v.split(/[ ,.\-]+/).filter(Boolean);
  if (words.some(w => !/[aeiouyàâäéèêëîïôöùûüœ]/i.test(w))) return label + " : saisie invalide.";
  if (/[^aeiouyàâäéèêëîïôöùûüœ\s'’,.\-]{5,}/iu.test(v)) return label + " : saisie invalide.";
  if (v.split(/[ ,.\-]+/).some(w => FAKE_WORDS.test(w))) return label + " : saisie invalide.";
  return "";
}

["nom_naissance", "prenom", "lieu_naissance", "nationalite", "date_naissance"].forEach(id => {
  const f = document.getElementById(id);
  f.addEventListener("input", () => f.setCustomValidity(""));
  f.addEventListener("change", () => f.setCustomValidity(""));
});

function validateStep() {
  const section = steps.find(s => Number(s.dataset.step) === currentStep);
  const fields = [...section.querySelectorAll("input,select")];

  for (const field of fields) {
    if (field.disabled || field.type === "file" ||
        field.type === "checkbox" && !field.required) continue;

    if (field.type === "checkbox" && !field.checked) {
      field.reportValidity();
      return false;
    }

    if (field.required && !field.checkValidity()) {
      field.reportValidity();
      return false;
    }
  }

  if (currentStep === 1) {
    formatIdentity();
    const bad = step1Error() || dateError();
    if (bad) {
      const f = document.getElementById(bad[0]);
      f.setCustomValidity(bad[1]);
      f.reportValidity();
      return false;
    }
  }

  if (currentStep === 1) {
    const checks = [
      ["nom_naissance", "Nom de naissance", 3],
      ["prenom", "Prénom(s)", 3],
      ["lieu_naissance", "Lieu de naissance", 3],
      ["nationalite", "Nationalité", 4]
    ];
    for (const [id, label, min] of checks) {
      const f = document.getElementById(id);
      const err = textError(f.value, label, min);
      if (err) { f.setCustomValidity(err); f.reportValidity(); return false; }
    }
    const d = document.getElementById("date_naissance");
    const birth = new Date(d.value), now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
    if (isNaN(age) || age < 15 || age > 90) {
      d.setCustomValidity("Date de naissance non plausible (15 à 90 ans).");
      d.reportValidity();
      return false;
    }
  }

  if (currentStep === 5) {
    const file = document.getElementById("document").files[0];
    const info = document.getElementById("fileInfo");
    if (!file) {
      info.textContent = "La pièce d’identité est obligatoire.";
      info.style.color = "#c62828";
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      info.textContent = "Fichier trop lourd (5 Mo maximum).";
      info.style.color = "#c62828";
      return false;
    }
  }

  if (currentStep === 2) {
    const phoneDigits = phoneInput.value.replace(/\D/g, "");

    if (iti && !iti.isValidNumber()) {
      phoneInfo.textContent = "Numéro invalide pour le pays sélectionné.";
      phoneInfo.style.color = "#c62828";
      return false;
    }

    if (!iti && (phoneDigits.length < 6 || phoneDigits.length > 15)) {
      phoneInfo.textContent = "Vérifiez le nombre de chiffres du numéro.";
      phoneInfo.style.color = "#c62828";
      return false;
    }
    phoneInfo.textContent = "Format du numéro valide.";
    phoneInfo.style.color = "#16834a";
  }

  return true;
}

document.querySelectorAll(".next-step").forEach(button => {
  button.addEventListener("click", () => {
    if (validateStep()) showStep(currentStep + 1);
  });
});

document.querySelectorAll(".previous-step").forEach(button => {
  button.addEventListener("click", () => showStep(currentStep - 1));
});

// Liste internationale fournie par la bibliothèque téléphonique.

// Liste locale des 54 pays africains et de leurs indicatifs.
const africanCountries = [
  ["dz","Algérie","213"],
  ["ao","Angola","244"],
  ["bj","Bénin","229"],
  ["bw","Botswana","267"],
  ["bf","Burkina Faso","226"],
  ["bi","Burundi","257"],
  ["cm","Cameroun","237"],
  ["cv","Cap-Vert","238"],
  ["cf","République centrafricaine","236"],
  ["km","Comores","269"],
  ["cg","République du Congo","242"],
  ["cd","République démocratique du Congo","243"],
  ["ci","Côte d’Ivoire","225"],
  ["dj","Djibouti","253"],
  ["eg","Égypte","20"],
  ["gq","Guinée équatoriale","240"],
  ["er","Érythrée","291"],
  ["sz","Eswatini","268"],
  ["et","Éthiopie","251"],
  ["ga","Gabon","241"],
  ["gm","Gambie","220"],
  ["gh","Ghana","233"],
  ["gn","Guinée","224"],
  ["gw","Guinée-Bissau","245"],
  ["ke","Kenya","254"],
  ["ls","Lesotho","266"],
  ["lr","Liberia","231"],
  ["ly","Libye","218"],
  ["mg","Madagascar","261"],
  ["mw","Malawi","265"],
  ["ml","Mali","223"],
  ["ma","Maroc","212"],
  ["mu","Maurice","230"],
  ["mr","Mauritanie","222"],
  ["mz","Mozambique","258"],
  ["na","Namibie","264"],
  ["ne","Niger","227"],
  ["ng","Nigeria","234"],
  ["rw","Rwanda","250"],
  ["st","Sao Tomé-et-Principe","239"],
  ["sn","Sénégal","221"],
  ["sc","Seychelles","248"],
  ["sl","Sierra Leone","232"],
  ["so","Somalie","252"],
  ["za","Afrique du Sud","27"],
  ["ss","Soudan du Sud","211"],
  ["sd","Soudan","249"],
  ["tz","Tanzanie","255"],
  ["tg","Togo","228"],
  ["tn","Tunisie","216"],
  ["ug","Ouganda","256"],
  ["zm","Zambie","260"],
  ["zw","Zimbabwe","263"],
  ["eh","Sahara occidental","212"]
];

function loadCountries() {
  countrySelect.innerHTML =
    '<option value="">Choisir votre pays</option>';

  africanCountries
    .sort((a, b) => a[1].localeCompare(b[1], "fr"))
    .forEach(([iso, name, dial]) => {
      const option = document.createElement("option");
      option.value = iso;
      option.textContent = `${name} (+${dial})`;
      option.dataset.dial = dial;
      countrySelect.appendChild(option);
    });

  // Le Togo est sélectionné par défaut.
  countrySelect.value = "tg";

  // Initialisation facultative du sélecteur téléphonique.
  // La liste des pays fonctionne même si cette bibliothèque échoue.
  if (typeof window.intlTelInput === "function") {
    iti = window.intlTelInput(phoneInput, {
      initialCountry: "tg",
      separateDialCode: true,
      nationalMode: true,
      loadUtils: () => import("../vendor/intl-tel-input/utils.js")
    });
  }

  updatePhoneCountry();

  countrySelect.addEventListener("change", () => {
    if (iti && countrySelect.value) {
      iti.setCountry(countrySelect.value);
    }
    updatePhoneCountry();
  });

  phoneInput.addEventListener("countrychange", updatePhoneCountry);

  console.log("Pays africains chargés :", africanCountries.length);
}

function updatePhoneCountry() {
  const selected = africanCountries.find(
    country => country[0] === countrySelect.value
  );

  if (!selected) {
    phoneInfo.textContent = "Choisissez votre pays.";
    return;
  }

  const dial = selected[2];
  phoneInfo.textContent = "Indicatif international : +" + dial;

  if (!iti) {
    phoneInput.placeholder = "+" + dial + " XX XX XX XX";
  }
}



// Suggestions locales de villes selon le pays choisi.
const cityInput = document.getElementById("ville");
const streetInput = document.getElementById("rue");

countrySelect.addEventListener("change", () => {
  cityInput.value = "";
  streetInput.value = "";
  updateCityOptions();
});

// Changer de ville oblige à ressaisir la rue ou le quartier.
cityInput.addEventListener("input", () => {
  streetInput.value = "";
});

loadCountries();
updateCityOptions();

// ---------- Vérification e-mail par OTP (API Apps Script) ----------
const OTP_API = "https://script.google.com/macros/s/AKfycbxLQA5MHnRBD2UnkfAfiGXTFlWoJSoBiuVO_3xwf3_oVLXsr0YYsepsoy5-A51UVJIGvA/exec";
let otpToken = null;
let resendTimer = null;

async function callApi(payload) {
  if (payload.action === "send_otp") Object.assign(payload, await window.gtsiPow(OTP_API));
  const response = await fetch(OTP_API, {
    method: "POST",
    headers: {"Content-Type": "text/plain;charset=utf-8"},
    body: JSON.stringify(payload)
  });
  return response.json();
}

function startResendCountdown(seconds) {
  const button = document.getElementById("sendOtp");
  const label = "Envoyer le code de vérification";
  clearInterval(resendTimer);
  let left = seconds;
  button.disabled = true;
  button.textContent = "Renvoyer le code dans " + left + " s";
  resendTimer = setInterval(() => {
    left--;
    if (left <= 0) {
      clearInterval(resendTimer);
      button.disabled = false;
      button.textContent = "Renvoyer le code";
    } else {
      button.textContent = "Renvoyer le code dans " + left + " s";
    }
  }, 1000);
}

// Si l'e-mail change, la vérification précédente n'est plus valable.
emailInput.addEventListener("input", () => {
  emailVerified = false;
  otpToken = null;
  continueOtp.disabled = true;
});

document.getElementById("sendOtp").addEventListener("click", async () => {
  if (!validateStep()) return;

  const message = document.getElementById("otpSendMessage");
  const button = document.getElementById("sendOtp");
  const email = emailInput.value.trim().toLowerCase();

  button.disabled = true;
  message.textContent = "Envoi du code en cours...";

  try {
    const result = await callApi({action: "send_otp", email});

    if (result.ok) {
      message.textContent = "Code envoyé. Consultez votre boîte e-mail (et vos spams).";
      startResendCountdown(result.resendIn || 60);
      showStep(3);
    } else if (result.error === "RESEND_TOO_SOON") {
      message.textContent = "Un code a déjà été envoyé. Patientez " + result.retryIn + " s avant d'en demander un autre.";
      startResendCountdown(result.retryIn || 60);
    } else {
      message.textContent = result.message || "Envoi impossible. Réessayez.";
      button.disabled = false;
    }
  } catch (error) {
    message.textContent = "Connexion au service impossible. Vérifiez votre réseau et réessayez.";
    button.disabled = false;
  }
});

document.getElementById("verifyOtp").addEventListener("click", async () => {
  const code = otpInput.value.trim();
  const message = document.getElementById("otpVerifyMessage");
  const button = document.getElementById("verifyOtp");

  if (!/^[0-9]{6}$/.test(code)) {
    message.textContent = "Saisissez exactement 6 chiffres.";
    return;
  }

  button.disabled = true;
  message.textContent = "Vérification en cours...";

  try {
    const result = await callApi({
      action: "verify_otp",
      email: emailInput.value.trim().toLowerCase(),
      code
    });

    if (result.ok && result.token) {
      otpToken = result.token;
      emailVerified = true;
      continueOtp.disabled = false;
      message.textContent = "Adresse e-mail vérifiée avec succès.";
    } else if (result.error === "WRONG_CODE") {
      message.textContent = "Code incorrect. Il vous reste " + result.triesLeft + " essai(s).";
      button.disabled = false;
    } else {
      message.textContent = (result.message || "Code incorrect ou expiré.") +
        " Retournez à l'étape précédente pour demander un nouveau code.";
      button.disabled = false;
    }
  } catch (error) {
    message.textContent = "Connexion au service impossible. Réessayez.";
    button.disabled = false;
  }
});

otpInput.addEventListener("input", () => {
  otpInput.value = otpInput.value.replace(/\D/g, "").slice(0, 6);
});

// Contrôle du document facultatif.
document.getElementById("document").addEventListener("change", function() {
  const info = document.getElementById("fileInfo");
  const file = this.files[0];

  if (!file) return;

  const allowed = ["application/pdf", "image/jpeg", "image/png"];

  if (!allowed.includes(file.type) || file.size > 5 * 1024 * 1024) {
    this.value = "";
    info.textContent = "Fichier refusé : PDF, JPG ou PNG, 5 Mo maximum.";
  } else {
    info.textContent = "Document sélectionné : " + file.name;
  }
});

// ---------- Soumission du dossier ----------
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(",")[1]);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

const FIELD_STEP = {
  nom_naissance: 1, prenom: 1, date_naissance: 1, lieu_naissance: 1, nationalite: 1,
  pays: 2, ville: 2, telephone: 2, bp: 2, rue: 2,
  niveau: 4, statut: 4, document: 5, consent: 5
};

form.addEventListener("submit", async event => {
  event.preventDefault();
  const msg = document.getElementById("formMessage");
  const btn = form.querySelector('button[type="submit"]');

  if (!emailVerified || !otpToken) { showStep(3); return; }
  if (!validateStep()) return;

  const value = id => document.getElementById(id).value;
  const bpLabel = [...document.querySelectorAll("label")].find(l => /Boîte postale/i.test(l.textContent));
  const bpField = bpLabel && document.getElementById(bpLabel.htmlFor);

  btn.disabled = true;
  msg.style.color = "";
  msg.textContent = "Envoi de votre candidature en cours...";

  try {
    const file = document.getElementById("document").files[0];
    const result = await callApi({
      action: "submit_application",
      email: emailInput.value.trim().toLowerCase(),
      token: otpToken,
      fields: {
        nom: value("nom_naissance"),
        prenom: value("prenom"),
        date_naissance: value("date_naissance"),
        lieu_naissance: value("lieu_naissance"),
        nationalite: value("nationalite"),
        pays: countrySelect.options[countrySelect.selectedIndex].text,
        ville: cityInput.value,
        telephone: iti ? iti.getNumber() : phoneInput.value,
        bp: bpField ? bpField.value : "",
        rue: value("rue"),
        niveau: value("niveau"),
        statut: value("statut"),
        domaine: value("domaine"),
        consent: document.getElementById("consent").checked
      },
      file: { name: file.name, data: await fileToBase64(file) }
    });

    if (result.ok) {
      const box = document.createElement("div");
      box.className = "validation-notice";
      const t = document.createElement("strong");
      t.textContent = "Candidature envoyée";
      const p = document.createElement("p");
      p.textContent = "Référence : " + result.id + ". Votre dossier sera examiné par l’administration. " +
        "Votre espace étudiant sera activé uniquement après approbation.";
      box.append(t, p);
      form.replaceChildren(box);
      window.scrollTo({top: 0, behavior: "smooth"});
      return;
    }

    if (result.error === "TOKEN_INVALID") {
      emailVerified = false; otpToken = null; continueOtp.disabled = true;
      document.getElementById("otpVerifyMessage").textContent = result.message;
      showStep(3);
    } else if (result.field && FIELD_STEP[result.field]) {
      showStep(FIELD_STEP[result.field]);
    }
    msg.style.color = "#c62828";
    msg.textContent = result.message || "Envoi impossible. Réessayez.";
    btn.disabled = false;
  } catch (error) {
    msg.style.color = "#c62828";
    msg.textContent = "Connexion au service impossible. Réessayez.";
    btn.disabled = false;
  }
});

// ---------- Format d'état civil strict (étape 1) ----------
function tidy(v) { return v.replace(/\s+/g, " ").replace(/\s*,\s*/g, ", ").trim(); }
function capName(v) {
  return v.replace(/[\p{L}\p{M}]+/gu, w =>
    w.charAt(0).toLocaleUpperCase("fr") + w.slice(1).toLocaleLowerCase("fr"));
}
function formatIdentity() {
  const g = id => document.getElementById(id);
  g("nom_naissance").value = tidy(g("nom_naissance").value).toLocaleUpperCase("fr");
  g("prenom").value = capName(tidy(g("prenom").value));
  g("lieu_naissance").value = capName(tidy(g("lieu_naissance").value));
  g("nationalite").value = capName(tidy(g("nationalite").value));
}
function step1Error() {
  const v = id => tidy(document.getElementById(id).value);
  let e;
  if ((e = textError(v("nom_naissance"), "Nom de naissance", 3))) return ["nom_naissance", e];
  if ((e = textError(v("prenom"), "Prénom(s)", 3))) return ["prenom", e];
  const lieu = v("lieu_naissance");
  if (!/^[\p{L}\p{M}'’ .\-]+, [\p{L}\p{M}'’ .\-]+$/u.test(lieu))
    return ["lieu_naissance", "Lieu de naissance : format « Ville, Pays » obligatoire (ex. Lomé, Togo)."];
  const [ville, pays] = lieu.split(", ");
  if ((e = textError(ville, "Ville", 3))) return ["lieu_naissance", e];
  if ((e = textError(pays, "Pays", 3))) return ["lieu_naissance", e];
  if ((e = textError(v("nationalite"), "Nationalité", 4))) return ["nationalite", e];
  return null;
}
function dateError() {
  const d = document.getElementById("date_naissance");
  const birth = new Date(d.value), now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  if (isNaN(age) || age < 15 || age > 90)
    return ["date_naissance", "Date de naissance non plausible (15 à 90 ans)."];
  return null;
}

const step1Button = document.querySelector('.form-step[data-step="1"] .next-step');
const step1Hint = document.createElement("p");
step1Hint.className = "form-message";
step1Hint.setAttribute("role", "status");
step1Button.parentNode.insertBefore(step1Hint, step1Button);

function refreshStep1() {
  const ids = ["nom_naissance", "prenom", "date_naissance", "lieu_naissance", "nationalite"];
  const empty = ids.some(id => !document.getElementById(id).value.trim());
  const bad = empty ? null : (step1Error() || dateError());
  step1Button.disabled = empty || !!bad;
  step1Hint.textContent = empty ? "Complétez tous les champs pour continuer."
                        : bad ? bad[1] : "";
  step1Hint.style.color = "#c62828";
}

["nom_naissance", "prenom", "lieu_naissance", "nationalite"].forEach(id => {
  const f = document.getElementById(id);
  f.addEventListener("blur", () => { formatIdentity(); refreshStep1(); });
  f.addEventListener("input", refreshStep1);
});
document.getElementById("date_naissance").addEventListener("input", refreshStep1);
document.getElementById("date_naissance").addEventListener("change", refreshStep1);
refreshStep1();
