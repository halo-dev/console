<template>
  <div style="z-index: 1;position: relative">
    <div class="paper">
      <section class="paper-inner">
        <editor-menu-bar
          :editor="editor"
          v-slot="{ commands, isActive,getMarkAttrs }">
          <div class="trix-toolbar trix-main-toolbar">
            <div class="trix-button-row">
              <span
                class="trix-button-group trix-button-group--text-tools">
                <button
                  :class="{ 'trix-active': isActive.bold() }"
                  @click="commands.bold"
                  type="button"
                  class="trix-button trix-button--icon trix-button--icon-bold"
                  title="Cmd/Ctrl+b"></button>
                <button
                  :class="{ 'trix-active': isActive.italic() }"
                  @click="commands.italic"
                  type="button"
                  class="trix-button trix-button--icon trix-button--icon-italic"
                  title="Cmd/Ctrl+i"></button>
                <button
                  :class="{ 'trix-active': isActive.strike() }"
                  @click="commands.strike"
                  type="button"
                  class="trix-button trix-button--icon trix-button--icon-strike"
                  title=""></button>
                <button
                  :class="{ 'trix-active': isActive.underline() }"
                  @click="commands.underline"
                  type="button"
                  class="trix-button trix-button--icon trix-button--icon-underline"
                  title="Cmd/Ctrl+u"></button>
              </span>

              <span
                class="trix-button-group trix-button-group--block-tools"
              >
                <HButton
                  :editor="editor"
                  :currentLevel="isActive.h1heading()?1:isActive.h2heading()?2:isActive.h3heading()?3:isActive.h4heading()?4:isActive.h5heading()?5:0"
                  @onSelect="l => l==0?commands.h1heading() : commands['h'+l+'heading']({ level: l })"
                ></HButton>
                <button
                  :class="{ 'trix-active': isActive.blockquote() }"
                  @click="commands.blockquote"
                  type="button"
                  class="trix-button trix-button--icon trix-button--icon-quote"
                  title="Cmd/Ctrl+'"></button>
                <button
                  :class="{ 'trix-active': isActive.code_block() }"
                  @click="commands.code_block"
                  type="button"
                  class="trix-button trix-button--icon trix-button--icon-code"
                  title="Ctrl+Shift+\"></button>
                <button
                  :class="{ 'trix-active': isActive.bullet_list() }"
                  @click="commands.bullet_list"
                  type="button"
                  class="trix-button trix-button--icon trix-button--icon-bullet-list"
                  title="Ctrl+Shift+8"></button>
                <button
                  :class="{ 'trix-active': isActive.ordered_list() }"
                  @click="commands.ordered_list"
                  type="button"
                  class="trix-button trix-button--icon trix-button--icon-number-list"
                  title="Ctrl+Shift+9"></button>
                <button
                  :class="{ 'trix-active': isActive.horizontal_rule() }"
                  @click="commands.horizontal_rule"
                  type="button"
                  class="trix-button trix-button--icon trix-button--icon-horizon-line"
                ></button>
                <!--                <button-->
                <!--                  :class="{ 'trix-active': isActive.code() }"-->
                <!--                  @click="commands.code"-->
                <!--                  type="button"-->
                <!--                  class="trix-button trix-button&#45;&#45;icon trix-button&#45;&#45;icon-code"-->
                <!--                  title=""></button>-->
              </span>

              <!--<span class="trix-button-group trix-button-group&#45;&#45;file-tools" data-trix-button-group="file-tools">-->
              <!--<button :class="{ 'trix-active': isActive.bold() }" @click="commands.bold" type="button" class="trix-button trix-button&#45;&#45;icon trix-button&#45;&#45;icon-attach" data-trix-action="attachFiles" title="" ></button>-->
              <!--</span>-->
              <span class="trix-button-group-spacer"></span>
              <span
                class="trix-button-group trix-button-group--history-tools"
                data-trix-button-group="history-tools">
                <button
                  :class="{ 'trix-active': editor.extensions.options.history.undoDepth() }"
                  @click="commands.undo"
                  type="button"
                  class="trix-button trix-button--icon trix-button--icon-undo"
                  title="Cmd/Ctrl+z"></button>
                <button
                  :class="{ 'trix-active': editor.extensions.options.history.redoDepth() }"
                  @click="commands.redo"
                  type="button"
                  class="trix-button trix-button--icon trix-button--icon-redo"
                  title="Cmd/Ctrl+Shift+z"></button>
              </span>
            </div>
            <div
              class="trix-button-row"
              style="margin-top: 5px; ">
              <span
                class="trix-button-group trix-button-group--history-tools">
                <LinkButton
                  :attributes="getMarkAttrs('link')"
                  :is-active="isActive.link()"
                  @onSelect="(src) => (commands.link({ href : src }))"
                ></LinkButton>
                <ImageButton
                  :editor="editor"
                  @onSelect="(src) => (commands.image({ src }),commands.hard_break(),commands.hard_break())"
                ></ImageButton>
                <TableButton
                  :editor="editor"
                  @onSelect="(a,b,c) => (commands.createTable({ rowsCount: a, colsCount: b, withHeaderRow: c }))"
                ></TableButton>
                <button
                  :class="{ 'trix-active': isActive.todo_list() }"
                  @click="commands.todo_list"
                  type="button"
                  class="trix-button trix-button--icon trix-button--icon-todo-list"
                  title=""></button>
                <!--                <button-->
                <!--                  :class="{ 'trix-active': isActive.todo_list() }"-->
                <!--                  @click="commands.toc"-->
                <!--                  type="button"-->
                <!--                  class="trix-button trix-button&#45;&#45;icon trix-button&#45;&#45;icon-todo-list"-->
                <!--                  title=""></button>-->
              </span>
            </div>
          </div>
        </editor-menu-bar>

        <editor-menu-bubble
          class="trix-toolbar"
          :editor="editor"
          :keep-in-bounds="true"
          v-slot="{ commands, isActive, menu }">
          <div
            class="menububble"
            :class="{ 'is-active': menu.isActive && isActive.table()}"
            :style="`left: ${menu.left}px; bottom: ${menu.bottom}px;`"
          >
            <div>
              <button
                @click="commands.addRowBefore"
                type="button"
                class="trix-button trix-button--icon trix-button--icon-add-row-before"
              ></button>
              <button
                @click="commands.addColumnBefore"
                type="button"
                class="trix-button trix-button--icon trix-button--icon-add-col-before"
              ></button>
              <button
                @click="commands.deleteColumn"
                type="button"
                class="trix-button trix-button--icon trix-button--icon-delete-col"
              ></button>
              <i></i>
              <button
                @click="commands.deleteTable"
                type="button"
                class="trix-button trix-button--icon trix-button--icon-delete-table"
              ></button>
            </div>
            <hr>
            <div>
              <button
                @click="commands.addRowAfter"
                type="button"
                class="trix-button trix-button--icon trix-button--icon-add-row-after"
              ></button>
              <button
                @click="commands.addColumnAfter"
                type="button"
                class="trix-button trix-button--icon trix-button--icon-add-col-after"
              ></button>
              <button
                @click="commands.deleteRow"
                type="button"
                class="trix-button trix-button--icon trix-button--icon-delete-row"
              ></button>
              <i></i>
              <button
                @click="commands.toggleCellMerge"
                type="button"
                class="trix-button trix-button--icon trix-button--icon-merge-cell"
              ></button>
            </div>

          </div>
        </editor-menu-bubble>

        <editor-content
          class="trix-editor trix-content"
          :editor="editor"/>
      </section>
    </div>
  </div>
</template>
<script>
import javascript from 'highlight.js/lib/languages/javascript'
import css from 'highlight.js/lib/languages/css'
import { Editor, EditorContent, EditorMenuBar, EditorMenuBubble } from 'tiptap'
import {
  // Blockquote,
  CodeBlock,
  HorizontalRule,
  OrderedList,
  BulletList,
  ListItem,
  TodoItem,
  TodoList,
  Bold,
  Code,
  Italic,
  Link,
  Strike,
  Underline,
  // History,
  CodeBlockHighlight,
  Image,
  Table,
  TableHeader,
  TableCell,
  TableRow
} from 'tiptap-extensions'
import TableButton from './RichTextEditor/TableButton'
import ImageButton from './RichTextEditor/ImageButton'
import LinkButton from './RichTextEditor/LinkButton'
import HButton from './RichTextEditor/HButton'
import H1Heading from './RichTextEditor/extentions/H1Heading'
import H2Heading from './RichTextEditor/extentions/H2Heading'
import H3Heading from './RichTextEditor/extentions/H3Heading'
import H4Heading from './RichTextEditor/extentions/H4Heading'
import H5Heading from './RichTextEditor/extentions/H5Heading'
import Toc from './RichTextEditor/extentions/Toc'
import BlockquoteX from './RichTextEditor/extentions/BlockquoteX'
import History from './RichTextEditor/extentions/History'
import HardBreak from './RichTextEditor/extentions/HardBreak'

export default {
  name: 'RichTextEditor',
  props: {
    originalContent: {
      type: String,
      required: false,
      default: ''
    }
  },
  components: {
    LinkButton,
    TableButton,
    ImageButton,
    HButton,
    EditorContent,
    EditorMenuBar,
    EditorMenuBubble
  },
  data() {
    var vue = this
    return {
      originalContentData: '',
      level: '1',
      editor: new Editor({
        extensions: [
          new CodeBlockHighlight({
            languages: {
              javascript,
              css
            }
          }),
          new BlockquoteX(),
          new BulletList(),
          new CodeBlock(),
          new HardBreak(),
          new HorizontalRule(),
          new ListItem(),
          new OrderedList(),
          new TodoItem(),
          new TodoList(),
          new Link({ openOnClick: false }),
          new Bold(),
          new Code(),
          new Italic(),
          new Strike(),
          new Underline(),
          new History(),
          new H1Heading({ levels: [1] }),
          new H2Heading({ levels: [2] }),
          new H3Heading({ levels: [3] }),
          new H4Heading({ levels: [4] }),
          new H5Heading({ levels: [5] }),
          new Toc(),

          new Table({
            resizable: true
          }),
          new TableHeader(),
          new TableCell(),
          new TableRow(),
          new Image()
        ],
        content: '',
        onUpdate: function(e) {
          vue.originalContentData = e.getHTML()
          return false
        }
      })
    }
  },
  watch: {
    originalContent(val) {
      if (!this.__init) {
        this.editor.setContent(val)
      }
      this.__init = true
    },
    originalContentData(val) {
      this.$emit('onContentChange', val)
    }
  },
  methods: {},
  beforeDestroy() {
    this.editor.destroy()
  }
}
</script>

