import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import LanguageDetector from 'i18next-browser-languagedetector'; // 新增

export function initI18n() {
  i18n
    .use(LanguageDetector) // 新增：语言检测插件
    .use(
      resourcesToBackend(async (lang: string) => {
        try {
          const module = await import(`../locales/${lang}.json`);
          return module.default || module;
        } catch (error) {
          console.error(`Failed to load ${lang} translations:`, error);
          return {};
        }
      })
    )
    .use(initReactI18next)
    .init(
      {
        fallbackLng: 'zh',
        supportedLngs: ['en', 'zh'],
        detection: {
          order: ['localStorage', 'navigator'],
          caches: ['localStorage'],
          lookupLocalStorage: 'i18nextLng',
        },
      },
      (err) => {
        if (err) console.error('i18n 初始化失败:', err);
        // // 初始化后强制检测
        // i18n.changeLanguage(i18n.language).then(() => {
        //   console.log('当前语言:', i18n.language);
        // });
      }
    );

  return i18n;
}
