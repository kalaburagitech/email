const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
require('dotenv').config();


const app = express();
const port = process.env.PORT || 5000;

// Enable CORS for all origins (you can restrict this to specific origins if needed)
app.use(cors());


// Middleware to parse JSON data
app.use(bodyParser.json());

// Correct local path to the image file using path.resolve()
const imagePath = path.resolve(__dirname, 'kalburagitech.jpg');
const userDataPath = path.resolve(__dirname, 'user.json');

// Email sending service with attachment
const sendEmail = (emailRequest) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USERNAME,  // Your email id
            pass: process.env.EMAIL_PASSWORD   // Your password
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: emailRequest.email,
        subject: 'Project Submission Details',
        text: `Name: ${emailRequest.username}\nEmail: ${emailRequest.email}\nPhone: ${emailRequest.phone}\nWhatsApp: ${emailRequest.whatsapp}\nProject Name: ${emailRequest.projectName}\nProgramming Language: ${emailRequest.language}\nDescription: ${emailRequest.description}\n\nWelcome to Kalaburagi Tech! If you have any queries, contact us at 9880020224.`,
        html: `<p>Name: ${emailRequest.username}</p>
               <p>Email: ${emailRequest.email}</p>
               <p>Phone: ${emailRequest.phone}</p>
               <p>WhatsApp: ${emailRequest.whatsapp}</p>
               <p>Project Name: ${emailRequest.projectName}</p>
               <p>Programming Language: ${emailRequest.language}</p>
               <p>Description: ${emailRequest.description}</p>
               <p><strong>Welcome to Kalaburagi Tech!</strong></p>
               <p>If you have any queries, contact us at <a href="https://wa.me/+919880020224">9880020224.</a></p>
               <img src="https://github.com/kalaburagitech/email/blob/main/kalaburagitech.jpg" alt="Kalaburagi Tech" width="50%" height="50%">`
    };

    return transporter.sendMail(mailOptions);
};

// Route to handle email sending and save user data
app.post('/api/email-send', async (req, res) => {
    try {
        const emailRequest = req.body;

        // Send email
        await sendEmail(emailRequest);

        // Save user data to user.json
        fs.writeFile(userDataPath, JSON.stringify(emailRequest, null, 2), (err) => {
            if (err) {
                console.error('Error saving user data:', err);
                return res.status(500).send('Error saving user data');
            }
            res.status(200).send('Email sent and data saved successfully');
        });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Error sending email');
    } 
});

// Route to get saved user data
app.get('/api/users', (req, res) => {
    fs.readFile(userDataPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading user data:', err);
            return res.status(500).send('Error reading user data');
        }
        res.status(200).json(JSON.parse(data));
    });
});

app.get('/api/hello', (req, res) => {
    res.json({ message: "Hello, world!" });
  });

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
