// Address of the Budget Manager app. Set this once and every form and the calendar use it.
// e.g. window.UWA_API = "https://uwa-aerospace-budget.vercel.app";
// Leave empty: forms open the visitor's email app instead, and the calendar says dates are coming.
window.UWA_API = "https://budget-manager-two-blond.vercel.app";

window.uwaPost = function (path, data) {
  var base = (window.UWA_API || "").replace(/\/$/, "");
  if (!base) return Promise.resolve({ ok: false, offline: true });
  return fetch(base + path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
    .then(function (r) { return r.json().then(function (d) { return { ok: r.ok && d.ok, error: d.error }; }); })
    .catch(function () { return { ok: false, error: "" }; });
};
