import React from 'react';

const PlacementRecords = () => {
  // Sample data for 60 cards (3 rows of 20)
  const cards = Array(60).fill({
    name: "John Doe",
    company: "Tech Corp",
    role: "Software Engineer",
    linkedin: "#",
    email: "#",
    profileImg: "https://via.placeholder.com/30",
    companyLogo: "https://via.placeholder.com/30"
  });

  return (
    <div className="px-20 py-6 text-center">
      <h2 className="mb-8 text-2xl font-bold">Our placement records</h2>
      
      <div className="flex flex-col gap-3">
        {/* Three rows of 20 cards each */}
        {[0, 1, 2].map(row => (
          <div key={`row-${row}`} className="flex flex-row overflow-x-auto gap-4 pb-2">
            {cards.slice(row * 20, (row + 1) * 20).map((card, index) => (
              <Card key={`card-${row}-${index}`} data={card} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

// Card component
const Card = ({ data }) => {
  return (
    <div className="relative w-[185px] h-[151px] border border-gray-300 rounded-lg p-2 flex flex-col overflow-hidden hover:shadow-md transition-shadow flex-shrink-0 group bg-gray-50">
      {/* Brand logo - top right corner */}
      <div className="absolute top-2 right-2">
        <img 
          src={data.companyLogo} 
          alt="Company Logo" 
          className="w-6 h-6"
        />
      </div>
      
      {/* Profile photo - centered at 20% from top */}
      <div className="flex justify-center mb-3" style={{ marginTop: 'calc(20% - 20px)' }}>
        <div className="flex flex-col items-center">
          <img 
            src={data.profileImg} 
            alt="Profile" 
            className="w-8 h-8 rounded-full"
          />
        </div>
      </div>
      
      {/* Name and company info */}
      <div className="flex flex-col items-center gap-1 mb-1">
        <div className="w-full text-sm font-medium truncate text-center">{data.name}</div>
        <div className="w-full text-sm text-gray-600 truncate text-center">{data.company}</div>
      </div>
      
      {/* LinkedIn and email logos (visible on card hover) */}
      <div className="flex justify-between gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-4 relative">
        <a href={data.linkedin} className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-100 text-blue-600 hover:text-blue-800 shadow transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
          </svg>
        </a>
        <a href={`mailto:${data.email}`} className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 text-gray-600 hover:text-gray-800 shadow transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12.713l-11.985-9.713h23.97l-11.985 9.713zm0 2.574l-12-9.725v15.438h24v-15.438l-12 9.725z"/>
          </svg>
        </a>
      </div>
    </div>
  );
};

export default PlacementRecords;