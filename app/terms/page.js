import { supabase } from '../../lib/supabaseClient';
import Link from 'next/link';

// META TAG KHUSUS HALAMAN TERMS OF SERVICE
export async function generateMetadata() {
  const { data: settings } = await supabase.from('settings').select('site_name').eq('id', 1).single();
  const siteName = settings?.site_name || 'Our Company';

  return {
    title: `Terms of Service | ${siteName}`,
    description: `Read the Terms of Service and user agreements for ${siteName}. Understand your rights, responsibilities, and our policies regarding the use of our platform.`,
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: `Terms of Service - ${siteName}`,
      description: `Official Terms of Service and legal agreements for using ${siteName}.`,
      type: 'website',
    }
  };
}

export default async function TermsOfServicePage() {
  const { data: settings } = await supabase.from('settings').select('site_name, site_logo_url').eq('id', 1).single();
  const siteName = settings?.site_name || 'Our Company';

  return (
    <div style={{ background: '#121212', minHeight: '100vh', color: '#ccc', fontFamily: '"Jost", sans-serif', padding: '40px 15px' }}>
      
      {/* Container Teks Polos (Tanpa Box) */}
      <div style={{ maxWidth: '800px', margin: '0 auto', lineHeight: '1.8', fontSize: '15px' }}>
        
        {/* Header Simple */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          {settings?.site_logo_url ? (
            <img src={settings.site_logo_url} alt={siteName} style={{ maxHeight: '50px', marginBottom: '20px' }} />
          ) : (
            <div style={{ color: '#e50914', fontSize: '28px', fontWeight: 'bold', marginBottom: '20px' }}>{siteName}</div>
          )}
          <h1 style={{ color: '#fff', fontSize: '36px', fontWeight: '900', margin: '0 0 10px 0' }}>Terms of Service</h1>
          <p style={{ color: '#888' }}>Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>

        {/* ISI TERMS OF SERVICE FULL LEGAL ENGLISH */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          
          <section>
            <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: '700', marginBottom: '10px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>1. Acceptance of Terms</h2>
            <p>
              Welcome to {siteName} ("we," "our," or "us"). By accessing, browsing, downloading, or using our website, platform, applications, and any associated services (collectively, the "Service"), you acknowledge that you have read, understood, and agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms in their entirety, you are expressly prohibited from using our Service and must discontinue use immediately. These Terms constitute a legally binding agreement between you and {siteName}.
            </p>
            <p>
              We reserve the right, at our sole and absolute discretion, to change, modify, add, or remove portions of these Terms at any time without prior direct notice to you. It is your responsibility to check these Terms periodically for changes. Your continued use of the Service following the posting of changes will mean that you accept and agree to the changes.
            </p>
          </section>

          <section>
            <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: '700', marginBottom: '10px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>2. Description of Service</h2>
            <p>
              {siteName} provides a digital platform that allows users to upload, store, share, and stream digital video content. The Service is provided on an "AS IS" and "AS AVAILABLE" basis. We assume no responsibility for the timeliness, deletion, mis-delivery, or failure to store any user communications or personalization settings. You are responsible for obtaining access to the Service, and that access may involve third-party fees (such as Internet service provider or airtime charges).
            </p>
          </section>

          <section>
            <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: '700', marginBottom: '10px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>3. User Registration and Security</h2>
            <p>
              To access certain features of the Service, you may be required to register for an account. You agree to provide true, accurate, current, and complete information about yourself as prompted by the Service's registration form. If you provide any information that is untrue, inaccurate, not current, or incomplete, we have the right to suspend or terminate your account and refuse any and all current or future use of the Service.
            </p>
            <p>
              You are entirely responsible for maintaining the confidentiality of your password and account. Furthermore, you are entirely responsible for any and all activities that occur under your account. You agree to notify {siteName} immediately of any unauthorized use of your account or any other breach of security. We will not be liable for any loss that you may incur as a result of someone else using your password or account, either with or without your knowledge.
            </p>
          </section>

          <section>
            <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: '700', marginBottom: '10px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>4. User Conduct and Acceptable Use</h2>
            <p>
              You understand that all information, data, text, software, music, sound, photographs, graphics, video, messages, tags, or other materials ("Content"), whether publicly posted or privately transmitted, are the sole responsibility of the person from whom such Content originated. This means that you, and not {siteName}, are entirely responsible for all Content that you upload, post, email, transmit or otherwise make available via the Service.
            </p>
            <p>You agree to not use the Service to:</p>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>Upload, post, transmit or otherwise make available any Content that is unlawful, harmful, threatening, abusive, harassing, tortious, defamatory, vulgar, obscene, libelous, invasive of another's privacy, hateful, or racially, ethnically or otherwise objectionable;</li>
              <li>Harm minors in any way;</li>
              <li>Impersonate any person or entity, or falsely state or otherwise misrepresent your affiliation with a person or entity;</li>
              <li>Upload, post, transmit or otherwise make available any Content that you do not have a right to make available under any law or under contractual or fiduciary relationships;</li>
              <li>Upload, post, transmit or otherwise make available any Content that infringes any patent, trademark, trade secret, copyright or other proprietary rights of any party;</li>
              <li>Interfere with or disrupt the Service or servers or networks connected to the Service.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: '700', marginBottom: '10px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>5. Copyright and DMCA Policy</h2>
            <p>
              {siteName} respects the intellectual property of others, and we ask our users to do the same. We have adopted and implemented a policy respecting copyright law that provides for the removal of any infringing materials and for the termination, in appropriate circumstances, of users of our online Service who are repeat infringers of intellectual property rights.
            </p>
            <p>
              If you believe that your work has been copied in a way that constitutes copyright infringement, please provide our Copyright Agent with the following information in accordance with the Digital Millennium Copyright Act (DMCA): an electronic or physical signature of the person authorized to act on behalf of the owner of the copyright interest; a description of the copyrighted work that you claim has been infringed; a description of where the material that you claim is infringing is located on the Site; your address, telephone number, and email address.
            </p>
          </section>

          <section>
            <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: '700', marginBottom: '10px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>6. Disclaimer of Warranties</h2>
            <p style={{ textTransform: 'uppercase' }}>
              YOU EXPRESSLY UNDERSTAND AND AGREE THAT YOUR USE OF THE SERVICE IS AT YOUR SOLE RISK. THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. {siteName} AND ITS SUBSIDIARIES, AFFILIATES, OFFICERS, EMPLOYEES, AGENTS, PARTNERS AND LICENSORS EXPRESSLY DISCLAIM ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT.
            </p>
            <p>
              {siteName} makes no warranty that (i) the Service will meet your requirements; (ii) the Service will be uninterrupted, timely, secure or error-free; (iii) the results that may be obtained from the use of the Service will be accurate or reliable; or (iv) any errors in the software will be corrected.
            </p>
          </section>

          <section>
            <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: '700', marginBottom: '10px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>7. Limitation of Liability</h2>
            <p style={{ textTransform: 'uppercase' }}>
              YOU EXPRESSLY UNDERSTAND AND AGREE THAT {siteName} SHALL NOT BE LIABLE TO YOU FOR ANY PUNITIVE, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR EXEMPLARY DAMAGES, INCLUDING, BUT NOT LIMITED TO, DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE, DATA OR OTHER INTANGIBLE LOSSES (EVEN IF {siteName} HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES), RESULTING FROM: (a) THE USE OR THE INABILITY TO USE THE SERVICE; (b) UNAUTHORIZED ACCESS TO OR ALTERATION OF YOUR TRANSMISSIONS OR DATA; (c) STATEMENTS OR CONDUCT OF ANY THIRD PARTY ON THE SERVICE; OR (d) ANY OTHER MATTER RELATING TO THE SERVICE.
            </p>
          </section>

          <section>
            <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: '700', marginBottom: '10px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>8. Indemnification</h2>
            <p>
              You agree to indemnify and hold {siteName} and its subsidiaries, affiliates, officers, agents, employees, partners and licensors harmless from any claim or demand, including reasonable attorneys' fees, made by any third party due to or arising out of Content you submit, post, transmit, modify or otherwise make available through the Service, your use of the Service, your connection to the Service, your violation of the Terms, or your violation of any rights of another.
            </p>
          </section>

          <section>
            <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: '700', marginBottom: '10px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>9. Governing Law</h2>
            <p>
              These Terms and the relationship between you and {siteName} shall be governed by the laws of the applicable jurisdiction without regard to its conflict of law provisions. You and {siteName} agree to submit to the personal and exclusive jurisdiction of the courts located within the applicable legal district.
            </p>
          </section>

          <section>
            <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: '700', marginBottom: '10px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>10. Contact Information</h2>
            <p>
              If you have any questions or concerns regarding these Terms of Service, or if you need to report a violation of these rules, please contact our legal department or support team through the contact options provided on our platform. We aim to address all legal and policy inquiries promptly and professionally.
            </p>
          </section>

        </div>

        {/* Footer Khusus Halaman Legal */}
        <div style={{ marginTop: '60px', paddingTop: '20px', borderTop: '1px solid #222', textAlign: 'center', fontSize: '14px', color: '#555' }}>
          <p>&copy; {new Date().getFullYear()} {siteName}. All Rights Reserved.</p>
          <div style={{ marginTop: '10px' }}>
             <Link href="/" style={{ color: '#0288d1', textDecoration: 'none' }}>&larr; Return to Homepage</Link>
          </div>
        </div>

      </div>
    </div>
  );
}
