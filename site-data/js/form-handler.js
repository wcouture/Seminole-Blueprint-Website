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

// Contact form ---------------------------------------------------------------------------
let contact_form = document.getElementById("contact-form")

if (contact_form){
  contact_form.addEventListener("submit", (e) => {
    e.preventDefault();
    let name = document.getElementById("name").value
    let number = document.getElementById("number").value
    let email = document.getElementById("email").value
    let message = document.getElementById("message").value
    
    if (name.length <= 0 || number.length <= 0 || email.length <= 0){
      alert("Must enter all contact information.");
      return;
    }

    let request = {}
    request.name = name;
    request.number = number;
    request.email = email;
    request.message = message;
    //request = `{ "name":"${name}", "number":"${number}", "email":"${email}", "message":"${message}" }`
  
    http_request("POST", "/contact-request", request, (res) => {
      if (res.status == 'success') {
        contact_form.remove();
        document.getElementById("contact-column").innerText = "Response recorded."
      }
    })
      
  });
  
}
// -----------------------------------------------------------------------------------------------

// Supplies order form ---------------------------------------------------------------------------
const section_counts = { "paper": 0, "bond": 0, "binder": 0 };
const section_options = { "paper": [], "bond": [], "binder": [] };

let order_form = document.getElementById("order-form")

let paper_parent = document.getElementById("paper-parent");
let bond_parent = document.getElementById("bond-parent");
let binder_parent = document.getElementById("binder-parent");

const parents = {"paper": paper_parent, "bond": bond_parent, "binder": binder_parent};

let paper_add = document.getElementById("paper-plus");
let bond_add = document.getElementById("bond-plus");
let binder_add = document.getElementById("binder-plus");

function get_order(name) {
  let type = document.getElementById(name + "-select").value
  let count = document.getElementById(name + "-count").value

  return {type: type, count: count}
}

// Adds new product selection to the order form
function add_form_section(name) {
  section_counts[name] += 1

  let section = document.createElement("div");
  parents[name].appendChild(section);

  let select = document.createElement("select");
  select.id = `${name}-${section_counts[name]}`;
  select.className = "custom-select";
  section.appendChild(select);

  let options_array = section_options[name];
  for (let i = 0; i < options_array.length; i++){
    let option = document.createElement("option");
    option.value = options_array[i].value;
    option.text = options_array[i].text;
    select.appendChild(option);
  }

  let row = document.createElement("div");
  row.className = "row";
  section.appendChild(row);

  let count_input = document.createElement("input");
  count_input.type = "number";
  count_input.id = `${name}-count${section_counts[name]}`;
  count_input.className = "supply-count";
  count_input.value = 1;

  let delete_button = document.createElement("img");
  delete_button.className = "minus-button";
  delete_button.src = "images/minus.png";

  delete_button.addEventListener("click", (e) => {
    section.remove();
    section_counts[name] -= 1;
  });

  row.appendChild(count_input);  
  row.appendChild(delete_button);
}

