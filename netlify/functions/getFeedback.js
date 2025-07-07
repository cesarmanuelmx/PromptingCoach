// netlify/functions/getFeedback.js
exports.handler = async function (event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { coachPrompt } = JSON.parse(event.body);
    const apiKey = process.env.GEMINI_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const fetch = (await import('node-fetch')).default;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: coachPrompt }] }]
      })
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`API Error: ${response.statusText} - ${errorBody}`);
    }

    const result = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };

  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};