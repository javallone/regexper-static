export default {
  _render() {
    return this.renderLabel(this.label).then(label => {
      return label.addClass('anchor');
    });
  },

  setup() {
    if (this.textValue === '^') {
      this.label = 'Start of line';
    } else {
      this.label = 'End of line';
    }
  }
};
