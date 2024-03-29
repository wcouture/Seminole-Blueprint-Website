const express = require('express');
const fs = require('fs');
const path = require('path');
const combyne = require('combyne');

const app = express();
app.use(express.json())

const port = "3000"

const success = JSON.stringify({status: "success"})

const page_template = fs.readFileSync("pages/templates/layout.html", "utf-8")

const __directories = [
    "css",
    "fonts",
    "images",
    "js",
    "pages"
];

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

// Resource routing
app.get("/:dir/:rsrc", (req, res) => {
    if(__directories.includes(req.params.dir) == false)
        res.send("{'result': 'Failed to retrieve resource'")
    else
        res.sendFile(`${req.params.dir}/${req.params.rsrc}`, { root: __dirname })
})

app.get("/", (req, res) => {
    res.send(render_page("pages/index.html"))
});

app.get("/about", (req, res) => {
    res.send(render_page("pages/about.html"))
})

app.get("/services", (req, res) => {
    res.send(render_page("pages/service.html"))
})

app.get("/contact", (req, res) => {
    res.send(render_page("pages/contact.html"))
})

app.get("/tax-forms", (req, res) => {
    res.send("{'status':'success'}")
})

app.post("/post-request", (req, res) => {
    let data = req.body
    let file_message = `${data.name}\n${data.email}\n${data.number}\n\n${data.message}`

    fs.writeFile(`data/${data.email}-message.text`, file_message, (err) => {
        if (err) {
            console.error('Error writing file:', err);
        }
        else {
            console.log('File saved successfully!');
        }
    })

    res.send(success)

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