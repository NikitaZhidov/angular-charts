import { Routes } from '@angular/router';
import { DashboardRootComponent } from './components/dashboard-root/dashboard-root.component';

export const routes: Routes = [
	{
		path: '',
		component: DashboardRootComponent,
	},
	{
		path: '**',
		redirectTo: '',
	},
];
