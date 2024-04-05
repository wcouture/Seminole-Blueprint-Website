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

let page_data = ``
let login_form = document.getElementById("login-form");
let login_container = document.getElementById("login-container");
let password_field = document.getElementById("password-field");
let login_button = document.getElementById("login-button");   
let admin_section = document.getElementById("admin-section"); 
let incorrect_label = document.getElementById("incorrect-pass");

function authenticate(e) {
    incorrect_label.hidden = true;
    let data = { key: password_field.value };


    http_request("POST", "/authenticate", data, (res) => {
        if (res.result == 'success'){
            page_data = res.data;
            admin_section.innerHTML = page_data;
            let tax_script = document.createElement("script")
            admin_section.appendChild(tax_script);
            tax_script.src = "js/tax-submit.js";

            login_container.remove();
        }
        else {
            incorrect_label.hidden = false;
        }
    })
}

login_form.addEventListener("submit", (e) => {
    e.preventDefault();
    authenticate(e);
})

login_button.addEventListener("click", (e) => {
    authenticate(e);
})