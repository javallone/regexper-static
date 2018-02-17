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
        {
          type: 'VerticalLayout',
          props: {
            withConnectors: true
          },
          children: [
            {
              type: 'Loop',
              props: {
                skip: false,
                repeat: true
              },
              children: [
                {
                  type: 'Box',
                  props: {
                    style: { fill: '#bada55' },
                    radius: 3
                  },
                  children: [
                    {
                      type: 'Text',
                      children: [
                        'Demo Text'
                      ]
                    }
                  ]
                }
              ]
            },
            {
              type: 'Loop',
              props: {
                skip: true,
                repeat: false
              },
              children: [
                {
                  type: 'Box',
                  props: {
                    style: { fill: '#bada55' },
                    radius: 3
                  },
                  children: [
                    {
                      type: 'Text',
                      children: [
                        'Demo Text'
                      ]
                    }
                  ]
                }
              ]
            },
            {
              type: 'Loop',
              props: {
                skip: true,
                repeat: true,
                greedy: true
              },
              children: [
                {
                  type: 'Box',
                  props: {
                    style: { fill: '#bada55' },
                    radius: 3
                  },
                  children: [
                    {
                      type: 'Text',
                      children: [
                        'Demo Text'
                      ]
                    }
                  ]
                }
              ]
            },
            {
              type: 'Loop',
              props: {
                skip: true,
                repeat: true,
                label: 'Loop label'
              },
              children: [
                {
                  type: 'Box',
                  props: {
                    style: { fill: '#bada55' },
                    radius: 3
                  },
                  children: [
                    {
                      type: 'Text',
                      children: [
                        'Demo Text'
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
