chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    if (request.action === "generateDocs") {
      const repoUrl = request.repoUrl;
  
      // Extract repo owner and name from URL
      const urlParts = repoUrl.split('/');
      if (urlParts.length < 5) {
        console.error("Invalid GitHub repository URL");
        sendResponse({ success: false, message: "Invalid URL" });
        return; // Early return to avoid further execution
      }
  
      const repoOwner = urlParts[3];
      const repoName = urlParts[4];
      const folderPath = "src";  // Assuming 'src' folder as default
  
      try {
        const files = await getFilesFromGitHub(repoOwner, repoName, folderPath);
        if (!files.length) {
          sendResponse({ success: false, message: "No files found in the specified folder" });
          return;
        }
  
        const jsFiles = files.filter(file => file.name.endsWith(".js"));
  
        if (jsFiles.length === 0) {
          sendResponse({ success: false, message: "No JavaScript files found" });
          return;
        }
  
        await downloadAndSaveFiles(jsFiles);
        sendResponse({ success: true, message: "Files downloaded successfully" });
      } catch (error) {
        console.error("Error during documentation generation:", error);
        sendResponse({ success: false, message: error.message });
      }
    }
    return true; // Important for asynchronous response
  });
  
  async function getFilesFromGitHub(owner, repo, folderPath) {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${folderPath}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`GitHub API error: ${response.statusText}`);
    return response.json();
  }
  
  async function downloadAndSaveFiles(files) {
    for (const file of files) {
      try {
        const fileContent = await fetchFileContent(file.download_url);
        await saveFileLocally(file.name, fileContent);
      } catch (error) {
        console.error(`Failed to download ${file.name}:`, error);
      }
    }
  }
  
  async function fetchFileContent(downloadUrl) {
    const response = await fetch(downloadUrl);
    if (!response.ok) throw new Error(`Error fetching file: ${response.statusText}`);
    return response.text();
  }
  
  function saveFileLocally(fileName, content) {
    const blob = new Blob([content], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
  
    chrome.downloads.download({
      url: url,
      filename: `docs/src/${fileName}`,
      saveAs: false
    });
  }
  