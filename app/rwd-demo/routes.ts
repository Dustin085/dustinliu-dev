export const BASE_ROUTE = '/rwd-demo';

export type ROUTE = {
  name: string;
  href: string;
};

export const RWD_DEMO_ROUTES: ROUTE[] = [
  { name: 'Home', href: BASE_ROUTE },
  { name: 'Image', href: BASE_ROUTE + '/image-rwd' },
  //   { name: 'Contact', href: '/contact' },
];
