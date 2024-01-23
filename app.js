// express import
const express = require('express');
const app = express();
const port = 3000;
app.use(express.static('public'));

// body parser import
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))

// ejs setup
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// mongoose
const mongoose = require('mongoose');
// mongoose.connect('mongodb://127.0.0.1:27017/userDB');
// mongoose.connect('mongodb+srv://username:password@cluster0.egecei0.mongodb.net/userDB');
mongoose.connect(process.env.MONGODB_URI);



const userSchema = {
    username: String,
    email: String,
    password: String
}
const User = mongoose.model('User', userSchema);

// express session
const session = require('express-session');
app.use(session({
    secret: 'dino',
    resave: false,
    saveUninitialized: true,
}));




// childe_process to integrate python
const { spawn } = require('child_process');
// const childpython = spawn('python', ['--version']);


// render home route
app.get('/', (req, res) => {
    let isAuthenticated = req.session.user ? true : false;
    let user = req.session.user;

    res.render('index', { isAuthenticated, user });
});



app.post('/', (req, res) => {
    let product = req.body.product_name;

    // Spawn a child process to execute the first Python script
    const pythonScript1 = spawn('python', ['python_script1.py', product]);

    // Capture the output from the first Python script
    let output1 = '';
    pythonScript1.stdout.on('data', (data) => {
        output1 += data.toString();
    });

    // Handle the completion of the first Python script execution
    pythonScript1.on('close', (code) => {
        if (code === 0) {
            // Parse the JSON output
            let jsonArray1 = JSON.parse(output1);

            // Spawn a child process to execute the second Python script
            const pythonScript2 = spawn('python', ['python_script2.py', product]);

            // Capture the output from the second Python script
            let output2 = '';
            pythonScript2.stdout.on('data', (data) => {
                output2 += data.toString();
            });

            // Handle the completion of the second Python script execution
            pythonScript2.on('close', (code) => {
                if (code === 0) {
                    // Parse the JSON output
                    let jsonArray2 = JSON.parse(output2);

                    // Render the data in the HTML template
                    const isAuthenticated = req.session.user ? true : false;
                    const user = req.session.user;

                    // res.render('index', { isAuthenticated, user });
                    res.render('scrapedData', { isAuthenticated, user, products1: jsonArray1, products2: jsonArray2 });
                } else {
                    console.error(`Second Python script exited with code ${code}`);
                }
            });
            let errorOutput2 = '';
            pythonScript2.stderr.on('data', (data) => {
                errorOutput2 += data.toString();
            });

            // Handle the completion of the second Python script execution
            pythonScript2.on('close', (code) => {
                if (code === 0) {
                    // Script executed successfully
                    // Process the output data
                } else {
                    console.error(`Second Python script exited with code ${code}`);
                    console.error(`Error output from second script: ${errorOutput2}`);
                }
            });
            // console.log(jsonArray1);
            // res.send("kunal");
        }
        else {
            console.error(`First Python script exited with code ${code}`);
        }
    });
});


app.get('/about', (req, res) => {
    // res.render('about_us');
    let isAuthenticated = req.session.user ? true : false;
    let user = req.session.user;

    res.render('about_us', { isAuthenticated, user });
});



app.get('/login-page', (req, res) => {
    res.render('login')
})

app.post('/login-page', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    User.findOne({ email })
        .then((data) => {
            if (data) {
                if (data.password === password) {
                    req.session.user = {
                        username: data.username,
                        email: data.email
                    };

                    // Check if returnTo path is stored in the session
                    res.redirect('/');
                } else {
                    res.send("Incorrect password");
                }
            } else {
                res.send("User not found");
            }
        })
        .catch((err) => {
            console.log(err);
            res.send("An error occurred");
        });
});



app.post('/registration', (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    newUser.save()
        .then((savedItem) => {
            // console.log('Item saved:');
        })
        .catch((error) => {
            console.error('Error saving item:', error);
        });
    res.redirect("/login-page");
});

app.get('/log-out', (req, res) => {
    // Destroy the session to log out the user
    req.session.destroy();
    res.redirect('/');
});










app.listen(port, function () {
    console.log("server is running on " + port);
});