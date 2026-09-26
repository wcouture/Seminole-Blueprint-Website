const uploadsBoard = document.getElementById("uploads-board");
const uploadsStatus = document.getElementById("uploads-status");
const noUploadsCard = document.getElementById("no-uploads-card");

if (uploadsBoard && uploadsStatus && noUploadsCard) {
  const MAX_PASSWORD_ATTEMPTS = 5;
  let passwordAttempts = 0;

  const httpRequest = (method, route, data) => {
    const config = {
      method,
      mode: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (data !== undefined && data !== null) {
      config.body = JSON.stringify(data);
    }

    return fetch(route, config).then((response) => {
      if (!response.ok) {
        return response.json().catch(() => ({})).then((payload) => {
          throw new Error(payload.message || "Request failed.");
        });
      }

      return response.json();
    });
  };

  const clearBoard = () => {
    while (uploadsBoard.firstChild) {
      uploadsBoard.removeChild(uploadsBoard.firstChild);
    }
  };

  const renderUploads = (data) => {
    const files = Array.isArray(data.files) ? data.files : [];
    clearBoard();

    if (files.length === 0) {
      uploadsBoard.hidden = true;
      noUploadsCard.hidden = false;
      uploadsStatus.innerText = "";
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const item = document.createElement("div");
      item.className = "box solid-card plan-item upload-item";

      const link = document.createElement("a");
      link.href = `/data/uploads/${encodeURIComponent(files[i])}`;
      link.innerText = files[i];
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.className = "upload-link";

      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.className = "delete";
      deleteButton.innerText = "Delete";
      deleteButton.addEventListener("click", () => {
        const confirmed = window.confirm(`Delete ${files[i]}?`);
        if (!confirmed) {
          return;
        }

        deleteButton.disabled = true;
        httpRequest("DELETE", "/delete-upload", { file_name: files[i] })
          .then(() => loadUploads("File deleted."))
          .catch((error) => {
            deleteButton.disabled = false;
            alert(error.message || "Unable to delete file.");
          });
      });

      item.appendChild(link);
      item.appendChild(deleteButton);
      uploadsBoard.appendChild(item);
    }

    uploadsStatus.innerText = "";
    noUploadsCard.hidden = true;
    uploadsBoard.hidden = false;
  };

  const loadUploads = (message) => {
    uploadsStatus.innerText = message || "Loading uploaded files...";
    noUploadsCard.hidden = true;
    uploadsBoard.hidden = true;

    httpRequest("GET", "/uploads-data")
      .then(renderUploads)
      .catch(() => {
        clearBoard();
        uploadsBoard.hidden = true;
        uploadsStatus.innerText = "Unable to load uploaded files.";
        noUploadsCard.hidden = true;
      });
  };

  const promptForPassword = () => {
    if (passwordAttempts >= MAX_PASSWORD_ATTEMPTS) {
      alert("Too many incorrect password attempts.");
      window.location.href = "/";
      return;
    }

    const password = window.prompt("Enter the uploads password.");

    if (password === null) {
      window.location.href = "/";
      return;
    }

    httpRequest("POST", "/uploads-authenticate", { key: password })
      .then((response) => {
        if (response.result === "success") {
          passwordAttempts = 0;
          loadUploads();
          return;
        }

        passwordAttempts += 1;
        alert("Incorrect password.");
        window.setTimeout(promptForPassword, 250);
      })
      .catch(() => {
        passwordAttempts += 1;
        uploadsStatus.innerText = "Unable to verify password.";
        window.setTimeout(() => {
          if (passwordAttempts < MAX_PASSWORD_ATTEMPTS) {
            promptForPassword();
          }
        }, 1000);
      });
  };

  promptForPassword();
}
