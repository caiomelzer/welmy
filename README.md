
## Project setup
```
npm install
```
Create database called "welmy"

Change the file with your MySQL credentials

### Run
```
node server.js
```

Run the following sql command:
INSERT INTO `roles` (`id`, `name`, `createdAt`, `updatedAt`) VALUES
(1, 'user', '2020-05-29 17:42:57', '2020-05-29 17:42:57'),
(2, 'moderator', '2020-05-29 17:42:57', '2020-05-29 17:42:57'),
(3, 'admin', '2020-05-29 17:42:57', '2020-05-29 17:42:57'),
(4, 'doctor', '2020-05-29 17:42:57', '2020-05-29 17:42:57');
create view measurements_calculated as SELECT patients.id as patientId, MAX(measurements.createdAt) as computedAt, YEAR(measurements.createdAt) as year, MONTH(measurements.createdAt) as month, DAY(measurements.createdAt) as day, WEEK(measurements.createdAt) as week FROM `measurements` measurements inner join `patient_measurements` patient_measurements on patient_measurements.measurementId = measurements.id inner join `patients` patients on patients.id = patient_measurements.patientId where measurements.weight is NOT null group by patients.id;
create view measurements_calculated_last_week as SELECT * FROM `measurements_calculated` where computedAt >= CURDATE()-6;
create view measurements_calculated_year as SELECT * FROM `measurements_calculated` group by year ;
create view measurements_calculated_month as SELECT * FROM `measurements_calculated` group by year, month ;
create view measurements_calculated_last_7_days as SELECT * FROM `measurements_calculated` where computedAt >= CURDATE()-6;