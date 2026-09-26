// Define file size constants and maximum file size for uploads
const kilo = 1024;
const mega = kilo * kilo;
const giga = kilo * mega; 
const MAX_FILE_SIZE = 5 * giga;

const http = require('http');
const nodemailer = require('nodemailer');
const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const combyne = require('combyne');
const multer = require("multer");
const upload = multer({dest: "data/temp", limits: { fileSize: MAX_FILE_SIZE }})
const exec = require('child_process').exec;

const bodyParser = require('body-parser');
const app = express();

// Sets the upload size limit for json blobs
app.use(bodyParser.json({limit: '5gb'}));
app.use(bodyParser.urlencoded({limit: '5gb', extended: true}));

const port = "3001"

const success = JSON.stringify({status: "success"})
const admin_pass = process.env.ADMIN_PASS || "$emBlue1nc";
const upload_pass = process.env.UPLOAD_PASS || admin_pass;
const upload_directory = path.join(__dirname, "data", "uploads");
const UPLOAD_AUTH_COOKIE = "uploads_auth";

const message_recipient = "eaststore@semblueinc.com";

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
	"data",
    "pages",
    "assets",
    "temp",
    "tax-forms",
    "printing-info",
    "bgswitch",
    "plan-data",
	"storage",
	"include",
	"uploads"
];

// Temp plan storage
const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const TEMP_STORAGE_CUTOFF = DAY * 30;
const UPLOAD_AUTH_DURATION = HOUR;
const UPLOAD_RATE_LIMIT_WINDOW = MINUTE;
const UPLOAD_RATE_LIMIT_MAX_REQUESTS = 30;

let temp_plan_stored = {"plans": []};
let upload_sessions = {};
let upload_rate_limits = {};

let requests = { 
	contact: [],
	supply: [],
	design: [],
	file: [],
}

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
		"pass": 'gpjd arjz lbhe kgda',
	}
})

// Takes in a category id and returns the corresponding category's name
function cat_id_to_name(id) {
	cats = plan_categories.cats;
	for(let i = 0; i < cats.length; i++) {
		if (cats[i].id == id)
			return cats[i].name;
	}
	return "Other"
}

// Removes all stored plan data and their pdfs
function clear_plan_data() {
	for(let cat = 1; cat <= 10; cat++) {
		length = stored_plan_data.categories[`${cat}`].plans.length
		while (length > 0) {
			stored_plan_data.categories[`${cat}`].plans.pop()
			length = stored_plan_data.categories[`${cat}`].plans.length;
		}
	}
	save_file("assets/plan-data/data_table.json", JSON.stringify(stored_plan_data, null, 4));
	exec('rm assets/plan-data/*.pdf', (err, s_out, s_err) => {
		console.log('stdout: ' + s_out);
		console.log('stderr: ' + s_err);
		if (err !== null) {
			console.log('exec error: ' + err);
		}
	});
}

// Saves inputted data to a file with the given directory path
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

// Opens stored plan data file, parses the json, loads data into memory
function load_stored_plans() {
    const data = fs.readFileSync("assets/plan-data/data_table.json", 'utf-8');
    plans = JSON.parse(data);
    stored_plan_data = plans;

    const temp_data = fs.readFileSync("assets/temp/temp_data.json", "utf-8");
    plans = JSON.parse(temp_data)
    temp_plan_stored = plans;
}

