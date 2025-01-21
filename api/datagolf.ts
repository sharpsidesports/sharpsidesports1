import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  const { pathname, searchParams } = new URL(req.url!, `https://${req.headers.host}`);
  
  // Add the API key to the query parameters
  searchParams.append('key', 'cf5b806066038ad69a752686db8f');
  searchParams.append('file_format', 'json');

  try {
    const response = await fetch(`https://feeds.datagolf.com${pathname}?${searchParams.toString()}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    return res.status(200).json(data);
  } catch (error) {
    console.error('Error proxying request:', error);
    return res.status(500).json({ error: 'Failed to fetch data from DataGolf API' });
  }
}
