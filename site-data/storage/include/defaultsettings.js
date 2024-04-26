/**************************************************
BKWorks Multi-User File Manager
Version 1.00
http://www.bkworksproducts.info/?view=view_product&prodid=3
defaultsettings.js: this script will change the settings back to normal in the 'admin panel -> settings' page.
**************************************************/

function resettodefault() {
	var x = confirm("Really resort to default factory settings?");
	if(x) {
		// Set your values here, or leave them with the original details.
		var theform = document.SettingsForm;
		var default_title = "BKWorks Products";
		var default_subtitle = "Multi-User File Manager";
		var default_logon_header = "Logon";
		var default_logon_text = "Please insert your user name and password to begin.";
		var default_register_header = "Register";
		var default_register_text = "Please fill out all of the values, then click the submit button.";
		var default_register_success_header = "Welcome!";
		var default_register_success_text = "You have successfully registered.";
		var default_logoff_header = "Log-Off Successful!";
		var default_logoff_text = "You have successfully logged off.";
		var default_extensions = "doc docx ppt pptx exl exlx png jpg bmp tif tiff png exe bat txt zip gs";
		var default_max_size = 1048576;
		var default_max_files = 5;
		var default_open_reg = 0;
		var default_edit_profile = 1;
		
		// Do not edit this section. This section is what actually performs the changes.
		theform.title.value = default_title;
		theform.subtitle.value = default_subtitle;
		theform.logon_header.value = default_logon_header;
		theform.logon_text.value = default_logon_text;
		theform.register_header.value = default_register_header;
		theform.register_text.value = default_register_text;
		theform.register_success_header.value = default_register_success_header;
		theform.register_success_text.value = default_register_success_text;
		theform.logoff_header.value = default_logoff_header;
		theform.logoff_text.value = default_logoff_text;
		theform.allowed_filetypes.value = default_extensions;
		theform.max_size.value = default_max_size;
		theform.max_num_files.value = default_max_files;
		theform.public_registration.value = default_open_reg;
		theform.public_edit_profile.value = default_edit_profile;
	}
}