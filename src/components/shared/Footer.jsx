import Link from "next/link";
import {
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiYoutube,
  FiMapPin,
  FiPhone,
  FiMail,
} from "react-icons/fi";
import logo from "../../../public/Image/logo.png";
import Image from "next/image";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Browse Recipes", href: "/recipes" },
  { label: "Login", href: "/login" },
  { label: "Register", href: "/register" },
];

const socialLinks = [
  { icon: FiFacebook, href: "https://facebook.com" },
  { icon: FiInstagram, href: "https://instagram.com" },
  { icon: FiTwitter, href: "https://twitter.com" },
  { icon: FiYoutube, href: "https://youtube.com" },
];

export default function Footer() {
  return (
    <footer className="bg-[var(--secondary)] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <Link href="/" className="flex items-center gap-2 mb-4">
            <div className="rounded-lg flex items-center justify-center">
              <Image src={logo} width={100} height={100} alt="logo"></Image>
            </div>
          </Link>
          <p className="text-sm text-gray-300 leading-relaxed">
            A platform for food enthusiasts to create, share, and discover
            amazing recipes from around the world.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
          <ul className="flex flex-col gap-2">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-gray-300 hover:text-[var(--primary)] transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
          <ul className="flex flex-col gap-3 text-sm text-gray-300">
            <li className="flex items-center gap-2">
              <FiMapPin size={16} className="text-[var(--primary)] shrink-0" />
              Dhaka, Bangladesh
            </li>
            <li className="flex items-center gap-2">
              <FiPhone size={16} className="text-[var(--primary)] shrink-0" />
              +880 1234-567890
            </li>
            <li className="flex items-center gap-2">
              <FiMail size={16} className="text-[var(--primary)] shrink-0" />
              support@recipehub.com
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-4">Follow Us</h3>
          <div className="flex gap-3">
            {socialLinks.map((social, idx) => {
              const Icon = social.icon;
              return (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-[var(--primary)] transition-colors"
                >
                  <Icon size={16} />
                </a>
              );
            })}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} RecipeHub. All rights reserved.
      </div>
    </footer>
  );
}
