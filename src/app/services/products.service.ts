import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { CreateProductDTO, Product } from './../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private apiUrl = 'https://api.escuelajs.co/api/v1/products';

  constructor(
    private http: HttpClient
  ) { }

  getAll() {
    return this.http.get<Product[]>(this.apiUrl);
  }

  get(id: string) {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  create(data: CreateProductDTO){
    return this.http.post<Product>(this.apiUrl, data);
  }

  update(id: string, changes: Partial<CreateProductDTO>){
    return this.http.put<Product>(`${this.apiUrl}/${id}`, changes);
  }
}
