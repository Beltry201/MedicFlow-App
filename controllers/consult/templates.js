import { Doctor } from "../../models/clinic/doctors.js";
import { Template } from "../../models/clinic/templates.js";
import { Op } from "sequelize";

export const createTemplate = async (req, res) => {
    try {
        const { name, prompt, template_json, _id_doctor } = req.body;

        // Create a new template record in the database
        const template = await Template.create({
            name,
            prompt,
            template_json,
            description,
            _id_doctor,
        });

        // Return a success response with the created template
        return res.status(201).json({
            message: "Template created successfully",
            template,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Internal server error",
        });
    }
};

export const getTemplatesForDoctor = async (req, res) => {
    try {
        const doctorId = req.user._id_doctor;

        // Find the doctor to verify existence
        const doctor = await Doctor.findByPk(doctorId);
        if (!doctor) {
            return res.status(404).json({
                message: "Doctor not found",
            });
        }

        // Find both global templates and personal templates
        const templates = await Template.findAll({
            where: {
                [Op.or]: [{ _id_doctor: null }, { _id_doctor: doctorId }],
            },
        });

        // Return the templates
        return res.status(200).json({
            message: "Templates fetched successfully",
            templates,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Internal server error",
        });
    }
};
