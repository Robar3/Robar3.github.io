import {Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent, MatDialogModule,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatFormField} from "@angular/material/form-field";
import {MatButton, MatIconButton} from "@angular/material/button";
import {CommonModule, NgIf} from "@angular/common";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ClientsComponent} from "../../clients.component";
import {MatInput, MatInputModule} from "@angular/material/input";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

@Component({
  selector: 'app-client-dialog',
  standalone: true,
  imports: [
    MatDialogContent,
    MatFormField,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    NgIf,
    MatDialogTitle,
    MatIconButton,
    ReactiveFormsModule,
    MatInput,
    FormsModule,
    MatDialogModule,
    MatFormField,
    MatInputModule,
    CommonModule
  ],
  templateUrl: './client-dialog.component.html',
  styleUrl: './client-dialog.component.scss'
})
export class ClientDialogComponent {

  clientForm: FormGroup ;

  constructor(  public dialogRef: MatDialogRef<ClientsComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private fb: FormBuilder,) {
    if (data.method === 'Новый клиент')
    this.clientForm = this.fb.group({
      name: new FormControl('', [Validators.required, Validators.minLength(2)]),
      surname: new FormControl('', [Validators.required, Validators.minLength(2)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [Validators.pattern("^((8|\\+7)[\\- ]?)?(\\(?\\d{3}\\)?[\\- ]?)?[\\d\\- ]{7,10}$")],),
    })
    else {
      this.clientForm = this.fb.group({
        name: new FormControl(data.user.name, [Validators.required, Validators.minLength(2)]),
        surname: new FormControl(data.user.surname, [Validators.required, Validators.minLength(2)]),
        email: new FormControl(data.user.email, [Validators.required, Validators.email]),
        phone: new FormControl(data.user.phone, [Validators.pattern("^((8|\\+7)[\\- ]?)?(\\(?\\d{3}\\)?[\\- ]?)?[\\d\\- ]{7,10}$")],),
      })
    }
  }
  public get f() {
    return this.clientForm.controls
  }

  save() {
    this.dialogRef.close(this.clientForm.value)
  }

}
