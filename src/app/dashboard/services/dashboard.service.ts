import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LocalStorageKeys } from 'src/app/constants';
import { LocalStorageService } from 'src/app/shared/services';
import { MockCard } from '../components/dashboard-root/dashboard-root.component';

// TODO Test invalid _localStorageData
@Injectable({
	providedIn: 'root',
})
export class DashboardService {
	constructor(private readonly _localStorage: LocalStorageService) {}

	getCards(): Observable<MockCard[]> {
		const cardsCandidate = this._localStorage.getItem(LocalStorageKeys.cards);

		const cards: MockCard[] = cardsCandidate ? JSON.parse(cardsCandidate) : [];

		return of(cards);
	}

	removeCard(cardId: number): Observable<null> {
		const cardsCandidate = this._localStorage.getItem(LocalStorageKeys.cards);

		let cards: MockCard[] = cardsCandidate ? JSON.parse(cardsCandidate) : [];

		cards = cards.filter((item) => item.id !== cardId);

		this._localStorage.setItem(LocalStorageKeys.cards, JSON.stringify(cards));

		return of(null);
	}

	updateCard(card: MockCard): Observable<MockCard> {
		const cardsCandidate = this._localStorage.getItem(LocalStorageKeys.cards);

		let cards: MockCard[] = cardsCandidate ? JSON.parse(cardsCandidate) : [];

		const hasCard = cards.some((item) => item.id === card.id);

		if (!hasCard) {
			return this.addCard(card);
		}

		cards = cards.map((item) => {
			if (item.id === card.id) {
				return card;
			}

			return item;
		});

		this._localStorage.setItem(LocalStorageKeys.cards, JSON.stringify(cards));

		return of(card);
	}

	addCard(card: MockCard): Observable<MockCard> {
		const cardsCandidate = this._localStorage.getItem(LocalStorageKeys.cards);

		let cards: MockCard[] = cardsCandidate ? JSON.parse(cardsCandidate) : [];

		cards.push(card);

		this._localStorage.setItem(LocalStorageKeys.cards, JSON.stringify(cards));

		return of(card);
	}
}