function normalize_uploaded_file_name(file_name) {
    return path.basename(String(file_name || ""))
        .replace(/ /g, "_")
        .replace(/'/g, "")
        .replace(/[^A-Za-z0-9._-]/g, "_");
}

function get_uploaded_file_path(file_name) {
    let safe_file_name = String(file_name || "").trim();
    if (safe_file_name.length == 0 || safe_file_name !== path.basename(safe_file_name))
        return null;
    if (/^[A-Za-z0-9._-]+$/.test(safe_file_name) == false)
        return null;
    return path.join(upload_directory, safe_file_name);
}

function parse_cookies(req) {
    let raw_cookie = String(req.headers.cookie || "");
    let pairs = raw_cookie.split(";");
    let cookies = {};

    for (let i = 0; i < pairs.length; i++) {
        let pair = pairs[i].trim();
        if (pair.length == 0 || pair.indexOf("=") < 0)
            continue;

        let separator = pair.indexOf("=");
        let key = pair.substring(0, separator);
        let value = pair.substring(separator + 1);
        try {
            cookies[key] = decodeURIComponent(value);
        }
        catch {
            cookies[key] = value;
        }
    }

    return cookies;
}

function create_upload_session(res) {
    let token = crypto.randomBytes(32).toString("hex");
    upload_sessions[token] = Date.now() + UPLOAD_AUTH_DURATION;
    res.setHeader("Set-Cookie", `${UPLOAD_AUTH_COOKIE}=${token}; Max-Age=${Math.floor(UPLOAD_AUTH_DURATION / SECOND)}; HttpOnly; SameSite=Strict; Path=/`);
}

function is_upload_authenticated(req) {
    let cookies = parse_cookies(req);
    let token = cookies[UPLOAD_AUTH_COOKIE];

    if (token == undefined || upload_sessions[token] == undefined)
        return false;

    if (upload_sessions[token] < Date.now()) {
        delete upload_sessions[token];
        return false;
    }

    return true;
}

function prune_upload_state() {
    let now = Date.now();

    for (let token in upload_sessions) {
        if (upload_sessions[token] < now)
            delete upload_sessions[token];
    }

    for (let key in upload_rate_limits) {
        if (now - upload_rate_limits[key].window_start >= UPLOAD_RATE_LIMIT_WINDOW)
            delete upload_rate_limits[key];
    }
}

function require_upload_auth(req, res, next) {
    if (is_upload_authenticated(req) == false) {
        res.status(401).send(JSON.stringify({ status: "error", message: "Authentication required." }));
        return;
    }

    next();
}

function check_upload_rate_limit(req, res) {
    prune_upload_state();
    let now = Date.now();
    let key = `${req.ip}:${req.path}`;
    let rate_limit = upload_rate_limits[key];

    if (rate_limit == undefined || now - rate_limit.window_start >= UPLOAD_RATE_LIMIT_WINDOW) {
        upload_rate_limits[key] = { count: 1, window_start: now };
        return false;
    }

    if (rate_limit.count >= UPLOAD_RATE_LIMIT_MAX_REQUESTS) {
        res.status(429).send(JSON.stringify({ status: "error", message: "Too many requests." }));
        return true;
    }

    rate_limit.count++;
    return false;
}

function passwords_match(expected_pass, input_pass) {
    let expected = String(expected_pass || "");
    let input = String(input_pass || "");

    if (expected.length == 0)
        return false;

    let expected_hash = crypto.createHash("sha256").update(expected).digest();
    let input_hash = crypto.createHash("sha256").update(input).digest();
    return crypto.timingSafeEqual(expected_hash, input_hash);
}

// Read raw html data
function load_page(path) {
    const data = fs.readFileSync(path, 'utf-8')
    var index = [path.lastIndexOf('/'), path.lastIndexOf('.')]    
    const name = path.substring(index[0] + 1, index[1])
    return { page: data, page_name: name }
}

// Apply templating
function render_page(path, context = {}) {
    let page_data = { ...load_page(path), ...context };
    let page = combyne(page_template)
    return page.render(page_data)
}

// Send an email to the inputted recipient with the given subject and message body
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

// Landing page
app.get("/", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Headers", "*");
	res.setHeader("Access-Control-Allow-Methods", "*");
	res.send(render_page("pages/index.html"))
});

app.get("/requests", (req, res) => {
	const allowed_types = ["contact", "supply", "design", "file"];
	let type = allowed_types.includes(req.query.type) ? req.query.type : "";
	res.send(render_page('pages/requests.html', { request_type: type }));
});

/*
app.get("/clear", (req, res) => {
	clear_plan_data();
	res.send(success);
})
*/

// Request to open up the page for one of the services.
// Specific service name is included in the query and used to determine the correct html page.
app.get("/services", (req, res) => {
    res.send(render_page(`pages/services/${req.query.page}.html`))
})

// Returns information page about semblueinc and the company values
app.get("/learn", (req, res) => {
	res.send(render_page(`pages/learn.html`))
})

// Returns the contact form page
app.get("/contact", (req, res) => {
    res.send(render_page("pages/contact.html"))
})

// Returns page for users to access all tax documents for semblueinc
app.get("/tax-forms", (req, res) => {
    res.send(render_page("pages/forms.html"))
})

// Returns page for viewing all current plans being tracked
app.get("/plans", (req, res) => {
    res.send(render_page("pages/plans.html"))
})

