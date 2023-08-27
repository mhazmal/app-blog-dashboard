import { Component, OnInit } from '@angular/core';
import { SubscribersService } from '../services/subscribers.service';

@Component({
  selector: 'app-subscribers',
  templateUrl: './subscribers.component.html',
  styleUrls: ['./subscribers.component.css']
})
export class SubscribersComponent implements OnInit {

  subscribersArray : Array<any>;

  constructor(private subscriberService : SubscribersService) {}

  ngOnInit(): void {
    this.subscriberService.loadData().subscribe((val) => {
      this.subscribersArray = val;
      console.log(this.subscribersArray)
    })
  }

  onDelete( id) {
    this.subscriberService.deleteData(id)
  }

}
