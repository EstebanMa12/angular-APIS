import { Component, OnInit } from '@angular/core';

import { CreateProductDTO, Product } from '../../models/product.model';

import { StoreService } from '../../services/store.service';
import { ProductsService } from '../../services/products.service';
import Swal from 'sweetalert2';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  myShoppingCart: Product[] = [];
  total = 0;
  products: Product[] = [];
  showProductDetail = false;
  productChosen: Product = {
    id: '',
    price: 0,
    images: [],
    title: '',
    category: {
      id:'',
      name:'',
    },
    description: ''
  }

  limit = 10;
  offset = 0;
  statusDetail : 'loading'|'success'| 'error' | 'init' = 'init';

  constructor(
    private storeService: StoreService,
    private productsService: ProductsService
  ) {
    this.myShoppingCart = this.storeService.getShoppingCart();
  }

  ngOnInit(): void {
    this.loadData()
  }

  onAddToShoppingCart(product: Product) {
    this.storeService.addProduct(product);
    this.total = this.storeService.getTotal();
  }

  toggleProductDetail(){
    this.showProductDetail = !this.showProductDetail;
  }

  onShowDetail(id: string){
    this.statusDetail = 'loading';
    this.productsService.get(id)
    .subscribe({
      next: (data) => {
          this.toggleProductDetail();
          this.productChosen = data;
          this.statusDetail = 'success';
        },
        error: (error) => {
          console.log(error);
          this.statusDetail = 'error';
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error,
            confirmButtonText: 'Aceptar'
          })
        }
      }
    );
  }

  readAndUpdate(id: string){
    this.productsService.get(id)
    .pipe(
      switchMap(product => {
        const changes: Partial<CreateProductDTO> = {
          title: 'Producto actualizado',
        }
        return this.productsService.update(id, changes);
      }
    ))
    .subscribe(data => {
      console.log('Read',data);
    });

  }

  createNewProduct(){
    const product: CreateProductDTO = {
      title: 'Producto nuevo',
      price: 100,
      images: ['https://i.picsum.photos/id/237/200/300.jpg', 'https://i.picsum.photos/id/237/200/300.jpg'],
      description: 'Descripción del producto',
      categoryId: 1
    }

    this.productsService.create(product)
    .subscribe(data => {
      // console.log('Created',data);
      this.products.unshift(data);
    });
  }

  updateProduct(){
    const changes: Partial<CreateProductDTO> = {
      title: 'Producto actualizado',
    }
    const id = this.productChosen.id;
    this.productsService.update(id, changes)
    .subscribe(data => {
      // console.log('Updated',data);
      const index = this.products.findIndex(item => item.id === id);
      this.products[index] = data;
      this.productChosen = data;
    });
  }

  deleteProduct(){
    const id = this.productChosen.id;
    this.productsService.delete(id)
    .subscribe(data => {
      // console.log('Deleted',data);
      const index = this.products.findIndex(item => item.id === id);
      this.products.splice(index, 1);
      this.toggleProductDetail();
    });
  }
  loadData(){
    this.productsService.getAll(this.limit, this.offset)
    .subscribe(data => {
      this.products = this.products.concat(data);
      this.offset += this.limit;
    });
  }

}
