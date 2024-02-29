const Admin = require('../models/admin')
exports.cronSchedule = async () => {
    const admin = await Admin.find() // get the first
    return admin[0].messageNumber
};