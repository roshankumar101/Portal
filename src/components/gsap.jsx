export default function SidebarCard() {
  return (
    <div className="hidden lg:block lg:w-[30%] bg-neutral-50 dark:bg-neutral-900">
      <div className="sticky top-0 h-screen p-8">
        <div className="bg-white rounded-lg shadow-lg p-6 h-full overflow-y-auto flex items-start justify-start">
          <div
            className="text-2xl md:text-3xl font-extrabold text-blue-900 bg-white px-6 py-6 rounded-lg shadow-md text-left leading-snug tracking-wide"
            style={{ whiteSpace: "pre-line", letterSpacing: ".02em", minHeight: "2.5rem" }}
          >
            YOU CAN NOT FAST FORWARD SUCCESS
            <p></p>

            BUT YOU CAN ENJOY THE TRAILER
          </div>
        </div>
      </div>
    </div>
  );
}
