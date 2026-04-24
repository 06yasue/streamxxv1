import { supabase } from '../../lib/supabaseClient';
import Link from 'next/link';

// META TAG SEO KHUSUS PRIVACY POLICY
export async function generateMetadata() {
  const { data: settings } = await supabase.from('settings').select('site_name').eq('id', 1).single();
  const siteName = settings?.site_name || 'Our Company';

  return {
    title: `Privacy Policy | ${siteName}`,
    description: `Learn how ${siteName} collects, uses, and protects your personal data. Read our comprehensive Privacy Policy to understand your rights and our commitment to data security.`,
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: `Privacy Policy - ${siteName}`,
      description: `Official Privacy Policy and Data Protection guidelines for ${siteName}.`,
      type: 'website',
    }
  };
}

export default async function PrivacyPolicyPage() {
  const { data: settings } = await supabase.from('settings').select('site_name, site_logo_url').eq('id', 1).single();
  const siteName = settings?.site_name || 'Our Company';

  return (
    <div style={{ background: '#121212', minHeight: '100vh', color: '#ccc', fontFamily: '"Jost", sans-serif', padding: '40px 15px' }}>
      
      {/* Konten Dokumen (Tanpa Box) */}
      <div style={{ maxWidth: '800px', margin: '0 auto', lineHeight: '1.8', fontSize: '15px' }}>
        
        {/* Header Seksi */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          {settings?.site_logo_url ? (
            <img src={settings.site_logo_url} alt={siteName} style={{ maxHeight: '50px', marginBottom: '20px' }} />
          ) : (
            <div style={{ color: '#e50914', fontSize: '28px', fontWeight: 'bold', marginBottom: '20px' }}>{siteName}</div>
          )}
          <h1 style={{ color: '#fff', fontSize: '36px', fontWeight: '900', margin: '0 0 10px 0' }}>Privacy Policy</h1>
          <p style={{ color: '#888' }}>Effective Date: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>

        {/* ISI DOKUMEN LEGAL */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          <section>
            <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: '700', marginBottom: '12px', borderLeft: '4px solid #e50914', paddingLeft: '15px' }}>1. Introduction and Scope</h2>
            <p>
              At {siteName}, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy outlines how we collect, use, disclose, and safeguard your data when you visit our website and use our digital streaming services. By accessing our platform, you consent to the data practices described in this statement.
            </p>
            <p>
              This policy applies to all information collected through our Service, as well as any related services, sales, marketing, or events. We encourage you to read this policy carefully to understand our views and practices regarding your personal data and how we will treat it.
            </p>
          </section>

          <section>
            <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: '700', marginBottom: '12px', borderLeft: '4px solid #e50914', paddingLeft: '15px' }}>2. Information We Collect</h2>
            <p>We collect information that you provide directly to us when you register for an account, upload content, or communicate with us. This may include:</p>
            <ul style={{ paddingLeft: '20px' }}>
              <li><strong>Personal Identifiers:</strong> Name, email address, and account credentials.</li>
              <li><strong>User-Generated Content:</strong> Videos, descriptions, and metadata you upload to our platform.</li>
              <li><strong>Device Information:</strong> IP address, browser type, operating system, and hardware specifications.</li>
              <li><strong>Usage Data:</strong> Information on how you interact with our videos, including watch history and preferences.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: '700', marginBottom: '12px', borderLeft: '4px solid #e50914', paddingLeft: '15px' }}>3. How We Use Your Information</h2>
            <p>The information we collect is used to provide, maintain, and improve our Service. Specifically, we use your data to:</p>
            <ul style={{ paddingLeft: '20px' }}>
              <li>Facilitate account creation and authentication processes.</li>
              <li>Deliver the requested video content and manage your storage allocations.</li>
              <li>Personalize your user experience and provide tailored recommendations.</li>
              <li>Communicate with you regarding updates, security alerts, and administrative messages.</li>
              <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: '700', marginBottom: '12px', borderLeft: '4px solid #e50914', paddingLeft: '15px' }}>4. Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. Cookies are small data files stored on your device that help us improve our Service and your experience, see which areas and features of our Service are popular, and count visits.
            </p>
            <p>
              Most web browsers are set to accept cookies by default. If you prefer, you can usually choose to set your browser to remove cookies and to reject cookies. Please note that if you choose to remove or reject cookies, this could affect the availability and functionality of our Service.
            </p>
          </section>

          <section>
            <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: '700', marginBottom: '12px', borderLeft: '4px solid #e50914', paddingLeft: '15px' }}>5. Third-Party Advertising and Analytics</h2>
            <p>
              We may allow third parties to provide analytics services and serve advertisements on our behalf across the internet and in applications. These entities may use cookies, web beacons, device identifiers, and other technologies to collect information about your use of the Service and other websites.
            </p>
            <p>
              This information may be used by {siteName} and others to, among other things, analyze and track data, determine the popularity of certain content, deliver advertising and content targeted to your interests on our Service and other websites, and better understand your online activity.
            </p>
          </section>

          <section>
            <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: '700', marginBottom: '12px', borderLeft: '4px solid #e50914', paddingLeft: '15px' }}>6. Data Retention and Security</h2>
            <p>
              We retain personal information we collect from you where we have an ongoing legitimate business need to do so (for example, to provide you with a service you have requested or to comply with applicable legal, tax, or accounting requirements).
            </p>
            <p>
              We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.
            </p>
          </section>

          <section>
            <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: '700', marginBottom: '12px', borderLeft: '4px solid #e50914', paddingLeft: '15px' }}>7. Your Privacy Rights (GDPR & CCPA)</h2>
            <p>
              Depending on your location, you may have certain rights under applicable data protection laws. These may include the right to request access and obtain a copy of your personal information, to request rectification or erasure, and to restrict the processing of your personal information.
            </p>
            <p>
              If we are relying on your consent to process your personal information, you have the right to withdraw your consent at any time. To exercise any of these rights, please contact us using the information provided below. We will consider and act upon any request in accordance with applicable data protection laws.
            </p>
          </section>

          <section>
            <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: '700', marginBottom: '12px', borderLeft: '4px solid #e50914', paddingLeft: '15px' }}>8. Children's Privacy</h2>
            <p>
              Our Service is not intended for use by children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that a child under 13 has provided us with personal information, we will take steps to delete such information from our files as soon as possible.
            </p>
          </section>

          <section>
            <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: '700', marginBottom: '12px', borderLeft: '4px solid #e50914', paddingLeft: '15px' }}>9. International Data Transfers</h2>
            <p>
              Your information, including personal data, may be transferred to — and maintained on — computers located outside of your state, province, country, or other governmental jurisdiction where the data protection laws may differ from those of your jurisdiction. Your consent to this Privacy Policy followed by your submission of such information represents your agreement to that transfer.
            </p>
          </section>

          <section>
            <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: '700', marginBottom: '12px', borderLeft: '4px solid #e50914', paddingLeft: '15px' }}>10. Contact Us</h2>
            <p>
              If you have any questions or comments about this Privacy Policy, please contact us at our official support channels. We are dedicated to resolving any issues regarding your privacy and the handling of your personal data in a timely and transparent manner.
            </p>
          </section>

        </div>

        {/* Footer Minimalis */}
        <div style={{ marginTop: '60px', paddingTop: '20px', borderTop: '1px solid #222', textAlign: 'center', fontSize: '14px', color: '#555' }}>
          <p>&copy; {new Date().getFullYear()} {siteName}. All Rights Reserved.</p>
          <div style={{ marginTop: '10px' }}>
             <Link href="/" style={{ color: '#0288d1', textDecoration: 'none' }}>&larr; Back to Home</Link>
          </div>
        </div>

      </div>
    </div>
  );
}
