import mongoose from "mongoose";

const  ConnnectDB = async () => {
    try {
     await mongoose.connect(process.env.MONGODB_URI)
     console.log(`Database connected successfully`)
    }catch(error) {
        console.log('Error connecting to Database' , error.message)
    }
}

export default ConnnectDB