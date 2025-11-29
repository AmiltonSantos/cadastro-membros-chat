import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IMessage } from '../models/methods.models';
import { IonModal, AlertController, IonContent, Platform, ToastController, LoadingController } from '@ionic/angular';
import { CustomValidators } from 'src/utils/custom-validators';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(pdfMake as any).vfs = pdfFonts.vfs;

import { Filesystem, Directory } from '@capacitor/filesystem';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { HttpClient } from '@angular/common/http';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
    @ViewChild(IonContent, { static: false }) content!: IonContent;
    @ViewChild('modalImageCrop', { static: false }) modalImageCrop!: IonModal;

    imageChangedEvent: any = '';
    croppedImage: SafeUrl = '';

    public messages: IMessage[] = [];
    public loading: boolean = false;
    public isMensage: boolean = true;
    private index = -1;
    public pdfObj!: pdfMake.TCreatedPdf;
    private logoData!: string | ArrayBuffer | null;
    public photoPreview: string = '';
    private imagemBase64: string | null = null;
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
    private profissao: string = '';
    private naturalidade: string = '';
    private uf: string = '';
    private nomeMae: string = '';
    private nomePai: string = '';
    private escolaridade: string = '';
    private whatsapp: string = '';
    private cep: string = '';
    private rua: string = '';
    private complemento: string = '';
    private numero: string = '';
    private bairro: string = '';
    private estado: string = '';
    private cidade: string = '';
    private batismoAgua: string = '';
    private batismoEspSanto: string = '';
    private isObreiro: string = '';
    private cargo: string = '';
    private bodySheet: any;
    private loadingApp: any;

    form = new FormGroup({
        prompt: new FormControl('', [Validators.required, CustomValidators.noWhiteSpace])
    })

    private strCongregacao = [
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

    private strSexo = [
        { nome: 'MASCULINO' },
        { nome: 'FEMININO' }
    ];

    private strEstadoCivil = [
        { nome: 'CASADO(a)' },
        { nome: 'SOLTEIRO(a)' },
        { nome: 'DIVORCIADO(a)' },
        { nome: 'VIÚVO(a)' }
    ]

    private strEstados = [
        { sigla: 'GO', nome: 'GOIÁS' },
        { sigla: 'AC', nome: 'ACRE' },
        { sigla: 'AL', nome: 'ALAGOAS' },
        { sigla: 'AP', nome: 'AMAPÁ' },
        { sigla: 'AM', nome: 'AMAZONAS' },
        { sigla: 'BA', nome: 'BAHIA' },
        { sigla: 'CE', nome: 'CEARÁ' },
        { sigla: 'DF', nome: 'DISTRITO FEDERAL' },
        { sigla: 'ES', nome: 'ESPÍRITO SANTO' },
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

    private strEscolaridade = [
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

    private strObreiro = [
        { nome: 'SIM' },
        { nome: 'NAO' },
    ];

    private strCargo = [
        { nome: 'MEMBRO' },
        { nome: 'COOPERADOR' },
        { nome: 'DIÁCONO' },
        { nome: 'PRESBÍTERO' },
        { nome: 'EVANGELISTA' },
        { nome: 'PASTOR' }
    ];

    private mensagemBot = [
        { value: 0, mensagem: 'Qual seu nome completo ?' },
        { value: 1, mensagem: 'Onde você congrega ?' },
        { value: 2, mensagem: 'Qual o número do seu CPF ?' },
        { value: 3, mensagem: 'Qual o número do seu RG ?' },
        { value: 4, mensagem: 'Qual o data do nascimento ?' },
        { value: 5, mensagem: 'Masculino ou Feminino ?' },
        { value: 6, mensagem: 'Seu estado civil ?' },
        { value: 7, mensagem: 'Sua profissão ?' },
        { value: 9, mensagem: 'Cidade que você nasceu ?' },
        { value: 9, mensagem: 'Estado que você nasceu ?' },
        { value: 10, mensagem: 'Nome completo da mãe ?' },
        { value: 11, mensagem: 'Nome completo do pai ?' },
        { value: 12, mensagem: 'Sua escolaridade ?' },
        { value: 13, mensagem: 'Número do Whatsapp ?' },
        { value: 14, mensagem: 'Qual o seu CEP ?' },
        { value: 15, mensagem: 'Nome da sua rua ?' },
        { value: 16, mensagem: 'Complemento (Quadra, Lote) ?' },
        { value: 17, mensagem: 'Qual número da casa ?' },
        { value: 18, mensagem: 'Nome do bairro ?' },
        { value: 19, mensagem: 'Estado onde mora ?' },
        { value: 20, mensagem: 'Cidade onde mora ?' },
        { value: 21, mensagem: 'Qual a data batismo nas águas ?' },
        { value: 22, mensagem: 'Qual a data batismo no Espírito Santo ?' },
        { value: 23, mensagem: 'É obreiro ?' },
        { value: 24, mensagem: 'Cargo ?' },
    ];

    constructor(
        private alertController: AlertController,
        public fileOpener: FileOpener,
        public plt: Platform,
        private toastController: ToastController,
        private sanitizer: DomSanitizer,
        private cd: ChangeDetectorRef,
        private loadingController: LoadingController,
        public http: HttpClient) { }

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
        }, 3000);
    }

    private loadLocalAssetToBase64() {
        this.http.get('./assets/images/header-igreja.png', { responseType: 'blob' })
            .subscribe((res: Blob) => {
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
            
            if (this.index === 3) {
                (async () => {
                    this.cpf = prompt.trim();
                    this.bodySheet = await this.carregaBodySheet();
                    await this.newLoading('Verificando CPF...');
                    await this.salvarGoogleSheets(this.bodySheet);
                })();
            }

            let userMsg: IMessage = {
                sender: 'me',
                content: ''
            };
            this.messages.push(userMsg);
            this.typeText(String(prompt)?.toLocaleUpperCase().trim());

            const valoresVerificar = [2, 13, 14];
            this.isUsaInput = valoresVerificar.includes(this.index) ? 'numeric' : 'text';

            if (this.index === 1) {
                this.nome = String(prompt)?.toLocaleUpperCase().trim();
            } else if (this.index === 2) {
                this.congregacao = String(prompt)?.toLocaleUpperCase().trim();
            } else if (this.index === 4) {
                this.rg = prompt.trim();
            } else if (this.index === 5) {
                this.dataNascimento = String(prompt)?.toLocaleUpperCase().trim();
            } else if (this.index === 6) {
                this.sexo = String(prompt)?.toLocaleUpperCase().trim();
            } else if (this.index === 7) {
                this.estadoCivil = String(prompt)?.toLocaleUpperCase().trim();
            } else if (this.index === 8) {
                this.profissao = String(prompt)?.toLocaleUpperCase().trim();
            } else if (this.index === 9) {
                this.naturalidade = String(prompt)?.toLocaleUpperCase().trim();
            } else if (this.index === 10) {
                this.uf = String(prompt)?.toLocaleUpperCase().trim();
            } else if (this.index === 11) {
                this.nomeMae = String(prompt)?.toLocaleUpperCase().trim();
            } else if (this.index === 12) {
                this.nomePai = String(prompt)?.toLocaleUpperCase().trim();
            } else if (this.index === 13) {
                this.escolaridade = String(prompt)?.toLocaleUpperCase().trim();
            } else if (this.index === 14) {
                this.whatsapp = prompt.trim();
            } else if (this.index === 15) {
                this.cep = prompt.trim();
            } else if (this.index === 16) {
                this.rua = String(prompt)?.toLocaleUpperCase().trim();
            } else if (this.index === 17) {
                this.complemento = String(prompt)?.toLocaleUpperCase().trim();
            } else if (this.index === 18) {
                this.numero = String(prompt)?.toLocaleUpperCase().trim();
            } else if (this.index === 19) {
                this.bairro = String(prompt)?.toLocaleUpperCase().trim();
            } else if (this.index === 20) {
                this.estado = String(prompt)?.toLocaleUpperCase().trim();
            } else if (this.index === 21) {
                this.cidade = String(prompt)?.toLocaleUpperCase().trim();
            } else if (this.index === 22) {
                this.batismoAgua = String(prompt)?.toLocaleUpperCase().trim();
            } else if (this.index === 23) {
                this.batismoEspSanto = String(prompt)?.toLocaleUpperCase().trim();
            } else if (this.index === 24) {
                this.isObreiro = String(prompt)?.toLocaleUpperCase().trim();
            } else if (this.index === 25) {
                this.cargo = String(prompt)?.toLocaleUpperCase().trim();
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
                    } else if (this.index === 5) {
                        setTimeout(() => {
                            this.showAlert(this.mensagemBot[this.index].value, 'SEXO');
                        }, 300);
                    } else if (this.index === 6) {
                        setTimeout(() => {
                            this.showAlert(this.mensagemBot[this.index].value, 'ESTADO CIVIL');
                        }, 300);
                    } else if (this.index === 9) {
                        setTimeout(() => {
                            this.showAlert(this.mensagemBot[this.index].value, 'ESTADO ONDE NASCEU');
                        }, 300);
                    } else if (this.index === 12) {
                        setTimeout(() => {
                            this.showAlert(this.mensagemBot[this.index].value, 'ESCOLARIDADE');
                        }, 300);
                    } else if (this.index === 19) {
                        setTimeout(() => {
                            this.showAlert(this.mensagemBot[this.index].value, 'ESTADO');
                        }, 300);
                    } else if (this.index === 23) {
                        setTimeout(() => {
                            this.showAlert(this.mensagemBot[this.index].value, 'OBREIRO');
                        }, 300);
                    } else if (this.index === 24) {
                        setTimeout(() => {
                            this.showAlert(25, 'CARGO');
                        }, 300);
                    }
                    this.index++;
                }, 1000);

            } else {
                this.isEnabledButtons = true;
                this.loading = false;
                this.form.disable();
                this.content.scrollEvents = false;
                setTimeout(async () => {
                    await this.presentToast('middle', 'Cadastro concluído com sucesso...');
                    let botMsg: IMessage = {
                        sender: 'bot',
                        content: ''
                    };
                    this.messages.push(botMsg);
                    this.typeText('Cadastro concluído com sucesso...');
                    this.loading = false;
                }, 300);
            }

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
        } else if (numero === 6) {
            for (const str of this.strSexo) {
                inputs.push({
                    type: 'radio',
                    label: str.nome,
                    value: str.nome
                });
            }
        } else if (numero === 7) {
            for (const str of this.strEstadoCivil) {
                inputs.push({
                    type: 'radio',
                    label: str.nome,
                    value: str.nome
                });
            }
        } else if (numero === 10) {
            for (const str of this.strEstados) {
                inputs.push({
                    type: 'radio',
                    label: str.nome,
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
        } else if (numero === 20) {
            for (const str of this.strEstados) {
                inputs.push({
                    type: 'radio',
                    label: str.nome,
                    value: str.nome
                });
            }
        } else if (numero === 24) {
            for (const str of this.strObreiro) {
                inputs.push({
                    type: 'radio',
                    label: str.nome,
                    value: str.nome
                });
            }
        } else if (numero === 25) {
            for (const str of this.strCargo) {
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

    private  async carregaBodySheet(): Promise<any> {
        const body = {
            nome: this.nome,
            congregacao: this.congregacao,
            cpf: this.cpf,
            rg: this.rg,
            expedidorRg: this.expedidorRg,
            dataNascimento: this.dataNascimento,
            sexo: this.sexo,
            estadoCivil: this.estadoCivil,
            naturalidade: this.naturalidade,
            uf: this.uf,
            nomeMae: this.nomeMae,
            nomePai: this.nomePai,
            escolaridade: this.escolaridade,
            telefone1: this.whatsapp,
            cep: this.cep,
            rua: this.rua,
            numero: this.numero,
            bairro: this.bairro,
            estado: this.estado,
            cidade: this.cidade,
            batismoAgua: this.batismoAgua,
            isObreiro: this.isObreiro,
            imageBase64: this.imagemBase64,                // imagem já em Base64
            imageType: "image/jpeg",                       // ou "image/png"
            filename: `${this.nome}-${this.cpf}.jpg`       // nome do arquivo que será salvo no Drive
        };
 
        return body;
    }

    private async newLoading(message: string) {
        this.loadingApp = await this.loadingController.create({
            message: message,
            translucent: true,
        });
        await this.loadingApp?.present();
    }

    public async createPdf() {
        let content = [];

        await this.newLoading('Salvando...');
       
        try {
            if (!this.imagemBase64) {
                await this.touchAlertSemImagem();
                await this.loadingApp?.dismiss();
                return;
            }

            const logo = {
                image: this.logoData,
                width: 350,
                margin: [20, -25, 0, 0]
            };

            const layoutTable = {
                hLineWidth: () => 0.5, // espessura horizontal
                vLineWidth: () => 0.5, // espessura vertical
                hLineColor: () => 'black',
                vLineColor: () => 'black'
            };

            const molduraFolha = () => ({
                canvas: [
                    {
                        type: 'rect',
                        x: 5,
                        y: 5,
                        w: 390,
                        h: 555,
                        lineWidth: 2,
                        lineColor: 'black'
                    }
                ]
            });

            // Verifica se this.photoPreview existe e é uma string não vazia
            if (this.photoPreview) {
                content.push({
                    image: this.photoPreview ?? '',
                    width: 80, // Largura da imagem
                    height: 100, // Altura da imagem
                    margin: [9, -100, 0, -15]
                });
            } else {
                content.push({
                    text: 'Imagem não disponível',
                    alignment: 'center',
                    margin: [15, -70, 0, 0]
                });
            }

            const docDefinition: any = {
                pageOrientation: 'landscape',
                pageMargins: [10, 10, 10, 10], // Margens aumentadas

                watermark: {
                    text: 'AD MISSÃO JARDIM AMÉRICA',
                    color: 'red',
                    opacity: 0.05,
                    bold: true
                },

                content: [
                    // CONTEÚDO PRINCIPAL EM 2 COLUNAS
                    // === PRIMEIRA PÁGINA ===
                    {
                        columns: [
                            // COLUNA 1 (ESQUERDA) - FICHA DE CADASTRO
                            {
                                width: '49%',
                                margin: [5, 5, 5, 5], // Margem interna da coluna
                                stack: [
                                    molduraFolha(),

                                    // Conteúdo da coluna 1
                                    {
                                        stack: [
                                            // CONGREGAÇÃO
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
                                                        x2: 390, // largura da linha
                                                        y2: 0,
                                                        lineWidth: 1.5,
                                                        lineColor: 'black' // cor da linha
                                                    }
                                                ],
                                                margin: [5, 2, 0, 2] // margens em torno da linha
                                            },

                                            {
                                                text: 'FICHA DE CADASTRO',
                                                fontSize: 10,
                                                style: 'header',
                                                alignment: 'center',
                                                margin: [0, 2, 0, 0]
                                            },

                                            // BLOCO DA LINHA 2
                                            {
                                                columns: [
                                                    {
                                                        width: '79%', // Ajuste a largura conforme necessário
                                                        stack: [
                                                            // LINHA 2
                                                            {
                                                                text: 'CONGREGAÇÃO',
                                                                fontSize: 10,
                                                            },
                                                            {
                                                                table: {
                                                                    widths: [289],
                                                                    heights: 12,
                                                                    body: [
                                                                        [
                                                                            {
                                                                                text: this.congregacao.toUpperCase(),
                                                                                fontSize: 10,
                                                                                bold: true,
                                                                                heights: 12
                                                                            }
                                                                        ]
                                                                    ]
                                                                },
                                                                layout: layoutTable
                                                            },
                                                            {
                                                                text: 'Dados Pessoais',
                                                                bold: true,
                                                                fontSize: 10,
                                                                margin: [0, 2, 0, 2]
                                                            },

                                                            // LINHA 
                                                            {
                                                                columns: [
                                                                    {
                                                                        width: '31%',
                                                                        stack: [
                                                                            {
                                                                                text: 'CPF',
                                                                                fontSize: 10
                                                                            },
                                                                            {
                                                                                table: {
                                                                                    widths: [73],
                                                                                    heights: 12,
                                                                                    body: [
                                                                                        [
                                                                                            {
                                                                                                text: this.cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4').slice(0, 14),
                                                                                                fontSize: 10,
                                                                                                bold: true,
                                                                                                heights: 12
                                                                                            }
                                                                                        ]
                                                                                    ]
                                                                                },
                                                                                layout: layoutTable,
                                                                                margin: [0, 0, 0, 0]
                                                                            }
                                                                        ]
                                                                    },
                                                                    {
                                                                        width: '62%',
                                                                        stack: [
                                                                            {
                                                                                text: 'RG',
                                                                                fontSize: 10
                                                                            },
                                                                            {
                                                                                table: {
                                                                                    widths: [139],
                                                                                    heights: 12,
                                                                                    body: [
                                                                                        [
                                                                                            {
                                                                                                text: this.rg.toUpperCase().slice(0, 25),
                                                                                                fontSize: 10,
                                                                                                bold: true,
                                                                                                heights: 12
                                                                                            }
                                                                                        ]
                                                                                    ]
                                                                                },
                                                                                layout: layoutTable,
                                                                                margin: [0, 0, 0, 0]
                                                                            }
                                                                        ]
                                                                    },
                                                                    {
                                                                        width: '6%',
                                                                        stack: [
                                                                            {
                                                                                text: 'M',
                                                                                fontSize: 10,
                                                                                margin: [10, 0, 0, 0]
                                                                            },
                                                                            {
                                                                                table: {
                                                                                    widths: [20],
                                                                                    heights: 12,
                                                                                    body: [
                                                                                        [
                                                                                            {
                                                                                                text: this.sexo === 'MASCULINO' ? 'X' : '',
                                                                                                alignment: 'center',
                                                                                                fontSize: 10,
                                                                                                bold: true,
                                                                                                heights: 12
                                                                                            }
                                                                                        ]
                                                                                    ]
                                                                                },
                                                                                layout: layoutTable,
                                                                                margin: [0, 0, 0, 0]
                                                                            }
                                                                        ]
                                                                    },
                                                                    {
                                                                        width: '6%',
                                                                        stack: [
                                                                            {
                                                                                text: 'F',
                                                                                fontSize: 10,
                                                                                margin: [10, 0, 0, 0]
                                                                            },
                                                                            {
                                                                                table: {
                                                                                    widths: [20],
                                                                                    heights: 12,
                                                                                    body: [
                                                                                        [
                                                                                            {
                                                                                                text: this.sexo === 'FEMININO' ? 'X' : '',
                                                                                                alignment: 'center',
                                                                                                fontSize: 10,
                                                                                                bold: true,
                                                                                                heights: 12
                                                                                            }
                                                                                        ]
                                                                                    ]
                                                                                },
                                                                                layout: layoutTable,
                                                                                margin: [0, 0, 0, 0]
                                                                            }
                                                                        ]
                                                                    },
                                                                ],
                                                                margin: [0, 0, 0, 0]
                                                            }
                                                        ]
                                                    },
                                                    // Quadrado da foto
                                                    {
                                                        width: '25%', // Ajuste a largura conforme necessário
                                                        stack: [
                                                            {
                                                                canvas: [
                                                                    {
                                                                        type: 'rect',
                                                                        x: 10,
                                                                        y: -17,
                                                                        w: 80, // Largura do quadrado
                                                                        h: 100, // Altura do quadrado
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
                                                margin: [9, 5, 10, 1] // Margem em torno do conjunto de colunas
                                            },

                                            // LINHA 3
                                            {
                                                columns: [
                                                    {
                                                        width: '27%',
                                                        stack: [
                                                            {
                                                                text: 'Data de Nascimento',
                                                                fontSize: 10
                                                            },
                                                            {
                                                                table: {
                                                                    widths: [86],
                                                                    heights: 12,
                                                                    body: [
                                                                        [
                                                                            {
                                                                                text: this.dataNascimento.toUpperCase().slice(0, 10),
                                                                                fontSize: 10,
                                                                                bold: true,
                                                                                heights: 12
                                                                            }
                                                                        ]
                                                                    ]
                                                                },
                                                                layout: layoutTable,
                                                                margin: [0, 0, 0, 0]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        width: '77%',
                                                        stack: [
                                                            {
                                                                text: 'Nome',
                                                                fontSize: 10
                                                            },
                                                            {
                                                                table: {
                                                                    widths: [272],
                                                                    heights: 12,
                                                                    body: [
                                                                        [
                                                                            {
                                                                                text: this.nome.toUpperCase().slice(0, 46),
                                                                                fontSize: 10,
                                                                                bold: true,
                                                                                heights: 12
                                                                            }
                                                                        ]
                                                                    ]
                                                                },
                                                                layout: layoutTable,
                                                                margin: [0, 0, 0, 0]
                                                            }
                                                        ]
                                                    }
                                                ],
                                                margin: [9, 0, 0, 2],
                                                columnGap: 0 // Remove espaço entre colunas
                                            },

                                            // LINHA 4
                                            {
                                                columns: [
                                                    {
                                                        width: '53%',
                                                        stack: [
                                                            {
                                                                text: 'Nome Mãe',
                                                                fontSize: 10
                                                            },
                                                            {
                                                                table: {
                                                                    widths: [185],
                                                                    heights: 12,
                                                                    body: [
                                                                        [
                                                                            {
                                                                                text: this.nomeMae.toUpperCase().slice(0, 31),
                                                                                fontSize: 10,
                                                                                bold: true,
                                                                                heights: 12
                                                                            }
                                                                        ]
                                                                    ]
                                                                },
                                                                layout: layoutTable,
                                                                margin: [0, 0, 0, 0]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        width: '51%',
                                                        stack: [
                                                            {
                                                                text: 'Nome Pai',
                                                                fontSize: 10,
                                                                margin: [0, 0, 0, 0]
                                                            },
                                                            {
                                                                table: {
                                                                    widths: [175],
                                                                    heights: 12,
                                                                    body: [
                                                                        [
                                                                            {
                                                                                text: this.nomePai.toUpperCase().slice(0, 31),
                                                                                fontSize: 10,
                                                                                bold: true,
                                                                                heights: 12
                                                                            }
                                                                        ]
                                                                    ]
                                                                },
                                                                layout: layoutTable,
                                                                margin: [0, 0, 0, 0]
                                                            }
                                                        ]
                                                    }
                                                ],
                                                margin: [9, 0, 0, 2],
                                                columnGap: 0 // Remove espaço entre colunas
                                            },

                                            // LINHA 5
                                            {
                                                columns: [
                                                    {
                                                        width: '23%',
                                                        stack: [
                                                            {
                                                                text: 'Nacionalidade',
                                                                fontSize: 10
                                                            },
                                                            {
                                                                table: {
                                                                    widths: [71],
                                                                    heights: 12,
                                                                    body: [
                                                                        [
                                                                            {
                                                                                text: 'BRASILEIRO(A)',
                                                                                fontSize: 10,
                                                                                bold: true,
                                                                                heights: 12
                                                                            }
                                                                        ]
                                                                    ]
                                                                },
                                                                layout: layoutTable,
                                                                margin: [0, 0, 10, 0]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        width: '70%',
                                                        stack: [
                                                            {
                                                                text: 'Naturalidade',
                                                                fontSize: 10
                                                            },
                                                            {
                                                                table: {
                                                                    widths: [248],
                                                                    heights: 12,
                                                                    body: [
                                                                        [
                                                                            {
                                                                                text: this.naturalidade.toUpperCase().slice(0, 46),
                                                                                fontSize: 10,
                                                                                bold: true,
                                                                                heights: 12
                                                                            }
                                                                        ]
                                                                    ]
                                                                },
                                                                layout: layoutTable,
                                                                margin: [0, 0, 0, 0]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        width: '10%',
                                                        stack: [
                                                            {
                                                                text: 'UF',
                                                                fontSize: 10
                                                            },
                                                            {
                                                                table: {
                                                                    widths: [25],
                                                                    heights: 12,
                                                                    body: [
                                                                        [
                                                                            {
                                                                                text: this.uf.toUpperCase(),
                                                                                fontSize: 10,
                                                                                bold: true,
                                                                                heights: 12
                                                                            }
                                                                        ]
                                                                    ]
                                                                },
                                                                layout: layoutTable,
                                                                margin: [0, 0, 0, 0]
                                                            }
                                                        ]
                                                    }
                                                ],
                                                margin: [9, 0, 0, 2],
                                                columnGap: 0 // Remove espaço entre colunas
                                            },

                                            // LINHA 6
                                            {
                                                columns: [
                                                    {
                                                        width: '23%',
                                                        stack: [
                                                            {
                                                                text: 'Estado Civil',
                                                                fontSize: 10
                                                            },
                                                            {
                                                                table: {
                                                                    widths: [73],
                                                                    heights: 12,
                                                                    body: [
                                                                        [
                                                                            {
                                                                                text: this.estadoCivil.toUpperCase(),
                                                                                fontSize: 10,
                                                                                bold: true,
                                                                                heights: 12
                                                                            }
                                                                        ]
                                                                    ]
                                                                },
                                                                layout: layoutTable,
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        width: '30%',
                                                        stack: [
                                                            {
                                                                text: 'Escolaridade',
                                                                fontSize: 10
                                                            },
                                                            {
                                                                table: {
                                                                    widths: [100],
                                                                    heights: 12,
                                                                    body: [
                                                                        [
                                                                            {
                                                                                text: this.escolaridade.toUpperCase(),
                                                                                fontSize: 10,
                                                                                bold: true,
                                                                                heights: 12
                                                                            }
                                                                        ]
                                                                    ]
                                                                },
                                                                layout: layoutTable,
                                                                margin: [0, 0, 10, 0]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        width: '25%',
                                                        stack: [
                                                            {
                                                                text: 'WhatsApp',
                                                                fontSize: 10
                                                            },
                                                            {
                                                                table: {
                                                                    widths: [80],
                                                                    heights: 12,
                                                                    body: [
                                                                        [
                                                                            {
                                                                                text: this.whatsapp.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3').slice(0, 15),
                                                                                fontSize: 10,
                                                                                bold: true,
                                                                                heights: 12
                                                                            }
                                                                        ]
                                                                    ]
                                                                },
                                                                layout: layoutTable,
                                                                margin: [0, 0, 10, 0]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        width: '28%',
                                                        stack: [
                                                            {
                                                                text: 'Telefone 2',
                                                                fontSize: 10
                                                            },
                                                            {
                                                                table: {
                                                                    widths: [81],
                                                                    heights: 12,
                                                                    body: [
                                                                        [
                                                                            {
                                                                                text: '',
                                                                                bold: true,
                                                                                heights: 12
                                                                            }
                                                                        ]
                                                                    ]
                                                                },
                                                                layout: layoutTable,
                                                                margin: [0, 0, 10, 0]
                                                            }
                                                        ]
                                                    }
                                                ],
                                                margin: [9, 0, 0, 2],
                                                columnGap: 0 // Remove espaço entre colunas
                                            },

                                            // ENDEREÇO ===========================================================================================================
                                            { // Linha horizontal abaixo da imagem
                                                canvas: this.createDottedLine(0, 0, 383, 0, 5),
                                                margin: [9, 2, 0, 2] // margens em torno da linha
                                            },
                                            {
                                                text: 'Endereço',
                                                bold: true,
                                                fontSize: 10,
                                                margin: [9, 0, 0, 1]
                                            },

                                            // COLUNA 1
                                            {
                                                columns: [
                                                    {
                                                        width: '24%',
                                                        stack: [
                                                            {
                                                                text: 'Cep',
                                                                fontSize: 10
                                                            },
                                                            {
                                                                table: {
                                                                    widths: [76],
                                                                    heights: 12,
                                                                    body: [
                                                                        [
                                                                            {
                                                                                text: this.cep.replace(/^(\d{5})(\d{3})$/, '$1-$2').slice(0, 9),
                                                                                fontSize: 10,
                                                                                bold: true,
                                                                                heights: 12
                                                                            }
                                                                        ]
                                                                    ]
                                                                },
                                                                layout: layoutTable,
                                                                margin: [0, 0, 0, 0]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        width: '68%',
                                                        stack: [
                                                            {
                                                                text: 'Rua',
                                                                fontSize: 10
                                                            },
                                                            {
                                                                table: {
                                                                    widths: [242],
                                                                    heights: 12,
                                                                    body: [
                                                                        [
                                                                            {
                                                                                text: this.rua.toUpperCase().slice(0, 41),
                                                                                fontSize: 10,
                                                                                bold: true,
                                                                                heights: 12
                                                                            }
                                                                        ]
                                                                    ]
                                                                },
                                                                layout: layoutTable,
                                                                margin: [0, 0, 0, 0]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        width: '11%',
                                                        stack: [
                                                            {
                                                                text: 'Número',
                                                                fontSize: 10
                                                            },
                                                            {
                                                                table: {
                                                                    widths: [29],
                                                                    heights: 12,
                                                                    body: [
                                                                        [
                                                                            {
                                                                                text: this.numero.toUpperCase().slice(0, 4),
                                                                                fontSize: 10,
                                                                                bold: true,
                                                                                heights: 12
                                                                            }
                                                                        ]
                                                                    ]
                                                                },
                                                                layout: layoutTable,
                                                                margin: [0, 0, 0, 0]
                                                            }
                                                        ]
                                                    }
                                                ],
                                                margin: [9, 0, 0, 2],
                                                columnGap: 0 // Remove espaço entre colunas
                                            },

                                            // COLUNA 2
                                            {
                                                columns: [
                                                    {
                                                        width: '51%',
                                                        stack: [
                                                            {
                                                                text: 'Bairro',
                                                                fontSize: 10
                                                            },
                                                            {
                                                                table: {
                                                                    widths: [177],
                                                                    heights: 12,
                                                                    body: [
                                                                        [
                                                                            {
                                                                                text: this.bairro.toUpperCase().slice(0, 31),
                                                                                fontSize: 10,
                                                                                bold: true,
                                                                                heights: 12
                                                                            }
                                                                        ]
                                                                    ]
                                                                },
                                                                layout: layoutTable,
                                                                margin: [0, 0, 10, 0]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        width: '51%',
                                                        stack: [
                                                            {
                                                                text: 'Complemento (QUADRA, LOTE)',
                                                                fontSize: 10
                                                            },
                                                            {
                                                                table: {
                                                                    widths: [182],
                                                                    heights: 12,
                                                                    body: [
                                                                        [
                                                                            {
                                                                                text: this.complemento.toUpperCase().slice(0, 34),
                                                                                fontSize: 10,
                                                                                bold: true,
                                                                                heights: 12
                                                                            }
                                                                        ]
                                                                    ]
                                                                },
                                                                layout: layoutTable,
                                                                margin: [0, 0, 0, 0]
                                                            }
                                                        ]
                                                    }
                                                ],
                                                margin: [9, 0, 0, 2],
                                                columnGap: 0 // Remove espaço entre colunas
                                            },

                                            // COLUNA 3
                                            {
                                                columns: [
                                                    {
                                                        width: '40%',
                                                        stack: [
                                                            {
                                                                text: 'Estado',
                                                                fontSize: 10
                                                            },
                                                            {
                                                                table: {
                                                                    widths: [135],
                                                                    heights: 12,
                                                                    body: [
                                                                        [
                                                                            {
                                                                                text: this.estado.toUpperCase(),
                                                                                fontSize: 10,
                                                                                bold: true,
                                                                                heights: 12
                                                                            }
                                                                        ]
                                                                    ]
                                                                },
                                                                layout: layoutTable,
                                                                margin: [0, 0, 10, 0]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        width: '65%',
                                                        stack: [
                                                            {
                                                                text: 'Cidade',
                                                                fontSize: 10
                                                            },
                                                            {
                                                                table: {
                                                                    widths: [223],
                                                                    heights: 12,
                                                                    body: [
                                                                        [
                                                                            {
                                                                                text: this.cidade.toUpperCase().slice(0, 39),
                                                                                fontSize: 10,
                                                                                bold: true,
                                                                                heights: 12
                                                                            }
                                                                        ]
                                                                    ]
                                                                },
                                                                layout: layoutTable,
                                                                margin: [0, 0, 0, 0]
                                                            }
                                                        ]
                                                    }
                                                ],
                                                margin: [9, 0, 0, 2],
                                                columnGap: 0 // Remove espaço entre colunas
                                            },

                                            // MINISTERIO =========================================================================================
                                            { // Linha horizontal abaixo da imagem
                                                canvas: this.createDottedLine(0, 0, 383, 0, 5),
                                                margin: [9, 2, 0, 2] // margens em torno da linha
                                            },
                                            {
                                                text: 'Ministério',
                                                bold: true,
                                                fontSize: 10,
                                                margin: [9, 0, 0, 2]
                                            },

                                            // LINHA 1
                                            {
                                                columns: [
                                                    // Primeiro grupo - Batismo Águas
                                                    {
                                                        width: '25%',
                                                        stack: [
                                                            {
                                                                text: 'Batismo nas águas:',
                                                                fontSize: 10,
                                                                margin: [0, 3, 2, 0] // Ajuste vertical fino
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        width: '23%',
                                                        stack: [
                                                            {
                                                                table: {
                                                                    widths: [70],
                                                                    heights: 12,
                                                                    body: [
                                                                        [
                                                                            {
                                                                                text: this.batismoAgua.toUpperCase().slice(0, 10),
                                                                                fontSize: 10,
                                                                                bold: true,
                                                                            }
                                                                        ]
                                                                    ]
                                                                },
                                                                layout: layoutTable,
                                                                margin: [0, 0, 0, 0] // Reduz margem direita
                                                            }
                                                        ]
                                                    },
                                                    // Segundo grupo - Batismo Espírito Santo
                                                    {
                                                        width: '33%',
                                                        stack: [
                                                            {
                                                                text: 'Batismo no Espírito Santo:',
                                                                fontSize: 10,
                                                                margin: [0, 3, 2, 0] // Ajuste vertical fino
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        width: '24%',
                                                        stack: [
                                                            {
                                                                table: {
                                                                    widths: [70],
                                                                    heights: 12,
                                                                    body: [
                                                                        [
                                                                            {
                                                                                text: this.batismoEspSanto.toUpperCase().slice(0, 10),
                                                                                fontSize: 10,
                                                                                bold: true,
                                                                                heights: 12
                                                                            }
                                                                        ]
                                                                    ]
                                                                },
                                                                layout: layoutTable,
                                                                margin: [0, 0, 0, 0] // Sem margem direita
                                                            }
                                                        ]
                                                    }
                                                ],
                                                margin: [9, 0, 0, 3],
                                                columnGap: 0 // Remove espaço entre colunas
                                            },

                                            // LINHA 2
                                            {
                                                columns: [
                                                    {
                                                        width: '11%',
                                                        stack: [
                                                            {
                                                                text: 'Obreiro:',
                                                                fontSize: 10,
                                                                margin: [0, 3, 2, 0] // Ajuste vertical fino
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        width: '15%',
                                                        stack: [
                                                            {
                                                                table: {
                                                                    widths: [25],
                                                                    heights: 12,
                                                                    body: [
                                                                        [
                                                                            {
                                                                                text: this.isObreiro,
                                                                                alignment: 'center',
                                                                                bold: true,
                                                                                fontSize: 10,
                                                                                heights: 12
                                                                            }
                                                                        ]
                                                                    ]
                                                                },
                                                                layout: layoutTable,
                                                                margin: [0, 0, 0, 0]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        width: '9%',
                                                        stack: [
                                                            {
                                                                text: 'Cargo:',
                                                                fontSize: 10,
                                                                margin: [0, 3, 2, 0] // Ajuste vertical fino
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        width: '70%',
                                                        stack: [
                                                            {
                                                                table: {
                                                                    widths: [242],
                                                                    heights: 12,
                                                                    body: [
                                                                        [
                                                                            {
                                                                                text: this.cargo.toUpperCase(),
                                                                                fontSize: 10,
                                                                                bold: true,
                                                                                heights: 12
                                                                            }
                                                                        ]
                                                                    ]
                                                                },
                                                                layout: layoutTable,
                                                                margin: [0, 0, 0, 0]
                                                            }
                                                        ]
                                                    }
                                                ],
                                                margin: [9, 0, 0, 3],
                                                columnGap: 0 // Remove espaço entre colunas
                                            },

                                            // LINHA 3
                                            {
                                                columns: [
                                                    {
                                                        width: '25%',
                                                        stack: [
                                                            {
                                                                text: 'Data há Diácono:',
                                                                fontSize: 10,
                                                                margin: [0, 3, 2, 0] // Ajuste vertical fino
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        width: '27%',
                                                        stack: [
                                                            {
                                                                table: {
                                                                    widths: [80],
                                                                    heights: 12,
                                                                    body: [
                                                                        [
                                                                            {
                                                                                text: '',
                                                                                fontSize: 10,
                                                                                heights: 12
                                                                            }
                                                                        ]
                                                                    ]
                                                                },
                                                                layout: layoutTable,
                                                                margin: [0, 0, 0, 0]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        width: '8%',
                                                        stack: [
                                                            {
                                                                text: 'Local:',
                                                                fontSize: 10,
                                                                margin: [0, 3, 2, 0] // Ajuste vertical fino
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        width: '44%',
                                                        stack: [
                                                            {
                                                                table: {
                                                                    widths: [149],
                                                                    heights: 12,
                                                                    body: [
                                                                        [
                                                                            {
                                                                                text: '',
                                                                                fontSize: 10,
                                                                                heights: 12
                                                                            }
                                                                        ]
                                                                    ]
                                                                },
                                                                layout: layoutTable,
                                                                margin: [0, 0, 0, 0]
                                                            }
                                                        ]
                                                    }
                                                ],
                                                margin: [9, 0, 0, 3],
                                                columnGap: 0 // Remove espaço entre colunas
                                            },

                                            // LINHA 4
                                            {
                                                columns: [
                                                    {
                                                        width: '25%',
                                                        stack: [
                                                            {
                                                                text: 'Data há Presbítero:',
                                                                fontSize: 10,
                                                                margin: [0, 3, 2, 0] // Ajuste vertical fino
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        width: '27%',
                                                        stack: [
                                                            {
                                                                table: {
                                                                    widths: [80],
                                                                    heights: 12,
                                                                    body: [
                                                                        [
                                                                            {
                                                                                text: '',
                                                                                fontSize: 10,
                                                                                heights: 12
                                                                            }
                                                                        ]
                                                                    ]
                                                                },
                                                                layout: layoutTable,
                                                                margin: [0, 0, 0, 0]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        width: '8%',
                                                        stack: [
                                                            {
                                                                text: 'Local:',
                                                                fontSize: 10,
                                                                margin: [0, 3, 2, 0] // Ajuste vertical fino
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        width: '44%',
                                                        stack: [
                                                            {
                                                                table: {
                                                                    widths: [149],
                                                                    heights: 12,
                                                                    body: [
                                                                        [
                                                                            {
                                                                                text: '',
                                                                                fontSize: 10,
                                                                                heights: 12
                                                                            }
                                                                        ]
                                                                    ]
                                                                },
                                                                layout: layoutTable,
                                                                margin: [0, 0, 0, 0]
                                                            }
                                                        ]
                                                    }
                                                ],
                                                margin: [9, 0, 0, 3],
                                                columnGap: 0 // Remove espaço entre colunas
                                            },

                                            // LINHA 5
                                            {
                                                columns: [
                                                    {
                                                        width: '25%',
                                                        stack: [
                                                            {
                                                                text: 'Data há Evangelista:',
                                                                fontSize: 10,
                                                                margin: [0, 3, 2, 0] // Ajuste vertical fino
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        width: '27%',
                                                        stack: [
                                                            {
                                                                table: {
                                                                    widths: [80],
                                                                    heights: 12,
                                                                    body: [
                                                                        [
                                                                            {
                                                                                text: '',
                                                                                fontSize: 10,
                                                                                heights: 12
                                                                            }
                                                                        ]
                                                                    ]
                                                                },
                                                                layout: layoutTable,
                                                                margin: [0, 0, 0, 0]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        width: '8%',
                                                        stack: [
                                                            {
                                                                text: 'Local:',
                                                                fontSize: 10,
                                                                margin: [0, 3, 2, 0] // Ajuste vertical fino
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        width: '44%',
                                                        stack: [
                                                            {
                                                                table: {
                                                                    widths: [149],
                                                                    heights: 12,
                                                                    body: [
                                                                        [
                                                                            {
                                                                                text: '',
                                                                                fontSize: 10,
                                                                                heights: 12
                                                                            }
                                                                        ]
                                                                    ]
                                                                },
                                                                layout: layoutTable,
                                                                margin: [0, 0, 0, 0]
                                                            }
                                                        ]
                                                    }
                                                ],
                                                margin: [9, 0, 0, 3],
                                                columnGap: 0 // Remove espaço entre colunas
                                            },

                                            // LINHA 6
                                            {
                                                columns: [
                                                    {
                                                        width: '25%',
                                                        stack: [
                                                            {
                                                                text: 'Data há Pastor: ',
                                                                fontSize: 10,
                                                                margin: [0, 3, 2, 0] // Ajuste vertical fino
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        width: '27%',
                                                        stack: [
                                                            {
                                                                table: {
                                                                    widths: [80],
                                                                    heights: 12,
                                                                    body: [
                                                                        [
                                                                            {
                                                                                text: '',
                                                                                fontSize: 10,
                                                                                heights: 12
                                                                            }
                                                                        ]
                                                                    ]
                                                                },
                                                                layout: layoutTable,
                                                                margin: [0, 0, 0, 0]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        width: '8%',
                                                        stack: [
                                                            {
                                                                text: 'Local:',
                                                                fontSize: 10
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        width: '44%',
                                                        stack: [
                                                            {
                                                                table: {
                                                                    widths: [149],
                                                                    heights: 12,
                                                                    body: [
                                                                        [
                                                                            {
                                                                                text: '',
                                                                                fontSize: 10,
                                                                                heights: 12
                                                                            }
                                                                        ]
                                                                    ]
                                                                },
                                                                layout: layoutTable,
                                                                margin: [0, 0, 0, 0]
                                                            }
                                                        ]
                                                    }
                                                ],
                                                margin: [9, 0, 0, 3],
                                                columnGap: 0 // Remove espaço entre colunas
                                            },

                                            // LINHA 7
                                            {
                                                columns: [
                                                    {
                                                        width: '36%',
                                                        stack: [
                                                            {
                                                                text: 'Registro Campo Jd. América',
                                                                fontSize: 10
                                                            },
                                                            {
                                                                table: {
                                                                    widths: [123],
                                                                    heights: 12,
                                                                    body: [
                                                                        [
                                                                            {
                                                                                text: '',
                                                                                fontSize: 10,
                                                                                heights: 12
                                                                            }
                                                                        ]
                                                                    ]
                                                                },
                                                                layout: layoutTable,
                                                                margin: [0, 0, 0, 0]
                                                            }
                                                        ]
                                                    },

                                                    {
                                                        width: '33%',
                                                        stack: [
                                                            {
                                                                text: 'Registro CADESGO',
                                                                fontSize: 10
                                                            },
                                                            {
                                                                table: {
                                                                    widths: [112],
                                                                    heights: 12,
                                                                    body: [
                                                                        [
                                                                            {
                                                                                text: '',
                                                                                fontSize: 10,
                                                                                heights: 12
                                                                            }
                                                                        ]
                                                                    ]
                                                                },
                                                                layout: layoutTable,
                                                                margin: [0, 0, 0, 0]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        width: '35%',
                                                        stack: [
                                                            {
                                                                text: 'Registro CGADB',
                                                                fontSize: 10
                                                            },
                                                            {
                                                                table: {
                                                                    widths: [115],
                                                                    heights: 12,
                                                                    body: [
                                                                        [
                                                                            {
                                                                                text: '',
                                                                                fontSize: 10,
                                                                                heights: 12
                                                                            }
                                                                        ]
                                                                    ]
                                                                },
                                                                layout: layoutTable,
                                                                margin: [0, 0, 0, 0]
                                                            }
                                                        ]
                                                    }
                                                ],
                                                margin: [9, 0, 0, 2],
                                                columnGap: 0 // Remove espaço entre colunas
                                            },
                                        ],
                                        // Margem interna do conteúdo dentro da moldura
                                        margin: [0, -520, 0, 0] // Ajustado para nova altura
                                    }
                                ]
                            },

                            // COLUNA 2 (DIREITA) - TERMO DE AUTORIZAÇÃO
                            {
                                width: '49%',
                                margin: [5, 5, 5, 5], // Margem interna da coluna
                                stack: [
                                    // Moldura para a coluna 2
                                    molduraFolha(),

                                    // Conteúdo da coluna 2
                                    {
                                        stack: [
                                            {
                                                text: '(Continuação da Ficha de Cadastro para Obreiros e Membros da IEADMM-Jd. América..............Fl 02)',
                                                alignment: 'center',
                                                bold: true,
                                                fontSize: 8.3,
                                                decoration: 'underline',
                                                margin: [9, 0, -10, 40]
                                            },
                                            {
                                                text: 'DECLARAÇÃO E TERMO DE AUTORIZAÇÃO',
                                                bold: true,
                                                style: 'header',
                                                alignment: 'center',
                                                margin: [9, 0, 0, 40]
                                            },
                                            {
                                                text: 'I – DÍZIMOS, OFERTAS E DOAÇÕES',
                                                bold: true,
                                                style: 'header',
                                                margin: [20, 0, 0, 20]
                                            },
                                            {
                                                text: 'Pelo presente termo, eu acima identificado, declaro para os devidos fins e a quem possa interessar que as contribuições como os dízimos, as ofertas e outras doações feitas por mim à Igreja Evangélica Assembleia de Deus Ministério Missão – Jardim América, são voluntárias, e que em hipótese alguma, nem no presente e no futuro, reclamarei a devolução do que por mim foi doado.',
                                                alignment: 'justify',
                                                margin: [20, 0, 0, 20]
                                            },
                                            {
                                                text: 'II – USO DE IMAGEM, VOZ E CESSÃO DE DIREITO',
                                                bold: true,
                                                style: 'header',
                                                margin: [20, 0, 0, 20]
                                            },
                                            {
                                                text: 'Declaro ainda, com base no art. 29 da Lei de Direitos Autorais, que AUTORIZO de forma gratuita e sem qualquer ônus, a Igreja Evangélica Assembleia de Deus Ministério Missão – Jardim América, a utilização de minha(s) imagem(ns) e/ou voz e/ou de informações pessoais na obra, e em sua divulgação, se houver, em todos os meios de divulgação possíveis, quer sejam na mídia impressa (livros, catálogos, revistas, jornais, entre outros), televisiva (propagandas para televisão aberta e/ou fechas, vídeos, filmes, entre outros), radiofônica (programas de rádio/podcasts), internet, banco de dados informatizados, multimídia, entre outros, e nos meios de comunicação interna, como jornais e periódicos em geral, na forma de impresso, voz e imagem.',
                                                alignment: 'justify',
                                                margin: [20, 0, 0, 10]
                                            },
                                            {
                                                text: 'A presente autorização e cessão são de natureza gratuita, firmadas em caráter irrevogável e irretratável e por prazo indeterminado, cujos direitos e obrigações vinculam seus respectivos herdeiros e sucessores consoante as regras previstas na Lei 9.610/98 (Lei sobre Direitos Autorais e outras providências).',
                                                alignment: 'justify',
                                                margin: [20, 0, 0, 0]
                                            }
                                        ],
                                        // Margem interna do conteúdo dentro da moldura
                                        margin: [0, -550, 0, 0] // Ajustado para nova altura
                                    }
                                ]
                            }
                        ],
                        // Espaço entre as colunas
                        columnGap: 20
                    },

                    // === QUEBRA DE PÁGINA ===
                    {
                        text: '',
                        pageBreak: 'after'
                    },

                    // === SEGUNDA PÁGINA ===
                    {
                        columns: [
                            // COLUNA 1 (ESQUERDA) - SEGUNDA PÁGINA
                            {
                                width: '49%',
                                margin: [5, 5, 5, 5],
                                stack: [
                                    molduraFolha(),

                                    {
                                        stack: [
                                            {
                                                text: 'TERMO DE CONSENTIMENTO PARA TRATAMENTO DE DADOS PESSOAIS',
                                                style: 'header',
                                                fontSize: 11,
                                                alignment: 'center',
                                                margin: [9, 0, 0, 5]
                                            },
                                            {
                                                text: '(Lei 13.709 – LGPD)',
                                                style: 'header',
                                                fontSize: 11,
                                                alignment: 'center',
                                                margin: [9, 0, 0, 10]
                                            },
                                            {
                                                width: '95%',
                                                table: {
                                                    widths: ['*'],
                                                    body: [
                                                        [
                                                            {
                                                                text: [
                                                                    { text: 'IGREJA EVANGELICA ASSEMBLEIA DE DEUS MINISTÉRIO MISSÃO - CAMPO JARDIM AMÉRICA, situada na Rua C-160, Qd 371, Lt 17/18, CEP 74255-130, Setor Jardim América, Goiânia-GO,', bold: true },
                                                                    { text: ' doravante denominado(a)' },
                                                                    { text: ' CONTROLADORA.', bold: true }
                                                                ],
                                                                alignment: 'justify',
                                                                margin: [2, 2, 2, 2]
                                                            }
                                                        ]
                                                    ]
                                                },
                                                layout: layoutTable,
                                                margin: [15, 0, 0, 5]
                                            },
                                            {
                                                width: '95%',
                                                table: {
                                                    widths: ['*'],
                                                    body: [
                                                        [
                                                            {
                                                                text: [
                                                                    { text: `Nome: ${this.nome.toUpperCase().slice(0, 46)} `, bold: true },
                                                                    { text: 'nacionalidade: BRASILEIRO(A), estado civil: ' },
                                                                    { text: this.estadoCivil, bold: true },
                                                                    { text: ' profissão: ' },
                                                                    { text: this.profissao.toUpperCase(), bold: true },
                                                                    { text: ' , RG nº: ' },
                                                                    { text: this.rg, bold: true },
                                                                    { text: ' inscrito(a) CPF/MF sob o nº ' },
                                                                    { text: this.cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4').slice(0, 14), bold: true },
                                                                    { text: ' residente e domiciliado(a) na ' },
                                                                    { text: `${this.rua.toUpperCase().slice(0, 41)}, ${this.bairro.slice(0, 31)}, ${this.numero}`, bold: true },
                                                                    { text: ' Cidade: ' },
                                                                    { text: this.cidade, bold: true },
                                                                    { text: ' Estado: ' },
                                                                    { text: this.estado, bold: true },
                                                                    { text: ' CEP: ' },
                                                                    { text: this.cep.replace(/^(\d{5})(\d{3})$/, '$1-$2').slice(0, 9), bold: true },
                                                                    { text: ' doravante denominado(a) ' },
                                                                    { text: 'TITULAR.', bold: true }
                                                                ],
                                                                alignment: 'justify',
                                                                margin: [2, 2, 2, 2]
                                                            }
                                                        ]
                                                    ]
                                                },
                                                layout: layoutTable,
                                                margin: [15, 0, 0, 5]
                                            },
                                            {
                                                text: 'Este termo de consentimento foi elaborado em conformidade com a lei geral de proteção de dados. Consoante ao artigo 5º inciso XII da Lei 13.709, este documento viabiliza a manifestação livre, informada e inequívoca, pela qual o titular/ responsável concorda com o tratamento de seus dados pessoais e os dados do menor sob os seus cuidados, para as finalidades a seguir determinadas:',
                                                italics: true,
                                                alignment: 'justify',
                                                margin: [50, 0, 0, 5]
                                            },
                                            {
                                                text: 'PARÁGRAFO PRIMEIRO - DO CONSENTIMENTO',
                                                style: 'header',
                                                alignment: 'left',
                                                margin: [15, 0, 0, 5]
                                            },
                                            {
                                                text: [
                                                    { text: 'Ao assinar este termo o ' },
                                                    { text: 'TITULAR ', bold: true },
                                                    { text: 'concorda que a ' },
                                                    { text: ' CONTROLADORA, ', bold: true },
                                                    { text: 'proceda com o tratamento de seus dados.' },
                                                ],
                                                alignment: 'justify',
                                                margin: [15, 0, 0, 5]
                                            },
                                            {
                                                text: 'Entende-se por tratamento de acordo com o artigo 5º inciso X, a coleta, produção, recepção, classificação, utilização, acesso, reprodução, transmissão, distribuição, processamento, arquivamento, armazenamento, eliminação, avaliação ou controle da informação, modificação, comunicação, transferência, difusão ou extração.',
                                                alignment: 'justify',
                                                margin: [15, 0, 0, 5]
                                            },
                                            {
                                                text: 'PARÁGRAFO SEGUNDO - DADOS PESSOAIS',
                                                style: 'header',
                                                alignment: 'left',
                                                margin: [15, 0, 0, 5]
                                            },
                                            {
                                                text: 'Poderão ser tratados, mediante anuência expressa do titular/responsável, os seguintes dados pessoais, pelo(a) controlador(a):',
                                                alignment: 'justify',
                                                margin: [15, 0, 0, 5]
                                            },
                                            {
                                                ul: [
                                                    'Nome, RG, CPF, endereço, status civil, e-mail, telefone, histórico pessoal e congregacional.'
                                                ],
                                                margin: [15, 0, 0, 10]
                                            }
                                            // ADICIONE MAIS CONTEÚDO AQUI SE NECESSÁRIO
                                        ],
                                        margin: [0, -550, 0, 0]
                                    }
                                ]
                            },

                            // COLUNA 2 (DIREITA) - SEGUNDA PÁGINA
                            {
                                width: '49%',
                                margin: [5, 5, 5, 5],
                                stack: [
                                    molduraFolha(),

                                    {
                                        stack: [
                                            {
                                                text: '(Cont. do termo de consentimento para tratamento de dados pessoais (lei 13.709-LGPD)........Fl 02)',
                                                alignment: 'center',
                                                bold: true,
                                                fontSize: 8.1,
                                                decoration: 'underline',
                                                margin: [15, 0, -10, 20]
                                            },
                                            {
                                                text: 'PARÁGRAFO TERCEIRO - FINALIDADE DO TRATAMENTO',
                                                style: 'header',
                                                alignment: 'left',
                                                margin: [15, 0, 0, 10]
                                            },
                                            {
                                                text: 'Em atendimento ao artigo 8º §4 este termo guarda finalidade determinada, sendo que os dados serão utilizados especificamente para fins de:',
                                                alignment: 'justify',
                                                margin: [15, 0, 0, 5]
                                            },
                                            {
                                                ul: [
                                                    'Cadastro.'
                                                ],
                                                margin: [15, 0, 0, 5]
                                            },
                                            {
                                                ul: [
                                                    'Elaboração de relatórios e pareceres informativos.'
                                                ],
                                                margin: [15, 0, 0, 5]
                                            },
                                            {
                                                ul: [
                                                    'Quando necessário para atender aos interesses legítimos do controlador ou de terceiros, exceto no caso de prevalecerem direitos e liberdades fundamentais do titular que exijam a proteção dos dados pessoais;'
                                                ],
                                                margin: [15, 0, 0, 5]
                                            },
                                            {
                                                ul: [
                                                    'Para a utilização e divulgação em mídia impressa ou digital, exceto os dados sensíveis, com vistas à promoção da pregação do evangelho bem como à realização dos trabalhos relacionados à comunidade religiosa da qual o titular faça parte;'
                                                ],
                                                margin: [15, 0, 0, 5]
                                            },
                                            {
                                                ul: [
                                                    'Para o exercício regular de direitos em processo judicial, administrativo ou arbitral;'
                                                ],
                                                margin: [15, 0, 0, 5]
                                            },
                                            {
                                                ul: [
                                                    'Para a proteção da vida ou da incolumidade física do titular ou de terceiros.'
                                                ],
                                                margin: [15, 0, 0, 10]
                                            },
                                            {
                                                text: 'PARÁGRAFO QUARTO - SEGURANÇA DOS DADOS',
                                                style: 'header',
                                                alignment: 'left',
                                                margin: [15, 0, 0, 5]
                                            },
                                            {
                                                text: 'A Controladora responsabiliza-se pela manutenção de medidas de segurança, técnicas e administrativas aptas a proteger os dados pessoais de acessos não autorizados e de situações acidentais ou ilícitas de destruição, perda, alteração, comunicação ou qualquer forma de tratamento inadequado ou ilícito.',
                                                alignment: 'justify',
                                                margin: [15, 0, 0, 10]
                                            },
                                            {
                                                text: [
                                                    {
                                                        text: `${this.cidade} - ${this.estado}`,
                                                        decoration: 'underline'
                                                    },
                                                    { text: ', ' },
                                                    {
                                                        text: new Date().toLocaleDateString('pt-BR', { day: 'numeric' }),
                                                        decoration: 'underline'
                                                    },
                                                    { text: ' DE ' },
                                                    {
                                                        text: new Date().toLocaleDateString('pt-BR', { month: 'long' }).toUpperCase(),
                                                        decoration: 'underline'
                                                    },
                                                    { text: ' DE ' },
                                                    {
                                                        text: new Date().toLocaleDateString('pt-BR', { year: 'numeric' }),
                                                        decoration: 'underline'
                                                    }
                                                ],
                                                alignment: 'right',
                                                fontSize: 10,
                                                margin: [0, 0, 0, 20]
                                            },
                                            {
                                                columns: [
                                                    {
                                                        width: '50%',
                                                        stack: [
                                                            {
                                                                text: '_____________________________', // Linha para assinatura
                                                                alignment: 'center',
                                                                margin: [0, 0, 0, 2]
                                                            },
                                                            {
                                                                text: 'DIRIGENTE/SECRETÁRIO',
                                                                alignment: 'center',
                                                                fontSize: 10,
                                                                margin: [0, 0, 0, 0]
                                                            }
                                                        ],
                                                        alignment: 'center'
                                                    },
                                                    {
                                                        width: '50%',
                                                        stack: [
                                                            {
                                                                text: '_____________________________', // Linha para assinatura
                                                                alignment: 'center',
                                                                margin: [0, 0, 0, 0]
                                                            },
                                                            {
                                                                text: 'OBREIRO/MEMBRO',
                                                                alignment: 'center',
                                                                fontSize: 10,
                                                                margin: [0, 0, 0, 0]
                                                            }
                                                        ],
                                                        alignment: 'center'
                                                    }
                                                ],
                                                margin: [10, 0, 0, 20],
                                                columnGap: 0 // Remove espaço entre colunas
                                            },
                                            {
                                                stack: [
                                                    {
                                                        text: '_________________________', // Linha para assinatura
                                                        alignment: 'center',
                                                        margin: [9, 0, 0, 0]
                                                    },
                                                    {
                                                        text: 'IEADMM-JD AMÉRICA',
                                                        alignment: 'center',
                                                        fontSize: 10,
                                                        margin: [9, 0, 0, 0]
                                                    }
                                                ],
                                                alignment: 'center'
                                            }
                                        ],
                                        margin: [0, -550, 0, 0]
                                    }
                                ]
                            }
                        ],
                        columnGap: 20
                    }
                ],

                // Rodapé
                footer(currentPage: any, pageCount: any) {
                    return {
                        columns: [
                            {
                                text: 'AD Missão Jardim América Goiânia - GO. Todos os direitos reservados' + ' | ' + new Date().toLocaleString(),
                                alignment: 'center',
                                fontSize: 6,
                                margin: [0, -7, 0, 0]
                            }
                        ],
                        columnGap: 20
                    };
                },
                styles: {
                    header: {
                        fontSize: 12,
                        bold: true
                    }
                }
            };

            await this.salvarGoogleSheets(this.bodySheet);

            this.urlPdf = '';
            this.pdfObj = pdfMake.createPdf(docDefinition);

            setTimeout(() => {
                this.pdfObj.getBuffer(async (buffer) => {
                    const blob = new Blob([buffer], { type: 'application/pdf' });
                    this.urlPdf = URL.createObjectURL(blob);
                    this.isDesabledPdf = false;
                });
            }, 100);

            await this.loadingApp.dismiss();
        } catch (err) {
            await this.loadingApp.dismiss();
            console.error(err);
            await this.presentToast('middle', 'Erro ao gerar pdf!');
        }
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

    public async recortarImagem() {
        await this.modalImageCrop.present();
    }

    private async salvarGoogleSheets(body: any) {
        try {
            const response = await fetch('api/enviarImagem', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const data = await response.json();

            if (data.success) {
                await this.presentToast('middle', 'Salvo com sucesso!');
                await this.loadingApp?.dismiss();
            } else {
                if (data?.status === 1) {
                    await this.loadingApp?.dismiss();
                    const alert = await this.alertController.create({
                        message: `${data?.message}`,
                        backdropDismiss: false,
                        buttons: [
                            {
                                text: 'NOVO CADASTRO',
                                cssClass: 'salvarButton',
                                handler: () => {
                                    this.novoCadastro();
                                }
                            }
                        ]
                    });
                    await alert.present();
                } else if (data?.status === 2) {
                    await this.loadingApp?.dismiss();
                    return;
                } else {
                    await this.presentToast('middle', 'Erro ao cadastrar!');
                    await this.loadingApp?.dismiss();
                }
            }
        } catch (err) {
            console.error(err);
            await this.loadingApp?.dismiss();
            await this.presentToast('middle', 'Erro ao salvar no google drive!');
        }
    }

    private async presentToast(position: 'top' | 'middle' | 'bottom', msg: string) {
        const toast = await this.toastController.create({
            message: msg,
            duration: 1500,
            position: position,
        });

        await toast.present();
    }

    public async takePicture() {
        try {
            const image = await Camera.getPhoto({
                quality: 90,
                allowEditing: true,
                resultType: CameraResultType.Uri,
                source: CameraSource.Camera,
                promptLabelHeader: 'Tirar foto',
                promptLabelPhoto: 'Camera',
                promptLabelPicture: 'Galeria'
            });

            let imageUrl = image.webPath;

            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';

            // Adicionar o listener de evento
            input.addEventListener('change', (event: any) => {
                this.fileChangeEvent(event);
                this.cd.detectChanges();
            });

            // Criar um objeto File a partir da URL da imagem
            const file = await fetch(imageUrl!).then(res => res.blob()).then(blob => new File([blob], 'photo.jpg', { type: blob.type }));

            // Criar um objeto DataTransfer e adicionar o arquivo
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);

            input.files = dataTransfer.files;

            // Criar o evento de mudança
            const event = new Event('change', {
                bubbles: true,
                cancelable: false,
                composed: false
            });

            // Disparar o evento de mudança
            input.dispatchEvent(event);

        } catch (error) {
            if (error instanceof Error) {
                console.log('Erro:', error.message);
            } else {
                console.log('Erro desconhecido:', error);
            }
        }
    }

    public fileChangeEvent(event: any): void {
        this.imageChangedEvent = event; // Armazena o evento da imagem
    }

    public async imageCropped(event: ImageCroppedEvent) {
        if (event.objectUrl) {
            try {
                const response = await fetch(event.objectUrl);
                const blob = await response.blob();
                const base64Data = await this.blobToBase64(blob);
                
                // Comprimir apenas se for maior que 500KB
                const tamanhoOriginal = this.getTamanhoArquivo(base64Data);
                if (tamanhoOriginal > 500) {
                    this.imagemBase64 = await this.comprimirImagem(base64Data, 800, 600, 0.7);
                } else {
                    this.imagemBase64 = base64Data;
                }
                
                this.photoPreview = this.imagemBase64;
                this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl);
            } catch (error) {
                console.error('Erro ao processar imagem:', error);
                // Fallback rápido
                fetch(event.objectUrl).then(response => response.blob())
                    .then(blob => this.blobToBase64(blob))
                    .then(base64Data => {
                        this.photoPreview = base64Data;
                        this.imagemBase64 = base64Data;
                    });
            }
        } else {
            this.croppedImage = '';
            this.imagemBase64 = null;
            this.photoPreview = '';
        }
    }

    public saveImageCropped() {
        this.imageChangedEvent = '';
        this.modalImageCrop.dismiss();
        setTimeout(async () => {
            await this.presentToast('middle', 'Imagem salva com sucesso...');
        }, 200);
    }

    public limpaImageCropped() {
        this.imageChangedEvent = '';
        this.imagemBase64 = null;
    }

    private blobToBase64(blob: Blob): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
            reader.readAsDataURL(blob);
        });
    }

    private async touchAlertSemImagem() {
        const alert = await this.alertController.create({
            message: 'Adicionar uma foto no casdastro!',
            backdropDismiss: false,
            buttons: [
                {
                    text: 'TIRAR FOTO',
                    cssClass: 'salvarButton',
                    handler: () => {
                        this.modalImageCrop.present().then(() => {
                            this.clearImage();
                        });
                    }
                }
            ]
        });

        await alert.present();
    }

    public clearImage() {
        this.imageChangedEvent = '';
    }

    public downloadPdf() {
        if (this.plt.is('cordova')) {
            this.pdfObj.getBase64(async (data) => {
                try {
                    let path = `pdf/${new Date().toLocaleString('pt-BR').replace(/[/:]/g, '_')}.pdf`;
                    const result = await Filesystem.writeFile({
                        path,
                        data: data,
                        directory: Directory.Documents,
                        recursive: true
                    });
                    this.fileOpener.open(`${result.uri}`, 'application/pdf');
                } catch (e) {
                    console.error('Não foi possível gravar o arquivo', e);
                }
            });
        } else {
            this.downloadPdfBrowser();
        }
    }

    private downloadPdfBrowser() {
        if (this.urlPdf && (this.plt.is('mobile') || this.plt.is('android') || this.plt.is('ios'))) {
            this.downloadFromUrl(this.urlPdf);
        } else {
            this.abrirUrlNavegador();
        }
    }

    private downloadFromUrl(url: string) {
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.download = `${this.nome}_${new Date().toLocaleString('pt-BR').replace(/[/:]/g, '_')}.pdf`;

        // Para mobile, precisamos adicionar ao DOM e simular click
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    public abrirUrlNavegador() {
        const newTab = window.open(this.urlPdf, '_blank');
        if (newTab) {
            newTab.focus();
        } else { // O bloqueador de pop-ups pode estar ativo
            setTimeout(async () => {
                await this.presentToast('middle', 'Por favor, permita pop-ups para visualizar o PDF.');
            }, 100);
        }
    }

    private getTamanhoArquivo(base64String: string): number {
        // Remove o cabeçalho data:image/...;base64,
        const base64 = base64String.split(',')[1];
        // Calcula o tamanho aproximado em bytes
        const tamanhoBytes = (base64.length * 3) / 4;
        return Math.round(tamanhoBytes / 1024); // Retorna em KB
    }

    public async comprimirImagem(base64Image: string, maxWidth: number = 800, maxHeight: number = 600, quality: number = 0.7): Promise<string> {
        return new Promise((resolve, reject) => {
            // Criar uma imagem para manipulação
            const img = new Image();

            img.onload = () => {
                // Calcular novas dimensões mantendo o aspect ratio
                let width = img.width;
                let height = img.height;
        
                if (width > height) {
                    if (width > maxWidth) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = Math.round((width * maxHeight) / height);
                        height = maxHeight;
                    }
                }
        
                // Criar canvas para redimensionar
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
        
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject('Erro ao criar contexto do canvas');
                    return;
                }
        
                // Desenhar imagem redimensionada
                ctx.drawImage(img, 0, 0, width, height);
        
                // Comprimir a imagem
                try {
                    const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
                    resolve(compressedBase64);
                } catch (error) {
                    reject('Erro ao comprimir imagem: ' + error);
                }
            };
        
            img.onerror = () => {
                reject('Erro ao carregar imagem');
            };
        
            // Carregar a imagem
            img.src = base64Image;
        });
    }
}
