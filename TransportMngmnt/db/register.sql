CREATE DEFINER=`root`@`localhost` PROCEDURE `register`(IN firstname varchar(20),IN lastname varchar(20),IN phone varchar(20),IN email varchar(50),IN username varchar(20),IN password varchar(20),IN usertype varchar(10))
BEGIN
declare roleid int ;
select role_id into roleid from user_role where role = usertype;
insert into user_credentials(user_id,username,password) values(null,username,sha1(password));
insert into user_details(firstname,lastname,phone,email,role_id,user_id) values(firstname,lastname,phone,email,roleid,last_insert_id());
END