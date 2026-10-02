const Users = require('../models/Users');

const generateAdvisorId = async () => {
    let AdvisorId;
       let isUnique = false;
   
       while (!isUnique) {
           AdvisorId = String(Math.floor(1000000 + Math.random() * 9000000));
   
           const existingUser = await Users.findOne({ AdvisorId });
           if (!existingUser) {
               isUnique = true;
           }
       }
       return AdvisorId;
};

module.exports =  generateAdvisorId ;