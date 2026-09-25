const tabs = document.getElementsByClassName("tab");
const board = document.getElementById("plans-board");
const noPlansCard = document.getElementById("no-plans-card");

if (board && noPlansCard) {
  function httpRequest(method, route, data, callback) {
    const config = {
      method,
      mode: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (method === "POST") config.body = JSON.stringify(data);

    fetch(route, config)
      .then((response) => response.json())
      .then((responseData) => {
        callback(responseData);
        return responseData;
      });
  }

  function handleTabClick(e) {
    e.preventDefault();

    e.target.className = "tab active";

    for (let i = 0; i < tabs.length; i++) {
      if (tabs[i].id === e.target.id) {
        continue;
      }
      tabs[i].className = "tab";
    }

    board.className = "plan-board hidden";
    setTimeout(() => {
      const cards = document.getElementsByClassName("dynamic");

      while (cards.length > 0) {
        cards[0].remove();
      }

      const newCategory = e.target.id;
      httpRequest("GET", `/retrieve-plans?id=${newCategory}`, null, populateList);
    }, 500);
  }

  function populateList(data) {
    for (let i = data.plans.length - 1; i >= 0; i--) {
      const plan = data.plans[i];

      const item = document.createElement("div");
      item.className = "box solid-card plan-item dynamic";
      board.appendChild(item);

      const table = document.createElement("table");
      item.appendChild(table);

      const projectAccess = plan.is_public === "Yes" ? "Public Project" : "Private Project";

      const headerRow = document.createElement("tr");
      headerRow.innerHTML = `<th style="width: 25%">Project Title</th><th style="width: 20%">Contractor</th><th style="width: 10%">Bid Date</th><th style="width: 20%">Current Set</th><th style="width: 12.5%">Preview</th><th style="width: 12.5%">${projectAccess}</th>`;
      table.appendChild(headerRow);

      let link = `<a target="_blank" href="${plan.newforma}">NewForma</a>`;
      if (plan.newforma === undefined || plan.newforma === "NA") {
        link = `<a href="/contact">Contact Us</a>`;
      }

      const url = plan.path;
      let preview = `<a href="${url}">Online Set</a>`;
      if (url === "#") {
        preview = "NA";
      }

      let contractor = plan.contractor.replace(",", "<br>");
      while (contractor.includes(",")) {
        contractor = contractor.replace(",", "<br>");
      }

      const dataRow = document.createElement("tr");
      dataRow.innerHTML = `<td>${plan.title}</td><td>${contractor}</td><td>${plan.bid_date}</td><td>${plan.current_set}</td><td>${preview}</td><td>${link}</td>`;
      table.appendChild(dataRow);
    }

    if (data.plans.length === 0) {
      noPlansCard.hidden = false;
    } else {
      noPlansCard.hidden = true;
    }

    board.className = "plan-board";
  }

  httpRequest("GET", "/plan-categories", null, (data) => {
    const categories = data.cats;
    const tabRegion = document.getElementsByClassName("category-tabs");

    for (let i = 0; i < categories.length; i++) {
      const tab = document.createElement("a");
      tabRegion[0].appendChild(tab);

      tab.className = i === 0 ? "tab active" : "tab";
      tab.href = "";
      tab.id = categories[i].id;
      tab.innerText = categories[i].name;
      tab.addEventListener("click", handleTabClick);
    }

    if (categories.length > 0) {
      httpRequest("GET", `/retrieve-plans?id=${categories[0].id}`, null, populateList);
    }
  });
}
