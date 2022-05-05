import { Component } from '@angular/core';
import { SensorsDataService } from 'src/app/shared/services';

@Component({
	selector: 'app-sensors-root',
	templateUrl: './sensors-root.component.html',
	styleUrls: ['./sensors-root.component.scss'],
})
export class SensorsRootComponent {
	readonly availableSensors$ = this._sensorsData.getAvailableSensors();

	constructor(private readonly _sensorsData: SensorsDataService) {}
}
