import { Routes } from '@angular/router';
import { AppRoutes } from './constants';

export const routes: Routes = [
	{
		path: AppRoutes.dashboard,
		loadChildren: () =>
			import('./dashboard/dashboard.lazy-loaded.module').then(
				(m) => m.DashboardLazyLoadedModule
			),
	},
	{
		path: '**',
		redirectTo: AppRoutes.dashboard,
	},
];
