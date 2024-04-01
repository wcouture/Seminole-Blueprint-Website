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

function toggle_form_section(name) {
  name = name + "-form"
  console.log(name)
  let section = document.getElementById(name)
  section.hidden = !section.hidden
}

function get_order(name) {
  let type = document.getElementById(name + "-select").value
  let count = document.getElementById(name + "-count").value

  return {type: type, count: count}
}

let contact_form = document.getElementById("contact-form")
let order_form = document.getElementById("order-form")

let paper_checkbox = document.getElementById("paper-check")
let ink_checkbox = document.getElementById("ink-check")
let bag_checkbox = document.getElementById("bag-check")
let board_checkbox = document.getElementById("board-check")


paper_checkbox.addEventListener("click",   (e) => toggle_form_section("paper"))
ink_checkbox.addEventListener("click",    (e) => toggle_form_section("ink"))
bag_checkbox.addEventListener("click",    (e) => toggle_form_section("bag"))
board_checkbox.addEventListener("click",  (e) => toggle_form_section("board"))



if (order_form) {
  order_form.addEventListener("submit", (e) => {
    e.preventDefault();
  
    let name = document.getElementById("name").value
    let number = document.getElementById("number").value
    let email = document.getElementById("email").value

    let order_request = {name: name, number: number, email: email};

    if (paper_checkbox.checked) 
      order_request.paper_order = get_order("paper")
    if (ink_checkbox.checked) 
      order_request.ink_order = get_order("ink")
    if (bag_checkbox.checked) 
      order_request.bag_order = get_order("bag")
    if (board_checkbox.checked) 
      order_request.board_order = get_order("board")
  
    http_request("POST", "/order-request", order_request, (res) => {
      console.log(res)
    })
  });

}

if (contact_form){
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
  
    http_request("POST", "/contact-request", request, (res) => {
      console.log(res)
    })
      
  });
  
}