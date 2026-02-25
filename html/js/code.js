const urlBase = 'http://142.93.67.135/API';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

let toastTimer = null;
function showToast(message, type) {
    let toast = document.getElementById("toast");
    toast.textContent = message;
    toast.className = "toast " + (type === "error" ? "toast-error" : "toast-success") + " show";
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function() {
        toast.classList.add("fade-out");
        toast.classList.remove("show");
    }, 3000);
}

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

    // Reset previous error highlights
    document.getElementById("loginName").classList.remove("input-error");
    document.getElementById("loginPassword").classList.remove("input-error");

//	let tmp = {login:login,password:password};
	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if (userId < 1) {
                    // Login failed → show error and highlight fields
                    document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
                    document.getElementById("loginName").classList.add("input-error");
                    document.getElementById("loginPassword").classList.add("input-error");
                    return;
                }
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				showSplashAndNavigate("contacts.html");
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

	// Optional: remove red highlight when user types
    document.getElementById("loginName").addEventListener("input", function() {
        this.classList.remove("input-error");
    });
    document.getElementById("loginPassword").addEventListener("input", function() {
        this.classList.remove("input-error");
    });

}

function showSplashAndNavigate(targetUrl)
{
	document.getElementById("splashOverlay").style.display = "flex";
	setTimeout(function() {
		window.location.href = targetUrl;
	}, 1000);
}

// --- Page-load splash screen ---
// Hides after BOTH the minimum time AND page load are complete (whichever is last).
(function() {
	var MINIMUM_SPLASH_MS = 1000;
	var timerDone = false;
	var pageLoaded = false;

	function hideSplashIfReady() {
		if (timerDone && pageLoaded) {
			var overlay = document.getElementById("splashOverlay");
			if (overlay) overlay.style.display = "none";
		}
	}

	setTimeout(function() {
		timerDone = true;
		hideSplashIfReady();
	}, MINIMUM_SPLASH_MS);

	window.addEventListener("load", function() {
		pageLoaded = true;
		hideSplashIfReady();
	});
})();

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		let welcomeEl = document.getElementById("welcomeMessage");
		if (welcomeEl) {
			welcomeEl.innerHTML = "Welcome, " + firstName;
		}
	}
}

function doRegister()
{
	document.getElementById("registerResult").innerHTML = "";

	let firstName = document.getElementById("registerFirstName").value;
	let lastName = document.getElementById("registerLastName").value;
	let login = document.getElementById("registerLogin").value;
	let password = document.getElementById("registerPassword").value;

	document.getElementById("registerFirstName").classList.remove("input-error");
	document.getElementById("registerLastName").classList.remove("input-error");
	document.getElementById("registerLogin").classList.remove("input-error");
	document.getElementById("registerPassword").classList.remove("input-error");

	if (firstName.trim() === "" || lastName.trim() === "" || login.trim() === "" || password.trim() === "")
	{
		document.getElementById("registerResult").innerHTML = "Please fill in all fields";
		// Highlight empty fields only
    	if (firstName.trim() === "") document.getElementById("registerFirstName").classList.add("input-error");
   		if (lastName.trim() === "") document.getElementById("registerLastName").classList.add("input-error");
    	if (login.trim() === "") document.getElementById("registerLogin").classList.add("input-error");
    	if (password.trim() === "") document.getElementById("registerPassword").classList.add("input-error");
		return;
	}

	const validation = validateSignup(login, password);



	if (validation.errors.length > 0) {
    	const errorsDiv = document.getElementById("registerResult");

    	if (validation.errors.length === 1) {
        	errorsDiv.style.textAlign = "center";
       		errorsDiv.innerHTML = validation.errors[0];
    	} else {
        	errorsDiv.style.textAlign = "left";
        	errorsDiv.innerHTML = "<ul><li>" + validation.errors.join("</li><li>") + "</li></ul>";
    	}

    	// Highlight the fields that failed
		if (validation.fields.username) document.getElementById("registerLogin").classList.add("input-error");
    	if (validation.fields.password) document.getElementById("registerPassword").classList.add("input-error");

    	return; // stop submission
	}


	var hash = md5( password );
	let tmp = {firstName:firstName, lastName:lastName, login:login, password:hash};
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/Register.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		xhr.onreadystatechange = function()
		{

			if (this.readyState == 4 && this.status == 200)
			{
				let jsonObject = JSON.parse(xhr.responseText);

				if(jsonObject.id <1)
				{
					document.getElementById("registerResult").innerHTML = jsonObject.error;
					return;
				}

				userId = jsonObject.id;
				window.firstName = jsonObject.firstName;
				window.lastName = jsonObject.lastName;

				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();

				// Brief success state on signup button before navigating
				var signupBtn = document.getElementById("signupButton");
				if (signupBtn) {
					signupBtn.textContent = "\u2713";
					signupBtn.classList.add("btn-success-state");
					setTimeout(function() {
						window.location.href = "contacts.html";
					}, 300);
				} else {
					window.location.href = "contacts.html";
				}
			}
		};
		xhr.send(jsonPayload);
	}

	catch(err)
	{
		document.getElementById("registerResult").innerHTML = err.message;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", () => {
    const loginToggle = document.getElementById("loginToggle");
    const loginDiv = document.getElementById("loginDiv");

    if (loginToggle && loginDiv) {
        loginToggle.addEventListener("click", () => {
            if (loginDiv.style.display === "none" || loginDiv.style.display === "") {
                loginDiv.style.display = "block";
            } else {
                loginDiv.style.display = "none";
            }
        });
    }

    // Autofocus first login input
    var loginNameInput = document.getElementById("loginName");
    if (loginNameInput) loginNameInput.focus();
});


