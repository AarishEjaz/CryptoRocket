export const convertToBase64Callback = (fileOrFiles, callback) => {
    const files = fileOrFiles instanceof FileList ? Array.from(fileOrFiles) : [fileOrFiles];

    const promises = files.map((file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve({ name: file.name, base64: reader.result });
            reader.onerror = (err) => reject(err);
        });
    });

    Promise.all(promises)
        .then((base64Array) => {
            callback(files.length === 1 ? base64Array[0] : base64Array);
        })
        .catch((err) => {
            console.error("Error:", err);
            callback(null, err);
        });
}


/**
 * Converts one or more files to base64 and returns based on input type.
 * @param {File | File[] | FileList} fileOrFiles
 * @returns {Promise<object | object[]>} - { name, base64 } or array of such objects
 */
export const convertToBase64 = async (fileOrFiles, returnAsArray = false) => {
  let files = [];

  if (fileOrFiles instanceof FileList) {
    files = Array.from(fileOrFiles);
  } else if (Array.isArray(fileOrFiles)) {
    files = fileOrFiles;
  } else if (fileOrFiles instanceof File) {
    files = [fileOrFiles];
  } else {
    throw new Error("Input must be File, FileList, or File[].");
  }

  const base64Array = await Promise.all(
    files.map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        // reader.onload = () => resolve({ name: file.name, base64: reader.result });
        reader.onload = () => resolve({ name: file.name, base64: reader.result });
        reader.onerror = (err) => reject(err);
      });
    })
  );

  return returnAsArray ? base64Array : base64Array[0].base64;
}