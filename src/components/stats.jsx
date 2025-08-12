import React from "react";
import {
  FaTrophy,
  FaCalendarAlt,
  FaHandshake,
  FaRupeeSign,
  FaRocket,
  FaChartLine,
} from "react-icons/fa";

const stats = [
  {
    label: "Highest CTC Offered",
    value: "₹45 LPA",
    icon: <FaTrophy className="text-yellow-600 text-4xl" />,
    bgColor: "#FFEEC3",
    borderColor: "#f8dba9",
  },
  {
    label: "Placement Drives",
    value: "85",
    icon: <FaCalendarAlt className="text-yellow-600 text-3xl" />,
    bgColor: "#fec89a",
    borderColor: "#f8bfa9",
  },
  {
    label: "Exclusive Recruiters",
    value: "12",
    icon: <FaHandshake className="text-yellow-600 text-3xl" />,
    bgColor: "#ffb4a2",
    borderColor: "#f7b8ae",
  },
  {
    label: "Average CTC",
    value: "₹8.5 LPA",
    icon: <FaRupeeSign className="text-yellow-600 text-3xl" />,
    bgColor: "#FFEEC3",
    borderColor: "#f8dba9",
  },
  {
    label: "Ventures Launched",
    value: "7",
    icon: <FaRocket className="text-yellow-600 text-3xl" />,
    bgColor: "#ffb4a2",
    borderColor: "#f7b8ae",
  },
  {
    label: "Placement Percentage",
    value: "92%",
    icon: <FaChartLine className="text-yellow-600 text-3xl" />,
    bgColor: "#fec89a",
    borderColor: "#f8bfa9",
  },
];

const MasonryStats = () => (
  <section className="bg-[#FFEEC3] flex items-center justify-center px-6 py-10">
    <div className="max-w-6xl w-full">
      {/* Heading */}
      <h2 className="text-4xl font-bold mb-8 text-gray-900 text-center">
        Heard the Why —{" "}
        <span
          className="px-1 bg-gradient-to-t from-yellow-400 to-yellow-400 bg-no-repeat
          [background-size:100%_25%] [background-position:0_100%] 
          transition-all duration-300 ease-in-out 
          hover:[background-size:100%_100%] hover:[background-position:0_100%]"
        >
          Here’s the WoW!
        </span>
      </h2>

      {/* Grid Layout */}
      <div className="grid grid-cols-4 gap-6">
        {/* Tall Long Card */}
        <div
          className="rounded-xl p-8 flex flex-col items-center justify-center shadow-md col-span-1 row-span-2"
          style={{
            backgroundColor: stats[0].bgColor,
            border: `1px solid ${stats[0].borderColor}`,
          }}
        >
          {stats[0].icon}
          <span className="text-5xl font-extrabold text-orange-700 mt-4">
            {stats[0].value}
          </span>
          <span className="text-lg font-medium text-gray-800 mt-2">
            {stats[0].label}
          </span>
        </div>

        {/* Top row - 3 small cards */}
        {stats.slice(1, 4).map((stat, index) => (
          <div
            key={index}
            className="rounded-xl shadow-sm p-6 flex flex-col items-center justify-center text-center"
            style={{
              backgroundColor: stat.bgColor,
              border: `1px solid ${stat.borderColor}`,
            }}
          >
            {stat.icon}
            <span className="text-3xl font-bold text-gray-900 mt-3">
              {stat.value}
            </span>
            <span className="text-sm font-medium text-gray-700">
              {stat.label}
            </span>
          </div>
        ))}

        {/* Second row - 2 medium cards */}
        {stats.slice(4).map((stat, index) => (
          <div
            key={index}
            className="rounded-xl shadow-sm p-8 flex flex-col items-center justify-center text-center"
            style={{
              backgroundColor: stat.bgColor,
              border: `1px solid ${stat.borderColor}`,
            }}
          >
            {stat.icon}
            <span className="text-3xl font-bold text-gray-900 mt-3">
              {stat.value}
            </span>
            <span className="text-sm font-medium text-gray-700">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default MasonryStats;
