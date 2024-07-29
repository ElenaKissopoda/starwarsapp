import { Injectable } from '@angular/core';
import { PersonDetailApiModel, PlanetDetailApiModel } from './models/api.models';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  persons: any[] = [];
  nextUrl: string | null = null;

  private personDetailsSub = new BehaviorSubject<any>(null);
  personDetails$ = this.personDetailsSub.asObservable();

  private planetDetailsSub = new BehaviorSubject<any>(null);
  planetDetails$ = this.planetDetailsSub.asObservable();

  set person(p: PersonDetailApiModel) {
    this.personDetailsSub.next(p);
  }

  get person() {
    return this.personDetailsSub.value;
  }

  set planet(p: PlanetDetailApiModel) {
    this.planetDetailsSub.next(p);
  }

  get planet() {
    return this.planetDetailsSub.value;
  }

  constructor() { }


}
