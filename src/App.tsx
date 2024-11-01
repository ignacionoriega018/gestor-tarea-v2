import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { Tablero } from './components/Tablero';
import { Configuracion } from './components/Configuracion';
import { Layout } from './components/Layout';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <Layout>
          <Configuracion />
          <Tablero />
        </Layout>
      </ErrorBoundary>
    </Provider>
  );
}

export default App;