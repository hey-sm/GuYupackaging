import 'virtual:windi.css';
import './styles.scss';

// import * as ReactDOM from 'react-dom/client';
import App from './app/app';
import { createRoot } from 'react-dom/client';
import { initI18n } from '@org/i18n';
initI18n();
// const root = ReactDOM.createRoot(
//   document.getElementById('root') as HTMLElement
// );

// root.render(<App />);

// https://github.com/CJY0208/react-activation/issues/225#issuecomment-1311136388
const root = createRoot(document.getElementById('root')!);
root.render(<App />);
