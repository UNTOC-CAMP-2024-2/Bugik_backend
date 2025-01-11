CREATE DATABASE IF NOT EXISTS bugik;
USE bugik;

CREATE TABLE `users` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `nickname` VARCHAR(100) NOT NULL UNIQUE,
    `college` VARCHAR(50) NOT NULL,
    `phone_number` VARCHAR(20) NULL
);

CREATE TABLE `restaurants` (
    `restaurant_id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL UNIQUE,
    `type` ENUM('기숙사','학교식당') NOT NULL
);

CREATE TABLE `restaurants_meal` (
    `menu_date_id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `restaurant_id` INT NOT NULL,
    `date` DATE NOT NULL,
    `time` ENUM('조기','조식','중식','석식') NOT NULL,
    FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants`(`restaurant_id`)
);

CREATE TABLE `meal_reviews` (
    `review_id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `menu_date_id` INT NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `comment` TEXT,
    `photo_path` VARCHAR(500),
    `review_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`menu_date_id`) REFERENCES `restaurants_meal`(`menu_date_id`),
    FOREIGN KEY (`email`) REFERENCES `users`(`email`)
);

CREATE TABLE `food_info` (
    `item_id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(200) NOT NULL,
    `restaurant_id` INT NOT NULL,
    `explanation` TEXT,
    FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants`(`restaurant_id`)
);

CREATE TABLE `restaurants_meal_food` (
    `meal_id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `menu_date_id` INT NOT NULL,
    `mealtype` ENUM('주요리','밥/면류','국/찌개','반찬','디저트') NOT NULL,
    `item_id` INT NOT NULL,
    FOREIGN KEY (`menu_date_id`) REFERENCES `restaurants_meal`(`menu_date_id`),
    FOREIGN KEY (`item_id`) REFERENCES `food_info`(`item_id`)
);

CREATE TABLE `food_reviews` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
    `review_id` INT NOT NULL,  
    `item_id` INT NOT NULL,
    `rating_value` TINYINT NOT NULL CHECK (`rating_value` BETWEEN 1 AND 5),
    `comment` TEXT,
    FOREIGN KEY (`review_id`) REFERENCES `meal_reviews`(`review_id`),
    FOREIGN KEY (`item_id`) REFERENCES `food_info`(`item_id`)
);

CREATE TABLE `email_verifications` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `code` VARCHAR(6) NOT NULL,
    `expires_at` DATETIME NOT NULL,
    `verified` TINYINT(1) DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `tickets` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `seller_id` INT NOT NULL, 
    `title` VARCHAR(255) NOT NULL, 
    `description` TEXT NOT NULL, 
    `price` INT NOT NULL, 
    `status` ENUM('거래가능', '거래완료', '거래취소') DEFAULT '거래가능',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`seller_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

CREATE TABLE `chat_rooms` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
    `ticket_id` INT NOT NULL, 
    `buyer_id` INT NOT NULL, 
    `seller_id` INT NOT NULL, 
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    FOREIGN KEY (`ticket_id`) REFERENCES `tickets`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`buyer_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`seller_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

CREATE TABLE `chat_messages` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
    `chat_room_id` INT NOT NULL, 
    `sender_id` INT NOT NULL,
    `message` TEXT NOT NULL, 
    `sent_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    FOREIGN KEY (`chat_room_id`) REFERENCES `chat_rooms`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);  