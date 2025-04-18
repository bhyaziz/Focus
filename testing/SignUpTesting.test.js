const testing = require('./SignUpTesting');
const testCases = [
      
    {
      type: "Email",
      username: "testuser",
      email: "test@example.com",
      password: "Password1@",
      confirmPassword: "Password1@",
    },
    {
      type: "Email",
      username: "testuser", 
      email: "invalid-email",
      password: "Password1@",
      confirmPassword: "Password1@",
    },
    {
      type: "Email",
      username: "testuser",
      email: "missing@dot",
      password: "Password1@",
      confirmPassword: "Password1@",
    },
    {
      type: "Email",
      username: "testuser",
      email: "@missingusername.com",
      password: "Password1@",
      confirmPassword: "Password1@",
    },

    {
      type: "Password",
      username: "testuser",
      email: "test@example.com",
      password: "Password1@",
      confirmPassword: "Password1@",
    },
    {
      type: "Password",
      username: "testuser",
      email: "test@example.com",
      password: "short1@",
      confirmPassword: "short1@",
    },
    {
      type: "Password",
      username: "testuser",
      email: "test@example.com",
      password: "NOLOWERCASE1@",
      confirmPassword: "NOLOWERCASE1@",
    },
    {
      type: "Password",
      username: "testuser",
      email: "test@example.com",
      password: "nouppercase1@",
      confirmPassword: "nouppercase1@",
    },
    {
      type: "Password",
      username: "testuser",
      email: "test@example.com",
      password: "NoSpecialChar1",
      confirmPassword: "NoSpecialChar1",
    },
    {
      type: "Password", 
      username: "testuser",
      email: "test@example.com",
      password: "NoNumber@Aa",
      confirmPassword: "NoNumber@Aa",
    },

    
    {
      type: "Password Mismatch",
      username: "testuser",
      email: "test@example.com",
      password: "Password1@",
      confirmPassword: "DifferentPassword1@",
    },

    
    {
      type: "Username",
      username: "ab",
      email: "test@example.com",
      password: "Password1@",
      confirmPassword: "Password1@",
    },
  ]

test('sign up correctly', () => {
    // Similar to a @Test method in JUnit
        expect(testing(testCases[0])).toStrictEqual(["all is correct"]);

  });
  test('sign up correctly', () => {
    // Similar to a @Test method in JUnit
    expect(testing(testCases[1])).toStrictEqual(["Email don't containe @","Email don't containe ."]);

  });
  test('sign up correctly', () => {
    // Similar to a @Test method in JUnit
    expect(testing(testCases[2])).toStrictEqual(["Email don't containe ."]);

  });
  test('sign up correctly', () => {
    // Similar to a @Test method in JUnit
    expect(testing(testCases[3])).toStrictEqual(["all is correct"]);
  });
  test('sign up correctly', () => {
    // Similar to a @Test method in JUnit
    expect(testing(testCases[4])).toStrictEqual(["all is correct"]);
  });
  test('sign up correctly', () => {
    // Similar to a @Test method in JUnit
    expect(testing(testCases[5])).toStrictEqual(["Password must be at least 8 characters long","Password must include at least one capital letter"]);
  });
  test('sign up correctly', () => {
    // Similar to a @Test method in JUnit
    expect(testing(testCases[6])).toStrictEqual(["all is correct"]);
  });
  test('sign up correctly', () => {
    // Similar to a @Test method in JUnit
    expect(testing(testCases[7])).toStrictEqual(["Password must include at least one capital letter"]);
  });
  test('sign up correctly', () => {
    // Similar to a @Test method in JUnit
    expect(testing(testCases[8])).toStrictEqual(["Password must include at least one special character @$!%*?&()"]);
  });
  test('sign up correctly', () => {
    // Similar to a @Test method in JUnit
    expect(testing(testCases[9])).toStrictEqual(["Password must include at least one number"]);
  });
  test('sign up correctly', () => {
    // Similar to a @Test method in JUnit
    expect(testing(testCases[10])).toStrictEqual(["Passwords do not match"]);
  });
  test('sign' , ()=>{
    expect(testing(testCases[11])).toStrictEqual(["Username is too short"]);
  });