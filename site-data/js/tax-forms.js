function http_request(method, route, data, callback) {
    let config = {
      method: method,
      mode: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
    };
    if (method == "POST") config.body = JSON.stringify(data);
  
    const response = fetch(route, config)
      .then((response) => response.json())
      .then((data) => {
        callback(data);
        return data;
      });
  }

let form_select = document.getElementById("form-select");
let submit_button = document.getElementById("form-submit");

submit_button.addEventListener("click", (e) => {
  let pdf_path = form_select.value;
  open(`form-data?path=${pdf_path}`)
})

function populate_select_options(data){
  let paths = data.paths;

  for (let i = 0; i < paths.length; i++){
    let option = document.createElement("option");
    option.value = paths[i];

    let index1 = paths[i].lastIndexOf('/') + 1
    let index2 = paths[i].lastIndexOf('.')
    let name = paths[i].substring(index1, index2);

    option.text = name;

    form_select.appendChild(option);
  }
}

http_request("GET", "/forms-data", null, (data) => {
  populate_select_options(data);
})