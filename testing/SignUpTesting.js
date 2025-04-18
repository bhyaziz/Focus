
function testing(testCase){
    let isValid = true
    username=testCase.username;
    email=testCase.email;
    password=testCase.password;
    confirmPassword=testCase.confirmPassword;
    const errortable=[];
    if (username.length < 3) {
      errortable.push("Username is too short");
      isValid = false;
    }


    if (!email.includes("@"))  {
      errortable.push("Email don't containe @");
      isValid = false;
    }
    if (!email.includes(".")){
        errortable.push("Email don't containe .");
        isValid= false;
    }

    if (password.length < 8) {
      errortable.push("Password must be at least 8 characters long");
      isValid = false;
    }


    if (!/[A-Z]/.test(password)) {
      errortable.push("Password must include at least one capital letter");
      isValid = false;
    }


    if (!/\d/.test(password)) {
      errortable.push("Password must include at least one number");
      isValid = false;
    }

    if (!/[@$!%*?&()]/.test(password)) {
      errortable.push("Password must include at least one special character @$!%*?&()");
      isValid = false;
    }

   

    if (password !== confirmPassword) {
      errortable.push("Passwords do not match");
      isValid = false;
    }
    if(isValid==true){
      errortable.push("all is correct");
      return errortable; 
    }
    return errortable; 
}
module.exports = testing;