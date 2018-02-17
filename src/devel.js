// Data used during development.
// Once everything is built, this file will go away

const syntaxes = {
  js: 'JavaScript',
  pcre: 'PCRE'
};

const demoImage = {
  type: 'Image',
  children: [
    {
      type: 'HorizontalLayout',
      props: {
        withConnectors: true
      },
      children: [
        {
          type: 'Pin'
        },
        // Anchor
        {
          type: 'Box',
          props: {
            type: 'anchorBox',
            radius: 0
          },
          children: [
            {
              type: 'Text',
              props: {
                type: 'anchorText'
              },
              children: [
                'Anchor'
              ]
            }
          ]
        },
        // Literal
        {
          type: 'Box',
          props: {
            type: 'literalBox'
          },
          children: [
            {
              type: 'Text',
              props: {
                quoted: true
              },
              children: [
                'Literal'
              ]
            }
          ]
        },
        // Escape sequence
        {
          type: 'Box',
          props: {
            type: 'escapeBox'
          },
          children: [
            {
              type: 'Text',
              children: [
                'Escape'
              ]
            }
          ]
        },
        // Character class
        {
          type: 'Box',
          props: {
            type: 'charClassBox',
            label: 'Label',
            padding: 10
          },
          children: [
            {
              type: 'VerticalLayout',
              children: [
                {
                  type: 'HorizontalLayout',
                  props: {
                    spacing: 5
                  },
                  children: [
                    {
                      type: 'Box',
                      props: {
                        type: 'literalBox'
                      },
                      children: [
                        {
                          type: 'Text',
                          props: {
                            quoted: true
                          },
                          children: [
                            'a'
                          ]
                        }
                      ]
                    },
                    {
                      type: 'Text',
                      children: [
                        '-'
                      ]
                    },
                    {
                      type: 'Box',
                      props: {
                        type: 'literalBox'
                      },
                      children: [
                        {
                          type: 'Text',
                          props: {
                            quoted: true
                          },
                          children: [
                            'z'
                          ]
                        }
                      ]
                    },
                  ]
                },
                {
                  type: 'Box',
                  props: {
                    type: 'escapeBox'
                  },
                  children: [
                    {
                      type: 'Text',
                      children: [
                        'Escape'
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        // Capture group
        {
          type: 'Box',
          props: {
            type: 'captureBox',
            label: 'group #1',
            useAnchors: true,
            padding: 10
          },
          children: [
            {
              type: 'VerticalLayout',
              props: {
                withConnectors: true
              },
              children: [
                {
                  type: 'Box',
                  props: {
                    type: 'literalBox'
                  },
                  children: [
                    {
                      type: 'Text',
                      props: {
                        quoted: true
                      },
                      children: [
                        'a'
                      ]
                    }
                  ]
                },
                {
                  type: 'Box',
                  props: {
                    type: 'literalBox'
                  },
                  children: [
                    {
                      type: 'Text',
                      props: {
                        quoted: true
                      },
                      children: [
                        'b'
                      ]
                    }
                  ]
                },
                {
                  type: 'Box',
                  props: {
                    type: 'literalBox'
                  },
                  children: [
                    {
                      type: 'Text',
                      props: {
                        quoted: true
                      },
                      children: [
                        'c'
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          type: 'Pin'
        }
      ]
    }
  ]
};

export {
  syntaxes,
  demoImage
};
