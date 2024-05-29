import Joi from "joi";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../../models/users/users.js";
import { Doctor } from "../../models/clinic/doctors.js";
import { sequelize } from "../../config/db.js";
dotenv.config();

export class UserService {
    async createUser(userData) {
        let transaction;

        try {
            const {
                name,
                last_name,
                phone,
                email,
                profile_picture_url,
                password,
                role,
                professional_id,
                department,
                specialty,
            } = userData;

            // Validate role-specific fields
            if (
                role === "doctor" &&
                (!professional_id || !department || !specialty)
            ) {
                // Default values for missing doctor fields
                userData.professional_id = userData.professional_id || "na";
                userData.department = userData.department || "general";
                userData.specialty = userData.specialty || "general";
            }

            // Validations
            const schema = Joi.object({
                name: Joi.string().optional(),
                last_name: Joi.string().optional(),
                phone: Joi.string().optional(),
                email: Joi.string().email().required(),
                profile_picture_url: Joi.string().optional(),
                password: Joi.string().required(),
                role: Joi.string().valid("doctor", "admin", "staff").required(),
                professional_id: Joi.string().optional(),
                department: Joi.string().optional(),
                specialty: Joi.string().optional(),
            });

            const { error } = schema.validate(userData);

            if (error) {
                throw new Error(error.details[0].message);
            }

            // Check if phone number already exists
            if (phone) {
                const existingPhoneUser = await User.findOne({
                    where: { phone },
                });
                if (existingPhoneUser) {
                    throw new Error("Phone number already exists.");
                }
            }

            // Check if email already exists
            const existingEmailUser = await User.findOne({ where: { email } });
            if (existingEmailUser) {
                throw new Error("Email already exists.");
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            transaction = await sequelize.transaction();
            // Create the user
            const newUser = await User.create(
                {
                    name,
                    last_name,
                    phone,
                    email,
                    profile_picture_url,
                    pass_token: hashedPassword,
                    role,
                },
                { transaction }
            );

            let doctor;
            if (role === "doctor") {
                // Create the doctor record
                doctor = await Doctor.create(
                    {
                        professional_id: userData.professional_id,
                        department: userData.department,
                        specialty: userData.specialty,
                        _id_user: newUser._id_user,
                    },
                    { transaction }
                );
                newUser.Doctor = doctor;
            }

            await transaction.commit();

            const token = this.generateToken(newUser);

            return { newUser, token };
        } catch (error) {
            if (transaction) await transaction.rollback();
            console.error(error);
            throw new Error(error.message || "Failed to create user");
        }
    }

    async loginUser(email, password) {
        try {
            // Check if the email exists in the database
            const user = await User.findOne({
                where: { email },
                include: {
                    model: Doctor,
                    required: false,
                },
            });
            if (!user) {
                return { success: false, message: "Email not found" };
            }

            const isPasswordValid = await user.comparePassword(password);

            if (!isPasswordValid) {
                return { success: false, message: "Invalid password" };
            }
            console.log(user);
            // Generate JWT token
            const token = this.generateToken(user);
            console.log(token);
            return { success: true, message: "Login successful", token };
        } catch (error) {
            console.error(error);
            return {
                success: false,
                message: "Internal server error",
                error: error.message,
            };
        }
    }

    generateToken(user) {
        // Generate JWT token with payload
        console.log(user._id_user);
        const payload = {
            _id_user: user._id_user,
            email: user.email,
            phone: user.phone,
        };

        if (user.Doctor && user.Doctor._id_doctor) {
            payload._id_doctor = user.Doctor._id_doctor;
        }

        const token = jwt.sign(payload, process.env.TOKEN_SECRET, {
            expiresIn: "1w",
        });

        return token;
    }
}
