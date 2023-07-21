import Quill from "quill";
import { QuillBetterTable, QuillImageEmbedOnPaste, QuillImageResize } from "../src";

window.onload = () => {
  Quill.register("modules/imageResize", QuillImageResize);
  Quill.register("modules/better-table", QuillBetterTable);

  const quill = new Quill("#editor-wrapper", {
    theme: "snow",
    modules: {
      toolbar: [[{ header: [1, 2, false] }], ["bold", "italic", "underline"], ["image", "code-block"]],
      imageResize: true,
      table: false,
      "better-table": {
        table: {
          tableInTableError: "This inner table was placed outside the parent table",
        },
        operationMenu: {
          items: {
            unmergeCells: {
              text: "Another unmerge cells name",
            },
          },

          color: {
            colors: ["red", "green", "yellow", "white", "red", "green", "yellow", "white"],
          },

          border: true,
        },
      },
      keyboard: {
        bindings: QuillBetterTable.keyboardBindings,
      },
    },
  });

  let tableModule = quill.getModule("better-table");
  (document.body.querySelector("#insert-table") as HTMLElement).onclick = () => {
    tableModule.insertTable(3, 3);
  };

  (document.body.querySelector("#get-table") as HTMLElement).onclick = () => {
    console.log(tableModule.getTable());
  };

  (document.body.querySelector("#get-contents") as HTMLElement).onclick = () => {
    console.log(quill.getContents());
  };
};
