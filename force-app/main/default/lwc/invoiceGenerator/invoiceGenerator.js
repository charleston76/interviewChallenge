import { LightningElement,api, track, wire } from 'lwc';
import {  getRecord, getFieldValue, updateRecord, notifyRecordUpdateAvailable  } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import {CurrentPageReference} from 'lightning/navigation';

import NAME_FIELD from "@salesforce/schema/Contact.Name";
import OPEN_INVOICES from "@salesforce/schema/Contact.OpenInvoices__c";
import PAST_INVOICES from "@salesforce/schema/Contact.PastInvoices__c";
import TOTAL_AMOUNT_PAID from "@salesforce/schema/Contact.TotalAmountPaid__c";

export default class InvoiceGenerator extends LightningElement {
    contactId;
    contactFields;
    isLoading = false;
    SUCCESS = 'success';
    ERROR = 'error';
    TITLE = 'Invoice Generator';
    txtPrice=null;
    txtExpirationDate=null;
    txtSimpleDesc=null;
    contacInfo = {};
    _pastInvoices=0;
    _openInvoices=0;
    _totalAmountPaid=0;

    @wire(CurrentPageReference)
    getStateParameters(currentPageReference) {
      let METHOD_NAME='getStateParameters';
        if (currentPageReference) {
            this.contactId = currentPageReference.attributes.recordId;
            this.contactFields = [NAME_FIELD, OPEN_INVOICES, PAST_INVOICES, TOTAL_AMOUNT_PAID];
        }
        console.log(METHOD_NAME + ' this.contactFields ' + this.contactFields);
        console.log(METHOD_NAME + ' this.contactId ' + this.contactId);
    }


    @wire(getRecord, {
        recordId: '$contactId',
        fields: '$contactFields'
      })
      wiredRecord({ error, data }) {
        console.log(' wiredRecord start');
        if (error) {
          console.log(' wiredRecord error', error);
          let message = "Unknown error";
          if (Array.isArray(error.body)) {
            message = error.body.map((e) => e.message).join(", ");
          } else if (typeof error.body.message === "string") {
            message = error.body.message;
          }
          this.setShowMessage(this.TITLE, message, this.ERROR);
        } else if (data) {
          console.log(' wiredRecord data', data);
          console.log(' wiredRecord JSON data', JSON.stringify(data));
          this._pastInvoices = data.fields.PastInvoices__c.value;
          this._openInvoices = data.fields.OpenInvoices__c.value;
          this._totalAmountPaid = data.fields.TotalAmountPaid__c.value;
          this.contacInfo = data;
          console.log(' wiredRecord contacInfo', this.contacInfo);
          // this.name = this.contact.fields.Name.value;
          // this.phone = this.contact.fields.Phone.value;
        }
      }

      get pastInvoices() {
        let METHOD_NAME = 'pastInvoices';
        console.log(METHOD_NAME + ' this._pastInvoices ' + this._pastInvoices);
        return this._pastInvoices;
      }

      get openInvoices() {
        let METHOD_NAME = 'pastInvoices';
        console.log(METHOD_NAME + ' this._openInvoices ' + this._openInvoices);
        return this._openInvoices;
      }

      get totalAmountPaid() {
        let METHOD_NAME = 'totalAmountPaid';
        console.log(METHOD_NAME + ' this._totalAmountPaid ' + this._totalAmountPaid);
        return this._totalAmountPaid;
      }

      get hasAdditionalInformation(){
        let METHOD_NAME = 'hasAdditionalInformation';
        console.log(METHOD_NAME + ' this.totalAmountPaid ' + this.totalAmountPaid);
        console.log(METHOD_NAME + ' this.pastInvoices ' + this.pastInvoices);
        console.log(METHOD_NAME + ' this.openInvoices ' + this.openInvoices);
        
        return this.pastInvoices > 0;
      }

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
        let mandatoryMessage = ' is a mandatory field!' 

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