// Returns page with form for uploading a set of plans along with some extra information.
app.get("/plan-upload", (req, res) => {
    res.send(render_page("pages/plan-upload.html"))
})

app.get("/file-upload", (req, res) => {
    res.send(render_page("pages/file-upload.html"))
})

app.get("/uploads", (req, res) => {
    res.send(render_page("pages/uploads.html"))
})

// Returns log-in page for admin tools page
app.get("/admin", (req,res) => {
    res.send(render_page("pages/admin.html"))
})

// Checks if temporarily stored plan uploads have expired.
// If plans are expired then remove them from server.
app.get("/check-temps", (req, res) =>{
    res.send(success);
    let plans = temp_plan_stored.plans;
    let now = Date.now();

    for (let i = 0; i < plans.length; i++) {
        if (now - plans[i].upload_timestamp > TEMP_STORAGE_CUTOFF) {
            fs.rmSync(plans[i].path)
            Console.Log(`Removing temp-stored plan set: ${plans[i].path}`);
	    plans.splice(i, 1);
	    i--;
        }
    }
    temp_plan_stored.plans = plans;
    save_file("assets/temp/temp_data.json", JSON.stringify(temp_plan_stored));
})

// Check within the admin log-in panel for password authentication.
// If password matches, return page data for admin tools page.
// If password doesn't match, return failed result blob.
app.post("/authenticate", (req, res) => {
    let pass = req.body.key;
    let result = { result: "failed" }

    if (passwords_match(admin_pass, pass)) {
        result.result = "success"
        result.data = load_page("pages/admin-secure.html").page
    }

    res.send(JSON.stringify(result))
})

app.post("/uploads-authenticate", (req, res) => {
    if (check_upload_rate_limit(req, res))
        return;

    let pass = req.body.key;
    let result = { result: "failed" }

    if (passwords_match(upload_pass, pass)) {
        result.result = "success";
        create_upload_session(res);
    }

    res.send(JSON.stringify(result));
})

// Uploads contact form information submitted from contact page.
// Saves data into brief message, saves to a file in data directory,
// and send an email to store email with contact message.
app.post("/contact-request", (req, res) => {
    let data = req.body
    let html = `
	<div style="display: flex; align-content: center; text-align: center;">
		<div style="margin-left: auto; margin-right: auto; width:auto;">
			<h2><b>Contact Request</b></h2>
			<h3><u>Name</u></h3>
			<h4>${data.name}</h4>
			<h3><u>Email</u></h3>
			<h4>${data.email}</h4>
			<h3><u>Phone</u></h3>
			<h4>${data.number}</h4>
			<h3><u>Message</u></h3>
			<h4>${data.message}</h4>
		</div>
	</div>
    `

    requests["contact"].push(html);
    save_file(`data/requests.json`, JSON.stringify(requests, null, 4))

    res.send(success)
	
    send_message(message_recipient, "Contact Request", html);
})

// Uploads information from supply order form on the supplies services page.
// Saves supplies information into a brief message which is then saved to file
// in data and sent to the store email.
app.post("/order-request", (req, res) => {
    let data = req.body
    let items = ""
    let supplies = data.supplies;
    for (let i = 0; i < supplies.length; i++) {
	items += `<br>Item ${i + 1}:<br>Type: ${supplies[i].type}<br>Count: ${supplies[i].count}<br>`;
    }
    let message = `
	<div style="display: flex; align-content: center; text-align: center;">
		<div style="margin-left: auto; margin-right: auto; width: auto;">
			<h2><b>Supply Order</b></h2>
			<h3><u>Name</u></h3>
			<h4>${data.name}</h4>
			<h3><u>Email</u></h3>
			<h4>${data.email}</h4>
			<h3><u>Phone</u></h3>
			<h4>${data.number}</h4>
			<h3><u>Items</u></h3>
			<h4>${items}</h4>
		</div>
	</>`

    send_message(message_recipient, "Order Request", html);
    
    request["supply"].push(message);
    save_file('data/requests.json', JSON.stringify(requests, null, 4));

    res.send(success)
})

