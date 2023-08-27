import { Component, OnInit } from '@angular/core';
import { validateEventsArray } from '@angular/fire/compat/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Post } from 'src/app/models/post';
import { CategoriesService } from 'src/app/services/categories.service';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css']
})
export class NewPostComponent implements OnInit {

  permalink : string ='';
  imgSrc : any = '../../assets/img-icon.png';
  selectedImage : string;
  categories : Array<any>;

  postForm : FormGroup;

  post:any;
  formStatus: string = 'Add New';
  docId: any;

  constructor(private categoryService : CategoriesService, private postService : PostsService,  private route : ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((val) => {
      // console.log(val)
      this.docId = val['id']; 

      if(this.docId){

        this.postService.loadOneData(val['id']).subscribe( (postData) => {
          console.log(postData)
          this.post = postData;
    
          this.postForm = new FormGroup({
            title : new FormControl(this.post.title,[Validators.required, Validators.minLength(10)]),
            permalink : new FormControl({value:this.post.permalink,disabled:true}, Validators.required),
            excerpt : new FormControl(this.post.excerpt,[Validators.required,Validators.minLength(50)]),
            category : new FormControl(`${this.post.category.categoryId}-${this.post.category.category}`,Validators.required),
            postImg : new FormControl('',Validators.required),
            content : new FormControl(this.post.content,Validators.required)
          })
    
          this.imgSrc = this.post.postImgPath;
          this.formStatus = 'Edit'
        })

      }else{
        this.postForm = new FormGroup({
          title : new FormControl('',[Validators.required, Validators.minLength(10)]),
          permalink : new FormControl({value:'',disabled:true}, Validators.required),
          excerpt : new FormControl('',[Validators.required,Validators.minLength(50)]),
          category : new FormControl('',Validators.required),
          postImg : new FormControl('',Validators.required),
          content : new FormControl('',Validators.required)
        })
      }
    

    })

    this.categoryService.loadData().subscribe( val => {
      this.categories = val;
    })  
  }

  get fc(){
    return this.postForm.controls
  }

  onSubmit() {
    console.log(this.postForm.getRawValue())
    let a = this.postForm.getRawValue();

    let splitted = this.postForm.value.category.split('-');
    // console.log(splitted)

    const postData : Post = {
      title : a.title,
      permalink : a.permalink,
      category : {
        categoryId : splitted[0],
        category : splitted[1]
      },
      postImgPath : '',
      excerpt : a.excerpt,
      content : a.content,
      isFeatured : false,
      views : 0,
      status : 'new',
      createdAt : new Date()
    }

    // console.log(postData);
    this.postService.uploadImage(this.selectedImage,postData,this.formStatus,this.docId);
    this.postForm.reset();
    this.imgSrc = '../../assets/img-icon.png';
  }


  onTitleChange(eventData) {
    const title = eventData.target.value;
    this.permalink = title.replace(/\s/g, '-')
  }

  showPreview(eventData) {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imgSrc = e.target.result
    }

    reader.readAsDataURL(eventData.target.files[0]);
    this.selectedImage = eventData.target.files[0];
  }

 

}
