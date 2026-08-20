(function exposeManagerAccessModel(root, factory) {
  "use strict";

  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.SentieriManagerAccessModel = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function createManagerAccessModel() {
  "use strict";

  const ACTIVE_BOOKING_STATUSES = new Set(["confermata", "trattenuta"]);
  const ACCESS_KINDS = new Set(["free", "limited", "closed", "unconfigured"]);

  function pad(value) {
    return String(value).padStart(2, "0");
  }

  function dateKey(year, monthIndex, day) {
    return `${year}-${pad(monthIndex + 1)}-${pad(day)}`;
  }

  function accessKey(trailId, mode, date) {
    return `${trailId}|${mode}|${date}`;
  }

  function daysInMonth(year, monthIndex) {
    return new Date(year, monthIndex + 1, 0).getDate();
  }

  function normalizeAccessEntry(entry) {
    const kind = ACCESS_KINDS.has(entry?.kind) ? entry.kind : "unconfigured";
    const capacityValue = Number.parseInt(entry?.capacity, 10);
    const capacity = kind === "limited" && Number.isFinite(capacityValue) && capacityValue >= 0
      ? capacityValue
      : null;
    const serverBooked = Number.isFinite(Number(entry?.serverBooked)) ? Math.max(0, Number(entry.serverBooked)) : null;
    return serverBooked === null ? { kind, capacity } : { kind, capacity, serverBooked };
  }

  function bookingsForDay(bookings, trailId, mode, date, includeCancelled = true) {
    return (Array.isArray(bookings) ? bookings : []).filter((booking) => (
      booking.trailId === trailId
      && booking.mode === mode
      && booking.date === date
      && (includeCancelled || ACTIVE_BOOKING_STATUSES.has(booking.status))
    ));
  }

  function bookedUnits(bookings, trailId, mode, date) {
    return bookingsForDay(bookings, trailId, mode, date, false)
      .reduce((total, booking) => total + Math.max(0, Number.parseInt(booking.quantity, 10) || 0), 0);
  }

  function availabilityForDay(entry, bookings, trailId, mode, date) {
    const normalized = normalizeAccessEntry(entry);
    const booked = normalized.serverBooked ?? bookedUnits(bookings, trailId, mode, date);
    if (normalized.kind !== "limited") {
      return {
        ...normalized,
        booked,
        remaining: null,
        soldOut: false,
        overbooked: false
      };
    }
    const remaining = Math.max(0, normalized.capacity - booked);
    return {
      ...normalized,
      booked,
      remaining,
      soldOut: remaining === 0,
      overbooked: booked > normalized.capacity
    };
  }

  function monthSummary(state, trailId, mode, year, monthIndex) {
    const summary = {
      limitedDays: 0,
      booked: 0,
      remaining: 0,
      soldOutDays: 0
    };
    const count = daysInMonth(year, monthIndex);
    for (let day = 1; day <= count; day += 1) {
      const date = dateKey(year, monthIndex, day);
      const entry = state?.calendar?.[accessKey(trailId, mode, date)];
      const availability = availabilityForDay(entry, state?.bookings, trailId, mode, date);
      if (availability.kind !== "limited") continue;
      summary.limitedDays += 1;
      summary.booked += availability.booked;
      summary.remaining += availability.remaining;
      if (availability.soldOut) summary.soldOutDays += 1;
    }
    return summary;
  }

  return {
    ACTIVE_BOOKING_STATUSES,
    accessKey,
    availabilityForDay,
    bookedUnits,
    bookingsForDay,
    dateKey,
    daysInMonth,
    monthSummary,
    normalizeAccessEntry
  };
});
