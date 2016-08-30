function ArrayDataSource(arr) {
  function _filter(items, filter) {
    if (filter.length === 0) {
      return items;
    }

    return Array.prototype.filter.call(items, function(item, index) {
      for (var i = 0; i < filter.length; i++) {
        var value = Polymer.Base.get(filter[i].path, item);
        if (!filter[i].filter) {
          continue;
        } else if (!value || value.toString().toLowerCase().indexOf(filter[i].filter.toString().toLowerCase()) === -1) {
          return false;
        }
      }
      return true;
    });
  }

  function _compare(a, b) {
    if (a < b) {
      return -1;
    }
    if (a > b) {
      return 1;
    }
    return 0;
  }

  function _sort(items, sortOrder) {
    if (!sortOrder || sortOrder.length === 0) {
      return items;
    }

    var multiSort = function() {
      return function(a, b) {
        return sortOrder.map(function(sort) {
          if (sort.direction === 'asc') {
            return _compare(Polymer.Base.get(sort.path, a), Polymer.Base.get(sort.path, b));
          } else if (sort.direction === 'desc') {
            return _compare(Polymer.Base.get(sort.path, b), Polymer.Base.get(sort.path, a));
          }
          return 0;
        }).reduce(function firstNonZeroValue(p, n) {
          return p ? p : n;
        }, 0);
      };
    };

    // make sure a copy is used so that original array is unaffected.
    return Array.prototype.sort.call(items.slice(0), multiSort(sortOrder));
  }

  return function(opts, cb, err) {
    var filteredItems = _filter(arr, opts.filter);

    var sortedItems = _sort(filteredItems, opts.sortOrder);

    var start = opts.page * opts.pageSize;
    var end = start + opts.pageSize;
    var slice = sortedItems.slice(start, end);

    cb(slice, filteredItems.length);
  };
}
