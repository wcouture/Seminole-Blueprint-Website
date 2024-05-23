const http = require('http');
const nodemailer = require('nodemailer');
const express = require('express');
const fs = require('fs');
const path = require('path');
const combyne = require('combyne');
const multer = require("multer");
const upload = multer({dest: "data/temp"})
const exec = require('child_process').exec;

const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json({limit: '200mb'}));
app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));

const port = "3001"

const success = JSON.stringify({status: "success"})
const admin_pass = "$emBlue1nc";

const message_recipient = "eaststore@gsemblueinc.com";

let queued_message = {
    "recipient": "",
    "links": "",
    "title": "",
    "bid_date": "",
    "message": ""
}

const page_template = fs.readFileSync("pages/templates/layout.html", "utf-8")
const form_path = "assets/tax-forms/";

// File transfer permitted directories
const __directories = [
    "css",
    "fonts",
    "images",
    "js",
    "pages",
    "assets",
    "tax-forms",
    "printing-info",
    "bgswitch",
    "plan-data",
	"storage",
	"include",
];

// Temp plan storage
const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const TEMP_STORAGE_CUTOFF = DAY * 30;

let temp_plan_stored = {"plans": []};

// Plan display data
let stored_plan_data = {};
let plan_categories = {cats: [
    {id: 1, name: "Commercial"},
	{id: 2, name: "School - Universities"},
	{id: 3, name: "City County"},
	{id: 4, name: "State of Florida"},
	{id: 5, name: "Church"},
	{id: 6, name: "Residential"},
	{id: 7, name: "Airport"},
	{id: 8, name: "Medical"},
	{id: 9, name: "Library"},
	{id: 10, name: "Military"}
]};

// Email sending
const transporter = nodemailer.createTransport({
	"service": 'gmail',
	"auth": {
		"user": 'noreply.semblueinc@gmail.com',
		"pass": 'zosb bsqw fyci vhkb',
	}
})

function cat_id_to_name(id) {
	cats = plan_categories.cats;
	for(let i = 0; i < cats.length; i++) {
		if (cats[i].id == id)
			return cats[i].name;
	}
	return "Other"
}

function clear_plan_data() {
	for(let cat = 1; cat <= 10; cat++) {
		length = stored_plan_data.categories[`${cat}`].plans.length
		while (length > 0) {
			stored_plan_data.categories[`${cat}`].plans.pop()
			length = stored_plan_data.categories[`${cat}`].plans.length;
		}
	}
	save_file("assets/plan-data/data_table.json", JSON.stringify(stored_plan_data));
	exec('rm assets/plan-data/*.pdf', (err, s_out, s_err) => {
		console.log('stdout: ' + s_out);
		console.log('stderr: ' + s_err);
		if (err !== null) {
			console.log('exec error: ' + err);
		}
	});
}

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

function load_stored_plans() {
    const data = fs.readFileSync("assets/plan-data/data_table.json", 'utf-8');
    plans = JSON.parse(data);
    stored_plan_data = plans;

    const temp_data = fs.readFileSync("assets/temp/temp_data.json", "utf-8");
    plans = JSON.parse(temp_data)
    temp_plan_stored = plans;
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

function send_message(recipient, subject, message) {
	let mailOptions = {
		"from": 'noreply.semblueinc@gmail.com',
		"to": recipient,
		"subject": subject,
		"html": message,
	};

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.error('Error:', error);
		} else {
			console.log('Email sent:', info.response);
		}	
	})
}

app.get("/", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Headers", "*");
	res.setHeader("Access-Control-Allow-Methods", "*");
	res.send(render_page("pages/index.html"))
});

app.get("/about", (req, res) => {
    res.send(render_page("pages/about.html"))
})

app.get("/clear", (req, res) => {
	clear_plan_data();
	res.send(success);
})

app.get("/services", (req, res) => {
    res.send(render_page(`pages/services/${req.query.page}.html`))
})

app.get("/contact", (req, res) => {
    res.send(render_page("pages/contact.html"))
})

app.get("/tax-forms", (req, res) => {
    res.send(render_page("pages/forms.html"))
})

app.get("/plans", (req, res) => {
    res.send(render_page("pages/plans.html"))
})

app.get("/plan-upload", (req, res) => {
    res.send(render_page("pages/plan-upload.html"))
})

app.get("/admin", (req,res) => {
    res.send(render_page("pages/admin.html"))
})

