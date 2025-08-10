import React, { useState, useEffect } from "react";
import CS1 from '../assets/CS1.webp'
import CS2 from '../assets/CS2.webp'
import CS3 from '../assets/CS3.webp'

export default function AdminSlider() {
  const admins = [
    { name: "Kaiful", image: CS1 },
    { name: "Saurabh", image: CS2 },
    { name: "Vikas", image: CS3 },
    { name: "Kaiful", image: CS1 },
    { name: "Saurabh", image: CS2 },
    { name: "Vikas", image: CS3 },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const visibleCards = 3; // Show 3 at a time

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + 1 >= admins.length ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? admins.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      <div className="text-center mb-10">
        <p className="text-3xl font-bold text-gray-700" >THE TEAM</p>
        <h2 className="text-3xl font-bold text-black" >
          Office of Career Services
        </h2>
      </div>
      <div className="relative overflow-hidden rounded-2xl shadow-lg">
        {/* Slider Images */}
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateX(-${(currentIndex * 100) / visibleCards}%)`,
            width: `${(admins.length * 100) / visibleCards}%`,
          }}
        >
          {admins.map((admin, index) => (
            <div key={index} className="w-1/3 p-2">
              <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                <img
                  src={admin.image}
                  alt={admin.name}
                  className="w-full h-72 object-cover"
                />
                <div className="p-3 text-center text-lg font-semibold text-gray-800">
                  {admin.name}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-3">
          <button
            onClick={prevSlide}
            className="bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition"
          >
            ◀
          </button>
          <button
            onClick={nextSlide}
            className="bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition"
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  );
}