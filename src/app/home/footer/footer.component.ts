import { Episode } from './../../models/episode.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  episode: Episode;
  constructor() {}

  ngOnInit() {}
}
