import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IMessage } from '../models/methods.models';
import { AlertController, IonContent, IonInput, IonTextarea, Platform } from '@ionic/angular';
import { CustomValidators } from 'src/utils/custom-validators';

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(pdfMake as any).vfs = pdfFonts.vfs;

import { Filesystem, Directory } from '@capacitor/filesystem';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
    @ViewChild(IonContent, { static: false }) content!: IonContent;
    @ViewChild('focustextarea', { static: false }) focustextarea!: IonTextarea;

    public messages: IMessage[] = [];
    public loading: boolean = false;
    public isMensage: boolean = true;
    private index = -1;
    public pdfObj!: pdfMake.TCreatedPdf;
    private logoData!: string | ArrayBuffer | null;
    public photoPreview!: string;
    public isEnabledButtons: boolean = false;
    public isUsaInput: string = 'text'
    public isDesabledPdf: boolean = true;

    private urlPdf: string = '';
    private nome: string = '';
    private congregacao: string = '';
    private cpf: string = '';
    private rg: string = '';
    private expedidorRg: string = '';
    private dataNascimento: string = '';
    private sexo: string = '';
    private estadoCivil: string = '';
    private nacionalidade: string = '';
    private naturalidade: string = '';
    private uf: string = '';
    private email: string = '';
    private nomeMae: string = '';
    private nomePai: string = '';
    private escolaridade: string = '';
    private telefone1: string = '';
    private telefone2: string = '';
    private cep: string = '';
    private rua: string = '';
    private numero: string = '';
    private bairro: string = '';
    private complemento: string = '';
    private estado: string = '';
    private cidade: string = '';
    private batismoAgua: string = '';
    private batismoEspiritoSanto: string = '';
    private isObreiro: string = '';
    private obreiroCargo: string = '';
    private consDiacono: string = '';
    private localDiacono: string = '';
    private consPresbitero: string = '';
    private localPresbitero: string = '';
    private consEvangelista: string = '';
    private localEvangelista: string = '';
    private consPastor: string = '';
    private localPastor: string = '';
    private regCampo: string = '';
    private regCadesgo: string = '';
    private regCgadb: string = '';

    form = new FormGroup({
        prompt: new FormControl('', [Validators.required, CustomValidators.noWhiteSpace])
    })

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
        { value: '01', nome: 'JANEIRO' },
        { value: '02', nome: 'FEVEREIRO' },
        { value: '03', nome: 'MARÇO' },
        { value: '04', nome: 'ABRIL' },
        { value: '05', nome: 'MAIO' },
        { value: '06', nome: 'JUNHO' },
        { value: '07', nome: 'JULHO' },
        { value: '08', nome: 'AGOSTO' },
        { value: '09', nome: 'SETEMBRO' },
        { value: '10', nome: 'OUTUBRO' },
        { value: '11', nome: 'NOVEMBRO' },
        { value: '12', nome: 'DEZEMBRO' }
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

    private mensagemBot = [
        { value: 0, mensagem: 'Qual seu nome completo ?' },
        { value: 1, mensagem: 'Onde você congrega ?' },
        { value: 2, mensagem: 'Qual o número do seu CPF ?' },
        { value: 3, mensagem: 'Qual o número do seu RG ?' },
        { value: 4, mensagem: 'Qual o orgao expedidor do RG e Estado ?' },
        { value: 5, mensagem: 'Qual o DIA do nascimento ?' },
        { value: 6, mensagem: 'Qual o MÊS do nascimento ?' },
        { value: 7, mensagem: 'Qual o ANO do nascimento ?' },
        { value: 8, mensagem: 'Masculino ou Feminino ?' },
        { value: 9, mensagem: 'Seu estado civil ?' },
        { value: 10, mensagem: 'Sua nacionalidade ?' },
        { value: 11, mensagem: 'Cidade que você nasceu ?' },
        { value: 12, mensagem: 'Estado que você nasceu ?' },
        { value: 13, mensagem: 'Qual o seu E-mail ?' },
        { value: 14, mensagem: 'Nome completo da mãe ?' },
        { value: 15, mensagem: 'Nome completo do pai ?' },
        { value: 16, mensagem: 'Sua escolaridade ?' },
        { value: 17, mensagem: 'Telefone para contato ?' },
        { value: 18, mensagem: 'Whatsapp ?' },
        { value: 19, mensagem: 'Qual o seu CEP ?' },
        { value: 20, mensagem: 'Nome da sua rua ?' },
        { value: 21, mensagem: 'Qual número da casa ?' },
        { value: 22, mensagem: 'Nome do bairro ?' },
        { value: 23, mensagem: 'Complemento (Especifique) ?' },
        { value: 24, mensagem: 'Estado onde mora ?' },
        { value: 25, mensagem: 'Cidade onde mora ?' },
        { value: 26, mensagem: 'Qual a data batismo nas águas ?' },
        { value: 27, mensagem: 'Qual a data batismo no Espirito Santo ?' },
        { value: 28, mensagem: 'É obreiro ?' },
        { value: 29, mensagem: 'Qual seu Cargo ?' },
        { value: 30, mensagem: 'Qual data da consagração a Diácono ?' },
        { value: 31, mensagem: 'Local da consagração a Diácono ?' },
        { value: 32, mensagem: 'Qual data da consagração a Presbitero ?' },
        { value: 33, mensagem: 'Local da consagração a Presbitero ?' },
        { value: 34, mensagem: 'Qual data da consagração a Evangelista ?' },
        { value: 35, mensagem: 'Local da consagração a Evangelista ?' },
        { value: 36, mensagem: 'Qual data da consagração a Pastor ?' },
        { value: 37, mensagem: 'Local da consagração a Pastor ?' },
        { value: 38, mensagem: 'Data do Registro no campo Jardim América ?' },
        { value: 39, mensagem: 'Data do Registro na CADESGO ?' },
        { value: 40, mensagem: 'Data do Registro na CGADB ?' }
    ];

    constructor(private alertController: AlertController, public fileOpener: FileOpener, public plt: Platform, public http: HttpClient) { }

    ngOnInit() {
        this.index = 0;
        setTimeout(() => {
            this.messages.push({ sender: 'bot', content: '' });
            this.typeText(this.mensagemBot[this.index].mensagem);
            this.isMensage = false;
            this.loading = true;
            this.index++;
        }, 3500);

        this.loadLocalAssetToBase64();
    }

    public novoCadastro() {
        this.isEnabledButtons = false;
        this.messages = [];
        this.isMensage = true;
        this.loading = false;
        this.index = 0;
        this.isDesabledPdf = true;

        setTimeout(() => {
            this.messages.push({ sender: 'bot', content: '' });
            this.typeText(this.mensagemBot[this.index].mensagem);
            this.isMensage = false;
            this.loading = true;
            this.isUsaInput = 'text';
            this.index++;
            this.form.enable();
            this.focustextarea?.setFocus();
        }, 3000);
    }

    private loadLocalAssetToBase64() {
        this.http.get('./assets/images/header-igreja.png', { responseType: 'blob' })
            .subscribe(res => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    this.logoData = reader.result;
                }
                reader.readAsDataURL(res);
            });
    }

    public submit(res?: string) {
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
            this.typeText(String(prompt)?.toLocaleUpperCase());

            const valoresVerificar = [2, 3, 5, 6, 7, 17, 18, 19];
            this.isUsaInput = valoresVerificar.includes(this.index) ? 'numeric' : 'text';

            if (this.index === 1) {
                this.nome = String(prompt)?.toLocaleUpperCase();
            } else if (this.index === 2) {
                this.congregacao = String(prompt)?.toLocaleUpperCase();
            } else if (this.index === 3) {
                this.cpf = String(prompt)?.toLocaleUpperCase();
            } else if (this.index === 4) {
                this.rg = String(prompt)?.toLocaleUpperCase();
            } else if (this.index === 5) {
                this.expedidorRg = String(prompt)?.toLocaleUpperCase();
            } else if (this.index === 6 || this.index === 7 || this.index === 8) {
                this.dataNascimento = (this.dataNascimento === '' ? String(prompt)?.toLocaleUpperCase() : this.dataNascimento.concat('/', String(prompt)?.toLocaleUpperCase())).replace('\n', '');
            } else if (this.index === 9) {
                this.sexo = String(prompt)?.toLocaleUpperCase();
            } else if (this.index === 10) {
                this.estadoCivil = String(prompt)?.toLocaleUpperCase();
            } else if (this.index === 11) {
                this.nacionalidade = String(prompt)?.toLocaleUpperCase();
            } else if (this.index === 12) {
                this.naturalidade = String(prompt)?.toLocaleUpperCase();
            } else if (this.index === 13) {
                this.uf = String(prompt)?.toLocaleUpperCase();
            } else if (this.index === 14) {
                this.email = prompt;
            } else if (this.index === 15) {
                this.nomeMae = String(prompt)?.toLocaleUpperCase();
            } else if (this.index === 16) {
                this.nomePai = String(prompt)?.toLocaleUpperCase();
            } else if (this.index === 17) {
                this.escolaridade = String(prompt)?.toLocaleUpperCase();
            } else if (this.index === 18) {
                this.telefone1 = String(prompt)?.toLocaleUpperCase();
            } else if (this.index === 19) {
                this.telefone2 = String(prompt)?.toLocaleUpperCase();
            } else if (this.index === 20) {
                this.cep = String(prompt)?.toLocaleUpperCase();
            } else if (this.index === 21) {
                this.rua = String(prompt)?.toLocaleUpperCase();
            } else if (this.index === 22) {
                this.numero = String(prompt)?.toLocaleUpperCase();
            } else if (this.index === 23) {
                this.bairro = String(prompt)?.toLocaleUpperCase();
            } else if (this.index === 24) {
                this.complemento = String(prompt)?.toLocaleUpperCase();
            } else if (this.index === 25) {
                this.estado = String(prompt)?.toLocaleUpperCase();
            } else if (this.index === 26) {
                this.cidade = String(prompt)?.toLocaleUpperCase();
            } else if (this.index === 27) {
                this.batismoAgua = String(prompt)?.toLocaleUpperCase();
            } else if (this.index === 28) {
                this.batismoEspiritoSanto = String(prompt)?.toLocaleUpperCase();
            } else if (this.index === 29) {
                this.isObreiro = String(prompt)?.toLocaleUpperCase();
                if (prompt === 'NAO') {
                    this.isEnabledButtons = true;
                    this.form.disable();
                    this.content.scrollEvents = false;
                    this.mensagemBot.slice(0, 29);
                    setTimeout(() => {
                        let botMsg: IMessage = {
                            sender: 'bot',
                            content: ''
                        };
                        this.messages.push(botMsg);
                        this.typeText('Cadastro concluído com sucesso...');
                        this.loading = false;
                    }, 300);
                    return
                }
            } else if (this.index === 30) {
                this.obreiroCargo = String(prompt)?.toLocaleUpperCase();
            } else if (this.index === 31) {
                this.consDiacono = String(prompt)?.toLocaleUpperCase();
            } else if (this.index === 32) {
                this.localDiacono = String(prompt)?.toLocaleUpperCase();
            } else if (this.index === 33) {
                this.consPresbitero = String(prompt)?.toLocaleUpperCase();
            } else if (this.index === 34) {
                this.localPresbitero = String(prompt)?.toLocaleUpperCase();
            } else if (this.index === 35) {
                this.consEvangelista = String(prompt)?.toLocaleUpperCase();
            } else if (this.index === 36) {
                this.localEvangelista = String(prompt)?.toLocaleUpperCase();
            } else if (this.index === 37) {
                this.consPastor = String(prompt)?.toLocaleUpperCase();
            } else if (this.index === 38) {
                this.localPastor = String(prompt)?.toLocaleUpperCase();
            } else if (this.index === 39) {
                this.regCampo = String(prompt)?.toLocaleUpperCase();
            } else if (this.index === 40) {
                this.regCadesgo = String(prompt)?.toLocaleUpperCase();
            } else if (this.index === 41) {
                this.regCgadb = String(prompt)?.toLocaleUpperCase();
            }

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
                        }, 300);
                    } else if (this.index === 6) {
                        setTimeout(() => {
                            this.showAlert(this.mensagemBot[this.index].value, 'MÊS');
                        }, 300);
                    } else if (this.index === 8) {
                        setTimeout(() => {
                            this.showAlert(this.mensagemBot[this.index].value, 'SEXO');
                        }, 300);
                    } else if (this.index === 9) {
                        setTimeout(() => {
                            this.showAlert(this.mensagemBot[this.index].value, 'ESTADO CIVIL');
                        }, 300);
                    } else if (this.index === 10) {
                        setTimeout(() => {
                            this.showAlert(this.mensagemBot[this.index].value, 'NACIONALIDADE');
                        }, 300);
                    } else if (this.index === 12) {
                        setTimeout(() => {
                            this.showAlert(this.mensagemBot[this.index].value, 'UF');
                        }, 300);
                    } else if (this.index === 16) {
                        setTimeout(() => {
                            this.showAlert(this.mensagemBot[this.index].value, 'ESCOLARIDADE');
                        }, 300);
                    } else if (this.index === 24) {
                        setTimeout(() => {
                            this.showAlert(this.mensagemBot[this.index].value, 'ESTADO');
                        }, 300);
                    } else if (this.index === 28) {
                        setTimeout(() => {
                            this.showAlert(this.mensagemBot[this.index].value, 'OBREIRO');
                        }, 300);
                    }
                    this.index++;
                }, 1000);

            } else {
                this.isEnabledButtons = true;
                this.loading = false;
                this.form.disable();
                this.content.scrollEvents = false;
            }

            setTimeout(() => {
                this.focustextarea?.setFocus();
            }, 400);

            this.form.reset();
        }
    }

    private typeText(text: string) {
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

    public usaScrollToBottom() {
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
                    value: str.value
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
                    label: str.nome,
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
                    label: str.nome,
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
                handler: (res: any) => {
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

    public createPdf() {
        let logo = { image: this.logoData, width: 450, margin: [30, 0, 0, 0] };

        const content = [];

        // Verifica se this.photoPreview existe e é uma string não vazia
        if (this.photoPreview) {
            content.push({
                image: this.photoPreview ?? '',
                width: 98, // Largura da imagem
                height: 115, // Altura da imagem
                margin: [0, -120, 0, 0]
            });
        } else {
            content.push({
                text: 'Imagem não disponível',
                alignment: 'center',
                margin: [0, -50, 0, 0]
            });
        }

        const docDefinition: any = {
            header: {
                // Definindo o cabeçalho com uma moldura
                canvas: [
                    {
                        type: 'rect',
                        x: 30, // Margem esquerda
                        y: 35, // Margem superior
                        w: 535, // Largura da moldura (595 - 30 - 30)
                        h: 778, // Altura da moldura (842 - 32 - 32)
                        lineWidth: 3, // Espessura da linha
                        fill: 'none' // Sem preenchimento
                    }
                ],
                absolutePosition: { x: 0, y: 0 } // Posição absoluta para garantir que a moldura fique no fundo
            },
            watermark: { text: 'AD MISSÃO JARDIM AMÉRICA', color: 'red', opacity: 0.05, bold: true },
            content: [
                {
                    columns: [
                        logo
                    ]
                },

                { // Linha horizontal abaixo da imagem
                    canvas: [
                        {
                            type: 'line',
                            x1: 0,
                            y1: 0,
                            x2: 515, // largura da linha
                            y2: 0,
                            lineWidth: 1.5,
                            lineColor: 'black' // cor da linha
                        }
                    ],
                    margin: [0, 2, 0, 2] // margens em torno da linha
                },

                {
                    text: 'FICHA DE CADASTRO',
                    style: 'header',
                    alignment: 'center',
                    margin: [0, 5, 0, 5]
                },

                // Inicio dos Inputs table de cadastro
                {
                    columns: [
                        {
                            width: '80%', // Ajuste a largura conforme necessário
                            stack: [
                                {
                                    text: 'CONGREGAÇÃO',
                                    bold: true,
                                    margin: [0, 0, 0, 2]
                                },
                                {
                                    table: {
                                        widths: [380],
                                        heights: 13,
                                        body: [
                                            [
                                                {
                                                    text: this.congregacao.toUpperCase()
                                                }
                                            ]
                                        ]
                                    }
                                },
                                {
                                    text: 'Dados Pessoais',
                                    bold: true,
                                    margin: [0, 5, 0, 8]
                                },
                                {
                                    columns: [
                                        {
                                            width: '45%',
                                            stack: [
                                                { text: 'CPF', bold: true, margin: [0, 0, 0, 0] },
                                                {
                                                    table: {
                                                        widths: [170],
                                                        heights: 13,
                                                        body: [
                                                            [
                                                                {
                                                                    text: this.cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4')
                                                                }
                                                            ]
                                                        ]
                                                    },
                                                    margin: [0, 0, 0, 5]
                                                }
                                            ]
                                        },
                                        {
                                            width: '30%',
                                            stack: [
                                                { text: 'RG', bold: true, margin: [0, 0, 0, 0] },
                                                {
                                                    table: {
                                                        widths: [109],
                                                        heights: 13,
                                                        body: [
                                                            [
                                                                {
                                                                    text: this.rg
                                                                }
                                                            ]
                                                        ]
                                                    },
                                                    margin: [0, 0, 10, 0]
                                                }
                                            ]
                                        },
                                        {
                                            width: '20%',
                                            stack: [
                                                { text: 'ORG. EXPED.', bold: true, margin: [0, 0, 0, 0] },
                                                {
                                                    table: {
                                                        widths: [70],
                                                        heights: 13,
                                                        body: [
                                                            [
                                                                {
                                                                    text: this.expedidorRg
                                                                }
                                                            ]
                                                        ]
                                                    },
                                                    margin: [0, 0, 10, 0]
                                                }
                                            ]
                                        }
                                    ],
                                    margin: [0, 0, 0, 5]
                                }
                            ]
                        },
                        // Quadrado da foto
                        {
                            width: '20%', // Ajuste a largura conforme necessário
                            stack: [
                                {
                                    canvas: [
                                        {
                                            type: 'rect',
                                            x: 0,
                                            y: 0,
                                            w: 98, // Largura do quadrado
                                            h: 115, // Altura do quadrado
                                            lineWidth: 1,
                                            lineColor: 'black',
                                            fill: 'none' // Sem preenchimento
                                        }
                                    ],
                                    margin: [0, 0, 0, 0] // Margem à direita do quadrado
                                },
                                // Variavel da imagem
                                content
                            ]
                        }
                    ],
                    margin: [0, 0, 0, 0] // Margem em torno do conjunto de colunas
                },
                {
                    text: 'Nome',
                    bold: true
                },
                {
                    table: {
                        widths: [500],
                        heights: 13,
                        body: [
                            [
                                {
                                    text: this.nome.toUpperCase()
                                }
                            ]
                        ]
                    },
                    margin: [0, 0, 0, 5]
                },
                {
                    columns: [
                        {
                            width: '35%',
                            stack: [
                                { text: 'Data de Nascimento', bold: true, margin: [0, 0, 0, 0] },
                                {
                                    table: {
                                        widths: ['*'],
                                        heights: 13,
                                        body: [
                                            [
                                                {
                                                    text: this.dataNascimento.toUpperCase()
                                                }
                                            ]
                                        ]
                                    },
                                    margin: [0, 0, 10, 0]
                                }
                            ]
                        },
                        {
                            width: '15%',
                            stack: [
                                { text: 'Masculino', bold: true, margin: [0, 0, 0, 0] },
                                {
                                    table: {
                                        widths: ['*'],
                                        heights: 13,
                                        body: [
                                            [
                                                {
                                                    text: this.sexo === 'MASCULINO' ? 'X' : '',
                                                    alignment: 'center'
                                                }
                                            ]
                                        ]
                                    },
                                    margin: [0, 0, 10, 0]
                                }
                            ]
                        },
                        {
                            width: '15%',
                            stack: [
                                { text: 'Feminino', bold: true, margin: [0, 0, 0, 0] },
                                {
                                    table: {
                                        widths: ['*'],
                                        heights: 13,
                                        body: [
                                            [
                                                {
                                                    text: this.sexo === 'FEMININO' ? 'X' : '',
                                                    alignment: 'center'
                                                }
                                            ]
                                        ]
                                    },
                                    margin: [0, 0, 10, 0]
                                }
                            ]
                        },
                        {
                            width: '34%',
                            stack: [
                                { text: 'Estado Civil', bold: true, margin: [0, 0, 0, 0] },
                                {
                                    table: {
                                        widths: ['*'],
                                        heights: 13,
                                        body: [
                                            [
                                                {
                                                    text: this.estadoCivil.toUpperCase()
                                                }
                                            ]
                                        ]
                                    },
                                    margin: [0, 0, 0, 0]
                                }
                            ]
                        }
                    ],
                    margin: [0, 0, 0, 5]
                },
                {
                    columns: [
                        {
                            width: '20%',
                            stack: [
                                { text: 'Nacionalidade', bold: true, margin: [0, 0, 0, 0] },
                                {
                                    table: {
                                        widths: ['*'],
                                        heights: 13,
                                        body: [
                                            [
                                                {
                                                    text: this.nacionalidade.toUpperCase()
                                                }
                                            ]
                                        ]
                                    },
                                    margin: [0, 0, 10, 0]
                                }
                            ]
                        },
                        {
                            width: '35%',
                            stack: [
                                { text: 'Naturalidade', bold: true, margin: [0, 0, 0, 0] },
                                {
                                    table: {
                                        widths: ['*'],
                                        heights: 13,
                                        body: [
                                            [
                                                {
                                                    text: this.naturalidade.toUpperCase()
                                                }
                                            ]
                                        ]
                                    },
                                    margin: [0, 0, 10, 0]
                                }
                            ]
                        },
                        {
                            width: '10%',
                            stack: [
                                { text: 'UF', bold: true, margin: [0, 0, 0, 0] },
                                {
                                    table: {
                                        widths: ['*'],
                                        heights: 13,
                                        body: [
                                            [
                                                {
                                                    text: this.uf.toUpperCase()
                                                }
                                            ]
                                        ]
                                    },
                                    margin: [0, 0, 10, 0]
                                }
                            ]
                        },
                        {
                            width: '34%',
                            stack: [
                                { text: 'E-mail', bold: true, margin: [0, 0, 0, 0] },
                                {
                                    table: {
                                        widths: ['*'],
                                        heights: 13,
                                        body: [
                                            [
                                                {
                                                    text: this.email?.slice(0, 30)
                                                }
                                            ]
                                        ]
                                    },
                                    margin: [0, 0, 0, 0]
                                }
                            ]
                        }
                    ],
                    margin: [0, 0, 0, 5]
                },
                {
                    columns: [
                        {
                            width: '49.5%',
                            stack: [
                                { text: 'Nome Mãe', bold: true, margin: [0, 0, 0, 0] },
                                {
                                    table: {
                                        widths: ['*'],
                                        heights: 13,
                                        body: [
                                            [
                                                {
                                                    text: this.nomeMae.toUpperCase()
                                                }
                                            ]
                                        ]
                                    },
                                    margin: [0, 0, 10, 0]
                                }
                            ]
                        },
                        {
                            width: '49.5%',
                            stack: [
                                { text: 'Nome Pai', bold: true, margin: [0, 0, 0, 0] },
                                {
                                    table: {
                                        widths: ['*'],
                                        heights: 13,
                                        body: [
                                            [
                                                {
                                                    text: this.nomePai.toUpperCase()
                                                }
                                            ]
                                        ]
                                    },
                                    margin: [0, 0, 0, 0]
                                }
                            ]
                        }
                    ],
                    margin: [0, 0, 0, 5]
                },
                {
                    columns: [
                        {
                            width: '37%',
                            stack: [
                                { text: 'Escolaridade', bold: true, margin: [0, 0, 0, 0] },
                                {
                                    table: {
                                        widths: ['*'],
                                        heights: 13,
                                        body: [
                                            [
                                                {
                                                    text: this.escolaridade.toUpperCase()
                                                }
                                            ]
                                        ]
                                    },
                                    margin: [0, 0, 10, 0]
                                }
                            ]
                        },
                        {
                            width: '31%',
                            stack: [
                                { text: 'Telefone 1', bold: true, margin: [0, 0, 0, 0] },
                                {
                                    table: {
                                        widths: ['*'],
                                        heights: 13,
                                        body: [
                                            [
                                                {
                                                    text: this.telefone1.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3')
                                                }
                                            ]
                                        ]
                                    },
                                    margin: [0, 0, 10, 0]
                                }
                            ]
                        },
                        {
                            width: '31%',
                            stack: [
                                { text: 'Telefone 2', bold: true, margin: [0, 0, 0, 0] },
                                {
                                    table: {
                                        widths: ['*'],
                                        heights: 13,
                                        body: [
                                            [
                                                {
                                                    text: this.telefone2.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3')
                                                }
                                            ]
                                        ]
                                    },
                                    margin: [0, 0, 0, 0]
                                }
                            ]
                        }
                    ],
                    margin: [0, 0, 0, 5]
                },

                { // Linha horizontal abaixo da imagem
                    canvas: this.createDottedLine(0, 0, 515, 0, 5),
                    margin: [0, 2, 0, 2] // margens em torno da linha
                },
                {
                    text: 'Endereço',
                    bold: true,
                    margin: [0, 0, 0, 5]
                },
                {
                    columns: [
                        {
                            width: '30%',
                            stack: [
                                { text: 'Cep', bold: true, margin: [0, 0, 0, 0] },
                                {
                                    table: {
                                        widths: ['*'],
                                        heights: 13,
                                        body: [
                                            [
                                                {
                                                    text: this.cep.replace(/^(\d{5})(\d{3})$/, '$1-$2')
                                                }
                                            ]
                                        ]
                                    },
                                    margin: [0, 0, 10, 0]
                                }
                            ]
                        },
                        {
                            width: '49%',
                            stack: [
                                { text: 'Rua', bold: true, margin: [0, 0, 0, 0] },
                                {
                                    table: {
                                        widths: ['*'],
                                        heights: 13,
                                        body: [
                                            [
                                                {
                                                    text: this.rua.toUpperCase()
                                                }
                                            ]
                                        ]
                                    },
                                    margin: [0, 0, 10, 0]
                                }
                            ]
                        },
                        {
                            width: '20%',
                            stack: [
                                { text: 'Número', bold: true, margin: [0, 0, 0, 0] },
                                {
                                    table: {
                                        widths: ['*'],
                                        heights: 13,
                                        body: [
                                            [
                                                {
                                                    text: this.numero.toUpperCase()
                                                }
                                            ]
                                        ]
                                    },
                                    margin: [0, 0, 0, 0]
                                }
                            ]
                        }
                    ],
                    margin: [0, 0, 0, 5]
                },
                {
                    columns: [
                        {
                            width: '39.5%',
                            stack: [
                                { text: 'Bairro', bold: true, margin: [0, 0, 0, 0] },
                                {
                                    table: {
                                        widths: ['*'],
                                        heights: 13,
                                        body: [
                                            [
                                                {
                                                    text: this.bairro.toUpperCase()
                                                }
                                            ]
                                        ]
                                    },
                                    margin: [0, 0, 10, 0]
                                }
                            ]
                        },
                        {
                            width: '59.5%',
                            stack: [
                                { text: 'Complemento', bold: true, margin: [0, 0, 0, 0] },
                                {
                                    table: {
                                        widths: ['*'],
                                        heights: 13,
                                        body: [
                                            [
                                                {
                                                    text: this.complemento.toUpperCase()
                                                }
                                            ]
                                        ]
                                    },
                                    margin: [0, 0, 0, 0]
                                }
                            ]
                        }
                    ],
                    margin: [0, 0, 0, 5]
                },
                {
                    columns: [
                        {
                            width: '39.5%',
                            stack: [
                                { text: 'Estado', bold: true, margin: [0, 0, 0, 0] },
                                {
                                    table: {
                                        widths: ['*'],
                                        heights: 13,
                                        body: [
                                            [
                                                {
                                                    text: this.estado.toUpperCase()
                                                }
                                            ]
                                        ]
                                    },
                                    margin: [0, 0, 10, 0]
                                }
                            ]
                        },
                        {
                            width: '59.5%',
                            stack: [
                                { text: 'Cidade', bold: true, margin: [0, 0, 0, 0] },
                                {
                                    table: {
                                        widths: ['*'],
                                        heights: 13,
                                        body: [
                                            [
                                                {
                                                    text: this.cidade.toUpperCase()
                                                }
                                            ]
                                        ]
                                    },
                                    margin: [0, 0, 0, 0]
                                }
                            ]
                        }
                    ],
                    margin: [0, 0, 0, 5]
                },

                { // Linha horizontal abaixo da imagem
                    canvas: this.createDottedLine(0, 0, 515, 0, 5),
                    margin: [0, 2, 0, 2] // margens em torno da linha
                },
                {
                    text: 'Ministério',
                    bold: true,
                    margin: [0, 0, 0, 10]
                },
                {
                    columns: [
                        {
                            width: '21%',
                            stack: [
                                { text: 'Batismo nas águas:', bold: true, margin: [0, 0, 0, 0] },
                            ]
                        },
                        {
                            width: '27%',
                            stack: [
                                {
                                    text: this.batismoAgua.toUpperCase(),
                                    color: 'gray',
                                    fontSize: 12,
                                    decoration: 'underline',
                                    bold: true,
                                    margin: [0, 0, 0, 0]
                                },
                            ]
                        },
                        {
                            width: '28%',
                            stack: [
                                { text: 'Batismo no Espírito Santo:', bold: true, margin: [0, 0, 0, 0] },
                            ]
                        },
                        {
                            width: '25%',
                            stack: [
                                {
                                    text: this.batismoEspiritoSanto.toUpperCase(),
                                    color: 'gray',
                                    fontSize: 12,
                                    decoration: 'underline',
                                    bold: true,
                                    margin: [0, 0, 0, 0]
                                },
                            ]
                        },
                    ],
                    margin: [0, 0, 0, 5]
                },
                {
                    columns: [
                        {
                            width: '15%',
                            bold: true,
                            stack: [
                                { text: 'Obreiro?', margin: [0, 5, 0, 0] }
                            ]
                        },
                        {
                            width: '5%',
                            bold: true,
                            stack: [
                                { text: 'Sim', margin: [0, 5, 0, 0] }
                            ]
                        },
                        {
                            width: '8%',
                            stack: [
                                {
                                    table: {
                                        widths: [25],
                                        heights: 13,
                                        body: [
                                            [
                                                {
                                                    text: this.isObreiro === 'SIM' ? 'X' : '',
                                                    alignment: 'center'
                                                }
                                            ]
                                        ]
                                    },
                                    margin: [0, 0, 10, 0]
                                }
                            ]
                        },
                        {
                            width: '5%',
                            bold: true,
                            stack: [
                                { text: 'Não', margin: [0, 5, 0, 0] }
                            ]
                        },
                        {
                            width: '20%',
                            stack: [
                                {
                                    table: {
                                        widths: [25],
                                        heights: 13,
                                        body: [
                                            [
                                                {
                                                    text: this.isObreiro === 'NAO' ? 'X' : '',
                                                    alignment: 'center'
                                                }
                                            ]
                                        ]
                                    },
                                    margin: [0, 0, 10, 0]
                                }
                            ]
                        },
                        {
                            width: '8%',
                            bold: true,
                            stack: [
                                { text: 'Cargo:', margin: [0, 5, 0, 0] }
                            ]
                        },
                        {
                            width: '40.5%',
                            stack: [
                                {
                                    table: {
                                        widths: ['*'],
                                        heights: 13,
                                        body: [
                                            [
                                                {
                                                    text: this.obreiroCargo.toUpperCase()
                                                }
                                            ]
                                        ]
                                    },
                                    margin: [0, 0, 10, 0]
                                }
                            ]
                        }
                    ],
                    margin: [0, 0, 0, 5]
                },
                {
                    columns: [
                        {
                            width: '15%',
                            bold: true,
                            stack: [
                                { text: 'Diácono', margin: [0, 5, 0, 0] }
                            ]
                        },
                        {
                            width: '13%',
                            bold: true,
                            stack: [
                                { text: 'Data Início:', margin: [0, 5, 0, 0] }
                            ]
                        },
                        {
                            width: '25%',
                            stack: [
                                {
                                    text: this.consDiacono.toUpperCase(),
                                    color: 'gray',
                                    fontSize: 12,
                                    decoration: 'underline',
                                    bold: true,
                                    margin: [0, 3, 0, 0]
                                }
                            ]
                        },
                        {
                            width: '6.5%',
                            bold: true,
                            stack: [
                                { text: 'Local:', margin: [0, 5, 0, 0] }
                            ]
                        },
                        {
                            width: '42%',
                            stack: [
                                {
                                    table: {
                                        widths: ['*'],
                                        heights: 13,
                                        body: [
                                            [
                                                {
                                                    text: this.localDiacono.toUpperCase()
                                                }
                                            ]
                                        ]
                                    },
                                    margin: [0, 0, 10, 0]
                                }
                            ]
                        }
                    ],
                    margin: [0, 0, 0, 5]
                },
                {
                    columns: [
                        {
                            width: '15%',
                            bold: true,
                            stack: [
                                { text: 'Presbítero', margin: [0, 5, 0, 0] }
                            ]
                        },
                        {
                            width: '13%',
                            bold: true,
                            stack: [
                                { text: 'Data Início:', margin: [0, 5, 0, 0] }
                            ]
                        },
                        {
                            width: '25%',
                            stack: [
                                {
                                    text: this.consPresbitero.toUpperCase(),
                                    color: 'gray',
                                    fontSize: 12,
                                    decoration: 'underline',
                                    bold: true,
                                    margin: [0, 3, 0, 0]
                                }
                            ]
                        },
                        {
                            width: '6.5%',
                            bold: true,
                            stack: [
                                { text: 'Local:', margin: [0, 5, 0, 0] }
                            ]
                        },
                        {
                            width: '42%',
                            stack: [
                                {
                                    table: {
                                        widths: ['*'],
                                        heights: 13,
                                        body: [
                                            [
                                                {
                                                    text: this.localPresbitero.toUpperCase()
                                                }
                                            ]
                                        ]
                                    },
                                    margin: [0, 0, 10, 0]
                                }
                            ]
                        }
                    ],
                    margin: [0, 0, 0, 5]
                },
                {
                    columns: [
                        {
                            width: '15%',
                            bold: true,
                            stack: [
                                { text: 'Evangelista', margin: [0, 5, 0, 0] }
                            ]
                        },
                        {
                            width: '13%',
                            bold: true,
                            stack: [
                                { text: 'Data Início:', margin: [0, 5, 0, 0] }
                            ]
                        },
                        {
                            width: '25%',
                            stack: [
                                {
                                    text: this.consEvangelista.toUpperCase(),
                                    color: 'gray',
                                    fontSize: 12,
                                    decoration: 'underline',
                                    bold: true,
                                    margin: [0, 3, 0, 0]
                                }
                            ]
                        },
                        {
                            width: '6.5%',
                            bold: true,
                            stack: [
                                { text: 'Local:', margin: [0, 5, 0, 0] }
                            ]
                        },
                        {
                            width: '42%',
                            stack: [
                                {
                                    table: {
                                        widths: ['*'],
                                        heights: 13,
                                        body: [
                                            [
                                                {
                                                    text: this.localEvangelista.toUpperCase()
                                                }
                                            ]
                                        ]
                                    },
                                    margin: [0, 0, 10, 0]
                                }
                            ]
                        }
                    ],
                    margin: [0, 0, 0, 5]
                },
                {
                    columns: [
                        {
                            width: '15%',
                            bold: true,
                            stack: [
                                { text: 'Pastor', margin: [0, 5, 0, 0] }
                            ]
                        },
                        {
                            width: '13%',
                            bold: true,
                            stack: [
                                { text: 'Data Início:', margin: [0, 5, 0, 0] }
                            ]
                        },
                        {
                            width: '25%',
                            stack: [
                                {
                                    text: this.consPastor.toUpperCase(),
                                    color: 'gray',
                                    fontSize: 12,
                                    decoration: 'underline',
                                    bold: true,
                                    margin: [0, 3, 0, 0]
                                }
                            ]
                        },
                        {
                            width: '6.5%',
                            bold: true,
                            stack: [
                                { text: 'Local:', margin: [0, 5, 0, 0] }
                            ]
                        },
                        {
                            width: '42%',
                            stack: [
                                {
                                    table: {
                                        widths: ['*'],
                                        heights: 13,
                                        body: [
                                            [
                                                {
                                                    text: this.localPastor.toUpperCase()
                                                }
                                            ]
                                        ]
                                    },
                                    margin: [0, 0, 10, 0]
                                }
                            ]
                        }
                    ],
                    margin: [0, 0, 0, 10]
                },
                {
                    columns: [
                        {
                            width: '33%',
                            stack: [
                                { text: 'Registro Campo Jd. América', bold: true, margin: [0, 0, 0, 0] },
                                {
                                    table: {
                                        widths: ['*'],
                                        heights: 13,
                                        body: [
                                            [
                                                {
                                                    text: this.regCampo.toUpperCase()
                                                }
                                            ]
                                        ]
                                    },
                                    margin: [0, 0, 10, 0]
                                }
                            ]
                        },
                        {
                            width: '33%',
                            stack: [
                                { text: 'Registro CADESGO', bold: true, margin: [0, 0, 0, 0] },
                                {
                                    table: {
                                        widths: ['*'],
                                        heights: 13,
                                        body: [
                                            [
                                                {
                                                    text: this.regCadesgo.toUpperCase()
                                                }
                                            ]
                                        ]
                                    },
                                    margin: [0, 0, 10, 0]
                                }
                            ]
                        },
                        {
                            width: '33.5%',
                            stack: [
                                { text: 'Registro CGADB', bold: true, margin: [0, 0, 0, 0] },
                                {
                                    table: {
                                        widths: ['*'],
                                        heights: 13,
                                        body: [
                                            [
                                                {
                                                    text: this.regCgadb.toUpperCase()
                                                }
                                            ]
                                        ]
                                    },
                                    margin: [0, 0, 0, 0]
                                }
                            ]
                        }
                    ],
                    margin: [0, 0, 0, 5]
                }
            ],

            // Rodapé
            footer(currentPage: any, pageCount: any) {
                return {
                    columns: [
                        { text: 'APP a1000ton Tecnologia - Todos os direitos reservados Copyright' + ' | ' + new Date().toLocaleString(), alignment: 'center', fontSize: 6 }
                    ]
                };
            },
            styles: {
                header: {
                    fontSize: 14,
                    bold: true,
                    margin: [0, 15, 0, 0]
                },
                subheader: {
                    fontSize: 14,
                    bold: true,
                    margin: [0, 15, 0, 0]
                }
            }
        }
        setTimeout(async () => {
            await this.salvarGoogleSheets();
        }, 100);
        this.urlPdf = '';
        this.pdfObj = pdfMake.createPdf(docDefinition);
        setTimeout(async () => {
            await this.pdfObj.getBuffer(async (buffer) => {
                const blob = new Blob([buffer], { type: 'application/pdf' });
                this.urlPdf = URL.createObjectURL(blob);
                this.isDesabledPdf = false;
            });
        }, 100);
    }

    public downloadPdf() {
        if (this.plt.is('cordova')) {
            this.pdfObj.getBase64(async (data) => {
                try {
                    let path = `pdf/myletter_${Date.now()}.pdf`;

                    const result = await Filesystem.writeFile({
                        path,
                        data: data,
                        directory: Directory.Documents,
                        recursive: true
                        // encoding: Encoding.UTF8
                    });
                    this.fileOpener.open(`${result.uri}`, 'application/pdf');

                } catch (e) {
                    console.error('Unable to write file', e);
                }
            });
        } else {
            const newTab = window.open(this.urlPdf, '_blank');
            if (newTab) {
                newTab.focus();
            } else { // O bloqueador de pop-ups pode estar ativo
                alert('Por favor, permita pop-ups para visualizar o PDF.');
            }
        }
        this.novoCadastro();
    }

    // Função para criar uma linha pontilhada
    private createDottedLine(x1: number, y1: number, x2: number, y2: number, dashLength: number) {
        const lines = [];
        const totalLength = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        const dashCount = Math.floor(totalLength / dashLength);

        for (let i = 0; i < dashCount; i++) {
            const startX = x1 + (x2 - x1) * (i / dashCount);
            const startY = y1 + (y2 - y1) * (i / dashCount);
            const endX = x1 + (x2 - x1) * ((i + 0.5) / dashCount);
            const endY = y1 + (y2 - y1) * ((i + 0.5) / dashCount);

            lines.push({
                type: 'line',
                x1: startX,
                y1: startY,
                x2: endX,
                y2: endY,
                lineWidth: 1.5,
                lineColor: 'black'
            });
        }
        return lines;
    }

    public async salvarGoogleSheets() {
        // Obtém a data e hora atual
        const dataAtual = new Date();

        // Formata a data e hora no formato desejado
        const dia = String(dataAtual.getDate()).padStart(2, '0'); // Preenche com zero à esquerda se necessário
        const mes = String(dataAtual.getMonth() + 1).padStart(2, '0'); // Mês começa do zero
        const ano = dataAtual.getFullYear();
        const horas = String(dataAtual.getHours()).padStart(2, '0');
        const minutos = String(dataAtual.getMinutes()).padStart(2, '0');
        const segundos = String(dataAtual.getSeconds()).padStart(2, '0');

        const response = await fetch("https://sheetdb.io/api/v1/9lv20jihax310", {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: "=ROW()-1",
                datainscricao: `${dia}/${mes}/${ano} ${horas}:${minutos}:${segundos}`,
                nome: this.nome,
                congregacao: this.congregacao,
                cpf: this.cpf,
                rg: this.rg,
                expedidorRg: this.expedidorRg,
                dataNascimento: this.dataNascimento,
                sexo: this.sexo,
                estadoCivil: this.estadoCivil,
                nacionalidade: this.nacionalidade,
                naturalidade: this.naturalidade,
                uf: this.uf,
                email: this.email,
                nomeMae: this.nomeMae,
                nomePai: this.nomePai,
                escolaridade: this.escolaridade,
                telefone1: this.telefone1,
                telefone2: this.telefone2,
                cep: this.cep,
                rua: this.rua,
                numero: this.numero,
                bairro: this.bairro,
                complemento: this.complemento,
                estado: this.estado,
                cidade: this.cidade,
                batismoAgua: this.batismoAgua,
                batismoEspiritoSanto: this.batismoEspiritoSanto,
                isObreiro: this.isObreiro,
                obreiroCargo: this.obreiroCargo,
                consDiacono: this.consDiacono,
                localDiacono: this.localDiacono,
                consPresbitero: this.consPresbitero,
                localPresbitero: this.localPresbitero,
                consEvangelista: this.consEvangelista,
                localEvangelista: this.localEvangelista,
                consPastor: this.consPastor,
                localPastor: this.localPastor,
                regCampo: this.regCampo,
                regCadesgo: this.regCadesgo,
                regCgadb: this.regCgadb
            }),
        });

        const data = await response.json();

        if (response.ok) {
            alert(`${data.created === 1 ? 'Cadastrado com sucesso' : 'Error ao cadastrar'}`);
        } else {
            alert('Erro ao cadastrar!')
        }
    }
}
