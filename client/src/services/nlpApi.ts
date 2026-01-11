import axios from 'axios';

const API_BASE = 'http://localhost:8000';

export async function askAnalyticsQuestion(question: string) {
  const res = await axios.post(
    `${API_BASE}/api/v1/generate-sql`,
    { query: question },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!res.data) {
    throw new Error('Empty response from AI service');
  }

  if (res.data.error) {
    throw new Error(res.data.error);
  }

  return res.data;
}