function showLogin() {
    document.getElementById("loginForm").style.display = "block";
    document.getElementById("signupForm").style.display = "none";
    document.getElementById("loginTab").classList.add("active");
    document.getElementById("signupTab").classList.remove("active");
}

function showSignup() {
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("signupForm").style.display = "block";
    document.getElementById("loginTab").classList.remove("active");
    document.getElementById("signupTab").classList.add("active");
}

document.addEventListener("DOMContentLoaded", function () {

    const username = document.getElementById("registerLogin");
    const password = document.getElementById("registerPassword");

    const rulesBox = document.getElementById("signupRules");
    const usernameRules = document.getElementById("usernameRules");
    const passwordRules = document.getElementById("passwordRules");

    if (!username || !password || !rulesBox) return;

    function hideRulesIfOutside(e) {
        if (e.relatedTarget === username || e.relatedTarget === password) {
            return;
        }
        rulesBox.style.display = "none";
    }

    username.addEventListener("focus", function () {
        rulesBox.style.display = "block";
        usernameRules.style.display = "block";
        passwordRules.style.display = "none";
    });

    password.addEventListener("focus", function () {
        rulesBox.style.display = "block";
        usernameRules.style.display = "none";
        passwordRules.style.display = "block";
    });

    username.addEventListener("blur", hideRulesIfOutside);
    password.addEventListener("blur", hideRulesIfOutside);

	    // Login password toggle
    const loginPassword = document.getElementById("loginPassword");
    const loginToggle = document.getElementById("loginTogglePassword");

    function toggleLoginPassword() {
        var img = loginToggle.querySelector("img");
        if (loginPassword.type === "password") {
            loginPassword.type = "text";
            img.src = "images/openshell.png";
            img.alt = "Hide password";
        } else {
            loginPassword.type = "password";
            img.src = "images/closedshell.png";
            img.alt = "Show password";
        }
    }
    loginToggle.addEventListener("click", toggleLoginPassword);
    loginToggle.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleLoginPassword(); }
    });

    // Signup password toggle
    const signupPassword = document.getElementById("registerPassword");
    const signupToggle = document.getElementById("signupTogglePassword");

    function toggleSignupPassword() {
        var img = signupToggle.querySelector("img");
        if (signupPassword.type === "password") {
            signupPassword.type = "text";
            img.src = "images/openshell.png";
            img.alt = "Hide password";
        } else {
            signupPassword.type = "password";
            img.src = "images/closedshell.png";
            img.alt = "Show password";
        }
    }
    signupToggle.addEventListener("click", toggleSignupPassword);
    signupToggle.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleSignupPassword(); }
    });

});

