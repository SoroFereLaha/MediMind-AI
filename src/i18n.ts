
// src/i18n.ts
import {getRequestConfig} from 'next-intl/server';

console.log('################# [i18n.ts] THIS FILE IS BEING IMPORTED (SIMPLIFIED) #################');

export const locales = ['en', 'fr', 'ar'];
export const defaultLocale = 'fr';

console.log(`[i18n.ts] CONSTANTS (SIMPLIFIED): Default locale = ${defaultLocale}, Supported locales = ${locales.join(', ')}`);

export default getRequestConfig(async ({locale}) => {
  console.log(`!!!!!!!!!!!!!!! [i18n.ts] getRequestConfig's ASYNC CALLBACK EXECUTED FOR LOCALE (SIMPLIFIED): "${locale}" !!!!!!!!!!!!!!!`);
  
  // For extreme simplicity, return hardcoded messages.
  if (locale === 'en') {
    console.log('[i18n.ts] SIMPLIFIED: Returning EN messages');
    return {
      messages: {
        Layout: {
          title: "MediMind AI (EN Test)",
          description: "AI-Powered Medical Guidance (EN Test)"
        },
        HomePage: {
          welcomeTitle: "Welcome to MediMind AI (EN Test)",
          welcomeDescription: "Your intelligent health companion (EN Test).",
          startJourneyTitle: "Start Your Health Journey (EN Test)",
          startJourneyDescription: "Begin with our AI Patient Interview (EN Test).",
          startInterviewButton: "Start AI Patient Interview (EN Test)",
          howItWorksTitle: "How MediMind AI Works (EN Test)",
          aiConversationsTitle: "AI-Powered Conversations (EN Test)",
          aiConversationsDescription: "Engage in a guided interview (EN Test).",
          intelligentAnalysisTitle: "Intelligent Analysis (EN Test)",
          intelligentAnalysisDescription: "Receive insights (EN Test).",
          securePrivateTitle: "Secure & Private (EN Test)",
          securePrivateDescription: "Your data is handled with care (EN Test).",
          disclaimer: "Informational purposes only (EN Test)."
        },
        AppLayout: {
          logoText: "MediMind AI (EN)",
          footerSlogan: "Your health, understood (EN).",
          footerRights: "© {year} MediMind AI. All rights reserved (EN)."
        },
        Navigation: {
          home: "Home (EN)",
          patientInterview: "Patient Interview (EN)",
          specialistInsights: "Specialist Insights (EN)",
          recommendations: "Recommendations (EN)",
          dataPrivacy: "Data Privacy (EN)"
        },
        ThemeToggle: {
          toggleTheme: "Toggle theme (EN)",
          light: "Light (EN)",
          dark: "Dark (EN)",
          system: "System (EN)"
        },
        LanguageSwitcher: {
          toggleLanguage: "Change language (EN)",
          en: "English (EN)",
          fr: "French (EN)",
          ar: "Arabic (EN)"
        }
      }
    };
  } else if (locale === 'fr') {
    console.log('[i18n.ts] SIMPLIFIED: Returning FR messages');
    return {
      messages: {
        Layout: {
          title: "MediMind IA (FR Test)",
          description: "Guidance médicale assistée par IA (FR Test)"
        },
        HomePage: {
          welcomeTitle: "Bienvenue chez MediMind IA (FR Test)",
          welcomeDescription: "Votre compagnon de santé intelligent (FR Test).",
          startJourneyTitle: "Commencez Votre Parcours de Santé (FR Test)",
          startJourneyDescription: "Débutez avec notre Entretien Patient IA (FR Test).",
          startInterviewButton: "Démarrer l'Entretien Patient IA (FR Test)",
          howItWorksTitle: "Comment Fonctionne MediMind IA (FR Test)",
          aiConversationsTitle: "Conversations Guidées par l'IA (FR Test)",
          aiConversationsDescription: "Engagez une conversation guidée (FR Test).",
          intelligentAnalysisTitle: "Analyse Intelligente (FR Test)",
          intelligentAnalysisDescription: "Recevez des informations (FR Test).",
          securePrivateTitle: "Sécurisé et Confidentiel (FR Test)",
          securePrivateDescription: "Vos données sont traitées avec soin (FR Test).",
          disclaimer: "À titre informatif uniquement (FR Test)."
        },
        AppLayout: {
          logoText: "MediMind IA (FR)",
          footerSlogan: "Votre santé, comprise (FR).",
          footerRights: "© {year} MediMind IA. Tous droits réservés (FR)."
        },
        Navigation: {
          home: "Accueil (FR)",
          patientInterview: "Entretien Patient (FR)",
          specialistInsights: "Avis de Spécialistes (FR)",
          recommendations: "Recommandations (FR)",
          dataPrivacy: "Confidentialité des Données (FR)"
        },
        ThemeToggle: {
          toggleTheme: "Changer de thème (FR)",
          light: "Clair (FR)",
          dark: "Sombre (FR)",
          system: "Système (FR)"
        },
        LanguageSwitcher: {
          toggleLanguage: "Changer de langue (FR)",
          en: "Anglais (FR)",
          fr: "Français (FR)",
          ar: "Arabe (FR)"
        }
      }
    };
  } else if (locale === 'ar') {
    console.log('[i18n.ts] SIMPLIFIED: Returning AR messages');
    return {
      messages: {
        Layout: {
          title: "MediMind AI (AR Test)",
          description: "إرشادات طبية مدعومة بالذكاء الاصطناعي (AR Test)"
        },
        HomePage: {
          welcomeTitle: "مرحباً بك في MediMind AI (AR Test)",
          welcomeDescription: "رفيقك الصحي الذكي (AR Test).",
          startJourneyTitle: "ابدأ رحلتك الصحية (AR Test)",
          startJourneyDescription: "ابدأ بمقابلة المريض الافتراضية (AR Test).",
          startInterviewButton: "ابدأ مقابلة المريض الافتراضية (AR Test)",
          howItWorksTitle: "كيف يعمل MediMind AI (AR Test)",
          aiConversationsTitle: "محادثات مدعومة بالذكاء الاصطناعي (AR Test)",
          aiConversationsDescription: "شارك في مقابلة موجهة (AR Test).",
          intelligentAnalysisTitle: "تحليل ذكي (AR Test)",
          intelligentAnalysisDescription: "احصل على رؤى (AR Test).",
          securePrivateTitle: "آمن وخاص (AR Test)",
          securePrivateDescription: "يتم التعامل مع بياناتك بعناية (AR Test).",
          disclaimer: "للأغراض الإعلامية فقط (AR Test)."
        },
        AppLayout: {
          logoText: "MediMind AI (AR)",
          footerSlogan: "صحتك، مفهومة (AR).",
          footerRights: "© {year} MediMind AI. جميع الحقوق محفوظة (AR)."
        },
        Navigation: {
          home: "الرئيسية (AR)",
          patientInterview: "مقابلة المريض (AR)",
          specialistInsights: "رؤى متخصصة (AR)",
          recommendations: "التوصيات (AR)",
          dataPrivacy: "خصوصية البيانات (AR)"
        },
        ThemeToggle: {
          toggleTheme: "تبديل السمة (AR)",
          light: "فاتح (AR)",
          dark: "داكن (AR)",
          system: "النظام (AR)"
        },
        LanguageSwitcher: {
          toggleLanguage: "تغيير اللغة (AR)",
          en: "الإنجليزية (AR)",
          fr: "الفرنسية (AR)",
          ar: "العربية (AR)"
        }
      }
    };
  }

  console.log(`[i18n.ts] SIMPLIFIED: Locale "${locale}" not explicitly handled, returning generic fallback messages.`);
  return {
    messages: {
      Layout: {
        title: `Fallback Title for ${locale} (Test)`,
        description: `Fallback Description for ${locale} (Test)`
      },
      HomePage: {
        welcomeTitle: `Fallback Welcome for ${locale} (Test)`
      },
      AppLayout: {
        logoText: `FallbackLogo (${locale})`,
        footerSlogan: "FallbackSlogan",
        footerRights: "FallbackRights © {year}"
      },
      Navigation: {
        home: "FBHome", patientInterview: "FBInterview", specialistInsights: "FBInsights", recommendations: "FBRecs", dataPrivacy: "FBPrivacy"
      },
      ThemeToggle: {
        toggleTheme: "FBTheme", light: "FBLight", dark: "FBDark", system: "FBSystem"
      },
      LanguageSwitcher: {
        toggleLanguage: "FBLang", en: "FBEnglish", fr: "FBFrench", ar: "FBArabic"
      }
    }
  };
});

console.log('[i18n.ts] File evaluation END (SIMPLIFIED), getRequestConfig default export prepared.');

    