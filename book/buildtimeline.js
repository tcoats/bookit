// Generated by CoffeeScript 1.10.0
var chrono, moment, simpledate;

moment = require('moment-timezone');

chrono = require('chronological');

moment = chrono(moment);

simpledate = 'YYYY-MM-DD';

module.exports = function(events) {
  var d, date, day, e, i, id, len, ref, timeline, today;
  timeline = {};
  today = moment().startOf('d');
  for (id in events) {
    e = events[id];
    ref = today.every(1, 'd').between(moment(e.start).add(1, 's'), moment(e.end));
    for (i = 0, len = ref.length; i < len; i++) {
      d = ref[i];
      date = d.format(simpledate);
      if (timeline[date] == null) {
        timeline[date] = {
          ids: {}
        };
      }
      timeline[date].isduring = true;
      timeline[date].ids[id] = true;
    }
    if (timeline[e.start] == null) {
      timeline[e.start] = {
        ids: {}
      };
    }
    timeline[e.start].isstart = true;
    timeline[e.start].ids[id] = true;
    if (timeline[e.end] == null) {
      timeline[e.end] = {
        ids: {}
      };
    }
    timeline[e.end].isend = true;
    timeline[e.end].ids[id] = true;
  }
  for (d in timeline) {
    day = timeline[d];
    day.isstart = !day.isduring && day.isstart;
    day.isend = !day.isduring && day.isend;
    day.isduring = day.isduring;
    delete day.count;
    day.ids = Object.keys(day.ids);
  }
  return timeline;
};