app.get("/check-temps", (req, res) =>{
    res.send(success);
    let plans = temp_plan_stored.plans;
    let now = Date.now();

    for (let i = 0; i < plans.length; i++) {
        if (now - plans[i].upload_timestamp > TEMP_STORAGE_CUTOFF) {
            fs.rmSync(plans[i].path)
            Console.Log(`Removing temp-stored plan set: ${plans[i].path}`);
        }
    }
})

app.post("/authenticate", (req, res) => {
    let pass = req.body.key;
    let result = { result: "failed" }

    if (pass == admin_pass) {
        result.result = "success"
        result.data = load_page("pages/admin-secure.html").page
    }

    res.send(JSON.stringify(result))
})

app.post("/contact-request", (req, res) => {
    let data = req.body
    let file_message = `Name: ${data.name}<br>Email: ${data.email}<br>Number: ${data.number}<br>Message: ${data.message}`

    save_file(`data/contact/${data.email}-message.text`, file_message)

    res.send(success)
	
	let html = `<body><p>${file_message}</p></body>`
	send_message(message_recipient, "Contact Request", html);
})

app.post("/order-request", (req, res) => {
    let data = req.body
    let message = `Name: ${data.name}<br>Email: ${data.email}<br>Number: ${data.number}<br>`;

	let supplies = data.supplies;
	for (let i = 0; i < supplies.length; i++) {
		message += `<br>Item ${i + 1}:<br>Type: ${supplies[i].type}<br>Count: ${supplies[i].count}<br>`;
	}

	let html = `<body><p>${message}</p></body>`

    send_message(message_recipient, "Order Request", html);
	save_file("data/supplies/supply-order.txt", message);
		

    res.send(success)
})

app.post("/design-upload", upload.single("file"), (req, res) => {
    let order_name = req.body.name.replaceAll(' ', '_');
    let dir_name = "data/signs/designs/";

    let file_path = dir_name + req.file.originalname;
    fs.rename(req.file.path, file_path, (err) => {
        if (err) {
          console.error('Error moving the file:', err);
          res.status(500).send('Error saving the file');
          return;
        }
    });
	let data = req.body;	

	let message = `Name: ${data.name}<br>Email: ${data.email}<br>Number: ${data.number}<br>Format: ${data.format}`;
	let html = `<body><p>${message}</p><img src="https://www.semblueinc.com/retrieve-design/${req.file.originalname}"></img></body>`;
	send_message(message_recipient, "Sign Design Request", html);

    res.send(success)
})

app.post("/upload", upload.single('file'), (req, res) => {
    let title = req.body.title;
    let email = req.body.email;
    let bid_date = req.body.bid_date;
    let details = req.body.message;
    var file_name = req.file.originalname;
        
    while(file_name.indexOf(' ') >= 0) {
        file_name = file_name.replace(' ', '_');
    }


    let file_path = "assets/temp/" + file_name;
    fs.rename(req.file.path, file_path, (err) => {
        if (err) {
            console.error("Error moving plan pdf: ", err);
            res.send('Error saving plan pdf');
            return;
        }
        let plan_item = {path: file_path, upload_timestamp: Date.now()}
        temp_plan_stored.plans.push(plan_item)
        save_file("assets/temp/temp_data.json", JSON.stringify(temp_plan_stored))
    }); 

    if (req.body.start == "true") {
        queued_message.title = title;
        queued_message.recipient = email;
        queued_message.bid_date = bid_date;
	queued_message.message = details;
        queued_message.links += "https://semblueinc.com/" + file_path + "<br>";
    }
    else {
        queued_message.links += "https://semblueinc.com/" + file_path + "<br>";
    }
    
    if (req.body.end == "true")
    {
        let message = `<h1>Plan Set Upload</h1><h5>${queued_message.recipient}<br>${queued_message.title}<br>${queued_message.bid_date}<br>${queued_message.links}<br><br>Details:<br>${queued_message.message}</h5>`
        send_message(message_recipient, "Plan Set Upload", message);
        res.send(success);
        return;
    }
    res.send(JSON.stringify({"status": "waiting for all files"}))
})

function find_plan(plan, plan_cat) {
	let plans = stored_plan_data.categories[`${plan_cat}`]["plans"]
	for (let i = 0; i > plans.length; i++) {
		if (stored_plan_data.categories[`${plan_cat}`]['plans'][i].id == plan_set.id) {
			return i;
		}
	}
	return -1;
}

