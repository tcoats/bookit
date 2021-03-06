// Generated by CoffeeScript 1.10.0
var baby, buildtimeline, chrono, config, fs, ical, moment, readbookings, shortid, simpledate, writebookings;

fs = require('fs');

baby = require('babyparse');

shortid = require('shortid');

moment = require('moment-timezone');

chrono = require('chronological');

moment = chrono(moment);

simpledate = 'YYYY-MM-DD';

buildtimeline = require('./buildtimeline');

ical = require('ical-generator');

config = require('../config');

readbookings = function(cb) {
  return fs.readFile('./data/bookings.csv', 'utf-8', function(err, data) {
    var i, j, len, len1, r, ref, ref1, res, rows, t, tags;
    if (err != null) {
      return cb(err);
    }
    rows = baby.parse(data, {
      header: true,
      skipEmptyLines: true
    });
    res = {};
    ref = rows.data;
    for (i = 0, len = ref.length; i < len; i++) {
      r = ref[i];
      if ((r.tags != null) && r.tags.trim() !== '') {
        tags = {};
        ref1 = r.tags.split(',');
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          t = ref1[j];
          tags[t] = true;
        }
        r.tags = tags;
      } else {
        r.tags = {};
      }
      res[r.id] = r;
    }
    return cb(null, res);
  });
};

writebookings = function(events, cb) {
  var cal, e, i, len;
  events = Object.keys(events).map(function(id) {
    return events[id];
  });
  for (i = 0, len = events.length; i < len; i++) {
    e = events[i];
    if (e.tags != null) {
      e.tags = Object.keys(e.tags).join(',');
    } else {
      e.tags = null;
    }
  }
  cal = ical({
    domain: config.domain,
    name: config.title,
    timezone: config.timezone,
    prodId: {
      company: config.company,
      product: config.product
    }
  });
  cal.events(events.map(function(e) {
    return {
      start: moment(e.start).add(14, 'h').toDate(),
      end: moment(e.end).add(10, 'h').toDate(),
      summary: e.name
    };
  }));
  return cal.save('./data/bookings.ics', function(err) {
    if (err != null) {
      return cb(err);
    }
    return fs.writeFile('./data/bookings.csv', baby.unparse(events), cb);
  });
};

module.exports = function(app) {
  app.post('/v0/addbooking', function(req, res) {
    return readbookings(function(err, events) {
      var id;
      id = shortid.generate();
      events[id] = {
        id: id,
        name: req.body.name,
        start: req.body.start,
        end: req.body.end,
        tags: req.body.tags
      };
      return writebookings(events, function(err) {
        if (err != null) {
          if (err.stack != null) {
            console.error(err.stack);
          } else {
            console.error(err);
          }
          return res.status(500).send(err);
        }
        return res.send({
          id: id
        });
      });
    });
  });
  app.post('/v0/deletebooking', function(req, res) {
    return readbookings(function(err, events) {
      delete events[req.body.id];
      return writebookings(events, function(err) {
        if (err != null) {
          if (err.stack != null) {
            console.error(err.stack);
          } else {
            console.error(err);
          }
          return res.status(500).send(err);
        }
        return res.send({
          id: req.body.id
        });
      });
    });
  });
  return app.post('/v0/changebooking', function(req, res) {
    return readbookings(function(err, events) {
      var booking;
      if (events[req.body.id] == null) {
        return res.status(400).send('Booking not found');
      }
      booking = events[req.body.id];
      booking.name = req.body.name;
      booking.start = req.body.start;
      booking.end = req.body.end;
      booking.tags = req.body.tags;
      return writebookings(events, function(err) {
        if (err != null) {
          if (err.stack != null) {
            console.error(err.stack);
          } else {
            console.error(err);
          }
          return res.status(500).send(err);
        }
        return res.send({
          id: req.body.id
        });
      });
    });
  });
};

module.exports.query = function(req, store) {
  store.use('bookings', function(params, cb) {
    return readbookings(function(err, events) {
      var timeline;
      if (err != null) {
        return cb(err);
      }
      timeline = buildtimeline(events);
      return cb(null, {
        events: events,
        timeline: timeline
      });
    });
  });
  return store.use('config', function(params, cb) {
    return cb(null, config);
  });
};
