exports.apply = () => {
  $define({
    type: "UIViewController",
    events: {
      "viewDidLoad": () => {
        self.$ORIGviewDidLoad();
        if (self.$recropButtonItem()) {
          const tintColor = $color("tint").runtimeValue();
          self.$recropButtonItem().$setTintColor(tintColor);
          self.$compactFilterButtonItem().$setTintColor(tintColor);
          self.$rotateButtonItem().$setTintColor(tintColor);
          self.$trashButtonItem().$setTintColor(tintColor);
        }
      }
    }
  });
}