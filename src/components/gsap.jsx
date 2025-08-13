import sidebarImg from '../assets/sidebar.jpg';

export default function SidebarCard() {
  return (
    <div className="hidden lg:block lg:w-[30%] bg-neutral-50 dark:bg-neutral-900">
      <div className="sticky top-0 h-screen p-8 flex flex-col items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center justify-center" style={{ minHeight: '400px' }}>
          
          <div className="bg-white rounded-lg shadow-xl p-2 pb-6 flex flex-col items-center" style={{ border: '8px solid white', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', transform: 'rotate(-2deg)', maxWidth: '260px' }}>
            <img src={sidebarImg} alt="Polaroid" className="w-56 h-64 object-cover rounded-md mb-4" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }} />
            <span className="text-center w-full block" style={{ fontFamily: 'Caveat, cursive', fontSize: '1.35rem', color: '#1e293b', fontWeight: 600, letterSpacing: '.02em' }}>
              Have Patience<br />Even the Rome wasn't built in a day!
            </span>
          </div>
          
          <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@600&display=swap" rel="stylesheet" />
        </div>
      </div>
    </div>
  );
}
