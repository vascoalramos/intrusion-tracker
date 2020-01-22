# Intrusion Tracker

## Localhost Mysql

### Setup

| Action | Command |
| --- | --- |
| Install MySQL | `apt install mysql-server` ; `apt install default-libmysqlclient-dev`|
| Access MySQL  as admin | `sudo mysql -u root`|
| Create the database | `CREATE DATABASE intrusion_tracker;`|
| Create a new user and set it's password | `CREATE USER 'it'@'localhost' IDENTIFIED BY 'intrusion-tracker2019';`|
| Grant priviliges to the new user | `GRANT ALL PRIVILEGES ON * . * TO 'it'@'localhost';`|
| Find out the port where MySQL is running | `SHOW VARIABLES WHERE Variable_name = 'port';`|