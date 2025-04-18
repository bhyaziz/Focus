const testing = require('./LogInTesting');
const testCases = [
    {
        email: "john.doe@example.com",
        password: "Passrd1@",
    },
    {
        email: "jane.doe@gmail.com",
        password: "SecurePass123!",
    },
    {
        email: "test@example.com",
        password: "Alex2023$",
    },
    {
        email: "sarah.connor@company.org",
        password: "Terminator2&",
    },
    {
        email: "mike.brown@yahoo.com",
        password: "ownM1ke@",
    },
    {
        email: "emily.jones@domain.net",
        password: "Emily2023!",
    },
    {
        email: "david.wilson@business.co",
        password: "Wilson123$",
    },
    {
        email: "camila.park@company.com",
        password: "Park2023@",
    },
];

test('sign' , ()=>{
    expect(testing(testCases[0])).toStrictEqual("You're password is wrong");
});
test('sign' , ()=>{
    expect(testing(testCases[1])).toStrictEqual("Login successfully");
});
test('sign' , ()=>{
    expect(testing(testCases[2])).toStrictEqual("You don't have an account");
});
test('sign' , ()=>{
    expect(testing(testCases[3])).toStrictEqual("Login successfully");
});
test('sign' , ()=>{
    expect(testing(testCases[4])).toStrictEqual("You're password is wrong");

});
test('sign' , ()=>{
    expect(testing(testCases[5])).toStrictEqual("Login successfully");
});
test('sign' , ()=>{
    expect(testing(testCases[6])).toStrictEqual("Login successfully");
});
test('sign' , ()=>{
    expect(testing(testCases[7])).toStrictEqual("You don't have an account");
});