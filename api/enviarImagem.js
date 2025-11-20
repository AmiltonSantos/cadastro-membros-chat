// api/enviarImagem.js
export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end(); // sem corpo, apenas OK
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const body = req.body; // { nome, imageBase64, imageType, filename }

    // URL do seu Apps Script Web App 
    const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw5O6aZTy6IzamrjaY0FRgKdCYRfDy2y7ccSGdaePphZ1vPbeWlCll87p0efb1gWpVYSg/exec';

    // Repassa para o Apps Script
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    // Retorna JSON para o front-end
    res.setHeader('Access-Control-Allow-Origin', '*'); // importante para CORS
    return res.status(200).json(data);

  } catch (err) {
    console.error('Erro ao enviar para Apps Script:', err);
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(500).json({ success: false, error: err.toString() });
  }
}
