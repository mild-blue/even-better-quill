import Quill from "quill";
import Delta from "quill-delta";

export default class QuillImageEmbedOnPaste {
  public quill: Quill;
  public clipboard: DataTransfer | null = null;

  constructor(quill: Quill) {
    this.quill = quill;
    this.handlePaste = this.handlePaste.bind(this);
    this.quill.root.addEventListener("paste", this.handlePaste);

    quill.clipboard.addMatcher("IMG", (node, delta) => {
      return this.filterImgLinks(delta);
    });

    quill.clipboard.addMatcher("PICTURE", (_, delta) => {
      return this.filterImgLinks(delta);
    });
  }

  // filter out images that are not in base64 format
  filterImgLinks = (delta: Delta) => {
    const newOps = delta.ops.filter(
      (op) =>
        !(
          op.insert &&
          typeof op.insert === "object" &&
          "image" in op.insert &&
          typeof op.insert.image === "string" &&
          op.insert.image.startsWith("http")
        )
    );

    return { ...delta, ops: newOps } as Delta;
  };

  handlePaste = async (e: ClipboardEvent) => {
    const clipboardData = e.clipboardData;
    if (!clipboardData?.files.length) return;

    const files = Array.from(clipboardData.files);
    if (!files.length) return;

    for (const file of files) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result;
        const index = (this.quill.getSelection() || {}).index || this.quill.getLength();

        // quill creates space for original image so index - 1 inserts our base64 image to that space
        this.quill.insertEmbed(index - 1, "image", base64, "user");
        // index + 1 moves cursor in front of the base64 image
        this.quill.setSelection(index + 1, 0);
      };
    }
  };

  destroy() {
    this.quill.root.removeEventListener("paste", this.handlePaste);
  }
}
