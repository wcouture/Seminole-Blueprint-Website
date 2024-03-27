const express = require('express');
const fs = require('fs');
const path = require('path');
const combyne = require('combyne');

const app = express();
const port = "3000"

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
    return { page: data }
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

/*
Post example
app.post("/", (req, res) => {
    let data = req.body;
});
*/

app.listen(port, () => {
    console.log(`Semblueinc listening on port ${port}`)
});