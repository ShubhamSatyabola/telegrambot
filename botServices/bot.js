const Admin = require('../models/admin')
exports.cronSchedule = async () => {
    const admin = await Admin.findOne({}) // get the first
    return admin.messageNumber
};