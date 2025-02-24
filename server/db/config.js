const mongoose = require('mongoose');
const User = require('../model/schema/user');
const bcrypt = require('bcrypt');
const { initializeLeadSchema } = require("../model/schema/lead");
const { initializeContactSchema } = require("../model/schema/contact");
const { initializePropertySchema } = require("../model/schema/property");
const { createNewModule } = require("../controllers/customField/customField.js");
const customField = require('../model/schema/customField.js');
const { contactFields } = require('./contactFields.js');
const { leadFields } = require('./leadFields.js');
const { propertiesFields } = require('./propertiesFields.js');

const initializedSchemas = async () => {
    await initializeLeadSchema();
    await initializeContactSchema();
    await initializePropertySchema();

    const CustomFields = await customField.find({ deleted: false });
    const createDynamicSchemas = async (CustomFields) => {
        for (const module of CustomFields) {
            const { moduleName, fields } = module;

            // Check if schema already exists
            if (!mongoose.models[moduleName]) {
                // Create schema object
                const schemaFields = {};
                for (const field of fields) {
                    schemaFields[field.name] = { type: field.backendType };
                }
                // Create Mongoose schema
                const moduleSchema = new mongoose.Schema(schemaFields);
                // Create Mongoose model
                mongoose.model(moduleName, moduleSchema, moduleName);
                console.log(`Schema created for module: ${moduleName}`);
            }
        }
    };

    createDynamicSchemas(CustomFields);

}

const connectDB = async (DATABASE_URL, DATABASE) => {
    try {
        const DB_OPTIONS = {
            dbName: DATABASE,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            retryWrites: true,
            w: 'majority',
            authSource: 'admin'
        };

        mongoose.set("strictQuery", false);
        
        console.log('Attempting to connect to MongoDB Atlas...');
        await mongoose.connect(DATABASE_URL, DB_OPTIONS);
        console.log('MongoDB Atlas connected successfully');

        // Initialize schemas
        await initializedSchemas();
        
        // Check for admin user
        const adminExisting = await User.findOne({ role: 'superAdmin' });
        if (!adminExisting) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await User.create({
                _id: new mongoose.Types.ObjectId('64d33173fd7ff3fa0924a109'),
                username: 'admin@gmail.com',
                password: hashedPassword,
                firstName: 'Prolink',
                lastName: 'Infotech',
                phoneNumber: '7874263694',
                role: 'superAdmin'
            });
            console.log("Admin created successfully");
        }

        return true;
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
};

module.exports = connectDB