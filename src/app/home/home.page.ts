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

    index = -1;

    public strCongregacao = [
        {
            regional: 'TEMPLO',
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
        { value: 0, mensagem: 'Qual seu nome completo?' },
        { value: 1, mensagem: 'Onde você congrega?' },
        { value: 2, mensagem: 'Qual o número do seu CPF?' },
        { value: 3, mensagem: 'Qual o número do seu RG?' },
        { value: 4, mensagem: 'Qual o orgao expedidor do RG e Estado?' },
        { value: 5, mensagem: 'Qual o DIA do nascimento?' },
        { value: 6, mensagem: 'Qual o MÊS do nascimento?' },
        { value: 7, mensagem: 'Qual o ANO do nascimento?' },
        { value: 8, mensagem: 'Masculino ou Feminino?' },
        { value: 9, mensagem: 'Seu estado civil?' },
        { value: 10, mensagem: 'Sua nacionalidade?' },
        { value: 11, mensagem: 'Cidade que você nasceu?' },
        { value: 12, mensagem: 'Estado que você nasceu?' },
        { value: 13, mensagem: 'Qual o seu E-mail?' },
        { value: 14, mensagem: 'Nome completo da mãe?' },
        { value: 15, mensagem: 'Nome completo do pai?' },
        { value: 16, mensagem: 'Sua escolaridade?' },
        { value: 17, mensagem: 'Telefone para contato?' },
        { value: 18, mensagem: 'Whatsapp?' },
        { value: 19, mensagem: 'Qual o seu CEP?' },
        { value: 20, mensagem: 'Nome da sua rua?' },
        { value: 21, mensagem: 'Qual número da casa?' },
        { value: 22, mensagem: 'Nome do bairro?' },
        { value: 23, mensagem: 'Complemento (Especifique)?' },
        { value: 24, mensagem: 'Estado onde mora?' },
        { value: 25, mensagem: 'Cidade onde mora?' },
        { value: 26, mensagem: 'Qual a data batismo nas águas?' },
        { value: 27, mensagem: 'Qual a data batismo no Espirito Santo?' },
        { value: 28, mensagem: 'É obreiro?' },
        { value: 29, mensagem: 'Qual seu Cargo?' },
        { value: 30, mensagem: 'Qual data da consagração a Diácono?' },
        { value: 31, mensagem: 'Local da consagração a Diácono?' },
        { value: 32, mensagem: 'Qual data da consagração a Presbitero?' },
        { value: 33, mensagem: 'Local da consagração a Presbitero?' },
        { value: 34, mensagem: 'Qual data da consagração a Evangelista?' },
        { value: 35, mensagem: 'Local da consagração a Evangelista?' },
        { value: 36, mensagem: 'Qual data da consagração a Pastor?' },
        { value: 37, mensagem: 'Local da consagração a Pastor?' },
        { value: 38, mensagem: 'Data do Registro no campo Jardim América?' },
        { value: 39, mensagem: 'Data do Registro na CADESGO?' },
        { value: 40, mensagem: 'Data do Registro na CGADB?' }
    ];

    constructor(private alertController: AlertController) { }

    ngOnInit() {
        this.index = 0;
        setTimeout(() => {
            this.messages.push({ sender: 'bot', content: '' });
            this.typeText(this.mensagemBot[this.index].mensagem);
            this.isMensage = false;
            this.loading = true;
            this.index++;
            this.focustextarea.setFocus();
        }, 3500);
    }

    novoCadastro() {
        this.messages = [];
        this.isMensage = true;
        this.loading = false;
        this.index = 0;

        setTimeout(() => {
            this.messages.push({ sender: 'bot', content: '' });
            this.typeText(this.mensagemBot[this.index].mensagem);
            this.isMensage = false;
            this.loading = true;
            this.index++;
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
                    if (this.index === 1) {
                        setTimeout(() => {
                            this.showAlert(this.mensagemBot[this.index].value, 'CONGREGAÇÃO');
                        }, 500);
                    } else if (this.index === 6) {
                        setTimeout(() => {
                            this.showAlert(this.mensagemBot[this.index].value, 'MÊS');
                        }, 500);
                    } else if (this.index === 8) {
                        setTimeout(() => {
                            this.showAlert(this.mensagemBot[this.index].value, 'SEXO');
                        }, 500);
                    } else if (this.index === 9) {
                        setTimeout(() => {
                            this.showAlert(this.mensagemBot[this.index].value, 'ESTADO CIVIL');
                        }, 500);
                    } else if (this.index === 10) {
                        setTimeout(() => {
                            this.showAlert(this.mensagemBot[this.index].value, 'NACIONALIDADE');
                        }, 500);
                    } else if (this.index === 12) {
                        setTimeout(() => {
                            this.showAlert(this.mensagemBot[this.index].value, 'UF');
                        }, 500);
                    } else if (this.index === 16) {
                        setTimeout(() => {
                            this.showAlert(this.mensagemBot[this.index].value, 'ESCOLARIDADE');
                        }, 500);
                    } else if (this.index === 24) {
                        setTimeout(() => {
                            this.showAlert(this.mensagemBot[this.index].value, 'ESTADO');
                        }, 500);
                    } else if (this.index === 28) {
                        setTimeout(() => {
                            this.showAlert(this.mensagemBot[this.index].value, 'OBREIRO');
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
        if (numero === 2) {
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
        } else if (numero === 7) {
            for (const str of this.strMeses) {
                inputs.push({
                    type: 'radio',
                    label: str.nome,
                    value: str.nome
                });
            }
        } else if (numero === 9) {
            for (const str of this.strSexo) {
                inputs.push({
                    type: 'radio',
                    label: str.nome,
                    value: str.nome
                });
            }
        } else if (numero === 10) {
            for (const str of this.strEstadoCivil) {
                inputs.push({
                    type: 'radio',
                    label: str.nome,
                    value: str.nome
                });
            }
        } else if (numero === 11) {
            for (const str of this.strNacionalidade) {
                inputs.push({
                    type: 'radio',
                    label: str.nome,
                    value: str.nome
                });
            }
        } else if (numero === 13) {
            for (const str of this.strEstados) {
                inputs.push({
                    type: 'radio',
                    label: (str.nome + ' - ' + str.sigla),
                    value: str.sigla
                });
            }
        } else if (numero === 17) {
            for (const str of this.strEscolaridade) {
                inputs.push({
                    type: 'radio',
                    label: str.nome,
                    value: str.nome
                });
            }
        } else if (numero === 25) {
            for (const str of this.strEstados) {
                inputs.push({
                    type: 'radio',
                    label: (str.nome + ' - ' + str.sigla),
                    value: str.nome
                });
            }
        } else if (numero === 29) {
            for (const str of this.strObreiro) {
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
