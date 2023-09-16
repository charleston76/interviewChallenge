public with sharing class InvoiceController {
    @AuraEnabled
    public static InvoiceHelper.ContactInformation getContactInformationById(String contactId){
        return InvoiceHelper.getContactInformationById(contactId);
    }
}