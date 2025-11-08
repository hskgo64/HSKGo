let filteredData = [];
let currentIndex = 0;
let stepMode = false;
let textRevealed = false;
let cardRevealed = false;
let affichageTexte = true; // false = image, true = hanZi

// Remplit la liste des niveaux au chargement
function remplirNiveaux() {
  const niveaux = [...new Set(data.map(item => item.niveau))].sort();
  document.getElementById("filtreNiveau").innerHTML =
    '<option value="">Tous</option>' +
    niveaux.map(n => `<option value="${n}">${n}</option>`).join("");
}

// Remplit la liste des leçons en fonction du niveau sélectionné
function remplirLecons(niveau) {
  let sousensemble = data;
  if (niveau) {
    sousensemble = data.filter(item => item.niveau == niveau);
  }
  const lecons = [...new Set(sousensemble.map(item => item.leçon))].sort((a,b)=>a.localeCompare(b, 'fr'));
  const sel = document.getElementById("filtreLecon");
  const leconChoisie = sel.value;
  sel.innerHTML =
    '<option value="">Toutes</option>' +
    lecons.map(l => `<option value="${l}">${l}</option>`).join("");
  // Si la sélection précédente existe encore dans la nouvelle liste, la remettre
  if (lecons.includes(leconChoisie)) sel.value = leconChoisie;
  else sel.value = "";
}

// Appelée quand le niveau change
function onNiveauChange() {
  const select = document.getElementById("filtreNiveau");
  const niveau = select.value;
  remplirLecons(niveau);
  appliquerFiltres();
  select.blur(); // Retire le focus pour fermer la liste
}


// Filtrage
function appliquerFiltres() {
  const niveau = document.getElementById("filtreNiveau").value;
  const lecon = document.getElementById("filtreLecon").value;
  const favorisSeulement = document.getElementById("filtreFavori").checked;

  filteredData = data.filter(item =>
    (niveau === "" || item.niveau == niveau) &&
    (lecon === "" || item.leçon == lecon) &&
    (!favorisSeulement || item.Favori === 1)
  );

  currentIndex = 0;
  textRevealed = !stepMode;
  updateSlide();
  select.blur(); // Retire le focus pour fermer la liste
}

function updateSlide() {
  if (filteredData.length === 0) {
    document.getElementById("slideImage").style.display = "none";
    document.getElementById("hanziDisplay").style.display = "none";
    document.getElementById("texteHan").textContent = "Aucune carte trouvée.";
    document.getElementById("texteFr").textContent = "";
    document.getElementById("favoriIcon").style.display = "none";
    return;
  }

  const entry = filteredData[currentIndex];
  const img = document.getElementById("slideImage");
  const hanzi = document.getElementById("hanziDisplay");
  const texteHan = document.getElementById("texteHan");
  const texteFr = document.getElementById("texteFr");

  // Affichage en 2 temps : carte
  if (cardRevealed) {
    hanzi.textContent = entry.hanZi;
    img.src = "images/" + entry.image;
    } else {
        hanzi.textContent = "？";
        img.src = "images/vide.jpg";
  }

  // Affichage principal : image ou Hanzi
  if (affichageTexte) {
    img.style.display = "none";
    hanzi.style.display = "flex";
    // hanzi.textContent = entry.hanZi;
  } else {
    hanzi.style.display = "none";
    img.style.display = "block";
    // img.src = "images/" + entry.image;
  }

  // Affichage en 2 temps : texteHan et texteFr
  if (textRevealed) {
    texteHan.textContent = entry.texteHan;
    texteFr.textContent = entry.texteFr;
  } else {
    texteHan.textContent = "";
    texteFr.textContent = "";
  }

  document.getElementById("leconDisplay").textContent = entry.leçon;


  // Favori
  const icon = document.getElementById("favoriIcon");
  icon.style.display = "inline";
  icon.textContent = entry.Favori === 1 ? "★" : "☆";
  icon.className = entry.Favori === 1 ? "favori" : "";
}

function nextSlide() {
  if (filteredData.length === 0) return;
  if (!stepMode) {
    currentIndex = (currentIndex + 1) % filteredData.length;
    textRevealed = true;
    cardRevealed = true;
    updateSlide();
  }
  if (stepMode && !textFirst) { 
    if (!textRevealed) {
      textRevealed = true;
      cardRevealed = true;
      updateSlide();
    } else {
        currentIndex = (currentIndex + 1) % filteredData.length;
        textRevealed = false;
        cardRevealed = true;
        updateSlide();
      }
    }
  if (stepMode && textFirst) { 
    if (!cardRevealed) {
      textRevealed = true;
      cardRevealed = true;
      updateSlide();
    } else {
        currentIndex = (currentIndex + 1) % filteredData.length;
        textRevealed = true;
        cardRevealed = false;
        updateSlide();
      }
  }
}

