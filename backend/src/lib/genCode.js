const GenCode =  () => {
  let code = "";
  const chars =
    "0123456789454501234567890";
  for (let i = 0; i < 6; i++) {
    const random = Math.floor(Math.random() * chars.length);
    const char = chars[random];
    code += char;
  }
  return code;
};



export default GenCode

