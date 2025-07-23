import React, { useState, useEffect } from 'react';
import donationDrive1Img from '../assets/images/donationDrive1Img.png'; 
import bloodAwareness2Img from '../assets/images/bloodAwareness2Img.jpg';
import volunteersWork3Img from '../assets/images/volunteersWork3Img.png';
import impactfulDonation4Img from '../assets/images/impactfulDonation4.jpg';
import campSetuU5Img from '../assets/images/campSetUp5Img.jpg';
import donorAppreciation6Img from '../assets/images/donorAppreciation6Img.jpg'; 

const GalleryPage = () => {
  const images = [
    { src: donationDrive1Img, alt: "Donation Drive 1", title: "Community Donation Drive" },
    { src: bloodAwareness2Img, alt: "Awareness Event 2", title: "Blood Awareness Campaign" },
    { src: volunteersWork3Img, alt: "Volunteer Work 3", title: "Volunteers in Action" },
    { src: impactfulDonation4Img, alt: "Success Story 4", title: "Impactful Donations" },
    { src: campSetuU5Img, alt: "Camp Setup 5", title: "Setting Up a Camp" },
    { src: donorAppreciation6Img, alt: "Donor Appreciation 6", title: "Appreciating Our Donors" },
  ];

  const [selectedImage, setSelectedImage] = useState(null);

  const openModal = (image) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  };

  const closeModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'unset'; // Restore scrolling
  };

  // Keyboard navigation for modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && selectedImage) {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage]);

  return (
    <div className="container mx-auto px-4 py-12 md:py-24 animate-fade-in">
      <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 text-center mb-12">Our <span className="text-red-600">Moments</span></h1>
      <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto mb-12">
        A visual journey through our blood donation drives, awareness programs, and the incredible impact of our community. Click on an image to view details.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {images.map((image, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform hover:scale-102 transition-transform duration-300 ease-in-out group"
            onClick={() => openModal(image)}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="p-4">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{image.title}</h3>
              <p className="text-gray-600 text-sm">{image.alt}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fade-in"
          onClick={closeModal} // Close modal when clicking outside image
        >
          <div
            className="bg-white rounded-xl shadow-2xl p-6 max-w-3xl w-full relative transform scale-95 animate-scale-in"
            onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-3xl font-bold focus:outline-none"
              aria-label="Close modal"
            >
              &times;
            </button>
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="w-full h-auto max-h-[70vh] object-contain rounded-lg mb-4"
            />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedImage.title}</h3>
            <p className="text-gray-700">{selectedImage.alt}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage; // <-- THIS LINE IS CRUCIAL
