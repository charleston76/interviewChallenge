@isTest
global class InvoiceBatchTest{
    @TestSetup
    static void makeData(){
        TestDataFactory.makeBatchData();
    }

    @isTest static void batchTest() {        
        Test.setMock(HttpCalloutMock.class, new InvoiceMockUpTest()); 

        Test.startTest();
        InvoiceBatch objBatch = new InvoiceBatch();
        Id batchId = Database.executeBatch(objBatch);
        Test.stopTest();
        // after the testing stops, assert records were updated properly

        Decimal bitcoinValue = [
            SELECT Id, BitcoinPrice__c
            FROM Invoice__c
            WHERE BitcoinPrice__c > 0
            LIMIT 1
        ]?.BitcoinPrice__c;

        InvoiceHelper.bpi objIns = new InvoiceHelper.bpi();

        Assert.areNotEqual(0, bitcoinValue);

    }
}