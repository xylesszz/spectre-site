export class Loading {
  private el: HTMLElement;

  constructor() {
    this.el = document.createElement('div');
    this.el.className = 'loading-screen';
    this.el.innerHTML = `
      <div class="loading-content">
        <div class="loading-logo">SPECTRE</div>
        <div class="loading-spinner"></div>
      </div>
    `;
    document.body.appendChild(this.el);
    setTimeout(() => this.hide(), 800);
  }

  hide(): void {
    this.el.classList.add('loading-hidden');
    setTimeout(() => {
      this.el.remove();
    }, 400);
  }
}