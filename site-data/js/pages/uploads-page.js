const uploadsBoard = document.getElementById("uploads-board");
const uploadsStatus = document.getElementById("uploads-status");
const noUploadsCard = document.getElementById("no-uploads-card");
const uploadsControls = document.getElementById("uploads-controls");
const uploadsTableWrap = document.getElementById("uploads-table-wrap");
const uploadsSearch = document.getElementById("uploads-search");

if (uploadsBoard && uploadsStatus && noUploadsCard) {
  const MAX_PASSWORD_ATTEMPTS = 5;
  let passwordAttempts = 0;
  let allFiles = [];

  const httpRequest = (method, route, data) => {
    const config = {
      method,
      mode: "same-origin",
      credentials: "same-origin",
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

  const renderRows = (files) => {
    clearBoard();

    if (files.length === 0) {
      uploadsTableWrap.hidden = true;
      if (allFiles.length === 0) {
        uploadsControls.hidden = true;
      }
      noUploadsCard.hidden = false;
      uploadsStatus.innerText = "";
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const row = document.createElement("tr");

      const nameCell = document.createElement("td");
      const link = document.createElement("a");
      link.href = `/data/uploads/${encodeURIComponent(files[i])}`;
      link.innerText = files[i];
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.className = "upload-link";
      nameCell.appendChild(link);

      const actionCell = document.createElement("td");
      actionCell.className = "uploads-td-action";
      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.className = "delete";
      deleteButton.innerText = "Delete";
      const fileName = files[i];
      deleteButton.addEventListener("click", () => {
        const confirmed = window.confirm(`Delete ${fileName}?`);
        if (!confirmed) {
          return;
        }

        deleteButton.disabled = true;
        httpRequest("DELETE", "/delete-upload", { file_name: fileName })
          .then(() => loadUploads("File deleted."))
          .catch((error) => {
            deleteButton.disabled = false;
            alert(error.message || "Unable to delete file.");
          });
      });
      actionCell.appendChild(deleteButton);

      row.appendChild(nameCell);
      row.appendChild(actionCell);
      uploadsBoard.appendChild(row);
    }

    uploadsStatus.innerText = "";
    noUploadsCard.hidden = true;
    uploadsControls.hidden = false;
    uploadsTableWrap.hidden = false;
  };

  const applySearch = () => {
    const query = uploadsSearch ? uploadsSearch.value.trim().toLowerCase() : "";
    const filtered = query
      ? allFiles.filter((f) => f.toLowerCase().includes(query))
      : allFiles;
    renderRows(filtered);
  };

  const renderUploads = (data) => {
    allFiles = Array.isArray(data.files) ? data.files : [];
    if (uploadsSearch) {
      uploadsSearch.value = "";
    }
    applySearch();
  };

  const loadUploads = (message) => {
    uploadsStatus.innerText = message || "Loading uploaded files...";
    noUploadsCard.hidden = true;
    uploadsTableWrap.hidden = true;
    uploadsControls.hidden = true;

    httpRequest("GET", "/uploads-data")
      .then(renderUploads)
      .catch(() => {
        clearBoard();
        uploadsTableWrap.hidden = true;
        uploadsControls.hidden = true;
        uploadsStatus.innerText = "Unable to load uploaded files.";
        noUploadsCard.hidden = true;
      });
  };

  if (uploadsSearch) {
    uploadsSearch.addEventListener("input", applySearch);
  }

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
