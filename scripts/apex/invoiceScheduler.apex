InvoiceSchedule objSchedule = new InvoiceSchedule();
// Seconds Minutes Hours Day_of_month Month Day_of_week optional_year
String execTime = '0 0 8 1/1 * ? *';
String jobID = System.schedule('Invoice updates', execTime, objSchedule);