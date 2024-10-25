import axios from 'axios';

// OpenAI API key
const openAIKey = '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';

// Function to generate AI suggestion with full bucket context
export const getAISuggestions = async (taskDescription, extend = false, bucketDetails = {}) => {
  try {
    const { title, deadline, status } = bucketDetails;

    const prompt = `
    You are an assistant working on a task in a project management system. Here's the relevant information about the current task:

    Project Name: ${title}
    Deadline: ${new Date(deadline).toLocaleDateString()}
    Status: ${status ? "Completed" : "Not Completed"}
    Task Description: ${taskDescription}

    Provide a ${
      extend ? "detailed" : "short"
    } recommendation for completing this task in less than ${extend ? 80 : 30} words.`;

    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are an assistant that helps with task management.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: extend ? 200 : 100,
      temperature: 0.7
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
