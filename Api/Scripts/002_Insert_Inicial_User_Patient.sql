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

