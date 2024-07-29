import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getPeople(apiUrl: string | null): Observable<any> {
    if(apiUrl == null) apiUrl = 'https://www.swapi.tech/api/people';
    return this.http.get<any>(apiUrl);
  }

  getPersonDetails(characterId: number): Observable<any> {
    const apiUrl = `https://www.swapi.tech/api/people/${characterId}`;
    return this.http.get<any>(apiUrl);
  }

  getPlanetDetails(apiUrl: string) {
    return this.http.get<any>(apiUrl);
  }

  getPlanetDetailsById(planetId: number) {
    const apiUrl = `https://www.swapi.tech/api/planets/${planetId}`;
    return this.http.get<any>(apiUrl);
  }
}
