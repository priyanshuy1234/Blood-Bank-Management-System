import React from 'react';
import TeamMemberCard from '../components/TeamMemberCard';
import missionImg from '../assets/images/missionImg.png';
import visionImg from '../assets/images/visionImg.png';

const AboutPage = () => (
  <div className="container mx-auto px-4 py-12 md:py-24 animate-fade-in">
    <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 text-center mb-12">About <span className="text-red-600">BloodLink</span></h1>

    <section className="mb-16 flex flex-col md:flex-row items-center md:space-x-12">
      <div className="md:w-1/2 mb-8 md:mb-0">
        <img src={missionImg} alt="Our Mission" className="rounded-xl shadow-lg w-full max-w-md h-115 object-cover transform hover:scale-102 transition-transform duration-300" />
      </div>
      <div className="md:w-1/2">
        <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-4">
          At BloodLink, our mission is to create a seamless and efficient ecosystem for blood donation and distribution. We aim to bridge the gap between voluntary blood donors and those in critical need, ensuring timely access to safe blood.
        </p>
        <p className="text-lg text-gray-700 leading-relaxed">
          We are committed to raising awareness about the importance of blood donation, simplifying the donation process, and providing robust tools for blood banks, hospitals, and medical professionals to manage their blood inventory effectively.
        </p>
      </div>
    </section>

    <section className="mb-16 flex flex-col-reverse md:flex-row items-center md:space-x-12">
      <div className="md:w-1/2">
        <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Vision</h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-4">
          We strive to be the leading platform for blood management, fostering a community of compassionate donors and efficient healthcare providers.
        </p>
        <p className="text-lg text-gray-700 leading-relaxed">
          Through continuous innovation and user-centric design, we aim to set new standards in blood bank operations, making a profound impact on public health globally.
        </p>
      </div>
      <div className="md:w-1/2 mb-8 md:mb-0">
        <img src={visionImg} alt="Our Vision" className="rounded-xl shadow-lg w-full max-w-md h-auto object-cover transform hover:scale-102 transition-transform duration-300" />
      </div>
    </section>

    <section className="team-section text-center mb-16">
      <h2 className="text-4xl font-bold text-gray-900 mb-12">Meet Our Team</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <TeamMemberCard
          name="Jane Doe"
          role="Founder & CEO"
          bio="Visionary leader passionate about healthcare technology."
          avatarText="JD"
        />
        <TeamMemberCard
          name="John Smith"
          role="Lead Developer"
          bio="Crafting robust and scalable solutions for impact."
          avatarText="JS"
        />
        <TeamMemberCard
          name="Emily White"
          role="Community Manager"
          bio="Connecting donors and promoting awareness."
          avatarText="EW"
        />
      </div>
    </section>
  </div>
);

export default AboutPage; // <-- THIS LINE IS CRUCIAL
