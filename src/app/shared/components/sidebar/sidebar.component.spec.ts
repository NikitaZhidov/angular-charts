import { ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import { SidebarComponent, SidebarRoute } from './sidebar.component';

describe('SidebarComponent', () => {
	let component: SidebarComponent;
	let fixture: ComponentFixture<SidebarComponent>;

	const mockRoutes: SidebarRoute[] = [
		{
			title: 'Dashboard',
			route: 'dashboard',
		},
		{
			title: 'Sensors',
			route: 'sensors',
		},
	];

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [SidebarComponent],
			imports: [RouterTestingModule],
		})
			.overrideComponent(SidebarComponent, {
				set: {
					changeDetection: ChangeDetectionStrategy.Default,
				},
			})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(SidebarComponent);
		component = fixture.componentInstance;

		Object.defineProperty(component, 'routes', {
			value: mockRoutes,
		});

		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should render title', () => {
		const $title = fixture.debugElement.query(By.css('h5.title'));
		expect($title?.nativeElement?.textContent).toContain('Angular Charts');
	});

	it('should render routes', () => {
		const $routes = fixture.debugElement.queryAll(By.css('a.route'));

		expect($routes.length).toBe(mockRoutes.length);
	});

	it('should render title of each route', () => {
		const $routes = fixture.debugElement.queryAll(By.css('a.route'));

		expect($routes[0].nativeElement?.textContent).toContain('Dashboard');
		expect($routes[1].nativeElement?.textContent).toContain('Sensors');
	});

	it('should render empty menu if no routes', () => {
		Object.defineProperty(component, 'routes', {
			value: <SidebarRoute[]>[],
		});

		fixture.detectChanges();

		const $routes = fixture.debugElement.queryAll(By.css('a.route'));

		expect($routes.length).toBe(0);
	});

	it('should send close event when close button was clicked', () => {
		const event = spyOn(component.openChange, 'emit');

		const $button = fixture.debugElement.query(By.css('div.close-btn'));

		$button.nativeElement.dispatchEvent(new Event('click'));

		expect(component.open).toBeFalse();
		expect(event).toHaveBeenCalledWith(false);
	});
});
