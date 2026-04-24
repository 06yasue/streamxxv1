import styles from './video.module.css';
import { supabase } from '../../lib/supabaseClient';

export default async function VideoLayout({ children }) {
  const { data: settings } = await supabase.from('settings').select('*').eq('id', 1).single();

  return (
    <div className={styles.videoPageBody}>
      {/* Header Flat Khusus Video */}
      <div className={styles.headerFlat}>
          {settings?.site_logo_url ? (
              <img src={settings.site_logo_url} alt="Logo" className={styles.logoImageContainer} />
          ) : (
              <div className={styles.fallbackSiteText}>{settings?.site_name}</div>
          )}
      </div>
      
      <div className={styles.mainLayoutContainer}>
        {children}
      </div>
    </div>
  );
}
