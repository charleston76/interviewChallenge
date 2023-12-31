import {LightningElement, wire } from 'lwc';
import {getRecord, createRecord , updateRecord} from 'lightning/uiRecordApi';
import {ShowToastEvent } from 'lightning/platformShowToastEvent';
import {CurrentPageReference} from 'lightning/navigation';
import OPEN_INVOICES from "@salesforce/schema/Contact.OpenInvoices__c";
import PAST_INVOICES from "@salesforce/schema/Contact.PastInvoices__c";
import TOTAL_AMOUNT_PAID from "@salesforce/schema/Contact.TotalAmountPaid__c";
import setBitcoinValue from '@salesforce/apex/InvoiceController.setBitcoinValue';

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
    _pastInvoices=0;
    _openInvoices=0;
    _totalAmountPaid=0;

    @wire(CurrentPageReference)
    getStateParameters(currentPageReference) {
        if (currentPageReference) {
            this.contactId = currentPageReference.attributes.recordId;
            this.contactFields = [OPEN_INVOICES, PAST_INVOICES, TOTAL_AMOUNT_PAID];
        }
    }

    @wire(getRecord, {
        recordId: '$contactId',
        fields: '$contactFields'
      })
      wiredRecord({ error, data }) {
        if (error) {
          // console.log(' wiredRecord error', error);
          let message = "Unknown error";
          if (Array.isArray(error.body)) {
            message = error.body.map((e) => e.message).join(", ");
          } else if (typeof error.body.message === "string") {
            message = error.body.message;
          }
          this.setShowMessage(this.TITLE, message, this.ERROR);
        } else if (data) {
          this._pastInvoices = data.fields.PastInvoices__c.value;
          this._openInvoices = data.fields.OpenInvoices__c.value;
          this._totalAmountPaid = data.fields.TotalAmountPaid__c.value;
        }
      }

      get pastInvoices() {
        return this._pastInvoices;
      }

      get openInvoices() {
        return this._openInvoices;
      }

      get totalAmountPaid() {
        // Apply USD using the locale, style, and currency.
        let USDollar = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        });
        // this._totalAmountPaid.toFixed(2);
        return USDollar.format(this._totalAmountPaid);
      }

      get hasAdditionalInformation(){
        return this.pastInvoices > 0;
      }

    get isDisableGenerate(){
      return this.txtPrice == null ||this.txtPrice == '' ||  this.txtPrice < 1 || this.txtExpirationDate ==null ||  this.txtExpirationDate == '';
    }

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
      // Doing nothing here
      console.log(METHOD + ' event.detail.openSections ' + event.detail.openSections);
    }

    handleGenerateInvoice(){
      let METHOD = 'handleGenerateInvoice';
      let strMessage = '';
      this.isLoading = true;
      strMessage = this.getScreenValidation();

      if ( strMessage.trim() !=''  ){
        this.isLoading = false;
          this.setShowMessage(this.TITLE, strMessage, this.ERROR);
          return;
      }

      const fields = {
        ContactId__c : this.contactId,
        BitcoinPrice__c : 0,
        ExpirationDate__c: this.txtExpirationDate,
        SimpleDescription__c : this.txtSimpleDesc,
        Price__c : this.txtPrice
      };
      const recordInput = { apiName: 'Invoice__c', fields };

      createRecord(recordInput)
      .then((result) => {
        // console.log(METHOD + ' result', result);
        this.txtExpirationDate = null;
        this.txtSimpleDesc = null;
        this.txtPrice = null;
        this.updateBitcoinValue(result.id);
        
      }).then(() => {
        this.setShowMessage(this.TITLE, 'Invoice generated successfully', this.SUCCESS);
      }).catch((error) => {
        console.log(METHOD + ' error', error);
        this.setShowMessage(this.TITLE, error.body.message, this.ERROR);
      }).finally(() => {
        this.isLoading = false;
        this.updateDetailPage();
      });
    }

    async updateDetailPage(){
      let METHOD = 'updateDetailPage';
        if (this.contactId){
          await updateRecord({ fields: { Id: this.contactId }})
      }
    }

    updateBitcoinValue(invoiceId){
      let METHOD_NAME = 'updateBitcoinValue';
      // console.log(METHOD_NAME + ' invoiceId ' + invoiceId);
      
      setBitcoinValue({invoiceId})
      .then(() => {
          // console.log(METHOD_NAME + ' setBitcoinValue ');
      }).catch(error => {
          console.log(METHOD_NAME + ' data error ' + JSON.stringify(error));
          this.showLocalToast('Erro', 'error', error.body.message);
          this.isLoading = false;
      });        

  }
  

    getScreenValidation(){
      let strReturn = '';
      let mandatoryMessage = ' is a mandatory field!' 

      if (strReturn == '' && (! this.txtPrice || this.txtPrice == null || this.txtPrice == '' )){
          this.template.querySelector('[data-id="txtPrice"]').focus();
          strReturn = 'Price' + mandatoryMessage;
      }

      if (strReturn == '' && (! this.txtExpirationDate || this.txtExpirationDate == null || this.txtExpirationDate == '' )){
          this.template.querySelector('[data-id="txtExpirationDate"]').focus();
          strReturn = 'Expiration Date' + mandatoryMessage;
      }

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