import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { ErrorBoundary } from './components/layout/ErrorBoundary';
import { Layout } from './components/layout/Layout';

const Overview = lazy(() => import('./components/modules/Overview').then(m => ({ default: m.Overview })));
const Transformers = lazy(() => import('./components/modules/Transformers').then(m => ({ default: m.Transformers })));
const LumpedDistributed = lazy(() => import('./components/modules/LumpedDistributed').then(m => ({ default: m.LumpedDistributed })));
const TransmissionLines = lazy(() => import('./components/modules/TransmissionLines').then(m => ({ default: m.TransmissionLines })));
const Transients = lazy(() => import('./components/modules/Transients').then(m => ({ default: m.Transients })));
const Antennas = lazy(() => import('./components/modules/Antennas').then(m => ({ default: m.Antennas })));

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-engineering-blue-200 dark:border-engineering-blue-800 border-t-engineering-blue-600 dark:border-t-engineering-blue-400 rounded-full animate-spin" />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Router basename={import.meta.env.BASE_URL}>
        <Layout>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Overview />} />
              <Route path="/transformers" element={<Transformers />} />
              <Route path="/lumped-distributed" element={<LumpedDistributed />} />
              <Route path="/transmission-lines" element={<TransmissionLines />} />
              <Route path="/transients" element={<Transients />} />
              <Route path="/antennas" element={<Antennas />} />
            </Routes>
          </Suspense>
        </Layout>
      </Router>
      <Analytics />
    </ErrorBoundary>
  );
}

export default App;
