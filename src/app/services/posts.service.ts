import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private storage : AngularFireStorage,
     private afs : AngularFirestore, 
     private toastr : ToastrService,
     private router : Router) {}

  uploadImage(selectedImg, postDataValue, formStatus, docId) {
    const filePath = `postIMG/${Date.now()}`;
    console.log(filePath)

    this.storage.upload(filePath,selectedImg).then( () => {
      console.log('post image uploaded successfully');

      this.storage.ref(filePath).getDownloadURL().subscribe( (URL) => {
        // console.log(URL)

        postDataValue.postImgPath = URL;
        console.log(postDataValue);

        if(formStatus === 'Edit'){
          this.updateData(docId, postDataValue)
        }else{
            this.saveData(postDataValue);

        }


      })
    })
  }

  saveData(postData) {
    this.afs.collection('posts').add(postData).then((docRef) => {
      this.toastr.success('Data Inserted Successfully');
      this.router.navigate(['/posts'])
    })
  }
  
  loadData() {
    return this.afs.collection('posts').snapshotChanges().pipe(
      map((action) => {
        return action.map((a) => {
          const id = a.payload.doc.id;
          const data = a.payload.doc.data();
          return {id,data}
        })
      })
    )
  }

  loadOneData(id) {
    // return this.afs.collection('posts').doc(id).valueChanges()
    return this.afs.doc(`posts/${id}`).valueChanges()

  }

  updateData(id, selectedPostData) {
    this.afs.collection('posts').doc(id).update(selectedPostData).then( () => {
      this.toastr.info('Data Updated Successfully');
      this.router.navigate(['/posts'])
    })
  }

  deleteImage(postImgPath, id){
    this.storage.storage.refFromURL(postImgPath).delete().then( () => {
      this.deleteData(id)
    })
  }

  deleteData(id) {
    this.afs.doc(`posts/${id}`).delete().then( () => {
      this.toastr.error("Data Deleted..!");
    })
  }

  markFeatured(id, featuredData) {
    this.afs.doc(`posts/${id}`).update(featuredData).then( () => {
      this.toastr.info('Featured Status Updated..')
    })
  }
}
