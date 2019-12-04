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
    push_token TEXT,
    UNIQUE(phone),
    UNIQUE(account_uid)
);

create table orders (
    order_uid UUID NOT NULL PRIMARY KEY,
    exchange VARCHAR(10) NOT NULL,
    product VARCHAR(20) NOT NULL,
    order_type INT NOT NULL, /* 0 for buy, 1 for sell, 2 for buy limit, 3 for sell limit, 4 for buy stop, 5 for sell stop */
    order_status INT NOT NULL, /* 0 for active, 1 for inactive, 2 for closed*/
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
    -- 0: "KHÔ ĐẬU TƯƠNG",
    -- 1: "DẦU ĐẬU TƯƠNG",
    -- 2: "LÚA MÌ",
    -- 3: "ĐẬU TƯƠNG",
    -- 4: "NGÔ",
    -- 5: "CÀ PHÊ" - coffee
    -- 6: "CÀ PHÊ ROBUSTA" - robuta
    -- 7: "CÀ PHÊ ARABICA" - arabica
    -- 8: "ĐƯỜNG",
    -- 9: "BÔNG" - cotton
    -- 10: "CAO SU" - rubber
    -- 11: "CA CAO" - cocoa
    -- 12: "TIÊU",
    -- 13: "QUẶNG SẮT",
    -- 14: "BẠCH KIM",
    -- 15: "BẠC",
    -- 16: "ĐỒNG",
    -- 17: "DẦU WTI MINI",
    -- 18: "DẦU ÍT LƯU HUỲNH",
    -- 19: "XĂNG PHA CHẾ",
    -- 20: "KHÍ TỰ NHIÊN",
    -- 21: "DẦU THÔ",
    -- 22: "DẦU THÔ BRENT"

create table alarm (
    alarm_uid UUID NOT NULL PRIMARY KEY,
    product VARCHAR(20) NOT NULL,
    exchange VARCHAR(10),
    alarm_type INT NOT NULL, -- 0 for up (expect higher than current), 1 for down
    price FLOAT8 NOT NULL,
    description VARCHAR(70),
    created_at TIMESTAMPTZ NOT NULL,
    status INT NOT NULL DEFAULT 0, -- 0 is active, 1 is inactive
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