document.addEventListener("DOMContentLoaded", () => {
    const promptInput = document.getElementById("emailPrompt");
    const styleSelect = document.getElementById("emailStyle");
    const generateButton = document.getElementById("generateEmail");
    const resultDiv = document.getElementById("result");
    const savedDraftsList = document.getElementById("savedDrafts");
  
    const loadDrafts = () => {
      chrome.storage.local.get("drafts", (data) => {
        const drafts = data.drafts || [];
        savedDraftsList.innerHTML = "";
        drafts.forEach((draft) => {
          const li = document.createElement("li");
          li.innerText = draft;
          li.addEventListener("click", () => {
            navigator.clipboard.writeText(draft);
            alert("Draft copied to clipboard!");
          });
          savedDraftsList.appendChild(li);
        });
      });
    };
  
    loadDrafts();
  
    generateButton.addEventListener("click", () => {
      const prompt = promptInput.value.trim();
      const style = styleSelect.value;
  
      if (!prompt) {
        alert("Please enter a description for the email.");
        return;
      }
  
      if (prompt.length < 10) {
        alert("Please provide a more detailed description (at least 10 characters).");
        return;
      }
  
      if (prompt.length > 500) {
        alert("Description too long. Please limit to 500 characters.");
        return;
      }
  
      resultDiv.innerText = "Generating email...";
      generateButton.disabled = true;
  
      chrome.runtime.sendMessage(
        { action: "generateEmail", prompt, style },
        (response) => {
          generateButton.disabled = false;
  
          if (response.error) {
            resultDiv.innerText = `Error: ${response.error}`;
            resultDiv.className = "error";
          } else {
            const email = response.email;
            resultDiv.innerText = email;
  
            chrome.storage.local.get("drafts", (data) => {
              const drafts = data.drafts || [];
              drafts.push(email);
              chrome.storage.local.set({ drafts });
              loadDrafts();
            });
          }
        }
      );
    });
  });
  