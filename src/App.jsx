import Prism from 'prismjs'
import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { Slate, Editable, withReact } from 'slate-react'
import { Text, createEditor, Element as SlateElement } from 'slate'
import { withHistory } from 'slate-history'

const App = () => {
  const [value, setValue] = useState(initialValue)
  const [language, setLanguage] = useState('html')
  const renderLeaf = useCallback(props => <Leaf {...props} />, [])
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])

  // decorate function depends on the language selected
  const decorate = useCallback(
    ([node, path]) => {
      const ranges = []
      if (!Text.isText(node)) {
        return ranges
      }
      const tokens = Prism.tokenize(node.text, Prism.languages[language])
      let start = 0

      for (const token of tokens) {
        const length = getLength(token)
        const end = start + length

        if (typeof token !== 'string') {
          ranges.push({
            [token.type]: true,
            anchor: { path, offset: start },
            focus: { path, offset: end },
          })
        }

        start = end
      }

      return ranges
    },
    [language]
  )

  return (
    <Slate editor={editor} value={value} onChange={value => setValue(value)}>
      <Editable
        decorate={decorate}
        renderLeaf={renderLeaf}
        placeholder="Write some code..."
      />
    </Slate>
  )
}

const getLength = token => {
  if (typeof token === 'string') {
    return token.length
  } else if (typeof token.content === 'string') {
    return token.content.length
  } else {
    return token.content.reduce((l, t) => l + getLength(t), 0)
  }
}

// different token types, styles found on Prismjs website
const Leaf = ({ attributes, children, leaf }) => {
  return (
    <span {...attributes}>
      {children}
    </span>
  )
}

const initialValue = [
  {
    type: 'paragraph',
    children: [
      {
        text: '',
      },
    ],
  },
]

// modifications and additions to prism library

export default App
