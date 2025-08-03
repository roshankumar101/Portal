import React from 'react';
import NewsImage1 from '../assets/N5.jpg';
import NewsImage2 from '../assets/N7.jpg';
import NewsImage3 from '../assets/N6.jpg';
import NewsImage4 from '../assets/N5.jpg';

const RecruitersSection = () => {
  const newsImages = [
    { src: NewsImage1, alt: "News 1", rotation: -2 },
    { src: NewsImage2, alt: "News 2", rotation: 3 },
    { src: NewsImage3, alt: "News 3", rotation: -1 },
    { src: NewsImage4, alt: "News 4", rotation: 2 }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden w-full">
      <div className="w-full px-4 lg:px-8">
        <h2 className="text-3xl lg:text-4xl font-bold text-blue-900 mb-3 text-center relative pb-5">
          Hear From Our Recruiters
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-gray-400 via-white to-gray-400"></div>
        </h2>
  
        {/* Cards Container */}
        <div className="relative mb-3 w-full overflow-hidden">
          <div className="flex justify-center items-center min-h-[400px] lg:min-h-[500px] w-full">
            <div className="relative w-full max-w-7xl">
              {/* Background table effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl shadow-lg transform rotate-1 scale-95 opacity-20"></div>
              
              {/* Cards container with horizontal scroll */}
              <div className="relative z-10 flex items-center h-[400px] lg:h-[500px] w-full overflow-x-auto scrollbar-hide">
                <div className="flex items-center space-x-8 lg:space-x-12 px-8 lg:px-12 min-w-max">
                  {newsImages.map((news, index) => (
                    <div
                      key={index}
                      className="relative transition-all duration-700 ease-out flex-shrink-0"
                      style={{
                        transform: `rotate(${news.rotation}deg)`,
                        transformOrigin: 'center center',
                      }}
                    >
                      <div className="relative">
                        <img
                          src={news.src}
                          alt={news.alt}
                          className="w-52 h-auto lg:w-64 xl:w-76 rounded-lg shadow-2xl border-4 border-white transition-all duration-700 hover:scale-110 hover:z-30"
                          style={{
                            filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.15))',
                          }}
                        />
                        
                        {/* Random creases and folds effect */}
                        <div className="absolute inset-0 pointer-events-none">
                          <div className="absolute top-1/4 left-1/3 w-1 h-16 bg-gray-300 opacity-30 transform rotate-12"></div>
                          <div className="absolute bottom-1/3 right-1/4 w-1 h-12 bg-gray-300 opacity-20 transform -rotate-8"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
  
              {/* Floating elements to enhance table effect */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-amber-300 rounded-full opacity-60 animate-bounce"></div>
              <div className="absolute -bottom-6 -right-6 w-6 h-6 bg-amber-400 rounded-full opacity-40 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecruitersSection;