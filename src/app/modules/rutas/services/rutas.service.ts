import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Ruta } from '../models/ruta.model';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RutasService {
  private apiUrl :string= 'http://40.233.5.25/api/routes';

  constructor (private http : HttpClient ) { }

  // GET - Obtener todas las rutas
  getRutas(): Observable<Ruta[]> {
    return this.http.get<Ruta []>( this.apiUrl )
      .pipe(
        retry(1), // Reintentar una vez en caso de error
        catchError(this.handleError)
      );
  }

  // GET - Obtener una ruta por ID
  getRuta(id: number): Observable<Ruta> {
    return this.http.get<Ruta>( `${this.apiUrl}/${id}` )
      .pipe(
        retry(1), // Reintentar una vez en caso de error
        catchError(this.handleError)
      );
  }

  // POST - Crear una nueva ruta
  createRuta(ruta: Ruta): Observable<Ruta> {
    return this.http.post<Ruta>(this.apiUrl, ruta)
      .pipe(
        catchError(this.handleError)
      );
  }

  // PUT - Actualizar una ruta
  updateRuta(id: number, ruta: Ruta): Observable<Ruta> {
    return this.http.put<Ruta>(`${this.apiUrl}/${id}`, ruta)
      .pipe(
        catchError(this.handleError)
      );
  }

  // DELETE - Eliminar una ruta
  deleteRuta(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Manejo de Errores
  private handleError(error: HttpErrorResponse){
    let errorMessage = '';

    if(error.error instanceof ErrorEvent){
      //Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;

    } else {
      //Error del lado del servidor
      errorMessage = `Código de error ${error.status}\n Mensaje: ${error.message}`
    }

    console.log(errorMessage);
    return throwError( () => errorMessage );
  }
}
