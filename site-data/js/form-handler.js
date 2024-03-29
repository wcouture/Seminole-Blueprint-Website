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

let contact_form = document.getElementById("contact-form")



contact_form.addEventListener("submit", (e) => {
  e.preventDefault();
  let name = document.getElementById("name").value
  let number = document.getElementById("number").value
  let email = document.getElementById("email").value
  let message = document.getElementById("message").value
  
  let request = {}
  request.name = name;
  request.number = number;
  request.email = email;
  request.message = message;
  //request = `{ "name":"${name}", "number":"${number}", "email":"${email}", "message":"${message}" }`

  http_request("POST", "/post-request", request, (res) => {
    console.log(res)
  })
    
  });
