import express from 'express';
import { UserRoutes } from '../modules/User/user.route';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { ListingRoutes } from '../modules/Listings/listing.route';
import { TransactionRoutes } from '../modules/Order/transaction.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/listings',
    route: ListingRoutes,
  },
  {
    path: '/transactions',
    route: TransactionRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
