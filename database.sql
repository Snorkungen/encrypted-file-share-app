CREATE DATABASE efsa;

CREATE TABLE chunks(
    chunk_id SERIAL PRIMARY KEY,
    count INT NOT NULL,
    data TEXT NOT NULL,
    length INT NOT NULL,
    file_id VARCHAR(100) NOT NULL
);