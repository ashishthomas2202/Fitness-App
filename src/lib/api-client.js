// src/lib/api-client.js
export const api = {
    // Weight Operations
    weights: {
      create: async (data) => {
        const res = await fetch('/api/record/weight/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        return res.json();
      },
      getAll: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        const res = await fetch(`/api/record/weight?${queryString}`);
        return res.json();
      },
      getOne: async (id) => {
        const res = await fetch(`/api/record/weight/${id}/get`);
        return res.json();
      },
      update: async (id, data) => {
        const res = await fetch(`/api/record/weight/${id}/update`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        return res.json();
      },
      delete: async (id) => {
        const res = await fetch(`/api/record/weight/${id}/delete`, {
          method: 'DELETE'
        });
        return res.json();
      }
    },
  
    // Measurement Operations
    measurements: {
      create: async (data) => {
        const res = await fetch('/api/measurements', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        return res.json();
      },
      getAll: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        const res = await fetch(`/api/measurements?${queryString}`);
        return res.json();
      },
      getOne: async (id) => {
        const res = await fetch(`/api/measurements/${id}`);
        return res.json();
      },
      getLatest: async () => {
        const res = await fetch('/api/measurements/latest');
        return res.json();
      },
      update: async (id, data) => {
        const res = await fetch(`/api/measurements/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        return res.json();
      },
      delete: async (id) => {
        const res = await fetch(`/api/measurements/${id}`, {
          method: 'DELETE'
        });
        return res.json();
      }
    },
  
    // Photo Operations
    photos: {
      upload: async (file, type) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);
        
        const res = await fetch('/api/photos', {
          method: 'POST',
          body: formData
        });
        return res.json();
      },
      getAll: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        const res = await fetch(`/api/photos?${queryString}`);
        return res.json();
      },
      getOne: async (id) => {
        const res = await fetch(`/api/photos/${id}`);
        return res.json();
      },
      compare: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        const res = await fetch(`/api/photos/compare?${queryString}`);
        return res.json();
      },
      update: async (id, data) => {
        const res = await fetch(`/api/photos/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        return res.json();
      },
      delete: async (id) => {
        const res = await fetch(`/api/photos/${id}`, {
          method: 'DELETE'
        });
        return res.json();
      }
    },
  
    // User Preferences
    preferences: {
      update: async (data) => {
        const res = await fetch('/api/user/preferences', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        return res.json();
      }
    }
  };