import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BikeComponent} from './bike.component';
import {RouterTestingModule} from '@angular/router/testing';
import {NgxsModule} from '@ngxs/store';
import {BikeState} from '../../state/bike/bike.state';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('BikeComponent', () => {
  let component: BikeComponent;
  let fixture: ComponentFixture<BikeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BikeComponent,
        RouterTestingModule,
        NgxsModule.forRoot([BikeState]),
        HttpClientTestingModule
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(BikeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
