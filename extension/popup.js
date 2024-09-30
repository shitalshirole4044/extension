document.getElementById("generateDocs").addEventListener("click", () => {
    const repoUrl = document.getElementById("repoUrl").value;
  
    chrome.runtime.sendMessage(
      { action: "generateDocs", repoUrl: repoUrl },
      response => {
        const status = document.getElementById("status");
        if (chrome.runtime.lastError) {
          console.error("Error sending message:", chrome.runtime.lastError);
          status.textContent = `Error: ${chrome.runtime.lastError.message}`;
          return;
        }
  
        if (response && response.success) {
          status.textContent = "Documentation generation started!";
        } else {
          status.textContent = `Error: ${response.message}`;
        }
      }
    );
  });
  