async function scanDocuments() {
  const {results} = await $photo.scan();
  return results || [];
}

async function makePDF(images) {
  $ui.loading(true);
  const {data} = await $pdf.make({images});
  $ui.loading(false);
  return data;
}

async function compressFiles(files, dest) {
  $file.delete(dest);
  $ui.loading(true);

  const success = await $archiver.zip({
    files,
    dest
  });
  $ui.loading(false);
  return success;
}

function resizeImage(image, value) {
  const target = (() => {
    if (typeof value === "number") {
      const size = image.size;
      return $size(size.width * scale, size.height * scale);
    } else {
      return value;
    }
  })();
  const resized = image.resized(target);
  return resized;
}

module.exports = {
  scanDocuments,
  makePDF,
  compressFiles,
  resizeImage,
}