Create Database competition_system_security_concept_v2_db CHARACTER SET latin1 COLLATE latin1_general_ci;
Use competition_system_security_concept_v2_db;
CREATE TABLE user (
     user_id int NOT NULL AUTO_INCREMENT,
     fullname varchar(255) NOT NULL,
     email varchar(100) NOT NULL,
     user_password varchar(255),
     role_id int NOT NULL,
     PRIMARY KEY (user_Id),
     UNIQUE (email)
)AUTO_INCREMENT=100;   

CREATE TABLE role(
     role_id int NOT NULL AUTO_INCREMENT,
     role_name varchar(255) NOT NULL,
     PRIMARY KEY (role_id),
     UNIQUE(role_name)
)AUTO_INCREMENT=1;   
insert role (role_name) values ('admin');
insert role (role_name) values ('user');

CREATE TABLE file (
     file_id int NOT NULL AUTO_INCREMENT,
     cloudinary_file_id varchar(255) NOT NULL,
     cloudinary_url varchar(255) NOT NULL,
     design_title varchar(2000) NOT NULL,
     design_description varchar(2000) NOT NULL,
     created_by_id int,
     PRIMARY KEY (file_id)
)AUTO_INCREMENT=100;   

CREATE USER 'adminuser'@'%' IDENTIFIED BY 'password123';
GRANT ALL PRIVILEGES ON *.* TO 'adminuser'@'%';
ALTER USER 'adminuser'@'%' IDENTIFIED WITH mysql_native_password BY 'password'







