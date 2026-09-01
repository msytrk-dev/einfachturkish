document.addEventListener('DOMContentLoaded', () => {
  initAudienceSwitcher();
  initLanguageSwitcher();
  initNavbar();
  initSmoothScroll();
  initFaqAccordion();
  initVocabTrainer();
  initPricingToggle();
  initContactForm();
  initCourseModal();
  initTrialModal();
  initNewsletterForm();
  initScrollAnimations();
});

/* ==========================================
   0. Audience Switcher (Erwachsene ↔ Kinder / Yetişkinler ↔ Çocuklar)
   ========================================== */
let currentAudienceMode = localStorage.getItem('audience_mode') || 'adults';

function initAudienceSwitcher() {
  function applyAudienceMode(mode) {
    currentAudienceMode = mode;
    localStorage.setItem('audience_mode', mode);

    if (mode === 'kids') {
      document.body.classList.add('kids-mode');
    } else {
      document.body.classList.remove('kids-mode');
    }

    // Update active button styles for all buttons (desktop & mobile)
    const audienceBtns = document.querySelectorAll('.audience-mode-btn');
    audienceBtns.forEach(btn => {
      const btnMode = btn.getAttribute('data-mode');
      if (btnMode === mode) {
        btn.classList.add('bg-gradient-to-r', 'from-cyan-500', 'to-blue-600', 'text-white', 'shadow-md');
        btn.classList.remove('text-slate-400', 'hover:text-white');
      } else {
        btn.classList.remove('bg-gradient-to-r', 'from-cyan-500', 'to-blue-600', 'text-white', 'shadow-md');
        btn.classList.add('text-slate-400', 'hover:text-white');
      }
    });

    // Swap Hero & Showcase Visual Images
    const heroImg = document.getElementById('heroImg');
    const tutorImg = document.getElementById('tutorImg');
    if (heroImg) {
      heroImg.src = mode === 'kids' ? 'assets/images/hero_kids_explorer.png' : 'assets/images/hero_turkish_app.png';
    }
    if (tutorImg) {
      tutorImg.src = mode === 'kids' ? 'assets/images/kids_tutor_session.png' : 'assets/images/tutor_session.png';
    }

    // Update Floating Mascot Badge in Hero Scene (Only shown in Kids Mode)
    const heroFloatingBadge = document.querySelector('.hero-floating-badge');
    if (heroFloatingBadge) {
      if (mode === 'kids') {
        heroFloatingBadge.classList.remove('hidden');
        heroFloatingBadge.style.display = 'flex';
        heroFloatingBadge.innerHTML = `
          <img src="assets/images/kids_mascot_avatar.png" class="w-9 h-9 rounded-full border border-amber-400/60 shadow-md">
          <div>
            <div class="text-[10px] uppercase tracking-wider text-amber-300 font-bold font-heading">Türkçe Kaşifi</div>
            <div class="text-xs font-extrabold text-white">Eğlenceli Keşif Saatleri!</div>
          </div>
        `;
      } else {
        heroFloatingBadge.classList.add('hidden');
        heroFloatingBadge.style.display = 'none';
      }
    }

    // Swap Course Packages HTML
    renderCoursePackages(mode);

    // Re-render Vocab Trainer with appropriate dataset
    if (typeof updateVocabCard === 'function') {
      updateVocabCard(0);
    }
  }

  // Event Delegation for Audience Mode Buttons (works on all clicks, child elements, mobile & desktop)
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.audience-mode-btn');
    if (btn) {
      e.preventDefault();
      const targetMode = btn.getAttribute('data-mode');
      if (targetMode && targetMode !== currentAudienceMode) {
        applyAudienceMode(targetMode);
        const currentLang = localStorage.getItem('site_lang') || 'de';
        const msg = targetMode === 'kids'
          ? (currentLang === 'tr' ? '🎈 Çocuklar Modu Aktif!' : '🎈 Kinder-Modus Aktiv!')
          : (currentLang === 'tr' ? '👨‍💼 Yetişkinler Modu Aktif!' : '👨‍💼 Erwachsenen-Modus Aktiv!');
        showToast(msg, 'info');
      }
    }
  });

  applyAudienceMode(currentAudienceMode);
}

/* ==========================================
   0. Language Switcher (DE ↔ TR)
   ========================================== */
let currentLanguage = localStorage.getItem('site_lang') || 'de';

function initLanguageSwitcher() {
  function applyLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('site_lang', lang);

    const langToggleBtns = document.querySelectorAll('.lang-toggle-btn');
    langToggleBtns.forEach(btn => {
      const flagEl = btn.querySelector('.lang-flag');
      const labelEl = btn.querySelector('.lang-label');
      if (lang === 'tr') {
        if (flagEl) flagEl.textContent = '🇹🇷';
        if (labelEl) labelEl.textContent = 'TR';
        btn.setAttribute('title', 'Almanca\'ya Geç (DE)');
      } else {
        if (flagEl) flagEl.textContent = '🇩🇪';
        if (labelEl) labelEl.textContent = 'DE';
        btn.setAttribute('title', 'Türkçe\'ye Geç (TR)');
      }
    });

    const translatableElements = document.querySelectorAll('[data-de][data-tr]');
    translatableElements.forEach(el => {
      const translation = el.getAttribute(`data-${lang}`);
      if (translation) {
        el.innerHTML = translation;
      }
    });

    // Re-render course packages with updated language
    if (typeof renderCoursePackages === 'function') {
      renderCoursePackages(currentAudienceMode);
    }
  }

  // Event Delegation for Language Toggle Buttons
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.lang-toggle-btn');
    if (btn) {
      e.preventDefault();
      const nextLang = currentLanguage === 'de' ? 'tr' : 'de';
      applyLanguage(nextLang);
      showToast(nextLang === 'tr' ? 'Dil Türkçe olarak değiştirildi 🇹🇷' : 'Sprache auf Deutsch eingestellt 🇩🇪', 'info');
    }
  });

  applyLanguage(currentLanguage);
}

/* ==========================================
   1. Smooth Scroll for Anchor Links (#section)
   ========================================== */
function initSmoothScroll() {
  document.addEventListener('click', (e) => {
    if (e.target.closest('.open-trial-modal') || e.target.closest('.open-course-modal')) {
      return;
    }
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;

    const targetId = anchor.getAttribute('href');
    if (!targetId || targetId === '#') return;

    const targetEl = document.querySelector(targetId);
    if (targetEl) {
      e.preventDefault();
      const headerOffset = 80;
      const elementPosition = targetEl.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // Close mobile drawer if open
      const mobileMenu = document.getElementById('mobileMenu');
      const mobileBtn = document.getElementById('mobileMenuBtn');
      if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
        if (mobileBtn) {
          mobileBtn.innerHTML = '<i class="fas fa-bars text-xl text-slate-200"></i>';
        }
      }
    }
  });
}

/* ==========================================
   1. Navbar & Mobile Menu Logic
   ========================================== */
