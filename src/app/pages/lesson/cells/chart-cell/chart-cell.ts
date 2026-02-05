import { AfterViewInit, Component, ElementRef, input, ViewChild } from '@angular/core';
import * as Plotly from 'plotly.js-dist-min';

@Component({
  selector: 'app-chart-cell',
  imports: [],
  templateUrl: './chart-cell.html',
  styleUrl: './chart-cell.css',
})
export class ChartCell implements AfterViewInit {
  data = input<any>();
  @ViewChild('plotContainer', { static: true })
  plotContainer!: ElementRef;

  ngAfterViewInit() {
    // const fig = JSON.parse(this.data().content);
    const fig = this.data().metadata;
    Plotly.newPlot(
      this.plotContainer.nativeElement,
      fig.data,
      fig.layout,
      { responsive: true }
    );
    window.addEventListener('resize', () => {
      Plotly.Plots.resize(this.plotContainer.nativeElement);
    });
  }
}
