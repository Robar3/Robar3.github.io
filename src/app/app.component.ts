import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ClientTableComponent} from "./components/clients/client-table/client-table.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ClientTableComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'inicium';
}
