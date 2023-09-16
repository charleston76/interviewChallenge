public with sharing class InvoiceController {
    @AuraEnabled
    public static void setBitcoinValue(String invoiceId){
        InvoiceHelper.setBitcoinValue(invoiceId);
    }
}