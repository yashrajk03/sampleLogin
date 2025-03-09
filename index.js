const express =require('express')
const bcrypt=require('bcrypt')
const mySql=require('mySql2')
const app=express();

const cors = require('cors');
app.use(cors()); 

app.use(express.json());

// setup db connection
const db=mySql.createConnection({
host:'localhost',
user:'root',
password:'Amarprem@1234',
database: 'login'
});
db.connect((err)=>{
    if(err){
        console.log("didn't connect to the database");
        return;
    }
    console.log("database connected successfully ");

})

// register user
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(401).json({ message: "Please enter a valid username or password" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
        
        db.query(query, [username, hashedPassword], (err, result) => {
            if (err) {
                console.error('Database Error Details:', {
                    code: err.code,
                    errno: err.errno,
                    sqlMessage: err.sqlMessage,
                    sqlState: err.sqlState,
                    sql: err.sql
                });
                
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ message: 'Username already exists' });
                }
                return res.status(500).json({ 
                    message: 'Error registering user', 
                    error: {
                        code: err.code,
                        message: err.sqlMessage || err.message
                    }
                });
            }
            res.status(201).json({ message: 'User registered successfully' });
        });
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ 
            message: 'Server error', 
            error: error.message 
        });
    }
});




app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    // Check if user exists
    const query = 'SELECT * FROM users WHERE username = ?';
    db.query(query, [username], async (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const user = results[0];

        // Compare password with hashed password
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        res.json({ message: 'Login successful', userId: user.id });
    });
});




const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});