import {Injectable} from '@angular/core';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {BikeStateModel} from '../../shared/models/bike';
import {BikeService} from '../../shared/services/bike.service';
import {combineLatest, tap} from 'rxjs';
import {AddBikeSearchParam, SearchBikes, SelectBike} from './bike.actions';


@State<BikeStateModel>({
  name: 'bike',
  defaults: {
    search: {
      page: '1',
      per_page: '10',
      stolenness: 'proximity',
    },
    searchResult: null,
    selectedBike: null
  }
})

@Injectable()
export class BikeState {

  constructor(private bikeService: BikeService) {
  }

  @Selector()
  static search(state: BikeStateModel) {
    return state.search;
  }

  @Selector()
  static searchResult(state: BikeStateModel) {
    return state.searchResult;
  }

  @Selector()
  static selectedBike(state: BikeStateModel) {
    return state.selectedBike;
  }

  @Action(AddBikeSearchParam)
  addBikeSearchParam({getState, setState}: StateContext<BikeStateModel>, {bikeSearchParams}: AddBikeSearchParam) {
    const state = getState();
    setState({
      ...state,
      search: bikeSearchParams,
    });
  }

  @Action(SearchBikes)
  searchBikes({getState, setState}: StateContext<BikeStateModel>) {
    const state = getState();
    combineLatest([
      this.bikeService.search(state.search),
      this.bikeService.searchCount(state.search)
    ]).subscribe(([searchResponse, countResponse]) => {
      const state = getState();
      setState({
        ...state,
        searchResult: {
          bikes: searchResponse.bikes,
          total: countResponse.proximity,
        },
      });
    });
  }

  @Action(SelectBike)
  selectBike({getState, setState}: StateContext<BikeStateModel>, {id}: SelectBike) {
    const state = getState();
    if (state.selectedBike && state.selectedBike.id.toString() === id) {
      return;
    }
    setState({
      ...state,
      selectedBike: null,
    });
    return this.bikeService.getById(id)
      .pipe(tap((selectedBikeResponse) => {
        const state = getState();
        setState({
          ...state,
          selectedBike: selectedBikeResponse.bike,
        });
      }));
  }
}
