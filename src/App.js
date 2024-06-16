import React, { useState } from "react";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [repos, setRepos] = useState([]);
  const [message, setMessage] = useState("");
  const [clonePath, setClonePath] = useState("");
  const [folderError, setFolderError] = useState("");
  const fetchRepos = async () => {
    try {
      const response = await fetch(
        `https://api.github.com/users/${username}/repos`
      );
      if (response.ok) {
        const data = await response.json();
        setRepos(data);
        setMessage(""); // Clear any previous messages
      } else {
        setRepos([]);
        setMessage("User not found or no public repositories available");
      }
    } catch (error) {
      setMessage("Error fetching repositories");
    }
  };

  const handleClonePathChange = (e) => {
    setClonePath(e.target.value);
    if (folderError) setFolderError("");
  };


  const handleClone = async (repoName) => {
    if (!clonePath) {
      setMessage("Please provide a clone path");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/clone", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, repo: repoName, clonePath }),
      });

      if (response.ok) {
        setMessage(`Repository ${repoName} cloned successfully`);
        alert(`Repository ${repoName} cloned successfully`);
      } else {
        setMessage(`Failed to clone repository ${repoName}`);
        alert(`Failed to clone repository ${repoName}`);
      }
    } catch (error) {
      setMessage(`Error cloning repository ${repoName}`);
    }
  };

  return (
    <div className="App min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <header className="App-header w-full max-w-3xl">
        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-bold mb-2 text-center text-blue-700">
            GitHub Repo Cloner
          </h1>
         
        </div>
        <div className="flex flex-col md:flex-row items-center mb-6 ml-2 justify-around">
          <input
            className="mb-2 md:mb-0 md:mr-4 p-2 border border-gray-300 rounded w-full"
            type="text"
            placeholder="GitHub Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 w-1/3"
            onClick={fetchRepos}
          >
            Get Repos
          </button>
        </div>
        <div className="w-full">
          {repos.length > 0 && (
            <div className="mb-2">
              <input
                className="w-full ml-3 p-2 border border-gray-300 rounded"
                type="text"
                placeholder="Enter Clone Path"
                value={clonePath}
                onChange={handleClonePathChange}
              />
              {folderError && <p className="text-red-500">{folderError}</p>}
              {/* <p className="text-sm text-gray-500 mb-2">
              Please provide the correct folder path. The folder should be
              empty.
            </p> */}
              <div className="text-sm text-gray-500 ml-3 mb-2">
                <p>
                  <strong>
                    Please enter the correct folder path where the repository
                    will be cloned.
                  </strong>
                </p>
                <p>
                  <strong>Example for Windows:</strong>
                </p>
                <pre>C:\Users\YourUsername\Projects\MyReactApp</pre>
                <p>
                  <strong>Example for macOS:</strong>
                </p>
                <pre>/Users/YourUsername/Projects/MyReactApp</pre>
              </div>
            </div>
          )}
        </div>
        <div className="w-full">
          {repos.length > 0 ? (
            repos.map((repo) => (
              <div
                key={repo.id}
                className="bg-white p-4 mb-2 rounded shadow-md flex justify-between items-center"
              >
                <div className="flex-grow mr-4">
                  <h2 className="text-xl font-bold text-blue-600">
                    {repo.name}
                  </h2>
                  <p className="text-gray-700">{repo.description}</p>
                  <p className="text-gray-500">
                    {repo.stargazers_count} Stars | {repo.forks_count} Forks
                  </p>
                </div>
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
                  onClick={() => handleClone(repo.name)}
                >
                  Download
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">
              {message || "No repositories to display"}
            </p>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