function prevSlide() {
  if (filteredData.length === 0) return;
  if (!stepMode) {
    currentIndex = (currentIndex - 1 + filteredData.length) % filteredData.length;
    textRevealed = true;
    cardRevealed = true;
    updateSlide();
  }
  if (stepMode && !textFirst) { 
    if (!textRevealed) {
      textRevealed = true;
      cardRevealed = true;
      updateSlide();
    } else {
        currentIndex = (currentIndex - 1 + filteredData.length) % filteredData.length;
        textRevealed = false;
        cardRevealed = true;
        updateSlide();
      }
    }
  if (stepMode && textFirst) { 
    if (!cardRevealed) {
      textRevealed = true;
      cardRevealed = true;
      updateSlide();
    } else {
        currentIndex = (currentIndex - 1 + filteredData.length) % filteredData.length;
        textRevealed = true;
        cardRevealed = false;
        updateSlide();
      }
  }
}

function randomSlide() {
  if (filteredData.length <= 1) return;
  if (!stepMode) {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * filteredData.length);
    } while (randomIndex === currentIndex && filteredData.length > 1);
    currentIndex = randomIndex;
    textRevealed = true;
    cardRevealed = true;
    updateSlide();
  }
  if (stepMode && !textFirst) { 
    if (!textRevealed) {
      textRevealed = true;
      cardRevealed = true;
      updateSlide();
    } else {
        let randomIndex;
        do {
           randomIndex = Math.floor(Math.random() * filteredData.length);
        } while (randomIndex === currentIndex && filteredData.length > 1);
        currentIndex = randomIndex;
        textRevealed = false;
        cardRevealed = true;
        updateSlide();
      }
    }
  if (stepMode && textFirst) { 
    if (!cardRevealed) {
      textRevealed = true;
      cardRevealed = true;
      updateSlide();
    } else {
        let randomIndex;
        do {
           randomIndex = Math.floor(Math.random() * filteredData.length);
        } while (randomIndex === currentIndex && filteredData.length > 1);
        currentIndex = randomIndex;
        textRevealed = true;
        cardRevealed = false;
        updateSlide();
      }
  }
}

function onStepModeChange() {
  stepMode = document.getElementById("stepMode").checked;

// Réinitialise stepDisplay si stepMode est désactivé
  if (!stepMode) {
    document.getElementById("textFirst").checked = false;
      if (textFirst) {
        onTextFirstChange()
      }
    }
// Active ou désactive le switch textFirst
  document.getElementById("textFirst").disabled = !stepMode;

  if (!stepMode) {
    textRevealed = true;
    cardRevealed = true;
  }
  if (stepMode && !textFirst) {
    textRevealed = false;
    cardRevealed = true;
  }
  if (stepMode && textFirst) {
    textRevealed = true;
    cardRevealed = false;
  }
  updateSlide();  
}

function onTextFirstChange() {
  textFirst = document.getElementById("textFirst").checked;
  if (!onTextFirstChange) {
    textRevealed = true;
    cardRevealed = false;
    } else {
      textRevealed = true;
      cardRevealed = false;
  }  
  updateSlide();
}

function toggleFavori() {
  if (filteredData.length === 0) return;
  const entry = filteredData[currentIndex];
  entry.Favori = entry.Favori === 1 ? 0 : 1;

  // Sauvegarde dans localStorage
  saveFavoris();

  updateSlide();
}


function saveFavoris() {
  const favorisMap = {};
  data.forEach(item => {
    favorisMap[item.image] = item.Favori;
  });
  localStorage.setItem("favorisMap", JSON.stringify(favorisMap));
}

function loadFavoris() {
  const favorisMap = JSON.parse(localStorage.getItem("favorisMap") || "{}");
  data.forEach(item => {
    if (favorisMap.hasOwnProperty(item.image)) {
      item.Favori = favorisMap[item.image];
    }
  });
}

function toggleAffichage() {
  affichageTexte = !affichageTexte;
  updateSlide();
}

window.onload = function() {
  loadFavoris();
  remplirNiveaux();
  remplirLecons(""); // Au début, toutes les leçons de tous niveaux

  // Initialisation des modes
  stepMode = false;
  textFirst = false;
  document.getElementById("textFirst").disabled = true;
  textRevealed = true;
  cardRevealed = true;
  affichageTexte = true; // ✅ Hanzi affiché par défaut

  appliquerFiltres(); // met à jour filteredData
  updateSlide();      // affiche la première carte

  // Fermeture automatique des filtres après sélection
  document.getElementById("filtreNiveau").addEventListener("change", function () {
    onNiveauChange();
    this.blur();
  });

  document.getElementById("filtreLecon").addEventListener("change", function () {
    appliquerFiltres();
    this.blur();
  });
};
// Enregistrement du service worker pour PWA
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js")
      .then(reg => console.log("✅ Service Worker enregistré :", reg.scope))
      .catch(err => console.error("❌ Erreur Service Worker :", err));
  });
}