function initNavbar() {
  const header = document.getElementById('mainHeader');
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  // Header scroll shadow effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header?.classList.add('shadow-xl', 'border-slate-800', 'bg-slate-950/95');
      header?.classList.remove('bg-slate-950/80');
    } else {
      header?.classList.remove('shadow-xl', 'border-slate-800', 'bg-slate-950/95');
      header?.classList.add('bg-slate-950/80');
    }
  });

  // Mobile menu toggle
  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => {
      const isOpen = !mobileMenu.classList.contains('hidden');
      if (isOpen) {
        mobileMenu.classList.add('hidden');
        mobileBtn.innerHTML = '<i class="fas fa-bars text-xl text-slate-200"></i>';
      } else {
        mobileMenu.classList.remove('hidden');
        mobileBtn.innerHTML = '<i class="fas fa-times text-xl text-slate-200"></i>';
      }
    });

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        mobileBtn.innerHTML = '<i class="fas fa-bars text-xl text-slate-200"></i>';
      });
    });
  }
}

/* ==========================================
   2. FAQ Accordion Logic
   ========================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    header?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close other accordions
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });

      // Toggle current item
      if (isActive) {
        item.classList.remove('active');
      } else {
        item.classList.add('active');
      }
    });
  });
}

/* ==========================================
   3. Vocabulary Flashcard & Audio Trainer
   ========================================== */
const vocabData = [
  {
    de: "Guten Tag / Hallo",
    tr: "Merhaba / İyi günler",
    phonetic: "[mer-ha-ba / i-yi gyün-ler]",
    category: "Begrüßung",
    context: "Der wichtigste Gruß im Alltag – morgens und nachmittags nutzbar."
  },
  {
    de: "Wie geht es dir?",
    tr: "Nasılsın?",
    phonetic: "[na-syl-syn]",
    category: "Smalltalk",
    context: "Antwort: 'İyiyim, teşekkürler' (Mir geht es gut, danke!)."
  },
  {
    de: "Vielen Dank",
    tr: "Teşekkür ederim",
    phonetic: "[te-shek-kyür e-de-rim]",
    category: "Höflichkeit",
    context: "Oder kurz: 'Sağol' [sa-ol] unter Freunden."
  },
  {
    de: "Gern geschehen / Bitte",
    tr: "Rica ederim",
    phonetic: "[ri-dja e-de-rim]",
    category: "Höflichkeit",
    context: "Höfliche Antwort auf 'Teşekkür ederim'."
  },
  {
    de: "Herzlich willkommen!",
    tr: "Hoş geldiniz!",
    phonetic: "[hosh gel-di-niz]",
    category: "Begrüßung",
    context: "Antwort darauf: 'Hoş bulduk' [hosh bul-duk]."
  },
  {
    de: "Auf Wiedersehen",
    tr: "Görüşürüz / Hoşça kalın",
    phonetic: "[gyö-ryü-shyü-ryüz / hosh-tscha ka-lyn]",
    category: "Begrüßung",
    context: "'Görüşürüz' heißt wörtlich: Wir sehen uns bald!"
  },
  {
    de: "Wie heißt du?",
    tr: "Adın ne?",
    phonetic: "[a-dyn ne]",
    category: "Smalltalk",
    context: "Formell: 'Adınız nedir?' [a-dy-nyz ne-dir]."
  },
  {
    de: "Freut mich, dich kennenzulernen",
    tr: "Memnun oldum",
    phonetic: "[mem-nun ol-dum]",
    category: "Smalltalk",
    context: "Sagt man nach dem gegenseitigen Vorstellen."
  },
  {
    de: "Ein Glas Tee, bitte",
    tr: "Bir çay, lütfen",
    phonetic: "[bir tschai, lyt-fen]",
    category: "Restaurant & Café",
    context: "Türkischer Tee (Çay) gehört in der Türkei einfach dazu!"
  },
  {
    de: "Die Rechnung, bitte!",
    tr: "Hesap, lütfen!",
    phonetic: "[he-sap, lyt-fen]",
    category: "Restaurant & Café",
    context: "Essentiell für jeden Restaurantbesuch."
  },
  {
    de: "Guten Appetit",
    tr: "Afiyet olsun",
    phonetic: "[a-fi-yet ol-sun]",
    category: "Kultur & Essen",
    context: "Wird vor oder nach dem Essen wünschend gesagt."
  },
  {
    de: "Es war sehr lecker!",
    tr: "Elinize sağlık!",
    phonetic: "[e-li-ni-ze sa-lyk]",
    category: "Kultur & Essen",
    context: "Bedankt sich bei dem Koch/der Köchin für das leckere Essen."
  },
  {
    de: "Wie viel kostet das?",
    tr: "Bu ne kadar?",
    phonetic: "[bu ne ka-dar]",
    category: "Einkaufen",
    context: "Essentiell für jeden Basar- und Marktbesuch."
  },
  {
    de: "Gibt es einen Rabatt?",
    tr: "İndirim var mı?",
    phonetic: "[in-di-rim var my]",
    category: "Einkaufen",
    context: "Der Klassiker beim Verhandeln auf dem Basar."
  },
  {
    de: "Kann ich mit Karte zahlen?",
    tr: "Kredi kartı geçiyor mu?",
    phonetic: "[kre-di kar-ty ge-tschi-yor mu]",
    category: "Einkaufen",
    context: "Sehr nützlich in Geschäften und Taxis."
  },
  {
    de: "Wo ist der Basar?",
    tr: "Pazar nerede?",
    phonetic: "[pa-zar ne-re-de]",
    category: "Reisen & Orientierung",
    context: "Sehr nützlich beim Sightseeing in Istanbul oder Antalya."
  },
  {
    de: "Wo ist das Hotel?",
    tr: "Otel nerede?",
    phonetic: "[o-tel ne-re-de]",
    category: "Reisen & Orientierung",
    context: "Wichtig für die Orientierung im Urlaub."
  },
  {
    de: "Wie viel Uhr ist es?",
    tr: "Saat kaç?",
    phonetic: "[sa-at katsch]",
    category: "Reisen & Orientierung",
    context: "Frage nach der aktuellen Uhrzeit."
  },
  {
    de: "Ich verstehe nicht",
    tr: "Anlamadım",
    phonetic: "[an-la-ma-dym]",
    category: "Hilfreich im Alltag",
    context: "Sehr hilfreich, wenn jemand zu schnell Türkisch spricht."
  },
  {
    de: "Sprechen Sie bitte etwas langsamer",
    tr: "Lütfen daha yavaş konuşun",
    phonetic: "[lyt-fen da-ha ya-vash ko-nu-shun]",
    category: "Hilfreich im Alltag",
    context: "Sofortige Rettung bei schnellem Sprachtempo."
  },
  {
    de: "Können Sie mir helfen?",
    tr: "Bana yardım edebilir misiniz?",
    phonetic: "[ba-na yar-dym e-de-bi-lir mi-si-ni-z]",
    category: "Hilfreich im Alltag",
    context: "Höfliche Bitte um Unterstützung."
  },
  {
    de: "Kein Problem / Macht nichts",
    tr: "Sorun değil / Önemli değil",
    phonetic: "[so-run de-yil / ö-nem-li de-yil]",
    category: "Hilfreich im Alltag",
    context: "Lockere Entwarnung im Gespräch."
  },
  {
    de: "Alles ist super!",
    tr: "Her şey çok güzel!",
    phonetic: "[her shey tschok gyü-zel]",
    category: "Smalltalk",
    context: "Ausdruck von Begeisterung und Zufriedenheit."
  },
  {
    de: "Gute Reise!",
    tr: "İyi yolculuklar!",
    phonetic: "[i-yi yol-dju-luk-lar]",
    category: "Höflichkeit",
    context: "Wünscht man jemandem vor der Abreise."
  },
  {
    de: "Guten Morgen!",
    tr: "Günaydın!",
    phonetic: "[gyü-nai-dyn]",
    category: "Begrüßung",
    context: "Der klassische Gruß am Morgen bis mittags."
  },
  {
    de: "Gute Nacht!",
    tr: "İyi geceler!",
    phonetic: "[i-yi ge-dje-ler]",
    category: "Begrüßung",
    context: "Verabschiedung am späten Abend oder vor dem Schlafen."
  },
  {
    de: "Herzlichen Glückwunsch!",
    tr: "Tebrik ederim!",
    phonetic: "[teb-rik e-de-rim]",
    category: "Höflichkeit",
    context: "Wird zum Erfolg oder Geburtstag gewünscht."
  },
  {
    de: "Gute Besserung!",
    tr: "Geçmiş olsun!",
    phonetic: "[getsch-mish ol-sun]",
    category: "Höflichkeit",
    context: "Sehr empathischer Wunsch bei Krankheit oder Missgeschick."
  },
  {
    de: "Ein Wasser, bitte!",
    tr: "Bir su, lütfen!",
    phonetic: "[bir su, lyt-fen]",
    category: "Restaurant & Café",
    context: "Unverzichtbar bei jedem Restaurant- und Cafébesuch."
  },
  {
    de: "Bis später!",
    tr: "Sonra görüşürüz!",
    phonetic: "[son-ra gyö-ryü-shyü-ryüz]",
    category: "Begrüßung",
    context: "Lockere Verabschiedung unter Freunden."
  },
  {
    de: "Schönen Tag noch!",
    tr: "İyi günler!",
    phonetic: "[i-yi gyün-ler]",
    category: "Höflichkeit",
    context: "Höflicher Wunsch beim Verlassen von Geschäften."
  }
];

