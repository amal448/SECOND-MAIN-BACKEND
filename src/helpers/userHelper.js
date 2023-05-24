const passwordHash = require("password-hash");

module.exports = {
    checkPassword: (password,hashedPassword) => {
        console.log("password",password)
        console.log("hashpassword",hashedPassword)

        return passwordHash.verify(password,hashedPassword)
    }
}