function validateSignup(username, password) {
    let errors = [];
	let fields = { username: false, password: false };

    // Username rules
    if (!/[a-zA-Z]/.test(username)) {
        errors.push("Username must include at least one letter.");
		fields.username = true;
    }
    if (username.length < 3 || username.length > 22) {
        errors.push("Username must be 3–22 characters long.");
		fields.username = true;
    }

    // Password rules
    if (password.length < 8) {
        errors.push("Password must be at least 8 characters.");
		fields.password = true;
    }
    if (!/[a-zA-Z]/.test(password)) {
        errors.push("Password must include at least one letter.");
		fields.password = true;
    }
    if (!/\d/.test(password)) {
        errors.push("Password must include at least one number.");
		fields.password = true;
    }
    if (!/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password)) {
        errors.push("Password must include at least one special character.");
		fields.password = true;
    }

    return { errors, fields };
}

        function validateEmail(email) {
            return /^[^+]+@.+\..+$/.test(email);
        }

        function validatePhone(phone) {
            let digits = phone.replace(/[-().() ]/g, '');
            return /^\d{10}$/.test(digits);
        }

        function formatPhone(phone) {
            let digits = phone.replace(/\D/g, '');
            return digits.slice(0, 3) + '-' + digits.slice(3, 6) + '-' + digits.slice(6, 10);
        }

        // --- Search Contacts ---
        function searchContact() {
            let srch = document.getElementById("searchText").value;
            document.getElementById("contactSearchResult").innerHTML = "";

            let payload = JSON.stringify({search: srch, userId: userId});
            let url = urlBase + '/SearchContacts.' + extension;

            let xhr = new XMLHttpRequest();
            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
            try {
                xhr.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        let json = JSON.parse(xhr.responseText);
                        if (json.error && json.error.length > 0) {
                            showToast(json.error, "error");
                            return;
                        }

                        let html = '<span class="success">Found ' + json.results.length + ' contact(s):</span><br>';
                        for (let i = 0; i < json.results.length; i++) {
                            let c = json.results[i];
                            html += '[ID ' + c.id + '] ' + c.firstName + ' ' + c.lastName + ' | ' + c.email + ' | ' + c.phone + '<br>';
                        }
                        document.getElementById("contactSearchResult").innerHTML = html;
                    }
                };
                xhr.send(payload);
            } catch(err) {
                showToast(err.message, "error");
            }
        }
		
		function modifiedSearchContact() {
            let srch = document.getElementById("searchText").value;
            let resultContainer = document.getElementById("contactSearchResult");

            // Fade out existing results briefly before replacing
            if (resultContainer.innerHTML.trim() !== "") {
                resultContainer.classList.add("fading");
            }

            let payload = JSON.stringify({search: srch, userId: userId});
            let url = urlBase + '/SearchContacts.' + extension;

            let xhr = new XMLHttpRequest();
            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
            try {
                xhr.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        let json = JSON.parse(xhr.responseText);
                        resultContainer.classList.remove("fading");

                        if (json.error && json.error.length > 0) {
                            resultContainer.innerHTML = "";
                            showToast(json.error, "error");
                            return;
                        }
						
						let html = "";
						
						if (json.results.length == 1) {
							html += '<span class="success" id="searchSuccessMessage">Showing ' + json.results.length + ' contact:</span><br>'
						}
						else {
                        html += '<span class="success" id="searchSuccessMessage">Showing ' + json.results.length + ' contacts:</span><br>'
						}
						html 
                            += '<table id="contactsTable">'
                            + '<tr>'
                            + '<th style="display:none">ID</th>'
                            + '<th>First Name</th>'
                            + '<th>Last Name</th>'
                            + '<th>Email</th>'
                            + '<th>Phone Number</th>'
                            + '<th>Actions</th>'
                            + '</tr>';
                        for (let i = 0; i < json.results.length; i++) {
                            let c = json.results[i];
                            html += buildContactRow(c.id, c.firstName, c.lastName, c.email, c.phone);
                        }
                        html += '</table>';
                        resultContainer.innerHTML = html;

                        // Staggered fade-in-up on each result row
                        var rows = resultContainer.querySelectorAll("#contactsTable tr");
                        for (var ri = 1; ri < rows.length; ri++) {
                            rows[ri].classList.add("fade-in-up");
                            rows[ri].style.animationDelay = (ri * 40) + "ms";
                        }
                    }
                };
                xhr.send(payload);
            } catch(err) {
                showToast(err.message, "error");
            }
        }

        function buildContactRow(id, firstName, lastName, email, phone) {
            let safeName = (firstName + ' ' + lastName).replace(/'/g, "\\'");
            return '<tr id="contact-row-' + id + '">'
                + '<td style="display:none">' + id + '</td>'
                + '<td>' + firstName + '</td>'
                + '<td>' + lastName + '</td>'
                + '<td>' + email + '</td>'
                + '<td>' + phone + '</td>'
                + '<td>'
                + '<button type="button" class="editButton" onclick="editVariableContact(' + id + ');" title="Edit">&#9998;</button> '
                + '<button type="button" class="deleteButton" onclick="deleteVariableContact(' + id + ', \'' + safeName + '\');" title="Delete">&#128465;</button>'
                + '</td>'
                + '</tr>';
        }

        function attachRowKeyboardNav(row, saveFn, cancelFn) {
            let inputs = row.querySelectorAll("input[type='text']");
            inputs.forEach(function(input) {
                input.addEventListener("keydown", function(e) {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        saveFn();
                    } else if (e.key === "Escape") {
                        e.preventDefault();
                        cancelFn();
                    }
                });
            });
            if (inputs.length > 0) inputs[0].focus();
        }

        function editVariableContact(contactId) {
            let row = document.getElementById("contact-row-" + contactId);
            if (!row) return;

            let cells = row.getElementsByTagName("td");
            let origFirst = cells[1].innerText;
            let origLast = cells[2].innerText;
            let origEmail = cells[3].innerText;
            let origPhone = cells[4].innerText;

            // Store original values as data attributes for change detection on save
            row.setAttribute("data-orig-first", origFirst);
            row.setAttribute("data-orig-last", origLast);
            row.setAttribute("data-orig-email", origEmail);
            row.setAttribute("data-orig-phone", origPhone);

            // Crossfade morph: text → input for each editable cell
            var editableCells = [cells[1], cells[2], cells[3], cells[4]];
            var origValues = [origFirst, origLast, origEmail, origPhone];

            editableCells.forEach(function(cell, idx) {
                var textSpan = document.createElement("span");
                textSpan.className = "cell-morph-text";
                textSpan.textContent = origValues[idx];

                var input = document.createElement("input");
                input.type = "text";
                input.value = origValues[idx];
                input.style.opacity = "0";
                input.style.position = "absolute";
                input.style.left = "0";
                input.style.top = "50%";
                input.style.transform = "translateY(-50%)";
                input.style.width = "90%";

                cell.textContent = "";
                cell.style.position = "relative";
                cell.appendChild(textSpan);
                cell.appendChild(input);

                // Trigger crossfade after a frame
                requestAnimationFrame(function() {
                    textSpan.classList.add("fading");
                    input.style.opacity = "1";
                    input.style.position = "relative";
                    input.style.left = "";
                    input.style.top = "";
                    input.style.transform = "";

                    // After transition, clean up the text span and reveal input border
                    setTimeout(function() {
                        if (textSpan.parentNode) textSpan.remove();
                        input.classList.add("morph-visible");
                    }, 180);
                });
            });

            // Save/Cancel buttons with fade-in animation
            cells[5].innerHTML = '<button type="button" class="saveButton action-fade-in" onclick="saveEditContact(' + contactId + ');">Save</button> '
                + '<button type="button" class="cancelButton action-fade-in" onclick="cancelEditContact(' + contactId + ', \'' + origFirst.replace(/'/g, "\\'") + '\', \'' + origLast.replace(/'/g, "\\'") + '\', \'' + origEmail.replace(/'/g, "\\'") + '\', \'' + origPhone.replace(/'/g, "\\'") + '\');">Cancel</button>';

            attachRowKeyboardNav(row,
                function() { saveEditContact(contactId); },
                function() { cancelEditContact(contactId, origFirst, origLast, origEmail, origPhone); }
            );
        }

        function saveEditContact(contactId) {
            let row = document.getElementById("contact-row-" + contactId);
            let inputs = row.getElementsByTagName("input");
            let fName = inputs[0].value;
            let lName = inputs[1].value;
            let email = inputs[2].value;
            let phone = inputs[3].value;

            let errors = [];
            if (fName.trim() === "") errors.push("First name is required.");
            if (lName.trim() === "") errors.push("Last name is required.");
            if (email.trim() === "") errors.push("Email is required.");
            else if (!validateEmail(email)) errors.push("Invalid email address.");
            if (phone.trim() === "") errors.push("Phone number is required.");
            else if (!validatePhone(phone)) errors.push("Phone number must be 10 digits.");
            if (errors.length > 0) {
                showToast(errors.join(" "), "error");
                return;
            }
            phone = formatPhone(phone);

            let payload = JSON.stringify({
                id: contactId,
                userId: userId,
                firstName: fName,
                lastName: lName,
                email: email,
                phone: phone
            });
            let url = urlBase + '/EditContact.' + extension;

            let xhr = new XMLHttpRequest();
            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
            try {
                xhr.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        let json = JSON.parse(xhr.responseText);
                        if (json.error && json.error.length > 0) {
                            showToast(json.error, "error");
                        } else {
                            // Read original values stored during edit mode
                            var origFirst = row.getAttribute("data-orig-first") || "";
                            var origLast = row.getAttribute("data-orig-last") || "";
                            var origEmail = row.getAttribute("data-orig-email") || "";
                            var origPhone = row.getAttribute("data-orig-phone") || "";

                            row.outerHTML = buildContactRow(contactId, fName, lName, email, phone);

                            // Highlight changed cells (or whole row as fallback)
                            var savedRow = document.getElementById("contact-row-" + contactId);
                            if (savedRow) {
                                var cells = savedRow.getElementsByTagName("td");
                                var changed = [
                                    fName !== origFirst,
                                    lName !== origLast,
                                    email !== origEmail,
                                    phone !== origPhone
                                ];
                                var anyChanged = changed.some(function(c) { return c; });

                                if (anyChanged) {
                                    // Highlight only the changed cells
                                    for (var ci = 0; ci < changed.length; ci++) {
                                        if (changed[ci]) {
                                            cells[ci + 1].classList.add("cell-highlight");
                                        }
                                    }
                                } else {
                                    // No detectable changes, highlight entire row
                                    savedRow.classList.add("row-highlight");
                                }
                            }
                        }
                    }
                };
                xhr.send(payload);
            } catch(err) {
                showToast(err.message, "error");
            }
        }

        function cancelEditContact(contactId, origFirst, origLast, origEmail, origPhone) {
            let row = document.getElementById("contact-row-" + contactId);
            row.outerHTML = buildContactRow(contactId, origFirst, origLast, origEmail, origPhone);
        }

        function addContactRow() {
            let table = document.getElementById("contactsTable");
            if (!table) {
                document.getElementById("contactSearchResult").innerHTML =
                    '<table id="contactsTable">'
                    + '<tr><th style="display:none">ID</th><th>First Name</th><th>Last Name</th><th>Email</th><th>Phone Number</th><th>Actions</th></tr>'
                    + '</table>';
                table = document.getElementById("contactsTable");
            }

            let newRow = table.insertRow(-1);
            newRow.id = "contact-row-new";
            newRow.innerHTML = '<td style="display:none">—</td>'
                + '<td><input type="text" placeholder="First Name"></td>'
                + '<td><input type="text" placeholder="Last Name"></td>'
                + '<td><input type="text" placeholder="Email"></td>'
                + '<td><input type="text" placeholder="Phone"></td>'
                + '<td>'
                + '<button type="button" class="saveButton" onclick="saveNewContact();">Save</button> '
                + '<button type="button" class="cancelButton" onclick="cancelNewContact();">Cancel</button>'
                + '</td>';

            // Row entrance animation
            newRow.classList.add("fade-in-up");
            newRow.classList.add("row-highlight");

            attachRowKeyboardNav(newRow,
                function() { saveNewContact(); },
                function() { cancelNewContact(); }
            );
        }

        function saveNewContact() {
            let row = document.getElementById("contact-row-new");
            let inputs = row.getElementsByTagName("input");
            let fName = inputs[0].value;
            let lName = inputs[1].value;
            let email = inputs[2].value;
            let phone = inputs[3].value;

            let errors = [];
            if (fName.trim() === "") errors.push("First name is required.");
            if (lName.trim() === "") errors.push("Last name is required.");
            if (email.trim() === "") errors.push("Email is required.");
            else if (!validateEmail(email)) errors.push("Invalid email address.");
            if (phone.trim() === "") errors.push("Phone number is required.");
            else if (!validatePhone(phone)) errors.push("Phone number must be 10 digits.");
            if (errors.length > 0) {
                showToast(errors.join(" "), "error");
                return;
            }

            phone = formatPhone(phone);

            let payload = JSON.stringify({
                FirstName: fName,
                LastName: lName,
                UserId: userId,
                EmailAddress: email,
                PhoneNumber: phone
            });
            let url = urlBase + '/NewContact.' + extension;

            let xhr = new XMLHttpRequest();
            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
            try {
                xhr.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        let json = JSON.parse(xhr.responseText);
                        if (json.error && json.error.length > 0) {
                            showToast(json.error, "error");
                        } else {
                            let newId = json.id || 0;
                            row.outerHTML = buildContactRow(newId, fName, lName, email, phone);
                            // Highlight the newly saved row instead of showing a toast
                            var savedRow = document.getElementById("contact-row-" + newId);
                            if (savedRow) {
                                savedRow.classList.add("row-highlight");
                                savedRow.classList.add("fade-in-up");
                            }
                        }
                    }
                };
                xhr.send(payload);
            } catch(err) {
                showToast(err.message, "error");
            }
        }

        function cancelNewContact() {
            let row = document.getElementById("contact-row-new");
            if (row) row.remove();
        }

        // --- Delete Contact ---
        function deleteContact() {
            let contactId = parseInt(document.getElementById("deleteContactId").value);

            let payload = JSON.stringify({id: contactId, userId: userId});
            let url = urlBase + '/DeleteContact.' + extension;

            let xhr = new XMLHttpRequest();
            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
            try {
                xhr.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        let json = JSON.parse(xhr.responseText);
                        if (json.error && json.error.length > 0) {
                            showToast(json.error, "error");
                        } else {
                            showToast("Contact deleted");
                        }
                    }
                };
                xhr.send(payload);
            } catch(err) {
                showToast(err.message, "error");
            }
        }

