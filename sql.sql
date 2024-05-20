SHOW DATABASES;
CREATE DATABASE godiva;
USE godiva;

CREATE TABLE account (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userid VARCHAR(255) NOT NULL,
    userpw VARCHAR(255) NOT NULL,
    userphonenumber VARCHAR(255) NOT NULL,
    useremail VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
drop TABLE account;
select * from account;
