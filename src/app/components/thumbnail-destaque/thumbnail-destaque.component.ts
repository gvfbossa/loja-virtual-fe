import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-thumbnail-destaque',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './thumbnail-destaque.component.html',
  styleUrls: ['./thumbnail-destaque.component.css']
})
export class ThumbnailDestaqueComponent {
  @Input() produto: any;
}
