export default {
  _render() {
    return this.renderLabel(this.label).then(label => label.addClass('anchor'));
  },

  setup() {
    if (this.textValue === '^') {
      this.label = 'Start of line';
    } else {
      this.label = 'End of line';
    }
  }
};
