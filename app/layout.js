export const metadata = {
  title: 'Video Hosting',
  description: 'Web Video Pribadi',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
        <style dangerouslySetInnerHTML={{__html: `
          body { background-color: #121212; color: #ffffff; margin: 0; padding: 0; font-family: Arial, sans-serif; }
          .container-custom { width: 100%; padding: 0 10px; }
          @media (min-width: 768px) { .container-custom { max-width: 750px; margin: 0 auto; padding: 15px; } }
          @media (min-width: 992px) { .container-custom { max-width: 970px; } }
          @media (min-width: 1200px) { .container-custom { max-width: 1170px; } }
          
          .custom-notification {
            position: fixed; bottom: 20px; right: 20px; background: #2b2b2b; color: #fff;
            padding: 15px 25px; border-left: 4px solid #e50914; border-radius: 4px;
            z-index: 9999; display: none; box-shadow: 0 4px 6px rgba(0,0,0,0.5);
          }
          .custom-notification.show { display: block; }
        `}} />
      </head>
      <body>
        {children}
        <div id="notification-bar" className="custom-notification"></div>
      </body>
    </html>
  )
}
