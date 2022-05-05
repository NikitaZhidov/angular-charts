import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	Output,
} from '@angular/core';
import { AppRoutes } from 'src/app/constants';

export type SidebarRoute = {
	title: string;
	route: string;
};

@Component({
	selector: 'app-sidebar',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
	@Input()
	open = false;

	@Output()
	public openChange = new EventEmitter<boolean>();

	readonly routes: SidebarRoute[] = [
		{
			title: 'Dashboard',
			route: AppRoutes.dashboard,
		},
		{
			title: 'Sensors',
			route: AppRoutes.sensors,
		},
	];

	onCloseSidebar() {
		this.open = false;
		this.openChange.emit(false);
	}
}
