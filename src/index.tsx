import React from 'react';
import ReactDOM from 'react-dom/client';

import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css';

import LoadConfig from './components/LoadConfig';
import TabPane from "./components/TabPane"

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <LoadConfig>
        <TabPane />
    </LoadConfig>
  </React.StrictMode>
);
