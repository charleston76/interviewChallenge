@isTest
global class InvoiceBatchTest{
    @TestSetup
    static void makeData(){
        Account objAccount = new Account(
            Name = 'Testing ' + generateRandomString(10)
        );

        insert objAccount;

        Contact objContact = new Contact(
            AccountId = objAccount.id,
            FirstName = 'Test' + generateRandomString(10),
            LastName = 'Contact'

        );

        insert objContact;

        List<Invoice__c> lstInvoice = new List<Invoice__c>();

        // Inserts 101 rows
        for (Integer i=0;i<10;i++) {
            lstInvoice.add(
                new Invoice__c (
                    ContactId__c = objContact.Id,
                    BitcoinPrice__c = 0,
                    ExpirationDate__c = System.today(),
                    Price__c = 1000 + i
                )
            );
        }

        // Create an expired one
        lstInvoice.add(
            new Invoice__c (
                ContactId__c = objContact.Id,
                BitcoinPrice__c = 0,
                ExpirationDate__c = System.today() - 5,
                Price__c = 5000000
            )
        );


        insert lstInvoice;
    }

    public static String generateRandomString(Integer lengthOfString) {
        final String chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';
        String randStr = '';
        while (randStr.length() < lengthOfString) {
            Integer idx = Math.mod(Math.abs(Crypto.getRandomInteger()), chars.length());
            randStr += chars.substring(idx, idx+1);
        }
        return randStr; 
    }

    @isTest static void batchTest() {        
        Test.setMock(HttpCalloutMock.class, new InvoiceControllerMockTest()); 

        Test.startTest();
        InvoiceBatch objBatch = new InvoiceBatch();
        Id batchId = Database.executeBatch(objBatch);
        Test.stopTest();
        // after the testing stops, assert records were updated properly

        Decimal bitcoinValue = [
            SELECT Id, BitcoinPrice__c
            FROM Invoice__c
            LIMIT 1
        ]?.BitcoinPrice__c;

        InvoiceHelper.bpi objIns = new InvoiceHelper.bpi();

        Assert.areNotEqual(0, bitcoinValue);

    }    

	global class InvoiceControllerMockTest implements HttpCalloutMock {
		global HTTPResponse respond(HTTPRequest objReq) {
            Integer statusCode = 0;
			// Create a fake response
			HttpResponse mockResp = new HttpResponse();
			mockResp.setHeader('Content-Type', 'application/json');
            if (objReq.getMethod() == 'PATCH') statusCode = 201;
			if (objReq.getMethod() == 'POST') statusCode = 201;
			if (objReq.getMethod() == 'GET') statusCode = 200;
			if (objReq.getMethod() == 'PUT') statusCode = 203;
            if (objReq.getMethod() == 'DELETE') statusCode = 204;
            
            string strId = 'id_test' + InvoiceControllerTest.generateRandomString(15);
            mockResp.setStatusCode(statusCode);
            String strBody = '{"time":{"updated":"Sep 16, 2023 23:13:00 UTC","updatedISO":"2023-09-16T23:13:00+00:00","updateduk":"Sep 17, 2023 at 00:13 BST"},"disclaimer":"This data was produced from the CoinDesk Bitcoin Price Index (USD). Non-USD currency data converted using hourly conversion rate from openexchangerates.org","chartName":"Bitcoin","bpi":{"USD":{"code":"USD","symbol":"&#36;","rate":"26,573.7348","description":"United States Dollar","rate_float":26573.7348},"GBP":{"code":"GBP","symbol":"&pound;","rate":"22,204.8002","description":"British Pound Sterling","rate_float":22204.8002},"EUR":{"code":"EUR","symbol":"&euro;","rate":"25,886.6974","description":"Euro","rate_float":25886.6974}}}';
            mockResp.setBody(strBody);
			return mockResp; 
		}	
	}
}