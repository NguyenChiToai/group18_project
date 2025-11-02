// frontend/src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// --- PHẦN NÂNG CẤP BẮT ĐẦU TỪ ĐÂY ---

// 1. Import Provider từ react-redux
import { Provider } from 'react-redux';

// 2. Import Redux store mà bạn đã tạo
import { store } from './redux/store';

// --- KẾT THÚC PHẦN NÂNG CẤP ---


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* 
      3. Bọc toàn bộ component <App /> bằng <Provider>.
      Prop 'store={store}' sẽ "cung cấp" Redux store cho tất cả
      các component con bên trong App.
    */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();