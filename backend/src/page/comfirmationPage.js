function confirmationPage(code) {
  const file = `<div style="max-width:600px;margin:0 auto;padding:20px;font-family:'Space Grotesk', sans-serif;background:#000000;border-radius:8px;box-shadow:0 0 10px rgba(255,255,255,0.05); color: #ffffff;">
    <div style="text-align:center;margin-bottom:20px;">
      <span style="display:inline-block;line-height:70px;vertical-align:middle;">
        <img
          src="https://res.cloudinary.com/dk2tojgit/image/upload/v1753030927/bankia_page-0001-removebg-preview_m5fc3k.png"
          alt="Zen Logo"
          width="60"
          style="vertical-align:middle;"
        />
      </span>
      <span style="display:inline-block;font-size:32px;color:white;font-weight:bold;line-height:70px;vertical-align:middle;margin-left:8px;">
        Zen
      </span>
    </div>

    <p style="font-weight: bold; font-size:16px;color:#ffffff;margin-top:10px;">
     Zen Account One Time Confirmation Code
    </p>
    <p style="font-size:16px;color:#ffffff;line-height:1.5;">
        This Code expires in 15 minutes
    </p>
    
    <div style=" border-radius: 5px; border: 1px solid; padding: 10px; letter-spacing: 5px; text-align:center;margin:30px 0;">
      ${code}
    </div>
    
    <p style="font-size:14px;color:#aaaaaa;text-align:center;">
      If you didn’t request this, you can safely ignore this message.
       <br>
       Do not share this code to anyone
    </p>
    <p style="font-size:14px;color:#888888;text-align:center;margin-top:30px;">
      &copy; ${new Date().getFullYear()} Zen. All rights reserved.
    </p>
  </div>`;

  return file;
}

export default confirmationPage;
