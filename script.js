document.getElementById('email-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form from refreshing the page
    
    const emailContent = document.getElementById('email-input').value; // Get input email content
    const outputDiv = document.getElementById('output'); // Output container
    
    // Check if input is empty
    if (!emailContent.trim()) {
      outputDiv.innerHTML = "Please enter some text in the email input box.";
      return;
    }
  
    // Call OpenAI API to generate the email
    generateEmail(emailContent).then((generatedEmail) => {
      // Display the generated email in the output section
      outputDiv.innerHTML = `<pre>${generatedEmail}</pre>`;
    }).catch((error) => {
      // Handle error from the API call and log detailed error message
      outputDiv.innerHTML = "An error occurred while generating the email.";
      console.error("Error generating email:", error.message || error);
    });
  });
  
  // Function to make the API call
  async function generateEmail(inputText) {
    const apiKey = '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'; // Replace with your OpenAI API key
    const endpoint = 'https://api.openai.com/v1/chat/completions'; // Endpoint for newer GPT models
  
    // Prepare the data for the API request
    const requestBody = {
      model: "gpt-3.5-turbo", // Use "gpt-4" if you have access
      messages: [
        { role: "system", content: "You are a helpful assistant skilled at generating professional emails." },
        { role: "user", content: `Generate a professional email based on the following message:\n\n${inputText}` }
      ],
      max_tokens: 100,  // Adjust based on the desired length of the email
      temperature: 0.7, // Controls randomness in the response
    };
  
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(requestBody),
      });
  
      const data = await response.json();
  
      // If the response is not successful, throw an error
      if (!response.ok) {
        throw new Error(`API Error: ${data.error.message}`);
      }
  
      // Return the generated email text
      return data.choices[0].message.content.trim();
    } catch (error) {
      console.error("API request failed", error);
      throw error;
    }
  }
  