import {AfterViewInit, ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {ClientsInterface, UserWithId} from "../interfaces/client-interfase";
import {DeleteDialogComponent} from "../clientDialpg/delete-dialog/delete-dialog.component";
import {ClientService} from "../services/client.service";
import {MatDialog} from "@angular/material/dialog";
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {SelectionModel} from "@angular/cdk/collections";
import {ClientDialogComponent} from "../clientDialpg/client-dialog/client-dialog.component";
import {MatCheckbox} from "@angular/material/checkbox";

@Component({
  selector: 'app-client-table',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatCheckbox],
  templateUrl: './client-table.component.html',
  styleUrl: './client-table.component.scss'

})
export class ClientTableComponent implements AfterViewInit {
  displayedColumns = ["select", "name", "surname", "email", "phone"];
  dataSource: MatTableDataSource<UserWithId> = new MatTableDataSource<UserWithId>();
  selection = new SelectionModel<UserWithId>(true, []);
  selectedID: Array<string> = []

  @ViewChild(MatSort)
  sort: MatSort = new MatSort;

  constructor(clientService: ClientService, public dialog: MatDialog, private cdr: ChangeDetectorRef, private _liveAnnouncer: LiveAnnouncer) {
    const storage = localStorage.getItem('users');
    if (storage !== null) {
      const date: Array<UserWithId> = JSON.parse(storage)
      date.forEach(elem => {
        this.dataSource.data.push(elem)
      })
      cdr.markForCheck()
      this.dataSource.data = this.dataSource.data.slice();
    } else {
      clientService.getData().subscribe((data: ClientsInterface) => {
        for (let i = 0; i < data.users.length; i++) {
          this.dataSource.data.push({...data.users[i], id: i.toString()});
        }
        this.dataSource.data = this.dataSource.data.slice();
        localStorage.setItem("users", JSON.stringify(this.dataSource.data));
      })
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.selectedID = []
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => {
        this.selection.select(row);
        this.selectedID.push(row.id)
      });

  }

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
        method: 'Новый клиент'
      },
      autoFocus: false,
    }).afterClosed().subscribe(user => {
      if (user !== undefined) {
        this.dataSource.data.push({
          ...user,
          id: (this.dataSource.data.length === 0 ? 1 :
            +this.dataSource.data[this.dataSource.data.length - 1].id + 1).toString()
        })
        this.dataSource.data = this.dataSource.data.slice();
        this.cdr.markForCheck()
        localStorage.setItem("users", JSON.stringify(this.dataSource.data));
      }
    })
  }

  refactorUser(user: UserWithId) {
    this.dialog.open(ClientDialogComponent, {
      minWidth: '450px',
      minHeight: '300px',
      data: {
        method: 'Редактирование',
        user: user
      },
      autoFocus: false,
    }).afterClosed().subscribe(refactoredUser => {
      if (refactoredUser !== undefined) {
        let i = this.dataSource.data.findIndex(userInData => user.id === userInData.id)
        this.dataSource.data[i] = refactoredUser;
        this.dataSource.data = this.dataSource.data.slice();
        localStorage.setItem("users", JSON.stringify(this.dataSource.data));
      }

    })
  }

  deleteUser() {
    this.dialog.open(DeleteDialogComponent, {
      minWidth: '400px',
      data: this.selectedID.length,
      autoFocus: false,
    }).afterClosed().subscribe(isDelete => {
      if (isDelete) {
        this.dataSource.data = this.dataSource.data.filter(user => this.selectedID.indexOf(user.id) === -1)
        this.selectedID = [];
        this.selection.clear()
        localStorage.setItem("users", JSON.stringify(this.dataSource.data));
      }
    })
  }

  selectID(id: string) {
    let i = this.selectedID.findIndex(value => value === id)
    if (i === -1) {
      this.selectedID.push(id)
    } else {
      this.selectedID.splice(i, 1);
    }

  }
}
