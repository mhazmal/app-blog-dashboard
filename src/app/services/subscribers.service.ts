import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SubscribersService {

  constructor(private afs : AngularFirestore, private toastr : ToastrService) { }

  loadData() {
    return this.afs.collection('subscribers').snapshotChanges().pipe(
      map((action) => {
        return action.map((a) => {
          const id = a.payload.doc.id;
          const data = a.payload.doc.data();
          return {id,data}
        })
      })
    )
  }

  deleteData(id) {
    this.afs.collection('subscribers').doc(id).delete().then( (docRef) => {
      this.toastr.error('Data Deleted Successfully..!')
    })
  }
}
