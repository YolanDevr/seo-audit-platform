import Link from 'next/link'

const LOGO = process.env.NEXT_PUBLIC_LOGO_TEXT || 'Yolan Devriendt — SEO Audits'
const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'hello@example.com'
const SOCIAL_TW = process.env.NEXT_PUBLIC_SOCIAL_TW || 'https://twitter.com/'
const SOCIAL_LI = process.env.NEXT_PUBLIC_SOCIAL_LI || 'https://www.linkedin.com/'

export default function Home() {
  return (
    <main className="py-16">
      <header className="flex items-center justify-between py-6">
        <div className="text-xl font-bold text-primary">{LOGO}</div>
        <Link href="/request" className="btn">Request an Audit</Link>
      </header>

      <section className="text-center py-20">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">SEO Audit Platform</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
          Request a professional SEO audit focused on structure, content, and search intent.
        </p>
        <Link href="/request" className="btn">Request an Audit</Link>
      </section>

      <section className="grid md:grid-cols-3 gap-6">
        <div className="card p-6">
          <h3 className="font-semibold mb-2">Website structure analysis</h3>
          <p className="text-gray-600">Crawl, internal linking, indexability, and technical foundations.</p>
        </div>
        <div className="card p-6">
          <h3 className="font-semibold mb-2">On-page SEO and meta data review</h3>
          <p className="text-gray-600">Titles, meta descriptions, headings, schema, and content quality.</p>
        </div>
        <div className="card p-6">
          <h3 className="font-semibold mb-2">Actionable recommendations in a clear PDF report</h3>
          <p className="text-gray-600">Prioritized checklist and next steps to improve your visibility.</p>
        </div>
      </section>

      <footer className="py-12 text-center text-gray-600">
        <p>Contact: <a className="text-primary" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p>
        <div className="mt-2 space-x-4">
          <a className="text-primary" href={SOCIAL_TW} target="_blank">Twitter</a>
          <a className="text-primary" href={SOCIAL_LI} target="_blank">LinkedIn</a>
        </div>
      </footer>
    </main>
  )
}
