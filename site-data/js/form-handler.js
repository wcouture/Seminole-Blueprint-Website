let contact_form = document.getElementById("contact-form")

contact_form.addEventListener("submit", (e) => {
    e.preventDefault();
    let name = document.getElementById("name").value
    let number = document.getElementById("number").value
    let email = document.getElementById("email").value
    let message = document.getElementById("message").value

    let request = `${name} | ${number} | ${email}\n${message}`

    alert(request)
    location.reload()
    
  });
