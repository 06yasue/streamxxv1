import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', textAlign: 'center', backgroundColor: '#050505' }}>
      <div>
        <h1 style={{ fontSize: '100px', margin: '0', color: '#e50914', lineHeight: '1' }}>🎬 404</h1>
        <h2 style={{ color: '#fff', marginTop: '15px' }}>Video Tidak Ditemukan</h2>
        <Link href="/">
          <button className="btn btn-danger btn-lg" style={{ marginTop: '20px', borderRadius: '2px' }}>Kembali</button>
        </Link>
      </div>
    </div>
  );
}
