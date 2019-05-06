CREATE DEFINER=`root`@`localhost` PROCEDURE `driverdetails`(IN routeid INT)
BEGIN
declare userid int;
select user_id into userid from driver_routes where route_id = routeid;
select concat(firstname,' ',lastname) name , phone, email from user_details where user_id = userid;
END