const kidsVocabData = [
  {
    de: "Die Katze",
    tr: "Kedi 🐱",
    phonetic: "[ke-di]",
    category: "Tiere / Hayvanlar",
    context: "Unser kleiner schnurrender Freund."
  },
  {
    de: "Der Hund",
    tr: "Köpek 🐶",
    phonetic: "[kö-pek]",
    category: "Tiere / Hayvanlar",
    context: "Der treue Spielgefährte."
  },
  {
    de: "Der Apfel",
    tr: "Elma 🍎",
    phonetic: "[el-ma]",
    category: "Früchte / Meyveler",
    context: "Süß, knackig und sehr gesund!"
  },
  {
    de: "Die Sonne",
    tr: "Güneş ☀️",
    phonetic: "[gyü-nesh]",
    category: "Natur / Doğa",
    context: "Erwärmt den Tag am Himmel."
  },
  {
    de: "Lass uns spielen!",
    tr: "Hadi oynayalım! 🎮",
    phonetic: "[ha-di oi-na-ya-lym]",
    category: "Spiele & Spaß",
    context: "Einladung zum gemeinsamen Spiel mit Freunden."
  },
  {
    de: "Ich habe dich lieb!",
    tr: "Seni seviyorum ❤️",
    phonetic: "[se-ni se-vi-yo-rum]",
    category: "Gefühle / Duygular",
    context: "Wunderschöner Ausdruck von Zuneigung."
  },
  {
    de: "Die Schule",
    tr: "Okul 🏫",
    phonetic: "[o-kul]",
    category: "Lernen & Schule",
    context: "Der bunte Ort, an dem wir Neues lernen."
  },
  {
    de: "Mein/e Lehrer/in",
    tr: "Öğretmenim 👩‍🏫",
    phonetic: "[öğ-ret-me-nim]",
    category: "Lernen & Schule",
    context: "Unsere liebe Lehrkraft im Unterricht."
  },
  {
    de: "Der Vogel",
    tr: "Kuş 🐦",
    phonetic: "[kush]",
    category: "Tiere / Hayvanlar",
    context: "Fliegt frei am blauen Himmel."
  },
  {
    de: "Das Eis",
    tr: "Dondurma 🍦",
    phonetic: "[don-dur-ma]",
    category: "Leckereien",
    context: "Erfrischender Sommer-Genuss."
  },
  {
    de: "Danke, Lehrer/in!",
    tr: "Teşekkür ederim öğretmenim 🎓",
    phonetic: "[te-shek-kyür e-de-rim öğ-ret-me-nim]",
    category: "Höflichkeit",
    context: "Höflicher Dank im Kinderunterricht."
  },
  {
    de: "Der Stern",
    tr: "Yıldız 🌟",
    phonetic: "[nyl-dyz]",
    category: "Natur / Doğa",
    context: "Funkelt nachts am Himmelszelt."
  },
  {
    de: "Guten Morgen, mein Freund!",
    tr: "Günaydın arkadaşım! ☀️",
    phonetic: "[gyü-nai-dyn ar-ka-da-shym]",
    category: "Begrüßung",
    context: "Fröhlicher Morgen-Gruß unter Kindern."
  },
  {
    de: "Geschwister",
    tr: "Kardeş 👫",
    phonetic: "[kar-desh]",
    category: "Familie",
    context: "Bruder oder Schwester zu Hause."
  },
  {
    de: "Der Stift",
    tr: "Kalem ✏️",
    phonetic: "[ka-lem]",
    category: "Lernen & Schule",
    context: "Zum Malen und Schreiben schöner Bilder."
  },
  {
    de: "Die Erdbeere",
    tr: "Çilek 🍓",
    phonetic: "[tschi-lek]",
    category: "Früchte / Meyveler",
    context: "Süße rote Sommerfrucht."
  },
  {
    de: "Der Schmetterling",
    tr: "Kelebek 🦋",
    phonetic: "[ke-le-bek]",
    category: "Tiere / Hayvanlar",
    context: "Fliegt bunt von Blume zu Blume."
  },
  {
    de: "Der Ball",
    tr: "Top ⚽",
    phonetic: "[top]",
    category: "Spiele & Spaß",
    context: "Zum Kicken im Garten."
  },
  {
    de: "Guten Abend!",
    tr: "İyi akşamlar! 🌙",
    phonetic: "[i-yi ak-sham-lar]",
    category: "Begrüßung",
    context: "Herzlicher Gruß am Abend."
  },
  {
    de: "Die Blume",
    tr: "Çiçek 🌸",
    phonetic: "[tschi-tschek]",
    category: "Natur / Doğa",
    context: "Duftet schön im Garten."
  },
  {
    de: "Das Auto",
    tr: "Araba 🚗",
    phonetic: "[a-ra-ba]",
    category: "Spielsachen",
    context: "Buntes Spielzeugauto zum Sausen."
  },
  {
    de: "Die Milch",
    tr: "Süt 🥛",
    phonetic: "[syyt]",
    category: "Getränke",
    context: "Macht stark und gesund."
  },
  {
    de: "Das Buch",
    tr: "Kitap 📚",
    phonetic: "[ki-tap]",
    category: "Lernen & Schule",
    context: "Spannende Geschichten zum Lesen."
  },
  {
    de: "Die Schokolade",
    tr: "Çikolata 🍫",
    phonetic: "[tschi-ko-la-ta]",
    category: "Leckereien",
    context: "Köstliche süße Belohnung."
  },
  {
    de: "Der Fisch",
    tr: "Balık 🐠",
    phonetic: "[ba-lyk]",
    category: "Tiere / Hayvanlar",
    context: "Schwimmt fröhlich im blauen Wasser."
  },
  {
    de: "Der Bär",
    tr: "Ayı 🧸",
    phonetic: "[a-ny]",
    category: "Tiere / Hayvanlar",
    context: "Kuscheliger Plüschfreund im Bett."
  },
  {
    de: "Der Mond",
    tr: "Ay 🌙",
    phonetic: "[ai]",
    category: "Natur / Doğa",
    context: "Leuchtet nachts am Sternenhimmel."
  },
  {
    de: "Das Wasser",
    tr: "Su 💧",
    phonetic: "[su]",
    category: "Natur & Leben",
    context: "Erfrischend und gesund."
  },
  {
    de: "Willkommen!",
    tr: "Hoş geldin! 🥳",
    phonetic: "[hosh gel-din]",
    category: "Begrüßung",
    context: "Herzlicher Empfang für Freunde."
  },
  {
    de: "Bravo! / Super!",
    tr: "Aferin! 👏",
    phonetic: "[a-fe-rin]",
    category: "Lob & Freude",
    context: "Wird für tolle Leistungen gesagt."
  },
  {
    de: "Gute Reise!",
    tr: "İyi yolculuklar! 🚀",
    phonetic: "[i-yi yol-dju-luk-lar]",
    category: "Höflichkeit",
    context: "Für spannende Entdeckungsreisen."
  }
];

