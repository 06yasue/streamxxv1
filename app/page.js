import Navbar from '../components/Navbar';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="container-custom text-center" style={{ marginTop: '100px' }}>
        <h1 style={{ fontWeight: 'bold', color: '#e50914' }}>Selamat Datang</h1>
        <p style={{ color: '#aaa', fontSize: '18px', marginBottom: '30px' }}>Kelola koleksi video pribadimu dengan mudah.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
          <Link href="/list"><button className="btn btn-danger btn-lg">Lihat Daftar Video</button></Link>
          <Link href="/upload"><button className="btn btn-default btn-lg" style={{ background: '#333', color: '#fff', border: 'none' }}>Upload Baru</button></Link>
        </div>
      </div>
    </>
  );
}
