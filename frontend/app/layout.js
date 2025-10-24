import './globals.css'

export const metadata = {
  title: 'SEO Audit Platform',
  description: 'Request a professional SEO audit focused on structure, content, and search intent.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <div className="max-w-6xl mx-auto px-4">{children}</div>
      </body>
    </html>
  )
}
