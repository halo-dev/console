import Ellipsis from '@/components/Ellipsis'
import FooterToolbar from '@/components/FooterToolbar'
import FilePondUpload from '@/components/Upload/FilePondUpload'
import AttachmentSelectDrawer from './Attachment/AttachmentSelectDrawer'
import ReactiveButton from './Button/ReactiveButton'

const _components = {
  Ellipsis,
  FooterToolbar,
  FilePondUpload,
  AttachmentSelectDrawer,
  ReactiveButton
}

export function registerComponents(app) {
  Object.keys(_components).forEach(key => {
    app.component(key, _components[key])
  })
}
