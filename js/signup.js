 async function saveUsername()  {
    try {
        const PARSE_APPLICATION_ID = "LmeCejjiVPk4sPBTz4ldeFuRhuDNvnIrvtFSgoS1";
        const PARSE_JAVASCRIPT_KEY = "Op9NBG0V08Sw8K7tD4CzUw1fN0cokBmNeCwEs9Hp";
        const PARSE_SERVER_URL = "https://parseapi.back4app.com/";
    
        Parse.initialize(PARSE_APPLICATION_ID, PARSE_JAVASCRIPT_KEY);
        Parse.serverURL = PARSE_SERVER_URL;
    
        console.log("Parse initialized successfully");
      } catch (error) {
        console.error("Failed to initialize Parse:", error);
      }
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const email = document.getElementById("email").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    let isValide=true;
    const passwordRegex = /^(?=.*[A-Z]+)(?=.*\d+)(?=.*[@$!%*?&()]+)[A-Za-z\d@$!%*?&()]{8,}$/;
    document.getElementById("usernameError").textContent="";
    document.getElementById("emailError").textContent="";
    document.getElementById("passwordError").textContent="";
    document.getElementById("passwordConfirmationError").textContent="";
    if (username.length<3){
        document.getElementById("usernameError").textContent="username is too short";
        isValide=false;
    }
    if (!email.includes("@")){
        document.getElementById("emailError").textContent="email not valid";
        isValide=false;
    }
    if(!passwordRegex.test(password)){
        document.getElementById("passwordError").textContent="password is weak";
        isValide=false;
    }
    if(password !== confirmPassword){
        document.getElementById("passwordConfirmationError").textContent="Passwords do not match";
        isValide=false;
    }
    const query = new Parse.Query("user");
    query.equalTo("email", email);
    const userExists = await query.first();
    if(userExists){
        document.getElementById("mailExist").textContent="email already exists you must to login";
    }
    if(isValide==true && !userExists ){
        
        try {
            const UserObject = Parse.Object.extend("user");
            const user = new UserObject();
    
            user.set("username", username);
            user.set("password", password);
            user.set("email", email);
            
            const result = await user.save();
            console.log("Username saved successfully with objectId:", result.id);
            alert("Username saved successfully");
            window.location.href = '../html/home.html';
        
        } catch (error) {
            console.error("Error saving username:", error);
            alert("Error saving username: " + error.message);
      }
    }
  }