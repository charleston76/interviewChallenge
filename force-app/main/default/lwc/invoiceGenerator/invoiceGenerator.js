import { LightningElement,api, track, wire } from 'lwc';
import { updateRecord, notifyRecordUpdateAvailable  } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


export default class InvoiceGenerator extends LightningElement {
    isLoading = false;
    @api recordId;
    SUCCESS = 'success';
    ERROR = 'error';
    TITLE = 'Invoice Generator';

    txtPrice=null;
    txtExpirationDate=null;
    txtSimpleDesc='';
    pastInvoices=10;
    openInvoices=2;
    totalAmountPaid='$5020.19';


    // OpenInvoices__c
    // PastInvoices__c
    // TotalAmountPaid__c

    handlePriceChange(event) {
        this.txtPrice = event.detail.value;
    }

    handleExpirationDateChange(event){
        this.txtExpirationDate = event.detail.value;
    }

    handleSimpleDescChange(event){
        this.txtSimpleDesc = event.detail.value;
    }

    handleSectionToggle(event){
        let METHOD = 'handleSectionToggle';

        console.log(METHOD + ' event.detail.openSections ' + event.detail.openSections);
    }

    handleGenerateInvoice(){
        let strMessage = '';
        let METHOD = 'handleGenerateInvoice';
        
        console.log(METHOD + ' start ');

        strMessage = this.getScreenValidation();
        console.log(METHOD + ' strMessage', strMessage);

        if ( strMessage.trim() !=''  ){
            this.setShowMessage(this.TITLE, strMessage, this.ERROR);
            return;
        }

        this.setShowMessage(this.TITLE, 'Invoice generated successfully', this.SUCCESS);



    }
    // async connectedCallback() {
    //     let METHOD_NAME = 'connectedCallback';

    //     console.log(METHOD_NAME + ' this.recordId ' + this.recordId);
    // }
    getScreenValidation(){
        let METHOD = 'getScreenValidation';
        let strReturn = '';
        let mandatoryMessage = 'is a mandatory field!' 

        console.log(METHOD + ' start ');

        if (strReturn == '' && (! this.txtPrice || this.txtPrice == null || this.txtPrice == '' )){
            this.template.querySelector('[data-id="txtPrice"]').focus();
            strReturn = 'Price' + mandatoryMessage;
        }

        if (strReturn == '' && (! this.txtExpirationDate || this.txtExpirationDate == null || this.txtExpirationDate == '' )){
            this.template.querySelector('[data-id="txtExpirationDate"]').focus();
            strReturn = 'Expiration Date' + mandatoryMessage;
        }

        console.log(METHOD + ' strReturn ' + strReturn);

        return strReturn;
    }

    setShowMessage(strTitle, strMessage, strVariant){
        const toastEvt = new ShowToastEvent({
            title: strTitle,
            message: strMessage,
            variant: strVariant,
            mode: 'dismissable'
        });
        this.dispatchEvent(toastEvt);
    }

}