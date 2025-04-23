import en from '../locales/en.json';

declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: typeof en;
  }
}
declare module '*.json' {
  const value: Record<string, any>;
  export default value;
}
