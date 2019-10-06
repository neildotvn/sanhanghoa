CREATE EXTENSION "uuid-ossp";

create table account (
    account_uid UUID NOT NULL PRIMARY KEY,
    balance BIGINT NOT NULL DEFAULT 5000,
    credit INT NOT NULL DEFAULT 0,
    leverage INT NOT NULL DEFAULT 50
);

create table users (
    user_uid UUID NOT NULL PRIMARY KEY,
    phone VARCHAR(15) NOT NULL,
    password VARCHAR(150) NOT NULL,
    full_name VARCHAR(50),
    address VARCHAR(150),
    date_of_birth DATE,
    email VARCHAR(100),
    gender VARCHAR(7),
    account_uid UUID REFERENCES account(account_uid) NOT NULL,
    UNIQUE(phone),
    UNIQUE(account_uid)
);

create table orders (
    order_uid UUID NOT NULL PRIMARY KEY,
    exchange CHAR(3) NOT NULL,
    order_type INT NOT NULL,
    volume FLOAT8 NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP(2),
    closed_at TIMESTAMPTZ,
    placing_price FLOAT8 NOT NULL,
    take_profit_price FLOAT8,
    stop_loss_price FLOAT8,
    closing_price FLOAT8,
    result BIGINT,
    account_uid UUID REFERENCES account(account_uid) NOT NULL
);

create table alarm (
    alarm_uid UUID NOT NULL PRIMARY KEY,
    alarm_type INT NOT NULL,
    price FLOAT8 NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    status INT NOT NULL,
    user_uid UUID REFERENCES users(user_uid)
);

create table notification (
    noti_uid UUID NOT NULL PRIMARY KEY,
    status INT NOT NULL DEFAULT 0,
    title VARCHAR(100) NOT NULL,
    description VARCHAR(200) NOT NULL,
    deep_link VARCHAR(100),
    user_uid UUID REFERENCES users(user_uid)
);

-- insert into account(account_uid) values(uuid_generate_v4())