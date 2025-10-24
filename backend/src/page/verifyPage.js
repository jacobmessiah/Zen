const verifyPage = (message, instruction, link) => `
  <div style="max-width:600px;margin:0 auto;padding:20px;font-family:'Space Grotesk', sans-serif;background:#000000;border-radius:8px;box-shadow:0 0 10px rgba(255,255,255,0.05); color: #ffffff;">
    
    <div style="text-align:center;margin-bottom:20px;">
      <span style="display:inline-block;line-height:70px;vertical-align:middle;">
        <img
          src="https://res.cloudinary.com/dk2tojgit/image/upload/v1753030927/bankia_page-0001-removebg-preview_m5fc3k.png"
          alt="Zen"
          width="60"
          style="vertical-align:middle;"
        />
      </span>
      <span style="display:inline-block;font-size:32px;color:white;font-weight:bold;line-height:70px;vertical-align:middle;margin-left:8px;">
        Zen
      </span>
    </div>

    
    <p style="text-align: center; font-size:16px;color:#ffffff;line-height:1.5;">
      ${message}
    </p>
    
    <div style="text-align:center;margin:30px 0;">
      <a href="${link}" style="background-color:white;color:black;font-weight:bold;padding:12px 25px;border-radius:6px;text-decoration:none;font-size:16px;display:inline-block;">
        ${instruction}
      </a>
    </div>

    <p style="font-size:14px;color:#888888;text-align:center;margin-top:30px;">
      &copy; ${new Date().getFullYear()} Zen. All rights reserved.
    </p>
  </div>
`;

export default verifyPage;
