import { ChangeEvent, useEffect } from "react";

export default function ImageUploader({ onUpload } : { onUpload: (img: HTMLImageElement) => void }) {

  const reader = new FileReader();

  // FileReader load event listener
  useEffect(() => {
    function handleLoad() {
      const dataUrl = reader.result;
      if (dataUrl) {
        const img = new Image();
        img.src = dataUrl?.toString();
        onUpload(img);
      }
    }

    reader.addEventListener("load", handleLoad);
    return () => {
      reader.removeEventListener("load", handleLoad);
    }
  }, [reader]);

  // Read dataUrl of uploaded image
  function handleUpload(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>
        <input type="file" name="imgFile" id="imgFile" accept="image/*" onChange={handleUpload} />
    </div>
  );
}
