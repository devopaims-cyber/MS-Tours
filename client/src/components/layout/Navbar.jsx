import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlane, FaBars, FaTimes, FaUserCircle, FaSignOutAlt, FaHeart, FaSuitcase } from 'react-icons/fa';
import { logout } from '@/store/slices/authSlice';
import Button from '../common/Button';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/packages', label: 'Packages' },
  { to: '/hotels', label: 'Hotels' },
  { to: '/flights', label: 'Flights' },
  { to: '/destinations', label: 'Destinations' },
  { to: '/about', label: 'About' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAuthenticated } = useSelector((s) => ({
    user: s.auth.user,
    isAuthenticated: Boolean(s.auth.user && s.auth.token),
  }));
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <header
      className={`sticky top-0 z-40 transition ${
        scrolled ? 'bg-cream-100/95 backdrop-blur-md shadow-card-soft' : 'bg-cream-100'
      } border-b-2 border-navy/10`}
    >
      <div className="container-page flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 group">
          <motion.div
            whileHover={{ rotate: 8 }}
            className="w-10 h-10 rounded-2xl bg-brand-orange border-2 border-navy flex items-center justify-center text-white shadow-retro"
          >
            <FaPlane className="rotate-45" />
          </motion.div>
          <div className="leading-none">
            <div className="font-fredoka text-xl text-navy">MS Tours</div>
            <div className="text-[10px] tracking-widest text-navy/60">&amp; TRAVELS</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `px-3 py-2 rounded-xl text-sm font-semibold transition ${
                  isActive ? 'bg-brand-violet text-white' : 'text-navy/80 hover:bg-navy/5'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white border-2 border-navy/20 hover:border-navy"
              >
                {user?.avatar ? (
                  <img src={user.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                ) : (
                  <FaUserCircle className="text-navy" />
                )}
                <span className="text-sm font-semibold text-navy max-w-[120px] truncate">
                  {user?.name?.split(' ')[0] || 'Me'}
                </span>
              </button>
              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    className="absolute right-0 mt-2 w-56 bg-white border-2 border-navy rounded-2xl shadow-card-lift p-2 z-50"
                  >
                    <Link
                      to="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-navy/5 text-sm"
                    >
                      <FaSuitcase /> My Bookings
                    </Link>
                    <Link
                      to="/favorites"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-navy/5 text-sm"
                    >
                      <FaHeart /> Favorites
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-rose-50 text-rose-500 text-sm"
                    >
                      <FaSignOutAlt /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link to="/signup">
                <Button variant="primary" size="sm">Sign up</Button>
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setOpen((o) => !o)}
          className="md:hidden p-2 rounded-xl border-2 border-navy/20"
          aria-label="Toggle menu"
        >
          {open ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t-2 border-navy/10 bg-cream-100 overflow-hidden"
          >
            <div className="container-page py-4 flex flex-col gap-2">
              {navLinks.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === '/'}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-xl text-sm font-semibold ${
                      isActive ? 'bg-brand-violet text-white' : 'text-navy hover:bg-navy/5'
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
              <div className="border-t-2 border-navy/10 pt-3 mt-2 flex gap-2">
                {isAuthenticated ? (
                  <Button variant="primary" fullWidth onClick={handleLogout}>Logout</Button>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setOpen(false)} className="flex-1">
                      <Button variant="secondary" fullWidth>Login</Button>
                    </Link>
                    <Link to="/signup" onClick={() => setOpen(false)} className="flex-1">
                      <Button variant="primary" fullWidth>Sign up</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
