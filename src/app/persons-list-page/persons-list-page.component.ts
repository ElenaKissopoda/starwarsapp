import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, finalize, Subscription, tap } from 'rxjs';
import { ApiService } from '../services/api.service';
import { StateService } from '../services/state.service';
import { LoadingIndicatorComponent } from '../loading-indicator/loading-indicator.component';

@Component({
  selector: 'app-persons-list-page',
  standalone: true,
  imports: [CommonModule, LoadingIndicatorComponent],
  templateUrl: './persons-list-page.component.html',
  styleUrl: './persons-list-page.component.scss'
})
export class PersonsListPageComponent implements OnInit, OnDestroy {

  private dataSub = new BehaviorSubject<any[]>([]);
  data$ = this.dataSub.asObservable();

  private loadingSub = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSub.asObservable();

  private subs = new Subscription();

  get hasMoreData() {
    return this.stateSrvc.nextUrl != null;
  }

  constructor(
    private srvc: ApiService,
    private stateSrvc: StateService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (this.stateSrvc.persons.length == 0)
      this.filter();
    else
      this.dataSub.next(this.stateSrvc.persons);
  }

  goTo(r: any) {
    this.router.navigate([`/persons/${r.uid}`]);
  }

  filter() {
    this.loadingSub.next(true);
    const sub = this.srvc.getPeople(this.stateSrvc.nextUrl).pipe(
      finalize(() => this.loadingSub.next(false))
    ).subscribe(resp => {
      let _data = [...this.dataSub.value, ...resp.results];
      this.dataSub.next(_data);
      this.stateSrvc.persons = _data;
      this.stateSrvc.nextUrl = resp.next;
    });
    this.subs.add(sub);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
