import { Component, ViewChild } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ModalController, IonPopover } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
    selector: 'app-image-crop',
    templateUrl: './image-crop.component.html',
    styleUrls: ['./image-crop.component.scss'],
})
export class ImageCropComponent  {
    @ViewChild('popOverImageCrop', { static: false }) popOverImageCrop!: IonPopover;

    imageChangedEvent: any = '';
    croppedImage: SafeUrl = '';
    imageRecortada: string | null | undefined

    constructor(private sanitizer: DomSanitizer, private modalController: ModalController) { }

    fileChangeEvent(event: any): void {
        this.popOverImageCrop.present();
        this.imageChangedEvent = event; // Armazena o evento da imagem
    }

    async touchVoltarModal() {
        await this.modalController.dismiss();
    }

    async takePicture() {
        this.imageRecortada = null;
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

    imageCropped(event: ImageCroppedEvent) {
        this.imageRecortada = event.objectUrl;
        if (event.base64) {
            this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event.base64);
        } else {
            this.croppedImage = '';
        }
    }
}
