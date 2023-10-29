import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth/service/authService';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
user$ = this.authSvc.user$;
  constructor(private readonly authSvc: AuthService) {}

  async onLogout():Promise<void>{
    try{
      await this.authSvc.signOut()
    }catch(error){
      console.log(error);
    }
  }
}
