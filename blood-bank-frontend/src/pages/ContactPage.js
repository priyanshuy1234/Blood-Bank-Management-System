import React, { useState } from 'react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('Sending...');
    // Simulate API call
    setTimeout(() => {
      console.log('Form Data:', formData);
      setStatus('Message Sent! We will get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' }); // Clear form
    }, 2000);
  };

  return (
    <div className="container mx-auto px-4 py-12 md:py-24 animate-fade-in">
      <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 text-center mb-12">Get In <span className="text-red-600">Touch</span></h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="bg-white p-8 rounded-xl shadow-lg transform hover:translate-y-[-5px] transition-transform duration-300 ease-in-out">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Send Us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                placeholder="Your Name"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                placeholder="your.email@example.com"
                required
              />
            </div>
            <div>
              <label htmlFor="subject" className="block text-gray-700 text-sm font-bold mb-2">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                placeholder="Subject of your message"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-gray-700 text-sm font-bold mb-2">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="6"
                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                placeholder="Your message here..."
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full px-6 py-3 bg-red-600 text-white font-bold rounded-full shadow-lg hover:bg-red-700 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
            >
              {status === 'Sending...' ? 'Sending...' : 'Send Message'}
            </button>
            {status && status !== 'Sending...' && (
              <p className="mt-4 text-center text-green-600 font-semibold">{status}</p>
            )}
          </form>
        </div>

        {/* Contact Info */}
        <div className="bg-red-600 text-white p-8 rounded-xl shadow-lg flex flex-col justify-center transform hover:translate-y-[-5px] transition-transform duration-300 ease-in-out">
          <h2 className="text-3xl font-bold mb-8">Our Contact Information</h2>
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              <div>
                <p className="font-semibold">Address:</p>
                <p>123 Blood Donor Lane, Lifesaving City, LS 12345</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
              <div>
                <p className="font-semibold">Phone:</p>
                <p>+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-18 4v7a2 2 0 002 2h14a2 2 0 002-2v-7m-18 0h18"></path></svg>
              <div>
                <p className="font-semibold">Email:</p>
                <p>info@bloodlink.org</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage; // <-- THIS LINE IS CRUCIAL
