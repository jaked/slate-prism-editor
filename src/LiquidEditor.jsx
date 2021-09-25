import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Prism from 'prismjs'
import { Slate, Editable, withReact, ReactEditor } from 'slate-react'
import { Text, createEditor } from 'slate'
import { Segment, Label } from 'semantic-ui-react'

export default function LiquidEditor(props) {
  const [value, setValue] = useState(initialValue)
  const editor = useMemo(() => withReact(createEditor()), [])
  const renderElement = useCallback(props => <CodeElement {...props} />, [])
  const renderLeaf = useCallback(props => <Leaf {...props} />, [])
  const handleBlur = useCallback(() => ReactEditor.deselect(editor), [editor])
  const decorate = useCallback(
    ([node, path]) => {
      const ranges = []

      if (!Text.isText(node)) {
        return ranges
      }

      const tokens = Prism.tokenize(node.text, Prism.languages['liquid'])
      let start = 0

      for (const token of tokens) {
        const length = getLength(token)
        const end = start + length

        if (typeof token != 'string') {
          ranges.push({
            hasToken: true,
            token: token,
            anchor: { path, offset: start },
            focus: { path, offset: end },
          })
        }

        start = end
      }

      return ranges
    },
    []
  )

  return (
    <div>
    <Segment>
      <Label as='a' color='teal' ribbon>
        Code Editor
      </Label>
      <Slate editor={editor} value={value} onChange={value => setValue(value)}>
        <CodeWrapper onBlur={handleBlur}>
          <Editable
            autoFocus
            decorate={decorate}
            renderLeaf={renderLeaf}
            renderElement={renderElement}
          />
        </CodeWrapper>
      </Slate>
    </Segment>
    </div>
  )
}

const initialValue = [
  {
    children: [
      {
        text: '',
      },
    ],
  },
]

const CodeWrapper = ({ children, ...props }) => {
  const [contentRef, setContentRef] = useState(null)
  const mounted = useRef(false)
  useEffect(() => mounted.current = true,[])

  return (
    <pre>
      <code className='language-liquid' {...props} ref={setContentRef}>
        {contentRef && mounted && createPortal(children, contentRef)}
      </code>
    </pre>
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

const CodeElement = ({ attributes, children, element }) => {
  return (
    <span
      className='token liquid language-liquid'
      {...attributes}
    >
      {children}
    </span>
  )
}

const Leaf = ({ attributes, children, leaf }) => {
  const className = leaf.hasToken && `token ${leaf.token.type} ${leaf.token.alias || ''}`
  return (
      <span
        {...attributes}
        className={className || ''}
      >
        {children}
      </span>
  )
}
