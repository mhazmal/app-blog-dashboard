import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private afs: AngularFirestore, private toastr : ToastrService) { }

  saveData(data) {
    this.afs.collection('categories').add(data).then( (docRef) => {
      // console.log(docRef)

      this.toastr.success('Data insert succesfully..!')
    })
    .catch((err) => {
      console.log(err)
    }) 
}

loadData() {
  return this.afs.collection('categories').snapshotChanges().pipe(
    map((action) => {
      return action.map((a) => {
        const id = a.payload.doc.id;
        const data = a.payload.doc.data();
        return {id,data}
      })
    })
  )
}

updateData(id, editData) {
  this.afs.collection('categories').doc(id).update(editData).then( (docRef) => {
    
    this.toastr.info('Data updated succesfully..!')

  })
}

deleteData(id) {
  this.afs.collection('categories').doc(id).delete().then( (docRef) => {
    this.toastr.error('Data Deleted Successfully..!')
  })
}
}
