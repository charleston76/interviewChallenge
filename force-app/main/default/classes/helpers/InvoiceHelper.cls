public with sharing class InvoiceHelper {
    private static string CLASS_NAME = 'InvoiceHelper';

    public static ContactInformation getContactInformationById(String contactId){
        string METHOD_NAME = 'getContactInformationById';
        ContactInformation objFound;

        try {
            Contact rowContact = [
                SELECT Id, OpenInvoices__c, PastInvoices__c, TotalAmountPaid__c
                FROM Contact
                WHERE Id = :contactId
            ];

            Integer numberAllPastInvoices = rowContact?.PastInvoices__c == null ? 0 : Integer.valueOf(rowContact?.PastInvoices__c) ;
            Integer numberOpenPastInvoices = rowContact?.OpenInvoices__c == null ? 0 : Integer.valueOf(rowContact?.OpenInvoices__c) ;
            Decimal totalAmountPaid = rowContact?.TotalAmountPaid__c == null ? 0 : rowContact?.TotalAmountPaid__c ;

            objFound = new ContactInformation(contactId, numberAllPastInvoices, numberOpenPastInvoices, totalAmountPaid);
            
        } catch (Exception objEx) { 
          string strMessage = CLASS_NAME + ' - ' + METHOD_NAME + ' - Error line ' + objEx.getLineNumber() + ' - Type ' + objEx.getTypeName() + ' - Message  ' + objEx.getMessage();
          System.debug( strMessage);
          throw new AuraHandledException(strMessage);
        }

        return objFound;

    }



    public class ContactInformation{
        @AuraEnabled
        public String contactId = '';
        @AuraEnabled
        public Integer numberAllPastInvoices = 0;
        @AuraEnabled
        public Integer numberOpenPastInvoices = 0;
        @AuraEnabled
        public Decimal totalAmountPaid = 0;

        public ContactInformation(){}
        public ContactInformation(String contactId, Integer numberAllPastInvoices, Integer numberOpenPastInvoices, Decimal totalAmountPaid){
            this.contactId = contactId;
            this.numberAllPastInvoices = numberAllPastInvoices;
            this.numberOpenPastInvoices = numberOpenPastInvoices;
            this.totalAmountPaid = totalAmountPaid;
        }

    }

    public class DMLResult{
        @AuraEnabled
        public Boolean isSuccess = false;
        @AuraEnabled
        public String dmlMessage='';
        
        public DMLResult(){}
        public DMLResult(Boolean isSuccess, String dmlMessage){
          this.isSuccess = isSuccess;
          this.dmlMessage = dmlMessage;
        }
      }
}