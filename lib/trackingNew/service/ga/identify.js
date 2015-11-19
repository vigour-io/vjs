module.exports = function(identify) {
  var opts = this.options;

  if (opts.sendUserId && identify.userId()) {
    window.ga('set', 'userId', identify.userId());
  }

  // Set dimensions
  var custom = metrics(user.traits(), opts);
  if (len(custom)) window.ga('set', custom);
}
