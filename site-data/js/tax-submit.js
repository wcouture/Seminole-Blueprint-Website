let file_input = document.getElementById("tax-upload")
let submit_button = document.getElementById("tax-submit")

console.log("script loaded")

submit_button.addEventListener("click", (e) => {
    let file = file_input.files[0];
    console.log("uploading form...")
    // Upload image
    let config = {
        method: "POST",
        mode: "same-origin",
        headers: {}
      };
  
      let data = new FormData();
  
      data.append("file", file);

      config.body = data;

      fetch("/upload-tax-form", config)
      .then((response) => response.json())
      .then((data) => console.log(data))
})