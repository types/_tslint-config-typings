function someCbFn(fn) {
  fn({});
}
someCbFn((err) => {
  someCbFn((err) => {
    return;
  });
});
