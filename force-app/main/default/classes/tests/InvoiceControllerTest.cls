@isTest
global class InvoiceControllerTest {
    @TestSetup
    static void makeData(){
        TestDataFactory.makeSingleData();
    }


    @isTest static void setBitcoinValueTest(){
        Test.setMock(HttpCalloutMock.class, new InvoiceMockUpTest()); 
        String invoiceId = String.valueOf([
            SELECT Id
            FROM Invoice__c
            LIMIT 1
        ]?.Id);

        Test.startTest();
        InvoiceController.setBitcoinValue(invoiceId);
        Test.stopTest();
        Decimal bitcoinValue = [
            SELECT Id, BitcoinPrice__c
            FROM Invoice__c
            WHERE Id =:invoiceId
            LIMIT 1
        ]?.BitcoinPrice__c;

        InvoiceHelper.bpi objIns = new InvoiceHelper.bpi();

        Assert.areNotEqual(0, bitcoinValue);
    }
}