import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CartComponent } from './components/cart/cart.component';
import { ProductComponent } from './components/product/product.component';
import { ProductCategoryComponent } from './components/product-category/product-category.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { CompraFinalizadaComponent } from './components/compra-finalizada/compra-finalizada.component';
import { CompraPendenteComponent } from './components/compra-pendente/compra-pendente.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'cart', component: CartComponent },
    { path: 'produto/:id', component: ProductComponent },
    { path: 'categoria/:categoria', component: ProductCategoryComponent },
    { path: 'categoria/:categoria/:subcategoria', component: ProductCategoryComponent },
    { path: 'checkout', component: CheckoutComponent },
    { path: 'compra-finalizada', component: CompraFinalizadaComponent },
    { path: 'compra-pendente', component: CompraPendenteComponent }

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
