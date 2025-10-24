import Link from 'next/link'

export default function ThankYou() {
  return (
    <main className="py-16 text-center max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Thank you!</h1>
      <p className="text-gray-600 mb-8">Your payment was received. You will get an email confirmation and your audit will start shortly.</p>
      <Link href="/" className="btn">Back to Home</Link>
    </main>
  )
}
