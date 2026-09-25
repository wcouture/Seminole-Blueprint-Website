const planForm = document.getElementById("plan-form");
const addFile = document.getElementById("add-file");

if (planForm && addFile) {
  const fileInputs = [];

  addFile.addEventListener("click", (e) => {
    e.preventDefault();

    const input = document.createElement("input");
    input.type = "file";
    input.name = `file${fileInputs.length}`;
    input.required = true;

    document.getElementById("file-inputs").appendChild(input);
    fileInputs.push(input);
  });

  function displaySuccess() {
    const center = document.getElementById("center");
    center.className = "centered-region fade-out-quick";

    setTimeout(() => {
      center.innerHTML = "<p>Plans Submitted</p>";
      center.className = "centered-region fade-in-quick";
    }, 500);
  }

  function displayWorking() {
    const center = document.getElementById("center");
    center.className = "centered-region fade-out-quick";

    setTimeout(() => {
      center.innerHTML = "<p>Uploading...</p>";
      center.className = "centered-region fade-in-quick";
    }, 500);
  }

  function sendFile(i, plans, title, email, message, bidDate) {
    const config = {
      method: "POST",
      mode: "same-origin",
      headers: {},
    };

    const data = new FormData();
    data.append("file", plans[i]);
    data.append("title", title);
    data.append("email", email);
    data.append("bid_date", bidDate);
    data.append("message", message);

    const start = i === 0;
    const end = i === plans.length - 1;

    data.append("start", start);
    data.append("end", end);

    config.body = data;

    fetch("/upload", config)
      .then((response) => response.json())
      .then((res) => {
        if (res.status === "success") {
          displaySuccess();
          return;
        }

        if (res.status === "waiting for all files") {
          if (i === 0) {
            displayWorking();
          }
          if (i + 1 < plans.length) {
            sendFile(i + 1, plans, title, email, message, bidDate);
          }
        }
      });
  }

  planForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("f_email").value;
    const title = document.getElementById("f_title").value;
    const bidDate = document.getElementById("f_date").value;
    const message = document.getElementById("f_message").value;

    const plans = [];
    for (let i = 0; i < fileInputs.length; i++) {
      plans.push(fileInputs[i].files[0]);
    }

    if (plans.length === 0) {
      alert("Please add at least one plan file before submitting.");
      return;
    }

    sendFile(0, plans, title, email, message, bidDate);
  });
}
