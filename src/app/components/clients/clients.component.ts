import {AfterViewInit, ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {ClientService} from "./services/client.service";
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable, MatTableDataSource
} from "@angular/material/table";
import {ClientsInterface, User, UserWithId} from "./interfaces/client-interfase";
import {MatCheckbox} from "@angular/material/checkbox";
import {AsyncPipe} from "@angular/common";
import {SelectionModel} from "@angular/cdk/collections";
import {MatDialog} from "@angular/material/dialog";
import {ClientDialogComponent} from "./clientDialpg/client-dialog/client-dialog.component";
import {DeleteDialogComponent} from "./clientDialpg/delete-dialog/delete-dialog.component";
import {MatSort, MatSortHeader, Sort} from "@angular/material/sort";
import {LiveAnnouncer} from "@angular/cdk/a11y";

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [
    MatTable,
    MatHeaderCell,
    MatCell,
    MatColumnDef,
    MatCheckbox,
    MatHeaderRow,
    MatRow,
    MatRowDef,
    MatHeaderRowDef,
    MatCellDef,
    MatHeaderCellDef,
    AsyncPipe,
    MatSort,
    MatSortHeader
  ],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss'
})
export class ClientsComponent{
  dataSource:Array<UserWithId> = [];
  displayedColumns = ["select","name","surname","email","phone"];
  selection = new SelectionModel<User>(true, []);
  selectedID:Array<string> =[]
  // dataSource = new MatTableDataSource();


  constructor(clientService: ClientService, public dialog: MatDialog,private cdr:ChangeDetectorRef,private _liveAnnouncer: LiveAnnouncer) {
    const storage = localStorage.getItem('users')
    if (storage!==null){
      this.dataSource = JSON.parse(storage);
    }else {
      clientService.getData().subscribe((data: ClientsInterface) => {
        let users:Array<UserWithId> = [];
        for (let i = 0; i < data.users.length; i++) {
          users.push({...data.users[i],id:i.toString()});
        }
        this.dataSource=users
        localStorage.setItem ("users", JSON.stringify(this.dataSource));
      })
    }
  }

  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.forEach(row => {
        this.selection.select(row);
        this.selectedID.push(row.id)
      });

  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: UserWithId): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }

    return `${this.selection.isSelected(row) ? 'deselect' : 'select'}`;

  }

  addUser() {
    this.dialog.open(ClientDialogComponent, {
      minWidth: '400px',
      data: {
        method:'Новый клиент'
      },
      autoFocus: false,
    }).afterClosed().subscribe(user=>{
      this.dataSource.push({...user,id:(+this.dataSource[this.dataSource.length-1].id+1).toString()})
      this.dataSource = this.dataSource.concat()
      console.log(this.dataSource)
      this.cdr.markForCheck()
      localStorage.setItem ("users", JSON.stringify(this.dataSource));
    })
  }
  refactorUser(user:UserWithId) {
    const dialogRef = this.dialog.open(ClientDialogComponent, {
      minWidth: '400px',
      data: {
        method:'Редактирование',
        user:user
      },
      autoFocus: false,
    }).afterClosed().subscribe(refactoredUser=>{
      let i =this.dataSource.findIndex(userInData=>user.id===userInData.id)
      this.dataSource[i] = refactoredUser;
      this.dataSource = this.dataSource.concat();
      localStorage.setItem ("users", JSON.stringify(this.dataSource));
    })
  }

  deleteUser() {
    this.dialog.open(DeleteDialogComponent, {
      minWidth: '400px',
      data: this.selectedID.length,
      autoFocus: false,
    }).afterClosed().subscribe(isDelete=>{
      if (isDelete){
        console.log(this.selectedID)
        this.dataSource = this.dataSource.filter(user=> this.selectedID.indexOf( user.id ) === -1)
        localStorage.setItem ("users", JSON.stringify(this.dataSource));
      }
    })
  }

  selectID(id:string) {
    let i =this.selectedID.findIndex(value=>value===id)
    if (i === -1){
      this.selectedID.push(id)
    }else {
      this.selectedID.splice(i,1);
    }

  }
  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this.dataSourceFromRequest.sort()
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}
