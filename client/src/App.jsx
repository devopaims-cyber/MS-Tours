import { lazy, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './router/ProtectedRoute';

const Home = lazy(() => import('./pages/Home'));
const SearchResults = lazy(() => import('./pages/SearchResults'));
const PackageDetail = lazy(() => import('./pages/PackageDetail'));
const HotelSearch = lazy(() => import('./pages/HotelSearch'));
const HotelDetail = lazy(() => import('./pages/HotelDetail'));
const FlightSearch = lazy(() => import('./pages/FlightSearch'));
const BookingFlow = lazy(() => import('./pages/BookingFlow'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Destinations = lazy(() => import('./pages/Destinations'));
const Favorites = lazy(() => import('./pages/Favorites'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

export default function App() {
  const location = useLocation();
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/packages" element={<SearchResults />} />
            <Route path="/packages/:id" element={<PackageDetail />} />
            <Route path="/hotels" element={<HotelSearch />} />
            <Route path="/hotels/:id" element={<HotelDetail />} />
            <Route path="/flights" element={<FlightSearch />} />
            <Route
              path="/book/:type/:id"
              element={
                <ProtectedRoute>
                  <BookingFlow />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/favorites"
              element={
                <ProtectedRoute>
                  <Favorites />
                </ProtectedRoute>
              }
            />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
