import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Employee } from '../model/employee';
import { Firestore, collectionData, collection, addDoc } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private employees$: BehaviorSubject<Employee[]> = new BehaviorSubject<Employee[]>([]);

  constructor(private firestore: Firestore) {}

  get employees(): Observable<Employee[]> {
    return this.employees$.asObservable();
  }

  addEmployee(employee: Employee): Promise<void> {
    const employeesCollection = collection(this.firestore, 'employees');
    return addDoc(employeesCollection, { ...employee }).then(() => {
      this.getEmployees(); 
    });
  }

  getEmployees(): void {
    const employeesCollection = collection(this.firestore, 'employees');
    collectionData(employeesCollection, { idField: 'id' })
      .pipe(
        map((data) =>
          data.map((employee) => ({
            ...employee,
            dateOfBirth: (employee['dateOfBirth'] as any).toDate() 
          })) as Employee[]
        )
      )
      .subscribe((employees) => this.employees$.next(employees));
  }
}
