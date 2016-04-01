/**
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

(function(global) {
  'use strict';

  var HAS_NEW_MOUSE = (function() {
    var has = false;
    try {
      has = Boolean(new MouseEvent('x'));
    } catch (_) {}
    return has;
  })();

  /*
   * Returns the (x,y) coordinates representing the middle of a node.
   *
   * @param {HTMLElement} node An element.
   */
  function middleOfNode(node) {
    var bcr = node.getBoundingClientRect();
    return {
      y: bcr.top + (bcr.height / 2),
      x: bcr.left + (bcr.width / 2)
    };
  }

  /*
   * Returns the (x,y) coordinates representing the top left corner of a node.
   *
   * @param {HTMLElement} node An element.
   */
  function topLeftOfNode(node) {
    var bcr = node.getBoundingClientRect();
    return {
      y: bcr.top,
      x: bcr.left
    };
  }

  /*
   * Fires a mouse event on a specific node, at a given set of coordinates.
   * This event bubbles and is cancellable.
   *
   * @param {String} type The type of mouse event (such as 'tap' or 'down').
   * @param {Object} xy The (x,y) coordinates the mouse event should be fired from.
   * @param {HTMLElement} node The node to fire the event on.
   */
  function makeEvent(type, xy, node) {
    var props = {
      bubbles: true,
      cancelable: true,
      clientX: xy.x,
      clientY: xy.y,
      // Make this a primary input.
      buttons: 1 // http://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons
    };
    var e;
    var mousetype = type === 'tap' ? 'click' : 'mouse' + type;
    if (HAS_NEW_MOUSE) {
      e = new MouseEvent(mousetype, props);
    } else {
      e = document.createEvent('MouseEvent');
      e.initMouseEvent(
        mousetype, props.bubbles, props.cancelable,
        null, /* view */
        null, /* detail */
        0,    /* screenX */
        0,    /* screenY */
        props.clientX, props.clientY,
        false, /*ctrlKey */
        false, /*altKey */
        false, /*shiftKey */
        false, /*metaKey */
        0,     /*button */
        null   /*relatedTarget*/);
    }
    node.dispatchEvent(e);
  }

  /*
   * Simulates a mouse move action by firing a `move` mouse event on a
   * specific node, between a set of coordinates.
   *
   * @param {HTMLElement} node The node to fire the event on.
   * @param {Object} fromXY The (x,y) coordinates the dragging should start from.
   * @param {Object} toXY The (x,y) coordinates the dragging should end at.
   * @param {Object} steps Optional. The numbers of steps in the move motion.
   *    If not specified, the default is 5.
   */
  function move(node, fromXY, toXY, steps) {
    steps = steps || 5;
    var dx = Math.round((fromXY.x - toXY.x) / steps);
    var dy = Math.round((fromXY.y - toXY.y) / steps);
    var xy = {
      x: fromXY.x,
      y: fromXY.y
    };
    for (var i = steps; i > 0; i--) {
      makeEvent('move', xy, node);
      xy.x += dx;
      xy.y += dy;
    }
    makeEvent('move', {
      x: toXY.x,
      y: toXY.y
    }, node);
  }

  /*
   * Simulates a mouse dragging action originating in the middle of a specific node.
   *
   * @param {HTMLElement} target The node to fire the event on.
   * @param {Number} dx The horizontal displacement.
   * @param {Object} dy The vertical displacement
   * @param {Object} steps Optional. The numbers of steps in the dragging motion.
   *    If not specified, the default is 5.
   */
  function track(target, dx, dy, steps) {
    dx = dx | 0;
    dy = dy | 0;
    steps = steps || 5;
    down(target);
    var xy = middleOfNode(target);
    var xy2 = {
      x: xy.x + dx,
      y: xy.y + dy
    };
    move(target, xy, xy2, steps);
    up(target, xy2);
  }

  /*
   * Fires a `down` mouse event on a specific node, at a given set of coordinates.
   * This event bubbles and is cancellable. If the (x,y) coordinates are
   * not specified, the middle of the node will be used instead.
   *
   * @param {HTMLElement} node The node to fire the event on.
   * @param {Object} xy Optional. The (x,y) coordinates the mouse event should be fired from.
   */
  function down(node, xy) {
    xy = xy || middleOfNode(node);
    makeEvent('down', xy, node);
  }

  /*
   * Fires an `up` mouse event on a specific node, at a given set of coordinates.
   * This event bubbles and is cancellable. If the (x,y) coordinates are
   * not specified, the middle of the node will be used instead.
   *
   * @param {HTMLElement} node The node to fire the event on.
   * @param {Object} xy Optional. The (x,y) coordinates the mouse event should be fired from.
   */
  function up(node, xy) {
    xy = xy || middleOfNode(node);
    makeEvent('up', xy, node);
  }

  /*
   * Simulates a complete mouse click by firing a `down` mouse event, followed
   * by an asynchronous `up` and `tap` events on a specific node. Calls the
   *`callback` after the `tap` event is fired.
   *
   * @param {HTMLElement} target The node to fire the event on.
   * @param {Object} callback Optional. The function to be called after the action ends.
   */
  function downAndUp(target, callback) {
    down(target);
    Polymer.Base.async(function() {
      up(target);
      tap(target);

      callback && callback();
    });
  }

  /*
   * Fires a 'tap' mouse event on a specific node. This respects the pointer-events
   * set on the node, and will not fire on disabled nodes.
   *
   * @param {HTMLElement} node The node to fire the event on.
   * @param {Object} xy Optional. The (x,y) coordinates the mouse event should be fired from.
   */
  function tap(node) {
    // Respect nodes that are disabled in the UI.
    if (window.getComputedStyle(node)['pointer-events'] === 'none')
      return;
    var xy = middleOfNode(node);
    down(node, xy);
    up(node, xy);
    makeEvent('tap', xy, node);
  }

  /*
   * Focuses a node by firing a `focus` event. This event does not bubble.
   *
   * @param {HTMLElement} target The node to fire the event on.
   */
  function focus(target) {
    Polymer.Base.fire('focus', {}, {
      bubbles: false,
      node: target
    });
  }

  /*
   * Blurs a node by firing a `blur` event. This event does not bubble.
   *
   * @param {HTMLElement} target The node to fire the event on.
   */
  function blur(target) {
    Polymer.Base.fire('blur', {}, {
      bubbles: false,
      node: target
    });
  }

  /*
   * Returns a keyboard event. This event bubbles and is cancellable.
   *
   * @param {String} type The type of keyboard event (such as 'keyup' or 'keydown').
   * @param {Number} keyCode The keyCode for the event.
   * @param {?String|[String]} modifiers The key modifiers for the event.
   * Accepted values are shift, ctrl, alt, meta.
   */
  function keyboardEventFor(type, keyCode, modifiers) {
    var event = new CustomEvent(type, {
      bubbles: true,
      cancelable: true
    });

    event.keyCode = keyCode;
    event.code = keyCode;

    modifiers = modifiers || [];
    if (typeof modifiers === 'string') {
      modifiers = [modifiers];
    }
    event.shiftKey = modifiers.indexOf('shift') !== -1;
    event.altKey = modifiers.indexOf('alt') !== -1;
    event.ctrlKey = modifiers.indexOf('ctrl') !== -1;
    event.metaKey = modifiers.indexOf('meta') !== -1;

    return event;
  }

  /*
   * Fires a keyboard event on a specific node. This event bubbles and is cancellable.
   *
   * @param {HTMLElement} target The node to fire the event on.
   * @param {String} type The type of keyboard event (such as 'keyup' or 'keydown').
   * @param {Number} keyCode The keyCode for the event.
   * @param {?String|[String]} modifiers The key modifiers for the event.
   * Accepted values are shift, ctrl, alt, meta.
   */
  function keyEventOn(target, type, keyCode, modifiers) {
    target.dispatchEvent(keyboardEventFor(type, keyCode, modifiers));
  }

  /*
   * Fires a 'keydown' event on a specific node. This event bubbles and is cancellable.
   *
   * @param {HTMLElement} target The node to fire the event on.
   * @param {Number} keyCode The keyCode for the event.
   * @param {?String|[String]} modifiers The key modifiers for the event.
   * Accepted values are shift, ctrl, alt, meta.
   */
  function keyDownOn(target, keyCode, modifiers) {
    keyEventOn(target, 'keydown', keyCode, modifiers);
  }

  /*
   * Fires a 'keyup' event on a specific node. This event bubbles and is cancellable.
   *
   * @param {HTMLElement} target The node to fire the event on.
   * @param {Number} keyCode The keyCode for the event.
   * @param {?String|[String]} modifiers The key modifiers for the event.
   * Accepted values are shift, ctrl, alt, meta.
   */
  function keyUpOn(target, keyCode, modifiers) {
    keyEventOn(target, 'keyup', keyCode, modifiers);
  }

  /*
   * Simulates a complete key press by firing a `keydown` keyboard event, followed
   * by an asynchronous `keyup` event on a specific node.
   *
   * @param {HTMLElement} target The node to fire the event on.
   * @param {Number} keyCode The keyCode for the event.
   * @param {?String|[String]} modifiers The key modifiers for the event.
   * Accepted values are shift, ctrl, alt, meta.
   */
  function pressAndReleaseKeyOn(target, keyCode, modifiers) {
    keyDownOn(target, keyCode, modifiers);
    Polymer.Base.async(function() {
      keyUpOn(target, keyCode, modifiers);
    }, 1);
  }

  /*
   * Simulates a complete 'enter' key press by firing a `keydown` keyboard event,
   * followed by an asynchronous `keyup` event on a specific node.
   *
   * @param {HTMLElement} target The node to fire the event on.
   */
  function pressEnter(target) {
    pressAndReleaseKeyOn(target, 13);
  }

  /*
   * Simulates a complete 'space' key press by firing a `keydown` keyboard event,
   * followed by an asynchronous `keyup` event on a specific node.
   *
   * @param {HTMLElement} target The node to fire the event on.
   */
  function pressSpace(target) {
    pressAndReleaseKeyOn(target, 32);
  }

  global.MockInteractions = {
    focus: focus,
    blur: blur,
    down: down,
    up: up,
    downAndUp: downAndUp,
    tap: tap,
    track: track,
    pressAndReleaseKeyOn: pressAndReleaseKeyOn,
    pressEnter: pressEnter,
    pressSpace: pressSpace,
    keyDownOn: keyDownOn,
    keyUpOn: keyUpOn,
    keyEventOn: keyEventOn,
    middleOfNode: middleOfNode,
    topLeftOfNode: topLeftOfNode
  };
})(this);
