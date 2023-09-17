@isTest
global class InvoiceMockUpTest implements HttpCalloutMock {
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
        
        string strId = 'id_test' + TestDataFactory.generateRandomString(15);
        mockResp.setStatusCode(statusCode);
        String strBody = '{"time":{"updated":"Sep 16, 2023 23:13:00 UTC","updatedISO":"2023-09-16T23:13:00+00:00","updateduk":"Sep 17, 2023 at 00:13 BST"},"disclaimer":"This data was produced from the CoinDesk Bitcoin Price Index (USD). Non-USD currency data converted using hourly conversion rate from openexchangerates.org","chartName":"Bitcoin","bpi":{"USD":{"code":"USD","symbol":"&#36;","rate":"26,573.7348","description":"United States Dollar","rate_float":26573.7348},"GBP":{"code":"GBP","symbol":"&pound;","rate":"22,204.8002","description":"British Pound Sterling","rate_float":22204.8002},"EUR":{"code":"EUR","symbol":"&euro;","rate":"25,886.6974","description":"Euro","rate_float":25886.6974}}}';
        mockResp.setBody(strBody);
        return mockResp; 
    }	
}
