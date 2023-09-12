// If you want to use Phoenix channels, run `mix help phx.gen.channel`
// to get started and then uncomment the line below.
// import "./user_socket.js"

// You can include dependencies in two ways.
//
// The simplest option is to put them in assets/vendor and
// import them using relative paths:
//
//     import "../vendor/some-package.js"
//
// Alternatively, you can `npm install some-package --prefix assets` and import
// them using a path starting with the package name:
//
//     import "some-package"
//

// Include phoenix_html to handle method=PUT/DELETE in forms and buttons.
import "phoenix_html"
// Establish Phoenix Socket and LiveView configuration.
import {Socket} from "phoenix"
import {LiveSocket} from "phoenix_live_view"
import topbar from "../vendor/topbar"
// npm install @popperjs/core --prefix assets
import { createPopper } from '@popperjs/core';

// A class to manage the tooltip lifecycle.
class Tooltip {
  showEvents = ['mouseenter', 'focus'];
  hideEvents = ['mouseleave', 'blur'];
  $parent;
  $tooltip;
  popperInstance;

  constructor($tooltip) {
    this.$tooltip = $tooltip;
    this.$parent = $tooltip.parentElement;
    this.popperInstance = createPopper(this.$parent, $tooltip, {
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, -8],
          },
        },
      ],
    });
    this.destructors = [];

    // For each show event, add an event listener on the parent element and store a destructor to call removeEventListener when the tooltip is destroyed.
    this.showEvents.forEach((event) => {
      const callback = this.show.bind(this);
      this.$parent.addEventListener(event, callback);
      this.destructors.push(() =>
        this.$parent.removeEventListener(event, callback)
      );
    });

    // For each hide event, add an event listener on the parent element and store a destructor to call removeEventListener when the tooltip is destroyed.
    this.hideEvents.forEach((event) => {
      const callback = this.hide.bind(this);
      this.$parent.addEventListener(event, callback);
      this.destructors.push(() =>
        this.$parent.removeEventListener(event, callback)
      );
    });
  }

  // The show method adds the data-show attribute to the tooltip element, which makes it visible (see CSS).
  show() {
    this.$tooltip.setAttribute('data-show', '');
    this.update();
  }

  // Update the popper instance so the tooltip position is recalculated.
  update() {
    this.popperInstance?.update();
  }

  // The hide method removes the data-show attribute from the tooltip element, which makes it invisible (see CSS).
  hide() {
    this.$tooltip.removeAttribute('data-show');
  }

  // The destroy method removes all event listeners and destroys the popper instance.
  destroy() {
    this.destructors.forEach((destructor) => destructor());
    this.popperInstance?.destroy();
  }
}

const Hooks = {
  TooltipHook: {
    mounted() {
      this.el.tooltip = new Tooltip(this.el);
    },
    updated() {
      this.el.tooltip?.update();
    },
    destroyed() {
      this.el.tooltip?.destroy();
    },
  },
};

let csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content")
let liveSocket = new LiveSocket("/live", Socket, {params: {_csrf_token: csrfToken}, hooks: Hooks})

// Show progress bar on live navigation and form submits
topbar.config({barColors: {0: "#29d"}, shadowColor: "rgba(0, 0, 0, .3)"})
window.addEventListener("phx:page-loading-start", _info => topbar.show(300))
window.addEventListener("phx:page-loading-stop", _info => topbar.hide())

// connect if there are any LiveViews on the page
liveSocket.connect()

// expose liveSocket on window for web console debug logs and latency simulation:
// >> liveSocket.enableDebug()
// >> liveSocket.enableLatencySim(1000)  // enabled for duration of browser session
// >> liveSocket.disableLatencySim()
window.liveSocket = liveSocket

