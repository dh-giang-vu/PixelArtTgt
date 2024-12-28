type Coordinate = {
  x: number,
  y: number,
};

function isCoordinate(object: any): object is Coordinate {
  return 'x' in object && 'y' in object;
}

export { isCoordinate };