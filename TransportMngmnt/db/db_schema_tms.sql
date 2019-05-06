use tmsapp;
create table user_role(
role_id int,
role varchar(10),
primary key (role_id)
);
create table user_credentials(
user_id int auto_increment,
status boolean default false,
username varchar(20),
password varchar(100),
primary key (user_id)
);
insert into user_credentials(username,password) values('admin',sha1('Admin123'));
create table user_details(
firstname varchar(20),
lastname varchar(20),
phone varchar(20),
email varchar(50),
role_id int,
user_id int,
foreign key (role_id) references user_role(role_id),
foreign key (user_id) references user_credentials(user_id)
);
insert into user_details(firstname,lastname,phone,email,role_id,user_id) values('Kiran','Rao','8165419566','kvzcv@mail.umkc.edu',1,last_insert_id());
create table driver_routes(
route_id int auto_increment,
from_loc varchar(30),
to_loc varchar(30),
arrival_time datetime,
departure_time datetime,
user_id int,
seats int,
primary key (route_id),
foreign key (user_id) references user_credentials(user_id)
);
create table user_routes(
user_route_id int auto_increment,
user_id int,
route_id int,
from_loc varchar(30),
to_loc varchar(30),
primary key (user_route_id),
foreign key (user_id) references user_credentials(user_id),
foreign key (route_id) references driver_routes(route_id)
);

