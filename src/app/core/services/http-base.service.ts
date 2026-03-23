import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * Base HTTP service providing common API request methods.
 * All API services should inject this service for making HTTP calls.
 */
@Injectable({
  providedIn: 'root',
})
export class HttpBaseService {
  private readonly apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  /**
   * Makes a GET request to the specified endpoint.
   * @param endpoint - The API endpoint (without base URL)
   * @returns Observable of the response
   */
  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${endpoint}`);
  }

  /**
   * Makes a POST request to the specified endpoint.
   * @param endpoint - The API endpoint (without base URL)
   * @param body - The request body
   * @returns Observable of the response
   */
  post<T>(endpoint: string, body: unknown): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}/${endpoint}`, body);
  }

  /**
   * Makes a PUT request to the specified endpoint.
   * @param endpoint - The API endpoint (without base URL)
   * @param body - The request body
   * @returns Observable of the response
   */
  put<T>(endpoint: string, body: unknown): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}/${endpoint}`, body);
  }

  /**
   * Makes a DELETE request to the specified endpoint.
   * @param endpoint - The API endpoint (without base URL)
   * @returns Observable of the response
   */
  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}/${endpoint}`);
  }
}
