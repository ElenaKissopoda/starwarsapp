import { CommonModule, Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BehaviorSubject, filter, map, of, Subscription, switchMap } from 'rxjs';
import { ApiService } from '../services/api.service';
import { LoadingIndicatorComponent } from '../loading-indicator/loading-indicator.component';
import { StateService } from '../services/state.service';
import { PersonDetailApiModel, PlanetDetailApiModel } from '../services/models/api.models';

@Component({
  selector: 'app-person-details-page',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingIndicatorComponent],
  templateUrl: './person-details-page.component.html',
  styleUrl: './person-details-page.component.scss'
})
export class PersonDetailsPageComponent implements OnInit, OnDestroy {

  private selectedPersonSub = new BehaviorSubject<PersonDetailApiModel>(null);
  selectedPerson$ = this.selectedPersonSub.asObservable();

  private loadingSub = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSub.asObservable();

  private subs = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private srvc: ApiService,
    private stateSrvc: StateService
  ) { }

  ngOnInit(): void {
    this.loadingSub.next(true);
    let sub = this.route.paramMap.pipe(
      filter(params => !!params),
      switchMap(params => {
        let personId = params.get('id') as unknown as number;

        if (this.stateSrvc.personsDetails.find(x => personId == x.id))
          return of(this.stateSrvc.personsDetails.find(x => personId == x.id) as PersonDetailApiModel);

        return this.srvc.getPersonDetails(personId).pipe(
          map(res => {
            return {
              id: res.result.uid,
              height: res.result.properties.height,
              mass: res.result.properties.mass,
              hair_color: res.result.properties.hair_color,
              skin_color: res.result.properties.skin_color,
              eye_color: res.result.properties.eye_color,
              birth_year: res.result.properties.birth_year,
              gender: res.result.properties.gender,
              name: res.result.properties.name,
              homeworldUrl: res.result.properties.homeworld,
              description: res.result.description
            };
          })
        );
      })
    ).subscribe((res) => {
      this.loadingSub.next(false);
      this.selectedPersonSub.next(res);
    });
    this.subs.add(sub);

    sub = this.selectedPerson$.pipe(
      filter(details => !!details && !details.homeworldId),
      switchMap(details => {
        if (this.stateSrvc.planetsDetails.find(x => details.homeworldUrl == x.planetUrl))
          return of(this.stateSrvc.planetsDetails.find(x => details.homeworldUrl == x.planetUrl) as PlanetDetailApiModel);

        return this.srvc.getPlanetDetails(details.homeworldUrl).pipe(
          map(planet => {
            return {
              id: planet.result.uid,
              diameter: planet.result.properties.diameter,
              rotation_period: planet.result.properties.rotation_period,
              orbital_period: planet.result.properties.orbital_period,
              gravity: planet.result.properties.gravity,
              population: planet.result.properties.population,
              climate: planet.result.properties.climate,
              terrain: planet.result.properties.terrain,
              surface_water: planet.result.properties.surface_water,
              name: planet.result.properties.name,
              description: planet.result.description,
              planetUrl: planet.result.properties.url
            };
          })
        )
      })
    ).subscribe(planet => {
      if (!planet) return;

      let selectedPerson = { ...this.selectedPersonSub.value };
      selectedPerson.homeworldName = planet.name;
      selectedPerson.homeworldId = planet.id;
      this.selectedPersonSub.next(selectedPerson);
      this.stateSrvc.person = selectedPerson;
      this.stateSrvc.planet = planet;
    });
    this.subs.add(sub);
  }

  goBack() {
    this.location.back();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
