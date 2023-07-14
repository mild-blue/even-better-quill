import Quill from "quill";
import { Resize } from "./parts/resize/Resize";
import { isHTMLElement } from "../../helpers/isHTMLElement";
import DefaultOptions from "./DefaultOptions";
import { BaseModule } from "./parts/BaseModule";
import { isHTMLImageElement } from "../../helpers/isHTMLImageElement";

require("./styles/quill-global-styles.scss");

export default class QuillImageResize {
  public quill: Quill;
  public options = DefaultOptions;
  public modules: BaseModule[] = [];
  public img?: HTMLImageElement;
  public overlay?: HTMLDivElement;

  constructor(quill: Quill) {
    // save the quill reference and options
    this.quill = quill;

    // disable native image resizing on firefox
    document.execCommand("enableObjectResizing", false, "false");

    // respond to clicks inside the editor
    this.quill.root.addEventListener("click", this.handleClick, false);
    this.quill.root.addEventListener("scroll", this.handleScroll, false);

    const parentNode = this.quill.root.parentNode as HTMLElement;
    if (parentNode.style.position === "") parentNode.style.position = "relative";
  }

  initializeModules = () => {
    if (!this.overlay || !this.img) return;

    const resizer = {
      overlay: this.overlay,
      img: this.img,
      options: this.options,
      onUpdate: this.onUpdate,
    };

    this.removeModules();
    this.modules.push(new Resize(resizer));
    // this.modules.push(new Toolbar(resizer)); currently still buggy
    this.modules.forEach((module: BaseModule) => module.onCreate());
    this.onUpdate();
  };

  onUpdate = () => {
    this.repositionElements();
    this.modules.forEach((module: BaseModule) => module.onUpdate());
  };

  removeModules = () => {
    this.modules.forEach((module: BaseModule) => module.onDestroy());
    this.modules = [];
  };

  handleClick = (evt: MouseEvent) => {
    if (!isHTMLElement(evt.target)) return;
    if (!(evt.target && evt.target.tagName && evt.target.tagName.toUpperCase() === "IMG")) return this.hide();

    // we are already focused on this image
    if (this.img === evt.target) return;
    // we were just focused on another image
    if (this.img) this.hide();
    // clicked on an image inside the editor
    if (isHTMLImageElement(evt.target)) this.show(evt.target);
  };

  handleScroll = () => {
    //Hide the overlay when the editor is scrolled,
    //otherwise image is no longer correctly aligned with overlay
    this.hide();
  };

  show = (img: HTMLImageElement) => {
    // keep track of this img element
    this.img = img;
    this.showOverlay();
    this.initializeModules();
  };

  showOverlay = () => {
    if (this.overlay) this.hideOverlay();

    // prevent spurious text selection
    this.setUserSelect("none");

    // listen for the image being deleted or moved
    document.addEventListener("keyup", this.checkImage, true);
    this.quill.root.addEventListener("input", this.checkImage, true);

    // Create and add the overlay
    this.overlay = document.createElement("div");
    Object.assign(this.overlay.style, this.options.overlayStyles);

    this.quill.root.parentNode?.appendChild(this.overlay);
    this.repositionElements();
  };

  hideOverlay = () => {
    if (!this.overlay) return;

    // Remove the overlay
    this.quill.root.parentNode?.removeChild(this.overlay);
    this.overlay = undefined;

    // stop listening for image deletion or movement
    document.removeEventListener("keyup", this.checkImage);
    this.quill.root.removeEventListener("input", this.checkImage);

    // reset user-select
    this.setUserSelect("");
  };

  repositionElements = () => {
    if (!this.overlay || !this.img) return;

    // position the overlay over the image
    const parent = this.quill.root.parentNode as HTMLElement;
    const imgRect = this.img.getBoundingClientRect();
    const containerRect = parent.getBoundingClientRect();

    Object.assign(this.overlay.style, {
      left: `${imgRect.left - containerRect.left - 1 + parent.scrollLeft}px`,
      top: `${imgRect.top - containerRect.top + parent.scrollTop}px`,
      width: `${imgRect.width}px`,
      height: `${imgRect.height}px`,
    });
  };

  hide = () => {
    this.hideOverlay();
    this.removeModules();
    this.img = undefined;
  };

  setUserSelect = (value: string) => {
    this.quill.root.style.userSelect = value;
    document.documentElement.style.userSelect = value;
  };

  checkImage = (evt: any) => {
    if (!this.img) return;
    if (evt.keyCode == 46 || evt.keyCode == 8) Quill.find(this.img).deleteAt(0);
    this.hide();
  };
}
