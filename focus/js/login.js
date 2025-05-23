load();
async function checkUser()  {
    try {
        const PARSE_APPLICATION_ID = "LmeCejjiVPk4sPBTz4ldeFuRhuDNvnIrvtFSgoS1";
        const PARSE_JAVASCRIPT_KEY = "Op9NBG0V08Sw8K7tD4CzUw1fN0cokBmNeCwEs9Hp";
        const PARSE_SERVER_URL = "https://parseapi.back4app.com/";
    
        Parse.initialize(PARSE_APPLICATION_ID, PARSE_JAVASCRIPT_KEY);
        Parse.serverURL = PARSE_SERVER_URL;
    
        console.log("Parse initialized successfully");
      } catch (error) {
        console.log("error");
        console.error("Failed to initialize Parse:", error);
    }
    document.getElementById("emailError").textContent="";
    document.getElementById("passwordError").textContent="";
    const password = document.getElementById("password").value;
    const email = document.getElementById("email").value;
    const query = new Parse.Query("user");
    query.equalTo("email", email);
    const userExists = await query.first();
    if(userExists){
      const passwordDb = userExists.get("password");
      const username= userExists.get("username");
      localStorage.setItem("loggedInUser", username);
      localStorage.setItem("loggedInEmail", email);
      if (password === passwordDb){
        alert("succ");
        window.location.href = `../html/work.html?function=change_container&username=${encodeURIComponent(username)}`;
      }
      else{
        document.getElementById("passwordError").textContent="wrong password";
      }
    }
    else{
      document.getElementById("emailError").textContent="you don't have an account";
    }

}
function load(){
  
  localStorage.removeItem("loggedInUser");
  localStorage.removeItem("loggedInEmail");
}