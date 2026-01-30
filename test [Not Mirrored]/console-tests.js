// Console testing commands for code.js functions
// Open your browser console (F12) and run these commands

// Test validation functions
console.log("Email validation tests:");
console.log("Valid email:", validateEmail("test@example.com"));
console.log("Invalid email:", validateEmail("invalid-email"));

console.log("Phone validation tests:");
console.log("Valid phone:", validatePhone("123-456-7890"));
console.log("Invalid phone:", validatePhone("abc-def-ghij"));

// Test cookie functions (make sure to set some test data first)
userId = 999;
firstName = "Console";
lastName = "Tester";
saveCookie();
console.log("Cookie saved, now testing read:");
readCookie();
console.log("Read values - userId:", userId, "firstName:", firstName, "lastName:", lastName);

// Test with mock data (won't actually call APIs)
console.log("Testing search payload creation:");
let searchPayload = JSON.stringify({search: "test", userId: 123});
console.log("Search payload:", searchPayload);