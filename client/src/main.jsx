import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { MotionConfig } from 'framer-motion';

import { store, persistor } from './store';
import App from './App';
import PageLoader from './components/common/PageLoader';
import ErrorBoundary from './components/common/ErrorBoundary';
import { ToastProvider } from './hooks/useToast';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={<PageLoader />} persistor={persistor}>
        <HelmetProvider>
          <BrowserRouter>
            <MotionConfig reducedMotion="user">
              <ToastProvider>
                <ErrorBoundary>
                  <Suspense fallback={<PageLoader />}>
                    <App />
                  </Suspense>
                </ErrorBoundary>
              </ToastProvider>
            </MotionConfig>
          </BrowserRouter>
        </HelmetProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
