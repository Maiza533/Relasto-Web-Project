import {useState} from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube, FaEnvelope, FaPhone, FaWifi} from "react-icons/fa";
import Footer from '../components/Footer';

function ContactPage() {
    return (
    <div>

<section className=" bg-[#fdf0f0] min-h-screen flex items-center justify-center px-4">
      <div className="max-w-5xl w-full">

        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Get in touch
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble.
          </p>
        </div>

        <div className="max-w-5xl mx-auto mt-10 bg-white shadow-xl rounded-2xl overflow-hidden">
          
          <div className="grid md:grid-cols-2">
            <div className='p-8'>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
              Send a message
            </h2>

            <form className="space-y-5">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black-500 focus:border-transparent transition"
              />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black-500 focus:border-transparent transition"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black-500 focus:border-transparent transition"
              />
              <textarea
                placeholder="Message"
                rows="4"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black-500 focus:border-transparent transition resize-vertical"
              ></textarea>
              <button
                type="submit"
                className="w-full bg-black text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition duration-300 shadow-sm"
              >
                Send Request
              </button>
            </form>
            
          </div>

          

          <div className="p-8 md:p-10 bg-white">
            <div className="p-8 flex flex-col justify-center">
                <h3 className='space-y-3 text-gray-700 font-bold'>
                    Office Address
                </h3>
    
                <div className="space-y-2 text-gray-600">
                  <p className="flex items-center gap-2">
                    1421 San Pedro St, Los Angeles,<br /> CA 90015
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-gray-500"><FaPhone /></span>
                    (123) 456-7890
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-gray-500"><FaEnvelope /></span>
                    info@mail.com
                  </p>

                  <h3 className='text-gray-700 font-bold space-y-3 mt-2'>
                    Social
                  </h3>
                  <div className='flex gap-3'>
                    <a href="#"
                    className="text-gray-500 hover:text-blue-600 transition">
                        <FaFacebookF />
                    </a>
                    
                    <FaLinkedinIn />
                    <FaTwitter />
                    <FaYoutube />
                    <FaWifi />
                  </div>
                </div>
              
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <Footer />
    </div>
  );
};

export default ContactPage;