document.addEventListener("DOMContentLoaded", function() {
    // Login form: Enter to submit
    var loginFields = ["loginName", "loginPassword"];
    loginFields.forEach(function(id) {
        var el = document.getElementById(id);
        if (el) {
            el.addEventListener("keydown", function(e) {
                if (e.key === "Enter") { e.preventDefault(); doLogin(); }
            });
        }
    });

    // Signup form: Enter to submit
    var signupFields = ["registerFirstName", "registerLastName", "registerLogin", "registerPassword"];
    signupFields.forEach(function(id) {
        var el = document.getElementById(id);
        if (el) {
            el.addEventListener("keydown", function(e) {
                if (e.key === "Enter") { e.preventDefault(); doRegister(); }
            });
        }
    });

    // Contacts search: Enter to search
    var searchBox = document.getElementById("searchText");
    if (searchBox) {
        searchBox.addEventListener("keydown", function(e) {
            if (e.key === "Enter") { e.preventDefault(); modifiedSearchContact(); }
        });
    }

    // Tab buttons: Enter/Space to activate
    var loginTab = document.getElementById("loginTab");
    if (loginTab) {
        loginTab.addEventListener("keydown", function(e) {
            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); showLogin(); }
        });
    }
    var signupTab = document.getElementById("signupTab");
    if (signupTab) {
        signupTab.addEventListener("keydown", function(e) {
            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); showSignup(); }
        });
    }
});

		var pendingDeleteId = null;

		function deleteVariableContact(contactId, fullName) {
            pendingDeleteId = contactId;
            var overlay = document.getElementById("deleteOverlay");
            document.getElementById("deleteContactName").textContent = fullName;
            overlay.classList.add("active");
            document.getElementById("deleteConfirmBtn").focus();
        }

        function closeDeleteModal() {
            var overlay = document.getElementById("deleteOverlay");
            overlay.classList.remove("active");
            pendingDeleteId = null;
        }

        function confirmDelete() {
            if (pendingDeleteId === null) return;
            var contactId = pendingDeleteId;
            closeDeleteModal();

            let payload = JSON.stringify({id: contactId, userId: userId});
            let url = urlBase + '/DeleteContact.' + extension;

            let xhr = new XMLHttpRequest();
            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
            try {
                xhr.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        let json = JSON.parse(xhr.responseText);
                        if (json.error && json.error.length > 0) {
                            showToast(json.error, "error");
                        } else {
                            var deletedRow = document.getElementById("contact-row-" + contactId);
                            if (deletedRow) deletedRow.remove();

                            showToast("Contact deleted");
                            modifiedSearchContact();
                        }
                    }
                };
                xhr.send(payload);
            } catch(err) {
                showToast(err.message, "error");
            }
        }

        document.addEventListener("DOMContentLoaded", function() {
            var overlay = document.getElementById("deleteOverlay");
            var cancelBtn = document.getElementById("deleteCancelBtn");
            var confirmBtn = document.getElementById("deleteConfirmBtn");

            if (cancelBtn) cancelBtn.addEventListener("click", closeDeleteModal);
            if (confirmBtn) confirmBtn.addEventListener("click", confirmDelete);

            if (overlay) {
                overlay.addEventListener("click", function(e) {
                    if (e.target === overlay) closeDeleteModal();
                });

                overlay.addEventListener("keydown", function(e) {
                    if (e.key === "Escape") {
                        e.preventDefault();
                        closeDeleteModal();
                    } else if (e.key === "Delete" || e.key === "Enter") {
                        e.preventDefault();
                        confirmDelete();
                    }
                });
            }
        });