// Automatically select a daily featured word based on the Day of the Year (updates every night at 00:00)
const getDayOfYear = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
};

let currentVocabIndex = 0;

function updateVocabCard(index) {
  const flashcard = document.getElementById('vocabFlashcard');
  const deText = document.getElementById('vocabDeText');
  const trText = document.getElementById('vocabTrText');
  const phoneticText = document.getElementById('vocabPhonetic');
  const categoryBadge = document.getElementById('vocabCategory');
  const contextText = document.getElementById('vocabContext');
  const counterText = document.getElementById('vocabCounter');

  if (!flashcard) return;

  const dataset = currentAudienceMode === 'kids' ? kidsVocabData : vocabData;
  const dayOfYear = getDayOfYear();
  const dailyOffset = dayOfYear % dataset.length;

  const safeIndex = index % dataset.length;
  currentVocabIndex = safeIndex < 0 ? safeIndex + dataset.length : safeIndex;
  
  const finalCardIndex = (currentVocabIndex + dailyOffset) % dataset.length;
  const data = dataset[finalCardIndex];

  // Reset flip state
  const inner = flashcard.querySelector('.flashcard-inner');
  inner?.classList.remove('is-flipped');

  // Update text content
  if (deText) deText.textContent = data.de;
  if (trText) trText.textContent = data.tr;
  if (phoneticText) phoneticText.textContent = data.phonetic;
  if (categoryBadge) categoryBadge.textContent = data.category;
  if (contextText) contextText.textContent = data.context;
  if (counterText) counterText.textContent = `${finalCardIndex + 1} / ${dataset.length}`;
}

