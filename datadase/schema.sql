CREATE DATABASE store_rating_system;
USE store_rating_system;

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,

    name VARCHAR(60) NOT NULL,

    email VARCHAR(255) NOT NULL UNIQUE,

    password VARCHAR(255) NOT NULL,

    address VARCHAR(400) NOT NULL,

    role ENUM('ADMIN', 'USER', 'STORE_OWNER') NOT NULL DEFAULT 'USER',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE stores (
    id INT PRIMARY KEY AUTO_INCREMENT,

    name VARCHAR(100) NOT NULL,

    email VARCHAR(255) NOT NULL UNIQUE,

    address VARCHAR(400) NOT NULL,

    owner_id INT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_store_owner
        FOREIGN KEY (owner_id)
        REFERENCES users(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

CREATE TABLE ratings (
    id INT PRIMARY KEY AUTO_INCREMENT,

    user_id INT NOT NULL,

    store_id INT NOT NULL,

    rating INT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT chk_rating
        CHECK (rating >= 1 AND rating <= 5),

    CONSTRAINT fk_rating_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_rating_store
        FOREIGN KEY (store_id)
        REFERENCES stores(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT unique_user_store_rating
        UNIQUE (user_id, store_id)
);

describe users;
describe stores;
describe ratings;


SHOW TABLES;
select * from users;


SELECT
    (SELECT COUNT(*) FROM users) AS totalUsers,
    (SELECT COUNT(*) FROM stores) AS totalStores,
    (SELECT COUNT(*) FROM ratings) AS totalRatings;

-- User's submitted rating

SELECT
    s.id,
    s.name,
    s.address,

    COALESCE(
        ROUND(AVG(all_ratings.rating), 2),
        0
    ) AS overall_rating,

    my_rating.rating AS my_rating

FROM stores s

LEFT JOIN ratings all_ratings
    ON s.id = all_ratings.store_id

LEFT JOIN ratings my_rating
    ON s.id = my_rating.store_id
    AND my_rating.user_id = 1

GROUP BY
    s.id,
    s.name,
    s.address,
    my_rating.rating;


SELECT
    id,
    name,
    email,
    address,
    role
FROM users;

SELECT *
FROM ratings;

SELECT id, name, email, role
FROM users
WHERE role = 'STORE_OWNER';