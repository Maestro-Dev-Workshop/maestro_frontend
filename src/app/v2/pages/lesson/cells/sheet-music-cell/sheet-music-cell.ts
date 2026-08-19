import {
  Component,
  input,
  effect,
  ElementRef,
  ViewChild,
  AfterViewInit
} from '@angular/core';

import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay';

@Component({
  selector: 'app-sheet-music-cell',
  templateUrl: './sheet-music-cell.html',
  styleUrl: './sheet-music-cell.css',
})
export class SheetMusicCell implements AfterViewInit {

  data = input<any>();
  musicXML = '';

  @ViewChild('osmdContainer', { static: true })
  container!: ElementRef<HTMLDivElement>;

  private osmd!: OpenSheetMusicDisplay;
  private isReady = false;

  constructor() {
    effect(() => {
      const d = this.data();
      if (!d) return;

      this.musicXML = d.content;
      // console.log(d.metadata.title)
      // console.log(this.musicXML)

      // Only render if OSMD is initialized
      if (this.isReady) {
        queueMicrotask(() => this.render());
      }
    });
  }

  ngAfterViewInit() {
    this.initOSMD();
    this.isReady = true;

    if (this.musicXML) {
      this.render();
    }
  }

  private initOSMD() {
    this.osmd = new OpenSheetMusicDisplay(this.container.nativeElement, {
      backend: 'svg',
      drawTitle: true,
      autoResize: true,
      spacingFactorSoftmax: 5,
      renderSingleHorizontalStaffline: false
    });
  }

  private async render() {
    if (!this.osmd || !this.musicXML) return;

    try {
      await this.osmd.load(this.musicXML);
      this.osmd.render();
    } catch (err) {
      console.error('OSMD render error:', err);
    }
  }
}