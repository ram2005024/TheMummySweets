import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full px-6 pt-10 text-gray-600 border-t border-gray-200 md:px-16 lg:px-24 xl:px-32 bg-gray-50">
      <div className="flex flex-col justify-between w-full gap-12 pb-8 border-b border-gray-300 md:flex-row">
        {/* Logo + description */}
        <div className="md:max-w-90">
          <div className="flex items-center gap-2">
            {/* Replace with your actual logo */}
            <div className="flex items-center justify-center w-10 h-10 font-bold text-white bg-indigo-600 rounded-full">
              M
            </div>
            <span className="text-lg font-semibold text-gray-800">
              Mummy Sweets
            </span>
          </div>
          <p className="mt-6 text-sm leading-relaxed">
            “Where Sweetness Never Sleeps!” <br />
            At the heart of Mahadaiya Chowk, The Mummy Sweets House is your
            go‑to destination for irresistible mithai, crunchy snacks, and
            delightful treats. Whether it’s a festive celebration or a casual
            craving, we serve happiness in every bite. Easy to find, impossible
            to forget — Butwal’s sweetest corner awaits
            you!hghsdsfdsfsdfdsfssdfsdfsdfsafsfdsdfdsfs
          </p>
        </div>

        {/* Links + contact */}
        <div className="flex items-start flex-1 gap-16 md:justify-end">
          <div>
            <h2 className="mb-5 font-semibold text-gray-800">Company</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-indigo-600">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-600">
                  About us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-600">
                  Contact us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-600">
                  Privacy policy
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="mb-5 font-semibold text-gray-800">Get in touch</h2>
            <div className="space-y-2 text-sm">
              <p className="hover:text-indigo-600">+1-212-456-7890</p>
              <p className="hover:text-indigo-600">contact@example.com</p>
              {/* Social icons */}
              <div className="flex gap-4 mt-3">
                <a href="#" className="hover:text-indigo-600">
                  <FaFacebookF size={18} />
                </a>
                <a href="#" className="hover:text-indigo-600">
                  <FaInstagram size={18} />
                </a>
                <a href="#" className="hover:text-indigo-600">
                  <FaTwitter size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom copyright */}
      <p className="pt-6 text-xs text-center text-gray-500 md:text-sm">
        2024 The Mummy Sweets House. All Rights Reserved.
      </p>
    </footer>
  );
}