function renderCoursePackages(mode) {
  const container = document.getElementById('coursePackagesGrid');
  if (!container) return;

  const lang = localStorage.getItem('site_lang') || 'de';

  if (mode === 'kids') {
    container.innerHTML = `
      <!-- Kids Package 1: Mini -->
      <div class="glass-panel rounded-3xl p-8 border border-rose-500/30 flex flex-col justify-between relative hover:border-rose-400 transition-all">
        <div>
          <div class="text-xs font-extrabold uppercase tracking-wider text-rose-400 mb-2">${lang === 'tr' ? '6-9 Yaş Grubu' : 'Altersgruppe 6-9'}</div>
          <h3 class="text-2xl font-bold text-white font-heading">${lang === 'tr' ? 'Türkçe Kaşifleri (Mini)' : 'Türkisch-Entdecker (Mini)'}</h3>
          <p class="text-slate-300 text-xs mt-1">${lang === 'tr' ? 'Çizgi karakterler, eğlenceli şarkılar ve görsel kelime oyunları.' : 'Zeichentrickfiguren, fröhliche Lieder und visuelle Wortspiele.'}</p>
          <div class="my-6">
            <div class="flex items-baseline gap-1">
              <span class="text-4xl font-extrabold text-white font-heading">€19</span>
              <span class="text-slate-400 text-xs">${lang === 'tr' ? '/Ay (yıllık ödeme)' : '/Monat (jährlich)'}</span>
            </div>
          </div>
          <ul class="space-y-3.5 text-sm text-slate-300 border-t border-slate-800 pt-6">
            <li class="flex items-center gap-3"><i class="fas fa-check text-rose-400"></i> ${lang === 'tr' ? 'Interaktif Çizgi İllüstrasyonlar' : 'Interaktive Zeichnungen'}</li>
            <li class="flex items-center gap-3"><i class="fas fa-check text-rose-400"></i> ${lang === 'tr' ? 'Sesli Harf & Kelime Oyunları' : 'Laut- & Wortspiele mit Audio'}</li>
            <li class="flex items-center gap-3"><i class="fas fa-check text-rose-400"></i> ${lang === 'tr' ? 'Haftalık Eğlenceli Ödev Kartları' : 'Wöchentliche Lernkarten'}</li>
          </ul>
        </div>
        <div class="pt-8">
          <button class="open-course-modal w-full py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 transition-all" data-package="kids-mini">
            ${lang === 'tr' ? '🎈 Kaşif Ol (Mini)' : '🎈 Entdecker werden (Mini)'}
          </button>
        </div>
      </div>

      <!-- Kids Package 2: Pro (Featured) -->
      <div class="glass-panel rounded-3xl p-8 border-2 border-amber-500/80 bg-gradient-to-b from-slate-900 to-purple-950/80 flex flex-col justify-between relative shadow-2xl transform lg:-translate-y-2">
        <div class="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white text-xs font-extrabold uppercase tracking-wider shadow-lg">
          ★ ${lang === 'tr' ? 'En Çok Tercih Edilen' : 'Beliebtestes Paket'}
        </div>
        <div>
          <div class="text-xs font-extrabold uppercase tracking-wider text-amber-400 mb-2">${lang === 'tr' ? '10-14 Yaş Grubu' : 'Altersgruppe 10-14'}</div>
          <h3 class="text-2xl font-bold text-white font-heading">${lang === 'tr' ? 'Türkçe Kaşifleri (Pro)' : 'Türkisch-Entdecker (Pro)'}</h3>
          <p class="text-slate-300 text-xs mt-1">${lang === 'tr' ? 'İnteraktif grup oyunları, hikaye anlatımı ve okul destek dersleri.' : 'Interaktive Gruppenspiele, Storytelling und Schulunterstützung.'}</p>
          <div class="my-6">
            <div class="flex items-baseline gap-1">
              <span class="text-5xl font-extrabold text-white font-heading">€35</span>
              <span class="text-slate-400 text-xs">${lang === 'tr' ? '/Ay (yıllık ödeme)' : '/Monat (jährlich)'}</span>
            </div>
          </div>
          <ul class="space-y-3.5 text-sm text-slate-300 border-t border-slate-800 pt-6">
            <li class="flex items-center gap-3"><i class="fas fa-check text-amber-400"></i> ${lang === 'tr' ? 'Haftalık Canlı Çocuk Grup Dersi (Min. 2 Kişi)' : 'Wöchentlicher Kinder-Live-Unterricht'}</li>
            <li class="flex items-center gap-3"><i class="fas fa-check text-amber-400"></i> ${lang === 'tr' ? 'İnteraktif Türkçe Masallar & Kulüpler' : 'Interaktive Märchen & Clubs'}</li>
            <li class="flex items-center gap-3"><i class="fas fa-check text-amber-400"></i> ${lang === 'tr' ? 'Rozet, Ödül ve Başarı Sertifikası' : 'Abzeichen, Belohnungen & Zertifikat'}</li>
          </ul>
        </div>
        <div class="pt-8">
          <button class="open-course-modal w-full py-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:scale-[1.02] transition-all" data-package="kids-pro">
            <i class="fas fa-star mr-2"></i> ${lang === 'tr' ? '🌟 Pro Kaşif Ol' : '🌟 Pro-Entdecker werden'}
          </button>
        </div>
      </div>

      <!-- Kids Package 3: Birebir Koçluk -->
      <div class="glass-panel rounded-3xl p-8 border border-purple-500/30 flex flex-col justify-between relative hover:border-purple-400 transition-all">
        <div>
          <div class="text-xs font-extrabold uppercase tracking-wider text-purple-400 mb-2">${lang === 'tr' ? 'Birebir Özel İlgi' : '1-zu-1 Betreuung'}</div>
          <h3 class="text-2xl font-bold text-white font-heading">${lang === 'tr' ? 'Birebir Çocuk Koçluğu' : 'Kinder VIP Coaching'}</h3>
          <p class="text-slate-300 text-xs mt-1">${lang === 'tr' ? 'Çocuğunuzun öğrenme hızına özel hazırlanmış birebir canlı dersler.' : 'Individueller Einzelunterricht im Lerntempo Ihres Kindes.'}</p>
          <div class="my-6">
            <div class="flex items-baseline gap-1">
              <span class="text-4xl font-extrabold text-white font-heading">€69</span>
              <span class="text-slate-400 text-xs">${lang === 'tr' ? '/Ay (yıllık ödeme)' : '/Monat (jährlich)'}</span>
            </div>
          </div>
          <ul class="space-y-3.5 text-sm text-slate-300 border-t border-slate-800 pt-6">
            <li class="flex items-center gap-3"><i class="fas fa-check text-purple-400"></i> ${lang === 'tr' ? 'Ayda 4x Birebir Canlı Çocuk Dersi' : '4x Einzelunterricht im Monat'}</li>
            <li class="flex items-center gap-3"><i class="fas fa-check text-purple-400"></i> ${lang === 'tr' ? 'Okul & Ödev Destek Rehberliği' : 'Schul- & Hausaufgabenhilfe'}</li>
            <li class="flex items-center gap-3"><i class="fas fa-check text-purple-400"></i> ${lang === 'tr' ? 'Veli Gelişim Raporu & Özel Takip' : 'Entwicklungsberichte für Eltern'}</li>
          </ul>
        </div>
        <div class="pt-8">
          <button class="open-course-modal w-full py-3.5 rounded-xl font-bold text-sm text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/40 transition-all" data-package="kids-vip">
            ${lang === 'tr' ? 'Özel Koçluk Al' : 'VIP Coaching buchen'}
          </button>
        </div>
      </div>
    `;
  } else {
    // Adults Package HTML
    container.innerHTML = `
      <!-- Package 1: Bireysel Dersler -->
      <div class="glass-panel rounded-3xl p-8 border border-slate-800 flex flex-col justify-between relative hover:border-slate-700 transition-all">
        <div>
          <div class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">${lang === 'tr' ? 'Bireysel Dersler' : 'Einzelunterricht'}</div>
          <h3 class="text-2xl font-bold text-white font-heading">${lang === 'tr' ? 'Bireysel Kurs Paketleri' : 'Einzelkurs Paket'}</h3>
          <p class="text-slate-300 text-xs mt-1">${lang === 'tr' ? 'Günlük konuşma, A1-C1 kur dersleri ve İş Türkçesi bireysel eğitimi.' : 'Alltagsgespräche, A1-C1 Kurse & Business-Türkisch im Einzelunterricht.'}</p>
          <div class="my-6">
            <div class="flex items-baseline gap-1">
              <span class="text-4xl font-extrabold text-white font-heading">€15</span>
              <span class="text-slate-400 text-xs price-cycle-label">${lang === 'tr' ? '/Ay (yıllık ödeme)' : '/Monat (jährlich abgerechnet)'}</span>
            </div>
          </div>
          <ul class="space-y-3.5 text-sm text-slate-300 border-t border-slate-800 pt-6">
            <li class="flex items-center gap-3"><i class="fas fa-check text-cyan-400"></i> ${lang === 'tr' ? '🗣️ Günlük Konuşma Paketleri' : '🗣️ Alltagsgespräche Module'}</li>
            <li class="flex items-center gap-3"><i class="fas fa-check text-cyan-400"></i> ${lang === 'tr' ? '📚 A1\'den C1\'e Kur Dersleri' : '📚 Kurse A1 bis C1 Level'}</li>
            <li class="flex items-center gap-3"><i class="fas fa-check text-cyan-400"></i> ${lang === 'tr' ? '✈️💼 Seyahat &amp; İş Türkçesi' : '✈️💼 Reise- &amp; Business-Türkisch'}</li>
            <li class="flex items-center gap-3"><i class="fas fa-check text-cyan-400"></i> ${lang === 'tr' ? 'PDF Çalışma Kitapları &amp; Alıştırmalar' : 'PDF Arbeitsbücher &amp; Übungen'}</li>
          </ul>
        </div>
        <div class="pt-8">
          <button class="open-course-modal w-full py-3.5 rounded-xl font-bold text-sm text-slate-200 bg-slate-800/90 hover:bg-slate-700 hover:text-white border border-slate-700 transition-all" data-package="basis">
            ${lang === 'tr' ? 'Bireysel Kursa Başla' : 'Einzelkurs buchen'}
          </button>
        </div>
      </div>

      <!-- Package 2: Grup Dersleri (Featured) -->
      <div class="glass-panel rounded-3xl p-8 border-2 border-cyan-500/80 bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950/80 flex flex-col justify-between relative shadow-2xl glow-cyan transform lg:-translate-y-2">
        <div class="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-extrabold uppercase tracking-wider shadow-lg">
          ★ ${lang === 'tr' ? 'En Popüler' : 'Am Beliebtesten'}
        </div>
        <div>
          <div class="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">${lang === 'tr' ? 'Interaktif Grup Eğitimi' : 'Gruppenunterricht'}</div>
          <h3 class="text-2xl font-bold text-white font-heading">${lang === 'tr' ? 'Grup Dersleri Paketi' : 'Gruppenkurs Paket'}</h3>
          <p class="text-slate-300 text-xs mt-1">${lang === 'tr' ? 'Min. 2 kişilik gruplarla A1-C1 dersleri ve canlı konuşma aktiviteleri.' : 'A1-C1 Kurse in Gruppen (Min. 2 Personen) & Aktivitäten.'}</p>
          <div class="my-6">
            <div class="flex items-baseline gap-1">
              <span class="text-5xl font-extrabold text-white font-heading">€29</span>
              <span class="text-slate-400 text-xs price-cycle-label">${lang === 'tr' ? '/Ay (yıllık ödeme)' : '/Monat (jährlich abgerechnet)'}</span>
            </div>
          </div>
          <ul class="space-y-3.5 text-sm text-slate-300 border-t border-slate-800 pt-6">
            <li class="flex items-center gap-3"><i class="fas fa-check text-cyan-400"></i> <strong>${lang === 'tr' ? '👥 Min. 2 Kişilik Butik Gruplar' : '👥 Min. 2 Personen Gruppen'}</strong></li>
            <li class="flex items-center gap-3"><i class="fas fa-check text-cyan-400"></i> ${lang === 'tr' ? '📊 A1\'den C1\'e Seviye Sınıfları' : '📊 Level A1 bis C1 Kurse'}</li>
            <li class="flex items-center gap-3"><i class="fas fa-check text-cyan-400"></i> ${lang === 'tr' ? '🎭 Etkileşimli Canlı Aktiviteler' : '🎭 Interaktive Live-Aktivitäten'}</li>
            <li class="flex items-center gap-3"><i class="fas fa-check text-cyan-400"></i> ${lang === 'tr' ? 'Offizielles B1/B2 Sertifikası' : 'Offizielles B1/B2 Sprachzertifikat'}</li>
          </ul>
        </div>
        <div class="pt-8">
          <button class="open-course-modal w-full py-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/30 transition-all transform hover:scale-[1.02]" data-package="pro">
            <i class="fas fa-bolt mr-2"></i> ${lang === 'tr' ? 'Hemen Grup Kursuna Başla' : 'Jetzt Gruppenkurs starten'}
          </button>
        </div>
      </div>

      <!-- Package 3: VIP Coaching -->
      <div class="glass-panel rounded-3xl p-8 border border-slate-800 flex flex-col justify-between relative hover:border-slate-700 transition-all">
        <div>
          <div class="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">${lang === 'tr' ? 'Maksimum Başarı' : 'Maximaler Erfolg'}</div>
          <h3 class="text-2xl font-bold text-white font-heading">${lang === 'tr' ? 'Intensiv VIP Coaching' : 'Intensiv VIP Coaching'}</h3>
          <p class="text-slate-300 text-xs mt-1">${lang === 'tr' ? 'Kişiye özel 1-a-1 canlı dersler ve 24/7 VIP öğretmen desteği.' : 'Individuelles 1-zu-1 Einzelcoaching & 24/7 WhatsApp Support.'}</p>
          <div class="my-6">
            <div class="flex items-baseline gap-1">
              <span class="text-4xl font-extrabold text-white font-heading">€63</span>
              <span class="text-slate-400 text-xs price-cycle-label">${lang === 'tr' ? '/Ay (yıllık ödeme)' : '/Monat (jährlich abgerechnet)'}</span>
            </div>
          </div>
          <ul class="space-y-3.5 text-sm text-slate-300 border-t border-slate-800 pt-6">
            <li class="flex items-center gap-3"><i class="fas fa-check text-amber-400"></i> <strong>${lang === 'tr' ? 'Grup &amp; Bireysel Ders Hakları' : 'Grup &amp; Einzelstunden'}</strong></li>
            <li class="flex items-center gap-3"><i class="fas fa-check text-amber-400"></i> ${lang === 'tr' ? '4x 1-zu-1 Özel Canlı Ders / Ay' : '4x 1-zu-1 Einzelunterricht / Monat'}</li>
            <li class="flex items-center gap-3"><i class="fas fa-check text-amber-400"></i> ${lang === 'tr' ? 'Kişiye Özel Ders Müfredatı' : 'Maßgeschneiderter Lernplan'}</li>
            <li class="flex items-center gap-3"><i class="fas fa-check text-amber-400"></i> ${lang === 'tr' ? '24/7 VIP Chat-Support via WhatsApp' : '24/7 VIP Chat-Support via WhatsApp'}</li>
          </ul>
        </div>
        <div class="pt-8">
          <button class="open-course-modal w-full py-3.5 rounded-xl font-bold text-sm text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 transition-all" data-package="vip">
            ${lang === 'tr' ? 'VIP Paket Talep Et' : 'VIP Paket anfordern'}
          </button>
        </div>
      </div>
    `;
  }

  // Re-attach modal trigger events to dynamic buttons
  document.querySelectorAll('.open-course-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const modal = document.getElementById('courseModal');
      if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.style.overflow = 'hidden';
      }
    });
  });
}

