# Quill even better image

## How to use

1. Register the module

```
  Quill.register("modules/imageEmbedOnPaste", QuillImageEmbedOnPaste);
  Quill.register("modules/imageResize", QuillImageResize);
```

2. Enable module in editor options

```
new Quill("#editor-wrapper", {
    modules: {
        imageEmbedOnPaste: true,
        imageResize: true,
    },
});
```

### Credits

[mild.blue](https://mild.blue/) opensource

imageResize - originaly based on [quill-image-resize-module](https://www.npmjs.com/package/quill-image-resize-module)
