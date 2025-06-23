import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { EventsComponent } from './events/events.component';
import { CreateEventComponent } from './create-event/create-event.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AuthGuard } from './services/auth.guard';
import { EventsDetailComponent } from './events-detail/events-detail.component';
import { FavouritesComponent } from './favourites/favourites.component';
import { CategoriesComponent } from './categories/categories.component';
import { AdminComponent } from './admin/admin.component';

const routes: Routes = [
  { path: '',component: HomeComponent},
  { path: 'events', component: EventsComponent },
  { path: 'events/:id', component: EventsDetailComponent },
  { path: 'create-event', component: CreateEventComponent , canActivate: [AuthGuard]},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'favourites', component: FavouritesComponent, canActivate: [AuthGuard] },
  { path: 'categories/:category', component: CategoriesComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
