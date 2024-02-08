import {Component, OnInit} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {BikeState} from '../../state/bike/bike.state';
import {Observable, take} from 'rxjs';
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
export class BikeComponent implements OnInit {
  @Select(BikeState.selectedBike) selectedBike$!: Observable<Bike | null>;

  public isLoading = true;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private store: Store
  ) {
  }

  ngOnInit() {
    this.selectedBike$.pipe(take(1)).subscribe((bike) => {
      this.isLoading = false;
      const id = this.route.snapshot.paramMap.get('id');

      if (!this.doesRouteIdMatchSelectedBikeId(bike, id)) {
        this.store.dispatch(new SelectBike(id!));
      }
    });
  }

  public goBack(): void {
    this.location.back();
  }

  private doesRouteIdMatchSelectedBikeId(bike: Bike | null, id: string | null): boolean {
    return !!id && !!bike && bike.id.toString() === id;
  }
}
