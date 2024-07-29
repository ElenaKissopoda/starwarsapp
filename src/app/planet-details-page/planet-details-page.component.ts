import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, filter, finalize, map, of, Subscription, switchMap } from 'rxjs';
import { ApiService } from '../services/api.service';
import { PlanetDetailApiModel } from '../services/models/api.models';
import { CommonModule } from '@angular/common';
import { LoadingIndicatorComponent } from '../loading-indicator/loading-indicator.component';
import { StateService } from '../services/state.service';

@Component({
  selector: 'app-planet-details-page',
  standalone: true,
  imports: [CommonModule, LoadingIndicatorComponent],
  templateUrl: './planet-details-page.component.html',
  styleUrl: './planet-details-page.component.scss'
})
export class PlanetDetailsPageComponent implements OnInit, OnDestroy {

  private loadingSub = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSub.asObservable();

  private subs = new Subscription();

  get planetDetails$(){
    return this.stateSrvc.planetDetails$;
  }

  constructor(
    private route: ActivatedRoute,
    private srvc: ApiService,
    private stateSrvc: StateService
  ) { }

  ngOnInit(): void {
    this.loadingSub.next(true);
    let sub = this.route.paramMap.pipe(
      filter(params => !!params),
      switchMap(params => {
        let planetId = params.get('id') as unknown as number;
        if (planetId == this.stateSrvc.planet?.id) return of(this.stateSrvc.planet);
        return this.srvc.getPlanetDetailsById(planetId).pipe(
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
              description: planet.result.description
            };
          })
        );
      })
    ).subscribe((planet) => {
      this.loadingSub.next(false);
      this.stateSrvc.planet = planet;
    });
    this.subs.add(sub);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
