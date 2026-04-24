import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="navbar navbar-inverse" style={{ borderRadius: 0, marginBottom: '20px', border: 'none' }}>
      <div className="container-custom">
        <div className="navbar-header">
          <Link href="/" className="navbar-brand" style={{ color: '#fff', fontWeight: 'bold' }}>
            🎬 WebVideoKu
          </Link>
        </div>
        <ul className="nav navbar-nav navbar-right" style={{ paddingRight: '15px' }}>
          <li><Link href="/upload" style={{ color: '#ccc' }}>Upload</Link></li>
          <li><Link href="/settings" style={{ color: '#ccc' }}>Setting</Link></li>
        </ul>
      </div>
    </nav>
  );
}
