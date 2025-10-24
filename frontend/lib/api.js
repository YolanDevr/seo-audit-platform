export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000'

export async function apiGet(path, opts = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(opts.headers || {}),
    },
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function apiPost(path, body, opts = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      ...(opts.headers || {}),
    },
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function apiPatch(path, body, opts = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      ...(opts.headers || {}),
    },
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function apiUpload(path, file, fieldName = 'pdf', opts = {}) {
  const formData = new FormData()
  formData.append(fieldName, file)
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    body: formData,
    headers: {
      ...(opts.headers || {}),
    },
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}
