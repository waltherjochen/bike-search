import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import {NgxsReduxDevtoolsPluginModule} from '@ngxs/devtools-plugin';
import {environment} from '../environments/environment';
import {NgxsModule} from '@ngxs/store';
import {NgxsStoragePluginModule} from '@ngxs/storage-plugin';
import {BikeState} from './state/bike/bike.state';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      NgxsReduxDevtoolsPluginModule.forRoot({disabled: environment.production}),
      NgxsModule.forRoot([BikeState]),
      NgxsStoragePluginModule.forRoot({key: ['bike']})
    ),
    provideRouter(routes), provideAnimations()]
};
