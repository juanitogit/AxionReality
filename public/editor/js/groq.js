export async function askGroq(systemPrompt, userPrompt) {
  try {
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ systemPrompt, userPrompt })
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Error from AI proxy');
    }
    return data.result;
  } catch (err) {
    console.error('Error en askGroq:', err);
    throw err;
  }
}
