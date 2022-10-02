import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-owlcarousel',
  templateUrl: './owlcarousel.component.html',
  styleUrls: ['./owlcarousel.component.css']
})
export class OwlcarouselComponent implements OnInit {

  constructor() { }

  ngOnInit(): void{
  }

  images = [
    'https://dummyimage.com/270x480/000/fff', 
    //  'assets/images/login-2.jpg',
    //  'assets/images/login-3.jpg',
    //  'assets/images/login-4.jpg',
  ];  
  SlideOptions = {  navigation : false, transitionStyle:"fade",autoplay:true,items: 1,loop:true,animateIn: 'fadeIn',
  animateOut: 'fadeOut',touchDrag  : false,mouseDrag  : false, dots: false,};  
  CarouselOptions = { items: 1, dots: false, nav: false };
}
