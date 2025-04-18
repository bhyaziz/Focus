load();
function change_container(username) {
    console.log("Executing change_container with username:", username)
  
    const authButtons = document.getElementById("auth_buttons")
  
    if (authButtons) {
      authButtons.innerHTML = `
        <div class="profile-container">
          <div class="profile">
              <p>${username}</p>
              <i class="fa-solid fa-user"></i>
          </div>
          <button onclick="logout()" class="logout-button">
              <i class="fa-solid fa-sign-out-alt"></i> Logout
          </button>
        </div>`
    } else {
      console.error("Element #auth-buttons not found.")
    }
}
function load(){
    const username = localStorage.getItem("loggedInUser");
    console.log(username);
    if(username!=null){
        change_container(username);
    }
    
}
async function logout() {
    const authButtons = document.getElementById("auth_buttons");
    authButtons.innerHTML = `<a href="login.html" class="btn btn-secondary">Log in</a>
                  <a href="signup.html" class="btn btn-primary">Sign up</a>`;
    window.location.href = "../html/login.html";
  
  }