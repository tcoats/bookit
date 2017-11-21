// Generated by CoffeeScript 1.10.0
var chrono, component, dom, moment, ref, simpledate;

ref = require('odojs'), component = ref.component, dom = ref.dom;

moment = require('moment-timezone');

chrono = require('chronological');

moment = chrono(moment);

simpledate = 'YYYY-MM-DD';

module.exports = component({
  render: function(state, params, hub) {
    var beforeMonth, days, months, select, startOfMonth, today;
    today = moment().startOf('d');
    startOfMonth = today.clone().startOf('M');
    months = startOfMonth.every(1, 'M');
    beforeMonth = startOfMonth.clone().subtract(1, 's');
    days = months.between(beforeMonth, startOfMonth.clone().add(6, 'M'));
    select = function(date) {
      return function(e) {
        e.preventDefault();
        return hub.emit('select', date);
      };
    };
    return dom('.astro', days.map(function(month) {
      var beforeStart, end, i, j, ref1, selectedDate, start, weeks;
      start = month.clone().startOf('isoWeek');
      beforeStart = start.clone().subtract(1, 's');
      end = month.clone().endOf('month').endOf('isoWeek');
      days = start.every(1, 'd');
      days = days.between(beforeStart, end);
      selectedDate = null;
      if (params.selectedDate != null) {
        selectedDate = moment(params.selectedDate);
      }
      weeks = [];
      for (i = j = 0, ref1 = days.length / 7; 0 <= ref1 ? j < ref1 : j > ref1; i = 0 <= ref1 ? ++j : --j) {
        weeks.push(days.slice(i * 7, (i + 1) * 7));
      }
      return [
        dom('.astro-header', dom('h2', month.format('MMMM YYYY'))), dom('.astro-month', weeks.map(function(week) {
          return dom('.astro-week', week.map(function(d) {
            var date, day, isselected, isselectedend, isselectedstart, ref10, ref11, ref12, ref13, ref14, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9;
            date = d.format(simpledate);
            day = state.bookings.timeline[date];
            if (day == null) {
              day = {
                isstart: false,
                isduring: false,
                isend: false,
                ids: []
              };
            }
            isselectedstart = (ref2 = params.selectedRange) != null ? (ref3 = ref2.start) != null ? ref3.isSame(d) : void 0 : void 0;
            isselectedend = (ref4 = params.selectedRange) != null ? (ref5 = ref4.end) != null ? ref5.isSame(d) : void 0 : void 0;
            isselected = ((ref6 = params.selectedRange) != null ? (ref7 = ref6.start) != null ? ref7.isBefore(d) : void 0 : void 0) && ((ref8 = params.selectedRange) != null ? (ref9 = ref8.end) != null ? ref9.isAfter(d) : void 0 : void 0);
            if (((ref10 = params.selectedRange) != null ? (ref11 = ref10.start) != null ? ref11.isSame(d) : void 0 : void 0) && ((ref12 = params.selectedRange) != null ? (ref13 = ref12.start) != null ? ref13.isSame((ref14 = params.selectedRange) != null ? ref14.end : void 0) : void 0 : void 0)) {
              isselectedstart = false;
              isselectedend = false;
              isselected = true;
            }
            if (!d.isSame(month, 'month')) {
              return dom('.day.empty', dom('span', d.format('D')));
            }
            if ((selectedDate != null) && selectedDate.isSame(d, 'day')) {
              return dom("a.day.selected" + (isselectedstart || isselectedend || isselected ? '.selected-during' : '') + (day.isstart || day.isend || day.isduring ? '.during' : ''), {
                onclick: select(d),
                attributes: {
                  href: '#'
                }
              }, [dom('span', d.format('D')), dom('div', d.format('D'))]);
            }
            return dom("a.day" + (d.isBefore(today) ? '.past' : '') + (day.isstart ? '.start' : day.isend ? '.end' : day.isduring ? '.during' : '') + (isselectedstart ? '.selected-start' : isselectedend ? '.selected-end' : isselected ? '.selected-during' : ''), {
              onclick: select(d),
              attributes: {
                href: '#'
              }
            }, dom('span', d.format('D')));
          }));
        }))
      ];
    }));
  }
});
