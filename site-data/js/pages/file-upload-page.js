const planForm = document.getElementById("plan-form");
const addFile = document.getElementById("add-file");
const fileInputsContainer = document.getElementById("file-inputs");

if (planForm && addFile && fileInputsContainer) {
  const fileInputs = [];

  addFile.addEventListener("click", (e) => {
    e.preventDefault();

    const inputContainer = document.createElement("div");
    inputContainer.style = "display: flex; justify-content: space-between;";

    const input = document.createElement("input");
    input.type = "file";
    input.name = `file${fileInputs.length}`;
    input.required = true;

    const inputDelete = document.createElement("button");
    inputDelete.innerText = "delete";
    inputDelete.style = "margin: auto 0; max-height: 3em;";
    inputDelete.className += " delete";
    inputDelete.onclick = () => {
      const index = fileInputs.indexOf(input);
      if (index >= 0) {
        fileInputs.splice(index, 1);
      }
      fileInputsContainer.removeChild(inputContainer);

      if (fileInputs.length < 12) {
        addFile.removeAttribute("disabled");
        addFile.style = "";
      }
    };

    inputContainer.appendChild(input);
    inputContainer.appendChild(inputDelete);

    fileInputsContainer.appendChild(inputContainer);
    fileInputs.push(input);

    if (fileInputs.length >= 12) {
      addFile.setAttribute("disabled", true);
      addFile.style = "background-color: gray";
    }
  });

  function displaySuccess() {
    const center = document.getElementById("center");
    center.className = "centered-region fade-out-quick";

    setTimeout(() => {
      center.innerHTML = "<p>File Uploaded.</p>";
      center.className = "centered-region fade-in-quick";
    }, 500);
  }

  function sendFiles(files, name, email, description) {
    const config = {
      method: "POST",
      mode: "same-origin",
      headers: {},
    };

    const data = new FormData();
    data.append("name", name);
    data.append("email", email);
    data.append("desc", description);

    for (let i = 0; i < files.length; i++) {
      data.append("files", files[i]);
    }

    config.body = data;

    fetch("/file-upload", config)
      .then((response) => response.json())
      .then((res) => {
        if (res.status === "success") {
          displaySuccess();
          return;
        }

        alert("Upload failed. Please try again or contact support.");
      })
      .catch(() => {
        alert("Upload failed. Please try again or contact support.");
      });
  }

  planForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("f_email").value;
    const name = document.getElementById("f_name").value;
    const description = document.getElementById("f_description").value;

    const files = [];
    for (let i = 0; i < fileInputs.length; i++) {
      files.push(fileInputs[i].files[0]);
    }

    if (files.length === 0) {
      alert("Please add at least one file before uploading.");
      return;
    }

    sendFiles(files, name, email, description);
  });
}
