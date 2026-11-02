import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get query parameters
    const { engine, q, api_key, num, gl, hl } = req.query;

    // Build SerpAPI URL
    const params = new URLSearchParams({
      engine: engine as string,
      q: q as string,
      api_key: api_key as string,
      num: num as string,
      gl: gl as string,
      hl: hl as string,
    });

    const serpApiUrl = `https://serpapi.com/search?${params}`;

    // Fetch from SerpAPI
    const response = await fetch(serpApiUrl);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('SerpAPI Error:', response.status, errorText);
      return res.status(response.status).json({ 
        error: `SerpAPI Error: ${response.statusText}`,
        details: errorText 
      });
    }

    const data = await response.json();
    
    // Return the data
    return res.status(200).json(data);
  } catch (error) {
    console.error('Proxy Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
