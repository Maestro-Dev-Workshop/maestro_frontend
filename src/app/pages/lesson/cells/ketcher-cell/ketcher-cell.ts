import { Component, input, viewChild, ElementRef, AfterViewInit, effect, OnDestroy } from '@angular/core';

declare global {
  interface Window {
    ketcher: any;
  }
}

@Component({
  selector: 'app-ketcher-cell',
  imports: [],
  templateUrl: './ketcher-cell.html',
  styleUrl: './ketcher-cell.css',
})
export class KetcherCell
implements AfterViewInit, OnDestroy {

  data = input<any>();

  container = viewChild.required<ElementRef<HTMLDivElement>>('container');

  private initialized = false;

  private syncInput = effect(async () => {
    const mol =this.data()?.content;
    if (this.initialized && mol) {
      await this.renderMol(mol);
    }
  });

  async ngAfterViewInit() {
    await this.initialize();
  }

  ngOnDestroy() {
    this.container().nativeElement.innerHTML = '';
  }

  private async initialize() {

    const host = this.container().nativeElement;

    host.innerHTML =
      `
      <iframe
        src="/assets/ketcher/index.html"
        class="w-full h-full">
      </iframe>
      `;

    const iframe = host.querySelector('iframe');

    iframe?.addEventListener('load', async () => {
      this.initialized = true;
      const mol = this.data()?.content;

      if (mol) {
        await this.renderMol(mol);
      }
    });
  }

  private async renderMol(molBlock: string) {
    const iframe = this.container().nativeElement.querySelector('iframe') as HTMLIFrameElement;

    const ketcher = iframe?.contentWindow?.ketcher;
    if (!ketcher)
      return;

    await ketcher.setMolecule(molBlock);
  }
}