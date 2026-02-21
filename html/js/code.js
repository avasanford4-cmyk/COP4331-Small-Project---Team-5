const urlBase = 'http://142.93.67.135/API';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

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
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				showSplashAndNavigate("contactsRoughTwo.html");
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function showSplashAndNavigate(targetUrl)
{
	document.getElementById("splashOverlay").classList.add("active");
	setTimeout(function() {
		window.location.href = targetUrl;
	}, 1000);
}

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
//		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doRegister()
{
	document.getElementById("registerResult").innerHTML = "";

	let firstName = document.getElementById("registerFirstName").value;
	let lastName = document.getElementById("registerLastName").value;
	let login = document.getElementById("registerLogin").value;
	let password = document.getElementById("registerPassword").value;

	if (firstName.trim() === "" || lastName.trim() === "" || login.trim() === "" || password.trim() === "")
	{
		document.getElementById("registerResult").innerHTML = "Please fill in all fields";
		return;
	}

	let validationErrors = validateSignup(login, password);
    if (validationErrors.length > 0) {
		const errorsDiv = document.getElementById("registerResult");

		if (validationErrors.length === 1) {
    		errorsDiv.style.textAlign = "center";
    		errorsDiv.innerHTML = validationErrors[0];
		} else {
    		errorsDiv.style.textAlign = "left";
    		errorsDiv.innerHTML = "<ul><li>" + validationErrors.join("</li><li>") + "</li></ul>";
		}
        return; 
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

				window.location.href = "contactsRoughTwo.html";
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

    loginToggle.addEventListener("click", () => {
        if (loginDiv.style.display === "none" || loginDiv.style.display === "") {
            loginDiv.style.display = "block"; 
        } else {
            loginDiv.style.display = "none"; 
        }
    });
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

});

