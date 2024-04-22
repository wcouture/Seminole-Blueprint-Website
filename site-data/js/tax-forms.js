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
  let f_data = {"tax-exempt": [], "other": []}
  for (let i = 0; i < paths.length; i++) {
	if (paths[i].indexOf("Tax Exempt") >= 0) {
	  	f_data["tax-exempt"].push(paths[i]);
	}
	else {
		f_data["other"].push(paths[i]);
	}
  }
  f_data["tax-exempt"].push("/--== Tax Exempt Forms ==--.");
  f_data["other"].push("/--== Other Forms ==--.");

  // Add tax forms first
  for (let i = f_data["tax-exempt"].length - 1; i >= 0; i--) {
	let option = document.createElement("option");
	option.value = f_data["tax-exempt"][i];
	if (i == f_data["tax-exempt"].length - 1) {
		option.disabled = true;
	}	
	
	let index1 = f_data["tax-exempt"][i].lastIndexOf('/') + 1;
	let index2 = f_data["tax-exempt"][i].lastIndexOf('.');
	let name = f_data["tax-exempt"][i].substring(index1, index2);

	option.text = name;
	form_select.appendChild(option);
  }

  // Add other forms

  for (let i = f_data["other"].length - 1; i >= 0; i--){
    let option = document.createElement("option");
    option.value = f_data["other"][i];

	if (i == f_data["other"].length - 1) {
		option.disabled = true;
	}	

    let index1 = f_data["other"][i].lastIndexOf('/') + 1
    let index2 = f_data["other"][i].lastIndexOf('.')
    let name = f_data["other"][i].substring(index1, index2);

    option.text = name;

    form_select.appendChild(option);
  }
}

http_request("GET", "/forms-data", null, (data) => {
  populate_select_options(data);
})
