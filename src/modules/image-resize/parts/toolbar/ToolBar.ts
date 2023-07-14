import { BaseModule } from "../BaseModule";
import { ToolbarAlignment, toolbarAlignments } from "./toolbarAlignments";

export class Toolbar extends BaseModule {
  public toolbar?: HTMLDivElement;
  public alignments: ToolbarAlignment[] = [];
  private buttons: HTMLSpanElement[] = [];

  onCreate = () => {
    // Setup Toolbar
    this.toolbar = document.createElement("div");
    Object.assign(this.toolbar.style, this.options.toolbarStyles);
    this.overlay.appendChild(this.toolbar);

    // Setup Buttons
    if (this.img) this.alignments = toolbarAlignments(this.img);
    this._addToolbarButtons();

    // Set default button to active if no alignment is applied to image
    const alignmentApplied = this.alignments.some((alignment: { isApplied: () => boolean }) => alignment.isApplied());
    if (!alignmentApplied && this.buttons.length) this._selectButton(this.buttons[0]);
  };

  private _addToolbarButtons = () => {
    this.alignments.forEach((alignment: ToolbarAlignment, idx: number) => {
      const button = document.createElement("span");
      this.buttons.push(button);
      button.innerHTML = alignment.icon;
      button.addEventListener("click", () => {
        if (alignment.isApplied()) return;
        // deselect all buttons
        this.buttons.forEach((button) => (button.style.filter = ""));
        this._selectButton(button);
        alignment.apply();
        // image may change position; redraw drag handles
        this.requestUpdate();
      });
      Object.assign(button.style, this.options.toolbarButtonStyles);

      if (idx > 0) button.style.borderLeftWidth = "0";
      const svg = button.childNodes[0] as HTMLElement;
      Object.assign(svg.style, this.options.toolbarButtonSvgStyles);

      // select button if previously applied
      if (alignment.isApplied()) this._selectButton(button);
      if (this.toolbar) this.toolbar.appendChild(button);
    });
  };

  private _selectButton = (button: HTMLElement) => {
    button.style.filter = "invert(20%)";
  };
}
