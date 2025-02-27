import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ImageCropComponent } from './components/image-crop/image-crop.component';

@NgModule({
  declarations: [AppComponent, ImageCropComponent],
  imports: [
        BrowserModule, 
        IonicModule.forRoot({mode: 'md'}), 
        AppRoutingModule, 
        HttpClientModule,
        ImageCropperModule        
    ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    FileOpener
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class AppModule {}
