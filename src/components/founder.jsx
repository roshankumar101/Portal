import React, { useEffect } from 'react';

const FoundersSection = () => {
  useEffect(() => {
    const founderCards = document.querySelectorAll('.founder-card');

    founderCards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        card.querySelector('.gradient-border').style.animationPlayState = 'running';
      });
      card.addEventListener('mouseleave', () => {
        card.querySelector('.gradient-border').style.animationPlayState = 'paused';
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const border = entry.target.querySelector('.gradient-border');
          if (entry.isIntersecting) {
            border.style.animationPlayState = 'running';
          } else {
            border.style.animationPlayState = 'paused';
          }
        });
      },
      { threshold: 0.1 }
    );

    founderCards.forEach((card) => observer.observe(card));
  }, []);

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-5">
        <h2 className="text-4xl font-bold text-blue-900 mb-16 text-center relative pb-5">
          Hear From Our Founders
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-gray-400 via-white to-gray-400"></div>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 justify-items-center">
          {/* Founder 1 */}
          <div className="founder-card max-w-md flex flex-col items-center text-center">
            <div className="founder-image-container mb-6">
              <div className="gradient-border w-44 h-44 rounded-full p-1 bg-gradient-to-br from-gray-300 via-white to-gray-300 flex justify-center items-center animate-spin">
                <img
                  src="https://via.placeholder.com/300x300?text=Alakh+Pandey"
                  alt="Alakh Pandey"
                  className="w-full h-full rounded-full object-cover border-3 border-blue-900"
                />
              </div>
            </div>
            <div className="founder-content">
              <h3 className="text-2xl font-bold text-blue-900 mb-4">Alakh Pandey</h3>
              <p className="text-lg leading-relaxed text-gray-700 italic relative px-5">
                <span className="absolute -top-4 left-0 text-3xl text-gray-400">"</span>
                Our vision is to democratize quality education, making it
                accessible to every student regardless of their background or
                location.
                <span className="absolute -bottom-6 right-0 text-3xl text-gray-400">"</span>
              </p>
            </div>
          </div>

          {/* Founder 2 */}
          <div className="founder-card max-w-md flex flex-col items-center text-center">
            <div className="founder-image-container mb-6">
              <div className="gradient-border w-44 h-44 rounded-full p-1 bg-gradient-to-br from-gray-300 via-white to-gray-300 flex justify-center items-center animate-spin">
                <img
                  src="https://via.placeholder.com/300x300?text=Prateek+Maheshwari"
                  alt="Prateek Maheshwari"
                  className="w-full h-full rounded-full object-cover border-3 border-blue-900"
                />
              </div>
            </div>
            <div className="founder-content">
              <h3 className="text-2xl font-bold text-blue-900 mb-4">Prateek Maheshwari</h3>
              <p className="text-lg leading-relaxed text-gray-700 italic relative px-5">
                <span className="absolute -top-4 left-0 text-3xl text-gray-400">"</span>
                We're building an ecosystem where students don't just learn
                concepts but develop the skills to excel in competitive
                environments.
                <span className="absolute -bottom-6 right-0 text-3xl text-gray-400">"</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .gradient-border {
          animation: rotateGradient 8s linear infinite;
          animation-play-state: paused;
        }

        @keyframes rotateGradient {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 100% 50%;
          }
        }

        .founder-card:hover .gradient-border {
          animation-play-state: running;
        }

        @media (max-width: 768px) {
          .gradient-border {
            width: 150px;
            height: 150px;
          }
        }

        @media (max-width: 480px) {
          .gradient-border {
            width: 130px;
            height: 130px;
          }
        }
      `}</style>
    </section>
  );
};

export default FoundersSection;