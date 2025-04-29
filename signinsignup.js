
const signInBtn = document.getElementById("signIn");
const signUpBtn = document.getElementById("signUp");
const container = document.querySelector(".container");

signInBtn.addEventListener("click", () => {
    container.classList.remove("right-panel-active");
});

signUpBtn.addEventListener("click", () => {
    container.classList.add("right-panel-active");
});

let users = JSON.parse(localStorage.getItem('users')) || [];

// Signup Form
document.getElementById('signup-form').addEventListener('submit', function (event) {
    event.preventDefault();
    let name = document.getElementById('signup-name').value.trim();
    let email = document.getElementById('signup-email').value.trim();
    let password = document.getElementById('signup-password').value;

    // Check if email already exists
    let existingUser = users.find(u => u.email === email);
    if (existingUser) {
        toast({
            title: "Email already registered!",
            type: "info",
            duration: 5000
        });
        return;
    }

    // Add new user
    users.push({name, email, password });
    localStorage.setItem('users', JSON.stringify(users));
    toast({
        title: "Signup successfully!!",
        type: "success",
        duration: 5000
    });
    this.reset();
});

// Login Form
document.getElementById('login-form').addEventListener('submit', function (event) {
    event.preventDefault();
    let email = document.getElementById('login-email').value.trim();
    let password = document.getElementById('login-password').value;

    // Check email and password
    let user = users.find(u => u.email === email && u.password === password);
    if (user) {
        console.log(user);
        
        localStorage.setItem("loggedInUser", JSON.stringify({
            username: user.name,
            email: user.email
        }));
        toast({
            title: "Login successfully!!",
            type: "success",
            duration: 3000
        });
        setTimeout(() => {
            window.location.href = "product.html";
        }, 3500);
    } else {
        toast({
            title: "Invalid Email or Password",
            type: "error",
            duration: 4000
        }); 
    }
    this.reset();
});
