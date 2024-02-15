import {Component, OnDestroy, OnInit} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {BikeState} from '../../state/bike/bike.state';
import {Observable, Subject, takeUntil} from 'rxjs';
import {Bike} from '../../shared/models/bike';
import {AsyncPipe, DatePipe, JsonPipe, Location, NgIf} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {ActivatedRoute} from '@angular/router';
import {SelectBike} from '../../state/bike/bike.actions';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-bike',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    DatePipe,
    JsonPipe,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './bike.component.html',
  styles: ``
})
export class BikeComponent implements OnInit, OnDestroy {
  @Select(BikeState.selectedBike) selectedBike$!: Observable<Bike | null>;
  @Select(BikeState.isSelectBikeErrorCode) isSelectBikeErrorCode$!: Observable<number | null>;

  public isLoading = true;
  public isSelectBikeErrorCode: number | null = null;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private store: Store
  ) {
  }

  ngOnInit() {
    this.selectedBike$.pipe(takeUntil(this.destroy$)).subscribe((bike) => {
      const id = this.route.snapshot.paramMap.get('id');

      if (!this.doesRouteIdMatchSelectedBikeId(bike, id)) {
        this.store.dispatch(new SelectBike(id!));
      } else {
        this.isLoading = false;
      }
    });

    this.isSelectBikeErrorCode$.pipe(takeUntil(this.destroy$)).subscribe((isSelectBikeError) => {
      this.isSelectBikeErrorCode = isSelectBikeError;
      if (this.isSelectBikeErrorCode) {
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public goBack(): void {
    this.location.back();
  }

  private doesRouteIdMatchSelectedBikeId(bike: Bike | null, id: string | null): boolean {
    return !!id && !!bike && bike.id.toString() === id;
  }
}
