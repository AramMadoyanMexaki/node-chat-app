const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('./db');

module.exports = function(io) {
    io.on("connection", (socket) => {
        console.log("New user connected");
        socket.on("signUpData", async (data) => {
            const { email, username, password, repeatPassword } = data;

            if (!email || !email.includes("@")) {
                return socket.emit("signUpError", "Invalid email");
            }

            if (password !== repeatPassword) {
                return socket.emit("signUpError", "Passwords do not match");
            }

            try {
                const checkUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    
                if (checkUser.rows.length > 0) {
                    return socket.emit("signUpError", "Email already exists!")
                }

                const hashedPass = await bcryptjs.hash(password, 10);

                await pool.query(`
                    INSERT INTO users (username, email, password)
                    VALUES ($1, $2,$3)`, [username, email, hashedPass]
                );

                socket.emit("signUpSuccess", "User registered successfully");
            } catch(e) {
                console.log(e)
                socket.emit("serverError", "Server Error!");
            }
        });

        socket.on("loginData", async (data) => {
           const { email, password } = data;

           try {
            const findUser = await pool.query(
                "SELECT id, email, password, username FROM users WHERE email = $1",
                [email]
              );
              
              if (findUser.rows.length > 0) {
                  const user = findUser.rows[0];

                  const isMatch = await bcryptjs.compare(password, user.password);

                  if (isMatch) {
                        const token = jwt.sign(
                            {id: user.id, email: user.email, username: user.username},
                            "my_super_secret_jwt_key_2025",
                            { expiresIn: "5d" }
                        );
                        
                        return socket.emit("loginSuccess", {message: "User login successfully", token: token, username: user.username});
                  } else {
                        return socket.emit("loginError", "Password is incorrect");
                  }
              } else {
                  return socket.emit("loginError", "Email or password is incorrect");
              }        

           } catch(e) {
                console.log(e);
                socket.emit("loginError", "Login failed");
           }
        })
    });
}