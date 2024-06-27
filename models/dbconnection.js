const mongoose = require("mongoose");

exports.connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`Connection Successful: ${conn.connection.host}`);
    }
    catch (err) {
        console.log(err.message);
    }
}
