export const corsOptios = {
  origin: '*',
  allowMethods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  allowHeaders: [
    'content-type',
    'Authorization',
    'Origin',
    'Access-Control-Allow-Origin',
    'Accept',
    'Options',
    'X-Requested-With',
  ],
  exposeHeaders: ['Authorization'],
  credentials: true,
};

export const STATUS_SHOP = {
  INSTALL: 1,
  UNINSTALL: 0,
};

export const STATUS_ROLES = {
  ENABLE: 'ENABLE',
  DISABLE: 'DISABLE',
};

export const LIMIT = 10;

export const APPLY_TYPE = {
  ALL: 'ALL',
  TAGS: 'TAGS',
};
export const DISCOUNT_TYPE = {
  SET_PRICE: 'PERCENTAGE',
  FIXED: 'FIXED_AMOUNT',
  PERCENT: 'PERCENTAGE',
};
