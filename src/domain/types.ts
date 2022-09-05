export type Coordinate = {
  lng: number;
  lat: number;
};

export type Line = {
  start: Coordinate;
  end: Coordinate;
};

export type Square = {
  words: string;
  southwest: Coordinate;
  northeast: Coordinate;
};

export type CoordinateTuple = [Coordinate, Coordinate];
