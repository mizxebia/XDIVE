export async function executeSQL(query: string, parameters = {}) {
    const response = await fetch('http://localhost:8000/api/query/sql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, parameters }),
    });
  
    if (!response.ok) {
      throw new Error('SQL execution failed');
    }
  
    return response.json();
  }
  