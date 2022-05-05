import { Component, Input } from '@angular/core';
import { AvailableSensor } from 'src/app/shared/models';

@Component({
	selector: 'app-sensor-card',
	templateUrl: './sensor-card.component.html',
	styleUrls: ['./sensor-card.component.scss'],
})
export class SensorCardComponent {
	@Input()
	sensor?: AvailableSensor;
}
