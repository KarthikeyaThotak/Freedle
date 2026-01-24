export type Difficulty = 'easy' | 'hard';

/**
 * Fetches a random word based on difficulty
 * Easy: https://random-word-api.vercel.app/api?words=1
 * Hard: https://random-word-api.herokuapp.com/word
 * @param difficulty - 'easy' or 'hard'
 * @returns Promise<string> - The word in uppercase
 */
export async function fetchRandomWord(difficulty: Difficulty = 'hard'): Promise<string> {
  try {
    const apiUrl = difficulty === 'easy' 
      ? 'https://random-word-api.vercel.app/api?words=1'
      : 'https://random-word-api.herokuapp.com/word';

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch word: ${response.status}`);
    }

    const data: string[] = await response.json();
    
    // Both APIs return an array with one word
    if (!data || !Array.isArray(data) || data.length === 0) {
      throw new Error('Invalid response format from API');
    }

    const word = data[0];
    if (!word || typeof word !== 'string') {
      throw new Error('Invalid word in API response');
    }

    return word.toUpperCase();
  } catch (error) {
    console.error(`Error fetching word from ${difficulty} API:`, error);
    // Re-throw to let caller handle fallback
    throw error;
  }
}

/**
 * @deprecated Use fetchRandomWord instead
 * Fetches a random word from the Random Word API (hard mode)
 */
export async function fetchRandomWordFromWordnik(): Promise<string> {
  return fetchRandomWord('hard');
}

