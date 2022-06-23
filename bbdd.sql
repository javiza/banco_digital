create database gestion;
create table cliente (
    id serial primary key,
    name varchar(50),
    email varchar(50) not null,
    rut varchar(12) not null,
    password varchar(10),
    address varchar(50),
    balance int check(balance >= 0) default 100000);

create table transfer (
    id serial primary key,
    id_cliente int references cliente(id),
    id_destinatario int references cliente(id),
    monto int check(monto >= 0),
    fecha timestamp default current_timestamp,
    comment varchar(50)
    );
create table admin(name varchar(50),rut varchar(12) not null,password varchar(10));
INSERT INTO admin(name,rut,password)
 VALUES('jonathan','12.345.567-8','1234');