if (order_form) {
  paper_add.addEventListener("click", (e) => { add_form_section(e.target.name); });
  bond_add.addEventListener("click", (e) => { add_form_section(e.target.name); });
  binder_add.addEventListener("click", (e) => { add_form_section(e.target.name); });

  order_form.addEventListener("submit", (e) => {
    e.preventDefault();
  
    let name = document.getElementById("name").value
    let number = document.getElementById("number").value
    let email = document.getElementById("email").value

    if (name.length <= 0 || number.length <= 0 || email.length <= 0){
      alert("Must enter all contact information.");
      return;
    }

    let order_request = {name: name, number: number, email: email, supplies: []};

    for(key in section_counts){
      section_count = section_counts[key];

      console.log(`${key} - ${section_count}`)
      for(let i = 0; i < section_count; i++){
        let type = document.getElementById(`${key}-${i + 1}`).value;
        let count = document.getElementById(`${key}-count${i + 1}`).value;

        console.log(`${key}: ${type} ${count}`);
        order_request.supplies.push({type: type, count: count});

      }
    }
  
    http_request("POST", "/order-request", order_request, (res) => {
      console.log(res)
    })
  });
}
// Option population
section_options["paper"].push({value:"PP24150", text:'24" 150 ft 20lb Plotter Paper 2" Core - $38'})
section_options["paper"].push({value:"PP30150", text:'30" 150 ft 20lb Plotter Paper 2" Core - $42'})
section_options["paper"].push({value:"PP30300", text:'30" 300 ft 20lb Plotter Paper 2" Core - $58'})
section_options["paper"].push({value:"PP36150", text:'36" 150 ft 20lb Plotter Paper 2" Core - $46'})
section_options["paper"].push({value:"PP36300", text:'36" 300 ft 20lb Plotter Paper 2" Core - $64'})
section_options["paper"].push({value:"PP42150", text:'42" 150 ft 20lb Plotter Paper 2" Core - $50'})


section_options["bond"].push({value:"EB15500", text:'15" 500 ft Engineering Bond 3" Core - $50'})
section_options["bond"].push({value:"EB18500", text:'18" 500 ft Engineering Bond 3" Core - $50'})
section_options["bond"].push({value:"EB22500", text:'22" 500 ft Engineering Bond 3" Core - $60'})
section_options["bond"].push({value:"EB24500", text:'24" 500 ft Engineering Bond 3" Core - $60'})
section_options["bond"].push({value:"EB30500", text:'30" 500 ft Engineering Bond 3" Core - $70'})
section_options["bond"].push({value:"EB34500", text:'34" 500 ft Engineering Bond 3" Core - $75'})
section_options["bond"].push({value:"EB36500", text:'36" 500 ft Engineering Bond 3" Core - $80'})


section_options["binder"].push({value:"Binder24", text:'1,000 24" Custom Binder Strips, 1 Color - $210 | *New Orders Have A  1 Time $150 Plate Charge* | *Minimum Combined order of 4 Boxes*'})
section_options["binder"].push({value:"Binder30", text:'1,000 30" Custom Binder Strips, 1 Color	- $250 | *New Orders Have A  1 Time $150 Plate Charge* | *Minimum Combined order of 4 Boxes*'})
section_options["binder"].push({value:"Binder24C", text:'500 24" Full Color Custom Binder Strips - $ | *No Minimum Order or Plate Charge*'})
section_options["binder"].push({value:"Binder30C", text:'500 30" Full Color Custom Binder Strips - $ | *No Minimum Order or Plate Charge*'})
// -----------------------------------------------------------------------------------------------

// Sign consultation form ---------------------------------------------------------------------------
let sign_form = document.getElementById("sign-form");
let size_select = document.getElementById("size-select");
let banner_info = document.getElementById("banner-info");

if (sign_form) {
  sign_form.addEventListener("submit", (e) => {
    e.preventDefault();

    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let number = document.getElementById("number").value;
    let format = document.getElementById("size-select").value;
    let file = document.getElementById("design-upload").files[0];

    if (name.length <= 0 || number.length <= 0 || email.length <= 0){
      alert("Must enter all contact information.");
      return;
    }

    if (!file) {
      alert("Must upload design document. (pdf, png, jpg, svg, psd)");
      return;
    }

    // Upload image
    let config = {
      method: "POST",
      mode: "same-origin",
      headers: {}
    };

    let data = new FormData();

    data.append("file", file);
    data.append("name", name);
    data.append("email", email);
    data.append("number", number);
    data.append("format", format);

    config.body = data;

    fetch("/design-upload", config);
    
  });

  size_select.addEventListener("change", (e) => {
    console.log("size changed")
    if (size_select.value == "banner"){
      banner_info.hidden = false;
    }
    else {
      banner_info.hidden = true;
    }
  });
}
// -----------------------------------------------------------------------------------------------