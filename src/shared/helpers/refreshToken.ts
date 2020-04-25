import R from 'ramda';
import uuid from 'uuid';
import httpStatus from 'http-status';

import { HttpRequestError } from './HttpRequestError';

export function add(tokens: string[] = []) {
  const newToken = uuid.v4();
  if (tokens.length >= 5) {
    tokens.shift();
  }
  tokens.push(newToken);
  return tokens;
}

export function update(tokens: string[], token: string) {
  if (R.indexOf(token, tokens) === -1) {
    throw new HttpRequestError('Token is invalid', httpStatus.UNAUTHORIZED);
  }
  const updatedTokens = R.without([token], tokens);
  return add(updatedTokens);
}

export function remove(tokens: string[], token: string) {
  if (R.indexOf(token, tokens) === -1) {
    throw new HttpRequestError('Token is invalid', httpStatus.UNAUTHORIZED);
  }
  return R.without([token], tokens);
}
