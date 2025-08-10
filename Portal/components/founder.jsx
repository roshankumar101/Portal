import { useState } from 'react';
import Masonry from 'react-masonry-css';

const TestimonialGallery = () => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', company: '', email: '', message: '' });
  };

  const breakpointColumnsObj = {
    default: 3,
    1200: 3,
    900: 2,
    600: 1
  };

  const testimonialItems = [
    {
      id: 1,
      img: 'https://placehold.co/600x600/6366f1/white?text=Student+1',
      alt: 'Happy graduate',
      quote: 'Hiring from them has always felt less like a transaction and more like discovering a hidden talent gem—shiny, valuable, and instantly impressive',
      author: 'Sarah Johnson',
      role: 'Software Engineer',
      aspect: 'square' // 1:1
    },
    {
      id: 2,
      img: 'https://placehold.co/600x900/ec4899/white?text=Office',
      alt: 'Office environment',
      imageOnly: true,
      aspect: 'portrait' // 2:3
    },
    {
      id: 3,
      img: 'https://placehold.co/600x400/14b8a6/white?text=Student+2',
      alt: 'Business professional',
      quote: 'Working with them is like having a recruitment cheat code every role gets filled with that perfect candidate ',
      author: 'Priya Patel',
      role: 'Data Analyst',
      aspect: 'square' // 1:1
    },
    {
      id: 4,
      img: 'https://placehold.co/600x600/f97316/white?text=Team',
      alt: 'Team working',
      imageOnly: true,
      aspect: 'portrait' 
    },
    {
      id: 5,
      img: 'https://placehold.co/600x900/8b5cf6/white?text=Student+3',
      alt: 'Student presenting',
      quote: 'Hiring from them has always been suspiciously easy—like they\'ve cracked some secret hiring algorithm the rest of us are still decoding ',
      author: 'David Kim',
      role: 'Marketing Specialist',
      aspect: 'square'
    },
    {
      id: 6,
      img: 'https://placehold.co/600x400/10b981/white?text=Campus',
      alt: 'Campus building',
      imageOnly: true,
      aspect: 'portrait' 
    }
  ];

  const aspectClasses = {
    square: 'aspect-square',
    portrait: 'aspect-[2/3]',
    landscape: 'aspect-[3/2]'
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-6 sm:mb-8 lg:mb-10 text-gray-800">Student Success Stories</h1>
      
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        <div className="w-full lg:w-2/3">
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="flex w-auto sm:-ml-4"
            columnClassName="pl-2 sm:pl-4 bg-clip-padding"
          >
            {testimonialItems.map(item => (
              <div 
                key={item.id} 
                className={`mb-2 sm:mb-4 rounded-lg sm:rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 ${aspectClasses[item.aspect]}`}
              >
                <div className="relative w-full h-full group">
                  <img 
                    src={item.img} 
                    alt={item.alt}
                    className="w-full h-full object-cover"
                  />
                  
                  {!item.imageOnly && (
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3 sm:p-6 active:opacity-100">
                      <div className="text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        <p className="italic mb-2 sm:mb-3 text-sm sm:text-base leading-relaxed">"{item.quote}"</p>
                        <p className="font-semibold text-sm sm:text-base">{item.author}</p>
                        <p className="text-xs sm:text-sm opacity-90">{item.role}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </Masonry>
        </div>
        
        <div className="w-full lg:w-1/3  mb-2 sm:mb-3 lg:mb-5">
          <div id="contact-form" className="sticky top-[10%] bg-gray-50 p-4 sm:p-6 lg:p-8 rounded-lg sm:rounded-xl shadow-md">
            <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-gray-700">Let's Collaborate and Build</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Company's Name"
                className="w-full p-2 sm:p-3 border border-gray-200 rounded-md mb-2 sm:mb-3 focus:border-indigo-500 focus:outline-none text-sm sm:text-base"
                value={formData.name}
                onChange={handleChange}
                required
              />
              
              <input
                type="text"
                name="company"
                placeholder="Contact Number"
                className="w-full p-2 sm:p-3 border border-gray-200 rounded-md mb-2 sm:mb-3 focus:border-indigo-500 focus:outline-none text-sm sm:text-base"
                value={formData.company}
                onChange={handleChange}
                required
              />
              
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                className="w-full p-2 sm:p-3 border border-gray-200 rounded-md mb-3 sm:mb-4 focus:border-indigo-500 focus:outline-none text-sm sm:text-base"
                value={formData.email}
                onChange={handleChange}
                required
              />
              
              <textarea
                name="message"
                placeholder="Your recruitment needs"
                rows={3}
                className="w-full p-2 sm:p-3 border border-gray-200 rounded-md mb-4 sm:mb-5 focus:border-indigo-500 focus:outline-none text-sm sm:text-base sm:rows-4"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
              
              <button 
                type="submit" 
                className="w-full bg-indigo-500 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-md hover:bg-indigo-600 transition-colors text-sm sm:text-base font-medium"
              >
                Contact Placement Team
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialGallery;