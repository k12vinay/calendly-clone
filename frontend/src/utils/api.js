const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:4000";

const handleResponse = async (response) => {
  if (!response.ok) {
    const message = await response.json().catch(() => ({}));
    throw new Error(message.message || "Request failed");
  }
  if (response.status === 204) return null;
  return response.json();
};

export const getEventTypes = () =>
  fetch(`${API_URL}/api/event-types`).then(handleResponse);

export const createEventType = (payload) =>
  fetch(`${API_URL}/api/event-types`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then(handleResponse);

export const updateEventType = (id, payload) =>
  fetch(`${API_URL}/api/event-types/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then(handleResponse);

export const deleteEventType = (id) =>
  fetch(`${API_URL}/api/event-types/${id}`, {
    method: "DELETE",
  }).then(handleResponse);

export const getAvailability = () =>
  fetch(`${API_URL}/api/availability`).then(handleResponse);

export const updateAvailability = (payload) =>
  fetch(`${API_URL}/api/availability`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then(handleResponse);

export const getSlots = ({ date, eventTypeId, slug }) => {
  const params = new URLSearchParams();
  if (date) params.set("date", date);
  if (eventTypeId) params.set("eventTypeId", eventTypeId);
  if (slug) params.set("slug", slug);
  return fetch(`${API_URL}/api/bookings/slots?${params}`).then(handleResponse);
};

export const createBooking = (payload) =>
  fetch(`${API_URL}/api/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then(handleResponse);

export const getMeetings = (status) =>
  fetch(`${API_URL}/api/meetings?status=${status}`).then(handleResponse);

export const cancelMeeting = (id) =>
  fetch(`${API_URL}/api/meetings/${id}/cancel`, {
    method: "POST",
  }).then(handleResponse);

export const getEventTypeBySlug = async (slug) => {
  const all = await getEventTypes();
  return all.find((item) => item.slug === slug);
};

export const getOverride = (date) =>
  fetch(`${API_URL}/api/overrides/${date}`).then(handleResponse);

export const setOverride = (date, payload) =>
  fetch(`${API_URL}/api/overrides/${date}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then(handleResponse);

export const deleteOverride = (date) =>
  fetch(`${API_URL}/api/overrides/${date}`, {
    method: "DELETE",
  }).then(handleResponse);
