const sgMail = require('@sendgrid/mail'); // SENDGRID_API_KEY
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.contactForm = (req, res) => {
    const { email, name, message } = req.body;
    // console.log(req.body);

    const emailData = {
        to: process.env.EMAIL_TO,
        from:  'manpreetkaurs772@gmail.com',
        subject: `Contact form - ${process.env.APP_NAME}`,
        text: `Email received from contact from \n Sender name: ${name} \n Sender email: ${email} \n Sender message: ${message}`,
        html: `
            <h4>Email received from contact form:</h4>
            <p>Sender name: ${name}</p>
            <p>Sender email: ${email}</p>
            <p>Sender message: ${message}</p>
            <hr />
            <p>This email may contain sensetive information</p>
            <p>https://onemancode.com</p>
        `
    };

    sgMail
        .send(emailData)
        .then(sent => {
            // console.log(sent);
            return res.json({
                success: true
            });
        })
        .catch((err) => {
  console.error('SendGrid Error:', JSON.stringify(err.response?.body || err.message, null, 2));
  return res.status(500).json({ success: false, error: 'Email could not be sent.' });
});

};

// exports.contactBlogAuthorForm = (req, res) => {
//     const { authorEmail, email, name, message } = req.body;
//     // console.log(req.body);

//     let maillist = [authorEmail, process.env.EMAIL_TO];

//     const emailData = {
//         to: maillist,
//         from: email,
//         subject: `Someone messaged you from ${process.env.APP_NAME}`,
//         text: `Email received from contact from \n Sender name: ${name} \n Sender email: ${email} \n Sender message: ${message}`,
//         html: `
//             <h4>Message received from:</h4>
//             <p>name: ${name}</p>
//             <p>Email: ${email}</p>
//             <p>Message: ${message}</p>
//             <hr />
//             <p>This email may contain sensetive information</p>
//             <p>https://onemancode.com</p>
//         `
//     };

//     sgMail.send(emailData).then(sent => {
//         return res.json({
//             success: true
//         });
//     });
// };