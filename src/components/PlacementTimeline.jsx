"use client";

import React, { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, motion } from "motion/react";

export default function TimelineDemo() {
  const data = [
    {
      title: "Step 1",
      content: (
        <div>
          <h4 className="mb-4 text-base font-semibold text-neutral-900 dark:text-neutral-100">
            Profile Registration & Setup
          </h4>
          <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            Create your comprehensive placement portal account with academic credentials, personal information, and career preferences. Complete your professional profile to establish your digital presence within the placement ecosystem.
          </p>
        </div>
      ),
    },
    {
      title: "Step 2",
      content: (
        <div>
          <h4 className="mb-4 text-base font-semibold text-neutral-900 dark:text-neutral-100">
            Resume Upload & Documentation
          </h4>
          <p className="mb-4 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            Upload your professionally crafted resume and supporting documents including academic transcripts, certificates, and project portfolios. Ensure all documentation meets industry standards and placement requirements.
          </p>
          <ul className="list-disc list-inside space-y-1 text-xs md:text-sm text-neutral-700 dark:text-neutral-300">
            <li>Academic transcripts and degree certificates</li>
            <li>Professional resume in multiple formats</li>
            <li>Project documentation and portfolio</li>
            <li>Skill certification and training records</li>
          </ul>
        </div>
      ),
    },
    {
      title: "Step 3",
      content: (
        <div>
          <h4 className="mb-4 text-base font-semibold text-neutral-900 dark:text-neutral-100">
            Job Opportunity Discovery
          </h4>
          <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            Browse and analyze available job descriptions posted by recruiters and companies. Review role requirements, compensation packages, and company profiles to identify suitable opportunities aligned with your career objectives.
          </p>
        </div>
      ),
    },
    {
      title: "Step 4",
      content: (
        <div>
          <h4 className="mb-4 text-base font-semibold text-neutral-900 dark:text-neutral-100">
            Application Submission Process
          </h4>
          <p className="mb-4 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            Submit targeted applications for selected positions through the integrated placement portal. Customize application materials for each role and ensure compliance with specific company requirements and deadlines.
          </p>
          <div className="text-xs md:text-sm text-neutral-700 dark:text-neutral-300">
            <strong>Application Components:</strong>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Tailored resume for specific role requirements</li>
              <li>Cover letter addressing company needs</li>
              <li>Academic credentials and skill assessments</li>
              <li>Additional documentation as requested</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      title: "Step 5",
      content: (
        <div>
          <h4 className="mb-4 text-base font-semibold text-neutral-900 dark:text-neutral-100">
            Application Status Tracking
          </h4>
          <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            Monitor your application progress through the placement dashboard. Track submission confirmations, screening status updates, interview schedules, and feedback from recruiting teams in real-time.
          </p>
        </div>
      ),
    },
    {
      title: "Step 6",
      content: (
        <div>
          <h4 className="mb-4 text-base font-semibold text-neutral-900 dark:text-neutral-100">
            Administrative Coordination & Notifications
          </h4>
          <p className="mb-4 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            Receive automated notifications and administrative updates regarding interview schedules, venue information, and process modifications. Coordinate with the Training and Placement Office for seamless communication between all stakeholders.
          </p>
          <ul className="list-disc list-inside space-y-1 text-xs md:text-sm text-neutral-700 dark:text-neutral-300">
            <li>Interview schedule notifications and reminders</li>
            <li>Venue and logistics coordination updates</li>
            <li>Administrative announcements and policy changes</li>
            <li>Direct communication channels with placement officers</li>
          </ul>
        </div>
      ),
    },
    {
      title: "Step 7",
      content: (
        <div>
          <h4 className="mb-4 text-base font-semibold text-neutral-900 dark:text-neutral-100">
            Interview Process & Final Selection
          </h4>
          <p className="mb-4 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            Participate in comprehensive interview rounds including technical assessments, behavioral evaluations, and HR discussions. Navigate through multiple selection stages while maintaining professional communication with recruiters.
          </p>
          <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            Successfully complete the final selection process, receive job offers, and coordinate with placement administrators for offer management and acceptance procedures.
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="relative w-full overflow-clip">
      {/* Main flex container with 70/30 split */}
      <div className="flex">
        {/* Timeline Section - 70% */}
        <div className="w-full lg:w-[70%]">
          <Timeline data={data} />
        </div>
        
        {/* Fixed Sidebar - 30% */}
        <div className="hidden lg:block lg:w-[30%] bg-neutral-50 dark:bg-neutral-900">
          <div className="sticky top-0 h-screen p-8">
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-6 h-full overflow-y-auto">
              
              
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Timeline({ data }) {
  const ref = useRef(null);
  const containerRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div
      className="w-full bg-white dark:bg-neutral-950 font-inter md:px-10"
      ref={containerRef}
    >
      {/* Header section - constrained to timeline width */}
      <div className="max-w-5xl mx-auto py-20 px-4 md:px-8 lg:px-10">
        <h2 className="text-lg md:text-4xl mb-4 text-black dark:text-white max-w-4xl">
          Walk Through Of Placement Process
        </h2>
        <p className="text-neutral-700 dark:text-neutral-300 text-sm md:text-base max-w-lg">
          Navigate through the placement process from profile creation to final selection. Experience a streamlined approach to career opportunities through our integrated placement management system.
        </p>
      </div>

      {/* Timeline content */}
      <div ref={ref} className="relative max-w-5xl mx-auto pb-20">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex justify-start pt-10 md:pt-40 md:gap-10"
          >
            {/* Left Step Column */}
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
              <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-white dark:bg-black flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 dark:from-purple-400 dark:to-blue-400 border border-neutral-300 dark:border-neutral-700 p-2" />
              </div>
              <h3 className="hidden md:block text-xl md:pl-20 md:text-5xl font-bold text-neutral-500 dark:text-neutral-500">
                {item.title}
              </h3>
            </div>

            {/* Right Content Column */}
            <div className="relative pl-20 pr-4 md:pl-4 w-full">
              <h3 className="md:hidden block text-2xl mb-4 text-left font-bold text-neutral-500 dark:text-neutral-500">
                {item.title}
              </h3>
              {item.content}
            </div>
          </div>
        ))}

        {/* Animated timeline line */}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute left-8 md:left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-200 dark:via-neutral-700 to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
        >
          {/* Animated Scroll Line */}
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-purple-500 via-blue-500 to-transparent from-[0%] via-[10%] rounded-full"
          />
        </div>
      </div>
    </div>
  );
}
