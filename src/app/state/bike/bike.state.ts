import {Injectable} from '@angular/core';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {BikeStateModel} from '../../shared/models/bike';
import {BikeService} from '../../shared/services/bike.service';
import {tap} from 'rxjs';
import {BikeSearchAction, SelectBikeAction} from './bike.actions';


@State<BikeStateModel>({
  name: 'bike',
  defaults: {
    bikes: [],
    selectedBike: null
  }
})

@Injectable()
export class BikeState {

  constructor(private bikeService: BikeService) {
  }

  @Selector()
  static bikes(state: BikeStateModel) {
    return state.bikes;
  }

  @Selector()
  static selectedBike(state: BikeStateModel) {
    return state.selectedBike;
  }

  @Action(BikeSearchAction)
  searchBikes({getState, setState}: StateContext<BikeStateModel>, {payload}: BikeSearchAction) {
    return this.bikeService.search(payload)
      .pipe(tap((bikes) => {
        const state = getState();
        setState({
          ...state,
          bikes,
        });
      }));
  }

  @Action(SelectBikeAction)
  selectBike({getState, setState}: StateContext<BikeStateModel>, {payload}: SelectBikeAction) {
    return this.bikeService.getById(payload)
      .pipe(tap((selectedBike) => {
        const state = getState();
        setState({
          ...state,
          selectedBike,
        });
      }));
  }
}
