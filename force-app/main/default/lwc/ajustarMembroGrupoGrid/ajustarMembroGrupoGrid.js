import { LightningElement, track, api, wire } from 'lwc';

export default class ajustarMembroGrupoGrid extends LightningElement {

    groupMemberId = '';

    @api disableIcons;

    privateColumns = [];
    @api get columns() {
        return this.privateColumns;
    }
    set columns(value) {
        this.privateColumns = value || [];

        this.header = this.privateColumns.filter((item) => !item.detail && !item.action);
        this.actions = this.privateColumns.filter((item) => item.action);
        this.detail = this.privateColumns.filter((item) => item.detail);
    }

    privateContent = [];
    @api get content() {
        return this.privateContent;
    }
    set content(value) {
        if (!value) return [];
        this.debug && console.log(`PositionViewGrid - content.value - ${JSON.stringify(value)}`);
        this.privateContent = this.mapContent(value);
    }

    get showDetails() {
        return this.detail?.length > 0;
    }
    get showActions() {
        return this.actions?.length > 0;
    }

    header = [];
    actions = [];
    detail = [];
    pathname = '';

    @api debug = false;

    connectedCallback() {
        self = this;

        this.debug && console.log(`PositionViewGrid - connectedCallback - ${JSON.stringify(this.columns)}`);
        this.debug && console.log(`PositionViewGrid - connectedCallback - ${JSON.stringify(this.content)}`);

        window.addEventListener('scroll', this.componentScroll);
        this.loadMoreIfScreenIsBig();
        
    }

    componentScroll(event) {
        const reachedBottom = (document.documentElement.scrollTop + document.documentElement.clientHeight) >= (document.documentElement.scrollHeight - 3);
        if (reachedBottom) {
            self.dispatchEvent(new CustomEvent('loadmore', { detail: true }))
        }
    }

    loadMoreIfScreenIsBig() {

        if (document.documentElement.clientHeight > 600) {

            this.dispatchEvent(new CustomEvent('loadmore', { detail: true }))

            for(let i = 600; i < document.documentElement.clientHeight; i+=300){

                this.dispatchEvent(new CustomEvent('loadmore', { detail: true }))
            }
        }
    }


    showDetail(event) {
        const selectedId = event.target.dataset.id;

        const detailRow = this.template.querySelector("[id*='detail-" + selectedId + "']");
        const hideButton = this.template.querySelector("[id*='hide-" + selectedId + "']");
        const showButton = this.template.querySelector("[id*='show-" + selectedId + "']");

        detailRow.classList.toggle("hideDetail");
        hideButton.classList.toggle("hideDetail");
        showButton.classList.toggle("hideDetail");
    }


    mapFields(position) {
        this.debug && console.log(`PositionViewGrid - mapField - ${JSON.stringify(position)}`);

        this.pathname = document.location.pathname.split('/s/')[0];
        let blnPagamentoPendente = false;

        const fieldsMapped = {
            row: this.header.map((column) => {
                const isUrl = !!column.url;

                if (column.source.indexOf('.') > -1) {
                    const partials = column.source.split('.');
                    const value = position[partials[0]] ? position[partials[0]][partials[1]] : '&nbsp;';

                    if (isUrl) {
                        if (column.url.recordId.indexOf('.') > -1) {
                            const columns = column.url.recordId.split('.');

                            if (position[columns[0]] && position[columns[0]][columns[1]]) {
                                return `<a href="${this.pathname}/s/${column.url.address.replace('***', position[columns[0]][columns[1]])}">${value}</a>`;
                            }
                            return value;
                        } else {
                            if (position[column.url.recordId]) {
                                return `<a href="${this.pathname}/s/${column.url.address.replace('***', position[column.url.recordId])}">${value}</a>`
                            }
                            return value;
                        }
                    } else {
                        return value;
                    }

                } else {
                    const value = position[column.source];

                    if (isUrl) {
                        if (column.url.recordId.indexOf('.') > -1) {
                            const columns = column.url.recordId.split('.');

                            if (position[columns[0]] && position[columns[0]][columns[1]]) {
                                return `<a href="${this.pathname}/s/${column.url.address.replace('***', position[columns[0]][columns[1]])}">${value}</a>`;
                            }
                            return value;
                        } else {
                            if (position[column.url.recordId]) {
                                return `<a href="${this.pathname}/s/${column.url.address.replace('***', position[column.url.recordId])}">${value}</a>`
                            }
                            return value;
                        }
                    } else {
                        return value;
                    }

                }
            }),
            detail: this.detail.map((column) => {
                if (column.source == 'pagamentoStatus'){
                    // console.log('mapFields column.source ' + column.source);
                    const partials = column.source.split('.');
                    // console.log('mapFields value ' + position[partials[0]]);
                    if (position[partials[0]] == 'Pendente'){
                        blnPagamentoPendente = true;
                    }
                }


                if (column.source.indexOf('.') > -1) {
                    const partials = column.source.split('.');
                    const value = position[partials[0]] ? position[partials[0]][partials[1]] : '&nbsp;';
                    const isPills = value && (column.isPill || value !== '&nbsp;' && value.toString().split(';').length > 1);
                    return { label: column.label, value: isPills ? value.toString().split(';') : value, isPills };
                } else {
                    return { label: column.label, value: position[column.source] };
                }

            }),
        };
        // Adiciona o campo relacionado ao click do pagamento
        fieldsMapped.pagamentoPendente = blnPagamentoPendente;
        //console.log('mapFields fieldsMapped.pagamentoPendente ' + fieldsMapped.pagamentoPendente);
        return fieldsMapped;
    }

    mapContent(content) {
        return content.map((item) => {
            const idDetail = Math.floor((Math.random() * 99999999999) + 1);
            return {
                ...item,
                idDetail,
                'detailId': `detail-${idDetail}`,
                'showId': `show-${idDetail}`,
                'hideId': `hide-${idDetail}`,
                ...this.mapFields(item)
            };

        });
    }

    eventPropagation(event,eventType) {
        let METHOD_NAME = 'eventPropagation';
        event.preventDefault();
        this.dispatchEvent(new CustomEvent(eventType, { detail: this.groupMemberId }));
    }

    hadlerSelect(event){
        let METHOD_NAME = 'hadlerSelect';
        const selectedId = event.target.dataset.id;
        // console.log(METHOD_NAME + ' selectedId ' , selectedId)
        this.groupMemberId = selectedId;
        console.log(METHOD_NAME + ' this.groupMemberId' , this.groupMemberId)
        this.eventPropagation(event,'selected');
    }

    hadlerDelete(event){
        let METHOD_NAME = 'hadlerDelete';
        const selectedId = event.target.dataset.id;
        // console.log(METHOD_NAME + ' selectedId ' , selectedId)
        this.groupMemberId = selectedId;
        console.log(METHOD_NAME + ' this.groupMemberId' , this.groupMemberId)
        this.eventPropagation(event,'deleted');
    }

}