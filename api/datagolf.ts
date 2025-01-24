import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  // Set CORS headers for all responses
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
    // Get the full path from the request
    const fullPath = req.url!.split('?')[0];
    console.log('Full request path:', fullPath);
    
    // Remove /api/datagolf from the start of the path
    const datagolfPath = fullPath.replace(/^\/api\/datagolf\/?/, '');
    console.log('DataGolf path:', datagolfPath);

    // Get all query parameters
    const queryParams = new URLSearchParams(req.url!.split('?')[1] || '');
    
    // Add required parameters
    queryParams.set('file_format', 'json');
    queryParams.set('key', 'cf5b806066038ad69a752686db8f');

    // Construct the final URL
    const datagolfUrl = `https://feeds.datagolf.com/${datagolfPath}?${queryParams.toString()}`;
    console.log('Proxying request to:', datagolfUrl);

    const response = await fetch(datagolfUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('DataGolf API error:', {
        status: response.status,
        statusText: response.statusText,
      });
      throw new Error(`DataGolf API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error in API route:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch data from DataGolf API',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