function initVocabTrainer() {
  const flashcard = document.getElementById('vocabFlashcard');
  const prevBtn = document.getElementById('vocabPrevBtn');
  const nextBtn = document.getElementById('vocabNextBtn');
  const flipBtn = document.getElementById('vocabFlipBtn');
  const audioBtnDe = document.getElementById('vocabAudioBtnDe');
  const audioBtnTr = document.getElementById('vocabAudioBtnTr') || document.getElementById('vocabAudioBtn');

  if (!flashcard) return;

  // Initial load
  updateVocabCard(currentVocabIndex);

  // Flip trigger
  const innerCard = flashcard.querySelector('.flashcard-inner');
  const flipAction = () => {
    const isFlippedNow = innerCard?.classList.toggle('is-flipped');
    const dataset = currentAudienceMode === 'kids' ? kidsVocabData : vocabData;
    const dayOfYear = getDayOfYear();
    const dailyOffset = dayOfYear % dataset.length;
    const finalCardIndex = (currentVocabIndex + dailyOffset) % dataset.length;
    const data = dataset[finalCardIndex];

    if (data) {
      if (isFlippedNow) {
        // Now showing Turkish back -> speak Turkish
        speakText(data.tr, 'tr-TR', audioBtnTr);
      } else {
        // Now showing German front -> speak German
        speakText(data.de, 'de-DE', audioBtnDe);
      }
    }
  };

  flashcard.addEventListener('click', (e) => {
    if (!e.target.closest('button')) {
      flipAction();
    }
  });

  flipBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    flipAction();
  });

  nextBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    updateVocabCard(currentVocabIndex + 1);
  });

  prevBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    updateVocabCard(currentVocabIndex - 1);
  });

  // German Audio Button (Front of Card)
  audioBtnDe?.addEventListener('click', (e) => {
    e.stopPropagation();
    const dataset = currentAudienceMode === 'kids' ? kidsVocabData : vocabData;
    const dayOfYear = getDayOfYear();
    const dailyOffset = dayOfYear % dataset.length;
    const finalCardIndex = (currentVocabIndex + dailyOffset) % dataset.length;
    const data = dataset[finalCardIndex];
    if (data && data.de) {
      speakText(data.de, 'de-DE', audioBtnDe);
    }
  });

  // Turkish Audio Button (Back of Card)
  audioBtnTr?.addEventListener('click', (e) => {
    e.stopPropagation();
    const dataset = currentAudienceMode === 'kids' ? kidsVocabData : vocabData;
    const dayOfYear = getDayOfYear();
    const dailyOffset = dayOfYear % dataset.length;
    const finalCardIndex = (currentVocabIndex + dailyOffset) % dataset.length;
    const data = dataset[finalCardIndex];
    if (data && data.tr) {
      speakText(data.tr, 'tr-TR', audioBtnTr);
    }
  });
}

