import 'virtual:windi.css';
import './styles.scss';

// import * as ReactDOM from 'react-dom/client';
import { render } from 'react-dom';
import App from './app/app';

// const root = ReactDOM.createRoot(
//   document.getElementById('root') as HTMLElement
// );

// root.render(<App />);

// https://github.com/CJY0208/react-activation/issues/225#issuecomment-1311136388
render(<App />, document.getElementById('root') as HTMLElement);
