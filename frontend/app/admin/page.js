"use client"

import { useEffect, useState } from 'react'
import { apiGet, apiPatch, apiUpload, apiPost } from '../../lib/api'

export default function AdminPage() {
  const [token, setToken] = useState('')
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [authed, setAuthed] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('admin_token')
    if (saved) {
      setToken(saved)
    }
  }, [])

  async function load() {
    if (!token) return
    setLoading(true)
    setError('')
    try {
      const data = await apiGet('/admin/requests', { headers: { 'x-admin-token': token } })
      setRequests(data)
      localStorage.setItem('admin_token', token)
      setAuthed(true)
    } catch (e) {
      setError('Failed to load. Check token and backend.')
      setAuthed(false)
    } finally {
      setLoading(false)
    }
  }

  async function setPayment(reqId, status) {
    await apiPatch(`/admin/requests/${reqId}`, { payment_status: status }, { headers: { 'x-admin-token': token } })
    await load()
  }

  async function setAudit(reqId, status) {
    await apiPatch(`/admin/requests/${reqId}`, { audit_status: status }, { headers: { 'x-admin-token': token } })
    await load()
  }

  async function uploadReport(reqId, file) {
    await apiUpload(`/admin/requests/${reqId}/upload`, file, 'pdf', { headers: { 'x-admin-token': token } })
    await load()
  }

  async function sendReport(reqId) {
    await apiPost(`/admin/requests/${reqId}/send-report`, {}, { headers: { 'x-admin-token': token } })
    alert('Email sent (or logged in backend if SMTP not configured).')
  }

  return (
    <main className="py-12">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {!authed && (
        <div className="card p-6 max-w-xl">
          <h2 className="font-semibold mb-2">Enter admin token</h2>
          <p className="text-sm text-gray-600 mb-4">Use the secret token from your backend environment.</p>
          <div className="flex items-center gap-2">
            <input
              placeholder="Admin token"
              className="border rounded-md p-2 w-full"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
            <button className="btn" onClick={load} disabled={!token || loading}>{loading ? 'Checking...' : 'Enter'}</button>
          </div>
          {error && <div className="text-red-600 mt-2 text-sm">{error}</div>}
        </div>
      )}

      {authed && (
      <div className="overflow-auto">
        <table className="min-w-full bg-white border rounded-md">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="p-3 border">ID</th>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Website</th>
              <th className="p-3 border">Notes</th>
              <th className="p-3 border">Payment</th>
              <th className="p-3 border">Audit</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r.id} className="border-t align-top">
                <td className="p-3 border">{r.id}</td>
                <td className="p-3 border">{r.name}</td>
                <td className="p-3 border">{r.email}</td>
                <td className="p-3 border"><a className="text-primary" href={r.website} target="_blank">{r.website}</a></td>
                <td className="p-3 border max-w-sm">{r.notes}</td>
                <td className="p-3 border">
                  <div className="text-sm mb-2">{r.payment_status}</div>
                  <div className="flex gap-2">
                    <button className="text-xs px-2 py-1 rounded bg-gray-200" onClick={() => setPayment(r.id, 'pending')}>Pending</button>
                    <button className="text-xs px-2 py-1 rounded bg-green-500 text-white" onClick={() => setPayment(r.id, 'paid')}>Paid</button>
                    <button className="text-xs px-2 py-1 rounded bg-yellow-500 text-white" onClick={() => setPayment(r.id, 'refunded')}>Refunded</button>
                  </div>
                </td>
                <td className="p-3 border">
                  <div className="text-sm mb-2">{r.audit_status}</div>
                  <div className="flex gap-2">
                    <button className="text-xs px-2 py-1 rounded bg-gray-200" onClick={() => setAudit(r.id, 'queued')}>Queued</button>
                    <button className="text-xs px-2 py-1 rounded bg-blue-500 text-white" onClick={() => setAudit(r.id, 'in_progress')}>Start Audit</button>
                    <button className="text-xs px-2 py-1 rounded bg-purple-500 text-white" onClick={() => setAudit(r.id, 'review')}>Review</button>
                    <button className="text-xs px-2 py-1 rounded bg-green-600 text-white" onClick={() => setAudit(r.id, 'completed')}>Completed</button>
                  </div>
                </td>
                <td className="p-3 border">
                  <div className="space-y-2">
                    <label className="block text-sm">Upload PDF</label>
                    <input type="file" accept="application/pdf" onChange={(e) => e.target.files[0] && uploadReport(r.id, e.target.files[0])} />
                    <button className="text-xs px-3 py-2 rounded bg-primary text-white" onClick={() => sendReport(r.id)}>Send Report</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
    </main>
  )
}