app.post("/plan-upload", upload.single("file"), (req, res) => {
    	let plan_set = {};
    	plan_set.title = req.body.title;
    	plan_set.contractor = req.body.contractor;
    	plan_set.bid_date = req.body.bid_date;
    	plan_set.current_set = req.body.current_set;
	plan_set.tracking = req.body.tracking;
	plan_set.id = req.body.id;
    plan_set.newforma = req.body.newforma;
//	plan_set.path = req.body.path;
	
	let plan_cat = req.body.category;

	if (req.file == undefined) {
		plan_set.path = "#";
	}
	else {
        	var file_name = req.file.originalname;
        	while(file_name.indexOf(' ') >= 0 || file_name.indexOf('#') >= 0) {
            		file_name = file_name.replace(' ', '_');
			file_name = file_name.replace('#','');
        	}
		let file_path = "assets/plan-data/" + file_name;
    		fs.rename(req.file.path, file_path, (err) => {
        		if (err) {
        	    		console.error("Error moving plan pdf: ", err);
            			res.status(500).send('Error saving plan pdf');
            			return;
        		}
   		});

    		plan_set.path = file_path;
	}
	let plan_index = find_plan(plan_set, plan_cat);
	if (plan_index >= 0 ) {
		if (plan_set.tracking != "Yes") {
			stored_plan_data.categories[`${plan_cat}`]["plans"].splice(plan_index, 1);
			
		}else{
			stored_plan_data.categories[`${plan_cat}`]["plans"][plan_index].title = plan_set.title;
			stored_plan_data.categories[`${plan_cat}`]["plans"][plan_index].contractor = plan_set.contractor;
			stored_plan_data.categories[`${plan_cat}`]["plans"][plan_index].bid_date = plan_set.bid_date;
			stored_plan_data.categories[`${plan_cat}`]["plans"][plan_index].current_set = plan_set.current_set;
			stored_plan_data.categories[`${plan_cat}`]["plans"][plan_index].path = plan_set.path;
            stored_plan_data.categories[`${plan_cat}`]["plans"][plan_index].newforma = plan_set.newforma;
		}
	}
	else if(plan_set.tracking == "Yes") {
    		stored_plan_data.categories[`${plan_cat}`]["plans"].push(plan_set);
	}


    save_file("assets/plan-data/data_table.json", JSON.stringify(stored_plan_data));

    res.send(success);
})

app.post("/upload-tax-form", upload.single("file"), (req, res) => {
    let file_path = "assets/tax-forms/" + req.file.originalname;
    console.log("uploading form")
    fs.rename(req.file.path, file_path, (err) => {
        if (err) {
            console.error('Error saving tax form: ', err);
            res.status(500).send('Error saving the file');
            return;
        }
    })

    res.send(success);
})

app.get("/forms-data", (req, res) => {
    fs.readdir(form_path, (err, files) => {
        if (err) {
            console.error(err);
            res.send("{ 'status' : 'error' }")
        }
        else {
            let response = {paths: files}
            res.send(JSON.stringify(response));
        }
    })
})

app.get("/form-data", (req, res) => {
    let path = form_path + req.query.path;
    res.sendFile(path, { root: __dirname });
})

app.get("/plan-categories", (req, res) => {
    let data = JSON.stringify(plan_categories);
    res.send(data);
})

app.get("/retrieve-plans", (req, res) => {
    res.send(JSON.stringify(stored_plan_data.categories[`${req.query.id}`]));
});

app.get("/retrieve-design/:filename", (req, res) => {
	let file_path = "data/signs/designs/" + req.params.filename;
	res.sendFile(file_path, { root: __dirname });
})

// Resource routing
app.get("/:dir/:rsrc", (req, res) => {
    if(__directories.includes(req.params.dir) == false)
        res.send("{'result': 'Failed to retrieve resource'}")
    else
        res.sendFile(`${req.params.dir}/${req.params.rsrc}`, { root: __dirname })
})

app.get("/:dir1/:dir2/:rsrc", (req, res) => {
    if (__directories.includes(req.params.dir1) == false || __directories.includes(req.params.dir2) == false){
        res.send("{'result': 'Failed to retrieve resource'}")
    }
    else{
        res.sendFile(`${req.params.dir1}/${req.params.dir2}/${req.params.rsrc}`, { root: __dirname })
    }
})



/*
Post example
app.post("/", (req, res) => {
    let data = req.body;
});
*/

app.listen(port, () => {
    console.log(`Semblueinc listening on port ${port}`)
    load_stored_plans();
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
