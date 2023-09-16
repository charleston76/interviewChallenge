public with sharing class InvoiceHelper {
    private static string CLASS_NAME = 'InvoiceHelper';

    @Future(callout=true)
    public static void setBitcoinValue(String invoiceId){
        String METHOD_NAME = 'setBitcoinValue';

        try {            
            Decimal bitcoinValue = getDecimalBitcoinValue();
            // Select the invoice record to update
            Invoice__c objInvoice = [
                SELECT Id, BitcoinPrice__c, Price__c 
                FROM Invoice__c
                WHERE Id =: invoiceId
            ];
            objInvoice.BitcoinPrice__c = objInvoice.Price__c / bitcoinValue;
            
            update objInvoice;
        } catch (Exception objEx) { throw objEx;}

    }

    public static Decimal getDecimalBitcoinValue(){
        String METHOD_NAME = 'getDecimalBitcoinValue';
        Decimal returnValue = 0;

        try {
            Map<String, Object> bitcoinMap = sendRequest();
            Map<String, Object> mapBpi = getMapValue(bitcoinMap,'bpi');
            bpi objBitcoin = (bpi) System.JSON.deserialize(JSON.serialize(mapBpi), bpi.class);
            returnValue = objBitcoin.USD.rate_float;
                
        } catch (Exception objEx) { throw objEx;}
        
        return returnValue;
    }

    private static Map<String, Object> getMapValue(Map<String, Object> mapOrigin, String value){
        return (Map<String, Object>) mapOrigin.get(value);
    }

    private static Map<String, Object> sendRequest(){
        String METHOD_NAME = 'sendRequest';
        Http objHttp = new Http();
        HttpRequest objReq = new HttpRequest();
        HttpResponse objResp;
        
        try {
            // In a real scenario, probably we would use a named credential instead 
            String endPoint = 'https://api.coindesk.com/v1/bpi/currentprice.json';
            // system.debug(CLASS_NAME + ' ' + METHOD_NAME + ' endPoint ' + endPoint);

            objReq.setMethod('GET');
            objReq.setEndpoint(endPoint );
            // system.debug(CLASS_NAME + ' ' + METHOD_NAME + ' objReq ' + objReq);
            objResp = objHttp.send(objReq);
            // system.debug(CLASS_NAME + ' ' + METHOD_NAME + ' objResp.getBody ' + JSON.serialize(objResp.getBody()));
            // system.debug(CLASS_NAME + ' ' + METHOD_NAME + ' getStatusCode ' + objResp.getStatusCode());            
        } catch (Exception objEx) { throw objEx;}
        
        return (Map<String, Object>) JSON.deserializeUntyped(objResp.getBody());
    }

    public class bpi{
        ConvertedMoney USD = new ConvertedMoney();
        ConvertedMoney GBP = new ConvertedMoney();
        ConvertedMoney EUR = new ConvertedMoney();
    }

    public class ConvertedMoney {
        public string code ='';
        public string description ='';
        public Decimal rate_float=0;
    }

}