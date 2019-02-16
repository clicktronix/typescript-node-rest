import * as R from 'ramda';
import * as uuid from 'uuid';

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
    return Error('Token is invalid');
  }
  const updatedTokens = R.without([token], tokens);
  return add(updatedTokens);
}

export function remove(tokens: string[], token: string) {
  if (R.indexOf(token, tokens) === -1) {
    return Error('Token is invalid');
  }
  return R.without([token], tokens);
}
