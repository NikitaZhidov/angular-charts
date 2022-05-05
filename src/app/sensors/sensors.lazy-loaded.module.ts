import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SensorsRootComponent } from './components/sensors-root/sensors-root.component';
import { SensorsRoutingModule } from './sensors-routing.module';
import { SensorCardComponent } from './components/sensor-card/sensor-card.component';

@NgModule({
	declarations: [SensorsRootComponent, SensorCardComponent],
	imports: [CommonModule, SensorsRoutingModule],
})
export class SensorsLazyLoadedModule {}
