import { Response } from 'express';

// Error Web Response
export const ReE = (res: Response, err: Error, code: number) => {
  if (typeof code !== 'undefined') { res.statusCode = code; }
  return res.json({ success: false, error: err && err.message ? err.message : err });
};

// Success Web Response
export const ReS = (res: Response, data: Record<string, any>, code: number) => {
  let send_data = { success: true };
  if (typeof data === 'object') {
    send_data = { ...data, ...send_data };
  }
  if (typeof code !== 'undefined') { res.statusCode = code; }
  return res.json(send_data);
};
