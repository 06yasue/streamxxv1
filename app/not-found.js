import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center', 
      background: '#121212', 
      padding: '20px', 
      color: '#ffffff',
      textAlign: 'center'
    }}>
      
      {/* SVG ANIMASI / ILUSTRASI ROLL FILM RUSAK */}
      <div style={{ marginBottom: '20px' }}>
        <svg 
          width="120" 
          height="120" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="#e50914" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          {/* Kotak Roll Film */}
          <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
          <line x1="7" y1="2" x2="7" y2="22"></line>
          <line x1="17" y1="2" x2="17" y2="22"></line>
          
          {/* Lubang Film Kiri */}
          <line x1="2" y1="7" x2="7" y2="7"></line>
          <line x1="2" y1="12" x2="7" y2="12"></line>
          <line x1="2" y1="17" x2="7" y2="17"></line>
          
          {/* Lubang Film Kanan */}
          <line x1="17" y1="7" x2="22" y2="7"></line>
          <line x1="17" y1="12" x2="22" y2="12"></line>
          <line x1="17" y1="17" x2="22" y2="17"></line>
          
          {/* Tanda Silang (X) di Tengah Film */}
          <path d="M10 10l4 4m0-4l-4 4"></path>
        </svg>
      </div>

      <h1 style={{ 
        fontSize: '64px', 
        fontWeight: '900', 
        margin: '0 0 5px 0', 
        color: '#ffffff', 
        letterSpacing: '2px',
        textShadow: '0 4px 15px rgba(229, 9, 20, 0.4)' 
      }}>
        404
      </h1>
      
      <h2 style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 15px 0', color: '#e50914' }}>
        Page Not Found
      </h2>
      
      <p style={{ color: '#888', fontSize: '16px', maxWidth: '400px', marginBottom: '35px', lineHeight: '1.6' }}>
        Oops! The video or page you are looking for does not exist, has been moved, or is temporarily unavailable.
      </p>

      <Link href="/" style={{ textDecoration: 'none' }}>
        <button style={{ 
          background: '#0288d1', /* Biru Premium biar serasi sama tombol lain */
          color: '#fff', 
          border: 'none', 
          padding: '12px 30px', 
          fontSize: '16px', 
          fontWeight: 'bold', 
          borderRadius: '4px', 
          cursor: 'pointer', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          transition: 'background-color 0.3s'
        }}>
          <span className="material-icons notranslate" translate="no">home</span> 
          Back to Homepage
        </button>
      </Link>

    </div>
  );
}
