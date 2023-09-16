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
import MDT_CURSO  from '@salesforce/schema/Invoice__c.ContactId__c';
import MDT_CURSO  from '@salesforce/schema/Invoice__c.Price__c';
import MDT_CURSO  from '@salesforce/schema/Invoice__c.ExpirationDate__c';
import MDT_CURSO  from '@salesforce/schema/Invoice__c.Price__c';
import MDT_CURSO  from '@salesforce/schema/Invoice__c.Price__c';
import MDT_CURSO  from '@salesforce/schema/Invoice__c.Price__c';
import MDT_CURSO  from '@salesforce/schema/Invoice__c.Price__c';
import MDT_CURSO  from '@salesforce/schema/Invoice__c.Price__c';


// Contact
// OpenInvoices__c
// PastInvoices__c
// TotalAmountPaid__c

export default class customInvoice extends LightningElement {
    objectApiName = 'CustomGroupMembers__c'; //Objeto com campo lookup
    targetLkpField = 'User__c'; //Nome do campo lookup
    hasUpdateApplied = false;
    isLoading = true;
    lkpFieldReturn = '';
    showGrid = false;
    showEdit = false;
    @track groupMemberEdit = {};
    @track content = [];
    disableIcons = false;
    txtCapacidade = '';
    @api value;

    LABEL = {
        GROUP_MEMBER_ID : 'groupMemberId' , 
        USER_CONFIGURED_CAPACITY : 'Capacidade' , 
        NOME_MEMBRO : 'Nome do Membro' , 
        USER_ID : 'Usuário' , 
        IS_USER_AVAIBLE : 'Disponível'

    }
        
    objectApiName = TURMA_OBJECT;
    @api columns = [
        MDT_CURSO, 
        NUM_PARCELA,
        NAME, 
        TXT_COD_CONTROLE_TURMA,
        PKL_STATUS, 
        PKL_DIA_SEMANA, 
        DAT_INICIO, 
        DAT_TERMINO, 
        PKL_PERIODO, 
        CHK_TAXA_MATRICULA, 
        NUM_VALOR_TAXA_MATRICULA ,
        LKP_PROFISSIONAL
        //> PKL_TIPO_CALCULO_PROFISSIONAL,
        //> NUM_VALOR_TOTAL, 
        //> PER_VALOR_PROFISSIONAL,
        //> NUM_VALOR_PROFISSIONAL
        //NUM_VALOR_LIQUIDO, 
        //
    ];

    @api recordId;
    @wire(CurrentPageReference)
    getStateParameters(currentPageReference) {
        this.isLoading = true;
        if (currentPageReference) {
            this.recordId = currentPageReference.state.recordId;
            this.isLoading = false;
        }
    }

    get disableSubmit(){
        return this.txtCapacidade == '';
    }

    handleCapacidadeChange(event) {
        this.txtCapacidade = event.detail.value;
    }

    async closeQuickAction() {
        let METHOD_NAME = 'closeQuickAction';
        this.isLoading = true;
        console.log(METHOD_NAME + ' this.recordId ' + this.recordId);
        // Refresh the detail Page
        if (this.recordId){
            await updateRecord({ fields: { Id: this.recordId }})
            await notifyRecordUpdateAvailable([{recordId: this.recordId}]);
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
        let METHOD_NAME = 'loadCapacidadeGroupMembros';
        // this.lkpFieldReturn = null;
        this.isLoading = false;
        if (this.recordId){
            console.log(METHOD_NAME + ' this.recordId ' + this.recordId);
            await this.loadCapacidadeGroupMembros();
        }
        console.log(METHOD_NAME + ' this.objectApiName ' + this.objectApiName);
        console.log(METHOD_NAME + ' this.targetLkpField ' + this.targetLkpField);
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

    async loadCapacidadeGroupMembros(){
        let METHOD_NAME = 'loadCapacidadeGroupMembros';
        // console.log(METHOD_NAME);
        this.showEdit = false;
        this.loading = true;
        // this.disableSubmit = true;
        this.disableIcons = false;
        console.log(METHOD_NAME + ' recordId ', this.recordId);

        // await getCapacidadeGroupMembrosCapacidadeById({capacidadeGrupoFilaId : this.recordId})
        // .then(async result => {
        //     // console.log(METHOD_NAME + ' JSON.stringify ' + JSON.stringify(result));
        //     // console.log(METHOD_NAME + ' result ' + result.groupMembers);
            
        //     this.content = result.groupMembers;

        //     // Define if will show the grid or not
        //     this.showGrid = this.content.length > 0;

        // }).catch(error => {
        //     console.log(METHOD_NAME + ' data error ' + JSON.stringify(error));
        //     this.showLocalToast('Erro', 'error', error.body.message);
        //     this.isLoading = false;
        // });        

        this.loading = false;
        // console.log(METHOD_NAME + ' this.loading' , this.loading);
    }

    async handleSubimit(){
        let METHOD_NAME = 'handleMebroConfigurar';
        // console.log(METHOD_NAME + ' this.txtCapacidade ' + this.txtCapacidade);
        // console.log(METHOD_NAME + ' groupMemberEdit ' + JSON.stringify(this.groupMemberEdit));
        this.groupMemberEdit.userConfiguredCapacity = this.txtCapacidade;
        this.groupMemberEdit.capacidadeGrupoFilaId = this.recordId;
        // console.log(METHOD_NAME + ' groupMemberEdit ' + JSON.stringify(this.groupMemberEdit));

        this.txtCapacidade = '';

        // console.log(METHOD_NAME + ' event.detail ' , event.detail)
        this.isLoading = true;
        // console.log(METHOD_NAME + ' objGroupMember ' , objGroupMember)
        let strGroupMember = JSON.stringify(this.groupMemberEdit)
        console.log(METHOD_NAME + ' strGroupMember ' , strGroupMember)
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
        //     this.loadCapacidadeGroupMembros();
        // }).catch(error => {
        //     console.log(METHOD_NAME + ' data error ' + JSON.stringify(error));
        //     this.showLocalToast('Erro', 'error', error.body.message);
        //     this.isLoading = false;
        // });        

    }


}