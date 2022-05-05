import { Routes } from '@angular/router';
import { SensorsRootComponent } from './components/sensors-root/sensors-root.component';

export const routes: Routes = [
	{
		path: '',
		component: SensorsRootComponent,
		children: [
			{
				path: '**',
				redirectTo: '',
			},
		],
	},
	{
		path: '**',
		redirectTo: '',
	},
];
