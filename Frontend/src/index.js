import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import './index.css';
import App from './App';
import { CookiesProvider } from 'react-cookie';
import AuthProvider from "./store/AuthProvider";

ReactDOM.render(
    <CookiesProvider>
        <AuthProvider>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </AuthProvider>
    </CookiesProvider>,
    document.getElementById('root'));
