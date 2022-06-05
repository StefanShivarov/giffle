import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GifService {

  constructor(private http: HttpClient) { }

  getTrendingGifs(): Observable<any>{
    return this.http.get(`${environment.giphyApiUrl}/trending?api_key=${environment.giphyApiKey}&offset=0&limit=20`);
  }

  searchGifs(searchQuery: string, offset: number): Observable<any>{
    if(searchQuery === '' || searchQuery === null){
      return this.http.get(`${environment.giphyApiUrl}/trending?api_key=${environment.giphyApiKey}&offset=${offset}&limit=20`);
    }else{
      return this.http.get(`${environment.giphyApiUrl}/search?q=${searchQuery}&api_key=${environment.giphyApiKey}&offset=${offset}&limit=20`);
    }
  }
}
