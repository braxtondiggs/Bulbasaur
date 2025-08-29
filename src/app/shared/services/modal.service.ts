import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private readonly modalOpenSubject = new BehaviorSubject<boolean>(false);
  public modalOpen$ = this.modalOpenSubject.asObservable();

  public setModalOpen(isOpen: boolean): void {
    this.modalOpenSubject.next(isOpen);
  }

  public isModalOpen(): boolean {
    return this.modalOpenSubject.value;
  }
}
