import React from 'react';
import { Link } from 'react-router-dom';
import { FaLeaf, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-md">
                <FaLeaf />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Agro<span className="text-emerald-400">Connect</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Empowering farmers with fair market visibility and direct buyer procurement for sustainable agricultural trade.
            </p>
            <div className="pt-2 text-xs text-emerald-400 font-medium">
              Verified Farmer Mandi Integration
            </div>
          </div>

          {/* Categories Col */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Crop Categories
            </h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/crops?category=Grains%20%26%20Cereals" className="hover:text-emerald-400 transition-colors">
                  Grains & Cereals
                </Link>
              </li>
              <li>
                <Link to="/crops?category=Vegetables" className="hover:text-emerald-400 transition-colors">
                  Fresh Vegetables
                </Link>
              </li>
              <li>
                <Link to="/crops?category=Fruits" className="hover:text-emerald-400 transition-colors">
                  Orchard Fruits
                </Link>
              </li>
              <li>
                <Link to="/crops?category=Pulses%20%26%20Legumes" className="hover:text-emerald-400 transition-colors">
                  Pulses & Legumes
                </Link>
              </li>
              <li>
                <Link to="/crops?category=Spices" className="hover:text-emerald-400 transition-colors">
                  Medicinal Spices & Herbs
                </Link>
              </li>
              <li>
                <Link to="/crops?category=Cash%20Crops" className="hover:text-emerald-400 transition-colors">
                  Cash Crops
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigation Col */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/" className="hover:text-emerald-400 transition-colors">
                  Home Portal
                </Link>
              </li>
              <li>
                <Link to="/crops" className="hover:text-emerald-400 transition-colors">
                  Browse All Crops
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-emerald-400 transition-colors">
                  Farmer / Buyer Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-emerald-400 transition-colors">
                  Join AgroConnect
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-emerald-400 transition-colors">
                  Account Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Helpline */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Kisan Support
            </h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-3">
                <FaPhoneAlt className="text-emerald-400 shrink-0" />
                <span>1800-180-1551 (Toll-Free Helpline)</span>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-emerald-400 shrink-0" />
                <span>kisan-support@agroconnect.org</span>
              </li>
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-emerald-400 shrink-0 mt-1" />
                <span>Central Agricultural Complex, Krishi Bhavan, New Delhi</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} AgroConnect – Agriculture Management System. All rights reserved.</p>
          <div className="flex gap-6">
            <span>Fair Trade Direct Sourcing</span>
            <span>Mandi Price Discovery</span>
            <span>Zero Middleman Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
