import './globals.css'

export const metadata = {
  title: 'ERWIN OS',
  description: 'Persönliches Entwicklungssystem – Erwin Adelmann',
  icons: {
    icon: 'https://masterclass.mentaltraining.at/wp-content/uploads/2026/02/cropped-mental-270x270.jpeg',
    apple: 'https://masterclass.mentaltraining.at/wp-content/uploads/2026/02/cropped-mental-270x270.jpeg',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <head>
        <link rel="icon" href="https://masterclass.mentaltraining.at/wp-content/uploads/2026/02/cropped-mental-270x270.jpeg" />
        <link rel="apple-touch-icon" href="https://masterclass.mentaltraining.at/wp-content/uploads/2026/02/cropped-mental-270x270.jpeg" />
      </head>
      <body>{children}</body>
    </html>
  )
}
