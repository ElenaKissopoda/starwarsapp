import { Injectable } from '@angular/core';
import { PersonDetailApiModel, PlanetDetailApiModel } from './models/api.models';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  personsList: any[] = [];
  nextUrl: string | null = null;

  personsDetails: PersonDetailApiModel[] = [];
  planetsDetails: PlanetDetailApiModel[] = [];

  set person(p: PersonDetailApiModel) {
    if (this.personsDetails.find(x => x.id == p.id)) return;

    let persons = [...this.personsDetails];
    persons.push(p);
    this.personsDetails = persons;
  }

  set planet(p: PlanetDetailApiModel) {
    if (this.planetsDetails.find(x => x.id == p.id)) return;

    let planets = [...this.planetsDetails];
    planets.push(p);
    this.planetsDetails = planets;
  }

  constructor() { }
}
