create table users (
    user_uid UUID NOT NULL PRIMARY KEY,
    phone VARCHAR(15) NOT NULL,
    password VARCHAR(150) NOT NULL,
    full_name VARCHAR(50),
    address VARCHAR(150),
    date_of_birth DATE,
    email VARCHAR(100),
    gender VARCHAR(7),
    UNIQUE(phone)
);