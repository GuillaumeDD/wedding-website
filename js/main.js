// Get language from URL parameter
function getLanguageFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const langParam = urlParams.get('lang');
  const supportedLangs = ['en', 'fr', 'ar'];
  
  return supportedLangs.includes(langParam) ? langParam : null;
}

// Detect browser language with French as fallback
function detectBrowserLanguage() {
  // Get browser language preferences
  const browserLang = navigator.language || navigator.userLanguage;
  const langCode = browserLang ? browserLang.split('-')[0] : null; // e.g., 'en-US' -> 'en'
  
  // Supported languages
  const supportedLangs = ['en', 'fr', 'ar'];
  
  // Return detected language if supported, otherwise default to French
  return supportedLangs.includes(langCode) ? langCode : 'fr';
}

// Determine initial language with priority: URL > Browser > French default
function determineInitialLanguage() {
  // Check URL parameter first (highest priority)
  const urlLang = getLanguageFromURL();
  if (urlLang) return urlLang;
  
  // Fallback to browser detection
  return detectBrowserLanguage();
}

// Update URL parameter for current language
function updateURLLanguage(lang) {
  const url = new URL(window.location);
  url.searchParams.set('lang', lang);
  window.history.replaceState(null, '', url);
}

// Translations handler
let currentLanguage = determineInitialLanguage();
let translations = {};

// Load translations for all languages
async function loadTranslations() {
  try {
    const languages = ['en', 'fr', 'ar'];
    
    for (const lang of languages) {
      const response = await fetch(`locales/${lang}.json`);
      translations[lang] = await response.json();
    }
    
    // Apply initial translations
    applyTranslations();
  } catch (error) {
    console.error('Error loading translations:', error);
  }
}

// Apply translations based on current language
function applyTranslations() {
  const elements = document.querySelectorAll('[data-i18n]');
  
  elements.forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (translations[currentLanguage] && translations[currentLanguage][key]) {
      element.textContent = translations[currentLanguage][key];
    }
  });
  
  // Handle alt text translations
  const altElements = document.querySelectorAll('[data-i18n-alt]');
  altElements.forEach(element => {
    const key = element.getAttribute('data-i18n-alt');
    if (translations[currentLanguage] && translations[currentLanguage][key]) {
      element.alt = translations[currentLanguage][key];
    }
  });
  
  // Update document title
  if (translations[currentLanguage] && translations[currentLanguage]['page_title']) {
    document.title = translations[currentLanguage]['page_title'];
  }
}

// Initialize language settings on page load
function initializeLanguage() {
  // Set active button for detected language
  document.querySelectorAll('.language-switcher button').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelector(`.language-switcher button[onclick="changeLanguage('${currentLanguage}')"]`).classList.add('active');
  
  // Set up RTL/LTR and language attributes
  const rtlStylesheet = document.getElementById('rtl-stylesheet');
  const htmlElement = document.documentElement;
  
  if (currentLanguage === 'ar') {
    htmlElement.setAttribute('dir', 'rtl');
    htmlElement.setAttribute('lang', 'ar');
    if (rtlStylesheet) {
      rtlStylesheet.removeAttribute('disabled');
    }
  } else {
    htmlElement.setAttribute('dir', 'ltr');
    htmlElement.setAttribute('lang', currentLanguage);
    if (rtlStylesheet) {
      rtlStylesheet.setAttribute('disabled', 'disabled');
    }
  }
}

// Change language function
function changeLanguage(lang) {
  if (lang === currentLanguage) return;
  
  // Update active button
  document.querySelectorAll('.language-switcher button').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelector(`.language-switcher button[onclick="changeLanguage('${lang}')"]`).classList.add('active');
  
  // Handle RTL for Arabic
  const rtlStylesheet = document.getElementById('rtl-stylesheet');
  const htmlElement = document.documentElement;
  
  if (lang === 'ar') {
    htmlElement.setAttribute('dir', 'rtl');
    htmlElement.setAttribute('lang', 'ar');
    rtlStylesheet.removeAttribute('disabled');
  } else {
    htmlElement.setAttribute('dir', 'ltr');
    htmlElement.setAttribute('lang', lang);
    rtlStylesheet.setAttribute('disabled', 'disabled');
  }
  
  // Update current language and apply translations
  currentLanguage = lang;
  applyTranslations();
  
  // Update URL parameter
  updateURLLanguage(lang);
}

// RSVP form handling
function handleRSVPForm() {
  const form = document.querySelector('.rsvp-form');
  if (!form) return;
  
  form.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const attending = document.getElementById('attending').value;
    const name = document.getElementById('name').value;
    
    let message = '';
    if (attending === 'yes') {
      message = translations[currentLanguage]['rsvp_success_yes'] || 'Thank you for your RSVP. We look forward to celebrating with you!';
    } else {
      message = translations[currentLanguage]['rsvp_success_no'] || 'Thank you for letting us know. You will be missed!';
    }
    
    alert(message);
    form.reset();
  });
  
  // Show/hide guests field based on attendance
  const attendingSelect = document.getElementById('attending');
  const guestsField = document.getElementById('guests').parentElement;
  
  attendingSelect.addEventListener('change', function() {
    if (this.value === 'yes') {
      guestsField.style.display = 'block';
    } else {
      guestsField.style.display = 'none';
    }
  });
}

// Smooth scrolling for navigation
function setupSmoothScrolling() {
  const navLinks = document.querySelectorAll('nav a');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(event) {
      event.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeLanguage();
  loadTranslations();
  handleRSVPForm();
  setupSmoothScrolling();
  
  // Create placeholder images for testing
  createPlaceholderImage();
});

// Create placeholder image for testing
function createPlaceholderImage() {
  const placeholders = document.querySelectorAll('img[src="assets/images/placeholder.jpg"]');
  
  placeholders.forEach((img, index) => {
    // Create a canvas element
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 300;
    
    // Get the context and create a colored rectangle
    const ctx = canvas.getContext('2d');
    
    // Different colors for different placeholders
    const colors = ['#f5e1da', '#e8d0d9', '#daeaf6', '#e8e3d7'];
    const color = colors[index % colors.length];
    
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add text
    ctx.fillStyle = '#666';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Placeholder Image', canvas.width/2, canvas.height/2);
    
    // Set the canvas data as the image source
    img.src = canvas.toDataURL();
  });
}