function speakText(text, langCode = 'tr-TR', targetBtn = null) {
  if (!text) return;
  
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel(); // Stop any current speech
    
    // Clean emojis and extra bracketed notes from audio string
    const cleanAudioText = text.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '').trim();
    
    const utterance = new SpeechSynthesisUtterance(cleanAudioText || text);
    utterance.lang = langCode; // 'de-DE' for German, 'tr-TR' for Turkish
    utterance.rate = 0.9;
    
    // Visual sound indicator effect on button
    if (targetBtn) {
      targetBtn.classList.add('animate-bounce', 'text-amber-400');
      utterance.onend = () => {
        targetBtn.classList.remove('animate-bounce', 'text-amber-400');
      };
    }

    window.speechSynthesis.speak(utterance);
  } else {
    showToast('Audio-Wiedergabe in Ihrem Browser nicht unterstützt.', 'info');
  }
}

/* ==========================================
   4. Pricing Plan Billing Toggle
   ========================================== */
function initPricingToggle() {
  const billingToggle = document.getElementById('billingToggle');
  const priceBasis = document.getElementById('priceBasis');
  const pricePro = document.getElementById('pricePro');
  const priceVip = document.getElementById('priceVip');
  const cycleLabels = document.querySelectorAll('.price-cycle-label');

  if (!billingToggle) return;

  billingToggle.addEventListener('change', () => {
    const isYearly = billingToggle.checked;

    if (isYearly) {
      if (priceBasis) priceBasis.textContent = '15';
      if (pricePro) pricePro.textContent = '29';
      if (priceVip) priceVip.textContent = '63';

      cycleLabels.forEach(el => el.textContent = '/Monat (jährlich abgerechnet)');
    } else {
      if (priceBasis) priceBasis.textContent = '19';
      if (pricePro) pricePro.textContent = '39';
      if (priceVip) priceVip.textContent = '79';

      cycleLabels.forEach(el => el.textContent = '/Monat');
    }
  });
}

/* ==========================================
   5. Contact Form Handling
   ========================================== */
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  const formSuccessAlert = document.getElementById('contactSuccessAlert');

  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.innerHTML : '';
    const currentLang = localStorage.getItem('site_lang') || 'de';

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = currentLang === 'tr'
        ? '<i class="fas fa-spinner fa-spin mr-2"></i> Gönderiliyor...'
        : '<i class="fas fa-spinner fa-spin mr-2"></i> Wird gesendet...';
    }

    const nameVal = document.getElementById('contactName')?.value || '';
    const emailVal = document.getElementById('contactEmail')?.value || '';
    const levelVal = document.getElementById('contactLevel')?.value || '';
    const messageVal = document.getElementById('contactMessage')?.value || '';

    const formData = new FormData();
    if (currentLang === 'tr') {
      formData.append('_subject', `Einfach Türkisch - Yeni İletişim Mesajı (${nameVal})`);
      formData.append('Ad Soyad', nameVal);
      formData.append('E-Posta Adresi', emailVal);
      formData.append('Dil Seviyesi', levelVal);
      formData.append('Mesaj', messageVal);
    } else {
      formData.append('_subject', `Einfach Türkisch - Neue Kontaktanfrage (${nameVal})`);
      formData.append('Name', nameVal);
      formData.append('E-Mail', emailVal);
      formData.append('Sprachniveau', levelVal);
      formData.append('Nachricht', messageVal);
    }

    formData.append('_captcha', 'false');
    formData.append('_template', 'table');

    fetch('https://formsubmit.co/ajax/ecc69cdb9e0296433c45c040065bfa6e', {
      method: 'POST',
      headers: {
        'Accept': 'application/json'
      },
      body: formData
    })
    .then(res => res.json())
    .then(data => {
      contactForm.reset();
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }

      if (formSuccessAlert) {
        formSuccessAlert.classList.remove('hidden');
        setTimeout(() => {
          formSuccessAlert.classList.add('hidden');
        }, 6000);
      }

      const successMsg = currentLang === 'tr'
        ? 'Teşekkürler! Mesajınız info@einfachturkisch.de adresine başarıyla gönderildi.'
        : 'Vielen Dank! Ihre Nachricht wurde an info@einfachturkisch.de gesendet.';
      showToast(successMsg, 'success');
    })
    .catch(err => {
      console.error('FormSubmit primary failed, executing secondary fallback:', err);
      
      // Fallback submit directly using native form submission or secondary fetch
      fetch('https://formsubmit.co/ajax/info@einfachturkisch.de', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData
      });

      contactForm.reset();
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
      const successMsg = currentLang === 'tr'
        ? 'Teşekkürler! Mesajınız info@einfachturkisch.de adresine gönderildi.'
        : 'Vielen Dank! Ihre Nachricht wurde gesendet.';
      showToast(successMsg, 'success');
    });
  });
}

/* ==========================================
   6. Course Registration Modal Logic
   ========================================== */
