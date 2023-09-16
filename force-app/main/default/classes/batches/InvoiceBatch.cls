global class InvoiceBatch implements Database.Batchable<sObject>, Database.Stateful, Database.AllowsCallouts {
    
    // Total de registros processados
    global Integer intTotalRegistros = 0;
    global Decimal bitcoinValue = 0;
    global Database.QueryLocator start(Database.BatchableContext bc) {
        String queryData = 'SELECT Id, ExpirationDate__c ';
        queryData += 'FROM Invoice__c ';
        queryData += 'WHERE Status__c = \'Open\'';
        
        return Database.getQueryLocator(queryData);
    }
    global void execute(Database.BatchableContext bc, List<Invoice__c> scope){
        Set<String> expiredId = new Set<String>();
        Set<String> updateId = new Set<String>();
        Date todayDate = Date.today();

        if (bitcoinValue ==0) bitcoinValue = InvoiceHelper.getDecimalBitcoinValue();

        for (Invoice__c rowData : scope) {
            if (rowData.ExpirationDate__c < todayDate){
                // system.debug('Expired ');
                expiredId.add(rowData.Id);
            } else {
                // system.debug('Update');
                updateId.add(rowData.Id);
            }        
        }

        intTotalRegistros += expiredId.size() + updateId.size();
        // Update the records
        if (updateId.size()>0 || expiredId.size()>0 ) InvoiceHelper.setBitcoinValues(updateId, expiredId, bitcoinValue);

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