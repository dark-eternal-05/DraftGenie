chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    if (request.action === "generateEmail") {
      const apiKey = "your-openai-api-key"; // Replace with your OpenAI API key
      const { prompt, style } = request;
  
      const stylePrompts = {
        formal: "Write a formal email based on this description:",
        casual: "Write a casual email based on this description:",
        persuasive: "Write a persuasive email based on this description:",
      };
  
      const finalPrompt = `${stylePrompts[style]}\n${prompt}`;
  
      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4",
            messages: [{ role: "user", content: finalPrompt }],
          }),
        });
  
        if (!response.ok) {
          if (response.status === 429) {
            sendResponse({ error: "API rate limit exceeded. Please try again later." });
          } else if (response.status >= 500) {
            sendResponse({ error: "OpenAI server error. Please try again later." });
          } else {
            sendResponse({ error: `Request failed with status: ${response.status}` });
          }
          return;
        }
  
        const data = await response.json();
  
        if (data.error) {
          sendResponse({ error: `OpenAI API Error: ${data.error.message}` });
          return;
        }
  
        sendResponse({ email: data.choices[0].message.content });
  
      } catch (error) {
        console.error("Error fetching from OpenAI API:", error);
        sendResponse({ error: "Unexpected error occurred. Please check your internet connection and try again." });
      }
    }
    return true; // Required for async response
  });
  