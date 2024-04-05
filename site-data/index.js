const express = require('express');
const fs = require('fs');
const path = require('path');
const combyne = require('combyne');
const multer = require("multer");
const upload = multer({dest: "data/signs"})

const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));

const port = "3000"

const success = JSON.stringify({status: "success"})

const page_template = fs.readFileSync("pages/templates/layout.html", "utf-8")

const __directories = [
    "css",
    "fonts",
    "images",
    "js",
    "pages",
    "assets"
];

function save_file(dir, data){
    fs.writeFile(dir, data, (err) => {
        if (err) {
            console.error('Error writing file:', err);
        }
        else {
            console.log('File saved successfully!');
        }
    })
}

// Read raw html data
function load_page(path) {
    const data = fs.readFileSync(path, 'utf-8')
    var index = [path.lastIndexOf('/'), path.lastIndexOf('.')]    
    const name = path.substring(index[0] + 1, index[1])
    return { page: data, page_name: name }
}

// Apply templating
function render_page(path) {
    let page_data = load_page(path)
    let page = combyne(page_template)
    return page.render(page_data)
}

app.get("/", (req, res) => {
    res.send(render_page("pages/index.html"))
});

app.get("/about", (req, res) => {
    res.send(render_page("pages/about.html"))
})

app.get("/services", (req, res) => {
    res.send(render_page(`pages/services/${req.query.page}.html`))
})

app.get("/contact", (req, res) => {
    res.send(render_page("pages/contact.html"))
})

app.get("/upload", (req, res) => {
    res.send(success)
})

app.get("/tax-forms", (req, res) => {
    res.send(render_page("pages/forms.html"))
})

app.post("/contact-request", (req, res) => {
    let data = req.body
    let file_message = `${data.name}\n${data.email}\n${data.number}\n\n${data.message}`

    save_file(`data/contact/${data.email}-message.text`, file_message)

    res.send(success)

})

app.post("/order-request", (req, res) => {
    let data = req.body
    let file_message = JSON.stringify(data)

    save_file("data/supplies/supply-order.txt", file_message);

    res.send(success)
})

app.post("/design-upload", upload.single("file"), (req, res) => {
    let order_name = req.body.name.replaceAll(' ', '_');
    let dir_name = "data/signs/order-" + order_name + "/";

    // Make new directory for order
    fs.mkdirSync(dir_name);

    let file_path = dir_name + req.file.originalname;
    fs.rename(req.file.path, file_path, (err) => {
        if (err) {
          console.error('Error moving the file:', err);
          res.status(500).send('Error saving the file');
          return;
        }
    });
    let order_details = `Name : ${req.body.name}\nEmail : ${req.body.email}\nNumber : ${req.body.number}\nSign format : ${req.body.format}`;

    save_file(dir_name + "order-details.txt", order_details);
    res.send(success)
})


// Resource routing
app.get("/:dir/:rsrc", (req, res) => {
    if(__directories.includes(req.params.dir) == false)
        res.send("{'result': 'Failed to retrieve resource'")
    else
        res.sendFile(`${req.params.dir}/${req.params.rsrc}`, { root: __dirname })
})

/*
Post example
app.post("/", (req, res) => {
    let data = req.body;
});
*/

app.listen(port, () => {
    console.log(`Semblueinc listening on port ${port}`)
});

// Ensure the data directory exists
if (fs.existsSync("data") == false) {
    console.log("Creating data directory...")
    fs.mkdirSync("data")
}

// Ensure request directories exist
if (fs.existsSync("data/signs") == false) {
    fs.mkdirSync("data/signs")
}
if (fs.existsSync("data/contact") == false) {
    fs.mkdirSync("data/contact")
}
if (fs.existsSync("data/supplies") == false) {
    fs.mkdirSync("data/supplies")
}