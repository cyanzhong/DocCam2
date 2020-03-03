const helper = require("./helper");
const constants = require("./constants");

exports.init = () => {
  const options = [
    [
      $l10n("OPTIONS"),
      [
        ["doc", $l10n("SCAN_DOCUMENTS"), scanDocuments],
        ["id", $l10n("SCAN_ID"), scanID],
        ["passport", $l10n("SCAN_PASSPORT"), scanPassport],
      ]
    ]
  ];

  $ui.render({
    props: {
      title: "DocCam2"
    },
    views: [
      {
        type: "list",
        props: {
          template: require("./templates/homePage"),
          data: options.map(option => {
            return {
              title: option[0],
              rows: option[1].map(item => {
                return {
                  "icon": {
                    "src": `assets/icon-${item[0]}.png`
                  },
                  "label": {
                    "text": item[1]
                  }
                }
              })
            }
          })
        },
        layout: $layout.fill,
        events: {
          didSelect: (_, indexPath) => {
            const option = options[indexPath.section][1];
            const handler = option[indexPath.row][2];
            handler();
          }
        }
      }
    ]
  });
}

async function scanDocuments() {
  const images = await helper.scanDocuments();
  const toFiles = () => {
    return images.map(x => x.jpg(1.0));
  }

  if (images.length == 0) {
    return;
  }

  const quicklook = [
    "QUICKLOOK",
    () => {
      $quicklook.open({
        list: toFiles()
      })
    }
  ];

  const shareAsImages = [
    "SHARE_AS_IMAGES",
    () => {
      $share.sheet(images);
    }
  ];

  const shareAsPDF = [
    "SHARE_AS_PDF",
    async() => {
      const pdf = await helper.makePDF(images);
      if (pdf) {
        $share.sheet({
          name: "Document.pdf",
          data: pdf
        });
      }
    }
  ];

  const shareAsZip = [
    "SHARE_AS_ZIP",
    async() => {
      const files = toFiles();
      const success = await helper.compressFiles(files, "assets/tmp.zip");
      if (success) {
        $share.sheet({
          name: "Images.zip",
          data: $file.read(path)
        });
      }
    }
  ];

  const options = [
    quicklook,
    shareAsImages,
    shareAsPDF,
    shareAsZip,
  ];

  const {index} = await $ui.menu(options.map(x => $l10n(x[0])));
  const handler = options[index][1];
  handler();
}

async function scanID() {
  const images = await helper.scanDocuments();
  if (images.length == 0) {
    return;
  }

  $ui.loading(true);
  const pageSize = constants.pageSize;
  const pageColor = constants.pageColor;

  const pageWidth = pageSize.width;
  const pageHeight = pageSize.height;
  const landscape = images[0].size.width > images[0].size.height;
  const scaleX = landscape ? 8.56 : 5.4;
  const scaleY = landscape ? 5.4 : 8.56;

  const imageWidth = pageWidth * (scaleX / 21.0);
  const imageHeight = pageHeight * (scaleY / 29.7);

  const resizedImages = images.map(x => {
    const size = $size(imageWidth, imageHeight);
    return helper.resizeImage(x, size);
  });

  const imageRect = position => {
    return $rect(
      pageWidth  * 0.5 - imageWidth * 0.5,
      pageHeight * position - imageHeight * 0.5,
      imageWidth,
      imageHeight
    );
  }

  const options = {
    size: pageSize,
    color: pageColor
  }

  const renderer = ctx => {
    const drawImage = (position, index) => {
      ctx.drawImage(imageRect(position), resizedImages[index]);
    }
    if (resizedImages.length > 1) {
      drawImage(0.25, 0);
      drawImage(0.75, 1);
    } else {
      drawImage(0.5, 0);
    }
  }

  const image = $imagekit.render(options, renderer);
  $ui.loading(false);
  $quicklook.open({image});
}

async function scanPassport() {
  const images = await helper.scanDocuments();
  if (images.length == 0) {
    return;
  }

  $ui.loading(true);
  const pageSize = constants.pageSize;
  const pageColor = constants.pageColor;

  const pageWidth = pageSize.width;
  const pageHeight = pageSize.height;
  const landscape = images[0].size.width > images[0].size.height;
  const scaleX = landscape ? 12.5 : 18.0;
  const scaleY = landscape ? 18.0 : 12.5;

  const imageWidth = pageWidth * (scaleX / 21.0);
  const imageHeight = pageHeight * (scaleY / 29.7);
  const resizedImage = helper.resizeImage(
    images[0],
    $size(imageWidth, imageHeight)
  );

  const options = {
    size: pageSize,
    color: pageColor
  }

  const renderer = ctx => {
    const rect = $rect(
      (pageWidth - imageWidth) * 0.5,
      (pageHeight - imageHeight) * 0.5,
      imageWidth,
      imageHeight
    );
    ctx.drawImage(rect, resizedImage);
  }

  const image = $imagekit.render(options, renderer);
  $ui.loading(false);
  $quicklook.open({image});
}