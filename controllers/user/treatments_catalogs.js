import { TreatmentCatalog } from "../../models/users/treatments_catalogs.js";

export const createTreatmentCatalog = async (req, res) => {
    try {
        const { name, price, description } = req.body;
        const _id_doctor = req.user._id_user;
        // Create a new treatment catalog into catalog in the database
        const newTreatmentCatalog = await TreatmentCatalog.create({
            name,
            price,
            description,
            _id_doctor,
        });

        res.status(201).json({
            success: true,
            treatment_catalog: newTreatmentCatalog,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to create treatment in catalog",
            error: error.message,
        });
    }
};

export const deleteTreatmentCatalog = async (req, res) => {
    try {
        const treatmentId = req.query._id_treatment_catalog;

        // Find the treatment_catalog by ID
        const treatment_catalog = await TreatmentCatalog.findByPk(treatmentId);

        if (!treatment_catalog) {
            return res.status(404).json({
                success: false,
                message: "Treatment catalog not found",
            });
        }

        // Set is_valid to false
        await treatment_catalog.update({ is_valid: false });

        res.status(200).json({
            success: true,
            message: "Treatment catalog marked as invalid successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to mark treatment catalog as invalid",
            error: error.message,
        });
    }
};

export const updateTreatmentCatalog = async (req, res) => {
    try {
        const treatmentId = req.query._id_treatment_catalog;
        const { name, price, description } = req.body;
        const _id_doctor = req.user._id_user;
        // Find the treatment_catalog by ID
        const treatment_catalog = await TreatmentCatalog.findByPk(treatmentId);

        if (!treatment_catalog) {
            return res.status(404).json({
                success: false,
                message: "Treatment catalog not found",
            });
        }

        // Update the tretreatment_catalogatment in the database
        await treatment_catalog.update({
            name,
            price,
            description,
            _id_doctor,
        });

        res.status(200).json({
            success: true,
            message: "Treatment catalog updated successfully",
            treatment_catalog,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to update treatment catalog ",
            error: error.message,
        });
    }
};

export const getTreatmentCatalogDetails = async (req, res) => {
    try {
        const treatmentId = req.query._id_treatment_catalog;

        // Find the treatment_catalog by ID
        const treatment_catalog = await TreatmentCatalog.findByPk(treatmentId, {
            attributes: {
                exclude: ["duration_weeks"],
            },
        });

        if (!treatment_catalog) {
            return res.status(404).json({
                success: false,
                message: "Treatment catalog not found",
            });
        }

        res.status(200).json({ success: true, treatment_catalog });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to get treatment catalog details",
            error: error.message,
        });
    }
};

export const getDoctorTreatmentCatalogs = async (req, res) => {
    try {
        const _id_doctor = req.user._id_user;

        // Find all treatments_catalog for the given doctor ID
        const treatments_catalog = await TreatmentCatalog.findAll({
            where: {
                _id_doctor: _id_doctor,
                is_valid: true,
            },
            attributes: {
                exclude: ["duration_weeks"],
            },
        });

        if (treatments_catalog.length === 0) {
            return res.status(200).json({
                success: false,
                message: "No treatments catalog found for this doctor",
                treatments_catalog: [],
            });
        }

        res.status(200).json({ success: true, treatments_catalog });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to get doctor treatments catalog",
            error: error.message,
        });
    }
};
