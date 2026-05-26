import {
  Component,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  input,
  viewChild,
  effect
} from '@angular/core';

declare global {
  interface Window {
    initRDKitModule: any;
    RDKit: any;
  }
}

@Component({
  selector: 'app-ketcher-cell',
  templateUrl: './ketcher-cell.html',
  styleUrl: './ketcher-cell.css',
})
export class KetcherCell implements AfterViewInit, OnDestroy {

  data = input<any>();

  container =
    viewChild.required<ElementRef<HTMLDivElement>>('container');

  private rdkit: any;
  private lastMol?: string;

  private syncInput = effect(() => {
    // console.log(this.data())
    const mol = this.data()?.content;
    if (mol && this.rdkit) {
      void this.render(mol);
    }
  });

  async ngAfterViewInit() {
    await this.initializeRDKit();
  }

  ngOnDestroy() {
    this.container().nativeElement.innerHTML = '';
  }

  private async initializeRDKit() {
    // IMPORTANT: load WASM module correctly
    if (!window.initRDKitModule) {
      throw new Error('RDKit WASM not loaded in index.html');
    }

    this.rdkit = await window.initRDKitModule();

    const mol = this.data()?.content;
    if (mol) {
      await this.render(mol);
    }
  }

  private async render(molBlock: string) {
    if (!molBlock || molBlock === this.lastMol) return;

    const el = this.container().nativeElement;

    try {
      const molecule = this.rdkit.get_mol(molBlock);
      const svg = molecule.get_svg();

      el.innerHTML = svg;

      this.lastMol = molBlock;

      molecule.delete?.();
    } catch (e) {
      console.error('RDKit render error:', e);
      el.innerHTML = '<div>Invalid molecule</div>';
    }
  }
}