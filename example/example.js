import draggle from '..';

const sortable = $('sortable');

draggle([$('left-defaults'), $('right-defaults')]);
draggle([$('left-transform-offset'), $('right-transform-offset')], { transformOffset: ({ left, top }) => ({ left: left + Math.random() * 200 - 100, top: top + Math.random() * 200 - 100 }) });
draggle([$('left-copy'), $('right-copy')], { copy: true });
draggle([$('left-events'), $('right-events')])
  .on('drag', function (el) {
    el.className = el.className.replace('ex-moved', '');
  })
  .on('drop', function (el) {
    el.className += ' ex-moved';
  })
  .on('over', function (el, container) {
    container.className += ' ex-over';
  })
  .on('out', function (el, container) {
    container.className = container.className.replace('ex-over', '');
  });
draggle([$('left-rollbacks'), $('right-rollbacks')], { revertOnSpill: true });
draggle([$('left-lovehandles'), $('right-lovehandles')], {
  moves: function (el, container, handle) {
    return handle.classList.contains('handle');
  }
});

draggle([$('left-rm-spill'), $('right-rm-spill')], { removeOnSpill: true });
draggle([$('left-copy-1tomany'), $('right-copy-1tomany')], {
  copy: function (el, source) {
    return source === $('left-copy-1tomany');
  },
  accepts: function (el, target) {
    return target !== $('left-copy-1tomany');
  }
});

draggle([sortable]);

sortable.addEventListener('click', clickHandler);

function clickHandler (e) {
  const target = e.target;
  if (target === sortable) {
    return;
  }
  target.innerHTML += ' [click!]';

  setTimeout(function () {
    target.innerHTML = target.innerHTML.replace(/ \[click!\]/g, '');
  }, 500);
}

function $ (id) {
  return document.getElementById(id);
}
