import {Component, Inject} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogRef} from "@angular/material/dialog";
import {ClientsComponent} from "../../clients.component";
import {FormBuilder} from "@angular/forms";

@Component({
  selector: 'app-delete-dialog',
  standalone: true,
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogClose
  ],
  templateUrl: './delete-dialog.component.html',
  styleUrl: './delete-dialog.component.scss'
})
export class DeleteDialogComponent {

  constructor(  public dialogRef: MatDialogRef<ClientsComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any){

  }
  delete() {
    this.dialogRef.close(true)
  }
}