function initCourseModal() {
  const modal = document.getElementById('courseModal');
  const modalCloseBtns = document.querySelectorAll('.close-modal-btn');
  const openModalBtns = document.querySelectorAll('.open-course-modal');
  const modalPackageSelect = document.getElementById('modalPackageSelect');
  const courseModalForm = document.getElementById('courseModalForm');

  if (!modal) return;

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const packageName = btn.getAttribute('data-package') || 'pro';
      
      if (modalPackageSelect) {
        modalPackageSelect.value = packageName;
      }

      modal.classList.remove('hidden');
      modal.classList.add('flex');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeModal = () => {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = 'auto';
  };

  modalCloseBtns.forEach(btn => {
    btn.addEventListener('click', closeModal);
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  courseModalForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = courseModalForm.querySelector('button[type="submit"]');
    const currentLang = localStorage.getItem('site_lang') || 'de';

    if (btn) {
      btn.disabled = true;
      btn.innerHTML = currentLang === 'tr'
        ? '<i class="fas fa-spinner fa-spin mr-2"></i> Başvuru Gönderiliyor...'
        : '<i class="fas fa-spinner fa-spin mr-2"></i> Anmeldung wird verarbeitet...';
    }

    const packageName = modalPackageSelect?.value || '';
    const nameVal = document.getElementById('modalName')?.value || '';
    const emailVal = document.getElementById('modalEmail')?.value || '';

    const formData = new FormData();
    if (currentLang === 'tr') {
      formData.append('_subject', `Einfach Türkisch - Yeni Kurs Başvurusu (${packageName.toUpperCase()})`);
      formData.append('Seçilen Paket', packageName);
      formData.append('Ad Soyad', nameVal);
      formData.append('E-Posta Adresi', emailVal);
    } else {
      formData.append('_subject', `Einfach Türkisch - Neue Kursanmeldung (${packageName.toUpperCase()})`);
      formData.append('Paket', packageName);
      formData.append('Name', nameVal);
      formData.append('E-Mail', emailVal);
    }
    formData.append('_captcha', 'false');

    fetch('https://formsubmit.co/ajax/ecc69cdb9e0296433c45c040065bfa6e', {
      method: 'POST',
      headers: {
        'Accept': 'application/json'
      },
      body: formData
    })
    .then(() => {
      closeModal();
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = currentLang === 'tr' ? 'Ücretsiz Dene' : 'Kostenfrei testen';
      }
      const msg = currentLang === 'tr'
        ? 'Tebrikler! Kurs kaydınız alındı. E-posta adresinizi kontrol edin.'
        : 'Hoş geldiniz! Ihre Registrierung war erfolgreich. Überprüfen Sie Ihr E-Mail-Postfach.';
      showToast(msg, 'success');
    })
    .catch(() => {
      closeModal();
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = currentLang === 'tr' ? 'Ücretsiz Dene' : 'Kostenfrei testen';
      }
      showToast('Başvurunuz iletildi!', 'success');
    });
  });
}

/* ==========================================
   7. Newsletter Subscription Form
   ========================================== */
function initNewsletterForm() {
  const form = document.getElementById('newsletterForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    const currentLang = localStorage.getItem('site_lang') || 'de';

    if (input && input.value) {
      const emailVal = input.value;
      const formData = new FormData();
      formData.append('_subject', 'Einfach Türkisch - Yeni Bülten Abonesi');
      formData.append('Bülten E-Posta', emailVal);
      formData.append('_captcha', 'false');

      fetch('https://formsubmit.co/ajax/ecc69cdb9e0296433c45c040065bfa6e', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData
      });

      const msg = currentLang === 'tr'
        ? 'Ücretsiz kelime bültenine kaydınız başarıyla gerçekleşti!'
        : 'Vielen Dank für Ihre Anmeldung zum Türkisch-Wortschatz-Newsletter!';
      showToast(msg, 'success');
      input.value = '';
    }
  });
}

/* ==========================================
   8. Scroll Animations & Scroll Spy
   ========================================== */
function initScrollAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('opacity-100', 'translate-y-0');
        entry.target.classList.remove('opacity-0', 'translate-y-8');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    el.classList.add('transition-all', 'duration-700', 'opacity-0', 'translate-y-8');
    observer.observe(el);
  });
}

/* ==========================================
   Toast Notification System
   ========================================== */
function showToast(message, type = 'success') {
  let toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toastContainer';
    toastContainer.className = 'fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md w-full px-4 pointer-events-none';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  const bgClass = type === 'success' ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-100' : 'bg-slate-900/90 border-cyan-500/50 text-slate-100';
  const icon = type === 'success' ? 'fa-circle-check text-emerald-400' : 'fa-circle-info text-cyan-400';

  toast.className = `pointer-events-auto flex items-center justify-between p-4 rounded-xl border ${bgClass} backdrop-blur-lg shadow-2xl transition-all duration-300 transform translate-y-4 opacity-0`;
  toast.innerHTML = `
    <div class="flex items-center gap-3">
      <i class="fas ${icon} text-xl"></i>
      <span class="text-sm font-medium leading-snug">${message}</span>
    </div>
    <button onclick="this.parentElement.remove()" class="text-slate-400 hover:text-white transition-colors ml-4">
      <i class="fas fa-times"></i>
    </button>
  `;

  toastContainer.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-4', 'opacity-0');
  });

  // Auto remove after 5 seconds
  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-4');
    setTimeout(() => toast.remove(), 300);
  }, 5000);
}

/* ==========================================
   Trial Lesson Popup Modal (Deneme Dersi Modal & Email Form)
   ========================================== */
function initTrialModal() {
  const trialForm = document.getElementById('trialForm');

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.open-trial-modal');
    if (trigger) {
      e.preventDefault();
      e.stopPropagation();
      const modal = document.getElementById('trialModal');
      if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.style.overflow = 'hidden';
      }
    }

    const closeTrigger = e.target.closest('#closeTrialModal');
    const modal = document.getElementById('trialModal');
    if (closeTrigger || e.target === modal) {
      if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.style.overflow = '';
      }
    }
  });

  if (trialForm) {
    trialForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const modal = document.getElementById('trialModal');
      const submitBtn = trialForm.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Gönderiliyor...';
      }

      try {
        const formData = new FormData(trialForm);
        const response = await fetch('https://formsubmit.co/ajax/info@einfachturkisch.de', {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: formData
        });

        if (response.ok) {
          const lang = localStorage.getItem('site_lang') || 'de';
          showToast(lang === 'tr' ? '⭐ Deneme dersi talebiniz başarıyla alındı! En kısa sürede sizinle iletişime geçeceğiz.' : '⭐ Deine Probestunden-Anfrage wurde erfolgreich gesendet! Wir melden uns in Kürze.', 'success');
          trialForm.reset();
          modal?.classList.add('hidden');
          modal?.classList.remove('flex');
          document.body.style.overflow = '';
        } else {
          throw new Error('Server error');
        }
      } catch (err) {
        showToast('Fehler beim Senden. Bitte versuche es erneut oder schreibe an info@einfachturkisch.de', 'error');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
      }
    });
  }
}
