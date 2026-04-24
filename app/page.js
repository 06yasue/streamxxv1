"use client";
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Home() {
  const [settings, setSettings] = useState(null);
  const [uploadState, setUploadState] = useState('idle'); // 'idle' | 'loading' | 'done'
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    async function loadSettings() {
      const { data } = await supabase.from('settings').select('*').eq('id', 1).single();
      if (data) setSettings(data);
    }
    loadSettings();
  }, []);

  const siteName = settings?.site_name || 'WebVideoKu';
  const logoUrl = settings?.site_logo_url || null;
  const offerLink = settings?.offer_link || '#';

  // LOGIKA FAKE UPLOAD (Super Realistis)
  const handleFakeUpload = () => {
    // 1. Pura-pura buka file manager biar user makin yakin
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/mp4,video/x-m4v,video/*';
    
    input.onchange = () => {
      // 2. Pas file dipilih, mulai loading progresif palsu
      setUploadState('loading');
      setProgress(0);
      
      let currentProgress = 0;
      const interval = setInterval(() => {
        // Nambah progres random biar kelihatan natural
        currentProgress += Math.floor(Math.random() * 15) + 5; 
        
        if (currentProgress >= 100) {
          setProgress(100);
          clearInterval(interval);
          // 3. Jeda sedikit setelah 100% lalu ubah ke tombol Create Account
          setTimeout(() => {
            setUploadState('done');
          }, 800);
        } else {
          setProgress(currentProgress);
        }
      }, 500); // Kecepatan loading
    };
    
    input.click();
  };

  return (
    <div style={{ background: '#121212', minHeight: '100vh', color: '#fff', fontFamily: '"Jost", sans-serif' }}>
      
      {/* HERO SECTION (Tanpa Navbar) */}
      <div style={{ paddingTop: '80px', paddingBottom: '50px', textAlign: 'center', paddingLeft: '15px', paddingRight: '15px' }}>
        <h1 style={{ fontSize: '38px', fontWeight: '900', marginBottom: '15px', letterSpacing: '1px' }}>
          Unlimited Free Video Hosting
        </h1>
        <p style={{ fontSize: '18px', color: '#aaa', maxWidth: '600px', margin: '0 auto 40px auto', lineHeight: '1.6' }}>
          Upload, store, and share your videos in stunning HD quality. Secure, fast, and 100% free forever.
        </p>

        {/* AREA FAKE UPLOAD BOX */}
        <div style={{ background: '#1a1a1a', maxWidth: '500px', margin: '0 auto', padding: '40px 20px', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', border: '1px solid #333' }}>
          
          {uploadState === 'idle' && (
            <>
              <span className="material-icons notranslate" style={{ fontSize: '60px', color: '#0288d1', marginBottom: '15px' }}>cloud_upload</span>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '22px', fontWeight: 'bold' }}>Select Video to Upload</h3>
              <p style={{ color: '#888', fontSize: '14px', marginBottom: '25px' }}>Max file size: 5GB. Formats: MP4, AVI, MKV.</p>
              <button 
                onClick={handleFakeUpload}
                style={{ background: '#e50914', color: '#fff', border: 'none', padding: '15px 40px', fontSize: '16px', fontWeight: 'bold', borderRadius: '30px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(229, 9, 20, 0.4)', transition: '0.3s', width: '100%', maxWidth: '300px' }}
              >
                BROWSE FILES
              </button>
            </>
          )}

          {uploadState === 'loading' && (
            <div style={{ textAlign: 'left', maxWidth: '400px', margin: '0 auto' }}>
              <h3 style={{ margin: '0 0 15px 0', fontSize: '18px', textAlign: 'center', color: '#fff' }}>Uploading Video... {progress}%</h3>
              <div style={{ width: '100%', background: '#333', borderRadius: '20px', height: '15px', overflow: 'hidden' }}>
                <div style={{ width: `${progress}%`, background: '#0288d1', height: '100%', transition: 'width 0.5s ease-out' }}></div>
              </div>
              <p style={{ textAlign: 'center', color: '#888', fontSize: '13px', marginTop: '15px' }}>Please do not close this window.</p>
            </div>
          )}

          {uploadState === 'done' && (
            <>
              <span className="material-icons notranslate" style={{ fontSize: '60px', color: '#1db954', marginBottom: '15px' }}>check_circle</span>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '22px', fontWeight: 'bold', color: '#fff' }}>Upload Completed!</h3>
              <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '25px' }}>To generate your video link and start streaming, please create a free account.</p>
              
              {/* TOMBOL OFFER LINK */}
              <a href={offerLink} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <button style={{ background: '#1db954', color: '#fff', border: 'none', padding: '15px 40px', fontSize: '16px', fontWeight: 'bold', borderRadius: '30px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(29, 185, 84, 0.4)', width: '100%', maxWidth: '300px' }}>
                  CREATE FREE ACCOUNT
                </button>
              </a>
            </>
          )}
        </div>
      </div>

      {/* FEATURES SECTION */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '30px', padding: '40px 15px', background: '#0f0f0f', borderTop: '1px solid #222' }}>
        <div style={{ textAlign: 'center', maxWidth: '250px' }}>
          <span className="material-icons notranslate" style={{ fontSize: '40px', color: '#0288d1', marginBottom: '10px' }}>speed</span>
          <h4 style={{ fontWeight: 'bold', fontSize: '18px' }}>Lightning Fast</h4>
          <p style={{ color: '#888', fontSize: '14px' }}>Global CDN ensures your videos load instantly anywhere in the world.</p>
        </div>
        <div style={{ textAlign: 'center', maxWidth: '250px' }}>
          <span className="material-icons notranslate" style={{ fontSize: '40px', color: '#e50914', marginBottom: '10px' }}>security</span>
          <h4 style={{ fontWeight: 'bold', fontSize: '18px' }}>100% Secure</h4>
          <p style={{ color: '#888', fontSize: '14px' }}>Your content is encrypted and safe. You control who sees your videos.</p>
        </div>
        <div style={{ textAlign: 'center', maxWidth: '250px' }}>
          <span className="material-icons notranslate" style={{ fontSize: '40px', color: '#1db954', marginBottom: '10px' }}>storage</span>
          <h4 style={{ fontWeight: 'bold', fontSize: '18px' }}>Unlimited Storage</h4>
          <p style={{ color: '#888', fontSize: '14px' }}>Never worry about running out of space. Upload as much as you want.</p>
        </div>
      </div>

      {/* SEO ARTICLE SECTION (ENGLISH) */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 15px', color: '#ccc', lineHeight: '1.8' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '20px', color: '#fff', textAlign: 'center' }}>
          The Best Platform for Your Video Content
        </h2>
        <p style={{ marginBottom: '20px' }}>
          Welcome to <strong>{siteName}</strong>, the premier destination for seamless content delivery. In today's digital era, finding a reliable and fast platform to store your visual media is crucial. <strong>{siteName}</strong> provides state-of-the-art infrastructure designed for creators, businesses, and everyday users who demand excellence without compromise.
        </p>
        <p style={{ marginBottom: '20px' }}>
          Our global servers ensure zero buffering and crystal-clear high-definition playback. Whether you are sharing moments with family, delivering a presentation to clients, or broadcasting your creativity to the world, <strong>{siteName}</strong> scales with your needs. Experience the freedom of unlimited bandwidth and unparalleled privacy features that give you complete control over your media.
        </p>
        <p>
          Join thousands of satisfied users who trust <strong>{siteName}</strong> as their primary media backbone. Our intuitive interface allows you to manage your files effortlessly from any device—desktop or mobile. Start your journey with us today and discover why we are the top choice for modern digital storage.
        </p>
      </div>

      {/* FOOTER AREA (Sesuai Permintaan) */}
      <footer style={{ background: '#0a0a0a', padding: '40px 15px', borderTop: '1px solid #222', textAlign: 'center' }}>
        {/* LOGO DI FOOTER */}
        <div style={{ marginBottom: '25px' }}>
          {logoUrl ? (
            <img src={logoUrl} alt={siteName} style={{ maxHeight: '45px', objectFit: 'contain' }} />
          ) : (
            <span style={{ fontSize: '24px', fontWeight: '900', color: '#e50914', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <span className="material-icons notranslate">movie</span> {siteName}
            </span>
          )}
        </div>

        {/* LINK TERMS, PRIVACY, DLL */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', marginBottom: '20px' }}>
          <a href="#" style={{ color: '#888', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }} onMouseOver={(e)=>e.target.style.color='#fff'} onMouseOut={(e)=>e.target.style.color='#888'}>Terms of Service</a>
          <a href="#" style={{ color: '#888', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }} onMouseOver={(e)=>e.target.style.color='#fff'} onMouseOut={(e)=>e.target.style.color='#888'}>Privacy Policy</a>
          <a href="#" style={{ color: '#888', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }} onMouseOver={(e)=>e.target.style.color='#fff'} onMouseOut={(e)=>e.target.style.color='#888'}>DMCA</a>
          <a href="#" style={{ color: '#888', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }} onMouseOver={(e)=>e.target.style.color='#fff'} onMouseOut={(e)=>e.target.style.color='#888'}>Contact Us</a>
        </div>
        
        <p style={{ color: '#555', fontSize: '12px', margin: 0 }}>
          &copy; {new Date().getFullYear()} {siteName}. All rights reserved.
        </p>
      </footer>

    </div>
  );
}
