global class InvoiceBatch implements Database.Batchable<sObject>, Database.Stateful, Database.AllowsCallouts {
    // Total de registros processados
    global Integer intTotalRegistros = 0;
    global Decimal bitcoinValue = 0;
    global Database.QueryLocator start(Database.BatchableContext bc) {
        String queryData = 'SELECT Id, ExpirationDate__c, BitcoinPrice__c, Price__c , Status__c ';
        queryData += 'FROM Invoice__c ';
        queryData += 'WHERE Status__c = \'Open\'';
        
        return Database.getQueryLocator(queryData);
    }
    global void execute(Database.BatchableContext bc, List<Invoice__c> scope){
        List<Invoice__c> objUpdateData = new List<Invoice__c>();
        List<Invoice__c> objExpired = new List<Invoice__c>();
        Date todayDate = Date.today();

        if (bitcoinValue ==0) bitcoinValue = InvoiceHelper.getDecimalBitcoinValue();

        for (Invoice__c rowData : scope) {
            if (rowData.ExpirationDate__c < todayDate){
                // system.debug('Expired ');
                rowData.Status__c = 'Expired';
                objExpired.add(rowData);
            } else {
                // system.debug('Update');
                rowData.BitcoinPrice__c = rowData.Price__c / bitcoinValue;
                objUpdateData.add(rowData);
            }        
        }

        intTotalRegistros += objExpired.size() + objUpdateData.size();
        // Update the records
        if (objUpdateData.size()>0 ) update objUpdateData;
        if (objExpired.size()>0 ) update objExpired;
    }    
    global void finish(Database.BatchableContext bc){
        AsyncApexJob job = [SELECT Id, Status, NumberOfErrors, 
            JobItemsProcessed,
            TotalJobItems, CreatedBy.Email
            FROM AsyncApexJob
            WHERE Id = :bc.getJobId()];
        // call some utility to send email
        //EmailUtils.sendMessage(job, intTotalRegistros);
        System.debug('Total records processed: ' + intTotalRegistros + ' job information ' + job);
    }    
}