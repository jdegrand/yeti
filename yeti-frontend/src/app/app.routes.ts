import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { KanbanBoardComponent } from './components/kanban-board/kanban-board.component';

export const routes: Routes = [
    // Login, register, task list, task details
    { path: 'home', component: HomePageComponent },
    { path: 'test', component: KanbanBoardComponent }
];
