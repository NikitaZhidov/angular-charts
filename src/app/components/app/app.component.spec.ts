import { ChangeDetectionStrategy, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
	let component: AppComponent;
	let fixture: ComponentFixture<AppComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [RouterTestingModule],
			declarations: [AppComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.overrideComponent(AppComponent, {
				set: {
					changeDetection: ChangeDetectionStrategy.Default,
				},
			})
			.compileComponents();

		fixture = TestBed.createComponent(AppComponent);
		component = fixture.componentInstance;
	});

	it('should create the app', () => {
		const fixture = TestBed.createComponent(AppComponent);
		const app = fixture.componentInstance;
		expect(app).toBeTruthy();
	});

	it('should add class "open" to sidebar if it opened', () => {
		component.openSidebar = true;

		fixture.detectChanges();

		const $sidebar = fixture.debugElement.query(By.css('app-sidebar.open'));

		expect($sidebar).toBeTruthy();
	});

	it('should add class "open" to sidebar when burger button was clicked', () => {
		const $burger = fixture.debugElement.query(By.css('button.burger'));

		$burger.nativeElement.dispatchEvent(new Event('click'));

		fixture.detectChanges();

		const $sidebar = fixture.debugElement.query(By.css('app-sidebar.open'));

		expect($sidebar).toBeTruthy();
	});
});
