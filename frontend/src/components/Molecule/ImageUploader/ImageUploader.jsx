import { useRef, useState } from "react";

export default function ImageUploader() {
  const [inputKey, setInputKey] = useState(0);
  const uploadInputRef = useRef(null);
  const filenameLabelRef = useRef(null);
  const imagePreviewRef = useRef(null);
  const [isEventListenerAdded, setEventListenerAdded] = useState(false);

  const handleInputChange = (event) => {
    console.log("handleInputChange called");
    const file = event.target.files[0];
    console.log(file);
    if (file) {
      console.log("masuk kesini");
      filenameLabelRef.current.innerText = file.name;

      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreviewRef.current.innerHTML = `<img src="${e.target.result}" class="max-h-48 rounded-lg mx-auto" alt="Image preview" />`;
        imagePreviewRef.current.classList.remove(
          "border-dashed",
          "border-2",
          "border-gray-400"
        );

        if (!isEventListenerAdded) {
          imagePreviewRef.current.addEventListener("click", () => {
            uploadInputRef.current.click();
          });

          setEventListenerAdded(true);
        }
      };
      reader.readAsDataURL(file);
    } else {
      filenameLabelRef.current.innerText = "";
      imagePreviewRef.current.innerHTML = `<div class="bg-gray-200 h-48 rounded-lg flex items-center justify-center text-gray-500">No image preview</div>`;
      imagePreviewRef.current.classList.add(
        "border-dashed",
        "border-2",
        "border-gray-400"
      );

      if (isEventListenerAdded) {
        imagePreviewRef.current.removeEventListener("click", () => {
          uploadInputRef.current.click();
        });

        setEventListenerAdded(false);
      }
    }

    setInputKey((prevKey) => prevKey + 1);
  };

  return (
    <section className="container w-full mx-auto items-center py-32">
      <div className="max-w-sm mx-auto bg-white rounded-lg shadow-md overflow-hidden items-center">
        <div className="px-4 py-6">
          <div
            id="image-preview"
            className="max-w-sm p-6 mb-4 bg-gray-100 border-dashed border-2 border-gray-400 rounded-lg items-center mx-auto text-center cursor-pointer"
            ref={imagePreviewRef}
            key={inputKey}
          >
            <input
              id="upload"
              type="file"
              className="hidden"
              accept="image/*"
              ref={uploadInputRef}
              key={`uploadInput-${inputKey}`}
              onChange={handleInputChange}
            />

            <label htmlFor="upload" className="cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-8 h-8 text-gray-700 mx-auto mb-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                />
              </svg>
              <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-700">
                Upload picture
              </h5>
              <p className="font-normal text-sm text-gray-400 md:px-6">
                Choose photo size should be less than{" "}
                <b className="text-gray-600">2mb</b>
              </p>
              <p className="font-normal text-sm text-gray-400 md:px-6">
                and should be in{" "}
                <b className="text-gray-600">JPG, PNG, or GIF</b> format.
              </p>
              <span
                id="filename"
                className="text-gray-500 bg-gray-200 z-50"
                ref={filenameLabelRef}
              ></span>
            </label>
          </div>
        </div>
      </div>
    </section>
  );
}
