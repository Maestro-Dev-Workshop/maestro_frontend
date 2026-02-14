import { AfterViewInit, Component, effect, ElementRef, input, ViewChild } from '@angular/core';
import * as Plotly from 'plotly.js-dist-min';

@Component({
  selector: 'app-chart-cell',
  imports: [],
  templateUrl: './chart-cell.html',
  styleUrl: './chart-cell.css',
})
export class ChartCell {
  data = input<any>();
  @ViewChild('plotContainer', { static: true })
  plotContainer!: ElementRef;
  context = ''

  private updateOnInputChange = effect(() => {
    const fig = this.data().metadata.graph_content;
    this.context = this.data().content
    Plotly.newPlot(
      this.plotContainer.nativeElement,
      fig.data,
      fig.layout,
      { responsive: true }
    );
    window.addEventListener('resize', () => {
      Plotly.Plots.resize(this.plotContainer.nativeElement);
    });
  });
}
