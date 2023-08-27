import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CategoriesService } from '../services/categories.service';
import { Category } from '../models/category';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  categoryArray : Array<any>;
  updateCategory : string;
  formStatus : string = 'Add';
  categoryId : string;

 constructor(private categoryService: CategoriesService) {}

 ngOnInit(): void {
   this.categoryService.loadData().subscribe((val) => {
    console.log(val);
    this.categoryArray = val;
   })
 }

onSubmit(form : NgForm){

let categoryData : Category = {
  category: form.value.categoryName
};

if( this.formStatus === 'Add') {
 this.categoryService.saveData(categoryData)

}else if( this.formStatus === 'Edit'){
  this.categoryService.updateData(this.categoryId, categoryData)
}


form.reset();
this.formStatus = 'Add'

}

onEdit(updateData, catId)
{
  this.updateCategory = updateData;
  this.formStatus = 'Edit';
  this.categoryId = catId;
}

onDelete(id) {
  this.categoryService.deleteData(id);
}
}
