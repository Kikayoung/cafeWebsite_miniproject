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
drop table USER;
FLUSH PRIVILEGES;

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
#drop table inquiries;
select * from inquiries;
show tables;






-- 상품 목록 테이블
CREATE TABLE products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 장바구니 테이블
CREATE TABLE cart (
    cart_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

