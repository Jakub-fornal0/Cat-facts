import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

interface MeowResponse {
  data: string[];
}

@Injectable({ providedIn: 'root' })
export class CatFactsService {
  private readonly apiUrl: string = 'https://meowfacts.herokuapp.com/';
  private readonly http = inject(HttpClient);

  public getFact(): Observable<string> {
    return this.http
      .get<MeowResponse>(this.apiUrl)
      .pipe(map((res: MeowResponse) => res.data[0]));
  }
}
