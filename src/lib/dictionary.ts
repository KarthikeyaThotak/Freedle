/**
 * Fetches word definition from Dictionary API
 * API endpoint: https://api.dictionaryapi.dev/api/v2/entries/en/<word>
 * @param word - The word to look up
 * @returns Promise<string> - The definition of the word
 */
export async function fetchWordDefinition(word: string): Promise<string> {
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch definition: ${response.status}`);
    }

    const data = await response.json();
    
    // The API returns an array of entries
    if (!data || !Array.isArray(data) || data.length === 0) {
      throw new Error('No definition found');
    }

    // Get the first entry
    const entry = data[0];
    
    // Get the first meaning/definition
    if (entry.meanings && entry.meanings.length > 0) {
      const firstMeaning = entry.meanings[0];
      if (firstMeaning.definitions && firstMeaning.definitions.length > 0) {
        return firstMeaning.definitions[0].definition;
      }
    }

    throw new Error('No definition found in response');
  } catch (error) {
    console.error('Error fetching word definition:', error);
    throw error;
  }
}

