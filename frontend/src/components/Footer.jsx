import relasto_logo from "../assets/images/relasto-logo.png";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-white-100 text-black-700 px-10 py-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8">
        <div>
          <img src={relasto_logo} alt="Relasto Logo" className="w-32 mb-4" />
          <p className="text-sm mb-3">
            59 Beverly Hill Ave, Brooklyn Town,
            <br />
            New York, NY 5630, CA, US
          </p>
          <p className="text-sm">+(123) 456-7890</p>
          <p className="text-sm mb-4">info@mail.com</p>

          <div className="flex items-center gap-4 text-orange-500 text-lg">
            <FaFacebookF />
            <FaTwitter />
            <FaInstagram />
            <FaLinkedinIn />
            <FaYoutube />
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-4">Features</h3>
          <ul className="space-y-2 text-sm">
            <li>Home v1</li>
            <li>Home v2</li>
            <li>About</li>
            <li>Contact</li>
            <li>Search</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-4">Information</h3>
          <ul className="space-y-2 text-sm">
            <li>Listing v1</li>
            <li>Listing v2</li>
            <li>Property Details</li>
            <li>Agent List</li>
            <li>Agent Profile</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-4">Documentation</h3>
          <ul className="space-y-2 text-sm">
            <li>Blog</li>
            <li>FAQ</li>
            <li>Privacy Policy</li>
            <li>License</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-4">Others</h3>
          <ul className="space-y-2 text-sm">
            <li>Log in</li>
            <li>Enter OTP</li>
            <li>New Password</li>
            <li>Reset Password</li>
            <li>Create Account</li>
          </ul>
        </div>
      </div>

      <div className="mt-10 pt-5 text-sm text-black-500">
        © 2022. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
