import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js";
import { Background } from "./backgrounds.js";
import { ConsultRating } from "./consult_rating.js";
import { Note } from "../users/notes.js";
import { TreatmentCatalog } from "../users/treatments_catalogs.js";
import { MediaFile } from "../patients/media_files.js";

export const Consult = sequelize.define(
    "Consult",
    {
        _id_consult: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        audio_transcript: {
            type: DataTypes.STRING(10000),
            allowNull: false,
        },
        consult_json: {
            type: DataTypes.JSON,
            allowNull: false,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        treatment_name: {
            type: DataTypes.STRING(255),
            allowNull: true, // Set to true if null is allowed
            defaultValue: null, // Set a default value if needed
        },
        treatment_price: {
            type: DataTypes.FLOAT,
            allowNull: true, // Set to true if null is allowed
            defaultValue: null, // Set a default value if needed
        },
        is_valid: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        is_finished: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        _id_doctor: {
            type: DataTypes.UUID,
        },
        _id_patient: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        _id_treatment_catalog: {
            type: DataTypes.UUID,
            allowNull: true,
            defaultValue: null,
        },
    },
    {
        tableName: "consults",
        timestamps: true, // Set this to true if you want Sequelize to handle timestamps automatically
    }
);

// ------------- BACKGROUND -------------
Background.belongsTo(Consult, {
    foreignKey: "_id_consult",
});
Consult.hasMany(Background, { foreignKey: "_id_consult" });

// ------------- TREATMENT -------------
Note.belongsTo(Consult, {
    foreignKey: "_id_consult",
});
Consult.hasMany(Note, { foreignKey: "_id_consult" });

// ------------- CONSULT RATING -------------
ConsultRating.belongsTo(Consult, {
    foreignKey: "_id_consult",
    targetId: "_id_consult",
});
Consult.hasMany(ConsultRating, {
    foreignKey: "_id_consult",
    targetId: "_id_consult",
});

// ------------- TREATMENT CATALOG -------------
Consult.belongsTo(TreatmentCatalog, {
    foreignKey: "_id_treatment_catalog",
    targetKey: "_id_treatment_catalog",
});
TreatmentCatalog.hasMany(Consult, {
    foreignKey: "_id_treatment_catalog",
    sourceKey: "_id_treatment_catalog",
});

// ------------- MEDIA FILES -------------
MediaFile.belongsTo(Consult, {
    foreignKey: "_id_consult",
    targetKey: "_id_consult",
});
Consult.hasMany(MediaFile, {
    foreignKey: "_id_consult",
    sourceKey: "_id_consult",
});
