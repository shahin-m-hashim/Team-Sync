/* eslint-disable react/prop-types */
const ImageHandlerDropUpMenu = ({
  image,
  imgInputRef,
  handleSaveImage,
  handleDeleteImage,
  handleCancelImage,
}) => {
  return (
    <div className="absolute bottom-0 left-0 flex flex-col p-1 text-xs bg-slate-900">
      <div className="flex flex-col space-y-1">
        <button
          type="button"
          className="p-1 bg-blue-500"
          onClick={() => imgInputRef.current.click()}
        >
          Change
        </button>
        {image && (
          <button
            type="button"
            onClick={handleDeleteImage}
            className="p-1 bg-red-500"
          >
            Remove
          </button>
        )}
        <button
          type="button"
          onClick={handleSaveImage}
          className="p-1 bg-green-500"
        >
          Save
        </button>
        <button
          type="button"
          className="p-1 bg-red-500"
          onClick={handleCancelImage}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ImageHandlerDropUpMenu;
