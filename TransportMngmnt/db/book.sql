CREATE DEFINER=`root`@`localhost` PROCEDURE `book`(IN userid INT,IN routeid INT)
BEGIN
declare fromloc varchar(30);
declare toloc varchar(30);
select from_loc, to_loc into fromloc,toloc from driver_routes where route_id = routeid ;
insert into user_routes(user_route_id,user_id,route_id,from_loc,to_loc) values(null,userid,routeid,fromloc,toloc);
END