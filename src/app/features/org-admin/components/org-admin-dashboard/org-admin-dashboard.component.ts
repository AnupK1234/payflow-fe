import { Component } from "@angular/core";
import { NavbarComponent } from "../../../../shared/components/navbar/navbar.component";
import { RouterLink, RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-org-admin-dashboard',
  standalone: true,
  imports: [NavbarComponent, RouterOutlet, RouterLink],
  templateUrl: './org-admin-dashboard.component.html',
  styleUrls: ['./org-admin-dashboard.component.css'],
})
export class OrgAdminDashboardComponent {

}
