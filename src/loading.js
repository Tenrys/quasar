import $ from 'jquery'
import { current as theme } from './theme'
import { Vue } from './install'
import Events from './events'

let
  vm,
  appIsInProgress = false,
  timeout

const
  body = $('body'),
  template = `
    <div class="fullscreen column items-center justify-center z-absolute">
      <spinner :name="spinner" color="#fff" :size="80"></spinner>
      <div v-if="message" style="margin: 40px 20px 0 20px; max-width: 450px; text-align: center; color: white; text-shadow: 0 0 7px black">{{ message }}</div>
    </div>
  `

function isActive () {
  return appIsInProgress
}

function show ({
  delay = 500,
  spinner = theme === 'ios' ? 'ios' : 'tail',
  message = false
} = {}) {
  if (appIsInProgress) {
    vm.$data = {spinner, message}
    return
  }

  timeout = setTimeout(function () {
    var node = $(template)

    body.addClass('dimmed')
    body.append(node)

    vm = new Vue({
      el: node[0],
      data: {
        spinner,
        message
      }
    })

    timeout = null
  }, delay)

  appIsInProgress = true
  Events.trigger('app:loading', true)
}

function hide () {
  if (!appIsInProgress) {
    return
  }

  if (timeout) {
    clearTimeout(timeout)
    timeout = null
  }
  else {
    body.removeClass('dimmed')
    vm.$destroy(true)
  }

  appIsInProgress = false
  Events.trigger('app:loading', false)
}

export default {
  isActive,
  show,
  hide
}
