import React from 'react'

export const adminRequest = async (path, token, options = {}) => {
  const response = await fetch(path, {
    ...options,
    headers: {
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(payload.message || payload.error || 'Request failed.')
  return payload
}

export const useAdminData = (load, dependencies = []) => {
  const [state, setState] = React.useState({ data: null, loading: true, error: '' })

  React.useEffect(() => {
    let active = true
    setState({ data: null, loading: true, error: '' })
    load().then((data) => active && setState({ data, loading: false, error: '' }))
      .catch((error) => active && setState({ data: null, loading: false, error: error.message }))
    return () => { active = false }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies)

  return state
}