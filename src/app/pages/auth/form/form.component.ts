import { Component,Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@auth/service/authService';
import { ACTIONS } from '@shared/constants/constant';

export interface OptionsForm{
  id: string;
  label: string;
}
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  authForm!: FormGroup;
  SignIn = ACTIONS.signIn
  @Input() options!:OptionsForm;
  constructor(
    private readonly router: Router,
    private readonly authSvc: AuthService,
    private readonly fb:FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
  }

  async onSubmit(): Promise<void>{
    console.log("Save", this.authForm.value);
    const credentials: any = this.authForm.value;
    let actionToCall;
    
    if(this.options.id === ACTIONS.signIn) {
      actionToCall = this.authSvc.signIn(credentials);
    }else{
      actionToCall = this.authSvc.signUp(credentials);
    }

    try{
      const result = await actionToCall;
      if(result.user.email){
        this.redirectUser();
      }else{        
        console.log("Error");
        
      }
    } catch(error){
      console.log(error);
    }
    this.authSvc.signIn(this.authForm.value);
  }

  private redirectUser(){
    this.router.navigate(['/home'])
  }

  private initForm():void{
    this.authForm = this.fb.group({
      email: ['',Validators.required],
      password: ['', Validators.required]
    })
  }

}
