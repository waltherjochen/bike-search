import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {BikeComponent} from './bike.component';
import {NgxsModule, Store} from '@ngxs/store';
import {Location} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {of} from 'rxjs';
import {BikeState} from '../../state/bike/bike.state';
import {SelectBike} from '../../state/bike/bike.actions';
import {RouterTestingModule} from '@angular/router/testing';
import {mockBikes} from '../../shared/mocks/bike';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('BikeComponent', () => {
  let component: BikeComponent;
  let fixture: ComponentFixture<BikeComponent>;
  let store: Store;
  let location: Location;
  let router: Router;
  let route: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BikeComponent,
        NgxsModule.forRoot([BikeState]),
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {snapshot: {paramMap: {get: () => '1156472'}}}
        },
        Location
      ]
    })
      .compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(BikeComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    location = TestBed.inject(Location);
    route = TestBed.inject(ActivatedRoute);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch SelectBike action if bike state is empty', fakeAsync(() => {
    spyOn(store, 'dispatch');
    spyOn(store, 'select').and.returnValue(of(null));

    fixture.detectChanges();
    tick()

    expect(store.dispatch).toHaveBeenCalledWith(new SelectBike('1156472'));
  }));

  it('should display bike details if selected bike is available', () => {
    spyOn(store, 'select').and.returnValue(of(mockBikes[0]));
    fixture.detectChanges();

    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain(`${mockBikes[0].title} Details`);
  });

  it('should call goBack on back button click', () => {
    const locationSpy = spyOn(location, 'back');
    component.goBack();
    expect(locationSpy).toHaveBeenCalled();
  });
});
