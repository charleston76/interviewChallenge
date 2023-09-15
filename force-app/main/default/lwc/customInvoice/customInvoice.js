import { LightningElement,api, track, wire } from 'lwc';
import { CloseActionScreenEvent } from 'lightning/actions';
import { updateRecord, notifyRecordUpdateAvailable  } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import {CurrentPageReference} from 'lightning/navigation';
import getCapacidadeGroupMembrosCapacidadeById from '@salesforce/apex/CapacidadeGrupoController.getCapacidadeGroupMembrosCapacidadeById';
import setIncluirGroupMembro from '@salesforce/apex/CapacidadeGrupoController.setIncluirGroupMembro';
import setExcluirGroupMembro from '@salesforce/apex/CapacidadeGrupoController.setExcluirGroupMembro';
import getCapacidadeGroupMembrosByMemberId from '@salesforce/apex/CapacidadeGrupoController.getCapacidadeGroupMembrosByMemberId';
import setEditarGroupMembro from '@salesforce/apex/CapacidadeGrupoController.setEditarGroupMembro';


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
        
    columns = [
        { "label": this.LABEL.NOME_MEMBRO , "source": "nomeMembro" },
        // { "label": this.LABEL.USER_CONFIGURED_CAPACITY , "source": "userConfiguredCapacity" , detail: true },
        { "label": this.LABEL.USER_CONFIGURED_CAPACITY , "source": "userConfiguredCapacity" },
        { "label": this.LABEL.IS_USER_AVAIBLE , "source": "isUserAvaible" },
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

    async handleChangeLookup(event) {
        this.isLoading = true;
        this.lkpFieldReturn = event.detail.value;
        console.log('this.lkpFieldReturn ' + this.lkpFieldReturn);
        console.log('this.lkpFieldReturn[0] ' + this.lkpFieldReturn[0]);
        if (this.lkpFieldReturn && this.lkpFieldReturn[0] != null ){
            await this.handleMebroIncluir(this.lkpFieldReturn[0]);
            await this.loadCapacidadeGroupMembros();
            this.lkpFieldReturn = null;
            this.value = null;
            this.template.querySelector('lightning-input-field').reset();
        }
        this.isLoading = false;
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

        await getCapacidadeGroupMembrosCapacidadeById({capacidadeGrupoFilaId : this.recordId})
        .then(async result => {
            // console.log(METHOD_NAME + ' JSON.stringify ' + JSON.stringify(result));
            // console.log(METHOD_NAME + ' result ' + result.groupMembers);
            
            this.content = result.groupMembers;

            // Define if will show the grid or not
            this.showGrid = this.content.length > 0;

        }).catch(error => {
            console.log(METHOD_NAME + ' data error ' + JSON.stringify(error));
            this.showLocalToast('Erro', 'error', error.body.message);
            this.isLoading = false;
        });        

        this.loading = false;
        // console.log(METHOD_NAME + ' this.loading' , this.loading);
    }


    async handleMebroIncluir(userId) {
        let METHOD_NAME = 'handleMebroIncluir';
        // console.log(METHOD_NAME + ' event.detail ' , event.detail)
        this.hasUpdateApplied = true;
        console.log(METHOD_NAME + ' userId ' , userId)
        let groupMember = {
            capacidadeGrupoFilaId : this.recordId,
            userId : userId,
            userConfiguredCapacity : 1,
            isUserAvaible : false
        }

        // console.log(METHOD_NAME + ' groupMember ' , groupMember)

        let strGroupMember = JSON.stringify(groupMember);
         console.log(METHOD_NAME + ' strGroupMember ' , strGroupMember)

        await setIncluirGroupMembro({strGroupMember})
        .then(async result => {
            console.log(METHOD_NAME + ' result ' + result);
            
            if (result.isSuccess){
                this.isLoading = false;
                this.showLocalToast('Sucesso', 'success', result.dmlMessage);
            } else {
                this.isLoading = false;
                console.log(METHOD_NAME + ' data error ' + result.dmlMessage);
                this.showLocalToast('Erro', 'error', result.dmlMessage);
            }
        }).catch(error => {
            console.log(METHOD_NAME + ' data error ' + JSON.stringify(error));
            this.showLocalToast('Erro', 'error', error.body.message);
            this.isLoading = false;
        });        

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
        await setEditarGroupMembro({strGroupMember})
        .then(async result => {
            console.log(METHOD_NAME + ' result ' + result);
            
            if (result.isSuccess){
                this.isLoading = false;
                this.showLocalToast('Sucesso', 'success', result.dmlMessage);
            } else {
                this.isLoading = false;
                console.log(METHOD_NAME + ' data error ' + result.dmlMessage);
                this.showLocalToast('Erro', 'error', result.dmlMessage);
            }
            return result;
        }).then( async result => {
            this.loadCapacidadeGroupMembros();
        }).catch(error => {
            console.log(METHOD_NAME + ' data error ' + JSON.stringify(error));
            this.showLocalToast('Erro', 'error', error.body.message);
            this.isLoading = false;
        });        

    }

    async handleMebroConfigurar(event) {
        this.hasUpdateApplied = true;
        let METHOD_NAME = 'handleMebroConfigurar';
        
        this.groupMemberEdit = {};
        this.showGrid = false;
        this.showEdit = false;
        // this.disableSubmit = false;
        this.disableIcons = true;
        // console.log(METHOD_NAME + ' event.detail ' , event.detail)
        this.isLoading = true;
        let groupMember = event.detail;
        // console.log(METHOD_NAME + ' groupMember ' , groupMember)
        await getCapacidadeGroupMembrosByMemberId({capacidadeGrupoFilaId : this.recordId, groupMemberId : groupMember})
        .then(async result => {
            // console.log(METHOD_NAME + ' JSON.stringify ' + JSON.stringify(result));
            // console.log(METHOD_NAME + ' result ' + result.groupMembers);
            
            this.content = result.groupMembers;
            this.groupMemberEdit = JSON.parse(JSON.stringify(this.content))[0];
            // console.log(METHOD_NAME + ' groupMemberEdit ' + this.groupMemberEdit);

            this.txtCapacidade = this.groupMemberEdit.userConfiguredCapacity;

            // Define if will show the grid or not
            this.showEdit = this.content.length > 0;

        }).catch(error => {
            console.log(METHOD_NAME + ' data error ' + JSON.stringify(error));
            this.showLocalToast('Erro', 'error', error.body.message);
            this.isLoading = false;
        });        

        this.isLoading = false;
    }

    async hadlerMembroDelete(event) {
        this.hasUpdateApplied = true;
        let METHOD_NAME = 'hadlerMembroDelete';
        // console.log(METHOD_NAME + ' event.detail ' , event.detail)
        this.isLoading = true;
        let groupMember = event.detail;
        // console.log(METHOD_NAME + ' groupMember ' , groupMember)

        let objGroupMember = {
            capacidadeGrupoFilaId : this.recordId,
            groupMemberId : groupMember,
            userConfiguredCapacity : 0,
            isUserAvaible : false
        }
        // console.log(METHOD_NAME + ' objGroupMember ' , objGroupMember)
        let strGroupMember = JSON.stringify(objGroupMember);        
        // console.log(METHOD_NAME + ' strGroupMember ' , strGroupMember)
        await setExcluirGroupMembro({strGroupMember})
        .then(async result => {
            console.log(METHOD_NAME + ' result ' + result);
            
            if (result.isSuccess){
                this.isLoading = false;
                this.showLocalToast('Sucesso', 'success', result.dmlMessage);
            } else {
                this.isLoading = false;
                console.log(METHOD_NAME + ' data error ' + result.dmlMessage);
                this.showLocalToast('Erro', 'error', result.dmlMessage);
            }
            return result;
        }).then( async result => {
            this.loadCapacidadeGroupMembros();
        }).catch(error => {
            console.log(METHOD_NAME + ' data error ' + JSON.stringify(error));
            this.showLocalToast('Erro', 'error', error.body.message);
            this.isLoading = false;
        });        


    }
}