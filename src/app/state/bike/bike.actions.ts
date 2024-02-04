import {BikeSearchParams} from '../../shared/models/bike';

export class AddBikeSearchParam {
  static readonly type = '[Bike] Search Param';

  constructor(public bikeSearchParams: BikeSearchParams) {
  }
}

export class SearchBikes {
  static readonly type = '[Bike] Search';

  constructor() {
  }
}

export class SelectBike {
  static readonly type = '[Bike] Select';

  constructor(public payload: string) {
  }
}
