import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-details-pane',
  templateUrl: './details-pane.component.html',
  styleUrls: ['./details-pane.component.css']
})
export class DetailsPaneComponent {
  @Input() city?: string;
  @Input() state?: string;
  @Input() latitude?: number;
  @Input() longitude?: number;

}
