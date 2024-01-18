import { Component, OnInit } from '@angular/core';

import { CreateProductDTO, Product } from '../../models/product.model';

import { StoreService } from '../../services/store.service';
import { ProductsService } from '../../services/products.service';

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

  constructor(
    private storeService: StoreService,
    private productsService: ProductsService
  ) {
    this.myShoppingCart = this.storeService.getShoppingCart();
  }

  ngOnInit(): void {
    this.productsService.getAll()
    .subscribe(data => {
      this.products = data;
    });
  }

  onAddToShoppingCart(product: Product) {
    this.storeService.addProduct(product);
    this.total = this.storeService.getTotal();
  }

  toggleProductDetail(){
    this.showProductDetail = !this.showProductDetail;
  }

  onShowDetail(id: string){
    this.toggleProductDetail();
    this.productsService.get(id)
    .subscribe(data => {
      // this.toggleProductDetail();
      this.productChosen = data;
      console.log(this.productChosen);

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

}
