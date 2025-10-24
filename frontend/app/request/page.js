"use client"

import { useState } from 'react'
import { apiGet, apiPost } from '../../lib/api'
import Link from 'next/link'

export default function RequestPage() {
  const [form, setForm] = useState({ name: '', email: '', website: '', notes: '' })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      await apiPost('/requests/', form)
      const { url } = await apiGet('/requests/stripe-checkout')
      setMessage('Saved. Redirecting to payment...')
      window.location.href = url
    } catch (err) {
      setMessage('Something went wrong. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="py-12 max-w-2xl mx-auto">
      <Link href="/" className="text-primary">← Back</Link>
      <h1 className="text-3xl font-bold mt-4 mb-6">Request an SEO Audit</h1>
      <form onSubmit={onSubmit} className="card p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Website URL *</label>
          <input name="website" required type="url" placeholder="https://example.com" className="w-full border rounded-md p-2" value={form.website} onChange={onChange} />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name *</label>
            <input name="name" required type="text" className="w-full border rounded-md p-2" value={form.name} onChange={onChange} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email *</label>
            <input name="email" required type="email" className="w-full border rounded-md p-2" value={form.email} onChange={onChange} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Notes or goals (optional)</label>
          <textarea name="notes" rows="4" className="w-full border rounded-md p-2" value={form.notes} onChange={onChange} />
        </div>
        <button type="submit" className="btn" disabled={loading}>{loading ? 'Submitting...' : 'Submit and Pay'}</button>
        {message && <p className="text-sm text-gray-600">{message}</p>}
      </form>
      <p className="text-xs text-gray-500 mt-4">Price: €79 (single product via Stripe).</p>
    </main>
  )
}