function validateSignup(username, password) {
    let errors = [];

    // Username rules
    if (!/[a-zA-Z]/.test(username)) {
        errors.push("Username must include at least one letter.");
    }
    if (username.length < 3 || username.length > 22) {
        errors.push("Username must be 3–22 characters long.");
    }

    // Password rules
    if (password.length < 8) {
        errors.push("Password must be at least 8 characters.");
    }
    if (!/[a-zA-Z]/.test(password)) {
        errors.push("Password must include at least one letter.");
    }
    if (!/\d/.test(password)) {
        errors.push("Password must include at least one number.");
    }
    if (!/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password)) {
        errors.push("Password must include at least one special character.");
    }

    return errors;
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
                            document.getElementById("contactSearchResult").innerHTML =
                                '<span class="error">Error: ' + json.error + '</span>';
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
                document.getElementById("contactSearchResult").innerHTML = '<span class="error">' + err.message + '</span>';
            }
        }
		
		function modifiedSearchContact() {
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
                            document.getElementById("contactSearchResult").innerHTML =
                                '<span class="error">Error: ' + json.error + '</span>';
                            return;
                        }

                        let html = '<span class="success">Found ' + json.results.length + ' contact(s):</span><br>'
                            + '<table id="contactsTable">'
                            + '<tr>'
                            + '<td>ID</td>'
                            + '<td>First Name</td>'
                            + '<td>Last Name</td>'
                            + '<td>Email</td>'
                            + '<td>Phone Number</td>'
                            + '<td>Actions</td>'
                            + '</tr>';
                        for (let i = 0; i < json.results.length; i++) {
                            let c = json.results[i];
                            html += buildContactRow(c.id, c.firstName, c.lastName, c.email, c.phone);
                        }
                        html += '</table>';
                        document.getElementById("contactSearchResult").innerHTML = html;
                    }
                };
                xhr.send(payload);
            } catch(err) {
                document.getElementById("contactSearchResult").innerHTML = '<span class="error">' + err.message + '</span>';
            }
        }

        function buildContactRow(id, firstName, lastName, email, phone) {
            let safeName = (firstName + ' ' + lastName).replace(/'/g, "\\'");
            return '<tr id="contact-row-' + id + '">'
                + '<td>' + id + '</td>'
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

        function editVariableContact(contactId) {
            let row = document.getElementById("contact-row-" + contactId);
            if (!row) return;

            let cells = row.getElementsByTagName("td");
            let origFirst = cells[1].innerText;
            let origLast = cells[2].innerText;
            let origEmail = cells[3].innerText;
            let origPhone = cells[4].innerText;

            cells[1].innerHTML = '<input type="text" value="' + origFirst + '">';
            cells[2].innerHTML = '<input type="text" value="' + origLast + '">';
            cells[3].innerHTML = '<input type="text" value="' + origEmail + '">';
            cells[4].innerHTML = '<input type="text" value="' + origPhone + '">';
            cells[5].innerHTML = '<button type="button" onclick="saveEditContact(' + contactId + ');">Save</button> '
                + '<button type="button" onclick="cancelEditContact(' + contactId + ', \'' + origFirst.replace(/'/g, "\\'") + '\', \'' + origLast.replace(/'/g, "\\'") + '\', \'' + origEmail.replace(/'/g, "\\'") + '\', \'' + origPhone.replace(/'/g, "\\'") + '\');">Cancel</button>';
        }

        function saveEditContact(contactId) {
            let row = document.getElementById("contact-row-" + contactId);
            let inputs = row.getElementsByTagName("input");
            let fName = inputs[0].value;
            let lName = inputs[1].value;
            let email = inputs[2].value;
            let phone = inputs[3].value;

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
                            document.getElementById("contactDeleteResult").innerHTML =
                                '<span class="error">Error: ' + json.error + '</span>';
                        } else {
                            row.outerHTML = buildContactRow(contactId, fName, lName, email, phone);
                            document.getElementById("contactDeleteResult").innerHTML =
                                '<span class="success">Contact updated successfully</span>';
                        }
                    }
                };
                xhr.send(payload);
            } catch(err) {
                document.getElementById("contactDeleteResult").innerHTML = '<span class="error">' + err.message + '</span>';
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
                    + '<tr><td>ID</td><td>First Name</td><td>Last Name</td><td>Email</td><td>Phone Number</td><td>Actions</td></tr>'
                    + '</table>';
                table = document.getElementById("contactsTable");
            }

            let newRow = table.insertRow(-1);
            newRow.id = "contact-row-new";
            newRow.innerHTML = '<td>—</td>'
                + '<td><input type="text" placeholder="First Name"></td>'
                + '<td><input type="text" placeholder="Last Name"></td>'
                + '<td><input type="text" placeholder="Email"></td>'
                + '<td><input type="text" placeholder="Phone"></td>'
                + '<td>'
                + '<button type="button" onclick="saveNewContact();">Save</button> '
                + '<button type="button" onclick="cancelNewContact();">Cancel</button>'
                + '</td>';
        }

        function saveNewContact() {
            let row = document.getElementById("contact-row-new");
            let inputs = row.getElementsByTagName("input");
            let fName = inputs[0].value;
            let lName = inputs[1].value;
            let email = inputs[2].value;
            let phone = inputs[3].value;

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
                            document.getElementById("contactAddResult").innerHTML =
                                '<span class="error">Error: ' + json.error + '</span>';
                        } else {
                            let newId = json.id || 0;
                            row.outerHTML = buildContactRow(newId, fName, lName, email, phone);
                            document.getElementById("contactAddResult").innerHTML =
                                '<span class="success">Contact added successfully</span>';
                        }
                    }
                };
                xhr.send(payload);
            } catch(err) {
                document.getElementById("contactAddResult").innerHTML = '<span class="error">' + err.message + '</span>';
            }
        }

        function cancelNewContact() {
            let row = document.getElementById("contact-row-new");
            if (row) row.remove();
        }

        // --- Delete Contact ---
        function deleteContact() {
            let contactId = parseInt(document.getElementById("deleteContactId").value);
            document.getElementById("contactDeleteResult").innerHTML = "";

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
                            document.getElementById("contactDeleteResult").innerHTML =
                                '<span class="error">Error: ' + json.error + '</span>';
                        } else {
                            document.getElementById("contactDeleteResult").innerHTML =
                                '<span class="success">Contact deleted: ' + JSON.stringify(json) + '</span>';
                        }
                    }
                };
                xhr.send(payload);
            } catch(err) {
                document.getElementById("contactDeleteResult").innerHTML = '<span class="error">' + err.message + '</span>';
            }
        }
		
		function deleteVariableContact(contactId, fullName) {
            if (!confirm('Are you sure you want to delete ' + fullName + '? This is permanent and cannot be undone.')) return;
            document.getElementById("contactDeleteResult").innerHTML = "";

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
                            document.getElementById("contactDeleteResult").innerHTML =
                                '<span class="error">Error: ' + json.error + '</span>';
                        } else {
                            document.getElementById("contactDeleteResult").innerHTML =
                                '<span class="success">Contact deleted: ' + JSON.stringify(json) + '</span>';
                        }
                    }
                };
                xhr.send(payload);
            } catch(err) {
                document.getElementById("contactDeleteResult").innerHTML = '<span class="error">' + err.message + '</span>';
            }
        }