import {BikeSearchParams} from '../../shared/models/bike';

export class BikeSearchAction {
  static readonly type = '[Bike] Search';

  constructor(public payload: BikeSearchParams) {
  }
}

export class SelectBikeAction {
  static readonly type = '[Bike] Select';

  constructor(public payload: string) {
  }
}
