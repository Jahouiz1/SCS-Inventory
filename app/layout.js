import './globals.css'

export const metadata = {
  title: 'Secret Card Society',
  description: 'Pokemon TCG Inventory Management',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
