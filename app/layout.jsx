import './globals.css'

export const metadata = {
  title: 'ERWIN OS',
  description: 'Persönliches Entwicklungssystem – Erwin Adelmann',
}

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  )
}
