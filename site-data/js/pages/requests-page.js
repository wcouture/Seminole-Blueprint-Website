const board = document.getElementById("request-board");
const requestType = document.body.dataset.requestType || "";

if (board && requestType) {
  const config = {
    method: "GET",
    mode: "same-origin",
    headers: {},
  };

  fetch("/data/requests.json", config)
    .then((response) => response.json())
    .then((data) => {
      let list = [];

      switch (requestType) {
        case "contact":
          list = data.contact;
          break;
        case "supply":
          list = data.supply;
          break;
        case "design":
          list = data.design;
          break;
        case "file":
          list = data.file;
          break;
        default:
          list = [];
      }

      for (let i = 0; i < list.length; i++) {
        const item = document.createElement("div");
        item.className = "request-card";
        item.innerHTML = list[i];
        board.appendChild(item);
      }
    });
}
