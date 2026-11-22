/**
 * API Service for WarrantyClarity AI Backend
 */

const API_BASE = '/api';

export async function checkHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Health check failed:', err);
    return { status: 'offline', error: err.message };
  }
}

export async function getSamples() {
  const res = await fetch(`${API_BASE}/samples`);
  if (!res.ok) throw new Error('Failed to fetch sample catalog');
  return await res.json();
}

export function getSampleImageUrl(sampleId) {
  return `${API_BASE}/samples/${sampleId}/image`;
}

export async function analyzeImage({ file = null, sampleId = null }) {
  const formData = new FormData();
  if (sampleId) {
    formData.append('sample_id', sampleId);
  } else if (file) {
    formData.append('file', file);
  } else {
    throw new Error('Either file or sampleId must be provided');
  }

  const res = await fetch(`${API_BASE}/analyze`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || `Analysis failed (${res.status})`);
  }

  return await res.json();
}

export async function enhanceImage({
  file = null,
  sampleId = null,
  preset = null,
  brightness = 0,
  contrast = 0,
  sharpness = 0,
  denoise = 0,
  saturation = 0,
  upscale = 1,
  autoWb = true,
  outputFormat = 'jpeg'
}) {
  const formData = new FormData();
  if (sampleId) {
    formData.append('sample_id', sampleId);
  } else if (file) {
    formData.append('file', file);
  } else {
    throw new Error('Either file or sampleId must be provided');
  }

  if (preset) formData.append('preset', preset);
  formData.append('brightness', brightness);
  formData.append('contrast', contrast);
  formData.append('sharpness', sharpness);
  formData.append('denoise', denoise);
  formData.append('saturation', saturation);
  formData.append('upscale', upscale);
  formData.append('auto_wb', autoWb ? 'true' : 'false');
  formData.append('output_format', outputFormat);

  const res = await fetch(`${API_BASE}/enhance`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || `Enhancement failed (${res.status})`);
  }

  return await res.json();
}

export async function getHistory() {
  const res = await fetch(`${API_BASE}/history`);
  if (!res.ok) throw new Error('Failed to fetch history');
  return await res.json();
}

export async function clearHistory() {
  const res = await fetch(`${API_BASE}/history`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to clear history');
  return await res.json();
}