<style>
  /*
Trix 1.2.2
Copyright © 2019 Basecamp, LLC
http://.trix-editor.org/*/
  .trix-editor {
    border: none;
    border-radius: 3px;
    margin: 0;
    padding: 0.4em 0.6em;
    min-height: 5em;
    outline: none;
  }

  .trix-toolbar * {
    box-sizing: border-box;
  }

  .trix-toolbar .trix-button-row {
    display: flex;
    flex-wrap: nowrap;
  }

  .trix-toolbar .trix-button-group {
    display: flex;
    margin-bottom: 10px;
    border: 1px solid #bbb;
    border-top-color: #ccc;
    border-bottom-color: #888;
    border-radius: 3px;
  }

  .trix-toolbar .trix-button-group:not(:first-child) {
    margin-left: 1.5vw;
  }

  @media (max-device-width: 768px) {
    .trix-toolbar .trix-button-group:not(:first-child) {
      margin-left: 0;
    }
  }

  .trix-toolbar .trix-button-group-spacer {
    flex-grow: 1;
  }

  @media (max-device-width: 768px) {
    .trix-toolbar .trix-button-group-spacer {
      display: none;
    }
  }

  .trix-button:hover {
    background-color: #eee !important;
  }

  .trix-toolbar .trix-button {
    position: relative;
    float: left;
    color: rgba(0, 0, 0, 0.6);
    font-size: 0.75em;
    font-weight: 600;
    white-space: nowrap;
    padding: 0 0.5em;
    margin: 0;
    outline: none;
    border: none;
    border-bottom: 1px solid #ddd;
    border-radius: 0;
    background: transparent;
  }

  .trix-toolbar .trix-button:not(:first-child) {
    border-left: 1px solid #ccc;
  }

  .trix-toolbar .trix-button.trix-active {
    background: #cbeefa;
    color: black;
  }

  .trix-middle-button {
    border-left: 1px solid #ccc;
  }

  .trix-toolbar .trix-button:not(:disabled) {
    cursor: pointer;
  }

  .trix-toolbar .trix-button:disabled {
    color: rgba(0, 0, 0, 0.125);
  }

  @media (max-device-width: 768px) {
    .trix-toolbar .trix-button {
      letter-spacing: -0.01em;
      padding: 0 0.3em;
    }
  }

  .trix-toolbar .trix-button--icon {
    font-size: inherit;
    width: 2.6em;
    height: 1.6em;
    max-width: calc(0.8em + 4vw);
    text-indent: -9999px;
  }

  @media (max-device-width: 768px) {
    .trix-toolbar .trix-button--icon {
      height: 2em;
      max-width: calc(0.8em + 3.5vw);
    }
  }

  .trix-toolbar .trix-button--icon::before {
    display: inline-block;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    opacity: 0.6;
    content: "";
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
  }

  @media (max-device-width: 768px) {
    .trix-toolbar .trix-button--icon::before {
      right: 6%;
      left: 6%;
    }
  }

  .trix-toolbar .trix-button--icon.trix-active::before {
    opacity: 1;
  }

  .trix-toolbar .trix-button--icon:disabled::before {
    opacity: 0.125;
  }

  .trix-toolbar .trix-button--icon-attach::before {
    background-image: url(data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%3E%3Cpath%20d%3D%22M16.5%206v11.5a4%204%200%201%201-8%200V5a2.5%202.5%200%200%201%205%200v10.5a1%201%200%201%201-2%200V6H10v9.5a2.5%202.5%200%200%200%205%200V5a4%204%200%201%200-8%200v12.5a5.5%205.5%200%200%200%2011%200V6h-1.5z%22%2F%3E%3C%2Fsvg%3E);
    top: 8%;
    bottom: 4%;
  }

  .trix-toolbar .trix-button--icon-bold::before {
    background-image: url(data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%3E%3Cpath%20d%3D%22M15.6%2011.8c1-.7%201.6-1.8%201.6-2.8a4%204%200%200%200-4-4H7v14h7c2.1%200%203.7-1.7%203.7-3.8%200-1.5-.8-2.8-2.1-3.4zM10%207.5h3a1.5%201.5%200%201%201%200%203h-3v-3zm3.5%209H10v-3h3.5a1.5%201.5%200%201%201%200%203z%22%2F%3E%3C%2Fsvg%3E);
  }

  .trix-toolbar .trix-button--icon-italic::before {
    background-image: url(data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%3E%3Cpath%20d%3D%22M10%205v3h2.2l-3.4%208H6v3h8v-3h-2.2l3.4-8H18V5h-8z%22%2F%3E%3C%2Fsvg%3E);
  }

  .trix-toolbar .trix-button--icon-link::before {
    background-image: url(data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%3E%3Cpath%20d%3D%22M9.88%2013.7a4.3%204.3%200%200%201%200-6.07l3.37-3.37a4.26%204.26%200%200%201%206.07%200%204.3%204.3%200%200%201%200%206.06l-1.96%201.72a.91.91%200%201%201-1.3-1.3l1.97-1.71a2.46%202.46%200%200%200-3.48-3.48l-3.38%203.37a2.46%202.46%200%200%200%200%203.48.91.91%200%201%201-1.3%201.3z%22%2F%3E%3Cpath%20d%3D%22M4.25%2019.46a4.3%204.3%200%200%201%200-6.07l1.93-1.9a.91.91%200%201%201%201.3%201.3l-1.93%201.9a2.46%202.46%200%200%200%203.48%203.48l3.37-3.38c.96-.96.96-2.52%200-3.48a.91.91%200%201%201%201.3-1.3%204.3%204.3%200%200%201%200%206.07l-3.38%203.38a4.26%204.26%200%200%201-6.07%200z%22%2F%3E%3C%2Fsvg%3E);
  }

  .trix-toolbar .trix-button--icon-strike::before {
    background-image: url(data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%3E%3Cpath%20d%3D%22M12.73%2014l.28.14c.26.15.45.3.57.44.12.14.18.3.18.5%200%20.3-.15.56-.44.75-.3.2-.76.3-1.39.3A13.52%2013.52%200%200%201%207%2014.95v3.37a10.64%2010.64%200%200%200%204.84.88c1.26%200%202.35-.19%203.28-.56.93-.37%201.64-.9%202.14-1.57s.74-1.45.74-2.32c0-.26-.02-.51-.06-.75h-5.21zm-5.5-4c-.08-.34-.12-.7-.12-1.1%200-1.29.52-2.3%201.58-3.02%201.05-.72%202.5-1.08%204.34-1.08%201.62%200%203.28.34%204.97%201l-1.3%202.93c-1.47-.6-2.73-.9-3.8-.9-.55%200-.96.08-1.2.26-.26.17-.38.38-.38.64%200%20.27.16.52.48.74.17.12.53.3%201.05.53H7.23zM3%2013h18v-2H3v2z%22%2F%3E%3C%2Fsvg%3E);
  }

  .trix-toolbar .trix-button--icon-quote::before {
    background-image: url(data:image/svg+xml,%3Csvg%20version%3D%221%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%3E%3Cpath%20d%3D%22M6%2017h3l2-4V7H5v6h3zm8%200h3l2-4V7h-6v6h3z%22%2F%3E%3C%2Fsvg%3E);
  }

  .trix-toolbar .trix-button--icon-heading-1::before {
    background-image: url(data:image/svg+xml,%3Csvg%20version%3D%221%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%3E%3Cpath%20d%3D%22M12%209v3H9v7H6v-7H3V9h9zM8%204h14v3h-6v12h-3V7H8V4z%22%2F%3E%3C%2Fsvg%3E);
  }

  .trix-toolbar .trix-button--icon-code::before {
    background-image: url(data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%3E%3Cpath%20d%3D%22M18.2%2012L15%2015.2l1.4%201.4L21%2012l-4.6-4.6L15%208.8l3.2%203.2zM5.8%2012L9%208.8%207.6%207.4%203%2012l4.6%204.6L9%2015.2%205.8%2012z%22%2F%3E%3C%2Fsvg%3E);
  }

  .trix-toolbar .trix-button--icon-bullet-list::before {
    background-image: url(data:image/svg+xml,%3Csvg%20version%3D%221%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%3E%3Cpath%20d%3D%22M4%204a2%202%200%201%200%200%204%202%202%200%200%200%200-4zm0%206a2%202%200%201%200%200%204%202%202%200%200%200%200-4zm0%206a2%202%200%201%200%200%204%202%202%200%200%200%200-4zm4%203h14v-2H8v2zm0-6h14v-2H8v2zm0-8v2h14V5H8z%22%2F%3E%3C%2Fsvg%3E);
  }

  .trix-toolbar .trix-button--icon-number-list::before {
    background-image: url(data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%3E%3Cpath%20d%3D%22M2%2017h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1%203h1.8L2%2013.1v.9h3v-1H3.2L5%2010.9V10H2v1zm5-6v2h14V5H7zm0%2014h14v-2H7v2zm0-6h14v-2H7v2z%22%2F%3E%3C%2Fsvg%3E);
  }

  .trix-toolbar .trix-button--icon-undo::before {
    background-image: url(data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%3E%3Cpath%20d%3D%22M12.5%208c-2.6%200-5%201-6.9%202.6L2%207v9h9l-3.6-3.6A8%208%200%200%201%2020%2016l2.4-.8a10.5%2010.5%200%200%200-10-7.2z%22%2F%3E%3C%2Fsvg%3E);
  }

  .trix-toolbar .trix-button--icon-redo::before {
    background-image: url(data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%3E%3Cpath%20d%3D%22M18.4%2010.6a10.5%2010.5%200%200%200-16.9%204.6L4%2016a8%208%200%200%201%2012.7-3.6L13%2016h9V7l-3.6%203.6z%22%2F%3E%3C%2Fsvg%3E);
  }

  .trix-toolbar .trix-button--icon-decrease-nesting-level::before {
    background-image: url(data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%3E%3Cpath%20d%3D%22M3%2019h19v-2H3v2zm7-6h12v-2H10v2zm-8.3-.3l2.8%202.9L6%2014.2%204%2012l2-2-1.4-1.5L1%2012l.7.7zM3%205v2h19V5H3z%22%2F%3E%3C%2Fsvg%3E);
  }

  .trix-toolbar .trix-button--icon-increase-nesting-level::before {
    background-image: url(data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%3E%3Cpath%20d%3D%22M3%2019h19v-2H3v2zm7-6h12v-2H10v2zm-6.9-1L1%2014.2l1.4%201.4L6%2012l-.7-.7-2.8-2.8L1%209.9%203.1%2012zM3%205v2h19V5H3z%22%2F%3E%3C%2Fsvg%3E);
  }

  .trix-toolbar .trix-button--icon-table::before {
    background-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4KPHN2ZyBjbGFzcz0iZnItc3ZnIiBmb2N1c2FibGU9ImZhbHNlIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTIwLDVINEMyLjksNSwyLDUuOSwyLDd2MnYxLjV2M1YxNXYyYzAsMS4xLDAuOSwyLDIsMmgxNmMxLjEsMCwyLTAuOSwyLTJ2LTJ2LTEuNXYtM1Y5VjdDMjIsNS45LDIxLjEsNSwyMCw1eiBNOS41LDEzLjV2LTMgIGg1djNIOS41eiBNMTQuNSwxNXYyLjVoLTVWMTVIMTQuNXogTTkuNSw5VjYuNWg1VjlIOS41eiBNMy41LDdjMC0wLjMsMC4yLTAuNSwwLjUtMC41aDRWOUgzLjVWN3ogTTMuNSwxMC41SDh2M0gzLjVWMTAuNXogTTMuNSwxNyAgdi0ySDh2Mi41SDRDMy43LDE3LjUsMy41LDE3LjMsMy41LDE3eiBNMjAuNSwxN2MwLDAuMy0wLjIsMC41LTAuNSwwLjVoLTRWMTVoNC41VjE3eiBNMjAuNSwxMy41SDE2di0zaDQuNVYxMy41eiBNMTYsOVY2LjVoNCAgYzAuMywwLDAuNSwwLjIsMC41LDAuNXYySDE2eiI+PC9wYXRoPjwvc3ZnPg==');
  }

  .trix-toolbar .trix-button--icon-image::before {
    background-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4KPHN2ZyBjbGFzcz0iZnItc3ZnIiBmb2N1c2FibGU9ImZhbHNlIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTE0LjIsMTFsMy44LDVINmwzLTMuOWwyLjEsMi43TDE0LDExSDE0LjJ6IE04LjUsMTFjMC44LDAsMS41LTAuNywxLjUtMS41UzkuMyw4LDguNSw4UzcsOC43LDcsOS41QzcsMTAuMyw3LjcsMTEsOC41LDExeiAgIE0yMiw2djEyYzAsMS4xLTAuOSwyLTIsMkg0Yy0xLjEsMC0yLTAuOS0yLTJWNmMwLTEuMSwwLjktMiwyLTJoMTZDMjEuMSw0LDIyLDQuOSwyMiw2eiBNMjAsOC44VjZINHYxMmgxNlY4Ljh6Ij48L3BhdGg+PC9zdmc+');
  }

  .trix-toolbar .trix-button--icon-video::before {
    background-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4KPHN2ZyBjbGFzcz0iZnItc3ZnIiBmb2N1c2FibGU9ImZhbHNlIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTE1LDh2OEg1VjhIMTVtMiwyLjVWN2ExLDEsMCwwLDAtMS0xSDRBMSwxLDAsMCwwLDMsN1YxN2ExLDEsMCwwLDAsMSwxSDE2YTEsMSwwLDAsMCwxLTFWMTMuNWwyLjI5LDIuMjlBMSwxLDAsMCwwLDIxLDE1LjA4VjguOTFhMSwxLDAsMCwwLTEuNzEtLjcxWiI+PC9wYXRoPjwvc3ZnPg==');
  }

  .trix-toolbar .trix-button--icon-share::before {
    background-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4KPHN2ZyBjbGFzcz0iZnItc3ZnIiBmb2N1c2FibGU9ImZhbHNlIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTIwLjczODg5LDE1LjQ1OTI5YTMuNDc2OCwzLjQ3NjgsMCwwLDAtNS40NTk2NS0uMjg2NjJMOS41NjYxLDEyLjUwODYxYTMuNDk4MTEsMy40OTgxMSwwLDAsMC0uMDA4NzMtMS4wMTMzMWw1LjcyMTc0LTIuNjY4MDlhMy41NTc4MywzLjU1NzgzLDAsMSwwLS44NDUyNy0xLjgxMjYyTDguNzA5NjYsOS42ODM5YTMuNTA4NTEsMy41MDg1MSwwLDEsMCwuMDExMSw0LjYzNzI3bDUuNzEzMiwyLjY2NDEyYTMuNDk3NjMsMy40OTc2MywwLDEsMCw2LjMwNDkzLTEuNTI2Wk0xOC4wMDc0NSw1LjAxMDU2QTEuNDk5OTMsMS40OTk5MywwLDEsMSwxNi4zOTU1MSw2LjM4OTQsMS40OTk5NCwxLjQ5OTk0LDAsMCwxLDE4LjAwNzQ1LDUuMDEwNTZaTTUuOTkyMzcsMTMuNDk1MzZhMS40OTk4OSwxLjQ5OTg5LDAsMSwxLDEuNjExOTQtMS4zNzg3OEExLjQ5OTgyLDEuNDk5ODIsMCwwLDEsNS45OTIzNywxMy40OTUzNlptMTEuNzgyMTEsNS40OTRhMS40OTk5MywxLjQ5OTkzLDAsMSwxLDEuNjExOTMtMS4zNzg4NUExLjQ5OTg3LDEuNDk5ODcsMCwwLDEsMTcuNzc0NDgsMTguOTg5MzJaIj48L3BhdGg+PC9zdmc+');
  }

  .trix-toolbar .trix-button--icon-smile::before {
    background-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4KPHN2ZyBjbGFzcz0iZnItc3ZnIiBmb2N1c2FibGU9ImZhbHNlIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTExLjk5MSwzQTksOSwwLDEsMCwyMSwxMiw4Ljk5NTU3LDguOTk1NTcsMCwwLDAsMTEuOTkxLDNaTTEyLDE5YTcsNywwLDEsMSw3LTdBNi45OTgwOCw2Ljk5ODA4LDAsMCwxLDEyLDE5Wm0zLjEwNS01LjJoMS41MDNhNC45NDU0Miw0Ljk0NTQyLDAsMCwxLTkuMjE2LDBIOC44OTVhMy41NzgwOCwzLjU3ODA4LDAsMCwwLDYuMjEsMFpNNy41LDkuNzVBMS4zNSwxLjM1LDAsMSwxLDguODUsMTEuMSwxLjM1LDEuMzUsMCwwLDEsNy41LDkuNzVabTYuMywwYTEuMzUsMS4zNSwwLDEsMSwxLjM1LDEuMzVBMS4zNSwxLjM1LDAsMCwxLDEzLjgsOS43NVoiPjwvcGF0aD48L3N2Zz4=');
  }

  .trix-toolbar .trix-button--icon-underline::before {
    background-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4KPHN2ZyBjbGFzcz0iZnItc3ZnIiBmb2N1c2FibGU9ImZhbHNlIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTE5LDIwdjJINVYyMFptLTMtNi43ODVhNCw0LDAsMCwxLTUuNzQsMy40QTMuNzUsMy43NSwwLDAsMSw4LDEzLjA4NVY1LjAwNUg2djguMjFhNiw2LDAsMCwwLDgsNS40NCw1Ljg1MSw1Ljg1MSwwLDAsMCw0LTUuNjV2LThIMTZaTTE2LDV2MGgyVjVaTTgsNUg2djBIOFoiPjwvcGF0aD48L3N2Zz4=');
  }

  .trix-toolbar .trix-button--icon-todo-list::before {
    background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzYiIGhlaWdodD0iMzQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiA8dGl0bGU+Y2hlY2tsaXN0LWFsdGVybmF0ZTwvdGl0bGU+CgogPGc+CiAgPHRpdGxlPmJhY2tncm91bmQ8L3RpdGxlPgogIDxyZWN0IGZpbGw9Im5vbmUiIGlkPSJjYW52YXNfYmFja2dyb3VuZCIgaGVpZ2h0PSIzNiIgd2lkdGg9IjM4IiB5PSItMSIgeD0iLTEiLz4KIDwvZz4KIDxnPgogIDx0aXRsZT5MYXllciAxPC90aXRsZT4KICA8cGF0aCBzdHJva2U9Im51bGwiIGlkPSJzdmdfMSIgZD0ibTI5LjAwOTA2Miw1LjI0MTExbC0yMS45MzM0NjIsMGEzLjY1NTU3NywzIDAgMCAwIC0zLjY1NTU3NywzbDAsMThhMy42NTU1NzcsMyAwIDAgMCAzLjY1NTU3NywzbDIxLjkzMzQ2MiwwYTMuNjU1NTc3LDMgMCAwIDAgMy42NTU1NzcsLTNsMCwtMThhMy42NTU1NzcsMyAwIDAgMCAtMy42NTU1NzcsLTN6bTEuMjE4NTI2LDIxYTEuMjE4NTI2LDEgMCAwIDEgLTEuMjE4NTI2LDFsLTIxLjkzMzQ2MiwwYTEuMjE4NTI2LDEgMCAwIDEgLTEuMjE4NTI2LC0xbDAsLTE4YTEuMjE4NTI2LDEgMCAwIDEgMS4yMTg1MjYsLTFsMjEuOTMzNDYyLDBhMS4yMTg1MjYsMSAwIDAgMSAxLjIxODUyNiwxbDAsMTh6Ii8+CiAgPHBhdGggaWQ9InN2Z18yIiBkPSJtMTUuMzc3NzU1LDkuMzg2NzQ0YTEuMjUxLDEuMjUxIDAgMCAwIC0xLjc1LDAuMjVsLTIuMTM0LDIuODVsLTAuNDgyLC0wLjQ4MWExLjI1LDEuMjUgMCAwIDAgLTEuNzY3LDEuNzY0bDEuNSwxLjVhMS4yNjIsMS4yNjIgMCAwIDAgMS44ODQsLTAuMTM0bDMsLTRhMS4yNSwxLjI1IDAgMCAwIC0wLjI1MSwtMS43NDl6Ii8+CiAgPHBhdGggaWQ9InN2Z18zIiBkPSJtMTUuMzc3NzU1LDE4LjM4Njc0NGExLjI1MSwxLjI1MSAwIDAgMCAtMS43NSwwLjI1bC0yLjEzNCwyLjg1bC0wLjQ4MiwtMC40ODFhMS4yNSwxLjI1IDAgMSAwIC0xLjc2NywxLjc2OGwxLjUsMS41YTEuMjY1LDEuMjY1IDAgMCAwIDEuODg0LC0wLjEzOGwzLC00YTEuMjUsMS4yNSAwIDAgMCAtMC4yNTEsLTEuNzQ5eiIvPgogIDxwYXRoIGlkPSJzdmdfNCIgZD0ibTI1Ljc0OTU3OSwxMi4xMzk2MTZsLTQuNSwwYTEuMjUsMS4yNSAwIDAgMCAwLDIuNWw0LjUsMGExLjI1LDEuMjUgMCAwIDAgMCwtMi41eiIvPgogIDxwYXRoIGlkPSJzdmdfNSIgZD0ibTI1Ljc0OTU4MiwyMC43MDY2MTdsLTQuNSwwYTEuMjUsMS4yNSAwIDAgMCAwLDIuNWw0LjUsMGExLjI1LDEuMjUgMCAxIDAgMCwtMi41eiIvPgogPC9nPgo8L3N2Zz4=');
  }

  .trix-toolbar .trix-button--icon-add-col-before::before {
    background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij4KICA8cGF0aCBkPSJNNSwxNCBDNy43NjAwNTMxNSwxNC4wMDMzMDYxIDkuOTk2NjkzODgsMTYuMjM5OTQ2OCAxMCwxOSBDMTAsMjEuNzYxNDIzNyA3Ljc2MTQyMzc1LDI0IDUsMjQgQzIuMjM4NTc2MjUsMjQgMS43NzYzNTY4NGUtMTUsMjEuNzYxNDIzNyAxLjc3NjM1Njg0ZS0xNSwxOSBDMS43NzYzNTY4NGUtMTUsMTYuMjM4NTc2MyAyLjIzODU3NjI1LDE0IDUsMTQgWiBNNy41LDE5LjkzNzUgQzguMDE3NzY2OTUsMTkuOTM3NSA4LjQzNzUsMTkuNTE3NzY3IDguNDM3NSwxOSBDOC40Mzc1LDE4LjQ4MjIzMyA4LjAxNzc2Njk1LDE4LjA2MjUgNy41LDE4LjA2MjUgTDYuMjUsMTguMDYyNSBDNi4wNzc0MTEwMiwxOC4wNjI1IDUuOTM3NSwxNy45MjI1ODkgNS45Mzc1LDE3Ljc1IEw1LjkzNzUsMTYuNSBDNS45Mzc1LDE1Ljk4MjIzMyA1LjUxNzc2Njk1LDE1LjU2MjUgNSwxNS41NjI1IEM0LjQ4MjIzMzA1LDE1LjU2MjUgNC4wNjI1LDE1Ljk4MjIzMyA0LjA2MjUsMTYuNSBMNC4wNjI1LDE3Ljc1IEM0LjA2MjUsMTcuOTIyNTg5IDMuOTIyNTg4OTgsMTguMDYyNSAzLjc1LDE4LjA2MjUgTDIuNSwxOC4wNjI1IEMxLjk4MjIzMzA1LDE4LjA2MjUgMS41NjI1LDE4LjQ4MjIzMyAxLjU2MjUsMTkgQzEuNTYyNSwxOS41MTc3NjcgMS45ODIyMzMwNSwxOS45Mzc1IDIuNSwxOS45Mzc1IEwzLjc1LDE5LjkzNzUgQzMuOTIyNTg4OTgsMTkuOTM3NSA0LjA2MjUsMjAuMDc3NDExIDQuMDYyNSwyMC4yNSBMNC4wNjI1LDIxLjUgQzQuMDYyNSwyMi4wMTc3NjcgNC40ODIyMzMwNSwyMi40Mzc1IDUsMjIuNDM3NSBDNS41MTc3NjY5NSwyMi40Mzc1IDUuOTM3NSwyMi4wMTc3NjcgNS45Mzc1LDIxLjUgTDUuOTM3NSwyMC4yNSBDNS45Mzc1LDIwLjA3NzQxMSA2LjA3NzQxMTAyLDE5LjkzNzUgNi4yNSwxOS45Mzc1IEw3LjUsMTkuOTM3NSBaIE0xNiwxOSBDMTYsMjAuNjU2ODU0MiAxNy4zNDMxNDU4LDIyIDE5LDIyIEMyMC42NTY4NTQyLDIyIDIyLDIwLjY1Njg1NDIgMjIsMTkgTDIyLDUgQzIyLDMuMzQzMTQ1NzUgMjAuNjU2ODU0MiwyIDE5LDIgQzE3LjM0MzE0NTgsMiAxNiwzLjM0MzE0NTc1IDE2LDUgTDE2LDE5IFogTTE0LDE5IEwxNCw1IEMxNCwyLjIzODU3NjI1IDE2LjIzODU3NjMsMCAxOSwwIEMyMS43NjE0MjM3LDAgMjQsMi4yMzg1NzYyNSAyNCw1IEwyNCwxOSBDMjQsMjEuNzYxNDIzNyAyMS43NjE0MjM3LDI0IDE5LDI0IEMxNi4yMzg1NzYzLDI0IDE0LDIxLjc2MTQyMzcgMTQsMTkgWiIvPgo8L3N2Zz4K');
  }

  .trix-toolbar .trix-button--icon-add-col-after::before {
    background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij4KICA8cGF0aCBkPSJNMTksMTQgQzIxLjc2MDA1MzIsMTQuMDAzMzA2MSAyMy45OTY2OTM5LDE2LjIzOTk0NjggMjQsMTkgQzI0LDIxLjc2MTQyMzcgMjEuNzYxNDIzNywyNCAxOSwyNCBDMTYuMjM4NTc2MywyNCAxNCwyMS43NjE0MjM3IDE0LDE5IEMxNCwxNi4yMzg1NzYzIDE2LjIzODU3NjMsMTQgMTksMTQgWiBNMjEuNSwxOS45Mzc1IEMyMi4wMTc3NjcsMTkuOTM3NSAyMi40Mzc1LDE5LjUxNzc2NyAyMi40Mzc1LDE5IEMyMi40Mzc1LDE4LjQ4MjIzMyAyMi4wMTc3NjcsMTguMDYyNSAyMS41LDE4LjA2MjUgTDIwLjI1LDE4LjA2MjUgQzIwLjA3NzQxMSwxOC4wNjI1IDE5LjkzNzUsMTcuOTIyNTg5IDE5LjkzNzUsMTcuNzUgTDE5LjkzNzUsMTYuNSBDMTkuOTM3NSwxNS45ODIyMzMgMTkuNTE3NzY3LDE1LjU2MjUgMTksMTUuNTYyNSBDMTguNDgyMjMzLDE1LjU2MjUgMTguMDYyNSwxNS45ODIyMzMgMTguMDYyNSwxNi41IEwxOC4wNjI1LDE3Ljc1IEMxOC4wNjI1LDE3LjkyMjU4OSAxNy45MjI1ODksMTguMDYyNSAxNy43NSwxOC4wNjI1IEwxNi41LDE4LjA2MjUgQzE1Ljk4MjIzMywxOC4wNjI1IDE1LjU2MjUsMTguNDgyMjMzIDE1LjU2MjUsMTkgQzE1LjU2MjUsMTkuNTE3NzY3IDE1Ljk4MjIzMywxOS45Mzc1IDE2LjUsMTkuOTM3NSBMMTcuNzUsMTkuOTM3NSBDMTcuOTIyNTg5LDE5LjkzNzUgMTguMDYyNSwyMC4wNzc0MTEgMTguMDYyNSwyMC4yNSBMMTguMDYyNSwyMS41IEMxOC4wNjI1LDIyLjAxNzc2NyAxOC40ODIyMzMsMjIuNDM3NSAxOSwyMi40Mzc1IEMxOS41MTc3NjcsMjIuNDM3NSAxOS45Mzc1LDIyLjAxNzc2NyAxOS45Mzc1LDIxLjUgTDE5LjkzNzUsMjAuMjUgQzE5LjkzNzUsMjAuMDc3NDExIDIwLjA3NzQxMSwxOS45Mzc1IDIwLjI1LDE5LjkzNzUgTDIxLjUsMTkuOTM3NSBaIE0yLDE5IEMyLDIwLjY1Njg1NDIgMy4zNDMxNDU3NSwyMiA1LDIyIEM2LjY1Njg1NDI1LDIyIDgsMjAuNjU2ODU0MiA4LDE5IEw4LDUgQzgsMy4zNDMxNDU3NSA2LjY1Njg1NDI1LDIgNSwyIEMzLjM0MzE0NTc1LDIgMiwzLjM0MzE0NTc1IDIsNSBMMiwxOSBaIE0tMi43NTg1NTAyZS0xNiwxOSBMNS44MTM5NzczOWUtMTYsNSBDLTEuMzc2OTIyNDNlLTE2LDIuMjM4NTc2MjUgMi4yMzg1NzYyNSwwIDUsMCBDNy43NjE0MjM3NSwwIDEwLDIuMjM4NTc2MjUgMTAsNSBMMTAsMTkgQzEwLDIxLjc2MTQyMzcgNy43NjE0MjM3NSwyNCA1LDI0IEMyLjIzODU3NjI1LDI0IDQuNDMyMzQ5NjJlLTE2LDIxLjc2MTQyMzcgLTIuNzU4NTUwMmUtMTYsMTkgWiIvPgo8L3N2Zz4K');
  }

  .trix-toolbar .trix-button--icon-add-row-before::before {
    background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij4KICA8cGF0aCBkPSJNMTksMCBDMjEuNzYwMDUzMiwwLjAwMzMwNjExNjMzIDIzLjk5NjY5MzksMi4yMzk5NDY4NSAyNCw1IEMyNCw3Ljc2MTQyMzc1IDIxLjc2MTQyMzcsMTAgMTksMTAgQzE2LjIzODU3NjMsMTAgMTQsNy43NjE0MjM3NSAxNCw1IEMxNCwyLjIzODU3NjI1IDE2LjIzODU3NjMsMCAxOSwwIFogTTIxLjUsNS45Mzc1IEMyMi4wMTc3NjcsNS45Mzc1IDIyLjQzNzUsNS41MTc3NjY5NSAyMi40Mzc1LDUgQzIyLjQzNzUsNC40ODIyMzMwNSAyMi4wMTc3NjcsNC4wNjI1IDIxLjUsNC4wNjI1IEwyMC4yNSw0LjA2MjUgQzIwLjA3NzQxMSw0LjA2MjUgMTkuOTM3NSwzLjkyMjU4ODk4IDE5LjkzNzUsMy43NSBMMTkuOTM3NSwyLjUgQzE5LjkzNzUsMS45ODIyMzMwNSAxOS41MTc3NjcsMS41NjI1IDE5LDEuNTYyNSBDMTguNDgyMjMzLDEuNTYyNSAxOC4wNjI1LDEuOTgyMjMzMDUgMTguMDYyNSwyLjUgTDE4LjA2MjUsMy43NSBDMTguMDYyNSwzLjkyMjU4ODk4IDE3LjkyMjU4OSw0LjA2MjUgMTcuNzUsNC4wNjI1IEwxNi41LDQuMDYyNSBDMTUuOTgyMjMzLDQuMDYyNSAxNS41NjI1LDQuNDgyMjMzMDUgMTUuNTYyNSw1IEMxNS41NjI1LDUuNTE3NzY2OTUgMTUuOTgyMjMzLDUuOTM3NSAxNi41LDUuOTM3NSBMMTcuNzUsNS45Mzc1IEMxNy45MjI1ODksNS45Mzc1IDE4LjA2MjUsNi4wNzc0MTEwMiAxOC4wNjI1LDYuMjUgTDE4LjA2MjUsNy41IEMxOC4wNjI1LDguMDE3NzY2OTUgMTguNDgyMjMzLDguNDM3NSAxOSw4LjQzNzUgQzE5LjUxNzc2Nyw4LjQzNzUgMTkuOTM3NSw4LjAxNzc2Njk1IDE5LjkzNzUsNy41IEwxOS45Mzc1LDYuMjUgQzE5LjkzNzUsNi4wNzc0MTEwMiAyMC4wNzc0MTEsNS45Mzc1IDIwLjI1LDUuOTM3NSBMMjEuNSw1LjkzNzUgWiBNNSwxNiBDMy4zNDMxNDU3NSwxNiAyLDE3LjM0MzE0NTggMiwxOSBDMiwyMC42NTY4NTQyIDMuMzQzMTQ1NzUsMjIgNSwyMiBMMTksMjIgQzIwLjY1Njg1NDIsMjIgMjIsMjAuNjU2ODU0MiAyMiwxOSBDMjIsMTcuMzQzMTQ1OCAyMC42NTY4NTQyLDE2IDE5LDE2IEw1LDE2IFogTTUsMTQgTDE5LDE0IEMyMS43NjE0MjM3LDE0IDI0LDE2LjIzODU3NjMgMjQsMTkgQzI0LDIxLjc2MTQyMzcgMjEuNzYxNDIzNywyNCAxOSwyNCBMNSwyNCBDMi4yMzg1NzYyNSwyNCAzLjM4MTc2ODc2ZS0xNiwyMS43NjE0MjM3IDAsMTkgQy0xLjIyNjM1NTNlLTE1LDE2LjIzODU3NjMgMi4yMzg1NzYyNSwxNCA1LDE0IFoiLz4KPC9zdmc+Cg==');
  }

  .trix-toolbar .trix-button--icon-add-row-after::before {
    background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij4KICA8cGF0aCBkPSJNMTksMTQgQzIxLjc2MDA1MzIsMTQuMDAzMzA2MSAyMy45OTY2OTM5LDE2LjIzOTk0NjggMjQsMTkgQzI0LDIxLjc2MTQyMzcgMjEuNzYxNDIzNywyNCAxOSwyNCBDMTYuMjM4NTc2MywyNCAxNCwyMS43NjE0MjM3IDE0LDE5IEMxNCwxNi4yMzg1NzYzIDE2LjIzODU3NjMsMTQgMTksMTQgWiBNMjEuNSwxOS45Mzc1IEMyMi4wMTc3NjcsMTkuOTM3NSAyMi40Mzc1LDE5LjUxNzc2NyAyMi40Mzc1LDE5IEMyMi40Mzc1LDE4LjQ4MjIzMyAyMi4wMTc3NjcsMTguMDYyNSAyMS41LDE4LjA2MjUgTDIwLjI1LDE4LjA2MjUgQzIwLjA3NzQxMSwxOC4wNjI1IDE5LjkzNzUsMTcuOTIyNTg5IDE5LjkzNzUsMTcuNzUgTDE5LjkzNzUsMTYuNSBDMTkuOTM3NSwxNS45ODIyMzMgMTkuNTE3NzY3LDE1LjU2MjUgMTksMTUuNTYyNSBDMTguNDgyMjMzLDE1LjU2MjUgMTguMDYyNSwxNS45ODIyMzMgMTguMDYyNSwxNi41IEwxOC4wNjI1LDE3Ljc1IEMxOC4wNjI1LDE3LjkyMjU4OSAxNy45MjI1ODksMTguMDYyNSAxNy43NSwxOC4wNjI1IEwxNi41LDE4LjA2MjUgQzE1Ljk4MjIzMywxOC4wNjI1IDE1LjU2MjUsMTguNDgyMjMzIDE1LjU2MjUsMTkgQzE1LjU2MjUsMTkuNTE3NzY3IDE1Ljk4MjIzMywxOS45Mzc1IDE2LjUsMTkuOTM3NSBMMTcuNzUsMTkuOTM3NSBDMTcuOTIyNTg5LDE5LjkzNzUgMTguMDYyNSwyMC4wNzc0MTEgMTguMDYyNSwyMC4yNSBMMTguMDYyNSwyMS41IEMxOC4wNjI1LDIyLjAxNzc2NyAxOC40ODIyMzMsMjIuNDM3NSAxOSwyMi40Mzc1IEMxOS41MTc3NjcsMjIuNDM3NSAxOS45Mzc1LDIyLjAxNzc2NyAxOS45Mzc1LDIxLjUgTDE5LjkzNzUsMjAuMjUgQzE5LjkzNzUsMjAuMDc3NDExIDIwLjA3NzQxMSwxOS45Mzc1IDIwLjI1LDE5LjkzNzUgTDIxLjUsMTkuOTM3NSBaIE01LDIgQzMuMzQzMTQ1NzUsMiAyLDMuMzQzMTQ1NzUgMiw1IEMyLDYuNjU2ODU0MjUgMy4zNDMxNDU3NSw4IDUsOCBMMTksOCBDMjAuNjU2ODU0Miw4IDIyLDYuNjU2ODU0MjUgMjIsNSBDMjIsMy4zNDMxNDU3NSAyMC42NTY4NTQyLDIgMTksMiBMNSwyIFogTTUsMCBMMTksMCBDMjEuNzYxNDIzNywtNS4wNzI2NTMxM2UtMTYgMjQsMi4yMzg1NzYyNSAyNCw1IEMyNCw3Ljc2MTQyMzc1IDIxLjc2MTQyMzcsMTAgMTksMTAgTDUsMTAgQzIuMjM4NTc2MjUsMTAgMy4zODE3Njg3NmUtMTYsNy43NjE0MjM3NSAwLDUgQy0xLjIyNjM1NTNlLTE1LDIuMjM4NTc2MjUgMi4yMzg1NzYyNSw1LjA3MjY1MzEzZS0xNiA1LDAgWiIvPgo8L3N2Zz4K');
  }

  .trix-toolbar .trix-button--icon-delete-table::before {
    background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij4KICA8cGF0aCBkPSJNMTksMTQgQzIxLjc2MDA1MzIsMTQuMDAzMzA2MSAyMy45OTY2OTM5LDE2LjIzOTk0NjggMjQsMTkgQzI0LDIxLjc2MTQyMzcgMjEuNzYxNDIzNywyNCAxOSwyNCBDMTYuMjM4NTc2MywyNCAxNCwyMS43NjE0MjM3IDE0LDE5IEMxNCwxNi4yMzg1NzYzIDE2LjIzODU3NjMsMTQgMTksMTQgWiBNMTYuNSwxOS45Mzc1IEwyMS41LDE5LjkzNzUgQzIyLjAxNzc2NywxOS45Mzc1IDIyLjQzNzUsMTkuNTE3NzY3IDIyLjQzNzUsMTkgQzIyLjQzNzUsMTguNDgyMjMzIDIyLjAxNzc2NywxOC4wNjI1IDIxLjUsMTguMDYyNSBMMTYuNSwxOC4wNjI1IEMxNS45ODIyMzMsMTguMDYyNSAxNS41NjI1LDE4LjQ4MjIzMyAxNS41NjI1LDE5IEMxNS41NjI1LDE5LjUxNzc2NyAxNS45ODIyMzMsMTkuOTM3NSAxNi41LDE5LjkzNzUgWiBNMTIuMjg5ODc4NywxNyBMOSwxNyBMOSwyMiBMMTIuNjczNjMxMiwyMiBDMTMuMDI5NzI5NSwyMi43NDk2MDQ4IDEzLjUxNTEzMywyMy40MjU4Nzk1IDE0LjEwMTAxNzMsMjQgTDUsMjQgQzIuMjM4NTc2MjUsMjQgLTEuNDM4MTc5OTZlLTE1LDIxLjc2MTQyMzcgLTEuNzc2MzU2ODRlLTE1LDE5IEwtMy41NTI3MTM2OGUtMTUsNSBDLTMuODkwODkwNTVlLTE1LDIuMjM4NTc2MjUgMi4yMzg1NzYyNSw1LjA3MjY1MzEzZS0xNiA1LC0xLjc3NjM1Njg0ZS0xNSBMMTksLTEuNzc2MzU2ODRlLTE1IEMyMS43NjE0MjM3LC0yLjI4MzYyMjE1ZS0xNSAyNCwyLjIzODU3NjI1IDI0LDUgTDI0LDcuODIzMTMyODUgQzI0LjAxMjI5NDcsNy44ODA1NDEyNCAyNC4wMTg3MTA3LDcuOTM5NjQ2MjMgMjQuMDE4NzEwNyw4IEMyNC4wMTg3MTA3LDguMDYwMzUzNzcgMjQuMDEyMjk0Nyw4LjExOTQ1ODc2IDI0LDguMTc2ODY3MTUgTDI0LDE0LjEwMTAxNzMgQzIzLjQyNTg3OTUsMTMuNTE1MTMzIDIyLjc0OTYwNDgsMTMuMDI5NzI5NSAyMiwxMi42NzM2MzEyIEwyMiw5IEwxNyw5IEwxNywxMi4yODk4Nzg3IEMxNi4yNzc1NjUxLDEyLjUwNDg4NTggMTUuNjA0MDA3MiwxMi44MzMzODA2IDE1LDEzLjI1NDY4OTMgTDE1LDkgTDksOSBMOSwxNSBMMTMuMjU0Njg5MywxNSBDMTIuODMzMzgwNiwxNS42MDQwMDcyIDEyLjUwNDg4NTgsMTYuMjc3NTY1MSAxMi4yODk4Nzg3LDE3IFogTTE3LDcgTDIyLDcgTDIyLDUgQzIyLDMuMzQzMTQ1NzUgMjAuNjU2ODU0MiwyIDE5LDIgTDE3LDIgTDE3LDcgWiBNMTUsNyBMMTUsMiBMOSwyIEw5LDcgTDE1LDcgWiBNNywyIEw1LDIgQzMuMzQzMTQ1NzUsMiAyLDMuMzQzMTQ1NzUgMiw1IEwyLDcgTDcsNyBMNywyIFogTTIsOSBMMiwxNSBMNywxNSBMNyw5IEwyLDkgWiBNMiwxNyBMMiwxOSBDMiwyMC42NTY4NTQyIDMuMzQzMTQ1NzUsMjIgNSwyMiBMNywyMiBMNywxNyBMMiwxNyBaIi8+Cjwvc3ZnPgo=');
  }

  .trix-toolbar .trix-button--icon-merge-cell::before {
    background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij4KICA8cGF0aCBkPSJNMiwxOSBDMiwyMC42NTY4NTQyIDMuMzQzMTQ1NzUsMjIgNSwyMiBMMTksMjIgQzIwLjY1Njg1NDIsMjIgMjIsMjAuNjU2ODU0MiAyMiwxOSBMMjIsNSBDMjIsMy4zNDMxNDU3NSAyMC42NTY4NTQyLDIgMTksMiBMNSwyIEMzLjM0MzE0NTc1LDIgMiwzLjM0MzE0NTc1IDIsNSBMMiwxOSBaIE0tMS4xNjQwMzM0NGUtMTUsMTkgTC0zLjA2NzgwNjhlLTE2LDUgQy02LjQ0OTU3NTU2ZS0xNiwyLjIzODU3NjI1IDIuMjM4NTc2MjUsMCA1LDAgTDE5LDAgQzIxLjc2MTQyMzcsMCAyNCwyLjIzODU3NjI1IDI0LDUgTDI0LDE5IEMyNCwyMS43NjE0MjM3IDIxLjc2MTQyMzcsMjQgMTksMjQgTDUsMjQgQzIuMjM4NTc2MjUsMjQgOS41MDUwMDI3NWUtMTYsMjEuNzYxNDIzNyAtMS4xNjQwMzM0NGUtMTUsMTkgWiBNMTIsMTAgQzEyLjU1MjI4NDcsMTAgMTMsMTAuNDQ3NzE1MyAxMywxMSBMMTMsMTMgQzEzLDEzLjU1MjI4NDcgMTIuNTUyMjg0NywxNCAxMiwxNCBDMTEuNDQ3NzE1MywxNCAxMSwxMy41NTIyODQ3IDExLDEzIEwxMSwxMSBDMTEsMTAuNDQ3NzE1MyAxMS40NDc3MTUzLDEwIDEyLDEwIFogTTEyLDE2IEMxMi41NTIyODQ3LDE2IDEzLDE2LjQ0NzcxNTMgMTMsMTcgTDEzLDIwIEMxMywyMC41NTIyODQ3IDEyLjU1MjI4NDcsMjEgMTIsMjEgQzExLjQ0NzcxNTMsMjEgMTEsMjAuNTUyMjg0NyAxMSwyMCBMMTEsMTcgQzExLDE2LjQ0NzcxNTMgMTEuNDQ3NzE1MywxNiAxMiwxNiBaIE0xMiwzIEMxMi41NTIyODQ3LDMgMTMsMy40NDc3MTUyNSAxMyw0IEwxMyw3IEMxMyw3LjU1MjI4NDc1IDEyLjU1MjI4NDcsOCAxMiw4IEMxMS40NDc3MTUzLDggMTEsNy41NTIyODQ3NSAxMSw3IEwxMSw0IEMxMSwzLjQ0NzcxNTI1IDExLjQ0NzcxNTMsMyAxMiwzIFoiLz4KPC9zdmc+Cg==');
  }

  .trix-toolbar .trix-button--icon-delete-row::before {
    background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij4KICA8cGF0aCBkPSJNMTMuMjU0Njg5MywxNSBDMTIuODMzMzgwNiwxNS42MDQwMDcyIDEyLjUwNDg4NTgsMTYuMjc3NTY1MSAxMi4yODk4Nzg3LDE3IEw1LDE3IEMyLjIzODU3NjI1LDE3IDMuMzgxNzY4NzZlLTE2LDE0Ljc2MTQyMzcgMCwxMiBDLTEuMjI2MzU1M2UtMTUsOS4yMzg1NzYyNSAyLjIzODU3NjI1LDcgNSw3IEwxOSw3IEMyMS43NjE0MjM3LDcgMjQsOS4yMzg1NzYyNSAyNCwxMiBDMjQsMTIuNjI5NDgxMyAyMy44ODM2NzU0LDEzLjIzMTc5MzYgMjMuNjcxMzQ5NywxMy43ODY2MTM0IEMyMy4xNTQ3NTMyLDEzLjMyMzQxNTUgMjIuNTY4OTE2OCwxMi45MzU4ODA3IDIxLjkzMTI3MDgsMTIuNjQxNDM5MSBDMjEuOTc2Mjg1MiwxMi40MzQ3NzUxIDIyLDEyLjIyMDE1NyAyMiwxMiBDMjIsMTAuMzQzMTQ1OCAyMC42NTY4NTQyLDkgMTksOSBMNSw5IEMzLjM0MzE0NTc1LDkgMiwxMC4zNDMxNDU4IDIsMTIgQzIsMTMuNjU2ODU0MiAzLjM0MzE0NTc1LDE1IDUsMTUgTDEzLjI1NDY4OTMsMTUgWiBNMTksMTQgQzIxLjc2MDA1MzIsMTQuMDAzMzA2MSAyMy45OTY2OTM5LDE2LjIzOTk0NjggMjQsMTkgQzI0LDIxLjc2MTQyMzcgMjEuNzYxNDIzNywyNCAxOSwyNCBDMTYuMjM4NTc2MywyNCAxNCwyMS43NjE0MjM3IDE0LDE5IEMxNCwxNi4yMzg1NzYzIDE2LjIzODU3NjMsMTQgMTksMTQgWiBNMTYuNSwxOS45Mzc1IEwyMS41LDE5LjkzNzUgQzIyLjAxNzc2NywxOS45Mzc1IDIyLjQzNzUsMTkuNTE3NzY3IDIyLjQzNzUsMTkgQzIyLjQzNzUsMTguNDgyMjMzIDIyLjAxNzc2NywxOC4wNjI1IDIxLjUsMTguMDYyNSBMMTYuNSwxOC4wNjI1IEMxNS45ODIyMzMsMTguMDYyNSAxNS41NjI1LDE4LjQ4MjIzMyAxNS41NjI1LDE5IEMxNS41NjI1LDE5LjUxNzc2NyAxNS45ODIyMzMsMTkuOTM3NSAxNi41LDE5LjkzNzUgWiIvPgo8L3N2Zz4K');
  }

  .trix-toolbar .trix-button--icon-delete-col::before {
    background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij4KICA8cGF0aCBkPSJNMTIuNjQxNDM5MSwyMS45MzEyNzA4IEMxMi45MzU4ODA3LDIyLjU2ODkxNjggMTMuMzIzNDE1NSwyMy4xNTQ3NTMyIDEzLjc4NjYxMzQsMjMuNjcxMzQ5NyBDMTMuMjMxNzkzNiwyMy44ODM2NzU0IDEyLjYyOTQ4MTMsMjQgMTIsMjQgQzkuMjM4NTc2MjUsMjQgNywyMS43NjE0MjM3IDcsMTkgTDcsNSBDNywyLjIzODU3NjI1IDkuMjM4NTc2MjUsMCAxMiwwIEMxNC43NjE0MjM3LDAgMTcsMi4yMzg1NzYyNSAxNyw1IEwxNywxMi4yODk4Nzg3IEMxNi4yNzc1NjUxLDEyLjUwNDg4NTggMTUuNjA0MDA3MiwxMi44MzMzODA2IDE1LDEzLjI1NDY4OTMgTDE1LDUgQzE1LDMuMzQzMTQ1NzUgMTMuNjU2ODU0MiwyIDEyLDIgQzEwLjM0MzE0NTgsMiA5LDMuMzQzMTQ1NzUgOSw1IEw5LDE5IEM5LDIwLjY1Njg1NDIgMTAuMzQzMTQ1OCwyMiAxMiwyMiBDMTIuMjIwMTU3LDIyIDEyLjQzNDc3NTEsMjEuOTc2Mjg1MiAxMi42NDE0MzkxLDIxLjkzMTI3MDggWiBNMTksMTQgQzIxLjc2MDA1MzIsMTQuMDAzMzA2MSAyMy45OTY2OTM5LDE2LjIzOTk0NjggMjQsMTkgQzI0LDIxLjc2MTQyMzcgMjEuNzYxNDIzNywyNCAxOSwyNCBDMTYuMjM4NTc2MywyNCAxNCwyMS43NjE0MjM3IDE0LDE5IEMxNCwxNi4yMzg1NzYzIDE2LjIzODU3NjMsMTQgMTksMTQgWiBNMTYuNSwxOS45Mzc1IEwyMS41LDE5LjkzNzUgQzIyLjAxNzc2NywxOS45Mzc1IDIyLjQzNzUsMTkuNTE3NzY3IDIyLjQzNzUsMTkgQzIyLjQzNzUsMTguNDgyMjMzIDIyLjAxNzc2NywxOC4wNjI1IDIxLjUsMTguMDYyNSBMMTYuNSwxOC4wNjI1IEMxNS45ODIyMzMsMTguMDYyNSAxNS41NjI1LDE4LjQ4MjIzMyAxNS41NjI1LDE5IEMxNS41NjI1LDE5LjUxNzc2NyAxNS45ODIyMzMsMTkuOTM3NSAxNi41LDE5LjkzNzUgWiIvPgo8L3N2Zz4K');
  }

  .trix-toolbar .trix-button--icon-horizon-line::before {
    background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij4KICA8cGF0aCBkPSJNNSwxMyBDNC40NDc3MTUyNSwxMyA0LDEyLjU1MjI4NDcgNCwxMiBDNCwxMS40NDc3MTUzIDQuNDQ3NzE1MjUsMTEgNSwxMSBMMTksMTEgQzE5LjU1MjI4NDcsMTEgMjAsMTEuNDQ3NzE1MyAyMCwxMiBDMjAsMTIuNTUyMjg0NyAxOS41NTIyODQ3LDEzIDE5LDEzIEw1LDEzIFoiLz4KPC9zdmc+Cg==');
  }

  .trix-toolbar .trix-dialog {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    font-size: 0.75em;
    padding: 15px 10px;
    background: #fff;
    box-shadow: 0 0.3em 1em #ccc;
    border-top: 2px solid #888;
    border-radius: 5px;
    z-index: 5;
  }

  .trix-toolbar .trix-input--dialog {
    font-size: inherit;
    font-weight: normal;
    padding: 0.5em 0.8em;
    margin: 0 10px 0 0;
    border-radius: 3px;
    border: 1px solid #bbb;
    background-color: #fff;
    box-shadow: none;
    outline: none;
    -webkit-appearance: none;
    -moz-appearance: none;
  }

  .trix-toolbar .trix-input--dialog.validate:invalid {
    box-shadow: #F00 0px 0px 1.5px 1px;
  }

  .trix-toolbar .trix-button--dialog {
    font-size: inherit;
    padding: 0.5em;
    border-bottom: none;
  }

  .trix-toolbar .trix-dialog--link {
    max-width: 600px;
  }

  .trix-toolbar .trix-dialog__link-fields {
    display: flex;
    align-items: baseline;
  }

  .trix-toolbar .trix-dialog__link-fields .trix-input {
    flex: 1;
  }

  .trix-toolbar .trix-dialog__link-fields .trix-button-group {
    flex: 0 0 content;
    margin: 0;
  }

  .trix-editor [data-trix-mutable]:not(.attachment__caption-editor) {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .trix-editor [data-trix-mutable]::-moz-selection,
  .trix-editor [data-trix-cursor-target]::-moz-selection, .trix-editor [data-trix-mutable] ::-moz-selection {
    background: none;
  }

  .trix-editor [data-trix-mutable]::selection,
  .trix-editor [data-trix-cursor-target]::selection, .trix-editor [data-trix-mutable] ::selection {
    background: none;
  }

  .trix-editor [data-trix-mutable].attachment__caption-editor:focus::-moz-selection {
    background: highlight;
  }

  .trix-editor [data-trix-mutable].attachment__caption-editor:focus::selection {
    background: highlight;
  }

  .trix-editor [data-trix-mutable].attachment.attachment--file {
    box-shadow: 0 0 0 2px highlight;
    border-color: transparent;
  }

  .trix-editor [data-trix-mutable].attachment img {
    box-shadow: 0 0 0 2px highlight;
  }

  .trix-editor .attachment {
    position: relative;
  }

  .trix-editor .attachment:hover {
    cursor: default;
  }

  .trix-editor .attachment--preview .attachment__caption:hover {
    cursor: text;
  }

  .trix-editor .attachment__progress {
    position: absolute;
    z-index: 1;
    height: 20px;
    top: calc(50% - 10px);
    left: 5%;
    width: 90%;
    opacity: 0.9;
    transition: opacity 200ms ease-in;
  }

  .trix-editor .attachment__progress[value="100"] {
    opacity: 0;
  }

  .trix-editor .attachment__caption-editor {
    display: inline-block;
    width: 100%;
    margin: 0;
    padding: 0;
    font-size: inherit;
    font-family: inherit;
    line-height: inherit;
    color: inherit;
    text-align: center;
    vertical-align: top;
    border: none;
    outline: none;
    -webkit-appearance: none;
    -moz-appearance: none;
  }

  .trix-editor .attachment__toolbar {
    position: absolute;
    z-index: 1;
    top: -0.9em;
    left: 0;
    width: 100%;
    text-align: center;
  }

  .trix-editor .trix-button-group {
    display: inline-flex;
  }

  .trix-editor .trix-button {
    position: relative;
    float: left;
    color: #666;
    white-space: nowrap;
    font-size: 80%;
    padding: 0 0.8em;
    margin: 0;
    outline: none;
    border: none;
    border-radius: 0;
    background: transparent;
  }

  .trix-editor .trix-button:not(:first-child) {
    border-left: 1px solid #ccc;
  }

  .trix-editor .trix-button.trix-active {
    background: #cbeefa;
  }

  .trix-editor .trix-button:not(:disabled) {
    cursor: pointer;
  }

  .trix-editor .trix-button--remove {
    text-indent: -9999px;
    display: inline-block;
    padding: 0;
    outline: none;
    width: 1.8em;
    height: 1.8em;
    line-height: 1.8em;
    border-radius: 50%;
    background-color: #fff;
    border: 2px solid highlight;
    box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.25);
  }

  .trix-editor .trix-button--remove::before {
    display: inline-block;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    opacity: 0.7;
    content: "";
    background-image: url(data:image/svg+xml,%3Csvg%20height%3D%2224%22%20width%3D%2224%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M19%206.4L17.6%205%2012%2010.6%206.4%205%205%206.4l5.6%205.6L5%2017.6%206.4%2019l5.6-5.6%205.6%205.6%201.4-1.4-5.6-5.6z%22%2F%3E%3Cpath%20d%3D%22M0%200h24v24H0z%22%20fill%3D%22none%22%2F%3E%3C%2Fsvg%3E);
    background-position: center;
    background-repeat: no-repeat;
    background-size: 90%;
  }

  .trix-editor .trix-button--remove:hover {
    border-color: #333;
  }

  .trix-editor .trix-button--remove:hover::before {
    opacity: 1;
  }

  .trix-editor .attachment__metadata-container {
    position: relative;
  }

  .trix-editor .attachment__metadata {
    position: absolute;
    left: 50%;
    top: 2em;
    transform: translate(-50%, 0);
    max-width: 90%;
    padding: 0.1em 0.6em;
    font-size: 0.8em;
    color: #fff;
    background-color: rgba(0, 0, 0, 0.7);
    border-radius: 3px;
  }

  .trix-editor .attachment__metadata .attachment__name {
    display: inline-block;
    max-width: 100%;
    vertical-align: bottom;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .trix-editor .attachment__metadata .attachment__size {
    margin-left: 0.2em;
    white-space: nowrap;
  }

  .trix-content {
    line-height: 1.5;
  }

  .trix-content * {
    box-sizing: border-box;
  }

  .trix-content h1 {
    /*font-size: 1.2em;*/
    /*line-height: 1.2;*/
    /*margin: 0;*/
  }

  .trix-content blockquote {
    margin: 0 0 0 0.3em;
    padding: 0 0 0 0.6em;
    border-left: 0.3em solid #ccc;
  }

  .trix-content pre {
    display: inline-block;
    width: 100%;
    vertical-align: top;
    font-family: monospace;
    font-size: 0.9em;
    margin: 0;
    padding: 0.5em;
    white-space: pre;
    background-color: #000;
    color: #fff;
    overflow-x: auto;
  }

  .trix-content ul, .trix-content ol, .trix-content li {
    margin: 0;
    padding: 0;
  }

  .trix-content ul li, .trix-content ol li, .trix-content li li {
    margin-left: 1em;
  }

  .trix-content img {
    max-width: 100%;
    height: auto;
  }

  .trix-content .attachment {
    display: inline-block;
    position: relative;
    max-width: 100%;
    margin: 0;
    padding: 0;
  }

  .trix-content .attachment a {
    color: inherit;
    text-decoration: none;
  }

  .trix-content .attachment a:hover, .trix-content .attachment a:visited:hover {
    color: inherit;
  }

  .trix-content .attachment__caption {
    padding: 0;
    text-align: center;
  }

  .trix-content .attachment__caption .attachment__name + .attachment__size::before {
    content: ' · ';
  }

  .trix-content .attachment--preview {
    width: 100%;
    text-align: center;
  }

  .trix-content .attachment--preview .attachment__caption {
    color: #666;
    font-size: 0.9em;
    line-height: 1.2;
  }

  .trix-content .attachment--file {
    color: #333;
    line-height: 1;
    margin: 0 2px 2px 0;
    padding: 0.4em 1em;
    border: 1px solid #bbb;
    border-radius: 5px;
  }

  .trix-content .attachment-gallery {
    display: flex;
    flex-wrap: wrap;
    position: relative;
    margin: 0;
    padding: 0;
  }

  .trix-content .attachment-gallery .attachment {
    flex: 1 0 33%;
    padding: 0 0.5em;
    max-width: 33%;
  }

  .trix-content .attachment-gallery.attachment-gallery--2 .attachment, .trix-content .attachment-gallery.attachment-gallery--4 .attachment {
    flex-basis: 50%;
    max-width: 50%;
  }
</style>

<style>
  /*全局样式重置*/
  .layout.ant-layout {
    overflow: visible;
  }

  .trix-content, h1, h2, h3, h4, h5, h6 {
    color: #000 !important;
    margin: 0;
  }

  .trix-content h1, h2, h3, h4, h5, h6 {
    font-weight: bold !important;
  }

  .trix-content a {
    cursor: default;
  }

  .trix-editor p {
    margin: 0;
  }

  .ProseMirror {
    outline: none;
    min-height: 400px;
  }

  html {
    height: 100%;
    font-size: 10px;
  }

  body {
    height: 100%;
    margin: 0;
    padding: 0;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 1.6rem;
    line-height: 1.4;
    background-color: #FBF7F0;
  }

  @media (min-width: 1080px) {
    body {
      font-size: calc(1.2em + 0.5vw);
    }
  }

  a, a:visited {
    color: #038930;
  }

  /*.layout {*/
  /*max-width: 90em;*/
  /*margin: 0 auto; }*/
  /*@media (min-width: 1080px) {*/
  /*.layout {*/
  /*min-height: 100%;*/
  /*display: flex;*/
  /*flex-direction: row;*/
  /*justify-content: space-between;*/
  /*align-items: stretch; } }*/

  .trix-content h1 {
    margin-bottom: 0.4em;
  }

  .trix-content .attachment--preview {
    margin: 0.6em 0;
  }

  .trix-main-toolbar {
    position: -webkit-sticky;
    position: sticky;
    top: -0.1rem;
    font-family: sans-serif;
    background-color: #fff;
    z-index: 10;
    padding: 1em 0;
  }

  .trix-toolbar .trix-button-group {
    margin-bottom: 0;
  }

  .fullscreen {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    background-color: white;
    min-height: 100vh;
    padding: 0 1em 1em 1em;
  }

  .fullscreen .trix-toolbar {
    flex-shrink: 0;
  }

  .fullscreen .trix-editor {
    flex: 1 0 auto;
    padding: 0;
    min-height: 0 !important;
  }

  /*纸张包裹*/
  .paper {
    position: relative;
    flex-grow: 1;
    max-width: 45em;
    margin: 0 auto;
    padding: 1em;
    background-color: #fff;
    box-shadow: -0.4rem 0.4rem 2rem rgba(0, 0, 0, 0.1);
    border-top-left-radius: 0.3rem;
  }

  @media (min-width: 1080px) {
    .paper {
      max-width: 70%;
      padding: 1em;
    }
  }

  @media (max-width: 768px) {
    .ProseMirror {
      min-height: 800px;
    }

    .trix-toolbar {
      /*position: fixed;*/
      /*top: 0px;*/
      /*top: unset;*/
    }
  }

  .paper::after {
    content: '';
    position: absolute;
    bottom: 9px;
    right: 6px;
    width: 200px;
    height: 20px;
    z-index: -1;
    box-shadow: 0 2px 12px 5px rgba(0, 0, 0, .3);
    transform: rotate(5deg);
  }

  .paper:before {
    /*right:4px;*/
    /*transform:rotate(-6deg);*/
    content: '';
    position: absolute;
    z-index: -1;
    top: 1em;
    right: 0;
    bottom: 0;
    left: -1em;
    background-color: #fff;
    border-top-left-radius: 0.3rem;
    box-shadow: -0.2rem 0.2rem 1rem rgba(0, 0, 0, 0.1);
  }

  .paper-inner {
    max-width: 40em;
    margin: 0 auto;
  }

</style>

<style>
  pre::before {
    content: attr(data-language);
    text-transform: uppercase;
    display: block;
    text-align: right;
    font-weight: bold;
    font-size: 0.6rem;
  }

  pre code .hljs-comment,
  pre code .hljs-quote {
    color: #999999;
  }

  pre code .hljs-variable,
  pre code .hljs-template-variable,
  pre code .hljs-attribute,
  pre code .hljs-tag,
  pre code .hljs-name,
  pre code .hljs-regexp,
  pre code .hljs-link,
  pre code .hljs-name,
  pre code .hljs-selector-id,
  pre code .hljs-selector-class {
    color: #f2777a;
  }

  pre code .hljs-number,
  pre code .hljs-meta,
  pre code .hljs-built_in,
  pre code .hljs-builtin-name,
  pre code .hljs-literal,
  pre code .hljs-type,
  pre code .hljs-params {
    color: #f99157;
  }

  pre code .hljs-string,
  pre code .hljs-symbol,
  pre code .hljs-bullet {
    color: #99cc99;
  }

  pre code .hljs-title,
  pre code .hljs-section {
    color: #ffcc66;
  }

  pre code .hljs-keyword,
  pre code .hljs-selector-tag {
    color: #6699cc;
  }

  pre code .hljs-emphasis {
    font-style: italic;
  }

  pre code .hljs-strong {
    font-weight: 700;
  }
</style>
<style>
  .trix-content table {
    border-collapse: collapse;
    table-layout: fixed;
    width: 100%;
    margin: 0;
    overflow: hidden;
  }

  .trix-content table td, .trix-content table th {
    min-width: 1em;
    border: 1px solid #ccc;
    padding: 3px 5px;
    vertical-align: top;
    box-sizing: border-box;
    position: relative;
  }

  .trix-content table td > *, .trix-content table th > * {
    margin-bottom: 0;
  }

  .trix-content table th {
    font-weight: bold;
    text-align: center;
    background-color: #ececec;
  }

  .trix-content table .selectedCell:after {
    z-index: 2;
    position: absolute;
    content: "";
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba(200, 200, 255, 0.4);
    pointer-events: none;
  }

  .trix-content table .column-resize-handle {
    position: absolute;
    right: -2px;
    top: 0;
    bottom: 0;
    width: 4px;
    z-index: 20;
    background-color: #adf;
    pointer-events: none;
  }

  .tableWrapper {
    margin: 1em 0;
    overflow-x: auto;
  }

  .resize-cursor {
    cursor: ew-resize;
    cursor: col-resize;
  }
</style>
<style>
  /*todo list*/
  ul[data-type=todo_list] {
    padding-left: 0;
  }

  li[data-type=todo_item] {
    display: flex;
    flex-direction: row;
  }

  .todo-checkbox {
    border: 2px solid #000;
    height: 0.9em;
    width: 0.9em;
    box-sizing: border-box;
    margin-right: 10px;
    margin-top: 0.3rem;
    user-select: none;
    -webkit-user-select: none;
    cursor: pointer;
    border-radius: 0.2em;
    background-color: transparent;
    transition: 0.4s background;
  }

  .todo-content {
    flex: 1;
  }

  .todo-content > p:last-of-type {
    margin-bottom: 0;
  }

  .todo-content > ul[data-type=todo_list] {
    margin: 0.5rem 0;
  }

  li[data-done=true] > .todo-content > p {
    text-decoration: line-through;
  }

  li[data-done=true] > .todo-checkbox {
    background-color: #000;
  }

  li[data-done=false] {
    text-decoration: none;
  }

  /*编辑器浮动菜单样式*/
  .menububble {
    position: absolute;
    z-index: 20;
    background: #fff;
    border-radius: 5px;
    padding: 0.5em;
    margin-bottom: 0.5rem;
    transform: translateX(-50%);
    visibility: hidden;
    opacity: 0;
    transition: opacity 0.2s, visibility 0.2s;
    box-shadow: 0 3px 5px -1px rgba(0,0,0,0.2), 0 6px 10px 0 rgba(0,0,0,0.14), 0 1px 18px 0 rgba(0,0,0,0.12);
  }
  .menububble > div {
    justify-content: space-around;
    display: flex;
  }
  .menububble  i {
    width: 1px;
    display: inline-block;
    background-color: #e2e2e2;
    float: left;
    height: 1.5em;
    margin: 0 2px;
  }

  .menububble > hr {
    background-color: #e2e2e2;
    margin: 0.2em;
    border: none;
    height: 1px;
  }
  .menububble button:before {
    margin: 5px 0 5px 0;
  }
  .menububble .trix-button {
    border: 0 !important;
    border-radius: 6px;
  }

  .menububble.is-active {
    opacity: 1;
    visibility: visible;
  }

  .menububble__button:last-child {
    margin-right: 0;
  }

  .show {
    display: block;
  }
</style>
