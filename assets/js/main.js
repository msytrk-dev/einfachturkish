/**
 * Einfach Türkisch - Interactive Platform JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initFaqAccordion();
  initVocabTrainer();
  initPricingToggle();
  initContactForm();
  initCourseModal();
  initNewsletterForm();
  initScrollAnimations();
});

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
  }
];

// Automatically select a different featured word based on the current hour of the day (00-23)
const currentHourOfDay = new Date().getHours();
let currentVocabIndex = currentHourOfDay % vocabData.length;

function initVocabTrainer() {
  const flashcard = document.getElementById('vocabFlashcard');
  const deText = document.getElementById('vocabDeText');
  const trText = document.getElementById('vocabTrText');
  const phoneticText = document.getElementById('vocabPhonetic');
  const categoryBadge = document.getElementById('vocabCategory');
  const contextText = document.getElementById('vocabContext');
  const counterText = document.getElementById('vocabCounter');
  const prevBtn = document.getElementById('vocabPrevBtn');
  const nextBtn = document.getElementById('vocabNextBtn');
  const flipBtn = document.getElementById('vocabFlipBtn');
  const audioBtn = document.getElementById('vocabAudioBtn');

  if (!flashcard) return;

  function updateVocabCard(index) {
    const data = vocabData[index];
    
    // Reset flip state
    const inner = flashcard.querySelector('.flashcard-inner');
    inner?.classList.remove('is-flipped');

    // Update text content immediately
    if (deText) deText.textContent = data.de;
    if (trText) trText.textContent = data.tr;
    if (phoneticText) phoneticText.textContent = data.phonetic;
    if (categoryBadge) categoryBadge.textContent = data.category;
    if (contextText) contextText.textContent = data.context;
    if (counterText) counterText.textContent = `${index + 1} / ${vocabData.length}`;
  }

  // Initial load
  updateVocabCard(currentVocabIndex);

  // Flip trigger
  const innerCard = flashcard.querySelector('.flashcard-inner');
  const flipAction = () => {
    innerCard?.classList.toggle('is-flipped');
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
    currentVocabIndex = (currentVocabIndex + 1) % vocabData.length;
    updateVocabCard(currentVocabIndex);
  });

  prevBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    currentVocabIndex = (currentVocabIndex - 1 + vocabData.length) % vocabData.length;
    updateVocabCard(currentVocabIndex);
  });

  // Audio Speech synthesis
  audioBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    const data = vocabData[currentVocabIndex];
    speakText(data.tr);
  });
}

function speakText(text) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel(); // Stop current speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'tr-TR';
    utterance.rate = 0.9;
    
    // Visual sound indicator effect on button
    const audioBtn = document.getElementById('vocabAudioBtn');
    if (audioBtn) {
      audioBtn.classList.add('animate-bounce', 'text-amber-400');
      utterance.onend = () => {
        audioBtn.classList.remove('animate-bounce', 'text-amber-400');
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

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Wird gesendet...';
    }

    // Simulate API delay
    setTimeout(() => {
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

      showToast('Teşekkürler! Ihre Nachricht wurde erfolgreich gesendet. Wir melden uns in kürze.', 'success');
    }, 1200);
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
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Anmeldung wird verarbeitet...';
    }

    setTimeout(() => {
      closeModal();
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = 'Kostenfrei testen';
      }
      showToast('Hoş geldiniz! Ihre Registrierung war erfolgreich. Überprüfen Sie Ihr E-Mail-Postfach.', 'success');
    }, 1500);
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
    if (input && input.value) {
      showToast('Vielen Dank für Ihre Anmeldung zum Türkisch-Wortschatz-Newsletter!', 'success');
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
