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
    1100: 2,
    700: 1
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
      aspect: 'landscape' // 3:2
    },
    {
      id: 4,
      img: 'https://placehold.co/600x600/f97316/white?text=Team',
      alt: 'Team working',
      imageOnly: true,
      aspect: 'square' 
    },
    {
      id: 5,
      img: 'https://placehold.co/600x900/8b5cf6/white?text=Student+3',
      alt: 'Student presenting',
      quote: 'Hiring from them has always been suspiciously easy—like they\'ve cracked some secret hiring algorithm the rest of us are still decoding ',
      author: 'David Kim',
      role: 'Marketing Specialist',
      aspect: 'portrait'
    },
    {
      id: 6,
      img: 'https://placehold.co/600x400/10b981/white?text=Campus',
      alt: 'Campus building',
      imageOnly: true,
      aspect: 'landscape' 
    }
  ];

  const aspectClasses = {
    square: 'aspect-square',
    portrait: 'aspect-[2/3]',
    landscape: 'aspect-[3/2]'
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Student Success Stories</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-2/3">
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="flex w-auto -ml-4"
            columnClassName="pl-4 bg-clip-padding"
          >
            {testimonialItems.map(item => (
              <div 
                key={item.id} 
                className={`mb-4 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 ${aspectClasses[item.aspect]}`}
              >
                <div className="relative w-full h-full group">
                  <img 
                    src={item.img} 
                    alt={item.alt}
                    className="w-full h-full object-cover"
                  />
                  
                  {!item.imageOnly && (
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                      <div className="text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        <p className="italic mb-3">"{item.quote}"</p>
                        <p className="font-semibold">{item.author}</p>
                        <p className="text-sm opacity-90">{item.role}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </Masonry>
        </div>
        
        <div className="w-full md:w-1/3">
          <div className="bg-gray-50 p-8 rounded-xl shadow-sm sticky top-4">
            <h2 className="text-2xl font-semibold mb-6 text-gray-700">Let's Collaborate and Build</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Company's Name"
                className="w-full p-3 border border-gray-200 rounded-md mb-4 focus:border-indigo-500 focus:outline-none"
                value={formData.name}
                onChange={handleChange}
                required
              />
              
              <input
                type="number"
                name="company"
                placeholder="Contact Number"
                className="w-full p-3 border border-gray-200 rounded-md mb-4 focus:border-indigo-500 focus:outline-none"
                value={formData.company}
                onChange={handleChange}
                required
              />
              
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                className="w-full p-3 border border-gray-200 rounded-md mb-4 focus:border-indigo-500 focus:outline-none"
                value={formData.email}
                onChange={handleChange}
                required
              />
              
              <textarea
                name="message"
                placeholder="Your recruitment needs"
                rows={4}
                className="w-full p-3 border border-gray-200 rounded-md mb-4 focus:border-indigo-500 focus:outline-none"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
              
              <button 
                type="submit" 
                className="w-full bg-indigo-500 text-white py-3 px-6 rounded-md hover:bg-indigo-600 transition-colors"
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