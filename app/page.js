import Navbar from '../components/Navbar';

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="container-custom">
        <h3 className="text-center" style={{marginTop: '40px'}}>Sistem Siap</h3>
        <p className="text-center text-muted">Daftar video akan dimuat di sini.</p>
      </div>
    </>
  )
}