// Uploads information from custom sign design form on sign services page.
// Saves sign design and type to a brief message which is then saved to file
// in the data directory and then sent to the store email.
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
    let html = `
	<div style="display: flex; align-content: center; text-align: center;">
		<div style="margin-left: auto; margin-right: auto; width: auto;">
			<h2><b>Custom Sign Design</b></h2>
			<h3><u>Name</u></h3>
			<h4>${data.name}</h4>
			<h3><u>Email</u></h3>
			<h4>${data.email}</h4>
			<h3><u>Phone</u></h3>
			<h4>${data.number}</h4>
			<h3><u>Format</u></h3>
			<h4>${data.format}</h4>
			<img src="https://www.semblueinc.com/retrieve-design/${req.file.originalname}"></img>
		</div>
	</div`
    send_message(message_recipient, "Sign Design Request", html);

    request["design"].push(html);
    save_file('data/requests.json', JSON.stringify(requests, null, 4));

    res.send(success)
})

app.post("/file-upload", upload.array('files', 12), (req, res) => {
	// Submitter info
	let email = req.body.email;
	let description = req.body.desc;
	let name = req.body.name;

	// File data
	let files = req.files;
	let file_paths = []
	let file_names = []

	// Move each file to server location
	for (let i = 0; i < files.length; i++) {
		let curr_file = files[i];
 
		var file_name = normalize_uploaded_file_name(curr_file.originalname);
		file_names.push(file_name)
	
		let temp_file_path = curr_file.path;
		let final_path = path.join("data", "uploads", file_name);
		file_paths.push(final_path)
	
		fs.rename(temp_file_path, final_path, (e) => {
			if (e) {
				res.send("Error saving file upload.");
				return;
			}
		})
	}

	// Generate email
	var html = `
	<div>
		<h2 style='width: 100%; padding: 10px; text-align: left;'>
			!# SemBlueInc | File Upload #!
		</h2><br/>
		<span>
			<strong>Submitter: </strong>
			${name}
		</span><br/>
		<span>
			<strong>Email: </strong>
			${email}
		</span><br/>
		<span>
			<strong>File Description: </strong>
			${description}
		</span><br/><br/>
		<span>
			<strong>${req.files.length} File(s)</strong>
		</span><br/>`;
			
	for (let i = 0; i < file_names.length; i++) {
		let name = file_names[i]
		let path = file_paths[i]
		html += `<span>
				<strong>File ${i + 1} Download:</strong><a href='https://semblueinc.com/${path}' target='_blank'>${name}</a>
				</span><br/>`;
	}
		
	html += `</div>`;
	send_message(message_recipient, "Semblueinc File Upload", html);
	res.send(JSON.stringify({"status": "success"}));
})

app.get("/uploads-data", (req, res) => {
    if (check_upload_rate_limit(req, res))
        return;
    if (is_upload_authenticated(req) == false) {
        res.status(401).send(JSON.stringify({ status: "error", message: "Authentication required." }));
        return;
    }

    fs.readdir(upload_directory, { withFileTypes: true }, (err, entries) => {
        if (err) {
            console.error("Error reading uploads directory:", err);
            res.status(500).send(JSON.stringify({ status: "error" }));
            return;
        }

        let files = entries
            .filter((entry) => entry.isFile())
            .map((entry) => entry.name)
            .filter((entry) => /^[A-Za-z0-9._-]+$/.test(entry))
            .sort((a, b) => a.localeCompare(b));

        res.json({ files: files });
    });
})

