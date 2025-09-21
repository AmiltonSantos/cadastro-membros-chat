import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IMessage } from '../models/methods.models';
import { AlertController, IonContent, IonTextarea, Platform, ToastController, IonPopover } from '@ionic/angular';
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
    @ViewChild('focustextarea', { static: false }) focustextarea!: IonTextarea;
    @ViewChild('popOverImageCrop', { static: false }) popOverImageCrop!: IonPopover;
    
    imageChangedEvent: any = '';
    croppedImage: SafeUrl = '';

    public messages: IMessage[] = [];
    public loading: boolean = false;
    public isMensage: boolean = true;
    private index = -1;
    public pdfObj!: pdfMake.TCreatedPdf;
    private logoData!: string | ArrayBuffer | null;
    public photoPreview: string = '';
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
    private numero: string = '';
    private bairro: string = '';
    private estado: string = '';
    private cidade: string = '';
    private batismoAgua: string = '';
    private isObreiro: string = '';

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

    public strEstados = [
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
        { value: 16, mensagem: 'Qual número da casa ?' },
        { value: 17, mensagem: 'Nome do bairro ?' },
        { value: 18, mensagem: 'Estado onde mora ?' },
        { value: 19, mensagem: 'Cidade onde mora ?' },
        { value: 20, mensagem: 'Qual a data batismo nas águas ?' },
        { value: 21, mensagem: 'É obreiro ?' },
    ];

    constructor(
        private alertController: AlertController,
        public fileOpener: FileOpener,
        public plt: Platform,
        private toastController: ToastController,
        private sanitizer: DomSanitizer,
        private cd: ChangeDetectorRef,
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
            this.focustextarea?.setFocus();
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

            let userMsg: IMessage = {
                sender: 'me',
                content: ''
            };
            this.messages.push(userMsg);
            this.typeText(String(prompt)?.toLocaleUpperCase().trim());

            const valoresVerificar = [2, 3, 5, 6, 7, 17, 18, 19];
            this.isUsaInput = valoresVerificar.includes(this.index) ? 'numeric' : 'text';

            if (this.index === 1) {
                this.nome = String(prompt)?.toLocaleUpperCase().trim();
            } else if (this.index === 2) {
                this.congregacao = String(prompt)?.toLocaleUpperCase().trim();
            } else if (this.index === 3) {
                this.cpf = prompt.trim();
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
                this.numero = String(prompt)?.toLocaleUpperCase().trim();
            } else if (this.index === 18) {
                this.bairro = String(prompt)?.toLocaleUpperCase().trim();
            } else if (this.index === 19) {
                this.estado = String(prompt)?.toLocaleUpperCase().trim();
            } else if (this.index === 20) {
                this.cidade = String(prompt)?.toLocaleUpperCase().trim();
            } else if (this.index === 21) {
                this.batismoAgua = String(prompt)?.toLocaleUpperCase().trim();
            } else if (this.index === 22) {
                this.isObreiro = String(prompt)?.toLocaleUpperCase().trim();             
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
                            this.showAlert(this.mensagemBot[this.index].value, 'UF');
                        }, 300);
                    } else if (this.index === 12) {
                        setTimeout(() => {
                            this.showAlert(this.mensagemBot[this.index].value, 'ESCOLARIDADE');
                        }, 300);
                    } else if (this.index === 18) {
                        setTimeout(() => {
                            this.showAlert(this.mensagemBot[this.index].value, 'ESTADO');
                        }, 300);
                    } else if (this.index === 21) {
                        setTimeout(() => {
                            this.showAlert(21, 'OBREIRO');
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
        } else if (numero === 19) {
            for (const str of this.strEstados) {
                inputs.push({
                    type: 'radio',
                    label: str.nome,
                    value: str.nome
                });
            }
        } else if (numero === 21) {
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
                margin: [0, -115, 0, 0]
            });
        } else {
            content.push({
                text: 'Imagem não disponível',
                alignment: 'center',
                margin: [0, -50, 0, 0]
            });
        }

        const docDefinition: any = {
            background: function(currentPage: number, pageSize: any) {
                if (currentPage === 1) {
                    return {
                        canvas: [
                            {
                                type: 'rect',
                                x: 30,
                                y: 35,
                                w: pageSize.width - 60,  // largura ajustada
                                h: pageSize.height - 65, // altura ajustada
                                lineWidth: 3,
                                lineColor: 'black'       // aqui use lineColor (não color)
                            }
                        ]
                    };
                }
                return null;
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
                                    },
                                    layout: {
                                        hLineWidth: () => 0.5, // espessura horizontal
                                        vLineWidth: () => 0.5, // espessura vertical
                                        hLineColor: () => 'black',
                                        vLineColor: () => 'black'
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
                                                        widths: [380],
                                                        heights: 13,
                                                        body: [
                                                            [
                                                                {
                                                                    text: this.cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4')
                                                                }
                                                            ]
                                                        ]
                                                    },
                                                    layout: {
                                                        hLineWidth: () => 0.5, // espessura horizontal
                                                        vLineWidth: () => 0.5, // espessura vertical
                                                        hLineColor: () => 'black',
                                                        vLineColor: () => 'black'
                                                    },
                                                    margin: [0, 0, 0, 5]
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
                    layout: {
                        hLineWidth: () => 0.5, // espessura horizontal
                        vLineWidth: () => 0.5, // espessura vertical
                        hLineColor: () => 'black',
                        vLineColor: () => 'black'
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
                                    layout: {
                                        hLineWidth: () => 0.5, // espessura horizontal
                                        vLineWidth: () => 0.5, // espessura vertical
                                        hLineColor: () => 'black',
                                        vLineColor: () => 'black'
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
                                    layout: {
                                        hLineWidth: () => 0.5, // espessura horizontal
                                        vLineWidth: () => 0.5, // espessura vertical
                                        hLineColor: () => 'black',
                                        vLineColor: () => 'black'
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
                                    layout: {
                                        hLineWidth: () => 0.5, // espessura horizontal
                                        vLineWidth: () => 0.5, // espessura vertical
                                        hLineColor: () => 'black',
                                        vLineColor: () => 'black'
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
                                    layout: {
                                        hLineWidth: () => 0.5, // espessura horizontal
                                        vLineWidth: () => 0.5, // espessura vertical
                                        hLineColor: () => 'black',
                                        vLineColor: () => 'black'
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
                                                    text: 'BRASILEIRO(A)'
                                                }
                                            ]
                                        ]
                                    },
                                    layout: {
                                        hLineWidth: () => 0.5, // espessura horizontal
                                        vLineWidth: () => 0.5, // espessura vertical
                                        hLineColor: () => 'black',
                                        vLineColor: () => 'black'
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
                                    layout: {
                                        hLineWidth: () => 0.5, // espessura horizontal
                                        vLineWidth: () => 0.5, // espessura vertical
                                        hLineColor: () => 'black',
                                        vLineColor: () => 'black'
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
                                    layout: {
                                        hLineWidth: () => 0.5, // espessura horizontal
                                        vLineWidth: () => 0.5, // espessura vertical
                                        hLineColor: () => 'black',
                                        vLineColor: () => 'black'
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
                                                    text: ''
                                                }
                                            ]
                                        ]
                                    },
                                    layout: {
                                        hLineWidth: () => 0.5, // espessura horizontal
                                        vLineWidth: () => 0.5, // espessura vertical
                                        hLineColor: () => 'black',
                                        vLineColor: () => 'black'
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
                                    layout: {
                                        hLineWidth: () => 0.5, // espessura horizontal
                                        vLineWidth: () => 0.5, // espessura vertical
                                        hLineColor: () => 'black',
                                        vLineColor: () => 'black'
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
                                    layout: {
                                        hLineWidth: () => 0.5, // espessura horizontal
                                        vLineWidth: () => 0.5, // espessura vertical
                                        hLineColor: () => 'black',
                                        vLineColor: () => 'black'
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
                                    layout: {
                                        hLineWidth: () => 0.5, // espessura horizontal
                                        vLineWidth: () => 0.5, // espessura vertical
                                        hLineColor: () => 'black',
                                        vLineColor: () => 'black'
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
                                                    text: this.whatsapp.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3')
                                                }
                                            ]
                                        ]
                                    },
                                    layout: {
                                        hLineWidth: () => 0.5, // espessura horizontal
                                        vLineWidth: () => 0.5, // espessura vertical
                                        hLineColor: () => 'black',
                                        vLineColor: () => 'black'
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
                                                    text: ''
                                                }
                                            ]
                                        ]
                                    },
                                    layout: {
                                        hLineWidth: () => 0.5, // espessura horizontal
                                        vLineWidth: () => 0.5, // espessura vertical
                                        hLineColor: () => 'black',
                                        vLineColor: () => 'black'
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
                                    layout: {
                                        hLineWidth: () => 0.5, // espessura horizontal
                                        vLineWidth: () => 0.5, // espessura vertical
                                        hLineColor: () => 'black',
                                        vLineColor: () => 'black'
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
                                    layout: {
                                        hLineWidth: () => 0.5, // espessura horizontal
                                        vLineWidth: () => 0.5, // espessura vertical
                                        hLineColor: () => 'black',
                                        vLineColor: () => 'black'
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
                                    layout: {
                                        hLineWidth: () => 0.5, // espessura horizontal
                                        vLineWidth: () => 0.5, // espessura vertical
                                        hLineColor: () => 'black',
                                        vLineColor: () => 'black'
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
                                    layout: {
                                        hLineWidth: () => 0.5, // espessura horizontal
                                        vLineWidth: () => 0.5, // espessura vertical
                                        hLineColor: () => 'black',
                                        vLineColor: () => 'black'
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
                                                    text: ''
                                                }
                                            ]
                                        ]
                                    },
                                    layout: {
                                        hLineWidth: () => 0.5, // espessura horizontal
                                        vLineWidth: () => 0.5, // espessura vertical
                                        hLineColor: () => 'black',
                                        vLineColor: () => 'black'
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
                                    layout: {
                                        hLineWidth: () => 0.5, // espessura horizontal
                                        vLineWidth: () => 0.5, // espessura vertical
                                        hLineColor: () => 'black',
                                        vLineColor: () => 'black'
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
                                    layout: {
                                        hLineWidth: () => 0.5, // espessura horizontal
                                        vLineWidth: () => 0.5, // espessura vertical
                                        hLineColor: () => 'black',
                                        vLineColor: () => 'black'
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
                                    text: '',
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
                                    layout: {
                                        hLineWidth: () => 0.5, // espessura horizontal
                                        vLineWidth: () => 0.5, // espessura vertical
                                        hLineColor: () => 'black',
                                        vLineColor: () => 'black'
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
                                    layout: {
                                        hLineWidth: () => 0.5, // espessura horizontal
                                        vLineWidth: () => 0.5, // espessura vertical
                                        hLineColor: () => 'black',
                                        vLineColor: () => 'black'
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
                                                    text: ''
                                                }
                                            ]
                                        ]
                                    },
                                    layout: {
                                        hLineWidth: () => 0.5, // espessura horizontal
                                        vLineWidth: () => 0.5, // espessura vertical
                                        hLineColor: () => 'black',
                                        vLineColor: () => 'black'
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
                                    text: '',
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
                                                    text: ''
                                                }
                                            ]
                                        ]
                                    },
                                    layout: {
                                        hLineWidth: () => 0.5, // espessura horizontal
                                        vLineWidth: () => 0.5, // espessura vertical
                                        hLineColor: () => 'black',
                                        vLineColor: () => 'black'
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
                                    text: '',
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
                                                    text: ''
                                                }
                                            ]
                                        ]
                                    },
                                    layout: {
                                        hLineWidth: () => 0.5, // espessura horizontal
                                        vLineWidth: () => 0.5, // espessura vertical
                                        hLineColor: () => 'black',
                                        vLineColor: () => 'black'
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
                                    text: '',
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
                                                    text: ''
                                                }
                                            ]
                                        ]
                                    },
                                    layout: {
                                        hLineWidth: () => 0.5, // espessura horizontal
                                        vLineWidth: () => 0.5, // espessura vertical
                                        hLineColor: () => 'black',
                                        vLineColor: () => 'black'
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
                                    text: '',
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
                                                    text: ''
                                                }
                                            ]
                                        ]
                                    },
                                    layout: {
                                        hLineWidth: () => 0.5, // espessura horizontal
                                        vLineWidth: () => 0.5, // espessura vertical
                                        hLineColor: () => 'black',
                                        vLineColor: () => 'black'
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
                                                    text: ''
                                                }
                                            ]
                                        ]
                                    },
                                    layout: {
                                        hLineWidth: () => 0.5, // espessura horizontal
                                        vLineWidth: () => 0.5, // espessura vertical
                                        hLineColor: () => 'black',
                                        vLineColor: () => 'black'
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
                                                    text: ''
                                                }
                                            ]
                                        ]
                                    },
                                    layout: {
                                        hLineWidth: () => 0.5, // espessura horizontal
                                        vLineWidth: () => 0.5, // espessura vertical
                                        hLineColor: () => 'black',
                                        vLineColor: () => 'black'
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
                                                    text: ''
                                                }
                                            ]
                                        ]
                                    },
                                    layout: {
                                        hLineWidth: () => 0.5, // espessura horizontal
                                        vLineWidth: () => 0.5, // espessura vertical
                                        hLineColor: () => 'black',
                                        vLineColor: () => 'black'
                                    },
                                    margin: [0, 0, 0, 0]
                                }
                            ]
                        }
                    ],
                    margin: [0, 0, 0, 5]
                },
                {
                    text: 'TERMO DE CONSENTIMENTO PARA TRATAMENTO DE DADOS PESSOAIS',
                    style: 'header',
                    alignment: 'center',
                    margin: [0, 30, 0, 5]
                },
                {
                    text: '(Lei 13.709 – LGPD)',
                    style: 'header',
                    alignment: 'center',
                    margin: [0, 10, 0, 5]
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
                                margin: [5, 5, 5, 5] // padding interno
                                }
                            ]
                        ]
                    },
                    layout: {
                        hLineWidth: () => 0.5, // espessura horizontal
                        vLineWidth: () => 0.5, // espessura vertical
                        hLineColor: () => 'black',
                        vLineColor: () => 'black'
                    },
                    margin: [0, 30, 0, 0] // margem externa
                },
                {
                    width: '95%',
                    table: {
                        widths: ['*'], // só uma célula ocupando 100%
                        body: [
                            [
                                {
                                text: [
                                    { text: `Nome: ${this.nome} `, bold: true },
                                    { text: `nacionalidade: BRASILEIRO(A), estado civil: ${this.estadoCivil} `},
                                    { text: `profissão: ${this.profissao}, RG nº: ${this.rg}, inscrito(a) ` },
                                    { text: `CPF/MF sob o nº: ${this.cpf}, residente e domiciliado(a) na ` },
                                    { text: `${this.rua}, ${this.bairro} ${this.numero} ` },
                                    { text: `Cidade/Estado: ${this.cidade}, ${this.estado} CEP: ${this.cep} ` },
                                    { text: 'doravante denominado(a) ' },
                                    { text: 'TITULAR.', bold: true }
                                ],
                                alignment: 'justify',
                                margin: [5, 5, 5, 5] // padding interno
                                }
                            ]
                        ]
                    },
                    layout: {
                        hLineWidth: () => 0.5, // espessura horizontal
                        vLineWidth: () => 0.5, // espessura vertical
                        hLineColor: () => 'black',
                        vLineColor: () => 'black'
                    },
                    margin: [0, 30, 0, 0] // margem externa (fora do quadrado)
                },
                {
                    text: 'Este termo de consentimento foi elaborado em conformidade com a lei geral de proteção de dados. Consoante ao artigo 5º inciso XII da Lei 13.709, este documento viabiliza a manifestação livre, informada e inequívoca, pela qual o titular/ responsável concorda com o tratamento de seus dados pessoais e os dados do menor sob os seus cuidados, para as finalidades a seguir determinadas:',
                    italics: true,
                    alignment: 'justify',
                    margin: [50, 20, 0, 0]
                },
                ,
                {
                    text: 'PARÁGRAFO PRIMEIRO - DO CONSENTIMENTO',
                    style: 'header',
                    alignment: 'left',
                    margin: [0, 20, 0, 5]
                },
                {
                    text: [
                        { text: '    Ao assinar este termo o '},
                        { text: 'TITULAR ', bold: true },
                        { text: 'concorda que a ' },
                        { text: ' CONTROLADORA, ', bold: true },
                        { text: 'proceda com o tratamento de seus dados.' },
                    ],
                    alignment: 'left',
                    margin: [0, 10, 0, 5]
                },
                {
                    text: 'Entende-se por tratamento de acordo com o artigo 5º inciso X, a coleta, produção, recepção, classificação, utilização, acesso, reprodução, transmissão, distribuição, processamento, arquivamento, armazenamento, eliminação, avaliação ou controle da informação, modificação, comunicação, transferência, difusão ou extração.',
                    alignment: 'left',
                    margin: [0, 10, 0, 5]
                },
                {
                    text: 'PARÁGRAFO SEGUNDO - DADOS PESSOAIS',
                    style: 'header',
                    alignment: 'left',
                    margin: [0, 10, 0, 5]
                },
                {
                    text: 'Poderão ser tratados, mediante anuência expressa do titular/responsável, os seguintes dados pessoais, pelo(a) controlador(a):',
                    alignment: 'left',
                    margin: [0, 10, 0, 5]
                },
                {
                    ul: [
                        'Nome, RG, CPF, endereço, status civil, e-mail, telefone, histórico pessoal e congregacional.'
                    ],
                    margin: [20, 0, 0, 10] // indentação e espaçamento
                }
            ],

            // Rodapé
            footer(currentPage: any, pageCount: any) {
                return {
                    columns: [
                        { text: 'AD Missão Jardim América - Todos os direitos reservados Copyright' + ' | ' + new Date().toLocaleString(), alignment: 'center', fontSize: 6 }
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
                setTimeout(async () => {
                    await this.presentToast('middle', 'Por favor, permita pop-ups para visualizar o PDF.');
                }, 100);
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

    public async recortarImagem(event: MouseEvent) {
        await this.popOverImageCrop.present(event); 
    }

    public async salvarGoogleSheets() {

        const response = await fetch("https://sheetdb.io/api/v1/9lv20jihax310", {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: "=ROW()-1",
                datainscricao: (new Date().toLocaleString()).toString().replace(',', ''),
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
                isObreiro: this.isObreiro
            }),
        });

        const data = await response.json();

        if (response.ok) {
            await this.presentToast('middle', `${data.created === 1 ? 'Salvo com sucesso' : 'Error ao cadastrar'}`);
        } else {
            await this.presentToast('middle', 'Erro ao cadastrar!');
        }
    }

    async presentToast(position: 'top' | 'middle' | 'bottom', msg: string) {
        const toast = await this.toastController.create({
            message: msg,
            duration: 1500,
            position: position,
        });

        await toast.present();
    }

    async takePicture() {
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

    fileChangeEvent(event: any): void {
        this.imageChangedEvent = event; // Armazena o evento da imagem
    }

    imageCropped(event: ImageCroppedEvent) {
        if (event.objectUrl) {
            fetch(event.objectUrl).then(response => response.blob())
            .then(blob => this.blobToBase64(blob))
            .then(base64Data => {
                this.photoPreview = base64Data; 
            }).catch(error => {
                console.error('Erro ao converter Blob para Base64:', error);
            });

            this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl);
        } else {
            this.croppedImage = '';
        }
    }

    saveImageCropped() {
        this.imageChangedEvent = '';
        this.popOverImageCrop.dismiss();
        setTimeout(async () => {
            await this.presentToast('middle', 'Imagem salva com sucesso...');
        }, 200);
    }

    limpaImageCropped() {
        this.imageChangedEvent = '';
    }

    blobToBase64(blob: Blob): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
            reader.readAsDataURL(blob);
        });
    }

    clearImage() {
        this.imageChangedEvent = '';
    }
}
