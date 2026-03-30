import React from "react";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";

const Footer = () => {
  return (
    <>
      <footer className="bg-[#101828] text-white p-4">
        <div className="flex gap-5">
          <div>
            <h1 className="font-medium text-2xl my-3">Eventify Management</h1>
            <p className="my-3 text-sm text-gray-400">
              Your trusted partner in creating unforgettable events. We bring
              your vision to life with professional planning, creative themes,
              and seamless execution.
            </p>
            <div className="flex gap-4">
              <div className="max-h-25 max-w-25 p-2 bg-[#9810fa] rounded-full">
                <Facebook />
              </div>
              <div className="max-h-25 max-w-25 p-2 bg-[#9810fa] rounded-full">
                <Twitter />
              </div>
              <div className="max-h-25 max-w-25 p-2 bg-[#9810fa] rounded-full">
                <Instagram />
              </div>
              <div className="max-h-25 max-w-25 p-2 bg-[#9810fa] rounded-full">
                <Linkedin />
              </div>
            </div>
          </div>
          <div className="min-w-xs">
            <h3 className="my-3">Quick Links</h3>
            <ul className="flex flex-col gap-1">
              <li>
                <a
                  href="#"
                  className="text-gray-400 text-sm hover:text-purple-400"
                >
                  Tasks
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 text-sm hover:text-purple-400"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 text-sm hover:text-purple-400"
                >
                  Guidelines
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 text-sm hover:text-purple-400"
                >
                  Resources
                </a>
              </li>
            </ul>
          </div>
          <div>
            <div>
              <h4>Contact Us</h4>
            </div>
            <div className="flex gap-2 my-2">
              <MapPin className="text-purple-400" />
              <p className="text-gray-400">
                123 Event Street, Suite 100 New York, NY 10001
              </p>
            </div>
            <div className="flex gap-2 my-2">
              <Phone className="text-purple-400" />
              <p className="text-gray-400">+1 (555) 123-4567</p>
            </div>
            <div className="flex gap-2 my-2">
              <Mail className="text-purple-400" />
              <p className="text-gray-400">info@eventify.com </p>
            </div>
          </div>
        </div>
        <hr className="text-gray-400 my-5" />
        <div className="flex justify-between text-gray-400">
          <p className="text-sm">
            © 2026 Eventify Management System. All rights reserved.
          </p>
          <p className="text-sm">Made with ❤️ by Eventify Team</p>
        </div>
        <div className="flex text-xs gap-5 my-5 text-gray-400">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Cookie Policy</a>
          <a href="#">Accessibility</a>
        </div>
      </footer>
    </>
  );
};

export default Footer;
