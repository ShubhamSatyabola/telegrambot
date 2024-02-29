const User = require('../models/User')
const Keys = require('../models/keys')
const Admin = require('../models/admin')
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}, "chatId name city country allowed");
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

exports.postKey = async (req, res) => {
   try {
     const { apiKey } = req.body;
   // console.log(apiKey);
     // Check if the API key already exists
     const existingKey = await Keys.findOne({ apiKey });

     if (existingKey) {
       return res.status(400).json({ error: "API key already exists" });
     }

     // Create a new API key document
     const newKey = new Keys({ key:apiKey });

     // Save the new key to the database
     await newKey.save();

     res.status(201).json({ newKey ,message: "API key added successfully" });
   } catch (error) {
     console.error("Error adding API key:", error);
     res.status(500).json({ error: "An internal server error occurred" });
   }
}

exports.getKeys = async (req, res) => {
  try {
    const keys = await Keys.find({},'key');
    res.status(200).json(keys);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

exports.deleteKey = async (req,res) => {
    try {
        const keyId= req.params.id

    // Find the API key by its ID and delete it
    const deletedKey = await Keys.findByIdAndDelete(keyId);
    
    if (!deletedKey) {
      throw new Error('API key not found');
    }
    
    res.status(200).json({deletedKey})
  } catch (error) {
    console.error('Error deleting API key:', error);
    throw error;
  }
}

exports.blockUser = async(req,res) => {
    try{
    const userId = req.params.userId;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        allowed: "false",
      },
      { new: true }
    )

     if (!updatedUser) {
       return res.status(404).json({ error: "User not found" });
     }

    res.status(200).json(updatedUser);
    }
    catch(err){
        console.log(err)
    }
}

exports.messageFrequency = async (req, res) => {
        try{
            const newFrequency = req.body.frequency;

            const update = await Admin.findOneAndUpdate({},{messageNumber:newFrequency},{new:true})
            if(!update){
                const admin = new Admin({})
                await admin.save()
                return ;
            }
            res.status(200).json(update);


        }
        catch{
            err => console.log(err)
        }
}