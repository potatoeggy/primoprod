/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'vue-dragscroll' {
  import type { Directive } from 'vue'
  export const dragscrollNext: Directive<any, any>
}