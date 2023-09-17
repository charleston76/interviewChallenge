@IsTest
private class InvoiceScheduleTest {
    public static String execTime = '0 0 8 1/1 * ? *';

    @TestSetup
    static void makeData(){
        TestDataFactory.makeBatchData();
    }

    @IsTest
    static void testScheduledJob() {
        Test.setMock(HttpCalloutMock.class, new InvoiceMockUpTest()); 
        
        Test.startTest();
        String jobId = System.schedule('ScheduledApexTest', execTime, new InvoiceSchedule());
        Test.stopTest();
        Decimal bitcoinValue = [
            SELECT Id, BitcoinPrice__c
            FROM Invoice__c
            WHERE BitcoinPrice__c > 0
            LIMIT 1
        ]?.BitcoinPrice__c;

        Assert.areNotEqual(0, bitcoinValue);
        Assert.areNotEqual('', jobId);
    }
}