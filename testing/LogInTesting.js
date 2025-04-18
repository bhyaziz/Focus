const  truedata = [
    {
        username: "johndoe",
        email: "john.doe@example.com",
        password: "Password1@",
        confirmPassword: "Password1@",
    },
    {
        username: "janedoe",
        email: "jane.doe@gmail.com",
        password: "SecurePass123!",
        confirmPassword: "SecurePass123!",
    },
    {
        username: "alexsmith",
        email: "alex.smith@outlook.com",
        password: "Alex2023$",
        confirmPassword: "Alex2023$",
    },
    {
        username: "sarahconnor",
        email: "sarah.connor@company.org",
        password: "Terminator2&",
        confirmPassword: "Terminator2&",
    },
    {
        username: "mikebrown",
        email: "mike.brown@yahoo.com",
        password: "BrownM1ke@",
        confirmPassword: "BrownM1ke@",
    },
    {
        username: "emilyjones",
        email: "emily.jones@domain.net",
        password: "Emily2023!",
        confirmPassword: "Emily2023!",
    },
    {
        username: "davidwilson",
        email: "david.wilson@business.co",
        password: "Wilson123$",
        confirmPassword: "Wilson123$",
    },
    {
        username: "lisapark",
        email: "lisa.park@company.com",
        password: "Park2023@",
        confirmPassword: "Park2023@",
    },
];
function LogInTesting(testCase){
        
        let email = testCase.email;
        let password = testCase.password;
        let userFound = false;
        
        for (let i = 0; i < truedata.length; i++) {
            const data = truedata[i];
            if(email === data.email) {
                userFound = true;
                if(password === data.password) {
                    return "Login successfully";
                }
                else {
                    return "You're password is wrong";
                }
            }
        };
        
        if(!userFound) {
            return "You don't have an account";
        }
        
        
    
}
module.exports = LogInTesting;