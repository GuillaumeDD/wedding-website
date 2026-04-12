/* 
 * Translations loader
 * This file loads the translations from JSON files
 */

// Load translations for the current language
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
