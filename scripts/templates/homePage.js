module.exports = [
  {
    type: "image",
    props: {
      id: "icon",
      contentMode: $contentMode.scaleAspectFit
    },
    layout: (make, view) => {
      make.size.equalTo($size(24, 24));
      make.centerY.equalTo(view.super);
      make.centerX.equalTo(view.super.left).offset(30);
    }
  },
  {
    type: "label",
    props: {
      id: "label"
    },
    layout: (make, view) => {
      make.centerY.equalTo(view.super);
      make.left.equalTo(54);
    }
  }
]