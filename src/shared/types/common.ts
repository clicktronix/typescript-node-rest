export interface IServerErrorPart {
  status: number;
}

export type ServerError = IServerErrorPart & Error;
