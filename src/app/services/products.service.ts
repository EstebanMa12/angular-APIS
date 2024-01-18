import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';

import { CreateProductDTO, Product } from './../models/product.model';
import { catchError, retry, map } from 'rxjs/operators';
import { pipe, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private apiUrl = 'https://api.escuelajs.co/api/v1/products';

  constructor(
    private http: HttpClient
  ) { }

  getAll(limit?:number, offset?:number) {
    let params = new HttpParams();
    if(limit && offset){
      params = params.set('limit', limit);
      params = params.set('offset', offset);
    }
    return this.http.get<Product[]>(this.apiUrl, {params})
    .pipe(
      retry(3),
      map(products=> products.map(item=>{
        return{
          ...item,
          taxes: item.price*0.19
        }
      }))
    )
  }

  get(id: string) {
    return this.http.get<Product>(`${this.apiUrl}/${id}`)
    .pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 404) {
          return throwError(()=>'Product not found');
        }
        if(err.status === 500){
          return throwError(()=>'Server error');
        }
        return throwError(()=>'Unknown error');
      })
    )
  }

  create(data: CreateProductDTO){
    return this.http.post<Product>(this.apiUrl, data);
  }

  update(id: string, changes: Partial<CreateProductDTO>){
    return this.http.put<Product>(`${this.apiUrl}/${id}`, changes);
  }

  delete(id: string){
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`);
  }
}
