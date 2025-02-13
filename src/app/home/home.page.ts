import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IMessage } from '../models/methods.models';
import { AlertController, IonContent, IonTextarea } from '@ionic/angular';
import { CustomValidators } from 'src/utils/custom-validators';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
    @ViewChild(IonContent, { static: false }) content!: IonContent;
    @ViewChild('focustextarea', { static: false }) focustextarea!: IonTextarea;

    messages: IMessage[] = [];
    loading: boolean = false;
    isMensage: boolean = true;

    form = new FormGroup({
        prompt: new FormControl('', [Validators.required, CustomValidators.noWhiteSpace])
    })

    index = 0;

    public strCongregacao = [
        {
            regional: '',
            options: [
                { value: 'SEDE' }
            ],
        },
        {
            regional: 'REGIONAL 01',
            options: [
                { value: 'ANICUNS' },
                { value: 'ADELÂNDIA' },
                { value: 'AMERICANO DO BRASIL' },
                { value: 'SÃO DOMINGOS' },
                { value: 'SANTA FÉ' }
            ],
        },
        {
            regional: 'REGIONAL 02',
            options: [
                { value: 'RECANTO DO BOSQUE' },
                { value: 'ALICE BARBOSA' },
                { value: 'ITANHANGÁ' },
                { value: 'ALTO CERRADO' },
                { value: 'BOA VISTA' },
                { value: 'SÃO BERNARDO' },
                { value: '14 BIS' }
            ],
        },
        {
            regional: 'REGIONAL 03',
            options: [
                { value: 'JOÃO BRÁS' },
                { value: 'VILA FÁTIMA' },
                { value: 'NORTE FERROVIÁRIO' },
                { value: 'SÃO MARCOS' },
                { value: 'RESIDENCIAL PORTINARI' },
                { value: 'SETOR CAMPINAS' },
                { value: 'GOIANIRA (SERRA DOURADA)' }
            ],
        },
        {
            regional: 'REGIONAL 04',
            options: [
                { value: 'FAIÇALVILLE' },
                { value: 'VILA BOA' },
                { value: 'PEDRO LUDOVICO' },
                { value: 'VILA ROSA' },
                { value: 'SETOR DOS AFONSO' },
                { value: 'RESIDENCIAL ELI FORTE' }
            ],
        },
        {
            regional: 'REGIONAL 05',
            options: [
                { value: 'JARDIM TDS SANTOS 2' },
                { value: 'JARDIM TODOS OS SANTOS 3' },
                { value: 'PEDRO MIRANDA' },
                { value: 'RIO ARAGUAIA' },
                { value: 'FLOR DO YPÊ' }
            ],
        },
        {
            regional: 'REGIONAL 06',
            options: [
                { value: 'VEIGA JARDIM' },
                { value: 'CARDOSO II' },
                { value: 'BURITI SERENO' },
                { value: 'COLINA AZUL' },
                { value: 'TERRA DO SOL' }
            ],
        },
        {
            regional: 'REGIONAL 07',
            options: [
                { value: 'VILA ROMANA' },
                { value: 'JARDIM ITAIPU' },
                { value: 'GOIÂNIA SUL' },
                { value: 'BOA ESPERANÇA' },
                { value: 'JARDIM INDEPENDENCIA' }
            ],
        },
        {
            regional: 'REGIONAL 08',
            options: [
                { value: 'CROMINIA' },
                { value: 'ARAGOIÂNIA-GO' },
                { value: 'HIDROLÂNDIA' }
            ],
        },
        {
            regional: 'REGIONAL 09',
            options: [
                { value: 'BOFINÓPOLIS-GO' },
                { value: 'SETOR JULIANA (BOFINÓPOLIS-GO)' }
            ],
        },
        {
            regional: 'IGREJAS MISSIONÁRIAS',
            options: [
                { value: 'LONDRES' },
                { value: 'CONCÓRDIA-ARG. PROVINCIA DE ENTRE RIOS' },
                { value: 'ELDORADO-ARG' },
                { value: 'VERA CRUZ' },
                { value: 'MACAPÁ-AP (BRASIL NOVO)' },
                { value: 'FIN SOCIAL' }
            ],
        }
    ];

    public strMeses = [
        { nome: 'JANEIRO' },
        { nome: 'FEVEREIRO' },
        { nome: 'MARÇO' },
        { nome: 'ABRIL' },
        { nome: 'MAIO' },
        { nome: 'JUNHO' },
        { nome: 'JULHO' },
        { nome: 'AGOSTO' },
        { nome: 'SETEMBRO' },
        { nome: 'OUTUBRO' },
        { nome: 'NOVEMBRO' },
        { nome: 'DEZEMBRO' }
    ];

    public strSexo = [
        { nome: 'MASCULINO' },
        { nome: 'FEMININO' }
    ];

    public strEstadoCivil = [
        { nome: 'CASADO(a)' },
        { nome: 'SOLTEIRO(a)' },
        { nome: 'DIVORCIADO(a)' },
        { nome: 'VIÚVO(a)' }
    ]

    public strNacionalidade = [
        { nome: 'BRASILEIRO(a)' },
        { nome: 'ESTRANGEIRO(a)' }
    ]
    
    public strEstados = [
        { sigla: 'AC', nome: 'ACRE' },
        { sigla: 'AL', nome: 'ALAGOAS' },
        { sigla: 'AP', nome: 'AMAPÁ' },
        { sigla: 'AM', nome: 'AMAZONAS' },
        { sigla: 'BA', nome: 'BAHIA' },
        { sigla: 'CE', nome: 'CEARÁ' },
        { sigla: 'DF', nome: 'DISTRITO FEDERAL' },
        { sigla: 'ES', nome: 'ESPÍRITO SANTO' },
        { sigla: 'GO', nome: 'GOIÁS' },
        { sigla: 'MA', nome: 'MARANHÃO' },
        { sigla: 'MT', nome: 'MATO GROSSO' },
        { sigla: 'MS', nome: 'MATO GROSSO DO SUL' },
        { sigla: 'MG', nome: 'MINAS GERAIS' },
        { sigla: 'PA', nome: 'PARÁ' },
        { sigla: 'PB', nome: 'PARAÍBA' },
        { sigla: 'PR', nome: 'PARANÁ' },
        { sigla: 'PE', nome: 'PERNAMBUCO' },
        { sigla: 'PI', nome: 'PIAUÍ' },
        { sigla: 'RJ', nome: 'RIO DE JANEIRO' },
        { sigla: 'RN', nome: 'RIO GRANDE DO NORTE' },
        { sigla: 'RS', nome: 'RIO GRANDE DO SUL' },
        { sigla: 'RO', nome: 'RONDÔNIA' },
        { sigla: 'RR', nome: 'RORAIMA' },
        { sigla: 'SC', nome: 'SANTA CATARINA' },
        { sigla: 'SP', nome: 'SÃO PAULO' },
        { sigla: 'SE', nome: 'SERGIPE' },
        { sigla: 'TO', nome: 'TOCANTINS' }
    ];

    public strEscolaridade = [
        { nome: 'FUND. INCOMPLETO' },
        { nome: 'FUND. COMPLETO' },
        { nome: 'MÉDIO INCOMPLETO' },
        { nome: 'MÉDIO COMPLETO' },
        { nome: 'SUP. INCOMPLETO' },
        { nome: 'SUP. COMPLETO' },
        { nome: 'TECNÓLOGO' },
        { nome: 'PÓS-GRADUAÇÃO' },
        { nome: 'MESTRADO' },
        { nome: 'DOUTORADO' }
    ];

    public strObreiro = [
        { nome: 'SIM' },
        { nome: 'NAO' },
    ];

    mensagemBot = [
        { mensagem: 'Onde você congrega?' },
        { mensagem: 'Qual o número do seu CPF?' },
        { mensagem: 'Qual o DIA do nascimento?' },
        { mensagem: 'Qual o MÊS do nascimento?' },
        { mensagem: 'Qual o ANO do nascimento?' },
        { mensagem: 'Masculino ou Feminino?' },
        { mensagem: 'Seu estado civil?' },
        { mensagem: 'Sua nacionalidade?' },
        { mensagem: 'Cidade que você nasceu?' },
        { mensagem: 'Estado que você nasceu?' },
        { mensagem: 'Qual o seu E-mail?' },
        { mensagem: 'Nome completo da mãe?' },
        { mensagem: 'Nome completo do pai?' },
        { mensagem: 'Sua escolaridade?' },
        { mensagem: 'Telefone para contato?' },
        { mensagem: 'Whatsapp?' },
    ];

    constructor(private alertController: AlertController) { }

    ngOnInit() {
        setTimeout(() => {
            this.messages.push({ sender: 'bot', content: '' });
            this.typeText('Qual seu nome completo?');
            this.isMensage = false;
            this.loading = true;
            this.focustextarea.setFocus();
        }, 3500);
    }

    novoCadastro() {
        this.messages = [];
        this.isMensage = true;
        this.loading = false;

        setTimeout(() => {
            this.messages.push({ sender: 'bot', content: '' });
            this.typeText('Qual seu nome completo?');
            this.isMensage = false;
            this.loading = true;
            this.focustextarea.setFocus();
        }, 3000);
    }

    submit(res?: string) {
        if (this.form.valid || res !== undefined) {
            let prompt = res !== undefined ? res : this.form.value.prompt as string;

            if (!prompt) {
                console.error('O prompt está vazio ou é inválido');
                return;
            }

            let userMsg: IMessage = {
                sender: 'me',
                content: ''
            };
            this.messages.push(userMsg);
            this.typeText(prompt?.toLocaleUpperCase());

            if (this.index >= 0 && this.index < this.mensagemBot.length) {
                setTimeout(() => {
                    let msg = this.mensagemBot[this.index].mensagem;
                    let botMsg: IMessage = {
                        sender: 'bot',
                        content: ''
                    };
                    this.messages.push(botMsg);
                    this.typeText(msg);
                    this.loading = true;
                    if (this.index === 0) {
                        setTimeout(() => {
                            this.showAlert(1, 'CONGREGAÇÃO');
                        }, 500);
                    } else if (this.index === 3) {
                        setTimeout(() => {
                            this.showAlert(3, 'MÊS');
                        }, 500);
                    } else if (this.index === 5) {
                        setTimeout(() => {
                            this.showAlert(5, 'SEXO');
                        }, 500);
                    } else if (this.index === 6) {
                        setTimeout(() => {
                            this.showAlert(6, 'ESTADO CIVIL');
                        }, 500);
                    } else if (this.index === 7) {
                        setTimeout(() => {
                            this.showAlert(7, 'NACIONALIDADE');
                        }, 500);
                    } else if (this.index === 9) {
                        setTimeout(() => {
                            this.showAlert(9, 'UF');
                        }, 500);
                    } else if (this.index === 13) {
                        setTimeout(() => {
                            this.showAlert(13, 'UF');
                        }, 500);
                    }
                    this.index++;
                }, 1000);

            } else {
                this.loading = false;
                this.form.disable();
                this.content.scrollEvents = false;
            }

            this.focustextarea.setFocus();
            this.form.reset();
        }
    }

    typeText(text: string) {
        if (!text) {
            return;
        }

        let textIndex = 0;
        let messagesLastIndex = this.messages.length - 1;

        let interval = setInterval(() => {
            this.usaScrollToBottom();
            if (textIndex < text.length) {
                this.messages[messagesLastIndex].content += text.charAt(textIndex);
                textIndex++;
            } else {
                clearInterval(interval);
            }
        }, 15);
    }

    usaScrollToBottom() {
        this.content.scrollToBottom(10);
    }


    async showAlert(numero: number, str: string) {
        const inputs: { type?: 'radio'; label?: string; value?: string; disabled?: boolean; }[] = [];
        if (numero === 1) {
            for (const regional of this.strCongregacao) {
                inputs.push({
                    type: 'radio',
                    label: regional.regional,
                    value: regional.regional,
                    disabled: true
                });
                for (const option of regional.options) {
                    inputs.push({
                        type: 'radio',
                        label: option.value,
                        value: option.value
                    });
                }
            }
        } else if (numero === 3) {
            for (const str of this.strMeses) {
                inputs.push({
                    type: 'radio',
                    label: str.nome,
                    value: str.nome
                });
            }
        } else if (numero === 5) {
            for (const str of this.strSexo) {
                inputs.push({
                    type: 'radio',
                    label: str.nome,
                    value: str.nome
                });
            }
        } else if (numero === 6) {
            for (const str of this.strEstadoCivil) {
                inputs.push({
                    type: 'radio',
                    label: str.nome,
                    value: str.nome
                });
            }
        } else if (numero === 7) {
            for (const str of this.strNacionalidade) {
                inputs.push({
                    type: 'radio',
                    label: str.nome,
                    value: str.nome
                });
            }
        } else if (numero === 9) {
            for (const str of this.strEstados) {
                inputs.push({
                    type: 'radio',
                    label: (str.nome + ' - ' + str.sigla),
                    value: str.sigla
                });
            }
        } else if (numero === 13) {
            for (const str of this.strEscolaridade) {
                inputs.push({
                    type: 'radio',
                    label: str.nome,
                    value: str.nome
                });
            }
        }

        const presentAlert = await this.alertController.create({
            header: str,
            backdropDismiss: false,
            inputs: inputs,
            buttons: [{
                text: 'OK',
                cssClass: 'okButton',
                handler: (res) => {
                    let value = '';
                    if (typeof res === 'object') {
                       value = res[0];
                    } else {
                        value = res;
                    }
                    this.submit(value);
                }
            }]
        });

        presentAlert.overlayIndex = 9;
        await presentAlert.present();
    }
}
