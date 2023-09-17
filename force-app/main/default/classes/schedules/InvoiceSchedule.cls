global class InvoiceSchedule implements Schedulable{
    global void execute(SchedulableContext sc){
        InvoiceBatch b = new InvoiceBatch();
        database.executeBatch(b);
    }
}