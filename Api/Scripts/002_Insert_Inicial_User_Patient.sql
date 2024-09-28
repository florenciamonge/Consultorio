-- USUARIO

-- Declaración de la variable para el estado
DECLARE @statusUsuarioId INT;

-- Obteniendo el StatusId de PropertyValue, en este caso todos serán activos.
SELECT @statusUsuarioId = PropertyValueId FROM PropertyValue 
WHERE PropertyCode = 'userStatus' AND Code = 'userStatusActive';

INSERT INTO [dbo].[User]([Name],[Surname],[Username],[Password],[Email],[StatusId],[Administrative],[Doctor],[CreatedAt],[UpdatedAt],[Deleted],[CreatedUserID],[UpdatedUserID])
VALUES('Pablo','Choconni','PChoco','1234','pchoconi@gmail.com',@statusUsuarioId,'false','True',0,0,'false',0,0);

INSERT INTO [dbo].[User]([Name],[Surname],[Username],[Password],[Email],[StatusId],[Administrative],[Doctor],[CreatedAt],[UpdatedAt],[Deleted],[CreatedUserID],[UpdatedUserID])
VALUES('Agustina','Perez','APerez','1235','Agus@hotmail.com',@statusUsuarioId,'false','True',0,0,'false',0,0);

INSERT INTO [dbo].[User]([Name],[Surname],[Username],[Password],[Email],[StatusId],[Administrative],[Doctor],[CreatedAt],[UpdatedAt],[Deleted],[CreatedUserID],[UpdatedUserID])
VALUES('Bianca','Aguilar','BAguilar','1236','Bian@hotmail.com',@statusUsuarioId,'True','False',0,0,'false',0,0);

INSERT INTO [dbo].[User]([Name],[Surname],[Username],[Password],[Email],[StatusId],[Administrative],[Doctor],[CreatedAt],[UpdatedAt],[Deleted],[CreatedUserID],[UpdatedUserID])
VALUES('Camilo','Aufranc','CAufranc','1237','Cami@hotmail.com',@statusUsuarioId,'True','false',0,0,'false',0,0);

INSERT INTO [dbo].[User]([Name],[Surname],[Username],[Password],[Email],[StatusId],[Administrative],[Doctor],[CreatedAt],[UpdatedAt],[Deleted],[CreatedUserID],[UpdatedUserID])
VALUES('Ignacio','Ceballos','ICeballos','1238','Nacho@hotmail.com',@statusUsuarioId,'true','false',0,0,'false',0,0);

-- PACIENTE

-- Declaración de la variable para el estado
DECLARE @statusPatientId INT;

-- Obteniendo el StatusId de PropertyValue.
SELECT @statusPatientId = PropertyValueId FROM PropertyValue 
WHERE PropertyCode = 'patientStatus' AND Code = 'patientStatusEnAtención';

INSERT INTO [dbo].[Patient]([Name],[Surname],[Phone],[Email],[StatusId],[HealthInsurance],[CreatedAt],[UpdatedAt],[Deleted],[CreatedUserID],[UpdatedUserID],[DNI])
VALUES('Micaela','Lopez','12334344','null',@statusPatientId,'false',0,0,'False',0,0,'12377778');

-- Obteniendo el StatusId de PropertyValue.
SELECT @statusPatientId = PropertyValueId FROM PropertyValue 
WHERE PropertyCode = 'patientStatus' AND Code = 'patientStatusEnAtención';

INSERT INTO [dbo].[Patient]([Name],[Surname],[Phone],[Email],[StatusId],[HealthInsurance],[CreatedAt],[UpdatedAt],[Deleted],[CreatedUserID],[UpdatedUserID],[DNI])
VALUES('Valentina','Muñiz','123666','null',@statusPatientId,'false',0,0,'False',0,0,'1555678');

-- Obteniendo el StatusId de PropertyValue.
SELECT @statusPatientId = PropertyValueId FROM PropertyValue 
WHERE PropertyCode = 'patientStatus' AND Code = 'patientStatusDeAlta';

INSERT INTO [dbo].[Patient]([Name],[Surname],[Phone],[Email],[StatusId],[HealthInsurance],[CreatedAt],[UpdatedAt],[Deleted],[CreatedUserID],[UpdatedUserID],[DNI])
VALUES('Santiago','Ortiz','7733445','null',@statusPatientId,'true',0,0,'False',0,0,'18845678');



