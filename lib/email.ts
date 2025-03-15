import nodemailer from "nodemailer";

// Log email configuration
console.log("Email configuration:");
console.log(
  `EMAIL_SERVER_HOST: ${process.env.EMAIL_SERVER_HOST ? "Set" : "Not set"}`
);
console.log(
  `EMAIL_SERVER_PORT: ${process.env.EMAIL_SERVER_PORT ? "Set" : "Not set"}`
);
console.log(
  `EMAIL_SERVER_USER: ${process.env.EMAIL_SERVER_USER ? "Set" : "Not set"}`
);
console.log(
  `EMAIL_SERVER_PASSWORD: ${
    process.env.EMAIL_SERVER_PASSWORD ? "Set (hidden)" : "Not set"
  }`
);
console.log(`EMAIL_FROM: ${process.env.EMAIL_FROM || "Not set"}`);

// Configure email transporter
// For production, use your actual SMTP settings
let transporter: nodemailer.Transporter;

// Create a fallback transporter for development if no email config is provided
if (!process.env.EMAIL_SERVER_HOST || !process.env.EMAIL_SERVER_USER) {
  console.log("Using ethereal email for development");

  // Create a test account on ethereal.email
  nodemailer
    .createTestAccount()
    .then((account) => {
      console.log("Created test email account:", account.user);

      transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass,
        },
        debug: true,
      });

      console.log("Development email transporter created successfully");
    })
    .catch((err) => {
      console.error("Failed to create test email account:", err);
    });
} else {
  try {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST || "smtp.example.com",
      port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
      secure: process.env.EMAIL_SERVER_SECURE === "true",
      auth: {
        user: process.env.EMAIL_SERVER_USER || "proton7ve@gmail.com",
        pass: process.env.EMAIL_SERVER_PASSWORD || "Protovista7@google",
      },
      debug: process.env.NODE_ENV === "development",
      logger: process.env.NODE_ENV === "development",
    });

    console.log("Email transporter created successfully");
  } catch (error) {
    console.error("Error creating email transporter:", error);
    throw error;
  }
}

export async function sendEventReminder(
  to: string,
  eventName: string,
  eventDate: string,
  eventTime?: string,
  eventLocation?: string
) {
  console.log(`Sending event reminder email to ${to} for event: ${eventName}`);

  try {
    // Ensure transporter is initialized
    if (!transporter) {
      console.log("Transporter not initialized, creating test account");
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
        debug: true,
      });
    }

    const dateObj = new Date(eventDate);
    const formattedDate = dateObj.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const timeInfo = eventTime ? ` at ${eventTime}` : "";
    const locationInfo = eventLocation ? ` at ${eventLocation}` : "";

    const mailOptions = {
      from:
        process.env.EMAIL_FROM || "Flower Station <noreply@flowerstation.com>",
      to,
      subject: `Reminder: ${eventName} Today!`,
      text: `
Hello,

This is a friendly reminder that your event "${eventName}" is today, ${formattedDate}${timeInfo}${locationInfo}.

We hope you have a wonderful time!

Best regards,
The Flower Station Team
      `,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Event Reminder</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
    }
    .container {
      padding: 20px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
    }
    .header {
      text-align: center;
      padding-bottom: 20px;
      border-bottom: 1px solid #e5e7eb;
      margin-bottom: 20px;
    }
    .logo {
      color: #16a34a;
      font-size: 24px;
      font-weight: bold;
    }
    .event-name {
      font-size: 20px;
      font-weight: bold;
      color: #16a34a;
      margin: 15px 0;
    }
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      font-size: 12px;
      color: #6b7280;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">🌸 Flower Station</div>
    </div>
    
    <p>Hello,</p>
    
    <p>This is a friendly reminder that your event is today!</p>
    
    <div class="event-name">${eventName}</div>
    
    <p><strong>Date:</strong> ${formattedDate}</p>
    ${eventTime ? `<p><strong>Time:</strong> ${eventTime}</p>` : ""}
    ${eventLocation ? `<p><strong>Location:</strong> ${eventLocation}</p>` : ""}
    
    <p>We hope you have a wonderful time!</p>
    
    <p>Best regards,<br>The Flower Station Team</p>
    
    <div class="footer">
      &copy; ${new Date().getFullYear()} Flower Station Event Manager. All rights reserved.
    </div>
  </div>
</body>
</html>
      `,
    };

    console.log("Sending email with options:", {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
    });

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);

    // If using ethereal, provide the preview URL
    if (info.messageId && info.messageId.includes("ethereal")) {
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }

    return {
      success: true,
      messageId: info.messageId,
      previewUrl: nodemailer.getTestMessageUrl(info),
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Test the email configuration
export async function testEmailConfiguration() {
  try {
    console.log("Testing email configuration...");

    // Ensure transporter is initialized
    if (!transporter) {
      console.log("Transporter not initialized, creating test account");
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
        debug: true,
      });
    }

    await transporter.verify();
    console.log("Email configuration is valid");
    return { success: true, message: "Email configuration is valid" };
  } catch (error) {
    console.error("Email configuration test failed:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
      error,
    };
  }
}
