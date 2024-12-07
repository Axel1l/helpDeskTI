const BASE_URL = '/api'

export async function fetchApi(endpoint, options = {}) {
  try {
    const url = `${BASE_URL}${endpoint}`
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('API request failed:', error)
    throw error
  }
}

export const apiClient = {
  // Tickets
  getTickets: () => fetchApi('/tickets'),
  getTicket: (id) => fetchApi(`/tickets/${id}`),
  createTicket: (data) => fetchApi('/tickets', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateTicket: (id, data) => fetchApi(`/tickets/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteTicket: (id) => fetchApi(`/tickets/${id}`, {
    method: 'DELETE',
  }),

  // Users
  getUsers: () => fetchApi('/users'),
  createUser: (data) => fetchApi('/users', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
}