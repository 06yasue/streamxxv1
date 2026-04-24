import { supabase } from '../../lib/supabaseClient';
import Link from 'next/link';

// META TAG SEO KHUSUS DMCA
export async function generateMetadata() {
  const { data: settings } = await supabase.from('settings').select('site_name').eq('id', 1).single();
  const siteName = settings?.site_name || 'Our Company';

  return {
    title: `DMCA Copyright Policy | ${siteName}`,
    description: `Read the DMCA Copyright Policy for ${siteName}. Learn how to report copyright infringements, file a takedown notice, and our procedures for handling intellectual property disputes.`,
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: `DMCA Policy - ${siteName}`,
      description: `Official Digital Millennium Copyright Act (DMCA) Policy for ${siteName}.`,
      type: 'website',
    }
  };
}

export default async function DMCAPolicyPage() {
  const { data: settings } = await supabase.from('settings').select('site_name, site_logo_url').eq('id', 1).single();
  const siteName = settings?.site_name || 'Our Company';

  return (
    <div style={{ background: '#121212', minHeight: '100vh', color: '#ccc', fontFamily: '"Jost", sans-serif', padding: '40px 15px' }}>
      
      {/* Konten Dokumen (Tanpa Box, Mengalir Natural) */}
      <div style={{ maxWidth: '800px', margin: '0 auto', lineHeight: '1.8', fontSize: '15px' }}>
        
        {/* Header Seksi */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          {settings?.site_logo_url ? (
            <img src={settings.site_logo_url} alt={siteName} style={{ maxHeight: '50px', marginBottom: '20px' }} />
          ) : (
            <div style={{ color: '#e50914', fontSize: '28px', fontWeight: 'bold', marginBottom: '20px' }}>{siteName}</div>
          )}
          <h1 style={{ color: '#fff', fontSize: '36px', fontWeight: '900', margin: '0 0 10px 0' }}>DMCA Copyright Policy</h1>
          <p style={{ color: '#888' }}>Effective Date: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>

        {/* ISI DOKUMEN DMCA FULL LEGAL ENGLISH */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          <section>
            <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: '700', marginBottom: '12px', borderLeft: '4px solid #0288d1', paddingLeft: '15px' }}>1. Introduction</h2>
            <p>
              {siteName} ("we," "us," or "our") respects the intellectual property rights of others and expects its users to do the same. In accordance with the Digital Millennium Copyright Act of 1998 (the "DMCA"), the text of which may be found on the U.S. Copyright Office website, we will respond expeditiously to claims of copyright infringement committed using the {siteName} service and/or website (the "Site") if such claims are reported to our Designated Copyright Agent identified below.
            </p>
            <p>
              This policy constitutes an integral part of our Terms of Service. By utilizing our platform, you agree to be bound by the procedures outlined herein regarding intellectual property disputes.
            </p>
          </section>

          <section>
            <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: '700', marginBottom: '12px', borderLeft: '4px solid #0288d1', paddingLeft: '15px' }}>2. Filing a DMCA Takedown Notice</h2>
            <p>
              If you are a copyright owner, authorized to act on behalf of one, or authorized to act under any exclusive right under copyright, please report alleged copyright infringements taking place on or through the Site by completing the following DMCA Notice of Alleged Infringement and delivering it to our Designated Copyright Agent.
            </p>
            <p>Upon receipt of Notice as described below, {siteName} will take whatever action, in its sole discretion, it deems appropriate, including removal of the challenged content from the Site. A formal DMCA Takedown Notice must include the following components:</p>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li><strong>Physical or Electronic Signature:</strong> Provide your physical or electronic signature as the owner or a person authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.</li>
              <li><strong>Identification of Copyrighted Work:</strong> Identify the copyrighted work claimed to have been infringed, or, if multiple copyrighted works at a single online site are covered by a single notification, a representative list of such works.</li>
              <li><strong>Identification of Infringing Material:</strong> Identify the material that is claimed to be infringing or to be the subject of infringing activity and that is to be removed or access to which is to be disabled, and information reasonably sufficient to permit us to locate the material (e.g., specific URLs).</li>
              <li><strong>Contact Information:</strong> Provide information reasonably sufficient to permit us to contact you, such as an address, telephone number, and, if available, an electronic mail address.</li>
              <li><strong>Good Faith Statement:</strong> Include a statement that you have a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law.</li>
              <li><strong>Penalty of Perjury Statement:</strong> Include a statement that the information in the notification is accurate, and under penalty of perjury, that you are authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: '700', marginBottom: '12px', borderLeft: '4px solid #0288d1', paddingLeft: '15px' }}>3. Filing a DMCA Counter-Notice</h2>
            <p>
              If you believe that your content that was removed (or to which access was disabled) is not infringing, or that you have the authorization from the copyright owner, the copyright owner's agent, or pursuant to the law, to post and use the material in your content, you may send a Counter-Notice containing the following information to our Designated Copyright Agent:
            </p>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>Your physical or electronic signature.</li>
              <li>Identification of the content that has been removed or to which access has been disabled and the location (URL) at which the content appeared before it was removed or disabled.</li>
              <li>A statement that you have a good faith belief that the content was removed or disabled as a result of mistake or a misidentification of the content.</li>
              <li>Your name, address, telephone number, and e-mail address.</li>
              <li>A statement that you consent to the jurisdiction of the federal court in which your address is located, or if your address is outside the United States, for any judicial district in which {siteName} may be found, and that you will accept service of process from the person who provided notification of the alleged infringement.</li>
            </ul>
            <p>
              If a Counter-Notice is received by the Copyright Agent, {siteName} may send a copy of the Counter-Notice to the original complaining party informing that person that it may replace the removed content or cease disabling it in 10 business days. Unless the copyright owner files an action seeking a court order against the content provider, member or user, the removed content may be replaced, or access to it restored, in 10 to 14 business days or more after receipt of the Counter-Notice, at our sole discretion.
            </p>
          </section>

          <section>
            <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: '700', marginBottom: '12px', borderLeft: '4px solid #0288d1', paddingLeft: '15px' }}>4. Repeat Infringer Policy</h2>
            <p>
              In accordance with the DMCA and other applicable law, {siteName} has adopted a policy of terminating, in appropriate circumstances and at our sole discretion, the accounts of users who are deemed to be repeat infringers. {siteName} may also at its sole discretion limit access to the Site and/or terminate the accounts of any users who infringe any intellectual property rights of others, whether or not there is any repeat infringement.
            </p>
          </section>

          <section>
            <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: '700', marginBottom: '12px', borderLeft: '4px solid #0288d1', paddingLeft: '15px' }}>5. Misrepresentations and Penalties</h2>
            <p>
              Please be aware that under Section 512(f) of the DMCA, any person who knowingly materially misrepresents that material or activity is infringing, or that material or activity was removed or disabled by mistake or misidentification, may be subject to liability for damages, including costs and attorneys' fees.
            </p>
          </section>

          <section>
            <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: '700', marginBottom: '12px', borderLeft: '4px solid #0288d1', paddingLeft: '15px' }}>6. Designated Copyright Agent Contact</h2>
            <p>
              All DMCA Takedown Notices and Counter-Notices must be delivered to our Designated Copyright Agent. Please use the contact forms or administrative emails provided on our platform to reach our legal department. Ensure that the subject line clearly indicates "DMCA Notice" to expedite processing.
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
