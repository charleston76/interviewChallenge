@isTest
public class TestDataFactory {

    public static void makeSingleData(){
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

        Invoice__c objInvoice = new Invoice__c(
            ContactId__c = objContact.Id,
            BitcoinPrice__c = 0,
            ExpirationDate__c = System.today(),
            Price__c = 1000
        );

        insert objInvoice;

    }

    public static void makeBatchData(){
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
}