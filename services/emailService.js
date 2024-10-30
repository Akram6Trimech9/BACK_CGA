const nodemailer = require('nodemailer');
const fs = require('fs');

 const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_ID,
    pass: process.env.MP
  }
});

 function readHTMLTemplate(templatePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(templatePath, 'utf8', (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
}

 async function sendEmailWithAttachments(to, cc, subject, path,attachments,resetURL) {
  try {
    const htmlTemplate = await readHTMLTemplate(path);

    const html = htmlTemplate.replace('{{tokenLink}}', resetURL);
    const mailOptions = {
      from: 'akramtrimech97@gmail.com',
      to: to,
      cc:cc,
      subject,
      html,
      attachments 
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email Sent Successfully to ' + mailOptions.to);
    return info;
  } catch (error) {
    console.log('Error Occurred:', error);
    throw error;
  }
}

 async function sendWelcomeWithCredentials(to, email, password) {
  console.log(to,email,password,"kjkjskdf")
  const mailOptions = {
    from: 'akramtrimech97@gmail.com',  
    to: to,
    subject: 'Welcome to our website!',
    html: `
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
        <h1 style="color: #0d529f;">Welcome to our platform!</h1>
        <p>We are happy to have you on board.</p>
        <p>Your account details are as follows:</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Password:</strong> ${password}</p>
        <p>We recommend you change your password after logging in for the first time.</p>
        <p style="font-size: 16px;">See you soon!</p>
        <p style="color: #ffd146;">The Team</p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully to ' + mailOptions.to);
    return info;
  } catch (err) {
    console.log('Error sending welcome email:', err);
    throw err;
  }
}

const sendWelcomeEmail = async (email) => {
  const mailOptions = {
      from: 'akramtrimech97@gmail.com',  
      to: email, 
      subject: 'Bienvenue sur notre site CGA !',
      html: `
          <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
              <h1 style="color: #0d529f;">Bienvenue à notre site web</h1>
              <p>Nous sommes ravis de vous accueillir !</p>
              <p>Merci de nous avoir contactés, nous reviendrons vers vous bientôt pour discuter de votre message.</p>
              <p style="font-size: 16px;">À bientôt !</p>
              <p style="color: #ffd146;">L'équipe</p>
          </div>
      `
  };

  try {
      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
  } catch (err) {
      console.log('Error sending email:', err);
  }
};

async function sendCredentielToSousAdmin(to, email, password, cabinet) {
  const subject = 'Vous avez été ajouté en tant que Sous Admin';
  const attachments = [];  
  const mailOptions = {
    from: 'akramtrimech97@gmail.com',  
    to: to,
    subject: `Invitation de l'admin du cabinet ${cabinet.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
        <h1 style="color: #0d529f;">Bienvenue en tant que Sous Admin !</h1>
        <p>L'administrateur de <strong>${cabinet.name}</strong> vous a ajouté comme Sous Admin sur notre plateforme.</p>
        <p>Voici vos identifiants de connexion :</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Mot de passe :</strong> ${password}</p>
        <p>Nous vous recommandons de changer votre mot de passe après votre première connexion.</p>
        <p style="font-size: 16px;">À très bientôt !</p>
        <p style="color: #ffd146;">L'équipe</p>
      </div>
    `
  };



   try {
    const info = await transporter.sendMail(mailOptions);
     return info;
  } catch (err) {
    console.log('Erreur lors de l\'envoi des identifiants:', err);
    throw err;
  }
}

async function sendCredentielToClient(to, email, password, avocat) {
  const subject = 'Vous avez été ajouté en tant que client';
  const attachments = [];  
  const mailOptions = {
    from: 'akramtrimech97@gmail.com',  
    to: to,
    subject: `Invitation de l'avocat  ${avocat.username} ${avocat.lastname}   `,
    html: `
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
        <h1 style="color: #0d529f;">Bienvenue en tant que Client !</h1>
        <p>L'administrateur de <strong>  ${avocat.username} ${avocat.lastname} </strong> vous a ajouté comme  un client  sur notre plateforme.</p>
        <p>Voici vos identifiants de connexion :</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Mot de passe :</strong> ${password}</p>
        <p>Nous vous recommandons de changer votre mot de passe après votre première connexion.</p>
        <p style="font-size: 16px;">À très bientôt !</p>
        <p style="color: #ffd146;">L'équipe</p>
      </div>
    `
  };


  
   try {
    const info = await transporter.sendMail(mailOptions);
     return info;
  } catch (err) {
    console.log('Erreur lors de l\'envoi des identifiants:', err);
    throw err;
  }
}


module.exports = {
  sendEmailWithAttachments,
  sendCredentielToClient,
  readHTMLTemplate,
  sendWelcomeWithCredentials,
  sendWelcomeEmail,
  sendCredentielToSousAdmin
};