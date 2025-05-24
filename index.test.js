// index.test.js
const { getMistralResponse, OLLAMA_API_URL, OLLAMA_MODEL, OLLAMA_MAX_TOKENS } = require('./index');
const fetch = require('node-fetch');

// Mock node-fetch
jest.mock('node-fetch', () => jest.fn());

describe('getMistralResponse', () => {
  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    fetch.mockClear();
    // Reset console spies if any were set up
    // jest.spyOn(console, 'error').mockClear();
    // jest.spyOn(console, 'warn').mockClear();
  });

  test('should return the response from Ollama on successful API call', async () => {
    const mockPrompt = 'Hello, Mistral!';
    const mockApiResponse = { response: 'Hello, User!' };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponse,
    });

    const response = await getMistralResponse(mockPrompt);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(OLLAMA_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt: mockPrompt,
        stream: false,
        max_tokens: OLLAMA_MAX_TOKENS,
      }),
    });
    expect(response).toBe(mockApiResponse.response);
  });

  test('should return "Prompt cannot be empty." for an empty prompt string', async () => {
    const response = await getMistralResponse('');
    expect(response).toBe('Prompt cannot be empty.');
    expect(fetch).not.toHaveBeenCalled();
  });

  test('should return "Prompt cannot be empty." for a whitespace-only prompt', async () => {
    const response = await getMistralResponse('   ');
    expect(response).toBe('Prompt cannot be empty.');
    expect(fetch).not.toHaveBeenCalled();
  });
  
  test('should return "Prompt cannot be empty." for a null prompt', async () => {
    const response = await getMistralResponse(null);
    expect(response).toBe('Prompt cannot be empty.');
    expect(fetch).not.toHaveBeenCalled();
  });

  test('should return user-friendly message for API error (non-ok response)', async () => {
    const mockPrompt = 'Test prompt';
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {}); // Suppress console.error for this test
    
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      text: async () => 'Server error details', // Mock for errorBody
    });

    const response = await getMistralResponse(mockPrompt);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(response).toBe('Error communicating with Mistral (HTTP 500). Please check server logs.');
    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  test('should return user-friendly message for network error (ECONNREFUSED)', async () => {
    const mockPrompt = 'Test prompt for network error';
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {}); // Suppress console.error

    const networkError = new Error('Connection refused');
    networkError.code = 'ECONNREFUSED';
    fetch.mockRejectedValueOnce(networkError);

    const response = await getMistralResponse(mockPrompt);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(response).toBe('Could not connect to Mistral service. Is Ollama running?');
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error calling Ollama API:', networkError);
    consoleErrorSpy.mockRestore();
  });
  
  test('should return user-friendly message for other fetch errors', async () => {
    const mockPrompt = 'Test prompt for other error';
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {}); // Suppress console.error

    const otherError = new Error('Some other network issue');
    fetch.mockRejectedValueOnce(otherError);

    const response = await getMistralResponse(mockPrompt);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(response).toBe('An unexpected error occurred while consulting Mistral.');
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error calling Ollama API:', otherError);
    consoleErrorSpy.mockRestore();
  });

  test('should return user-friendly message if API response.ok but no "response" field in data', async () => {
    const mockPrompt = 'Test prompt for missing field';
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {}); // Suppress console.warn

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ some_other_field: 'data' }), // No 'response' field
    });

    const response = await getMistralResponse(mockPrompt);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(response).toBe('Mistral provided an empty or invalid response.');
    expect(consoleWarnSpy).toHaveBeenCalled();
    consoleWarnSpy.mockRestore();
  });

   test('should return user-friendly message if API response.ok but data.response is empty', async () => {
    const mockPrompt = 'Test prompt for empty response field';
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {}); // Suppress console.warn
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ response: '' }), // Empty 'response' field
    });

    const response = await getMistralResponse(mockPrompt);
    // The current implementation of getMistralResponse returns data.response directly if it exists,
    // so an empty string is a valid (though perhaps unhelpful) response. <-- This comment was incorrect for the actual code logic.
    // The code treats an empty `data.response` as a case for the 'else' block.
    expect(response).toBe('Mistral provided an empty or invalid response.');
    // A warning should be issued because `data.response` is present but empty, which falls into the else of `if (data && data.response)`
    // because `''` is falsy. The warning is for "did not contain a 'response' field OR an empty/invalid response"
    expect(consoleWarnSpy).toHaveBeenCalledWith('Ollama API response did not contain a "response" field:', { response: '' });
    consoleWarnSpy.mockRestore();
  });
});
