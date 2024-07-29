import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BehaviorSubject, filter, finalize, map, of, Subscription, switchMap } from 'rxjs';
import { ApiService } from '../services/api.service';
import { PersonDetailApiModel } from '../services/models/api.models';
import { LoadingIndicatorComponent } from '../loading-indicator/loading-indicator.component';
import { StateService } from '../services/state.service';

@Component({
  selector: 'app-person-details-page',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingIndicatorComponent],
  templateUrl: './person-details-page.component.html',
  styleUrl: './person-details-page.component.scss'
})
export class PersonDetailsPageComponent implements OnInit, OnDestroy {

  private loadingSub = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSub.asObservable();

  private subs = new Subscription();

  get personDetails$() {
    return this.stateSrvc.personDetails$;
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
        let personId = params.get('id') as unknown as number;
        if (personId == this.stateSrvc.person?.id) return of(this.stateSrvc.person);
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
      this.stateSrvc.person = res});
    this.subs.add(sub);

    sub = this.stateSrvc.personDetails$.pipe(
      filter(details => !!details),
      switchMap(details => {
        if (details.homeworldId) return of(null);
        return this.srvc.getPlanetDetails(details.homeworldUrl);
      })
    ).subscribe(planet => {
      if (!planet) return;

      let _details = { ...this.stateSrvc.person };
      _details.homeworldName = planet.result.properties.name;
      _details.homeworldId = planet.result.uid;
      this.stateSrvc.person = _details;
    });
    this.subs.add(sub);
  }

  getPlanetLink(homeworldId: number) {
    return `/planets/${homeworldId}`;
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