app.delete("/delete-upload", (req, res) => {
    if (check_upload_rate_limit(req, res))
        return;
    if (is_upload_authenticated(req) == false) {
        res.status(401).send(JSON.stringify({ status: "error", message: "Authentication required." }));
        return;
    }

    let file_name = String(req.body.file_name || "");
    let file_path = get_uploaded_file_path(file_name);

    if (file_path == null) {
        res.status(400).send(JSON.stringify({ status: "error", message: "Invalid file name." }));
        return;
    }
	try {
		fs.rmSync(file_path, (err) => {
			if (err) {
				if (err.code == "ENOENT") {
					res.status(404).send(JSON.stringify({ status: "error", message: "File not found." }));
					return;
				}
	
				console.error("Error deleting uploaded file:", err);
				res.status(500).send(JSON.stringify({ status: "error", message: "Unable to delete file." }));
				return;
			}
	
			res.json({ status: "success" });
		});
	} catch (err) {
		console.error("Error deleting uploaded file:", err);
		res.status(500).send(JSON.stringify({ status: "error", message: "Unable to delete file(" + file_path + "). " + err.message }));
		return;
	}
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
        save_file("assets/temp/temp_data.json", JSON.stringify(temp_plan_stored, null, 4))
    }); 

    if (req.body.start == "true") {
        queued_message.title = title;
        queued_message.recipient = email;
        queued_message.bid_date = bid_date;
	    queued_message.message = details;
        queued_message.links = "";
        queued_message.links += "https://semblueinc.com/" + file_path + "<br>";
    }
    else {
        queued_message.links += "https://semblueinc.com/" + file_path + "<br>";
    }
    
    if (req.body.end == "true")
    {
        let html = `
		<div style="display: flex; align-content: center; text-align: center;">
			<div style="margin-left: auto; margin-right: auto; width: auto;">
				<h2><b>Plan Set Upload</b></h2>
				<h3><u>Project Name</u></h3>
				<h4>${queued_message.title}</h4>
				<h3><u>Email</u></h3>
				<h4>${queued_message.recipient}</h4>
				<h3><u>Bid Date</u></h3>
				<h4>${queued_message.bid_date}</h4>
				<h3><u>Links</u></h3>
				<h4>${queued_message.links}</h4>
				<h3><u>Message</u></h3>
				<h4>${queued_message.message}</h4>
			</div>
		</div>
	    `
        send_message(message_recipient, "Plan Set Upload", html);
	
		requests["file"].push(html);
		save_file('data/requests.json', JSON.stringify(requests, null, 4));
	
        res.send(success);
        return;
    }
    res.send(JSON.stringify({"status": "waiting for all files"}))
})

function find_plan(plan, plan_cat) {
	let plans = stored_plan_data.categories[`${plan_cat}`]["plans"]
	for (let i = 0; i < plans.length; i++) {
		if (stored_plan_data.categories[`${plan_cat}`]['plans'][i].id == plan.id) {
			return i;
		}
	}
	return -1;
}

app.post("/plan-upload", upload.single("file"), (req, res) => {
    	let plan_set = {};
    	plan_set.title = req.body.name;
    	plan_set.contractor = req.body.contractor;
    	plan_set.bid_date = req.body.bid_date;
    	plan_set.current_set = req.body.version;
	plan_set.tracking = req.body.tracking;
	plan_set.id = req.body.id;
	plan_set.newforma = req.body.newforma;
	plan_set.is_public = req.body.public;
	console.log(req.body);
	//plan_set.path = req.body.path;
	
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
		if (plan_set.tracking == "No") {
			console.log("deleting plan: " + plan_index);
			stored_plan_data.categories[`${plan_cat}`]["plans"].splice(plan_index, 1);
			if (plan_set.path != "#") {
				fs.rmSync(plan_set.path)
				console.log("removed plans: " + plan_set.path);
			}
		}else{
			stored_plan_data.categories[`${plan_cat}`]["plans"][plan_index].title = plan_set.title;
			stored_plan_data.categories[`${plan_cat}`]["plans"][plan_index].contractor = plan_set.contractor;
			stored_plan_data.categories[`${plan_cat}`]["plans"][plan_index].bid_date = plan_set.bid_date;
			stored_plan_data.categories[`${plan_cat}`]["plans"][plan_index].current_set = plan_set.current_set;
			stored_plan_data.categories[`${plan_cat}`]["plans"][plan_index].path = plan_set.path;
			stored_plan_data.categories[`${plan_cat}`]["plans"][plan_index].newforma = plan_set.newforma;
			stored_plan_data.categories[`${plan_cat}`]["plans"][plan_index].is_public = plan_set.is_public;
		}
	}
	else if(plan_set.tracking == "Yes") {
 		stored_plan_data.categories[`${plan_cat}`]["plans"].push(plan_set);
		console.log("Pushing: ", plan_set);
	}


    save_file("assets/plan-data/data_table.json", JSON.stringify(stored_plan_data, null, 4));

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

setInterval(prune_upload_state, UPLOAD_RATE_LIMIT_WINDOW);

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
if (fs.existsSync("data/uploads") == false) {
    fs.mkdirSync("data/uploads")
}

if (admin_pass.length == 0) {
    console.warn("ADMIN_PASS is not set; admin pages will reject all authentication attempts.");
}
if (upload_pass.length == 0) {
    console.warn("UPLOAD_PASS is not set; the uploads dashboard will reject all authentication attempts.");
}
