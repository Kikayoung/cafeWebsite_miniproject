CREATE DATABASE godiva;
USE godiva;

CREATE TABLE inquiries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    email VARCHAR(100) NOT NULL,
    privacy_agreement BOOLEAN NOT NULL,
    inquiry_category ENUM('order_payment_confirmation', 'delivery_inquiry', 'cancellation_return_exchange_refund', 'other') NOT NULL,
    subject VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    file_attachment VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
#DROP TABLE inquiries;
SELECT * FROM inquiries;
SHOW TABLES;

ALTER USER 'root'@'localhost' IDENTIFIED BY '1234';



USE godiva;
#DROP TABLE account;
#nodejsproject
CREATE TABLE account (
    userid VARCHAR(30) NOT NULL primary key,
    name VARCHAR(100) NOT NULL,
    userpw VARCHAR(64) NOT NULL,
    userphonenumber VARCHAR(20) NOT NULL,
    useremail VARCHAR(50) NOT NULL,
    privacy_agreement BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE inquiries (
    in_id INT AUTO_INCREMENT PRIMARY KEY,
    userid VARCHAR(30) NOT NULL,
    inquiry_category VARCHAR(50) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    file_attachment VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userid) REFERENCES account(userid)
);
SELECT * FROM inquiries;
SELECT * FROM inquiries WHERE in_id = 1;

SHOW TABLES;

create table product(
pid int not null auto_increment primary key,
pname varchar(50) not null,
pprice int not null
);

SELECT * FROM product;

DROP TABLE product;
desc product;

insert into product(pname,pprice) values ("골드리커버리 6개입",32000);
insert into product(pname,pprice) values ("골드리커버리 9개입",42000);
insert into product(pname,pprice) values ("골드리커버리 15개입",65000);
insert into product(pname,pprice) values ("하트오브골드 8개입",34000);
insert into product(pname,pprice) values ("골드리커버리 12개입",52000);
insert into product(pname,pprice) values ("까레 밀크 어쏘트먼트 16개입",34000);
insert into product(pname,pprice) values ("까레 어쏘트먼트 밀크&다크 24조각",50000);
insert into product(pname,pprice) values ("까레 어쏘트먼트 50% 16개입",34000);