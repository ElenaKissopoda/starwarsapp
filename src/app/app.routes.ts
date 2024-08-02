import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'persons',
        children: [
            {
                path: '',
                loadComponent: () => import('./persons-list-page/persons-list-page.component').then(m => m.PersonsListPageComponent)
            },
            {
                path: ':id',
                loadComponent: () => import('./person-details-page/person-details-page.component').then(m => m.PersonDetailsPageComponent)
            }
        ]
    },
    {
        path: 'planets',
        children: [
            {
                path: ':id',
                loadComponent: () => import('./planet-details-page/planet-details-page.component').then(m => m.PlanetDetailsPageComponent)
            }
        ]
    },
    {
        path: '', redirectTo: '/persons', pathMatch: 'full'
    }, 
    {
        path: '**', redirectTo: '/persons', pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }
