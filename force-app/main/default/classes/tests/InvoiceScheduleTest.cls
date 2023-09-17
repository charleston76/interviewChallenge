@IsTest
private class InvoiceScheduleTest {
    public static String execTime = '0 0 8 1/1 * ? *';


    @IsTest
    static void testScheduledJob() {
        Test.startTest();
        String jobId = System.schedule('ScheduledApexTest', execTime, new InvoiceSchedule());
        Test.stopTest();

        Assert.areNotEqual('', jobId);
    }
}