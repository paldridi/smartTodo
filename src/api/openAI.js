import axios from 'axios';

// OpenAI API key (updated with your new key)
const openAIKey = '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';

// Function to generate concise AI suggestions for a given task description
export const getAISuggestions = async (taskDescription) => {
  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are an assistant.' },
        { role: 'user', content: `Give me a short, concise suggestion for the following task: ${taskDescription}` }
      ],
      max_tokens: 50, // Reduced max_tokens for shorter responses
      temperature: 0.7 // Adjusted temperature for creativity
    }, {
      headers: {
        'Authorization': `Bearer ${openAIKey}`,
        'Content-Type': 'application/json'
      }
    });

    // Return the AI-generated suggestion text
    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error fetching AI suggestion:', error.response ? error.response.data : error.message);
    return 'AI suggestion could not be retrieved.';
  }
};
