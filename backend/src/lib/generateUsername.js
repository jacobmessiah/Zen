import User from "../model/userModel.js";

  
 
 async function generateUniqueUsername(baseName) {
  let username = baseName.toLowerCase().replace(/\s+/g, '_');
  let finalUsername = username;
  let count = 1;

  while (await User.findOne({ username: finalUsername })) {
    finalUsername = `${username}${count}`;
    count++;
  }

  return finalUsername;
}

export default generateUniqueUsername

