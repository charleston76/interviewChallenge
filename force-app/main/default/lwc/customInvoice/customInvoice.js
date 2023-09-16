// Resize the quiaction
// https://www.salesforcebolt.com/2021/08/increase-size-width-of-lightning-web.html

import { LightningElement,api, track, wire } from 'lwc';
import { CloseActionScreenEvent } from 'lightning/actions';
import { updateRecord, notifyRecordUpdateAvailable  } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import {CurrentPageReference} from 'lightning/navigation';
// import getCapacidadeGroupMembrosCapacidadeById from '@salesforce/apex/CapacidadeGrupoController.getCapacidadeGroupMembrosCapacidadeById';
// import setIncluirGroupMembro from '@salesforce/apex/CapacidadeGrupoController.setIncluirGroupMembro';
// import setExcluirGroupMembro from '@salesforce/apex/CapacidadeGrupoController.setExcluirGroupMembro';
// import getCapacidadeGroupMembrosByMemberId from '@salesforce/apex/CapacidadeGrupoController.getCapacidadeGroupMembrosByMemberId';
// import setEditarGroupMembro from '@salesforce/apex/CapacidadeGrupoController.setEditarGroupMembro';
import INVOICE_OBJECT from '@salesforce/schema/Invoice__c';
import CONTACT_ID  from '@salesforce/schema/Invoice__c.ContactId__c';
import PRICE from '@salesforce/schema/Invoice__c.Price__c';
import EXPIRATION_DATE  from '@salesforce/schema/Invoice__c.ExpirationDate__c';
import SIMPLE_DESCRIPTION  from '@salesforce/schema/Invoice__c.SimpleDescription__c';
// Contact
// OpenInvoices__c
// PastInvoices__c
// TotalAmountPaid__c

export default class customInvoice extends LightningElement {
    hasUpdateApplied = false;
    isLoading = true;
    hasAdditionalInformation=false;
    @track content = [];
    
    objectApiName = INVOICE_OBJECT;
    @api columns = [
        CONTACT_ID,
        PRICE,
        EXPIRATION_DATE,
        SIMPLE_DESCRIPTION
    ];

    @api contactId;
    @wire(CurrentPageReference)
    getStateParameters(currentPageReference) {
        this.isLoading = true;
        if (currentPageReference) {
            this.contactId = currentPageReference.state.recordId;
            this.isLoading = false;
        }
    }

    get disableSubmit(){
        return true;
    }


    async closeQuickAction() {
        let METHOD_NAME = 'closeQuickAction';
        this.isLoading = true;
        console.log(METHOD_NAME + ' this.contactId ' + this.contactId);
        // Refresh the detail Page
        if (this.contactId){
            await updateRecord({ fields: { Id: this.contactId }})
            await notifyRecordUpdateAvailable([{recordId: this.contactId}]);
        }
        this.isLoading = false;
        // await this.dispatchEvent(new RefreshEvent());
        // console.log(METHOD_NAME + ' CloseActionScreenEvent ');
        this.dispatchEvent(new CloseActionScreenEvent());
        // Since the related list is in the same visualization, just this reload can refresh the page like a F5 key press
        if (this.hasUpdateApplied){
            window.location.reload();
        }
        
    }

    async connectedCallback() {
        let METHOD_NAME = 'connectedCallback';
        this.isLoading = false;
        if (this.contactId){
            console.log(METHOD_NAME + ' this.contactId ' + this.contactId);
            // await this.loadMoreContactInformation();
        }
        console.log(METHOD_NAME + ' this.objectApiName ' + this.objectApiName);
    }

    async disconnectedCallback() {
        this.closeQuickAction();
    }

    showLocalToast(title, variant, message) {
        const event = new ShowToastEvent({
            title: title,
            variant: variant,
            message: message,
            mode: 'dismissable'
        });
        this.dispatchEvent(event);
    }

    async loadMoreContactInformation(){
        let METHOD_NAME = 'loadMoreContactInformation';
        // console.log(METHOD_NAME);
        this.loading = true;
        console.log(METHOD_NAME + ' recordId ', this.recordId);

        // await getCapacidadeGroupMembrosCapacidadeById({capacidadeGrupoFilaId : this.recordId})
        // .then(async result => {
        //     // console.log(METHOD_NAME + ' JSON.stringify ' + JSON.stringify(result));
        //     // console.log(METHOD_NAME + ' result ' + result.groupMembers);
            
        //     this.content = result.groupMembers;

        //     // Define if will show the grid or not

        // }).catch(error => {
        //     console.log(METHOD_NAME + ' data error ' + JSON.stringify(error));
        //     this.showLocalToast('Erro', 'error', error.body.message);
        //     this.isLoading = false;
        // });        

        this.loading = false;
        // console.log(METHOD_NAME + ' this.loading' , this.loading);
    }

    handleSave(event){
        this.isLoading = true;
        event.preventDefault(); // stop the form from submitting

        // let blnSubimt = false;
        let strMessage = '';

        const fields = event.detail.fields;

        console.log(JSON.stringify(fields));
        // strMessage = this.TITLE + ': ' + fields.Name;

        // // if (blnSubimt){
        //     this.template.querySelector('lightning-record-form').submit(fields);
        //     //this.setShowMessage(this.TITLE, strMessage, 'success');
        // // }
        this.isLoading = false;
    }

    async handleSubimit(){
        let METHOD_NAME = 'handleMebroConfigurar';
        
        // console.log(METHOD_NAME + ' event.detail ' , event.detail)
        this.isLoading = true;
        // console.log(METHOD_NAME + ' objGroupMember ' , objGroupMember)
        // await setEditarGroupMembro({strGroupMember})
        // .then(async result => {
        //     console.log(METHOD_NAME + ' result ' + result);
            
        //     if (result.isSuccess){
        //         this.isLoading = false;
        //         this.showLocalToast('Sucesso', 'success', result.dmlMessage);
        //     } else {
        //         this.isLoading = false;
        //         console.log(METHOD_NAME + ' data error ' + result.dmlMessage);
        //         this.showLocalToast('Erro', 'error', result.dmlMessage);
        //     }
        //     return result;
        // }).then( async result => {
        //     this.loadMoreContactInformation();
        // }).catch(error => {
        //     console.log(METHOD_NAME + ' data error ' + JSON.stringify(error));
        //     this.showLocalToast('Erro', 'error', error.body.message);
        //     this.isLoading = false;
        // });        

    }


}