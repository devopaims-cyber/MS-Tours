import { Link } from 'react-router-dom';
import { FaInstagram, FaFacebookF, FaTwitter, FaYoutube, FaPlane, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="mt-20 bg-navy text-cream-200">
      <div className="container-page py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-orange border-2 border-white flex items-center justify-center text-white">
              <FaPlane className="rotate-45" />
            </div>
            <div>
              <div className="font-fredoka text-xl">MS Tours</div>
              <div className="text-[10px] tracking-widest opacity-60">&amp; TRAVELS</div>
            </div>
          </div>
          <p className="text-sm opacity-80 leading-relaxed">
            Curated packages, dreamy stays, and the smoothest flights — all in one playful place. Since 2018.
          </p>
          <div className="flex gap-3 mt-4">
            {[
              { icon: <FaInstagram />, label: 'Instagram' },
              { icon: <FaFacebookF />, label: 'Facebook' },
              { icon: <FaTwitter />, label: 'Twitter' },
              { icon: <FaYoutube />, label: 'YouTube' },
            ].map((s) => (
              <a
                key={s.label}
                href="#"
                aria-label={s.label}
                className="w-9 h-9 rounded-full border-2 border-cream-200/30 flex items-center justify-center hover:bg-brand-orange hover:border-brand-orange transition"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-fredoka text-lg mb-3">Explore</h4>
          <ul className="space-y-2 text-sm opacity-80">
            <li><Link to="/packages" className="hover:text-brand-orange">Packages</Link></li>
            <li><Link to="/hotels" className="hover:text-brand-orange">Hotels</Link></li>
            <li><Link to="/flights" className="hover:text-brand-orange">Flights</Link></li>
            <li><Link to="/destinations" className="hover:text-brand-orange">Destinations</Link></li>
            <li><Link to="/about" className="hover:text-brand-orange">About us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-fredoka text-lg mb-3">Support</h4>
          <ul className="space-y-2 text-sm opacity-80">
            <li><Link to="/contact" className="hover:text-brand-orange">Contact</Link></li>
            <li><a href="#" className="hover:text-brand-orange">FAQs</a></li>
            <li><a href="#" className="hover:text-brand-orange">Cancellation policy</a></li>
            <li><a href="#" className="hover:text-brand-orange">Terms &amp; Privacy</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-fredoka text-lg mb-3">Reach us</h4>
          <ul className="space-y-2 text-sm opacity-80">
            <li className="flex items-start gap-2">
              <FaMapMarkerAlt className="mt-1 text-brand-orange" /> 42 Park Street, Mumbai 400001
            </li>
            <li className="flex items-start gap-2">
              <FaPhone className="mt-1 text-brand-orange" /> +91 98765 43210
            </li>
            <li className="flex items-start gap-2">
              <FaEnvelope className="mt-1 text-brand-orange" /> hello@mstours.com
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream-200/15">
        <div className="container-page py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs opacity-60">
          <p>© {new Date().getFullYear()} MS Tours &amp; Travels. All rights reserved.</p>
          <p>Made with ✈️ in India.</p>
        </div>
      </div>
    </footer>
  );
}
