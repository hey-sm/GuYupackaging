import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
// 动态加载语言文件
const loadLanguage = async (lang: string) => {
  try {
    const translations = await import(`../locales/${lang}.json`);
    console.log(translations, 'translations');
    i18n.addResourceBundle(lang, 'translation', translations.default);
  } catch (error) {
    console.error(`Failed to load language: ${lang}`, error);
  }
};
export function initI18n() {
  i18n
    .use(
      resourcesToBackend(async (lang: string) => {
        try {
          const module = await import(`../locales/${lang}.json`);
          return module.default || module; // 双重保障
        } catch (error) {
          console.error(`Failed to load ${lang} translations:`, error);
          return {}; // 返回空对象作为fallback
        }
      })
    )
    .use(initReactI18next)
    .init({
      // 核心配置
      lng: 'zh', // 默认显示的语言（会优先尝试匹配浏览器语言）
      fallbackLng: 'en', // 当翻译缺失时的备用语言
      supportedLngs: ['en', 'zh'], // 支持的语言列表
      defaultNS: 'translation', // 默认命名空间
      interpolation: {
        escapeValue: false, // React 已经防止 XSS
      },
      // 优化配置
      cleanCode: true, // 启用简洁模式
      load: 'currentOnly', // 只加载当前语言
      initImmediate: false, // 同步初始化
    });

  // 加载默认语言
  return i18n;
}

// 语言切换函数
export const changeLanguage = async (lang: 'zh' | 'en') => {
  try {
    // 1. 预加载目标语言包
    await loadLanguage(lang); // 使用你已定义的加载函数

    // 2. 执行切换
    await i18n.changeLanguage(lang);

    // 3. 持久化存储（可选）
    localStorage.setItem('i18nextLng', lang);

    return true;
  } catch (error) {
    console.error(`Language switch failed: ${error}`);
    return false;
  }
};

// 初始化时读取存储的语言偏好
const savedLang = localStorage.getItem('i18nextLng');
if (savedLang && i18n.languages.includes(savedLang)) {
  i18n.changeLanguage(savedLang);
}

// 实用函数
export const t = i18n.t; // 直接导出翻译函数
export interface AppI18nConfig {
  namespaces: string[];
  defaultNS: string;
}
