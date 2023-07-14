import Quill from "quill";
import { QuillImageEmbedOnPaste, QuillImageResize } from "../src";

window.onload = () => {
  Quill.register("modules/imageEmbedOnPaste", QuillImageEmbedOnPaste);
  Quill.register("modules/imageResize", QuillImageResize);

  new Quill("#editor-wrapper", {
    theme: "snow",
    modules: {
      toolbar: [[{ header: [1, 2, false] }], ["bold", "italic", "underline"], ["image", "code-block"]],
      imageEmbedOnPaste: true,
      imageResize: true,
    },
  });
};
