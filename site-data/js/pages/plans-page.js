const tabs = document.getElementsByClassName("tab");
const board = document.getElementById("plans-board");
const noPlansCard = document.getElementById("no-plans-card");

if (board && noPlansCard) {
  const httpRequest = (method, route, data, callback) => {
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
      })
      .catch(() => {
        if (route === "/plan-categories") {
          callback({ cats: [] });
          return;
        }

        callback({ plans: [] });
        noPlansCard.hidden = false;
        board.className = "plan-board";
      });
  };

  const handleTabClick = (e) => {
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
  };

  const populateList = (data) => {
    function safeText(value) {
      if (value === undefined || value === null) {
        return "";
      }
      return String(value);
    }

    function safeLink(rawUrl, label) {
      const anchor = document.createElement("a");
      anchor.innerText = label;

      try {
        const parsedUrl = new URL(rawUrl, window.location.origin);
        if (parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:") {
          anchor.href = parsedUrl.href;
        } else {
          anchor.href = "/contact";
        }
      } catch {
        anchor.href = "/contact";
      }

      return anchor;
    }

    for (let i = data.plans.length - 1; i >= 0; i--) {
      const plan = data.plans[i];

      const item = document.createElement("div");
      item.className = "box solid-card plan-item dynamic";
      board.appendChild(item);

      const table = document.createElement("table");
      item.appendChild(table);

      const projectAccess = plan.is_public === "Yes" ? "Public Project" : "Private Project";

      const headerRow = document.createElement("tr");
      const headerItems = [
        { text: "Project Title", width: "25%" },
        { text: "Contractor", width: "20%" },
        { text: "Bid Date", width: "10%" },
        { text: "Current Set", width: "20%" },
        { text: "Preview", width: "12.5%" },
        { text: projectAccess, width: "12.5%" },
      ];

      for (let headerIndex = 0; headerIndex < headerItems.length; headerIndex++) {
        const th = document.createElement("th");
        th.style.width = headerItems[headerIndex].width;
        th.innerText = headerItems[headerIndex].text;
        headerRow.appendChild(th);
      }

      table.appendChild(headerRow);

      const dataRow = document.createElement("tr");

      const titleCell = document.createElement("td");
      titleCell.innerText = safeText(plan.title);
      dataRow.appendChild(titleCell);

      const contractorCell = document.createElement("td");
      const contractorLines = safeText(plan.contractor).split(",");
      for (let contractorIndex = 0; contractorIndex < contractorLines.length; contractorIndex++) {
        if (contractorIndex > 0) {
          contractorCell.appendChild(document.createElement("br"));
        }
        contractorCell.appendChild(document.createTextNode(contractorLines[contractorIndex].trim()));
      }
      dataRow.appendChild(contractorCell);

      const bidDateCell = document.createElement("td");
      bidDateCell.innerText = safeText(plan.bid_date);
      dataRow.appendChild(bidDateCell);

      const currentSetCell = document.createElement("td");
      currentSetCell.innerText = safeText(plan.current_set);
      dataRow.appendChild(currentSetCell);

      const previewCell = document.createElement("td");
      if (plan.path === "#") {
        previewCell.innerText = "NA";
      } else {
        const previewLink = safeLink(plan.path, "Online Set");
        previewLink.target = "_blank";
        previewCell.appendChild(previewLink);
      }
      dataRow.appendChild(previewCell);

      const accessCell = document.createElement("td");
      if (plan.newforma === undefined || plan.newforma === "NA") {
        const contactLink = document.createElement("a");
        contactLink.href = "/contact";
        contactLink.innerText = "Contact Us";
        accessCell.appendChild(contactLink);
      } else {
        const newformaLink = safeLink(plan.newforma, "NewForma");
        newformaLink.target = "_blank";
        accessCell.appendChild(newformaLink);
      }
      dataRow.appendChild(accessCell);

      table.appendChild(dataRow);
    }

    if (data.plans.length === 0) {
      noPlansCard.hidden = false;
    } else {
      noPlansCard.hidden = true;
    }

    board.className = "plan-board";
  };

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
