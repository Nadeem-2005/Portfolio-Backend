import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = 3000;
app.use(cors());
app.use(bodyParser.json());

const resend = new Resend(process.env.RESEND_API_KEY);

app.post("/send-mail", async (req, res) => {
  const { name, email, phone, message } = req.body;
  
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  
  const emailContent = `
  <h1>New Contact Form Submission</h1>
  <p><strong>Name:</strong> ${name}</p>
  <p><strong>Email:</strong> ${email}</p>
  <p><strong>Phone:</strong> ${phone}</p>
  <p><strong>Message:</strong></p>
  <p>${message}</p>
  `;
  
  try {
    console.log("Sending email with API key:", process.env.RESEND_API_KEY ? "Present" : "Missing");
    
    const data = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: 'mr.maestro002@gmail.com',
      subject: "New contact submission",
      html: emailContent
    });
    
    console.log("Resend API response:", data);
    
    if (data.id) {
      return res.status(200).json({ message: "Email sent successfully", id: data.id });
    } else {
      return res.status(500).json({ error: "Email API returned no ID", data });
    }
  } catch (error) {
    console.error("Resend API error:", error);
    return res.status(500).json({ 
      error: "Failed to send email", 
      details: error.message,
      code: error.statusCode || "unknown"
    });
  }
});

app.get("/test-server", (req, res) => {
    res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});