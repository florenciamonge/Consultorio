DELETE FROM "PropertyValue";
DELETE FROM "Property";

DECLARE @propertyId INT;

/* USER STATUS */
INSERT INTO Property("Name", "Type", "Code", "Description", "CreatedAt", "UpdatedAt", "Deleted", "CreatedUserID", "UpdatedUserID")
VALUES ('userStatus', 'int', 'userStatus', '...', 0, 0, 0, 0, 0);

SELECT @propertyId = PropertyId FROM Property WHERE Code = 'userStatus'
--
INSERT INTO PropertyValue("PropertyCode", "PropertyId", "Code", "ValueString", "ValueDateTime", "ValueInt", "ValueFloat", "TextES", "TextEN", "TextPT", "Description", "CreatedAt", "UpdatedAt", "Deleted", "CreatedUserID", "UpdatedUserID")
VALUES ('userStatus', @propertyId, 'userStatusInactive', null, null, 0, null, 'Inactivo', 'Inactivo', 'Inactivo', '...', 0, 0, 0, 0, 0);

INSERT INTO PropertyValue("PropertyCode", "PropertyId", "Code", "ValueString", "ValueDateTime", "ValueInt", "ValueFloat", "TextES", "TextEN", "TextPT", "Description", "CreatedAt", "UpdatedAt", "Deleted", "CreatedUserID", "UpdatedUserID")
VALUES ('userStatus', @propertyId, 'userStatusActive', null, null, 1, null, 'Activo', 'Activo', 'Activo', '...', 0, 0, 0, 0, 0);

/* PATIENT STATUS */
INSERT INTO Property("Name", "Type", "Code", "Description", "CreatedAt", "UpdatedAt", "Deleted", "CreatedUserID", "UpdatedUserID")
VALUES ('patientStatus', 'int', 'patientStatus', '...', 0, 0, 0, 0, 0);

SELECT @propertyId = PropertyId FROM Property WHERE Code = 'patientStatus'
--
INSERT INTO PropertyValue("PropertyCode", "PropertyId", "Code", "ValueString", "ValueDateTime", "ValueInt", "ValueFloat", "TextES", "TextEN", "TextPT", "Description", "CreatedAt", "UpdatedAt", "Deleted", "CreatedUserID", "UpdatedUserID")
VALUES ('patientStatus', @propertyId, 'patientStatusEspera', null, null, 0, null, 'Espera', 'Espera', 'Espera', '...', 0, 0, 0, 0, 0);

INSERT INTO PropertyValue("PropertyCode", "PropertyId", "Code", "ValueString", "ValueDateTime", "ValueInt", "ValueFloat", "TextES", "TextEN", "TextPT", "Description", "CreatedAt", "UpdatedAt", "Deleted", "CreatedUserID", "UpdatedUserID")
VALUES ('patientStatus', @propertyId, 'patientStatusEnAtención', null, null, 1, null, 'En Atención', 'En Atención', 'En Atención', '...', 0, 0, 0, 0, 0);

INSERT INTO PropertyValue("PropertyCode", "PropertyId", "Code", "ValueString", "ValueDateTime", "ValueInt", "ValueFloat", "TextES", "TextEN", "TextPT", "Description", "CreatedAt", "UpdatedAt", "Deleted", "CreatedUserID", "UpdatedUserID")
VALUES ('patientStatus', @propertyId, 'patientStatusDeAlta', null, null, 2, null, 'De Alta', 'De Alta', 'De Alta', '...', 0, 0, 0, 0, 0);


