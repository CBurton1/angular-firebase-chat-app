import { Component, EventEmitter, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";

import { UserService } from "../services/user.service";

@Component({
  selector: "afca-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent {
  @Output() public receivedUser: EventEmitter<AFCA.User> = new EventEmitter();
  public loginSubmitting = false;
  public loginForm: FormGroup = new FormGroup({
    email: new FormControl("", [Validators.required]),
    password: new FormControl("", [Validators.required])
  });

  constructor(private userService: UserService) {}

  public login(): void {
    this.userService.login(this.loginForm.value.email, this.loginForm.value.password)
      .subscribe((user) => {
        console.log(user);
        this.receivedUser.emit(user);
      });
  }
}
